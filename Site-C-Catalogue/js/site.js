/* =========================================================================
   Site C - "Trade Counter" page logic

   Every data-driven section is rendered here so the HTML files stay small
   and stay in sync. Data-driven text is written with textContent, never
   innerHTML.

   The organising idea: a buyer arrives knowing roughly what they need, so
   every element is a route into the catalogue and every card carries a real
   published figure.
   ========================================================================= */
(function (root, doc) {
  'use strict';

  var PM = root.PM;
  var S = PM.site;
  var C = PM.catalog;
  var el = PM.el;
  var t = PM.t;
  var A = PM.asset;

  var APP = {};
  APP.pages = {};

  /* ------------------------------------------------------------- helpers */
  function icon(name) { return el('i', { class: 'ph ' + name, 'aria-hidden': 'true' }); }

  function txt(pair, tag, attrs) {
    attrs = attrs || {};
    attrs['data-en'] = pair.en;
    attrs['data-bm'] = pair.bm;
    attrs.text = t(pair);
    return el(tag || 'span', attrs);
  }

  function link(href, label, cls) {
    var a = el('a', { href: PM.langHref(href), class: cls || null, 'data-lang-href': href });
    if (typeof label === 'string') a.textContent = label;
    else if (label && label.en) { a.setAttribute('data-en', label.en); a.setAttribute('data-bm', label.bm); a.textContent = t(label); }
    else if (label) a.appendChild(label);
    return a;
  }

  /* The client's own site sets section headings two-tone, first word bold.
     Both languages have to split, so each half carries its own pair. */
  function sectionHead(title, sub, align) {
    var en = String(title.en).split(' ');
    var bm = String(title.bm).split(' ');
    var h = el('h2', {}, [
      el('b', { 'data-en': en[0], 'data-bm': bm[0], text: en[0] }),
      doc.createTextNode(' '),
      el('span', {
        'data-en': en.slice(1).join(' '),
        'data-bm': bm.slice(1).join(' '),
        text: en.slice(1).join(' ')
      })
    ]);
    var kids = [h, el('div', { class: 'head-rule', 'aria-hidden': 'true' })];
    if (sub) kids.push(txt(sub, 'p'));
    return el('div', {
      class: 'section-head' + (align === 'left' ? ' section-head--left' : ''),
      'data-anim': 'rise'
    }, kids);
  }

  /* Half the supplied library is artwork with the model number, the council
     name or the test result printed into the picture, and a cover crop cuts
     those words in half. When a caller has not named a kind, the shared
     policy picks one from the source path. */
  function frame(imgPath, kind, alt, fit) {
    var k = kind || (PM.frameFor ? PM.frameFor(imgPath) : 'photo');
    /* Stated up front rather than waiting for frames.js to measure, so an
       artwork source is never cover-cropped for the half second before its
       load event fires. */
    var f = fit || ((PM.showsWhole && PM.showsWhole(imgPath)) ? 'contain' : null);
    return el('figure', { class: 'frame frame--' + k, 'data-fit': f }, [
      el('img', { src: A(imgPath), alt: alt || '', loading: 'lazy', decoding: 'async' })
    ]);
  }

  function waBtn(cls, message) {
    return el('a', {
      href: PM.waLink(message), class: 'btn btn--wa ' + (cls || ''),
      target: '_blank', rel: 'noopener'
    }, [icon('ph-whatsapp-logo'), txt(S.ui.whatsapp)]);
  }

  /* Products carry their headline figure differently by category. This is
     the one number that belongs on the card. */
  function headlineFigure(p) {
    if (p.gpm) return p.gpm + ' GPM';
    if (p.litres) return p.litres + ' L';
    if (p.volume) return p.volume;
    return null;
  }

  /* ------------------------------------------------------------- header */
  function brandLogo(cls) {
    return el('a', { href: PM.langHref('index.html'), class: 'logo', 'data-lang-href': 'index.html', 'aria-label': S.brand.name }, [
      el('span', { class: 'logo-mark', 'aria-hidden': 'true', text: S.brand.mark }),
      el('span', {}, [
        el('span', { class: 'logo-name', text: S.brand.name }),
        el('span', { class: 'logo-sub', text: 'Grease Trap Malaysia' })
      ])
    ]);
  }

  var UTILITY = [
    { icon: 'ph-seal-check', label: { en: 'SIRIM certified', bm: 'Diperakui SIRIM' } },
    { icon: 'ph-factory', label: { en: 'Manufactured in Malaysia since 1996', bm: 'Dikeluarkan di Malaysia sejak 1996' } },
    { icon: 'ph-stamp', label: { en: 'Approved by 15 local authorities', bm: 'Diluluskan oleh 15 pihak berkuasa tempatan' } }
  ];

  function buildUtility() {
    var claims = el('ul', { class: 'utility-claims' });
    UTILITY.forEach(function (c) {
      claims.appendChild(el('li', {}, [icon(c.icon), txt(c.label)]));
    });
    return el('div', { class: 'utility' }, [
      el('div', { class: 'wrap' }, [
        el('div', { class: 'utility-in' }, [
          claims,
          el('a', { href: PM.telLink() }, [icon('ph-phone'), doc.createTextNode(' ' + S.contact.officeDisplay)])
        ])
      ])
    ]);
  }

  function buildSearchRow() {
    var input = el('input', {
      type: 'search', id: 'sitesearch', autocomplete: 'off',
      'data-search-input': '',
      placeholder: PM.lang === 'bm' ? 'Cari model atau produk' : 'Search a model or product',
      'data-en-ph': 'Search a model or product', 'data-bm-ph': 'Cari model atau produk',
      'aria-label': PM.lang === 'bm' ? 'Cari' : 'Search'
    });
    var results = el('div', { class: 'search-results', 'data-search-results': '', hidden: 'hidden', role: 'listbox' });

    var search = el('div', { class: 'search' }, [
      el('div', { class: 'search-field' }, [
        input,
        el('button', { class: 'search-go', type: 'button', 'data-search-go': '', 'aria-label': 'Search' }, [icon('ph-magnifying-glass')])
      ]),
      results
    ]);

    var lang = el('div', { class: 'lang', role: 'group', 'aria-label': 'Language' }, [
      el('button', { type: 'button', 'data-lang-btn': 'en', text: 'EN' }),
      el('button', { type: 'button', 'data-lang-btn': 'bm', text: 'BM' })
    ]);

    var enq = el('button', { class: 'icon-btn', type: 'button', 'data-enq-open': '' }, [
      icon('ph-clipboard-text'),
      txt({ en: 'Enquiry list', bm: 'Senarai pertanyaan' }),
      el('span', { class: 'enq-count', 'data-enq-count': '', 'data-empty': 'true', text: '0' })
    ]);

    var wa = el('a', {
      class: 'icon-btn icon-btn--wa', href: PM.waLink(), target: '_blank', rel: 'noopener'
    }, [icon('ph-whatsapp-logo'), el('span', { text: S.contact.whatsappDisplay })]);

    return el('div', { class: 'search-row' }, [
      el('div', { class: 'wrap' }, [
        el('div', { class: 'search-in' }, [
          search,
          el('div', { class: 'search-actions' }, [lang, enq, wa])
        ])
      ])
    ]);
  }

  /* One featured panel per mega menu, so the menu sells as well as routes. */
  var MEGA_FEATURE = {
    Products: {
      img: 'products/adu9291p-1.webp',
      title: 'ADU 9291P',
      copy: { en: 'Programmed enzyme dosing with battery backup and a lifetime replacement warranty.', bm: 'Dos enzim berprogram dengan sandaran bateri dan waranti penggantian seumur hidup.' },
      href: 'auto-dosing.html'
    },
    Compliance: {
      img: 'approvals/sirim.jpeg',
      title: 'SIRIM R018/15',
      copy: { en: 'Certified to Malaysian quality and performance standards, with SAMM-accredited effluent analysis.', bm: 'Diperakui mengikut piawaian kualiti dan prestasi Malaysia, dengan analisis efluen terakreditasi SAMM.' },
      href: 'approvals.html'
    },
    Company: {
      img: 'gallery/project-01.jpg',
      title: { en: 'Project archive', bm: 'Arkib projek' },
      copy: { en: 'Installed for Petronas, UTP, Carsem, Alam Flora and 92 schools across Pulau Pinang.', bm: 'Dipasang untuk Petronas, UTP, Carsem, Alam Flora dan 92 sekolah di Pulau Pinang.' },
      href: 'about.html'
    }
  };

  /* A count beside each product link tells the reader how much is behind
     it before they click. */
  function megaCount(href) {
    var map = {
      'grease-traps.html': PM.productsBy('grease-trap').length,
      'auto-dosing.html': PM.productsBy('auto-dosing').length,
      'bio-enzyme.html': PM.productsBy('bio-enzyme').length,
      'others.html': PM.productsBy('other').length,
      'model-finder.html': C.models.length
    };
    return map[href] || 0;
  }

  function buildMega(item) {
    var mega = el('div', { class: 'mega', role: 'menu' });

    var list = el('div', { class: 'mega-list' });
    item.children.forEach(function (c) {
      var n = megaCount(c.href);
      list.appendChild(el('a', { href: PM.langHref(c.href), 'data-lang-href': c.href, role: 'menuitem' }, [
        txt(c.label),
        n ? el('em', { text: String(n) }) : null
      ]));
    });

    var main = el('div', { class: 'mega-main' }, [txt(item.label, 'h4'), list]);

    /* Under Products, the three trap types are what people actually shop
       by, so they get a row of their own straight into a filtered grid. */
    if (item.label.en === 'Products') {
      var cat = C.categories[0];
      var chips = el('div', { class: 'mega-chips' });
      cat.subs.forEach(function (sub) {
        var href = 'grease-traps.html?sub=' + sub.id;
        chips.appendChild(el('a', { class: 'mega-chip', href: PM.langHref(href), 'data-lang-href': href }, [
          txt(sub.name),
          el('em', { text: String(PM.productsBy('grease-trap', sub.id).length) })
        ]));
      });
      main.appendChild(txt({ en: 'Shop by trap type', bm: 'Beli mengikut jenis perangkap' }, 'h4', { style: 'margin-top:1.25rem' }));
      main.appendChild(chips);
    }

    mega.appendChild(main);

    var f = MEGA_FEATURE[item.label.en];
    if (f) {
      mega.appendChild(el('a', { class: 'mega-feature', href: PM.langHref(f.href), 'data-lang-href': f.href }, [
        el('figure', { class: 'mega-thumb' }, [
          el('img', { src: A(f.img), alt: '', loading: 'lazy', decoding: 'async' })
        ]),
        el('div', {}, [
          typeof f.title === 'string'
            ? el('b', { class: 'mono', text: f.title })
            : txt(f.title, 'b'),
          txt(f.copy, 'p')
        ])
      ]));
    }
    return mega;
  }

  function buildNavRow() {
    var nav = el('nav', { class: 'nav', 'data-nav': '', 'aria-label': 'Main' });

    S.nav.forEach(function (item) {
      if (item.href === 'index.html') return;
      if (item.children) {
        var btn = el('button', {
          class: 'nav-btn', type: 'button', 'data-dropdown-btn': '', 'aria-expanded': 'false'
        }, [txt(item.label), icon('ph-caret-down')]);
        nav.appendChild(el('div', { class: 'dropdown', 'data-dropdown': '' }, [btn, buildMega(item)]));
      } else {
        nav.appendChild(link(item.href, item.label));
      }
    });

    var toggle = el('button', {
      class: 'nav-toggle', type: 'button', 'data-nav-toggle': '',
      'aria-expanded': 'false', 'aria-controls': 'navpanel', 'aria-label': 'Menu'
    }, [icon('ph-list')]);

    return el('div', { class: 'nav-row' }, [
      el('div', { class: 'wrap' }, [
        el('div', { class: 'nav-in' }, [brandLogo(), nav, toggle])
      ])
    ]);
  }

  function buildMobilePanel(header) {
    var panel = el('div', { class: 'nav-panel', id: 'navpanel', 'data-nav-panel': '' });
    var w = el('div', { class: 'wrap' });
    S.nav.forEach(function (item) {
      if (item.children) {
        w.appendChild(txt(item.label, 'h4'));
        item.children.forEach(function (c) { w.appendChild(link(c.href, c.label)); });
      } else {
        w.appendChild(link(item.href, item.label));
      }
    });
    w.appendChild(el('a', {
      href: PM.waLink(), class: 'btn btn--wa btn--block', style: 'margin-top:1.5rem',
      target: '_blank', rel: 'noopener'
    }, [icon('ph-whatsapp-logo'), txt(S.ui.whatsapp)]));
    panel.appendChild(w);
    header.parentNode.insertBefore(panel, header.nextSibling);
  }

  /* The header loses its utility strip once it sticks, so its height is not
     a constant. Anything that has to clear it - the cutaway pane, an anchor
     jump - reads --head-now instead of a number that was right once. */
  function trackHeaderHeight() {
    var header = PM.qs('[data-header]');
    if (!header) return;
    function set() {
      doc.documentElement.style.setProperty('--head-now', header.offsetHeight + 'px');
    }
    set();
    root.addEventListener('resize', set, { passive: true });
    if ('MutationObserver' in root) {
      new MutationObserver(set).observe(header, { attributes: true, attributeFilter: ['class'] });
    }
  }

  function buildHeader() {
    var mount = PM.qs('[data-header]');
    if (!mount) return;
    mount.appendChild(buildUtility());
    mount.appendChild(buildSearchRow());
    mount.appendChild(buildNavRow());
    buildMobilePanel(mount);
  }

  /* ------------------------------------------------------------- footer */
  function navGroup(labelEn) {
    for (var i = 0; i < S.nav.length; i++) {
      if (S.nav[i].label && S.nav[i].label.en === labelEn) return S.nav[i];
    }
    return null;
  }

  function footerColumn(labelEn, extra) {
    var group = navGroup(labelEn);
    var col = el('div', {});
    if (group) {
      col.appendChild(txt(group.label, 'h4'));
      var list = el('div', { class: 'footer-links' });
      group.children.forEach(function (c) { list.appendChild(link(c.href, c.label)); });
      (extra || []).forEach(function (e) { list.appendChild(link(e.href, e.label)); });
      col.appendChild(list);
    }
    return col;
  }

  function buildFooter() {
    var mount = PM.qs('[data-footer]');
    if (!mount) return;

    var about = el('div', {}, [
      brandLogo(),
      txt({
        en: 'Grease traps, oil interceptors and automated dosing, manufactured in Malaysia since 1996 by Kualiti Alam Hijau (M) Sdn Bhd.',
        bm: 'Perangkap minyak, pemintas minyak dan dos automatik, dikeluarkan di Malaysia sejak 1996 oleh Kualiti Alam Hijau (M) Sdn Bhd.'
      }, 'p', { class: 'footer-about' }),
      el('div', { class: 'footer-social' }, [
        el('a', { href: '#', 'aria-label': 'Facebook' }, [icon('ph-facebook-logo')]),
        el('a', { href: '#', 'aria-label': 'Instagram' }, [icon('ph-instagram-logo')]),
        el('a', { href: '#', 'aria-label': 'YouTube' }, [icon('ph-youtube-logo')]),
        el('a', { href: PM.waLink(), target: '_blank', rel: 'noopener', 'aria-label': 'WhatsApp' }, [icon('ph-whatsapp-logo')])
      ])
    ]);

    var contact = el('div', {}, [
      txt({ en: 'Contact', bm: 'Hubungi' }, 'h4'),
      el('div', { class: 'footer-contact' }, [
        el('div', {}, [icon('ph-map-pin'), el('span', { text: S.contact.hq.lines.join(', ') })]),
        el('div', {}, [icon('ph-phone'), el('a', { href: PM.telLink(), text: S.contact.officeDisplay })]),
        el('div', {}, [icon('ph-whatsapp-logo'), el('a', { href: PM.waLink(), target: '_blank', rel: 'noopener', text: S.contact.whatsappDisplay })]),
        el('div', {}, [icon('ph-envelope-simple'), el('a', { href: PM.mailLink(), text: S.contact.email })]),
        el('div', {}, [icon('ph-clock'), txt(S.contact.hours, 'span')])
      ])
    ]);

    mount.appendChild(el('div', { class: 'wrap' }, [
      el('div', { class: 'footer-grid' }, [
        about,
        footerColumn('Products'),
        footerColumn('Compliance', [
          { href: 'services.html', label: { en: 'Services', bm: 'Perkhidmatan' } },
          { href: 'where-to-buy.html', label: { en: 'Where To Buy', bm: 'Tempat Membeli' } }
        ]),
        contact
      ]),
      el('div', { class: 'footer-legal' }, [
        el('span', {}, [
          doc.createTextNode('© '),
          el('span', { 'data-year': '', text: '2026' }),
          doc.createTextNode(' ' + S.brand.legal + ' (' + S.brand.regNo + ')')
        ]),
        el('span', {}, [link('policies.html', { en: 'Privacy & terms', bm: 'Privasi & terma' })])
      ])
    ]));
  }

  /* ------------------------------------------------------- header search
     Searches the catalogue and the model table together, because a buyer
     is as likely to arrive with a model code as with a product name. */
  function searchIndex() {
    var out = C.products.map(function (p) {
      return {
        label: t(p.name),
        code: p.model || '',
        img: p.images && p.images[0],
        href: 'product.html?p=' + p.slug
      };
    });
    C.models.forEach(function (m) {
      if (PM.productByModel(m.model)) return;
      out.push({ label: m.model, code: m.gpm ? m.gpm + ' GPM' : '', img: null, href: 'model-finder.html' });
    });
    return out;
  }

  function mountSearch() {
    var input = PM.qs('[data-search-input]');
    var box = PM.qs('[data-search-results]');
    if (!input || !box) return;
    var index = searchIndex();
    var hits = [];

    PM.on('langchange', function () { index = searchIndex(); });

    function close() { box.hidden = true; }

    function render(q) {
      box.textContent = '';
      hits = [];
      var needle = q.trim().toLowerCase();
      if (needle.length < 2) return close();

      index.forEach(function (it) {
        if (hits.length >= 6) return;
        if ((it.label + ' ' + it.code).toLowerCase().indexOf(needle) > -1) hits.push(it);
      });

      if (!hits.length) {
        box.appendChild(txt(S.ui.noResults, 'p', { class: 'search-empty' }));
        box.hidden = false;
        return;
      }
      hits.forEach(function (it) {
        box.appendChild(el('a', { class: 'search-hit', href: PM.langHref(it.href), role: 'option' }, [
          it.img ? el('img', { src: A(it.img), alt: '', loading: 'lazy' }) : icon('ph-table'),
          el('span', {}, [
            el('b', { text: it.label }),
            it.code ? el('span', { text: it.code }) : null
          ])
        ]));
      });
      box.hidden = false;
    }

    input.addEventListener('input', function () { render(input.value); });
    input.addEventListener('focus', function () { if (input.value) render(input.value); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { close(); input.blur(); }
      if (e.key === 'Enter' && hits.length) {
        e.preventDefault();
        root.location.href = PM.langHref(hits[0].href);
      }
      if (e.key === 'ArrowDown' && !box.hidden) {
        e.preventDefault();
        var first = PM.qs('.search-hit', box);
        if (first) first.focus();
      }
    });
    doc.addEventListener('click', function (e) {
      if (!e.target.closest || !e.target.closest('.search')) close();
    });
    PM.qs('[data-search-go]').addEventListener('click', function () { input.focus(); });
  }

  /* Mega menus open on hover as well as click, and close when focus or the
     pointer leaves. PM.mountNav already binds the click and the outside
     click, so this only adds the pointer and keyboard behaviour. */
  function mountMegaHover() {
    var fine = root.matchMedia && root.matchMedia('(hover: hover) and (pointer: fine)').matches;
    PM.qsa('[data-dropdown]').forEach(function (dd) {
      var btn = PM.qs('[data-dropdown-btn]', dd);
      if (!btn) return;
      var timer = null;

      function open(v) {
        dd.classList.toggle('is-open', v);
        btn.setAttribute('aria-expanded', String(v));
      }
      if (fine) {
        dd.addEventListener('mouseenter', function () { root.clearTimeout(timer); open(true); });
        dd.addEventListener('mouseleave', function () {
          timer = root.setTimeout(function () { open(false); }, 120);
        });
      }
      dd.addEventListener('focusin', function () { open(true); });
      dd.addEventListener('focusout', function () {
        root.setTimeout(function () { if (!dd.contains(doc.activeElement)) open(false); }, 0);
      });
      dd.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { open(false); btn.focus(); }
      });
    });
  }

  /* ================================================================= HOME */

  /* ------------------------------------------------------------ 1. hero
     The most characteristic thing about this product is that it is chosen
     by meal volume, not by taste. So the hero says that, and the rail
     beside it is the first place to act on it. */
  function buildHero() {
    var mount = PM.qs('[data-home-hero]');
    if (!mount) return;

    var banner = el('div', { class: 'hero-banner' }, [
      el('div', { class: 'hero-art', 'data-parallax': '-0.10' }, [
        el('img', { src: A('news/factory.webp'), alt: '', fetchpriority: 'high', decoding: 'async' })
      ]),
      el('div', { class: 'hero-copy' }, [
        txt({ en: 'Grease trap manufacturer', bm: 'Pengeluar perangkap minyak' }, 'span', { class: 'hero-eyebrow mono' }),
        txt({
          en: 'The right grease trap is the one sized to your kitchen',
          bm: 'Perangkap minyak yang betul ialah yang disaiz untuk dapur anda'
        }, 'h1', { 'data-split': 'words' }),
        txt({
          en: 'Seventeen models from 10 to 700 GPM, SIRIM certified and approved by 15 local authorities. Tell us how many meals you serve and we will name the model.',
          bm: 'Tujuh belas model dari 10 hingga 700 GPM, diperakui SIRIM dan diluluskan oleh 15 pihak berkuasa tempatan. Beritahu kami berapa hidangan anda sajikan dan kami akan namakan modelnya.'
        }, 'p'),
        el('div', { class: 'hero-actions' }, [
          link('model-finder.html', { en: 'Find your model', bm: 'Cari model anda' }, 'btn btn--lg'),
          waBtn('btn--lg')
        ])
      ])
    ]);

    var fig = [
      { n: '17', l: { en: 'models', bm: 'model' } },
      { n: '700', l: { en: 'GPM top flow', bm: 'aliran maksimum GPM' } },
      { n: '1996', l: { en: 'manufacturing since', bm: 'mengeluar sejak' } }
    ];
    var strip = el('ul', { class: 'hero-figures' });
    fig.forEach(function (f) {
      strip.appendChild(el('li', {}, [
        el('b', { class: 'mono', text: f.n }),
        txt(f.l, 'span')
      ]));
    });
    banner.querySelector('.hero-copy').appendChild(strip);

    mount.appendChild(el('div', { class: 'wrap' }, [
      el('div', { class: 'hero-grid' }, [banner, buildFindRail()])
    ]));
  }

  function buildFindRail() {
    var cats = el('select', { id: 'find-cat', 'data-find-cat': '' });
    cats.appendChild(el('option', { value: '', 'data-en': 'All grease traps', 'data-bm': 'Semua perangkap minyak', text: 'All grease traps' }));
    C.categories[0].subs.forEach(function (s) {
      cats.appendChild(el('option', { value: s.id, 'data-en': s.name.en, 'data-bm': s.name.bm, text: t(s.name) }));
    });

    var meals = el('input', {
      type: 'number', id: 'find-meals', min: '40', max: '15000', step: '10',
      placeholder: '300', 'data-find-meals': '', inputmode: 'numeric'
    });

    var form = el('form', { class: 'find-form', 'data-find': '' }, [
      el('div', { class: 'field-row' }, [
        txt({ en: 'Product type', bm: 'Jenis produk' }, 'label', { for: 'find-cat' }),
        cats
      ]),
      el('div', { class: 'field-row' }, [
        txt({ en: 'Meals served per day', bm: 'Hidangan sehari' }, 'label', { for: 'find-meals' }),
        meals
      ]),
      el('button', { class: 'btn btn--block', type: 'submit' }, [
        txt({ en: 'Find the model', bm: 'Cari model' }), icon('ph-arrow-right')
      ])
    ]);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var m = parseInt(meals.value, 10);
      if (m > 0) {
        root.location.href = PM.langHref('model-finder.html?meals=' + Math.min(15000, Math.max(40, m)));
      } else if (cats.value) {
        root.location.href = PM.langHref('grease-traps.html?sub=' + cats.value);
      } else {
        root.location.href = PM.langHref('grease-traps.html');
      }
    });

    var promo = el('a', { class: 'promo', href: PM.langHref('auto-dosing.html'), 'data-lang-href': 'auto-dosing.html' }, [
      txt({ en: 'Featured', bm: 'Pilihan' }, 'span', { class: 'promo-tag mono' }),
      el('img', { src: A('products/adu9291p-1.webp'), alt: '', loading: 'lazy' }),
      el('div', {}, [
        el('b', { text: 'ADU 9291P' }),
        txt({
          en: 'Doses enzyme on a timer, every night, with battery backup. Lifetime replacement warranty.',
          bm: 'Menyalurkan enzim mengikut pemasa, setiap malam, dengan sandaran bateri. Waranti penggantian seumur hidup.'
        }, 'p'),
        el('span', { class: 'promo-go' }, [
          txt({ en: 'See the unit', bm: 'Lihat unit' }), icon('ph-arrow-right')
        ])
      ])
    ]);

    return el('aside', { class: 'find-rail' }, [
      el('div', { class: 'find-panel' }, [
        txt({ en: 'Find your model', bm: 'Cari model anda' }, 'h2'),
        txt({ en: 'Two answers and we can name it.', bm: 'Dua jawapan dan kami boleh namakannya.' }, 'p', { class: 'small' }),
        form
      ]),
      promo
    ]);
  }

  /* ------------------------------------------------------ 2. the range */
  var RANGE = [
    { img: 'products/gts02-1.webp', href: 'grease-traps.html?sub=undersink', name: { en: 'Undersink Grease Trap', bm: 'Perangkap Minyak Bawah Sinki' }, note: { en: '15 to 20 GPM', bm: '15 hingga 20 GPM' } },
    { img: 'products/gta325-1.webp', href: 'grease-traps.html?sub=centralized', name: { en: 'Centralized Grease Trap', bm: 'Perangkap Minyak Berpusat' }, note: { en: '25 to 500 GPM', bm: '25 hingga 500 GPM' } },
    { img: 'products/oil-auto-1.webp', href: 'grease-traps.html?sub=oil-interceptor', name: { en: 'Oil Interceptor', bm: 'Pemintas Minyak' }, note: { en: 'Workshop & industrial', bm: 'Bengkel & perindustrian' } },
    { img: 'products/adu-cabinet-1.webp', href: 'auto-dosing.html', name: { en: 'Auto Dosing Unit', bm: 'Unit Dos Automatik' }, note: { en: 'Timed enzyme delivery', bm: 'Penyaluran enzim bermasa' } },
    { img: 'products/goodbac-5l.webp', href: 'bio-enzyme.html', name: { en: 'GoodBac Bio-Enzyme', bm: 'Bio-Enzim GoodBac' }, note: { en: '500 ml to 5 L', bm: '500 ml hingga 5 L' } },
    { img: 'products/bio-brick-1.webp', href: 'others.html', name: { en: 'Other Products', bm: 'Produk Lain' }, note: { en: 'Cabinets, panels, sensors', bm: 'Kabinet, panel, penderia' } }
  ];

  function buildRange() {
    var mount = PM.qs('[data-home-range]');
    if (!mount) return;

    var grid = el('div', { class: 'range-grid', 'data-stagger': '60' });
    RANGE.forEach(function (r) {
      grid.appendChild(el('a', { class: 'range-tile', href: PM.langHref(r.href), 'data-lang-href': r.href, 'data-anim': 'rise' }, [
        el('figure', { class: 'range-art' }, [
          el('img', { src: A(r.img), alt: '', loading: 'lazy', decoding: 'async' })
        ]),
        txt(r.name, 'b'),
        txt(r.note, 'span', { class: 'range-note mono' })
      ]));
    });

    mount.appendChild(el('div', { class: 'wrap' }, [
      sectionHead(
        { en: 'OUR RANGE', bm: 'RANGKAIAN KAMI' },
        { en: 'Six product families, all manufactured in Malaysia and supported by the same service line.', bm: 'Enam keluarga produk, semuanya dikeluarkan di Malaysia dan disokong oleh talian servis yang sama.' }
      ),
      grid
    ]));
  }

  /* --------------------------------------------------------- 3. the sizer
     The signature section. A grease trap is specified by meal volume, so
     this is the shortest honest path from what a buyer knows to the model
     they need. Every figure below comes from the manufacturer's own
     published table. */
  var SIZER_MIN = 40;
  var SIZER_MAX = 15000;

  /* Linear travel over a 375-fold range would bunch every small kitchen
     into the first two millimetres of the track, so the slider is
     geometric: equal travel is equal ratio. */
  function sliderToMeals(v) {
    var r = v / 1000;
    return Math.round(SIZER_MIN * Math.pow(SIZER_MAX / SIZER_MIN, r));
  }
  function mealsToSlider(m) {
    return Math.round(1000 * Math.log(m / SIZER_MIN) / Math.log(SIZER_MAX / SIZER_MIN));
  }
  function group(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  /* The largest published unit, used to normalise the silhouette. */
  function largestModel() {
    var big = null;
    C.models.forEach(function (m) {
      var d = parseMm(m.sizeMm);
      if (!d) return;
      if (!big || d.l > big.l) { big = d; big.model = m.model; }
    });
    return big;
  }
  function parseMm(sizeMm) {
    var bits = String(sizeMm).match(/(\d+)\s*x\s*(\d+)\s*x\s*(\d+)/);
    if (!bits) return null;
    return { l: +bits[1], w: +bits[2], h: +bits[3] };
  }

  function buildSizer() {
    var mount = PM.qs('[data-home-sizer]');
    if (!mount) return;

    var biggest = largestModel();
    var valueNode = el('b', { class: 'sizer-value mono', text: '300' });
    var rows = el('dl', { class: 'sizer-rows' });
    var codeNode = el('b', { class: 'sizer-code mono', text: '' });
    var specLink = el('a', { class: 'btn btn--block', href: '#' }, [
      txt({ en: 'See full specification', bm: 'Lihat spesifikasi penuh' }), icon('ph-arrow-right')
    ]);

    /* The silhouette is a plan view: a real footprint, drawn to the model's
       own published length and width, against the largest unit made. */
    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = doc.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 220 120');
    svg.setAttribute('class', 'sizer-shape');
    svg.setAttribute('aria-hidden', 'true');
    var ref = doc.createElementNS(svgNS, 'rect');
    ref.setAttribute('class', 'sizer-shape-ref');
    ref.setAttribute('x', '10'); ref.setAttribute('y', '10');
    ref.setAttribute('width', '200'); ref.setAttribute('height', '100');
    var inlet = doc.createElementNS(svgNS, 'line');
    inlet.setAttribute('class', 'sizer-shape-pipe');
    var outlet = doc.createElementNS(svgNS, 'line');
    outlet.setAttribute('class', 'sizer-shape-pipe');
    var shell = doc.createElementNS(svgNS, 'rect');
    shell.setAttribute('class', 'sizer-shape-body');
    var baffle1 = doc.createElementNS(svgNS, 'line');
    baffle1.setAttribute('class', 'sizer-shape-baffle');
    var baffle2 = doc.createElementNS(svgNS, 'line');
    baffle2.setAttribute('class', 'sizer-shape-baffle');
    var dim = doc.createElementNS(svgNS, 'text');
    dim.setAttribute('class', 'sizer-shape-dim');
    dim.setAttribute('x', '110');
    dim.setAttribute('y', '118');
    dim.setAttribute('text-anchor', 'middle');
    /* The dashed outline is the largest unit made, so say so. Without the
       label it reads as an empty container rather than a comparison. */
    var refLabel = doc.createElementNS(svgNS, 'text');
    refLabel.setAttribute('class', 'sizer-shape-reflabel');
    refLabel.setAttribute('x', '10');
    refLabel.setAttribute('y', '6');
    refLabel.textContent = biggest ? biggest.model + ' — largest model' : '';
    svg.appendChild(ref);
    svg.appendChild(refLabel);
    svg.appendChild(inlet);
    svg.appendChild(outlet);
    svg.appendChild(shell);
    svg.appendChild(baffle1);
    svg.appendChild(baffle2);
    svg.appendChild(dim);

    function ROW(label) {
      var dd = el('dd', { class: 'mono', text: '' });
      rows.appendChild(txt(label, 'dt'));
      rows.appendChild(dd);
      return dd;
    }
    var outFlow = ROW(S.ui.flowRate);
    var outCap = ROW(S.ui.capacity);
    var outPipe = ROW(S.ui.pipeSize);
    var outDim = ROW(S.ui.dimensions);
    var outDose = ROW({ en: 'Enzyme dose', bm: 'Dos enzim' });

    function update(meals) {
      var m = PM.recommendModel(meals);
      var dose = PM.dosingFor(m.model);
      var prod = PM.productByModel(m.model);

      valueNode.textContent = group(meals);
      codeNode.textContent = m.model;
      outFlow.textContent = m.gpm + ' GPM';
      outCap.textContent = m.max + ' L';
      outPipe.textContent = m.pipe;
      outDim.textContent = m.sizeMm;
      outDose.textContent = dose ? dose.daily + ' ml/day' : '—';

      specLink.setAttribute('href', PM.langHref(prod ? 'product.html?p=' + prod.slug : 'model-finder.html'));

      var d = parseMm(m.sizeMm);
      if (d && biggest) {
        var w = Math.max(26, 200 * (d.l / biggest.l));
        var h = Math.max(16, 100 * (d.w / biggest.w));
        var x = 10 + (200 - w) / 2;
        var y = 10 + (100 - h) / 2;

        shell.setAttribute('width', w.toFixed(1));
        shell.setAttribute('height', h.toFixed(1));
        shell.setAttribute('x', x.toFixed(1));
        shell.setAttribute('y', y.toFixed(1));

        /* Three chambers: solids settle, fat holds, water leaves. The
           baffles are what make this read as a trap and not a box. */
        [[baffle1, x + w / 3], [baffle2, x + (w * 2) / 3]].forEach(function (pair) {
          pair[0].setAttribute('x1', pair[1].toFixed(1));
          pair[0].setAttribute('x2', pair[1].toFixed(1));
          pair[0].setAttribute('y1', (y + 3).toFixed(1));
          pair[0].setAttribute('y2', (y + h - 3).toFixed(1));
        });

        var mid = y + h / 2;
        inlet.setAttribute('x1', Math.max(2, x - 9).toFixed(1));
        inlet.setAttribute('x2', x.toFixed(1));
        inlet.setAttribute('y1', mid.toFixed(1));
        inlet.setAttribute('y2', mid.toFixed(1));
        outlet.setAttribute('x1', (x + w).toFixed(1));
        outlet.setAttribute('x2', Math.min(218, x + w + 9).toFixed(1));
        outlet.setAttribute('y1', mid.toFixed(1));
        outlet.setAttribute('y2', mid.toFixed(1));

        dim.textContent = d.l + ' x ' + d.w + ' mm';
      }
    }

    var range = el('input', {
      type: 'range', min: '0', max: '1000', step: '1',
      value: String(mealsToSlider(300)),
      id: 'sizer-range', class: 'sizer-range',
      'aria-label': PM.lang === 'bm' ? 'Hidangan sehari' : 'Meals served per day'
    });
    range.addEventListener('input', function () { update(sliderToMeals(+range.value)); });

    var control = el('div', { class: 'sizer-control' }, [
      txt({ en: 'Meals per day', bm: 'Hidangan sehari' }, 'label', { class: 'sizer-label', for: 'sizer-range' }),
      el('div', { class: 'sizer-readout' }, [
        valueNode,
        txt({ en: 'meals / day', bm: 'hidangan / hari' }, 'span')
      ]),
      range,
      el('div', { class: 'sizer-scale mono' }, [
        el('span', { text: '40' }),
        el('span', { text: '800' }),
        el('span', { text: '15,000' })
      ])
    ]);

    /* Most people do not count meals. These are the four kitchen types the
       model table itself names, so a rough answer still lands correctly. */
    var PRESETS = [
      { meals: 120, label: { en: 'Kopitiam', bm: 'Kopitiam' } },
      { meals: 400, label: { en: 'Restaurant', bm: 'Restoran' } },
      { meals: 2000, label: { en: 'Canteen', bm: 'Kantin' } },
      { meals: 6500, label: { en: 'Hotel', bm: 'Hotel' } }
    ];
    var presets = el('div', { class: 'sizer-presets' }, [
      txt({ en: 'Not counting? Start here', bm: 'Tidak mengira? Mula di sini' }, 'span', { class: 'sizer-presets-label' })
    ]);
    PRESETS.forEach(function (p) {
      var b = el('button', { class: 'sizer-preset', type: 'button' }, [
        txt(p.label),
        el('em', { class: 'mono', text: group(p.meals) })
      ]);
      b.addEventListener('click', function () {
        range.value = String(mealsToSlider(p.meals));
        update(p.meals);
      });
      presets.appendChild(b);
    });
    control.appendChild(presets);

    var left = el('div', { class: 'sizer-ask', 'data-anim': 'rise' }, [
      txt({ en: 'How many meals do you serve a day?', bm: 'Berapa hidangan anda sajikan sehari?' }, 'h2'),
      txt({
        en: 'Meal volume decides the trap size. Move the slider and the correct model, its capacity and its nightly enzyme dose appear on the right.',
        bm: 'Jumlah hidangan menentukan saiz perangkap. Gerakkan penggelongsor dan model yang betul, kapasitinya dan dos enzim malamannya akan muncul di sebelah kanan.'
      }, 'p'),
      control
    ]);

    var right = el('div', { class: 'sizer-result', 'aria-live': 'polite', 'data-anim': 'rise' }, [
      txt({ en: 'Recommended model', bm: 'Model disyorkan' }, 'span', { class: 'sizer-result-label mono' }),
      codeNode,
      svg,
      rows,
      specLink
    ]);

    mount.appendChild(el('div', { class: 'wrap' }, [
      el('div', { class: 'sizer' }, [left, right])
    ]));

    update(300);
    PM.on('langchange', function () { update(sliderToMeals(+range.value)); });
  }

  /* ------------------------------------------------------- 4. the cutaway
     Signature section. The product does one physical thing: it separates
     fat from water by density. Rather than describe that, the page draws a
     section through the tank and walks the reader down it.

     The drawing below is authored markup, not data, so it is written as a
     literal. Everything the reader can read is set with textContent. */
  var CUTAWAY = [
    {
      title: { en: 'Solids sink', bm: 'Pepejal tenggelam' },
      body: {
        en: 'Food waste is caught in a screen basket that sits above the water line, so it stays dry instead of soaking in wastewater. Anything heavier that gets past it settles on the floor of the first chamber.',
        bm: 'Sisa makanan ditangkap dalam bakul penapis yang duduk di atas paras air, jadi ia kekal kering dan tidak direndam dalam air sisa. Apa-apa yang lebih berat yang terlepas akan mendap di lantai ruang pertama.'
      }
    },
    {
      title: { en: 'Fat floats', bm: 'Lemak terapung' },
      body: {
        en: 'Fats and oils are lighter than water, so they rise. The baffles hold that layer inside the second chamber instead of letting it carry on down the pipe.',
        bm: 'Lemak dan minyak lebih ringan daripada air, jadi ia naik. Sekatan menahan lapisan itu di dalam ruang kedua dan tidak membiarkannya terus masuk ke paip.'
      }
    },
    {
      title: { en: 'Water passes', bm: 'Air melepasi' },
      body: {
        en: 'The outlet draws from below the grease layer, so what leaves the trap is water. Independent SAMM-accredited analysis puts the effluent inside local authority limits.',
        bm: 'Salur keluar mengambil dari bawah lapisan gris, jadi apa yang keluar dari perangkap ialah air. Analisis bebas terakreditasi SAMM menunjukkan efluen berada dalam had pihak berkuasa tempatan.'
      }
    }
  ];

  var CUTAWAY_SVG =
    '<svg viewBox="0 0 660 320" class="cut-svg" role="img" aria-hidden="true">' +
      '<g class="cut-static">' +
        '<path class="cut-pipe" d="M0 62 H150 V104" />' +
        '<path class="cut-pipe" d="M660 232 H584" />' +
        '<rect class="cut-tank" x="70" y="96" width="516" height="196" rx="3" />' +
      '</g>' +
      '<clipPath id="cutTank"><rect x="72" y="98" width="512" height="192" rx="2" /></clipPath>' +
      '<g clip-path="url(#cutTank)">' +
        '<rect class="cut-water" x="72" y="150" width="512" height="140" />' +
        '<g class="cut-ch cut-ch1">' +
          '<path class="cut-solids" d="M78 290 q40 -34 80 -16 q34 15 74 16 z" />' +
          '<rect class="cut-fat" x="72" y="150" width="170" height="18" />' +
        '</g>' +
        '<g class="cut-ch cut-ch2">' +
          '<rect class="cut-fat" x="242" y="150" width="172" height="30" />' +
        '</g>' +
        '<g class="cut-ch cut-ch3">' +
          '<rect class="cut-clean" x="414" y="150" width="170" height="140" />' +
        '</g>' +
        '<line class="cut-level" x1="72" y1="150" x2="584" y2="150" />' +
        '<path class="cut-baffle" d="M242 98 V246" />' +
        '<path class="cut-baffle" d="M414 142 V292" />' +
      '</g>' +
      '<g class="cut-static">' +
        '<rect class="cut-basket" x="96" y="112" width="112" height="30" rx="2" />' +
        '<path class="cut-basket-mesh" d="M104 112 V142 M120 112 V142 M136 112 V142 M152 112 V142 M168 112 V142 M184 112 V142 M200 112 V142" />' +
        '<path class="cut-flow" d="M126 200 H206" marker-end="url(#cutArrow)" />' +
        '<path class="cut-flow" d="M448 232 H540" marker-end="url(#cutArrow)" />' +
      '</g>' +
      '<defs><marker id="cutArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">' +
        '<path d="M0 0 L10 5 L0 10 z" fill="currentColor" /></marker></defs>' +
    '</svg>';

  function buildCutaway() {
    var mount = PM.qs('[data-home-how]');
    if (!mount) return;

    var art = el('div', { class: 'cut-art' });
    art.innerHTML = CUTAWAY_SVG;

    var steps = el('ol', { class: 'cut-steps' });
    CUTAWAY.forEach(function (s, i) {
      steps.appendChild(el('li', { class: 'cut-step', 'data-i': String(i) }, [
        el('span', { class: 'cut-step-n mono', text: String(i + 1) }),
        el('div', {}, [txt(s.title, 'b'), txt(s.body, 'p')])
      ]));
    });

    var inner = el('div', { class: 'cut-sticky' }, [
      el('div', { class: 'wrap' }, [
        sectionHead(
          { en: 'HOW IT WORKS', bm: 'CARA IANYA BERFUNGSI' },
          { en: 'Three chambers, no moving parts and nothing to power. Separation is done by density alone.', bm: 'Tiga ruang, tiada bahagian bergerak dan tiada kuasa diperlukan. Pengasingan dilakukan oleh ketumpatan semata-mata.' }
        ),
        el('div', { class: 'cut-grid' }, [art, steps])
      ])
    ]);

    mount.setAttribute('data-scene', '');
    mount.setAttribute('data-scene-steps', '3');
    mount.appendChild(inner);
  }

  /* ========================================================= product card
     Used on the home page, the category grid and the related row, so its
     shape is fixed here and nowhere else. */
  function productCard(p) {
    var fig = headlineFigure(p);
    var href = 'product.html?p=' + p.slug;

    var add = el('button', {
      class: 'card-add', type: 'button', 'data-enq-add': p.slug,
      'aria-label': (PM.lang === 'bm' ? 'Tambah ke senarai pertanyaan: ' : 'Add to enquiry list: ') + t(p.name)
    }, [icon('ph-plus'), txt({ en: 'Enquiry', bm: 'Pertanyaan' })]);

    return el('article', { class: 'card', 'data-anim': 'rise' }, [
      el('a', { class: 'card-art', href: PM.langHref(href), 'data-lang-href': href, tabindex: '-1', 'aria-hidden': 'true' }, [
        el('img', { src: A(p.images[0]), alt: '', loading: 'lazy', decoding: 'async' })
      ]),
      el('div', { class: 'card-body' }, [
        p.model ? el('span', { class: 'card-code mono', text: p.model }) : null,
        el('h3', { class: 'card-name' }, [link(href, p.name)]),
        txt(p.short, 'p', { class: 'card-short' })
      ]),
      el('div', { class: 'card-foot' }, [
        fig ? el('span', { class: 'card-figure mono', text: fig }) : el('span', {}),
        el('div', { class: 'card-actions' }, [
          link(href, S.ui.requestPrice, 'card-price'),
          add
        ])
      ])
    ]);
  }

  /* ====================================================== enquiry drawer
     Kitchen Arena has a cart. Nothing here is sold online, so the useful
     equivalent is a list of things to ask about, sent in one message. */
  function buildDrawer() {
    if (PM.qs('[data-enq-panel]')) return;

    var list = el('div', { class: 'drawer-list', 'data-enq-list': '' });
    var foot = el('div', { class: 'drawer-foot', 'data-enq-foot': '' });

    var closeBtn = el('button', {
      class: 'drawer-close', type: 'button', 'data-enq-close': '',
      'aria-label': t(S.ui.close)
    }, [icon('ph-x')]);

    var panel = el('aside', {
      class: 'drawer', 'data-enq-panel': '', role: 'dialog', 'aria-modal': 'true',
      'aria-label': PM.lang === 'bm' ? 'Senarai pertanyaan' : 'Enquiry list', 'aria-hidden': 'true'
    }, [
      el('div', { class: 'drawer-head' }, [
        txt({ en: 'Your enquiry list', bm: 'Senarai pertanyaan anda' }, 'h2'),
        closeBtn
      ]),
      list,
      foot
    ]);

    var backdrop = el('div', { class: 'drawer-backdrop', 'data-enq-backdrop': '', hidden: 'hidden' });
    doc.body.appendChild(backdrop);
    doc.body.appendChild(panel);
  }

  function drawerRow(item) {
    var p = item.product;
    var href = 'product.html?p=' + p.slug;

    function step(delta) {
      return function () { PM.enquiry.setQty(p.slug, item.qty + delta); };
    }

    return el('div', { class: 'drawer-row' }, [
      el('img', { src: A(p.images[0]), alt: '', loading: 'lazy' }),
      el('div', { class: 'drawer-row-main' }, [
        p.model ? el('span', { class: 'mono drawer-row-code', text: p.model }) : null,
        link(href, p.name, 'drawer-row-name')
      ]),
      el('div', { class: 'qty' }, [
        el('button', { type: 'button', 'aria-label': 'Decrease', onclick: step(-1), text: '−' }),
        el('span', { class: 'mono', text: String(item.qty) }),
        el('button', { type: 'button', 'aria-label': 'Increase', onclick: step(1), text: '+' })
      ]),
      el('button', {
        class: 'drawer-remove', type: 'button',
        'aria-label': (PM.lang === 'bm' ? 'Buang ' : 'Remove ') + t(p.name),
        onclick: function () { PM.enquiry.remove(p.slug); }
      }, [icon('ph-trash')])
    ]);
  }

  function renderDrawer() {
    var list = PM.qs('[data-enq-list]');
    var foot = PM.qs('[data-enq-foot]');
    if (!list || !foot) return;

    var items = PM.enquiry.items();
    list.textContent = '';
    foot.textContent = '';

    if (!items.length) {
      list.appendChild(el('div', { class: 'drawer-empty' }, [
        icon('ph-clipboard-text'),
        txt({ en: 'Nothing on the list yet', bm: 'Belum ada apa-apa dalam senarai' }, 'b'),
        txt({
          en: 'Add products as you browse, then send the whole list to us in one message.',
          bm: 'Tambah produk sambil anda melayari, kemudian hantar keseluruhan senarai kepada kami dalam satu mesej.'
        }, 'p'),
        link('grease-traps.html', { en: 'Browse grease traps', bm: 'Lihat perangkap minyak' }, 'btn')
      ]));
      return;
    }

    items.forEach(function (it) { list.appendChild(drawerRow(it)); });

    foot.appendChild(el('p', { class: 'drawer-note small' }, [
      txt({
        en: 'Prices are quoted per enquiry. Send the list and we will reply with pricing and lead time.',
        bm: 'Harga disebut mengikut pertanyaan. Hantar senarai dan kami akan membalas dengan harga dan masa penghantaran.'
      })
    ]));
    foot.appendChild(el('a', {
      class: 'btn btn--wa btn--block', href: PM.enquiry.waMessage(), target: '_blank', rel: 'noopener'
    }, [icon('ph-whatsapp-logo'), txt({ en: 'Send the list on WhatsApp', bm: 'Hantar senarai di WhatsApp' })]));

    var mail = 'mailto:' + S.contact.email +
      '?subject=' + encodeURIComponent('Enquiry list') +
      '&body=' + encodeURIComponent(PM.enquiry.formText());
    foot.appendChild(el('div', { class: 'drawer-alt' }, [
      el('a', { class: 'btn btn--light', href: mail }, [icon('ph-envelope-simple'), txt({ en: 'Email it', bm: 'E-mel' })]),
      el('button', {
        class: 'btn btn--light', type: 'button',
        onclick: function () { PM.enquiry.clear(); }
      }, [icon('ph-trash'), txt({ en: 'Clear list', bm: 'Kosongkan' })])
    ]));
  }

  APP.mountEnquiry = function () {
    if (!PM.enquiry) return;
    buildDrawer();

    var panel = PM.qs('[data-enq-panel]');
    var backdrop = PM.qs('[data-enq-backdrop]');
    var lastFocus = null;

    function setOpen(open) {
      panel.classList.toggle('is-open', open);
      panel.setAttribute('aria-hidden', String(!open));
      backdrop.hidden = !open;
      doc.body.classList.toggle('nav-locked', open);
      if (open) {
        lastFocus = doc.activeElement;
        renderDrawer();
        /* The panel is still visibility:hidden in this tick, so focus() would
           be a no-op. Wait for the style recalculation. */
        root.requestAnimationFrame(function () {
          var first = PM.qs('[data-enq-close]', panel);
          if (first) first.focus();
        });
      } else if (lastFocus && lastFocus.focus) {
        lastFocus.focus();
      }
    }

    /* Focus stays inside the panel while it is open. */
    panel.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') return setOpen(false);
      if (e.key !== 'Tab') return;
      var f = PM.qsa('a[href], button:not([disabled]), input', panel).filter(function (n) {
        return n.offsetParent !== null;
      });
      if (!f.length) return;
      var first = f[0];
      var last = f[f.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    backdrop.addEventListener('click', function () { setOpen(false); });
    PM.qs('[data-enq-close]', panel).addEventListener('click', function () { setOpen(false); });

    doc.addEventListener('click', function (e) {
      var open = e.target.closest && e.target.closest('[data-enq-open]');
      if (open) { e.preventDefault(); return setOpen(true); }

      var add = e.target.closest && e.target.closest('[data-enq-add]');
      if (!add) return;
      e.preventDefault();
      PM.enquiry.add(add.getAttribute('data-enq-add'), 1);
      add.classList.add('is-added');
      root.setTimeout(function () { add.classList.remove('is-added'); }, 1400);
    });

    function syncCount() {
      var n = PM.enquiry.count();
      PM.qsa('[data-enq-count]').forEach(function (b) {
        b.textContent = String(n);
        b.setAttribute('data-empty', String(n === 0));
      });
      if (panel.classList.contains('is-open')) renderDrawer();
    }
    PM.on('enquirychange', syncCount);
    PM.on('langchange', function () { if (panel.classList.contains('is-open')) renderDrawer(); });
    syncCount();
  };

  /* --------------------------------------------------- 5. featured rail */
  function buildFeatured() {
    var mount = PM.qs('[data-home-featured]');
    if (!mount) return;

    var items = PM.featured(8);
    var track = el('div', { class: 'rail-track' });
    items.forEach(function (p) { track.appendChild(productCard(p)); });

    var rail = el('div', { class: 'rail' }, [track]);

    function nudge(dir) {
      return function () { track.scrollBy({ left: dir * (track.clientWidth * 0.8), behavior: 'smooth' }); };
    }
    var nav = el('div', { class: 'rail-nav' }, [
      el('button', { class: 'rail-btn', type: 'button', 'aria-label': 'Previous', onclick: nudge(-1) }, [icon('ph-caret-left')]),
      el('button', { class: 'rail-btn', type: 'button', 'aria-label': 'Next', onclick: nudge(1) }, [icon('ph-caret-right')])
    ]);

    var head = sectionHead(
      { en: 'FEATURED PRODUCTS', bm: 'PRODUK PILIHAN' },
      { en: 'The models most kitchens end up specifying. Every price is quoted, so add what interests you and send the list.', bm: 'Model yang paling kerap ditetapkan oleh dapur. Setiap harga disebut, jadi tambah apa yang menarik minat anda dan hantar senarai.' }
    );
    head.appendChild(nav);

    mount.appendChild(el('div', { class: 'wrap' }, [head, rail]));
  }

  /* ------------------------------------------------------- 6. services */
  function buildServices() {
    var mount = PM.qs('[data-home-services]');
    if (!mount) return;

    var grid = el('div', { class: 'svc-grid', 'data-stagger': '60' });
    C.services.forEach(function (s) {
      var href = 'service.html?s=' + s.slug;
      grid.appendChild(el('a', { class: 'svc-tile', href: PM.langHref(href), 'data-lang-href': href, 'data-anim': 'rise' }, [
        el('img', { src: A(s.img), alt: '', loading: 'lazy', decoding: 'async' }),
        txt(s.name, 'span', { class: 'svc-label' })
      ]));
    });
    grid.appendChild(el('a', { class: 'svc-tile svc-tile--more', href: PM.langHref('services.html'), 'data-lang-href': 'services.html', 'data-anim': 'rise' }, [
      icon('ph-arrow-up-right'),
      txt({ en: 'All services', bm: 'Semua perkhidmatan' }, 'b'),
      txt({ en: 'Cleaning, desludging, manholes, scheduled waste and water supply.', bm: 'Pembersihan, penyahenapan, lurang, sisa berjadual dan bekalan air.' }, 'p')
    ]));

    mount.appendChild(el('div', { class: 'wrap' }, [
      sectionHead(
        { en: 'OUR SERVICES', bm: 'PERKHIDMATAN KAMI' },
        { en: 'The trap is half the job. Crews across Perak, Selangor, Penang, Melaka and Johor handle the rest.', bm: 'Perangkap hanyalah separuh daripada kerja. Kru di Perak, Selangor, Pulau Pinang, Melaka dan Johor mengendalikan selebihnya.' }
      ),
      grid
    ]));
  }

  /* -------------------------------------------- 7. approvals & clients */
  function buildTrust() {
    var mount = PM.qs('[data-home-trust]');
    if (!mount) return;

    var crests = el('div', { class: 'crest-row' });
    S.approvals.slice(0, 10).forEach(function (a) {
      crests.appendChild(el('figure', { class: 'crest', title: a.name }, [
        el('img', { src: A(a.img), alt: a.name, loading: 'lazy' })
      ]));
    });

    var belt = el('div', { class: 'marquee-track' });
    S.clients.forEach(function (c) {
      belt.appendChild(el('span', { class: 'client-chip' }, [
        el('b', { text: c.name }),
        el('em', { class: 'mono', text: c.place })
      ]));
    });

    mount.appendChild(el('div', {}, [
      el('div', { class: 'wrap' }, [
        sectionHead(
          { en: 'APPROVED & INSTALLED', bm: 'DILULUSKAN & DIPASANG' },
          { en: 'Accepted by 15 local authorities and installed on sites that have to pass inspection.', bm: 'Diterima oleh 15 pihak berkuasa tempatan dan dipasang di tapak yang perlu lulus pemeriksaan.' }
        ),
        crests
      ]),
      el('div', { class: 'client-belt', 'data-marquee-auto': '26', 'aria-label': 'Clients' }, [belt])
    ]));
  }

  /* ---------------------------------------------------------- 8. about */
  function buildAbout() {
    var mount = PM.qs('[data-home-about]');
    if (!mount) return;

    mount.appendChild(el('div', { class: 'wrap' }, [
      el('div', { class: 'about-panel', 'data-anim': 'rise' }, [
        el('figure', { class: 'about-art' }, [
          el('img', { src: A('news/factory.webp'), alt: '', loading: 'lazy' })
        ]),
        el('div', { class: 'about-copy' }, [
          txt({ en: 'About Perangkap Minyak', bm: 'Mengenai Perangkap Minyak' }, 'h2'),
          txt({
            en: 'Kualiti Alam Hijau (M) Sdn Bhd has manufactured grease traps in Malaysia since 1996. Two factories, in Rawang and Melaka, build to a SIRIM-certified design in 304 stainless steel and reinforced fibreglass, backed by a 5 year factory warranty and an exclusive 3 year on-site warranty.',
            bm: 'Kualiti Alam Hijau (M) Sdn Bhd telah mengeluarkan perangkap minyak di Malaysia sejak 1996. Dua kilang, di Rawang dan Melaka, membina mengikut reka bentuk diperakui SIRIM dalam keluli tahan karat 304 dan gentian kaca bertetulang, disokong oleh waranti kilang 5 tahun dan waranti eksklusif 3 tahun di tapak.'
          }, 'p'),
          el('div', { class: 'about-facts' }, [
            el('div', {}, [el('b', { class: 'mono', text: '2' }), txt({ en: 'factories', bm: 'kilang' }, 'span')]),
            el('div', {}, [el('b', { class: 'mono', text: '5+3' }), txt({ en: 'year warranty', bm: 'tahun waranti' }, 'span')]),
            el('div', {}, [el('b', { class: 'mono', text: '304' }), txt({ en: 'stainless steel', bm: 'keluli tahan karat' }, 'span')])
          ]),
          link('about.html', { en: 'Read the company profile', bm: 'Baca profil syarikat' }, 'btn btn--ghost')
        ])
      ])
    ]));
  }

  /* ----------------------------------------------------------- 9. news */
  function buildNews() {
    var mount = PM.qs('[data-home-news]');
    if (!mount) return;

    var grid = el('div', { class: 'grid grid--3', 'data-stagger': '60' });
    S.news.slice(0, 3).forEach(function (n) { grid.appendChild(newsCard(n)); });

    mount.appendChild(el('div', { class: 'wrap' }, [
      sectionHead(
        { en: 'TECHNICAL NOTES', bm: 'NOTA TEKNIKAL' },
        { en: 'What certification, chamber design and basket position actually change in a working kitchen.', bm: 'Apa yang pensijilan, reka bentuk ruang dan kedudukan bakul benar-benar ubah dalam dapur yang beroperasi.' }
      ),
      grid
    ]));
  }

  /* One note card, used on the home page, the news index and the foot of an
     article. Two of the three notes illustrate themselves with a marketing
     sheet or an archive plate rather than a photograph, so the art is put
     through the frame system rather than cropped to a fixed shape. */
  function newsCard(n) {
    var href = 'article.html?a=' + n.slug;
    return el('article', { class: 'news-card', 'data-anim': 'rise' }, [
      el('a', {
        class: 'news-art', href: PM.langHref(href), 'data-lang-href': href,
        tabindex: '-1', 'aria-hidden': 'true'
      }, [frame(n.img, PM.showsWhole && PM.showsWhole(n.img) ? 'cardart' : 'card', '')]),
      el('div', { class: 'news-body' }, [
        el('time', { class: 'mono news-date', datetime: n.date, text: n.date }),
        el('h3', {}, [link(href, n.title)]),
        txt(n.excerpt, 'p')
      ])
    ]);
  }

  /* ------------------------------------------------------------ 10. cta */
  function buildCta() {
    var mount = PM.qs('[data-home-cta]');
    if (!mount) return;

    mount.appendChild(el('div', { class: 'wrap' }, [
      el('div', { class: 'cta-in' }, [
        el('div', {}, [
          txt({ en: 'Tell us your kitchen and we will size it', bm: 'Beritahu kami dapur anda dan kami akan menyaiznya' }, 'h2'),
          txt({
            en: 'Send a photo of the sink area or the drain layout on WhatsApp. We will come back with the model, the dimensions and a price.',
            bm: 'Hantar gambar kawasan sinki atau susun atur longkang melalui WhatsApp. Kami akan kembali dengan model, dimensi dan harga.'
          }, 'p')
        ]),
        el('div', { class: 'cta-actions' }, [
          waBtn('btn--lg'),
          link('contact.html', { en: 'Request a quote', bm: 'Minta sebut harga' }, 'btn btn--lg btn--light')
        ])
      ])
    ]));
  }


  /* ==================================================== shared page parts */
  function modelRow(p) {
    if (!p.model) return null;
    for (var i = 0; i < C.models.length; i++) {
      if (C.models[i].model === p.model) return C.models[i];
    }
    return null;
  }

  function breadcrumb(trail) {
    var nav = el('nav', { class: 'crumbs', 'aria-label': 'Breadcrumb' });
    var ol = el('ol', {});
    ol.appendChild(el('li', {}, [link('index.html', { en: 'Home', bm: 'Utama' })]));
    trail.forEach(function (c, i) {
      var last = i === trail.length - 1;
      ol.appendChild(el('li', {}, [
        last ? txt(c.label, 'span', { 'aria-current': 'page' }) : link(c.href, c.label)
      ]));
    });
    nav.appendChild(ol);
    return nav;
  }

  /* The counter says what is being counted. A catalogue page counts
     products; a gallery counts plates and a video library counts films,
     and labelling all three "products" was simply wrong. */
  function pageBanner(title, blurb, count, countLabel) {
    return el('div', { class: 'banner' }, [
      el('div', { class: 'wrap' }, [
        el('div', { class: 'banner-in' }, [
          el('div', {}, [
            txt(title, 'h1'),
            blurb ? txt(blurb, 'p') : null
          ]),
          count !== null && count !== undefined
            ? el('span', { class: 'banner-count mono' }, [
                el('b', { text: String(count) }),
                txt(countLabel || { en: 'products', bm: 'produk' }, 'span')
              ])
            : null
        ])
      ])
    ]);
  }

  /* =============================================== 7. category page
     Kitchen Arena's category page adapted: filter sidebar against a grid,
     with the filter state carried in the query string so a filtered view
     can be sent to a colleague as a link. */
  var FLOW_BUCKETS = [
    { id: '0-20', label: { en: 'Up to 20 GPM', bm: 'Sehingga 20 GPM' }, test: function (g) { return g > 0 && g <= 20; } },
    { id: '21-100', label: { en: '21 to 100 GPM', bm: '21 hingga 100 GPM' }, test: function (g) { return g > 20 && g <= 100; } },
    { id: '101-300', label: { en: '101 to 300 GPM', bm: '101 hingga 300 GPM' }, test: function (g) { return g > 100 && g <= 300; } },
    { id: '301+', label: { en: 'Over 300 GPM', bm: 'Melebihi 300 GPM' }, test: function (g) { return g > 300; } }
  ];

  var CAP_BUCKETS = [
    { id: 'u100', label: { en: 'Under 100 L', bm: 'Bawah 100 L' }, test: function (l) { return l > 0 && l < 100; } },
    { id: '100-500', label: { en: '100 to 500 L', bm: '100 hingga 500 L' }, test: function (l) { return l >= 100 && l <= 500; } },
    { id: '500-2000', label: { en: '500 to 2,000 L', bm: '500 hingga 2,000 L' }, test: function (l) { return l > 500 && l <= 2000; } },
    { id: 'o2000', label: { en: 'Over 2,000 L', bm: 'Melebihi 2,000 L' }, test: function (l) { return l > 2000; } }
  ];

  var CERTS = [
    { id: 'sirim', badge: 'sirim', label: { en: 'SIRIM certified', bm: 'Diperakui SIRIM' } },
    { id: 'ss304', badge: 'ss304', label: { en: '304 stainless steel', bm: 'Keluli tahan karat 304' } },
    { id: 'warranty', badge: 'warranty', label: { en: '5+3 year warranty', bm: 'Waranti 5+3 tahun' } }
  ];

  var SORTS = [
    { id: 'recommended', label: { en: 'Recommended', bm: 'Disyorkan' } },
    { id: 'flow-asc', label: { en: 'Flow rate, low to high', bm: 'Kadar aliran, rendah ke tinggi' } },
    { id: 'flow-desc', label: { en: 'Flow rate, high to low', bm: 'Kadar aliran, tinggi ke rendah' } },
    { id: 'cap-desc', label: { en: 'Capacity, high to low', bm: 'Kapasiti, tinggi ke rendah' } },
    { id: 'model', label: { en: 'Model code', bm: 'Kod model' } }
  ];

  function readState() {
    var q = new URLSearchParams(root.location.search);
    function list(k) {
      var v = q.get(k);
      return v ? v.split(',').filter(Boolean) : [];
    }
    return {
      sub: list('sub'),
      flow: list('flow'),
      cap: list('cap'),
      cert: list('cert'),
      sort: q.get('sort') || 'recommended',
      show: parseInt(q.get('show'), 10) || 12,
      page: parseInt(q.get('page'), 10) || 1
    };
  }

  function writeState(st) {
    var q = new URLSearchParams();
    ['sub', 'flow', 'cap', 'cert'].forEach(function (k) {
      if (st[k].length) q.set(k, st[k].join(','));
    });
    if (st.sort !== 'recommended') q.set('sort', st.sort);
    if (st.show !== 12) q.set('show', String(st.show));
    if (st.page > 1) q.set('page', String(st.page));
    if (PM.lang !== 'en') q.set('lang', PM.lang);
    var qs = q.toString();
    root.history.replaceState(null, '', root.location.pathname + (qs ? '?' + qs : ''));
  }

  function applyFilters(all, st) {
    return all.filter(function (p) {
      if (st.sub.length && st.sub.indexOf(p.sub) < 0) return false;
      if (st.flow.length) {
        var okFlow = st.flow.some(function (id) {
          var b = FLOW_BUCKETS.filter(function (x) { return x.id === id; })[0];
          return b && b.test(p.gpm || 0);
        });
        if (!okFlow) return false;
      }
      if (st.cap.length) {
        var okCap = st.cap.some(function (id) {
          var b = CAP_BUCKETS.filter(function (x) { return x.id === id; })[0];
          return b && b.test(p.litres || 0);
        });
        if (!okCap) return false;
      }
      if (st.cert.length) {
        var badges = p.badges || [];
        var okCert = st.cert.every(function (id) {
          var c = CERTS.filter(function (x) { return x.id === id; })[0];
          return c && badges.indexOf(C.badge[c.badge]) > -1;
        });
        if (!okCert) return false;
      }
      return true;
    });
  }

  function sortProducts(list, sort) {
    var out = list.slice();
    if (sort === 'flow-asc') out.sort(function (a, b) { return (a.gpm || 0) - (b.gpm || 0); });
    else if (sort === 'flow-desc') out.sort(function (a, b) { return (b.gpm || 0) - (a.gpm || 0); });
    else if (sort === 'cap-desc') out.sort(function (a, b) { return (b.litres || 0) - (a.litres || 0); });
    else if (sort === 'model') out.sort(function (a, b) { return String(a.model || '').localeCompare(String(b.model || '')); });
    else out.sort(function (a, b) { return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); });
    return out;
  }

  APP.pages.greaseTraps = function () {
    var mount = PM.qs('[data-catalogue]');
    if (!mount) return;

    var cat = C.categories[0];
    var all = PM.productsBy('grease-trap');
    var st = readState();

    var head = PM.qs('[data-cat-head]');
    if (head) {
      head.appendChild(el('div', { class: 'wrap' }, [
        breadcrumb([{ href: 'grease-traps.html', label: cat.name }])
      ]));
      head.appendChild(pageBanner(cat.name, cat.blurb, all.length));
    }

    var grid = el('div', { class: 'cat-grid' });
    var chipRow = el('div', { class: 'chip-row' });
    var countNode = el('span', { class: 'mono' });
    var pager = el('nav', { class: 'pager', 'aria-label': 'Pagination' });

    /* ---- sidebar */
    function group(titlePair, options, key) {
      var box = el('div', { class: 'filter-group' }, [txt(titlePair, 'h3')]);
      options.forEach(function (o) {
        var id = key + '-' + o.id;
        var input = el('input', {
          type: 'checkbox', id: id, value: o.id,
          checked: st[key].indexOf(o.id) > -1 ? 'checked' : null
        });
        input.addEventListener('change', function () {
          var i = st[key].indexOf(o.id);
          if (input.checked && i < 0) st[key].push(o.id);
          else if (!input.checked && i > -1) st[key].splice(i, 1);
          st.page = 1;
          render();
        });
        box.appendChild(el('label', { class: 'filter-opt', for: id }, [
          input,
          txt(o.label || o.name, 'span'),
          el('em', { class: 'mono', 'data-count-for': key + ':' + o.id, text: '' })
        ]));
      });
      return box;
    }

    var sidebar = el('aside', { class: 'sidebar', 'data-sidebar': '' }, [
      el('div', { class: 'filter-group' }, [
        txt({ en: 'Categories', bm: 'Kategori' }, 'h3'),
        (function () {
          var list = el('div', { class: 'filter-links' });
          C.categories.forEach(function (c) {
            var a = link(c.href, c.name);
            if (c.id === 'grease-trap') a.setAttribute('aria-current', 'page');
            list.appendChild(a);
          });
          list.appendChild(link('model-finder.html', { en: 'Model & Size Finder', bm: 'Pencari Model & Saiz' }));
          return list;
        })()
      ]),
      group({ en: 'Trap type', bm: 'Jenis perangkap' }, cat.subs, 'sub'),
      group({ en: 'Flow rate', bm: 'Kadar aliran' }, FLOW_BUCKETS, 'flow'),
      group({ en: 'Capacity', bm: 'Kapasiti' }, CAP_BUCKETS, 'cap'),
      group({ en: 'Certification', bm: 'Pensijilan' }, CERTS, 'cert'),
      el('div', { class: 'filter-help' }, [
        icon('ph-question'),
        txt({ en: 'Not sure which size?', bm: 'Tidak pasti saiz mana?' }, 'b'),
        txt({ en: 'Enter your daily meal volume and the model finder names the model.', bm: 'Masukkan jumlah hidangan harian anda dan pencari model akan menamakan modelnya.' }, 'p'),
        link('model-finder.html', { en: 'Open the model finder', bm: 'Buka pencari model' }, 'btn btn--ghost btn--sm')
      ])
    ]);

    /* ---- toolbar */
    var sortSel = el('select', { id: 'cat-sort', 'aria-label': 'Sort by' });
    SORTS.forEach(function (s) {
      sortSel.appendChild(el('option', { value: s.id, 'data-en': s.label.en, 'data-bm': s.label.bm, text: t(s.label), selected: st.sort === s.id ? 'selected' : null }));
    });
    sortSel.addEventListener('change', function () { st.sort = sortSel.value; st.page = 1; render(); });

    var showSel = el('select', { id: 'cat-show', 'aria-label': 'Products per page' });
    [12, 24, 48].forEach(function (n) {
      showSel.appendChild(el('option', { value: String(n), text: String(n), selected: st.show === n ? 'selected' : null }));
    });
    showSel.addEventListener('change', function () { st.show = parseInt(showSel.value, 10); st.page = 1; render(); });

    var toolbar = el('div', { class: 'toolbar' }, [
      el('span', { class: 'toolbar-count' }, [countNode, txt({ en: ' products', bm: ' produk' }, 'span')]),
      el('div', { class: 'toolbar-controls' }, [
        el('label', { class: 'toolbar-field' }, [txt({ en: 'Sort', bm: 'Susun' }, 'span'), sortSel]),
        el('label', { class: 'toolbar-field' }, [txt({ en: 'Show', bm: 'Papar' }, 'span'), showSel])
      ])
    ]);

    var filterToggle = el('button', { class: 'filter-toggle btn btn--light', type: 'button' }, [
      icon('ph-sliders-horizontal'), txt({ en: 'Filters', bm: 'Penapis' })
    ]);
    filterToggle.addEventListener('click', function () {
      var open = sidebar.classList.toggle('is-open');
      filterToggle.setAttribute('aria-expanded', String(open));
    });

    /* ---- render */
    function labelFor(key, id) {
      var src = key === 'sub' ? cat.subs : key === 'flow' ? FLOW_BUCKETS : key === 'cap' ? CAP_BUCKETS : CERTS;
      var hit = src.filter(function (x) { return x.id === id; })[0];
      return hit ? (hit.label || hit.name) : { en: id, bm: id };
    }

    function renderChips(active) {
      chipRow.textContent = '';
      if (!active.length) return;
      active.forEach(function (a) {
        var chip = el('button', { class: 'chip', type: 'button' }, [
          txt(labelFor(a.key, a.id), 'span'), icon('ph-x')
        ]);
        chip.addEventListener('click', function () {
          st[a.key].splice(st[a.key].indexOf(a.id), 1);
          st.page = 1;
          render();
        });
        chipRow.appendChild(chip);
      });
      var clear = el('button', { class: 'chip chip--clear', type: 'button' }, [txt(S.ui.resetFilters)]);
      clear.addEventListener('click', function () {
        st.sub = []; st.flow = []; st.cap = []; st.cert = []; st.page = 1;
        PM.qsa('input[type=checkbox]', sidebar).forEach(function (i) { i.checked = false; });
        render();
      });
      chipRow.appendChild(clear);
    }

    function renderCounts() {
      /* Each option shows how many products it would leave, counted against
         the other groups only, so a count never reads zero for something
         that is currently selected. */
      [['sub', cat.subs], ['flow', FLOW_BUCKETS], ['cap', CAP_BUCKETS], ['cert', CERTS]].forEach(function (pair) {
        var key = pair[0];
        pair[1].forEach(function (o) {
          var probe = { sub: st.sub, flow: st.flow, cap: st.cap, cert: st.cert };
          probe[key] = [o.id];
          var n = applyFilters(all, probe).length;
          var node = PM.qs('[data-count-for="' + key + ':' + o.id + '"]', sidebar);
          if (node) node.textContent = String(n);
        });
      });
    }

    function renderPager(total) {
      pager.textContent = '';
      var pages = Math.ceil(total / st.show);
      if (pages <= 1) return;
      for (var i = 1; i <= pages; i++) {
        (function (n) {
          var b = el('button', {
            class: 'pager-btn' + (n === st.page ? ' is-current' : ''),
            type: 'button',
            'aria-current': n === st.page ? 'page' : null,
            text: String(n)
          });
          b.addEventListener('click', function () {
            st.page = n;
            render();
            grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
          pager.appendChild(b);
        })(i);
      }
    }

    function render() {
      var active = [];
      ['sub', 'flow', 'cap', 'cert'].forEach(function (k) {
        st[k].forEach(function (id) { active.push({ key: k, id: id }); });
      });

      var filtered = sortProducts(applyFilters(all, st), st.sort);
      countNode.textContent = String(filtered.length);
      renderChips(active);
      renderCounts();

      var start = (st.page - 1) * st.show;
      var pageItems = filtered.slice(start, start + st.show);

      grid.textContent = '';
      if (!pageItems.length) {
        var reset = el('button', { class: 'btn', type: 'button' }, [txt(S.ui.resetFilters)]);
        reset.addEventListener('click', function () {
          st.sub = []; st.flow = []; st.cap = []; st.cert = []; st.page = 1;
          PM.qsa('input[type=checkbox]', sidebar).forEach(function (i) { i.checked = false; });
          render();
        });
        grid.appendChild(el('div', { class: 'empty' }, [
          icon('ph-funnel-simple'),
          txt({ en: 'No products match these filters', bm: 'Tiada produk sepadan dengan penapis ini' }, 'b'),
          txt({ en: 'Clear a filter or two and the grid fills again.', bm: 'Kosongkan satu atau dua penapis dan grid akan terisi semula.' }, 'p'),
          reset
        ]));
      } else {
        pageItems.forEach(function (p) {
          var card = productCard(p);
          card.removeAttribute('data-anim');
          grid.appendChild(card);
        });
      }

      renderPager(filtered.length);
      writeState(st);
      PM.applyI18n(grid);
      PM.applyI18n(chipRow);
      PM.emit('render');
    }

    mount.appendChild(el('div', { class: 'wrap' }, [
      el('div', { class: 'cat-layout' }, [
        sidebar,
        el('div', { class: 'cat-main' }, [filterToggle, toolbar, chipRow, grid, pager])
      ])
    ]));

    render();
    PM.on('langchange', render);
  };

  /* ================================================== 8. model finder */
  APP.pages.modelFinder = function () {
    var mount = PM.qs('[data-finder]');
    if (!mount) return;

    var head = PM.qs('[data-cat-head]');
    if (head) {
      head.appendChild(el('div', { class: 'wrap' }, [
        breadcrumb([{ href: 'model-finder.html', label: { en: 'Model & Size Finder', bm: 'Pencari Model & Saiz' } }])
      ]));
      head.appendChild(pageBanner(
        { en: 'Model & Size Finder', bm: 'Pencari Model & Saiz' },
        { en: 'The manufacturer’s full specification table. Filter by series, or type your daily meal volume and the matching model is highlighted.', bm: 'Jadual spesifikasi penuh pengeluar. Tapis mengikut siri, atau taip jumlah hidangan harian anda dan model yang sepadan akan diserlahkan.' },
        C.models.length
      ));
    }

    var SERIES = [
      { id: '', label: { en: 'All series', bm: 'Semua siri' } },
      { id: 'undersink', label: { en: 'Undersink', bm: 'Bawah sinki' } },
      { id: 'centralized', label: { en: 'Centralized', bm: 'Berpusat' } },
      { id: 'drain', label: { en: 'Drain interceptor', bm: 'Pemintas longkang' } }
    ];

    var series = '';
    var highlight = null;

    var tbody = el('tbody', {});
    var caption = el('caption', { class: 'sr-only', text: 'Grease trap model specifications' });

    var COLS = [
      { label: { en: 'Model', bm: 'Model' } },
      { label: S.ui.flowRate },
      { label: S.ui.dailyMeals },
      { label: S.ui.capacity },
      { label: S.ui.pipeSize },
      { label: S.ui.dimensions },
      { label: S.ui.suggestedFor }
    ];

    var thead = el('thead', {});
    var hrow = el('tr', {});
    COLS.forEach(function (c) { hrow.appendChild(txt(c.label, 'th', { scope: 'col' })); });
    thead.appendChild(hrow);

    var table = el('table', { class: 'spec-table' }, [caption, thead, tbody]);

    function draw() {
      tbody.textContent = '';
      var rows = C.models.filter(function (m) { return !series || m.series === series; });

      rows.forEach(function (m) {
        var prod = PM.productByModel(m.model);
        var tr = el('tr', { 'data-model': m.model });
        if (highlight === m.model) tr.className = 'is-match';

        tr.appendChild(el('th', { scope: 'row' }, [
          prod ? link('product.html?p=' + prod.slug, m.model, 'mono') : el('span', { class: 'mono', text: m.model })
        ]));
        tr.appendChild(el('td', { class: 'mono', text: m.gpm ? m.gpm + ' GPM' : '—' }));
        tr.appendChild(el('td', { class: 'mono', text: String(m.meals) }));
        tr.appendChild(el('td', { class: 'mono', text: m.max ? m.max + ' L' : '—' }));
        tr.appendChild(el('td', { class: 'mono', text: m.pipe }));
        tr.appendChild(el('td', { class: 'mono', text: m.sizeMm }));
        tr.appendChild(txt(m.suggested, 'td'));
        tbody.appendChild(tr);
      });

      if (!rows.length) {
        tbody.appendChild(el('tr', {}, [
          txt(S.ui.noResults, 'td', { colspan: '7', class: 'empty-cell' })
        ]));
      }
      PM.applyI18n(tbody);
    }

    /* ---- controls */
    var chips = el('div', { class: 'series-chips', role: 'group' });
    SERIES.forEach(function (s) {
      var b = el('button', {
        class: 'chip chip--toggle' + (s.id === series ? ' is-on' : ''),
        type: 'button', 'aria-pressed': String(s.id === series)
      }, [txt(s.label)]);
      b.addEventListener('click', function () {
        series = s.id;
        PM.qsa('.chip--toggle', chips).forEach(function (x) {
          x.classList.remove('is-on');
          x.setAttribute('aria-pressed', 'false');
        });
        b.classList.add('is-on');
        b.setAttribute('aria-pressed', 'true');
        draw();
      });
      chips.appendChild(b);
    });

    var mealsInput = el('input', {
      type: 'number', id: 'finder-meals', min: '40', max: '15000', step: '10',
      placeholder: '300', inputmode: 'numeric', class: 'mono'
    });
    var answer = el('p', { class: 'finder-answer', 'aria-live': 'polite' });

    function matchMeals() {
      var n = parseInt(mealsInput.value, 10);
      if (!n || n < 1) {
        highlight = null;
        answer.textContent = '';
        draw();
        return;
      }
      var m = PM.recommendModel(n);
      highlight = m.model;
      series = '';
      PM.qsa('.chip--toggle', chips).forEach(function (x, i) {
        x.classList.toggle('is-on', i === 0);
        x.setAttribute('aria-pressed', String(i === 0));
      });
      draw();
      answer.textContent = '';
      answer.appendChild(txt(
        { en: 'At ' + group(n) + ' meals a day the table points to ', bm: 'Pada ' + group(n) + ' hidangan sehari, jadual menunjukkan ' },
        'span'
      ));
      answer.appendChild(el('b', { class: 'mono', text: m.model }));
      var row = PM.qs('[data-model="' + m.model + '"]', tbody);
      if (row) row.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    var form = el('form', { class: 'finder-form' }, [
      txt({ en: 'Meals served per day', bm: 'Hidangan sehari' }, 'label', { for: 'finder-meals' }),
      el('div', { class: 'finder-row' }, [
        mealsInput,
        el('button', { class: 'btn', type: 'submit' }, [txt({ en: 'Match', bm: 'Padan' })])
      ]),
      answer
    ]);
    form.addEventListener('submit', function (e) { e.preventDefault(); matchMeals(); });

    mount.appendChild(el('div', { class: 'wrap' }, [
      el('div', { class: 'finder-bar' }, [chips, form]),
      el('div', { class: 'table-scroll' }, [table]),
      el('p', { class: 'table-note small muted' }, [
        txt({
          en: 'Every figure is the manufacturer’s published specification. GTA03 is built to order, so it carries no fixed dimensions.',
          bm: 'Setiap angka ialah spesifikasi terbitan pengeluar. GTA03 dibina mengikut pesanan, jadi ia tiada dimensi tetap.'
        })
      ])
    ]));

    draw();

    var pre = parseInt(PM.param('meals'), 10);
    if (pre > 0) {
      mealsInput.value = String(pre);
      matchMeals();
    }
    PM.on('langchange', draw);
  };

  /* ================================================ 9. product detail */
  APP.pages.product = function () {
    var mount = PM.qs('[data-product]');
    if (!mount) return;

    var p = PM.product(PM.param('p'));
    var head = PM.qs('[data-cat-head]');

    if (!p) {
      if (head) {
        head.appendChild(el('div', { class: 'wrap' }, [breadcrumb([{ href: 'grease-traps.html', label: { en: 'Products', bm: 'Produk' } }])]));
      }
      mount.appendChild(el('div', { class: 'wrap' }, [
        el('div', { class: 'empty empty--page' }, [
          icon('ph-magnifying-glass'),
          txt(S.ui.notFound, 'b'),
          txt({
            en: 'That product link is out of date. The full range is one click away.',
            bm: 'Pautan produk itu sudah lapuk. Rangkaian penuh hanya satu klik sahaja.'
          }, 'p'),
          link('grease-traps.html', { en: 'Browse grease traps', bm: 'Lihat perangkap minyak' }, 'btn')
        ])
      ]));
      return;
    }

    doc.title = t(p.name) + ' | ' + S.brand.name;

    var catHref = p.cat === 'grease-trap' ? 'grease-traps.html'
      : p.cat === 'auto-dosing' ? 'auto-dosing.html'
      : p.cat === 'bio-enzyme' ? 'bio-enzyme.html' : 'others.html';
    var catName = (C.categories.filter(function (c) { return c.id === p.cat; })[0] || {}).name
      || { en: 'Products', bm: 'Produk' };

    if (head) {
      head.appendChild(el('div', { class: 'wrap' }, [
        breadcrumb([{ href: catHref, label: catName }, { href: '#', label: p.name }])
      ]));
    }

    /* ---- gallery */
    var main = el('img', { src: A(p.images[0]), alt: t(p.name), decoding: 'async' });
    var stage = el('figure', {
      class: 'gal-stage',
      'data-lightbox': A(p.images[0]),
      'data-lightbox-alt': t(p.name)
    }, [main]);

    var thumbs = el('div', { class: 'gal-thumbs' });
    p.images.forEach(function (src, i) {
      var b = el('button', {
        class: 'gal-thumb' + (i === 0 ? ' is-on' : ''), type: 'button',
        'aria-label': 'Image ' + (i + 1)
      }, [el('img', { src: A(src), alt: '', loading: 'lazy' })]);
      b.addEventListener('click', function () {
        main.src = A(src);
        stage.setAttribute('data-lightbox', A(src));
        PM.qsa('.gal-thumb', thumbs).forEach(function (x) { x.classList.remove('is-on'); });
        b.classList.add('is-on');
      });
      thumbs.appendChild(b);
    });

    /* ---- purchase panel */
    var m = modelRow(p);
    var badges = el('ul', { class: 'badge-list' });
    (p.badges || []).forEach(function (b) { badges.appendChild(txt(b, 'li')); });

    var quick = el('dl', { class: 'quick-specs' });
    function quickRow(label, value) {
      if (!value) return;
      quick.appendChild(txt(label, 'dt'));
      quick.appendChild(el('dd', { class: 'mono', text: value }));
    }
    quickRow(S.ui.flowRate, p.gpm ? p.gpm + ' GPM' : null);
    quickRow(S.ui.capacity, p.litres ? p.litres + ' L' : null);
    if (m) {
      quickRow(S.ui.dailyMeals, String(m.meals));
      quickRow(S.ui.pipeSize, m.pipe);
      quickRow(S.ui.dimensions, m.sizeMm);
    }

    var addBtn = el('button', { class: 'btn btn--lg', type: 'button', 'data-enq-add': p.slug }, [
      icon('ph-plus'), txt({ en: 'Add to enquiry list', bm: 'Tambah ke senarai pertanyaan' })
    ]);

    var panel = el('div', { class: 'buy' }, [
      p.model ? el('span', { class: 'buy-code mono', text: p.model }) : null,
      txt(p.name, 'h1'),
      txt(p.short, 'p', { class: 'buy-short' }),
      badges,
      quick,
      el('div', { class: 'buy-actions' }, [
        addBtn,
        el('a', { class: 'btn btn--wa btn--lg', href: PM.waProduct(p), target: '_blank', rel: 'noopener' },
          [icon('ph-whatsapp-logo'), txt(S.ui.requestPrice)])
      ]),
      el('p', { class: 'buy-note small muted' }, [
        txt({
          en: 'Price is quoted per enquiry, including delivery and installation for your state.',
          bm: 'Harga disebut mengikut pertanyaan, termasuk penghantaran dan pemasangan untuk negeri anda.'
        })
      ]),
      /* Three things a buyer checks before asking for a price. Without
         them the column runs empty beside a tall gallery. */
      el('ul', { class: 'assure' }, [
        el('li', {}, [icon('ph-seal-check'), el('div', {}, [
          txt({ en: 'Accepted for licensing', bm: 'Diterima untuk pelesenan' }, 'b'),
          txt({ en: 'SIRIM certified R018/15 and accepted by 15 local authorities.', bm: 'Diperakui SIRIM R018/15 dan diterima oleh 15 pihak berkuasa tempatan.' }, 'span')
        ])]),
        el('li', {}, [icon('ph-truck'), el('div', {}, [
          txt({ en: 'Delivered and installed', bm: 'Dihantar dan dipasang' }, 'b'),
          txt(S.contact.coverage, 'span')
        ])]),
        el('li', {}, [icon('ph-shield-check'), el('div', {}, [
          txt({ en: '5 + 3 year warranty', bm: 'Waranti 5 + 3 tahun' }, 'b'),
          txt({ en: 'Five year factory warranty with an exclusive three year on-site warranty.', bm: 'Waranti kilang lima tahun dengan waranti eksklusif tiga tahun di tapak.' }, 'span')
        ])])
      ])
    ]);

    /* ---- body */
    var body = el('div', { class: 'prod-body' });

    function section(titlePair, node) {
      body.appendChild(el('section', { class: 'prod-section' }, [txt(titlePair, 'h2'), node]));
    }

    var intro = el('div', { class: 'prose' });
    (t(p.intro) || []).forEach(function (para) { intro.appendChild(el('p', { text: para })); });
    section({ en: 'Overview', bm: 'Gambaran keseluruhan' }, intro);

    if (p.specs && p.specs.length) {
      var specTable = el('table', { class: 'spec-table spec-table--stacked' });
      var sb = el('tbody', {});
      p.specs.forEach(function (s) {
        sb.appendChild(el('tr', {}, [
          txt(s.k, 'th', { scope: 'row' }),
          el('td', { class: 'mono', text: t(s.v) })
        ]));
      });
      specTable.appendChild(sb);
      section(S.ui.specs, specTable);
    }

    if (p.bullets) {
      var ul = el('ul', { class: 'tick-list' });
      (t(p.bullets) || []).forEach(function (b) { ul.appendChild(el('li', { text: b })); });
      section(S.ui.whyChoose, ul);
    }

    if (p.warranty) {
      var wl = el('ul', { class: 'tick-list' });
      (t(p.warranty) || []).forEach(function (b) { wl.appendChild(el('li', { text: b })); });
      section(S.ui.warranty, wl);
    }

    mount.appendChild(el('div', { class: 'wrap' }, [
      el('div', { class: 'prod-top' }, [
        el('div', { class: 'gal' }, [stage, thumbs]),
        panel
      ]),
      body
    ]));

    /* ---- related */
    var rel = PM.related(p, 4);
    if (rel.length) {
      var relGrid = el('div', { class: 'cat-grid' });
      rel.forEach(function (r) {
        var c = productCard(r);
        c.removeAttribute('data-anim');
        relGrid.appendChild(c);
      });
      mount.appendChild(el('div', { class: 'section section--mint related-band' }, [
        el('div', { class: 'wrap' }, [
          sectionHead({ en: 'RELATED PRODUCTS', bm: 'PRODUK BERKAITAN' }),
          relGrid
        ])
      ]));
    }
  };

  /* ------------------------------------------------------------- exports */
  /* ====================================================================
     THE REST OF THE CATALOGUE
     Nineteen more pages, added when the concept grew from four pages to
     the full site. They are assembled from the parts below rather than
     each inventing markup, so the whole catalogue keeps one grammar.
     ==================================================================== */

  function main() { return PM.qs('#main'); }
  function put(node) { main().appendChild(node); return node; }

  /* A page section. Alternating mint grounds are what separate one block
     from the next on a page this dense. */
  function sec(opts) {
    opts = opts || {};
    var cls = 'section';
    if (opts.tone === 'mint') cls += ' section--mint';
    if (opts.tone === 'soft') cls += ' section--soft';
    if (opts.tight) cls += ' section--tight';
    var wrap = el('div', { class: 'wrap' });
    var node = el('section', { class: cls, id: opts.id || null }, [wrap]);
    if (opts.head) wrap.appendChild(sectionHead(opts.head, opts.sub, opts.align));
    node.wrap = wrap;
    return node;
  }

  function head(title, blurb, trail, count, countLabel) {
    put(breadcrumb(trail || []));
    put(pageBanner(title, blurb, count, countLabel));
  }

  function fmtDate(iso) {
    var d = new Date(iso + 'T00:00:00');
    if (isNaN(d)) return iso;
    return d.toLocaleDateString(PM.lang === 'bm' ? 'ms-MY' : 'en-GB',
      { day: 'numeric', month: 'short', year: 'numeric' });
  }

  /* Bilingual string arrays to a list, both languages carried on the node
     so the shared engine switches them without a redraw. */
  function pairList(pair, cls) {
    var ul = el('ul', { class: cls || null });
    ((pair && pair.en) || []).forEach(function (_, i) {
      ul.appendChild(el('li', {
        'data-en': pair.en[i],
        'data-bm': (pair.bm && pair.bm[i]) || pair.en[i],
        text: PM.lang === 'bm' && pair.bm ? pair.bm[i] : pair.en[i]
      }));
    });
    return ul;
  }

  function pairParas(pair, cls) {
    var box = el('div', { class: cls || null });
    ((pair && pair.en) || []).forEach(function (_, i) {
      box.appendChild(el('p', {
        'data-en': pair.en[i],
        'data-bm': (pair.bm && pair.bm[i]) || pair.en[i],
        text: PM.lang === 'bm' && pair.bm ? pair.bm[i] : pair.en[i]
      }));
    });
    return box;
  }

  /* ------------------------------------------------------- document set
     Certificates, council letters, award scans, lab reports. Nothing here
     crops: each one is a document that has to be read end to end. */
  function docSet(items, cols) {
    var grid = el('div', { class: 'doc-set', 'data-stagger': '50' });
    grid.style.setProperty('--cols', String(cols || 4));
    items.forEach(function (it) {
      var name = typeof it.name === 'string' ? it.name : t(it.name);
      grid.appendChild(el('figure', {
        class: 'doc-cell', 'data-anim': 'rise',
        'data-lightbox': A(it.img), 'data-lightbox-alt': name, 'data-lightbox-cap': name
      }, [
        frame(it.img, it.kind || 'cert', name),
        el('figcaption', {}, [
          typeof it.name === 'string' ? el('b', { text: it.name }) : txt(it.name, 'b'),
          it.note ? txt(it.note, 'span') : null,
          it.year ? el('span', { class: 'mono', text: it.year }) : null
        ])
      ]));
    });
    return grid;
  }

  /* ---------------------------------------------------------- record list */
  function recList(groups, cols) {
    var wrap = el('div', { class: 'rec-cols' });
    wrap.style.setProperty('--cols', String(cols || 2));
    groups.forEach(function (g) {
      var rows = el('div', { class: 'rec-rows' });
      (g.rows || []).forEach(function (r) {
        var kids = [
          typeof r.name === 'string' ? el('b', { text: r.name }) : txt(r.name, 'b'),
          r.note ? (typeof r.note === 'string' ? el('span', { text: r.note }) : txt(r.note, 'span')) : null,
          r.meta ? el('span', { class: 'mono', text: r.meta }) : null
        ];
        rows.appendChild(r.href
          ? el('a', { class: 'rec-row', href: PM.langHref(r.href), 'data-lang-href': r.href }, kids)
          : el('div', { class: 'rec-row' }, kids));
      });
      wrap.appendChild(el('div', { class: 'rec-block', 'data-anim': 'rise' }, [
        g.title ? (typeof g.title === 'string' ? el('h3', { text: g.title }) : txt(g.title, 'h3')) : null,
        g.note ? txt(g.note, 'p', { class: 'rec-note' }) : null,
        rows
      ]));
    });
    return wrap;
  }

  /* ------------------------------------------------------------- the FAQ */
  var faqSeq = 0;
  function faqList(items) {
    var box = el('div', { class: 'faq-list' });
    (items || S.faq).forEach(function (f, i) {
      var id = 'faq-' + (++faqSeq);
      var panel = el('div', { class: 'faq-a', id: id, hidden: i === 0 ? null : 'hidden' }, [txt(f.a, 'p')]);
      var btn = el('button', {
        class: 'faq-q', type: 'button',
        'aria-expanded': i === 0 ? 'true' : 'false', 'aria-controls': id
      }, [txt(f.q, 'span'), icon('ph-plus')]);
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        panel.hidden = open;
      });
      box.appendChild(el('div', {}, [btn, panel]));
    });
    return box;
  }

  /* ------------------------------------------------------------- prose */
  function proseBlock(blocks) {
    var box = el('div', { class: 'prose', 'data-anim': 'rise' });
    function draw() {
      box.textContent = '';
      (t(blocks) || []).forEach(function (b) {
        if (b[0] === 'h') box.appendChild(el('h2', { text: b[1] }));
        else if (b[0] === 'h3') box.appendChild(el('h3', { text: b[1] }));
        else if (b[0] === 'ul') {
          box.appendChild(el('ul', {}, (b[1] || []).map(function (li) {
            return el('li', { text: li });
          })));
        } else box.appendChild(el('p', { text: b[1] }));
      });
    }
    draw();
    PM.on('langchange', draw);
    return box;
  }

  /* ------------------------------------------------------- video shelf
     A facade. The poster is the channel's own still and the iframe is only
     built when someone presses play, so the page never pulls seven
     third-party frames just to show a grid of thumbnails. */
  function videoShelf(opts) {
    opts = opts || {};
    var all = opts.items || S.youtube;
    var current = all.filter(function (v) { return v.featured; })[0] || all[0];

    var screen = el('div', { class: 'vid-screen' });
    var title = el('h3');
    var note = el('p');
    var open = el('a', { class: 'btn btn--ghost btn--sm', target: '_blank', rel: 'noopener' }, [
      txt({ en: 'Open on YouTube', bm: 'Buka di YouTube' }), icon('ph-arrow-up-right')
    ]);

    function still(v) {
      return [
        el('img', { src: S.youtubeThumb(v.id), alt: t(v.title), loading: 'lazy' }),
        el('span', { class: 'vid-btn', 'aria-hidden': 'true' }, [icon('ph-play')]),
        v.duration ? el('span', { class: 'vid-time', text: v.duration }) : null
      ];
    }

    var items = [];
    var shelf = el('div', { class: 'vid-shelf', 'data-stagger': '50' });

    function play(v, live) {
      current = v;
      screen.textContent = '';
      title.setAttribute('data-en', v.title.en);
      title.setAttribute('data-bm', v.title.bm);
      title.textContent = t(v.title);
      var blurb = v.blurb || v.title;
      note.setAttribute('data-en', blurb.en);
      note.setAttribute('data-bm', blurb.bm);
      note.textContent = t(blurb);
      open.setAttribute('href', S.youtubeWatch(v.id));

      if (live) {
        screen.appendChild(el('iframe', {
          src: S.youtubeEmbed(v.id) + '&autoplay=1', title: t(v.title),
          allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
          referrerpolicy: 'strict-origin-when-cross-origin', allowfullscreen: 'allowfullscreen'
        }));
      } else {
        var hit = el('button', {
          class: 'vid-hit', type: 'button',
          'aria-label': (PM.lang === 'bm' ? 'Main: ' : 'Play: ') + t(v.title)
        }, still(v));
        hit.addEventListener('click', function () { play(v, true); });
        screen.appendChild(hit);
      }
      items.forEach(function (b) {
        b.setAttribute('aria-current', b.dataset.vid === v.id ? 'true' : 'false');
      });
    }

    function fill(list) {
      shelf.textContent = '';
      items = [];
      list.forEach(function (v) {
        var b = el('button', {
          class: 'vid-item', type: 'button', 'data-anim': 'rise',
          'aria-current': v.id === current.id ? 'true' : 'false'
        }, [
          el('div', { class: 'vid-screen' }, still(v)),
          txt(v.title, 'b')
        ]);
        b.dataset.vid = v.id;
        b.addEventListener('click', function () { play(v, true); screen.scrollIntoView({ block: 'center', behavior: 'smooth' }); });
        items.push(b);
        shelf.appendChild(b);
      });
      if (PM.motion) PM.motion.enhance(shelf);
    }

    var box = el('div', {}, [
      el('div', { class: 'vid-lead' }, [
        screen,
        el('div', { class: 'vid-note' }, [title, note, open])
      ])
    ]);

    if (opts.filters !== false && S.videoGroups) {
      var chips = el('div', { class: 'chip-row', role: 'group' });
      var buttons = S.videoGroups.map(function (g, i) {
        var b = el('button', {
          class: 'btn btn--sm ' + (i === 0 ? '' : 'btn--light'), type: 'button',
          'aria-pressed': String(i === 0),
          'data-en': g.label.en, 'data-bm': g.label.bm, text: t(g.label)
        });
        b.addEventListener('click', function () {
          buttons.forEach(function (x, n) {
            x.setAttribute('aria-pressed', String(n === i));
            x.className = 'btn btn--sm ' + (n === i ? '' : 'btn--light');
          });
          fill(g.id === 'all' ? all : all.filter(function (v) { return v.group === g.id; }));
        });
        chips.appendChild(b);
        return b;
      });
      box.appendChild(chips);
    }

    box.appendChild(shelf);
    fill(all);
    play(current, false);
    return box;
  }

  /* --------------------------------------------------- supplied banners */
  var AD_ITEMS = [
    { img: 'brand/banner-oil-interceptor.jpg', href: 'grease-traps.html',
      label: { en: 'See the oil interceptors', bm: 'Lihat pemintas minyak' },
      alt: { en: 'Oil Interceptor GTA9001: high separation efficiency, sturdy and corrosion resistant, low maintenance and easy to install, for petrol stations and car washes',
             bm: 'Pemintas Minyak GTA9001: kecekapan pemisahan tinggi, kukuh dan tahan karat, penyelenggaraan rendah dan mudah dipasang, untuk stesen minyak dan cucian kereta' } },
    { img: 'brand/banner-auto-dosing.jpg', href: 'auto-dosing.html',
      label: { en: 'See the ADU9291P', bm: 'Lihat ADU9291P' },
      alt: { en: 'ADU 9291P auto dosing unit: programmable dosing time, consistent dosing, IP66 waterproof, thunder strike protection, one year warranty',
             bm: 'Unit dos automatik ADU 9291P: masa dos boleh diprogram, dos konsisten, kalis air IP66, perlindungan panahan petir, waranti satu tahun' } }
  ];

  function adBand(items) {
    items = items || AD_ITEMS;
    var stage = el('div', { class: 'ad-stage' });
    var slides = items.map(function (it, i) {
      return el('a', {
        class: 'ad-slide', href: PM.langHref(it.href), 'data-lang-href': it.href,
        hidden: i === 0 ? null : 'hidden'
      }, [
        el('img', { src: A(it.img), alt: t(it.alt), loading: i === 0 ? null : 'lazy' }),
        el('span', { class: 'ad-go' }, [txt(it.label), icon('ph-arrow-right')])
      ]);
    });
    slides.forEach(function (n) { stage.appendChild(n); });

    var idx = 0, timer = null, dots = [];
    function stop() { if (timer) { root.clearInterval(timer); timer = null; } }
    function go(i) {
      idx = ((i % slides.length) + slides.length) % slides.length;
      slides.forEach(function (n, k) { n.hidden = k !== idx; });
      dots.forEach(function (d, k) { d.setAttribute('aria-current', k === idx ? 'true' : 'false'); });
    }

    var band = el('section', { class: 'section ad-band' }, [
      el('div', { class: 'wrap' }, [stage])
    ]);

    if (slides.length > 1) {
      var row = el('div', { class: 'ad-dots', role: 'tablist', 'aria-label': 'Banners' });
      slides.forEach(function (_, i) {
        var d = el('button', {
          class: 'ad-dot', type: 'button', role: 'tab', 'aria-label': 'Banner ' + (i + 1),
          'aria-current': i === 0 ? 'true' : 'false',
          onclick: function () { stop(); go(i); }
        });
        dots.push(d);
        row.appendChild(d);
      });
      band.querySelector('.wrap').appendChild(row);
      if (!(PM.motion && PM.motion.reduce)) {
        timer = root.setInterval(function () { go(idx + 1); }, 6500);
        band.addEventListener('mouseenter', stop);
        band.addEventListener('focusin', stop);
      }
    }
    return band;
  }

  /* ------------------------------------------------------- closing band */
  function closingCta(headPair, bodyPair) {
    return el('section', { class: 'cta-band' }, [
      el('div', { class: 'wrap' }, [
        el('div', { class: 'cta-in' }, [
          el('div', {}, [
            txt(headPair || { en: 'Tell us your kitchen and we will size it', bm: 'Beritahu kami dapur anda dan kami akan menyaiznya' }, 'h2'),
            txt(bodyPair || {
              en: 'Send a photo of the sink area or the drain layout on WhatsApp. We will come back with the model, the dimensions and a price.',
              bm: 'Hantar gambar kawasan sinki atau susun atur longkang melalui WhatsApp. Kami akan kembali dengan model, dimensi dan harga.'
            }, 'p')
          ]),
          el('div', { class: 'cta-actions' }, [
            waBtn('btn--lg'),
            link('contact.html', { en: 'Request a quote', bm: 'Minta sebut harga' }, 'btn btn--lg btn--light')
          ])
        ])
      ])
    ]);
  }

  /* ================================================= category pages */
  function categoryPage(id, copy) {
    var c = C.categories.filter(function (x) { return x.id === id; })[0];
    var all = PM.productsBy(id);

    head(c.name, c.blurb, [{ href: c.href, label: c.name }], all.length);

    if (copy.ad) put(adBand(copy.ad));

    var intro = sec({ head: copy.head, sub: copy.sub, align: 'left' });
    intro.wrap.appendChild(el('div', { class: 'duo' }, [
      pairParas(copy.body, 'prose'),
      el('div', { class: 'stat-row' }, (copy.stats || []).map(function (st) {
        return el('div', { class: 'stat' }, [
          el('b', { text: st.n }), txt(st.l, 'span')
        ]);
      }))
    ]));
    put(intro);

    var listing = sec({ tone: 'mint', head: copy.gridHead || { en: 'THE RANGE', bm: 'RANGKAIAN' } });
    var grid = el('div', { class: 'grid grid--4', 'data-stagger': '50' });
    function fill(items) {
      grid.textContent = '';
      items.forEach(function (p) { grid.appendChild(productCard(p)); });
      if (PM.frames) PM.frames(grid);
      if (PM.motion) PM.motion.enhance(grid);
    }
    if (c.subs && c.subs.length > 1) {
      var chips = el('div', { class: 'chip-row', role: 'group' });
      var defs = [{ id: '', label: { en: 'All', bm: 'Semua' } }].concat(c.subs.map(function (sub) {
        return { id: sub.id, label: sub.name };
      }));
      var btns = defs.map(function (d, i) {
        var b = el('button', {
          class: 'btn btn--sm ' + (i === 0 ? '' : 'btn--light'), type: 'button',
          'aria-pressed': String(i === 0),
          'data-en': d.label.en, 'data-bm': d.label.bm, text: t(d.label)
        });
        b.addEventListener('click', function () {
          btns.forEach(function (x, n) {
            x.setAttribute('aria-pressed', String(n === i));
            x.className = 'btn btn--sm ' + (n === i ? '' : 'btn--light');
          });
          fill(d.id ? PM.productsBy(id, d.id) : all);
        });
        chips.appendChild(b);
        return b;
      });
      listing.wrap.appendChild(chips);
    }
    listing.wrap.appendChild(grid);
    fill(all);
    put(listing);

    if (copy.after) copy.after();
    put(closingCta());
  }

  APP.pages.autoDosing = function () {
    categoryPage('auto-dosing', {
      ad: [AD_ITEMS[1]],
      head: { en: 'DOSED EVERY NIGHT', bm: 'DIDOS SETIAP MALAM' },
      sub: { en: 'The enzyme only works if it actually goes in, on the night it is needed.',
             bm: 'Enzim hanya berkesan jika ia benar-benar dimasukkan, pada malam yang diperlukan.' },
      body: {
        en: ['A bio-enzyme dose is a nightly job that nobody in a busy kitchen remembers on the night it matters. The Auto Dosing Unit does it on a 24-hour timer instead, at the hour the kitchen is closed and the enzyme has the contact time it needs.',
             'The ADU9291P holds eight AA cells behind the panel as well as the mains supply, so a thunderstorm power cut does not cost you a night of dosing. Voltage drop compensation keeps the pump output steady, and the flow is calibrated to the model of trap it is feeding.'],
        bm: ['Dos bio-enzim adalah tugas malam yang tiada siapa dalam dapur sibuk ingat pada malam yang penting. Unit Dos Automatik melakukannya pada pemasa 24 jam, pada waktu dapur ditutup dan enzim mempunyai masa sentuhan yang diperlukan.',
             'ADU9291P menyimpan lapan sel AA di belakang panel serta bekalan sesalur, jadi gangguan kuasa akibat ribut petir tidak merugikan anda satu malam dos. Pampasan kejatuhan voltan mengekalkan output pam yang stabil, dan aliran ditentukur mengikut model perangkap yang disuapnya.']
      },
      stats: [
        { n: '24h', l: { en: 'programmable timer', bm: 'pemasa boleh diprogram' } },
        { n: '8', l: { en: 'AA cell backup', bm: 'sandaran sel AA' } },
        { n: 'IP66', l: { en: 'waterproof and dustproof', bm: 'kalis air dan habuk' } },
        { n: '7.5W', l: { en: 'power consumption', bm: 'penggunaan kuasa' } }
      ],
      after: function () {
        var v = sec({
          head: { en: 'WATCH IT RUN', bm: 'TONTON IA BEROPERASI' },
          sub: { en: 'The unit in operation, and the installation it goes with.',
                 bm: 'Unit semasa beroperasi, dan pemasangan yang mengiringinya.' }
        });
        v.wrap.appendChild(videoShelf({
          filters: false,
          items: S.youtube.filter(function (x) { return x.group === 'product' || x.group === 'install'; })
        }));
        put(v);
      }
    });
  };

  APP.pages.bioEnzyme = function () {
    categoryPage('bio-enzyme', {
      head: { en: 'A CULTURE, NOT A DETERGENT', bm: 'KULTUR, BUKAN PENCUCI' },
      sub: { en: 'A detergent moves the problem down the pipe. This one digests it where it sits.',
             bm: 'Bahan pencuci memindahkan masalah ke hilir paip. Ini menghadamnya di tempatnya.' },
      body: {
        en: ['A detergent emulsifies grease so it passes the trap and sets again in the pipe downstream. GoodBac does the opposite: the culture digests fats, oils and grease inside the chamber, and what leaves is carbon dioxide and water.',
             'Dose is set by the volume of the trap, not by the size of the kitchen. The table below is the manufacturer’s published figure for every model, and it is what the Auto Dosing Unit is calibrated against.'],
        bm: ['Bahan pencuci mengemulsi gris supaya ia melepasi perangkap dan mengeras semula dalam paip di hilir. GoodBac melakukan sebaliknya: kultur itu menghadam lemak, minyak dan gris di dalam ruang, dan apa yang keluar ialah karbon dioksida dan air.',
             'Dos ditetapkan mengikut isi padu perangkap, bukan saiz dapur. Jadual di bawah ialah angka terbitan pengeluar bagi setiap model, dan itulah yang ditentukur pada Unit Dos Automatik.']
      },
      stats: [
        { n: '16', l: { en: 'models in the dosing table', bm: 'model dalam jadual dos' } },
        { n: '500ml', l: { en: 'smallest pack', bm: 'pek terkecil' } },
        { n: '5L', l: { en: 'standard pack', bm: 'pek standard' } }
      ],
      after: function () {
        var d = sec({
          tone: 'mint',
          head: { en: 'PUBLISHED DOSING', bm: 'DOS TERBITAN' },
          sub: { en: 'Millilitres a night by grease trap model, straight from the manufacturer’s table.',
                 bm: 'Mililiter semalam mengikut model perangkap minyak, terus dari jadual pengeluar.' }
        });
        var table = el('table', { class: 'spec-table' });
        var hr = el('tr');
        [{ en: 'Model', bm: 'Model' }, { en: 'Trap volume', bm: 'Isi padu perangkap' },
         { en: 'Nightly dose', bm: 'Dos malam' }, { en: 'Per month', bm: 'Sebulan' }].forEach(function (h) {
          hr.appendChild(txt(h, 'th', { scope: 'col' }));
        });
        table.appendChild(el('thead', {}, [hr]));
        var tb = el('tbody');
        C.dosing.forEach(function (row) {
          tb.appendChild(el('tr', {}, [
            el('th', { scope: 'row', class: 'mono', text: row.model }),
            el('td', { class: 'mono', text: row.trap + ' L' }),
            el('td', { class: 'mono', text: row.daily + ' ml' }),
            el('td', { class: 'mono', text: row.monthly + ' L' })
          ]));
        });
        table.appendChild(tb);
        d.wrap.appendChild(el('div', { class: 'table-scroll', 'data-anim': 'rise' }, [table]));
        put(d);
      }
    });
  };

  APP.pages.others = function () {
    categoryPage('others', {
      head: { en: 'AROUND THE TRAP', bm: 'DI SEKITAR PERANGKAP' },
      sub: { en: 'The parts that keep the system honest between services.',
             bm: 'Bahagian yang memastikan sistem berfungsi jujur antara servis.' },
      body: {
        en: ['A lockable cabinet so the dosing unit is not switched off by the night crew. A hanging panel where there is no wall to fix to. A bio brick for a chamber that cannot take a pump. A leak sensor that tells you about a failure before the floor does.'],
        bm: ['Kabinet berkunci supaya unit dos tidak dimatikan oleh kru malam. Panel gantung di tempat yang tiada dinding untuk dipasang. Bio brick untuk ruang yang tidak boleh menerima pam. Penderia bocor yang memberitahu anda tentang kegagalan sebelum lantai memberitahunya.']
      },
      stats: [
        { n: '4', l: { en: 'accessory lines', bm: 'barisan aksesori' } },
        { n: '1', l: { en: 'leak sensor system', bm: 'sistem penderia bocor' } }
      ]
    });
  };

  /* ================================================== services listing */
  APP.pages.services = function () {
    head({ en: 'Services', bm: 'Perkhidmatan' },
      { en: 'Cleaning, pumping, jetting and waste removal across Peninsular Malaysia.',
        bm: 'Pembersihan, pengepaman, jetting dan pembuangan sisa di seluruh Semenanjung Malaysia.' },
      [{ href: 'services.html', label: { en: 'Services', bm: 'Perkhidmatan' } }],
      C.services.length, { en: 'service lines', bm: 'barisan servis' });

    var intro = sec({
      head: { en: 'THE TRAP IS HALF THE JOB', bm: 'PERANGKAP HANYA SEPARUH KERJA' },
      sub: { en: 'A trap that is never pumped stops separating and starts smelling. Crews in Perak, Selangor, Penang, Melaka and Johor handle the other half.',
             bm: 'Perangkap yang tidak pernah dipam berhenti memisahkan dan mula berbau. Kru di Perak, Selangor, Pulau Pinang, Melaka dan Johor mengendalikan separuh lagi.' },
      align: 'left'
    });
    put(intro);

    C.services.forEach(function (sv, i) {
      var band = sec({ tone: i % 2 ? 'mint' : null, id: sv.slug });
      band.wrap.appendChild(el('div', { class: 'duo' }, [
        el('div', {}, [
          txt(sv.name, 'h2'),
          txt(sv.short, 'p', { class: 'muted' }),
          pairParas(sv.intro, 'prose'),
          pairList(sv.benefits, 'prose-list'),
          link('service.html?s=' + sv.slug, S.ui.viewDetails, 'btn btn--ghost')
        ]),
        frame(sv.img, PM.frameFor ? PM.frameFor(sv.img) : 'service', t(sv.name))
      ]));
      put(band);
    });

    var v = sec({
      head: { en: 'THE CREWS AT WORK', bm: 'KRU SEDANG BEKERJA' },
      sub: { en: 'Filmed on live sites, not staged.', bm: 'Dirakam di tapak sebenar, bukan lakonan.' }
    });
    v.wrap.appendChild(videoShelf({
      filters: false,
      items: S.youtube.filter(function (x) { return x.group === 'service'; })
    }));
    put(v);

    put(closingCta(
      { en: 'Put your trap on a service schedule', bm: 'Masukkan perangkap anda dalam jadual servis' },
      { en: 'Tell us the model and the site, and we will set the interval against its capacity.',
        bm: 'Beritahu kami model dan tapak, dan kami akan menetapkan selang mengikut kapasitinya.' }
    ));
  };

  /* ------------------------------------------------------ service detail */
  APP.pages.service = function () {
    var sv = PM.service(PM.param('s') || '');
    if (!sv) {
      head(S.ui.notFound, { en: 'That service is not on the list.', bm: 'Perkhidmatan itu tiada dalam senarai.' },
        [{ href: 'services.html', label: { en: 'Services', bm: 'Perkhidmatan' } }]);
      return APP.pages.services();
    }

    head(sv.name, sv.short, [
      { href: 'services.html', label: { en: 'Services', bm: 'Perkhidmatan' } },
      { href: 'service.html?s=' + sv.slug, label: sv.name }
    ]);

    var top = sec({});
    top.wrap.appendChild(el('div', { class: 'duo' }, [
      pairParas(sv.intro, 'prose'),
      frame(sv.img, PM.frameFor ? PM.frameFor(sv.img) : 'service', t(sv.name))
    ]));
    put(top);

    var detail = sec({
      tone: 'mint',
      head: { en: 'WHAT YOU GET', bm: 'APA YANG ANDA DAPAT' }
    });
    detail.wrap.appendChild(el('div', { class: 'duo duo--even' }, [
      el('div', { class: 'prose' }, [
        txt({ en: 'Included in the visit', bm: 'Termasuk dalam lawatan' }, 'h3'),
        pairList(sv.benefits)
      ]),
      el('div', { class: 'prose' }, [
        txt({ en: 'Why us for this', bm: 'Mengapa kami untuk ini' }, 'h3'),
        pairList(sv.why)
      ])
    ]));
    put(detail);

    if (sv.images && sv.images.length > 1) {
      var gal = sec({ head: { en: 'ON SITE', bm: 'DI TAPAK' } });
      gal.wrap.appendChild(docSet(sv.images.map(function (src, i) {
        return { img: src, name: t(sv.name) + ' ' + (i + 1), kind: PM.frameFor ? PM.frameFor(src) : 'photo' };
      }), 3));
      put(gal);
    }

    var others = C.services.filter(function (x) { return x.slug !== sv.slug; });
    var rel = sec({ tone: 'mint', head: { en: 'OTHER SERVICES', bm: 'PERKHIDMATAN LAIN' } });
    rel.wrap.appendChild(recList([{
      rows: others.map(function (x) {
        return { name: x.name, note: x.short, href: 'service.html?s=' + x.slug };
      })
    }], 1));
    put(rel);

    put(closingCta({ en: 'Book this service', bm: 'Tempah perkhidmatan ini' }, sv.short));
  };

  /* ---------------------------------------------------------- approvals */
  APP.pages.approvals = function () {
    head({ en: 'Authority Approval', bm: 'Kelulusan Pihak Berkuasa' },
      { en: 'SIRIM product certification R018/15, and fifteen local authorities that list our grease traps.',
        bm: 'Pensijilan produk SIRIM R018/15, dan lima belas pihak berkuasa tempatan yang menyenaraikan perangkap minyak kami.' },
      [{ href: 'approvals.html', label: { en: 'Authority Approval', bm: 'Kelulusan Pihak Berkuasa' } }]);

    var why = sec({
      head: { en: 'WHY IT MATTERS', bm: 'MENGAPA IA PENTING' },
      sub: { en: 'A licensing officer does not test your trap. They check whether the model is on the approved list and whether the certificate matches the unit in front of them.',
             bm: 'Pegawai pelesenan tidak menguji perangkap anda. Mereka menyemak sama ada model itu ada dalam senarai yang diluluskan dan sama ada sijil itu sepadan dengan unit di hadapan mereka.' }
    });
    put(why);

    var certs = sec({ tone: 'mint', head: { en: 'PRODUCT CERTIFICATION', bm: 'PENSIJILAN PRODUK' } });
    certs.wrap.appendChild(docSet(S.certs, 4));
    put(certs);

    var councils = sec({
      head: { en: 'LOCAL AUTHORITIES', bm: 'PIHAK BERKUASA TEMPATAN' },
      sub: { en: 'Councils that list our traps on their approved equipment schedules.',
             bm: 'Majlis yang menyenaraikan perangkap kami dalam jadual peralatan yang diluluskan.' }
    });
    councils.wrap.appendChild(docSet(S.approvals.map(function (a) {
      return { img: a.img, name: a.name, kind: 'crest' };
    }), 5));
    councils.wrap.appendChild(el('div', { style: 'margin-top:1.5rem' }, [
      recList([{
        title: { en: 'And also on record', bm: 'Dan juga dalam rekod' },
        rows: S.approvalsExtra.map(function (n) { return { name: n }; })
      }], 1)
    ]));
    put(councils);

    var faq = sec({ tone: 'mint', head: { en: 'WHAT OFFICERS ASK', bm: 'APA YANG PEGAWAI TANYA' } });
    faq.wrap.appendChild(faqList(S.faq.slice(1, 6)));
    put(faq);

    put(closingCta());
  };

  /* -------------------------------------------------------------- awards */
  APP.pages.awards = function () {
    head({ en: 'Awards & Certificates', bm: 'Anugerah & Sijil' },
      { en: 'Council endorsements, training certificates and contractor registrations collected since 2008.',
        bm: 'Sokongan majlis, sijil latihan dan pendaftaran kontraktor dikumpul sejak 2008.' },
      [{ href: 'awards.html', label: { en: 'Awards & Certificates', bm: 'Anugerah & Sijil' } }],
      S.awards.length, { en: 'certificates', bm: 'sijil' });

    var g = sec({
      head: { en: 'THE RECORD', bm: 'REKOD' },
      sub: { en: 'Each one is a scan of the original. Press any to read it full size.',
             bm: 'Setiap satu adalah imbasan asal. Tekan mana-mana untuk membacanya bersaiz penuh.' }
    });
    g.wrap.appendChild(docSet(S.awards.map(function (a) {
      return { img: a.img, name: a.title, year: a.year };
    }), 3));
    put(g);
    put(closingCta());
  };

  /* ----------------------------------------------------------- lab test */
  APP.pages.labTest = function () {
    head({ en: 'Lab Test Results', bm: 'Keputusan Ujian Makmal' },
      { en: 'Wastewater sampled at the inlet and again at the outlet, analysed by a SAMM accredited laboratory.',
        bm: 'Air sisa disampel di salur masuk dan sekali lagi di salur keluar, dianalisis oleh makmal terakreditasi SAMM.' },
      [{ href: 'lab-test.html', label: { en: 'Lab Test Results', bm: 'Keputusan Ujian Makmal' } }]);

    var m = sec({
      head: { en: 'SAMPLED ON A WORKING KITCHEN', bm: 'DISAMPEL DI DAPUR BEROPERASI' },
      sub: { en: 'Testing a rig on a bench proves the geometry works. Testing a kitchen proves the product does.',
             bm: 'Menguji pelantar membuktikan geometri berfungsi. Menguji dapur membuktikan produknya berfungsi.' }
    });
    put(m);

    S.labTests.forEach(function (test, i) {
      var band = sec({ tone: i % 2 ? 'mint' : null, tight: true });
      band.wrap.appendChild(el('div', { class: 'duo' }, [
        el('div', { class: 'prose' }, [txt(test.title, 'h2'), txt(test.body, 'p')]),
        el('figure', {
          class: 'doc-cell', 'data-anim': 'rise',
          'data-lightbox': A(test.img), 'data-lightbox-alt': t(test.title), 'data-lightbox-cap': t(test.title)
        }, [frame(test.img, 'report', t(test.title))])
      ]));
      put(band);
    });

    put(closingCta());
  };

  /* -------------------------------------------------- installation guide */
  APP.pages.installationGuide = function () {
    head({ en: 'Installation Guide', bm: 'Panduan Pemasangan' },
      { en: 'Three steps, and an undersink model is normally commissioned inside an afternoon.',
        bm: 'Tiga langkah, dan model bawah sinki biasanya ditauliahkan dalam satu petang.' },
      [{ href: 'installation-guide.html', label: { en: 'Installation Guide', bm: 'Panduan Pemasangan' } }]);

    var steps = sec({ head: { en: 'POSITION, CONNECT, COMMISSION', bm: 'LETAK, SAMBUNG, TAULIAH' } });
    var list = el('div', { class: 'step-list' });
    S.installSteps.forEach(function (st, i) {
      list.appendChild(el('div', { class: 'step', 'data-anim': 'rise' }, [
        el('span', { class: 'step-n', text: '0' + (i + 1) }),
        el('div', {}, [txt(st.title, 'h3'), txt(st.body, 'p')]),
        el('figure', {
          class: 'step-art', 'data-lightbox': A(st.img),
          'data-lightbox-alt': t(st.title), 'data-lightbox-cap': t(st.title), style: 'margin:0'
        }, [frame(st.img, 'crest', t(st.title))])
      ]));
    });
    steps.wrap.appendChild(list);
    put(steps);

    var warn = sec({ tone: 'mint', tight: true });
    warn.wrap.appendChild(el('div', { class: 'prose', 'data-anim': 'rise' }, [
      txt({ en: 'Fill the trap with clean water before first use', bm: 'Isi perangkap dengan air bersih sebelum penggunaan pertama' }, 'h2'),
      txt({ en: 'A dry trap separates nothing on its first service. Fill to the working level, run the sink for two minutes, then check every joint before you hand over.',
            bm: 'Perangkap kering tidak memisahkan apa-apa pada servis pertamanya. Isi hingga paras operasi, jalankan sinki selama dua minit, kemudian periksa setiap sambungan sebelum penyerahan.' }, 'p')
    ]));
    put(warn);

    var v = sec({ head: { en: 'THE SAME STEPS, FILMED', bm: 'LANGKAH YANG SAMA, DIRAKAM' } });
    v.wrap.appendChild(videoShelf({
      filters: false,
      items: S.youtube.filter(function (x) { return x.group === 'install' || x.group === 'factory'; })
    }));
    put(v);

    var faq = sec({ tone: 'mint', head: { en: 'ASKED DURING INSTALLATION', bm: 'DITANYA SEMASA PEMASANGAN' } });
    faq.wrap.appendChild(faqList(S.faq.slice(4, 9)));
    put(faq);

    put(closingCta());
  };

  /* --------------------------------------------------------------- about */
  APP.pages.about = function () {
    head({ en: 'Company Profile', bm: 'Profil Syarikat' },
      { en: 'Kualiti Alam Hijau (M) Sdn Bhd has manufactured grease traps in Malaysia since 1996.',
        bm: 'Kualiti Alam Hijau (M) Sdn Bhd telah mengeluarkan perangkap minyak di Malaysia sejak 1996.' },
      [{ href: 'about.html', label: { en: 'Company Profile', bm: 'Profil Syarikat' } }]);

    var one = sec({ head: { en: 'ONE STOP MANUFACTURER', bm: 'PENGELUAR SEHENTI' }, align: 'left' });
    one.wrap.appendChild(el('div', { class: 'duo' }, [
      el('div', { class: 'prose' }, [
        txt({ en: 'The group was incorporated in 1996 with the intention of being a one stop manufacturer: product development and research, mould design and moulding, then manufacturing, packaging and delivery.',
              bm: 'Kumpulan ini diperbadankan pada 1996 dengan hasrat menjadi pengeluar sehenti: pembangunan produk dan penyelidikan, reka bentuk acuan dan pengacuan, kemudian pembuatan, pembungkusan dan penghantaran.' }, 'p'),
        txt({ en: 'Because the tooling, the fabrication and the enzyme are all ours, the trap, the dosing unit and the consumable are specified to work together rather than assembled from three suppliers.',
              bm: 'Kerana peralatan, fabrikasi dan enzim semuanya milik kami, perangkap, unit dos dan bahan guna habis ditetapkan untuk berfungsi bersama, bukan digabungkan daripada tiga pembekal.' }, 'p'),
        txt({ en: 'Who we serve', bm: 'Siapa yang kami layan' }, 'h2'),
        txt({ en: 'Food courts, restaurants, hotels, central kitchens, food processing plants, automotive service centres and petrol stations that need grease and FOG containment compliant with local authority and Department of Environment requirements.',
              bm: 'Medan selera, restoran, hotel, dapur berpusat, kilang pemprosesan makanan, pusat servis automotif dan stesen minyak yang memerlukan pengurungan gris dan FOG yang mematuhi keperluan pihak berkuasa tempatan dan Jabatan Alam Sekitar.' }, 'p')
      ]),
      frame('news/factory.webp', 'photo', 'Fabrication on the factory floor')
    ]));
    put(one);

    var facts = sec({ tone: 'mint', head: { en: 'BY THE NUMBERS', bm: 'DALAM ANGKA' } });
    facts.wrap.appendChild(el('div', { class: 'stat-row' }, [
      { n: '1996', l: { en: 'manufacturing since', bm: 'mengeluar sejak' } },
      { n: '2', l: { en: 'factories', bm: 'kilang' } },
      { n: '17', l: { en: 'grease trap models', bm: 'model perangkap minyak' } },
      { n: '15', l: { en: 'local authorities', bm: 'pihak berkuasa tempatan' } },
      { n: '5+3', l: { en: 'year warranty', bm: 'tahun waranti' } }
    ].map(function (st) {
      return el('div', { class: 'stat' }, [el('b', { text: st.n }), txt(st.l, 'span')]);
    })));
    put(facts);

    var places = sec({ head: { en: 'WHERE WE ARE', bm: 'DI MANA KAMI BERADA' } });
    places.wrap.appendChild(recList([{
      title: S.contact.hq.label,
      rows: [{ name: S.contact.hq.lines.join(', ') }]
    }].concat(S.contact.factories.map(function (f) {
      return { title: f.label, rows: [{ name: f.lines.join(', ') }] };
    })), 2));
    put(places);

    var v = sec({ tone: 'mint', head: { en: 'THE COMPANY ON FILM', bm: 'SYARIKAT DALAM FILEM' } });
    v.wrap.appendChild(videoShelf({
      filters: false,
      items: S.youtube.filter(function (x) { return x.group === 'company' || x.group === 'factory'; })
    }));
    put(v);

    put(closingCta());
  };

  /* ------------------------------------------------------ project gallery */
  APP.pages.projectGallery = function () {
    head({ en: 'Project Gallery', bm: 'Galeri Projek' },
      { en: 'Eighteen record sheets from the company archive, each carrying the site name printed into the picture.',
        bm: 'Lapan belas helaian rekod dari arkib syarikat, setiap satu membawa nama tapak yang dicetak dalam gambar.' },
      [{ href: 'project-gallery.html', label: { en: 'Project Gallery', bm: 'Galeri Projek' } }],
      S.gallery.length, { en: 'record sheets', bm: 'helaian rekod' });

    var g = sec({ head: { en: 'THE ARCHIVE', bm: 'ARKIB' } });
    g.wrap.appendChild(docSet(S.gallery.map(function (x, i) {
      return {
        img: x.img, kind: 'sheet',
        name: (PM.lang === 'bm' ? 'Rekod pemasangan ' : 'Installation record ') + String(i + 1).padStart(2, '0')
      };
    }), 4));
    put(g);

    var c = sec({ tone: 'mint', head: { en: 'NAMED SITES', bm: 'TAPAK BERNAMA' } });
    c.wrap.appendChild(recList([
      { title: { en: 'Industry and infrastructure', bm: 'Industri dan infrastruktur' },
        rows: S.clients.slice(0, 9).map(function (x) { return { name: x.name, meta: x.place }; }) },
      { title: { en: 'Schools, camps and food premises', bm: 'Sekolah, kem dan premis makanan' },
        rows: S.clients.slice(9).map(function (x) { return { name: x.name, meta: x.place }; }) }
    ], 2));
    put(c);

    put(closingCta());
  };

  /* -------------------------------------------------------------- videos */
  APP.pages.videos = function () {
    head({ en: 'Video Library', bm: 'Pustaka Video' },
      { en: 'Seven films from our own channel: the factory floor, an installation in Malay, the automatic unit running, and the service crews at work.',
        bm: 'Tujuh filem dari saluran kami sendiri: lantai kilang, pemasangan dalam bahasa Melayu, unit automatik beroperasi, dan kru servis bekerja.' },
      [{ href: 'videos.html', label: { en: 'Video Library', bm: 'Pustaka Video' } }],
      S.youtube.length, { en: 'films', bm: 'filem' });

    var v = sec({ head: { en: 'FROM THE CHANNEL', bm: 'DARI SALURAN' } });
    v.wrap.appendChild(videoShelf({}));
    put(v);

    var read = sec({ tone: 'mint', head: { en: 'THE WRITTEN VERSIONS', bm: 'VERSI BERTULIS' } });
    read.wrap.appendChild(recList([{
      rows: [
        { name: { en: 'Installation Guide', bm: 'Panduan Pemasangan' },
          note: { en: 'The same three steps, in writing', bm: 'Tiga langkah yang sama, secara bertulis' },
          href: 'installation-guide.html' },
        { name: { en: 'Services', bm: 'Perkhidmatan' },
          note: { en: 'What the crews carry out', bm: 'Apa yang kru laksanakan' }, href: 'services.html' },
        { name: { en: 'Company Profile', bm: 'Profil Syarikat' },
          note: { en: 'Two factories, one service fleet', bm: 'Dua kilang, satu armada servis' }, href: 'about.html' }
      ]
    }], 1));
    put(read);

    put(closingCta());
  };

  /* ----------------------------------------------------------- downloads */
  APP.pages.downloads = function () {
    head({ en: 'Brochures & Downloads', bm: 'Brosur & Muat Turun' },
      { en: 'The model catalogue, the manuals, the dosing chart and the SIRIM certificate, in one place.',
        bm: 'Katalog model, manual, carta dos dan sijil SIRIM, di satu tempat.' },
      [{ href: 'downloads.html', label: { en: 'Brochures & Downloads', bm: 'Brosur & Muat Turun' } }],
      S.downloads.length, { en: 'documents', bm: 'dokumen' });

    var d = sec({
      head: { en: 'THE SHELF', bm: 'RAK' },
      sub: { en: 'This is a design concept, so the files are listed rather than served. Ask on WhatsApp and the sales desk sends the current version.',
             bm: 'Ini adalah konsep reka bentuk, jadi fail disenaraikan dan bukan dihidangkan. Tanya di WhatsApp dan meja jualan akan menghantar versi semasa.' }
    });
    d.wrap.appendChild(recList([
      { title: { en: 'Product literature', bm: 'Bahan produk' },
        rows: S.downloads.slice(0, 3).map(function (x) { return { name: x.name, meta: x.meta }; }) },
      { title: { en: 'Compliance and reference', bm: 'Pematuhan dan rujukan' },
        rows: S.downloads.slice(3).map(function (x) { return { name: x.name, meta: x.meta }; }) }
    ], 2));
    put(d);

    put(adBand());
    put(closingCta());
  };

  /* ---------------------------------------------------------------- news */
  APP.pages.news = function () {
    head({ en: 'News', bm: 'Berita' },
      { en: 'Technical notes from the workshop on certification, chamber design and service intervals.',
        bm: 'Nota teknikal dari bengkel tentang pensijilan, reka bentuk ruang dan selang servis.' },
      [{ href: 'news.html', label: { en: 'News', bm: 'Berita' } }],
      S.news.length, { en: 'notes', bm: 'nota' });

    var g = sec({ head: { en: 'TECHNICAL NOTES', bm: 'NOTA TEKNIKAL' } });
    var grid = el('div', { class: 'grid grid--3', 'data-stagger': '60' });
    S.news.forEach(function (n) { grid.appendChild(newsCard(n)); });
    g.wrap.appendChild(grid);
    put(g);

    var faq = sec({ tone: 'mint', head: { en: 'ASKED EVERY WEEK', bm: 'DITANYA SETIAP MINGGU' } });
    faq.wrap.appendChild(faqList());
    put(faq);

    put(closingCta());
  };

  /* ------------------------------------------------------------- article */
  APP.pages.article = function () {
    var a = PM.article(PM.param('a') || '');
    if (!a) {
      head(S.ui.notFound, { en: 'That article is not in the archive.', bm: 'Artikel itu tiada dalam arkib.' },
        [{ href: 'news.html', label: { en: 'News', bm: 'Berita' } }]);
      return APP.pages.news();
    }

    head(a.title, a.excerpt, [
      { href: 'news.html', label: { en: 'News', bm: 'Berita' } },
      { href: 'article.html?a=' + a.slug, label: a.title }
    ]);

    var body = sec({});
    body.wrap.appendChild(el('div', { class: 'duo' }, [
      el('div', {}, [
        el('time', { class: 'mono news-date', datetime: a.date, text: fmtDate(a.date) }),
        proseBlock(a.body)
      ]),
      frame(a.img, PM.frameFor ? PM.frameFor(a.img) : 'photo', t(a.title))
    ]));
    put(body);

    var others = S.news.filter(function (x) { return x.slug !== a.slug; });
    if (others.length) {
      var more = sec({ tone: 'mint', head: { en: 'READ NEXT', bm: 'BACA SETERUSNYA' } });
      var grid = el('div', { class: 'grid grid--3', 'data-stagger': '60' });
      others.forEach(function (n) { grid.appendChild(newsCard(n)); });
      more.wrap.appendChild(grid);
      put(more);
    }

    put(closingCta());
  };

  /* ------------------------------------------------------------- careers */
  APP.pages.careers = function () {
    head({ en: 'Careers & Dealership', bm: 'Kerjaya & Pengedar' },
      { en: 'One appointed dealer per state, and open roles on the fabrication floor and the service fleet.',
        bm: 'Satu pengedar dilantik bagi setiap negeri, dan jawatan kosong di lantai fabrikasi dan armada servis.' },
      [{ href: 'careers.html', label: { en: 'Careers & Dealership', bm: 'Kerjaya & Pengedar' } }]);

    S.dealership.forEach(function (d, i) {
      var band = sec({ tone: i % 2 ? 'mint' : null });
      band.wrap.appendChild(el('div', { class: 'duo duo--even' }, [
        el('div', { class: 'prose' }, [
          txt(d.title, 'h2'),
          txt({ en: 'What we look for', bm: 'Apa yang kami cari' }, 'h3'),
          pairList(d.qualify)
        ]),
        el('div', { class: 'prose' }, [
          txt({ en: 'What you get', bm: 'Apa yang anda dapat' }, 'h3'),
          pairList(d.benefit)
        ])
      ]));
      put(band);
    });

    var open = sec({ head: { en: 'DEALERSHIPS STILL UNAPPOINTED', bm: 'PENGEDAR MASIH BELUM DILANTIK' } });
    open.wrap.appendChild(recList([{
      rows: S.dealerVacancies.map(function (v) {
        return { name: v, note: { en: 'Accepting applications', bm: 'Menerima permohonan' } };
      })
    }], 1));
    put(open);

    var jobs = sec({ tone: 'mint', head: { en: 'OPEN ROLES', bm: 'JAWATAN KOSONG' } });
    jobs.wrap.appendChild(recList(S.jobs.map(function (j) {
      return {
        title: j.role, note: { en: j.location, bm: j.location },
        rows: ((j.requirements && j.requirements.en) || []).map(function (_, i) {
          return { name: { en: j.requirements.en[i], bm: (j.requirements.bm && j.requirements.bm[i]) || j.requirements.en[i] } };
        })
      };
    }), 3));
    put(jobs);

    put(closingCta(
      { en: 'Send us your details', bm: 'Hantar butiran anda' },
      { en: 'Tell us the state you cover, or the role you are applying for. We reply within one business day.',
        bm: 'Beritahu kami negeri yang anda liputi, atau jawatan yang anda pohon. Kami membalas dalam satu hari bekerja.' }
    ));
  };

  /* -------------------------------------------------------- where to buy */
  APP.pages.whereToBuy = function () {
    head({ en: 'Where To Buy', bm: 'Tempat Membeli' },
      { en: 'Direct from the factory, or through the appointed dealer in your state.',
        bm: 'Terus dari kilang, atau melalui pengedar dilantik di negeri anda.' },
      [{ href: 'where-to-buy.html', label: { en: 'Where To Buy', bm: 'Tempat Membeli' } }]);

    var how = sec({ head: { en: 'THREE WAYS TO ORDER', bm: 'TIGA CARA MEMESAN' } });
    var grid = el('div', { class: 'grid grid--3', 'data-stagger': '60' });
    S.buying.forEach(function (b) {
      grid.appendChild(el('div', { class: 'stat', 'data-anim': 'rise' }, [
        icon(b.icon), txt(b.title, 'h3'), txt(b.body, 'p')
      ]));
    });
    how.wrap.appendChild(grid);
    put(how);

    var terms = sec({ tone: 'mint', head: { en: 'BEFORE YOU ORDER', bm: 'SEBELUM ANDA MEMESAN' } });
    terms.wrap.appendChild(recList([{
      rows: (t(S.buyingTerms) || []).map(function (line) { return { name: line }; })
    }], 1));
    put(terms);

    var dealers = sec({ head: { en: 'APPOINTED DEALERS', bm: 'PENGEDAR DILANTIK' } });
    dealers.wrap.appendChild(recList(S.dealers.map(function (d) {
      return { title: d.state, rows: d.list.map(function (x) { return { name: x.name, note: x.addr }; }) };
    }), 3));
    put(dealers);

    put(closingCta());
  };

  /* -------------------------------------------------------------- contact */
  APP.pages.contact = function () {
    head({ en: 'Contact', bm: 'Hubungi' },
      { en: 'Tell us your meal volume and the space you have. You get the model, the dimensions and a price.',
        bm: 'Beritahu kami jumlah hidangan dan ruang yang anda ada. Anda akan menerima model, dimensi dan harga.' },
      [{ href: 'contact.html', label: { en: 'Contact', bm: 'Hubungi' } }]);

    var reach = sec({ head: { en: 'REACH US', bm: 'HUBUNGI KAMI' } });
    reach.wrap.appendChild(recList([
      { title: { en: 'Sales', bm: 'Jualan' }, rows: [
        { name: S.contact.officeDisplay, note: { en: 'Office line', bm: 'Talian pejabat' } },
        { name: S.contact.whatsappDisplay, note: { en: 'WhatsApp, ' + S.contact.person, bm: 'WhatsApp, ' + S.contact.person } },
        { name: S.contact.email, note: { en: 'Email', bm: 'E-mel' } }
      ] },
      { title: { en: 'Service', bm: 'Servis' }, rows: [
        { name: S.contact.serviceDisplay, note: { en: 'Service line', bm: 'Talian servis' } },
        { name: t(S.contact.hours), note: { en: 'Opening hours', bm: 'Waktu operasi' } }
      ] }
    ], 2));
    put(reach);

    var formSec = sec({ tone: 'mint', id: 'enquiry', head: { en: 'SEND AN ENQUIRY', bm: 'HANTAR PERTANYAAN' } });
    formSec.wrap.appendChild(enquiryForm());
    put(formSec);

    var offices = sec({ head: { en: 'OFFICES AND FACTORIES', bm: 'PEJABAT DAN KILANG' } });
    offices.wrap.appendChild(recList([{ title: S.contact.hq.label, rows: [{ name: S.contact.hq.lines.join(', ') }] }]
      .concat(S.contact.factories.map(function (f) {
        return { title: f.label, rows: [{ name: f.lines.join(', ') }] };
      })), 2));
    put(offices);
  };

  function formField(opts) {
    var id = 'f-' + opts.name;
    var control;
    if (opts.tag === 'textarea') control = el('textarea', { id: id, name: opts.name, rows: '5' });
    else if (opts.tag === 'select') {
      control = el('select', { id: id, name: opts.name });
      control.appendChild(txt(S.ui.pleaseSelect, 'option', { value: '' }));
      (opts.options || []).forEach(function (o) {
        control.appendChild(el('option', { value: o.value, text: o.label }));
      });
    } else control = el('input', { id: id, name: opts.name, type: opts.type || 'text' });
    if (opts.required) control.setAttribute('required', 'required');
    return el('div', { class: 'field' }, [txt(opts.label, 'label', { for: id }), control]);
  }

  function enquiryForm() {
    var form = el('form', { class: 'enq-form', 'data-enquiry': '' }, [
      formField({ name: 'name', label: S.ui.name, required: true }),
      formField({ name: 'phone', label: S.ui.mobile, type: 'tel', required: true }),
      formField({ name: 'email', label: S.ui.email, type: 'email', required: true }),
      formField({
        name: 'product', label: S.ui.productInterest, tag: 'select',
        options: C.products.map(function (p) { return { value: p.slug, label: t(p.name) }; })
      }),
      formField({ name: 'message', label: S.ui.message, tag: 'textarea' }),
      el('p', { class: 'form-status', 'data-form-status': '', hidden: 'hidden', tabindex: '-1' }),
      el('div', { class: 'form-actions' }, [
        txt(S.ui.submit, 'button', { class: 'btn btn--lg', type: 'submit' }),
        waBtn('btn--lg')
      ])
    ]);
    /* The enquiry list is the whole point of this site, so anything already
       on it arrives prefilled rather than being typed a second time. */
    if (PM.enquiry) {
      var pre = PM.enquiry.formText();
      if (pre) {
        var box = PM.qs('textarea', form);
        if (box) box.value = pre;
      }
    }
    return form;
  }

  /* ------------------------------------------------------------ policies */
  APP.pages.policies = function () {
    head({ en: 'Policies', bm: 'Dasar' },
      { en: 'What we collect when you enquire, what the warranty covers, and the terms this site is published under.',
        bm: 'Apa yang kami kumpulkan apabila anda bertanya, apa yang dilindungi waranti, dan terma penerbitan laman ini.' },
      [{ href: 'policies.html', label: { en: 'Policies', bm: 'Dasar' } }]);

    S.policies.forEach(function (pol, i) {
      var band = sec({ tone: i % 2 ? 'mint' : null, id: pol.id });
      band.wrap.appendChild(txt(pol.title, 'h2'));
      band.wrap.appendChild(proseBlock(pol.body));
      put(band);
    });

    put(closingCta());
  };

  APP.util = {
    icon: icon, txt: txt, link: link, frame: frame, sectionHead: sectionHead,
    waBtn: waBtn, headlineFigure: headlineFigure, brandLogo: brandLogo
  };

  APP.pages.home = function () {
    buildHero();
    buildBanners();
    buildRange();
    buildSizer();
    buildCutaway();
    buildFeatured();
    buildServices();
    buildTrust();
    buildAbout();
    buildVideos();
    buildNews();
    buildCta();
  };

  /* The company's own banners, shown whole, directly under the hero. */
  function buildBanners() {
    var hero = PM.qs('[data-home-hero]');
    if (!hero || !hero.parentNode) return;
    hero.parentNode.insertBefore(adBand(), hero.nextSibling);
  }

  function buildVideos() {
    var mount = PM.qs('[data-home-about]');
    if (!mount || !mount.parentNode) return;
    var band = sec({
      head: { en: 'ON FILM', bm: 'DALAM FILEM' },
      sub: { en: 'Made here, fitted here, cleaned here. Seven films from our own channel.',
             bm: 'Dibuat di sini, dipasang di sini, dibersihkan di sini. Tujuh filem dari saluran kami sendiri.' }
    });
    band.wrap.appendChild(videoShelf({ filters: false, items: S.youtube.slice(0, 4) }));
    mount.parentNode.insertBefore(band, mount.nextSibling);
  }

  APP.init = function (pageFn) {
    PM.on('ready', function () {
      if (PM.motion) PM.motion.boot({ transition: 'fade' });
    });
    PM.boot(function () {
      buildHeader();
      buildFooter();
      trackHeaderHeight();
      if (typeof pageFn === 'function') pageFn(APP);
      mountSearch();
      mountMegaHover();
      if (APP.mountEnquiry) APP.mountEnquiry();
      PM.on('langchange', function () {
        PM.qsa('[data-lang-href]').forEach(function (n) {
          n.setAttribute('href', PM.langHref(n.getAttribute('data-lang-href')));
        });
        var si = PM.qs('[data-search-input]');
        if (si) si.setAttribute('placeholder', si.getAttribute('data-' + PM.lang + '-ph') || '');
      });
    });
  };

  root.APP = APP;
})(window, document);
