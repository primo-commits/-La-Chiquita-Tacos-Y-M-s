/* La Chiquita Tacos Y Más — site app (hash router, menu, pickup ordering, kitchen demo) */
(function () {
  'use strict';

  const B = LC.BUSINESS;
  const MENU = LC.MENU;
  const CATS = LC.CATEGORIES;
  const byId = Object.fromEntries(MENU.map(m => [m.id, m]));
  const app = document.getElementById('app');
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // Asset paths can be remapped (the single-file preview maps them to embedded blobs)
  const asset = p => (window.LC_ASSETS && window.LC_ASSETS[p]) || p;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- storage (falls back to memory when blocked) ---------- */
  const mem = {};
  const store = {
    get(k, d) {
      try { const v = localStorage.getItem(k); if (v != null) return JSON.parse(v); } catch (e) { /* blocked */ }
      return k in mem ? mem[k] : d;
    },
    set(k, v) {
      mem[k] = v;
      try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* blocked */ }
    },
  };

  /* ---------- i18n ---------- */
  const state = {
    lang: store.get('lc_lang', (navigator.language || 'en').toLowerCase().startsWith('fr') ? 'fr' : 'en'),
    cart: store.get('lc_cart', []),
    route: '',
  };
  const t = (k, vars) => {
    let s = (LC.STR[state.lang] && LC.STR[state.lang][k]) ?? LC.STR.en[k] ?? k;
    if (vars && typeof s === 'string') for (const [a, b] of Object.entries(vars)) s = s.split('{' + a + '}').join(b);
    return s;
  };
  const L = o => (o && (o[state.lang] || o.en)) || '';
  const locale = () => (state.lang === 'fr' ? 'fr-CA' : 'en-CA');
  const money = n => new Intl.NumberFormat(locale(), { style: 'currency', currency: 'CAD' }).format(n);

  /* ---------- hours ---------- */
  const DAY_SHORT = { en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], fr: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'] };
  const fmtTime = d => d.toLocaleTimeString(locale(), { hour: 'numeric', minute: '2-digit' });
  const shortHour = h => state.lang === 'fr' ? h + ' h' : (h % 12 || 12) + (h < 12 ? 'am' : 'pm');
  const atHour = (base, h, m = 0) => { const d = new Date(base); d.setHours(h, m, 0, 0); return d; };
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); x.setHours(0, 0, 0, 0); return x; };

  function dayLabel(d) {
    const today = addDays(new Date(), 0);
    const diff = Math.round((addDays(d, 0) - today) / 864e5);
    if (diff === 0) return t('today');
    if (diff === 1) return t('tomorrow');
    return t('days')[d.getDay()];
  }
  function openStatus(now = new Date()) {
    const h = B.hours[now.getDay()];
    if (h) {
      const open = atHour(now, h[0]), close = atHour(now, h[1]);
      if (now >= open && now < close) return { open: true, close };
    }
    for (let i = 0; i < 8; i++) {
      const d = addDays(now, i), hh = B.hours[d.getDay()];
      if (!hh) continue;
      const open = atHour(d, hh[0]);
      if (open > now) return { open: false, next: open };
    }
    return { open: false };
  }
  function statusText() {
    const s = openStatus();
    if (s.open) return { cls: 'open', text: t('status.open') + ' · ' + t('status.closesAt', { t: fmtTime(s.close) }) };
    return { cls: 'closed', text: t('status.closed') + (s.next ? ' · ' + t('status.opens', { d: dayLabel(s.next).toLowerCase(), t: fmtTime(s.next) }) : '') };
  }
  function hoursSummary() {
    const groups = [];
    for (let d = 1; d <= 7; d++) {
      const day = d % 7, h = B.hours[day];
      if (!h) continue;
      const last = groups[groups.length - 1];
      if (last && last.h.join() === h.join() && last.to === (day + 6) % 7) last.to = day;
      else groups.push({ from: day, to: day, h });
    }
    const ds = DAY_SHORT[state.lang];
    return groups.map(g => (g.from === g.to ? ds[g.from] : ds[g.from] + '–' + ds[g.to]) + ' ' + shortHour(g.h[0]) + '–' + shortHour(g.h[1])).join(' · ');
  }
  function pickupSlots() {
    const now = new Date(), earliest = new Date(now.getTime() + B.prepMinutes * 60e3), days = [];
    for (let i = 0; i < 10 && days.length < 3; i++) {
      const d = addDays(now, i), h = B.hours[d.getDay()];
      if (!h) continue;
      const times = [];
      for (let m = h[0] * 60 + 15; m <= h[1] * 60; m += 15) {
        const slot = atHour(d, Math.floor(m / 60), m % 60);
        if (slot >= earliest) times.push(slot);
      }
      if (times.length) days.push({ key: d.toDateString(), date: d, times });
    }
    return days;
  }

  /* ---------- cart ---------- */
  const saveCart = () => store.set('lc_cart', state.cart);
  const cartCount = () => state.cart.reduce((n, i) => n + i.qty, 0);
  const subtotal = items => items.reduce((n, i) => n + (byId[i.id] ? byId[i.id].price * i.qty : 0), 0);
  const round2 = n => Math.round(n * 100) / 100;

  function optsText(line) {
    const m = byId[line.id];
    if (!m || !m.options) return '';
    const names = m.options.map(g => { const c = g.choices.find(c => c.id === (line.opts || {})[g.id]); return c ? L(c) : ''; }).filter(Boolean);
    const shared = m.options.length > 1 && m.options.every(g => g.choices === m.options[0].choices);
    if (!shared) return names.join(', ');
    const counts = {};
    names.forEach(n => { counts[n] = (counts[n] || 0) + 1; });
    return Object.entries(counts).map(([n, c]) => c + '× ' + n).join(', ');
  }
  function addToCart(id, qty, opts, note) {
    const key = id + '|' + JSON.stringify(opts || {}) + '|' + (note || '');
    const found = state.cart.find(l => l.key === key);
    if (found) found.qty += qty; else state.cart.push({ key, id, qty, opts: opts || {}, note: note || '' });
    saveCart(); refreshCart(true);
    toast('✓ ' + t('cart.added'));
  }
  function changeQty(key, delta) {
    const l = state.cart.find(x => x.key === key);
    if (!l) return;
    l.qty += delta;
    if (l.qty <= 0) state.cart = state.cart.filter(x => x !== l);
    saveCart(); refreshCart();
  }

  /* ---------- orders ---------- */
  const getOrders = () => store.get('lc_orders', []);
  const saveOrders = o => store.set('lc_orders', o);
  function nextOrderNo() { const n = store.get('lc_seq', 100) + 1; store.set('lc_seq', n); return n; }
  function orderTotals(items, tipPct) {
    const sub = round2(subtotal(items)), tax = round2(sub * B.taxRate), tip = round2(sub * (tipPct || 0) / 100);
    return { sub, tax, tip, total: round2(sub + tax + tip) };
  }

  /* ---------- UI helpers ---------- */
  function toast(msg) {
    let w = $('.toast-wrap');
    if (!w) { w = document.createElement('div'); w.className = 'toast-wrap'; w.setAttribute('aria-live', 'polite'); document.body.appendChild(w); }
    const el = document.createElement('div');
    el.className = 'toast'; el.textContent = msg;
    w.appendChild(el);
    setTimeout(() => el.remove(), 2600);
  }
  const imgOrEmoji = (m, cls = '') => m.img ? `<img src="${asset(m.img)}" alt="${esc(L(m).name)}" loading="lazy" class="${cls}">` : `<span aria-hidden="true">${m.emoji || '🌮'}</span>`;
  const icon = {
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 7h12l1 13H5L6 7z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4l13 8-13 8z"/></svg>',
  };
  const mapsLink = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('La Chiquita Tacos Y Más, ' + B.mapsQuery);
  const directionsLink = 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(B.mapsQuery);
  const addressLine = `${B.street}, ${B.city}, ${B.region} ${B.postal}`;

  /* ---------- nav + footer ---------- */
  function navHTML(route) {
    const links = [['#/', 'nav.home', ''], ['#/menu', 'nav.menu', 'menu'], ['#/about', 'nav.about', 'about'], ['#/catering', 'nav.catering', 'catering'], ['#/visit', 'nav.visit', 'visit']];
    const n = cartCount();
    return `
    <nav class="navbar ${route === '' ? 'transparent' : ''}" id="navbar" aria-label="Main">
      <a href="#/" class="nav-logo">La Chiquita <span>Tacos Y Más</span></a>
      <ul class="nav-links" id="navLinks">
        ${links.map(([h, k, r]) => `<li><a href="${h}" ${route === r ? 'aria-current="page"' : ''}>${t(k)}</a></li>`).join('')}
        <li class="mobile-only"><a href="#/order" style="color:var(--orange)">${t('nav.order')}</a></li>
      </ul>
      <div class="nav-actions">
        <button class="lang-btn" data-action="lang" lang="${state.lang === 'fr' ? 'en' : 'fr'}" aria-label="${t('nav.langLabel')}">${state.lang === 'fr' ? 'EN' : 'FR'}</button>
        <button class="cart-btn" data-action="cart-open" aria-label="${t('nav.cart')} (${n})">${icon.bag}<span class="cart-count" ${n ? '' : 'hidden'}>${n}</span></button>
        <a href="#/order" class="btn btn-primary nav-cta">${t('nav.order')}</a>
        <button class="hamburger" data-action="toggle-nav" aria-expanded="false" aria-controls="navLinks" aria-label="${t('nav.menuToggle')}"><span></span><span></span><span></span></button>
      </div>
    </nav>`;
  }
  function footerHTML() {
    const days = [1, 2, 3, 4, 5, 6, 0];
    return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="footer-brand">La Chiquita <span>Tacos Y Más</span></div>
            <p>${t('foot.tag')}</p>
            <a class="social" href="${B.instagram}" target="_blank" rel="noopener">📸 ${B.instagramHandle}</a>
          </div>
          <div><h5>${t('foot.explore')}</h5><ul>
            <li><a href="#/menu">${t('nav.menu')}</a></li><li><a href="#/about">${t('nav.about')}</a></li>
            <li><a href="#/catering">${t('nav.catering')}</a></li><li><a href="#/visit">${t('nav.visit')}</a></li></ul></div>
          <div><h5>${t('foot.order')}</h5><ul>
            <li><a href="#/order">${t('foot.pickup')}</a></li>
            <li><a href="${B.doordash}" target="_blank" rel="noopener">DoorDash</a></li>
            <li><a href="${B.ubereats}" target="_blank" rel="noopener">Uber Eats</a></li></ul></div>
          <div><h5>${t('foot.contact')}</h5><ul>
            <li><a href="${B.phoneHref}">${B.phone}</a></li>
            <li><a href="${mapsLink}" target="_blank" rel="noopener">${B.street}<br>${B.city}, ${B.region} ${B.postal}</a></li></ul></div>
          <div><h5>${t('foot.hours')}</h5><ul>
            ${days.filter(d => B.hours[d]).map(d => `<li>${DAY_SHORT[state.lang][d]} ${shortHour(B.hours[d][0])}–${shortHour(B.hours[d][1])}</li>`).join('')}
          </ul></div>
        </div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} La Chiquita Tacos Y Más. ${t('foot.rights')}</span>
          <a href="#/kitchen">🔔 ${t('foot.staff')}</a>
        </div>
      </div>
    </footer>`;
  }

  /* ---------- views ---------- */
  function homeView() {
    const st = statusText();
    const favs = ['birria', 'patacon', 'empanada'].map(id => byId[id]);
    return `
    <section class="hero" id="top">
      <div class="hero-bg" id="heroBg" style="background-image:url('${asset(LC.HERO_CLIPS[0].poster)}')"></div>
      <div class="hero-mobile-video" id="heroMobile"></div>
      <div class="container hero-inner">
        <div>
          <div class="hero-status"><span class="dot ${st.cls}"></span>${st.text}</div>
          <span class="hero-tag">${t('hero.tag')}</span>
          <h1 class="hero-title">La Chiquita <span class="accent">Tacos Y Más</span></h1>
          <p class="hero-sub">${t('hero.sub')}</p>
          <div class="hero-ctas">
            <a href="#/order" class="btn btn-primary">🛍️ ${t('hero.order')}</a>
            <a href="#/menu" class="btn btn-ghost">${t('hero.menu')}</a>
          </div>
          <p class="hero-address">📍 <a href="${mapsLink}" target="_blank" rel="noopener">${addressLine}</a></p>
        </div>
        <div class="reel" id="reel">
          <div class="reel-frame" id="reelFrame">
            <div class="reel-progress">${LC.HERO_CLIPS.map((c, i) => `<button data-action="reel-jump" data-i="${i}" aria-label="${esc(L(c))}"><i></i></button>`).join('')}</div>
            <button class="reel-toggle" data-action="reel-toggle" aria-label="${t('hero.pause')}">${icon.pause}</button>
            <div class="reel-caption" id="reelCaption">${esc(L(LC.HERO_CLIPS[0]))}</div>
          </div>
          <div class="reel-sticker"><b>${B.googleRating}★</b>Google</div>
        </div>
      </div>
    </section>

    <section class="info-strip">
      <div class="container">
        <div class="info-cell"><span class="ic">🕑</span><div><small>${t('strip.hours')}</small><strong>${hoursSummary()}</strong></div></div>
        <div class="info-cell"><span class="ic">📍</span><div><small>${t('strip.where')}</small><strong><a href="${mapsLink}" target="_blank" rel="noopener">${B.street}, ${B.city}</a></strong></div></div>
        <div class="info-cell"><span class="ic">🛍️</span><div><small>${t('strip.pickup')}</small><strong>${t('strip.pickupVal', { n: B.prepMinutes })}</strong></div></div>
      </div>
    </section>

    <section class="section dark">
      <div class="container">
        <div class="center reveal">
          <span class="tag">${t('fav.tag')}</span>
          <h2 class="title">${t('fav.title')}</h2>
          <p class="lede">${t('fav.sub')}</p>
        </div>
        <div class="fav-grid">
          ${favs.map(m => `
            <button class="fav-card reveal" data-action="open-item" data-id="${m.id}">
              ${imgOrEmoji(m)}
              <div class="ov">
                <h3>${esc(L(m).name)}</h3>
                <p>${esc(L(m).desc)}</p>
                <div class="row"><span class="price">${money(m.price)}</span><span class="add-pill">+ ${t('menu.add')}</span></div>
              </div>
            </button>`).join('')}
        </div>
        <div class="center" style="margin-top:2.5rem"><a href="#/menu" class="btn btn-light">${t('fav.all')} →</a></div>
      </div>
    </section>

    <section class="section promo">
      <div class="container">
        <div class="promo-box reveal">
          <div style="position:relative;z-index:1">
            <span class="tag">${t('promo.tag')}</span>
            <h2 class="title">${t('promo.title')}</h2>
            <p class="lede">${t('promo.sub')}</p>
            <a href="#/order" class="btn btn-light">${t('promo.cta')} →</a>
            <p class="delivery-links">${t('promo.delivery')}
              <a href="${B.doordash}" target="_blank" rel="noopener">DoorDash</a> ·
              <a href="${B.ubereats}" target="_blank" rel="noopener">Uber Eats</a></p>
          </div>
          <ol class="steps">
            ${[1, 2, 3].map(i => `<li><span class="n">${i}</span><div><strong>${t('promo.s' + i)}</strong><span>${t('promo.s' + i + 'd')}</span></div></li>`).join('')}
          </ol>
        </div>
      </div>
    </section>

    <section class="section" style="padding-top:1rem">
      <div class="container split">
        <div class="photo-stack reveal">
          <img src="${asset('public/images/stills/poster2.jpg')}" alt="${state.lang === 'fr' ? 'Ají maison au kiosque' : 'House-made ají at the counter'}" loading="lazy">
          <img src="${asset('public/images/menu/Birria-Tacos.jpg')}" alt="${esc(L(byId.birria).name)}" loading="lazy">
        </div>
        <div class="prose reveal">
          <span class="tag">${t('story.tag')}</span>
          <h2 class="title">${t('story.title')}</h2>
          <p>${t('story.p1')}</p>
          <p>${t('story.p2')}</p>
          <a href="#/about" class="btn btn-dark" style="margin-top:.5rem">${t('story.cta')} →</a>
        </div>
      </div>
    </section>

    <section class="reviews">
      <div class="container">
        <div>
          <div class="stars" aria-hidden="true">★★★★★</div>
          <h3>${t('reviews.title', { r: B.googleRating })}</h3>
          <p>${t('reviews.sub')}</p>
        </div>
        <div class="btns">
          <a class="btn btn-dark" href="${mapsLink}" target="_blank" rel="noopener">${t('reviews.read')}</a>
          <a class="btn btn-outline" href="${mapsLink}" target="_blank" rel="noopener">${t('reviews.leave')}</a>
        </div>
      </div>
    </section>

    <section class="section dark-2 center">
      <div class="narrow reveal">
        <span class="tag">${t('cater.tag')}</span>
        <h2 class="title">${t('cater.title')}</h2>
        <p class="lede">${t('cater.sub')}</p>
      </div>
      <div class="container">
        <div class="features">
          <div class="feature reveal"><div class="ic">🎉</div><h4>${t('cater.f1')}</h4><p>${t('cater.f1d')}</p></div>
          <div class="feature reveal"><div class="ic">🌮</div><h4>${t('cater.f2')}</h4><p>${t('cater.f2d')}</p></div>
          <div class="feature reveal"><div class="ic">📋</div><h4>${t('cater.f3')}</h4><p>${t('cater.f3d')}</p></div>
        </div>
        <a href="#/catering" class="btn btn-primary">${t('cater.cta')} →</a>
      </div>
    </section>`;
  }

  function pageHero(tag, title, sub) {
    return `<header class="page-hero">${tag ? `<span class="tag">${tag}</span>` : ''}<h1 class="title">${title}</h1><p>${sub}</p></header>`;
  }

  function menuView() {
    return `
    ${pageHero(t('menu.tag'), t('menu.title'), t('menu.sub'))}
    <div class="chips"><div class="container">
      ${CATS.map(c => `<button class="chip" data-action="scroll-cat" data-cat="${c.id}">${c.icon} ${L(c)}</button>`).join('')}
    </div></div>
    ${CATS.map(c => `
      <section class="menu-section bg-${c.color}" id="cat-${c.id}">
        <div class="container">
          <h2 class="cat-title c-${c.color}"><span aria-hidden="true">${c.icon}</span> ${L(c)}</h2>
          <div class="menu-list">
            ${MENU.filter(m => m.cat === c.id).map(m => `
              <article class="mi reveal" data-action="open-item" data-id="${m.id}">
                <div class="mi-img">${imgOrEmoji(m)}</div>
                <div>
                  <div class="mi-top"><h3 class="mi-name">${esc(L(m).name)}</h3><span class="mi-price">${money(m.price)}</span></div>
                  <p class="mi-desc">${esc(L(m).desc)}</p>
                  <div class="mi-foot">
                    ${m.popular ? `<span class="badge">★ ${t('menu.popular')}</span>` : ''}
                    <button class="mi-add" data-action="open-item" data-id="${m.id}" aria-label="${t('menu.add')}: ${esc(L(m).name)}">+ ${t('menu.add')}</button>
                  </div>
                </div>
              </article>`).join('')}
          </div>
        </div>
      </section>`).join('')}
    <p class="menu-note">* ${t('menu.note')}</p>`;
  }

  function cartInner() {
    if (!state.cart.length) {
      return `<div class="cart-items"><div class="cart-empty"><div class="big">🌮</div><strong>${t('cart.empty')}</strong><p>${t('cart.emptySub')}</p></div></div>`;
    }
    const tot = orderTotals(state.cart, 0);
    return `
      <div class="cart-items">
        ${state.cart.map(l => { const m = byId[l.id]; if (!m) return ''; const o = optsText(l); return `
          <div class="ci">
            <div class="ci-name">${esc(L(m).name)}</div><div class="ci-price">${money(m.price * l.qty)}</div>
            ${o || l.note ? `<div class="ci-opts">${esc(o)}${o && l.note ? ' · ' : ''}${l.note ? '“' + esc(l.note) + '”' : ''}</div>` : ''}
            <div class="ci-ctrl">
              <div class="stepper"><button data-action="qty" data-key="${esc(l.key)}" data-d="-1" aria-label="−">−</button><span>${l.qty}</span><button data-action="qty" data-key="${esc(l.key)}" data-d="1" aria-label="+">+</button></div>
              <button class="link-btn" data-action="qty" data-key="${esc(l.key)}" data-d="-999">${t('cart.remove')}</button>
            </div>
          </div>`; }).join('')}
      </div>
      <div class="totals">
        <div class="r"><span>${t('cart.subtotal')}</span><span>${money(tot.sub)}</span></div>
        <div class="r"><span>${t('cart.tax')}</span><span>${money(tot.tax)}</span></div>
        <div class="r total"><span>${t('cart.total')}</span><span>${money(tot.total)}</span></div>
        <a href="#/checkout" class="btn btn-primary btn-block">${t('cart.checkout')} →</a>
      </div>`;
  }
  const cartPanel = (closeBtn) => `
    <aside class="cart-panel" aria-label="${t('cart.title')}">
      <header><h3>🛍️ ${t('cart.title')}</h3>${closeBtn ? `<button class="modal-close" style="position:static;box-shadow:none" data-action="close-layer" aria-label="${t('cart.close')}">✕</button>` : ''}</header>
      <div data-cart-inner style="display:contents">${cartInner()}</div>
    </aside>`;

  function orderView() {
    const s = openStatus();
    const banner = s.open ? `<span class="dot open"></span>${t('order.openNow', { n: B.prepMinutes })}`
      : `<span class="dot closed"></span>${t('order.closedNow', { d: s.next ? dayLabel(s.next).toLowerCase() + ' ' + fmtTime(s.next) : '' })}`;
    return `
    <header class="order-head"><div class="container">
      <h1 class="title">${t('order.title')}</h1>
      <p>📍 ${t('order.sub', { a: addressLine })}</p>
      <div class="order-banner">${banner}</div>
    </div></header>
    <div class="container order-layout">
      <div>
        <div class="order-tools">
          <label class="search"><span class="sr-only">${t('order.search')}</span><input type="search" data-search placeholder="${t('order.search')}"></label>
        </div>
        <div class="chips" style="position:sticky;margin:0 -1rem 1.2rem;background:var(--cream)"><div class="container" style="padding-left:1rem">
          ${CATS.map(c => `<button class="chip" data-action="scroll-cat" data-cat="${c.id}" data-prefix="ocat-">${c.icon} ${L(c)}</button>`).join('')}
        </div></div>
        ${CATS.map(c => `
          <section class="order-cat" id="ocat-${c.id}" data-cat-block>
            <h2><span aria-hidden="true">${c.icon}</span> ${L(c)}</h2>
            <div class="order-grid">
              ${MENU.filter(m => m.cat === c.id).map(m => `
                <article class="oc" data-action="open-item" data-id="${m.id}" data-text="${esc((m.en.name + ' ' + m.fr.name + ' ' + L(m).desc).toLowerCase())}">
                  <div class="oc-img">${imgOrEmoji(m)}${m.popular ? `<span class="badge">★ ${t('menu.popular')}</span>` : ''}</div>
                  <div class="oc-body">
                    <h3 class="oc-name">${esc(L(m).name)}</h3>
                    <p class="oc-desc">${esc(L(m).desc)}</p>
                    <div class="oc-foot"><span class="oc-price">${money(m.price)} <span class="in-cart" data-incart="${m.id}"></span></span>
                      <button class="plus" data-action="open-item" data-id="${m.id}" aria-label="${t('menu.add')}: ${esc(L(m).name)}">+</button></div>
                  </div>
                </article>`).join('')}
            </div>
          </section>`).join('')}
      </div>
      ${cartPanel(false)}
    </div>
    <button class="mobile-cart-bar" data-action="cart-open" hidden></button>`;
  }

  function checkoutView() {
    if (!state.cart.length) {
      return `<div class="status-wrap"><div class="narrow center"><div class="card"><div class="cart-empty"><div class="big">🌮</div><strong>${t('cart.empty')}</strong><p>${t('cart.emptySub')}</p></div><a href="#/order" class="btn btn-primary">${t('co.back')}</a></div></div></div>`;
    }
    const s = openStatus();
    const slots = pickupSlots();
    const f = store.get('lc_contact', {});
    return `
    <header class="order-head"><div class="container">
      <a href="#/order" style="color:rgba(255,255,255,.7)">← ${t('co.back')}</a>
      <h1 class="title" style="margin-top:.6rem">${t('co.title')}</h1>
      <p>📍 ${t('order.sub', { a: addressLine })}</p>
    </div></header>
    <form class="container co-layout" id="checkoutForm" novalidate>
      <div>
        <section class="card">
          <h2><span class="n">1</span>${t('co.contact')}</h2>
          <div class="fields">
            <div class="field"><label for="f-name">${t('co.name')}</label><input id="f-name" name="name" autocomplete="name" value="${esc(f.name || '')}" required><span class="err" id="e-name"></span></div>
            <div class="field"><label for="f-phone">${t('co.phone')}</label><input id="f-phone" name="phone" type="tel" autocomplete="tel" placeholder="506-555-0123" value="${esc(f.phone || '')}" required><span class="err" id="e-phone"></span></div>
            <div class="field full"><label for="f-email">${t('co.email')}</label><input id="f-email" name="email" type="email" autocomplete="email" value="${esc(f.email || '')}"></div>
            <label class="check"><input type="checkbox" name="sms" checked> ${t('co.sms')}</label>
          </div>
        </section>

        <section class="card">
          <h2><span class="n">2</span>${t('co.when')}</h2>
          <div class="choice-cards">
            <label><input type="radio" name="when" value="asap" ${s.open ? 'checked' : 'disabled'}><span class="cc"><strong>⚡ ${t('co.asap')}</strong><small>${s.open ? t('co.asapSub', { n: B.prepMinutes }) : t('co.asapClosed')}</small></span></label>
            <label><input type="radio" name="when" value="later" ${s.open ? '' : 'checked'}><span class="cc"><strong>🗓️ ${t('co.later')}</strong><small>${slots[0] ? dayLabel(slots[0].date) + ', ' + t('co.from', { t: fmtTime(slots[0].times[0]) }) : ''}</small></span></label>
          </div>
          <div class="fields" id="laterFields" ${s.open ? 'hidden' : ''}>
            <div class="field"><label for="f-day">${t('co.day')}</label><select id="f-day" name="day">${slots.map((d, i) => `<option value="${i}">${dayLabel(d.date)} — ${d.date.toLocaleDateString(locale(), { month: 'short', day: 'numeric' })}</option>`).join('')}</select></div>
            <div class="field"><label for="f-time">${t('co.time')}</label><select id="f-time" name="time">${(slots[0] ? slots[0].times : []).map(x => `<option value="${x.toISOString()}">${fmtTime(x)}</option>`).join('')}</select></div>
          </div>
        </section>

        <section class="card">
          <h2><span class="n">3</span>${t('co.pay')}</h2>
          <div class="choice-cards">
            <label><input type="radio" name="pay" value="online" checked><span class="cc"><strong>💳 ${t('co.payOnline')}</strong><small>${t('co.payOnlineSub')}</small></span></label>
            <label><input type="radio" name="pay" value="pickup"><span class="cc"><strong>🏪 ${t('co.payPickup')}</strong><small>${t('co.payPickupSub')}</small></span></label>
          </div>
          <div id="cardFields">
            <div class="pay-brands" aria-hidden="true"><span>VISA</span><span>MASTERCARD</span><span>AMEX</span><span>APPLE PAY</span><span>G PAY</span><span>INTERAC</span></div>
            <div class="card-fields" aria-hidden="true">
              <input value="4242 4242 4242 4242" tabindex="-1" readonly aria-label="${t('co.card')}">
              <input value="12 / 28" tabindex="-1" readonly aria-label="${t('co.exp')}">
              <input value="123" tabindex="-1" readonly aria-label="${t('co.cvc')}">
            </div>
          </div>
          <p class="demo-note">ℹ️ ${t('co.demo')}</p>
        </section>

        <section class="card">
          <h2><span class="n">4</span>${t('co.tip')}</h2>
          <div class="radios tips">
            ${[0, 10, 15, 18].map(p => `<label><input type="radio" name="tip" value="${p}" ${p === 15 ? 'checked' : ''}><span>${p ? p + ' %' : t('co.noTip')}</span></label>`).join('')}
          </div>
          <div class="field" style="margin-top:1.1rem"><label for="f-notes">${t('co.notes')}</label><textarea id="f-notes" name="notes" placeholder="${t('item.instructionsPh')}"></textarea></div>
        </section>
      </div>

      <aside class="card summary" aria-label="${t('co.summary')}">
        <h2>${t('co.summary')}</h2>
        <div id="summaryBody"></div>
      </aside>
    </form>`;
  }
  function summaryHTML(tipPct) {
    const tot = orderTotals(state.cart, tipPct);
    return `
      ${state.cart.map(l => { const m = byId[l.id]; const o = optsText(l); return `
        <div class="ci"><span class="qty">${l.qty}×</span><span class="ci-name">${esc(L(m).name)}</span><span class="ci-price">${money(m.price * l.qty)}</span>
        ${o || l.note ? `<span class="ci-opts">${esc(o)}${o && l.note ? ' · ' : ''}${l.note ? '“' + esc(l.note) + '”' : ''}</span>` : ''}</div>`; }).join('')}
      <div class="totals" style="padding:1rem 0 0">
        <div class="r"><span>${t('cart.subtotal')}</span><span>${money(tot.sub)}</span></div>
        <div class="r"><span>${t('cart.tax')}</span><span>${money(tot.tax)}</span></div>
        <div class="r"><span>${t('cart.tip')}</span><span>${money(tot.tip)}</span></div>
        <div class="r total"><span>${t('cart.total')}</span><span>${money(tot.total)}</span></div>
        <button type="submit" form="checkoutForm" class="btn btn-primary btn-block">${t('co.place', { t: money(tot.total) })}</button>
      </div>`;
  }

  function statusView(id) {
    const o = getOrders().find(x => String(x.id) === String(id));
    if (!o) return `<div class="status-wrap"><div class="narrow center"><div class="card"><p>${t('st.notFound')}</p><br><a class="btn btn-primary" href="#/order">${t('st.newOrder')}</a></div></div></div>`;
    const when = o.when.asap ? t('st.asap', { n: B.prepMinutes }) : dayLabel(new Date(o.when.at)) + ', ' + fmtTime(new Date(o.when.at));
    return `
    <div class="status-wrap"><div class="narrow">
      <div class="status-card">
        <div class="status-top">
          <div class="big">🎉</div>
          <h1>${t('st.title', { n: esc(o.name.split(' ')[0]) })}</h1>
          <p>${t('st.sub', { id: o.id })}</p>
          <div class="order-no">#${o.id}</div>
        </div>
        <div id="tracker">${trackerHTML(o)}</div>
        <div class="status-grid">
          <div><h3>${t('st.pickupAt')}</h3><p><strong>${when}</strong></p>
            <p style="margin-top:.4rem"><span class="pill ${o.pay === 'online' ? 'paid' : 'unpaid'}">${o.pay === 'online' ? t('st.paid') : t('st.unpaid')} · ${money(o.total)}</span></p></div>
          <div><h3>${t('st.where')}</h3><p><strong>${B.name}</strong><br>${addressLine}</p>
            <p style="margin-top:.4rem"><a href="${directionsLink}" target="_blank" rel="noopener">${t('st.directions')} →</a></p></div>
          <div style="grid-column:1/-1"><h3>${t('co.summary')}</h3>
            ${o.items.map(l => { const m = byId[l.id]; const op = optsText(l); return `<p>${l.qty}× ${esc(L(m).name)}${op ? ` <small style="color:var(--muted)">(${esc(op)})</small>` : ''}</p>`; }).join('')}
          </div>
        </div>
      </div>
      <div class="demo-callout">
        <span class="ic">👩‍🍳</span>
        <div><strong>${t('st.demo')}</strong><p>${t('st.demoSub')}</p></div>
        <a class="btn btn-primary" href="#/kitchen" target="_blank" rel="noopener" data-kitchen-link>${t('st.demoBtn')} ↗</a>
      </div>
    </div></div>`;
  }
  const STATUS_ORDER = ['new', 'prep', 'ready', 'done'];
  function trackerHTML(o) {
    const idx = STATUS_ORDER.indexOf(o.status);
    const icons = ['✓', '🔥', '🛍️', '✓'];
    return `<div class="tracker" role="list">${[1, 2, 3, 4].map((n, i) => {
      const cls = i < idx || (i === 3 && idx === 3) ? 'done' : i === idx ? 'current' : '';
      return `<div class="step ${cls}" role="listitem" ${i === idx ? 'aria-current="step"' : ''}><div class="circle">${i < idx || i === 0 ? '✓' : icons[i]}</div>${t('st.s' + n)}</div>`;
    }).join('')}</div>`;
  }

  function aboutView() {
    return `
    ${pageHero(t('story.tag'), t('about.title'), t('about.sub'))}
    <section class="section" style="padding-top:3rem"><div class="narrow prose">
      <div class="about-photos reveal">
        <img src="${asset('public/images/stills/poster3.jpg')}" alt="${state.lang === 'fr' ? 'Tortillas sur la plaque' : 'Tortillas on the griddle'}" loading="lazy">
        <img src="${asset('public/images/stills/poster2.jpg')}" alt="${state.lang === 'fr' ? 'Ají maison' : 'House-made ají'}" loading="lazy">
        <img src="${asset('public/images/stills/poster4.jpg')}" alt="${state.lang === 'fr' ? 'Consommé de birria' : 'Birria consommé'}" loading="lazy">
      </div>
      <p class="reveal" style="font-size:1.35rem;color:var(--ink);line-height:1.6">${t('about.p1')}</p>
      <p class="reveal">${t('about.p2')}</p>
      <p class="quote-quote reveal">${t('about.quote')}</p>
      <p class="reveal">${t('about.p3')}</p>
      <div class="signature reveal">${t('about.sign')}</div>
    </div></section>`;
  }

  function cateringView() {
    return `
    ${pageHero(t('cater.tag'), t('catering.title'), t('catering.sub'))}
    <section class="section light" style="padding-top:3rem"><div class="container">
      <div class="narrow prose" style="padding:0">
        <p class="reveal">${t('catering.p1')}</p>
        <p class="reveal">${t('catering.p2')}</p>
      </div>
      <div class="features">
        <div class="feature reveal"><div class="ic">🎉</div><h4>${t('cater.f1')}</h4><p>${t('cater.f1d')}</p></div>
        <div class="feature reveal"><div class="ic">🌮</div><h4>${t('cater.f2')}</h4><p>${t('cater.f2d')}</p></div>
        <div class="feature reveal"><div class="ic">📋</div><h4>${t('cater.f3')}</h4><p>${t('cater.f3d')}</p></div>
        <div class="feature reveal"><div class="ic">🚗</div><h4>${t('catering.f4')}</h4><p>${t('catering.f4d')}</p></div>
      </div>
      <div class="narrow" style="padding:0">
        <form class="card reveal" id="cateringForm">
          <h2>📝 ${t('catering.form')}</h2>
          <div class="fields">
            <div class="field"><label for="c-name">${t('co.name')}</label><input id="c-name" required autocomplete="name"></div>
            <div class="field"><label for="c-phone">${t('co.phone')}</label><input id="c-phone" type="tel" autocomplete="tel"></div>
            <div class="field"><label for="c-date">${t('catering.date')}</label><input id="c-date" type="date"></div>
            <div class="field"><label for="c-guests">${t('catering.guests')}</label><input id="c-guests" type="number" min="10" placeholder="25"></div>
            <div class="field full"><label for="c-type">${t('catering.type')}</label><select id="c-type">
              ${(state.lang === 'fr' ? ['Dîner de bureau', 'Anniversaire', 'Mariage', 'Événement communautaire', 'Autre'] : ['Office lunch', 'Birthday', 'Wedding', 'Community event', 'Other']).map(x => `<option>${x}</option>`).join('')}
            </select></div>
            <div class="field full"><label for="c-msg">${t('catering.msg')}</label><textarea id="c-msg"></textarea></div>
          </div>
          <button class="btn btn-primary btn-block" style="margin-top:1.2rem">${t('catering.send')}</button>
        </form>
      </div>
    </div></section>`;
  }

  function visitView() {
    const today = new Date().getDay();
    const days = [1, 2, 3, 4, 5, 6, 0];
    const st = statusText();
    const sample = new Date();
    return `
    ${pageHero('', t('visit.title'), t('visit.sub'))}
    <div class="container">
      <div class="visit-grid">
        <div class="map"><iframe title="Map — ${esc(addressLine)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
          src="https://maps.google.com/maps?q=${encodeURIComponent(B.mapsQuery)}&z=15&output=embed"></iframe></div>
        <div class="card" style="margin:0">
          <div class="hero-status" style="background:var(--sand);color:var(--ink);border-color:var(--line)"><span class="dot ${st.cls}"></span>${st.text}</div>
          <h2 style="margin-bottom:.3rem">📍 ${B.city}</h2>
          <p><strong>${addressLine}</strong></p>
          <h3 style="margin-top:1.2rem;font-size:.8rem;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)">${t('visit.hours')}</h3>
          <table class="hours-table"><tbody>
            ${days.map(d => { const h = B.hours[d]; return `<tr class="${d === today ? 'today' : ''}"><td>${t('days')[d]}${d === today ? ' · ' + t('visit.today') : ''}</td>
              <td class="${h ? '' : 'closed'}">${h ? fmtTime(atHour(sample, h[0])) + ' – ' + fmtTime(atHour(sample, h[1])) : t('visit.closed')}</td></tr>`; }).join('')}
          </tbody></table>
          <div style="display:flex;gap:.6rem;flex-wrap:wrap">
            <a class="btn btn-primary btn-sm" href="${directionsLink}" target="_blank" rel="noopener">${t('visit.directions')}</a>
            <a class="btn btn-outline btn-sm" href="${B.phoneHref}">📞 ${B.phone}</a>
            <a class="btn btn-outline btn-sm" href="#/order">🛍️ ${t('nav.order')}</a>
          </div>
        </div>
      </div>
      <div class="soon-card">
        <span class="ic">🏔️</span>
        <div><span class="badge">${t('visit.soon')}</span><h3 style="font-family:var(--serif)">${t('visit.soonTitle')}</h3><p style="color:var(--muted)">${t('visit.soonSub')}</p></div>
      </div>
    </div>`;
  }

  /* ---------- kitchen dashboard ---------- */
  const kitchen = { seen: null, sound: store.get('lc_sound', true), ctx: null, sig: '' };
  function chime() {
    if (!kitchen.sound) return;
    try {
      kitchen.ctx = kitchen.ctx || new (window.AudioContext || window.webkitAudioContext)();
      const c = kitchen.ctx;
      [[880, 0], [1320, .18], [880, .36], [1320, .54]].forEach(([f, at]) => {
        const o = c.createOscillator(), g = c.createGain();
        o.frequency.value = f; o.type = 'sine';
        g.gain.setValueAtTime(0.0001, c.currentTime + at);
        g.gain.exponentialRampToValueAtTime(0.25, c.currentTime + at + .02);
        g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + at + .16);
        o.connect(g).connect(c.destination); o.start(c.currentTime + at); o.stop(c.currentTime + at + .18);
      });
    } catch (e) { /* audio unavailable */ }
  }
  function ticketHTML(o, flash) {
    const created = new Date(o.createdAt);
    const when = o.when.asap ? '⚡ ASAP' : '🗓️ ' + dayLabel(new Date(o.when.at)) + ' ' + fmtTime(new Date(o.when.at));
    const next = { new: ['k.accept', 'btn-primary'], prep: ['k.markReady', 'btn-dark'], ready: ['k.pickedUp', 'btn-outline'] }[o.status];
    return `
      <div class="ticket ${flash ? 'flash' : ''}">
        <div class="t-top"><span class="t-no">#${o.id}</span><span class="t-time">${fmtTime(created)}</span></div>
        <div class="t-who">${esc(o.name)} · <a href="tel:${esc(o.phone)}">${esc(o.phone)}</a></div>
        <div class="t-meta"><span>${when}</span><span class="pill ${o.pay === 'online' ? 'paid' : 'unpaid'}">${o.pay === 'online' ? t('st.paid') : t('st.unpaid')}</span>${o.sms ? '<span>💬 SMS</span>' : ''}</div>
        <ul class="t-items">
          ${o.items.map(l => { const m = byId[l.id]; const op = optsText(l); return `<li><b>${l.qty}×</b>${esc(m ? L(m).name : l.id)}${op ? `<small>${esc(op)}</small>` : ''}${l.note ? `<small class="note">⚠ ${esc(l.note)}</small>` : ''}</li>`; }).join('')}
          ${o.notes ? `<li><small class="note" style="padding:0">📝 ${esc(o.notes)}</small></li>` : ''}
        </ul>
        <div class="t-foot"><span class="t-total">${money(o.total)}</span>
          ${next ? `<button class="btn btn-sm ${next[1]}" data-action="k-advance" data-id="${o.id}">${t(next[0])}</button>` : ''}</div>
      </div>`;
  }
  function kitchenColumns(flashIds) {
    const orders = getOrders();
    const col = (st, cls, key) => {
      const list = orders.filter(o => o.status === st).sort((a, b) => a.createdAt - b.createdAt);
      return `<section class="k-col ${cls}"><h2>${t(key)} <span class="cnt">${list.length}</span></h2>
        ${list.length ? list.map(o => ticketHTML(o, flashIds && flashIds.includes(o.id))).join('') : `<div class="k-empty">${t('k.none')}</div>`}</section>`;
    };
    const done = orders.filter(o => o.status === 'done').length;
    return `<div class="k-cols">${col('new', 'new', 'k.new')}${col('prep', 'prep', 'k.prep')}${col('ready', 'ready', 'k.ready')}</div>
      <p class="k-done">✓ ${t('k.done')}: ${done}</p>`;
  }
  function kitchenView() {
    kitchen.seen = new Set(getOrders().map(o => o.id));
    kitchen.sig = JSON.stringify(getOrders());
    return `
    <div class="kitchen">
      <div class="k-head">
        <div><h1>La Chiquita <span>· ${t('k.title')}</span></h1><p>${t('k.sub')}</p></div>
        <div class="k-actions">
          <button class="k-btn" data-action="lang">${state.lang === 'fr' ? 'EN' : 'FR'}</button>
          <button class="k-btn" data-action="k-sound">${kitchen.sound ? '🔔 ' + t('k.sound') : '🔕 ' + t('k.soundOff')}</button>
          <button class="k-btn" data-action="k-test">＋ ${t('k.test')}</button>
          <button class="k-btn" data-action="k-clear">🗑 ${t('k.clear')}</button>
          <a class="k-btn" href="#/">← ${t('k.back')}</a>
        </div>
      </div>
      <p class="k-note">ℹ️ ${t('k.integration')}</p>
      <div id="kCols">${kitchenColumns()}</div>
    </div>`;
  }
  function kitchenRefresh() {
    const orders = getOrders(), sig = JSON.stringify(orders);
    if (sig === kitchen.sig) return;
    kitchen.sig = sig;
    const fresh = orders.filter(o => !kitchen.seen.has(o.id)).map(o => o.id);
    fresh.forEach(id => kitchen.seen.add(id));
    const box = $('#kCols');
    if (box) box.innerHTML = kitchenColumns(fresh);
    if (fresh.length) {
      chime();
      fresh.forEach(id => toast('🔔 ' + t('k.newOrder', { id })));
      document.title = '🔔 (' + fresh.length + ') ' + t('k.title');
      setTimeout(() => { if (state.route === 'kitchen') document.title = t('k.title') + ' — La Chiquita'; }, 4000);
    }
  }
  function testOrder() {
    const names = ['Émilie Cormier', 'Marc LeBlanc', 'Sofia Ramírez', 'Josh Gallant', 'Nadine Arsenault', 'Carlos Méndez'];
    const pool = MENU.filter(m => m.cat !== 'desserts');
    const items = [];
    const n = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) {
      const m = pool[Math.floor(Math.random() * pool.length)];
      const opts = {};
      (m.options || []).forEach(g => { opts[g.id] = g.choices[Math.floor(Math.random() * g.choices.length)].id; });
      items.push({ id: m.id, qty: m.id === 'empanada' ? 3 : 1, opts, note: Math.random() < .25 ? (state.lang === 'fr' ? 'Sans oignon' : 'No onions') : '' });
    }
    if (Math.random() < .5) items.push({ id: 'churros', qty: 1, opts: {}, note: '' });
    const tot = orderTotals(items, 15);
    const o = {
      id: nextOrderNo(), createdAt: Date.now(), name: names[Math.floor(Math.random() * names.length)],
      phone: '506-555-01' + String(Math.floor(Math.random() * 90) + 10), sms: true,
      when: { asap: true }, pay: Math.random() < .7 ? 'online' : 'pickup', tip: 15, notes: '', items,
      sub: tot.sub, tax: tot.tax, tipAmt: tot.tip, total: tot.total, status: 'new',
    };
    saveOrders(getOrders().concat(o));
    kitchenRefresh();
  }

  /* ---------- item modal + cart drawer ---------- */
  let layer = null, lastFocus = null;
  function openLayer(html, kind) {
    closeLayer(true);
    lastFocus = document.activeElement;
    const ov = document.createElement('div');
    ov.className = 'overlay'; ov.dataset.action = 'close-layer';
    const box = document.createElement('div');
    box.className = kind; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true');
    box.innerHTML = html;
    document.body.append(ov, box);
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => { ov.classList.add('show'); box.classList.add('show'); });
    layer = { ov, box, kind };
    const f = box.querySelector('input:checked, button, input, textarea');
    if (f) f.focus({ preventScroll: true });
    return box;
  }
  function closeLayer(instant) {
    if (!layer) return;
    const { ov, box } = layer; layer = null;
    ov.classList.remove('show'); box.classList.remove('show');
    document.body.classList.remove('no-scroll');
    const rm = () => { ov.remove(); box.remove(); };
    if (instant) rm(); else setTimeout(rm, 260);
    if (lastFocus && lastFocus.focus && !instant) lastFocus.focus({ preventScroll: true });
  }
  function openItem(id) {
    const m = byId[id];
    if (!m) return;
    const box = openLayer(`
      <button class="modal-close" data-action="close-layer" aria-label="${t('cart.close')}">✕</button>
      <div class="modal-img">${imgOrEmoji(m)}</div>
      <form class="modal-body" id="itemForm" aria-labelledby="itemTitle">
        <h2 id="itemTitle">${esc(L(m).name)}</h2>
        <div class="price">${money(m.price)}</div>
        <p>${esc(L(m).desc)}</p>
        ${(m.options || []).map(g => `
          <fieldset class="opt-group">
            <legend>${esc(L(g))} <small>${t('item.required')}</small></legend>
            <div class="radios">${g.choices.map((c, i) => `<label><input type="radio" name="opt-${g.id}" value="${c.id}" ${i === 0 ? 'checked' : ''}><span>${esc(L(c))}</span></label>`).join('')}</div>
          </fieldset>`).join('')}
        <div class="field"><label for="itemNote">${t('item.instructions')}</label><textarea id="itemNote" maxlength="140" placeholder="${t('item.instructionsPh')}"></textarea></div>
      </form>
      <div class="modal-foot">
        <div class="stepper" aria-label="${t('cart.qty')}"><button type="button" data-action="mqty" data-d="-1" aria-label="−">−</button><span id="mQty">1</span><button type="button" data-action="mqty" data-d="1" aria-label="+">+</button></div>
        <button class="btn btn-primary" data-action="add-item" data-id="${m.id}" id="mAdd">${t('item.add')} · ${money(m.price)}</button>
      </div>`, 'modal');
    box.dataset.qty = '1';
  }
  function openDrawer() {
    openLayer(cartPanel(true), 'drawer');
  }

  /* ---------- hero video reel ---------- */
  const reel = { i: 0, video: null, paused: reduceMotion, max: 9, mq: null };
  function heroInit() {
    const frame = $('#reelFrame'), mobile = $('#heroMobile');
    if (!frame) return;
    const v = document.createElement('video');
    v.muted = true; v.defaultMuted = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.setAttribute('muted', '');
    v.preload = 'auto'; v.setAttribute('aria-hidden', 'true');
    reel.video = v;
    reel.mq = window.matchMedia('(max-width: 960px)');
    const place = () => { (reel.mq.matches ? mobile : frame).prepend(v); if (!reel.paused) v.play().catch(() => {}); };
    reel.mq.onchange = place;
    place();
    v.addEventListener('timeupdate', () => {
      const lim = Math.min(v.duration || reel.max, reel.max);
      const bar = $$('.reel-progress button i')[reel.i];
      if (bar) bar.style.width = Math.min(100, v.currentTime / lim * 100) + '%';
      if (v.currentTime >= lim) nextClip();
    });
    v.addEventListener('ended', nextClip);
    loadClip(0);
    updateToggle();
  }
  function loadClip(i) {
    const clips = LC.HERO_CLIPS;
    reel.i = (i + clips.length) % clips.length;
    const c = clips[reel.i], v = reel.video;
    v.poster = asset(c.poster); v.src = asset(c.src);
    v.defaultPlaybackRate = v.playbackRate = c.rate || 1;
    if (!reel.paused) v.play().catch(() => {});
    const bg = $('#heroBg'); if (bg) bg.style.backgroundImage = `url('${asset(c.poster)}')`;
    const cap = $('#reelCaption'); if (cap) cap.textContent = L(c);
    $$('.reel-progress button').forEach((b, j) => { b.classList.toggle('done', j < reel.i); const bar = b.querySelector('i'); if (bar && j >= reel.i) bar.style.width = '0'; });
  }
  function nextClip() { if (reel.video) loadClip(reel.i + 1); }
  function updateToggle() {
    const b = $('[data-action="reel-toggle"]');
    if (b) { b.innerHTML = reel.paused ? icon.play : icon.pause; b.setAttribute('aria-label', reel.paused ? t('hero.play') : t('hero.pause')); }
  }

  /* ---------- router ---------- */
  const TITLES = { '': 'Birria & Latin Street Food in Dieppe, NB', menu: 'nav.menu', order: 'nav.order', checkout: 'co.title', status: 'st.s1', about: 'nav.about', catering: 'nav.catering', visit: 'nav.visit', kitchen: 'k.title' };
  let liveTimer = null;
  function parseRoute() {
    const h = (location.hash || '#/').replace(/^#\/?/, '');
    const [name, arg] = h.split('/');
    return { name: name || '', arg };
  }
  function render() {
    const { name, arg } = parseRoute();
    const prev = state.route;
    state.route = name;
    closeLayer(true);
    if (reel.video) { reel.video.pause(); reel.video.removeAttribute('src'); reel.video = null; }
    clearInterval(liveTimer);
    document.documentElement.lang = state.lang === 'fr' ? 'fr-CA' : 'en-CA';
    document.body.classList.toggle('kitchen-mode', name === 'kitchen');

    const views = { '': homeView, menu: menuView, order: orderView, checkout: checkoutView, status: () => statusView(arg), about: aboutView, catering: cateringView, visit: visitView, kitchen: kitchenView };
    const view = views[name] || homeView;
    const body = view();
    app.innerHTML = name === 'kitchen' ? body : navHTML(name) + `<main id="main">${body}</main>` + footerHTML();
    const tk = TITLES[name] || TITLES[''];
    document.title = name === '' ? 'La Chiquita Tacos Y Más — ' + (state.lang === 'fr' ? 'Birria et cuisine de rue latine à Dieppe (N.-B.)' : tk) : t(tk) + ' — La Chiquita Tacos Y Más';
    if (prev !== name || name === 'status') window.scrollTo(0, 0);

    if (name === '') heroInit();
    if (name === 'checkout') bindCheckout();
    if (name === 'catering') bindCatering();
    if (name === 'status') liveTimer = setInterval(() => statusRefresh(arg), 1200);
    if (name === 'kitchen') liveTimer = setInterval(kitchenRefresh, 1200);
    refreshCart();
    onScroll();
    initReveal();
  }
  function statusRefresh(id) {
    const o = getOrders().find(x => String(x.id) === String(id));
    const box = $('#tracker');
    if (!o || !box) return;
    const html = trackerHTML(o);
    if (box.dataset.status !== o.status) {
      if (box.dataset.status) toast('🔔 ' + t('st.s' + (STATUS_ORDER.indexOf(o.status) + 1)));
      box.dataset.status = o.status; box.innerHTML = html;
    }
  }

  function refreshCart(bump) {
    const n = cartCount();
    const cnt = $('.cart-count');
    if (cnt) {
      cnt.textContent = n; cnt.hidden = !n;
      if (bump) { cnt.classList.remove('bump'); void cnt.offsetWidth; cnt.classList.add('bump'); }
    }
    const cb = $('.cart-btn'); if (cb) cb.setAttribute('aria-label', `${t('nav.cart')} (${n})`);
    $$('[data-cart-inner]').forEach(el => { el.innerHTML = cartInner(); });
    const bar = $('.mobile-cart-bar');
    if (bar) {
      bar.hidden = !n;
      bar.innerHTML = `<span><span class="n">${n}</span>${t('cart.view')}</span><span>${money(orderTotals(state.cart, 0).total)}</span>`;
    }
    $$('[data-incart]').forEach(el => {
      const q = state.cart.filter(l => l.id === el.dataset.incart).reduce((a, l) => a + l.qty, 0);
      el.textContent = q ? '· ' + q + '×' : '';
    });
    if (state.route === 'checkout') {
      const sb = $('#summaryBody');
      if (sb) sb.innerHTML = summaryHTML(Number(($('input[name="tip"]:checked') || {}).value || 0));
    }
  }

  /* ---------- checkout + catering forms ---------- */
  function bindCheckout() {
    const form = $('#checkoutForm');
    if (!form) return;
    const F = n => form.elements[n];
    const slots = pickupSlots();
    const fillTimes = () => {
      const d = slots[Number(F('day').value)] || slots[0];
      F('time').innerHTML = (d ? d.times : []).map(x => `<option value="${x.toISOString()}">${fmtTime(x)}</option>`).join('');
    };
    form.addEventListener('change', e => {
      if (e.target.name === 'when') $('#laterFields').hidden = F('when').value !== 'later';
      if (e.target.name === 'day') fillTimes();
      if (e.target.name === 'pay') $('#cardFields').hidden = F('pay').value !== 'online';
      if (e.target.name === 'tip') refreshCart();
    });
    form.addEventListener('input', e => {
      if (e.target.getAttribute('aria-invalid') === 'true') { e.target.setAttribute('aria-invalid', 'false'); const er = $('#e-' + e.target.name); if (er) er.textContent = ''; }
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = F('name').value.trim(), phone = F('phone').value.trim();
      let ok = true;
      const setErr = (f, id, msg) => { f.setAttribute('aria-invalid', msg ? 'true' : 'false'); $('#' + id).textContent = msg || ''; if (msg) { if (ok) f.focus(); ok = false; } };
      setErr(F('name'), 'e-name', name ? '' : t('co.err.name'));
      setErr(F('phone'), 'e-phone', phone.replace(/\D/g, '').length >= 10 ? '' : t('co.err.phone'));
      if (!ok) return;
      store.set('lc_contact', { name, phone, email: F('email').value.trim() });
      const tip = Number(F('tip').value || 0);
      const tot = orderTotals(state.cart, tip);
      const later = F('when').value === 'later';
      const o = {
        id: nextOrderNo(), createdAt: Date.now(), name, phone, email: F('email').value.trim(), sms: F('sms').checked,
        when: later ? { asap: false, at: F('time').value } : { asap: true }, pay: F('pay').value, tip,
        notes: F('notes').value.trim(), items: state.cart.map(({ id, qty, opts, note }) => ({ id, qty, opts, note })),
        sub: tot.sub, tax: tot.tax, tipAmt: tot.tip, total: tot.total, status: 'new',
      };
      saveOrders(getOrders().concat(o));
      state.cart = []; saveCart();
      location.hash = '#/status/' + o.id;
    });
  }
  function bindCatering() {
    const form = $('#cateringForm');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      form.innerHTML = `<div class="success"><div class="big">🎉</div><h2 style="justify-content:center">${t('catering.thanks')}</h2></div>`;
    });
  }

  /* ---------- global events ---------- */
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-action]');
    if (!el) {
      if (e.target.closest('.nav-links a')) toggleNav(false);
      return;
    }
    const a = el.dataset.action;
    switch (a) {
      case 'lang':
        state.lang = state.lang === 'fr' ? 'en' : 'fr'; store.set('lc_lang', state.lang); render(); break;
      case 'open-item': e.preventDefault(); openItem(el.dataset.id); break;
      case 'close-layer': closeLayer(); break;
      case 'mqty': {
        const box = layer && layer.box; if (!box) break;
        const q = Math.max(1, Math.min(20, Number(box.dataset.qty) + Number(el.dataset.d)));
        box.dataset.qty = q; $('#mQty').textContent = q;
        const m = byId[$('#mAdd').dataset.id];
        $('#mAdd').textContent = `${t('item.add')} · ${money(m.price * q)}`;
        break;
      }
      case 'add-item': {
        const box = layer.box, m = byId[el.dataset.id], opts = {};
        (m.options || []).forEach(g => { const c = box.querySelector(`input[name="opt-${g.id}"]:checked`); if (c) opts[g.id] = c.value; });
        addToCart(m.id, Number(box.dataset.qty), opts, $('#itemNote').value.trim());
        closeLayer();
        break;
      }
      case 'cart-open': openDrawer(); break;
      case 'qty': changeQty(el.dataset.key, Number(el.dataset.d)); break;
      case 'toggle-nav': toggleNav(); break;
      case 'scroll-cat': {
        const target = document.getElementById((el.dataset.prefix || 'cat-') + el.dataset.cat);
        if (target) target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
        break;
      }
      case 'reel-toggle':
        reel.paused = !reel.paused;
        if (reel.video) reel.paused ? reel.video.pause() : reel.video.play().catch(() => {});
        updateToggle(); break;
      case 'reel-jump': loadClip(Number(el.dataset.i)); break;
      case 'k-advance': {
        const orders = getOrders(), o = orders.find(x => String(x.id) === el.dataset.id);
        if (o) { o.status = STATUS_ORDER[Math.min(3, STATUS_ORDER.indexOf(o.status) + 1)]; saveOrders(orders); kitchenRefresh(); }
        break;
      }
      case 'k-test': testOrder(); break;
      case 'k-clear': saveOrders([]); kitchenRefresh(); break;
      case 'k-sound': kitchen.sound = !kitchen.sound; store.set('lc_sound', kitchen.sound); if (kitchen.sound) chime(); render(); break;
    }
  });
  // Kitchen link: open in a new tab when possible, otherwise same tab (e.g. sandboxed previews)
  document.addEventListener('click', e => {
    const k = e.target.closest('[data-kitchen-link]');
    if (!k) return;
    e.preventDefault();
    let w = null;
    try { w = window.open(location.href.split('#')[0] + '#/kitchen', '_blank'); } catch (err) { /* blocked */ }
    if (!w) location.hash = '#/kitchen';
  }, true);
  document.addEventListener('input', e => {
    if (!e.target.matches('[data-search]')) return;
    const q = e.target.value.trim().toLowerCase();
    $$('.oc').forEach(c => { c.hidden = q && !c.dataset.text.includes(q); });
    $$('[data-cat-block]').forEach(b => { b.hidden = !$$('.oc', b).some(c => !c.hidden); });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { if (layer) closeLayer(); else toggleNav(false); }
    if (e.key === 'Tab' && layer) {
      const f = $$('button, input, textarea, select, a[href]', layer.box).filter(x => !x.disabled && x.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('article[data-action="open-item"]')) { e.preventDefault(); openItem(e.target.dataset.id); }
  });
  function toggleNav(force) {
    const links = $('#navLinks'), btn = $('.hamburger');
    if (!links || !btn) return;
    const open = force === undefined ? !links.classList.contains('open') : force;
    links.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('no-scroll', open);
    const nav = $('#navbar'); if (nav && open) nav.classList.add('scrolled');
  }
  function onScroll() {
    const nav = $('#navbar');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('hashchange', render);
  window.addEventListener('storage', e => {
    if (e.key === 'lc_cart') { state.cart = store.get('lc_cart', []); refreshCart(); }
    if (e.key === 'lc_orders') { if (state.route === 'kitchen') kitchenRefresh(); if (state.route === 'status') statusRefresh(parseRoute().arg); }
  });

  let revealObs = null;
  function initReveal() {
    if (revealObs) revealObs.disconnect();
    const els = $$('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('visible')); return; }
    revealObs = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('visible'); revealObs.unobserve(en.target); }
    }), { threshold: 0.1 });
    els.forEach(el => revealObs.observe(el));
  }

  render();
})();
