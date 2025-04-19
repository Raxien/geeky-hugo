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
  // Inizializzazione dello swiper mobile per i post featured
  const featuredMobileSwiper = new Swiper('.featured-mobile-swiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    }
  });
});