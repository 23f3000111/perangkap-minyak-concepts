/* =========================================================================
   Perangkap Minyak - the two signature scenes

     PM.scenes.blueprint(mount, opts)  a shop drawing that draws itself
     PM.scenes.column(canvas, opts)    a water column you descend through

   Both come from the same fact, that the product separates liquids by
   density. One states it as a drawing issued to a fabricator, the other as
   the thing actually happening in the tank.
   ========================================================================= */
(function (root, doc) {
  'use strict';

  var PM = root.PM;
  if (!PM) return;

  var NS = 'http://www.w3.org/2000/svg';
  var reduce = root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function svg(tag, attrs) {
    var n = doc.createElementNS(NS, tag);
    for (var k in attrs) {
      if (attrs[k] === null || attrs[k] === undefined) continue;
      n.setAttribute(k, attrs[k]);
    }
    return n;
  }

  function rand(a, b) { return a + Math.random() * (b - a); }

  /* Anything drawn gets a normalised path length, so one pair of dash rules
     animates a rectangle, a line and a curve identically. */
  function drawable(node, delay) {
    node.setAttribute('pathLength', '1');
    node.classList.add('bp-draw');
    if (delay) node.style.transitionDelay = delay + 'ms';
    return node;
  }

  function fading(node, delay) {
    node.classList.add('bp-fade');
    if (delay) node.style.transitionDelay = delay + 'ms';
    return node;
  }

  /* =======================================================================
     Blueprint

     Issued as a drawing would be: outline first, then the internals, then
     the fills, then the dimensions extend and get their figures, then the
     flow starts running. Redraws whenever the selected model changes.
     ===================================================================== */
  function blueprint(mount, opts) {
    opts = opts || {};
    var uid = 'bp' + Math.random().toString(36).slice(2, 8);

    /* A grease trap is wider than it is tall, so the sheet is too. */
    var W = 900, H = 430;
    var padL = 92, padR = 88, padT = 54, padB = 76;
    var tx = padL, ty = padT, tw = W - padL - padR, th = H - padT - padB;

    /* Wall thickness, drawn as a real double line. A section through a
       fabricated vessel shows the plate; a single outline shows a box. */
    var wall = 5;
    var ix = tx + wall, iy = ty + wall;
    var iw = tw - wall * 2, ih = th - wall * 2;

    var b1 = ix + iw * 0.36;
    var b2 = ix + iw * 0.68;
    var baffleW = 5;

    var waterY = iy + ih * 0.20;   /* the working water line */
    var fogH = ih * 0.11;          /* the slick sits on top of it */
    var bedH = ih * 0.08;
    var inY = iy + ih * 0.10;
    var outY = iy + ih * 0.52;

    var chambers = [[ix, b1], [b1 + baffleW, b2], [b2 + baffleW, ix + iw]];

    var root_ = svg('svg', {
      viewBox: '0 0 ' + W + ' ' + H,
      class: 'bp',
      role: 'img',
      'aria-label': 'Section through a three chamber grease trap. Waste enters at the top left, fat collects as a floating layer, two baffles hold it back while water passes underneath, solids settle to the bed, and cleaner water leaves at the right.'
    });

    /* ---- hatching. Drawing convention for a material, and it stops the
       fat layer reading as a flat slab of colour. */
    var defs = svg('defs');
    var hatch = svg('pattern', {
      id: uid + '-hatch', width: 7, height: 7,
      patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)'
    });
    hatch.appendChild(svg('rect', { width: 7, height: 7, class: 'bp-hatch-bg' }));
    hatch.appendChild(svg('line', { x1: 0, y1: 0, x2: 0, y2: 7, class: 'bp-hatch-line' }));
    defs.appendChild(hatch);
    root_.appendChild(defs);

    /* ---- registration marks */
    var marks = svg('g', { class: 'bp-marks' });
    [[20, 20], [W - 20, 20], [20, H - 20], [W - 20, H - 20]].forEach(function (p, i) {
      marks.appendChild(drawable(svg('path', {
        d: 'M' + (p[0] - 9) + ' ' + p[1] + ' H' + (p[0] + 9) + ' M' + p[0] + ' ' + (p[1] - 9) + ' V' + (p[1] + 9)
      }), i * 60));
    });
    root_.appendChild(marks);

    /* ---- the chamber the reader is being told about, tinted under
       everything rather than boxed in dashes over the top */
    var lit = svg('rect', { class: 'bp-lit', x: ix, y: iy, width: 0, height: ih });
    lit.setAttribute('opacity', '0');
    root_.appendChild(lit);

    /* ---- contents */
    var fills = svg('g', { class: 'bp-fills' });
    fills.appendChild(fading(svg('rect', {
      x: ix, y: waterY, width: iw, height: iy + ih - waterY, class: 'bp-water'
    }), 620));

    /* The fat is thickest in the first chamber and almost gone by the
       third. That gradient across the tank is the argument for three. */
    var fogScale = [1, 0.62, 0.22];
    chambers.forEach(function (c, i) {
      var h = fogH * fogScale[i];
      var band = fading(svg('rect', {
        x: c[0], y: waterY - h, width: c[1] - c[0], height: h, class: 'bp-fog'
      }), 700 + i * 80);
      /* Inline, so a stylesheet fill on .bp-fog cannot replace the hatch. */
      band.style.fill = 'url(#' + uid + '-hatch)';
      fills.appendChild(band);
      fills.appendChild(drawable(svg('line', {
        x1: c[0], y1: waterY - h, x2: c[1], y2: waterY - h, class: 'bp-fog-top'
      }), 720 + i * 80));
    });

    /* The water line itself, the one continuous rule across the section. */
    fills.appendChild(drawable(svg('line', {
      x1: ix, y1: waterY, x2: ix + iw, y2: waterY, class: 'bp-waterline'
    }), 660));

    /* Sediment as stipple, not a slab. */
    var bedY = iy + ih - bedH;
    var stip = svg('g', { class: 'bp-bed' });
    for (var sx = ix + 5; sx < ix + iw - 3; sx += 9) {
      for (var sy = bedY + 4; sy < iy + ih - 2; sy += 6) {
        stip.appendChild(svg('circle', {
          cx: (sx + (sy % 12 ? 4 : 0)).toFixed(1), cy: sy.toFixed(1), r: 1.1
        }));
      }
    }
    fills.appendChild(fading(stip, 900));
    root_.appendChild(fills);

    /* ---- particles */
    var partG = svg('g', { class: 'bp-parts' });
    var parts = [], grit = [];
    for (var i = 0; i < 28; i++) {
      var node = svg('circle', { r: rand(1.6, 4).toFixed(1), class: 'bp-fat' });
      partG.appendChild(node);
      parts.push({ node: node, c: Math.floor(rand(0, 3)), x: Math.random(), y: rand(0.25, 1), v: rand(0.0016, 0.0044) });
    }
    for (var j = 0; j < 14; j++) {
      var gnode = svg('circle', { r: rand(0.9, 1.8).toFixed(1), class: 'bp-grit' });
      partG.appendChild(gnode);
      grit.push({ node: gnode, c: Math.floor(rand(0, 3)), x: Math.random(), y: rand(0.2, 0.85), v: rand(0.0009, 0.0024) });
    }
    root_.appendChild(partG);

    /* ---- the flow, one continuous line with rounded corners, held well
       clear of the baffles so it never reads as a box */
    var lo = iy + ih - bedH - 13;
    var rise = ix + iw - 52;
    var route = [
      [ix + 26, inY], [ix + 26, lo], [rise, lo], [rise, outY], [ix + iw - 14, outY]
    ];
    var r = 14;
    var d = 'M' + route[0][0] + ' ' + route[0][1];
    for (var k = 1; k < route.length - 1; k++) {
      var p0 = route[k - 1], p1 = route[k], p2 = route[k + 1];
      var v1x = p1[0] - p0[0], v1y = p1[1] - p0[1];
      var v2x = p2[0] - p1[0], v2y = p2[1] - p1[1];
      var l1 = Math.hypot(v1x, v1y), l2 = Math.hypot(v2x, v2y);
      var t1 = Math.min(r, l1 / 2) / l1, t2 = Math.min(r, l2 / 2) / l2;
      d += ' L' + (p1[0] - v1x * t1).toFixed(1) + ' ' + (p1[1] - v1y * t1).toFixed(1);
      d += ' Q' + p1[0] + ' ' + p1[1] + ' ' + (p1[0] + v2x * t2).toFixed(1) + ' ' + (p1[1] + v2y * t2).toFixed(1);
    }
    d += ' L' + route[route.length - 1][0] + ' ' + route[route.length - 1][1];

    root_.appendChild(drawable(svg('path', { d: d, class: 'bp-route' }), 1080));
    root_.appendChild(fading(svg('path', { d: d, class: 'bp-runner' }), 1360));

    /* Two arrowheads, so the direction is never in question. */
    [[(ix + 26 + rise) / 2, lo, 0], [ix + iw - 30, outY, 0]].forEach(function (a, i) {
      root_.appendChild(fading(svg('path', {
        d: 'M6 0 L-4 -5 L-4 5 Z', class: 'bp-arrow',
        transform: 'translate(' + a[0] + ',' + a[1] + ') rotate(' + a[2] + ')'
      }), 1420 + i * 80));
    });

    /* ---- the vessel, drawn as plate */
    var vessel = svg('g', { class: 'bp-vessel' });
    vessel.appendChild(drawable(svg('rect', { x: tx, y: ty, width: tw, height: th, class: 'bp-wall-o' }), 120));
    vessel.appendChild(drawable(svg('rect', { x: ix, y: iy, width: iw, height: ih, class: 'bp-wall-i' }), 260));
    [[b1, 0.72], [b2, 0.62]].forEach(function (b, i) {
      vessel.appendChild(fading(svg('rect', {
        x: b[0], y: iy, width: baffleW, height: ih * b[1], class: 'bp-baffle'
      }), 420 + i * 80));
    });
    vessel.appendChild(drawable(svg('path', {
      d: 'M' + (tx - padL + 30) + ' ' + inY + ' H' + tx, class: 'bp-pipe'
    }), 540));
    vessel.appendChild(drawable(svg('path', {
      d: 'M' + (tx + tw) + ' ' + outY + ' H' + (tx + tw + padR - 30), class: 'bp-pipe'
    }), 580));
    root_.appendChild(vessel);

    /* ---- dimensions */
    function dimH(y, x1, x2, delay) {
      var g = svg('g', { class: 'bp-dim' });
      g.appendChild(drawable(svg('line', { x1: x1, y1: y - 9, x2: x1, y2: y + 5 }), delay));
      g.appendChild(drawable(svg('line', { x1: x2, y1: y - 9, x2: x2, y2: y + 5 }), delay));
      g.appendChild(drawable(svg('line', { x1: x1, y1: y, x2: x2, y2: y, class: 'bp-dim-line' }), delay + 90));
      var t = fading(svg('text', { x: (x1 + x2) / 2, y: y - 7, class: 'bp-dim-text' }), delay + 300);
      g.appendChild(t);
      root_.appendChild(g);
      return t;
    }
    function dimV(x, y1, y2, delay) {
      var g = svg('g', { class: 'bp-dim' });
      g.appendChild(drawable(svg('line', { x1: x - 5, y1: y1, x2: x + 9, y2: y1 }), delay));
      g.appendChild(drawable(svg('line', { x1: x - 5, y1: y2, x2: x + 9, y2: y2 }), delay));
      g.appendChild(drawable(svg('line', { x1: x, y1: y1, x2: x, y2: y2, class: 'bp-dim-line' }), delay + 90));
      var mid = (y1 + y2) / 2;
      var t = fading(svg('text', {
        x: x - 9, y: mid, class: 'bp-dim-text',
        transform: 'rotate(-90 ' + (x - 9) + ' ' + mid + ')'
      }), delay + 300);
      g.appendChild(t);
      root_.appendChild(g);
      return t;
    }
    var dimWidth = dimH(ty + th + 36, tx, tx + tw, 980);
    var dimHeight = dimV(tx - 30, ty, ty + th, 1040);

    /* ---- labels. Only the ones that name something the reader cannot
       work out from the drawing. Baffles and sediment get a leader tick
       instead of a word, because the shape already says what they are. */
    function note(x, y, text, cls, anchor, delay) {
      var t = fading(svg('text', { x: x, y: y, class: 'bp-note ' + (cls || ''), 'text-anchor': anchor || 'start' }), delay);
      t.textContent = text;
      root_.appendChild(t);
      return t;
    }
    note(tx - padL + 30, inY - 13, 'INLET', 'is-in', 'start', 800);
    note(tx + tw + padR - 30, outY - 13, 'OUTLET', 'is-out', 'end', 840);

    /* The fat label sits on the band it names. No leader, no second place
       for the eye to go. */
    var fogNote = note(ix + 12, waterY - fogH / 2 + 1, 'FOG', 'is-fog', 'start', 900);
    fogNote.setAttribute('dominant-baseline', 'middle');

    var chamberNotes = [];
    for (var n = 0; n < 3; n++) {
      chamberNotes.push(note(
        (chambers[n][0] + chambers[n][1]) / 2, ty - 12,
        '0' + (n + 1), 'is-num', 'middle', 640 + n * 70
      ));
    }

    mount.appendChild(root_);

    /* ---- issue the sheet when it arrives */
    var issued = false;
    function issue() {
      if (issued) return;
      issued = true;
      root_.classList.add('is-drawn');
    }
    if (reduce || !('IntersectionObserver' in root)) {
      issue();
    } else {
      var io = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { issue(); io.disconnect(); }
      }, { threshold: 0.25 });
      io.observe(mount);
    }

    var visible = true;
    if ('IntersectionObserver' in root) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { rootMargin: '150px' }).observe(mount);
    }

    function frame() {
      root.requestAnimationFrame(frame);
      if (!visible || reduce || !issued) return;
      var q, p, cw, ceil;
      for (q = 0; q < parts.length; q++) {
        p = parts[q];
        p.y -= p.v;
        ceil = (waterY - fogH * fogScale[p.c] * 0.5 - iy) / ih;
        if (p.y < ceil) { p.y = 1; p.x = Math.random(); p.c = Math.floor(rand(0, 3)); }
        cw = chambers[p.c][1] - chambers[p.c][0];
        p.node.setAttribute('cx', (chambers[p.c][0] + 9 + p.x * (cw - 18)).toFixed(1));
        p.node.setAttribute('cy', (iy + p.y * ih).toFixed(1));
      }
      for (q = 0; q < grit.length; q++) {
        p = grit[q];
        p.y += p.v;
        if (p.y > 1 - bedH / ih) { p.y = (waterY - iy) / ih + 0.04; p.x = Math.random(); }
        cw = chambers[p.c][1] - chambers[p.c][0];
        p.node.setAttribute('cx', (chambers[p.c][0] + 9 + p.x * (cw - 18)).toFixed(1));
        p.node.setAttribute('cy', (iy + p.y * ih).toFixed(1));
      }
    }
    frame();

    return {
      el: root_,
      issue: issue,
      /* A new model re-issues the sheet: the dimensions extend again to the
         new figures rather than the drawing rebuilding from nothing. */
      update: function (spec) {
        var mm = (spec.sizeMm || '').split(' x ');
        dimWidth.textContent = mm[0] ? mm[0] + ' mm' : '';
        dimHeight.textContent = mm[2] ? mm[2] : '';
        fogNote.textContent = spec.grease ? 'FOG ' + spec.grease + ' L' : 'FOG';
        if (reduce) return;
        root_.classList.remove('is-redraw');
        void root_.getBoundingClientRect();
        root_.classList.add('is-redraw');
      },
      light: function (i) {
        chamberNotes.forEach(function (n, k) { n.classList.toggle('is-lit', k === i); });
        if (i === null || i === undefined || i < 0 || i > 2) {
          lit.setAttribute('opacity', '0');
          return;
        }
        lit.setAttribute('x', chambers[i][0]);
        lit.setAttribute('width', chambers[i][1] - chambers[i][0]);
        lit.setAttribute('opacity', '1');
      }
    };
  }

  /* =======================================================================
     Column

     A fixed field behind the whole page. Fat rises through it continuously,
     and the faster the reader scrolls down, the faster it streams up past
     them. The page reads as a descent because the only thing moving with
     any speed is going the other way.
     ===================================================================== */
  function column(canvas, opts) {
    opts = opts || {};
    var velocity = opts.velocity || function () { return 0; };
    var depth = opts.depth || function () { return 0; };

    var amber = opts.amber || '232, 138, 43';
    var teal = opts.teal || '15, 163, 163';

    var globs = [];
    var strata = [];
    var px = -999, py = -999;
    var t = 0;
    var sized = 0;
    var dpr = 1;
    var w = 0, h = 0;
    var ctx = canvas.getContext('2d');

    function fit() {
      dpr = Math.min(root.devicePixelRatio || 1, 2);
      var r = canvas.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      globs.length = 0;
      strata.length = 0;
      var n = Math.max(26, Math.min(Math.round((w * h) / 20000), 110));
      for (var i = 0; i < n; i++) {
        globs.push({
          x: rand(0, w), y: rand(-h * 0.2, h * 1.2),
          r: rand(2, 11), v: rand(0.14, 0.62),
          wob: rand(0, 6.28), ws: rand(0.005, 0.017),
          a: rand(0.16, 0.6)
        });
      }
      for (var j = 0; j < 9; j++) {
        strata.push({ y: rand(0, h), a: rand(0.02, 0.06), drift: rand(0.06, 0.22) });
      }
    }

    root.addEventListener('pointermove', function (e) { px = e.clientX; py = e.clientY; }, { passive: true });
    root.addEventListener('pointerleave', function () { px = -999; py = -999; });

    function frame() {
      root.requestAnimationFrame(frame);
      fit();
      if (sized !== w * 100000 + h) { seed(); sized = w * 100000 + h; }
      if (!reduce) t += 1;

      ctx.clearRect(0, 0, w, h);

      /* Scrolling down pushes the field up. This is the whole idea. */
      var v = reduce ? 0 : velocity();
      var lift = 1 + Math.max(-0.6, Math.min(v * 0.055, 6));
      var dp = depth();

      /* Strata: faint horizontal marks that make the descent readable. */
      for (var s = 0; s < strata.length; s++) {
        var st = strata[s];
        if (!reduce) st.y -= st.drift * lift;
        if (st.y < -20) st.y = h + 20;
        if (st.y > h + 20) st.y = -20;
        ctx.strokeStyle = 'rgba(' + teal + ',' + st.a.toFixed(3) + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, st.y);
        ctx.lineTo(w, st.y);
        ctx.stroke();
      }

      for (var i = 0; i < globs.length; i++) {
        var g = globs[i];
        if (!reduce) {
          g.wob += g.ws;
          g.y -= g.v * lift * (1 + g.r * 0.035);
          g.x += Math.sin(g.wob) * 0.4;
          var dx = g.x - px, dy = g.y - py;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130 && dist > 0.5) {
            var push = (130 - dist) / 130 * 2.4;
            g.x += (dx / dist) * push;
            g.y += (dy / dist) * push * 0.5;
          }
        }
        if (g.y < -g.r * 3) { g.y = h + rand(20, 200); g.x = rand(0, w); }
        if (g.y > h + g.r * 4) { g.y = -rand(20, 200); }

        /* A globule flattens as it accelerates, the way a real one does. */
        var squash = 1 + Math.min(0.9, (g.v * lift) * 0.35);
        var rx = g.r * squash;
        var ry = g.r / squash;
        var alpha = g.a * (0.55 + dp * 0.45);

        var grad = ctx.createRadialGradient(g.x - rx * 0.32, g.y - ry * 0.42, ry * 0.12, g.x, g.y, rx);
        grad.addColorStop(0, 'rgba(' + amber + ',' + Math.min(0.95, alpha + 0.34).toFixed(3) + ')');
        grad.addColorStop(0.82, 'rgba(' + amber + ',' + Math.min(0.9, alpha + 0.12).toFixed(3) + ')');
        grad.addColorStop(0.94, 'rgba(' + amber + ',' + (alpha * 0.5).toFixed(3) + ')');
        grad.addColorStop(1, 'rgba(' + amber + ',0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(g.x, g.y, rx, ry, 0, 0, 6.2832);
        ctx.fill();

        /* A highlight on the larger ones so they read as liquid, not dots. */
        if (g.r > 6) {
          ctx.fillStyle = 'rgba(255,255,255,' + (alpha * 0.5).toFixed(3) + ')';
          ctx.beginPath();
          ctx.ellipse(g.x - rx * 0.3, g.y - ry * 0.38, rx * 0.2, ry * 0.14, -0.5, 0, 6.2832);
          ctx.fill();
        }
      }
    }
    frame();

    return { canvas: canvas };
  }

  PM.scenes = { blueprint: blueprint, column: column };
})(window, document);
