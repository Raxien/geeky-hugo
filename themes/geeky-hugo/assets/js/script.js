// Configurazione base per Terser
const terserConfig = {
  compress: {
    drop_console: true,
    drop_debugger: true,
    pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn']
  },
  mangle: {
    toplevel: true
  },
  format: {
    comments: false
  }
};

// Funzione per minificare il codice
function minifyCode(code) {
  return Terser.minify(code, terserConfig).code;
}

// Funzionalità per la tabella dei contenuti
function initTableOfContents() {
  const toggleButton = document.querySelector('.table-of-contents-toggle');
  const blockquote = document.querySelector('.table-of-contents-blockquote');
  
  if (toggleButton && blockquote) {
    toggleButton.addEventListener('click', function() {
      blockquote.classList.toggle('collapsed');
    });
  }
}

// Esempio di utilizzo
document.addEventListener('DOMContentLoaded', function() {
  // Il tuo codice qui
  console.log('Script caricato e minificato con Terser');
  
  // Inizializza la tabella dei contenuti
  initTableOfContents();
}); 