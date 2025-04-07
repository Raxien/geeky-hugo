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
}); 