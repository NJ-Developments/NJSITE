/* ============================================
   NJ Developments — Main JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Page load fade-in ---
  document.body.classList.add('loaded');

  // --- Scroll progress bar ---
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });

  // --- Parallax on hero/page headers (desktop only, respects reduced motion) ---
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;
  const parallaxEls = document.querySelectorAll('.hero, .page-header');
  if (parallaxEls.length > 0 && !prefersReducedMotion && !isMobile) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      parallaxEls.forEach(el => {
        if (scrollY < el.offsetHeight + el.offsetTop) {
          const content = el.querySelector('.container');
          if (content) {
            content.style.transform = 'translateY(' + (scrollY * 0.25) + 'px)';
            content.style.opacity = Math.max(1 - scrollY / (el.offsetHeight * 1.2), 0);
          }
        }
      });
    }, { passive: true });
  }

  // --- Button ripple effect ---
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });

  // --- Mobile Navigation ---
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.classList.toggle('nav-open');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.classList.remove('nav-open');
      });
    });
  }

  // --- Navbar scroll effect ---
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // --- Scroll fade-in animations ---
  const faders = document.querySelectorAll('.fade-in');

  if (faders.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    faders.forEach(el => observer.observe(el));
  }

  // --- Contact form handling ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic validation
      const name = contactForm.querySelector('[name="name"]');
      const email = contactForm.querySelector('[name="email"]');
      const message = contactForm.querySelector('[name="message"]');

      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        alert('Please fill in all required fields.');
        return;
      }

      // Show success message (replace with real form submission)
      const successMsg = document.querySelector('.form-success');
      if (successMsg) {
        successMsg.classList.add('show');
        contactForm.reset();

        setTimeout(() => {
          successMsg.classList.remove('show');
        }, 5000);
      }
    });
  }

  // --- Business card modal (only on pages with founder cards) ---
  const founderBtns = document.querySelectorAll('.founder-card-btn');
  if (founderBtns.length > 0) {
    const overlay = document.createElement('div');
    overlay.className = 'bcard-overlay';
    overlay.innerHTML = '<div class="bcard-modal"><button class="bcard-close" aria-label="Close">&times;</button><img src="" alt="Business Card"></div>';
    document.body.appendChild(overlay);

    const modalImg = overlay.querySelector('.bcard-modal img');
    const closeBtn = overlay.querySelector('.bcard-close');

    function openCardModal(imgSrc, altText) {
      modalImg.src = imgSrc;
      modalImg.alt = altText;
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeCardModal() {
      overlay.classList.remove('open');
      modalImg.src = '';
      document.body.style.overflow = '';
    }

    founderBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cardId = btn.getAttribute('data-card');
        const card = document.getElementById('card-' + cardId);
        const img = card.querySelector('img');
        openCardModal(img.src, img.alt);
      });
    });

    closeBtn.addEventListener('click', closeCardModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeCardModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeCardModal();
    });
  }

  // --- Multi-select dropdown ---
  const multiSelect = document.getElementById('service-select');
  if (multiSelect) {
    const trigger = multiSelect.querySelector('.multi-select-trigger');
    const checkboxes = multiSelect.querySelectorAll('input[type="checkbox"]');

    function updateTriggerText() {
      const selected = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.nextElementSibling.textContent);
      const placeholder = trigger.querySelector('.multi-select-placeholder');
      const existingTags = trigger.querySelector('.multi-select-tags');
      if (existingTags) existingTags.remove();
      if (placeholder) placeholder.remove();

      if (selected.length === 0) {
        const span = document.createElement('span');
        span.className = 'multi-select-placeholder';
        span.textContent = 'Select services...';
        trigger.insertBefore(span, trigger.querySelector('.multi-select-arrow'));
      } else {
        const tagsDiv = document.createElement('div');
        tagsDiv.className = 'multi-select-tags';
        selected.forEach(name => {
          const tag = document.createElement('span');
          tag.className = 'multi-select-tag';
          tag.textContent = name;
          tagsDiv.appendChild(tag);
        });
        trigger.insertBefore(tagsDiv, trigger.querySelector('.multi-select-arrow'));
      }
    }

    trigger.addEventListener('click', () => {
      multiSelect.classList.toggle('open');
    });

    checkboxes.forEach(cb => {
      cb.addEventListener('change', updateTriggerText);
    });

    document.addEventListener('click', (e) => {
      if (!multiSelect.contains(e.target)) {
        multiSelect.classList.remove('open');
      }
    });
  }

  // --- Active nav link ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a:not(.btn)').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- Logo marquee ---
  const marqueeWrapper = document.getElementById('clientsWrapper');
  if (marqueeWrapper) {
    const row = document.getElementById('clientsTrackTop');
    const rows = [row];
    const imgs = marqueeWrapper.querySelectorAll('img');

    function startMarquee() {
      rows.forEach(r => r.classList.add('running'));
      marqueeWrapper.classList.add('ready');
    }

    // Wait for all images to load, then start (with 4s safety timeout)
    const imgPromises = Array.from(imgs).map(img => new Promise(resolve => {
      if (img.complete && img.naturalWidth) resolve();
      else {
        img.addEventListener('load', resolve);
        img.addEventListener('error', resolve);
      }
    }));
    Promise.all(imgPromises).then(startMarquee);
    setTimeout(startMarquee, 4000);

    // Pause on press (mouse + touch)
    const pause = () => rows.forEach(r => r.classList.add('paused'));
    const resume = () => rows.forEach(r => r.classList.remove('paused'));
    marqueeWrapper.addEventListener('mousedown', pause);
    marqueeWrapper.addEventListener('mouseup', resume);
    marqueeWrapper.addEventListener('mouseleave', resume);
    marqueeWrapper.addEventListener('touchstart', pause, { passive: true });
    marqueeWrapper.addEventListener('touchend', resume);
    marqueeWrapper.addEventListener('touchcancel', resume);
  }

});
