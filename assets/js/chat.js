/* =========================================================================
   Perangkap Minyak - the assistant

   A sales desk in a panel. It takes a name, a mobile number and an email
   first, because this business quotes rather than sells online and a
   quotation has to go somewhere. After that it answers from the same data
   the pages are built from: the seventeen model specification sheet, the
   dosing table, the service list and the FAQ.

   There is no backend in this mockup, so nothing is transmitted. Every
   answer is derived locally from PM_SITE and PM_CATALOG, and the lead plus
   the transcript are kept in localStorage so a reload does not lose the
   conversation. The handoff at the end is WhatsApp, which is how enquiries
   actually reach this company today.

   It never invents a ringgit figure. The company publishes specifications,
   not prices, so the assistant assembles a complete, referenced quotation
   request and hands it over priced by a person. Making a number up would
   be the one thing a buyer could not check.

   Language follows PM.lang and re-renders on langchange.
   ========================================================================= */
(function (root, doc) {
  'use strict';

  var PM = root.PM;
  if (!PM) return;

  var el = PM.el;
  var t = PM.t;
  var S = PM.site;
  var C = PM.catalog;

  var KEY = 'pm-chat-v1';
  var MAX_LOG = 80;

  /* ==================================================================== i18n */
  var TX = {
    launch:     { en: 'Chat with us', bm: 'Berbual dengan kami' },
    title:      { en: 'Aida', bm: 'Aida' },
    role:       { en: 'Sales & service desk', bm: 'Meja jualan & servis' },
    online:     { en: 'Replies in a few seconds', bm: 'Membalas dalam beberapa saat' },
    close:      { en: 'Close chat', bm: 'Tutup sembang' },
    restart:    { en: 'Start over', bm: 'Mula semula' },
    restarted:  { en: 'Cleared. Let us start again.', bm: 'Dikosongkan. Mari mula semula.' },
    placeholder:{ en: 'Type your message', bm: 'Taip mesej anda' },
    send:       { en: 'Send', bm: 'Hantar' },
    teaser:     { en: 'Need a model size or a quotation? Ask me.',
                  bm: 'Perlukan saiz model atau sebut harga? Tanya saya.' },
    you:        { en: 'You', bm: 'Anda' },

    /* --- the intake --- */
    greet: { en: 'Hello. I am Aida, from the Perangkap Minyak sales desk. I can size a grease trap, put a quotation together, or book a service crew.',
             bm: 'Salam. Saya Aida, dari meja jualan Perangkap Minyak. Saya boleh menentukan saiz perangkap minyak, menyediakan sebut harga, atau menempah kru servis.' },
    askName:  { en: 'Before we start, what should I call you?', bm: 'Sebelum kita mula, apa nama anda?' },
    askPhone: { en: 'Thank you, {name}. What is the best mobile number to reach you on?',
                bm: 'Terima kasih, {name}. Apakah nombor telefon terbaik untuk menghubungi anda?' },
    askEmail: { en: 'And an email address, so the written quotation has somewhere to go.',
                bm: 'Dan alamat e-mel, supaya sebut harga bertulis ada tempat untuk dihantar.' },
    intakeDone: { en: 'Noted, {name}. I have your number and email on file. What can I help you with?',
                  bm: 'Baik, {name}. Nombor dan e-mel anda telah direkodkan. Apa yang boleh saya bantu?' },
    badName:  { en: 'I did not catch that. Just your name is fine, for example Lim or Aminah.',
                bm: 'Saya tidak faham. Nama anda sahaja sudah memadai, contohnya Lim atau Aminah.' },
    badPhone: { en: 'That does not look like a Malaysian number. Something like 012-345 6789 works.',
                bm: 'Itu tidak kelihatan seperti nombor Malaysia. Contohnya 012-345 6789.' },
    badEmail: { en: 'That email does not look complete. Something like name@company.com.my.',
                bm: 'E-mel itu tidak lengkap. Contohnya nama@syarikat.com.my.' },

    /* --- the menu --- */
    menuSize:   { en: 'Size my grease trap', bm: 'Tentukan saiz perangkap' },
    menuQuote:  { en: 'Request a quotation', bm: 'Minta sebut harga' },
    menuBook:   { en: 'Book a service', bm: 'Tempah servis' },
    menuDosing: { en: 'Bio-enzyme dosing', bm: 'Dos bio-enzim' },
    menuHuman:  { en: 'Talk to a person', bm: 'Bercakap dengan orang' },

    /* --- sizing --- */
    askMeals: { en: 'How many meals does the kitchen serve on a normal day? A rough number is fine.',
                bm: 'Berapa banyak hidangan disediakan dapur pada hari biasa? Anggaran sudah memadai.' },
    badMeals: { en: 'Give me a number of meals per day, for example 400.',
                bm: 'Berikan saya jumlah hidangan sehari, contohnya 400.' },
    sized:    { en: 'For {meals} meals a day the model is the {model}.',
                bm: 'Untuk {meals} hidangan sehari, modelnya ialah {model}.' },
    sizedTail:{ en: 'That is the published capacity, not an estimate. Shall I put a quotation together for it?',
                bm: 'Itu kapasiti terbitan, bukan anggaran. Mahu saya sediakan sebut harga untuknya?' },

    /* --- quoting --- */
    askQty:   { en: 'How many units do you need?', bm: 'Berapa unit yang anda perlukan?' },
    askAddons:{ en: 'Anything to add to the quotation? Pick as many as apply, then press Done.',
                bm: 'Ada apa-apa untuk ditambah pada sebut harga? Pilih seberapa banyak yang berkenaan, kemudian tekan Selesai.' },
    addonAdu: { en: 'Auto Dosing Unit', bm: 'Unit Dos Automatik' },
    addonBio: { en: 'GoodBac Bio-Enzyme', bm: 'Bio-Enzim GoodBac' },
    addonInst:{ en: 'Installation on site', bm: 'Pemasangan di tapak' },
    addonSvc: { en: 'Yearly service plan', bm: 'Pelan servis tahunan' },
    addonNone:{ en: 'Nothing else', bm: 'Tiada apa-apa lagi' },
    addonDone:{ en: 'Done', bm: 'Selesai' },
    quoteMade:{ en: 'Here is your quotation request, {name}. Reference {ref}.',
                bm: 'Ini permintaan sebut harga anda, {name}. Rujukan {ref}.' },
    quoteTail:{ en: 'The priced quotation is issued by the sales desk to {email} within one business day. We do not publish prices, because they depend on stainless grade, access and delivery point, and a number I made up would be no use to you.',
                bm: 'Sebut harga berharga dikeluarkan oleh meja jualan ke {email} dalam satu hari bekerja. Kami tidak menerbitkan harga kerana ia bergantung pada gred keluli, akses dan titik penghantaran, dan angka yang saya reka tidak berguna kepada anda.' },

    /* --- booking --- */
    askService: { en: 'Which service do you need?', bm: 'Perkhidmatan yang mana anda perlukan?' },
    askWhere:   { en: 'Which state is the site in?', bm: 'Tapak berada di negeri mana?' },
    askWhen:    { en: 'When would you like the crew? A date, or something like "next Tuesday".',
                  bm: 'Bila anda mahukan kru? Satu tarikh, atau seperti "Selasa depan".' },
    badWhen:    { en: 'I did not catch a date. Try 15/09, "tomorrow" or "next Monday".',
                  bm: 'Saya tidak dapat tarikhnya. Cuba 15/09, "esok" atau "Isnin depan".' },
    booked:     { en: 'Booked provisionally, {name}. Reference {ref}.',
                  bm: 'Ditempah sementara, {name}. Rujukan {ref}.' },
    bookedTail: { en: 'The service desk confirms the crew and the window by phone on {phone}. Outside our coverage we will say so rather than take the booking.',
                  bm: 'Meja servis mengesahkan kru dan waktu melalui telefon di {phone}. Di luar liputan kami, kami akan memberitahu dan bukan menerima tempahan.' },

    /* --- dosing --- */
    askTrapModel: { en: 'Which grease trap model do you have? For example GTA335.',
                    bm: 'Model perangkap minyak yang mana anda ada? Contohnya GTA335.' },
    badTrapModel: { en: 'I do not have that model in the dosing table. Try a code like GTA01, GTA335 or GTA3200.',
                    bm: 'Saya tiada model itu dalam jadual dos. Cuba kod seperti GTA01, GTA335 atau GTA3200.' },

    /* --- general --- */
    handoff:  { en: 'Continue on WhatsApp', bm: 'Teruskan di WhatsApp' },
    callDesk: { en: 'Call the office', bm: 'Hubungi pejabat' },
    yes:      { en: 'Yes, please', bm: 'Ya, boleh' },
    no:       { en: 'Not now', bm: 'Bukan sekarang' },
    anythingElse: { en: 'Anything else I can help with?', bm: 'Ada lagi yang boleh saya bantu?' },
    unsure:   { en: 'I am not certain I followed that. I am best at these four things, but you can also ask me about certification, warranty, delivery or installation.',
                bm: 'Saya kurang pasti memahaminya. Saya paling mahir dalam empat perkara ini, tetapi anda juga boleh bertanya tentang pensijilan, waranti, penghantaran atau pemasangan.' },
    savedNote: { en: 'Your details are kept in this browser only. Nothing is sent anywhere until you press WhatsApp.',
                 bm: 'Butiran anda disimpan dalam pelayar ini sahaja. Tiada apa dihantar sehingga anda menekan WhatsApp.' },
    viewProduct: { en: 'View the model', bm: 'Lihat model' },
    modelFinder: { en: 'Open the model finder', bm: 'Buka pencari model' }
  };

  function tx(k, vars) {
    var s = t(TX[k]) || '';
    if (vars) {
      Object.keys(vars).forEach(function (v) {
        s = s.split('{' + v + '}').join(vars[v]);
      });
    }
    return s;
  }

  /* ============================================================= the state */
  var state = {
    step: 'name',       /* name | phone | email | open | <flow step> */
    lead: { name: '', phone: '', email: '' },
    log: [],            /* { who: 'bot'|'you', text, at } - text only, cards replay as text */
    draft: {}           /* the flow in progress */
  };

  function load() {
    var raw = null;
    try { raw = root.localStorage.getItem(KEY); } catch (e) { return; }
    if (!raw) return;
    var p;
    try { p = JSON.parse(raw); } catch (e) { return; }
    if (!p || typeof p !== 'object') return;
    if (p.lead && typeof p.lead === 'object') {
      state.lead.name = String(p.lead.name || '').slice(0, 60);
      state.lead.phone = String(p.lead.phone || '').slice(0, 30);
      state.lead.email = String(p.lead.email || '').slice(0, 90);
    }
    if (Array.isArray(p.log)) {
      state.log = p.log.filter(function (m) {
        return m && (m.who === 'bot' || m.who === 'you') && typeof m.text === 'string';
      }).slice(-MAX_LOG);
    }
    if (typeof p.step === 'string') state.step = p.step;
    /* A half finished flow does not survive a reload. Resuming mid-question
       with no visible context reads as the panel talking to itself. */
    if (['name', 'phone', 'email', 'open'].indexOf(state.step) === -1) state.step = 'open';
  }

  function save() {
    try {
      root.localStorage.setItem(KEY, JSON.stringify({
        step: state.step, lead: state.lead, log: state.log.slice(-MAX_LOG)
      }));
    } catch (e) { /* private mode: the visit still works, it just does not persist */ }
  }

  function reset() {
    state.step = 'name';
    state.lead = { name: '', phone: '', email: '' };
    state.log = [];
    state.draft = {};
    try { root.localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
  }

  /* ======================================================== entity readers */
  function readEmail(s) {
    var m = String(s).match(/[^\s@,;]+@[^\s@,;]+\.[a-z]{2,}/i);
    return m ? m[0] : null;
  }

  /* Malaysian mobile and landline, with or without the country code and
     with any of the separators people actually type. */
  function readPhone(s) {
    var digits = String(s).replace(/[^\d+]/g, '');
    var m = digits.match(/(?:\+?60|0)\d{8,10}/);
    if (!m) return null;
    var d = m[0].replace(/^\+?60/, '0');
    if (d.charAt(0) !== '0') d = '0' + d;
    if (d.length < 9 || d.length > 11) return null;
    return d;
  }

  function readNumber(s) {
    var m = String(s).replace(/,/g, '').match(/\d+(?:\.\d+)?/);
    return m ? parseFloat(m[0]) : null;
  }

  /* People answer this three ways: the bare name, a greeting and then the
     name, or a whole sentence with the name buried in it. An introduction
     phrase anywhere wins; otherwise a leading greeting is dropped and what
     is left is taken, trimmed to four words so a sentence does not end up
     on the quotation where a name should be. */
  var INTRO = /(?:my name is|name is|i am|i'm|im|this is|call me|nama saya|saya ialah|saya|nama)\s+/i;
  var HELLO = /^(?:hi|hello|helo|hey|yo|good\s+(?:morning|afternoon|evening)|salam|assalamualaikum|selamat\s+\w+)\b[\s,.!-]*/i;

  function readName(s) {
    var raw = String(s).trim().replace(HELLO, '');
    var m = raw.match(INTRO);
    if (m) raw = raw.slice(m.index + m[0].length);
    raw = raw
      .replace(/[^\p{L}\p{M}\s'.\-@\/]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ').slice(0, 4).join(' ');
    if (raw.length < 2 || raw.length > 48) return null;
    if (!/\p{L}/u.test(raw)) return null;
    return raw.replace(/\b\p{Ll}/gu, function (c) { return c.toUpperCase(); });
  }

  /* A model code anywhere in the sentence, matched against the real table
     rather than a pattern, so "GTA999" is not accepted as a model. */
  function readModel(s) {
    var up = String(s).toUpperCase().replace(/[\s\-]/g, '');
    var hit = null;
    C.models.forEach(function (m) {
      if (up.indexOf(m.model) > -1 && (!hit || m.model.length > hit.model.length)) hit = m;
    });
    return hit;
  }

  function readProduct(s) {
    var q = String(s).toLowerCase();
    var up = String(s).toUpperCase().replace(/[\s\-]/g, '');
    var best = null, bestScore = 0;
    C.products.forEach(function (p) {
      var score = 0;
      if (p.model && up.indexOf(String(p.model).toUpperCase()) > -1) score += 10;
      var name = String(t(p.name)).toLowerCase();
      name.split(/\s+/).forEach(function (w) {
        if (w.length > 3 && q.indexOf(w) > -1) score += 1;
      });
      if (score > bestScore) { bestScore = score; best = p; }
    });
    return bestScore >= 3 ? best : null;
  }

  var STATES = ['Selangor', 'Kuala Lumpur', 'Putrajaya', 'Perak', 'Penang', 'Pulau Pinang',
    'Melaka', 'Johor', 'Negeri Sembilan', 'Pahang', 'Kedah', 'Perlis', 'Kelantan',
    'Terengganu', 'Sabah', 'Sarawak', 'Labuan'];

  function readState(s) {
    var q = String(s).toLowerCase();
    for (var i = 0; i < STATES.length; i++) {
      if (q.indexOf(STATES[i].toLowerCase()) > -1) return STATES[i];
    }
    if (/\bkl\b/.test(q)) return 'Kuala Lumpur';
    if (/\bpj\b/.test(q)) return 'Selangor';
    return null;
  }

  var DAYS = {
    monday: 1, isnin: 1, tuesday: 2, selasa: 2, wednesday: 3, rabu: 3,
    thursday: 4, khamis: 4, friday: 5, jumaat: 5, saturday: 6, sabtu: 6,
    sunday: 0, ahad: 0
  };

  /* Loose enough for how people answer "when": a date, a weekday, or
     tomorrow. Anything it cannot read comes back null and is asked again. */
  function readDate(s) {
    var q = String(s).toLowerCase().trim();
    var now = new Date();
    now.setHours(0, 0, 0, 0);

    if (/\b(today|hari ini)\b/.test(q)) return now;
    if (/\b(tomorrow|esok)\b/.test(q)) return new Date(now.getTime() + 864e5);
    if (/\b(lusa|day after tomorrow)\b/.test(q)) return new Date(now.getTime() + 2 * 864e5);

    var dmy = q.match(/\b(\d{1,2})\s*[\/\-.]\s*(\d{1,2})(?:\s*[\/\-.]\s*(\d{2,4}))?\b/);
    if (dmy) {
      var yr = dmy[3] ? parseInt(dmy[3], 10) : now.getFullYear();
      if (yr < 100) yr += 2000;
      var d = new Date(yr, parseInt(dmy[2], 10) - 1, parseInt(dmy[1], 10));
      if (!isNaN(d) && d.getDate() === parseInt(dmy[1], 10)) {
        if (!dmy[3] && d < now) d.setFullYear(yr + 1);
        return d;
      }
    }

    for (var k in DAYS) {
      if (q.indexOf(k) > -1) {
        var target = DAYS[k];
        var out = new Date(now.getTime());
        var delta = (target - out.getDay() + 7) % 7;
        if (delta === 0 || /\b(next|depan|hadapan)\b/.test(q)) delta = delta === 0 ? 7 : delta;
        out.setDate(out.getDate() + delta);
        return out;
      }
    }

    var named = q.match(/\b(\d{1,2})\s*(jan|feb|mar|apr|may|mei|jun|jul|aug|ogos|sep|oct|okt|nov|dec|dis)/);
    if (named) {
      var months = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, mei: 4, jun: 5, jul: 6,
        aug: 7, ogos: 7, sep: 8, oct: 9, okt: 9, nov: 10, dec: 11, dis: 11 };
      var dd = new Date(now.getFullYear(), months[named[2]], parseInt(named[1], 10));
      if (dd < now) dd.setFullYear(now.getFullYear() + 1);
      return dd;
    }
    return null;
  }

  function fmtDate(d) {
    return d.toLocaleDateString(PM.lang === 'bm' ? 'ms-MY' : 'en-GB',
      { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  function yes(s) { return /\b(yes|yeah|yep|ya|ok|okay|okey|sure|boleh|nak|mahu|please|go ahead|setuju)\b/i.test(s); }
  function no(s) { return /\b(no|nope|not now|nah|tidak|tak|belum|jangan|later|nanti)\b/i.test(s); }

  /* ========================================================= intent scoring
     Keyword sets, not a model. Each hit is worth its own length so a long
     specific word ("certification") outweighs a short generic one ("how"). */
  var INTENTS = [
    { id: 'size',    kw: ['size', 'sizing', 'which model', 'what model', 'how big', 'capacity for', 'meals', 'recommend', 'suitable', 'saiz', 'model mana', 'besar mana', 'hidangan', 'cadang', 'sesuai'] },
    { id: 'quote',   kw: ['quote', 'quotation', 'price', 'pricing', 'cost', 'how much', 'sebut harga', 'harga', 'kos', 'berapa'] },
    { id: 'book',    kw: ['book', 'booking', 'schedule', 'appointment', 'service visit', 'send a crew', 'pump out', 'clean my', 'tempah', 'jadual', 'temujanji', 'lawatan', 'pam', 'cuci'] },
    { id: 'dosing',  kw: ['dosing', 'dose', 'enzyme', 'bio-enzyme', 'bioenzyme', 'goodbac', 'bacteria', 'dos', 'enzim', 'bakteria'] },
    { id: 'product', kw: ['product', 'model', 'gta', 'gts', 'adu', 'spec', 'specification', 'dimension', 'flow rate', 'produk', 'spesifikasi', 'dimensi', 'kadar aliran'] },
    { id: 'service', kw: ['service', 'services', 'maintenance', 'cleaning', 'desludging', 'jetting', 'manhole', 'sewerage', 'pome', 'perkhidmatan', 'penyelenggaraan', 'pembersihan', 'lurang', 'pembetungan'] },
    { id: 'install', kw: ['install', 'installation', 'fit', 'fitting', 'how to install', 'plumber', 'pasang', 'pemasangan', 'tukang paip'] },
    { id: 'cert',    kw: ['sirim', 'certified', 'certificate', 'certification', 'approval', 'approved', 'compliance', 'licence', 'license', 'dbkl', 'majlis', 'samm', 'diperakui', 'sijil', 'kelulusan', 'pematuhan', 'lesen'] },
    { id: 'warranty',kw: ['warranty', 'guarantee', 'warranti', 'jaminan'] },
    { id: 'delivery',kw: ['delivery', 'deliver', 'shipping', 'lead time', 'how long', 'stock', 'penghantaran', 'hantar', 'masa penghantaran', 'stok'] },
    { id: 'contact', kw: ['contact', 'phone', 'call', 'email', 'address', 'office', 'where are you', 'open', 'hours', 'hubungi', 'telefon', 'alamat', 'pejabat', 'waktu'] },
    { id: 'buy',     kw: ['buy', 'purchase', 'order', 'dealer', 'distributor', 'shopee', 'lazada', 'where to buy', 'beli', 'pesan', 'pengedar'] },
    { id: 'video',   kw: ['video', 'watch', 'youtube', 'demo', 'tonton'] },
    { id: 'human',   kw: ['human', 'person', 'agent', 'someone', 'sales', 'talk to', 'speak to', 'whatsapp', 'orang', 'manusia', 'jurujual', 'bercakap'] },
    { id: 'greet',   kw: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'salam', 'selamat', 'apa khabar'] },
    { id: 'thanks',  kw: ['thank', 'thanks', 'terima kasih', 'tq', 'appreciated'] },
    { id: 'bye',     kw: ['bye', 'goodbye', 'see you', 'selamat tinggal', 'jumpa lagi'] }
  ];

  function classify(text) {
    var q = ' ' + String(text).toLowerCase().replace(/[^\p{L}\p{N}\s@.-]/gu, ' ').replace(/\s+/g, ' ') + ' ';
    var best = null, bestScore = 0;
    INTENTS.forEach(function (intent) {
      var score = 0;
      intent.kw.forEach(function (k) {
        if (q.indexOf(' ' + k) > -1 || q.indexOf(k + ' ') > -1) score += k.length;
      });
      if (score > bestScore) { bestScore = score; best = intent.id; }
    });
    return bestScore >= 3 ? best : null;
  }

  /* The FAQ answers a lot of this already. Score the question text and use
     it when it beats the intent table. */
  function faqMatch(text) {
    var q = String(text).toLowerCase();
    var words = q.split(/[^\p{L}\p{N}]+/u).filter(function (w) { return w.length > 3; });
    if (!words.length) return null;
    var best = null, bestScore = 0;
    S.faq.forEach(function (f) {
      var target = (t(f.q) + ' ' + t(f.a)).toLowerCase();
      var score = 0;
      words.forEach(function (w) { if (target.indexOf(w) > -1) score += 1; });
      score = score / words.length;
      if (score > bestScore) { bestScore = score; best = f; }
    });
    return bestScore >= 0.6 ? best : null;
  }

  /* =============================================================== the DOM */
  var ui = {};
  var typing = null;

  function build() {
    ui.root = el('div', { class: 'pmchat', 'data-open': 'false' });

    /* --- launcher --- */
    ui.launch = el('button', {
      class: 'pmchat-launch', type: 'button',
      'aria-expanded': 'false', 'aria-controls': 'pmchat-panel',
      'aria-label': tx('launch')
    }, [
      el('i', { class: 'ph ph-chat-teardrop-dots pmchat-launch-open', 'aria-hidden': 'true' }),
      el('i', { class: 'ph ph-x pmchat-launch-close', 'aria-hidden': 'true' })
    ]);

    ui.teaser = el('button', {
      class: 'pmchat-teaser', type: 'button', hidden: 'hidden', text: tx('teaser')
    });

    /* --- panel --- */
    ui.log = el('div', {
      class: 'pmchat-log', id: 'pmchat-log',
      role: 'log', 'aria-live': 'polite', 'aria-relevant': 'additions'
    });
    ui.chips = el('div', { class: 'pmchat-chips' });

    ui.input = el('input', {
      class: 'pmchat-input', type: 'text', autocomplete: 'off',
      'aria-label': tx('placeholder'), placeholder: tx('placeholder')
    });
    ui.sendBtn = el('button', {
      class: 'pmchat-send', type: 'submit', 'aria-label': tx('send')
    }, [el('i', { class: 'ph ph-paper-plane-right', 'aria-hidden': 'true' })]);
    ui.form = el('form', { class: 'pmchat-compose' }, [ui.input, ui.sendBtn]);

    ui.restart = el('button', {
      class: 'pmchat-icon', type: 'button', 'aria-label': tx('restart'), title: tx('restart')
    }, [el('i', { class: 'ph ph-arrow-counter-clockwise', 'aria-hidden': 'true' })]);
    ui.closeBtn = el('button', {
      class: 'pmchat-icon', type: 'button', 'aria-label': tx('close'), title: tx('close')
    }, [el('i', { class: 'ph ph-x', 'aria-hidden': 'true' })]);

    ui.name = el('b', { class: 'pmchat-name', text: tx('title') });
    ui.role = el('span', { class: 'pmchat-role', text: tx('role') });

    ui.panel = el('div', {
      class: 'pmchat-panel', id: 'pmchat-panel',
      role: 'dialog', 'aria-modal': 'false', 'aria-label': tx('title') + ' - ' + tx('role')
    }, [
      el('div', { class: 'pmchat-head' }, [
        el('span', { class: 'pmchat-avatar', 'aria-hidden': 'true', text: 'A' }),
        el('span', { class: 'pmchat-id' }, [ui.name, ui.role]),
        el('span', { class: 'pmchat-tools' }, [ui.restart, ui.closeBtn])
      ]),
      ui.log,
      el('div', { class: 'pmchat-foot' }, [ui.chips, ui.form])
    ]);

    ui.root.appendChild(ui.teaser);
    ui.root.appendChild(ui.panel);
    ui.root.appendChild(ui.launch);
    doc.body.appendChild(ui.root);

    ui.launch.addEventListener('click', function () { toggle(); });
    ui.teaser.addEventListener('click', function () { toggle(true); });
    ui.closeBtn.addEventListener('click', function () { toggle(false); });
    ui.restart.addEventListener('click', function () {
      reset();
      ui.log.textContent = '';
      say(tx('restarted'));
      begin();
    });

    ui.form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = ui.input.value.trim();
      if (!v) return;
      ui.input.value = '';
      submit(v);
    });

    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && ui.root.getAttribute('data-open') === 'true') toggle(false);
    });
  }

  function toggle(force) {
    var open = force === undefined ? ui.root.getAttribute('data-open') !== 'true' : !!force;
    ui.root.setAttribute('data-open', String(open));
    ui.launch.setAttribute('aria-expanded', String(open));
    ui.teaser.hidden = true;
    if (open) {
      if (!ui.log.childNodes.length) begin();
      root.setTimeout(function () { ui.input.focus(); }, 60);
      scroll();
    }
  }

  function scroll() {
    root.requestAnimationFrame(function () { ui.log.scrollTop = ui.log.scrollHeight; });
  }

  /* ============================================================== speaking */
  function bubble(who, node) {
    var row = el('div', { class: 'pmchat-row pmchat-row--' + who }, [
      el('div', { class: 'pmchat-bubble' }, [node])
    ]);
    ui.log.appendChild(row);
    scroll();
    return row;
  }

  function showTyping() {
    if (typing) return;
    typing = el('div', { class: 'pmchat-row pmchat-row--bot pmchat-typing' }, [
      el('div', { class: 'pmchat-bubble' }, [
        el('span', { class: 'pmchat-dots', 'aria-label': t(S.ui.loading) }, [
          el('i'), el('i'), el('i')
        ])
      ])
    ]);
    ui.log.appendChild(typing);
    scroll();
  }

  function hideTyping() {
    if (!typing) return;
    typing.remove();
    typing = null;
  }

  /* Queued so a multi-part answer arrives in order with a pause between
     the parts, the way a person types it. */
  var queue = [];
  var draining = false;

  function drain() {
    if (draining) return;
    draining = true;
    (function next() {
      if (!queue.length) { draining = false; hideTyping(); return; }
      var job = queue.shift();
      var delay = PM.motion && PM.motion.reduce ? 0 : job.delay;
      if (delay) showTyping();
      root.setTimeout(function () {
        hideTyping();
        job.run();
        next();
      }, delay);
    })();
  }

  function say(text, opts) {
    opts = opts || {};
    queue.push({
      delay: opts.now ? 0 : Math.min(1100, 260 + String(text).length * 7),
      run: function () {
        bubble('bot', el('p', { text: text }));
        state.log.push({ who: 'bot', text: text });
        save();
      }
    });
    drain();
  }

  function sayNode(node, transcript, delay) {
    queue.push({
      delay: delay === undefined ? 520 : delay,
      run: function () {
        bubble('bot', node);
        if (transcript) { state.log.push({ who: 'bot', text: transcript }); save(); }
      }
    });
    drain();
  }

  function heard(text) {
    function paint() {
      bubble('you', el('p', { text: text }));
      state.log.push({ who: 'you', text: text });
      save();
    }
    /* Someone who types over the assistant mid-sentence must still see
       their own line land after what was already being said, not jump the
       queue and appear as an answer to a question not yet asked. */
    if (draining || queue.length) {
      queue.push({ delay: 0, run: paint });
      drain();
    } else {
      paint();
    }
  }

  /* ================================================================= chips */
  function chips(defs) {
    queue.push({
      delay: 240,
      run: function () {
        ui.chips.textContent = '';
        (defs || []).forEach(function (d) {
          var b = el('button', { class: 'pmchat-chip', type: 'button', text: d.label });
          b.addEventListener('click', function () {
            if (d.keep !== true) ui.chips.textContent = '';
            if (d.silent !== true) heard(d.label);
            d.run(d);
          });
          ui.chips.appendChild(b);
        });
        scroll();
      }
    });
    drain();
  }

  function clearChips() { ui.chips.textContent = ''; }

  function menu() {
    chips([
      { label: tx('menuSize'),   run: function () { startSizing(); } },
      { label: tx('menuQuote'),  run: function () { startQuote(); } },
      { label: tx('menuBook'),   run: function () { startBooking(); } },
      { label: tx('menuDosing'), run: function () { startDosing(); } },
      { label: tx('menuHuman'),  run: function () { handoff(); } }
    ]);
  }

  /* ================================================================= cards */
  function card(title, rows, actions, tone) {
    var kids = [el('p', { class: 'pmchat-card-t', text: title })];
    if (rows && rows.length) {
      var dl = el('dl', { class: 'pmchat-card-dl' });
      rows.forEach(function (r) {
        var v = String(r[1]);
        /* A figure is set in the mono face and aligned right so a column of
           them lines up. A sentence is not a figure: forcing it into mono
           and hard right made the warranty line read as ragged nonsense. */
        var figure = v.length <= 22 && /\d/.test(v);
        dl.appendChild(el('dt', { text: r[0] }));
        dl.appendChild(el('dd', { class: figure ? 'is-fig' : null, text: v }));
      });
      kids.push(dl);
    }
    if (actions && actions.length) {
      var act = el('div', { class: 'pmchat-card-act' });
      actions.forEach(function (a) {
        if (a.href) {
          act.appendChild(el('a', {
            class: 'pmchat-act', href: a.href, text: a.label,
            target: a.blank ? '_blank' : null, rel: a.blank ? 'noopener' : null
          }));
        } else {
          var b = el('button', { class: 'pmchat-act', type: 'button', text: a.label });
          b.addEventListener('click', a.run);
          act.appendChild(b);
        }
      });
      kids.push(act);
    }
    return el('div', { class: 'pmchat-card' + (tone ? ' pmchat-card--' + tone : '') }, kids);
  }

  function modelCard(m) {
    var p = PM.productByModel(m.model);
    var rows = [
      [t(S.ui.flowRate), m.gpm ? m.gpm + ' GPM' : '-'],
      [t(S.ui.dailyMeals), String(m.meals)],
      [t(S.ui.dimensions), m.sizeMm],
      [t(S.ui.pipeSize), m.pipe],
      [t(S.ui.capacity), m.max ? m.max + ' L' : '-'],
      [t(S.ui.suggestedFor), t(m.suggested)]
    ];
    var actions = [{ label: tx('modelFinder'), href: PM.langHref('model-finder.html?m=' + m.model) }];
    if (p) actions.unshift({ label: tx('viewProduct'), href: PM.langHref('product.html?p=' + p.slug) });
    return card(m.model, rows, actions, 'model');
  }

  function ref(prefix) {
    var d = new Date();
    var stamp = String(d.getFullYear()).slice(2) +
      String(d.getMonth() + 1).padStart(2, '0') +
      String(d.getDate()).padStart(2, '0');
    var tail = Math.floor(Math.random() * 900 + 100);
    return prefix + '-' + stamp + '-' + tail;
  }

  /* ============================================================== handoff */
  function summaryText() {
    var bm = PM.lang === 'bm';
    var lines = [];
    lines.push(bm ? 'Salam, saya menghubungi melalui pembantu laman web.'
                  : 'Hello, I am coming through from the website assistant.');
    lines.push('');
    lines.push((bm ? 'Nama' : 'Name') + ': ' + (state.lead.name || '-'));
    lines.push((bm ? 'Telefon' : 'Mobile') + ': ' + (state.lead.phone || '-'));
    lines.push((bm ? 'E-mel' : 'Email') + ': ' + (state.lead.email || '-'));

    var d = state.draft;
    if (d.model) lines.push((bm ? 'Model' : 'Model') + ': ' + d.model.model + (d.qty ? ' x ' + d.qty : ''));
    if (d.meals) lines.push((bm ? 'Hidangan sehari' : 'Meals per day') + ': ' + d.meals);
    if (d.addons && d.addons.length) lines.push((bm ? 'Tambahan' : 'Add-ons') + ': ' + d.addons.join(', '));
    if (d.service) lines.push((bm ? 'Perkhidmatan' : 'Service') + ': ' + d.service);
    if (d.place) lines.push((bm ? 'Lokasi' : 'Location') + ': ' + d.place);
    if (d.when) lines.push((bm ? 'Tarikh' : 'Date') + ': ' + fmtDate(d.when));
    if (d.ref) lines.push((bm ? 'Rujukan' : 'Reference') + ': ' + d.ref);

    return lines.join('\n');
  }

  function handoffCard() {
    return card(tx('handoff'), null, [
      { label: tx('handoff'), href: PM.waLink(summaryText()), blank: true },
      { label: tx('callDesk'), href: PM.telLink() }
    ], 'act');
  }

  function handoff() {
    say(t({
      en: 'I will pass the whole conversation across. Everything you told me is already in the message, so you will not have to repeat it.',
      bm: 'Saya akan menyerahkan keseluruhan perbualan. Semua yang anda beritahu sudah ada dalam mesej itu, jadi anda tidak perlu mengulanginya.'
    }));
    sayNode(handoffCard(), tx('handoff'));
    state.step = 'open';
    afterFlow();
  }

  function afterFlow() {
    state.draft = {};
    say(tx('anythingElse'));
    menu();
  }

  /* ================================================================ intake */
  function begin() {
    if (state.log.length) {
      /* Replay what was said before the reload, without the delays. */
      state.log.slice(-MAX_LOG).forEach(function (m) {
        bubble(m.who, el('p', { text: m.text }));
      });
    }
    if (state.step === 'open' && state.lead.name) {
      say(t({ en: 'Welcome back, ' + state.lead.name + '. What can I help you with?',
              bm: 'Selamat kembali, ' + state.lead.name + '. Apa yang boleh saya bantu?' }));
      menu();
      return;
    }
    if (!state.log.length) {
      say(tx('greet'));
      say(tx('askName'));
    }
    state.step = state.step || 'name';
    save();
  }

  function intake(text) {
    if (state.step === 'name') {
      var n = readName(text);
      if (!n) return say(tx('badName'));
      state.lead.name = n;
      state.step = 'phone';
      save();
      /* Someone often pastes everything at once. Take what is there. */
      var p0 = readPhone(text), e0 = readEmail(text);
      if (p0) { state.lead.phone = p0; state.step = 'email'; }
      if (e0) { state.lead.email = e0; if (state.lead.phone) state.step = 'open'; }
      save();
      if (state.step === 'open') return finishIntake();
      if (state.step === 'email') return say(tx('askEmail'));
      return say(tx('askPhone', { name: n }));
    }

    if (state.step === 'phone') {
      var p = readPhone(text);
      if (!p) return say(tx('badPhone'));
      state.lead.phone = p;
      state.step = 'email';
      save();
      var e1 = readEmail(text);
      if (e1) { state.lead.email = e1; state.step = 'open'; save(); return finishIntake(); }
      return say(tx('askEmail'));
    }

    if (state.step === 'email') {
      var e = readEmail(text);
      if (!e) return say(tx('badEmail'));
      state.lead.email = e;
      state.step = 'open';
      save();
      return finishIntake();
    }
  }

  function finishIntake() {
    say(tx('intakeDone', { name: state.lead.name }));
    say(tx('savedNote'));
    menu();
  }

  /* ================================================================ sizing */
  function startSizing(meals) {
    /* A number already in the sentence is used rather than asked for again.
       "We do about 600 covers, what do I need?" is one question, and asking
       it straight back is what makes an assistant feel like a form. */
    if (typeof meals === 'number' && meals >= 1) return sizeWith(Math.round(meals));
    state.step = 'size:meals';
    say(tx('askMeals'));
    chips([
      { label: t({ en: 'Under 150', bm: 'Bawah 150' }), run: function () { sizeWith(120); } },
      { label: '250', run: function () { sizeWith(250); } },
      { label: '600', run: function () { sizeWith(600); } },
      { label: '2,000', run: function () { sizeWith(2000); } },
      { label: t({ en: 'Over 6,000', bm: 'Lebih 6,000' }), run: function () { sizeWith(7000); } }
    ]);
  }

  function sizeWith(meals) {
    clearChips();
    var m = PM.recommendModel(meals);
    state.draft.meals = meals;
    state.draft.model = m;
    state.step = 'size:confirm';
    say(tx('sized', { meals: meals.toLocaleString('en-MY'), model: m.model }));
    sayNode(modelCard(m), m.model + ' - ' + m.gpm + ' GPM, ' + m.sizeMm);
    say(tx('sizedTail'));
    chips([
      { label: tx('yes'), run: function () { startQuote(true); } },
      { label: tx('no'),  run: function () { state.step = 'open'; afterFlow(); } }
    ]);
  }

  /* ================================================================ quoting */
  function startQuote(haveModel, meals) {
    if (!haveModel && !state.draft.model && typeof meals === 'number' && meals >= 1) {
      return sizeWith(Math.round(meals));
    }
    if (!haveModel && !state.draft.model) {
      say(t({ en: 'I can quote against a model. Tell me the meal volume and I will pick the right one, or give me a model code like GTA335.',
              bm: 'Saya boleh sebut harga mengikut model. Beritahu jumlah hidangan dan saya akan pilih yang betul, atau berikan kod model seperti GTA335.' }));
      return startSizing();
    }
    state.step = 'quote:qty';
    say(tx('askQty'));
    chips([
      { label: '1', run: function () { quoteQty(1); } },
      { label: '2', run: function () { quoteQty(2); } },
      { label: '3', run: function () { quoteQty(3); } },
      { label: '5+', run: function () { quoteQty(5); } }
    ]);
  }

  function quoteQty(n) {
    clearChips();
    state.draft.qty = n;
    state.draft.addons = [];
    state.step = 'quote:addons';
    say(tx('askAddons'));
    addonChips();
  }

  function addonChips() {
    var opts = [
      { k: 'adu',  label: tx('addonAdu') },
      { k: 'bio',  label: tx('addonBio') },
      { k: 'inst', label: tx('addonInst') },
      { k: 'svc',  label: tx('addonSvc') }
    ];
    var defs = opts.filter(function (o) {
      return state.draft.addons.indexOf(o.label) === -1;
    }).map(function (o) {
      return {
        label: o.label, keep: true, silent: true,
        run: function () {
          state.draft.addons.push(o.label);
          heard(o.label);
          addonChips();
        }
      };
    });
    defs.push({ label: state.draft.addons.length ? tx('addonDone') : tx('addonNone'), run: makeQuote });
    chips(defs);
  }

  function makeQuote() {
    clearChips();
    var d = state.draft;
    var m = d.model;
    d.ref = ref('Q');

    var rows = [
      [t({ en: 'Model', bm: 'Model' }), m.model + ' x ' + d.qty],
      [t(S.ui.flowRate), m.gpm ? m.gpm + ' GPM' : t({ en: 'To specification', bm: 'Mengikut spesifikasi' })],
      [t(S.ui.dimensions), m.sizeMm],
      [t(S.ui.capacity), m.max ? m.max + ' L' : '-'],
      [t({ en: 'Material', bm: 'Bahan' }), t({ en: '304 stainless steel', bm: 'Keluli tahan karat 304' })],
      [t(S.ui.warranty), t({ en: '5 year factory, 3 year on site', bm: '5 tahun kilang, 3 tahun di tapak' })]
    ];
    if (d.meals) rows.splice(1, 0, [t(S.ui.dailyMeals), d.meals.toLocaleString('en-MY')]);
    if (d.addons && d.addons.length) rows.push([t({ en: 'Add-ons', bm: 'Tambahan' }), d.addons.join(', ')]);
    rows.push([t({ en: 'Quoted to', bm: 'Disebut harga kepada' }), state.lead.name + ', ' + state.lead.email]);

    say(tx('quoteMade', { name: state.lead.name, ref: d.ref }));
    sayNode(card(d.ref, rows, [
      { label: tx('handoff'), href: PM.waLink(summaryText()), blank: true },
      { label: tx('viewProduct'), href: PM.langHref('model-finder.html?m=' + m.model) }
    ], 'quote'), d.ref + ': ' + m.model + ' x ' + d.qty);
    say(tx('quoteTail', { email: state.lead.email }));

    var dose = PM.dosingFor(m.model);
    if (dose) {
      say(t({
        en: 'While it is being priced: a ' + m.model + ' takes ' + dose.daily + ' ml of GoodBac a day, which is about ' + dose.monthly + ' litres a month. That is the running cost line most people forget to ask about.',
        bm: 'Sementara ia dihargakan: ' + m.model + ' memerlukan ' + dose.daily + ' ml GoodBac sehari, kira-kira ' + dose.monthly + ' liter sebulan. Itu kos operasi yang selalu terlupa ditanya.'
      }));
    }
    state.step = 'open';
    afterFlow();
  }

  /* =============================================================== booking */
  function startBooking() {
    state.step = 'book:service';
    say(tx('askService'));
    chips(C.services.slice(0, 5).map(function (s) {
      return {
        label: t(s.name),
        run: function () { state.draft.service = t(s.name); askWhere(); }
      };
    }));
  }

  function askWhere() {
    clearChips();
    state.step = 'book:where';
    say(tx('askWhere'));
    chips(['Selangor', 'Kuala Lumpur', 'Perak', 'Penang', 'Melaka', 'Johor'].map(function (p) {
      return { label: p, run: function () { state.draft.place = p; askWhen(); } };
    }));
  }

  function askWhen() {
    clearChips();
    state.step = 'book:when';
    say(tx('askWhen'));
    chips([
      { label: t({ en: 'Tomorrow', bm: 'Esok' }), run: function () { bookOn(new Date(Date.now() + 864e5)); } },
      { label: t({ en: 'This week', bm: 'Minggu ini' }), run: function () { bookOn(new Date(Date.now() + 3 * 864e5)); } },
      { label: t({ en: 'Next week', bm: 'Minggu depan' }), run: function () { bookOn(new Date(Date.now() + 7 * 864e5)); } }
    ]);
  }

  function bookOn(when) {
    clearChips();
    var d = state.draft;
    d.when = when;
    d.ref = ref('SV');
    say(tx('booked', { name: state.lead.name, ref: d.ref }));
    sayNode(card(d.ref, [
      [t({ en: 'Service', bm: 'Perkhidmatan' }), d.service],
      [t({ en: 'Site', bm: 'Tapak' }), d.place],
      [t({ en: 'Requested date', bm: 'Tarikh diminta' }), fmtDate(when)],
      [t({ en: 'Contact', bm: 'Hubungan' }), state.lead.name + ', ' + state.lead.phone],
      [t({ en: 'Status', bm: 'Status' }), t({ en: 'Provisional, awaiting confirmation', bm: 'Sementara, menunggu pengesahan' })]
    ], [
      { label: tx('handoff'), href: PM.waLink(summaryText()), blank: true },
      { label: tx('callDesk'), href: 'tel:' + S.contact.servicePhone }
    ], 'book'), d.ref + ': ' + d.service + ', ' + d.place);
    say(tx('bookedTail', { phone: state.lead.phone }));
    state.step = 'open';
    afterFlow();
  }

  /* ================================================================ dosing */
  function startDosing(code) {
    /* "What is the dosing for a GTA3100" already names the model. Asking
       which model they have is the reply of something that did not read
       the question. */
    if (code && PM.dosingFor(code)) return doseFor(code);
    state.step = 'dose:model';
    say(tx('askTrapModel'));
    chips(['GTA01', 'GTA335', 'GTA3100', 'GTA3300'].map(function (code) {
      return { label: code, run: function () { doseFor(code); } };
    }));
  }

  function doseFor(code) {
    clearChips();
    var dose = PM.dosingFor(code);
    if (!dose) return say(tx('badTrapModel'));
    var perYear = (dose.monthly * 12).toFixed(1);
    say(t({
      en: 'A ' + code + ' holds about ' + dose.trap + ' litres, so the published dose is ' + dose.daily + ' ml a night.',
      bm: 'Sebuah ' + code + ' menampung kira-kira ' + dose.trap + ' liter, jadi dos terbitan ialah ' + dose.daily + ' ml semalam.'
    }));
    sayNode(card(code, [
      [t({ en: 'Trap volume', bm: 'Isi padu perangkap' }), dose.trap + ' L'],
      [t({ en: 'Nightly dose', bm: 'Dos malam' }), dose.daily + ' ml'],
      [t({ en: 'Per month', bm: 'Sebulan' }), dose.monthly + ' L'],
      [t({ en: 'Per year', bm: 'Setahun' }), perYear + ' L'],
      [t({ en: 'Delivered by', bm: 'Disampaikan oleh' }), t({ en: 'ADU9291P auto dosing unit', bm: 'Unit dos automatik ADU9291P' })]
    ], [
      { label: t({ en: 'Bio-enzyme page', bm: 'Halaman bio-enzim' }), href: PM.langHref('bio-enzyme.html') },
      { label: t({ en: 'Auto dosing unit', bm: 'Unit dos automatik' }), href: PM.langHref('auto-dosing.html') }
    ], 'dose'), code + ': ' + dose.daily + ' ml/night');
    say(t({
      en: 'Dosed overnight, when the kitchen is closed and the enzyme has hours of contact time, which is what the timer on the ADU is for.',
      bm: 'Didos pada waktu malam, ketika dapur ditutup dan enzim mempunyai berjam-jam masa sentuhan, itulah tujuan pemasa pada ADU.'
    }));
    state.step = 'open';
    afterFlow();
  }

  /* ======================================================== the open router */
  function answer(text) {
    /* A flow in progress takes the input first. */
    if (state.step === 'size:meals') {
      var meals = readNumber(text);
      if (meals === null || meals < 1) return say(tx('badMeals'));
      return sizeWith(Math.round(meals));
    }
    if (state.step === 'size:confirm') {
      if (yes(text)) return startQuote(true);
      if (no(text)) { state.step = 'open'; return afterFlow(); }
    }
    if (state.step === 'quote:qty') {
      var q = readNumber(text);
      if (q !== null && q >= 1) return quoteQty(Math.min(99, Math.round(q)));
    }
    if (state.step === 'book:where') {
      var pl = readState(text);
      if (pl) { state.draft.place = pl; return askWhen(); }
    }
    if (state.step === 'book:when') {
      var dt = readDate(text);
      if (!dt) return say(tx('badWhen'));
      return bookOn(dt);
    }
    if (state.step === 'dose:model') {
      var dm = readModel(text);
      if (!dm) return say(tx('badTrapModel'));
      return doseFor(dm.model);
    }

    /* A model code anywhere beats intent guessing. */
    var mdl = readModel(text);
    var intent = classify(text);

    if (mdl && (!intent || intent === 'product' || intent === 'size' || intent === 'quote')) {
      state.draft.model = mdl;
      say(t({ en: 'The ' + mdl.model + ', from the published table:',
              bm: 'Model ' + mdl.model + ', dari jadual terbitan:' }));
      sayNode(modelCard(mdl), mdl.model + ' - ' + mdl.sizeMm);
      if (intent === 'quote') return startQuote(true);
      say(t({ en: 'Would you like a quotation against it?', bm: 'Mahukah anda sebut harga untuknya?' }));
      state.step = 'size:confirm';
      return chips([
        { label: tx('yes'), run: function () { startQuote(true); } },
        { label: tx('no'), run: function () { state.step = 'open'; afterFlow(); } }
      ]);
    }

    /* A count in the sentence is a meal volume only when the sentence is
       about sizing or pricing and the number is big enough to be one, so
       "2 units" is never read as two meals a day. */
    var said = readNumber(text);
    var meals = (said !== null && said >= 20 &&
      /meal|cover|pax|customer|diner|hidangan|orang|pelanggan|day|daily|sehari|hari/i.test(text))
      ? said : null;

    switch (intent) {
      case 'size':   return startSizing(meals);
      case 'quote':  return startQuote(!!state.draft.model, meals);
      case 'book':   return startBooking();
      case 'dosing': return startDosing(mdl && mdl.model);
      case 'human':  return handoff();

      case 'greet':
        say(t({ en: 'Hello again. Where would you like to start?', bm: 'Salam sekali lagi. Di mana anda mahu bermula?' }));
        return menu();

      case 'thanks':
        say(t({ en: 'My pleasure. Your reference and details stay in this panel if you need them again.',
                bm: 'Sama-sama. Rujukan dan butiran anda kekal dalam panel ini jika anda memerlukannya lagi.' }));
        return menu();

      case 'bye':
        say(t({ en: 'Thank you for your time. The WhatsApp line is open during office hours if anything else comes up.',
                bm: 'Terima kasih atas masa anda. Talian WhatsApp terbuka pada waktu pejabat jika ada apa-apa lagi.' }));
        return sayNode(handoffCard(), tx('handoff'));

      case 'product': {
        var p = readProduct(text);
        if (p) {
          say(t(p.short));
          sayNode(card(t(p.name), (p.specs || []).slice(0, 5).map(function (sp) {
            return [t(sp.k), t(sp.v)];
          }), [{ label: tx('viewProduct'), href: PM.langHref('product.html?p=' + p.slug) }], 'model'),
            t(p.name));
          return afterFlow();
        }
        say(t({ en: 'The catalogue runs from a 12 GPM undersink trap to a 500 GPM centralized interceptor, plus the dosing unit, the bio-enzyme and the accessories.',
                bm: 'Katalog bermula dari perangkap bawah sinki 12 GPM hingga pemintas berpusat 500 GPM, serta unit dos, bio-enzim dan aksesori.' }));
        return chips(C.categories.map(function (c) {
          return { label: t(c.name), run: function () { root.location.href = PM.langHref(c.href); } };
        }));
      }

      case 'service': {
        say(t({ en: 'We run five service lines. Which one is closest to what you need?',
                bm: 'Kami menjalankan lima barisan servis. Yang mana paling hampir dengan keperluan anda?' }));
        var rows = C.services.slice(0, 5).map(function (s) { return [t(s.name), t(s.short)]; });
        sayNode(card(t({ en: 'Service lines', bm: 'Barisan servis' }), rows, [
          { label: tx('menuBook'), run: function () { startBooking(); } },
          { label: t({ en: 'All services', bm: 'Semua perkhidmatan' }), href: PM.langHref('services.html') }
        ]), t({ en: 'Service lines', bm: 'Barisan servis' }));
        return;
      }

      case 'install': {
        say(t({ en: 'Three steps, and it is normally done in an afternoon:',
                bm: 'Tiga langkah, dan biasanya siap dalam satu petang:' }));
        sayNode(card(t({ en: 'Installation', bm: 'Pemasangan' }),
          S.installSteps.map(function (s, i) { return [String(i + 1), t(s.title)]; }),
          [{ label: t({ en: 'Full guide', bm: 'Panduan penuh' }), href: PM.langHref('installation-guide.html') },
           { label: t({ en: 'Watch it done', bm: 'Tonton ia dilakukan' }), href: PM.langHref('videos.html') }]),
          t({ en: 'Installation', bm: 'Pemasangan' }));
        return afterFlow();
      }

      case 'cert': {
        say(t({ en: 'SIRIM product certification R018/15, registered industrial design 10-00859-0101, and effluent analysed by a SAMM accredited laboratory. Fifteen local authorities list us.',
                bm: 'Pensijilan produk SIRIM R018/15, reka bentuk perindustrian berdaftar 10-00859-0101, dan efluen dianalisis oleh makmal terakreditasi SAMM. Lima belas pihak berkuasa tempatan menyenaraikan kami.' }));
        sayNode(card(t({ en: 'On record', bm: 'Dalam rekod' }), [
          ['SIRIM', 'R018/15'],
          [t({ en: 'Industrial design', bm: 'Reka bentuk perindustrian' }), '10-00859-0101'],
          [t({ en: 'Lab', bm: 'Makmal' }), t({ en: 'SAMM accredited analysis', bm: 'Analisis terakreditasi SAMM' })],
          [t({ en: 'Authorities', bm: 'Pihak berkuasa' }),
           String(S.approvals.length + (S.approvalsExtra || []).length)]
        ], [
          { label: t({ en: 'Approvals', bm: 'Kelulusan' }), href: PM.langHref('approvals.html') },
          { label: t({ en: 'Lab results', bm: 'Keputusan makmal' }), href: PM.langHref('lab-test.html') }
        ]), 'SIRIM R018/15');
        return afterFlow();
      }

      case 'warranty':
        say(t(S.faq[3].a));
        return afterFlow();

      case 'delivery':
        say(t(S.faq[4].a));
        return afterFlow();

      case 'buy': {
        say(t({ en: 'Direct from the factory, through a dealer, or on the marketplaces. Direct is the one that comes with sizing advice.',
                bm: 'Terus dari kilang, melalui pengedar, atau di pasaran dalam talian. Cara terus disertakan nasihat penentuan saiz.' }));
        return chips([
          { label: t({ en: 'Where to buy', bm: 'Tempat membeli' }), run: function () { root.location.href = PM.langHref('where-to-buy.html'); } },
          { label: tx('menuQuote'), run: function () { startQuote(!!state.draft.model); } }
        ]);
      }

      case 'video':
        say(t({ en: 'There are seven on the channel: the factory floor, an installation walkthrough, the automatic unit running, and the service crews at work.',
                bm: 'Terdapat tujuh di saluran: lantai kilang, panduan pemasangan, unit automatik beroperasi, dan kru servis bekerja.' }));
        return chips([
          { label: t({ en: 'Open the video library', bm: 'Buka pustaka video' }), run: function () { root.location.href = PM.langHref('videos.html'); } }
        ]);

      case 'contact': {
        sayNode(card(t({ en: 'Reach us', bm: 'Hubungi kami' }), [
          [t({ en: 'Office', bm: 'Pejabat' }), S.contact.officeDisplay],
          [t({ en: 'Service', bm: 'Servis' }), S.contact.serviceDisplay],
          ['WhatsApp', S.contact.whatsappDisplay],
          [t(S.ui.email), S.contact.email],
          [t({ en: 'Hours', bm: 'Waktu' }), t(S.contact.hours)]
        ], [
          { label: tx('handoff'), href: PM.waLink(summaryText()), blank: true },
          { label: t({ en: 'Contact page', bm: 'Halaman hubungi' }), href: PM.langHref('contact.html') }
        ]), t({ en: 'Reach us', bm: 'Hubungi kami' }));
        return afterFlow();
      }
    }

    /* Nothing in the intent table. The FAQ often has it. */
    var f = faqMatch(text);
    if (f) {
      say(t(f.a));
      return afterFlow();
    }

    say(tx('unsure'));
    menu();
  }

  function submit(text) {
    heard(text);
    if (state.step === 'name' || state.step === 'phone' || state.step === 'email') {
      return intake(text);
    }
    answer(text);
  }

  /* ============================================================== language */
  function relabel() {
    ui.launch.setAttribute('aria-label', tx('launch'));
    ui.teaser.textContent = tx('teaser');
    ui.name.textContent = tx('title');
    ui.role.textContent = tx('role');
    ui.input.setAttribute('placeholder', tx('placeholder'));
    ui.input.setAttribute('aria-label', tx('placeholder'));
    ui.sendBtn.setAttribute('aria-label', tx('send'));
    ui.restart.setAttribute('aria-label', tx('restart'));
    ui.restart.setAttribute('title', tx('restart'));
    ui.closeBtn.setAttribute('aria-label', tx('close'));
    ui.closeBtn.setAttribute('title', tx('close'));
    ui.panel.setAttribute('aria-label', tx('title') + ' - ' + tx('role'));
  }

  /* ================================================================== boot */
  PM.chat = {
    open: function () { toggle(true); },
    close: function () { toggle(false); },
    ask: function (text) { toggle(true); submit(text); },
    lead: function () { return Object.assign({}, state.lead); }
  };

  PM.on('ready', function () {
    if (doc.querySelector('.pmchat')) return;
    load();
    build();
    relabel();

    /* The teaser is a one-time nudge. Once the panel has been opened, or
       the visitor has already given their name, it never shows again. */
    if (!state.lead.name) {
      root.setTimeout(function () {
        if (ui.root.getAttribute('data-open') !== 'true') ui.teaser.hidden = false;
      }, 6000);
    } else {
      ui.teaser.hidden = true;
    }
  });

  PM.on('langchange', function () {
    relabel();
    if (ui.root && ui.log.childNodes.length) {
      say(t({ en: 'Switched to English. Carry on.', bm: 'Bertukar ke Bahasa Melayu. Sila teruskan.' }));
      menu();
    }
  });
})(window, document);
