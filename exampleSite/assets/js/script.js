// Guide Slider
function initGuidesSlider() {
  const guidesWrapper = document.querySelector('.guides-wrapper');
  const guideSlides = document.querySelectorAll('.guide-slide');
  const prevButton = document.querySelector('.nav-button.prev');
  const nextButton = document.querySelector('.nav-button.next');
  
  if (!guidesWrapper || !guideSlides.length || !prevButton || !nextButton) return;

  let currentSlide = 0;
  const totalSlides = guideSlides.length;
  let autoplayInterval;
  let touchStartX = 0;
  let touchEndX = 0;
  const swipeThreshold = 50; // Soglia minima per considerare uno swipe

  // Funzione per caricare le immagini
  function loadImages() {
    const images = document.querySelectorAll('.slide-image[data-src]');
    images.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
    });
  }

  // Funzione per aggiornare lo slider
  function updateSlider() {
    const offset = -currentSlide * 100;
    guidesWrapper.style.transform = `translateX(${offset}%)`;
    
    // Aggiorna lo stato dei pulsanti
    prevButton.disabled = currentSlide === 0;
    nextButton.disabled = currentSlide === totalSlides - 1;
  }

  // Funzione per passare alla slide successiva
  function nextSlide() {
    if (currentSlide < totalSlides - 1) {
      currentSlide++;
    } else {
      currentSlide = 0;
    }
    updateSlider();
  }

  // Funzione per passare alla slide precedente
  function prevSlide() {
    if (currentSlide > 0) {
      currentSlide--;
    } else {
      currentSlide = totalSlides - 1;
    }
    updateSlider();
  }

  // Funzione per avviare l'autoplay
  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 5000);
  }

  // Funzione per fermare l'autoplay
  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  // Gestione degli eventi touch
  guidesWrapper.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
  });

  guidesWrapper.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    startAutoplay();
  });

  // Funzione per gestire lo swipe
  function handleSwipe() {
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe verso sinistra
        nextSlide();
      } else {
        // Swipe verso destra
        prevSlide();
      }
    }
  }

  // Event listeners per i pulsanti
  prevButton.addEventListener('click', () => {
    stopAutoplay();
    prevSlide();
    startAutoplay();
  });

  nextButton.addEventListener('click', () => {
    stopAutoplay();
    nextSlide();
    startAutoplay();
  });

  // Event listeners per il mouse
  guidesWrapper.addEventListener('mouseenter', stopAutoplay);
  guidesWrapper.addEventListener('mouseleave', startAutoplay);

  // Carica le immagini e inizializza lo slider
  loadImages();
  updateSlider();
  startAutoplay();
}

// Funzione per inizializzare tutto il codice che dipende da Bootstrap
function initBootstrapDependentCode() {
  // Gestione del menu mobile
  const toggleSideNav = document.querySelector('.toggle-side-nav');
  const offcanvas = document.getElementById('offcanvasRight');
  
  if (toggleSideNav && offcanvas) {
    const offcanvasBackdrop = document.createElement('div');
    offcanvasBackdrop.className = 'offcanvas-backdrop fade';
    document.body.appendChild(offcanvasBackdrop);

    // Gestione del click e del touch sul pulsante di apertura
    toggleSideNav.addEventListener('click', function(e) {
      e.preventDefault();
      openMenu();
    });
    toggleSideNav.addEventListener('touchstart', function(e) {
      e.preventDefault();
      openMenu();
    });

    // Gestione del pulsante di chiusura
    const closeButton = offcanvas.querySelector('.btn-close');
    if (closeButton) {
      closeButton.addEventListener('click', function(e) {
        e.preventDefault();
        closeMenu();
      });
      closeButton.addEventListener('touchstart', function(e) {
        e.preventDefault();
        closeMenu();
      });
    }

    // Gestione del click sul backdrop
    offcanvasBackdrop.addEventListener('click', closeMenu);
    offcanvasBackdrop.addEventListener('touchstart', closeMenu);

    // Gestione del tasto ESC
    document.addEventListener('keydown', handleEscape);
  }

  // Accordions
  const collapses = document.querySelectorAll('.collapse');
  collapses.forEach(collapse => {
    collapse.addEventListener('shown.bs.collapse', function() {
      const parent = this.parentElement;
      const plusIcon = parent.querySelector('.fas.fa-plus');
      if (plusIcon) {
        plusIcon.classList.remove('fas', 'fa-plus');
        plusIcon.classList.add('fas', 'fa-minus');
      }
    });

    collapse.addEventListener('hidden.bs.collapse', function() {
      const parent = this.parentElement;
      const minusIcon = parent.querySelector('.fas.fa-minus');
      if (minusIcon) {
        minusIcon.classList.remove('fas', 'fa-minus');
        minusIcon.classList.add('fas', 'fa-plus');
      }
    });
  });
}

// Funzione per inizializzare il codice indipendente da Bootstrap
function initIndependentCode() {
  // Preloader
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    preloader.style.display = 'none';
  }

  // Inizializza lo slider delle guide
  initGuidesSlider();

  // search-toggle
  const toggleSearchButtons = document.querySelectorAll('.toggle-search');
  toggleSearchButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      if (targetId) {
        const searchBar = document.querySelector(targetId);
        if (searchBar) {
          searchBar.classList.toggle('open');
          const searchInput = document.getElementById('search-query');
          if (searchInput) {
            // Assicurati che l'input sia visibile
            searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Forza il focus e l'apertura della tastiera
            searchInput.focus();
            searchInput.click();
            
            // Crea e dispa un evento di input per forzare l'apertura della tastiera
            const inputEvent = new Event('input', { bubbles: true });
            searchInput.dispatchEvent(inputEvent);
            
            // Forza il focus dopo un breve ritardo per assicurarsi che funzioni
            setTimeout(() => {
              searchInput.focus();
              searchInput.click();
              // Aggiungi un carattere temporaneo e rimuovilo per forzare l'apertura della tastiera
              searchInput.value = ' ';
              setTimeout(() => {
                searchInput.value = '';
              }, 10);
            }, 50);
          }
        }
      }
    });
    
    // Aggiungo l'evento touch
    button.addEventListener('touchstart', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('data-target');
      if (targetId) {
        const searchBar = document.querySelector(targetId);
        if (searchBar) {
          searchBar.classList.toggle('open');
          const searchInput = document.getElementById('search-query');
          if (searchInput) {
            // Assicurati che l'input sia visibile
            searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Forza il focus e l'apertura della tastiera
            searchInput.focus();
            searchInput.click();
            
            // Crea e dispa un evento di input per forzare l'apertura della tastiera
            const inputEvent = new Event('input', { bubbles: true });
            searchInput.dispatchEvent(inputEvent);
            
            // Forza il focus dopo un breve ritardo per assicurarsi che funzioni
            setTimeout(() => {
              searchInput.focus();
              searchInput.click();
              // Aggiungi un carattere temporaneo e rimuovilo per forzare l'apertura della tastiera
              searchInput.value = ' ';
              setTimeout(() => {
                searchInput.value = '';
              }, 10);
            }, 50);
          }
        }
      }
    });
  });

  // tab
  const tabContents = document.querySelectorAll('.tab-content .tab-pane');
  tabContents.forEach(tabPane => {
    const title = tabPane.getAttribute('title');
    const codeTabs = tabPane.closest('.code-tabs');
    if (codeTabs) {
      const navTabs = codeTabs.querySelector('.nav-tabs');
      if (navTabs) {
        const navItem = document.createElement('li');
        navItem.className = 'nav-item';
        const navLink = document.createElement('a');
        navLink.className = 'nav-link';
        navLink.href = '#';
        navLink.textContent = title;
        navItem.appendChild(navLink);
        navTabs.appendChild(navItem);
      }
    }
  });

  // Attiva il primo tab
  const codeTabs = document.querySelectorAll('.code-tabs');
  codeTabs.forEach(tab => {
    const firstNavItem = tab.querySelector('.nav-tabs li:first-child');
    const firstTabPane = tab.querySelector('.tab-content div:first-child');
    if (firstNavItem) firstNavItem.classList.add('active');
    if (firstTabPane) firstTabPane.classList.add('active');
  });

  // Gestione click sui tab
  const navTabs = document.querySelectorAll('.nav-tabs a');
  navTabs.forEach(tab => {
    tab.addEventListener('click', function(e) {
      e.preventDefault();
      const parentTab = this.parentElement;
      const tabIndex = Array.from(parentTab.parentElement.children).indexOf(parentTab);
      const tabPanel = this.closest('.code-tabs');
      const tabPane = tabPanel.querySelectorAll('.tab-pane')[tabIndex];

      tabPanel.querySelectorAll('.active').forEach(el => el.classList.remove('active'));
      parentTab.classList.add('active');
      tabPane.classList.add('active');
    });
  });
}

//=================== Cache Management ===================
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24 ore in millisecondi

function getCachedData(key) {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_EXPIRATION) {
        localStorage.removeItem(key);
        return null;
    }
    return data;
}

function setCachedData(key, data) {
    const cacheData = {
        data,
        timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
}

// Funzione per precaricare tutti i dati necessari
async function preloadAllData() {
    const endpoints = [
        { key: 'expenses', url: `${rpcUrl}/sw/getSpeseAnno` },
        { key: 'category', url: `${rpcUrl}/sw/getSpesePerCategoria` },
        { key: 'monthly', url: `${rpcUrl}/sw/getSpesePerMese` },
        { key: 'grid', url: `${rpcUrl}/sw/getSpese` },
        { key: 'trip', url: `${rpcUrl}/data/trip` },
        { key: 'map', url: `${rpcUrl}/data/map` },
        { key: 'cities', url: `${rpcUrl}/data/ru_it` },
        { key: 'press', url: `${rpcUrl}/data/press` }
    ];

    // Carica i dati solo se non sono già in cache
    for (const endpoint of endpoints) {
        if (!getCachedData(endpoint.key)) {
            try {
                const response = await fetch(endpoint.url);
                const data = await response.json();
                setCachedData(endpoint.key, data);
            } catch (error) {
                console.error(`Errore nel precaricamento dei dati per ${endpoint.key}:`, error);
            }
        }
    }
}

// Modifica delle funzioni di fetch esistenti
async function fecthExpenseData() {
    const cached = getCachedData('expenses');
    if (cached) {
        processExpenseData(cached.json);
        return cached;
    }
    
    try {
        const response = await fetch(`${rpcUrl}/sw/getSpeseAnno`);
        const data = await response.json();
        setCachedData('expenses', data);
        processExpenseData(data.json);
        return data;
    } catch (error) {
        console.error('Error fetching SW data:', error);
    }
}

async function fecthChartCategoryData() {
    const cached = getCachedData('category');
    if (cached) {
        setChartCategory(cached);
        return cached;
    }
    
    try {
        const response = await fetch(`${rpcUrl}/sw/getSpesePerCategoria`);
        const data = await response.json();
        setCachedData('category', data);
        setChartCategory(data);
        return data;
    } catch (error) {
        console.error('Error fetching SW data:', error);
    }
}

async function fecthChartMonthlyData() {
    const cached = getCachedData('monthly');
    if (cached) {
        setChartMonthly(cached);
        return cached;
    }
    
    try {
        const response = await fetch(`${rpcUrl}/sw/getSpesePerMese`);
        const data = await response.json();
        setCachedData('monthly', data);
        setChartMonthly(data);
        return data;
    } catch (error) {
        console.error('Error fetching SW data:', error);
    }
}

async function fecthGridData() {
    const cached = getCachedData('grid');
    if (cached) {
        setGrid(cached);
        return cached;
    }
    
    try {
        const response = await fetch(`${rpcUrl}/sw/getSpese`);
        const data = await response.json();
        setCachedData('grid', data);
        setGrid(data);
        return data;
    } catch (error) {
        console.error('Error fetching SW data:', error);
    }
}

async function getTripData() {
    const cached = getCachedData('trip');
    if (cached) {
        setTripData(cached);
        return cached;
    }
    
    try {
        const response = await fetch(`${rpcUrl}/data/trip`);
        const data = await response.json();
        setCachedData('trip', data);
        setTripData(data);
        return data;
    } catch (error) {
        console.error('Error fetching trip data:', error);
    }
}

async function getMapData() {
    const cached = getCachedData('map');
    if (cached) {
        setMap(cached.json);
        return cached;
    }
    
    try {
        const response = await fetch(`${rpcUrl}/data/map`);
        const data = await response.json();
        setCachedData('map', data);
        setMap(data.json);
        return data;
    } catch (error) {
        console.error('Error fetching map data:', error);
    }
}

// Modifica della funzione di inizializzazione
document.addEventListener('DOMContentLoaded', function() {
    // Precarga i dati in background
    preloadAllData();
    
    // Inizializza il codice indipendente da Bootstrap
    initIndependentCode();

    // Inizializza il codice dipendente da Bootstrap
    if (typeof bootstrap !== 'undefined') {
        initBootstrapDependentCode();
    } else {
        // Se Bootstrap non è ancora caricato, aspettiamo che lo sia
        const checkBootstrap = setInterval(() => {
            if (typeof bootstrap !== 'undefined') {
                clearInterval(checkBootstrap);
                initBootstrapDependentCode();
            }
        }, 100);
    }
});

// Load more posts
const loadMoreButton = document.getElementById('loadMore');
if (loadMoreButton) {
  loadMoreButton.addEventListener('click', async function() {
    const nextUrl = this.dataset.nextUrl;
    if (!nextUrl) return;

    this.disabled = true;
    this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
    this.style.backgroundColor = '#15817f';

    try {
      const response = await fetch(nextUrl);
      const html = await response.text();
      const temp = document.createElement('div');
      temp.innerHTML = html;

      const newPosts = temp.querySelector('.row.mx-0.g-5');
      const currentPosts = document.querySelector('.row.mx-0.g-5');

      if (newPosts && currentPosts) {
        currentPosts.innerHTML += newPosts.innerHTML;
      }

      const newNextUrl = temp.querySelector('#loadMore')?.dataset.nextUrl;
      if (newNextUrl) {
        this.dataset.nextUrl = newNextUrl;
      } else {
        this.remove();
      }
    } catch (error) {
      console.error('Errore nel caricamento dei post:', error);
      this.innerHTML = 'Errore nel caricamento';
    } finally {
      this.disabled = false;
      this.innerHTML = 'Mostra altro';
      this.style.backgroundColor = '#15817f';
    }
  });
}

//=================== expanses script start ===================
const rpcUrl = "https://vandipetyapi.onrender.com"
const color = [ 'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(229, 122, 250, 1)',
                'rgba(32, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(102, 178, 255, 1)',
                'rgba(153, 153, 255, 1)',
                'rgba(204, 255, 204, 1)',
                'rgba(255, 153, 153, 1)'
]

//=================== AI Summary script start ===================
let summaryAnimationInterval;

// Funzione per creare l'elemento del riassunto
function createSummaryElement() {
  const articleContent = document.querySelector('.content.drop-cap');
  if (!articleContent) return null;

  const textContent = articleContent.textContent || articleContent.innerText;
  if (textContent.length < 1500) return null;

  // Controlla se esiste già un riassunto attivo
  const existingSummary = document.querySelector('.ai-summary-container:not(.ai-summary-placeholder .ai-summary-container)');
  if (existingSummary) return existingSummary;

  // Cerca il placeholder esistente
  const placeholder = document.querySelector('.ai-summary-placeholder');
  if (placeholder) {
    // Mostra il placeholder e rimuovi la classe loading
    placeholder.style.display = 'block';
    placeholder.style.height = 'auto';
    placeholder.style.overflow = 'visible';
    placeholder.classList.add('active');
    const container = placeholder.querySelector('.ai-summary-container');
    if (container) {
      // Ripristina gli stili del container
      container.style.margin = '';
      container.style.padding = '';
      container.style.minHeight = '';
      
      // Mostra header e content
      const header = container.querySelector('.ai-summary-header');
      const content = container.querySelector('.ai-summary-content');
      if (header) header.style.display = '';
      if (content) content.style.display = '';
      
      // Sposta il container dal placeholder alla posizione corretta
      const cardMeta = document.querySelector('ul.list-inline.card-meta');
      if (cardMeta) {
        cardMeta.parentNode.insertBefore(container, cardMeta.nextSibling);
      } else {
        // Fallback: inserisci dopo il titolo se i metadati non esistono
        const title = document.querySelector('h1.mb-4');
        if (title) {
          title.parentNode.insertBefore(container, title.nextSibling);
        } else {
          articleContent.parentNode.insertBefore(container, articleContent);
        }
      }
      
      // Rimuovi la classe loading dopo un breve delay per permettere il rendering
      setTimeout(() => {
        container.classList.remove('loading');
      }, 50);
      
      return container;
    }
  }

  // Fallback: crea un nuovo container se il placeholder non esiste
  const summaryContainer = document.createElement('div');
  summaryContainer.className = 'ai-summary-container loading';
  summaryContainer.setAttribute('data-ad-exclude', 'true');

  // Crea l'header del riassunto
  const summaryHeader = document.createElement('div');
  summaryHeader.className = 'ai-summary-header';
    summaryHeader.innerHTML = `
    <i class="fas fa-cat"></i>
    <span>Riassunto</span>
    <button class="ai-summary-toggle" style="opacity: 0;">
      <span class="toggle-arrow rotated"><i class="fas fa-chevron-right"></i></span><span class="button-text"> Comprimi</span>
    </button>
  `;

  // Crea il contenuto del riassunto
  const summaryContent = document.createElement('div');
  summaryContent.className = 'ai-summary-content';

  // Assembla il container (senza disclaimer per ora)
  summaryContainer.appendChild(summaryHeader);
  summaryContainer.appendChild(summaryContent);

  // Inserisci il riassunto dopo i metadati dell'articolo con animazione fluida
  const cardMeta = document.querySelector('ul.list-inline.card-meta');
  if (cardMeta) {
    cardMeta.parentNode.insertBefore(summaryContainer, cardMeta.nextSibling);
  } else {
    // Fallback: inserisci dopo il titolo se i metadati non esistono
    const title = document.querySelector('h1.mb-4');
    if (title) {
      title.parentNode.insertBefore(summaryContainer, title.nextSibling);
    } else {
      articleContent.parentNode.insertBefore(summaryContainer, articleContent);
    }
  }
  
  // Rimuovi la classe loading dopo un breve delay per permettere il rendering
  setTimeout(() => {
    summaryContainer.classList.remove('loading');
  }, 50);

  return summaryContainer;
}

// Funzione per l'animazione "sto riassumendo..."
function startSummaryAnimation(summaryContent) {
  const messages = [
    'Sto riassumendo',
    'Sto riassumendo .',
    'Sto riassumendo ..',
    'Sto riassumendo ...'
  ];
  let currentIndex = 0;

  // Animazione di entrata per il contenuto
  summaryContent.style.opacity = '0';
  summaryContent.style.transform = 'translateY(10px)';
  summaryContent.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  
  setTimeout(() => {
    summaryContent.style.opacity = '1';
    summaryContent.style.transform = 'translateY(0)';
  }, 100);

  summaryAnimationInterval = setInterval(() => {
    summaryContent.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${messages[currentIndex]}`;
    currentIndex = (currentIndex + 1) % messages.length;
  }, 500);
}

// Funzione per fermare l'animazione
function stopSummaryAnimation() {
  if (summaryAnimationInterval) {
    clearInterval(summaryAnimationInterval);
    summaryAnimationInterval = null;
  }
}

// Funzione per la scrittura in tempo reale
function typeWriter(element, html, speed = 15) {
  return new Promise((resolve) => {
    // Se contiene HTML, inseriscilo direttamente per preservare la formattazione
    if (html.includes('<') && html.includes('>')) {
      element.innerHTML = html;
      element.classList.remove('typing');
      resolve();
    } else {
      // Altrimenti usa l'effetto di scrittura carattere per carattere
      let i = 0;
      element.innerHTML = '';
      element.classList.add('typing');
      
      function type() {
        if (i < html.length) {
          element.innerHTML += html.charAt(i);
          i++;
          setTimeout(type, speed);
        } else {
          element.classList.remove('typing');
          resolve();
        }
      }
      
      type();
    }
  });
}

// Funzione per formattare il riassunto AI
function formatSummaryText(text) {
  console.log('Formattazione testo originale:', text);
  
  if (!text) return '';
  
  // Dividi il testo in righe
  const lines = text.split('\n').filter(line => line.trim());
  let formattedHtml = '';
  let hasLinks = false;
  
  lines.forEach(line => {
    const trimmedLine = line.trim();
    
    // Se la riga inizia con "- ", è un punto elenco
    if (trimmedLine.startsWith('- ')) {
      const content = trimmedLine.substring(2); // Rimuovi "- "
      
      // Controlla se contiene link
      const hasInternalLinks = /\[([^\]]+)\]\(([^)]+)\)/g.test(content);
      const hasExternalLinks = /\{\{< extLink "([^"]+)" "([^"]+)" >\}\}/g.test(content);
      
      if (hasInternalLinks || hasExternalLinks) {
        hasLinks = true;
      }
      
      // Gestisci i link interni [testo](link)
      const internalLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      let processedContent = content.replace(internalLinkRegex, (match, text, link) => {
        return `<a href="${link}" class="ai-summary-link">${text}</a>`;
      });
      
      // Gestisci i link esterni {{< extLink "testo" "link" >}}
      const externalLinkRegex = /\{\{< extLink "([^"]+)" "([^"]+)" >\}\}/g;
      processedContent = processedContent.replace(externalLinkRegex, (match, text, link) => {
        return `<a href="${link}" target="_blank" rel="nofollow noopener noreferrer" class="ai-summary-link external">${text} <i class="fas fa-external-link-alt"></i></a>`;
      });
      
      formattedHtml += `<li>${processedContent}</li>`;
    } else {
      // Se non è un punto elenco, crea un paragrafo
      if (trimmedLine) {
        formattedHtml += `<p style="color: #333;">${trimmedLine}</p>`;
      }
    }
  });
  
  // Se abbiamo punti elenco, avvolgili in <ul> solo se non sono già in una lista
  if (formattedHtml.includes('<li>') && !formattedHtml.includes('<ul')) {
    formattedHtml = `<ul class="ai-summary-list">${formattedHtml}</ul>`;
  }
  
  // Se ci sono link, aggiungi il testo "Link:" prima della lista
  if (hasLinks) {
    formattedHtml = formattedHtml.replace('<ul class="ai-summary-list">', '<p style="color: #15817f; font-weight: 600; margin-bottom: 10px;">Link:</p><ul class="ai-summary-list">');
  }
  
  console.log('HTML formattato:', formattedHtml);
  return formattedHtml;
}

// Funzione per pulire il contenuto HTML
function cleanContentForSummary(contentElement) {
  if (!contentElement) return '';
  
  // Clona l'elemento per non modificare l'originale
  const clonedContent = contentElement.cloneNode(true);
  
  // Rimuovi gli elementi specificati
  const elementsToRemove = [
    '.table-of-contents-container',
    '.article__body__leggi-anche',
    'figure.img-center',
    '.img-center',
    'div[id^="my-gallery-"]',
    'script',
    '#google-center-div'
  ];
  
  elementsToRemove.forEach(selector => {
    const elements = clonedContent.querySelectorAll(selector);
    elements.forEach(el => el.remove());
  });
  
  // Ottieni il testo pulito
  let cleanText = clonedContent.textContent || clonedContent.innerText || '';
  
  // Rimuovi newline e spazi extra
  cleanText = cleanText.replace(/\n\s+/g, ' '); // Rimuove "\n            " e simili
  cleanText = cleanText.replace(/\n/g, ' '); // Rimuove "\n" rimanenti
  cleanText = cleanText.replace(/\s+/g, ' '); // Normalizza spazi multipli
  cleanText = cleanText.trim(); // Rimuove spazi iniziali e finali
  
  return cleanText;
}

// Funzione per pulire l'URL rimuovendo parametri extra dopo la barra finale
function cleanUrlForCache(url) {
  // Rimuove tutto quello che viene dopo l'ultima barra finale
  // Es: https://vandipety.it/blog/post/....quaclsoa -> https://vandipety.it/blog/post/
  const cleanUrl = url.split('/').slice(0, -1).join('/') + '/';
  return cleanUrl;
}

// Funzione per ottenere il riassunto dall'API
async function getSummaryFromAPI(title, content, url) {
  try {
    // Crea una chiave di cache unica basata su titolo e URL pulito
    // Usa encodeURIComponent invece di btoa per gestire caratteri Unicode
    const cleanUrl = cleanUrlForCache(url);
    const cacheKey = `ai_summary_${encodeURIComponent(title + cleanUrl).replace(/[^a-zA-Z0-9]/g, '')}`;
    
    // Controlla se esiste già in cache
    const cachedSummary = getCachedData(cacheKey);
    if (cachedSummary) {
      console.log('Riassunto caricato dalla cache');
      return cachedSummary;
    }
    
    const response = await fetch(`${rpcUrl}/data/summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
        content: content,
        url: url
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const rawText = data.summary || data.text || 'Riassunto non disponibile';
    console.log('Testo ricevuto dall\'API:', rawText);
    
    const formattedSummary = formatSummaryText(rawText);
    
    // Salva in cache per 24 ore
    setCachedData(cacheKey, formattedSummary);
    
    return formattedSummary;
  } catch (error) {
    console.error('Errore nel recupero del riassunto:', error);
    return '<p>Errore nel generare il riassunto. Riprova più tardi.</p>';
  }
}

// Funzione principale per gestire il riassunto
async function handleArticleSummary() {
  const summaryContainer = createSummaryElement();
  if (!summaryContainer) return;

  const summaryContent = summaryContainer.querySelector('.ai-summary-content');
  const toggleButton = summaryContainer.querySelector('.ai-summary-toggle');
  
  // Se il pulsante non esiste, non possiamo continuare
  if (!toggleButton) {
    console.error('Toggle button not found');
    return;
  }
  
  // Ottieni titolo, contenuto e URL
  const title = document.querySelector('h1.mb-4')?.textContent || document.title;
  const contentElement = document.querySelector('.content.drop-cap');
  const content = cleanContentForSummary(contentElement);
  const currentUrl = window.location.href;
  
  // Crea la chiave di cache per verificare se esiste già
  // Usa encodeURIComponent invece di btoa per gestire caratteri Unicode
  const cleanUrl = cleanUrlForCache(currentUrl);
  const cacheKey = `ai_summary_${encodeURIComponent(title + cleanUrl).replace(/[^a-zA-Z0-9]/g, '')}`;
  const isCached = getCachedData(cacheKey);
  
  if (isCached) {
    // Se è in cache, mostra subito il riassunto senza animazioni
    console.log('Riassunto trovato in cache, caricamento immediato');
    summaryContent.innerHTML = isCached;
    
    // Cerca articoli correlati e aggiungi la lista
    addRelatedArticles(summaryContainer);
    
    // Rimuovi completamente la classe loading
    summaryContainer.classList.remove('loading');
    
    // Mostra subito il pulsante
    toggleButton.style.opacity = '1';
  } else {
    // Se non è in cache, mostra l'animazione di caricamento
    console.log('Riassunto non in cache, generazione in corso...');
    
    // Avvia l'animazione di caricamento
    startSummaryAnimation(summaryContent);
    
    // Simula un delay di 1.5 secondi per dare l'illusione che l'AI stia ragionando
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Ferma l'animazione
    stopSummaryAnimation();
    
    // Ottieni il riassunto dall'API
    const summary = await getSummaryFromAPI(title, content, cleanUrl);
    
    // Mostra il riassunto con l'effetto di scrittura
    await typeWriter(summaryContent, summary);

    // Cerca articoli correlati e aggiungi la lista
    addRelatedArticles(summaryContainer);

    // Rimuovi completamente la classe loading per indicare che il contenuto è completo
    summaryContainer.classList.remove('loading');

    // Mostra il pulsante con effetto fade-in
    toggleButton.style.opacity = '0';
    toggleButton.style.transition = 'opacity 0.5s ease-in-out';
    
    // Trigger del fade-in
    setTimeout(() => {
      toggleButton.style.opacity = '1';
    }, 100);
  }

  // Gestione del pulsante toggle per comprimere/espandere (logica copiata dall'indice)
  let isExpanded = true;
  toggleButton.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const headerArrow = toggleButton.querySelector('.toggle-arrow');
    const buttonText = toggleButton.querySelector('.button-text');
    const relatedArticles = summaryContainer.querySelector('.ai-related-articles');
    
    if (isExpanded) {
      summaryContent.style.display = 'none';
      summaryContent.style.height = '0';
      summaryContent.style.overflow = 'hidden';
      summaryContent.style.margin = '0';
      if (relatedArticles) relatedArticles.style.display = 'none';
      if (headerArrow) headerArrow.classList.remove('rotated');
      if (buttonText) buttonText.textContent = ' Espandi';
    } else {
      summaryContent.style.display = 'block';
      summaryContent.style.height = 'auto';
      summaryContent.style.overflow = 'visible';
      summaryContent.style.margin = '';
      if (relatedArticles) relatedArticles.style.display = 'block';
      if (headerArrow) headerArrow.classList.add('rotated');
      if (buttonText) buttonText.textContent = ' Comprimi';
    }
    isExpanded = !isExpanded;
  });
}

// Inizializza il riassunto quando la pagina è caricata
document.addEventListener('DOMContentLoaded', () => {
  // Incrementa il contatore delle pagine visitate
  incrementPageViews();
  
  // Controlla se siamo in una pagina di articolo e se l'AI è abilitato
  if (document.querySelector('.content.drop-cap')) {
    // Controlla se l'AI summary è abilitato tramite meta tag o variabile globale
    const aiEnabled = document.querySelector('meta[name="ai-summary-enabled"]')?.getAttribute('content') === 'true' || 
                     window.aiSummaryEnabled === true;
    
    if (aiEnabled !== false) { // Default a true se non specificato
      handleArticleSummary();
    }
  }
});

// Funzione per aggiungere articoli correlati
function addRelatedArticles(summaryContainer) {
  // Cerca tutti i div con classe article__body__leggi-anche
  const relatedArticles = document.querySelectorAll('.article__body__leggi-anche');
  
  if (relatedArticles.length > 0) {
    // Crea il container per gli articoli correlati
    const relatedContainer = document.createElement('div');
    relatedContainer.className = 'ai-related-articles';
    relatedContainer.style.cssText = 'margin-top: 15px; padding-top: 15px; border-top: 1px solid #e0e0e0; margin-left: 1.5em; margin-right: 1.5em;';
    
    // Crea il titolo
    const title = document.createElement('h4');
    title.textContent = 'Articoli correlati:';
    title.style.cssText = 'font-size: 16px; font-weight: 600; margin-bottom: 10px; color: #333;';
    
    // Crea la lista
    const list = document.createElement('ul');
    list.style.cssText = 'margin: 0; padding-left: 20px; list-style-type: disc;';
    
    // Aggiungi ogni articolo correlato alla lista
    relatedArticles.forEach(article => {
      const link = article.querySelector('a');
      if (link) {
        const listItem = document.createElement('li');
        listItem.style.cssText = 'margin-bottom: 5px;';
        
        const articleLink = document.createElement('a');
        articleLink.href = link.href;
        articleLink.textContent = link.title || link.querySelector('.leggi-anche-title')?.textContent || 'Articolo correlato';
        articleLink.style.cssText = 'color: #15817f; text-decoration: none; font-size: 14px;';
        
        articleLink.addEventListener('mouseenter', () => {
          articleLink.style.textDecoration = 'underline';
        });
        
        articleLink.addEventListener('mouseleave', () => {
          articleLink.style.textDecoration = 'none';
        });
        
        listItem.appendChild(articleLink);
        list.appendChild(listItem);
      }
    });
    
    // Assembla il container
    relatedContainer.appendChild(title);
    relatedContainer.appendChild(list);
    
    // Aggiungi il container dopo il riassunto
    summaryContainer.appendChild(relatedContainer);
  }
  
  // Aggiungi il disclaimer alla fine del box
  const disclaimer = document.createElement('div');
  disclaimer.className = 'ai-summary-disclaimer';
  disclaimer.innerHTML = '<small><em>Discalimer: Questo riassunto è in fase di test. Se ci sono errori <a href="/blog/sake-gatto-viaggiatore-record-mondiale" style="color: #15817f;">è colpa di Sakè</a></em></small>';
  disclaimer.style.cssText = 'color: black; font-size: 12px; margin-top: 15px; text-align: center;';
  summaryContainer.appendChild(disclaimer);
}

//=================== AI Summary script end ===================

// Funzione per precaricare i riassunti AI delle pagine più visitate
async function preloadAISummaries() {
  // Gestisci automaticamente la dimensione della cache
  manageAISummaryCache();
  
  // Lista delle pagine più popolari per precaricare i riassunti
  const popularPages = [
    '/blog/10-cose-essenziali-da-portare-in-viaggio',
    '/blog/come-entrare-in-giappone-con-un-veicolo-senza-carnet-de-passages',
    '/blog/100000-km-in-camper',
    '/blog/andalusia-on-the-road-alla-scoperta-di-setenil-de-las-bodegas-e-ronda'
  ];
  
  // Precarica solo se l'utente ha navigato su almeno 2 pagine (indicatore di interesse)
  const pageViews = sessionStorage.getItem('pageViews') || 0;
  if (pageViews < 2) return;
  
  console.log('Precaricamento riassunti AI per pagine popolari...');
  
  for (const pagePath of popularPages) {
    try {
      // Usa encodeURIComponent invece di btoa per gestire caratteri Unicode
      const cacheKey = `ai_summary_${encodeURIComponent('Pagina popolare' + pagePath).replace(/[^a-zA-Z0-9]/g, '')}`;
      
      // Controlla se è già in cache
      if (!getCachedData(cacheKey)) {
        // Fai una richiesta di background per precaricare
        fetch(`${rpcUrl}/data/summary`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: 'Pagina popolare',
            content: 'Contenuto di esempio per precaricamento',
            url: pagePath
          })
        }).then(response => response.json())
        .then(data => {
          const summary = data.summary || data.text || '';
          if (summary) {
            setCachedData(cacheKey, formatSummaryText(summary));
            console.log(`Riassunto precaricato per: ${pagePath}`);
          }
        }).catch(error => {
          console.log(`Errore nel precaricamento per ${pagePath}:`, error);
        });
      }
    } catch (error) {
      console.log(`Errore nel precaricamento per ${pagePath}:`, error);
    }
  }
}

// Incrementa il contatore delle pagine visitate
function incrementPageViews() {
  const currentViews = parseInt(sessionStorage.getItem('pageViews') || '0');
  sessionStorage.setItem('pageViews', (currentViews + 1).toString());
  
  // Se è la seconda pagina, avvia il precaricamento
  if (currentViews + 1 === 2) {
    setTimeout(preloadAISummaries, 1000); // Delay di 1 secondo per non interferire con la navigazione
  }
}

//=================== AI Summary script end ===================

function processExpenseData(data) {
    updateUIElements({
        totalCost: data.totalCost,
        totalCostWithoutFerry: data.totalCostWithoutFerry,
        ferryCosts: data.ferryCosts,
        yearlyTotals: data.yearlyTotals,
        dailyCost: data.dailyCost,
        dailyCostWithoutFerry: data.dailyCostWithoutFerry,
        diffDays: data.tripDay,
    });
}

function updateUIElements({ totalCost, totalCostWithoutFerry, ferryCosts, yearlyTotals, dailyCost, dailyCostWithoutFerry, diffDays }) {
    // Aggiorna solo se siamo nella pagina delle spese
    if (document.getElementById('travelingSumCost')) {
        document.getElementById('travelingSumCost').innerText = `${totalCostWithoutFerry.toFixed(2)} €`;
        document.getElementById('dailyCost').innerText = `${dailyCostWithoutFerry.toFixed(2)} €`;
        document.getElementById('travelingSumCostFerry1').innerText = ferryCosts.ferry1.toFixed(2);
        document.getElementById('travelingSumCostFerry2').innerText = ferryCosts.ferry2.toFixed(2);
        document.getElementById('dailyCostFerry').innerText = `${dailyCost.toFixed(2)} € al giorno`;
        document.getElementById('yearlyCostFerry').innerText = `${totalCost.toFixed(2)} €`;

        const yearlyContainer = document.getElementById('yearlyCost');
        yearlyContainer.innerHTML = '';
        
        Object.entries(yearlyTotals).forEach(([year, amount]) => {
            const yearDiv = document.createElement('div');
            yearDiv.className = 'col-md-3 mb-3';
            yearDiv.innerHTML = `
                <h4 class="h5 mb-2">${year}</h4>
                <h3 class="mb-5 h5">${amount.toFixed(2)} €</h3>
            `;
            yearlyContainer.appendChild(yearDiv);
        });

        document.getElementById('travelingDay').innerText = diffDays;
    }
}

function setChartCategory(data) {
    const ctx = document.getElementById('catergory')?.getContext('2d');
    if (!ctx) return;

    const _labels = Object.keys(data.json);
    const _data = Object.values(data.json);

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: _labels,
            datasets: [{
                label: 'Euro',
                data: _data,
                backgroundColor: color,
                borderColor: color,
                borderWidth: 1
            }]
        }
    });
}

function setChartMonthly(data) {
    const ctx2 = document.getElementById('monthly')?.getContext('2d');
    if (!ctx2) return;

    const _labels2 = Object.keys(data.json);
    const _data2 = Object.values(data.json);

    new Chart(ctx2, {
        type: 'bar',
        options: {
            plugins: {
                legend: {
                    display: false
                }
            }
        },
        data: {
            labels: _labels2.reverse(),
            datasets: [{
                label: 'Euro',
                data: _data2.reverse(),
                backgroundColor: color,
                borderColor: color,
                borderWidth: 1
            }]
        }
    });
}

function setGrid(data) {
    const result = [];
    let i = 0;
    while(i < data.json.length) {
        let res = data.json[i];
        let cost = parseFloat(res.cost);
        cost = Math.round((cost + Number.EPSILON) * 100) / 100;
        result.push([res.category.name, res.description, cost, new Date(res.date).toLocaleString()]);
        i++;
    }

    const gridElement = document.getElementById("tblSpese");
    if (gridElement) {
        new gridjs.Grid({
            columns: ["Categoria", "Descrizione", "Spesa", "Data"],
            data: result,
            sort: true,
            pagination: {
                limit: 20
            }
        }).render(gridElement);
    }
}

// Funzione di inizializzazione per la pagina delle spese
function initExpensesPage() {
    if (!document.getElementById('catergory')) return;

    // Carica i dati
    document.addEventListener('DOMContentLoaded', async () => {
        await fecthExpenseData();
        await fecthChartMonthlyData();
        await fecthChartCategoryData();
        await fecthGridData();
    });
}

// Inizializza la pagina delle spese se siamo nella pagina corretta
initExpensesPage();
//=================== expanses script end ===================

//=================== press script start ===================
function createPressListItem(data) {
    const info = data.info ? data.info.replace('#', data.data) : '';
    return `<li><strong><a href="${data.url}">${data.title}</a></strong>${info ? ` (${info})` : ''}</li>`;
}

function sortByDate(a, b) {
    return new Date(a.data).getTime() - new Date(b.data).getTime();
}

async function buildPressList() {
    try {
        const loader = document.getElementById('loader');
        const pressElement = document.getElementById('press');
        if (!loader || !pressElement) return;

        // Controlla prima la cache
        const cached = getCachedData('press');
        let pressItems;
        
        if (cached) {
            pressItems = cached.json;
        } else {
            const response = await fetch(`${rpcUrl}/data/press`);
            const data = await response.json();
            pressItems = data.json;
            setCachedData('press', data);
        }
        
        pressItems.sort(sortByDate);

        pressItems.forEach(item => {
            const year = item.data.split('/')[2];
            
            if (!document.getElementById(year)) {
                const yearHeading = document.createElement('h5');
                yearHeading.textContent = year;
                pressElement.appendChild(yearHeading);
                
                const yearList = document.createElement('ul');
                yearList.id = year;
                pressElement.appendChild(yearList);
            }

            const yearList = document.getElementById(year);
            yearList.insertAdjacentHTML('beforeend', createPressListItem(item));
        });

        loader.style.display = 'none';
    } catch (error) {
        console.error('Error loading press data:', error);
        const loader = document.getElementById('loader');
        if (loader) loader.style.display = 'none';
    }
}

// Funzione di inizializzazione per la pagina press
function initPressPage() {
    if (!document.getElementById('press')) return;
    document.addEventListener('DOMContentLoaded', buildPressList);
}

// Inizializza la pagina press se siamo nella pagina corretta
initPressPage();
//=================== press script end ===================

//=================== van script start ===================
function setInsuranceData(assicuazione, bollo) {
    const assicurazioneElement = document.getElementById('assicuazione');
    const bolloElement = document.getElementById('bollo');
    if (assicurazioneElement) assicurazioneElement.innerText = `${assicuazione} €`;
    if (bolloElement) bolloElement.innerText = `${bollo} €`;
}

function setKmData(actualKm) {
    const kmElement = document.getElementById('travelingKm');
    if (kmElement) kmElement.innerText = actualKm;
}

function setVanCost(initialCost, accessoryCost) {
    const totalAccessoryCost = Object.values(accessoryCost).reduce((sum, cost) => sum + cost, 0);

    const initialCostElement = document.getElementById('initialCost');
    const accessoryCostElement = document.getElementById('accessoryCost');
    const totalVanCostElement = document.getElementById('totalVanCost');
    const tblAccessoryElement = document.getElementById('tblAccessory');

    if (initialCostElement) initialCostElement.innerText = `${initialCost} €`;
    if (accessoryCostElement) accessoryCostElement.innerText = `${totalAccessoryCost} €`;
    if (totalVanCostElement) totalVanCostElement.innerText = `${initialCost + totalAccessoryCost} €`;

    if (tblAccessoryElement) {
        new gridjs.Grid({
            columns: ["Accessorio", "Costo"],
            data: Object.entries(accessoryCost),
            sort: true,
            pagination: { limit: 20 }
        }).render(tblAccessoryElement);
    }
}

// Funzione di inizializzazione per la pagina van
function initVanPage() {
    if (!document.getElementById('travelingKm')) return;

    // Carica i dati
    document.addEventListener('DOMContentLoaded', getTripData);
}

// Inizializza la pagina van se siamo nella pagina corretta
initVanPage();
//=================== van script end ===================

//=================== trip script start ===================
function updateTripElements({ travelingKm, visitedCountry, travelingDay, travelingStartDay }) {
    if (!document.getElementById('map')) return;

    const elements = {
        travelingKm: document.getElementById('travelingKm'),
        visitedCountry: document.getElementById('visitedCountry'),
        travelingDay: document.getElementById('travelingDay'),
        travelingStartDay: document.getElementById('travelingStartDay')
    };

    if (travelingKm && elements.travelingKm) elements.travelingKm.innerText = travelingKm;
    if (visitedCountry && elements.visitedCountry) elements.visitedCountry.innerText = visitedCountry;
    if (travelingDay && elements.travelingDay) elements.travelingDay.innerText = travelingDay;
    if (travelingStartDay && elements.travelingStartDay) elements.travelingStartDay.innerText = travelingStartDay;
}

function setTripData(data) {
    const res = data.json;
    
    // Se siamo nella pagina trip, aggiorna tutti gli elementi
    if (document.getElementById('map')) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');

        const date1 = new Date(res.startingDate);
        const date2 = new Date(`${mm}/${dd}/${yyyy}`);
        const diffDays = Math.ceil(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

        const [day, month, year] = res.startingDate.split('/');
        const fixedDate = `${month}/${day}/${year}`;

        updateTripElements({
            travelingKm: res.actualKm,
            visitedCountry: res.visitedCountry.length,
            travelingDay: diffDays,
            travelingStartDay: fixedDate
        });
    }

    // Se siamo nella pagina van, aggiorna i costi e i km
    if (document.getElementById('initialCost')) {
        setVanCost(res.costVan, res.costAccessory);
        setInsuranceData(res.assicurazione, res.bollo);
        document.getElementById('travelingKm').innerText = res.actualKm;
    }
}

function setMap(mapJson) {
    const lat = 11.25273288631866;
    const long = 45.26401290964107;

    mapboxgl.accessToken = 'pk.eyJ1IjoicmF4aWVuIiwiYSI6ImNscHA1cDBkNjExMjQybW1zdDdwN2tydmYifQ.dWypGWy2wcMCPjDv5yKGsQ';

    // Disabilita l'uso dei worker
    mapboxgl.supportsWorker = false;

    const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/light-v10",
        zoom: 5,
        bearing: 20,
        pitch: 60,
        maxZoom: 13,
        minZoom: 4,
        center: [lat, long],
        // Disabilita l'uso dei worker
        workerCount: 0
    });

    map.scrollZoom.disable();
    map.touchZoomRotate.enable();
    map.addControl(new mapboxgl.NavigationControl());

    const mapBoxFeatures = mapJson.pin
        .filter(item => item.latlong && item.latlong !== "" && 
            (!item.date || new Date(item.date) <= new Date()))
        .map(item => {
            const latlong = item.latlong.replace(' ', '').split(',').map(parseFloat);
            return {
                type: 'Feature',
                properties: {
                    description: `<article class="feature feature-1" style="margin-bottom: 0px;">
                        <a href="https://youtu.be/${item.vendorid}" class="block" target="_blank" rel="nofollow noopener noreferrer">
                            <img alt="Image" src="https://img.youtube.com/vi/${item.vendorid}/maxresdefault.jpg" />
                        </a>
                        <div class="feature__body boxed boxed--border bg--secondary" style="margin-bottom: 0px;">
                            <h6>${item.title}</h6>
                            <p>📍 Scopri gli itinerari <a href="/search/??s=${item.blog}"><span>${item.blog}</span></a></p>
                        </div>
                    </article>`
                },
                geometry: {
                    type: "Point",
                    coordinates: [latlong[1], latlong[0]]
                }
            };
        });

    function addRouteLayer(id, routeData, color, title) {
        const coordinates = routeData.map(item => {
            const [lat, long] = item[0].replace(' ', '').split(',').map(parseFloat);
            return [lat, long];
        });

        map.addSource(id, {
            type: 'geojson',
            data: {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates
                }
            }
        });

        map.addLayer({
            id,
            type: 'line',
            source: id,
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': color,
                'line-width': 4
            }
        });

        const legend = document.getElementById('legend');
        const newLegendItem = document.createElement('div');
        const span = document.createElement('span');
        span.style.backgroundColor = color;
        newLegendItem.appendChild(span);
        newLegendItem.appendChild(document.createTextNode(title));
        legend.appendChild(newLegendItem);
    }

    map.on("load", function () {
        map.loadImage("https://res.cloudinary.com/ilgattodicitturin/image/upload/v1701600586/asset/red_marker_small_cgzn6u.png", 
            function (error, image) {
                if (error) throw error;

                addRouteLayer('route1', mapJson.route[0], '#FFC000', 'Road to Dakar');
                addRouteLayer('route2', mapJson.route[1], '#d98396', 'Tour dei Balcani');
                addRouteLayer('route3', mapJson.route[2], '#91CCF1', 'Direzione Giappone');

                map.addImage("custom-marker", image);

                map.addLayer({
                    id: "places",
                    type: "symbol",
                    source: {
                        type: "geojson",
                        data: {
                            type: 'FeatureCollection',
                            features: mapBoxFeatures
                        }
                    },
                    layout: {
                        "icon-image": "custom-marker",
                        'text-allow-overlap': true,
                        'icon-allow-overlap': true,
                    }
                });

                const legend = document.getElementById('legend');
                legend.style.display = 'block';
            });
    });

    map.on('click', 'places', function (e) {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.description;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
    });

    map.on('mouseenter', 'places', () => map.getCanvas().style.cursor = 'pointer');
    map.on('mouseleave', 'places', () => map.getCanvas().style.cursor = '');
}

// Funzione di inizializzazione per la pagina trip
function initTripPage() {
    if (!document.getElementById('map')) return;

    // Carica i dati
    document.addEventListener('DOMContentLoaded', async () => {
        const device = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        await Promise.all([getTripData(), getMapData()])
            .catch(error => console.error('Error initializing data:', error));
    });
}

// Inizializza la pagina trip se siamo nella pagina corretta
initTripPage();
//=================== trip script end ===================

//=================== contact script start ===================
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 1000);
    }, 3000);
}

function toggleButtonLoading(isLoading) {
    const button = document.getElementById('submitButton');
    const buttonText = button.querySelector('.button-text');
    const spinner = button.querySelector('.spinner-border');
    
    if (isLoading) {
        button.disabled = true;
        buttonText.classList.add('d-none');
        spinner.classList.remove('d-none');
    } else {
        button.disabled = false;
        buttonText.classList.remove('d-none');
        spinner.classList.add('d-none');
    }
}

function sendMail(event) {
    event.preventDefault();
    
    toggleButtonLoading(true);
    
    const data = {
        "from": document.getElementById("email").value,
        "isSponsor": 0,
        "subject": document.getElementById("subject").value,
        "text": document.getElementById("message").value
    }
    
    fetch(rpcUrl + "/mail/sendMail?" + new URLSearchParams(data), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    })
    .then(response => response.json())
    .then(data => {
        showToast('Abbiamo ricevuto la tua email.');
        document.getElementById("email").value = '';
        document.getElementById("subject").value = '';
        document.getElementById("message").value = '';
        toggleButtonLoading(false);
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Non siamo riusciti a ricevere la tua email :( riprova più tardi.');
        toggleButtonLoading(false);
    });
}

// Funzione di inizializzazione per la pagina contact
function initContactPage() {
    if (!document.getElementById('contactForm')) return;

    document.getElementById("contactForm").addEventListener('submit', sendMail);
}

// Inizializza la pagina contact se siamo nella pagina corretta
initContactPage();
//=================== contact script end ===================

//=================== travel-book script start ===================
async function getTravelBookParam(p) {
    try {
        const response = await fetch(rpcUrl + "/data/travel-book", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const res = data.json;
        
        const btnAction = document.getElementById("btnAction");
        if (btnAction) {
            btnAction.href = res[p];
        }

        return data;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Funzione di inizializzazione per la pagina travel-book
function initTravelBookPage() {
    if (!document.getElementById('btnAction')) return;

    const urlParams = new URLSearchParams(window.location.search);
    const c = urlParams.get("acquire");
    const p = urlParams.get("title");

    if (c === "yes") {
        getTravelBookParam(p);
    } else {
        window.location.replace("/404");
    }
}

// Inizializza la pagina travel-book se siamo nella pagina corretta
initTravelBookPage();
//=================== travel-book script end ===================

//=================== transiberian script start ===================
const url = 'https://api.openrouteservice.org/v2/matrix/driving-car';
const apiKey = '5b3ce3597851110001cf6248628c476c60c94a21922aa9d289a26249';
const gmapsUrl = 'https://www.google.com/maps/dir/';

let totalKm = 0;
let cities = [];
let lastCity = null;
let choicesInstance = null;

function initTransiberianPage() {
    if (!document.getElementById('city')) return;

    const select = document.getElementById('city');
    choicesInstance = new Choices(select, {
        searchEnabled: true,
        searchChoices: true,
        itemSelectText: 'Premi per selezionare',
        placeholderValue: 'Seleziona una città',
        searchPlaceholderValue: 'Cerca una città...',
        noResultsText: 'Nessuna città trovata',
        shouldSort: true,
    });

    // Set initial visa days
    setVisaDays();
    getData();
}

async function getData() {
    try {
        const response = await fetch(`${rpcUrl}/data/ru_it`);
        const data = await response.json();
        const cityOptions = data.json.map(city => ({
            value: `${city.lat},${city.lng}`,
            label: city.city
        }));
        choicesInstance.setChoices(cityOptions, 'value', 'label', true);
    } catch (error) {
        console.error('Error fetching city data:', error);
    }
}

function setVisaDays() {
    const visaType = document.getElementById('visaType');
    const daysInput = document.getElementById('days');
    daysInput.value = visaType.value;
    document.getElementById('days').innerText = visaType.value;
    calculateTotalKm();
    calculateMinimumDays();
}

function addCity() {
    if (!choicesInstance) return;
    const selectedOption = choicesInstance.getValue();
    if (!selectedOption) return;

    // Controlla se la città è l'ultima inserita
    if (cities.length > 0 && cities[cities.length - 1].name === selectedOption.label) {
        alert('Non puoi inserire la stessa città due volte di seguito!');
        return;
    }

    const newCity = {
        name: selectedOption.label,
        coords: selectedOption.value.split(',').map(Number)
    };

    cities.push(newCity);
    lastCity = newCity;

    if (cities.length === 1) {
        addRowToTable(newCity.name, 0);
        updateButtonsState();
    } else {
        document.getElementById('loader').style.display = 'flex';
        
        const prevCity = cities[cities.length - 2];
        calculateDistance(prevCity.coords, newCity.coords)
            .then(distance => {
                document.getElementById('loader').style.display = 'none';
                
                if (distance >= 0) {
                    addRowToTable(newCity.name, distance);
                    totalKm += distance;
                    updateTotalKm();
                    updateButtonsState();
                } else {
                    recalculateDistances();
                }
            })
            .catch(error => {
                document.getElementById('loader').style.display = 'none';
                console.error('Errore nel calcolo della distanza:', error);
            });
    }

    choicesInstance.setChoiceByValue('');
}

async function calculateDistance(origin, destination) {
    const url = 'https://api.openrouteservice.org/v2/directions/driving-car';

    try {
        const response = await fetch(
            `${url}?api_key=${apiKey}&start=${origin[1]},${origin[0]}&end=${destination[1]},${destination[0]}`
        );

        const data = await response.json();
        
        if (data.error && data.error.code === 2004) {
            alert("La distanza tra le città è troppo grande. Inserisci una città intermedia.");
            cities.pop();
            return -1;
        }
        
        if (data.features && data.features[0].properties.segments) {
            const distanceInKm = data.features[0].properties.segments[0].distance / 1000;
            return Math.round(distanceInKm);
        }
        throw new Error('Errore nel calcolo della distanza');
    } catch (error) {
        console.error('Errore:', error);
        return 0;
    }
}

function addRowToTable(city, distance) {
    const table = document.getElementById('cityTable');
    const row = table.insertRow();
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);

    cell1.innerHTML = city;
    cell2.innerHTML = distance.toFixed(0);
    cell3.innerHTML = calculateHoursForDistance(distance);
    cell4.innerHTML = '<button class="btn btn-delete2" style="z-index: auto;" onclick="deleteRow(this)">Rimuovi</button>';
}

function deleteRow(button) {
    const row = button.parentNode.parentNode;
    const index = row.rowIndex - 1;

    // Mostra il loader prima di iniziare le operazioni
    document.getElementById('loader').style.display = 'flex';

    cities.splice(index, 1);

    for (let i = 1; i < cities.length; i++) {
        if (cities[i].name === cities[i-1].name) {
            cities.splice(i, 1);
            i--;
        }
    }

    if (cities.length > 0) {
        lastCity = cities[cities.length - 1];
    } else {
        lastCity = null;
    }

    row.parentNode.removeChild(row);
    
    // Ricalcola le distanze e nascondi il loader quando finito
    recalculateDistances().finally(() => {
        document.getElementById('loader').style.display = 'none';
    });
    
    updateButtonsState();
}

async function recalculateDistances() {
    totalKm = 0;
    const table = document.getElementById('cityTable');
    table.innerHTML = '';

    try {
        for (let i = 0; i < cities.length; i++) {
            if (i === 0) {
                addRowToTable(cities[i].name, 0);
            } else {
                const distance = await calculateDistance(cities[i - 1].coords, cities[i].coords);
                addRowToTable(cities[i].name, distance);
                totalKm += distance;
            }
        }

        updateTotalKm();
        calculateMinimumDays();
    } catch (error) {
        console.error('Errore nel ricalcolo delle distanze:', error);
    }
}

function updateTotalKm() {
    calculateTotalKm();
}

function calculateHoursForDistance(distance) {
    const speed = document.getElementById('averageSpeed').value;
    if (speed > 0 && distance > 0) {
        const hours = Math.ceil(distance / speed);
        return hours;
    }
    return '0';
}

function calculateHours() {
    const table = document.getElementById('cityTable');
    const rows = table.rows;
    for (let i = 1; i < rows.length; i++) {
        const distance = parseFloat(rows[i].cells[1].innerHTML);
        rows[i].cells[2].innerHTML = calculateHoursForDistance(distance);
    }
    
    calculateMinimumDays();
}

function calculateTotalKm() {
    const roundTrip = document.getElementById('roundTrip').checked;
    let displayTotalKm = totalKm;
    
    if (roundTrip) {
        displayTotalKm = totalKm * 2;
    }
    
    document.getElementById('totalKm').innerText = displayTotalKm.toFixed(0);
    
    const days = parseInt(document.getElementById('days').innerText);
    if (days > 0) {
        const average = displayTotalKm / days;
        document.getElementById('averageKm').innerText = average.toFixed(0);
    } else {
        document.getElementById('averageKm').innerText = '0';
    }
    
    calculateMinimumDays();
}

function calculateMinimumDays() {
    let totalHours = 0;
    const table = document.getElementById('cityTable');
    const rows = table.rows;
    
    for (let i = 1; i < rows.length; i++) {
        const hours = parseInt(rows[i].cells[2].innerHTML);
        totalHours += hours;
    }
    
    const roundTrip = document.getElementById('roundTrip').checked;
    if (roundTrip) {
        totalHours *= 2;
    }
    
    const minimumDays = Math.ceil(totalHours / 8);
    
    const averageDayElement = document.getElementById('averageDay');
    averageDayElement.innerText = minimumDays > 0 ? minimumDays : '0';
    
    const visaDays = parseInt(document.getElementById('days').innerText);
    
    if (minimumDays > visaDays) {
        averageDayElement.style.color = '#dc3545';
    } else {
        averageDayElement.style.color = '';
    }
}

function openGoogleMaps() {
    let mapUrl = gmapsUrl;
    
    for (let i = 0; i < cities.length; i++) {
        mapUrl += encodeURIComponent(cities[i].name) + "/";
    }
    
    mapUrl = mapUrl.slice(0, -1);
    window.open(mapUrl, '_blank');
}

function updateButtonsState() {
    const googleMapsBtn = document.getElementById('viewOnGoogleMaps');
    const excelBtn = document.getElementById('exportToExcel');
    
    if (cities.length >= 2) {
        if (googleMapsBtn) googleMapsBtn.disabled = false;
        if (excelBtn) excelBtn.disabled = false;
    } else {
        if (googleMapsBtn) googleMapsBtn.disabled = true;
        if (excelBtn) excelBtn.disabled = true;
    }
}

// Inizializza la pagina transiberiana se siamo nella pagina corretta
document.addEventListener('DOMContentLoaded', initTransiberianPage);
//=================== transiberian script end ===================

//=================== translate script start ===================
async function translateContent() {
  const articleContent = document.querySelector('.content.drop-cap');
  const translateBtn = document.querySelector('button[onclick="translateContent()"]');
  
  if (!articleContent) {
    console.error('Elemento .content.drop-cap non trovato');
    return;
  }
  
  const isTranslated = articleContent.classList.contains('translated');
  
  if (!isTranslated) {
    // Mostra il loader
    translateBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2 text-primary"></i><span class="text-primary d-inline-block d-md-none">Trad...</span><span class="text-primary d-none d-md-inline-block">Translating...</span>';
    translateBtn.disabled = true;
    
    // Salva il contenuto originale
    articleContent.setAttribute('data-original-content', articleContent.innerHTML);
    
    // Traduci il contenuto preservando la struttura HTML
    const elements = articleContent.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, span, figcaption');
    // Aggiungiamo anche il titolo dell'articolo
    const title = document.querySelector('h3.mb-4');
    if (title) {
      elements.push(title);
    }
    
    // Funzione per tradurre un singolo nodo
    async function translateNode(node) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
        // Preserva gli spazi prima e dopo
        const leadingSpace = node.textContent.match(/^\s+/)?.[0] || '';
        const trailingSpace = node.textContent.match(/\s+$/)?.[0] || '';
        const text = node.textContent.trim();
        
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=it&tl=en&dt=t&q=${encodeURIComponent(text)}`;
        
        try {
          const response = await fetch(url);
          const data = await response.json();
          let translatedText = data[0].map(item => item[0]).join('');
          
          // Ripristina gli spazi
          translatedText = leadingSpace + translatedText + trailingSpace;
          
          // Preserva la capitalizzazione originale
          if (text[0] !== text[0].toUpperCase()) {
            translatedText = translatedText.charAt(0).toLowerCase() + translatedText.slice(1);
          }
          
          node.textContent = translatedText;
        } catch (error) {
          console.error('Errore nella traduzione:', error);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Se è un elemento, processa i suoi figli
        const childNodes = Array.from(node.childNodes);
        for (const child of childNodes) {
          await translateNode(child);
        }
      }
    }
    
    // Traduci tutti gli elementi
    for (const element of elements) {
      if (element.textContent.trim() !== '') {
        // Crea una copia temporanea dell'elemento
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = element.innerHTML;
        
        // Traduci il contenuto
        await translateNode(tempDiv);
        
        // Aggiorna l'elemento originale mantenendo la struttura HTML
        element.innerHTML = tempDiv.innerHTML;
      }
    }
    
    articleContent.classList.add('translated');
    translateBtn.disabled = false;
    translateBtn.innerHTML = '<i class="fas fa-language me-2 text-primary"></i><span class="text-primary d-inline-block d-md-none">Orig.</span><span class="text-primary d-none d-md-inline-block">View original</span>';
  } else {
    // Mostra il loader
    translateBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2 text-primary"></i><span class="text-primary d-inline-block d-md-none">Ripr...</span><span class="text-primary d-none d-md-inline-block">Restoring...</span>';
    translateBtn.disabled = true;
    
    // Ripristina il contenuto originale
    articleContent.innerHTML = articleContent.getAttribute('data-original-content');
    articleContent.classList.remove('translated');
    
    translateBtn.disabled = false;
    translateBtn.innerHTML = '<i class="fas fa-language me-2 text-primary"></i><span class="text-primary d-inline-block d-md-none">Trad.</span><span class="text-primary d-none d-md-inline-block">Translate to English</span>';
  }
}
//=================== translate script end ===================

//=================== newsletter script start ===================
function handleSubscribe(event) {
  event.preventDefault();
  const email = document.getElementById('newsletterEmail').value;
  const encodedEmail = encodeURIComponent(email);
  window.open(`https://vandipety.substack.com/subscribe?just_signed_up=true&skip_redirect_check=true&utm_medium=web&utm_source=embed&freeSignupEmail=${encodedEmail}`, '_blank');
}
//=================== newsletter script end ===================

//=================== blog footer script start ===================
function shareOnSocial(platform) {
    const title = document.querySelector('h1')?.textContent || document.title;
    const url = window.location.href;
    const platforms = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        threads: `https://www.threads.net/intent/post?text=${encodeURIComponent(title)}%20-%20${encodeURIComponent(url)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    };
    
    if (platform === 'copy') {
        navigator.clipboard.writeText(url).then(() => {
            showToast('Link copiato negli appunti!');
        });
        return false;
    }
    
    window.open(platforms[platform], '_blank');
    return false;
}

let modalid = '#satispay';
function openModal() {
    const modal = document.querySelector(modalid);
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.querySelector(modalid);
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}
//=================== blog footer script end ===================

//=================== lazy loading iframe script start ===================
document.addEventListener('DOMContentLoaded', function() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const iframe = entry.target;
        iframe.src = iframe.dataset.src;
        observer.unobserve(iframe);
      }
    });
  }, {
    rootMargin: '50px 0px',
    threshold: 0.1
  });

  document.querySelectorAll('iframe[data-src]').forEach(iframe => {
    observer.observe(iframe);
  });
});
//=================== lazy loading iframe script end ===================

//=================== youtube video script start ===================
// Funzione per ottenere l'anteprima del primo video pubblico di una playlist
async function getFirstPublicVideoThumbnail(playlistId, apiKey, facade) {
  try {
    // Controlla se l'immagine è già in cache
    const cacheKey = `yt_thumbnail_${playlistId}`;
    const cachedData = localStorage.getItem(cacheKey);
    
    if (cachedData) {
      const { thumbnailUrl, timestamp } = JSON.parse(cachedData);
      const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
      
      // Se la cache è più vecchia di una settimana, la invalidiamo
      if (Date.now() - timestamp < oneWeekInMs) {
        if (facade) {
          facade.style.backgroundImage = `url('${thumbnailUrl}')`;
        }
        return;
      }
    }

    const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,status&maxResults=50&playlistId=${playlistId}&key=${apiKey}`);
    const data = await response.json();
    
    if (data.items) {
      const publicVideo = data.items.find(item => item.status && item.status.privacyStatus === 'public');
      
      if (publicVideo) {
        const videoId = publicVideo.snippet.resourceId.videoId;
        const thumbnailUrl = `https://img.youtube.com/vi_webp/${videoId}/maxresdefault.webp`;
        const fallbackUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        
        // Salva in cache
        localStorage.setItem(cacheKey, JSON.stringify({
          thumbnailUrl,
          timestamp: Date.now()
        }));
        
        const img = new Image();
        img.onload = function() {
          if (facade) {
            facade.style.backgroundImage = `url('${thumbnailUrl}')`;
          }
        };
        img.onerror = function() {
          if (facade) {
            facade.style.backgroundImage = `url('${fallbackUrl}')`;
          }
        };
        img.src = thumbnailUrl;
      } else {
        console.log('Nessun video pubblico trovato nella playlist');
      }
    }
  } catch (error) {
    console.error('Errore nel caricamento dell\'anteprima:', error);
  }
}

// Funzione per gestire il click sul video
function handleVideoClick(facade, iframeContainer, iframe, videoId, isPlaylist) {
  facade.style.opacity = '0';
  facade.style.transition = 'opacity 0.3s ease-in-out';
  
  iframeContainer.style.opacity = '1';
  iframeContainer.style.pointerEvents = 'auto';
  
  if (isPlaylist) {
    iframe.src = `https://www.youtube-nocookie.com/embed/videoseries?list=${videoId}&autoplay=1&fs=0`;
  } else {
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&fs=0`;
  }
  
  setTimeout(() => {
    facade.style.display = 'none';
  }, 300);
}

// Inizializzazione dei video YouTube
document.addEventListener('DOMContentLoaded', function() {
  // Gestione dei video singoli
  const youtubeFacades = document.querySelectorAll('.youtube-facade[data-video-id]');
  
  youtubeFacades.forEach(facade => {
    if (!facade) return;
    
    const videoId = facade.dataset.videoId;
    const isPlaylist = facade.dataset.isPlaylist === 'true';
    const apiKey = facade.dataset.apiKey;
    const uniqueId = facade.id.split('-')[2];
    
    const iframe = document.getElementById(`iframe-${uniqueId}`);
    const iframeContainer = document.getElementById(`youtube-iframe-${uniqueId}`);
    
    if (!iframe || !iframeContainer) return;
    
    if (isPlaylist) {
      getFirstPublicVideoThumbnail(videoId, apiKey, facade);
    }
    
    facade.addEventListener('click', function(e) {
      e.preventDefault();
      handleVideoClick(facade, iframeContainer, iframe, videoId, isPlaylist);
    });
  });

  // Gestione del widget YouTube
  const youtubeWidget = document.querySelector('.widget.newsletter-widget .youtube-facade');
  const youtubeWidgetIframe = document.querySelector('.widget.newsletter-widget .youtube-iframe iframe');
  const youtubeWidgetIframeContainer = document.querySelector('.widget.newsletter-widget .youtube-iframe');
  
  if (youtubeWidget && youtubeWidgetIframe && youtubeWidgetIframeContainer) {
    const playlistId = 'PLHaclq_J5PZ_gu1kNkYx-mEQPchUK3Wzh';
    const apiKey = 'AIzaSyB-m8BmXqPNdNSyTanaww8Uv51TzXKzsqU';
    
    getFirstPublicVideoThumbnail(playlistId, apiKey, youtubeWidget);
    
    youtubeWidget.addEventListener('click', function(e) {
      e.preventDefault();
      handleVideoClick(youtubeWidget, youtubeWidgetIframeContainer, youtubeWidgetIframe, playlistId, true);
    });
  }
});
//=================== youtube video script end ===================

// Rimuovi iframe pubblicitari
document.addEventListener('DOMContentLoaded', function() {
  setInterval(function() {
      document.querySelectorAll('iframe').forEach(function(iframe) {
          let src = iframe.getAttribute('src');
          let id = iframe.getAttribute('id');
          if ((src && src.match(/(ads-iframe)|(disqusads)/gi)) || 
              (id && (id === 'indicator-north' || id === 'indicator-south'))) {
              iframe.remove();
          }
      });
  }, 300);
});

// Gestione del menu mobile
const toggleSideNav = document.querySelector('.toggle-side-nav');
const offcanvas = document.getElementById('offcanvasRight');
const offcanvasBackdrop = document.createElement('div');
offcanvasBackdrop.className = 'offcanvas-backdrop fade';

if (toggleSideNav && offcanvas) {
  // Aggiungi il backdrop al body
  document.body.appendChild(offcanvasBackdrop);

  // Gestione del click e del touch sul pulsante di apertura
  toggleSideNav.addEventListener('click', function(e) {
    e.preventDefault();
    openMenu();
  });
  toggleSideNav.addEventListener('touchstart', function(e) {
    e.preventDefault();
    openMenu();
  });

  // Gestione del pulsante di chiusura
  const closeButton = offcanvas.querySelector('.btn-close');
  if (closeButton) {
    closeButton.addEventListener('click', function(e) {
      e.preventDefault();
      closeMenu();
    });
    closeButton.addEventListener('touchstart', function(e) {
      e.preventDefault();
      closeMenu();
    });
  }

  // Gestione del click sul backdrop
  offcanvasBackdrop.addEventListener('click', closeMenu);
  offcanvasBackdrop.addEventListener('touchstart', closeMenu);

  // Gestione del tasto ESC
  document.addEventListener('keydown', handleEscape);
}

function openMenu() {
  const offcanvas = document.getElementById('offcanvasRight');
  const offcanvasBackdrop = document.querySelector('.offcanvas-backdrop');
  
  if (offcanvas && offcanvasBackdrop) {
    offcanvas.classList.add('show');
    offcanvasBackdrop.classList.add('show');
    document.body.classList.add('offcanvas-open');
  }
}

function closeMenu() {
  const offcanvas = document.getElementById('offcanvasRight');
  const offcanvasBackdrop = document.querySelector('.offcanvas-backdrop');
  
  if (offcanvas && offcanvasBackdrop) {
    offcanvas.classList.remove('show');
    offcanvasBackdrop.classList.remove('show');
    document.body.classList.remove('offcanvas-open');
  }
}

function handleEscape(e) {
  if (e.key === 'Escape') {
    closeMenu();
  }
}

// Funzionalità per la tabella dei contenuti
function initTableOfContents() {
  const toggleButton = document.getElementById('table-of-contents-toggle');
  const blockquote = document.getElementById('table-of-contents-content');
  
  if (toggleButton && blockquote) {
    // Rimuovi eventuali event listener esistenti per evitare duplicati
    const newToggleButton = toggleButton.cloneNode(true);
    toggleButton.parentNode.replaceChild(newToggleButton, toggleButton);
    
    // Inizializza la freccia nella posizione corretta
    const arrow = newToggleButton.querySelector('.toggle-arrow');
    if (arrow && blockquote.classList.contains('collapsed')) {
      arrow.classList.remove('rotated');
    } else if (arrow && !blockquote.classList.contains('collapsed')) {
      arrow.classList.add('rotated');
    }
    
    // Aggiungi event listener con ID specifico
    newToggleButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Toggle della classe collapsed
      if (blockquote.classList.contains('collapsed')) {
        blockquote.classList.remove('collapsed');
        // Ruota la freccia
        const arrow = newToggleButton.querySelector('.toggle-arrow');
        if (arrow) arrow.classList.add('rotated');
      } else {
        blockquote.classList.add('collapsed');
        // Ruota la freccia
        const arrow = newToggleButton.querySelector('.toggle-arrow');
        if (arrow) arrow.classList.remove('rotated');
      }
    });
    
    // Aggiungi anche event listener per touch per dispositivi mobili
    newToggleButton.addEventListener('touchstart', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Toggle della classe collapsed
      if (blockquote.classList.contains('collapsed')) {
        blockquote.classList.remove('collapsed');
        // Ruota la freccia
        const arrow = newToggleButton.querySelector('.toggle-arrow');
        if (arrow) arrow.classList.add('rotated');
      } else {
        blockquote.classList.add('collapsed');
        // Ruota la freccia
        const arrow = newToggleButton.querySelector('.toggle-arrow');
        if (arrow) arrow.classList.remove('rotated');
      }
    });
  }
}

// Inizializza la tabella dei contenuti quando il DOM è caricato
document.addEventListener('DOMContentLoaded', function() {
  // Delay per assicurarsi che tutti gli elementi siano caricati
  setTimeout(function() {
    initTableOfContents();
  }, 100);
});

// Funzione per pulire la cache dei riassunti AI
function clearAISummaryCache() {
  const keys = Object.keys(localStorage);
  const aiSummaryKeys = keys.filter(key => key.startsWith('ai_summary_'));
  
  aiSummaryKeys.forEach(key => {
    localStorage.removeItem(key);
  });
  
  console.log(`Cache riassunti AI pulita: rimossi ${aiSummaryKeys.length} elementi`);
}

// Funzione per ottenere statistiche della cache dei riassunti AI
function getAISummaryCacheStats() {
  const keys = Object.keys(localStorage);
  const aiSummaryKeys = keys.filter(key => key.startsWith('ai_summary_'));
  
  const stats = {
    total: aiSummaryKeys.length,
    size: 0,
    oldest: null,
    newest: null
  };
  
  aiSummaryKeys.forEach(key => {
    try {
      const cached = JSON.parse(localStorage.getItem(key));
      if (cached && cached.timestamp) {
        const age = Date.now() - cached.timestamp;
        stats.size += JSON.stringify(cached).length;
        
        if (!stats.oldest || age > (Date.now() - stats.oldest)) {
          stats.oldest = cached.timestamp;
        }
        if (!stats.newest || age < (Date.now() - stats.newest)) {
          stats.newest = cached.timestamp;
        }
      }
    } catch (error) {
      console.log(`Errore nell'analisi della cache per ${key}:`, error);
    }
  });
  
  return stats;
}

// Funzione per controllare e gestire la dimensione della cache dei riassunti AI
function manageAISummaryCache() {
  const stats = getAISummaryCacheStats();
  const maxSize = 5 * 1024 * 1024; // 5MB limite massimo
  
  if (stats.size > maxSize || stats.total > 50) {
    console.log('Cache riassunti AI troppo grande, pulizia automatica...');
    
    // Rimuovi i riassunti più vecchi
    const keys = Object.keys(localStorage);
    const aiSummaryKeys = keys.filter(key => key.startsWith('ai_summary_'));
    
    // Ordina per timestamp (più vecchi prima)
    const sortedKeys = aiSummaryKeys.sort((a, b) => {
      try {
        const aData = JSON.parse(localStorage.getItem(a));
        const bData = JSON.parse(localStorage.getItem(b));
        return (aData.timestamp || 0) - (bData.timestamp || 0);
      } catch {
        return 0;
      }
    });
    
    // Rimuovi il 30% più vecchio
    const keysToRemove = sortedKeys.slice(0, Math.ceil(sortedKeys.length * 0.3));
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    console.log(`Rimossi ${keysToRemove.length} riassunti dalla cache`);
  }
}
  