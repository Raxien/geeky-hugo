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

// Ottimizzazioni per Core Web Vitals
class PerformanceOptimizer {
  constructor() {
    this.observer = null;
    this.init();
  }

  init() {
    // Lazy loading delle immagini
    this.initLazyLoading();
    
    // Intersection Observer per elementi non critici
    this.initIntersectionObserver();
    
    // Preload intelligente delle risorse
    this.initSmartPreloading();
    
    // Gestione del preloader
    this.handlePreloader();
  }

  // Lazy loading delle immagini
  initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.remove('lazy');
              observer.unobserve(img);
            }
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // Intersection Observer per elementi non critici
  initIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target;
            if (element.dataset.load) {
              this.loadDeferredContent(element);
            }
          }
        });
      }, {
        rootMargin: '50px'
      });

      // Osserva elementi con data-load
      document.querySelectorAll('[data-load]').forEach(el => {
        this.observer.observe(el);
      });
    }
  }

  // Caricamento intelligente del contenuto differito
  loadDeferredContent(element) {
    const loadType = element.dataset.load;
    
    switch (loadType) {
      case 'font-awesome':
        this.loadFontAwesome();
        break;
      case 'analytics':
        this.loadAnalytics();
        break;
      case 'social-widgets':
        this.loadSocialWidgets();
        break;
    }
    
    element.removeAttribute('data-load');
  }

  // Caricamento asincrono di Font Awesome
  loadFontAwesome() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/plugins/font-awesome/fontawesome.min.css';
    document.head.appendChild(link);
  }

  // Caricamento asincrono di Analytics
  loadAnalytics() {
    // Carica Google Analytics solo quando necessario
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID');
    }
  }

  // Caricamento asincrono di widget social
  loadSocialWidgets() {
    // Carica widget social solo quando visibili
    if (typeof twttr !== 'undefined') {
      twttr.widgets.load();
    }
  }

  // Preload intelligente delle risorse
  initSmartPreloading() {
    // Preload delle pagine più visitate
    this.preloadCriticalPages();
    
    // Preload delle immagini critiche
    this.preloadCriticalImages();
  }

  // Preload delle pagine critiche
  preloadCriticalPages() {
    const criticalPages = ['/about', '/contact', '/blog'];
    
    criticalPages.forEach(page => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = page;
      document.head.appendChild(link);
    });
  }

  // Preload delle immagini critiche
  preloadCriticalImages() {
    const criticalImages = [
      '/images/logo.png',
      '/images/banner.png'
    ];
    
    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }

  // Gestione del preloader
  handlePreloader() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
      // Nascondi il preloader quando la pagina è caricata
      window.addEventListener('load', () => {
        setTimeout(() => {
          preloader.style.opacity = '0';
          setTimeout(() => {
            preloader.style.display = 'none';
          }, 300);
        }, 500);
      });
    }
  }
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

// Ottimizzazioni per il rendering
function optimizeRendering() {
  // Forza il reflow per evitare layout shift
  document.body.offsetHeight;
  
  // Aggiungi classi per animazioni
  document.body.classList.add('loaded');
  
  // Inizializza componenti non critici
  initNonCriticalComponents();
}

// Inizializzazione componenti non critici
function initNonCriticalComponents() {
  // Carica componenti solo quando necessario
  requestIdleCallback(() => {
    // Inizializza tooltip, popover, etc.
    if (typeof bootstrap !== 'undefined') {
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
      });
    }
  });
}

// Inizializzazione quando il DOM è pronto
document.addEventListener('DOMContentLoaded', function() {
  // Inizializza l'ottimizzatore di performance
  new PerformanceOptimizer();
  
  // Ottimizza il rendering
  optimizeRendering();
  
  // Inizializza la tabella dei contenuti
  initTableOfContents();
  
  // Log di conferma
  console.log('Script ottimizzato caricato con gestione performance avanzata');
});

// Gestione degli errori di caricamento
window.addEventListener('error', function(e) {
  console.error('Errore di caricamento risorsa:', e.target.src || e.target.href);
});

// Gestione della visibilità della pagina
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    // Pausa operazioni non critiche quando la pagina non è visibile
    document.body.classList.add('page-hidden');
  } else {
    // Riprendi operazioni quando la pagina torna visibile
    document.body.classList.remove('page-hidden');
  }
}); 