/* =========================================================================
   Site D - development check harness. Not part of the client handover and
   never linked from the site. Open checks.html to run it.
   ========================================================================= */
(function (root, doc) {
  'use strict';

  var CHECKS = { cases: [] };

  CHECKS.test = function (name, fn) { CHECKS.cases.push({ name: name, fn: fn }); };

  CHECKS.ok = function (v, msg) {
    if (!v) throw new Error((msg || 'expected truthy') + ' (got ' + String(v) + ')');
  };
  CHECKS.eq = function (a, b, msg) {
    if (a !== b) throw new Error((msg || 'not equal') + ': expected ' + String(b) + ', got ' + String(a));
  };
  CHECKS.near = function (a, b, tol, msg) {
    if (Math.abs(a - b) > tol) throw new Error((msg || 'not near') + ': expected ' + b + ' +-' + tol + ', got ' + a);
  };

  CHECKS.run = function () {
    var pass = 0, failures = [];
    CHECKS.cases.forEach(function (c) {
      try { c.fn(); pass++; }
      catch (e) { failures.push({ name: c.name, error: e.message }); }
    });
    var out = { pass: pass, fail: failures.length, total: CHECKS.cases.length, failures: failures };
    root.__CHECKS__ = out;
    return out;
  };

  CHECKS.render = function (result) {
    var mount = doc.getElementById('report');
    if (!mount) return;
    var h = doc.createElement('h1');
    h.textContent = result.fail === 0
      ? 'PASS ' + result.pass + '/' + result.total
      : 'FAIL ' + result.fail + ' of ' + result.total;
    h.style.color = result.fail === 0 ? '#146637' : '#C0392B';
    mount.appendChild(h);
    result.failures.forEach(function (f) {
      var p = doc.createElement('p');
      p.textContent = f.name + ' -> ' + f.error;
      mount.appendChild(p);
    });
  };

  /* ------------------------------------------------------------ Task 1 */

  CHECKS.test('shared data is loaded', function () {
    CHECKS.ok(root.PM_SITE, 'PM_SITE missing');
    CHECKS.ok(root.PM_CATALOG, 'PM_CATALOG missing');
    CHECKS.eq(root.PM_CATALOG.models.length, 17, 'model count');
    CHECKS.eq(root.PM_CATALOG.products.length, 38, 'product count');
    CHECKS.eq(root.PM_CATALOG.services.length, 5, 'service count');
  });

  CHECKS.test('scenes.js is NOT loaded', function () {
    CHECKS.ok(!root.PM || !root.PM.scenes, 'scenes.js must not be loaded on Site D');
  });

  CHECKS.test('APP exposes its namespaces', function () {
    CHECKS.ok(root.APP, 'APP missing');
    CHECKS.eq(typeof root.APP.init, 'function', 'APP.init');
    CHECKS.ok(root.APP.ui && root.APP.blocks && root.APP.pages && root.APP.chassis, 'APP namespaces');
  });

  CHECKS.test('colour tokens carry the exact spec values', function () {
    var cs = getComputedStyle(doc.documentElement);
    var want = {
      '--navy': '#0B2C53', '--navy-deep': '#071F3C', '--navy-soft': '#16406F',
      '--ink': '#16233A', '--steel': '#5B6B80', '--hairline': '#DCE3EC',
      '--surface': '#FFFFFF', '--wash': '#EEF6EF', '--wash-cool': '#F2F6FA',
      '--green': '#1A7F3E', '--green-deep': '#146637', '--green-bright': '#23A455',
      '--gold': '#C9922B', '--danger': '#C0392B'
    };
    Object.keys(want).forEach(function (k) {
      CHECKS.eq(cs.getPropertyValue(k).trim().toUpperCase(), want[k], 'token ' + k);
    });
  });


  /* ------------------------------------------------------------ Task 2 */

  function headerFixture() {
    var host = doc.createElement('div');
    host.setAttribute('data-header', '');
    doc.body.insertBefore(host, doc.body.firstChild);
    root.APP.chassis.header();
    return host;
  }

  CHECKS.test('header renders the full nav from SITE.nav', function () {
    var host = headerFixture();
    CHECKS.ok(host.querySelector('.hdr-mark'), 'wordmark');
    CHECKS.eq(host.querySelectorAll('[data-nav] > ul > li').length, root.PM_SITE.nav.length, 'top level items');
    CHECKS.eq(host.querySelectorAll('[data-dropdown]').length, 3, 'three dropdown groups');
    CHECKS.ok(host.querySelector('[data-lang-btn="bm"]'), 'BM toggle');
    CHECKS.ok(host.querySelector('[data-nav-toggle]'), 'burger');
    host.remove();
  });

  CHECKS.test('every dropdown button starts closed and is labelled', function () {
    var host = headerFixture();
    root.PM.qsa('[data-dropdown-btn]', host).forEach(function (b) {
      CHECKS.eq(b.getAttribute('aria-expanded'), 'false', 'aria-expanded');
      CHECKS.ok(b.textContent.trim().length > 0, 'button has a label');
    });
    host.remove();
  });

  CHECKS.test('every navigation target is built, and a stray link still lands', function () {
    /* The whole of SITE.nav is built now, so nothing a reader can click
       should be routed away. The placeholder is kept for a hand-typed
       path that does not resolve, and that is what is checked here. */
    function walk(entries) {
      entries.forEach(function (e) {
        if (e.children) return walk(e.children);
        CHECKS.eq(root.APP.ui.href(e.href, e.label), e.href, e.href + ' is built');
      });
    }
    walk(root.PM.site.nav);
    CHECKS.eq(root.APP.ui.href('not-a-page.html', 'Nope'), 'soon.html?p=Nope', 'unknown page routed');
  });

  CHECKS.test('header element does not use the class motion.headerAuto grabs', function () {
    CHECKS.ok(!doc.querySelector('header.header'), 'header must be .site-header, not .header');
  });


  /* ------------------------------------------------------------ Task 3 */

  function footerFixture() {
    var host = doc.createElement('footer');
    host.setAttribute('data-footer', '');
    doc.body.appendChild(host);
    root.APP.chassis.footer();
    return host;
  }

  CHECKS.test('footer carries four link columns and the legal line', function () {
    var host = footerFixture();
    CHECKS.eq(host.querySelectorAll('.ftr-col').length, 4, 'four columns');
    CHECKS.ok(host.querySelector('[data-year]'), 'year stamp hook');
    CHECKS.ok(host.textContent.indexOf(root.PM_SITE.brand.legal) !== -1, 'legal name present');
    CHECKS.ok(host.textContent.indexOf(root.PM_SITE.brand.regNo) !== -1, 'registration number present');
    host.remove();
  });

  CHECKS.test('footer lists the head office and every factory', function () {
    var host = footerFixture();
    var n = root.PM_SITE.contact.factories.length + 1;
    CHECKS.eq(host.querySelectorAll('.ftr-place').length, n, 'hq plus factories');
    host.remove();
  });

  CHECKS.test('whatsapp float opens a real wa.me link', function () {
    root.APP.chassis.whatsapp();
    var a = doc.querySelector('.wa-float');
    CHECKS.ok(a, 'float present');
    CHECKS.ok(/^https:\/\/wa\.me\//.test(a.getAttribute('href')), 'wa.me href');
    CHECKS.eq(a.getAttribute('rel'), 'noopener', 'rel');
    CHECKS.ok(a.getAttribute('aria-label'), 'aria-label');
    a.remove();
  });

  /* ------------------------------------------------------------ Task 4 */

  CHECKS.test('band builds a section with a wrap and honours tone and jump', function () {
    var b = root.APP.blocks._band('test', { tone: 'wash', id: 'sec-x', jump: { en: 'Test', bm: 'Uji' } });
    CHECKS.eq(b.tagName, 'SECTION', 'is a section');
    CHECKS.ok(b.classList.contains('band'), 'band class');
    CHECKS.ok(b.classList.contains('band--test'), 'named class');
    CHECKS.ok(b.classList.contains('is-wash'), 'tone class');
    CHECKS.eq(b.id, 'sec-x', 'id');
    CHECKS.eq(b.getAttribute('data-jump'), 'Test', 'jump label');
    CHECKS.ok(b.body && b.body.classList.contains('wrap'), 'exposed .body wrap');
  });

  CHECKS.test('arcs are decorative and never focusable', function () {
    ['top', 'bottom', 'tr'].forEach(function (d) {
      var a = root.APP.ui.arc(d);
      CHECKS.eq(a.getAttribute('aria-hidden'), 'true', 'aria-hidden ' + d);
      CHECKS.eq(a.tabIndex, -1, 'not focusable ' + d);
      CHECKS.ok(a.classList.contains('arc--' + d), 'direction class ' + d);
    });
  });

  CHECKS.test('photo wraps a measured frame and a curtain', function () {
    var p = root.APP.ui.photo('gallery/project-01.jpg', 'A completed installation', 'plate');
    CHECKS.ok(p.querySelector('.frame img'), 'framed image');
    CHECKS.eq(p.querySelector('img').getAttribute('alt'), 'A completed installation', 'alt text');
    CHECKS.ok(/\.\.\/assets\/img\//.test(p.querySelector('img').getAttribute('src')), 'asset path');
    CHECKS.ok(p.querySelector('.curtain'), 'curtain');
  });

  CHECKS.test('photo never ships an empty alt for content imagery', function () {
    var threw = false;
    try { root.APP.ui.photo('gallery/project-01.jpg', '', 'plate'); } catch (e) { threw = true; }
    CHECKS.ok(threw, 'empty alt must throw so it is caught in development');
  });

  CHECKS.test('figure odometers a numeric value and prints a plain one', function () {
    var a = root.APP.ui.figure(17, { en: 'Models', bm: 'Model' }, { roll: true });
    CHECKS.ok(a.querySelector('[data-roll]'), 'numeric value rolls');
    var b = root.APP.ui.figure('SIRIM', { en: 'Certified', bm: 'Diperakui' }, { roll: true });
    CHECKS.ok(!b.querySelector('[data-roll]'), 'non-numeric value does not roll');
  });


  /* ------------------------------------------------------------ Task 5 */

  CHECKS.test('lead puts the eyebrow left and the copy right', function () {
    var s = root.APP.blocks.lead({
      eyebrow: { en: 'Our approach', bm: 'Pendekatan kami' },
      heading: { en: 'Separation by density', bm: 'Pemisahan mengikut ketumpatan' },
      body: [{ en: 'Fat floats, water passes, solids sink.', bm: 'Lemak terapung, air lalu, pepejal tenggelam.' }]
    });
    CHECKS.ok(s.querySelector('.eyebrow'), 'eyebrow');
    CHECKS.eq(s.querySelectorAll('.lead-copy p').length, 1, 'one paragraph');
    CHECKS.ok(s.textContent.indexOf('Fat floats') !== -1, 'copy rendered');
  });

  CHECKS.test('statement emphasises without innerHTML', function () {
    var s = root.APP.blocks.statement({
      text: { en: 'We manufacture grease traps in Malaysia and we service them.', bm: '-' },
      emphasis: ['manufacture', 'service them']
    });
    CHECKS.eq(s.querySelectorAll('.em').length, 2, 'two emphasised phrases');
    CHECKS.eq(s.textContent.indexOf('<'), -1, 'no raw markup leaked into text');
    CHECKS.ok(s.textContent.indexOf('We manufacture grease traps') !== -1, 'sentence intact');
  });

  CHECKS.test('cta with whatsapp renders two controls', function () {
    var s = root.APP.blocks.cta({
      heading: { en: 'Tell us your meal volume', bm: '-' },
      primary: { href: 'contact.html', label: { en: 'Request a quote', bm: '-' } },
      whatsapp: true
    });
    CHECKS.eq(s.querySelectorAll('.pill').length, 2, 'two controls');
    CHECKS.ok(s.querySelector('a[href^="https://wa.me/"]'), 'whatsapp link');
  });

  /* ------------------------------------------------------------ Task 6 */

  CHECKS.test('trust figures are counted from the data, not typed', function () {
    var f = root.APP.data.figures('trust');
    CHECKS.eq(f.length, 4, 'four cards');
    CHECKS.eq(f[0].value, root.PM_SITE.brand.since, 'since');
    CHECKS.eq(f[1].value, 17, 'models');
    CHECKS.eq(f[2].value, root.PM_SITE.approvals.length + root.PM_SITE.approvalsExtra.length, 'authorities');
    CHECKS.eq(f[2].value, 15, 'authorities is 15');
    CHECKS.eq(f[3].value, 8, 'warranty years');
  });

  CHECKS.test('compliance figures match the data lengths', function () {
    var f = root.APP.data.figures('compliance');
    CHECKS.eq(f[0].value, root.PM_SITE.certs.length, 'certs');
    CHECKS.eq(f[1].value, root.PM_SITE.awards.length, 'awards');
    CHECKS.eq(f[2].value, root.PM_SITE.clients.length, 'named sites');
  });

  CHECKS.test('no invented installation count appears anywhere', function () {
    ['trust', 'compliance', 'about'].forEach(function (set) {
      root.APP.data.figures(set).forEach(function (f) {
        CHECKS.ok(String(f.value).indexOf('200') === -1, 'no 200+ figure in ' + set);
      });
    });
  });

  CHECKS.test('the year does not odometer but the counts do', function () {
    var s = root.APP.blocks.figures({ set: 'trust' });
    var cards = s.querySelectorAll('.fig-card');
    CHECKS.eq(cards.length, 4, 'four cards rendered');
    CHECKS.ok(!cards[0].querySelector('[data-roll]'), 'year prints raw');
    CHECKS.ok(cards[1].querySelector('[data-roll]'), 'model count rolls');
    CHECKS.eq(s.querySelectorAll('.arc--tr').length, 4, 'each card carries a corner arc');
  });

  /* ------------------------------------------------------------ Task 7 */

  CHECKS.test('a tile with an image renders a curtained photo', function () {
    var s = root.APP.blocks.tiles({
      heading: { en: 'What we do', bm: '-' }, cols: 3,
      items: [{ href: 'services.html', label: { en: 'Services', bm: '-' },
                img: 'service/sewerage-1.webp', alt: 'A sewerage crew at work' }]
    });
    var tile = s.querySelector('.tile');
    CHECKS.ok(tile.querySelector('.photo .curtain'), 'curtain present');
    CHECKS.ok(tile.querySelector('.circ'), 'circular arrow');
    CHECKS.ok(!tile.classList.contains('tile--fig'), 'not a figure tile');
  });

  CHECKS.test('a tile with no image falls back to a navy figure tile', function () {
    var s = root.APP.blocks.tiles({
      cols: 3,
      items: [{ href: 'model-finder.html', label: { en: 'Model finder', bm: '-' }, figure: 17 }]
    });
    var tile = s.querySelector('.tile');
    CHECKS.ok(tile.classList.contains('tile--fig'), 'figure tile');
    CHECKS.ok(!tile.querySelector('img'), 'no weak image is invented');
    CHECKS.ok(tile.querySelector('.fig'), 'mono figure');
  });

  CHECKS.test('tiles link straight to a built page, and route anything else', function () {
    var built = root.APP.blocks.tiles({
      cols: 2,
      items: [{ href: 'awards.html', label: { en: 'Awards', bm: '-' }, figure: 9 }]
    });
    CHECKS.ok(/awards\.html/.test(built.querySelector('.tile').getAttribute('href')),
      'a built page is linked directly');

    var stray = root.APP.blocks.tiles({
      cols: 2,
      items: [{ href: 'not-a-page.html', label: { en: 'Nope', bm: '-' }, figure: 9 }]
    });
    CHECKS.ok(/soon\.html/.test(stray.querySelector('.tile').getAttribute('href')),
      'an unknown page is routed to the placeholder');
  });

  CHECKS.test('every tile is a single link, not a nest of them', function () {
    var s = root.APP.blocks.tiles({
      cols: 2,
      items: [{ href: 'services.html', label: { en: 'Services', bm: '-' },
                img: 'service/sewerage-1.webp', alt: 'A sewerage crew at work' }]
    });
    CHECKS.eq(s.querySelectorAll('.tile a').length, 0, 'no anchor inside the tile anchor');
    CHECKS.eq(s.querySelectorAll('a.tile').length, 1, 'the tile itself is the anchor');
  });

  /* ------------------------------------------------------------ Task 8 */

  CHECKS.test('page hero renders panel, photo and quick links', function () {
    var s = root.APP.blocks.hero({
      eyebrow: { en: 'Oil interceptor', bm: '-' },
      heading: { en: 'GTA9001', bm: 'GTA9001' },
      body: { en: 'Efficient oil and grease separation.', bm: '-' },
      cta: { href: 'contact.html', label: { en: 'Request a quote', bm: '-' } },
      img: 'products/gta335-2.jpg', alt: 'A centralized grease trap',
      links: [{ href: 'grease-traps.html', label: { en: 'Grease Traps', bm: '-' } }]
    });
    CHECKS.ok(s.querySelector('.hero-copy h1'), 'display heading');
    CHECKS.ok(s.querySelector('.photo img'), 'photo');
    CHECKS.eq(s.querySelectorAll('.hero-links a').length, 1, 'quick links');
    CHECKS.ok(!s.querySelector('.hero-rail'), 'no rail on a static hero');
  });

  CHECKS.test('rotating hero builds a rail with one dot per slide', function () {
    var s = root.APP.blocks.hero({ slides: [
      { eyebrow: { en: 'A', bm: '-' }, heading: { en: 'One', bm: '-' }, body: { en: 'x', bm: '-' },
        img: 'products/gta335-2.jpg', alt: 'one' },
      { eyebrow: { en: 'B', bm: '-' }, heading: { en: 'Two', bm: '-' }, body: { en: 'y', bm: '-' },
        img: 'products/adu-cabinet-2.webp', alt: 'two' },
      { eyebrow: { en: 'C', bm: '-' }, heading: { en: 'Three', bm: '-' }, body: { en: 'z', bm: '-' },
        img: 'products/goodbac-5l.webp', alt: 'three' }
    ] });
    CHECKS.eq(s.querySelectorAll('.hero-dot').length, 3, 'three dots');
    CHECKS.eq(s.querySelector('.hero-copy h1').textContent, 'One', 'starts on slide 0');
    CHECKS.eq(s.querySelectorAll('.hero-dot[aria-current="true"]').length, 1, 'one current dot');
    CHECKS.ok(s.querySelector('.hero-rail'), 'rail present');
    s.stop();
  });

  CHECKS.test('reduced motion creates no rotation timer', function () {
    var real = root.PM.motion.reduce;
    root.PM.motion.reduce = true;
    var s = root.APP.blocks.hero({ slides: [
      { heading: { en: 'One', bm: '-' }, body: { en: 'x', bm: '-' }, img: 'products/gta335-2.jpg', alt: 'one' },
      { heading: { en: 'Two', bm: '-' }, body: { en: 'y', bm: '-' }, img: 'products/adu-cabinet-2.webp', alt: 'two' }
    ] });
    CHECKS.eq(s.dataset.timer, undefined, 'no timer id stored');
    CHECKS.eq(s.querySelector('.hero-copy h1').textContent, 'One', 'first slide only');
    root.PM.motion.reduce = real;
  });

  CHECKS.test('advancing a slide swaps text and does not rebuild the panel', function () {
    var s = root.APP.blocks.hero({ slides: [
      { heading: { en: 'One', bm: '-' }, body: { en: 'x', bm: '-' }, img: 'products/gta335-2.jpg', alt: 'one' },
      { heading: { en: 'Two', bm: '-' }, body: { en: 'y', bm: '-' }, img: 'products/adu-cabinet-2.webp', alt: 'two' }
    ] });
    var panel = s.querySelector('.hero-copy');
    s.go(1);
    CHECKS.eq(s.querySelector('.hero-copy'), panel, 'same panel node');
    CHECKS.eq(panel.querySelector('h1').textContent, 'Two', 'text swapped');
    s.stop();
  });

  /* ------------------------------------------------------------ Task 9 */

  function expanderFixture() {
    return root.APP.blocks.expander({
      heading: { en: 'What we do', bm: '-' },
      items: [
        { num: '01', title: { en: 'Manufacturing', bm: '-' }, body: { en: 'a', bm: '-' },
          img: 'news/factory.webp', alt: 'The factory floor' },
        { num: '02', title: { en: 'Installation', bm: '-' }, body: { en: 'b', bm: '-' },
          img: 'install/step-1.jpg', alt: 'An installation in progress' },
        { num: '03', title: { en: 'Service', bm: '-' }, body: { en: 'c', bm: '-' },
          img: 'service/sewerage-1.webp', alt: 'A service crew' }
      ]
    });
  }

  CHECKS.test('expander starts closed with every card collapsed', function () {
    var s = expanderFixture();
    CHECKS.eq(s.querySelectorAll('.exp-card').length, 3, 'three cards');
    root.PM.qsa('.exp-card', s).forEach(function (b) {
      CHECKS.eq(b.getAttribute('aria-expanded'), 'false', 'collapsed');
    });
    CHECKS.ok(s.querySelector('.exp-panel').hidden, 'panel hidden');
  });

  CHECKS.test('opening a card fills the panel and flips only that card', function () {
    var s = expanderFixture();
    s.open(1);
    var cards = s.querySelectorAll('.exp-card');
    CHECKS.eq(cards[0].getAttribute('aria-expanded'), 'false', 'card 0 stays closed');
    CHECKS.eq(cards[1].getAttribute('aria-expanded'), 'true', 'card 1 open');
    CHECKS.ok(!s.querySelector('.exp-panel').hidden, 'panel visible');
    CHECKS.ok(s.querySelector('.exp-panel').textContent.indexOf('Installation') !== -1, 'panel shows item 1');
  });

  CHECKS.test('opening a second card crossfades rather than rebuilding', function () {
    var s = expanderFixture();
    s.open(0);
    var panel = s.querySelector('.exp-panel');
    s.open(2);
    CHECKS.eq(s.querySelector('.exp-panel'), panel, 'same panel node');
    CHECKS.eq(s.querySelectorAll('.exp-card[aria-expanded="true"]').length, 1, 'only one open');
    CHECKS.ok(panel.textContent.indexOf('Service') !== -1, 'content swapped');
  });

  CHECKS.test('panel is a labelled region and closes cleanly', function () {
    var s = expanderFixture();
    s.open(0);
    var panel = s.querySelector('.exp-panel');
    CHECKS.eq(panel.getAttribute('role'), 'region', 'role');
    CHECKS.ok(panel.getAttribute('aria-labelledby'), 'labelled');
    s.close();
    CHECKS.ok(panel.hidden, 'hidden again');
    CHECKS.eq(s.querySelectorAll('.exp-card[aria-expanded="true"]').length, 0, 'all collapsed');
  });

  /* ----------------------------------------------------------- Task 10 */

  CHECKS.test('carousel uses a native scroll-snap track', function () {
    var s = root.APP.blocks.carousel({
      heading: { en: 'Projects', bm: '-' },
      items: root.PM_SITE.gallery.slice(0, 4).map(function (g, i) {
        return { href: 'project-gallery.html', img: g.img, alt: 'Project plate ' + (i + 1),
                 title: { en: 'Plate ' + (i + 1), bm: '-' } };
      })
    });
    CHECKS.ok(s.querySelector('.car-track'), 'track present');
    CHECKS.eq(s.querySelectorAll('.car-card').length, 4, 'four cards');
    CHECKS.ok(s.querySelector('.car-rail'), 'progress rail');
    CHECKS.eq(s.querySelectorAll('.car-nav button').length, 2, 'prev and next');
  });

  CHECKS.test('carousel controls are labelled and the rail is decorative', function () {
    var s = root.APP.blocks.carousel({
      heading: { en: 'Projects', bm: '-' },
      items: [{ href: 'project-gallery.html', img: 'gallery/project-01.jpg',
                alt: 'Project plate 1', title: { en: 'Plate 1', bm: '-' } }]
    });
    root.PM.qsa('.car-nav button', s).forEach(function (b) {
      CHECKS.ok(b.getAttribute('aria-label'), 'control labelled');
      CHECKS.eq(b.getAttribute('type'), 'button', 'not a submit');
    });
    CHECKS.eq(s.querySelector('.car-rail').getAttribute('aria-hidden'), 'true', 'rail decorative');
  });

  /* ----------------------------------------------------------- Task 11 */

  CHECKS.test('media band with a video shows a labelled play control and no autoplay', function () {
    var s = root.APP.blocks.media({
      heading: { en: 'Inside the factory', bm: '-' },
      video: 'video/sewerage-service.mp4',
      poster: 'news/factory.webp', alt: 'The factory floor'
    });
    var btn = s.querySelector('.media-play');
    CHECKS.ok(btn, 'play control');
    CHECKS.ok(btn.getAttribute('aria-label'), 'labelled');
    CHECKS.eq(s.querySelectorAll('video').length, 0, 'no video element until asked');
  });

  CHECKS.test('media band without a video is a plain headline over a photo', function () {
    var s = root.APP.blocks.media({
      heading: { en: 'Inside the factory', bm: '-' },
      img: 'news/factory.webp', alt: 'The factory floor'
    });
    CHECKS.ok(!s.querySelector('.media-play'), 'no play control');
    CHECKS.ok(s.querySelector('img'), 'photo present');
  });

  CHECKS.test('quote renders attribution in mono', function () {
    var s = root.APP.blocks.quote({
      text: { en: 'Fat floats, water passes, solids sink.', bm: '-' },
      name: 'Jackie', role: { en: 'Sales', bm: '-' }
    });
    CHECKS.ok(s.querySelector('blockquote'), 'blockquote');
    CHECKS.ok(s.querySelector('figcaption .mono'), 'mono attribution');
    CHECKS.ok(s.textContent.indexOf('Jackie') !== -1, 'name present');
  });

  /* ----------------------------------------------------------- Task 12 */

  CHECKS.test('sizer recommends the same model the shared engine does', function () {
    var s = root.APP.blocks.sizer({});
    [40, 150, 300, 1000, 6000, 15000].forEach(function (n) {
      s.set(n);
      var want = root.PM.recommendModel(n);
      CHECKS.eq(s.state().model.model, want.model, 'model at ' + n + ' meals');
    });
  });

  CHECKS.test('sizer prints the published figures verbatim, not rounded', function () {
    var s = root.APP.blocks.sizer({});
    s.set(300);
    var m = root.PM.recommendModel(300);
    var txt = s.querySelector('.sizer-spec').textContent;
    CHECKS.eq(m.model, 'GTA325', 'the 300 meal case is GTA325');
    CHECKS.ok(txt.indexOf(m.model) !== -1, 'model code');
    CHECKS.ok(txt.indexOf(String(m.gpm)) !== -1, 'flow rate');
    CHECKS.ok(txt.indexOf(String(m.max)) !== -1, 'capacity');
    CHECKS.ok(txt.indexOf(m.pipe) !== -1, 'pipe size');
    CHECKS.ok(txt.indexOf(m.sizeMm) !== -1, 'metric dimensions');
  });

  CHECKS.test('sizer shows the published dose, or a dash when there is none', function () {
    var s = root.APP.blocks.sizer({});
    s.set(300);
    var d = root.PM.dosingFor(s.state().model.model);
    var txt = s.querySelector('.sizer-spec').textContent;
    if (d) CHECKS.ok(txt.indexOf(String(d.daily)) !== -1, 'dose shown');
    else CHECKS.ok(txt.indexOf('-') !== -1, 'dash shown');
  });

  CHECKS.test('sizer never recommends a custom-build row', function () {
    var s = root.APP.blocks.sizer({});
    [40, 500, 3000, 9000, 15000].forEach(function (n) {
      s.set(n);
      CHECKS.ok(s.state().model.gpm > 0, 'no zero-GPM custom row at ' + n);
      CHECKS.ok(s.state().model.model !== 'GTA03', 'GTA03 is a custom build, never a recommendation');
    });
  });

  CHECKS.test('slider is native, labelled and announces its recommendation', function () {
    var s = root.APP.blocks.sizer({});
    var input = s.querySelector('input[type="range"]');
    CHECKS.ok(input, 'native range input');
    CHECKS.eq(input.getAttribute('min'), '40', 'min');
    CHECKS.eq(input.getAttribute('max'), '15000', 'max');
    CHECKS.ok(input.getAttribute('aria-label') || s.querySelector('label[for="' + input.id + '"]'), 'labelled');
    s.set(300);
    CHECKS.ok(/GTA325/.test(input.getAttribute('aria-valuetext')), 'aria-valuetext names the model');
  });

  CHECKS.test('level fill tracks meal volume and is decorative', function () {
    var s = root.APP.blocks.sizer({});
    var lvl = s.querySelector('.sizer-level');
    CHECKS.eq(lvl.getAttribute('aria-hidden'), 'true', 'decorative');
    s.set(15000);
    CHECKS.near(parseFloat(lvl.style.getPropertyValue('--fill')), 1, 0.001, 'full at 15000');
    s.set(7500);
    CHECKS.near(parseFloat(lvl.style.getPropertyValue('--fill')), 0.5, 0.01, 'half at 7500');
  });

  CHECKS.test('the spec link points at the recommended product page', function () {
    var s = root.APP.blocks.sizer({});
    s.set(1000);
    var code = s.state().model.model;
    var p = root.PM.productByModel(code);
    var href = s.querySelector('.sizer-spec a.pill').getAttribute('href');
    if (p) CHECKS.ok(href.indexOf('product.html?p=' + p.slug) === 0, 'links to the product page');
    else CHECKS.ok(href.indexOf('model-finder.html') === 0, 'falls back to the model finder');
  });

  /* ----------------------------------------------------------- Task 13 */

  CHECKS.test('table renders every published model row', function () {
    var s = root.APP.blocks.table({ filters: true });
    CHECKS.eq(s.querySelectorAll('tbody tr').length, 17, 'seventeen rows');
    CHECKS.eq(s.querySelectorAll('thead th').length, 8, 'eight columns');
  });

  CHECKS.test('series filter narrows to the published series counts', function () {
    var s = root.APP.blocks.table({ filters: true });
    s.filter({ series: 'undersink' });
    CHECKS.eq(s.rows().length, root.PM_CATALOG.models.filter(function (m) {
      return m.series === 'undersink';
    }).length, 'undersink count');
    s.filter({ series: 'all' });
    CHECKS.eq(s.rows().length, 17, 'reset');
  });

  CHECKS.test('meal filter highlights rather than hides', function () {
    var s = root.APP.blocks.table({ filters: true });
    s.filter({ series: 'all', meals: 300 });
    CHECKS.eq(s.rows().length, 17, 'nothing hidden');
    CHECKS.eq(s.querySelectorAll('tbody tr.is-match').length, 1, 'exactly one match');
    CHECKS.ok(s.querySelector('tbody tr.is-match').textContent.indexOf('GTA325') !== -1, 'the right one');
  });

  CHECKS.test('model codes link to their product page where one exists', function () {
    var s = root.APP.blocks.table({ filters: false });
    var links = s.querySelectorAll('tbody a[href^="product.html?p="]');
    CHECKS.ok(links.length > 0, 'at least some models link out');
    root.PM.qsa('tbody a[href^="product.html?p="]', s).forEach(function (a) {
      var slug = a.getAttribute('href').split('p=')[1].split('&')[0];
      CHECKS.ok(root.PM.product(slug), 'slug ' + slug + ' resolves to a product');
    });
  });

  /* ----------------------------------------------------------- Task 14 */

  CHECKS.test('jump bar lists every jumpable section in document order', function () {
    var main = doc.getElementById('main');
    main.textContent = '';
    ['Introduction', 'Models', 'Sizing'].forEach(function (name, i) {
      var sec = doc.createElement('section');
      sec.id = 'jump-' + i;
      sec.setAttribute('data-jump', name);
      main.appendChild(sec);
    });
    var bar = root.APP.chassis.jumpbar([{ href: 'index.html', label: { en: 'Home', bm: 'Utama' } }]);
    var items = bar.querySelectorAll('.jump-menu a');
    CHECKS.eq(items.length, 3, 'three entries');
    CHECKS.eq(items[0].textContent, 'Introduction', 'first');
    CHECKS.eq(items[2].textContent, 'Sizing', 'last');
    CHECKS.eq(items[1].getAttribute('href'), '#jump-1', 'anchors by id');
  });

  CHECKS.test('jump bar renders the breadcrumb trail plus the current page', function () {
    var bar = root.APP.chassis.jumpbar([
      { href: 'index.html', label: { en: 'Home', bm: 'Utama' } },
      { href: 'grease-traps.html', label: { en: 'Grease Traps', bm: 'Perangkap Minyak' } }
    ]);
    CHECKS.eq(bar.querySelectorAll('.crumb a').length, 2, 'two crumbs');
    CHECKS.ok(bar.querySelector('.jump-trigger'), 'trigger present');
  });

  CHECKS.test('jump trigger label follows the current section', function () {
    var bar = doc.querySelector('.jumpbar');
    bar.setCurrent(2);
    CHECKS.ok(bar.querySelector('.jump-trigger').textContent.indexOf('Sizing') !== -1, 'label followed');
    bar.remove();
    doc.getElementById('main').textContent = '';
  });

  /* ----------------------------------------------------------- Task 15 */

  CHECKS.test('home assembles its bands in the specified order', function () {
    var main = doc.getElementById('main');
    main.textContent = '';
    root.APP.pages.home();
    var order = root.PM.qsa('#main > .band').map(function (b) {
      return (b.className.match(/band--([a-z]+)/) || [])[1];
    });
    /* Fourteen now: the supplied marketing banners sit under the hero and
       the channel sits between the quote and the service tiles. */
    CHECKS.eq(order.length, 14, 'fourteen bands');
    CHECKS.eq(order.join(','),
      'hero,banners,figures,statement,expander,sizer,tiles,carousel,quote,videos,tiles,figures,carousel,cta',
      'block order matches the spec');
  });

  CHECKS.test('home has exactly one h1 and it lives in the hero', function () {
    var h1s = root.PM.qsa('#main h1');
    CHECKS.eq(h1s.length, 1, 'one h1');
    CHECKS.ok(h1s[0].closest('.band--hero'), 'h1 is the hero heading');
  });

  CHECKS.test('every home image that carries meaning carries alt text', function () {
    root.PM.qsa('#main img').forEach(function (img) {
      /* A purely decorative image is correctly announced as nothing. The
         hero ground is one: it sits inside an aria-hidden layer under a
         gradient and states nothing the copy beside it does not. Requiring
         alt text there would be requiring a screen reader to be told about
         a texture. */
      if (img.closest('[aria-hidden="true"]')) {
        CHECKS.eq(img.getAttribute('alt'), '', 'decorative image is explicitly empty: ' + img.getAttribute('src'));
        return;
      }
      CHECKS.ok((img.getAttribute('alt') || '').trim().length > 0, 'alt on ' + img.getAttribute('src'));
    });
  });

  CHECKS.test('home carries no jump bar', function () {
    CHECKS.ok(!doc.querySelector('.jumpbar'), 'home page has no jump bar');
  });

  /* -------------------------------------------------------- Tasks 16-22 */

  function renderPage(name, arg) {
    var main = doc.getElementById('main');
    main.textContent = '';
    var bar = doc.querySelector('.jumpbar');
    if (bar) bar.remove();
    root.APP.pages[name](arg);
    return main;
  }

  CHECKS.test('grease traps page filters by the published sub-categories', function () {
    renderPage('greaseTraps');
    var all = root.PM.productsBy('grease-trap').length;
    CHECKS.eq(doc.querySelectorAll('.band--tiles .tile').length, all, 'every grease trap shown initially');
    var chips = doc.querySelectorAll('.band--tiles .chip');
    CHECKS.eq(chips.length, root.PM_CATALOG.categories[0].subs.length + 1, 'one chip per sub plus All');
    chips[1].click();
    var sub = root.PM_CATALOG.categories[0].subs[0].id;
    CHECKS.eq(doc.querySelectorAll('.band--tiles .tile').length,
              root.PM.productsBy('grease-trap', sub).length, 'filter narrows the grid');
  });

  CHECKS.test('grease traps page has a jump bar with three crumbs', function () {
    CHECKS.ok(doc.querySelector('.jumpbar'), 'jump bar present');
    CHECKS.eq(doc.querySelectorAll('.jumpbar .crumb a').length, 3, 'Home / Products / Grease Traps');
  });

  CHECKS.test('model finder shows the table and the sizer together', function () {
    renderPage('modelFinder');
    CHECKS.eq(doc.querySelectorAll('#main tbody tr').length, 17, 'full table');
    CHECKS.ok(doc.querySelector('#main .band--sizer'), 'sizer present');
    CHECKS.ok(doc.querySelector('.jumpbar'), 'jump bar');
  });

  CHECKS.test('typing a meal volume highlights one row and does not hide the rest', function () {
    var table = doc.querySelector('#main .band--table');
    table.filter({ series: 'all', meals: 6000 });
    CHECKS.eq(table.rows().length, 17, 'nothing hidden');
    CHECKS.eq(doc.querySelectorAll('#main tbody tr.is-match').length, 1, 'one highlight');
  });

  CHECKS.test('product page renders a known product end to end', function () {
    var p = root.PM_CATALOG.products[0];
    renderPage('product', p.slug);
    CHECKS.ok(doc.querySelector('#main h1').textContent.length > 0, 'heading');
    CHECKS.ok(doc.querySelector('#main a[href^="https://wa.me/"]'), 'prefilled whatsapp');
    CHECKS.ok(doc.querySelector('#main .spec-list dd'), 'published specification rows');
  });

  CHECKS.test('every product in the catalogue renders without throwing', function () {
    root.PM_CATALOG.products.forEach(function (p) {
      renderPage('product', p.slug);
      CHECKS.ok(doc.querySelector('#main h1'), 'heading for ' + p.slug);
    });
  });

  CHECKS.test('an unknown slug shows the not-found copy, never a blank page', function () {
    var main = renderPage('product', 'no-such-product');
    CHECKS.ok(main.textContent.trim().length > 0, 'page is not blank');
    CHECKS.ok(main.textContent.indexOf(root.PM.t(root.PM_SITE.ui.notFound)) !== -1, 'not-found message');
  });

  CHECKS.test('services page expands all five published services', function () {
    renderPage('services');
    CHECKS.eq(doc.querySelectorAll('#main .exp-card').length, 5, 'five services');
    var s = doc.querySelector('#main .band--expander');
    s.open(4);
    CHECKS.ok(doc.querySelector('#main .exp-panel').textContent.length > 40, 'panel carries real copy');
  });

  CHECKS.test('about renders named clients as figure tiles, not invented photos', function () {
    renderPage('about');
    var bands = root.PM.qsa('#main .band--tiles');
    var band = bands[bands.length - 1];
    CHECKS.ok(band.querySelectorAll('.tile--fig').length > 0, 'figure tiles used');
    CHECKS.eq(band.querySelectorAll('img').length, 0, 'no photography invented for clients');
    CHECKS.eq(band.querySelectorAll('.tile').length, root.PM_SITE.clients.length, 'every named site');
  });

  CHECKS.test('about carousel shows every published award', function () {
    var car = doc.querySelector('#main .band--carousel');
    CHECKS.eq(car.querySelectorAll('.car-card').length, root.PM_SITE.awards.length, 'award count');
  });

  CHECKS.test('contact form is wired to the shared validation engine', function () {
    renderPage('contact');
    var form = doc.querySelector('#main form[data-enquiry]');
    CHECKS.ok(form, 'form present with data-enquiry');
    CHECKS.eq(form.id, 'enquiry', 'anchor target for the header quote pill');
    ['name', 'mobile', 'email', 'message'].forEach(function (n) {
      CHECKS.ok(form.querySelector('[name="' + n + '"]'), 'field ' + n);
    });
    CHECKS.eq(form.querySelectorAll('select[name="product"] option').length,
              root.PM_CATALOG.products.length + 1, 'every product plus the placeholder option');
    CHECKS.ok(form.querySelector('[data-form-status]'), 'status region');
  });

  CHECKS.test('contact page exposes phone, email and whatsapp as real links', function () {
    CHECKS.ok(doc.querySelector('#main a[href^="tel:"]'), 'tel link');
    CHECKS.ok(doc.querySelector('#main a[href^="mailto:"]'), 'mailto link');
    CHECKS.ok(doc.querySelector('#main a[href^="https://wa.me/"]'), 'whatsapp link');
  });

  CHECKS.test('every office and factory address is listed', function () {
    var n = root.PM_SITE.contact.factories.length + 1;
    CHECKS.eq(doc.querySelectorAll('#main .addr-card').length, n, 'hq plus factories');
  });

  CHECKS.test('soon page names the requested page and offers what is built', function () {
    renderPage('soon', 'Project Gallery');
    CHECKS.ok(doc.querySelector('#main h1').textContent.indexOf('Project Gallery') !== -1, 'names the page');
    CHECKS.eq(doc.querySelectorAll('#main .tile').length, 7, 'seven built pages offered');
  });

  CHECKS.test('soon page with no parameter still renders', function () {
    renderPage('soon', '');
    CHECKS.ok(doc.querySelector('#main h1').textContent.trim().length > 0, 'has a heading anyway');
  });

  CHECKS.test('EVERY nav href resolves to a file that exists in this cut', function () {
    /* Read from APP rather than restated here: a second copy of this list
       is exactly what went stale when the rest of the site was built. */
    var built = root.APP.built().concat(['soon.html']);
    function check(entry) {
      if (entry.href) {
        var target = root.APP.ui.href(entry.href, entry.label).split('?')[0];
        CHECKS.ok(built.indexOf(target) !== -1, entry.href + ' -> ' + target + ' must be a built page');
      }
      (entry.children || []).forEach(check);
    }
    root.PM_SITE.nav.forEach(check);
  });

  CHECKS.test('no rendered page contains a dead internal link', function () {
    /* Read from APP rather than restated here: a second copy of this list
       is exactly what went stale when the rest of the site was built. */
    var built = root.APP.built().concat(['soon.html']);
    ['home', 'greaseTraps', 'modelFinder', 'services', 'about', 'contact'].forEach(function (page) {
      renderPage(page);
      root.PM.qsa('#main a[href], .jumpbar a[href]').forEach(function (a) {
        var href = a.getAttribute('href');
        if (/^(https?:|mailto:|tel:|#)/.test(href)) return;
        var file = href.split('?')[0].split('#')[0];
        if (!file) return;
        CHECKS.ok(built.indexOf(file) !== -1, page + ' links to ' + file + ' which is not built');
      });
    });
  });

  root.CHECKS = CHECKS;
})(window, document);
