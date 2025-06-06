// Debug: log quando il file viene caricato
console.log('Search.js loaded - Starting initialization');

// Debug: verifica se Fuse è disponibile
console.log('Fuse available:', typeof Fuse !== 'undefined');

// Debug: verifica se indexURL è definito
console.log('indexURL:', typeof indexURL !== 'undefined' ? indexURL : 'undefined');

// Debug: verifica se il documento è pronto
console.log('Document ready - Search.js initialization complete');

summaryInclude = 100;
var fuseOptions = {
  isCaseSensitive: false,
  includeScore: false,
  shouldSort: true,
  includeMatches: false,
  findAllMatches: true,
  minMatchCharLength: 3,
  location: 1,
  threshold: 0.4,
  distance: 100,
  useExtendedSearch: false,
  ignoreLocation: false,
  ignoreFieldNorm: false,
  keys: [{
      name: "title",
      weight: 0.9
    },
    {
      name: "country",
      weight: 0.8
    },
    {
      name: "categories",
      weight: 0.5
    },
    {
      name: "contents",
      weight: 0.3
    }
  ]
};

function param(name) {
  const urlParams = new URLSearchParams(window.location.search);
  const value = urlParams.get(name) || '';
  console.log('Search parameter:', name, '=', value);
  return value;
}

var searchQuery = param("s");
console.log('Initial search query:', searchQuery);

// Controlla se siamo sulla pagina di ricerca
const isSearchPage = window.location.pathname.includes('/search/');

if (searchQuery && !isSearchPage) {
  console.log('Executing search for:', searchQuery);
  document.getElementById('search-query').value = searchQuery;
  executeSearch(searchQuery);
} else {
  // Focus automatico sull'input di ricerca
  document.getElementById('search-query').focus();
}

function executeSearch(searchQuery) {
  // Mostra loading state
  document.getElementById('search-loading').style.display = 'block';
  document.getElementById('search-results').style.display = 'none';
  document.getElementById('no-results').style.display = 'none';
  
  console.log('Fetching index.json from:', indexURL);
  fetch(indexURL)
    .then(response => response.json())
    .then(data => {
      console.log('Index.json loaded, data length:', data.length);
      var pages = data;
      var fuse = new Fuse(pages, fuseOptions);
      var result = fuse.search(searchQuery);
      console.log('Search results:', result.length);
      
      // Nascondi loading state
      document.getElementById('search-loading').style.display = 'none';
      
      if (result.length > 0) {
        document.getElementById('search-results').style.display = 'flex';
        populateResults(result);
      } else {
        document.getElementById('no-results').style.display = 'block';
      }
    })
    .catch(error => {
      console.error('Error loading index.json:', error);
      document.getElementById('search-loading').style.display = 'none';
      document.getElementById('no-results').style.display = 'block';
    });
}

function populateResults(result) {
  const searchResults = document.getElementById('search-results');
  result.forEach((value, key) => {
    var contents = value.item.contents;
    var snippet = "";
    if (fuseOptions.tokenize) {
      snippet = contents.substring(0, summaryInclude * 2);
    } else if (value.matches && Array.isArray(value.matches)) {
      value.matches.forEach(mvalue => {
        if (mvalue.key == "contents") {
          const start = mvalue.indices[0][0] - summaryInclude > 0 ? mvalue.indices[0][0] - summaryInclude : 0;
          const end = mvalue.indices[0][1] + summaryInclude < contents.length ? mvalue.indices[0][1] + summaryInclude : contents.length;
          snippet += contents.substring(start, end);
        }
      });
    }

    if (snippet.length < 1) {
      snippet += contents.substring(0, summaryInclude * 2);
    }

    const templateDefinition = document.getElementById('search-result-template').innerHTML;
    const output = render(templateDefinition, {
      key: key,
      title: value.item.title,
      image: value.item.image,
      date: value.item.date,
      link: value.item.permalink,
      tags: value.item.tags,
      categories: value.item.categories,
      categories0: [value.item.categories[0]],
      categories1: [value.item.categories[1]],
      visible1: value.item.categories[1] == undefined ? "hide-li" : "",
      categories2: [value.item.categories[2]],
      visible2: value.item.categories[2] == undefined ? "hide-li" : "",
      categories3: [value.item.categories[3]],
      visible3: value.item.categories[3] == undefined ? "hide-li" : "",
      snippet: snippet
    });

    searchResults.insertAdjacentHTML('beforeend', output);
  });
}

function render(templateString, data) {
  let copy = templateString;
  const conditionalPattern = /\$\{\s*isset ([a-zA-Z]*) \s*\}(.*)\$\{\s*end\s*\}/g;
  
  let match;
  while ((match = conditionalPattern.exec(templateString)) !== null) {
    if (data[match[1]]) {
      copy = copy.replace(match[0], match[2]);
    } else {
      copy = copy.replace(match[0], '');
    }
  }
  
  templateString = copy;
  for (const key in data) {
    const find = '\\$\\{\\s*' + key + '\\s*\\}';
    const re = new RegExp(find, 'g');
    templateString = templateString.replace(re, data[key]);
  }
  return templateString;
}

// Funzione per passare i risultati alla pagina di ricerca
function redirectToSearchPage(query, results) {
  // Converti i risultati in stringa JSON
  const resultsJson = JSON.stringify(results);
  // Codifica i risultati per l'URL
  const encodedResults = encodeURIComponent(resultsJson);
  // Reindirizza alla pagina di ricerca con i risultati
  window.location.href = `/search/?s=${encodeURIComponent(query)}&r=${encodedResults}`;
}

// Modifica la funzione di ricerca per utilizzare il reindirizzamento
function search(query) {
  if (query.length > 0) {
    fetch(indexURL)
      .then(response => response.json())
      .then(data => {
        var fuse = new Fuse(data, fuseOptions);
        var results = fuse.search(query);
        redirectToSearchPage(query, results);
      })
      .catch(error => {
        console.error('Error:', error);
        // In caso di errore, reindirizza comunque alla pagina di ricerca
        window.location.href = `/search/?s=${encodeURIComponent(query)}`;
      });
  }
}