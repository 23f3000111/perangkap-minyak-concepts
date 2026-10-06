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
      '--surface': '#FFFFFF', '--wash': '#E9F1FA', '--wash-cool': '#F5F8FC',
      '--blue': '#1B5FA8', '--blue-deep': '#123F73', '--blue-bright': '#4A9BE8',
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

  CHECKS.test('header renders the full nav from Site D\'s own nav', function () {
    var host = headerFixture();
    CHECKS.ok(host.querySelector('.hdr-mark'), 'wordmark');
    CHECKS.eq(host.querySelectorAll('[data-nav] > ul > li').length, 7, 'top level items');
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
    walk(root.APP.nav());
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

  CHECKS.test('no second floating button competes with the assistant', function () {
    /* The WhatsApp float was removed: two circles in one corner offered
       two ways into the same conversation. WhatsApp still has to be one
       tap away, so the route through the page is asserted instead. */
    CHECKS.ok(!root.APP.chassis.whatsapp, 'the float builder is gone');
    CHECKS.ok(!doc.querySelector('.wa-float'), 'nothing renders a float');

    var cta = root.APP.blocks.cta({
      heading: { en: 'Tell us your meal volume', bm: '-' },
      primary: { href: 'contact.html', label: { en: 'Request a quote', bm: '-' } },
      whatsapp: true
    });
    var wa = cta.querySelector('a[href^="https://wa.me/"]');
    CHECKS.ok(wa, 'the call to action still reaches WhatsApp');
    CHECKS.eq(wa.getAttribute('rel'), 'noopener', 'rel');
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
    /* Fifteen now: the supplied marketing banners sit under the hero, the
       channel sits between the quote and the service tiles, and the FAQs
       close the page just above the call to action. */
    CHECKS.eq(order.length, 15, 'fifteen bands');
    CHECKS.eq(order.join(','),
      'hero,banners,figures,statement,expander,sizer,tiles,carousel,quote,videos,tiles,figures,carousel,faq,cta',
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
    root.APP.nav().forEach(check);
  });

  CHECKS.test('no rendered page contains a dead internal link', function () {
    /* Read from APP rather than restated here: a second copy of this list
       is exactly what went stale when the rest of the site was built.
       The PDFs are the one kind of link that leaves the page tree, and
       they may only point into the shared document folder. Whether each
       file is actually on disk is checked by tools/check-assets.js, since
       a page opened from file:// cannot ask. */
    var built = root.APP.built().concat(['soon.html']);
    ['home', 'greaseTraps', 'modelFinder', 'services', 'about', 'contact',
     'faq', 'oilInterceptor', 'scheduledWaste', 'cleaningRange',
     'downloads', 'projectGallery', 'installGuide'].forEach(function (page) {
      renderPage(page);
      root.PM.qsa('#main a[href], .jumpbar a[href]').forEach(function (a) {
        var href = a.getAttribute('href');
        if (/^(https?:|mailto:|tel:|#)/.test(href)) return;
        var file = href.split('?')[0].split('#')[0];
        if (!file) return;
        if (file.indexOf('../assets/') === 0) {
          CHECKS.ok(/^\.\.\/assets\/(docs\/[a-z]+\/[a-z0-9-]+\.pdf|img\/.+\.(webp|jpe?g|png))$/.test(file),
            page + ' links to an unexpected asset ' + file);
          return;
        }
        CHECKS.ok(built.indexOf(file) !== -1, page + ' links to ' + file + ' which is not built');
      });
    });
  });

  /* -------------------------------------------- the October content update
     Everything below arrived with the client's folder of slides, field
     sheets and PDFs: four new pages, the PDF viewer, the common issues on
     the services page, and FAQs reachable from the nav, the footer and
     the bottom of the home page. Counts here are literals taken from the
     supplied material, not read back from the data under test. */

  function navGroupD(labelEn) {
    return root.APP.nav().filter(function (n) { return n.children && n.label.en === labelEn; })[0];
  }
  function hrefs(entries) { return entries.map(function (e) { return e.href; }); }

  CHECKS.test('Site D nav adds the four new pages in their groups', function () {
    var products = hrefs(navGroupD('Products').children);
    CHECKS.ok(products.indexOf('oil-interceptor.html') !== -1, 'oil interceptor under Products');
    CHECKS.ok(products.indexOf('cleaning-range.html') !== -1, 'cleaning range under Products');
    CHECKS.ok(hrefs(navGroupD('Compliance').children).indexOf('scheduled-waste.html') !== -1,
      'scheduled waste guide under Compliance');
    var company = hrefs(navGroupD('Company').children);
    CHECKS.eq(company[company.length - 1], 'faq.html', 'FAQs close the Company group');
    CHECKS.eq(company[company.length - 2], 'careers.html', 'right after Careers & Dealership');
  });

  CHECKS.test('the shared nav is left alone, so Site C links nothing it lacks', function () {
    function all(entries) {
      return entries.reduce(function (acc, e) {
        return acc.concat(e.children ? all(e.children) : [e.href]);
      }, []);
    }
    var shared = all(root.PM_SITE.nav);
    ['faq.html', 'oil-interceptor.html', 'cleaning-range.html', 'scheduled-waste.html'].forEach(function (h) {
      CHECKS.ok(shared.indexOf(h) === -1, h + ' must not be in the shared nav');
    });
  });

  CHECKS.test('header and footer both carry the FAQ link', function () {
    var header = headerFixture();
    CHECKS.ok(header.querySelector('.hdr-mega a[href="faq.html"]'), 'FAQs in the Company dropdown');
    CHECKS.ok(header.querySelector('.hdr-sheet a[href="faq.html"]'), 'FAQs in the mobile sheet');
    header.remove();
    var footer = footerFixture();
    CHECKS.ok(footer.querySelector('.ftr-col a[href="faq.html"]'), 'FAQs in the footer');
    footer.remove();
  });

  CHECKS.test('services page opens on the three common issues, not "What we cover"', function () {
    renderPage('services');
    var bands = root.PM.qsa('#main > .band');
    CHECKS.ok(bands[1].classList.contains('band--issues'), 'issues band follows the hero');
    CHECKS.ok(doc.getElementById('main').textContent.indexOf('Five services, one crew') === -1,
      'the "What we cover" band is gone');
    var tabs = root.PM.qsa('#main [role="tab"]');
    CHECKS.eq(tabs.length, 3, 'three tabs');
    ['A', 'B', 'C'].forEach(function (letter, i) {
      CHECKS.ok(tabs[i].textContent.indexOf(letter) !== -1, 'tab ' + letter);
    });
    CHECKS.eq(doc.querySelectorAll('#main .band--expander .exp-card').length, 5, 'the five services stay');
  });

  CHECKS.test('choosing an issue tab shows only its panel', function () {
    var tabs = root.PM.qsa('#main [role="tab"]');
    var panels = root.PM.qsa('#main [role="tabpanel"]');
    CHECKS.eq(panels.length, 3, 'three panels');
    CHECKS.eq(tabs[0].getAttribute('aria-selected'), 'true', 'A starts selected');
    CHECKS.ok(!panels[0].hidden && panels[1].hidden && panels[2].hidden, 'A starts visible');
    tabs[2].click();
    CHECKS.eq(tabs[2].getAttribute('aria-selected'), 'true', 'C selected');
    CHECKS.eq(tabs[0].getAttribute('aria-selected'), 'false', 'A released');
    CHECKS.ok(panels[0].hidden && panels[1].hidden && !panels[2].hidden, 'only C visible');
    CHECKS.eq(panels[2].getAttribute('aria-labelledby'), tabs[2].id, 'panel names its tab');
  });

  CHECKS.test('arrow keys move between issue tabs', function () {
    var tabs = root.PM.qsa('#main [role="tab"]');
    tabs[0].click();
    tabs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    CHECKS.eq(tabs[1].getAttribute('aria-selected'), 'true', 'right arrow selects B');
    tabs[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    CHECKS.eq(tabs[0].getAttribute('aria-selected'), 'true', 'left arrow returns to A');
    tabs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    CHECKS.eq(tabs[2].getAttribute('aria-selected'), 'true', 'left from A wraps to C');
  });

  CHECKS.test('every model with documents carries a catalogue and a drawing', function () {
    var docs = root.APP.data.documents();
    CHECKS.eq(docs.length, 34, 'seventeen models, two documents each');
    var seen = {};
    docs.forEach(function (d) {
      CHECKS.ok(/^docs\/(catalogue|drawings)\/[a-z0-9]+\.pdf$/.test(d.file), 'path shape ' + d.file);
      CHECKS.ok(!seen[d.file], 'unique ' + d.file);
      seen[d.file] = 1;
      CHECKS.ok(d.pages >= 1, d.file + ' has pages');
      CHECKS.eq(d.pageImages.length, d.pages, d.file + ' has one image per page');
    });
  });

  function docFixture() {
    return root.APP.data.documents().filter(function (d) { return d.id === 'drawing-gta3100'; })[0];
  }

  CHECKS.test('the viewer opens a PDF on the page with a download link', function () {
    var d = docFixture();
    CHECKS.ok(d, 'GTA3100 drawing is in the library');
    var trigger = doc.createElement('button');
    doc.body.appendChild(trigger);
    trigger.focus();
    var v = root.APP.ui.docViewer;
    v.open(d, { inline: true });
    var box = doc.querySelector('.docview');
    CHECKS.ok(box && !box.hidden, 'viewer visible');
    CHECKS.eq(box.getAttribute('role'), 'dialog', 'is a dialog');
    var frame = box.querySelector('iframe.docview-frame');
    CHECKS.ok(frame, 'pdf shown inline');
    CHECKS.eq(frame.getAttribute('src'), '../assets/docs/drawings/gta3100.pdf', 'the right file');
    var dl = box.querySelector('a.docview-dl');
    CHECKS.ok(dl.hasAttribute('download'), 'download attribute');
    CHECKS.eq(dl.getAttribute('href'), '../assets/docs/drawings/gta3100.pdf', 'download points at the file');
    doc.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    CHECKS.ok(box.hidden, 'escape closes');
    CHECKS.eq(doc.activeElement, trigger, 'focus goes back to what opened it');
    CHECKS.ok(!doc.body.classList.contains('nav-locked'), 'page scroll released');
    trigger.remove();
  });

  CHECKS.test('without an inline PDF reader the viewer shows every page as an image', function () {
    var d = docFixture();
    var v = root.APP.ui.docViewer;
    v.open(d, { inline: false });
    var box = doc.querySelector('.docview');
    CHECKS.ok(!box.querySelector('iframe'), 'no iframe');
    var imgs = box.querySelectorAll('.docview-pages img');
    CHECKS.eq(imgs.length, d.pages, 'one image per page');
    CHECKS.ok(imgs[0].getAttribute('alt').indexOf('GTA3100') !== -1, 'page image is labelled');
    CHECKS.ok(box.querySelector('a.docview-dl[download]'), 'download still offered');
    v.close();
    CHECKS.ok(box.hidden, 'close hides it');
  });

  CHECKS.test('downloads page shelves every model and filters by series', function () {
    renderPage('downloads');
    CHECKS.eq(doc.querySelectorAll('#main .dl-card').length, 17, 'seventeen models');
    CHECKS.eq(doc.querySelectorAll('#main .dl-card [data-doc]').length, 34, 'two documents each');
    var shelf = doc.querySelector('#main .band--docshelf');
    function visible() {
      return root.PM.qsa('.dl-card', shelf).filter(function (c) { return !c.hidden; }).length;
    }
    var chips = root.PM.qsa('.chip', shelf);
    var by = {};
    chips.forEach(function (c) { by[c.textContent.trim()] = c; });
    by['Centralized'].click();
    CHECKS.eq(visible(), 13, 'thirteen centralized models');
    by['Undersink'].click();
    CHECKS.eq(visible(), 3, 'three undersink models');
    by['Oil interceptor'].click();
    CHECKS.eq(visible(), 1, 'one drain interceptor');
    by['All models'].click();
    CHECKS.eq(visible(), 17, 'reset');
  });

  CHECKS.test('a document button opens that document in the viewer', function () {
    var btn = doc.querySelector('#main .dl-card [data-doc="catalogue-gta325"]');
    CHECKS.ok(btn, 'GTA325 catalogue button');
    btn.click();
    var box = doc.querySelector('.docview');
    CHECKS.ok(!box.hidden, 'viewer opened');
    CHECKS.ok(box.querySelector('a.docview-dl').getAttribute('href').indexOf('docs/catalogue/gta325.pdf') !== -1,
      'the matching file');
    root.APP.ui.docViewer.close();
  });

  CHECKS.test('documents still requested on WhatsApp are listed, not linked to files', function () {
    var rows = root.PM.qsa('#main .band--listing .list-row');
    CHECKS.ok(rows.length >= 4, 'manual, data sheet, certificate and chart remain');
    rows.forEach(function (r) {
      var href = r.getAttribute('href') || '';
      CHECKS.ok(href === '' || href.indexOf('https://wa.me/') === 0, 'on request: ' + r.textContent);
    });
  });

  CHECKS.test('a documented model\'s product page offers its two PDFs', function () {
    renderPage('product', 'centralized-grease-trap-gta3100');
    var btns = doc.querySelectorAll('#main [data-doc]');
    CHECKS.eq(btns.length, 2, 'catalogue and drawing');
    renderPage('product', 'auto-dosing-unit-adu9291p');
    CHECKS.eq(doc.querySelectorAll('#main [data-doc]').length, 0, 'no documents, no band');
  });

  CHECKS.test('installation guide page offers every drawing', function () {
    renderPage('installGuide');
    var btns = root.PM.qsa('#main [data-doc]');
    CHECKS.eq(btns.length, 17, 'seventeen drawings');
    btns.forEach(function (b) { CHECKS.ok(b.getAttribute('data-doc').indexOf('drawing-') === 0, 'drawings only'); });
  });

  CHECKS.test('project gallery leads with the field sheets, captioned by site', function () {
    renderPage('projectGallery');
    var bands = root.PM.qsa('#main .band--gallery');
    CHECKS.eq(bands.length, 2, 'recent installations, then the archive');
    CHECKS.eq(bands[0].querySelectorAll('.doc-item').length, 17, 'sixteen sheets plus the ADU install');
    CHECKS.eq(bands[1].querySelectorAll('.doc-item').length, 18, 'eighteen archive plates');
    CHECKS.ok(bands[0].textContent.indexOf('Sea Frozen Food') !== -1, 'captions name the site');
    root.PM.qsa('img', bands[0]).forEach(function (img) {
      CHECKS.ok(/^\.\.\/assets\/img\/(gallery\/field-\d\d|brand\/sheets\/[a-z0-9-]+)\.webp$/.test(img.getAttribute('src')),
        'field sheet source ' + img.getAttribute('src'));
    });
  });

  CHECKS.test('home carousel shows field sheets and the FAQ band links to the full page', function () {
    renderPage('home');
    var car = doc.querySelector('#main .band--carousel');
    var first = car.querySelector('.car-card img');
    CHECKS.ok(/gallery\/field-\d\d\.webp$/.test(first.getAttribute('src')), 'field sheet leads the carousel');
    var faq = doc.querySelector('#main .band--faq');
    CHECKS.eq(faq.querySelectorAll('.faq-item').length, 5, 'five questions on the home page');
    CHECKS.ok(faq.querySelector('a[href="faq.html"]'), 'see all FAQs');
  });

  CHECKS.test('FAQ page groups every question under a topic with a jump entry each', function () {
    renderPage('faq');
    var bands = root.PM.qsa('#main .band--faq');
    CHECKS.eq(bands.length, 5, 'five topics');
    CHECKS.eq(doc.querySelectorAll('#main .faq-item').length, 21, 'twenty-one questions');
    CHECKS.eq(doc.querySelectorAll('.jumpbar .jump-menu a').length, 5, 'one jump entry per topic');
    var q = doc.querySelector('#main .faq-q');
    CHECKS.ok(q.getAttribute('aria-controls') && doc.getElementById(q.getAttribute('aria-controls')),
      'question controls its answer');
  });

  CHECKS.test('FAQ answers open and close', function () {
    var item = root.PM.qsa('#main .faq-item')[1];
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    CHECKS.ok(a.hidden, 'second answer starts closed');
    q.click();
    CHECKS.ok(!a.hidden, 'opens');
    CHECKS.eq(q.getAttribute('aria-expanded'), 'true', 'announced open');
    q.click();
    CHECKS.ok(a.hidden, 'closes');
  });

  CHECKS.test('oil interceptor page publishes the six GTASP models', function () {
    renderPage('oilInterceptor');
    var rows = root.PM.qsa('#main .band--datatable tbody tr');
    CHECKS.eq(rows.length, 6, 'six models');
    CHECKS.ok(rows[0].textContent.indexOf('GTASP-50') !== -1, 'smallest first');
    CHECKS.ok(rows[5].textContent.indexOf('GTASP-750') !== -1, 'largest last');
    CHECKS.ok(rows[5].textContent.indexOf('1620') !== -1 && rows[5].textContent.indexOf('5400') !== -1,
      'GTASP-750 oil and water capacity as published');
    CHECKS.ok(doc.querySelectorAll('#main .step-card').length >= 4, 'how it works, in stages');
  });

  CHECKS.test('scheduled waste guide answers sell-or-pay for six codes and lists sixteen offences', function () {
    renderPage('scheduledWaste');
    var tables = root.PM.qsa('#main .band--datatable');
    CHECKS.eq(tables.length, 2, 'the code table and the offence table');
    var codes = root.PM.qsa('tbody tr', tables[0]).map(function (tr) { return tr.querySelector('th, td').textContent.trim(); });
    CHECKS.eq(codes.join(','), 'SW305,SW306,SW309,SW310,SW311,SW312', 'the six oil codes');
    CHECKS.eq(tables[1].querySelectorAll('tbody tr').length, 16, 'sixteen offences');
    var serious = tables[1].querySelector('tbody tr').textContent;
    CHECKS.ok(serious.indexOf('RM10 million') !== -1, 'Section 34B carries the 2024 maximum');
    CHECKS.ok(doc.getElementById('main').textContent.indexOf('remains RM500,000') === -1,
      'the superseded RM500,000 ceiling is not presented as current');
  });

  CHECKS.test('cleaning range shows all thirty-two products and filters by use', function () {
    renderPage('cleaningRange');
    var band = doc.querySelector('#main .band--range');
    var cards = root.PM.qsa('.rng-card', band);
    CHECKS.eq(cards.length, 32, 'thirty-two products');
    function visible() { return cards.filter(function (c) { return !c.hidden; }).length; }
    var chips = root.PM.qsa('.chip', band);
    var by = {};
    chips.forEach(function (c) { by[c.textContent.trim()] = c; });
    by['Laundry'].click();
    CHECKS.eq(visible(), 3, 'bleach, softener, detergent');
    by['All'].click();
    CHECKS.eq(visible(), 32, 'reset');
    var wa = cards[0].querySelector('a[href^="https://wa.me/"]');
    CHECKS.ok(wa && decodeURIComponent(wa.getAttribute('href')).indexOf('Dish Wash High Foam') !== -1,
      'price request names the product');
  });

  CHECKS.test('every image on the new pages carries alt text', function () {
    ['faq', 'oilInterceptor', 'scheduledWaste', 'cleaningRange', 'services', 'downloads'].forEach(function (page) {
      renderPage(page);
      root.PM.qsa('#main img').forEach(function (img) {
        if (img.closest('[aria-hidden="true"]')) return;
        CHECKS.ok((img.getAttribute('alt') || '').trim().length > 0, page + ': alt on ' + img.getAttribute('src'));
      });
    });
  });

  CHECKS.test('the lightbox opens over the page, not below the footer', function () {
    /* It used to render unstyled after the footer while the body was
       scroll-locked, so a pressed certificate was unreachable. */
    var host = doc.createElement('div');
    host.appendChild(root.APP.blocks.docs({
      items: [{ img: 'certs/award-biogt.jpg', name: 'Fixture certificate' }]
    }));
    doc.body.appendChild(host);
    var before = root.PM.qsa('.lightbox').length;
    root.PM.mountLightbox();
    var overlay = root.PM.qsa('.lightbox')[before];
    host.querySelector('[data-lightbox]').click();
    var cs = getComputedStyle(overlay);
    CHECKS.eq(cs.position, 'fixed', 'overlay is fixed');
    var r = overlay.getBoundingClientRect();
    CHECKS.ok(r.top <= 0 && r.bottom >= root.innerHeight - 1, 'covers the viewport');
    CHECKS.ok(parseInt(cs.zIndex, 10) > 100, 'above the sticky header');
    var img = overlay.querySelector('img').getBoundingClientRect();
    CHECKS.ok(img.bottom <= root.innerHeight && img.right <= root.innerWidth, 'image fits the screen');
    overlay.querySelector('.lightbox-close').click();
    CHECKS.ok(overlay.hidden, 'closes');
    CHECKS.eq(getComputedStyle(overlay).display, 'none', 'hidden overlay takes no space');
    overlay.remove();
    host.remove();
  });

  CHECKS.test('a table header never sits on top of its first row', function () {
    /* The header cells were sticky at the page header's height, but inside
       a horizontally scrolling wrapper that offset pushed the header row
       down over the first model, GTA01. */
    var host = doc.createElement('div');
    doc.body.appendChild(host);
    host.appendChild(root.APP.blocks.table({ filters: false }));
    host.appendChild(root.APP.blocks.datatable({
      columns: [{ label: 'Code', key: 'a' }, { label: 'Note', key: 'b' }],
      rows: [{ a: 'X1', b: 'first' }, { a: 'X2', b: 'second' }]
    }));
    root.PM.qsa('table', host).forEach(function (tbl) {
      var head = tbl.querySelector('thead th').getBoundingClientRect();
      var first = tbl.querySelector('tbody tr').getBoundingClientRect();
      CHECKS.ok(first.top >= head.bottom - 1,
        'first row starts below the header (' + Math.round(first.top) + ' vs ' + Math.round(head.bottom) + ')');
    });
    host.remove();
  });

  CHECKS.test('the new pages each carry a jump bar and one h1', function () {
    ['faq', 'oilInterceptor', 'scheduledWaste', 'cleaningRange'].forEach(function (page) {
      renderPage(page);
      CHECKS.eq(doc.querySelectorAll('#main h1').length, 1, page + ' has one h1');
      CHECKS.ok(doc.querySelector('.jumpbar .crumb'), page + ' has a breadcrumb');
    });
  });

  root.CHECKS = CHECKS;
})(window, document);
