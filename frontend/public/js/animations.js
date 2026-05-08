(function () {
  'use strict';

  // ── Scroll reveal ─────────────────────────────────────────────────────────
  function initScrollReveal() {
    const els = document.querySelectorAll('[data-animate]');
    if (!els.length) return;
    if (!window.IntersectionObserver) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -52px 0px' }
    );
    els.forEach((el) => io.observe(el));
  }

  // ── Animated number counters ──────────────────────────────────────────────
  function animateCounter(el) {
    const raw = el.textContent.trim();
    const m = raw.match(/^([^0-9]*)([0-9,]+)(\+?)([^0-9]*)$/);
    if (!m) return;
    const prefix = m[1], target = parseInt(m[2].replace(/,/g, ''), 10), suffix = (m[3] || '') + (m[4] || '');
    const duration = 1800, start = performance.now();
    const fmt = (n) => n >= 1000 ? n.toLocaleString('en-CA') : String(n);
    (function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + fmt(Math.round(ease * target)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.classList.add('counted');
    })(start);
  }

  function initCounters() {
    const els = document.querySelectorAll('.tsrg-hero__stat-value');
    if (!els.length || !window.IntersectionObserver) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { animateCounter(e.target); io.unobserve(e.target); }
      }),
      { threshold: 0.5 }
    );
    els.forEach((el) => io.observe(el));
  }

  // ── Social proof toasts ───────────────────────────────────────────────────
  const PROOFS = [
    { name: 'Sarah M.',   city: 'Toronto',      action: 'just unlocked the exclusive list' },
    { name: 'David K.',   city: 'Mississauga',  action: 'requested foreclosure listings' },
    { name: 'Jennifer L.',city: 'Brampton',     action: 'scheduled a free consultation' },
    { name: 'Michael T.', city: 'Oakville',     action: 'just submitted their info' },
    { name: 'Priya S.',   city: 'Scarborough',  action: 'is viewing available listings' },
    { name: 'Robert C.',  city: 'North York',   action: 'just got access to the list' },
    { name: 'Amanda R.',  city: 'Etobicoke',    action: 'booked a property walkthrough' },
    { name: 'James W.',   city: 'Markham',      action: 'unlocked off-market deals' },
  ];

  function initToasts() {
    const toast = document.createElement('div');
    toast.className = 'tsrg-toast';
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = `
      <div class="tsrg-toast__icon">
        <span class="material-symbols-outlined" aria-hidden="true">person</span>
      </div>
      <div class="tsrg-toast__body">
        <div class="tsrg-toast__name"></div>
        <div class="tsrg-toast__action"></div>
      </div>`;
    document.body.appendChild(toast);

    const nameEl   = toast.querySelector('.tsrg-toast__name');
    const actionEl = toast.querySelector('.tsrg-toast__action');
    let idx = Math.floor(Math.random() * PROOFS.length);

    function show() {
      const p = PROOFS[idx % PROOFS.length]; idx++;
      nameEl.textContent   = p.name + ' from ' + p.city;
      actionEl.textContent = p.action;
      toast.classList.add('is-visible');
      setTimeout(() => toast.classList.remove('is-visible'), 4200);
    }

    // First toast after 8s, then every 22s
    setTimeout(() => { show(); setInterval(show, 22000); }, 8000);
  }

  // ── Navbar shadow on scroll ───────────────────────────────────────────────
  function initNavShadow() {
    const nav = document.querySelector('.tsrg-topbar');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      nav.classList.toggle('tsrg-topbar--scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  // ── Sticky bottom CTA bar (mobile) ────────────────────────────────────────
  function initStickyBar() {
    const bar = document.querySelector('.tsrg-sticky-bar');
    if (!bar) return;
    // Show after scrolling past hero
    const hero = document.querySelector('.tsrg-hero');
    if (!hero || !window.IntersectionObserver) return;
    const io = new IntersectionObserver(
      (entries) => bar.classList.toggle('is-visible', !entries[0].isIntersecting),
      { threshold: 0 }
    );
    io.observe(hero);
  }

  // ── Form progress bar ─────────────────────────────────────────────────────
  function initFormProgress() {
    const form = document.querySelector('.tsrg-lead-form');
    if (!form) return;
    const wrap = document.createElement('div');
    wrap.className = 'tsrg-form-progress';
    const bar = document.createElement('div');
    bar.className = 'tsrg-form-progress__bar';
    wrap.appendChild(bar);
    form.insertBefore(wrap, form.firstChild);
    const fields = Array.from(
      form.querySelectorAll('input:not([type="hidden"]):not([type="checkbox"]), select, textarea')
    );
    const update = () => {
      const pct = fields.length ? (fields.filter((f) => f.value.trim()).length / fields.length) * 100 : 0;
      bar.style.width = pct + '%';
    };
    form.addEventListener('input', update);
    form.addEventListener('change', update);
  }

  // ── Ripple on click ───────────────────────────────────────────────────────
  function initRipple() {
    document.querySelectorAll('.tsrg-cta-primary, .tsrg-submit, .tsrg-sticky-bar__cta').forEach((btn) => {
      btn.style.position = btn.style.position || 'relative';
      btn.style.overflow = 'hidden';
      btn.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const r = document.createElement('span');
        r.className = 'tsrg-ripple';
        r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
        this.appendChild(r);
        setTimeout(() => r.remove(), 620);
      });
    });
  }

  // ── Countdown timer ───────────────────────────────────────────────────────
  function initCountdown() {
    const el = document.getElementById('tsrg-countdown-display');
    if (!el) return;
    const KEY = 'tsrg_countdown_end';
    let end = parseInt(sessionStorage.getItem(KEY) || '0', 10);
    if (!end || end < Date.now()) {
      // Random between 18–23 hours so it looks organic
      end = Date.now() + (18 + Math.random() * 5) * 3600 * 1000;
      sessionStorage.setItem(KEY, String(end));
    }
    function tick() {
      const diff = Math.max(0, end - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      el.textContent =
        String(h).padStart(2,'0') + ':' +
        String(m).padStart(2,'0') + ':' +
        String(s).padStart(2,'0');
      if (diff > 0) setTimeout(tick, 1000);
    }
    tick();
  }

  // ── Live viewer count (social proof on listing gate) ──────────────────────
  function initViewerCount() {
    const el = document.getElementById('tsrg-viewing-count');
    if (!el) return;
    let count = 8 + Math.floor(Math.random() * 12);
    el.textContent = count + ' people';
    setInterval(() => {
      const delta = Math.random() < 0.5 ? 1 : -1;
      count = Math.max(4, Math.min(28, count + delta));
      el.textContent = count + ' people';
    }, 11000);
  }

  // ── Exit-intent popup ─────────────────────────────────────────────────────
  function initExitIntent() {
    const popup   = document.getElementById('tsrg-exit');
    const close   = document.getElementById('tsrg-exit-close');
    const backdrop = document.querySelector('.tsrg-exit__backdrop');
    if (!popup) return;

    let shown = sessionStorage.getItem('tsrg_exit_shown');
    if (shown) return;

    function show() {
      if (sessionStorage.getItem('tsrg_exit_shown')) return;
      sessionStorage.setItem('tsrg_exit_shown', '1');
      popup.hidden = false;
      document.body.style.overflow = 'hidden';
    }
    function hide() {
      popup.hidden = true;
      document.body.style.overflow = '';
    }

    // Desktop: mouse leaves toward top of viewport
    document.addEventListener('mouseleave', (e) => {
      if (e.clientY < 8) show();
    });
    // Mobile: scroll back to top quickly (bounce pattern)
    let lastY = window.scrollY, ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      setTimeout(() => {
        const y = window.scrollY;
        if (lastY - y > 180 && y < 200) show();
        lastY = y;
        ticking = false;
      }, 100);
    }, { passive: true });

    close && close.addEventListener('click', hide);
    backdrop && backdrop.addEventListener('click', hide);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hide(); });

    // CTA inside popup closes it and scrolls to form
    popup.querySelectorAll('a[href="#lead-form"]').forEach((a) => {
      a.addEventListener('click', () => { hide(); });
    });
  }

  // ── Cookie consent ────────────────────────────────────────────────────────
  function initCookieConsent() {
    const banner  = document.getElementById('tsrg-cookie');
    const accept  = document.getElementById('tsrg-cookie-accept');
    const decline = document.getElementById('tsrg-cookie-decline');
    if (!banner) return;
    if (localStorage.getItem('tsrg_cookie')) return;
    setTimeout(() => banner.classList.add('is-visible'), 1800);
    function dismiss(val) {
      localStorage.setItem('tsrg_cookie', val);
      banner.classList.remove('is-visible');
      setTimeout(() => banner.classList.add('is-hidden'), 500);
    }
    accept  && accept.addEventListener('click',  () => dismiss('accepted'));
    decline && decline.addEventListener('click', () => dismiss('declined'));
  }

  // ── FAQ accordion smooth-height ───────────────────────────────────────────
  function initFaqAccordion() {
    document.querySelectorAll('.tsrg-faq-item').forEach((item) => {
      item.addEventListener('toggle', () => {
        // Close siblings
        if (item.open) {
          document.querySelectorAll('.tsrg-faq-item[open]').forEach((other) => {
            if (other !== item) other.open = false;
          });
        }
      });
    });
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initCounters();
    initNavShadow();
    initStickyBar();
    initFormProgress();
    initRipple();
    initCountdown();
    initViewerCount();
    initFaqAccordion();
    initCookieConsent();
    setTimeout(initToasts, 500);
    setTimeout(initExitIntent, 1000);
  });
})();
