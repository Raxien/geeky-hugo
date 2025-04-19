// Passive event listeners
document.addEventListener('touchstart', function(e) {
  if (e.target.closest('.noPreventDefault')) return;
  e.preventDefault();
}, { passive: false });

document.addEventListener('touchmove', function(e) {
  if (e.target.closest('.noPreventDefault')) return;
  e.preventDefault();
}, { passive: false });

// Preloader
window.addEventListener('load', function() {
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    preloader.style.display = 'none';
  }
});

// Search toggle
document.addEventListener('DOMContentLoaded', function() {
  const searchToggle = document.querySelector('.toggle-search');
  if (searchToggle) {
    searchToggle.addEventListener('click', function() {
      const targetId = this.dataset.target;
      const searchBar = document.querySelector(targetId);
      if (searchBar) {
        searchBar.classList.toggle('open');
        setTimeout(() => {
          document.getElementById('search-query').focus();
        }, 100);
      }
    });
  }

  // Tab functionality
  document.querySelectorAll('.tab-content .tab-pane').forEach(pane => {
    const title = pane.getAttribute('title');
    const navTabs = pane.closest('.code-tabs').querySelector('.nav-tabs');
    if (navTabs) {
      const li = document.createElement('li');
      li.className = 'nav-item';
      li.innerHTML = `<a class="nav-link" href="#">${title}</a>`;
      navTabs.appendChild(li);
    }
  });

  // Set first tab as active
  document.querySelectorAll('.code-tabs ul.nav-tabs').forEach(tabs => {
    tabs.querySelector('li').classList.add('active');
  });

  document.querySelectorAll('.code-tabs .tab-content').forEach(content => {
    content.querySelector('div').classList.add('active');
  });

  // Tab click handler
  document.querySelectorAll('.nav-tabs a').forEach(tab => {
    tab.addEventListener('click', function(e) {
      e.preventDefault();
      const tab = this.parentElement;
      const tabIndex = Array.from(tab.parentElement.children).indexOf(tab);
      const tabPanel = tab.closest('.code-tabs');
      const tabPane = tabPanel.querySelectorAll('.tab-pane')[tabIndex];

      tabPanel.querySelectorAll('.active').forEach(el => el.classList.remove('active'));
      tab.classList.add('active');
      tabPane.classList.add('active');
    });
  });

  // Accordion
  document.querySelectorAll('.collapse').forEach(collapse => {
    collapse.addEventListener('shown.bs.collapse', function() {
      const icon = this.parentElement.querySelector('.fas.fa-plus');
      if (icon) {
        icon.classList.remove('fas', 'fa-plus');
        icon.classList.add('fas', 'fa-minus');
      }
    });

    collapse.addEventListener('hidden.bs.collapse', function() {
      const icon = this.parentElement.querySelector('.fas.fa-minus');
      if (icon) {
        icon.classList.remove('fas', 'fa-minus');
        icon.classList.add('fas', 'fa-plus');
      }
    });
  });

  // Swiper initialization
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

  // Load more posts
  const loadMoreButton = document.getElementById('loadMore');
  if (loadMoreButton) {
    loadMoreButton.addEventListener('click', async function() {
      const nextUrl = this.dataset.nextUrl;
      if (!nextUrl) return;

      this.disabled = true;
      this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
      this.style.backgroundColor = '#15817f';

      try {
        const response = await fetch(nextUrl);
        const html = await response.text();
        const temp = document.createElement('div');
        temp.innerHTML = html;

        const newPosts = temp.querySelector('.row.mx-0.g-5');
        const currentPosts = document.querySelector('.row.mx-0.g-5');

        if (newPosts && currentPosts) {
          currentPosts.innerHTML += newPosts.innerHTML;
        }

        const newNextUrl = temp.querySelector('#loadMore')?.dataset.nextUrl;
        if (newNextUrl) {
          this.dataset.nextUrl = newNextUrl;
        } else {
          this.remove();
        }
      } catch (error) {
        console.error('Errore nel caricamento dei post:', error);
        this.innerHTML = 'Errore nel caricamento';
      } finally {
        this.disabled = false;
        this.innerHTML = 'Mostra altro';
        this.style.backgroundColor = '#15817f';
      }
    });
  }
});