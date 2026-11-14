/* ============================================
   NJ Developments, Main JS (v8)
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
  if (navbar) {
    const onScroll = () => {
      if (window.scrollY > 16) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- Scroll fade-in animations ---
  const faders = document.querySelectorAll('.fade-in');

  if (faders.length > 0 && 'IntersectionObserver' in window) {
    // Mark body so CSS hides fade-in items; without this, content stays visible
    // for no-JS / headless renderers.
    document.body.classList.add('js-ready');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -80px 0px'
    });

    faders.forEach(el => observer.observe(el));
  }

  // --- Contact form handling ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = contactForm.querySelector('[name="name"]');
      const email = contactForm.querySelector('[name="email"]');
      const message = contactForm.querySelector('[name="message"]');

      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        alert('Please fill in all required fields.');
        return;
      }

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
    overlay.innerHTML = '<div class="bcard-modal"><button class="bcard-close" aria-label="Close">&times;</button><img alt="Business Card"></div>';
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
  document.querySelectorAll('.nav-links a:not(.nav-cta)').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- FAQ accordion: smooth open/close on every click ---
  // Hijacks <summary> clicks and uses Web Animations API to animate the
  // <details> height. The native [open] toggle on closing immediately collapses
  // the content, so we run the close animation first then flip [open].
  document.querySelectorAll('.faq-item').forEach(item => {
    const summary = item.querySelector('summary');
    const wrap = item.querySelector('.faq-answer-wrap');
    if (!summary || !wrap) return;

    let animation = null;
    let isClosing = false;
    let isExpanding = false;

    function shrink() {
      isClosing = true;
      const startHeight = `${item.offsetHeight}px`;
      const endHeight = `${summary.offsetHeight}px`;
      if (animation) animation.cancel();
      animation = item.animate(
        { height: [startHeight, endHeight] },
        { duration: 380, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
      );
      animation.onfinish = () => finish(false);
      animation.oncancel = () => { isClosing = false; };
    }

    function expand() {
      isExpanding = true;
      const startHeight = `${item.offsetHeight}px`;
      const endHeight = `${summary.offsetHeight + wrap.offsetHeight}px`;
      if (animation) animation.cancel();
      animation = item.animate(
        { height: [startHeight, endHeight] },
        { duration: 380, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
      );
      animation.onfinish = () => finish(true);
      animation.oncancel = () => { isExpanding = false; };
    }

    function finish(openState) {
      item.open = openState;
      item.classList.remove('faq-animating');
      animation = null;
      isClosing = false;
      isExpanding = false;
      item.style.height = '';
      item.style.overflow = '';
    }

    summary.addEventListener('click', (e) => {
      e.preventDefault();
      if (isClosing || !item.open) {
        // Lock closed height *before* revealing the wrap, otherwise the
        // inline height we set would already include the expanded content.
        item.style.height = `${item.offsetHeight}px`;
        item.style.overflow = 'hidden';
        item.classList.add('faq-animating');
        item.open = true;
        requestAnimationFrame(expand);
      } else {
        item.style.overflow = 'hidden';
        item.classList.add('faq-animating');
        shrink();
      }
    });
  });

  // --- Mobile CTA bar: stay out of the way until the hero's own buttons scroll off ---
  const ctaBar = document.querySelector('.mobile-cta-bar');
  const heroButtons = document.querySelector('.hero-buttons');
  if (ctaBar && heroButtons && 'IntersectionObserver' in window) {
    ctaBar.classList.add('is-waiting');
    new IntersectionObserver(([entry]) => {
      ctaBar.classList.toggle('is-waiting', entry.isIntersecting || entry.boundingClientRect.top > 0);
    }).observe(heroButtons);
  }

  // --- Logo carousel: drifts on its own, drag or swipe to move it, stops while touched ---
  const marquee = document.getElementById('clientsWrapper');
  if (marquee) initLogoCarousel(marquee, document.querySelector('.marquee-toggle'));

});

function initLogoCarousel(wrapper, toggle) {
  const row = wrapper.querySelector('.marquee-row');
  const originals = Array.from(row.children);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const SPEED = 36;            // px per second while drifting
  const RESUME_AFTER = 2500;   // ms of no touching before it drifts again
  const FRICTION = 0.004;      // fling velocity left after one second

  let setWidth = 0, offset = 0, velocity = 0, rendered = NaN;
  let dragging = false, hovering = false, focused = false, inView = true;
  let userPaused = reduceMotion.matches;
  let resumeAt = 0, lastTime = 0;
  let pointerId = null, startX = 0, startOffset = 0, lastX = 0, lastMove = 0, moved = 0;

  originals.forEach(a => { a.draggable = false; });

  function build() {
    row.querySelectorAll('[data-clone]').forEach(n => n.remove());
    setWidth = row.getBoundingClientRect().width;
    if (!setWidth) return;
    const copies = Math.ceil(wrapper.clientWidth / setWidth) + 1;
    for (let c = 0; c < copies; c++) {
      originals.forEach(node => {
        const clone = node.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.tabIndex = -1;
        clone.dataset.clone = '';
        row.appendChild(clone);
      });
    }
    rendered = NaN;
    wrapper.classList.add('ready');
  }

  function wrap() {
    if (setWidth) offset = ((offset % setWidth) + setWidth) % setWidth;
  }

  function render() {
    wrap();
    if (offset === rendered) return;
    rendered = offset;
    row.style.transform = 'translate3d(' + (-offset).toFixed(2) + 'px,0,0)';
  }

  function drifting(now) {
    return !userPaused && !dragging && !hovering && !focused && inView && now >= resumeAt;
  }

  function tick(now) {
    const dt = lastTime ? Math.min(now - lastTime, 64) / 1000 : 0;
    lastTime = now;
    if (!dragging) {
      if (Math.abs(velocity) > 8) {
        offset += velocity * dt;
        velocity *= Math.pow(FRICTION, dt);
      } else {
        velocity = 0;
        if (drifting(now)) offset += SPEED * dt;
      }
    }
    render();
    requestAnimationFrame(tick);
  }

  wrapper.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragging = true;
    pointerId = e.pointerId;
    velocity = 0;
    startX = lastX = e.clientX;
    startOffset = offset;
    lastMove = performance.now();
    moved = 0;
  });

  wrapper.addEventListener('pointermove', e => {
    if (!dragging || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    moved = Math.max(moved, Math.abs(dx));
    if (moved > 5 && !wrapper.classList.contains('is-dragging')) {
      wrapper.classList.add('is-dragging');
      try { wrapper.setPointerCapture(e.pointerId); } catch (_) {}
    }
    const now = performance.now();
    const step = now - lastMove;
    if (step > 0) velocity = 0.75 * (-(e.clientX - lastX) / step * 1000) + 0.25 * velocity;
    lastX = e.clientX;
    lastMove = now;
    offset = startOffset - dx;
  });

  function release(e, fling) {
    if (!dragging || e.pointerId !== pointerId) return;
    dragging = false;
    pointerId = null;
    wrapper.classList.remove('is-dragging');
    if (!fling || performance.now() - lastMove > 90) velocity = 0;
    velocity = Math.max(-3000, Math.min(3000, velocity));
    resumeAt = performance.now() + RESUME_AFTER;
  }
  wrapper.addEventListener('pointerup', e => release(e, true));
  wrapper.addEventListener('pointercancel', e => release(e, false));

  // A drag that ends over a logo must not open that client's site.
  wrapper.addEventListener('click', e => {
    if (moved > 5) { e.preventDefault(); e.stopPropagation(); }
  }, true);

  wrapper.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') hovering = true; });
  wrapper.addEventListener('pointerleave', e => {
    if (e.pointerType === 'mouse') { hovering = false; resumeAt = performance.now() + 600; }
  });

  // Sideways trackpad swipes move it too; vertical wheel still scrolls the page.
  wrapper.addEventListener('wheel', e => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    velocity = 0;
    offset += e.deltaX;
    resumeAt = performance.now() + RESUME_AFTER;
  }, { passive: false });

  // Keyboard: stop and bring the focused logo into view.
  wrapper.addEventListener('focusin', e => {
    focused = true;
    const link = e.target.closest('a');
    if (!link) return;
    const left = link.offsetLeft - offset;
    if (left < 0 || left + link.offsetWidth > wrapper.clientWidth) {
      offset = link.offsetLeft - (wrapper.clientWidth - link.offsetWidth) / 2;
    }
  });
  wrapper.addEventListener('focusout', () => { focused = false; });
  wrapper.addEventListener('scroll', () => { wrapper.scrollLeft = 0; });

  if (toggle) {
    const sync = () => {
      toggle.setAttribute('aria-pressed', String(userPaused));
      toggle.setAttribute('aria-label', userPaused ? 'Play the client carousel' : 'Pause the client carousel');
    };
    toggle.addEventListener('click', () => {
      userPaused = !userPaused;
      resumeAt = 0;
      sync();
    });
    sync();
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { inView = entries[0].isIntersecting; }).observe(wrapper);
  }

  let resizeTimer, lastWidth = window.innerWidth;
  window.addEventListener('resize', () => {
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 150);
  });
  row.querySelectorAll('img').forEach(img => {
    if (!img.complete) img.addEventListener('load', build, { once: true });
  });

  build();
  requestAnimationFrame(tick);
}
