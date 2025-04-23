// Newsletter subscription handler
function handleSubscribe(event) {
  event.preventDefault();
  const email = document.getElementById('newsletterEmail').value;
  const encodedEmail = encodeURIComponent(email);
  window.open(`https://vandipety.substack.com/subscribe?just_signed_up=true&skip_redirect_check=true&utm_medium=web&utm_source=embed&freeSignupEmail=${encodedEmail}`, '_blank');
}

// Funzione per caricare Fuse.js
function loadFuse() {
  return new Promise((resolve, reject) => {
    if (window.Fuse) {
      resolve(window.Fuse);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/fuse.js@6.6.2';
    script.onload = () => resolve(window.Fuse);
    script.onerror = () => reject(new Error('Errore nel caricamento di Fuse.js'));
    document.head.appendChild(script);
  });
}

// Funzione per la ricerca in tempo reale
function setupRealTimeSearch() {
  const searchInput = document.getElementById('search-query');
  if (!searchInput) return; // Se non c'è il campo di ricerca, esci

  const searchResults = document.createElement('div');
  searchResults.className = 'search-results';
  searchResults.style.cssText = 'position: absolute; top: 100%; left: 0; right: 0; background: white; border: 1px solid #ddd; z-index: 9999; max-height: 300px; overflow-y: auto; display: none;';
  searchInput.parentNode.appendChild(searchResults);

  let searchTimeout;
  let fuse;
  let currentQuery = '';

  // Ottieni l'URL base del sito
  function getBaseURL() {
    // Usa sempre la root del sito
    return '/';
  }

  const baseURL = getBaseURL();
  const indexURL = baseURL + 'index.json';

  // Pulisci l'input quando si apre la ricerca
  document.querySelectorAll('.toggle-search').forEach(button => {
    button.addEventListener('click', function() {
      if (document.getElementById('search-wrap').classList.contains('active')) {
        searchInput.value = '';
        searchResults.style.display = 'none';
        currentQuery = '';
        // Resetta lo scroll dei risultati
        const resultsList = searchResults.querySelector('.search-results-list');
        if (resultsList) {
          resultsList.scrollTop = 0;
        }
        // Resetta lo scroll del menu di ricerca
        const searchWrap = document.getElementById('search-wrap');
        if (searchWrap) {
          searchWrap.scrollTop = 0;
        }
      }
    });
  });

  // Carica Fuse.js e poi l'indice di ricerca
  loadFuse()
    .then(Fuse => {
      // Carica l'indice di ricerca
      return fetch(indexURL)
        .then(response => {
          if (!response.ok) {
            throw new Error('Errore nel caricamento dell\'indice di ricerca');
          }
          return response.json();
        })
        .then(data => {
          // Configura Fuse.js con più opzioni di ricerca
          const options = {
            keys: [
              { name: 'title', weight: 0.7 },
              { name: 'content', weight: 0.3 },
              { name: 'description', weight: 0.2 },
              { name: 'country', weight: 0.5 },
              { name: 'categories', weight: 0.4 }
            ],
            threshold: 0.4,
            distance: 100,
            includeScore: true,
            minMatchCharLength: 2
          };
          fuse = new Fuse(data, options);
          console.log('Indice di ricerca caricato con successo da:', indexURL);
        });
    })
    .catch(error => {
      console.error('Errore nel caricamento:', error);
      searchResults.innerHTML = '<div class="search-result-item">Errore nel caricamento della ricerca</div>';
    });

  // Resetta lo scroll quando si cancella l'input
  searchInput.addEventListener('input', function() {
    clearTimeout(searchTimeout);
    const query = this.value.trim();
    currentQuery = query;
    
    if (query.length < 2) {
      searchResults.style.display = 'none';
      // Resetta lo scroll quando si cancella l'input
      const resultsList = searchResults.querySelector('.search-results-list');
      if (resultsList) {
        resultsList.scrollTop = 0;
      }
      return;
    }

    searchTimeout = setTimeout(() => {
      if (!fuse) {
        searchResults.innerHTML = '<div class="search-result-item">Caricamento della ricerca in corso...</div>';
        searchResults.style.display = 'block';
        return;
      }

      const results = fuse.search(query);
      if (results.length > 0) {
        const maxResults = 5; // Numero massimo di risultati da mostrare
        const limitedResults = results.slice(0, maxResults);
        
        searchResults.innerHTML = `
          <div class="search-results-list">
            ${limitedResults.map(result => {
              const item = result.item;
              const title = item.title || 'Senza titolo';
              const permalink = item.permalink || '#';
              const content = item.content || item.description || '';
              const country = item.country || '';
              const categories = item.categories || [];
              const image = item.image || '';
              
              // Crea l'excerpt dal contenuto
              let excerpt = '';
              if (content) {
                // Trova la posizione della query nel contenuto
                const queryLower = query.toLowerCase();
                const contentLower = content.toLowerCase();
                const pos = contentLower.indexOf(queryLower);
                
                if (pos !== -1) {
                  // Prendi 75 caratteri prima e dopo la query
                  const start = Math.max(0, pos - 75);
                  const end = Math.min(content.length, pos + query.length + 75);
                  excerpt = content.substring(start, end);
                  if (start > 0) excerpt = '...' + excerpt;
                  if (end < content.length) excerpt += '...';
                } else {
                  excerpt = content.substring(0, 150) + '...';
                }
              }
              
              return `
                <div class="search-result-item">
                  <a href="${permalink}">
                    <div class="search-result-content">
                      ${image ? `<div class="search-result-image"><img src="${image}" alt="${title}" loading="lazy"></div>` : ''}
                      <div class="search-result-text">
                        <div class="title">${title}</div>
                        ${country ? `<div class="country"><i class="fas fa-map-marker-alt"></i> ${country}</div>` : ''}
                        ${categories.length > 0 ? `<div class="categories">${categories.map(cat => `<span class="badge">${cat}</span>`).join(' ')}</div>` : ''}
                        ${excerpt ? `<div class="excerpt">${excerpt}</div>` : ''}
                      </div>
                    </div>
                  </a>
                </div>
              `;
            }).join('')}
          </div>
          ${results.length > maxResults ? `
            <div class="search-more-results">
              <a href="/search/?s=${encodeURIComponent(query)}">Mostra altri ${results.length - maxResults} risultati</a>
            </div>
          ` : ''}
        `;
        
        searchResults.style.display = 'block';
        // Resetta lo scroll dopo aver mostrato i risultati
        const resultsList = searchResults.querySelector('.search-results-list');
        console.log('reset');
        if (resultsList) {
          resultsList.scrollTop = 0;
        }
      } else {
        searchResults.innerHTML = '<div class="search-result-item">Nessun risultato trovato</div>';
        searchResults.style.display = 'block';
      }
    }, 300);
  });

  // Chiudi i risultati quando si clicca fuori
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.search-bar')) {
      searchResults.style.display = 'none';
    }
  });
}

// Add event listener when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const newsletterForm = document.querySelector('.newsletter-widget form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', handleSubscribe);
  }

  // Toggle search box
  const toggleSearch = document.querySelectorAll('.toggle-search');
  const searchWrap = document.getElementById('search-wrap');

  toggleSearch.forEach(function(button) {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const target = this.dataset.target;
      const element = document.querySelector(target);
      if (element) {
        element.classList.toggle('active');
        if (element.classList.contains('active')) {
          element.querySelector('input').focus();
        }
      }
    });
  });

  // Close search box when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('#search-wrap') && !e.target.closest('.toggle-search')) {
      if (searchWrap && searchWrap.classList.contains('active')) {
        searchWrap.classList.remove('active');
      }
    }
  });

  // Handle search form submission
  const searchForm = document.getElementById('search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      const searchQuery = document.getElementById('search-query').value.trim();
      if (!searchQuery) {
        e.preventDefault();
      }
    });
  }

  // Setup real-time search
  setupRealTimeSearch();
});