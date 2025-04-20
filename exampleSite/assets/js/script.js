// Passive event listeners
jQuery.event.special.touchstart = {
  setup: function (_, ns, handle) {
    'use strict';
    this.addEventListener('touchstart', handle, {
      passive: !ns.includes('noPreventDefault')
    });
  }
};
jQuery.event.special.touchmove = {
  setup: function (_, ns, handle) {
    'use strict';
    this.addEventListener('touchmove', handle, {
      passive: !ns.includes('noPreventDefault')
    });
  }
};

// Preloader js
$(window).on('load', function () {
  'use strict';
  $('.preloader').fadeOut(0);
});

// on ready state
$(document).ready(function () {
  'use strict';

  // search-toggle
  $('.toggle-search').on('click', function () {
    var targetId = $(this).data('target');
    var $searchBar;
    if (targetId) {
      $searchBar = $(targetId);
      $searchBar.toggleClass('open');
    }

    setTimeout(() => {
      document.getElementById("search-query").focus();
    }, "100")

  });

  // tab
  $('.tab-content').find('.tab-pane').each(function (idx, item) {
    var navTabs = $(this).closest('.code-tabs').find('.nav-tabs'),
      title = $(this).attr('title');
    navTabs.append('<li class="nav-item"><a class="nav-link" href="#">' + title + '</a></li>');
  });

  $('.code-tabs ul.nav-tabs').each(function () {
    $(this).find("li:first").addClass('active');
  })

  $('.code-tabs .tab-content').each(function () {
    $(this).find("div:first").addClass('active');
  });

  $('.nav-tabs a').click(function (e) {
    e.preventDefault();
    var tab = $(this).parent(),
      tabIndex = tab.index(),
      tabPanel = $(this).closest('.code-tabs'),
      tabPane = tabPanel.find('.tab-pane').eq(tabIndex);
    tabPanel.find('.active').removeClass('active');
    tab.addClass('active');
    tabPane.addClass('active');
  });

  // Accordions
  $('.collapse').on('shown.bs.collapse', function () {
    $(this).parent().find('.fas fa-plus').removeClass('fas fa-plus').addClass('fas fa-minus');
  }).on('hidden.bs.collapse', function () {
    $(this).parent().find('.fas fa-minus').removeClass('fas fa-minus').addClass('fas fa-plus');
  });

}); 

document.addEventListener('DOMContentLoaded', function() {
  const slider = document.querySelector('.guides-slider');
  
  // Se lo slider non esiste, esci dalla funzione
  if (!slider) return;
  
  const wrapper = slider.querySelector('.guides-wrapper');
  const slides = wrapper.querySelectorAll('.guide-slide');
  const prevButton = slider.querySelector('.nav-button.prev');
  const nextButton = slider.querySelector('.nav-button.next');
  let currentSlide = 0;
  let touchStartX = 0;
  let touchEndX = 0;
  let autoSlideInterval;

  // Carica le immagini
  function loadImages() {
    const images = wrapper.querySelectorAll('img[data-src]');
    images.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.addEventListener('load', () => {
          img.classList.add('loaded');
        });
      }
    });
  }

  // Funzione per spostare le slide
  function moveSlide(direction) {
    if (direction === 'next') {
      currentSlide = (currentSlide + 1) % slides.length;
    } else {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    }
    wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
  }

  // Gestione touch per mobile
  function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
  }

  function handleTouchMove(e) {
    touchEndX = e.touches[0].clientX;
  }

  function handleTouchEnd() {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) { // Soglia minima per lo swipe
      if (diff > 0) {
        moveSlide('next');
      } else {
        moveSlide('prev');
      }
    }
  }

  // Inizializza l'autoplay
  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      moveSlide('next');
    }, 5000);
  }

  // Event listeners
  prevButton.addEventListener('click', () => moveSlide('prev'));
  nextButton.addEventListener('click', () => moveSlide('next'));

  slider.addEventListener('touchstart', handleTouchStart);
  slider.addEventListener('touchmove', handleTouchMove);
  slider.addEventListener('touchend', handleTouchEnd);

  // Inizializzazione
  loadImages();
  startAutoSlide();

  // Pausa autoplay quando il mouse è sopra lo slider
  slider.addEventListener('mouseenter', () => {
    clearInterval(autoSlideInterval);
  });

  slider.addEventListener('mouseleave', () => {
    startAutoSlide();
  });
});