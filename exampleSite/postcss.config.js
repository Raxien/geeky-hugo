// Attivo solo in produzione (vedi style.html: chiamato solo se hugo.IsProduction),
// così "hugo server" in locale resta veloce e non richiede hugo_stats.json aggiornato.
//
// Il contenuto da cui PurgeCSS estrae le classi "in uso" è hugo_stats.json (writeStats=true
// in config.toml): un solo file con tag/classi/id di TUTTE le pagine del sito, invece di dover
// scansionare ogni file in public/**/*.html. Va rigenerato ad ogni build prima che PostCSS giri
// (per questo style.html usa resources.PostProcess: PurgeCSS deve girare sul CSS DOPO che tutte
// le pagine sono state renderizzate e hugo_stats.json è completo, ma il fingerprint del file va
// comunque calcolato sul CSS finale — è esattamente il caso d'uso per cui esiste PostProcess).
const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = {
  plugins: [
    purgecss({
      content: ['./hugo_stats.json'],
      defaultExtractor: (content) => {
        const els = JSON.parse(content).htmlElements;
        return [
          ...(els.tags || []),
          ...(els.classes || []),
          ...(els.ids || []),
        ];
      },
      // Classi mai presenti nell'HTML statico perché aggiunte solo via JS a runtime
      // (accordion, toggle, banner libro, upload van, widget riassunto AI, ricerca).
      // Vedi rispettivamente: script.js, banner.html, expenses/van pages, search.js.
      safelist: [
        // toggle di stato generici
        'active', 'expanded', 'collapsed', 'show', 'open', 'rotated',
        'loading', 'typing', 'translated', 'offcanvas-open', 'dragover',
        // banner libro (banner.html)
        'book-banner-visible',
        // widget riassunto AI (script.js)
        'ai-summary-toggle', 'ai-summary-link', 'ai-summary-list', 'external',
        'button-text',
        // pulsante elimina riga spese (script.js)
        'btn-delete2',
        // spinner generico
        'spinner-border-sm',
        // risultati di ricerca renderizzati via innerHTML (search.js)
        'search-result-item', 'search-results-list', 'search-result-content',
        'search-result-image', 'search-result-text', 'search-more-results',
        'title', 'country', 'categories', 'excerpt',
      ],
    }),
  ],
};
