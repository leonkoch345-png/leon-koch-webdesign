/* ============================================================
   Leon Koch Webdesign – main.js
   Scroll Reveals · Counter Animation · Header Scroll Effect
   ============================================================ */

(function () {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. Scroll Reveal (IntersectionObserver) ── */
  function initReveal() {
    if (reducedMotion) {
      // Skip animation, just make everything visible
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -48px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  /* ── 2. Auto-apply reveals + stagger to grid children ── */
  function applyRevealClasses() {
    // Section headings
    document.querySelectorAll(
      '.section-label, .section-title, .section-subtitle, ' +
      '.page-hero__title, .page-hero__subtitle, .page-hero__breadcrumb, ' +
      '.cta-section h2, .cta-section p'
    ).forEach(el => el.classList.add('reveal'));

    // Hero elements – staggered
    const heroContent = document.querySelector('.hero__content');
    if (heroContent) {
      [...heroContent.children].forEach((child, i) => {
        child.classList.add('reveal');
        if (!reducedMotion) child.style.transitionDelay = `${i * 90}ms`;
      });
    }
    const heroVisual = document.querySelector('.hero__visual');
    if (heroVisual) {
      heroVisual.classList.add('reveal', 'reveal--from-right');
      if (!reducedMotion) heroVisual.style.transitionDelay = '200ms';
    }

    // Card grids – staggered children
    document.querySelectorAll(
      '.card-grid, .feature-list, .service-detail, ' +
      '.competency-grid, .skills-grid, .values-grid, .stats-bar, .faq-list'
    ).forEach(grid => {
      [...grid.children].forEach((child, i) => {
        child.classList.add('reveal');
        if (!reducedMotion) child.style.transitionDelay = `${i * 70}ms`;
      });
    });

    // Timeline items
    document.querySelectorAll('.timeline__item').forEach((el, i) => {
      el.classList.add('reveal');
      if (!reducedMotion) el.style.transitionDelay = `${i * 110}ms`;
    });

    // Profile layout children
    document.querySelectorAll('.profile-layout > *, .contact-layout > *').forEach((el, i) => {
      el.classList.add('reveal');
      if (!reducedMotion) el.style.transitionDelay = `${i * 120}ms`;
    });

    // Service cards
    document.querySelectorAll('.service-card').forEach((el, i) => {
      el.classList.add('reveal');
      if (!reducedMotion) el.style.transitionDelay = `${i * 80}ms`;
    });

    // CTA button
    document.querySelectorAll('.cta-section .btn').forEach(el => {
      el.classList.add('reveal');
      if (!reducedMotion) el.style.transitionDelay = '200ms';
    });
  }

  /* ── 3. Animated Counters ── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.counter, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const startTime = performance.now();

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOutExpo(progress) * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  function initCounters() {
    if (reducedMotion) return;

    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }

  /* ── 4. Header: shadow on scroll ── */
  function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          header.classList.toggle('header--scrolled', window.scrollY > 12);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── 5. Active nav link highlight ── */
  function initActiveNav() {
    const currentFile = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__link:not(.nav__link--cta)').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentFile) link.classList.add('active');
    });
  }

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', () => {
    applyRevealClasses();
    initReveal();
    initCounters();
    initHeaderScroll();
    initActiveNav();
  });
})();
