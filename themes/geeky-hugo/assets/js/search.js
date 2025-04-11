// Newsletter subscription handler
function handleSubscribe(event) {
  event.preventDefault();
  const email = document.getElementById('newsletterEmail').value;
  const encodedEmail = encodeURIComponent(email);
  window.open(`https://vandipety.substack.com/subscribe?just_signed_up=true&skip_redirect_check=true&utm_medium=web&utm_source=embed&freeSignupEmail=${encodedEmail}`, '_blank');
}

// Add event listener when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const newsletterForm = document.querySelector('.newsletter-widget form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', handleSubscribe);
  }

  // Toggle search box
  const toggleSearch = document.querySelectorAll('.toggle-search');
  const searchWrap = document.getElementById('search-wrap');

  toggleSearch.forEach(function(button) {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const target = this.dataset.target;
      const element = document.querySelector(target);
      if (element) {
        element.classList.toggle('active');
        if (element.classList.contains('active')) {
          element.querySelector('input').focus();
        }
      }
    });
  });

  // Close search box when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('#search-wrap') && !e.target.closest('.toggle-search')) {
      if (searchWrap && searchWrap.classList.contains('active')) {
        searchWrap.classList.remove('active');
      }
    }
  });

  // Handle search form submission
  const searchForm = document.getElementById('search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      const searchQuery = document.getElementById('search-query').value.trim();
      if (!searchQuery) {
        e.preventDefault();
      }
    });
  }
}); 