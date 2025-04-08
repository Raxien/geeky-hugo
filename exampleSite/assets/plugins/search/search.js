// Debug: log quando il file viene caricato
console.log('Search.js loaded - Starting initialization');

// Debug: verifica se jQuery è disponibile
console.log('jQuery available:', typeof $ !== 'undefined');

// Debug: verifica se Fuse è disponibile
console.log('Fuse available:', typeof Fuse !== 'undefined');

// Debug: verifica se Mark è disponibile
console.log('Mark available:', typeof Mark !== 'undefined');

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

// Debug: log quando il file viene caricato
console.log('Search.js loaded');

function param(name) {
  const urlParams = new URLSearchParams(window.location.search);
  const value = urlParams.get(name) || '';
  console.log('Search parameter:', name, '=', value);
  return value;
}

var searchQuery = param("s");
console.log('Initial search query:', searchQuery);

if (searchQuery) {
  console.log('Executing search for:', searchQuery);
  $("#search-query").val(searchQuery);
  executeSearch(searchQuery);
}

function executeSearch(searchQuery) {
  console.log('Fetching index.json from:', indexURL);
  $.getJSON(indexURL, function (data) {
    console.log('Index.json loaded, data length:', data.length);
    var pages = data;
    var fuse = new Fuse(pages, fuseOptions);
    var result = fuse.search(searchQuery);
    console.log('Search results:', result.length);
    if (result.length > 0) {
      populateResults(result);
    } else {
      $('#search-results').append("<div class=\"text-center\"><img class=\"img-fluid mb-5\" src=\"https://res.cloudinary.com/ilgattodicitturin/image/upload/f_webp,q_auto:good,w_800,c_scale,dpr_auto/v1701789881/asset/not-found_nw9oea.png\" width=\"200\"><h3>Nessun risultato trovato</h3></div>");
    }
  }).fail(function(jqXHR, textStatus, errorThrown) {
    console.error('Error loading index.json:', textStatus, errorThrown);
  });
}

function populateResults(result) {
  $.each(result, function (key, value) {
    var contents = value.item.contents;
    var snippet = "";
    var snippetHighlights = [];
    if (fuseOptions.tokenize) {
      snippetHighlights.push(searchQuery);
    } else {
      $.each(value.matches, function (matchKey, mvalue) {
        if (mvalue.key === "tags" || mvalue.key === "categories") {
          snippetHighlights.push(mvalue.value);
        } else if (mvalue.key == "contents") {
          start = mvalue.indices[0][0] - summaryInclude > 0 ? mvalue.indices[0][0] - summaryInclude : 0;
          end = mvalue.indices[0][1] + summaryInclude < contents.length ? mvalue.indices[0][1] + summaryInclude : contents.length;
          snippet += contents.substring(start, end);
          snippetHighlights.push(mvalue.value.substring(mvalue.indices[0][0], mvalue.indices[0][1] - mvalue.indices[0][0] + 1));
        }
      });
    }

    if (snippet.length < 1) {
      snippet += contents.substring(0, summaryInclude * 2);
    }
    //pull template from hugo templarte definition
    var templateDefinition = $('#search-result-template').html();
    //replace values

    var output = render(templateDefinition, {
      key: key,
      title: value.item.title,
      image: value.item.image,
      date: value.item.date,
      link: value.item.permalink,
      tags: value.item.tags,
      categories: value.item.categories,

      categories0: [value.item.categories[0]],

      categories1: [value.item.categories[1]],
      visible1: value.item.categories[1] == undefined? "hide-li" : "",

      categories2: [value.item.categories[2]],
      visible2: value.item.categories[2] == undefined? "hide-li" : "",

      categories3: [value.item.categories[3]],
      visible3: value.item.categories[3] == undefined? "hide-li" : "",
      snippet: snippet
    });

    $('#search-results').append(output);

    $.each(snippetHighlights, function (snipkey, snipvalue) {
      $("#summary-" + key).mark(snipvalue);
    });
  });
}

function render(templateString, data) {
  var conditionalMatches, conditionalPattern, copy;
  conditionalPattern = /\$\{\s*isset ([a-zA-Z]*) \s*\}(.*)\$\{\s*end\s*}/g;
  //since loop below depends on re.lastInxdex, we use a copy to capture any manipulations whilst inside the loop
  copy = templateString;
  while ((conditionalMatches = conditionalPattern.exec(templateString)) !== null) {
    if (data[conditionalMatches[1]]) {
      //valid key, remove conditionals, leave contents.
      copy = copy.replace(conditionalMatches[0], conditionalMatches[2]);
    } else {
      //not valid, remove entire section
      copy = copy.replace(conditionalMatches[0], '');
    }
  }
  templateString = copy;
  //now any conditionals removed we can do simple substitution
  var key, find, re;
  for (key in data) {
    find = '\\$\\{\\s*' + key + '\\s*\\}';
    re = new RegExp(find, 'g');
    templateString = templateString.replace(re, data[key]);
  }
  return templateString;
}