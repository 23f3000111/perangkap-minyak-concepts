/* =========================================================================
   Site D - asset check. Development only, like checks.html.

   A page opened from file:// cannot ask whether a file exists, so this
   runs in Node instead: every image and PDF the data and the page code
   name must be on disk under assets/. Exits non-zero on the first miss
   report, listing every missing path.

     node Site-D-Waterline/tools/check-assets.js
   ========================================================================= */
'use strict';

var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..', '..');
var ASSETS = path.join(ROOT, 'assets');

/* Load the data files the way a browser would, into a stand-in window. */
global.window = {};
['site.js', 'catalog.js', 'library.js'].forEach(function (f) {
  require(path.join(ASSETS, 'data', f));
});
var S = window.PM_SITE, C = window.PM_CATALOG, L = window.PM_LIBRARY;

var wanted = [];
function img(p) { wanted.push('img/' + p); }
function raw(p) { wanted.push(p); }

/* The library. */
L.documents.forEach(function (m) {
  var key = m.model.toLowerCase();
  [['catalogue', 'catalogue'], ['drawing', 'drawings']].forEach(function (k) {
    var spec = m[k[0]];
    raw('docs/' + k[1] + '/' + key + '.pdf');
    raw('docs/thumbs/' + k[0] + '-' + key + '.webp');
    for (var i = 1; i <= spec.pages; i++) raw('docs/pages/' + k[0] + '-' + key + '-' + i + '.webp');
  });
});
L.field.forEach(function (f) { img(f.img); });
L.cleaning.forEach(function (c) { img(c.img); });
L.issues.forEach(function (it) {
  [it.sheet].concat(it.more || []).forEach(function (s) { img(s.img + '.webp'); img(s.img + '-sm.webp'); });
});
img(L.wasteOil.sheet.img + '.webp');
img(L.wasteOil.sheet.img + '-sm.webp');

/* The shared data the site also draws on. */
S.gallery.forEach(function (g) { img(g.img); });
C.products.forEach(function (p) { p.images.forEach(img); });
C.services.forEach(function (s) { (s.images || [s.img]).forEach(img); });

/* Every image path written as a literal in the page code. */
var code = fs.readFileSync(path.join(__dirname, '..', 'js', 'site.js'), 'utf8');
var re = /'((?:products|gallery|brand|news|install|service|certs|approvals|lab)\/[^']+\.(?:webp|jpe?g|png|gif))'/g;
var m;
while ((m = re.exec(code))) img(m[1]);

var seen = {};
var missing = wanted.filter(function (p) {
  if (seen[p]) return false;
  seen[p] = 1;
  return !fs.existsSync(path.join(ASSETS, p));
});

/* A path passed on the command line is checked too, which is how the
   check itself is shown to fail when it should. */
process.argv.slice(2).forEach(function (p) {
  if (!fs.existsSync(path.join(ASSETS, p))) missing.push(p);
});

if (missing.length) {
  console.error('MISSING ' + missing.length + ' of ' + Object.keys(seen).length + ' assets:');
  missing.forEach(function (p) { console.error('  assets/' + p); });
  process.exit(1);
}
console.log('OK ' + Object.keys(seen).length + ' assets present');
