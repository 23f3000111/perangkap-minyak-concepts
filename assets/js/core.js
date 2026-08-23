/* =========================================================================
   Perangkap Minyak - shared runtime
   Language switching, data access, form handling, scroll reveal, theme.
   No build step, no dependencies. Works from file:// as well as a server.
   ========================================================================= */
(function (root, doc) {
  'use strict';

  var SITE = root.PM_SITE;
  var CAT = root.PM_CATALOG;
  var STORE_LANG = 'pm-lang';
  var STORE_THEME = 'pm-theme';

  var PM = {
    site: SITE,
    catalog: CAT,
    lang: 'en',
    assets: '../assets/'
  };

  /* ------------------------------------------------------------- language */
  function readLang() {
    var q = new URLSearchParams(root.location.search).get('lang');
    if (q === 'en' || q === 'bm') return q;
    try {
      var s = root.localStorage.getItem(STORE_LANG);
      if (s === 'en' || s === 'bm') return s;
    } catch (e) { /* storage blocked on file:// in some browsers */ }
    return 'en';
  }

  PM.lang = readLang();

  /* Resolve a {en, bm} pair, an array of them, or a plain value. */
  PM.t = function (v) {
    if (v === null || v === undefined) return '';
    if (typeof v === 'string' || typeof v === 'number') return v;
    if (Array.isArray(v)) return v;
    if (Object.prototype.hasOwnProperty.call(v, PM.lang)) return v[PM.lang];
    if (Object.prototype.hasOwnProperty.call(v, 'en')) return v.en;
    return '';
  };

  PM.setLang = function (lang) {
    if (lang !== 'en' && lang !== 'bm') return;
    PM.lang = lang;
    try { root.localStorage.setItem(STORE_LANG, lang); } catch (e) { /* ignore */ }
    doc.documentElement.setAttribute('lang', lang === 'bm' ? 'ms' : 'en');
    doc.documentElement.setAttribute('data-lang', lang);
    PM.emit('langchange', lang);
  };

  /* --------------------------------------------------------------- events */
  var listeners = {};
  PM.on = function (name, fn) { (listeners[name] = listeners[name] || []).push(fn); };
  PM.emit = function (name, payload) {
    (listeners[name] || []).forEach(function (fn) {
      try { fn(payload); } catch (e) { if (root.console) console.error(e); }
    });
  };

  /* ------------------------------------------------------------- helpers */
  PM.el = function (tag, attrs, children) {
    var node = doc.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === 'class') node.className = v;
        else if (k === 'html') node.innerHTML = v;
        else if (k === 'text') node.textContent = v;
        else if (k.indexOf('on') === 0 && typeof v === 'function') node.addEventListener(k.slice(2), v);
        else node.setAttribute(k, v);
      });
    }
    (Array.isArray(children) ? children : children ? [children] : []).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      node.appendChild(typeof c === 'string' ? doc.createTextNode(c) : c);
    });
    return node;
  };

  PM.esc = function (s) {
    return String(s === null || s === undefined ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };

  PM.qs = function (sel, ctx) { return (ctx || doc).querySelector(sel); };
  PM.qsa = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };
  PM.param = function (key) { return new URLSearchParams(root.location.search).get(key); };
  /* Images live under assets/img, media under assets/video. Data files store
     paths relative to those two roots, so resolve the right one here. */
  PM.asset = function (path) {
    if (path.indexOf('video/') === 0) return PM.assets + path;
    return PM.assets + 'img/' + path;
  };

  PM.langHref = function (href) {
    if (PM.lang === 'en') return href;
    return href + (href.indexOf('?') > -1 ? '&' : '?') + 'lang=bm';
  };

  /* ---------------------------------------------------------- data access */
  PM.product = function (slug) {
    return CAT.products.filter(function (p) { return p.slug === slug; })[0] || null;
  };
  PM.productsBy = function (cat, sub) {
    return CAT.products.filter(function (p) {
      return p.cat === cat && (!sub || p.sub === sub);
    });
  };
  PM.featured = function (n) {
    return CAT.products.filter(function (p) { return p.featured; }).slice(0, n || 8);
  };
  PM.productByModel = function (code) {
    return CAT.products.filter(function (p) { return p.model === code; })[0] || null;
  };
  PM.service = function (slug) {
    return CAT.services.filter(function (s) { return s.slug === slug; })[0] || null;
  };
  PM.article = function (slug) {
    return SITE.news.filter(function (n) { return n.slug === slug; })[0] || null;
  };
  PM.related = function (product, n) {
    var pool = CAT.products.filter(function (p) {
      return p.slug !== product.slug && (p.cat === product.cat || p.sub === product.sub);
    });
    if (pool.length < (n || 4)) {
      pool = pool.concat(CAT.products.filter(function (p) {
        return p.slug !== product.slug && pool.indexOf(p) === -1;
      }));
    }
    return pool.slice(0, n || 4);
  };

  /* Recommend a grease trap model from meals per day. */
  PM.recommendModel = function (meals) {
    var table = CAT.models.filter(function (m) { return m.gpm > 0; });
    for (var i = 0; i < table.length; i++) {
      var hi = parseInt(String(table[i].meals).split(' to ')[1], 10);
      if (!isNaN(hi) && meals <= hi) return table[i];
    }
    return table[table.length - 1];
  };

  PM.dosingFor = function (modelCode) {
    return CAT.dosing.filter(function (d) { return d.model === modelCode; })[0] || null;
  };

  /* -------------------------------------------------------------- contact */
  PM.waLink = function (message) {
    var text = message || (PM.lang === 'bm'
      ? 'Salam, saya ingin bertanya tentang perangkap minyak.'
      : 'Hello, I would like to ask about a grease trap.');
    return 'https://wa.me/' + SITE.contact.whatsapp + '?text=' + encodeURIComponent(text);
  };

  PM.waProduct = function (product) {
    var name = PM.t(product.name);
    return PM.waLink(PM.lang === 'bm'
      ? 'Salam, saya ingin bertanya tentang ' + name + '. Boleh berikan sebut harga?'
      : 'Hello, I would like to ask about the ' + name + '. Could you send a quotation?');
  };

  PM.telLink = function () { return 'tel:' + SITE.contact.officePhone; };
  PM.mailLink = function () { return 'mailto:' + SITE.contact.email; };

  /* --------------------------------------------------------- i18n binding */
  /* Elements carry data-en and data-bm, or data-i18n pointing into PM_SITE.ui */
  PM.applyI18n = function (ctx) {
    var scope = ctx || doc;

    PM.qsa('[data-en]', scope).forEach(function (n) {
      var v = n.getAttribute('data-' + PM.lang) || n.getAttribute('data-en');
      if (n.hasAttribute('data-i18n-html')) n.innerHTML = v;
      else n.textContent = v;
    });

    PM.qsa('[data-i18n]', scope).forEach(function (n) {
      var key = n.getAttribute('data-i18n');
      var entry = SITE.ui[key];
      if (entry) n.textContent = PM.t(entry);
    });

    PM.qsa('[data-i18n-attr]', scope).forEach(function (n) {
      // format: "placeholder:mobile|aria-label:menu"
      n.getAttribute('data-i18n-attr').split('|').forEach(function (pair) {
        var bits = pair.split(':');
        var entry = SITE.ui[bits[1]];
        if (entry) n.setAttribute(bits[0], PM.t(entry));
      });
    });

    PM.qsa('[data-lang-href]', scope).forEach(function (n) {
      n.setAttribute('href', PM.langHref(n.getAttribute('data-lang-href')));
    });
  };

  /* ------------------------------------------------------- language toggle */
  PM.mountLangToggle = function () {
    PM.qsa('[data-lang-btn]').forEach(function (btn) {
      var target = btn.getAttribute('data-lang-btn');
      btn.setAttribute('aria-pressed', String(target === PM.lang));
      btn.addEventListener('click', function () {
        PM.setLang(target);
      });
    });
    PM.on('langchange', function () {
      PM.qsa('[data-lang-btn]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-lang-btn') === PM.lang));
      });
      PM.applyI18n();
      PM.emit('render');
    });
  };

  /* ---------------------------------------------------------------- theme */
  PM.initTheme = function () {
    var saved = null;
    try { saved = root.localStorage.getItem(STORE_THEME); } catch (e) { /* ignore */ }
    /* Both sites are light only now, so there is nothing to restore. The
       button is not rendered either; this stays as a no-op so a stored
       preference from an older visit cannot darken the page. */
    if (saved) { try { root.localStorage.removeItem(STORE_THEME); } catch (e) { /* ignore */ } }

    PM.qsa('[data-theme-btn]').forEach(function (btn) {
      btn.setAttribute('aria-label', PM.t(SITE.ui.theme));
      btn.addEventListener('click', function () {
        var next = doc.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        doc.documentElement.setAttribute('data-theme', next);
        try { root.localStorage.setItem(STORE_THEME, next); } catch (e) { /* ignore */ }
      });
    });
  };

  /* -------------------------------------------------------- scroll reveal */
  PM.reveal = function () {
    var reduce = root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var nodes = PM.qsa('[data-reveal]');
    if (reduce || !('IntersectionObserver' in root)) {
      nodes.forEach(function (n) { n.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var delay = parseInt(e.target.getAttribute('data-reveal-delay') || '0', 10);
        root.setTimeout(function () { e.target.classList.add('is-in'); }, delay);
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    nodes.forEach(function (n) { io.observe(n); });
  };

  /* Count a number up when it scrolls into view. Communicates scale. */
  PM.countUp = function () {
    var reduce = root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var nodes = PM.qsa('[data-count]');
    if (!nodes.length) return;
    if (reduce || !('IntersectionObserver' in root)) {
      nodes.forEach(function (n) { n.textContent = n.getAttribute('data-count'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var node = e.target;
        var target = parseFloat(node.getAttribute('data-count'));
        var dur = 1100;
        var t0 = null;
        function step(ts) {
          if (t0 === null) t0 = ts;
          var p = Math.min((ts - t0) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          var val = target * eased;
          node.textContent = target % 1 === 0 ? Math.round(val).toLocaleString('en-MY') : val.toFixed(1);
          if (p < 1) root.requestAnimationFrame(step);
        }
        root.requestAnimationFrame(step);
        io.unobserve(node);
      });
    }, { threshold: 0.5 });
    nodes.forEach(function (n) { io.observe(n); });
  };

  /* ---------------------------------------------------------- mobile nav */
  PM.mountNav = function () {
    var toggle = PM.qs('[data-nav-toggle]');
    var panel = PM.qs('[data-nav-panel]');
    if (!toggle || !panel) return;

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      panel.classList.toggle('is-open', open);
      doc.body.classList.toggle('nav-locked', open);
    }
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
    PM.qsa('a', panel).forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });

    /* Desktop dropdowns: open on hover and on keyboard focus. */
    PM.qsa('[data-dropdown]').forEach(function (dd) {
      var btn = PM.qs('[data-dropdown-btn]', dd);
      if (!btn) return;
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var open = dd.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(open));
      });
      doc.addEventListener('click', function (e) {
        if (!dd.contains(e.target)) {
          dd.classList.remove('is-open');
          btn.setAttribute('aria-expanded', 'false');
        }
      });
    });
  };

  /* Mark the current page in the nav. */
  PM.markActive = function () {
    var here = root.location.pathname.split('/').pop() || 'index.html';
    PM.qsa('[data-nav] a').forEach(function (a) {
      var href = (a.getAttribute('href') || '').split('?')[0];
      if (href === here) {
        a.setAttribute('aria-current', 'page');
        var parent = a.closest('[data-dropdown]');
        if (parent) parent.classList.add('has-current');
      }
    });
  };

  /* --------------------------------------------------------- header state */
  PM.mountHeader = function () {
    var header = PM.qs('[data-header]');
    if (!header || !('IntersectionObserver' in root)) return;
    var sentinel = PM.el('div', { 'aria-hidden': 'true', style: 'position:absolute;top:0;height:1px;width:1px' });
    doc.body.insertBefore(sentinel, doc.body.firstChild);
    new IntersectionObserver(function (entries) {
      header.classList.toggle('is-stuck', !entries[0].isIntersecting);
    }, { threshold: 0 }).observe(sentinel);
  };

  /* ----------------------------------------------------------------- form */
  PM.mountForms = function () {
    PM.qsa('form[data-enquiry]').forEach(function (form) {
      form.setAttribute('novalidate', 'novalidate');

      function fieldError(input, msgKey) {
        var wrap = input.closest('.field');
        if (!wrap) return;
        var err = PM.qs('.field-error', wrap);
        if (!err) {
          err = PM.el('p', { class: 'field-error', role: 'alert' });
          wrap.appendChild(err);
        }
        err.textContent = msgKey ? PM.t(SITE.ui[msgKey]) : '';
        wrap.classList.toggle('has-error', !!msgKey);
        input.setAttribute('aria-invalid', msgKey ? 'true' : 'false');
      }

      function validate() {
        var ok = true;
        PM.qsa('[required]', form).forEach(function (input) {
          var v = input.value.trim();
          if (!v) { fieldError(input, 'required'); ok = false; return; }
          if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
            fieldError(input, 'invalidEmail'); ok = false; return;
          }
          if (input.type === 'tel' && !/^[0-9\s+\-()]{7,}$/.test(v)) {
            fieldError(input, 'invalidPhone'); ok = false; return;
          }
          fieldError(input, null);
        });
        return ok;
      }

      PM.qsa('input, textarea, select', form).forEach(function (input) {
        input.addEventListener('blur', function () {
          if (input.hasAttribute('required')) validate();
        });
      });

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validate()) {
          var firstBad = PM.qs('.has-error input, .has-error textarea, .has-error select', form);
          if (firstBad) firstBad.focus();
          return;
        }
        var btn = PM.qs('[type="submit"]', form);
        var status = PM.qs('[data-form-status]', form);
        if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = PM.t(SITE.ui.sending); }

        /* Mockup behaviour: no backend is wired up. The submission is
           acknowledged locally and the same details are offered on WhatsApp,
           which is how enquiries actually reach this business today. */
        root.setTimeout(function () {
          form.classList.add('is-sent');
          if (status) {
            status.hidden = false;
            status.textContent = PM.t(SITE.ui.sent);
            status.focus();
          }
          if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label; }
          form.reset();
        }, 700);
      });
    });
  };

  /* --------------------------------------------------------------- footer */
  PM.stampYear = function () {
    PM.qsa('[data-year]').forEach(function (n) { n.textContent = new Date().getFullYear(); });
  };

  /* ------------------------------------------------------------ lightbox */
  PM.mountLightbox = function () {
    var items = PM.qsa('[data-lightbox]');
    if (!items.length) return;

    var overlay = PM.el('div', { class: 'lightbox', hidden: 'hidden', role: 'dialog', 'aria-modal': 'true' });
    /* Start on a transparent pixel so the empty overlay never reports a
       broken image before the first item is opened. */
    var img = PM.el('img', { alt: '', src: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' });
    var cap = PM.el('p', { class: 'lightbox-cap' });
    var close = PM.el('button', { class: 'lightbox-close', type: 'button', 'aria-label': PM.t(SITE.ui.close), html: '<i class="ph ph-x" aria-hidden="true"></i>' });
    var prev = PM.el('button', { class: 'lightbox-nav lightbox-prev', type: 'button', 'aria-label': 'Previous', html: '<i class="ph ph-caret-left" aria-hidden="true"></i>' });
    var next = PM.el('button', { class: 'lightbox-nav lightbox-next', type: 'button', 'aria-label': 'Next', html: '<i class="ph ph-caret-right" aria-hidden="true"></i>' });
    var figure = PM.el('figure', { class: 'lightbox-figure' }, [img, cap]);
    overlay.appendChild(close); overlay.appendChild(prev); overlay.appendChild(figure); overlay.appendChild(next);
    doc.body.appendChild(overlay);

    var index = 0;
    var lastFocus = null;

    function show(i) {
      index = (i + items.length) % items.length;
      var el = items[index];
      img.src = el.getAttribute('data-lightbox');
      img.alt = el.getAttribute('data-lightbox-alt') || '';
      cap.textContent = el.getAttribute('data-lightbox-cap') || '';
      cap.hidden = !cap.textContent;
    }
    function open(i) {
      lastFocus = doc.activeElement;
      show(i);
      overlay.hidden = false;
      doc.body.classList.add('nav-locked');
      close.focus();
    }
    function shut() {
      overlay.hidden = true;
      doc.body.classList.remove('nav-locked');
      if (lastFocus) lastFocus.focus();
    }

    items.forEach(function (el, i) {
      el.addEventListener('click', function (e) { e.preventDefault(); open(i); });
      if (el.tagName !== 'BUTTON' && el.tagName !== 'A') {
        el.setAttribute('tabindex', '0');
        el.setAttribute('role', 'button');
        el.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
        });
      }
    });
    close.addEventListener('click', shut);
    prev.addEventListener('click', function () { show(index - 1); });
    next.addEventListener('click', function () { show(index + 1); });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) shut(); });
    doc.addEventListener('keydown', function (e) {
      if (overlay.hidden) return;
      if (e.key === 'Escape') shut();
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
  };

  /* ------------------------------------------------------------ accordion */
  PM.mountAccordions = function () {
    PM.qsa('[data-accordion]').forEach(function (acc) {
      PM.qsa('[data-accordion-btn]', acc).forEach(function (btn) {
        btn.addEventListener('click', function () {
          var open = btn.getAttribute('aria-expanded') === 'true';
          if (!acc.hasAttribute('data-accordion-multi')) {
            PM.qsa('[data-accordion-btn]', acc).forEach(function (b) {
              b.setAttribute('aria-expanded', 'false');
              var p = doc.getElementById(b.getAttribute('aria-controls'));
              if (p) p.hidden = true;
            });
          }
          btn.setAttribute('aria-expanded', String(!open));
          var panel = doc.getElementById(btn.getAttribute('aria-controls'));
          if (panel) panel.hidden = open;
        });
      });
    });
  };

  /* ---------------------------------------------------------------- boot */
  PM.boot = function (pageInit) {
    doc.documentElement.setAttribute('data-lang', PM.lang);
    doc.documentElement.setAttribute('lang', PM.lang === 'bm' ? 'ms' : 'en');

    function run() {
      /* The page callback builds the header, footer and page body. Everything
         below binds behaviour to that markup, so it has to run first. */
      if (typeof pageInit === 'function') pageInit(PM);
      PM.mountNav();
      PM.mountHeader();
      PM.mountLangToggle();
      PM.initTheme();
      PM.stampYear();
      PM.applyI18n();
      PM.mountForms();
      PM.mountAccordions();
      PM.mountLightbox();
      PM.reveal();
      PM.countUp();
      PM.markActive();
      doc.documentElement.classList.add('is-ready');
      PM.emit('ready');
    }

    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', run);
    else run();
  };

  root.PM = PM;
})(window, document);
