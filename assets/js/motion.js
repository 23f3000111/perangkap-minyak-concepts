/* =========================================================================
   Perangkap Minyak - motion engine
   One rAF loop, one IntersectionObserver pool, no dependencies.

   Everything here is opt-in through data attributes so it can be sprinkled
   over markup that already exists:

     data-anim="rise|fade|blur|clip|scale|slide-l|slide-r|mask"
     data-anim-delay="120"          milliseconds
     data-stagger="60"              stagger children of this element
     data-split="words|chars|lines" kinetic type, re-splits on language change
     data-parallax="-0.18"          fraction of viewport travel
     data-magnetic                  pointer pulls the element toward itself
     data-spotlight                 writes --mx/--my for a hover light
     data-tilt="8"                  3D tilt in degrees
     data-scene                     sticky scene, writes --p from 0 to 1
     data-marquee-auto="40"         seconds per loop, reacts to scroll speed
     data-roll                      odometer digits
     data-count                     handled by core.js, extended here

   Scroll is never hijacked. This site leans on position:sticky in several
   places and a transform-based smooth scroller breaks all of it.
   ========================================================================= */
(function (root, doc) {
  'use strict';

  var PM = root.PM;
  if (!PM) return;

  var M = {};
  var reduce = root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches;
  M.reduce = reduce;

  var qsa = PM.qsa;
  var qs = PM.qs;

  /* ------------------------------------------------------- the rAF ticker
     Every scroll-linked effect registers one function here. A single loop
     keeps layout reads batched and the main thread quiet. */
  var frameJobs = [];
  var running = false;
  var scrollY = root.scrollY || 0;
  var lastY = scrollY;
  var velocity = 0;
  var vh = root.innerHeight;
  var vw = root.innerWidth;

  function addJob(fn) { frameJobs.push(fn); start(); }

  function start() {
    if (running || !frameJobs.length) return;
    running = true;
    root.requestAnimationFrame(tick);
  }

  function tick() {
    scrollY = root.scrollY || doc.documentElement.scrollTop || 0;
    velocity += ((scrollY - lastY) - velocity) * 0.18;
    lastY = scrollY;
    for (var i = 0; i < frameJobs.length; i++) frameJobs[i](scrollY, velocity);
    root.requestAnimationFrame(tick);
  }

  root.addEventListener('resize', function () {
    vh = root.innerHeight;
    vw = root.innerWidth;
    PM.emit('motion:resize');
  }, { passive: true });

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  M.clamp = clamp;
  M.lerp = lerp;

  /* Progress of an element through the viewport, 0 as it enters from the
     bottom, 1 once it has left through the top. */
  function viewProgress(rect) {
    return clamp((vh - rect.top) / (vh + rect.height), 0, 1);
  }

  /* --------------------------------------------------------- entrance obs
     One observer for every reveal on the page. Elements unobserve after
     they land so nothing keeps ticking once the page settles. */
  var revealIO = null;

  function ensureRevealIO() {
    if (revealIO || !('IntersectionObserver' in root)) return revealIO;
    revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var n = e.target;
        var delay = parseInt(n.getAttribute('data-anim-delay') || '0', 10);
        if (delay) n.style.transitionDelay = delay + 'ms';
        n.classList.add('in');
        revealIO.unobserve(n);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.06 });
    return revealIO;
  }

  M.reveal = function (scope) {
    var nodes = qsa('[data-anim]:not([data-anim-bound])', scope);
    nodes.forEach(function (n) { n.setAttribute('data-anim-bound', ''); });

    /* Stagger containers hand a delay down to their own children so a grid
       lands as a wave rather than all at once. */
    qsa('[data-stagger]:not([data-stagger-bound])', scope).forEach(function (box) {
      box.setAttribute('data-stagger-bound', '');
      var step = parseInt(box.getAttribute('data-stagger') || '70', 10);
      var base = parseInt(box.getAttribute('data-anim-delay') || '0', 10);
      Array.prototype.forEach.call(box.children, function (child, i) {
        if (!child.hasAttribute('data-anim')) {
          child.setAttribute('data-anim', box.getAttribute('data-stagger-anim') || 'rise');
          child.setAttribute('data-anim-bound', '');
          nodes.push(child);
        }
        child.setAttribute('data-anim-delay', String(base + i * step));
      });
    });

    if (reduce || !('IntersectionObserver' in root)) {
      nodes.forEach(function (n) { n.classList.add('in'); });
      return;
    }
    var io = ensureRevealIO();
    nodes.forEach(function (n) { io.observe(n); });
  };

  /* ------------------------------------------------------------ split text
     Words and characters get their own element so type can arrive in
     sequence. The original string is kept on the node because applyI18n
     rewrites textContent wholesale when the language changes. */
  function splitOne(node) {
    var mode = node.getAttribute('data-split') || 'words';
    /* Always read what is in the node right now. applyI18n replaces the
       whole string on a language change, so a cached copy would be stale. */
    var source = node.textContent;
    node.textContent = '';
    node.classList.add('split', 'split--' + mode);

    var index = 0;
    var chunks = mode === 'chars' ? source.split('') : source.split(/(\s+)/);

    chunks.forEach(function (chunk) {
      if (/^\s+$/.test(chunk)) { node.appendChild(doc.createTextNode(chunk)); return; }
      if (!chunk) return;
      var line = doc.createElement('span');
      line.className = 'split-i';
      var inner = doc.createElement('span');
      inner.className = 'split-in';
      inner.textContent = chunk;
      inner.style.setProperty('--i', index++);
      line.appendChild(inner);
      node.appendChild(line);
    });
    node.style.setProperty('--split-n', index);
  }

  M.splitText = function (scope) {
    var nodes = qsa('[data-split]', scope);
    if (!nodes.length) return;
    nodes.forEach(function (n) {
      /* Re-split when the language swap has put a flat string back. */
      if (n.getAttribute('data-split-done') === '1' && qs('.split-i', n)) return;
      splitOne(n);
      n.setAttribute('data-split-done', '1');
      if (reduce) { n.classList.add('in'); return; }
      if (n.hasAttribute('data-split-now')) {
        root.requestAnimationFrame(function () { n.classList.add('in'); });
      } else if ('IntersectionObserver' in root) {
        var io = new IntersectionObserver(function (es) {
          es.forEach(function (e) {
            if (!e.isIntersecting) return;
            e.target.classList.add('in');
            io.unobserve(e.target);
          });
        }, { threshold: 0.15 });
        io.observe(n);
      } else {
        n.classList.add('in');
      }
    });
  };

  /* -------------------------------------------------------------- parallax */
  M.parallax = function (scope) {
    var nodes = qsa('[data-parallax]:not([data-px-bound])', scope);
    if (!nodes.length || reduce) return;
    nodes.forEach(function (n) { n.setAttribute('data-px-bound', ''); });

    var items = nodes.map(function (n) {
      return { el: n, rate: parseFloat(n.getAttribute('data-parallax')) || -0.15, y: 0 };
    });

    addJob(function () {
      for (var i = 0; i < items.length; i++) {
        var it = items[i];
        var r = it.el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        var centre = r.top + r.height / 2 - vh / 2;
        var target = centre * it.rate;
        it.y = lerp(it.y, target, 0.12);
        it.el.style.setProperty('--py', it.y.toFixed(2) + 'px');
      }
    });
  };

  /* ---------------------------------------------------------- scroll scene
     A sticky element writes its own scroll progress into --p, which the
     stylesheet and any scene script read. This is how the chamber sequence
     and the flow console are driven. */
  M.scenes = function (scope) {
    var nodes = qsa('[data-scene]:not([data-scene-bound])', scope);
    if (!nodes.length) return;
    nodes.forEach(function (n) { n.setAttribute('data-scene-bound', ''); });

    var items = nodes.map(function (n) {
      return { el: n, p: 0, steps: parseInt(n.getAttribute('data-scene-steps') || '0', 10) };
    });

    if (reduce) {
      items.forEach(function (it) {
        it.el.style.setProperty('--p', '1');
        it.el.setAttribute('data-step', String(Math.max(0, it.steps - 1)));
      });
      return;
    }

    addJob(function () {
      for (var i = 0; i < items.length; i++) {
        var it = items[i];
        var r = it.el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) continue;
        /* Progress across the scene's own scroll length, not the viewport. */
        var travel = r.height - vh;
        var raw = travel > 0 ? clamp(-r.top / travel, 0, 1) : viewProgress(r);
        it.p = lerp(it.p, raw, 0.14);
        it.el.style.setProperty('--p', it.p.toFixed(4));
        if (it.steps) {
          var step = clamp(Math.floor(it.p * it.steps), 0, it.steps - 1);
          if (it.el.getAttribute('data-step') !== String(step)) {
            it.el.setAttribute('data-step', String(step));
            PM.emit('scene:step', { el: it.el, step: step });
          }
        }
        PM.emit('scene:progress', { el: it.el, p: it.p });
      }
    });
  };

  /* -------------------------------------------------------------- magnetic
     Buttons lean toward the cursor and spring back on leave. Pointer-fine
     only, so touch is never affected. */
  M.magnetic = function (scope) {
    if (reduce || !root.matchMedia || !root.matchMedia('(pointer: fine)').matches) return;
    qsa('[data-magnetic]:not([data-mag-bound])', scope).forEach(function (n) {
      n.setAttribute('data-mag-bound', '');
      var strength = parseFloat(n.getAttribute('data-magnetic')) || 0.32;
      var raf = null, tx = 0, ty = 0, cx = 0, cy = 0;

      function loop() {
        cx = lerp(cx, tx, 0.18);
        cy = lerp(cy, ty, 0.18);
        n.style.setProperty('--mgx', cx.toFixed(2) + 'px');
        n.style.setProperty('--mgy', cy.toFixed(2) + 'px');
        if (Math.abs(cx - tx) > 0.1 || Math.abs(cy - ty) > 0.1) raf = root.requestAnimationFrame(loop);
        else raf = null;
      }
      function kick() { if (!raf) raf = root.requestAnimationFrame(loop); }

      n.addEventListener('pointermove', function (e) {
        var r = n.getBoundingClientRect();
        tx = (e.clientX - (r.left + r.width / 2)) * strength;
        ty = (e.clientY - (r.top + r.height / 2)) * strength;
        kick();
      });
      n.addEventListener('pointerleave', function () { tx = 0; ty = 0; kick(); });
    });
  };

  /* ------------------------------------------------------------- spotlight */
  M.spotlight = function (scope) {
    if (!root.matchMedia || !root.matchMedia('(pointer: fine)').matches) return;
    qsa('[data-spotlight]:not([data-sl-bound])', scope).forEach(function (n) {
      n.setAttribute('data-sl-bound', '');
      n.addEventListener('pointermove', function (e) {
        var r = n.getBoundingClientRect();
        n.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(2) + '%');
        n.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(2) + '%');
      });
    });
  };

  /* ------------------------------------------------------------------ tilt */
  M.tilt = function (scope) {
    if (reduce || !root.matchMedia || !root.matchMedia('(pointer: fine)').matches) return;
    qsa('[data-tilt]:not([data-tilt-bound])', scope).forEach(function (n) {
      n.setAttribute('data-tilt-bound', '');
      var max = parseFloat(n.getAttribute('data-tilt')) || 7;
      n.addEventListener('pointermove', function (e) {
        var r = n.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        n.style.setProperty('--rx', (-py * max).toFixed(2) + 'deg');
        n.style.setProperty('--ry', (px * max).toFixed(2) + 'deg');
      });
      n.addEventListener('pointerleave', function () {
        n.style.setProperty('--rx', '0deg');
        n.style.setProperty('--ry', '0deg');
      });
    });
  };

  /* --------------------------------------------------------------- marquee
     Runs on transform rather than a CSS keyframe so scroll velocity can
     push it. Scrolling down speeds the belt up; scrolling up drags it back. */
  M.marquee = function (scope) {
    var nodes = qsa('[data-marquee-auto]:not([data-mq-bound])', scope);
    if (!nodes.length) return;
    nodes.forEach(function (n) { n.setAttribute('data-mq-bound', ''); });

    nodes.forEach(function (belt) {
      var track = qs('.marquee-track', belt) || belt.firstElementChild;
      if (!track) return;
      /* Duplicate until the belt is at least twice the viewport so the loop
         never shows a gap on a wide screen. */
      var original = track.innerHTML;
      var guard = 0;
      while (track.scrollWidth < vw * 2 && guard < 8) { track.innerHTML += original; guard++; }

      var speed = parseFloat(belt.getAttribute('data-marquee-auto')) || 40;
      var dir = belt.getAttribute('data-marquee-dir') === 'right' ? 1 : -1;
      var half = track.scrollWidth / 2;
      var x = 0;

      if (reduce) return;

      addJob(function (y, v) {
        var r = belt.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        x += dir * (speed / 60) + v * 0.35 * dir * -1;
        if (half > 0) {
          if (x <= -half) x += half;
          if (x >= 0) x -= half;
        }
        track.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
      });

      PM.on('motion:resize', function () { half = track.scrollWidth / 2; });
    });
  };

  /* ----------------------------------------------------------- digit roll
     Odometer for figures that should feel measured rather than counted. */
  M.roll = function (scope) {
    var nodes = qsa('[data-roll]:not([data-roll-bound])', scope);
    if (!nodes.length) return;
    nodes.forEach(function (n) {
      n.setAttribute('data-roll-bound', '');
      var value = n.getAttribute('data-roll');
      /* Each slot holds all ten digits and shows one through an overflow
         window, so the text content is nonsense to a screen reader. Expose
         the real figure instead. */
      n.setAttribute('role', 'img');
      n.setAttribute('aria-label', value);
      n.textContent = '';
      value.split('').forEach(function (ch, i) {
        var slot = doc.createElement('span');
        slot.className = 'roll-slot';
        if (!/[0-9]/.test(ch)) {
          slot.className = 'roll-fixed';
          slot.textContent = ch;
          n.appendChild(slot);
          return;
        }
        var strip = doc.createElement('span');
        strip.className = 'roll-strip';
        strip.style.setProperty('--d', ch);
        strip.style.setProperty('--i', i);
        for (var d = 0; d <= 9; d++) {
          var digit = doc.createElement('span');
          digit.textContent = String(d);
          strip.appendChild(digit);
        }
        slot.appendChild(strip);
        n.appendChild(slot);
      });
      if (reduce) { n.classList.add('in'); return; }
      if ('IntersectionObserver' in root) {
        var io = new IntersectionObserver(function (es) {
          es.forEach(function (e) {
            if (!e.isIntersecting) return;
            e.target.classList.add('in');
            io.unobserve(e.target);
          });
        }, { threshold: 0.6 });
        io.observe(n);
      } else { n.classList.add('in'); }
    });
  };

  /* -------------------------------------------------------- scroll progress */
  M.progressBar = function () {
    if (qs('.scroll-progress')) return;
    var bar = doc.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    doc.body.appendChild(bar);
    addJob(function (y) {
      var max = doc.documentElement.scrollHeight - vh;
      bar.style.setProperty('--sp', max > 0 ? (y / max).toFixed(4) : '0');
    });
  };

  /* --------------------------------------------------------------- cursor
     "drop" is a soft bead for the water column. Fine pointers only, and never
     over a form control, where the reader needs the real caret to know what
     they are doing. */
  M.cursor = function (kind, opts) {
    if (reduce || !root.matchMedia || !root.matchMedia('(pointer: fine)').matches) return;
    if (qs('.cursor')) return;
    opts = opts || {};
    var cur = doc.createElement('div');
    cur.className = 'cursor cursor--' + (kind || 'drop');
    cur.setAttribute('aria-hidden', 'true');
    cur.appendChild(doc.createElement('span')).className = 'cursor-dot';
    cur.appendChild(doc.createElement('span')).className = 'cursor-ring';

    doc.body.appendChild(cur);
    doc.documentElement.classList.add('has-cursor');

    var tx = vw / 2, ty = vh / 2, cx = tx, cy = ty, on = false;
    doc.addEventListener('pointermove', function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!on) { on = true; cur.classList.add('is-on'); cx = tx; cy = ty; }
      var t = e.target;
      /* Text entry keeps the system caret: a fake cursor over a field is
         the point where this stops being decoration and starts being a
         usability problem. */
      var typing = t.closest && t.closest('input,textarea,select,[contenteditable]');
      doc.documentElement.classList.toggle('cursor-off', !!typing);
      var interactive = t.closest && t.closest('a,button,[role="button"],[data-lightbox],summary');
      cur.classList.toggle('is-hot', !!interactive && !typing);
    }, { passive: true });
    doc.addEventListener('pointerleave', function () { cur.classList.remove('is-on'); on = false; });
    doc.addEventListener('pointerdown', function () { cur.classList.add('is-down'); });
    doc.addEventListener('pointerup', function () { cur.classList.remove('is-down'); });

    addJob(function () {
      cx = lerp(cx, tx, kind === 'cross' ? 0.42 : 0.18);
      cy = lerp(cy, ty, kind === 'cross' ? 0.42 : 0.18);
      cur.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0)';
    });
  };

  /* ----------------------------------------------------------- page enter
     A short curtain on first paint, then the hero plays its own sequence.
     Internal links fade out before navigating so moving between pages does
     not flash white. */
  M.pageTransitions = function (kind) {
    doc.documentElement.classList.add('page-in');
    doc.documentElement.setAttribute('data-transition', kind || 'fade');
    root.setTimeout(function () { doc.documentElement.classList.add('page-settled'); }, 900);
    if (reduce) return;

    /* The wipe is a real element rather than a body fade, so the drawing
       sheet can slide off and the water can sweep across. */
    var wipe = doc.createElement('div');
    wipe.className = 'page-wipe';
    wipe.setAttribute('aria-hidden', 'true');
    doc.body.appendChild(wipe);

    doc.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a) return;
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#' || a.target === '_blank') return;
      if (/^(https?:|mailto:|tel:|javascript:)/i.test(href)) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      doc.documentElement.classList.add('page-out');
      root.setTimeout(function () { root.location.href = href; }, 420);
    });
    /* Coming back through history must not land on a faded page. */
    root.addEventListener('pageshow', function (e) {
      if (e.persisted) doc.documentElement.classList.remove('page-out');
    });
  };

  /* ----------------------------------------------------- section headroom
     Header switches to its condensed glass state and hides on scroll down.
     Reappears the moment the reader scrolls up. */
  M.headerAuto = function () {
    var header = qs('.header');
    if (!header) return;
    var hidden = false;
    var top = 0;
    addJob(function (y, v) {
      header.classList.toggle('is-stuck', y > 12);
      if (y < 200) { if (hidden) { header.classList.remove('is-away'); hidden = false; } top = y; return; }
      if (v > 2 && !hidden) { header.classList.add('is-away'); hidden = true; }
      else if (v < -2 && hidden) { header.classList.remove('is-away'); hidden = false; }
      top = y;
    });
  };

  /* ---------------------------------------------------------------- depth
     One number, written to the document, that everything else can read:
     how far down the page the reader has travelled. The water column uses
     it to deepen the ground; the drawing sheet uses it for the sheet
     counter. */
  M.depthDriver = function () {
    var d = 0;
    addJob(function (y) {
      var max = doc.documentElement.scrollHeight - vh;
      var target = max > 0 ? clamp(y / max, 0, 1) : 0;
      d = lerp(d, target, 0.16);
      doc.documentElement.style.setProperty('--depth', d.toFixed(4));
    });
    M.depth = function () { return d; };
  };
  M.depth = function () { return 0; };

  /* ------------------------------------------------------- velocity skew
     Blocks lean very slightly into the direction of travel. Two degrees at
     most, so it registers as weight rather than as an effect. */
  M.skew = function (scope) {
    if (reduce) return;
    var nodes = qsa('[data-skew]:not([data-skew-bound])', scope);
    if (!nodes.length) return;
    nodes.forEach(function (n) { n.setAttribute('data-skew-bound', ''); });
    addJob(function (y, v) {
      var s = clamp(v * 0.05, -2.2, 2.2);
      for (var i = 0; i < nodes.length; i++) {
        var r = nodes[i].getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) continue;
        nodes[i].style.setProperty('--skew', s.toFixed(2) + 'deg');
      }
    });
  };

  /* ------------------------------------------------------------- ambience
     A fixed grain plate and, on the brand site, an aurora that drifts with
     the scroll. Both are painted once and moved on the compositor. */
  M.ambience = function (opts) {
    opts = opts || {};
    if (opts.grain && !qs('.grain')) {
      var g = doc.createElement('div');
      g.className = 'grain';
      g.setAttribute('aria-hidden', 'true');
      doc.body.appendChild(g);
    }
    if (opts.aurora && !qs('.aurora')) {
      var a = doc.createElement('div');
      a.className = 'aurora';
      a.setAttribute('aria-hidden', 'true');
      a.innerHTML = '<span class="aurora-a"></span><span class="aurora-b"></span><span class="aurora-c"></span>';
      doc.body.insertBefore(a, doc.body.firstChild);
      if (!reduce) {
        addJob(function (y) {
          a.style.setProperty('--ay', (y * 0.06).toFixed(1) + 'px');
        });
      }
    }
  };

  /* ---------------------------------------------------------------- scan
     Applies to anything that should sweep a light bar across itself once
     when it lands. Used on the spec tables and certificate plates. */
  M.scan = function (scope) {
    if (reduce || !('IntersectionObserver' in root)) return;
    var nodes = qsa('[data-scan]:not([data-scan-bound])', scope);
    if (!nodes.length) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('scanned');
        io.unobserve(e.target);
      });
    }, { threshold: 0.25 });
    nodes.forEach(function (n) { n.setAttribute('data-scan-bound', ''); io.observe(n); });
  };

  /* ------------------------------------------------------------------ run */
  M.enhance = function (scope) {
    M.reveal(scope);
    M.splitText(scope);
    M.parallax(scope);
    M.scenes(scope);
    M.magnetic(scope);
    M.spotlight(scope);
    M.tilt(scope);
    M.marquee(scope);
    M.roll(scope);
    M.scan(scope);
    M.skew(scope);
  };

  M.boot = function (opts) {
    opts = opts || {};
    M.ambience(opts);
    M.depthDriver();
    M.progressBar();
    M.headerAuto();
    M.pageTransitions(opts.transition);
    if (opts.cursor) M.cursor(opts.cursor, opts);
    M.enhance();
    PM.on('render', function () { root.setTimeout(function () { M.enhance(); }, 0); });
  };

  M.addJob = addJob;
  M.velocity = function () { return velocity; };
  M.viewProgress = viewProgress;
  M.vh = function () { return vh; };
  M.vw = function () { return vw; };
  PM.motion = M;
})(window, document);
