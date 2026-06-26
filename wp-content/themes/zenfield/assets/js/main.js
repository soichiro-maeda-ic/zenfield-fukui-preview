/* =============================================================
   ZEN Field — minimal interactions
   ============================================================= */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Scroll reveal -------------------------------------------- */
  const reveals = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = parseInt(el.dataset.delay || '0', 10);
          if (delay) {
            setTimeout(() => el.classList.add('is-visible'), delay);
          } else {
            el.classList.add('is-visible');
          }
          io.unobserve(el);
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -6% 0px' }
    );
    reveals.forEach((el) => io.observe(el));
  }

  /* --- Nav state (transparent over hero → solid on scroll) ----- */
  const nav = document.getElementById('nav');
  const hero = document.getElementById('hero');

  if (nav && hero) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            nav.classList.remove('is-stuck');
          } else {
            nav.classList.add('is-stuck');
          }
        });
      },
      { threshold: 0, rootMargin: '-66px 0px 0px 0px' }
    );
    navObserver.observe(hero);
  } else if (nav) {
    nav.classList.add('is-stuck');
  }

  /* --- Mobile menu --------------------------------------------- */
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.querySelector('.nav__menu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });

    menu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }
})();

/* =============================================================
   メンバープロフィールモーダル
   ============================================================= */
(function () {
  function openModal(modal) {
    modal.classList.add('is-open');
    document.body.classList.add('modal-open');
    // 閉じるボタンにフォーカス（アクセシビリティ）
    const closeBtn = modal.querySelector('.member-modal__close');
    if (closeBtn) closeBtn.focus();
  }
  function closeModal(modal) {
    modal.classList.remove('is-open');
    document.body.classList.remove('modal-open');
  }
  function closeAll() {
    document.querySelectorAll('.member-modal.is-open').forEach(closeModal);
  }

  // トリガークリック → 対応モーダルを開く
  document.addEventListener('click', function (e) {
    const trigger = e.target.closest('.member-trigger');
    if (trigger) {
      const id = trigger.dataset.target;
      if (!id) return;
      const modal = document.getElementById(id);
      if (modal) openModal(modal);
      return;
    }
    // backdrop or 閉じるボタン
    if (e.target.matches('.member-modal__backdrop, .member-modal__close')) {
      const modal = e.target.closest('.member-modal');
      if (modal) closeModal(modal);
    }
  });

  // ESCで閉じる
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll();
  });
})();
