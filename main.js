// Sieracki Consulting — main.js

// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  // Close nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// Navbar shadow on scroll
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 10
      ? '0 2px 16px rgba(62,47,28,0.1)'
      : 'none';
  });
}

// Contact form (static — replace with your backend/Formspree/Netlify Forms endpoint)
function handleSubmit(e) {
  e.preventDefault();
  const status = document.getElementById('form-status');
  status.textContent = 'Thank you — your message has been sent. We\'ll be in touch soon.';
  e.target.reset();
}

// Fade-in on scroll (simple IntersectionObserver)
const fadeEls = document.querySelectorAll('.service-card, .map-item, .map-preview-card, .value-item');
if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    obs.observe(el);
  });
}
