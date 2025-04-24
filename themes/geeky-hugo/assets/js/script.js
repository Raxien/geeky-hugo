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

// Esempio di utilizzo
document.addEventListener('DOMContentLoaded', function() {
  // Il tuo codice qui
  console.log('Script caricato e minificato con Terser');
}); 