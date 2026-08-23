/* =========================================================================
   Perangkap Minyak - the frame system

   The supplied photography has five different native shapes and they do not
   agree with each other:

     products      832 x 832 square, white marketing artwork   ratio 1.00
     a few product photos                                      ratio 0.45 - 0.75
     project plates, site name printed into the picture        ratio 0.79 - 1.17
     awards and certificates                                   ratio 0.70 - 0.76
     council crests, as small as 77px                          ratio 0.81 - 1.13
     install steps and factory photography                     ratio 1.36 - 1.51

   Forcing one frame shape onto all of them is what produced the cropped
   captions and the empty bars. So no frame has a fixed shape here. Each one
   measures the image it actually holds and takes that shape, clamped into a
   range so a grid still lines up. Only an image outside its clamp falls back
   to letterboxing, and then onto a plate the same tone as the page, so the
   spare room reads as margin rather than as a hole.

   Markup:  <figure class="frame frame--product"><img src="..."></figure>
   or just add data-frame to any element that wraps a single image.
   ========================================================================= */
(function (root, doc) {
  'use strict';

  var PM = root.PM;
  if (!PM) return;

  /* Per context: how far the frame may stretch to meet its image, and what
     to do when the image is outside that. Ranges come from the measured
     ratios above, widened just enough to swallow the outliers in each set. */
  var KINDS = {
    product:  { min: 0.80, max: 1.25, fallback: 1,      fit: 'cover' },
    /* A fixed shape, for the product card. images[0] is sometimes the red
       marketing poster and sometimes a photograph, and a card grid needs
       one height either way. Four by three is the shape that costs least:
       a square poster loses no content and its spare width is white on a
       white plate, and the landscape photographs fill it exactly. */
    cardart:  { fixed: 1.34, fit: 'contain' },
    /* Its photographic twin. Same fixed height so a card grid stays level,
       but a photograph bleeds to the edge instead of sitting on a plate. */
    card:     { fixed: 1.34, fit: 'cover' },
    plate:    { min: 0.70, max: 1.30, fallback: 0.85,   fit: 'cover' },
    cert:     { min: 0.62, max: 0.85, fallback: 0.72,   fit: 'contain' },
    /* The project archive plates: composite sheets between 0.79 and 1.17,
       each with the site name printed into the picture. Shown whole, and
       near enough to their own shape that they are not swimming in a
       landscape frame the way cardart left them. */
    sheet:    { min: 0.72, max: 1.22, fallback: 0.95,   fit: 'contain' },
    crest:    { min: 0.55, max: 1.60, fallback: 1,      fit: 'contain' },
    photo:    { min: 1.20, max: 1.90, fallback: 1.5,    fit: 'cover' },
    /* Service artwork is square, and the two photographs mixed into the set
       are very tall. Holding the floor at square keeps the media panels an
       even height down the page instead of one running to 850px. */
    service:  { min: 1.00, max: 1.45, fallback: 1,      fit: 'cover' },
    portrait: { min: 0.60, max: 0.90, fallback: 0.75,   fit: 'cover' },
    report:   { min: 0.60, max: 0.85, fallback: 0.71,   fit: 'contain' },
    free:     { min: 0.30, max: 3.00, fallback: 1,      fit: 'cover' }
  };

  function kindOf(frame) {
    var explicit = frame.getAttribute('data-frame');
    if (explicit && KINDS[explicit]) return explicit;
    for (var k in KINDS) {
      if (frame.classList.contains('frame--' + k)) return k;
    }
    return 'free';
  }

  function apply(frame, img) {
    var w = img.naturalWidth;
    var h = img.naturalHeight;
    if (!w || !h) return;

    var kind = KINDS[kindOf(frame)];
    var ar = w / h;

    /* Never enlarge a small source. Several council crests are under 120px
       and blow up into mush. This is checked first because it applies
       whichever branch the shape takes below. */
    if (w < 260) {
      frame.setAttribute('data-small', '');
      frame.style.setProperty('--natural-w', w + 'px');
    }

    if (kind.fixed) {
      frame.style.setProperty('--ar', String(kind.fixed));
      frame.setAttribute('data-fit', kind.fit);
      return frame.setAttribute('data-measured', '');
    }

    if (ar >= kind.min && ar <= kind.max) {
      /* The frame takes the image's own shape. Nothing is cropped away and
         nothing is left over, whichever fit is in use. */
      frame.style.setProperty('--ar', ar.toFixed(4));
      frame.setAttribute('data-fit', kind.fit);
      return frame.setAttribute('data-measured', '');
    }

    /* Outside the range the frame bends as far toward the image as the grid
       allows, and the image covers whatever is left. Snapping straight to a
       nominal shape is what produced the empty bars, and it crops far more
       than bending does. */
    var bent = ar < kind.min ? kind.min : kind.max;
    frame.style.setProperty('--ar', bent.toFixed(4));
    frame.setAttribute('data-fit', kind.fit);
    frame.setAttribute('data-bent', ar > kind.max ? 'wide' : 'tall');

    /* Documents are the exception. A certificate or a lab report has to be
       readable end to end, so it is shown whole even at the cost of margin. */
    if (kind.fit === 'contain') {
      frame.style.setProperty('--ar', String(kind.fallback));
    }

    frame.setAttribute('data-measured', '');
  }

  function measure(frame) {
    if (frame.hasAttribute('data-measured')) return;
    var img = frame.querySelector('img');
    if (!img) return;
    if (img.complete && img.naturalWidth) { apply(frame, img); return; }
    img.addEventListener('load', function () { apply(frame, img); }, { once: true });
    img.addEventListener('error', function () {
      frame.style.setProperty('--ar', String(KINDS[kindOf(frame)].fallback));
      frame.setAttribute('data-measured', '');
      frame.setAttribute('data-broken', '');
    }, { once: true });
  }

  PM.frames = function (scope) {
    PM.qsa('.frame, [data-frame]', scope).forEach(measure);
  };

  /* ------------------------------------------------------------ the policy

     Half of the supplied library is not photography. Product artwork,
     project plates, certificates, lab reports and marketing banners all
     carry words printed into the picture, and a cover crop cuts those
     words in half - which is exactly what the model name, the council
     name and the test result are. A photograph of a kitchen has no such
     content at its edges and crops without losing anything.

     So the rule is by source, not by slot: anything with text baked in is
     shown whole on a plate, everything else may bleed. Callers ask here
     rather than each deciding for itself, so one answer holds across both
     sites and every block.  */
  /* Folders whose contents carry words: marketing artwork, project plates,
     certificate and council scans, service artwork, the installation
     diagrams, and the supplied banners. */
  var WHOLE = /^(products|gallery|certs|approvals|lab|service|install|brand)\//;

  /* The photographs mixed into those folders, named rather than guessed at.
     Every one was checked against the file, not the filename. */
  var PHOTO = {
    'news/factory.webp': 1,
    'products/adu-cabinet-2.webp': 1, 'products/adu-cabinet-3.webp': 1,
    'products/adu-cabinet-4.webp': 1, 'products/adu-cabinet-5.webp': 1,
    'products/adu9291p-2.webp': 1, 'products/adu9291p-3.webp': 1,
    'products/gta03c-1.webp': 1, 'products/gta325-2.jpg': 1,
    'products/gta335-2.jpg': 1, 'products/gta335-3.jpg': 1, 'products/gta335-4.webp': 1,
    'products/gts01-2.webp': 1, 'products/gts01-3.webp': 1,
    'products/gts02-2.webp': 1, 'products/gts02-3.webp': 1,
    'products/gts02-4.webp': 1, 'products/gts02-5.webp': 1
  };

  PM.showsWhole = function (path) {
    var p = String(path || '').replace(/^[./]+/, '');
    if (PHOTO[p]) return false;
    return WHOLE.test(p);
  };

  /* The frame kind a source should be given when a block has not named one.
     'cardart' is the fixed-height plate that keeps a grid even; 'photo' is
     the measured bleed frame. */
  PM.frameFor = function (path, gridded) {
    if (PM.showsWhole(path)) return gridded === false ? 'crest' : 'cardart';
    return 'photo';
  };

  /* Pages build their markup from data, so re-scan whenever they redraw. */
  PM.on('ready', function () { PM.frames(); });
  PM.on('render', function () { root.setTimeout(function () { PM.frames(); }, 0); });
})(window, document);
