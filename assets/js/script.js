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

// import * as sw from 'splitwise'
// const sw = {
//   consumerKey: 'bJl0JT47tbXqIS6rzTmsXdWUVU30jrYhJ6sJE5ZP',
//   consumerSecret: '5ksmLPcnD7tyZHp0SLkOCO7y8XJzo57yCUrvvm11'
// }
// console.log(sw);

});




// var getUser = function() {
//   $.ajax({
//     url: "https://secure.splitwise.com/api/v3.0/get_current_user",
//     type: 'GET',
//     dataType: 'json', // added data type
//     success: function(res) {
//         console.log(res);
//         alert(res);
//     }
// });

// let data = {};
// $.ajax({
//   url: "https://secure.splitwise.com/api/v3.0/get_current_user",
//   type: "GET",
//   crossDomain: true,
//   data: JSON.stringify(data),
//   dataType: "json",
//   success: function (response) {
//       var resp = JSON.parse(response)
//       alert(resp.status);
//   },
//   error: function (xhr, status) {
//       console.log("error");
//   }
// });

// };

// getUser();