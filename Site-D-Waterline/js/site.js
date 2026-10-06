/* =========================================================================
   Site D - "Waterline" page logic
   Chassis, the twelve blocks and every page are rendered here so the HTML
   shells stay small and stay in sync. Data driven text is written with
   textContent, never innerHTML.
   ========================================================================= */
(function (root, doc) {
  'use strict';

  var PM = root.PM;
  var S  = PM.site;
  var C  = PM.catalog;
  var L  = root.PM_LIBRARY || {};
  var el = PM.el;
  var t  = PM.t;
  var A  = PM.asset;

  var APP = { ui: {}, chassis: {}, blocks: {}, pages: {}, data: {} };

  /* ---------------------------------------------------------------- pages
     Every page in the nav is built. The placeholder route is kept for a
     link typed by hand that does not resolve, so nothing 404s, but no
     navigation entry reaches it any more. */
  var BUILT = [
    'index.html', 'grease-traps.html', 'oil-interceptor.html', 'auto-dosing.html',
    'bio-enzyme.html', 'cleaning-range.html', 'others.html', 'model-finder.html',
    'product.html', 'services.html', 'service.html',
    'approvals.html', 'awards.html', 'lab-test.html', 'installation-guide.html',
    'scheduled-waste.html',
    'about.html', 'project-gallery.html', 'videos.html', 'downloads.html',
    'news.html', 'article.html', 'careers.html', 'faq.html',
    'where-to-buy.html', 'contact.html', 'policies.html'
  ];

  /* Exposed so the check harness can assert against the real list rather
     than keeping a second copy that goes stale. */
  APP.built = function () { return BUILT.slice(); };

  /* ------------------------------------------------------------- the nav
     Site D's own copy of SITE.nav. The shared list also drives Site C,
     which has none of the pages added in October, so the additions are
     made here, each placed after a named sibling. */
  var NAV_ADD = {
    Products: [
      { after: 'grease-traps.html', href: 'oil-interceptor.html',
        label: { en: 'GreaseGo Oil Interceptor', bm: 'Pemintas Minyak GreaseGo' } },
      { after: 'bio-enzyme.html', href: 'cleaning-range.html',
        label: { en: 'Cleaning Range', bm: 'Rangkaian Pembersihan' } }
    ],
    Compliance: [
      { after: 'installation-guide.html', href: 'scheduled-waste.html',
        label: { en: 'Scheduled Waste Guide', bm: 'Panduan Sisa Berjadual' } }
    ],
    Company: [
      { after: 'careers.html', href: 'faq.html', label: { en: 'FAQs', bm: 'Soalan Lazim' } }
    ]
  };

  var NAV = S.nav.map(function (entry) {
    if (!entry.children) return entry;
    var children = entry.children.slice();
    (NAV_ADD[entry.label.en] || []).forEach(function (add) {
      var at = children.map(function (c) { return c.href; }).indexOf(add.after);
      children.splice(at === -1 ? children.length : at + 1, 0, { href: add.href, label: add.label });
    });
    return { label: entry.label, children: children };
  });

  APP.nav = function () { return NAV; };

  APP.ui.href = function (href, label) {
    var page = String(href || '').split('?')[0];
    if (BUILT.indexOf(page) !== -1) return href;
    return 'soon.html?p=' + encodeURIComponent(typeof label === 'string' ? label : t(label));
  };

  /* -------------------------------------------------------------- ui bits */
  APP.ui.icon = function (name) {
    return el('i', { class: 'ph ' + name, 'aria-hidden': 'true' });
  };

  /* A label is either a plain string or an {en, bm} pair. Pairs carry
     data-en/data-bm so the shared language engine keeps them in sync. */
  function labelAttrs(label) {
    if (label === null || label === undefined) return {};
    if (typeof label === 'string') return { text: label };
    return { 'data-en': label.en, 'data-bm': label.bm, text: t(label) };
  }
  APP.ui.labelAttrs = labelAttrs;

  function setLabel(node, label) {
    var a = labelAttrs(label);
    Object.keys(a).forEach(function (k) {
      if (k === 'text') node.textContent = a[k];
      else node.setAttribute(k, a[k]);
    });
    return node;
  }
  APP.ui.setLabel = setLabel;

  /* Link that carries the current language across pages and routes unbuilt
     pages to the placeholder. */
  APP.ui.link = function (href, label, cls) {
    var target = APP.ui.href(href, label);
    var attrs = { href: PM.langHref(target), 'data-lang-href': target, class: cls || null };
    return el('a', Object.assign(attrs, labelAttrs(label)));
  };

  APP.ui.pill = function (opts) {
    opts = opts || {};
    var attrs = { class: 'pill pill--' + (opts.tone || 'accent') };
    if (opts.magnetic) attrs['data-magnetic'] = '';
    if (opts.href) {
      var target = opts.raw ? opts.href : APP.ui.href(opts.href, opts.label);
      attrs.href = opts.raw ? target : PM.langHref(target);
      if (!opts.raw) attrs['data-lang-href'] = target;
      if (opts.target) { attrs.target = opts.target; attrs.rel = 'noopener'; }
    } else {
      attrs.type = 'button';
    }
    if (opts.ariaLabel) attrs['aria-label'] = opts.ariaLabel;
    var kids = [el('span', labelAttrs(opts.label))];
    if (opts.icon !== false) kids.push(APP.ui.icon(opts.iconName || 'ph-arrow-right'));
    var node = el(opts.href ? 'a' : 'button', attrs, kids);
    if (opts.onClick) node.addEventListener('click', opts.onClick);
    return node;
  };

  /* ------------------------------------------------------------- the arc
     One shape, two sizes, direction alternating down the page. The element
     paints `background: inherit`, so it always carries the colour of the
     band that owns it - which is what makes one band appear to sweep over
     the next. Purely decorative. */
  APP.ui.arc = function (dir) {
    dir = dir || 'bottom';
    var node = el('span', { class: 'arc arc--' + dir, 'aria-hidden': 'true' });
    /* The sweep lives on the arc's ::before, never on the arc itself, and
       the attribute is "arc" rather than the shared "clip". An element that
       clips itself reports a zero intersection rect, so the shared reveal
       observer would never fire on it and the arc would stay invisible. */
    if (!PM.motion.reduce && (dir === 'top' || dir === 'bottom' || dir === 'band')) {
      node.setAttribute('data-anim', 'arc');
    }
    return node;
  };

  APP.ui.eyebrow = function (label) {
    return el('p', { class: 'eyebrow' }, [
      el('span', { class: 'eyebrow-mark', 'aria-hidden': 'true' }),
      el('span', labelAttrs(label))
    ]);
  };

  APP.ui.circleArrow = function (tone) {
    return el('span', { class: 'circ' + (tone ? ' circ--' + tone : ''), 'aria-hidden': 'true' }, [
      APP.ui.icon('ph-arrow-right')
    ]);
  };

  /* Content imagery under a navy curtain that lifts on arrival. An empty alt
     throws on purpose: content imagery without alt text is a defect, and it
     should surface in development rather than in review. */
  APP.ui.photo = function (src, alt, frameCls) {
    if (!alt || !String(alt).trim()) {
      throw new Error('APP.ui.photo: alt text is required for ' + src);
    }
    /* Half the library is artwork with the model number, the council name
       or the test result printed into the picture, and a cover crop cuts
       those words in half. When a caller has not named a frame, the shared
       policy picks one from the source path instead of defaulting every
       image to a bleed. */
    var kind = frameCls || (PM.frameFor ? PM.frameFor(src) : 'photo');
    /* data-fit is normally written by frames.js once the image has loaded.
       Stating it up front for a source the policy already knows is artwork
       stops the half-second where the browser cover-crops it and the model
       number is visibly cut off before it snaps back. */
    var fit = (PM.showsWhole && PM.showsWhole(src)) ? 'contain' : null;
    var kids = [
      el('span', { class: 'frame frame--' + kind, 'data-fit': fit }, [
        el('img', { src: A(src), alt: alt, loading: 'lazy' })
      ])
    ];
    var attrs = { class: 'photo' };
    if (!PM.motion.reduce) {
      /* Observed on the wrapper, which is never clipped. The curtain itself
         translates out; giving it the shared "mask" variant would clip it to
         zero height and the reveal observer would never see it. */
      attrs['data-anim'] = 'photo';
      kids.push(el('span', { class: 'curtain', 'aria-hidden': 'true' }));
    }
    return el('span', attrs, kids);
  };

  /* A published figure. Numeric values odometer; anything else prints, and
     an {en, bm} pair follows the language switch. */
  APP.ui.figure = function (value, label, opts) {
    opts = opts || {};
    var pair = value !== null && typeof value === 'object';
    var numeric = !pair && /^[0-9]+$/.test(String(value));
    var num = (opts.roll && numeric && !opts.raw)
      ? el('span', { class: 'fig-num', 'data-roll': String(value) })
      : el('span', Object.assign({ class: 'fig-num' }, pair ? labelAttrs(value) : { text: String(value) }));
    var card = el('div', { class: 'fig-card' }, [
      APP.ui.arc('tr'),
      num,
      el('p', Object.assign({ class: 'cap fig-lbl' }, labelAttrs(label)))
    ]);
    return card;
  };

  /* -------------------------------------------------------- the documents
     Every catalogue and drawing PDF in the library, flattened into one
     list. Paths come from the model code: the PDF itself, a thumbnail of
     its first page, and an image of each page for a browser that cannot
     show a PDF inside the page. */
  var DOC_KINDS = {
    catalogue: { dir: 'catalogue', icon: 'ph-book-open',
                 label: { en: 'Product catalogue', bm: 'Katalog produk' },
                 title: { en: 'product catalogue', bm: 'Katalog produk' },
                 file: 'catalogue' },
    drawing:   { dir: 'drawings', icon: 'ph-ruler',
                 label: { en: 'Drawing & installation guide', bm: 'Lukisan & panduan pemasangan' },
                 title: { en: 'drawing & installation guide', bm: 'Lukisan & panduan pemasangan' },
                 file: 'drawing-installation-guide' }
  };
  var docList = null;

  APP.data.documents = function () {
    if (docList) return docList;
    docList = [];
    (L.documents || []).forEach(function (m) {
      var key = m.model.toLowerCase();
      ['catalogue', 'drawing'].forEach(function (kind) {
        var spec = m[kind];
        if (!spec) return;
        var k = DOC_KINDS[kind];
        var pages = [];
        for (var i = 1; i <= spec.pages; i++) pages.push('docs/pages/' + kind + '-' + key + '-' + i + '.webp');
        docList.push({
          id: kind + '-' + key, kind: kind, model: m.model, series: m.series,
          file: 'docs/' + k.dir + '/' + key + '.pdf',
          thumb: 'docs/thumbs/' + kind + '-' + key + '.webp',
          pages: spec.pages, kb: spec.kb, pageImages: pages,
          title: { en: m.model + ' ' + k.title.en, bm: k.title.bm + ' ' + m.model }
        });
      });
    });
    return docList;
  };

  APP.data.doc = function (id) {
    return APP.data.documents().filter(function (d) { return d.id === id; })[0] || null;
  };

  /* PM.asset resolves everything under img/. Documents live beside it. */
  function docUrl(path) { return PM.assets + path; }

  function docMeta(d) {
    return {
      en: 'PDF, ' + d.pages + (d.pages === 1 ? ' page, ' : ' pages, ') + d.kb + ' KB',
      bm: 'PDF, ' + d.pages + ' halaman, ' + d.kb + ' KB'
    };
  }

  /* A real link to the file, so a middle click or "save link as" still
     behaves as a link. A plain click opens the viewer instead. */
  APP.ui.docLink = function (d) {
    var k = DOC_KINDS[d.kind];
    return el('a', { class: 'dl-btn', href: docUrl(d.file), 'data-doc': d.id }, [
      APP.ui.icon(k.icon),
      el('span', { class: 'dl-btn-copy' }, [
        el('span', Object.assign({ class: 'dl-btn-name' }, labelAttrs(k.label))),
        el('span', Object.assign({ class: 'dl-btn-meta' }, labelAttrs(docMeta(d))))
      ])
    ]);
  };

  /* ------------------------------------------------------- the PDF viewer
     One dialog for the whole site, built the first time it is needed. A
     desktop browser shows the PDF in a frame with its own zoom and print;
     a phone browser cannot show a PDF inside a page at all, so there the
     same dialog shows each page as an image. Download is offered either
     way, and so is opening the file on its own. */
  APP.ui.docViewer = (function () {
    var box = null, parts = {}, lastFocus = null;

    function canInline() {
      return root.navigator.pdfViewerEnabled !== false && root.innerWidth >= 720;
    }

    function focusables() {
      return PM.qsa('a[href], button, iframe', box).filter(function (n) { return n.offsetParent !== null; });
    }

    function build() {
      parts.kicker = el('p', { class: 'cap docview-kicker' });
      parts.title = el('h2', { class: 'docview-title', id: 'docview-title' });
      parts.dl = el('a', { class: 'pill pill--accent docview-dl' }, [
        el('span', labelAttrs({ en: 'Download PDF', bm: 'Muat turun PDF' })), APP.ui.icon('ph-download-simple')
      ]);
      parts.tab = el('a', { class: 'pill pill--ghost docview-tab', target: '_blank', rel: 'noopener' }, [
        el('span', labelAttrs({ en: 'Open in new tab', bm: 'Buka di tab baharu' })), APP.ui.icon('ph-arrow-up-right')
      ]);
      parts.close = el('button', {
        class: 'docview-close', type: 'button',
        'data-i18n-attr': 'aria-label:close', 'aria-label': t(S.ui.close),
        onclick: function () { close(); }
      }, [APP.ui.icon('ph-x')]);
      parts.body = el('div', { class: 'docview-body' });

      box = el('div', {
        class: 'docview', role: 'dialog', 'aria-modal': 'true',
        'aria-labelledby': 'docview-title', hidden: 'hidden'
      }, [
        el('div', { class: 'docview-panel' }, [
          el('div', { class: 'docview-bar' }, [
            el('div', { class: 'docview-head' }, [parts.kicker, parts.title]),
            el('div', { class: 'docview-tools' }, [parts.dl, parts.tab, parts.close])
          ]),
          parts.body
        ])
      ]);

      box.addEventListener('click', function (e) { if (e.target === box) close(); });
      box.addEventListener('keydown', function (e) {
        if (e.key !== 'Tab') return;
        var f = focusables();
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
      });
      doc.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && box && !box.hidden) close();
      });
      doc.body.appendChild(box);
    }

    function open(d, opts) {
      if (!d) return;
      if (!box) build();
      opts = opts || {};
      var inline = opts.inline === undefined ? canInline() : !!opts.inline;
      var href = docUrl(d.file);

      lastFocus = doc.activeElement;
      setLabel(parts.title, d.title);
      setLabel(parts.kicker, docMeta(d));
      parts.dl.setAttribute('href', href);
      parts.dl.setAttribute('download', d.model + '-' + DOC_KINDS[d.kind].file + '.pdf');
      parts.tab.setAttribute('href', href);

      parts.body.textContent = '';
      box.classList.toggle('is-pages', !inline);
      if (inline) {
        parts.body.appendChild(el('iframe', { class: 'docview-frame', src: href, title: t(d.title) }));
      } else {
        var pages = el('div', { class: 'docview-pages' });
        d.pageImages.forEach(function (src, i) {
          pages.appendChild(el('img', {
            src: docUrl(src), loading: i === 0 ? null : 'lazy',
            alt: t(d.title) + ', ' + t({ en: 'page ' + (i + 1) + ' of ' + d.pages,
                                         bm: 'halaman ' + (i + 1) + ' daripada ' + d.pages })
          }));
        });
        parts.body.appendChild(pages);
      }

      box.hidden = false;
      doc.body.classList.add('nav-locked');
      parts.close.focus();
    }

    function close() {
      if (!box || box.hidden) return;
      box.hidden = true;
      /* Emptied rather than hidden, so the frame stops holding the file. */
      parts.body.textContent = '';
      doc.body.classList.remove('nav-locked');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
      lastFocus = null;
    }

    return { open: open, close: close };
  })();

  /* Any document link anywhere opens the viewer on a plain click. */
  doc.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var link = e.target && e.target.closest ? e.target.closest('[data-doc]') : null;
    if (!link) return;
    var d = APP.data.doc(link.getAttribute('data-doc'));
    if (!d) return;
    e.preventDefault();
    APP.ui.docViewer.open(d);
  });

  /* ---------------------------------------------------------------- band
     Every block is a band. The section owns its own background so its arc
     can inherit it, and exposes `.body` so callers append without digging. */
  APP.blocks._band = function (name, opts) {
    opts = opts || {};
    var cls = 'band band--' + name;
    /* A toned band is separated from its neighbour by the colour change.
       An untoned one is not, so it is marked and the stylesheet halves the
       seam where two of them meet. */
    if (opts.tone && opts.tone !== 'surface') cls += ' is-' + opts.tone;
    else cls += ' is-plain';
    var section = el('section', { class: cls });
    if (opts.id) section.id = opts.id;
    if (opts.jump) {
      section.setAttribute('data-jump', t(opts.jump));
      section.setAttribute('data-jump-en', opts.jump.en);
      section.setAttribute('data-jump-bm', opts.jump.bm);
      if (!section.id) section.id = 'sec-' + name + '-' + (++jumpSeq);
    }
    if (opts.arc) section.appendChild(APP.ui.arc(opts.arc));
    var body = el('div', { class: opts.wide ? 'wrap wrap--wide' : 'wrap' });
    section.appendChild(body);
    section.body = body;
    return section;
  };
  var jumpSeq = 0;

  /* ====================================================================
     THE BLOCK KIT
     Twelve blocks. Every page is assembled from these and no page invents
     a thirteenth. Each renderer returns a <section> and appends nothing.
     ==================================================================== */

  /* Standard heading pair used at the top of most bands. */
  function bandHead(opts) {
    var kids = [];
    if (opts.eyebrow) kids.push(APP.ui.eyebrow(opts.eyebrow));
    if (opts.heading) kids.push(el('h2', labelAttrs(opts.heading)));
    if (opts.body) {
      (Array.isArray(opts.body) ? opts.body : [opts.body]).forEach(function (para) {
        kids.push(el('p', Object.assign({ class: 'lead' }, labelAttrs(para))));
      });
    }
    return el('div', { class: 'band-head', 'data-anim': 'rise' }, kids);
  }

  /* ---------------------------------------------------------- S3 the lead
     Eyebrow in the left third, heading and copy in the right two thirds. */
  APP.blocks.lead = function (opts) {
    opts = opts || {};
    var section = APP.blocks._band('lead', opts);
    var copy = el('div', { class: 'lead-copy' });
    if (opts.heading) copy.appendChild(el('h2', labelAttrs(opts.heading)));
    (opts.body || []).forEach(function (para) {
      copy.appendChild(el('p', Object.assign({ class: 'lead' }, labelAttrs(para))));
    });
    if (opts.cta) {
      copy.appendChild(APP.ui.pill({ href: opts.cta.href, label: opts.cta.label, tone: 'accent' }));
    }
    section.body.appendChild(el('div', { class: 'lead-grid', 'data-anim': 'rise' }, [
      el('div', { class: 'lead-side' }, [opts.eyebrow ? APP.ui.eyebrow(opts.eyebrow) : null]),
      copy
    ]));
    return section;
  };

  /* ----------------------------------------------------- S2 the statement
     One sentence, with the load-bearing phrases in blue. Built by walking
     the sentence and pushing text nodes, so nothing is ever parsed as HTML. */
  APP.blocks.statement = function (opts) {
    opts = opts || {};
    var section = APP.blocks._band('statement', opts);
    var p = el('p', { class: 'stmt-text' });

    function paint(sentence, phrases) {
      p.textContent = '';
      var rest = sentence;
      (phrases || []).forEach(function (phrase) {
        var i = rest.indexOf(phrase);
        if (i === -1) return;
        if (i > 0) p.appendChild(doc.createTextNode(rest.slice(0, i)));
        p.appendChild(el('em', { class: 'em', text: phrase }));
        rest = rest.slice(i + phrase.length);
      });
      if (rest) p.appendChild(doc.createTextNode(rest));
    }

    paint(t(opts.text), opts.emphasis);
    /* The phrase list is per language, so repaint on a language change. */
    PM.on('langchange', function () {
      paint(t(opts.text), PM.lang === 'bm' && opts.emphasisBm ? opts.emphasisBm : opts.emphasis);
    });

    section.body.appendChild(el('div', { class: 'stmt', 'data-anim': 'rise' }, [p]));
    return section;
  };

  /* ----------------------------------------------------------- S11 the CTA */
  APP.blocks.cta = function (opts) {
    opts = opts || {};
    var tone = opts.tone || 'accent';
    var section = APP.blocks._band('cta', Object.assign({}, opts, {
      tone: tone === 'accent' ? null : tone
    }));
    if (tone === 'accent') section.classList.add('is-accent');

    var controls = el('div', { class: 'cta-controls' });
    if (opts.primary) {
      controls.appendChild(APP.ui.pill({
        href: opts.primary.href, label: opts.primary.label, tone: 'accent', magnetic: true
      }));
    }
    if (opts.whatsapp) {
      controls.appendChild(APP.ui.pill({
        href: PM.waLink(opts.waMessage), raw: true, target: '_blank',
        label: S.ui.whatsapp, tone: 'ghost', iconName: 'ph-whatsapp-logo'
      }));
    }

    var kids = [];
    if (opts.heading) kids.push(el('h2', labelAttrs(opts.heading)));
    if (opts.body) kids.push(el('p', Object.assign({ class: 'lead' }, labelAttrs(opts.body))));

    section.body.appendChild(el('div', { class: 'cta-in', 'data-anim': 'rise' }, [
      el('div', null, kids), controls
    ]));
    return section;
  };

  /* ------------------------------------------------------- S4 the figures
     Every value is counted from the data at render time. Nothing here is
     typed into the markup, so no statistic can drift from its source. */
  APP.data.figures = function (set) {
    if (set === 'trust') return [
      { value: S.brand.since, raw: true,
        label: { en: 'Manufacturing since', bm: 'Mengeluarkan sejak' } },
      { value: C.models.length,
        label: { en: 'Grease trap models', bm: 'Model perangkap minyak' } },
      { value: S.approvals.length + S.approvalsExtra.length,
        label: { en: 'Local authorities accepting', bm: 'Pihak berkuasa menerima' } },
      /* 5 year factory plus 3 year on-site. WARRANTY_TRAP is a private var
         inside catalog.js and is not exported; PM.catalog.badge.warranty
         carries the published wording, "5+3 year warranty". */
      { value: 8,
        label: { en: 'Years warranty, 5 factory plus 3 on-site',
                 bm: 'Tahun waranti, 5 kilang serta 3 di tapak' } }
    ];
    if (set === 'penalties' && L.penalties) return [
      { value: L.penalties.serious.figure, raw: true, label: L.penalties.serious.caption },
      { value: L.penalties.regulatory.figure, raw: true, label: L.penalties.regulatory.caption }
    ];
    if (set === 'compliance') return [
      { value: S.certs.length,
        label: { en: 'Certifications, headed by SIRIM R018/15',
                 bm: 'Pensijilan, diketuai SIRIM R018/15' } },
      { value: S.awards.length,
        label: { en: 'Awards and certificates', bm: 'Anugerah dan sijil' } },
      { value: S.clients.length,
        label: { en: 'Named sites', bm: 'Tapak bernama' } }
    ];
    return [
      { value: S.brand.since, raw: true,
        label: { en: 'Manufacturing since', bm: 'Mengeluarkan sejak' } },
      { value: C.products.length,
        label: { en: 'Products in the catalogue', bm: 'Produk dalam katalog' } },
      { value: C.services.length,
        label: { en: 'Services', bm: 'Perkhidmatan' } },
      { value: S.clients.length,
        label: { en: 'Named sites', bm: 'Tapak bernama' } }
    ];
  };

  APP.blocks.figures = function (opts) {
    opts = opts || {};
    var section = APP.blocks._band('figures', opts);
    var items = APP.data.figures(opts.set || 'trust');
    if (opts.eyebrow || opts.heading) section.body.appendChild(bandHead(opts));
    var grid = el('div', { class: 'fig-grid', 'data-stagger': '80' });
    grid.style.setProperty('--cols', String(items.length));
    items.forEach(function (f) {
      grid.appendChild(APP.ui.figure(f.value, f.label, { roll: !f.raw }));
    });
    section.body.appendChild(grid);
    return section;
  };

  /* --------------------------------------------------------- S5 the tiles
     A tile with a photograph shows it under a curtain. A tile with no strong
     photograph becomes a navy tile carrying a figure, rather than enlarging
     a weak image. That rule lives here so a caller cannot forget it. */
  APP.blocks.tiles = function (opts) {
    opts = opts || {};
    var section = APP.blocks._band('tiles', opts);
    if (opts.eyebrow || opts.heading || opts.body) section.body.appendChild(bandHead(opts));

    var grid = el('div', { class: 'tile-grid' });
    grid.style.setProperty('--cols', String(opts.cols || 3));

    function build(item) {
      var isFig = !item.img;
      var target = item.raw ? item.href : APP.ui.href(item.href, item.label);
      var kids = [];

      /* A caller may still force a frame, but it no longer has to know
         which sources carry words. Anything shown whole is also plated, so
         the caption never sits over the artwork it is describing. */
      var whole = !isFig && (item.plate || (PM.showsWhole && PM.showsWhole(item.img)));

      if (isFig) {
        kids.push(APP.ui.arc('br'));
        kids.push(el('span', { class: 'fig tile-fig', text: String(item.figure === undefined ? '' : item.figure) }));
      } else {
        kids.push(APP.ui.photo(item.img, item.alt, item.frame || (whole ? 'cardart' : null)));
      }

      var foot = el('span', { class: 'tile-foot' }, [
        el('span', { class: 'tile-lbl' }, [
          el('span', Object.assign({ class: 'tile-name' }, labelAttrs(item.label))),
          item.note ? el('span', Object.assign({ class: 'tile-note' }, labelAttrs(item.note))) : null
        ]),
        APP.ui.circleArrow()
      ]);
      kids.push(foot);

      return el('a', {
        class: 'tile' + (isFig ? ' tile--fig' : '') + (whole ? ' tile--plate' : ''),
        href: item.raw ? target : PM.langHref(target),
        'data-lang-href': item.raw ? null : target,
        'data-anim': 'rise'
      }, kids);
    }

    /* Lets a page swap the grid's contents without rebuilding the band, so
       a filter keeps the heading, the chips and the scroll position. */
    section.setItems = function (items) {
      grid.textContent = '';
      (items || []).forEach(function (item) { grid.appendChild(build(item)); });
      PM.frames(grid);
      PM.motion.enhance(grid);
      return section;
    };
    section.grid = grid;

    (opts.items || []).forEach(function (item) { grid.appendChild(build(item)); });
    section.body.appendChild(grid);
    return section;
  };

  /* ---------------------------------------------------------- S1 the hero
     Navy panel on the left, photography on the right, the arc masking the
     seam. Two shapes: a static page hero, and the home page's rotating
     hero. Rotation swaps text in place rather than rebuilding the panel,
     so focus is never stolen from anything the reader is using. */
  APP.blocks.hero = function (opts) {
    opts = opts || {};
    var slides = opts.slides || [opts];
    var rotating = !!(opts.slides && opts.slides.length > 1) && !PM.motion.reduce;
    var dwell = opts.dwell || 7000;
    var idx = 0;
    var timer = null;

    var section = APP.blocks._band('hero', { id: opts.id, wide: true });
    section.classList.add('band--hero');

    /* -- the ground: one photograph behind the whole band --
       Never the same picture as the one on the card: the same photograph
       twice, once sharp and once behind a gradient, reads as a mistake. */
    var GROUNDS = ['news/factory.webp', 'products/gta335-3.jpg', 'products/gts01-3.webp'];
    var groundSrc = opts.ground;
    if (!groundSrc) {
      groundSrc = GROUNDS.filter(function (g) { return g !== slides[0].img; })[0] || GROUNDS[0];
    }
    var groundImg = el('img', {
      src: A(groundSrc), alt: '',
      fetchpriority: 'high', decoding: 'async'
    });
    var ground = el('div', { class: 'hero-bg', 'aria-hidden': 'true' }, [groundImg]);
    if (!PM.motion.reduce) ground.classList.add('hero-drift');

    /* -- the copy, built once -- */
    var eyeSpan = el('span');
    var eyebrow = el('p', { class: 'eyebrow' }, [
      el('span', { class: 'eyebrow-mark', 'aria-hidden': 'true' }), eyeSpan
    ]);
    var h1 = el('h1');
    var body = el('p', { class: 'lead' });
    var ctaSlot = el('div', { class: 'hero-cta' });
    var slide = el('div', { class: 'hero-slide is-in' }, [eyebrow, h1, body, ctaSlot]);

    var panel = el('div', { class: 'hero-copy' }, [slide]);

    /* -- quick links under the panel -- */
    if (opts.links && opts.links.length) {
      var list = el('ul', { class: 'hero-links' });
      opts.links.forEach(function (l) {
        list.appendChild(el('li', null, [
          el('span', { class: 'hero-dotmark', 'aria-hidden': 'true' }),
          APP.ui.link(l.href, l.label)
        ]));
      });
      panel.appendChild(list);
    }

    /* -- the product, on a card floating on that ground -- */
    var photo = APP.ui.photo(slides[0].img, slides[0].alt, slides[0].frame || opts.frame || null);
    var img = photo.querySelector('img');
    var tagText = el('span');
    var tag = el('span', { class: 'hero-card-tag' }, [tagText]);
    var media = el('div', { class: 'hero-card' }, [photo, tag]);

    /* -- the rail and dots, rotating hero only -- */
    var railFill = null, dots = [];
    if (opts.slides && opts.slides.length > 1) {
      railFill = el('span', { class: 'hero-rail-fill' });
      var dotRow = el('div', { class: 'hero-dots', role: 'tablist', 'aria-label': 'Slides' });
      slides.forEach(function (s, i) {
        var d = el('button', {
          class: 'hero-dot', type: 'button', role: 'tab',
          'aria-label': 'Slide ' + (i + 1),
          'aria-current': i === 0 ? 'true' : 'false',
          onclick: function () { stop(); go(i); }
        });
        dots.push(d);
        dotRow.appendChild(d);
      });
      panel.appendChild(el('div', { class: 'hero-nav' }, [
        el('span', { class: 'hero-rail', 'aria-hidden': 'true' }, [railFill]),
        dotRow
      ]));
    }

    function go(i) {
      idx = ((i % slides.length) + slides.length) % slides.length;
      var s = slides[idx];

      if (s.eyebrow) { setLabel(eyeSpan, s.eyebrow); eyebrow.hidden = false; }
      else eyebrow.hidden = true;

      setLabel(h1, s.heading);

      if (s.body) { setLabel(body, s.body); body.hidden = false; }
      else body.hidden = true;

      ctaSlot.textContent = '';
      if (s.cta) {
        ctaSlot.appendChild(APP.ui.pill({
          href: s.cta.href, label: s.cta.label, tone: 'accent', magnetic: true, raw: s.cta.raw
        }));
      }

      if (s.img) {
        /* The frame re-measures for the new source: the card holds artwork
           whole and lets a photograph fill it, and the two swap freely. */
        var f = photo.querySelector('.frame');
        if (f) {
          f.removeAttribute('data-measured');
          f.removeAttribute('data-fit');
          f.removeAttribute('data-small');
          f.removeAttribute('data-bent');
          f.style.removeProperty('--ar');
          f.className = 'frame frame--' +
            (s.frame || opts.frame || (PM.frameFor ? PM.frameFor(s.img) : 'photo'));
        }
        img.setAttribute('src', A(s.img));
        img.setAttribute('alt', s.alt);
        if (f) PM.frames(photo);
      }
      /* The tag names what is on the card, so the card is never an
         unlabelled picture floating on a photograph. */
      if (s.eyebrow) { setLabel(tagText, s.eyebrow); tag.hidden = false; }
      else tag.hidden = true;

      dots.forEach(function (d, n) { d.setAttribute('aria-current', n === idx ? 'true' : 'false'); });

      if (!PM.motion.reduce) {
        slide.classList.remove('is-in');
        void slide.offsetWidth;          /* restart the crossfade */
        slide.classList.add('is-in');
        if (railFill) {
          railFill.style.animation = 'none';
          void railFill.offsetWidth;
          railFill.style.animation = 'heroRail ' + dwell + 'ms linear forwards';
        }
      }
    }

    function start() {
      if (!rotating || timer) return;
      timer = root.setInterval(function () { go(idx + 1); }, dwell);
      section.dataset.timer = String(timer);
    }
    function stop() {
      if (!timer) return;
      root.clearInterval(timer);
      timer = null;
      delete section.dataset.timer;
      if (railFill) railFill.style.animation = 'none';
    }

    section.go = go;
    section.stop = stop;
    section.start = start;

    go(0);
    section.insertBefore(ground, section.firstChild);
    section.body.appendChild(el('div', { class: 'hero-inner' }, [panel, media]));

    if (rotating) {
      start();
      section.addEventListener('mouseenter', stop);
      section.addEventListener('mouseleave', start);
      section.addEventListener('focusin', stop);
      section.addEventListener('focusout', function (e) {
        if (!section.contains(e.relatedTarget)) start();
      });
    }
    return section;
  };

  /* ------------------------------------------------------ S6 the expander
     A row of numbered cards, each with a plus. Choosing one opens a navy
     panel below the row. One panel, built once, its content crossfading
     between items rather than collapsing and reopening. */
  APP.blocks.expander = function (opts) {
    opts = opts || {};
    var items = opts.items || [];
    var section = APP.blocks._band('expander', opts);
    if (opts.eyebrow || opts.heading || opts.body) section.body.appendChild(bandHead(opts));

    var open = -1;
    var cards = [];
    var row = el('div', { class: 'exp-row' });
    row.style.setProperty('--cols', String(Math.min(items.length, opts.cols || 3)));

    /* The panel, built once and refilled. */
    var pNum   = el('span', { class: 'fig exp-p-num' });
    var pTitle = el('h3', { class: 'exp-p-title', id: 'exp-title-' + (++jumpSeq) });
    var pBody  = el('p', { class: 'lead' });
    var pCta   = el('div', { class: 'exp-p-cta' });
    var pPhoto = el('div', { class: 'exp-p-media' });
    var panel  = el('div', {
      class: 'exp-panel', role: 'region', 'aria-labelledby': pTitle.id, hidden: 'hidden'
    }, [
      pPhoto,
      el('div', { class: 'exp-p-copy' }, [
        el('p', { class: 'exp-p-kicker' }, [pNum]), pTitle, pBody, pCta
      ])
    ]);

    function fill(i) {
      var it = items[i];
      pNum.textContent = it.num;
      setLabel(pTitle, it.title);
      setLabel(pBody, it.body);
      pPhoto.textContent = '';
      if (it.img) pPhoto.appendChild(APP.ui.photo(it.img, it.alt, it.frame || null));
      pCta.textContent = '';
      if (it.cta) {
        pCta.appendChild(APP.ui.pill({ href: it.cta.href, label: it.cta.label, tone: 'accent' }));
      }
      PM.frames(pPhoto);
      PM.motion.enhance(panel);
    }

    function openAt(i) {
      if (i < 0 || i >= items.length) return;
      var swapping = open !== -1 && open !== i;
      open = i;
      cards.forEach(function (c, n) { c.setAttribute('aria-expanded', String(n === i)); });
      panel.hidden = false;
      /* Content is written synchronously so the panel is correct the moment
         open() returns. Swapping between items pulses the opacity so the
         change reads as a crossfade rather than a jump. */
      fill(i);
      if (swapping && !PM.motion.reduce) {
        panel.classList.remove('is-swapping');
        void panel.offsetWidth;
        panel.classList.add('is-swapping');
        root.setTimeout(function () { panel.classList.remove('is-swapping'); }, 220);
      }
    }

    function closeAll() {
      open = -1;
      cards.forEach(function (c) { c.setAttribute('aria-expanded', 'false'); });
      panel.hidden = true;
    }

    items.forEach(function (it, i) {
      var card = el('button', {
        class: 'exp-card', type: 'button', 'aria-expanded': 'false',
        onclick: function () {
          if (open === i) { closeAll(); card.focus(); }
          else openAt(i);
        }
      }, [
        el('span', { class: 'exp-media' }, [
          it.img ? APP.ui.photo(it.img, it.alt, it.frame || null) : null
        ]),
        /* The plus sits in the caption row, not on the picture. On the
           installation card it was covering part of the drawing it was
           meant to be offering. */
        el('span', { class: 'exp-cap' }, [
          el('span', { class: 'fig exp-num', text: it.num }),
          el('span', Object.assign({ class: 'exp-title' }, labelAttrs(it.title))),
          el('span', { class: 'exp-plus', 'aria-hidden': 'true' }, [APP.ui.icon('ph-plus')])
        ])
      ]);
      cards.push(card);
      row.appendChild(card);
    });

    section.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || open === -1) return;
      var was = cards[open];
      closeAll();
      if (was) was.focus();
    });

    section.open  = openAt;
    section.close = closeAll;

    section.body.appendChild(row);
    section.body.appendChild(panel);
    return section;
  };

  /* ----------------------------------------------------- S7 the carousel
     Native scroll-snap rather than a transform carousel, so touch, trackpad
     and keyboard all work without being reimplemented. */
  APP.blocks.carousel = function (opts) {
    opts = opts || {};
    var section = APP.blocks._band('carousel', Object.assign({ tone: 'navy' }, opts));
    if (opts.eyebrow || opts.heading || opts.body) section.body.appendChild(bandHead(opts));

    var track = el('div', { class: 'car-track' });
    (opts.items || []).forEach(function (item) {
      var target = item.raw ? item.href : APP.ui.href(item.href, item.title);
      var kids = [];
      if (item.img) kids.push(APP.ui.photo(item.img, item.alt, item.frame || null));
      var meta = [];
      if (item.kicker) meta.push(el('p', Object.assign({ class: 'cap car-kicker' }, labelAttrs(item.kicker))));
      meta.push(el('h3', Object.assign({ class: 'car-title' }, labelAttrs(item.title))));
      if (item.meta) meta.push(el('p', Object.assign({ class: 'cap' }, labelAttrs(item.meta))));
      meta.push(el('span', { class: 'car-more' }, [
        el('span', Object.assign({}, labelAttrs(opts.moreLabel || S.ui.viewDetails))),
        APP.ui.icon('ph-arrow-right')
      ]));
      kids.push(el('div', { class: 'car-body' }, meta));
      track.appendChild(el('a', {
        class: 'car-card',
        href: item.raw ? target : PM.langHref(target),
        'data-lang-href': item.raw ? null : target
      }, kids));
    });

    var fill = el('span', { class: 'car-rail-fill' });
    var rail = el('span', { class: 'car-rail', 'aria-hidden': 'true' }, [fill]);

    function step(dir) {
      var card = track.querySelector('.car-card');
      var by = card ? card.getBoundingClientRect().width + 24 : 320;
      track.scrollBy({ left: dir * by, behavior: PM.motion.reduce ? 'auto' : 'smooth' });
    }
    function sync() {
      var max = track.scrollWidth - track.clientWidth;
      fill.style.setProperty('--p', max > 0 ? (track.scrollLeft / max).toFixed(4) : '1');
    }
    track.addEventListener('scroll', sync, { passive: true });

    var nav = el('div', { class: 'car-nav' }, [
      el('button', {
        class: 'car-btn', type: 'button', 'aria-label': 'Previous',
        onclick: function () { step(-1); }
      }, [APP.ui.icon('ph-arrow-left')]),
      el('button', {
        class: 'car-btn', type: 'button', 'aria-label': 'Next',
        onclick: function () { step(1); }
      }, [APP.ui.icon('ph-arrow-right')])
    ]);

    section.body.appendChild(track);
    section.body.appendChild(el('div', { class: 'car-foot' }, [rail, nav]));
    root.setTimeout(sync, 0);
    return section;
  };

  /* -------------------------------------------------------- S8 the media */
  APP.blocks.media = function (opts) {
    opts = opts || {};
    var section = APP.blocks._band('media', Object.assign({ wide: true }, opts));

    var stage = el('div', { class: 'media-stage' });
    var still = opts.img || opts.poster;
    stage.appendChild(APP.ui.photo(still, opts.alt, 'photo'));
    stage.appendChild(el('div', { class: 'media-scrim', 'aria-hidden': 'true' }));

    if (opts.video) {
      var play = el('button', {
        class: 'media-play', type: 'button',
        'aria-label': t(opts.playLabel || { en: 'Play video', bm: 'Main video' }),
        onclick: function () {
          var v = el('video', {
            controls: 'controls', playsinline: 'playsinline', preload: 'metadata',
            poster: A(still), class: 'media-video'
          }, [el('source', { src: A(opts.video), type: 'video/mp4' })]);
          stage.textContent = '';
          stage.appendChild(v);
          v.play();
        }
      }, [APP.ui.icon('ph-play')]);
      stage.appendChild(play);
    }

    if (opts.heading) {
      stage.appendChild(el('div', { class: 'media-cap' }, [
        opts.eyebrow ? APP.ui.eyebrow(opts.eyebrow) : null,
        el('h2', labelAttrs(opts.heading))
      ]));
    }
    section.body.appendChild(stage);
    return section;
  };

  /* -------------------------------------------------------- S9 the quote */
  APP.blocks.quote = function (opts) {
    opts = opts || {};
    var section = APP.blocks._band('quote', Object.assign({ tone: 'navy', arc: 'top' }, opts));
    var cap = [el('span', { class: 'mono', text: opts.name })];
    if (opts.role) cap.push(el('span', Object.assign({ class: 'cap' }, labelAttrs(opts.role))));
    section.body.appendChild(el('figure', { class: 'quote', 'data-anim': 'rise' }, [
      el('span', { class: 'quote-rule', 'aria-hidden': 'true' }),
      el('blockquote', labelAttrs(opts.text)),
      el('figcaption', null, cap)
    ]));
    return section;
  };

  /* --------------------------------------------------------- S12 the sizer
     "How many meals do you serve a day?" - kept from the earlier concept at
     the client's request, rebuilt in this palette. The logic is unchanged:
     PM.recommendModel against the published model table, PM.dosingFor for
     the nightly enzyme dose. No figure here is invented or rounded. */
  var MEALS_MIN = 40, MEALS_MAX = 15000;

  APP.blocks.sizer = function (opts) {
    opts = opts || {};
    var section = APP.blocks._band('sizer', Object.assign({ tone: 'wash' }, opts));
    var meals = opts.start || 300;
    var model = PM.recommendModel(meals);
    var first = true;

    /* -- left card -- */
    var count = el('span', { class: 'fig sizer-count' });
    var input = el('input', {
      type: 'range', min: String(MEALS_MIN), max: String(MEALS_MAX), step: '10',
      value: String(meals), class: 'sizer-range', id: 'sizer-range-' + (++jumpSeq),
      'data-i18n-attr': 'aria-label:dailyMeals', 'aria-label': t(S.ui.dailyMeals)
    });
    input.addEventListener('input', function () { set(parseInt(input.value, 10)); });

    var left = el('div', { class: 'sizer-in' }, [
      APP.ui.eyebrow(opts.eyebrow || { en: 'Find your model', bm: 'Cari model anda' }),
      el('h2', labelAttrs(opts.heading || {
        en: 'How many meals do you serve a day?',
        bm: 'Berapa hidangan anda sajikan sehari?'
      })),
      el('p', Object.assign({ class: 'lead' }, labelAttrs(opts.body || {
        en: 'Meal volume decides the trap size. Move the slider and the correct model, its capacity and its nightly enzyme dose appear beside it.',
        bm: 'Jumlah hidangan menentukan saiz perangkap. Gerakkan penggelangsar dan model yang betul, kapasitinya dan dos enzim malamnya akan muncul di sebelah.'
      }))),
      el('div', { class: 'sizer-read' }, [
        count,
        el('span', Object.assign({ class: 'sizer-unit' }, labelAttrs({
          en: 'meals / day', bm: 'hidangan / hari'
        })))
      ]),
      input,
      el('div', { class: 'sizer-scale cap' }, [
        el('span', { text: '40' }),
        el('span', { text: '7,500' }),
        el('span', { text: '15,000' })
      ])
    ]);

    /* -- the level graphic, decorative -- */
    var level = el('div', { class: 'sizer-level', 'aria-hidden': 'true' }, [
      el('span', { class: 'sizer-level-fill' }, [el('span', { class: 'sizer-level-arc' })])
    ]);

    /* -- right card -- */
    var code = el('h3', { class: 'sizer-model fig' });
    /* Numeric rows keep the figure and its unit apart, so the odometer runs
       on the number alone and the unit never gets split into digit slots. */
    var rows = [
      { label: S.ui.flowRate,   key: 'gpm',    unit: 'GPM',
        fmt: function (m) { return String(m.gpm); }, numeric: true },
      { label: S.ui.capacity,   key: 'max',    unit: 'L',
        fmt: function (m) { return String(m.max); }, numeric: true },
      { label: S.ui.pipeSize,   key: 'pipe',
        fmt: function (m) { return m.pipe; } },
      { label: S.ui.dimensions, key: 'sizeMm',
        fmt: function (m) { return m.sizeMm; } },
      { label: { en: 'Enzyme dose', bm: 'Dos enzim' }, key: 'dose', unit: 'ml/day',
        fmt: function (m) { var d = PM.dosingFor(m.model); return d ? String(d.daily) : '-'; },
        numeric: true }
    ];
    var dl = el('dl', { class: 'sizer-rows' });
    rows.forEach(function (r) {
      r.value = el('span', { class: 'sizer-val' });
      r.unitNode = r.unit ? el('span', { class: 'sizer-unit-sm', text: r.unit }) : null;
      var v = el('dd', { class: 'fig' }, [r.value, r.unitNode]);
      r.node = v;
      dl.appendChild(el('dt', Object.assign({ class: 'cap' }, labelAttrs(r.label))));
      dl.appendChild(v);
    });

    var specLink = APP.ui.pill({ href: 'model-finder.html', label: S.ui.specs, tone: 'accent' });
    var right = el('div', { class: 'sizer-spec' }, [
      APP.ui.arc('tr'), code, dl, specLink
    ]);

    function writeValue(r, text) {
      var n = r.value;
      if (r.unitNode) r.unitNode.hidden = (text === '-');
      if (first && r.numeric && text !== '-') {
        /* Rolls once, on first arrival. Dragging the slider afterwards
           writes plain figures: re-running the odometer on every tick reads
           as noise rather than as motion. */
        n.setAttribute('data-roll', text);
        n.textContent = text;
        return;
      }
      n.removeAttribute('data-roll');
      n.removeAttribute('data-roll-bound');
      n.removeAttribute('role');
      n.removeAttribute('aria-label');
      n.textContent = text;
    }

    function set(next) {
      meals = Math.max(MEALS_MIN, Math.min(MEALS_MAX, next || MEALS_MIN));
      model = PM.recommendModel(meals);

      count.textContent = meals.toLocaleString('en-US');
      code.textContent = model.model;
      rows.forEach(function (r) { writeValue(r, r.fmt(model)); });

      /* The graphic is decorative; a floor keeps a small kitchen from
         reading as an empty tube. */
      level.style.setProperty('--fill', String(Math.max(0.07, Math.min(1, meals / MEALS_MAX))));
      input.value = String(meals);
      input.style.setProperty('--pct', String((meals - MEALS_MIN) / (MEALS_MAX - MEALS_MIN)));
      input.setAttribute('aria-valuetext',
        meals.toLocaleString('en-US') + ' ' + t({ en: 'meals a day', bm: 'hidangan sehari' }) +
        ', ' + t({ en: 'recommended model', bm: 'model disyorkan' }) + ' ' + model.model);

      var p = PM.productByModel(model.model);
      var href = p ? 'product.html?p=' + p.slug : 'model-finder.html';
      specLink.setAttribute('href', PM.langHref(href));
      specLink.setAttribute('data-lang-href', href);
    }

    section.set = set;
    section.state = function () { return { meals: meals, model: model, dose: PM.dosingFor(model.model) }; };

    set(meals);
    first = false;

    section.body.appendChild(el('div', { class: 'sizer-grid', 'data-anim': 'rise' }, [left, level, right]));
    PM.on('langchange', function () { set(meals); });
    return section;
  };

  /* --------------------------------------------------------- S10 the table
     The published seventeen model specification sheet. Figures in mono,
     labels in sans. The meal filter highlights the matching row rather than
     hiding the others, so the reader keeps the whole range in view. */
  var TABLE_COLS = [
    { label: { en: 'Model', bm: 'Model' },        get: function (m) { return m.model; }, mono: true, link: true },
    { label: { en: 'Series', bm: 'Siri' },        get: function (m) { return SERIES_LABEL[m.series] ? t(SERIES_LABEL[m.series]) : m.series; } },
    { label: S.ui.flowRate,                       get: function (m) { return m.gpm ? m.gpm + ' GPM' : '-'; }, mono: true },
    { label: S.ui.capacity,                       get: function (m) { return m.max ? m.max + ' L' : '-'; }, mono: true },
    { label: S.ui.pipeSize,                       get: function (m) { return m.pipe; }, mono: true },
    { label: S.ui.dimensions,                     get: function (m) { return m.sizeMm; }, mono: true },
    { label: S.ui.dailyMeals,                     get: function (m) { return m.meals; }, mono: true },
    { label: S.ui.suggestedFor,                   get: function (m) { return t(m.suggested); } }
  ];
  var SERIES_LABEL = {
    undersink:   { en: 'Undersink', bm: 'Bawah sinki' },
    centralized: { en: 'Centralized', bm: 'Berpusat' },
    drain:       { en: 'Oil interceptor', bm: 'Pemintas minyak' }
  };

  APP.blocks.table = function (opts) {
    opts = opts || {};
    var section = APP.blocks._band('table', opts);
    if (opts.eyebrow || opts.heading || opts.body) section.body.appendChild(bandHead(opts));

    var state = { series: 'all', meals: null };
    var trs = [];

    var thead = el('thead', null, [
      el('tr', null, TABLE_COLS.map(function (c) {
        return el('th', Object.assign({ scope: 'col' }, labelAttrs(c.label)));
      }))
    ]);
    var tbody = el('tbody');

    C.models.forEach(function (m) {
      var tr = el('tr');
      tr.dataset.model = m.model;
      tr.dataset.series = m.series;
      TABLE_COLS.forEach(function (c) {
        var text = c.get(m);
        var cell;
        if (c.link) {
          var p = PM.productByModel(m.model);
          cell = el('td', { class: 'fig', 'data-label': t(c.label) },
            p ? [el('a', { href: 'product.html?p=' + p.slug, 'data-lang-href': 'product.html?p=' + p.slug, text: text })]
              : [doc.createTextNode(text)]);
        } else {
          cell = el('td', { class: c.mono ? 'fig' : null, 'data-label': t(c.label), text: text });
        }
        tr.appendChild(cell);
      });
      trs.push(tr);
      tbody.appendChild(tr);
    });

    function apply() {
      var match = state.meals ? PM.recommendModel(state.meals) : null;
      trs.forEach(function (tr) {
        var show = state.series === 'all' || tr.dataset.series === state.series;
        tr.hidden = !show;
        tr.classList.toggle('is-match', !!(match && match.model === tr.dataset.model && show));
      });
    }

    if (opts.filters) {
      var chipRow = el('div', { class: 'chip-row', role: 'group', 'aria-label': t(S.ui.specs) });
      var chipDefs = [{ id: 'all', label: { en: 'All models', bm: 'Semua model' } }]
        .concat(Object.keys(SERIES_LABEL).map(function (k) { return { id: k, label: SERIES_LABEL[k] }; }));
      var chips = chipDefs.map(function (d) {
        var b = el('button', Object.assign({
          class: 'chip', type: 'button', 'aria-pressed': String(d.id === 'all'),
          onclick: function () {
            state.series = d.id;
            chips.forEach(function (c, i) { c.setAttribute('aria-pressed', String(chipDefs[i].id === d.id)); });
            apply();
          }
        }, labelAttrs(d.label)));
        chipRow.appendChild(b);
        return b;
      });

      /* The visible label already says "daily meals", so the placeholder is
         an example figure rather than a repeat of the label. */
      var mealInput = el('input', {
        type: 'number', min: '0', max: '20000', step: '10', class: 'meal-input',
        id: 'tbl-meals-' + (++jumpSeq), placeholder: '300'
      });
      mealInput.addEventListener('input', function () {
        var v = parseInt(mealInput.value, 10);
        state.meals = isNaN(v) || v <= 0 ? null : v;
        apply();
      });

      section.body.appendChild(el('div', { class: 'table-tools' }, [
        chipRow,
        el('div', { class: 'meal-find' }, [
          el('label', Object.assign({ class: 'cap', for: mealInput.id }, labelAttrs(S.ui.dailyMeals))),
          mealInput
        ])
      ]));
    }

    section.filter = function (o) {
      if (o && 'series' in o) state.series = o.series;
      if (o && 'meals' in o) state.meals = o.meals;
      apply();
    };
    section.rows = function () {
      return trs.filter(function (tr) { return !tr.hidden; }).map(function (tr) { return tr.dataset.model; });
    };

    section.body.appendChild(el('div', { class: 'table-wrap' }, [
      el('table', { class: 'spec-table' }, [thead, tbody])
    ]));
    apply();
    return section;
  };

  /* ------------------------------------------------------------- chassis */

  function wordmark(cls) {
    return el('a', {
      href: PM.langHref('index.html'), 'data-lang-href': 'index.html', class: cls || 'hdr-mark'
    }, [
      el('span', { class: 'hdr-mono', text: S.brand.mark, 'aria-hidden': 'true' }),
      el('span', { class: 'hdr-words' }, [
        el('span', { class: 'hdr-name', text: S.brand.name }),
        el('span', { class: 'hdr-tag', 'data-en': S.brand.tagline.en, 'data-bm': S.brand.tagline.bm,
                     text: t(S.brand.tagline) })
      ])
    ]);
  }

  /* One promoted card per dropdown group, keyed off the English label so a
     language switch cannot break the lookup. */
  var MEGA_PROMO = {
    Products:   { href: 'model-finder.html',      img: 'products/gta335-2.jpg',
                  title: { en: 'Model & Size Finder', bm: 'Pencari Model & Saiz' },
                  note:  { en: 'All 17 models, filterable', bm: 'Semua 17 model, boleh ditapis' } },
    Compliance: { href: 'approvals.html',         img: 'approvals/sirim.jpeg',
                  title: { en: 'SIRIM certified', bm: 'Diperakui SIRIM' },
                  note:  { en: 'Product certification R018/15', bm: 'Pensijilan produk R018/15' } },
    Company:    { href: 'project-gallery.html',   img: 'gallery/project-03.jpg',
                  title: { en: 'Project Gallery', bm: 'Galeri Projek' },
                  note:  { en: 'Installations across Malaysia', bm: 'Pemasangan di seluruh Malaysia' } }
  };

  function megaPanel(entry) {
    var list = el('ul', { class: 'hdr-mega-list' });
    entry.children.forEach(function (child) {
      list.appendChild(el('li', null, [APP.ui.link(child.href, child.label, 'hdr-mega-lnk')]));
    });

    var promo = MEGA_PROMO[entry.label.en];
    var kids = [list];
    if (promo) {
      kids.push(el('a', {
        class: 'hdr-mega-promo',
        href: PM.langHref(APP.ui.href(promo.href, promo.title)),
        'data-lang-href': APP.ui.href(promo.href, promo.title)
      }, [
        el('span', { class: 'frame frame--photo' }, [
          el('img', { src: A(promo.img), alt: '', loading: 'lazy' })
        ]),
        el('span', { class: 'hdr-mega-promo-t', 'data-en': promo.title.en, 'data-bm': promo.title.bm,
                     text: t(promo.title) }),
        el('span', { class: 'cap', 'data-en': promo.note.en, 'data-bm': promo.note.bm,
                     text: t(promo.note) })
      ]));
    }
    return el('div', { class: 'hdr-mega' }, kids);
  }

  function navTree() {
    var ul = el('ul', { class: 'hdr-list' });
    NAV.forEach(function (entry) {
      if (!entry.children) {
        ul.appendChild(el('li', null, [APP.ui.link(entry.href, entry.label, 'hdr-lnk')]));
        return;
      }
      var btn = el('button', {
        class: 'hdr-lnk hdr-lnk--group', type: 'button',
        'data-dropdown-btn': '', 'aria-expanded': 'false', 'aria-haspopup': 'true'
      }, [
        el('span', labelAttrs(entry.label)),
        APP.ui.icon('ph-caret-down')
      ]);
      ul.appendChild(el('li', { class: 'hdr-group', 'data-dropdown': '' }, [btn, megaPanel(entry)]));
    });
    return el('nav', { class: 'hdr-nav', 'data-nav': '', 'aria-label': 'Primary' }, [ul]);
  }

  function langToggle() {
    return el('div', { class: 'langtoggle', role: 'group', 'aria-label': 'Language' }, [
      el('button', { class: 'langbtn', type: 'button', 'data-lang-btn': 'en', text: 'EN' }),
      el('button', { class: 'langbtn', type: 'button', 'data-lang-btn': 'bm', text: 'BM' })
    ]);
  }

  /* The mobile duplicate. Groups are <details> so they need no extra JS. */
  function navSheet() {
    var inner = el('div', { class: 'sheet-in' });

    /* The open sheet covers the burger, so it carries its own close control.
       It defers to the burger rather than duplicating core's open/close
       logic, which also handles the body lock and the aria state. */
    inner.appendChild(el('div', { class: 'sheet-top' }, [
      wordmark('sheet-mark'),
      el('button', {
        class: 'sheet-close', type: 'button',
        'data-i18n-attr': 'aria-label:close', 'aria-label': t(S.ui.close),
        onclick: function () { var b = PM.qs('[data-nav-toggle]'); if (b) b.click(); }
      }, [APP.ui.icon('ph-x')])
    ]));

    NAV.forEach(function (entry) {
      if (!entry.children) {
        inner.appendChild(APP.ui.link(entry.href, entry.label, 'sheet-lnk'));
        return;
      }
      var d = el('details', { class: 'sheet-group' }, [
        el('summary', null, [el('span', labelAttrs(entry.label)), APP.ui.icon('ph-caret-down')])
      ]);
      entry.children.forEach(function (child) {
        d.appendChild(APP.ui.link(child.href, child.label, 'sheet-sub'));
      });
      inner.appendChild(d);
    });
    inner.appendChild(el('div', { class: 'sheet-foot' }, [
      langToggle(),
      APP.ui.pill({ href: 'contact.html#enquiry', label: S.ui.requestQuote, tone: 'accent' })
    ]));
    return el('div', { class: 'hdr-sheet', id: 'navsheet', 'data-nav-panel': '' }, [inner]);
  }

  APP.chassis.header = function () {
    var mount = PM.qs('[data-header]');
    if (!mount) return;
    mount.textContent = '';

    var burger = el('button', {
      class: 'hdr-burger', type: 'button', 'data-nav-toggle': '',
      'aria-expanded': 'false', 'aria-controls': 'navsheet',
      'data-i18n-attr': 'aria-label:menu', 'aria-label': t(S.ui.menu)
    }, [APP.ui.icon('ph-list')]);

    mount.appendChild(el('div', { class: 'hdr-in wrap--wide' }, [
      wordmark(),
      navTree(),
      el('div', { class: 'hdr-side' }, [
        langToggle(),
        APP.ui.pill({ href: 'contact.html#enquiry', label: S.ui.requestQuote, tone: 'accent', magnetic: true }),
        burger
      ])
    ]));
    mount.appendChild(navSheet());
    return mount;
  };

  /* --------------------------------------------------------------- footer */

  function navGroup(labelEn) {
    return NAV.filter(function (n) { return n.children && n.label.en === labelEn; })[0];
  }
  function navLeaf(labelEn) {
    return NAV.filter(function (n) { return !n.children && n.label.en === labelEn; })[0];
  }

  function footerCol(heading, entries) {
    var ul = el('ul');
    entries.forEach(function (e) {
      if (!e) return;
      ul.appendChild(el('li', null, [APP.ui.link(e.href, e.label, 'ftr-lnk')]));
    });
    return el('nav', { class: 'ftr-col', 'aria-label': heading.en }, [
      el('h4', Object.assign({ class: 'ftr-head' }, labelAttrs(heading))),
      ul
    ]);
  }

  function placeCard(place) {
    var kids = [el('h4', Object.assign({ class: 'ftr-head' }, labelAttrs(place.label)))];
    place.lines.forEach(function (line) {
      kids.push(el('p', { class: 'cap', text: line }));
    });
    return el('div', { class: 'ftr-place' }, kids);
  }

  APP.chassis.footer = function () {
    var mount = PM.qs('[data-footer]');
    if (!mount) return;
    mount.textContent = '';
    mount.appendChild(APP.ui.arc('top'));

    var products   = navGroup('Products');
    var compliance = navGroup('Compliance');
    var company    = navGroup('Company');

    var cols = el('div', { class: 'ftr-cols' }, [
      el('div', { class: 'ftr-brand' }, [
        wordmark('ftr-mark'),
        el('p', { class: 'cap', 'data-en': S.contact.coverage.en, 'data-bm': S.contact.coverage.bm,
                  text: t(S.contact.coverage) })
      ]),
      footerCol({ en: 'Products', bm: 'Produk' }, products.children),
      footerCol({ en: 'Services & Compliance', bm: 'Perkhidmatan & Pematuhan' },
                [navLeaf('Services')].concat(compliance.children)),
      footerCol({ en: 'Company', bm: 'Syarikat' }, company.children),
      footerCol({ en: 'Contact', bm: 'Hubungi' }, [navLeaf('Where To Buy'), navLeaf('Contact')])
    ]);

    var reach = el('div', { class: 'ftr-reach' }, [
      el('h4', { class: 'ftr-head', 'data-en': 'Reach us', 'data-bm': 'Hubungi kami', text: 'Reach us' }),
      el('p', { class: 'cap' }, [el('a', { class: 'ftr-lnk', href: PM.telLink(), text: S.contact.officeDisplay })]),
      el('p', { class: 'cap' }, [el('a', { class: 'ftr-lnk', href: 'tel:' + S.contact.servicePhone, text: S.contact.serviceDisplay })]),
      el('p', { class: 'cap' }, [el('a', { class: 'ftr-lnk', href: PM.waLink(), target: '_blank', rel: 'noopener', text: S.contact.whatsappDisplay })]),
      el('p', { class: 'cap' }, [el('a', { class: 'ftr-lnk', href: PM.mailLink(), text: S.contact.email })]),
      el('p', { class: 'cap', 'data-en': S.contact.hours.en, 'data-bm': S.contact.hours.bm, text: t(S.contact.hours) })
    ]);

    var addr = el('div', { class: 'ftr-addr' }, [placeCard(S.contact.hq)]
      .concat(S.contact.factories.map(placeCard))
      .concat([reach]));

    var legal = el('p', { class: 'cap ftr-legal' }, [
      doc.createTextNode('© '),
      el('span', { 'data-year': '' }),
      doc.createTextNode(' ' + S.brand.legal + ' ' + S.brand.regNo)
    ]);

    var rule = el('div', { class: 'ftr-rule' }, [
      legal,
      el('ul', { class: 'ftr-mini' }, [
        el('li', null, [APP.ui.link('policies.html', { en: 'Privacy policy', bm: 'Dasar privasi' }, 'ftr-lnk')]),
        el('li', null, [APP.ui.link('policies.html', { en: 'Terms of use', bm: 'Terma penggunaan' }, 'ftr-lnk')])
      ])
    ]);

    mount.appendChild(el('div', { class: 'wrap--wide' }, [cols, addr, rule]));
    return mount;
  };

  /* ------------------------------------------------------------- jump bar
     Breadcrumb on the left, "On this page" on the right. The trigger tracks
     the reader's position and rewrites its own label. This is the single
     element that makes an interior page read as structured rather than as
     a stack, so it is on every page except the home page.

     Called AFTER the page's blocks are in the DOM: it reads them. */
  APP.chassis.jumpbar = function (trail) {
    var old = PM.qs('.jumpbar');
    if (old) old.remove();

    var crumb = el('nav', { class: 'crumb', 'aria-label': 'Breadcrumb' });
    var list = el('ol');
    (trail || []).forEach(function (c, i, all) {
      var isLast = i === all.length - 1;
      var a = APP.ui.link(c.href, c.label);
      if (isLast) a.setAttribute('aria-current', 'page');
      list.appendChild(el('li', null, [a]));
    });
    crumb.appendChild(list);

    var bar = el('div', { class: 'jumpbar' }, [
      el('div', { class: 'wrap--wide jump-in' }, [crumb])
    ]);

    var sections = PM.qsa('#main [data-jump]');
    var current = 0;
    var label = el('span', { class: 'jump-current' });

    if (sections.length) {
      var trigger = el('button', {
        class: 'jump-trigger', type: 'button', 'aria-expanded': 'false', 'aria-haspopup': 'true'
      }, [
        el('span', Object.assign({ class: 'cap' }, labelAttrs({
          en: 'On this page:', bm: 'Pada halaman ini:'
        }))),
        label,
        APP.ui.icon('ph-caret-down')
      ]);

      var menu = el('div', { class: 'jump-menu' });
      sections.forEach(function (sec, i) {
        var a = el('a', {
          href: '#' + sec.id,
          'data-en': sec.getAttribute('data-jump-en') || sec.getAttribute('data-jump'),
          'data-bm': sec.getAttribute('data-jump-bm') || sec.getAttribute('data-jump'),
          text: sec.getAttribute('data-jump'),
          onclick: function (e) {
            e.preventDefault();
            close();
            sec.scrollIntoView({ behavior: PM.motion.reduce ? 'auto' : 'smooth', block: 'start' });
          }
        });
        menu.appendChild(a);
      });

      function close() {
        trigger.setAttribute('aria-expanded', 'false');
        bar.classList.remove('is-open');
      }
      trigger.addEventListener('click', function () {
        var open = trigger.getAttribute('aria-expanded') !== 'true';
        trigger.setAttribute('aria-expanded', String(open));
        bar.classList.toggle('is-open', open);
      });
      doc.addEventListener('click', function (e) { if (!bar.contains(e.target)) close(); });
      doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

      bar.setCurrent = function (i) {
        if (i < 0 || i >= sections.length) return;
        current = i;
        var sec = sections[i];
        setLabel(label, {
          en: sec.getAttribute('data-jump-en') || sec.getAttribute('data-jump'),
          bm: sec.getAttribute('data-jump-bm') || sec.getAttribute('data-jump')
        });
        PM.qsa('a', menu).forEach(function (a, n) {
          a.setAttribute('aria-current', n === i ? 'true' : 'false');
        });
      };
      bar.setCurrent(0);

      PM.qs('.jump-in', bar).appendChild(el('div', { class: 'jump-wrap' }, [trigger, menu]));

      /* One observer over the page's jumpable sections; whichever is nearest
         the top of the viewport is the one the reader is in. */
      if ('IntersectionObserver' in root) {
        var seen = {};
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) { seen[e.target.id] = e.isIntersecting; });
          for (var i = 0; i < sections.length; i++) {
            if (seen[sections[i].id]) { bar.setCurrent(i); break; }
          }
        }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
        sections.forEach(function (s) { io.observe(s); });
      }
    }

    var header = PM.qs('[data-header]');
    if (header && header.parentNode) header.parentNode.insertBefore(bar, header.nextSibling);
    else doc.body.insertBefore(bar, doc.body.firstChild);
    return bar;
  };


  /* ---------------------------------------------------------------- motion
     Site D deliberately does NOT call PM.motion.boot(): that would add the
     page transition wipe, the depth driver and the ambience layer, none of
     which this site uses. Only these three pieces are wanted. */
  function bootMotion() {
    var M = PM.motion;
    M.progressBar();
    M.enhance();
    PM.on('render', function () { root.setTimeout(function () { M.enhance(); }, 0); });
  }

  /* ====================================================================
     THE SECOND KIT
     Seven more blocks, added when the concept grew from seven pages to the
     full site. Same contract as the first twelve: each returns a <section>
     and appends nothing itself.
     ==================================================================== */

  /* ------------------------------------------------------- S13 the banners
     The company's own marketing banners, 1600 x 540 with the model number
     set into the artwork. They are shown at their own ratio and never
     cropped, because a crop takes a character off that number. */
  APP.blocks.banner = function (opts) {
    opts = opts || {};
    var items = opts.items || [];
    if (!items.length) return APP.blocks._band('banners', opts);

    var section = APP.blocks._band('banners', Object.assign({ wide: true }, opts));
    section.classList.add('band--banners');

    var stage = el('div', { class: 'banner-stage' });
    var slides = items.map(function (item, i) {
      var target = item.raw ? item.href : APP.ui.href(item.href, item.label);
      return el('a', {
        class: 'banner-slide',
        href: item.raw ? target : PM.langHref(target),
        'data-lang-href': item.raw ? null : target,
        hidden: i === 0 ? null : 'hidden'
      }, [
        el('img', { src: A(item.img), alt: item.alt, loading: i === 0 ? null : 'lazy' }),
        el('span', { class: 'banner-go' }, [
          el('span', labelAttrs(item.label)), APP.ui.icon('ph-arrow-right')
        ])
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

    section.body.appendChild(stage);

    if (slides.length > 1) {
      var row = el('div', { class: 'banner-dots', role: 'tablist', 'aria-label': 'Banners' });
      slides.forEach(function (_, i) {
        var d = el('button', {
          class: 'banner-dot', type: 'button', role: 'tab',
          'aria-label': 'Banner ' + (i + 1),
          'aria-current': i === 0 ? 'true' : 'false',
          onclick: function () { stop(); go(i); }
        });
        dots.push(d);
        row.appendChild(d);
      });
      section.body.appendChild(row);

      if (!PM.motion.reduce) {
        timer = root.setInterval(function () { go(idx + 1); }, opts.dwell || 6500);
        section.addEventListener('mouseenter', stop);
        section.addEventListener('focusin', stop);
      }
    }
    return section;
  };

  /* --------------------------------------------------------- S14 the docs
     Certificates, council letters, award scans and lab reports. Every one
     is a document that has to stay readable end to end, so this block never
     crops: the frame system is handed 'cert' and letterboxes onto a plate
     the same tone as the page. */
  APP.blocks.docs = function (opts) {
    opts = opts || {};
    var section = APP.blocks._band('docs', opts);
    if (opts.eyebrow || opts.heading || opts.body) section.body.appendChild(bandHead(opts));

    var grid = el('div', { class: 'doc-grid', 'data-stagger': '60' });
    grid.style.setProperty('--cols', String(opts.cols || 4));

    (opts.items || []).forEach(function (item) {
      var cap = el('figcaption', null, [
        el('b', typeof item.name === 'string' ? { text: item.name } : labelAttrs(item.name)),
        item.note ? el('span', labelAttrs(item.note)) : null,
        item.year ? el('span', { class: 'mono', text: ' ' + item.year }) : null
      ]);
      grid.appendChild(el('figure', {
        class: 'doc-item', 'data-anim': 'rise',
        'data-lightbox': A(item.img),
        'data-lightbox-alt': typeof item.name === 'string' ? item.name : t(item.name),
        'data-lightbox-cap': typeof item.name === 'string' ? item.name : t(item.name)
      }, [
        el('span', { class: 'frame frame--' + (item.frame || 'cert') }, [
          el('img', {
            src: A(item.img), loading: 'lazy',
            alt: typeof item.name === 'string' ? item.name : t(item.name)
          })
        ]),
        cap
      ]));
    });

    section.body.appendChild(grid);
    return section;
  };

  /* ------------------------------------------------------- S15 the videos
     A facade, not seven embedded players. The poster is the YouTube still
     and the iframe is only created when someone presses play, so the page
     does not pull seven third-party frames on load. */
  APP.blocks.videos = function (opts) {
    opts = opts || {};
    var all = opts.items || S.youtube;
    var section = APP.blocks._band('videos', opts);
    if (opts.eyebrow || opts.heading || opts.body) section.body.appendChild(bandHead(opts));

    var current = all[0];
    var stage = el('div', { class: 'vid-frame' });
    var title = el('h2');
    var blurb = el('p', { class: 'lead' });
    var watch = el('a', {
      class: 'pill pill--ghost', target: '_blank', rel: 'noopener'
    }, [el('span', labelAttrs({ en: 'Open on YouTube', bm: 'Buka di YouTube' })),
        APP.ui.icon('ph-arrow-up-right')]);

    var copy = el('div', { class: 'vid-copy' }, [
      APP.ui.eyebrow(opts.kicker || { en: 'Now playing', bm: 'Sedang dimainkan' }),
      title, blurb, watch
    ]);

    function poster(v, big) {
      var btn = el('button', {
        class: 'vid-poster', type: 'button',
        'aria-label': t({ en: 'Play', bm: 'Main' }) + ': ' + t(v.title)
      }, [
        el('img', { src: S.youtubeThumb(v.id), alt: t(v.title), loading: big ? null : 'lazy' }),
        el('span', { class: 'vid-play', 'aria-hidden': 'true' }, [APP.ui.icon('ph-play')]),
        v.duration ? el('span', { class: 'vid-dur', text: v.duration }) : null
      ]);
      return btn;
    }

    function feature(v, autoplay) {
      current = v;
      stage.textContent = '';
      setLabel(title, v.title);
      setLabel(blurb, v.blurb || v.title);
      watch.setAttribute('href', S.youtubeWatch(v.id));
      if (autoplay) {
        stage.appendChild(el('iframe', {
          src: S.youtubeEmbed(v.id) + '&autoplay=1',
          title: t(v.title),
          allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
          referrerpolicy: 'strict-origin-when-cross-origin',
          allowfullscreen: 'allowfullscreen'
        }));
      } else {
        var btn = poster(v, true);
        btn.addEventListener('click', function () { feature(v, true); });
        stage.appendChild(btn);
      }
      cards.forEach(function (c) {
        c.setAttribute('aria-current', c.dataset.vid === v.id ? 'true' : 'false');
      });
    }

    var cards = [];
    var grid = el('div', { class: 'vid-grid', 'data-stagger': '60' });

    function fill(list) {
      grid.textContent = '';
      cards = [];
      list.forEach(function (v) {
        var frame = el('div', { class: 'vid-frame' }, [
          el('img', { src: S.youtubeThumb(v.id), alt: t(v.title), loading: 'lazy' }),
          el('span', { class: 'vid-play', 'aria-hidden': 'true' }, [APP.ui.icon('ph-play')]),
          v.duration ? el('span', { class: 'vid-dur', text: v.duration }) : null
        ]);
        var c = el('button', {
          class: 'vid-card', type: 'button', 'data-anim': 'rise',
          'aria-current': v.id === current.id ? 'true' : 'false'
        }, [frame, el('h3', labelAttrs(v.title))]);
        c.dataset.vid = v.id;
        c.addEventListener('click', function () {
          feature(v, true);
          stage.scrollIntoView({ behavior: PM.motion.reduce ? 'auto' : 'smooth', block: 'center' });
        });
        cards.push(c);
        grid.appendChild(c);
      });
      PM.motion.enhance(grid);
    }

    section.body.appendChild(el('div', { class: 'vid-feature' }, [stage, copy]));

    if (opts.filters !== false && S.videoGroups) {
      section.body.appendChild(chipRow(
        S.videoGroups.map(function (g) { return { id: g.id, label: g.label }; }),
        function (id) {
          fill(id === 'all' ? all : all.filter(function (v) { return v.group === id; }));
        }
      ));
    }

    section.body.appendChild(grid);
    fill(all);
    feature(all.filter(function (v) { return v.featured; })[0] || all[0], false);
    return section;
  };

  /* -------------------------------------------------------- S16 the prose
     Long form copy stored as [tag, content] pairs in the data files. One
     renderer for news articles and for the policy pages, so a paragraph
     reads the same on both. */
  function proseNodes(blocks) {
    var out = [];
    (blocks || []).forEach(function (b) {
      var kind = b[0], value = b[1];
      if (kind === 'h') out.push(el('h2', { text: value }));
      else if (kind === 'h3') out.push(el('h3', { text: value }));
      else if (kind === 'ul') {
        out.push(el('ul', null, (value || []).map(function (li) {
          return el('li', { text: li });
        })));
      } else out.push(el('p', { text: value }));
    });
    return out;
  }

  APP.blocks.prose = function (opts) {
    opts = opts || {};
    var section = APP.blocks._band('prose', opts);
    if (opts.eyebrow || opts.heading || opts.body) section.body.appendChild(bandHead(opts));

    var article = el('div', { class: 'prose', 'data-anim': 'rise' });
    /* Kept on the node so a language switch can redraw it without the page
       having to remember which article it was showing. */
    function draw() {
      article.textContent = '';
      proseNodes(t(opts.blocks)).forEach(function (n) { article.appendChild(n); });
    }
    draw();
    PM.on('langchange', draw);

    section.body.appendChild(article);
    return section;
  };

  /* ---------------------------------------------------------- S17 the FAQ */
  APP.blocks.faq = function (opts) {
    opts = opts || {};
    var section = APP.blocks._band('faq', opts);
    if (opts.eyebrow || opts.heading || opts.body) section.body.appendChild(bandHead(opts));

    var list = el('div', { class: 'faq' });
    (opts.items || S.faq).forEach(function (f, i) {
      var id = 'faq-' + (opts.key || 'x') + '-' + i;
      var panel = el('div', {
        class: 'faq-a', id: id, hidden: i === 0 ? null : 'hidden'
      }, [el('p', labelAttrs(f.a))]);
      var btn = el('button', {
        class: 'faq-q', type: 'button',
        'aria-expanded': i === 0 ? 'true' : 'false', 'aria-controls': id
      }, [el('span', labelAttrs(f.q)), APP.ui.icon('ph-plus')]);
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        panel.hidden = open;
      });
      list.appendChild(el('div', { class: 'faq-item', 'data-anim': 'rise' }, [btn, panel]));
    });

    section.body.appendChild(list);
    if (opts.more) {
      section.body.appendChild(el('div', { class: 'faq-more' }, [
        APP.ui.pill({ href: opts.more.href, label: opts.more.label, tone: 'ghost' })
      ]));
    }
    return section;
  };

  /* ------------------------------------------------------ S18 the listing
     Columns of named rows: the dealer network, the download shelf, the
     open roles. A table would imply the columns line up across the page,
     and they do not. */
  APP.blocks.listing = function (opts) {
    opts = opts || {};
    var section = APP.blocks._band('listing', opts);
    if (opts.eyebrow || opts.heading || opts.body) section.body.appendChild(bandHead(opts));

    var cols = el('div', { class: 'list-cols' });
    cols.style.setProperty('--cols', String(opts.cols || 2));

    (opts.groups || []).forEach(function (g) {
      var rows = el('div', { class: 'list-rows' });
      (g.rows || []).forEach(function (r) {
        rows.appendChild(el(r.href ? 'a' : 'div', Object.assign(
          { class: 'list-row' },
          r.href ? { href: r.raw ? r.href : PM.langHref(APP.ui.href(r.href, r.name)) } : {},
          r.target ? { target: r.target, rel: 'noopener' } : {}
        ), [
          el('b', typeof r.name === 'string' ? { text: r.name } : labelAttrs(r.name)),
          r.note ? el('span', typeof r.note === 'string' ? { text: r.note } : labelAttrs(r.note)) : null,
          r.meta ? el('span', { class: 'mono', text: r.meta }) : null
        ]));
      });
      cols.appendChild(el('div', { class: 'list-block', 'data-anim': 'rise' }, [
        g.title ? el('h3', typeof g.title === 'string' ? { text: g.title } : labelAttrs(g.title)) : null,
        g.note ? el('p', Object.assign({ class: 'cap' }, labelAttrs(g.note))) : null,
        rows
      ]));
    });

    section.body.appendChild(cols);
    return section;
  };

  /* ---------------------------------------------------- S19 the gallery
     The project plates. Each one is a composite sheet with the site name
     printed into the picture, so the grid shows them whole and the
     lightbox opens the full file. */
  APP.blocks.gallery = function (opts) {
    opts = opts || {};
    var section = APP.blocks._band('gallery', opts);
    if (opts.eyebrow || opts.heading || opts.body) section.body.appendChild(bandHead(opts));

    var grid = el('div', { class: 'doc-grid', 'data-stagger': '50' });
    grid.style.setProperty('--cols', String(opts.cols || 4));

    (opts.items || []).forEach(function (item, i) {
      /* A caption given as an {en, bm} pair follows the language switch;
         a plain alt string is fixed at render, as the archive plates are. */
      var label = item.alt || (item.caption ? t(item.caption) :
        (t({ en: 'Installation record ', bm: 'Rekod pemasangan ' }) + String(i + 1).padStart(2, '0')));
      grid.appendChild(el('figure', {
        class: 'doc-item', 'data-anim': 'rise',
        'data-lightbox': A(item.full || item.img),
        'data-lightbox-alt': label,
        'data-lightbox-cap': label
      }, [
        el('span', { class: 'frame frame--' + (item.frame || 'sheet') }, [
          el('img', { src: A(item.img), alt: label, loading: 'lazy' })
        ]),
        el('figcaption', null, [
          item.kicker ? el('span', { class: 'mono doc-kicker', text: item.kicker }) : null,
          el('b', item.caption ? labelAttrs(item.caption) : { text: label })
        ])
      ]));
    });

    section.body.appendChild(grid);
    return section;
  };

  /* ====================================================================
     THE THIRD KIT
     Five more, for the October material: a tabbed problem and fix, a row
     of numbered steps, a published data table, a shelf of PDFs, and a
     product range with filters. Same contract: each returns a <section>.
     ==================================================================== */

  /* Full-size and display-size versions of a supplied sheet. */
  function sheetSrc(base, small) { return base + (small ? '-sm.webp' : '.webp'); }

  /* A sheet thumbnail that opens full size in the shared lightbox. */
  function sheetFigure(sheet, cls) {
    var title = t(sheet.title);
    return el('figure', {
      class: cls || 'iss-sheet',
      'data-lightbox': A(sheetSrc(sheet.img)),
      'data-lightbox-alt': title,
      'data-lightbox-cap': title
    }, [
      el('img', { src: A(sheetSrc(sheet.img, true)), alt: title, loading: 'lazy' }),
      el('figcaption', null, [
        APP.ui.icon('ph-magnifying-glass-plus'),
        el('span', labelAttrs(sheet.title))
      ])
    ]);
  }

  function checkList(pair, cls) { return bilingualList(pair, cls || 'ticks'); }

  /* ----------------------------------------------------- S20 the issues
     One tab per kind of trap. Each panel puts what goes wrong beside the
     client's own sheet for it, then why, then the fix with a way to buy
     it. Arrow keys move between tabs, as a tablist should. */
  APP.blocks.issues = function (opts) {
    opts = opts || {};
    var items = opts.items || L.issues || [];
    var section = APP.blocks._band('issues', opts);
    if (opts.eyebrow || opts.heading || opts.body) section.body.appendChild(bandHead(opts));

    var uid = ++jumpSeq;
    var tabs = [], panels = [];
    var list = el('div', { class: 'iss-tabs', role: 'tablist', 'aria-label': t(opts.heading || { en: 'Common issues', bm: 'Masalah biasa' }) });

    items.forEach(function (it, i) {
      var tabId = 'iss-tab-' + uid + '-' + i;
      var panelId = 'iss-panel-' + uid + '-' + i;

      var tab = el('button', {
        class: 'iss-tab', type: 'button', role: 'tab', id: tabId,
        'aria-controls': panelId, 'aria-selected': 'false', tabindex: '-1'
      }, [
        el('span', { class: 'iss-letter fig', text: it.letter }),
        el('span', { class: 'iss-tab-copy' }, [
          el('span', Object.assign({ class: 'iss-tab-kicker' }, labelAttrs({
            en: 'Common issue ' + it.letter, bm: 'Masalah biasa ' + it.letter
          }))),
          el('span', Object.assign({ class: 'iss-tab-title' }, labelAttrs(it.title)))
        ])
      ]);
      tab.addEventListener('click', function () { select(i); });
      tabs.push(tab);
      list.appendChild(tab);

      var complaints = el('ul', { class: 'iss-complaints' }, (it.complaints || []).map(function (c) {
        return el('li', null, [APP.ui.icon('ph-warning-circle'), el('span', labelAttrs(c))]);
      }));

      var links = el('div', { class: 'iss-links' }, (it.links || []).map(function (l, n) {
        return APP.ui.pill({ href: l.href, label: l.label, tone: n === 0 ? 'accent' : 'ghost' });
      }));

      var more = (it.more || []).length ? el('div', { class: 'iss-more' }, [
        el('p', Object.assign({ class: 'cap iss-more-h' }, labelAttrs({ en: 'The solution sheets', bm: 'Helaian penyelesaian' }))),
        el('div', { class: 'iss-more-row' }, it.more.map(function (s) { return sheetFigure(s, 'iss-thumb'); }))
      ]) : null;

      var panel = el('div', {
        class: 'iss-panel', role: 'tabpanel', id: panelId,
        'aria-labelledby': tabId, tabindex: '0', hidden: 'hidden'
      }, [
        el('div', { class: 'iss-copy' }, [
          APP.ui.eyebrow({ en: 'Common issue ' + it.letter, bm: 'Masalah biasa ' + it.letter }),
          el('h3', Object.assign({ class: 'iss-title' }, labelAttrs(it.title))),
          el('p', Object.assign({ class: 'lead' }, labelAttrs(it.summary))),
          complaints,
          el('div', { class: 'iss-cols' }, [
            el('div', null, [
              el('h4', labelAttrs({ en: 'Why it happens', bm: 'Mengapa ia berlaku' })),
              bilingualList(it.why, 'bullets iss-why')
            ]),
            el('div', null, [
              el('h4', labelAttrs({ en: 'What fixes it', bm: 'Apa penyelesaiannya' })),
              checkList(it.fix, 'ticks')
            ])
          ]),
          links
        ]),
        el('div', { class: 'iss-media' }, [sheetFigure(it.sheet), more])
      ]);
      panels.push(panel);
    });

    function select(i, focus) {
      i = ((i % items.length) + items.length) % items.length;
      tabs.forEach(function (tab, n) {
        tab.setAttribute('aria-selected', String(n === i));
        tab.setAttribute('tabindex', n === i ? '0' : '-1');
        panels[n].hidden = n !== i;
      });
      if (focus) tabs[i].focus();
    }

    list.addEventListener('keydown', function (e) {
      var at = tabs.indexOf(e.target);
      if (at === -1) return;
      var next = null;
      if (e.key === 'ArrowRight') next = at + 1;
      else if (e.key === 'ArrowLeft') next = at - 1;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = tabs.length - 1;
      if (next === null) return;
      e.preventDefault();
      select(next, true);
    });

    section.select = select;
    section.body.appendChild(list);
    panels.forEach(function (p) { section.body.appendChild(p); });
    if (items.length) select(0);
    return section;
  };

  /* ------------------------------------------------------- S21 the steps
     A row of numbered cards, for a sequence the reader should take in
     order: how the interceptor works, how the service runs, how to tell
     what a waste oil is worth. */
  APP.blocks.steps = function (opts) {
    opts = opts || {};
    var items = opts.items || [];
    var section = APP.blocks._band('steps', opts);
    if (opts.eyebrow || opts.heading || opts.body) section.body.appendChild(bandHead(opts));

    var row = el('ol', { class: 'step-row', 'data-stagger': '70' });
    row.style.setProperty('--cols', String(Math.min(items.length, opts.cols || 4)));
    items.forEach(function (it, i) {
      row.appendChild(el('li', { class: 'step-card' + (it.tone ? ' step-card--' + it.tone : ''), 'data-anim': 'rise' }, [
        el('span', { class: 'fig step-num', 'aria-hidden': 'true', text: String(i + 1).padStart(2, '0') }),
        el('h3', Object.assign({ class: 'step-title' }, labelAttrs(it.title))),
        it.body ? el('p', Object.assign({ class: 'cap step-body' }, labelAttrs(it.body))) : null,
        it.answer ? el('p', Object.assign({ class: 'step-answer step-answer--' + (it.verdict || 'none') }, labelAttrs(it.answer))) : null
      ]));
    });
    section.body.appendChild(row);
    if (opts.note) section.body.appendChild(el('p', Object.assign({ class: 'cap block-note' }, labelAttrs(opts.note))));
    return section;
  };

  /* --------------------------------------------------- S22 the data table
     A published table that is not the model sheet: the GTASP range, the
     waste oil codes, the offences. Columns name a key or a getter; a cell
     may be a string, an {en, bm} pair or a node. The first column is the
     row header. Below 720px the shared table styles turn each row into a
     labelled card. */
  APP.blocks.datatable = function (opts) {
    opts = opts || {};
    var cols = opts.columns || [];
    var section = APP.blocks._band('datatable', opts);
    if (opts.eyebrow || opts.heading || opts.body) section.body.appendChild(bandHead(opts));
    if (opts.before) section.body.appendChild(opts.before);

    var head = el('tr', null, cols.map(function (c) {
      return el('th', Object.assign({ scope: 'col' }, labelAttrs(c.label)));
    }));
    var body = el('tbody');
    (opts.rows || []).forEach(function (row) {
      var tr = el('tr', row.serious ? { class: 'is-serious' } : null);
      cols.forEach(function (c, n) {
        var v = c.get ? c.get(row) : row[c.key];
        var attrs = { class: c.mono ? 'fig' : null, 'data-label': t(c.label) };
        if (n === 0) attrs.scope = 'row';
        var cell;
        if (v && v.nodeType) cell = el(n === 0 ? 'th' : 'td', attrs, [v]);
        else cell = el(n === 0 ? 'th' : 'td', Object.assign(attrs, labelAttrs(v === undefined || v === null ? '' : (typeof v === 'number' ? String(v) : v))));
        tr.appendChild(cell);
      });
      body.appendChild(tr);
    });

    section.body.appendChild(el('div', { class: 'table-wrap', 'data-anim': 'rise' }, [
      el('table', { class: 'spec-table data-table' + (opts.wide ? ' data-table--wide' : '') }, [
        el('thead', null, [head]), body
      ])
    ]));
    (opts.notes || []).forEach(function (note) {
      section.body.appendChild(el('p', Object.assign({ class: 'cap block-note' }, labelAttrs(note))));
    });
    return section;
  };

  /* ------------------------------------------------- S23 the document shelf
     One card per model, carrying that model's PDFs. The thumbnail is the
     document's own first page. Series chips filter the shelf in place, so
     the heading and the scroll position stay where they are. */
  APP.blocks.docshelf = function (opts) {
    opts = opts || {};
    var kinds = opts.kinds || ['catalogue', 'drawing'];
    var models = opts.models || L.documents || [];
    var section = APP.blocks._band('docshelf', opts);
    if (opts.eyebrow || opts.heading || opts.body) section.body.appendChild(bandHead(opts));

    var grid = el('div', { class: 'dl-grid' + (opts.compact ? ' dl-grid--compact' : '') });
    var cards = [];
    models.forEach(function (m) {
      var docs = kinds.map(function (k) { return APP.data.doc(k + '-' + m.model.toLowerCase()); })
        .filter(Boolean);
      if (!docs.length) return;
      var lead = docs[0];
      /* The thumbnail is a pointer shortcut to the first document. It is
         hidden from assistive tech because the button below says the same. */
      var thumb = el('span', { class: 'dl-thumb dl-thumb--' + lead.kind, 'aria-hidden': 'true' }, [
        el('img', { src: docUrl(lead.thumb), alt: '', loading: 'lazy' })
      ]);
      thumb.addEventListener('click', function () { APP.ui.docViewer.open(lead); });
      var card = el('article', { class: 'dl-card', 'data-series': m.series }, [
        thumb,
        el('div', { class: 'dl-body' }, [
          el('p', Object.assign({ class: 'cap dl-series' }, labelAttrs(SERIES_LABEL[m.series] || m.series))),
          el('h3', { class: 'dl-model fig', text: m.model }),
          el('div', { class: 'dl-actions' }, docs.map(APP.ui.docLink))
        ])
      ]);
      cards.push(card);
      grid.appendChild(card);
    });

    if (opts.filters) {
      var present = Object.keys(SERIES_LABEL).filter(function (k) {
        return models.some(function (m) { return m.series === k; });
      });
      section.body.appendChild(chipRow(
        [{ id: 'all', label: { en: 'All models', bm: 'Semua model' } }].concat(present.map(function (k) {
          return { id: k, label: SERIES_LABEL[k] };
        })),
        function (id) {
          cards.forEach(function (c) { c.hidden = id !== 'all' && c.getAttribute('data-series') !== id; });
        }
      ));
    }
    section.body.appendChild(grid);
    return section;
  };

  /* ---------------------------------------------------- S24 the range
     A product line sold by the container rather than by the model: one
     card each, artwork shown whole, capacity and dilution set in type, and
     a WhatsApp price request that names the product. */
  APP.blocks.range = function (opts) {
    opts = opts || {};
    var items = opts.items || [];
    var groups = opts.groups || [];
    var section = APP.blocks._band('range', opts);
    if (opts.eyebrow || opts.heading || opts.body) section.body.appendChild(bandHead(opts));

    var grid = el('div', { class: 'rng-grid' });
    var cards = items.map(function (it) {
      var name = it.brand ? it.brand + ' ' + it.name : it.name;
      var wa = PM.waLink(PM.lang === 'bm'
        ? 'Salam, saya ingin harga untuk ' + name + '.'
        : 'Hello, I would like a price for ' + name + '.');
      var card = el('article', { class: 'rng-card', 'data-group': it.group }, [
        el('figure', {
          class: 'rng-art', 'data-lightbox': A(it.img),
          'data-lightbox-alt': name, 'data-lightbox-cap': name
        }, [el('img', { src: A(it.img), alt: name, loading: 'lazy' })]),
        el('div', { class: 'rng-body' }, [
          el('p', { class: 'rng-num fig', text: String(it.n).padStart(2, '0') }),
          el('h3', { class: 'rng-name', text: it.name }),
          el('p', Object.assign({ class: 'cap rng-use' }, labelAttrs(it.use))),
          el('dl', { class: 'rng-spec' }, [
            el('dt', Object.assign({ class: 'cap' }, labelAttrs(S.ui.capacity))),
            el('dd', { class: 'fig', text: it.capacity }),
            el('dt', Object.assign({ class: 'cap' }, labelAttrs({ en: 'Dilution', bm: 'Pencairan' }))),
            el('dd', labelAttrs(it.dilution))
          ]),
          el('a', { class: 'rng-ask', href: wa, target: '_blank', rel: 'noopener' }, [
            el('span', labelAttrs(S.ui.requestPrice)), APP.ui.icon('ph-whatsapp-logo')
          ])
        ])
      ]);
      grid.appendChild(card);
      return card;
    });

    if (groups.length) {
      var count = el('p', { class: 'cap rng-count', 'aria-live': 'polite' });
      var paint = function (n) {
        setLabel(count, { en: n + ' products', bm: n + ' produk' });
      };
      section.body.appendChild(el('div', { class: 'rng-tools' }, [
        chipRow(
          [{ id: 'all', label: { en: 'All', bm: 'Semua' } }].concat(groups.map(function (g) {
            return { id: g.id, label: g.label };
          })),
          function (id) {
            var n = 0;
            cards.forEach(function (c) {
              c.hidden = id !== 'all' && c.getAttribute('data-group') !== id;
              if (!c.hidden) n++;
            });
            paint(n);
          }
        ),
        count
      ]));
      paint(cards.length);
    }

    section.body.appendChild(grid);
    return section;
  };

  /* ====================================================================
     THE PAGES
     Each renderer appends its blocks to #main in order. Interior pages call
     APP.chassis.jumpbar LAST, because the bar reads the blocks it lists.
     ==================================================================== */

  function main() { return PM.qs('#main'); }
  function add(node) { main().appendChild(node); return node; }

  function formatDate(iso) {
    var d = new Date(iso + 'T00:00:00');
    if (isNaN(d)) return iso;
    return d.toLocaleDateString(PM.lang === 'bm' ? 'ms-MY' : 'en-GB',
      { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function cat(id) {
    return C.categories.filter(function (c) { return c.id === id; })[0];
  }

  /* The field sheets: model and site, as printed across the top of each. */
  function fieldCaption(f) {
    return f.model
      ? { en: f.model + ' · ' + f.site.en, bm: f.model + ' · ' + f.site.bm }
      : f.site;
  }

  /* The home rail leads with sheets that name a model: a product seen in
     the ground says more than a site name alone. */
  function fieldItems(n) {
    return (L.field || []).filter(function (f) {
      return f.model && f.img.indexOf('gallery/') === 0;
    }).slice(0, n).map(function (f) {
      return {
        href: 'project-gallery.html', img: f.img, frame: 'report',
        alt: t(fieldCaption(f)), kicker: f.model || null, title: f.site
      };
    });
  }

  /* An FAQ entry from the library: a reference into SITE.faq, or its own
     question and answer. */
  function faqEntry(item) {
    return item.ref !== undefined ? S.faq[item.ref] : item;
  }

  function faqById(id) {
    var hit = null;
    (L.faqTopics || []).forEach(function (topic) {
      topic.items.forEach(function (item) { if (item.id === id) hit = faqEntry(item); });
    });
    return hit;
  }

  function newsItems() {
    return S.news.map(function (a) {
      return {
        href: 'article.html?a=' + a.slug, img: a.img, alt: t(a.title),
        kicker: formatDate(a.date), title: a.title, meta: a.excerpt
      };
    });
  }

  function serviceTiles(n) {
    return C.services.slice(0, n).map(function (s) {
      return {
        href: 'service.html?s=' + s.slug, img: s.img, alt: t(s.name),
        label: s.name, note: s.short
      };
    });
  }

  function categoryTiles() {
    return C.categories.map(function (c) {
      /* Whether a category image is plated or bled is decided by the file,
         not by a flag beside it: the catalogue's own `fit` had two of these
         the wrong way round. */
      return {
        href: c.href, img: c.img, alt: t(c.name), label: c.name, note: c.blurb
      };
    });
  }

  var HOME_CTA = {
    heading: { en: 'Tell us your meal volume and we will size it for you.',
               bm: 'Beritahu kami jumlah hidangan anda dan kami akan menentukan saiznya.' },
    body: { en: 'Send the kitchen layout and daily covers. You get the model, the dimensions and a price the same day.',
            bm: 'Hantar susun atur dapur dan jumlah hidangan harian. Anda akan menerima model, dimensi dan harga pada hari yang sama.' },
    primary: { href: 'contact.html#enquiry', label: S.ui.requestQuote },
    whatsapp: true
  };

  APP.pages.home = function () {
    var gt = cat('grease-trap'), adu = cat('auto-dosing'), bio = cat('bio-enzyme');

    /* 1 - the rotating product hero */
    add(APP.blocks.hero({
      dwell: 7000,
      slides: [
        { eyebrow: gt.name,
          heading: { en: 'Seventeen models, one job', bm: 'Tujuh belas model, satu tugas' },
          body: gt.blurb, img: 'products/gta335-1.webp',
          alt: t({ en: 'The GTA335 centralized grease trap, 35 GPM, 189 litre capacity',
                   bm: 'Perangkap minyak berpusat GTA335, 35 GPM, kapasiti 189 liter' }),
          cta: { href: 'grease-traps.html', label: { en: 'See the range', bm: 'Lihat rangkaian' } } },
        { eyebrow: adu.name,
          heading: { en: 'Dosed every night, automatically', bm: 'Didos setiap malam, secara automatik' },
          body: adu.blurb, img: 'products/adu9291p-1.webp',
          alt: t({ en: 'The ADU9291P auto dosing unit with its timer and battery vault',
                   bm: 'Unit dos automatik ADU9291P dengan pemasa dan ruang bateri' }),
          cta: { href: 'auto-dosing.html', label: { en: 'How it works', bm: 'Cara ia berfungsi' } } },
        { eyebrow: bio.name,
          heading: { en: 'Fat becomes water and carbon dioxide',
                     bm: 'Lemak menjadi air dan karbon dioksida' },
          body: bio.blurb, img: 'products/goodbac-5l.webp',
          alt: t({ en: 'A five litre GoodBac bio-enzyme container',
                   bm: 'Bekas bio-enzim GoodBac lima liter' }),
          cta: { href: 'bio-enzyme.html', label: { en: 'Dosing calculator', bm: 'Kalkulator dos' } } }
      ],
      links: [
        { href: 'grease-traps.html', label: gt.name },
        { href: 'auto-dosing.html', label: adu.name },
        { href: 'model-finder.html', label: { en: 'Model & Size Finder', bm: 'Pencari Model & Saiz' } }
      ]
    }));

    /* 2 - the company's own banners, shown whole */
    add(APP.blocks.banner({
      items: [
        { img: 'brand/banner-oil-interceptor.jpg',
          href: 'grease-traps.html',
          label: { en: 'Oil interceptors', bm: 'Pemintas minyak' },
          alt: t({ en: 'Oil Interceptor GTA9001: high separation efficiency, sturdy and corrosion resistant, low maintenance and easy to install, for petrol stations and car washes',
                   bm: 'Pemintas Minyak GTA9001: kecekapan pemisahan tinggi, kukuh dan tahan karat, penyelenggaraan rendah dan mudah dipasang, untuk stesen minyak dan cucian kereta' }) },
        { img: 'brand/banner-auto-dosing.jpg',
          href: 'auto-dosing.html',
          label: { en: 'Auto dosing units', bm: 'Unit dos automatik' },
          alt: t({ en: 'ADU 9291P auto dosing unit: programmable dosing time, consistent dosing, IP66 waterproof, thunder strike protection, one year warranty',
                   bm: 'Unit dos automatik ADU 9291P: masa dos boleh diprogram, dos konsisten, kalis air IP66, perlindungan panahan petir, waranti satu tahun' }) }
      ]
    }));

    /* 3 - the published figures */
    add(APP.blocks.figures({ set: 'trust', tone: 'wash' }));

    /* 3 - the statement */
    add(APP.blocks.statement({
      text: { en: 'We manufacture the trap, we install it, and we service it. One company answers for all three.',
              bm: 'Kami mengeluarkan perangkap, kami memasangnya, dan kami menyelenggarakannya. Satu syarikat bertanggungjawab untuk ketiga-tiganya.' },
      emphasis: ['manufacture', 'install', 'service'],
      emphasisBm: ['mengeluarkan', 'memasangnya', 'menyelenggarakannya']
    }));

    /* 4 - what we do */
    add(APP.blocks.expander({
      eyebrow: { en: 'What we do', bm: 'Apa yang kami lakukan' },
      heading: { en: 'From the factory floor to the kitchen drain',
                 bm: 'Dari lantai kilang ke longkang dapur' },
      cols: 4,
      items: [
        { num: '01', title: { en: 'Manufacturing', bm: 'Pembuatan' },
          img: 'news/factory.webp',
          alt: t({ en: 'The factory floor where the traps are fabricated',
                   bm: 'Lantai kilang tempat perangkap difabrikasi' }),
          body: { en: 'Every trap is built in our own factories in Rawang and Cheng, in 304 stainless steel or reinforced fibreglass, and rated for wastewater above 100 degrees Celsius.',
                  bm: 'Setiap perangkap dibina di kilang kami sendiri di Rawang dan Cheng, dalam keluli tahan karat 304 atau gentian kaca diperkukuh, dan dinilai untuk air sisa melebihi 100 darjah Celsius.' },
          cta: { href: 'about.html', label: { en: 'Company profile', bm: 'Profil syarikat' } } },
        { num: '02', title: { en: 'Sizing', bm: 'Penentuan saiz' },
          img: 'products/gta335-3.jpg',
          alt: t({ en: 'A centralized trap sized for a canteen line',
                   bm: 'Perangkap berpusat disaiz untuk barisan kantin' }),
          body: { en: 'Meal volume decides the model. Seventeen sizes run from 15 GPM under a single sink to 500 GPM under a food factory, and each one has a published capacity you can check.',
                  bm: 'Jumlah hidangan menentukan model. Tujuh belas saiz bermula dari 15 GPM di bawah satu sinki hingga 500 GPM di bawah kilang makanan, dan setiap satu mempunyai kapasiti terbitan yang boleh anda semak.' },
          cta: { href: 'model-finder.html', label: { en: 'Model & size finder', bm: 'Pencari model & saiz' } } },
        { num: '03', title: { en: 'Installation', bm: 'Pemasangan' },
          img: 'install/step-1.jpg',
          alt: t({ en: 'An undersink trap being positioned during installation',
                   bm: 'Perangkap bawah sinki diletakkan semasa pemasangan' }),
          body: { en: 'Position, set the fall, connect inlet and outlet, seal, prime with water, commission. Three steps, done in an afternoon, with the kitchen team briefed before we leave.',
                  bm: 'Letakkan, tetapkan kecerunan, sambungkan salur masuk dan keluar, kedapkan, isi dengan air, tauliahkan. Tiga langkah, siap dalam satu petang, dengan pasukan dapur ditaklimatkan sebelum kami pergi.' },
          cta: { href: 'installation-guide.html', label: { en: 'Installation guide', bm: 'Panduan pemasangan' } } },
        { num: '04', title: { en: 'Servicing', bm: 'Penyelenggaraan' },
          img: 'service/sewerage-1.webp',
          alt: t({ en: 'A service crew clearing a manhole',
                   bm: 'Kru servis membersihkan lurang' }),
          body: { en: 'Scheduled pump-out, chamber wash, inlet and outlet inspection, and the waste removed under documentation for your compliance file.',
                  bm: 'Pengepaman berjadual, cucian ruang, pemeriksaan salur masuk dan keluar, dan sisa dibuang dengan dokumentasi untuk fail pematuhan anda.' },
          cta: { href: 'services.html', label: { en: 'Our services', bm: 'Perkhidmatan kami' } } }
      ]
    }));

    /* 5 - the sizer */
    add(APP.blocks.sizer({ tone: 'wash' }));

    /* 6 - the four categories */
    add(APP.blocks.tiles({
      eyebrow: { en: 'What we make', bm: 'Apa yang kami buat' },
      heading: { en: 'Four product lines', bm: 'Empat barisan produk' },
      cols: 4, items: categoryTiles()
    }));

    /* 7 - projects, from the field sheets */
    add(APP.blocks.carousel({
      eyebrow: { en: 'Where they are', bm: 'Di mana ia berada' },
      heading: { en: 'Installed across Malaysia', bm: 'Dipasang di seluruh Malaysia' },
      items: fieldItems(8),
      moreLabel: { en: 'View the gallery', bm: 'Lihat galeri' }
    }));

    /* 8 - the quote */
    add(APP.blocks.quote({
      text: { en: 'Fat floats, water passes, solids sink. Everything we build is that one fact, engineered to a published capacity.',
              bm: 'Lemak terapung, air lalu, pepejal tenggelam. Semua yang kami bina adalah fakta tunggal itu, direkayasa mengikut kapasiti terbitan.' },
      name: S.brand.legal,
      role: { en: 'Manufacturing since 1996', bm: 'Mengeluarkan sejak 1996' }
    }));

    /* 9a - the channel */
    add(APP.blocks.videos({
      jump: { en: 'Video', bm: 'Video' },
      eyebrow: { en: 'On film', bm: 'Dalam filem' },
      heading: { en: 'Made here, fitted here, cleaned here',
                 bm: 'Dibuat di sini, dipasang di sini, dibersihkan di sini' },
      filters: false,
      items: S.youtube.slice(0, 3)
    }));

    /* 9 - services */
    add(APP.blocks.tiles({
      tone: 'wash',
      eyebrow: { en: 'What we do next', bm: 'Apa yang kami lakukan seterusnya' },
      heading: { en: 'Service that keeps it working', bm: 'Servis yang memastikan ia berfungsi' },
      cols: 3, items: serviceTiles(3)
    }));

    /* 10 - compliance figures */
    add(APP.blocks.figures({
      set: 'compliance', tone: 'navy',
      eyebrow: { en: 'Compliance', bm: 'Pematuhan' },
      heading: { en: 'Certified, approved, and on record', bm: 'Diperakui, diluluskan dan direkodkan' }
    }));

    /* 11 - news */
    add(APP.blocks.carousel({
      eyebrow: { en: 'From the workshop', bm: 'Dari bengkel' },
      heading: { en: 'Technical notes', bm: 'Nota teknikal' },
      items: newsItems(),
      moreLabel: S.ui.readMore
    }));

    /* 12 - the questions asked before almost every order */
    add(APP.blocks.faq({
      key: 'home',
      eyebrow: { en: 'FAQs', bm: 'Soalan lazim' },
      heading: { en: 'Asked before almost every order', bm: 'Ditanya sebelum hampir setiap pesanan' },
      items: (L.faqHome || []).map(faqById).filter(Boolean),
      more: { href: 'faq.html', label: { en: 'See all FAQs', bm: 'Lihat semua soalan lazim' } }
    }));

    /* 13 - the call to action */
    add(APP.blocks.cta(HOME_CTA));
  };

  /* ------------------------------------------------------- shared pieces */

  var CRUMB_HOME = { href: 'index.html', label: { en: 'Home', bm: 'Utama' } };
  var CRUMB_PRODUCTS = { href: 'grease-traps.html', label: { en: 'Products', bm: 'Produk' } };

  /* Product artwork is a marketing composite as often as it is a photograph.
     The cardart frame was built for exactly that mix: one card height either
     way, shown whole on a white plate. */
  function productTile(p) {
    return {
      href: 'product.html?p=' + p.slug, img: p.images[0], alt: t(p.name),
      label: p.name, note: p.short, plate: true, frame: 'cardart'
    };
  }

  function chipRow(defs, onPick) {
    var row = el('div', { class: 'chip-row', role: 'group' });
    var buttons = defs.map(function (d, i) {
      var b = el('button', Object.assign({
        class: 'chip', type: 'button', 'aria-pressed': String(i === 0),
        onclick: function () {
          buttons.forEach(function (x, n) { x.setAttribute('aria-pressed', String(n === i)); });
          onPick(d.id);
        }
      }, labelAttrs(d.label)));
      row.appendChild(b);
      return b;
    });
    return row;
  }

  var SEPARATION_ITEMS = [
    { num: '01', title: { en: 'Solids settle', bm: 'Pepejal mendap' },
      img: 'install/step-1.jpg',
      alt: t({ en: 'The first chamber of a grease trap during installation',
               bm: 'Ruang pertama perangkap minyak semasa pemasangan' }),
      body: { en: 'Wastewater enters the first chamber and slows down. Food solids are heavier than water, so they drop out of the flow and collect at the bottom where the screen basket can lift them out.',
              bm: 'Air sisa memasuki ruang pertama dan perlahan. Pepejal makanan lebih berat daripada air, jadi ia jatuh dari aliran dan terkumpul di dasar di mana bakul penapis boleh mengangkatnya keluar.' } },
    { num: '02', title: { en: 'Fat floats', bm: 'Lemak terapung' },
      img: 'install/step-2.jpg',
      alt: t({ en: 'The baffle between the second and third chambers',
               bm: 'Sekatan antara ruang kedua dan ketiga' }),
      body: { en: 'Fats, oils and grease are lighter than water. In the second chamber they rise and are held behind a baffle, which is the layer your service team pumps out on schedule.',
              bm: 'Lemak, minyak dan gris lebih ringan daripada air. Di ruang kedua ia naik dan tertahan di belakang sekatan, iaitu lapisan yang dipam keluar oleh pasukan servis anda mengikut jadual.' } },
    { num: '03', title: { en: 'Water leaves', bm: 'Air keluar' },
      img: 'install/step-3.jpg',
      alt: t({ en: 'The outlet of a commissioned grease trap',
               bm: 'Salur keluar perangkap minyak yang ditauliahkan' }),
      body: { en: 'The third chamber draws from below the floating layer, so what reaches the drain is water rather than grease. That is the whole mechanism, and every model is the same idea at a different capacity.',
              bm: 'Ruang ketiga menarik dari bawah lapisan terapung, jadi apa yang sampai ke longkang adalah air dan bukan gris. Itulah keseluruhan mekanismenya, dan setiap model adalah idea yang sama pada kapasiti berbeza.' } }
  ];

  /* ------------------------------------------------------- Grease Traps */
  APP.pages.greaseTraps = function () {
    var gt = cat('grease-trap');
    var all = PM.productsBy('grease-trap');

    add(APP.blocks.hero({
      eyebrow: { en: 'Products', bm: 'Produk' },
      heading: gt.name, body: gt.blurb,
      img: 'products/gta335-2.jpg',
      alt: t({ en: 'A centralized grease trap installed on site',
               bm: 'Perangkap minyak berpusat dipasang di tapak' }),
      cta: { href: 'model-finder.html', label: { en: 'Find your model', bm: 'Cari model anda' } }
    }));

    add(APP.blocks.lead({
      jump: { en: 'Introduction', bm: 'Pengenalan' },
      eyebrow: { en: 'The range', bm: 'Rangkaian' },
      heading: { en: 'Three families, seventeen sizes', bm: 'Tiga keluarga, tujuh belas saiz' },
      body: [
        { en: 'Undersink traps sit below a single bowl. Centralized traps sit downstream of a whole kitchen line. Oil interceptors handle workshop and forecourt runoff. Every one is built in 304 stainless steel or reinforced fibreglass and rated for wastewater above 100 degrees Celsius.',
          bm: 'Perangkap bawah sinki dipasang di bawah satu besen. Perangkap berpusat dipasang di hilir keseluruhan barisan dapur. Pemintas minyak mengendalikan air larian bengkel dan kawasan hadapan. Setiap satu dibina dalam keluli tahan karat 304 atau gentian kaca diperkukuh dan dinilai untuk air sisa melebihi 100 darjah Celsius.' }
      ]
    }));

    var grid = APP.blocks.tiles({
      jump: { en: 'The models', bm: 'Model' },
      tone: 'wash', cols: 3, items: all.map(productTile)
    });
    var chips = chipRow(
      [{ id: 'all', label: { en: 'All', bm: 'Semua' } }].concat(gt.subs.map(function (s) {
        return { id: s.id, label: s.name };
      })),
      function (id) {
        grid.setItems((id === 'all' ? all : PM.productsBy('grease-trap', id)).map(productTile));
      }
    );
    grid.body.insertBefore(chips, grid.grid);
    add(grid);

    add(APP.blocks.expander({
      jump: { en: 'How it works', bm: 'Cara ia berfungsi' },
      eyebrow: { en: 'The mechanism', bm: 'Mekanisme' },
      heading: { en: 'Separation by density, in three chambers',
                 bm: 'Pemisahan mengikut ketumpatan, dalam tiga ruang' },
      items: SEPARATION_ITEMS
    }));

    add(APP.blocks.sizer({ tone: 'wash', jump: { en: 'Sizing', bm: 'Penentuan saiz' } }));
    add(APP.blocks.cta(HOME_CTA));

    APP.chassis.jumpbar([CRUMB_HOME, CRUMB_PRODUCTS, { href: 'grease-traps.html', label: gt.name }]);
  };

  /* -------------------------------------------------------- Model Finder */
  APP.pages.modelFinder = function () {
    add(APP.blocks.hero({
      eyebrow: { en: 'Products', bm: 'Produk' },
      heading: { en: 'Model & Size Finder', bm: 'Pencari Model & Saiz' },
      body: { en: 'The manufacturer’s own specification table. Filter by series, or type your daily meal volume and the matching model is marked.',
              bm: 'Jadual spesifikasi pengeluar sendiri. Tapis mengikut siri, atau taip jumlah hidangan harian anda dan model yang sepadan akan ditandakan.' },
      img: 'products/gta325-2.jpg',
      alt: t({ en: 'A centralized grease trap before installation',
               bm: 'Perangkap minyak berpusat sebelum pemasangan' })
    }));

    add(APP.blocks.lead({
      jump: { en: 'Introduction', bm: 'Pengenalan' },
      eyebrow: { en: 'How to read it', bm: 'Cara membacanya' },
      heading: { en: 'Meal volume decides the model', bm: 'Jumlah hidangan menentukan model' },
      body: [
        { en: 'Flow rate is what the trap can pass without losing separation. Capacity is how much grease and waste water it holds before service is due. Pipe size has to match your existing run, and dimensions have to fit the space you actually have.',
          bm: 'Kadar aliran ialah apa yang boleh dilalui perangkap tanpa kehilangan pemisahan. Kapasiti ialah berapa banyak gris dan air sisa yang ditampungnya sebelum servis diperlukan. Saiz paip mesti sepadan dengan larian sedia ada anda, dan dimensi mesti muat dengan ruang yang anda ada.' }
      ]
    }));

    add(APP.blocks.table({ filters: true, jump: { en: 'The table', bm: 'Jadual' } }));
    add(APP.blocks.sizer({ tone: 'wash', jump: { en: 'Sizing', bm: 'Penentuan saiz' } }));

    add(APP.blocks.statement({
      jump: { en: 'A note on figures', bm: 'Nota tentang angka' },
      text: { en: 'Every figure in that table is the manufacturer’s published specification. Nothing is rounded and nothing is estimated.',
              bm: 'Setiap angka dalam jadual itu adalah spesifikasi terbitan pengeluar. Tiada yang dibundarkan dan tiada yang dianggarkan.' },
      emphasis: ['published specification'],
      emphasisBm: ['spesifikasi terbitan']
    }));

    add(APP.blocks.cta(HOME_CTA));

    APP.chassis.jumpbar([CRUMB_HOME, CRUMB_PRODUCTS,
      { href: 'model-finder.html', label: { en: 'Model & Size Finder', bm: 'Pencari Model & Saiz' } }]);
  };

  /* ------------------------------------------------------ Product detail */
  APP.pages.product = function (slug) {
    var p = PM.product(slug || PM.param('p') || '');

    if (!p) {
      add(APP.blocks.lead({
        eyebrow: { en: 'Not found', bm: 'Tidak dijumpai' },
        heading: S.ui.notFound,
        body: [{ en: 'The product you asked for is not in the catalogue. These are the four product lines.',
                 bm: 'Produk yang anda minta tiada dalam katalog. Ini adalah empat barisan produk.' }]
      }));
      add(APP.blocks.tiles({ tone: 'wash', cols: 4, items: categoryTiles() }));
      APP.chassis.jumpbar([CRUMB_HOME, CRUMB_PRODUCTS]);
      return;
    }

    var category = cat(p.cat);

    add(APP.blocks.hero({
      eyebrow: category ? category.name : { en: 'Product', bm: 'Produk' },
      heading: p.name, body: p.short,
      img: p.images[0], plate: true, frame: 'cardart', alt: t(p.name),
      cta: { href: PM.waProduct(p), raw: true, label: S.ui.requestPrice }
    }));

    /* Gallery, lightboxed. */
    if (p.images.length > 1) {
      var gal = APP.blocks._band('gallery', { jump: { en: 'Gallery', bm: 'Galeri' } });
      var strip = el('div', { class: 'gal-strip' });
      p.images.forEach(function (src, i) {
        strip.appendChild(el('a', {
          class: 'gal-item', href: A(src), 'data-lightbox': 'product',
          'aria-label': t(p.name) + ' ' + (i + 1)
        }, [APP.ui.photo(src, t(p.name) + ' ' + (i + 1), 'cardart')]));
      });
      gal.body.appendChild(strip);
      add(gal);
    }

    add(APP.blocks.lead({
      jump: { en: 'Overview', bm: 'Gambaran' },
      eyebrow: { en: 'Overview', bm: 'Gambaran' },
      heading: { en: 'What it does', bm: 'Apa yang ia lakukan' },
      body: (p.intro && p.intro.en ? p.intro.en : []).map(function (_, i) {
        return { en: p.intro.en[i], bm: (p.intro.bm && p.intro.bm[i]) || p.intro.en[i] };
      })
    }));

    /* Bullets and badges. */
    var detail = APP.blocks._band('detail', { tone: 'wash', jump: S.ui.specs });
    var bullets = el('ul', { class: 'bullets' });
    ((p.bullets && p.bullets.en) || []).forEach(function (_, i) {
      bullets.appendChild(el('li', {
        'data-en': p.bullets.en[i],
        'data-bm': (p.bullets.bm && p.bullets.bm[i]) || p.bullets.en[i],
        text: PM.lang === 'bm' && p.bullets.bm ? p.bullets.bm[i] : p.bullets.en[i]
      }));
    });

    var specs = el('dl', { class: 'spec-list' });
    (p.specs || []).forEach(function (row) {
      specs.appendChild(el('dt', Object.assign({ class: 'cap' }, labelAttrs(row.k))));
      specs.appendChild(el('dd', { class: 'fig', text: row.v }));
    });

    var badges = el('ul', { class: 'badge-row' });
    (p.badges || []).forEach(function (b) {
      badges.appendChild(el('li', Object.assign({ class: 'badge' }, labelAttrs(b))));
    });

    var warranty = el('div', { class: 'warranty' }, [
      el('h3', Object.assign({}, labelAttrs(S.ui.warranty)))
    ]);
    ((p.warranty && p.warranty.en) || []).forEach(function (_, i) {
      warranty.appendChild(el('p', {
        class: 'cap',
        'data-en': p.warranty.en[i],
        'data-bm': (p.warranty.bm && p.warranty.bm[i]) || p.warranty.en[i],
        text: PM.lang === 'bm' && p.warranty.bm ? p.warranty.bm[i] : p.warranty.en[i]
      }));
    });

    detail.body.appendChild(el('div', { class: 'detail-grid', 'data-anim': 'rise' }, [
      el('div', null, [
        el('h2', Object.assign({}, labelAttrs(S.ui.whyChoose))),
        bullets, badges,
        p.idealFor ? el('p', Object.assign({ class: 'lead' }, labelAttrs(p.idealFor))) : null
      ]),
      el('div', { class: 'detail-side' }, [
        el('h3', Object.assign({}, labelAttrs(S.ui.specs))), specs, warranty
      ])
    ]));
    add(detail);

    /* The model's own catalogue and drawing, where the client supplied them. */
    var papers = (L.documents || []).filter(function (m) { return m.model === p.model; })[0];
    if (papers) {
      add(APP.blocks.docshelf({
        jump: { en: 'Documents', bm: 'Dokumen' },
        eyebrow: { en: 'Documents', bm: 'Dokumen' },
        heading: { en: 'The catalogue and the drawing for ' + p.model,
                   bm: 'Katalog dan lukisan bagi ' + p.model },
        models: [papers], compact: true
      }));
    }

    var related = PM.related(p, 3);
    if (related.length) {
      add(APP.blocks.tiles({
        jump: S.ui.related,
        eyebrow: S.ui.related,
        heading: { en: 'Others in this range', bm: 'Lain-lain dalam rangkaian ini' },
        cols: 3, items: related.map(productTile)
      }));
    }

    add(APP.blocks.cta({
      heading: { en: 'Ask for a price on this model', bm: 'Minta harga untuk model ini' },
      body: p.short,
      primary: { href: 'contact.html#enquiry', label: S.ui.requestQuote },
      whatsapp: true,
      waMessage: PM.lang === 'bm'
        ? 'Salam, saya berminat dengan ' + t(p.name) + '.'
        : 'Hello, I am interested in ' + t(p.name) + '.'
    }));

    APP.chassis.jumpbar([CRUMB_HOME, CRUMB_PRODUCTS,
      { href: 'product.html?p=' + p.slug, label: p.name }]);
  };

  /* ------------------------------------------------------------ Services */
  APP.pages.services = function () {
    add(APP.blocks.hero({
      eyebrow: { en: 'Services', bm: 'Perkhidmatan' },
      heading: { en: 'Service that keeps it working', bm: 'Servis yang memastikan ia berfungsi' },
      body: { en: 'Cleaning, pumping, jetting and waste removal, across Peninsular Malaysia.',
              bm: 'Pembersihan, pengepaman, jetting dan pembuangan sisa, di seluruh Semenanjung Malaysia.' },
      img: 'service/sewerage-1.webp',
      alt: t({ en: 'A service crew clearing a manhole', bm: 'Kru servis membersihkan lurang' }),
      cta: { href: 'contact.html#enquiry', label: { en: 'Book a service', bm: 'Tempah servis' } }
    }));

    /* The three complaints the crews are called out for most, one for each
       kind of trap, each with the fix. These replaced the "What we cover"
       introduction at the client's request. */
    add(APP.blocks.issues({
      tone: 'wash',
      jump: { en: 'Common issues', bm: 'Masalah biasa' },
      eyebrow: { en: 'Common issues', bm: 'Masalah biasa' },
      heading: { en: 'What goes wrong, and what fixes it', bm: 'Apa yang tidak kena, dan apa penyelesaiannya' },
      body: { en: 'The complaints we are called out for most, one for each kind of trap. Choose yours.',
              bm: 'Aduan yang paling kerap kami terima, satu bagi setiap jenis perangkap. Pilih yang berkenaan.' }
    }));

    add(APP.blocks.expander({
      jump: { en: 'The services', bm: 'Perkhidmatan' },
      eyebrow: { en: 'In detail', bm: 'Secara terperinci' },
      heading: { en: 'What each one involves', bm: 'Apa yang terlibat dalam setiap satu' },
      cols: 5,
      items: C.services.map(function (s, i) {
        return {
          num: String(i + 1).padStart(2, '0'),
          title: s.name, img: s.img, alt: t(s.name),
          body: { en: s.intro.en[0], bm: s.intro.bm ? s.intro.bm[0] : s.intro.en[0] },
          cta: { href: 'service.html?s=' + s.slug, label: S.ui.viewDetails }
        };
      })
    }));

    add(APP.blocks.tiles({
      jump: { en: 'Coverage', bm: 'Liputan' },
      tone: 'wash', cols: 3,
      eyebrow: { en: 'Coverage', bm: 'Liputan' },
      heading: { en: 'Where the crews are', bm: 'Di mana kru berada' },
      items: [
        { href: 'contact.html', label: { en: 'Selangor & Kuala Lumpur', bm: 'Selangor & Kuala Lumpur' },
          figure: '01', note: { en: 'Head office, Petaling Jaya. Factory, Rawang.',
                                bm: 'Ibu pejabat, Petaling Jaya. Kilang, Rawang.' } },
        { href: 'contact.html', label: { en: 'Perak', bm: 'Perak' },
          figure: '02', note: { en: 'Service depot, Taiping.', bm: 'Depoh servis, Taiping.' } },
        { href: 'contact.html', label: { en: 'Melaka, Penang & Johor', bm: 'Melaka, Pulau Pinang & Johor' },
          figure: '03', note: { en: 'Factory, Cheng. Service line across the south and north.',
                                bm: 'Kilang, Cheng. Talian servis di selatan dan utara.' } }
      ]
    }));

    add(APP.blocks.quote({
      jump: { en: 'Why it matters', bm: 'Mengapa ia penting' },
      text: { en: 'A trap that is never serviced stops being a trap. The chambers fill, the separation stops, and what leaves is what went in.',
              bm: 'Perangkap yang tidak pernah diservis berhenti menjadi perangkap. Ruang penuh, pemisahan berhenti, dan apa yang keluar adalah apa yang masuk.' },
      name: S.brand.legal,
      role: { en: 'Service division', bm: 'Bahagian servis' }
    }));

    add(APP.blocks.cta(HOME_CTA));

    APP.chassis.jumpbar([CRUMB_HOME,
      { href: 'services.html', label: { en: 'Services', bm: 'Perkhidmatan' } }]);
  };

  /* --------------------------------------------------------------- About */
  APP.pages.about = function () {
    add(APP.blocks.hero({
      eyebrow: { en: 'Company', bm: 'Syarikat' },
      heading: { en: 'Kualiti Alam Hijau (M) Sdn Bhd', bm: 'Kualiti Alam Hijau (M) Sdn Bhd' },
      body: { en: 'Manufacturing grease traps in Malaysia since 1996, with our own factories, our own service crews and our own dealer network.',
              bm: 'Mengeluarkan perangkap minyak di Malaysia sejak 1996, dengan kilang sendiri, kru servis sendiri dan rangkaian pengedar sendiri.' },
      img: 'news/factory.webp',
      alt: t({ en: 'The factory floor where the traps are fabricated',
               bm: 'Lantai kilang tempat perangkap difabrikasi' }),
      cta: { href: 'contact.html', label: { en: 'Talk to us', bm: 'Hubungi kami' } }
    }));

    add(APP.blocks.lead({
      jump: { en: 'Introduction', bm: 'Pengenalan' },
      eyebrow: { en: 'Who we are', bm: 'Siapa kami' },
      heading: { en: 'One company answers for the whole life of the trap',
                 bm: 'Satu syarikat bertanggungjawab sepanjang hayat perangkap' },
      body: [
        { en: 'We design and fabricate the units, we size them against your meal volume, we install them, and our own crews service them afterwards. There is no chain of suppliers to work through when something needs attention.',
          bm: 'Kami mereka bentuk dan memfabrikasi unit, kami menyaiznya mengikut jumlah hidangan anda, kami memasangnya, dan kru kami sendiri menyelenggaranya selepas itu. Tiada rantaian pembekal untuk diuruskan apabila sesuatu memerlukan perhatian.' }
      ]
    }));

    add(APP.blocks.figures({ set: 'about', tone: 'wash', jump: { en: 'By the numbers', bm: 'Dalam angka' } }));

    add(APP.blocks.media({
      jump: { en: 'The factory', bm: 'Kilang' },
      eyebrow: { en: 'Where they are made', bm: 'Di mana ia dibuat' },
      heading: { en: 'Two factories and a service depot', bm: 'Dua kilang dan satu depoh servis' },
      img: 'news/factory.webp',
      alt: t({ en: 'The factory floor where the traps are fabricated',
               bm: 'Lantai kilang tempat perangkap difabrikasi' })
    }));

    add(APP.blocks.expander({
      jump: { en: 'How we work', bm: 'Cara kami bekerja' },
      eyebrow: { en: 'How we work', bm: 'Cara kami bekerja' },
      heading: { en: 'Built, sized, installed, serviced', bm: 'Dibina, disaiz, dipasang, diservis' },
      items: SEPARATION_ITEMS
    }));

    add(APP.blocks.tiles({
      jump: { en: 'Clients', bm: 'Pelanggan' },
      eyebrow: { en: 'Named sites', bm: 'Tapak bernama' },
      heading: { en: 'Where our traps are working', bm: 'Di mana perangkap kami berfungsi' },
      cols: 3,
      /* There is no client logo imagery in the library, so these are figure
         tiles rather than invented photography. */
      items: S.clients.map(function (c, i) {
        return {
          href: 'project-gallery.html', label: c.name, note: c.place,
          figure: String(i + 1).padStart(2, '0')
        };
      })
    }));

    add(APP.blocks.carousel({
      jump: { en: 'Awards', bm: 'Anugerah' },
      eyebrow: { en: 'On record', bm: 'Dalam rekod' },
      heading: { en: 'Awards and certificates', bm: 'Anugerah dan sijil' },
      items: S.awards.map(function (a) {
        return {
          href: 'awards.html', img: a.img, frame: 'cert', alt: t(a.title),
          kicker: a.year, title: a.title
        };
      }),
      moreLabel: S.ui.viewAll
    }));

    add(APP.blocks.quote({
      jump: { en: 'What we stand on', bm: 'Apa yang kami pegang' },
      text: { en: 'Every dimension, flow rate and capacity we publish is a figure you can hold us to on site.',
              bm: 'Setiap dimensi, kadar aliran dan kapasiti yang kami terbitkan ialah angka yang boleh anda pertanggungjawabkan kepada kami di tapak.' },
      name: S.brand.legal, role: { en: 'Registration ' + S.brand.regNo, bm: 'Pendaftaran ' + S.brand.regNo }
    }));

    add(APP.blocks.cta(HOME_CTA));

    APP.chassis.jumpbar([CRUMB_HOME,
      { href: 'about.html', label: { en: 'Company Profile', bm: 'Profil Syarikat' } }]);
  };

  /* ------------------------------------------------------------- Contact */
  function addrCard(place) {
    var kids = [el('h3', Object.assign({}, labelAttrs(place.label)))];
    place.lines.forEach(function (line) { kids.push(el('p', { class: 'cap', text: line })); });
    return el('div', { class: 'addr-card' }, kids);
  }

  function field(opts) {
    var id = 'f-' + opts.name;
    var control;
    if (opts.tag === 'textarea') {
      control = el('textarea', { id: id, name: opts.name, rows: '5' });
    } else if (opts.tag === 'select') {
      control = el('select', { id: id, name: opts.name });
      control.appendChild(el('option', Object.assign({ value: '' }, labelAttrs(S.ui.pleaseSelect))));
      (opts.options || []).forEach(function (o) {
        control.appendChild(el('option', { value: o.value, text: o.label }));
      });
    } else {
      control = el('input', { id: id, name: opts.name, type: opts.type || 'text' });
    }
    if (opts.required) control.setAttribute('required', 'required');
    return el('div', { class: 'field' }, [
      el('label', Object.assign({ for: id }, labelAttrs(opts.label))),
      control
    ]);
  }

  APP.pages.contact = function () {
    add(APP.blocks.hero({
      eyebrow: { en: 'Contact', bm: 'Hubungi' },
      heading: { en: 'Tell us what you need sized', bm: 'Beritahu kami apa yang perlu disaiz' },
      body: { en: 'Send your kitchen layout and daily covers. You get the model, the dimensions and a price the same day.',
              bm: 'Hantar susun atur dapur dan jumlah hidangan harian anda. Anda akan menerima model, dimensi dan harga pada hari yang sama.' },
      img: 'service/sewerage-2.webp',
      alt: t({ en: 'A service crew on site', bm: 'Kru servis di tapak' }),
      cta: { href: PM.waLink(), raw: true, label: S.ui.whatsapp }
    }));

    /* Three ways to reach us. */
    var reach = APP.blocks._band('reach', { jump: { en: 'Reach us', bm: 'Hubungi kami' } });
    reach.body.appendChild(el('div', { class: 'reach-grid', 'data-stagger': '70' }, [
      el('a', { class: 'reach-card', href: PM.telLink() }, [
        APP.ui.arc('tr'), APP.ui.icon('ph-phone'),
        el('h3', Object.assign({}, labelAttrs({ en: 'Office line', bm: 'Talian pejabat' }))),
        el('p', { class: 'fig', text: S.contact.officeDisplay }),
        el('p', { class: 'cap', 'data-en': S.contact.hours.en, 'data-bm': S.contact.hours.bm, text: t(S.contact.hours) })
      ]),
      el('a', { class: 'reach-card', href: 'tel:' + S.contact.servicePhone }, [
        APP.ui.arc('tr'), APP.ui.icon('ph-wrench'),
        el('h3', Object.assign({}, labelAttrs({ en: 'Service line', bm: 'Talian servis' }))),
        el('p', { class: 'fig', text: S.contact.serviceDisplay }),
        el('p', { class: 'cap', 'data-en': 'Cleaning, pumping and jetting', 'data-bm': 'Pembersihan, pengepaman dan jetting', text: 'Cleaning, pumping and jetting' })
      ]),
      el('a', { class: 'reach-card', href: PM.waLink(), target: '_blank', rel: 'noopener' }, [
        APP.ui.arc('tr'), APP.ui.icon('ph-whatsapp-logo'),
        el('h3', { text: 'WhatsApp' }),
        el('p', { class: 'fig', text: S.contact.whatsappDisplay }),
        el('p', { class: 'cap', 'data-en': 'Fastest route to a quotation', 'data-bm': 'Laluan terpantas untuk sebut harga', text: 'Fastest route to a quotation' })
      ]),
      el('a', { class: 'reach-card', href: PM.mailLink() }, [
        APP.ui.arc('tr'), APP.ui.icon('ph-envelope-simple'),
        el('h3', Object.assign({}, labelAttrs(S.ui.email))),
        el('p', { class: 'fig reach-mail', text: S.contact.email }),
        el('p', { class: 'cap', 'data-en': 'For drawings, tenders and specifications', 'data-bm': 'Untuk lukisan, tender dan spesifikasi', text: 'For drawings, tenders and specifications' })
      ])
    ]));
    add(reach);

    /* The enquiry form. */
    var form = el('form', { class: 'enquiry', id: 'enquiry', 'data-enquiry': '' }, [
      field({ name: 'name', label: S.ui.name, required: true }),
      field({ name: 'mobile', label: S.ui.mobile, type: 'tel', required: true }),
      field({ name: 'email', label: S.ui.email, type: 'email', required: true }),
      field({
        name: 'product', label: S.ui.productInterest, tag: 'select',
        options: C.products.map(function (p) { return { value: p.slug, label: t(p.name) }; })
      }),
      field({ name: 'message', label: S.ui.message, tag: 'textarea' }),
      el('div', { class: 'form-foot' }, [
        el('button', Object.assign({ class: 'pill pill--accent', type: 'submit' }, labelAttrs(S.ui.submit))),
        el('a', {
          class: 'pill pill--ghost', href: PM.waLink(), target: '_blank', rel: 'noopener'
        }, [el('span', labelAttrs(S.ui.whatsapp)), APP.ui.icon('ph-whatsapp-logo')])
      ]),
      el('p', { class: 'form-status', 'data-form-status': '', hidden: 'hidden', tabindex: '-1', role: 'status' })
    ]);

    var formBand = APP.blocks._band('form', { tone: 'wash', jump: S.ui.enquiry });
    formBand.body.appendChild(el('div', { class: 'form-grid' }, [
      el('div', { class: 'form-side' }, [
        APP.ui.eyebrow({ en: 'Enquiry', bm: 'Pertanyaan' }),
        el('h2', Object.assign({}, labelAttrs({
          en: 'Send the details and we will size it', bm: 'Hantar butiran dan kami akan menyaiznya'
        }))),
        el('p', Object.assign({ class: 'lead' }, labelAttrs({
          en: 'No backend is wired up on this concept: the form acknowledges locally and offers WhatsApp, which is how enquiries actually reach this business today.',
          bm: 'Tiada bahagian belakang disambungkan pada konsep ini: borang mengesahkan secara setempat dan menawarkan WhatsApp, iaitu cara pertanyaan sampai kepada perniagaan ini hari ini.'
        })))
      ]),
      form
    ]));
    add(formBand);

    /* Offices and factories. */
    var places = APP.blocks._band('places', { jump: { en: 'Offices', bm: 'Pejabat' } });
    places.body.appendChild(bandHead({
      eyebrow: { en: 'Where we are', bm: 'Di mana kami berada' },
      heading: { en: 'Offices, factories and the service depot',
                 bm: 'Pejabat, kilang dan depoh servis' }
    }));
    places.body.appendChild(el('div', { class: 'addr-grid', 'data-stagger': '70' },
      [addrCard(S.contact.hq)].concat(S.contact.factories.map(addrCard))));
    add(places);

    add(APP.blocks.cta(HOME_CTA));

    APP.chassis.jumpbar([CRUMB_HOME,
      { href: 'contact.html', label: { en: 'Contact', bm: 'Hubungi' } }]);
  };

  /* ====================================================================
     THE REMAINING PAGES
     Everything in SITE.nav that was not in the first cut. Each one is
     assembled from the block kit; none of them invents new markup.
     ==================================================================== */

  /* Bilingual list to bullet nodes, keeping both languages on the element
     so the shared engine can switch them without a redraw. */
  function bilingualList(pair, cls) {
    var ul = el('ul', { class: cls || 'bullets' });
    ((pair && pair.en) || []).forEach(function (_, i) {
      ul.appendChild(el('li', {
        'data-en': pair.en[i],
        'data-bm': (pair.bm && pair.bm[i]) || pair.en[i],
        text: PM.lang === 'bm' && pair.bm ? pair.bm[i] : pair.en[i]
      }));
    });
    return ul;
  }

  function paraPairs(pair) {
    return ((pair && pair.en) || []).map(function (_, i) {
      return { en: pair.en[i], bm: (pair.bm && pair.bm[i]) || pair.en[i] };
    });
  }

  /* ------------------------------------------------- product categories
     Auto dosing, bio-enzyme and other products share one shape: a hero, a
     lead, the filtered grid, a supporting block and the standard call to
     action. Only the copy and the supporting block change. */
  function categoryPage(id, extra) {
    var c = cat(id);
    var all = PM.productsBy(id);
    extra = extra || {};

    add(APP.blocks.hero({
      eyebrow: { en: 'Products', bm: 'Produk' },
      heading: c.name, body: c.blurb,
      img: extra.heroImg || c.img,
      plate: true, frame: 'cardart',
      ground: extra.ground,
      alt: t(c.name),
      cta: { href: 'contact.html#enquiry', label: S.ui.requestQuote },
      links: [
        { href: 'grease-traps.html', label: { en: 'Grease Traps', bm: 'Perangkap Minyak' } },
        { href: 'model-finder.html', label: { en: 'Model & Size Finder', bm: 'Pencari Model & Saiz' } }
      ]
    }));

    if (extra.banner) add(APP.blocks.banner(extra.banner));

    add(APP.blocks.lead({
      jump: { en: 'Introduction', bm: 'Pengenalan' },
      eyebrow: extra.eyebrow || { en: 'The range', bm: 'Rangkaian' },
      heading: extra.heading, body: extra.body
    }));

    var grid = APP.blocks.tiles({
      jump: { en: 'The range', bm: 'Rangkaian' },
      tone: 'wash', cols: 3, items: all.map(productTile)
    });
    if (c.subs && c.subs.length > 1) {
      var chips = chipRow(
        [{ id: 'all', label: { en: 'All', bm: 'Semua' } }].concat(c.subs.map(function (sub) {
          return { id: sub.id, label: sub.name };
        })),
        function (pick) {
          grid.setItems((pick === 'all' ? all : PM.productsBy(id, pick)).map(productTile));
        }
      );
      grid.body.insertBefore(chips, grid.grid);
    }
    add(grid);

    if (extra.after) extra.after();

    add(APP.blocks.cta(HOME_CTA));
    APP.chassis.jumpbar([CRUMB_HOME, CRUMB_PRODUCTS, { href: c.href, label: c.name }]);
  }

  APP.pages.autoDosing = function () {
    categoryPage('auto-dosing', {
      ground: 'install/step-2.jpg',
      banner: {
        items: [{
          img: 'brand/banner-auto-dosing.jpg', raw: false,
          href: 'product.html?p=auto-dosing-unit-adu9291p',
          label: { en: 'See the ADU9291P', bm: 'Lihat ADU9291P' },
          alt: t({ en: 'ADU 9291P auto dosing unit: programmable dosing time, consistent dosing, IP66 waterproof, thunder strike protection, one year warranty',
                   bm: 'Unit dos automatik ADU 9291P: masa dos boleh diprogram, dos konsisten, kalis air IP66, perlindungan panahan petir, waranti satu tahun' })
        }]
      },
      eyebrow: { en: 'Why dose at all', bm: 'Mengapa perlu dos' },
      heading: { en: 'The enzyme only works if it actually goes in',
                 bm: 'Enzim hanya berkesan jika ia benar-benar dimasukkan' },
      body: [
        { en: 'A bio-enzyme dose is a nightly job that nobody in a busy kitchen remembers on the night it matters. The Auto Dosing Unit does it on a 24-hour timer instead, at the hour the kitchen is closed and the enzyme has the contact time it needs.',
          bm: 'Dos bio-enzim adalah tugas malam yang tiada siapa dalam dapur sibuk ingat pada malam yang penting. Unit Dos Automatik melakukannya pada pemasa 24 jam, pada waktu dapur ditutup dan enzim mempunyai masa sentuhan yang diperlukan.' },
        { en: 'The ADU9291P holds eight AA cells behind the panel as well as the mains supply, so a thunderstorm power cut does not cost you a night of dosing. Voltage drop compensation keeps the pump output steady, and the flow is calibrated to the model of trap it is feeding.',
          bm: 'ADU9291P menyimpan lapan sel AA di belakang panel serta bekalan sesalur, jadi gangguan kuasa akibat ribut petir tidak merugikan anda satu malam dos. Pampasan kejatuhan voltan mengekalkan output pam yang stabil, dan aliran ditentukur mengikut model perangkap yang disuapnya.' }
      ],
      after: function () {
        add(APP.blocks.figures({
          set: 'trust', tone: 'navy',
          eyebrow: { en: 'On the panel', bm: 'Pada panel' },
          heading: { en: 'Built to survive a Malaysian wet season',
                     bm: 'Dibina untuk bertahan musim hujan Malaysia' }
        }));
        add(APP.blocks.videos({
          tone: 'wash',
          jump: { en: 'Video', bm: 'Video' },
          eyebrow: { en: 'Watch it run', bm: 'Tonton ia beroperasi' },
          heading: { en: 'The unit, in operation', bm: 'Unit itu, semasa beroperasi' },
          filters: false,
          items: S.youtube.filter(function (v) {
            return v.group === 'product' || v.group === 'install';
          })
        }));
      }
    });
  };

  APP.pages.bioEnzyme = function () {
    categoryPage('bio-enzyme', {
      ground: 'products/gts01-3.webp',
      eyebrow: { en: 'What it is', bm: 'Apa itu' },
      heading: { en: 'A bacterial culture, not a detergent',
                 bm: 'Kultur bakteria, bukan bahan pencuci' },
      body: [
        { en: 'A detergent emulsifies grease so it passes the trap and sets again in the pipe downstream. GoodBac does the opposite: the culture digests fats, oils and grease where they sit, and what leaves the chamber is carbon dioxide and water.',
          bm: 'Bahan pencuci mengemulsi gris supaya ia melepasi perangkap dan mengeras semula dalam paip di hilir. GoodBac melakukan sebaliknya: kultur itu menghadam lemak, minyak dan gris di tempatnya, dan apa yang keluar dari ruang itu ialah karbon dioksida dan air.' },
        { en: 'Dose is set by the volume of the trap, not by the size of the kitchen. The table below is the manufacturer’s published figure for each model, which is what the Auto Dosing Unit is calibrated against.',
          bm: 'Dos ditetapkan mengikut isi padu perangkap, bukan saiz dapur. Jadual di bawah ialah angka terbitan pengeluar bagi setiap model, dan itulah yang ditentukur pada Unit Dos Automatik.' }
      ],
      after: function () {
        var band = APP.blocks._band('dosing', {
          tone: 'wash', jump: { en: 'Dosing table', bm: 'Jadual dos' }
        });
        band.body.appendChild(bandHead({
          eyebrow: { en: 'Published dosing', bm: 'Dos terbitan' },
          heading: { en: 'Millilitres a night, by trap model',
                     bm: 'Mililiter semalam, mengikut model perangkap' }
        }));
        var wrap = el('div', { class: 'table-wrap', 'data-anim': 'rise' });
        var table = el('table', { class: 'spec-table' });
        var head = el('tr');
        [{ en: 'Model', bm: 'Model' },
         { en: 'Trap volume', bm: 'Isi padu perangkap' },
         { en: 'Nightly dose', bm: 'Dos malam' },
         { en: 'Per month', bm: 'Sebulan' }].forEach(function (h) {
          head.appendChild(el('th', Object.assign({ scope: 'col' }, labelAttrs(h))));
        });
        table.appendChild(el('thead', null, [head]));
        var body = el('tbody');
        C.dosing.forEach(function (d) {
          body.appendChild(el('tr', null, [
            el('th', { scope: 'row', class: 'mono', text: d.model }),
            el('td', { class: 'mono', text: d.trap + ' L' }),
            el('td', { class: 'mono', text: d.daily + ' ml' }),
            el('td', { class: 'mono', text: d.monthly + ' L' })
          ]));
        });
        table.appendChild(body);
        wrap.appendChild(table);
        band.body.appendChild(wrap);
        add(band);

        add(APP.blocks.tiles({
          jump: { en: 'Dose it automatically', bm: 'Dos secara automatik' },
          eyebrow: { en: 'The delivery', bm: 'Penyampaian' },
          heading: { en: 'Let the timer do it', bm: 'Biarkan pemasa melakukannya' },
          cols: 3, items: PM.productsBy('auto-dosing').slice(0, 3).map(productTile)
        }));
      }
    });
  };

  APP.pages.others = function () {
    categoryPage('others', {
      ground: 'install/step-3.jpg',
      eyebrow: { en: 'Around the trap', bm: 'Di sekitar perangkap' },
      heading: { en: 'The parts that keep the system honest',
                 bm: 'Bahagian yang memastikan sistem berfungsi jujur' },
      body: [
        { en: 'A lockable cabinet so the dosing unit is not switched off by the night crew. A hanging panel where there is no wall to fix to. A bio brick for a chamber that cannot take a pump. A leak sensor that tells you about a failure before the floor does.',
          bm: 'Kabinet berkunci supaya unit dos tidak dimatikan oleh kru malam. Panel gantung di tempat yang tiada dinding untuk dipasang. Bio brick untuk ruang yang tidak boleh menerima pam. Penderia bocor yang memberitahu anda tentang kegagalan sebelum lantai memberitahunya.' }
      ]
    });
  };

  /* ------------------------------------------------------- Service detail */
  APP.pages.service = function (slug) {
    var sv = PM.service(slug || PM.param('s') || '');

    if (!sv) {
      add(APP.blocks.lead({
        eyebrow: { en: 'Not found', bm: 'Tidak dijumpai' },
        heading: S.ui.notFound,
        body: [{ en: 'That service is not on the list. These are the five we run.',
                 bm: 'Perkhidmatan itu tiada dalam senarai. Ini lima yang kami jalankan.' }]
      }));
      add(APP.blocks.tiles({ tone: 'wash', cols: 3, items: serviceTiles(5) }));
      APP.chassis.jumpbar([CRUMB_HOME, { href: 'services.html', label: { en: 'Services', bm: 'Perkhidmatan' } }]);
      return;
    }

    add(APP.blocks.hero({
      eyebrow: { en: 'Service', bm: 'Perkhidmatan' },
      heading: sv.name, body: sv.short,
      img: sv.img, plate: sv.fit === 'contain', frame: 'cardart',
      ground: 'service/sewerage-3.webp',
      alt: t(sv.name),
      cta: { href: 'contact.html#enquiry', label: { en: 'Book this service', bm: 'Tempah perkhidmatan ini' } }
    }));

    add(APP.blocks.lead({
      jump: { en: 'Introduction', bm: 'Pengenalan' },
      eyebrow: { en: 'What it covers', bm: 'Apa yang dilindungi' },
      heading: sv.name, body: paraPairs(sv.intro)
    }));

    var detail = APP.blocks._band('detail', {
      tone: 'wash', jump: { en: 'The work', bm: 'Kerja' }
    });
    detail.body.appendChild(el('div', { class: 'detail-grid', 'data-anim': 'rise' }, [
      el('div', null, [
        el('h2', labelAttrs({ en: 'What you get', bm: 'Apa yang anda dapat' })),
        bilingualList(sv.benefits)
      ]),
      el('div', { class: 'detail-side' }, [
        el('h3', labelAttrs({ en: 'Why us for this', bm: 'Mengapa kami untuk ini' })),
        bilingualList(sv.why)
      ])
    ]));
    add(detail);

    if (sv.images && sv.images.length > 1) {
      add(APP.blocks.gallery({
        jump: { en: 'On site', bm: 'Di tapak' },
        eyebrow: { en: 'On site', bm: 'Di tapak' },
        heading: { en: 'The crew at work', bm: 'Kru sedang bekerja' },
        cols: 3,
        items: sv.images.map(function (src, i) {
          return { img: src, alt: t(sv.name) + ' ' + (i + 1) };
        })
      }));
    }

    var others = C.services.filter(function (x) { return x.slug !== sv.slug; }).slice(0, 3);
    if (others.length) {
      add(APP.blocks.tiles({
        jump: { en: 'Other services', bm: 'Perkhidmatan lain' },
        eyebrow: { en: 'Also on the truck', bm: 'Juga di atas lori' },
        heading: { en: 'Other service lines', bm: 'Barisan servis lain' },
        cols: 3,
        items: others.map(function (x) {
          return {
            href: 'service.html?s=' + x.slug, img: x.img, alt: t(x.name),
            label: x.name, note: x.short, plate: x.fit === 'contain'
          };
        })
      }));
    }

    add(APP.blocks.cta({
      heading: { en: 'Put this on the schedule', bm: 'Masukkan ini dalam jadual' },
      body: sv.short,
      primary: { href: 'contact.html#enquiry', label: { en: 'Book a service', bm: 'Tempah servis' } },
      whatsapp: true
    }));

    APP.chassis.jumpbar([CRUMB_HOME,
      { href: 'services.html', label: { en: 'Services', bm: 'Perkhidmatan' } },
      { href: 'service.html?s=' + sv.slug, label: sv.name }]);
  };

  /* ----------------------------------------------------- Authority approval */
  APP.pages.approvals = function () {
    add(APP.blocks.hero({
      eyebrow: { en: 'Compliance', bm: 'Pematuhan' },
      heading: { en: 'Approved by the councils that inspect you',
                 bm: 'Diluluskan oleh majlis yang memeriksa anda' },
      body: { en: 'Fifteen local authorities list our grease traps, and the product itself carries SIRIM certification R018/15.',
              bm: 'Lima belas pihak berkuasa tempatan menyenaraikan perangkap minyak kami, dan produk itu sendiri memegang pensijilan SIRIM R018/15.' },
      img: 'approvals/sirim.jpeg', plate: true, frame: 'cert',
      ground: 'news/factory.webp',
      alt: t({ en: 'The SIRIM product certificate', bm: 'Sijil produk SIRIM' })
    }));

    add(APP.blocks.lead({
      jump: { en: 'Why it matters', bm: 'Mengapa ia penting' },
      eyebrow: { en: 'Why it matters', bm: 'Mengapa ia penting' },
      heading: { en: 'The inspection is the point', bm: 'Pemeriksaan itulah maksudnya' },
      body: [
        { en: 'A licensing officer does not test your trap. They check whether the model is on the approved list and whether the certificate matches the unit in front of them. That is the whole reason certification is worth paying for.',
          bm: 'Pegawai pelesenan tidak menguji perangkap anda. Mereka menyemak sama ada model itu ada dalam senarai yang diluluskan dan sama ada sijil itu sepadan dengan unit di hadapan mereka. Itulah sebab pensijilan berbaloi dibayar.' }
      ]
    }));

    add(APP.blocks.docs({
      tone: 'wash', jump: { en: 'Certificates', bm: 'Sijil' },
      eyebrow: { en: 'Product certification', bm: 'Pensijilan produk' },
      heading: { en: 'What the product itself carries', bm: 'Apa yang produk itu sendiri pegang' },
      cols: 4, items: S.certs
    }));

    add(APP.blocks.docs({
      jump: { en: 'Councils', bm: 'Majlis' },
      eyebrow: { en: 'Local authorities', bm: 'Pihak berkuasa tempatan' },
      heading: { en: 'Councils that list our traps', bm: 'Majlis yang menyenaraikan perangkap kami' },
      cols: 5,
      items: S.approvals.map(function (a) { return { img: a.img, name: a.name, frame: 'crest' }; })
    }));

    add(APP.blocks.listing({
      tone: 'wash', jump: { en: 'And also', bm: 'Dan juga' },
      eyebrow: { en: 'And also', bm: 'Dan juga' },
      heading: { en: 'Further councils on record', bm: 'Majlis lain dalam rekod' },
      cols: 1,
      groups: [{
        rows: S.approvalsExtra.map(function (name) { return { name: name }; })
      }]
    }));

    add(APP.blocks.faq({
      key: 'appr',
      jump: { en: 'Questions', bm: 'Soalan' },
      eyebrow: { en: 'Questions', bm: 'Soalan' },
      heading: { en: 'What officers ask us', bm: 'Apa yang pegawai tanya kami' },
      items: S.faq.slice(1, 5)
    }));

    add(APP.blocks.cta(HOME_CTA));
    APP.chassis.jumpbar([CRUMB_HOME,
      { href: 'approvals.html', label: { en: 'Authority Approval', bm: 'Kelulusan Pihak Berkuasa' } }]);
  };

  /* ----------------------------------------------------------- Awards */
  APP.pages.awards = function () {
    add(APP.blocks.hero({
      eyebrow: { en: 'Compliance', bm: 'Pematuhan' },
      heading: { en: 'Awards & Certificates', bm: 'Anugerah & Sijil' },
      body: { en: 'Council endorsements, training certificates and contractor registrations, collected since 2008.',
              bm: 'Sokongan majlis, sijil latihan dan pendaftaran kontraktor, dikumpul sejak 2008.' },
      img: 'certs/award-biogt.jpg', plate: true, frame: 'cert',
      ground: 'news/factory.webp',
      alt: t({ en: 'A council approval certificate', bm: 'Sijil kelulusan majlis' })
    }));

    add(APP.blocks.docs({
      tone: 'wash', jump: { en: 'The record', bm: 'Rekod' },
      eyebrow: { en: 'The record', bm: 'Rekod' },
      heading: { en: 'Nine on the wall', bm: 'Sembilan di dinding' },
      body: { en: 'Each one is a scan of the original. Press any to read it full size.',
              bm: 'Setiap satu adalah imbasan asal. Tekan mana-mana untuk membacanya bersaiz penuh.' },
      cols: 3, items: S.awards.map(function (a) {
        return { img: a.img, name: a.title, year: a.year };
      })
    }));

    add(APP.blocks.figures({
      set: 'compliance', tone: 'navy',
      eyebrow: { en: 'Compliance', bm: 'Pematuhan' },
      heading: { en: 'Certified, approved, and on record',
                 bm: 'Diperakui, diluluskan dan direkodkan' }
    }));

    add(APP.blocks.cta(HOME_CTA));
    APP.chassis.jumpbar([CRUMB_HOME,
      { href: 'awards.html', label: { en: 'Awards & Certificates', bm: 'Anugerah & Sijil' } }]);
  };

  /* --------------------------------------------------------- Lab results */
  APP.pages.labTest = function () {
    add(APP.blocks.hero({
      eyebrow: { en: 'Compliance', bm: 'Pematuhan' },
      heading: { en: 'Lab Test Results', bm: 'Keputusan Ujian Makmal' },
      body: { en: 'Wastewater sampled at the inlet and again at the outlet of an installed trap, analysed by a SAMM accredited laboratory.',
              bm: 'Air sisa disampel di salur masuk dan sekali lagi di salur keluar perangkap yang dipasang, dianalisis oleh makmal terakreditasi SAMM.' },
      img: 'lab/output-report.jpg', plate: true, frame: 'report',
      ground: 'news/factory.webp',
      alt: t({ en: 'The laboratory analysis report', bm: 'Laporan analisis makmal' })
    }));

    add(APP.blocks.lead({
      jump: { en: 'What was tested', bm: 'Apa yang diuji' },
      eyebrow: { en: 'Method', bm: 'Kaedah' },
      heading: { en: 'Sampled on a working kitchen, not a bench',
                 bm: 'Disampel di dapur beroperasi, bukan di pelantar ujian' },
      body: [
        { en: 'The same wastewater was drawn at the inlet and at the outlet of an installed unit in a live commercial kitchen. Testing a rig on a bench proves the geometry works; testing a kitchen proves the product does.',
          bm: 'Air sisa yang sama diambil di salur masuk dan di salur keluar unit yang dipasang di dapur komersial yang beroperasi. Menguji pelantar membuktikan geometri berfungsi; menguji dapur membuktikan produknya berfungsi.' }
      ]
    }));

    S.labTests.forEach(function (test, i) {
      var band = APP.blocks._band('labrow', {
        tone: i % 2 ? 'wash' : 'surface',
        jump: i === 0 ? { en: 'Reports', bm: 'Laporan' } : null
      });
      band.body.appendChild(el('div', { class: 'detail-grid', 'data-anim': 'rise' }, [
        el('div', null, [
          el('h2', labelAttrs(test.title)),
          el('p', Object.assign({ class: 'lead' }, labelAttrs(test.body)))
        ]),
        el('div', { class: 'detail-side' }, [
          el('figure', {
            class: 'doc-item',
            'data-lightbox': A(test.img),
            'data-lightbox-alt': t(test.title),
            'data-lightbox-cap': t(test.title)
          }, [
            el('span', { class: 'frame frame--report' }, [
              el('img', { src: A(test.img), alt: t(test.title), loading: 'lazy' })
            ])
          ])
        ])
      ]));
      add(band);
    });

    add(APP.blocks.cta(HOME_CTA));
    APP.chassis.jumpbar([CRUMB_HOME,
      { href: 'lab-test.html', label: { en: 'Lab Test Results', bm: 'Keputusan Ujian Makmal' } }]);
  };

  /* ---------------------------------------------------- Installation guide */
  APP.pages.installGuide = function () {
    add(APP.blocks.hero({
      eyebrow: { en: 'Compliance', bm: 'Pematuhan' },
      heading: { en: 'Installation Guide', bm: 'Panduan Pemasangan' },
      body: { en: 'Three steps, and an undersink model is normally commissioned inside an afternoon.',
              bm: 'Tiga langkah, dan model bawah sinki biasanya ditauliahkan dalam satu petang.' },
      img: 'install/step-1.jpg',
      ground: 'install/step-2.jpg',
      alt: t({ en: 'A trap being positioned under a sink', bm: 'Perangkap diletakkan di bawah sinki' }),
      cta: { href: 'videos.html', label: { en: 'Watch the walkthrough', bm: 'Tonton panduan video' } }
    }));

    add(APP.blocks.expander({
      jump: { en: 'The three steps', bm: 'Tiga langkah' },
      eyebrow: { en: 'The sequence', bm: 'Urutan' },
      heading: { en: 'Position, connect, commission', bm: 'Letak, sambung, tauliah' },
      items: S.installSteps.map(function (step, i) {
        return {
          num: '0' + (i + 1), title: step.title, img: step.img,
          alt: t(step.title), body: step.body
        };
      })
    }));

    add(APP.blocks.docshelf({
      jump: { en: 'Drawings', bm: 'Lukisan' },
      eyebrow: { en: 'Drawings & installation guides', bm: 'Lukisan & panduan pemasangan' },
      heading: { en: 'The drawing for every model', bm: 'Lukisan bagi setiap model' },
      body: { en: 'Dimensions, pipe positions and the cross-section for setting the trap into the floor. Read them here, or download the PDF for your contractor.',
              bm: 'Dimensi, kedudukan paip dan keratan rentas untuk memasang perangkap ke dalam lantai. Baca di sini, atau muat turun PDF untuk kontraktor anda.' },
      kinds: ['drawing'], filters: true
    }));

    add(APP.blocks.videos({
      tone: 'wash',
      jump: { en: 'On video', bm: 'Dalam video' },
      eyebrow: { en: 'On video', bm: 'Dalam video' },
      heading: { en: 'The same three steps, filmed', bm: 'Tiga langkah yang sama, dirakam' },
      filters: false,
      items: S.youtube.filter(function (v) { return v.group === 'install' || v.group === 'factory'; })
    }));

    add(APP.blocks.statement({
      jump: { en: 'One warning', bm: 'Satu amaran' },
      text: { en: 'Fill the trap with clean water before first use. A dry trap separates nothing on its first service.',
              bm: 'Isi perangkap dengan air bersih sebelum penggunaan pertama. Perangkap kering tidak memisahkan apa-apa pada servis pertamanya.' },
      emphasis: ['clean water'],
      emphasisBm: ['air bersih']
    }));

    add(APP.blocks.faq({
      key: 'inst',
      jump: { en: 'Questions', bm: 'Soalan' },
      eyebrow: { en: 'Questions', bm: 'Soalan' },
      heading: { en: 'Asked during installation', bm: 'Ditanya semasa pemasangan' },
      items: S.faq.slice(4, 9)
    }));

    add(APP.blocks.cta(HOME_CTA));
    APP.chassis.jumpbar([CRUMB_HOME,
      { href: 'installation-guide.html', label: { en: 'Installation Guide', bm: 'Panduan Pemasangan' } }]);
  };

  /* --------------------------------------------------------- Project gallery */
  APP.pages.projectGallery = function () {
    add(APP.blocks.hero({
      eyebrow: { en: 'Company', bm: 'Syarikat' },
      heading: { en: 'Project Gallery', bm: 'Galeri Projek' },
      body: { en: 'Recent installations straight from site, each sheet named with the model and the place, then the company archive.',
              bm: 'Pemasangan terkini terus dari tapak, setiap helaian dinamakan dengan model dan lokasi, diikuti arkib syarikat.' },
      img: 'gallery/field-09.webp', frame: 'report',
      ground: 'install/step-3.jpg',
      alt: t({ en: 'GTA3100 installed at Sea Frozen Food, Johor', bm: 'GTA3100 dipasang di Sea Frozen Food, Johor' })
    }));

    add(APP.blocks.gallery({
      tone: 'wash', jump: { en: 'Recent installations', bm: 'Pemasangan terkini' },
      eyebrow: { en: 'From the field', bm: 'Dari lapangan' },
      heading: { en: 'Recent installations', bm: 'Pemasangan terkini' },
      body: { en: 'Dug, set, connected and covered. Press any sheet to see it full size.',
              bm: 'Digali, dipasang, disambung dan ditutup. Tekan mana-mana helaian untuk melihatnya bersaiz penuh.' },
      cols: 3,
      items: (L.field || []).map(function (f) {
        return { img: f.img, caption: f.site, kicker: f.model || null, frame: 'report',
                 alt: t(fieldCaption(f)) };
      })
    }));

    add(APP.blocks.gallery({
      jump: { en: 'The archive', bm: 'Arkib' },
      eyebrow: { en: 'The archive', bm: 'Arkib' },
      heading: { en: 'Installed and photographed', bm: 'Dipasang dan dirakam' },
      cols: 3, items: S.gallery
    }));

    add(APP.blocks.listing({
      tone: 'wash',
      jump: { en: 'Named sites', bm: 'Tapak bernama' },
      eyebrow: { en: 'Named sites', bm: 'Tapak bernama' },
      heading: { en: 'Where the traps are', bm: 'Di mana perangkap berada' },
      cols: 2,
      groups: [
        { title: { en: 'Industry and infrastructure', bm: 'Industri dan infrastruktur' },
          rows: S.clients.slice(0, 9).map(function (c) {
            return { name: c.name, meta: c.place };
          }) },
        { title: { en: 'Schools, camps and food premises', bm: 'Sekolah, kem dan premis makanan' },
          rows: S.clients.slice(9).map(function (c) {
            return { name: c.name, meta: c.place };
          }) }
      ]
    }));

    add(APP.blocks.cta(HOME_CTA));
    APP.chassis.jumpbar([CRUMB_HOME,
      { href: 'project-gallery.html', label: { en: 'Project Gallery', bm: 'Galeri Projek' } }]);
  };

  /* ------------------------------------------------------- Video library */
  APP.pages.videos = function () {
    add(APP.blocks.hero({
      eyebrow: { en: 'Company', bm: 'Syarikat' },
      heading: { en: 'Video Library', bm: 'Pustaka Video' },
      body: { en: 'Seven films from our own channel: the factory floor, an installation in Malay, the automatic unit running, and the service crews at work.',
              bm: 'Tujuh filem dari saluran kami sendiri: lantai kilang, pemasangan dalam bahasa Melayu, unit automatik beroperasi, dan kru servis bekerja.' },
      img: 'news/factory.webp',
      ground: 'news/factory.webp',
      alt: t({ en: 'Fabrication on the factory floor', bm: 'Fabrikasi di lantai kilang' }),
      cta: { href: 'contact.html#enquiry', label: S.ui.requestQuote }
    }));

    add(APP.blocks.videos({
      jump: { en: 'The films', bm: 'Filem' },
      eyebrow: { en: 'From the channel', bm: 'Dari saluran' },
      heading: { en: 'Watch how it is made, fitted and cleaned',
                 bm: 'Tonton bagaimana ia dibuat, dipasang dan dibersihkan' }
    }));

    add(APP.blocks.tiles({
      tone: 'wash',
      jump: { en: 'Read next', bm: 'Baca seterusnya' },
      eyebrow: { en: 'Read next', bm: 'Baca seterusnya' },
      heading: { en: 'The written versions', bm: 'Versi bertulis' },
      cols: 3,
      items: [
        { href: 'installation-guide.html', img: 'install/step-2.jpg',
          alt: t({ en: 'Connecting the inlet during installation', bm: 'Menyambung salur masuk semasa pemasangan' }),
          label: { en: 'Installation Guide', bm: 'Panduan Pemasangan' },
          note: { en: 'The same three steps, in writing', bm: 'Tiga langkah yang sama, secara bertulis' } },
        { href: 'services.html', img: 'service/sewerage-2.webp',
          alt: t({ en: 'The service crew on site', bm: 'Kru servis di tapak' }),
          label: { en: 'Services', bm: 'Perkhidmatan' },
          note: { en: 'What the crews carry out', bm: 'Apa yang kru laksanakan' }, plate: true },
        { href: 'about.html', img: 'news/factory.webp',
          alt: t({ en: 'The fabrication floor', bm: 'Lantai fabrikasi' }),
          label: { en: 'Company Profile', bm: 'Profil Syarikat' },
          note: { en: 'Two factories, one service fleet', bm: 'Dua kilang, satu armada servis' } }
      ]
    }));

    add(APP.blocks.cta(HOME_CTA));
    APP.chassis.jumpbar([CRUMB_HOME,
      { href: 'videos.html', label: { en: 'Video Library', bm: 'Pustaka Video' } }]);
  };

  /* ---------------------------------------------------------- Downloads */
  APP.pages.downloads = function () {
    add(APP.blocks.hero({
      eyebrow: { en: 'Company', bm: 'Syarikat' },
      heading: { en: 'Brochures & Downloads', bm: 'Brosur & Muat Turun' },
      body: { en: 'The product catalogue and the drawing & installation guide for every model. Read them on the page, or download the PDF.',
              bm: 'Katalog produk serta lukisan & panduan pemasangan bagi setiap model. Baca di halaman ini, atau muat turun PDF.' },
      img: 'brand/banner-oil-interceptor.jpg', plate: true, frame: 'cardart',
      ground: 'news/factory.webp',
      alt: t({ en: 'The oil interceptor product sheet', bm: 'Helaian produk pemintas minyak' })
    }));

    add(APP.blocks.docshelf({
      tone: 'wash', jump: { en: 'Catalogues & drawings', bm: 'Katalog & lukisan' },
      eyebrow: { en: 'The library', bm: 'Pustaka' },
      heading: { en: 'Every model, two documents each', bm: 'Setiap model, dua dokumen' },
      body: { en: 'The catalogue is the one-page specification sheet. The drawing & installation guide carries the dimensions, the pipe positions and the cross-section your contractor will set it by.',
              bm: 'Katalog ialah helaian spesifikasi satu halaman. Lukisan & panduan pemasangan mengandungi dimensi, kedudukan paip dan keratan rentas yang akan digunakan oleh kontraktor anda.' },
      filters: true
    }));

    /* What the client has not supplied as a file yet stays a request. The
       catalogue and the installation guide are no longer on this list:
       they are on the shelf above, per model. */
    var supplied = /catalogue|installation guide/i;
    add(APP.blocks.listing({
      jump: { en: 'On request', bm: 'Atas permintaan' },
      eyebrow: { en: 'On request', bm: 'Atas permintaan' },
      heading: { en: 'Sent on WhatsApp', bm: 'Dihantar melalui WhatsApp' },
      body: { en: 'These are sent by the sales desk, so you always receive the current version. Tap one to ask.',
              bm: 'Dokumen ini dihantar oleh meja jualan, jadi anda sentiasa menerima versi terkini. Tekan untuk meminta.' },
      cols: 1,
      groups: [{
        rows: S.downloads.filter(function (d) { return !supplied.test(d.name.en); }).map(function (d) {
          return {
            name: d.name, meta: d.meta, raw: true, target: '_blank',
            href: PM.waLink(PM.lang === 'bm'
              ? 'Salam, boleh hantar ' + d.name.bm + '?'
              : 'Hello, could you send me the ' + d.name.en + '?')
          };
        })
      }]
    }));

    add(APP.blocks.banner({
      items: [
        { img: 'brand/banner-oil-interceptor.jpg',
          href: 'grease-traps.html',
          label: { en: 'Oil interceptors', bm: 'Pemintas minyak' },
          alt: t({ en: 'Oil Interceptor GTA9001: high separation efficiency, sturdy and corrosion resistant, low maintenance and easy to install, for petrol stations and car washes',
                   bm: 'Pemintas Minyak GTA9001: kecekapan pemisahan tinggi, kukuh dan tahan karat, penyelenggaraan rendah dan mudah dipasang, untuk stesen minyak dan cucian kereta' }) },
        { img: 'brand/banner-auto-dosing.jpg',
          href: 'auto-dosing.html',
          label: { en: 'Auto dosing units', bm: 'Unit dos automatik' },
          alt: t({ en: 'ADU 9291P auto dosing unit: programmable dosing time, consistent dosing, IP66 waterproof, thunder strike protection, one year warranty',
                   bm: 'Unit dos automatik ADU 9291P: masa dos boleh diprogram, dos konsisten, kalis air IP66, perlindungan panahan petir, waranti satu tahun' }) }
      ]
    }));

    add(APP.blocks.cta(HOME_CTA));
    APP.chassis.jumpbar([CRUMB_HOME,
      { href: 'downloads.html', label: { en: 'Brochures & Downloads', bm: 'Brosur & Muat Turun' } }]);
  };

  /* --------------------------------------------------------------- News */
  APP.pages.news = function () {
    add(APP.blocks.hero({
      eyebrow: { en: 'Company', bm: 'Syarikat' },
      heading: { en: 'News', bm: 'Berita' },
      body: { en: 'Technical notes from the workshop: what certification changes, why the basket sits above the water line, and how often a chamber actually needs pumping.',
              bm: 'Nota teknikal dari bengkel: apa yang diubah oleh pensijilan, mengapa bakul berada di atas paras air, dan berapa kerap ruang perlu dipam.' },
      img: 'news/factory.webp',
      ground: 'news/factory.webp',
      alt: t({ en: 'Fabrication on the factory floor', bm: 'Fabrikasi di lantai kilang' })
    }));

    add(APP.blocks.carousel({
      tone: 'navy', jump: { en: 'Articles', bm: 'Artikel' },
      eyebrow: { en: 'From the workshop', bm: 'Dari bengkel' },
      heading: { en: 'Technical notes', bm: 'Nota teknikal' },
      items: newsItems(),
      moreLabel: S.ui.readMore
    }));

    add(APP.blocks.faq({
      key: 'news',
      tone: 'wash',
      jump: { en: 'Questions', bm: 'Soalan' },
      eyebrow: { en: 'Questions', bm: 'Soalan' },
      heading: { en: 'The ones we are asked every week', bm: 'Yang ditanya kepada kami setiap minggu' }
    }));

    add(APP.blocks.cta(HOME_CTA));
    APP.chassis.jumpbar([CRUMB_HOME, { href: 'news.html', label: { en: 'News', bm: 'Berita' } }]);
  };

  /* ------------------------------------------------------------ Article */
  APP.pages.article = function (slug) {
    var a = PM.article(slug || PM.param('a') || '');

    if (!a) {
      add(APP.blocks.lead({
        eyebrow: { en: 'Not found', bm: 'Tidak dijumpai' },
        heading: S.ui.notFound,
        body: [{ en: 'That article is not in the archive.', bm: 'Artikel itu tiada dalam arkib.' }]
      }));
      add(APP.blocks.carousel({
        tone: 'navy', items: newsItems(), moreLabel: S.ui.readMore
      }));
      APP.chassis.jumpbar([CRUMB_HOME, { href: 'news.html', label: { en: 'News', bm: 'Berita' } }]);
      return;
    }

    add(APP.blocks.hero({
      eyebrow: formatDate(a.date),
      heading: a.title, body: a.excerpt,
      img: a.img,
      plate: PM.showsWhole && PM.showsWhole(a.img),
      ground: 'news/factory.webp',
      alt: t(a.title)
    }));

    add(APP.blocks.prose({
      jump: { en: 'The article', bm: 'Artikel' },
      blocks: a.body
    }));

    var others = S.news.filter(function (x) { return x.slug !== a.slug; });
    if (others.length) {
      add(APP.blocks.carousel({
        tone: 'navy', jump: { en: 'Read next', bm: 'Baca seterusnya' },
        eyebrow: { en: 'Read next', bm: 'Baca seterusnya' },
        heading: { en: 'More technical notes', bm: 'Lagi nota teknikal' },
        items: others.map(function (x) {
          return {
            href: 'article.html?a=' + x.slug, img: x.img, alt: t(x.title),
            kicker: formatDate(x.date), title: x.title, meta: x.excerpt
          };
        }),
        moreLabel: S.ui.readMore
      }));
    }

    add(APP.blocks.cta(HOME_CTA));
    APP.chassis.jumpbar([CRUMB_HOME,
      { href: 'news.html', label: { en: 'News', bm: 'Berita' } },
      { href: 'article.html?a=' + a.slug, label: a.title }]);
  };

  /* ----------------------------------------------------------- Careers */
  APP.pages.careers = function () {
    add(APP.blocks.hero({
      eyebrow: { en: 'Company', bm: 'Syarikat' },
      heading: { en: 'Careers & Dealership', bm: 'Kerjaya & Pengedar' },
      body: { en: 'One appointed dealer per state, and open roles on the fabrication floor and the service fleet.',
              bm: 'Satu pengedar dilantik bagi setiap negeri, dan jawatan kosong di lantai fabrikasi dan armada servis.' },
      img: 'news/factory.webp',
      ground: 'news/factory.webp',
      alt: t({ en: 'A welder on the fabrication floor', bm: 'Pengimpal di lantai fabrikasi' }),
      cta: { href: 'contact.html#enquiry', label: { en: 'Apply', bm: 'Mohon' } }
    }));

    S.dealership.forEach(function (d, i) {
      var band = APP.blocks._band('deal', {
        tone: i % 2 ? 'wash' : 'surface',
        jump: i === 0 ? { en: 'Dealership', bm: 'Pengedar' } : null
      });
      band.body.appendChild(el('div', { class: 'detail-grid', 'data-anim': 'rise' }, [
        el('div', null, [
          el('h2', labelAttrs(d.title)),
          el('h3', labelAttrs({ en: 'What we look for', bm: 'Apa yang kami cari' })),
          bilingualList(d.qualify)
        ]),
        el('div', { class: 'detail-side' }, [
          el('h3', labelAttrs({ en: 'What you get', bm: 'Apa yang anda dapat' })),
          bilingualList(d.benefit)
        ])
      ]));
      add(band);
    });

    add(APP.blocks.listing({
      jump: { en: 'Open states', bm: 'Negeri terbuka' },
      eyebrow: { en: 'Open states', bm: 'Negeri terbuka' },
      heading: { en: 'Dealerships still unappointed', bm: 'Pengedar masih belum dilantik' },
      cols: 1,
      groups: [{ rows: S.dealerVacancies.map(function (v) {
        return { name: v, note: { en: 'Accepting applications', bm: 'Menerima permohonan' } };
      }) }]
    }));

    add(APP.blocks.listing({
      tone: 'wash', jump: { en: 'Open roles', bm: 'Jawatan kosong' },
      eyebrow: { en: 'Open roles', bm: 'Jawatan kosong' },
      heading: { en: 'On the floor and on the road', bm: 'Di lantai kilang dan di jalan raya' },
      cols: 3,
      groups: S.jobs.map(function (j) {
        return {
          title: j.role, note: { en: j.location, bm: j.location },
          rows: ((j.requirements && j.requirements.en) || []).map(function (_, i) {
            return { name: { en: j.requirements.en[i], bm: (j.requirements.bm && j.requirements.bm[i]) || j.requirements.en[i] } };
          })
        };
      })
    }));

    add(APP.blocks.cta({
      heading: { en: 'Send us your details', bm: 'Hantar butiran anda' },
      body: { en: 'Tell us the state you cover, or the role you are applying for. We reply within one business day.',
              bm: 'Beritahu kami negeri yang anda liputi, atau jawatan yang anda pohon. Kami membalas dalam satu hari bekerja.' },
      primary: { href: 'contact.html#enquiry', label: { en: 'Apply', bm: 'Mohon' } },
      whatsapp: true
    }));

    APP.chassis.jumpbar([CRUMB_HOME,
      { href: 'careers.html', label: { en: 'Careers & Dealership', bm: 'Kerjaya & Pengedar' } }]);
  };

  /* ------------------------------------------------------- Where to buy */
  APP.pages.whereToBuy = function () {
    add(APP.blocks.hero({
      eyebrow: { en: 'Buying', bm: 'Pembelian' },
      heading: { en: 'Where To Buy', bm: 'Tempat Membeli' },
      body: { en: 'Direct from the factory, or through the appointed dealer in your state.',
              bm: 'Terus dari kilang, atau melalui pengedar dilantik di negeri anda.' },
      img: 'products/gts02-1.webp', plate: true, frame: 'cardart',
      ground: 'products/gts01-3.webp',
      alt: t({ en: 'An undersink grease trap', bm: 'Perangkap minyak bawah sinki' }),
      cta: { href: PM.waLink(), raw: true, label: S.ui.whatsapp }
    }));

    add(APP.blocks.expander({
      jump: { en: 'Three ways', bm: 'Tiga cara' },
      eyebrow: { en: 'Three ways', bm: 'Tiga cara' },
      heading: { en: 'How an order actually gets placed', bm: 'Bagaimana pesanan sebenarnya dibuat' },
      items: S.buying.map(function (b, i) {
        return {
          num: '0' + (i + 1), title: b.title, body: b.body,
          img: ['service/schedule-waste.webp', 'products/gta325-2.jpg', 'products/gts02-2.webp'][i],
          alt: t(b.title)
        };
      })
    }));

    add(APP.blocks.listing({
      tone: 'wash', jump: { en: 'Terms', bm: 'Terma' },
      eyebrow: { en: 'Before you order', bm: 'Sebelum anda memesan' },
      heading: { en: 'Delivery, warranty and lead time', bm: 'Penghantaran, waranti dan masa penghantaran' },
      cols: 1,
      groups: [{
        rows: (t(S.buyingTerms) || []).map(function (line) { return { name: line }; })
      }]
    }));

    add(APP.blocks.listing({
      jump: { en: 'Dealers', bm: 'Pengedar' },
      eyebrow: { en: 'The network', bm: 'Rangkaian' },
      heading: { en: 'Appointed dealers by state', bm: 'Pengedar dilantik mengikut negeri' },
      cols: 3,
      groups: S.dealers.map(function (d) {
        return {
          title: d.state,
          rows: d.list.map(function (x) { return { name: x.name, note: x.addr }; })
        };
      })
    }));

    add(APP.blocks.cta(HOME_CTA));
    APP.chassis.jumpbar([CRUMB_HOME,
      { href: 'where-to-buy.html', label: { en: 'Where To Buy', bm: 'Tempat Membeli' } }]);
  };

  /* --------------------------------------------------------- Policies */
  APP.pages.policies = function () {
    add(APP.blocks.hero({
      eyebrow: { en: 'Legal', bm: 'Undang-undang' },
      heading: { en: 'Policies', bm: 'Dasar' },
      body: { en: 'What we collect when you enquire, what the warranty covers, and the terms this site is published under.',
              bm: 'Apa yang kami kumpulkan apabila anda bertanya, apa yang dilindungi waranti, dan terma penerbitan laman ini.' },
      img: 'approvals/warranty-10year.jpg', plate: true, frame: 'cert',
      ground: 'news/factory.webp',
      alt: t({ en: 'The warranty certificate', bm: 'Sijil waranti' })
    }));

    S.policies.forEach(function (pol, i) {
      add(APP.blocks.prose({
        id: pol.id,
        tone: i % 2 ? 'wash' : 'surface',
        jump: pol.title,
        eyebrow: { en: 'Policy', bm: 'Dasar' },
        heading: pol.title,
        blocks: pol.body
      }));
    });

    add(APP.blocks.cta(HOME_CTA));
    APP.chassis.jumpbar([CRUMB_HOME,
      { href: 'policies.html', label: { en: 'Policies', bm: 'Dasar' } }]);
  };

  /* ============================================================ October
     Four pages built from the client's October folder. */

  /* --------------------------------------------- GreaseGo Oil Interceptor */
  APP.pages.oilInterceptor = function () {
    var oi = L.oilInterceptor;
    var name = { en: 'GreaseGo Oil Interceptor', bm: 'Pemintas Minyak GreaseGo' };

    add(APP.blocks.hero({
      eyebrow: { en: 'Products', bm: 'Produk' },
      heading: name,
      body: { en: 'An advanced multi-stage system for oil and hydrocarbon separation, built for car service centres and workshops.',
              bm: 'Sistem pelbagai peringkat termaju untuk pemisahan minyak dan hidrokarbon, dibina untuk pusat servis kereta dan bengkel.' },
      img: 'brand/sheets/greasego-oil-interceptor-sm.webp', frame: 'cert',
      ground: 'news/factory.webp',
      alt: t({ en: 'The GreaseGo Oil Interceptor product sheet', bm: 'Helaian produk Pemintas Minyak GreaseGo' }),
      cta: { href: 'contact.html#enquiry', label: S.ui.requestQuote },
      links: [
        { href: 'scheduled-waste.html', label: { en: 'Scheduled Waste Guide', bm: 'Panduan Sisa Berjadual' } },
        { href: 'services.html', label: { en: 'Common oil interceptor issues', bm: 'Masalah biasa pemintas minyak' } }
      ]
    }));

    add(APP.blocks.lead({
      jump: { en: 'Introduction', bm: 'Pengenalan' },
      eyebrow: oi.tagline,
      heading: { en: 'Separate the oil before it all becomes SW312', bm: 'Asingkan minyak sebelum semuanya menjadi SW312' },
      body: paraPairs(oi.intro)
    }));

    /* The cross-section, cropped from the supplied sheet with its own
       labels, so it is shown whole and opens full size. */
    var xsAlt = t({
      en: 'Cross-section of the GreaseGo Oil Interceptor: debris and grit basket, primary settling chamber, main separation chamber with a coalescing plate pack, surface oil skimmer, oil collection tank, and clear water outlet chamber',
      bm: 'Keratan rentas Pemintas Minyak GreaseGo: bakul serpihan dan kelikir, ruang pengenapan awal, ruang pemisahan utama dengan pek plat pengumpal, penyisih minyak permukaan, tangki pengumpulan minyak, dan ruang salur keluar air jernih'
    });
    var xs = APP.blocks._band('xsec', { tone: 'wash', jump: { en: 'Cross-section', bm: 'Keratan rentas' } });
    xs.body.appendChild(bandHead({
      eyebrow: { en: 'Cross-section', bm: 'Keratan rentas' },
      heading: { en: 'Six chambers, from grit to clear water', bm: 'Enam ruang, dari kelikir ke air jernih' }
    }));
    xs.body.appendChild(el('figure', {
      class: 'xsec', 'data-anim': 'rise',
      'data-lightbox': A('brand/sheets/greasego-cross-section.webp'),
      'data-lightbox-alt': xsAlt, 'data-lightbox-cap': t(name)
    }, [el('img', { src: A('brand/sheets/greasego-cross-section.webp'), alt: xsAlt, loading: 'lazy' })]));
    add(xs);

    add(APP.blocks.steps({
      jump: { en: 'How it works', bm: 'Cara ia berfungsi' },
      eyebrow: { en: 'How it works', bm: 'Cara ia berfungsi' },
      heading: { en: 'Four stages in one pass', bm: 'Empat peringkat dalam satu laluan' },
      items: oi.steps
    }));

    var detail = APP.blocks._band('detail', { tone: 'wash', jump: { en: 'Benefits', bm: 'Kelebihan' } });
    detail.body.appendChild(el('div', { class: 'detail-grid', 'data-anim': 'rise' }, [
      el('div', null, [
        el('h2', labelAttrs({ en: 'Why workshops fit it', bm: 'Mengapa bengkel memasangnya' })),
        bilingualList(oi.benefits),
        el('h3', labelAttrs({ en: 'Built for', bm: 'Dibina untuk' })),
        el('ul', { class: 'badge-row' }, oi.applications.map(function (a) {
          return el('li', Object.assign({ class: 'badge' }, labelAttrs(a)));
        }))
      ]),
      el('div', { class: 'detail-side' }, [
        el('p', { class: 'fig sus-mark', text: 'SUS 304' }),
        el('h3', labelAttrs({ en: 'Stainless steel 304 throughout', bm: 'Keluli tahan karat 304 sepenuhnya' })),
        checkList(oi.material)
      ])
    ]));
    add(detail);

    add(APP.blocks.datatable({
      jump: S.ui.specs,
      eyebrow: S.ui.specs,
      heading: { en: 'The GTASP range', bm: 'Rangkaian GTASP' },
      columns: [
        { label: { en: 'Model', bm: 'Model' }, key: 'model', mono: true },
        { label: S.ui.flowRate, get: function (m) { return m.flow + ' L/min'; }, mono: true },
        { label: { en: 'Oil capacity, approx.', bm: 'Kapasiti minyak, anggaran' }, get: function (m) { return m.oil + ' L'; }, mono: true },
        { label: { en: 'Water capacity', bm: 'Kapasiti air' }, get: function (m) { return m.water + ' L'; }, mono: true },
        { label: { en: 'Inlet & outlet', bm: 'Salur masuk & keluar' }, get: function (m) { return m.pipe + ' mm'; }, mono: true },
        { label: { en: 'L x W x H', bm: 'P x L x T' }, get: function (m) { return m.l + ' x ' + m.w + ' x ' + m.h + ' mm'; }, mono: true },
        { label: { en: 'Inlet height', bm: 'Ketinggian salur masuk' }, get: function (m) { return m.inlet + ' mm'; }, mono: true },
        { label: { en: 'Outlet height', bm: 'Ketinggian salur keluar' }, get: function (m) { return m.outlet + ' mm'; }, mono: true }
      ],
      rows: oi.models,
      notes: [oi.note]
    }));

    add(APP.blocks.steps({
      tone: 'navy',
      jump: { en: 'The service', bm: 'Servis' },
      eyebrow: { en: 'The service', bm: 'Servis' },
      heading: { en: 'Not just pump and charge SW312', bm: 'Bukan sekadar mengepam dan mengenakan caj SW312' },
      body: oi.service.problem,
      items: oi.service.steps
    }));

    add(APP.blocks.cta({
      heading: { en: 'Size an interceptor for your workshop', bm: 'Saizkan pemintas untuk bengkel anda' },
      body: { en: 'Tell us how many service bays you run or the flow you need to handle. Custom sizes and an installation layout are proposed to suit the site.',
              bm: 'Beritahu kami bilangan ruang servis anda atau aliran yang perlu dikendalikan. Saiz tersuai dan susun atur pemasangan dicadangkan mengikut tapak.' },
      primary: { href: 'contact.html#enquiry', label: S.ui.requestQuote },
      whatsapp: true,
      waMessage: PM.lang === 'bm'
        ? 'Salam, saya berminat dengan Pemintas Minyak GreaseGo.'
        : 'Hello, I am interested in the GreaseGo Oil Interceptor.'
    }));

    APP.chassis.jumpbar([CRUMB_HOME, CRUMB_PRODUCTS, { href: 'oil-interceptor.html', label: name }]);
  };

  /* ---------------------------------------------- Scheduled Waste Guide */
  function verdictBadge(key, label) {
    return el('span', Object.assign({ class: 'sw-badge sw-badge--' + key }, labelAttrs(label)));
  }

  APP.pages.scheduledWaste = function () {
    var wo = L.wasteOil, pen = L.penalties;
    var name = { en: 'Scheduled Waste Guide', bm: 'Panduan Sisa Berjadual' };

    add(APP.blocks.hero({
      eyebrow: { en: 'Compliance', bm: 'Pematuhan' },
      heading: name,
      body: { en: 'Which waste oil you can sell, which you pay to dispose of, and what the law says when scheduled waste is handled wrongly.',
              bm: 'Minyak terpakai mana yang boleh dijual, mana yang perlu dibayar untuk dilupuskan, dan apa kata undang-undang apabila sisa berjadual dikendalikan dengan salah.' },
      img: 'brand/sheets/sw-sell-or-pay-sm.webp', frame: 'cert',
      ground: 'service/sewerage-3.webp',
      alt: t(wo.sheet.title),
      cta: { href: 'service.html?s=schedule-waste-collection-register',
             label: { en: 'Book a licensed collection', bm: 'Tempah kutipan berlesen' } }
    }));

    add(APP.blocks.datatable({
      tone: 'wash',
      jump: { en: 'Sell or pay', bm: 'Jual atau bayar' },
      eyebrow: { en: 'Scheduled waste oil', bm: 'Minyak sisa berjadual' },
      heading: { en: 'Can I sell it, or do I have to pay?', bm: 'Boleh saya jual, atau perlu saya bayar?' },
      body: wo.lead,
      before: el('ul', { class: 'sw-legend' }, wo.legend.map(function (l) {
        return el('li', null, [verdictBadge(l.key, l.label)]);
      })),
      wide: true,
      columns: [
        { label: { en: 'SW code', bm: 'Kod SW' }, key: 'code', mono: true },
        { label: { en: 'Type of waste oil', bm: 'Jenis minyak terpakai' }, get: function (r) {
          return el('span', { class: 'sw-type' }, [
            el('b', labelAttrs(r.type)),
            el('span', Object.assign({ class: 'cap' }, labelAttrs(r.examples)))
          ]);
        } },
        { label: { en: 'Typical condition', bm: 'Keadaan biasa' }, key: 'condition' },
        { label: { en: 'Market reality', bm: 'Realiti pasaran' }, key: 'market' },
        { label: { en: 'Can I get money?', bm: 'Boleh dapat wang?' }, get: function (r) { return verdictBadge(r.verdict, r.answer); } },
        { label: { en: 'Notes', bm: 'Nota' }, key: 'note' }
      ],
      rows: wo.codes,
      notes: [wo.footnote]
    }));

    add(APP.blocks.steps({
      jump: { en: 'The simple guide', bm: 'Panduan mudah' },
      eyebrow: { en: 'The simple guide', bm: 'Panduan mudah' },
      heading: { en: 'Three questions settle most cases', bm: 'Tiga soalan menyelesaikan kebanyakan kes' },
      cols: 3,
      items: wo.guide.map(function (g) { return { title: g.question, answer: g.answer, verdict: g.verdict }; })
    }));

    var value = APP.blocks._band('detail', { tone: 'wash', jump: { en: 'What sets the value', bm: 'Apa yang menentukan nilai' } });
    value.body.appendChild(el('div', { class: 'detail-grid', 'data-anim': 'rise' }, [
      el('div', null, [
        APP.ui.eyebrow({ en: 'What sets the value', bm: 'Apa yang menentukan nilai' }),
        el('h2', labelAttrs({ en: 'Keep it clean and it is worth more', bm: 'Simpan dengan bersih dan nilainya lebih tinggi' })),
        el('dl', { class: 'factor-list' }, wo.factors.reduce(function (acc, f) {
          return acc.concat([
            el('dt', labelAttrs(f.title)),
            el('dd', Object.assign({ class: 'cap' }, labelAttrs(f.body)))
          ]);
        }, []))
      ]),
      el('div', { class: 'detail-side' }, [
        el('h3', labelAttrs({ en: 'Before it leaves your site', bm: 'Sebelum ia meninggalkan tapak anda' })),
        bilingualList(wo.notes)
      ])
    ]));
    add(value);

    add(APP.blocks.figures({
      set: 'penalties', tone: 'navy',
      jump: { en: 'Penalties', bm: 'Hukuman' },
      eyebrow: { en: 'Penalties', bm: 'Hukuman' },
      heading: { en: 'Penalties for scheduled waste offences in Malaysia',
                 bm: 'Hukuman bagi kesalahan sisa berjadual di Malaysia' }
    }));

    add(APP.blocks.datatable({
      jump: { en: 'The offences', bm: 'Kesalahan' },
      eyebrow: { en: 'The offences', bm: 'Kesalahan' },
      heading: { en: 'Sixteen offences, and the maximum for each', bm: 'Enam belas kesalahan, dan hukuman maksimum bagi setiap satu' },
      columns: [
        { label: { en: 'No.', bm: 'No.' }, get: function (r) { return String(pen.offences.indexOf(r) + 1); }, mono: true },
        { label: { en: 'Offence', bm: 'Kesalahan' }, key: 'offence' },
        { label: { en: 'Relevant law', bm: 'Undang-undang berkaitan' }, key: 'law' },
        { label: { en: 'Maximum penalty', bm: 'Hukuman maksimum' }, get: function (r) {
          return r.serious ? pen.serious.penalty : pen.regulatory.penalty;
        } }
      ],
      rows: pen.offences,
      notes: [pen.amendment, pen.compound, pen.source]
    }));

    add(APP.blocks.cta({
      heading: { en: 'Have it collected, and recorded properly', bm: 'Minta ia dikutip, dan direkodkan dengan betul' },
      body: { en: 'Licensed collection, the inventory and the eSWIS consignment, set up together so the paperwork matches what left your site.',
              bm: 'Kutipan berlesen, inventori dan konsainan eSWIS, disediakan bersama supaya dokumen sepadan dengan apa yang keluar dari tapak anda.' },
      primary: { href: 'service.html?s=schedule-waste-collection-register',
                 label: { en: 'Scheduled waste collection', bm: 'Kutipan sisa berjadual' } },
      whatsapp: true
    }));

    APP.chassis.jumpbar([CRUMB_HOME, { href: 'scheduled-waste.html', label: name }]);
  };

  /* ------------------------------------------------------- Cleaning range */
  APP.pages.cleaningRange = function () {
    var name = { en: 'Cleaning Range', bm: 'Rangkaian Pembersihan' };
    var ask = PM.waLink(PM.lang === 'bm'
      ? 'Salam, boleh hantar senarai harga rangkaian pembersihan GreaseGo?'
      : 'Hello, could you send the price list for the GreaseGo cleaning range?');

    add(APP.blocks.hero({
      eyebrow: { en: 'Products', bm: 'Produk' },
      heading: name,
      body: { en: 'Thirty-two GreaseGo cleaning products for kitchens, floors, washrooms, laundry and workshops, most of them in 20, 10 and 5 litre containers.',
              bm: 'Tiga puluh dua produk pembersihan GreaseGo untuk dapur, lantai, tandas, dobi dan bengkel, kebanyakannya dalam bekas 20, 10 dan 5 liter.' },
      img: 'products/cleaning/01-dish-wash-high-foam.webp', frame: 'sheet',
      ground: 'news/factory.webp',
      alt: 'GreaseGo Dish Wash High Foam',
      cta: { href: ask, raw: true, label: { en: 'Ask for the price list', bm: 'Minta senarai harga' } }
    }));

    add(APP.blocks.lead({
      jump: { en: 'Introduction', bm: 'Pengenalan' },
      eyebrow: { en: 'One supplier', bm: 'Satu pembekal' },
      heading: { en: 'What the cleaning crew uses, from the people who service the trap',
                 bm: 'Apa yang digunakan kru pembersihan, daripada pihak yang menyelenggara perangkap' },
      body: [{ en: 'Dishwashing, floor care, disinfection, washroom hygiene, laundry and workshop degreasing. Every card gives the container sizes and the dilution, so you can see how far a container goes before you order.',
               bm: 'Pencucian pinggan, penjagaan lantai, pembasmian kuman, kebersihan tandas, dobi dan penyahgris bengkel. Setiap kad menunjukkan saiz bekas dan kadar pencairan, supaya anda tahu sejauh mana satu bekas boleh digunakan sebelum membuat pesanan.' }]
    }));

    add(APP.blocks.range({
      tone: 'wash',
      jump: { en: 'The range', bm: 'Rangkaian' },
      items: (L.cleaning || []).map(function (c) { return Object.assign({ brand: 'GreaseGo' }, c); }),
      groups: L.cleaningGroups || []
    }));

    add(APP.blocks.cta({
      heading: { en: 'Order by the container, or set up a standing supply',
                 bm: 'Pesan mengikut bekas, atau aturkan bekalan tetap' },
      body: { en: 'Tell us what you clean and how often. The sales desk sends the price list and the right dilution for each job.',
              bm: 'Beritahu kami apa yang anda bersihkan dan berapa kerap. Meja jualan akan menghantar senarai harga dan kadar pencairan yang betul bagi setiap kerja.' },
      primary: { href: 'contact.html#enquiry', label: S.ui.requestQuote },
      whatsapp: true,
      waMessage: PM.lang === 'bm'
        ? 'Salam, saya ingin bertanya tentang rangkaian pembersihan GreaseGo.'
        : 'Hello, I would like to ask about the GreaseGo cleaning range.'
    }));

    APP.chassis.jumpbar([CRUMB_HOME, CRUMB_PRODUCTS, { href: 'cleaning-range.html', label: name }]);
  };

  /* ---------------------------------------------------------------- FAQs */
  APP.pages.faq = function () {
    var name = { en: 'FAQs', bm: 'Soalan Lazim' };

    add(APP.blocks.hero({
      eyebrow: { en: 'Company', bm: 'Syarikat' },
      heading: { en: 'Frequently Asked Questions', bm: 'Soalan Lazim' },
      body: { en: 'Grease traps, the problems they cause, servicing, scheduled waste and ordering, answered in one place.',
              bm: 'Perangkap minyak, masalah yang ditimbulkannya, servis, sisa berjadual dan pesanan, dijawab di satu tempat.' },
      img: 'products/gta335-3.jpg',
      ground: 'news/factory.webp',
      alt: t({ en: 'A centralized grease trap on site', bm: 'Perangkap minyak berpusat di tapak' }),
      cta: { href: PM.waLink(), raw: true, label: { en: 'Ask us on WhatsApp', bm: 'Tanya kami di WhatsApp' } }
    }));

    (L.faqTopics || []).forEach(function (topic, i) {
      add(APP.blocks.faq({
        key: topic.id, id: 'faq-' + topic.id,
        tone: i % 2 ? 'wash' : null,
        jump: topic.title,
        eyebrow: topic.title,
        heading: topic.heading,
        items: topic.items.map(faqEntry)
      }));
    });

    add(APP.blocks.cta({
      heading: { en: 'Not answered here?', bm: 'Tiada jawapan di sini?' },
      body: { en: 'Send the question with a photo of the trap or the site. The sales and service desk replies the same working day.',
              bm: 'Hantar soalan bersama gambar perangkap atau tapak. Meja jualan dan servis akan membalas pada hari bekerja yang sama.' },
      primary: { href: 'contact.html#enquiry', label: { en: 'Contact us', bm: 'Hubungi kami' } },
      whatsapp: true
    }));

    APP.chassis.jumpbar([CRUMB_HOME, { href: 'faq.html', label: name }]);
  };

  /* ------------------------------------------------ the batch-two holder */
  var BUILT_TILES = [
    { href: 'index.html',         label: { en: 'Home', bm: 'Utama' }, figure: '01' },
    { href: 'grease-traps.html',  label: { en: 'Grease Traps', bm: 'Perangkap Minyak' }, figure: '02' },
    { href: 'model-finder.html',  label: { en: 'Model & Size Finder', bm: 'Pencari Model & Saiz' }, figure: '03' },
    { href: 'product.html?p=undersink-grease-trap-gta01',
      label: { en: 'Product detail', bm: 'Butiran produk' }, figure: '04' },
    { href: 'services.html',      label: { en: 'Services', bm: 'Perkhidmatan' }, figure: '05' },
    { href: 'about.html',         label: { en: 'Company Profile', bm: 'Profil Syarikat' }, figure: '06' },
    { href: 'contact.html',       label: { en: 'Contact', bm: 'Hubungi' }, figure: '07' }
  ];

  APP.pages.soon = function (name) {
    var asked = name === undefined ? (PM.param('p') || '') : name;
    var title = asked || t({ en: 'This page', bm: 'Halaman ini' });

    add(APP.blocks.hero({
      eyebrow: { en: 'In the next batch', bm: 'Dalam kelompok seterusnya' },
      heading: title,
      body: { en: 'This concept covers the home page plus six key pages. This one is part of the next batch, once the direction is approved.',
              bm: 'Konsep ini merangkumi halaman utama serta enam halaman utama. Halaman ini adalah sebahagian daripada kelompok seterusnya, setelah arah tuju diluluskan.' },
      img: 'gallery/project-03.jpg', frame: 'plate',
      alt: t({ en: 'A record of completed installations', bm: 'Rekod pemasangan yang telah siap' }),
      cta: { href: 'index.html', label: { en: 'Back to the home page', bm: 'Kembali ke halaman utama' } }
    }));

    add(APP.blocks.tiles({
      jump: { en: 'What is built', bm: 'Apa yang telah dibina' },
      tone: 'wash', cols: 4,
      eyebrow: { en: 'Built in this cut', bm: 'Dibina dalam potongan ini' },
      heading: { en: 'Seven pages you can walk through', bm: 'Tujuh halaman yang boleh anda lalui' },
      items: BUILT_TILES
    }));

    APP.chassis.jumpbar([CRUMB_HOME, { href: 'soon.html', label: title }]);
  };

  APP.init = function (pageFn) {
    PM.boot(function () {
      APP.chassis.header();
      APP.chassis.footer();
      if (typeof pageFn === 'function') pageFn(APP);
      bootMotion();
      PM.on('langchange', function () {
        PM.qsa('[data-lang-href]').forEach(function (n) {
          n.setAttribute('href', PM.langHref(n.getAttribute('data-lang-href')));
        });
      });
    });
  };

  root.APP = APP;
})(window, document);
