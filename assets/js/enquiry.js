/* =========================================================================
   Perangkap Minyak - the enquiry list

   This business does not sell online. Prices are quoted, and enquiries
   arrive by WhatsApp. So the shopping cart a trade catalogue would normally
   carry is replaced by a list of things to ask about, sent as one message
   instead of five.

   State is a plain array of { slug, qty } in localStorage. Products are
   resolved out of the catalogue on read rather than stored, so a change to
   a product name or photo shows up in a list saved last week, and a slug
   that no longer exists drops out quietly instead of breaking the drawer.

   Only Site C loads this. Sites A and B are untouched.
   ========================================================================= */
(function (root, doc) {
  'use strict';

  var PM = root.PM;
  if (!PM) return;

  var KEY = 'pm-enquiry';
  var lines = [];

  /* Storage can be unavailable (private mode, blocked site data). When it
     is, the list still works for the length of the visit; it just does not
     survive a reload. That is a better failure than a thrown exception on
     every add. */
  function load() {
    var raw = null;
    try { raw = root.localStorage.getItem(KEY); } catch (e) { return []; }
    if (!raw) return [];
    var parsed;
    try { parsed = JSON.parse(raw); } catch (e) { return []; }
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(function (l) {
      return l && typeof l.slug === 'string' && l.slug;
    }).map(function (l) {
      return { slug: l.slug, qty: Math.max(1, parseInt(l.qty, 10) || 1) };
    });
  }

  function save() {
    try { root.localStorage.setItem(KEY, JSON.stringify(lines)); } catch (e) { /* keep going in memory */ }
    PM.emit('enquirychange', lines.length);
  }

  function indexOf(slug) {
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].slug === slug) return i;
    }
    return -1;
  }

  lines = load();

  var E = {};

  /* Adding something already listed raises its quantity rather than
     creating a second line, which is what a person expects after clicking
     the same button twice. */
  E.add = function (slug, qty) {
    if (!slug) return;
    var n = Math.max(1, parseInt(qty, 10) || 1);
    var i = indexOf(slug);
    if (i > -1) lines[i].qty += n;
    else lines.push({ slug: slug, qty: n });
    save();
  };

  E.remove = function (slug) {
    var i = indexOf(slug);
    if (i < 0) return;
    lines.splice(i, 1);
    save();
  };

  E.setQty = function (slug, qty) {
    var n = parseInt(qty, 10) || 0;
    if (n <= 0) return E.remove(slug);
    var i = indexOf(slug);
    if (i < 0) return;
    lines[i].qty = Math.min(999, n);
    save();
  };

  E.has = function (slug) { return indexOf(slug) > -1; };

  /* Resolved against the catalogue, so a stale slug from an older visit is
     dropped rather than rendered as a blank row. */
  E.items = function () {
    var out = [];
    var stale = false;
    lines.forEach(function (l) {
      var p = PM.product(l.slug);
      if (!p) { stale = true; return; }
      out.push({ slug: l.slug, qty: l.qty, product: p });
    });
    if (stale) {
      lines = out.map(function (o) { return { slug: o.slug, qty: o.qty }; });
      save();
    }
    return out;
  };

  /* Line count, not the sum of quantities. The header badge is telling the
     reader how many different things they have picked. */
  E.count = function () { return E.items().length; };

  E.clear = function () {
    if (!lines.length) return;
    lines = [];
    save();
  };

  /* One message, not one per product. Model codes are included because the
     code is what the sales desk works from. */
  E.waMessage = function () {
    var items = E.items();
    var bm = PM.lang === 'bm';
    var head = bm
      ? 'Salam, saya ingin bertanya tentang item berikut:'
      : 'Hello, I would like to ask about the following items:';
    var tail = bm
      ? 'Boleh berikan sebut harga dan masa penghantaran?'
      : 'Could you send a quotation and lead time?';

    if (!items.length) return PM.waLink();

    var body = items.map(function (it, i) {
      var name = PM.t(it.product.name);
      var code = it.product.model ? ' (' + it.product.model + ')' : '';
      return (i + 1) + '. ' + it.qty + ' x ' + name + code;
    }).join('\n');

    return PM.waLink(head + '\n' + body + '\n' + tail);
  };

  /* The contact form takes the list as prefilled message text. */
  E.formText = function () {
    var items = E.items();
    if (!items.length) return '';
    return items.map(function (it) {
      var code = it.product.model ? ' (' + it.product.model + ')' : '';
      return it.qty + ' x ' + PM.t(it.product.name) + code;
    }).join('\n');
  };

  PM.enquiry = E;
})(window, document);
