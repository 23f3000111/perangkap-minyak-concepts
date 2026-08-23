/* =========================================================================
   Perangkap Minyak - product catalogue, model table, services (EN / BM)
   Spec figures are taken from the manufacturer's own published model table.
   ========================================================================= */
(function (root) {
  'use strict';

  /* ------------------------------------------------------------------------
     MODEL TABLE
     The authoritative 17-model specification sheet.
     sink   = sink capacity served, in gallons
     gpm    = flow rate, gallons per minute
     meals  = daily meals served
     pipe   = inlet / outlet pipe size
     grease = maximum grease and waste water held
     max    = maximum capacity until overflow, in litres
     ------------------------------------------------------------------------ */
  var MODELS = [
    { model: 'GTA01',   series: 'undersink',   sink: '8 to 20',   gpm: 15,  meals: '40 to 150',      pipe: '1 1/4 inch', sizeIn: '24 (L) x 12 (W) x 12 (H) inch', sizeMm: '609 x 304 x 304 mm',   suggested: { en: 'Kopitiam, cafeteria',              bm: 'Kopitiam, kafeteria' },              grease: 30,   max: 57 },
    { model: 'GTA02',   series: 'undersink',   sink: '20 to 30',  gpm: 20,  meals: '150 to 250',     pipe: '1 1/2 inch', sizeIn: '30 (L) x 14 (W) x 12 (H) inch', sizeMm: '762 x 355 x 304 mm',   suggested: { en: 'Restoran mamak, medan selera',     bm: 'Restoran mamak, medan selera' },     grease: 45,   max: 80 },
    { model: 'GTA03',   series: 'undersink',   sink: 'Custom',    gpm: 0,   meals: 'Custom',         pipe: 'To suit',    sizeIn: 'Customer specified',            sizeMm: 'Customer specified',    suggested: { en: 'Non-standard layouts',            bm: 'Susun atur bukan piawai' },          grease: 0,    max: 0 },
    { model: 'GTA325',  series: 'centralized', sink: '30 to 50',  gpm: 25,  meals: '250 to 300',     pipe: '3 inch',     sizeIn: '26 (L) x 16 (W) x 22 (H) inch', sizeMm: '650 x 410 x 560 mm',   suggested: { en: 'Restoran mamak, workshop',        bm: 'Restoran mamak, bengkel' },          grease: 93,   max: 149 },
    { model: 'GTA335',  series: 'centralized', sink: '50 to 70',  gpm: 35,  meals: '300 to 400',     pipe: '3 inch',     sizeIn: '28 (L) x 18 (W) x 24 (H) inch', sizeMm: '700 x 450 x 600 mm',   suggested: { en: 'Restoran mamak, workshop',        bm: 'Restoran mamak, bengkel' },          grease: 122,  max: 189 },
    { model: 'GTA350',  series: 'centralized', sink: '70 to 80',  gpm: 50,  meals: '400 to 600',     pipe: '3 inch',     sizeIn: '32 (L) x 20 (W) x 25 (H) inch', sizeMm: '800 x 520 x 630 mm',   suggested: { en: 'Restoran mamak, workshop',        bm: 'Restoran mamak, bengkel' },          grease: 174,  max: 262 },
    { model: 'GTA375',  series: 'centralized', sink: '80 to 90',  gpm: 75,  meals: '600 to 1000',    pipe: '4 inch',     sizeIn: '39 (L) x 28 (W) x 25 (H) inch', sizeMm: '1000 x 710 x 630 mm',  suggested: { en: 'Restoran mamak, workshop',        bm: 'Restoran mamak, bengkel' },          grease: 279,  max: 447 },
    { model: 'GTA3100', series: 'centralized', sink: '90 to 100', gpm: 100, meals: '1000 to 2200',   pipe: '4 inch',     sizeIn: '47 (L) x 34 (W) x 33 (H) inch', sizeMm: '1200 x 860 x 840 mm',  suggested: { en: 'Canteen',                         bm: 'Kantin' },                           grease: 622,  max: 866 },
    { model: 'GTA3150', series: 'centralized', sink: 'Over 100',  gpm: 150, meals: '2200 to 3200',   pipe: '4 inch',     sizeIn: '55 (L) x 36 (W) x 37 (H) inch', sizeMm: '1400 x 910 x 940 mm',  suggested: { en: 'Canteen',                         bm: 'Kantin' },                           grease: 896,  max: 1197 },
    { model: 'GTA3200', series: 'centralized', sink: 'Over 100',  gpm: 200, meals: '3200 to 4400',   pipe: '6 inch',     sizeIn: '63 (L) x 40 (W) x 42 (H) inch', sizeMm: '1600 x 1010 x 1060 mm', suggested: { en: 'Canteen',                        bm: 'Kantin' },                           grease: 1248, max: 1712 },
    { model: 'GTA3250', series: 'centralized', sink: 'Over 100',  gpm: 250, meals: '4400 to 6000',   pipe: '6 inch',     sizeIn: '67 (L) x 44 (W) x 46 (H) inch', sizeMm: '1700 x 1110 x 1160 mm', suggested: { en: 'Canteen',                        bm: 'Kantin' },                           grease: 1646, max: 2188 },
    { model: 'GTA3300', series: 'centralized', sink: 'Over 100',  gpm: 300, meals: '6000 to 6600',   pipe: '6 inch',     sizeIn: '71 (L) x 46 (W) x 46 (H) inch', sizeMm: '1800 x 1160 x 1160 mm', suggested: { en: 'Hotel',                          bm: 'Hotel' },                            grease: 1821, max: 2635 },
    { model: 'GTA3350', series: 'centralized', sink: 'Over 100',  gpm: 350, meals: '6600 to 7800',   pipe: '6 inch',     sizeIn: '79 (L) x 48 (W) x 48 (H) inch', sizeMm: '2000 x 1210 x 1210 mm', suggested: { en: 'Hotel',                          bm: 'Hotel' },                            grease: 2232, max: 2928 },
    { model: 'GTA3400', series: 'centralized', sink: 'Over 100',  gpm: 400, meals: '7800 to 9400',   pipe: '6 inch',     sizeIn: '83 (L) x 52 (W) x 50 (H) inch', sizeMm: '2100 x 1310 x 1260 mm', suggested: { en: 'Hotel',                          bm: 'Hotel' },                            grease: 2675, max: 3466 },
    { model: 'GTA3450', series: 'centralized', sink: 'Over 100',  gpm: 450, meals: '9400 to 12000',  pipe: '6 inch',     sizeIn: '87 (L) x 56 (W) x 54 (H) inch', sizeMm: '2200 x 1410 x 1360 mm', suggested: { en: 'Food factory',                   bm: 'Kilang makanan' },                   grease: 3327, max: 4218 },
    { model: 'GTA3500', series: 'centralized', sink: 'Over 100',  gpm: 500, meals: '12000 to 15000', pipe: '6 inch',     sizeIn: '87 (L) x 56 (W) x 62 (H) inch', sizeMm: '2200 x 1410 x 1560 mm', suggested: { en: 'Food factory',                   bm: 'Kilang makanan' },                   grease: 3947, max: 4839 },
    { model: 'GTA3800', series: 'drain',       sink: 'Over 100',  gpm: 300, meals: '4400 to 6000',   pipe: '6 inch',     sizeIn: '72 (L) x 13 (W) x 24 (H) inch', sizeMm: '1829 x 330 x 609 mm',  suggested: { en: 'Drain, industrial effluent treatment', bm: 'Longkang, rawatan efluen perindustrian' }, grease: 183, max: 367 }
  ];

  /* ------------------------------------------------------------------------
     DOSING TABLE
     Bio-enzyme dose by grease trap model, as published by the manufacturer.
     ------------------------------------------------------------------------ */
  var DOSING = [
    { model: 'MS12',    trap: 10,   daily: 27.5,  monthly: 0.825 },
    { model: 'GTA01',   trap: 30,   daily: 27.5,  monthly: 0.825 },
    { model: 'GTA02',   trap: 45,   daily: 27.5,  monthly: 0.825 },
    { model: 'GTA325',  trap: 94,   daily: 27.5,  monthly: 0.825 },
    { model: 'GTA335',  trap: 124,  daily: 40,    monthly: 1.20 },
    { model: 'GTA350',  trap: 176,  daily: 53.75, monthly: 1.613 },
    { model: 'GTA375',  trap: 287,  daily: 71.25, monthly: 2.14 },
    { model: 'GTA3100', trap: 634,  daily: 90,    monthly: 2.7 },
    { model: 'GTA3150', trap: 910,  daily: 90,    monthly: 2.7 },
    { model: 'GTA3200', trap: 1212, daily: 135,   monthly: 4.05 },
    { model: 'GTA3250', trap: 1603, daily: 178.35, monthly: 5.37 },
    { model: 'GTA3300', trap: 1774, daily: 223.75, monthly: 6.71 },
    { model: 'GTA3350', trap: 2178, daily: 268.75, monthly: 8.06 },
    { model: 'GTA3400', trap: 2613, daily: 321.25, monthly: 9.64 },
    { model: 'GTA3450', trap: 3257, daily: 357.5, monthly: 10.73 },
    { model: 'GTA3500', trap: 3877, daily: 392.5, monthly: 11.78 }
  ];

  /* ------------------------------------------------------------------ shared */
  var WARRANTY_TRAP = {
    en: [
      '5 year factory manufacturing warranty, paired with an exclusive 3 year on-site warranty.',
      'On-site cover includes structural rust-through and material perforation under normal operating conditions.',
      'Standard exclusions: damage from misuse, physical impact, bending, twisting or external human error.'
    ],
    bm: [
      'Waranti pembuatan kilang 5 tahun, berserta waranti eksklusif 3 tahun di tapak.',
      'Perlindungan di tapak merangkumi karat menembusi struktur dan penebukan bahan dalam keadaan operasi biasa.',
      'Pengecualian biasa: kerosakan akibat salah guna, hentaman fizikal, bengkokan, pemulasan atau kesilapan manusia luaran.'
    ]
  };

  var BADGE = {
    sirim: { en: 'SIRIM certified', bm: 'Diperakui SIRIM' },
    warranty: { en: '5+3 year warranty', bm: 'Waranti 5+3 tahun' },
    lifetime: { en: 'Lifetime warranty', bm: 'Waranti seumur hidup' },
    ss304: { en: '304 stainless steel', bm: 'Keluli tahan karat 304' },
    made: { en: 'Made in Malaysia', bm: 'Buatan Malaysia' },
    topSales: { en: 'Top seller', bm: 'Paling laris' },
    custom: { en: 'Built to order', bm: 'Dibina mengikut pesanan' }
  };

  function spec(k, v) { return { k: k, v: v }; }

  /* Build the standard spec block for any model in the table. */
  function specsFor(m) {
    var out = [
      spec({ en: 'Model', bm: 'Model' }, m.model),
      spec({ en: 'Flow rate', bm: 'Kadar aliran' }, m.gpm + ' GPM'),
      spec({ en: 'Dimensions', bm: 'Dimensi' }, m.sizeIn),
      spec({ en: 'Dimensions, metric', bm: 'Dimensi, metrik' }, m.sizeMm),
      spec({ en: 'Maximum capacity until overflow', bm: 'Kapasiti maksimum sebelum melimpah' }, m.max + ' litre'),
      spec({ en: 'Maximum grease and waste water', bm: 'Gris dan air sisa maksimum' }, m.grease + ' litre'),
      spec({ en: 'Sink capacity served', bm: 'Kapasiti sinki dilayan' }, m.sink + ' gallons'),
      spec({ en: 'Daily meals', bm: 'Hidangan harian' }, m.meals),
      spec({ en: 'Pipe size', bm: 'Saiz paip' }, m.pipe),
      spec({ en: 'Material', bm: 'Bahan' }, '304 stainless steel or reinforced fibreglass'),
      spec({ en: 'Wastewater tolerance', bm: 'Toleransi air sisa' }, 'Above 100 degrees Celsius')
    ];
    return out;
  }

  /* Copy template for the centralized underground series. */
  function centralizedProduct(m, images, featured) {
    return {
      slug: 'centralized-grease-trap-' + m.model.toLowerCase(),
      cat: 'grease-trap',
      sub: 'centralized',
      model: m.model,
      gpm: m.gpm,
      litres: m.max,
      images: images,
      badges: [BADGE.sirim, BADGE.warranty, BADGE.ss304],
      featured: !!featured,
      name: {
        en: 'Centralized Grease Trap ' + m.model,
        bm: 'Perangkap Minyak Berpusat ' + m.model
      },
      short: {
        en: m.gpm + ' GPM, ' + m.max + ' litre capacity, ' + m.pipe + ' inlet and outlet',
        bm: m.gpm + ' GPM, kapasiti ' + m.max + ' liter, salur masuk dan keluar ' + m.pipe
      },
      intro: {
        en: [
          'The ' + m.model + ' is a centralized interceptor sized for kitchens serving ' + m.meals + ' meals a day. It sits downstream of several sinks and washing points rather than under a single bowl, so one unit handles the whole kitchen line.',
          'Wastewater passes through three chambers. The first captures food solids, the second lets fats and oils rise and hold, and the third discharges cleaner water to the drain. At ' + m.gpm + ' GPM it holds up to ' + m.grease + ' litres of grease and waste water before service is due.'
        ],
        bm: [
          'Model ' + m.model + ' ialah pemintas berpusat yang disaiz untuk dapur yang menyediakan ' + m.meals + ' hidangan sehari. Ia dipasang di hilir beberapa sinki dan titik pencucian, bukan di bawah satu besen sahaja, jadi satu unit menampung keseluruhan barisan dapur.',
          'Air sisa melalui tiga ruang. Ruang pertama menangkap pepejal makanan, ruang kedua membiarkan lemak dan minyak naik dan tertahan, dan ruang ketiga melepaskan air lebih bersih ke longkang. Pada ' + m.gpm + ' GPM ia menampung sehingga ' + m.grease + ' liter gris dan air sisa sebelum servis diperlukan.'
        ]
      },
      bullets: {
        en: [
          'Three chamber separation for higher grease removal than single chamber tanks',
          'Available in 304 stainless steel or reinforced fibreglass',
          'Rated for wastewater above 100 degrees Celsius',
          'Accepted by local authorities across Malaysia for licensing inspections',
          'Serviceable by pump-out without removing the tank'
        ],
        bm: [
          'Pemisahan tiga ruang untuk penyingkiran gris lebih tinggi berbanding tangki satu ruang',
          'Tersedia dalam keluli tahan karat 304 atau gentian kaca diperkukuh',
          'Dinilai untuk air sisa melebihi 100 darjah Celsius',
          'Diterima oleh pihak berkuasa tempatan di seluruh Malaysia untuk pemeriksaan pelesenan',
          'Boleh diservis melalui pengepaman tanpa mengeluarkan tangki'
        ]
      },
      idealFor: {
        en: m.suggested.en + ', and any kitchen running ' + m.meals + ' meals a day.',
        bm: m.suggested.bm + ', dan mana-mana dapur yang menyediakan ' + m.meals + ' hidangan sehari.'
      },
      specs: specsFor(m),
      warranty: WARRANTY_TRAP
    };
  }

  var GT = 'products/';
  var PRODUCTS = [];

  /* ------------------------------------------------- UNDERSINK GREASE TRAP */
  PRODUCTS.push({
    slug: 'undersink-grease-trap-gts02',
    cat: 'grease-trap', sub: 'undersink', model: 'GTS02', gpm: 12, litres: 40,
    images: [GT + 'gts02-1.webp', GT + 'gts02-2.webp', GT + 'gts02-3.webp', GT + 'gts02-5.webp', GT + 'gts02-6.webp'],
    badges: [BADGE.topSales, BADGE.sirim, BADGE.warranty, BADGE.ss304],
    featured: true, hero: true,
    name: { en: 'Undersink Grease Trap GTS02', bm: 'Perangkap Minyak Bawah Sinki GTS02' },
    short: { en: '12 GPM, 40 litre capacity, basket above the water line', bm: '12 GPM, kapasiti 40 liter, bakul di atas paras air' },
    intro: {
      en: [
        'The GTS02 is our best selling under sink grease trap. It is SIRIM certified to meet local requirements and support smoother municipal licensing approval.',
        'Unlike conventional traps, the GTS02 keeps the food waste basket above the water level, preventing food waste from soaking in dirty wastewater. That single change reduces unpleasant odours, makes cleaning faster and easier, and improves grease separation performance.'
      ],
      bm: [
        'GTS02 ialah perangkap minyak bawah sinki paling laris kami. Ia diperakui SIRIM untuk memenuhi keperluan tempatan dan melancarkan kelulusan pelesenan majlis.',
        'Berbeza dengan perangkap konvensional, GTS02 mengekalkan bakul sisa makanan di atas paras air, menghalang sisa makanan daripada direndam dalam air sisa kotor. Satu perubahan itu mengurangkan bau tidak menyenangkan, menjadikan pembersihan lebih pantas dan mudah, serta meningkatkan prestasi pemisahan gris.'
      ]
    },
    bullets: {
      en: [
        'SIRIM certified for quality and compliance',
        'Unique basket design keeps food waste above dirty wastewater',
        'Cleaner and more hygienic than conventional grease traps',
        'Easy to clean, reducing maintenance time and labour',
        'Compact under sink footprint suits restaurants, cafes, hotels, food courts and commercial kitchens',
        'High grease separation efficiency helps prevent drain blockages'
      ],
      bm: [
        'Diperakui SIRIM untuk kualiti dan pematuhan',
        'Reka bentuk bakul unik mengekalkan sisa makanan di atas air sisa kotor',
        'Lebih bersih dan higienik berbanding perangkap minyak konvensional',
        'Mudah dibersihkan, mengurangkan masa dan tenaga penyelenggaraan',
        'Tapak padat di bawah sinki sesuai untuk restoran, kafe, hotel, medan selera dan dapur komersial',
        'Kecekapan pemisahan gris tinggi membantu menghalang penyumbatan longkang'
      ]
    },
    highlights: {
      en: [
        { t: 'Compact design', b: 'The GTS02 can be connected to 2 or 3 sinks while taking up minimal space under the sink. It suits kitchens that need efficient grease management without sacrificing valuable storage space.' },
        { t: 'Easy installation', b: 'The compact design allows quick installation under most existing sinks, which makes it suitable for both new projects and kitchen renovations.' },
        { t: 'Unique basket design, only in Malaysia', b: 'The food waste basket stays above the water level instead of being submerged in dirty wastewater. Food waste stays dry, odours drop, bacterial growth is minimised and the daily clean is far more pleasant.' }
      ],
      bm: [
        { t: 'Reka bentuk padat', b: 'GTS02 boleh disambungkan kepada 2 atau 3 sinki sambil menggunakan ruang minimum di bawah sinki. Ia sesuai untuk dapur yang memerlukan pengurusan gris yang cekap tanpa mengorbankan ruang simpanan berharga.' },
        { t: 'Pemasangan mudah', b: 'Reka bentuk padat membolehkan pemasangan pantas di bawah kebanyakan sinki sedia ada, menjadikannya sesuai untuk projek baharu dan pengubahsuaian dapur.' },
        { t: 'Reka bentuk bakul unik, hanya di Malaysia', b: 'Bakul sisa makanan kekal di atas paras air dan tidak tenggelam dalam air sisa kotor. Sisa makanan kekal kering, bau berkurangan, pertumbuhan bakteria dikurangkan dan pembersihan harian menjadi jauh lebih selesa.' }
      ]
    },
    idealFor: {
      en: 'Small to medium commercial kitchens, busy cafes, upscale kopitiams, and spatially constrained installations that still need elevated capacity.',
      bm: 'Dapur komersial kecil hingga sederhana, kafe sibuk, kopitiam mewah, dan pemasangan yang terhad ruang tetapi masih memerlukan kapasiti tinggi.'
    },
    specs: [
      spec({ en: 'Model', bm: 'Model' }, 'GTS02'),
      spec({ en: 'Dimensions', bm: 'Dimensi' }, '17 (L) x 12 (W) x 12 (H) inch'),
      spec({ en: 'Dimensions, metric', bm: 'Dimensi, metrik' }, '430 x 304 x 304 mm'),
      spec({ en: 'Flow rate', bm: 'Kadar aliran' }, '12 GPM'),
      spec({ en: 'Recommended usage', bm: 'Penggunaan disyorkan' }, '40 to 150 meals per day'),
      spec({ en: 'Maximum capacity, overflow', bm: 'Kapasiti maksimum, limpahan' }, '40 litres'),
      spec({ en: 'Pipe size', bm: 'Saiz paip' }, '40 mm'),
      spec({ en: 'Material', bm: 'Bahan' }, '304 stainless steel'),
      spec({ en: 'Accessories', bm: 'Aksesori' }, 'Flexible hose and tank connector included')
    ],
    warranty: WARRANTY_TRAP
  });

  PRODUCTS.push({
    slug: 'undersink-grease-trap-gts01',
    cat: 'grease-trap', sub: 'undersink', model: 'GTS01', gpm: 10, litres: 23,
    images: [GT + 'gts01-1.webp', GT + 'gts01-2.webp', GT + 'gts01-3.webp'],
    badges: [BADGE.sirim, BADGE.warranty, BADGE.ss304], featured: true,
    name: { en: 'Undersink Grease Trap GTS01', bm: 'Perangkap Minyak Bawah Sinki GTS01' },
    short: { en: '10 GPM, 23 litre capacity, the compact entry model', bm: '10 GPM, kapasiti 23 liter, model permulaan padat' },
    intro: {
      en: [
        'The GTS01 is the most compact trap in the range, built for single sink stations where cabinet space is tight but a certified trap is still required for licensing.',
        'It carries the same three chamber separation and elevated basket design as the larger models, at a footprint that fits under a standard preparation sink.'
      ],
      bm: [
        'GTS01 ialah perangkap paling padat dalam julat ini, dibina untuk stesen sinki tunggal di mana ruang kabinet terhad tetapi perangkap diperakui masih diperlukan untuk pelesenan.',
        'Ia mempunyai pemisahan tiga ruang dan reka bentuk bakul tinggi yang sama seperti model lebih besar, pada tapak yang muat di bawah sinki penyediaan piawai.'
      ]
    },
    bullets: {
      en: ['Fits a standard single sink cabinet', 'Basket sits above the water line', 'SIRIM certified 304 stainless steel body', 'Tool free basket removal for the daily clean', 'Flexible hose and tank connector supplied'],
      bm: ['Muat dalam kabinet sinki tunggal piawai', 'Bakul berada di atas paras air', 'Badan keluli tahan karat 304 diperakui SIRIM', 'Bakul boleh ditanggalkan tanpa alat untuk pembersihan harian', 'Hos fleksibel dan penyambung tangki dibekalkan']
    },
    idealFor: { en: 'Single sink stations, small cafes, office pantries and takeaway counters.', bm: 'Stesen sinki tunggal, kafe kecil, pantri pejabat dan kaunter bawa pulang.' },
    specs: [
      spec({ en: 'Model', bm: 'Model' }, 'GTS01'),
      spec({ en: 'Flow rate', bm: 'Kadar aliran' }, '10 GPM'),
      spec({ en: 'Maximum capacity, overflow', bm: 'Kapasiti maksimum, limpahan' }, '23 litres'),
      spec({ en: 'Material', bm: 'Bahan' }, '304 stainless steel'),
      spec({ en: 'Pipe size', bm: 'Saiz paip' }, '40 mm'),
      spec({ en: 'Accessories', bm: 'Aksesori' }, 'Flexible hose and tank connector included')
    ],
    warranty: WARRANTY_TRAP
  });

  PRODUCTS.push({
    slug: 'undersink-automatic-grease-trap-gta03auto',
    cat: 'grease-trap', sub: 'undersink', model: 'GTA03AUTO', gpm: 20, litres: 47,
    images: [GT + 'gta03auto-1.webp'],
    badges: [BADGE.ss304, BADGE.warranty, BADGE.made], featured: true,
    name: { en: 'Undersink Automatic Grease Trap GTA03AUTO', bm: 'Perangkap Minyak Automatik Bawah Sinki GTA03AUTO' },
    short: { en: 'Automatic skimming, no manual grease scooping', bm: 'Menyisih automatik, tiada penyaukan gris secara manual' },
    intro: {
      en: [
        'The GTA03AUTO adds a motorised skimming mechanism to the standard undersink trap. Separated grease is lifted continuously off the water surface and collected in a removable container, so the kitchen team never scoops grease by hand.',
        'This suits operations where labour is short or where the trap sits in a customer visible area and cannot be opened during service hours.'
      ],
      bm: [
        'GTA03AUTO menambah mekanisme penyisih bermotor pada perangkap bawah sinki piawai. Gris yang dipisahkan diangkat secara berterusan dari permukaan air dan dikumpulkan dalam bekas boleh tanggal, jadi pasukan dapur tidak perlu menyauk gris dengan tangan.',
        'Ini sesuai untuk operasi yang kekurangan tenaga kerja atau apabila perangkap berada di kawasan yang kelihatan oleh pelanggan dan tidak boleh dibuka semasa waktu operasi.'
      ]
    },
    bullets: {
      en: ['Automatic mechanical grease removal', 'Removable collection container empties in seconds', 'Reduces daily labour and handling of hot grease', 'Keeps the separation chamber working at full efficiency', '304 stainless steel construction'],
      bm: ['Penyingkiran gris mekanikal automatik', 'Bekas kutipan boleh tanggal dikosongkan dalam beberapa saat', 'Mengurangkan kerja harian dan pengendalian gris panas', 'Mengekalkan ruang pemisahan pada kecekapan penuh', 'Binaan keluli tahan karat 304']
    },
    idealFor: { en: 'Hotels, central kitchens, hospital kitchens and any site where opening the trap during service is not practical.', bm: 'Hotel, dapur berpusat, dapur hospital dan mana-mana tapak yang tidak praktikal untuk membuka perangkap semasa operasi.' },
    specs: [
      spec({ en: 'Model', bm: 'Model' }, 'GTA03AUTO'),
      spec({ en: 'Type', bm: 'Jenis' }, 'Automatic skimming undersink trap'),
      spec({ en: 'Material', bm: 'Bahan' }, '304 stainless steel'),
      spec({ en: 'Grease collection', bm: 'Kutipan gris' }, 'Removable container'),
      spec({ en: 'Power supply', bm: 'Bekalan kuasa' }, 'AC 240 V')
    ],
    warranty: WARRANTY_TRAP
  });

  PRODUCTS.push({
    slug: 'undersink-grease-trap-gts02a',
    cat: 'grease-trap', sub: 'undersink', model: 'GTS02A', gpm: 12, litres: 40,
    images: [GT + 'gts02-2.webp', GT + 'gts02-4.webp'],
    badges: [BADGE.sirim, BADGE.warranty, BADGE.ss304],
    name: { en: 'Undersink Grease Trap GTS02A', bm: 'Perangkap Minyak Bawah Sinki GTS02A' },
    short: { en: '12 GPM, 40 litre capacity, alternate outlet configuration', bm: '12 GPM, kapasiti 40 liter, konfigurasi salur keluar alternatif' },
    intro: {
      en: ['The GTS02A carries the same 12 GPM rating and 40 litre capacity as the GTS02, with the outlet repositioned for cabinets where the waste pipe runs on the opposite side.', 'Choose this variant when the standard GTS02 outlet would force an awkward pipe bend behind the sink pedestal.'],
      bm: ['GTS02A mempunyai penarafan 12 GPM dan kapasiti 40 liter yang sama seperti GTS02, dengan salur keluar dipindahkan untuk kabinet yang paip sisanya berada di sisi bertentangan.', 'Pilih varian ini apabila salur keluar GTS02 piawai akan memaksa bengkokan paip yang janggal di belakang pedestal sinki.']
    },
    bullets: {
      en: ['Same capacity and certification as the GTS02', 'Outlet repositioned for mirrored cabinet layouts', 'Basket above the water line', '304 stainless steel body'],
      bm: ['Kapasiti dan pensijilan sama seperti GTS02', 'Salur keluar dipindahkan untuk susun atur kabinet bercermin', 'Bakul di atas paras air', 'Badan keluli tahan karat 304']
    },
    idealFor: { en: 'Kitchen fit-outs where the waste run sits on the opposite side of the cabinet.', bm: 'Pemasangan dapur yang laluan paip sisanya berada di sisi bertentangan kabinet.' },
    specs: [
      spec({ en: 'Model', bm: 'Model' }, 'GTS02A'),
      spec({ en: 'Flow rate', bm: 'Kadar aliran' }, '12 GPM'),
      spec({ en: 'Maximum capacity, overflow', bm: 'Kapasiti maksimum, limpahan' }, '40 litres'),
      spec({ en: 'Material', bm: 'Bahan' }, '304 stainless steel')
    ],
    warranty: WARRANTY_TRAP
  });

  PRODUCTS.push({
    slug: 'pantries-grease-trap-gts03p',
    cat: 'grease-trap', sub: 'undersink', model: 'GTS03P', gpm: 20, litres: 47,
    images: [GT + 'gts02-3.webp', GT + 'gts02-6.webp'],
    badges: [BADGE.sirim, BADGE.warranty, BADGE.ss304],
    name: { en: 'Pantries Grease Trap GTS03P', bm: 'Perangkap Minyak Pantri GTS03P' },
    short: { en: '20 GPM, 47 litre capacity, sized for shared pantry lines', bm: '20 GPM, kapasiti 47 liter, disaiz untuk barisan pantri berkongsi' },
    intro: {
      en: ['The GTS03P is built for office pantries, staff canteens and shared preparation areas where several small sinks discharge into one waste line.', 'At 47 litres it holds considerably more than a single sink trap while still fitting inside a standard pantry cabinet.'],
      bm: ['GTS03P dibina untuk pantri pejabat, kantin kakitangan dan kawasan penyediaan berkongsi di mana beberapa sinki kecil mengalir ke satu laluan sisa.', 'Pada 47 liter ia menampung jauh lebih banyak berbanding perangkap sinki tunggal sambil masih muat di dalam kabinet pantri piawai.']
    },
    bullets: {
      en: ['Serves multiple pantry sinks from one unit', '47 litre working capacity', 'Basket above the water line', '304 stainless steel body', 'Fits a standard pantry cabinet depth'],
      bm: ['Melayan beberapa sinki pantri daripada satu unit', 'Kapasiti operasi 47 liter', 'Bakul di atas paras air', 'Badan keluli tahan karat 304', 'Muat dengan kedalaman kabinet pantri piawai']
    },
    idealFor: { en: 'Office pantries, staff canteens, hospital ward pantries and shared preparation areas.', bm: 'Pantri pejabat, kantin kakitangan, pantri wad hospital dan kawasan penyediaan berkongsi.' },
    specs: [
      spec({ en: 'Model', bm: 'Model' }, 'GTS03P'),
      spec({ en: 'Flow rate', bm: 'Kadar aliran' }, '20 GPM'),
      spec({ en: 'Maximum capacity, overflow', bm: 'Kapasiti maksimum, limpahan' }, '47 litres'),
      spec({ en: 'Material', bm: 'Bahan' }, '304 stainless steel')
    ],
    warranty: WARRANTY_TRAP
  });

  (function () {
    var m01 = MODELS[0], m02 = MODELS[1];
    PRODUCTS.push({
      slug: 'undersink-grease-trap-gta01',
      cat: 'grease-trap', sub: 'undersink', model: 'GTA01', gpm: 15, litres: 57,
      images: [GT + 'gts01-2.webp', GT + 'grease-trap-generic.png'],
      badges: [BADGE.sirim, BADGE.warranty],
      name: { en: 'Undersink Grease Trap GTA01', bm: 'Perangkap Minyak Bawah Sinki GTA01' },
      short: { en: '15 GPM, 57 litre capacity, the kopitiam workhorse', bm: '15 GPM, kapasiti 57 liter, kuda kerja kopitiam' },
      intro: {
        en: ['The GTA01 is the long running standard for kopitiams and cafeterias serving 40 to 150 meals a day. It has been accepted by local authorities across Malaysia for well over a decade.', 'Available in reinforced fibreglass for lightweight installation or 304 stainless steel where thermal and chemical resistance matter more.'],
        bm: ['GTA01 ialah piawaian lama untuk kopitiam dan kafeteria yang menyediakan 40 hingga 150 hidangan sehari. Ia telah diterima oleh pihak berkuasa tempatan di seluruh Malaysia selama lebih sedekad.', 'Tersedia dalam gentian kaca diperkukuh untuk pemasangan ringan atau keluli tahan karat 304 apabila rintangan haba dan kimia lebih penting.']
      },
      bullets: {
        en: ['Serves sinks of 8 to 20 gallons', 'Handles 40 to 150 meals a day', '1 1/4 inch inlet and outlet', 'Fibreglass or 304 stainless steel', 'Normally held in stock for 1 to 2 day delivery'],
        bm: ['Melayan sinki 8 hingga 20 gelen', 'Menampung 40 hingga 150 hidangan sehari', 'Salur masuk dan keluar 1 1/4 inci', 'Gentian kaca atau keluli tahan karat 304', 'Biasanya ada dalam stok untuk penghantaran 1 hingga 2 hari']
      },
      idealFor: { en: 'Kopitiams and cafeterias serving 40 to 150 meals a day.', bm: 'Kopitiam dan kafeteria yang menyediakan 40 hingga 150 hidangan sehari.' },
      specs: specsFor(m01), warranty: WARRANTY_TRAP
    });
    PRODUCTS.push({
      slug: 'undersink-grease-trap-gta02',
      cat: 'grease-trap', sub: 'undersink', model: 'GTA02', gpm: 20, litres: 80,
      images: [GT + 'gts02-4.webp', GT + 'grease-trap-generic.png'],
      badges: [BADGE.sirim, BADGE.warranty],
      name: { en: 'Undersink Grease Trap GTA02', bm: 'Perangkap Minyak Bawah Sinki GTA02' },
      short: { en: '20 GPM, 80 litre capacity, for restoran mamak volume', bm: '20 GPM, kapasiti 80 liter, untuk jumlah restoran mamak' },
      intro: {
        en: ['The GTA02 steps up to 80 litres and a 1 1/2 inch pipe, sized for restoran mamak and medan selera stalls pushing 150 to 250 meals a day.', 'It is the largest trap that still installs under a sink rather than requiring an underground chamber.'],
        bm: ['GTA02 meningkat kepada 80 liter dan paip 1 1/2 inci, disaiz untuk restoran mamak dan gerai medan selera yang menyediakan 150 hingga 250 hidangan sehari.', 'Ia adalah perangkap terbesar yang masih boleh dipasang di bawah sinki tanpa memerlukan ruang bawah tanah.']
      },
      bullets: {
        en: ['Serves sinks of 20 to 30 gallons', 'Handles 150 to 250 meals a day', '1 1/2 inch inlet and outlet', 'Fibreglass or 304 stainless steel', 'Normally held in stock for 1 to 2 day delivery'],
        bm: ['Melayan sinki 20 hingga 30 gelen', 'Menampung 150 hingga 250 hidangan sehari', 'Salur masuk dan keluar 1 1/2 inci', 'Gentian kaca atau keluli tahan karat 304', 'Biasanya ada dalam stok untuk penghantaran 1 hingga 2 hari']
      },
      idealFor: { en: 'Restoran mamak, medan selera stalls and school canteens.', bm: 'Restoran mamak, gerai medan selera dan kantin sekolah.' },
      specs: specsFor(m02), warranty: WARRANTY_TRAP
    });
  })();

  PRODUCTS.push({
    slug: 'custom-made-undersink-grease-trap',
    cat: 'grease-trap', sub: 'undersink', model: 'GTA03', gpm: 0, litres: 0,
    images: [GT + 'gts02-5.webp', GT + 'gts01-3.webp'],
    badges: [BADGE.custom, BADGE.ss304],
    name: { en: 'Custom-Made Undersink Grease Trap', bm: 'Perangkap Minyak Bawah Sinki Tersuai' },
    short: { en: 'Model GTA03, built to your measured dimensions', bm: 'Model GTA03, dibina mengikut dimensi ukuran anda' },
    intro: {
      en: ['Model GTA03 is fabricated to customer specified dimensions for cabinets, plinths and service voids that no standard model fits.', 'Send your structural drawings or site measurements. We will arrange a physical site evaluation or return a formal quotation within 1 to 2 business days.'],
      bm: ['Model GTA03 difabrikasi mengikut dimensi yang ditetapkan pelanggan untuk kabinet, plinth dan ruang servis yang tidak muat dengan mana-mana model piawai.', 'Hantar lukisan struktur atau ukuran tapak anda. Kami akan mengaturkan penilaian tapak fizikal atau mengembalikan sebut harga rasmi dalam 1 hingga 2 hari bekerja.']
    },
    bullets: {
      en: ['Any length, width and height within fabrication limits', 'Inlet and outlet positioned to suit the existing waste run', '304 stainless steel or reinforced fibreglass', 'Same three chamber separation as standard models', 'Free site evaluation across Peninsular Malaysia'],
      bm: ['Sebarang panjang, lebar dan tinggi dalam had fabrikasi', 'Salur masuk dan keluar diletakkan mengikut laluan sisa sedia ada', 'Keluli tahan karat 304 atau gentian kaca diperkukuh', 'Pemisahan tiga ruang yang sama seperti model piawai', 'Penilaian tapak percuma di seluruh Semenanjung Malaysia']
    },
    idealFor: { en: 'Heritage shophouse kitchens, tight service voids and refurbishment projects with fixed pipe positions.', bm: 'Dapur rumah kedai warisan, ruang servis sempit dan projek naik taraf dengan kedudukan paip tetap.' },
    specs: [
      spec({ en: 'Model', bm: 'Model' }, 'GTA03'),
      spec({ en: 'Dimensions', bm: 'Dimensi' }, 'Customer specified'),
      spec({ en: 'Pipe size', bm: 'Saiz paip' }, 'To suit existing waste run'),
      spec({ en: 'Material', bm: 'Bahan' }, '304 stainless steel or reinforced fibreglass'),
      spec({ en: 'Lead time', bm: 'Masa penyediaan' }, 'Quoted on drawing approval')
    ],
    warranty: WARRANTY_TRAP
  });

  /* ----------------------------------------------- CENTRALIZED GREASE TRAP */
  var centralImgs = {
    GTA325: [GT + 'gta325-1.webp', GT + 'gta325-2.jpg'],
    GTA335: [GT + 'gta335-1.webp', GT + 'gta335-2.jpg', GT + 'gta335-3.jpg', GT + 'gta335-4.webp'],
    GTA350: [GT + 'gta350-1.webp', GT + 'gta325-2.jpg'],
    GTA375: [GT + 'gta350-1.webp'],
    GTA3100: [GT + 'gta325-1.webp'],
    GTA3150: [GT + 'gta335-1.webp'],
    GTA3200: [GT + 'gta350-1.webp'],
    GTA3250: [GT + 'gta325-1.webp'],
    GTA3300: [GT + 'gta335-1.webp'],
    GTA3350: [GT + 'gta350-1.webp'],
    GTA3400: [GT + 'gta325-1.webp'],
    GTA3450: [GT + 'gta335-1.webp'],
    GTA3500: [GT + 'gta350-1.webp']
  };
  ['GTA325', 'GTA335', 'GTA350', 'GTA375', 'GTA3100', 'GTA3150', 'GTA3200', 'GTA3250', 'GTA3300', 'GTA3350', 'GTA3400', 'GTA3450', 'GTA3500'].forEach(function (code) {
    var m = MODELS.filter(function (x) { return x.model === code; })[0];
    PRODUCTS.push(centralizedProduct(m, centralImgs[code], code === 'GTA325' || code === 'GTA335'));
  });

  (function () {
    var m = MODELS.filter(function (x) { return x.model === 'GTA3800'; })[0];
    var p = centralizedProduct(m, [GT + 'gta350-1.webp'], false);
    p.slug = 'commercial-drainage-grease-trap-gta3800';
    p.sub = 'centralized';
    p.name = { en: 'Commercial Drainage Grease Trap GTA3800', bm: 'Perangkap Minyak Saliran Komersial GTA3800' };
    p.short = { en: '300 GPM, 367 litre, industrial effluent treatment system inlet', bm: '300 GPM, 367 liter, salur masuk sistem rawatan efluen perindustrian' };
    p.intro = {
      en: [
        'The GTA3800 is a long, shallow drain-line interceptor rather than a tank. At 1829 mm long and only 330 mm wide it drops into an existing drain channel, which makes it the practical choice ahead of an industrial effluent treatment system.',
        'It is used where kitchen and process water runs along a surface channel instead of a buried pipe, typically in food factories and central production kitchens.'
      ],
      bm: [
        'GTA3800 ialah pemintas laluan longkang yang panjang dan cetek, bukan tangki. Pada panjang 1829 mm dan lebar hanya 330 mm, ia dimasukkan ke dalam saluran longkang sedia ada, menjadikannya pilihan praktikal sebelum sistem rawatan efluen perindustrian.',
        'Ia digunakan apabila air dapur dan proses mengalir di sepanjang saluran permukaan dan bukan paip tertanam, biasanya di kilang makanan dan dapur pengeluaran berpusat.'
      ]
    };
    p.idealFor = { en: 'Drain channels feeding an industrial effluent treatment system, food factories and central production kitchens.', bm: 'Saluran longkang yang menyalurkan ke sistem rawatan efluen perindustrian, kilang makanan dan dapur pengeluaran berpusat.' };
    PRODUCTS.push(p);
  })();

  PRODUCTS.push({
    slug: 'custom-made-centralized-grease-trap',
    cat: 'grease-trap', sub: 'centralized', model: 'Custom', gpm: 0, litres: 0,
    images: [GT + 'gta335-2.jpg', GT + 'gta335-3.jpg'],
    badges: [BADGE.custom, BADGE.ss304],
    name: { en: 'Custom-Made Centralized Grease Trap', bm: 'Perangkap Minyak Berpusat Tersuai' },
    short: { en: 'Engineered to your site drawings and flow calculation', bm: 'Direka mengikut lukisan tapak dan pengiraan aliran anda' },
    intro: {
      en: ['When a project brief specifies a flow rate, chamber count or footprint that falls between standard models, we fabricate to the engineer\'s drawing.', 'Send the drainage layout and peak flow figure. We return a formal commercial quotation within 1 to 2 business days, or arrange a physical site evaluation anywhere in Malaysia.'],
      bm: ['Apabila taklimat projek menetapkan kadar aliran, bilangan ruang atau tapak yang berada antara model piawai, kami memfabrikasi mengikut lukisan jurutera.', 'Hantar susun atur saliran dan angka aliran puncak. Kami mengembalikan sebut harga komersial rasmi dalam 1 hingga 2 hari bekerja, atau mengaturkan penilaian tapak fizikal di mana-mana di Malaysia.']
    },
    bullets: {
      en: ['Built to consulting engineer specification', 'Chamber count and baffle positions to order', 'Access covers positioned for your service route', '304 stainless steel or reinforced fibreglass', 'Free site evaluation and formal quotation'],
      bm: ['Dibina mengikut spesifikasi jurutera perunding', 'Bilangan ruang dan kedudukan sekatan mengikut pesanan', 'Penutup akses diletakkan mengikut laluan servis anda', 'Keluli tahan karat 304 atau gentian kaca diperkukuh', 'Penilaian tapak percuma dan sebut harga rasmi']
    },
    idealFor: { en: 'Consultant specified projects, shopping mall central kitchens and industrial effluent schemes.', bm: 'Projek yang ditetapkan perunding, dapur berpusat pusat beli-belah dan skim efluen perindustrian.' },
    specs: [
      spec({ en: 'Model', bm: 'Model' }, 'Custom'),
      spec({ en: 'Flow rate', bm: 'Kadar aliran' }, 'To specification'),
      spec({ en: 'Dimensions', bm: 'Dimensi' }, 'To drawing'),
      spec({ en: 'Material', bm: 'Bahan' }, '304 stainless steel or reinforced fibreglass')
    ],
    warranty: WARRANTY_TRAP
  });

  /* --------------------------------------------------------- OIL INTERCEPTOR */
  PRODUCTS.push({
    slug: 'automatic-oil-interceptor',
    cat: 'grease-trap', sub: 'oil-interceptor', model: 'Automatic', gpm: 500, litres: 0,
    images: [GT + 'oil-auto-1.webp', GT + 'oil-auto-2.webp', GT + 'oil-auto-3.webp'],
    video: 'video/oil-interceptor-2.mp4',
    badges: [BADGE.ss304, BADGE.warranty, BADGE.made], featured: true,
    name: { en: 'Automatic Oil Interceptor', bm: 'Pemintas Minyak Automatik' },
    short: { en: '25 GPM to 500 GPM, continuous mechanical oil recovery', bm: '25 GPM hingga 500 GPM, pemulihan minyak mekanikal berterusan' },
    intro: {
      en: [
        'The automatic oil interceptor runs a continuous mechanical skimming cycle across the water surface, lifting separated oil into a recovery drum instead of letting it build into a blanket.',
        'Because the surface is cleared continuously, separation efficiency stays constant between services and the unit does not need to be opened during operating hours.'
      ],
      bm: [
        'Pemintas minyak automatik menjalankan kitaran penyisihan mekanikal berterusan di permukaan air, mengangkat minyak yang dipisahkan ke dalam dram pemulihan dan bukan membiarkannya menjadi lapisan tebal.',
        'Kerana permukaan sentiasa dibersihkan, kecekapan pemisahan kekal malar antara servis dan unit tidak perlu dibuka semasa waktu operasi.'
      ]
    },
    bullets: {
      en: ['Available from 25 GPM through 500 GPM', 'Continuous surface skimming, no manual scooping', 'Recovered oil collected separately for disposal or resale', 'Supports DOE discharge compliance', '304 stainless steel wetted parts'],
      bm: ['Tersedia dari 25 GPM hingga 500 GPM', 'Penyisihan permukaan berterusan, tiada penyaukan manual', 'Minyak yang dipulihkan dikumpulkan berasingan untuk pelupusan atau jualan semula', 'Menyokong pematuhan pelepasan DOE', 'Bahagian basah keluli tahan karat 304']
    },
    idealFor: { en: 'Industrial process water, large workshops, transport depots and any site with a continuous oil load.', bm: 'Air proses perindustrian, bengkel besar, depoh pengangkutan dan mana-mana tapak dengan beban minyak berterusan.' },
    specs: [
      spec({ en: 'Type', bm: 'Jenis' }, 'Automatic skimming oil interceptor'),
      spec({ en: 'Flow rate range', bm: 'Julat kadar aliran' }, '25 GPM to 500 GPM'),
      spec({ en: 'Skimming', bm: 'Penyisihan' }, 'Continuous mechanical belt'),
      spec({ en: 'Material', bm: 'Bahan' }, '304 stainless steel'),
      spec({ en: 'Power supply', bm: 'Bekalan kuasa' }, 'AC 240 V')
    ],
    warranty: WARRANTY_TRAP
  });

  PRODUCTS.push({
    slug: 'oil-interceptor-carwash-workshop-gta03c',
    cat: 'grease-trap', sub: 'oil-interceptor', model: 'GTA03C', gpm: 36, litres: 0,
    images: [GT + 'gta03c-1.webp', GT + 'gta03c-2.webp'],
    badges: [BADGE.ss304, BADGE.warranty], featured: true,
    name: { en: 'Heavy Duty Oil Interceptor GTA03C', bm: 'Pemintas Minyak Tugas Berat GTA03C' },
    short: { en: 'Stainless steel interceptor for car wash bays and workshops', bm: 'Pemintas keluli tahan karat untuk teluk cuci kereta dan bengkel' },
    intro: {
      en: [
        'Car wash and workshop run-off carries engine oil, hydraulic fluid, degreaser and grit rather than food fats. The GTA03C is built for that load, with a sediment chamber ahead of the oil separation stage so abrasive grit settles before it reaches the outlet.',
        'Heavy gauge 304 stainless steel resists the solvents and detergents used in vehicle bays, where mild steel and plastic units fail early.'
      ],
      bm: [
        'Air larian cuci kereta dan bengkel membawa minyak enjin, bendalir hidraulik, penyahgris dan kelikir, bukan lemak makanan. GTA03C dibina untuk beban tersebut, dengan ruang mendapan sebelum peringkat pemisahan minyak supaya kelikir kasar mendap sebelum sampai ke salur keluar.',
        'Keluli tahan karat 304 tebal menahan pelarut dan detergen yang digunakan di teluk kenderaan, di mana unit keluli lembut dan plastik cepat rosak.'
      ]
    },
    bullets: {
      en: ['Sediment chamber ahead of oil separation', 'Resists degreasers, solvents and vehicle detergents', 'Heavy gauge 304 stainless steel throughout', 'Removable grit basket for routine clearing', 'Supports DOE discharge requirements for vehicle premises'],
      bm: ['Ruang mendapan sebelum pemisahan minyak', 'Menahan penyahgris, pelarut dan detergen kenderaan', 'Keluli tahan karat 304 tebal sepenuhnya', 'Bakul kelikir boleh tanggal untuk pembersihan rutin', 'Menyokong keperluan pelepasan DOE bagi premis kenderaan']
    },
    idealFor: { en: 'Car wash bays, vehicle workshops, service centres and machinery washdown areas.', bm: 'Teluk cuci kereta, bengkel kenderaan, pusat servis dan kawasan pencucian jentera.' },
    specs: [
      spec({ en: 'Model', bm: 'Model' }, 'GTA03C'),
      spec({ en: 'Flow rate', bm: 'Kadar aliran' }, '36 GPM'),
      spec({ en: 'Chambers', bm: 'Ruang' }, 'Sediment plus oil separation'),
      spec({ en: 'Material', bm: 'Bahan' }, '304 stainless steel, heavy gauge'),
      spec({ en: 'Application', bm: 'Aplikasi' }, 'Car wash, workshop, service centre')
    ],
    warranty: WARRANTY_TRAP
  });

  PRODUCTS.push({
    slug: 'oil-interceptor-petrol-station-gta9001',
    cat: 'grease-trap', sub: 'oil-interceptor', model: 'GTA9001', gpm: 500, litres: 680,
    images: [GT + 'oil-auto-1.webp'],
    badges: [BADGE.ss304, BADGE.warranty],
    name: { en: 'Oil Interceptor GTA9001, Petrol Station', bm: 'Pemintas Minyak GTA9001, Stesen Minyak' },
    short: { en: '500 GPM, 680 litre capacity, forecourt drainage', bm: '500 GPM, kapasiti 680 liter, saliran kawasan pam' },
    intro: {
      en: ['The GTA9001 handles forecourt drainage at petrol stations, where rain run-off carries fuel residue, oil and road grit straight into the public drain if it is not intercepted.', 'At 680 litres it absorbs the surge of a heavy tropical downpour without losing separation efficiency.'],
      bm: ['GTA9001 mengendalikan saliran kawasan pam di stesen minyak, di mana air larian hujan membawa sisa bahan api, minyak dan kelikir jalan terus ke longkang awam jika tidak dipintas.', 'Pada 680 liter ia menyerap lonjakan hujan lebat tropika tanpa kehilangan kecekapan pemisahan.']
    },
    bullets: {
      en: ['Sized for petrol station forecourt run-off', '680 litre capacity absorbs storm surge', 'Separates fuel residue, oil and road grit', '304 stainless steel construction', 'Supports DOE discharge compliance'],
      bm: ['Disaiz untuk air larian kawasan pam stesen minyak', 'Kapasiti 680 liter menyerap lonjakan hujan', 'Memisahkan sisa bahan api, minyak dan kelikir jalan', 'Binaan keluli tahan karat 304', 'Menyokong pematuhan pelepasan DOE']
    },
    idealFor: { en: 'Petrol station forecourts, fuel depots and vehicle parking decks.', bm: 'Kawasan pam stesen minyak, depoh bahan api dan dek letak kenderaan.' },
    specs: [
      spec({ en: 'Model', bm: 'Model' }, 'GTA9001'),
      spec({ en: 'Flow rate', bm: 'Kadar aliran' }, '500 GPM'),
      spec({ en: 'Capacity', bm: 'Kapasiti' }, '680 litres'),
      spec({ en: 'Material', bm: 'Bahan' }, '304 stainless steel')
    ],
    warranty: WARRANTY_TRAP
  });

  PRODUCTS.push({
    slug: 'oil-interceptor-petrol-station-gta9002',
    cat: 'grease-trap', sub: 'oil-interceptor', model: 'GTA9002', gpm: 700, litres: 1360,
    images: [GT + 'oil-auto-2.webp'],
    badges: [BADGE.ss304, BADGE.warranty],
    name: { en: 'Oil Interceptor GTA9002, Petrol Station', bm: 'Pemintas Minyak GTA9002, Stesen Minyak' },
    short: { en: '700 GPM, 1360 litre capacity, high traffic forecourts', bm: '700 GPM, kapasiti 1360 liter, kawasan pam trafik tinggi' },
    intro: {
      en: ['The GTA9002 doubles the capacity of the GTA9001 for high traffic forecourts, truck stops and sites with a large paved catchment feeding a single drainage point.', 'The larger chamber volume gives a longer retention time, which raises separation efficiency during peak run-off.'],
      bm: ['GTA9002 menggandakan kapasiti GTA9001 untuk kawasan pam trafik tinggi, hentian trak dan tapak dengan kawasan tadahan berturap besar yang menyalurkan ke satu titik saliran.', 'Isi padu ruang yang lebih besar memberikan masa penahanan lebih lama, yang meningkatkan kecekapan pemisahan semasa air larian puncak.']
    },
    bullets: {
      en: ['700 GPM peak flow handling', '1360 litre capacity for large paved catchments', 'Longer retention time raises separation efficiency', '304 stainless steel construction', 'Supports DOE discharge compliance'],
      bm: ['Pengendalian aliran puncak 700 GPM', 'Kapasiti 1360 liter untuk kawasan tadahan berturap besar', 'Masa penahanan lebih lama meningkatkan kecekapan pemisahan', 'Binaan keluli tahan karat 304', 'Menyokong pematuhan pelepasan DOE']
    },
    idealFor: { en: 'High traffic petrol stations, truck stops, logistics yards and large parking decks.', bm: 'Stesen minyak trafik tinggi, hentian trak, laman logistik dan dek letak kereta besar.' },
    specs: [
      spec({ en: 'Model', bm: 'Model' }, 'GTA9002'),
      spec({ en: 'Flow rate', bm: 'Kadar aliran' }, '700 GPM'),
      spec({ en: 'Capacity', bm: 'Kapasiti' }, '1360 litres'),
      spec({ en: 'Material', bm: 'Bahan' }, '304 stainless steel')
    ],
    warranty: WARRANTY_TRAP
  });

  /* ---------------------------------------------------------- AUTO DOSING */
  PRODUCTS.push({
    slug: 'auto-dosing-unit-adu9291p',
    cat: 'auto-dosing', sub: 'unit', model: 'ADU9291P', gpm: 0, litres: 0,
    images: [GT + 'adu9291p-1.webp', GT + 'adu9291p-2.webp', GT + 'adu9291p-3.webp', GT + 'adu9291p-4.webp'],
    video: 'video/adu-installation.mp4',
    badges: [BADGE.lifetime, BADGE.made], featured: true, hero: true,
    name: { en: 'Auto Dosing Unit ADU9291P', bm: 'Unit Dos Automatik ADU9291P' },
    short: { en: 'Malaysia’s first Auto Dosing Unit with a lifetime replacement warranty', bm: 'Unit Dos Automatik pertama Malaysia dengan waranti penggantian seumur hidup' },
    intro: {
      en: [
        'The ADU9291P is a fully automated dosing system engineered to dispense bio-enzymes directly into the grease trap. By delivering precise doses at pre-programmed intervals, the unit continuously breaks down fats, oils, grease and organic waste before they accumulate.',
        'This automated process helps prevent drain blockages, eliminates unpleasant odours, improves wastewater flow, and removes the need for manual treatment. It is a reliable, cost-effective solution for restaurants, hotels, commercial kitchens, food processing facilities and industrial applications seeking long-term drainage protection.'
      ],
      bm: [
        'ADU9291P ialah sistem dos automatik sepenuhnya yang direka untuk menyalurkan bio-enzim terus ke dalam perangkap minyak. Dengan menyampaikan dos tepat pada selang masa yang telah diprogramkan, unit ini memecahkan lemak, minyak, gris dan sisa organik secara berterusan sebelum ia terkumpul.',
        'Proses automatik ini membantu menghalang penyumbatan longkang, menghapuskan bau tidak menyenangkan, memperbaiki aliran air sisa, dan menghapuskan keperluan rawatan manual. Ia adalah penyelesaian yang boleh diharap dan menjimatkan untuk restoran, hotel, dapur komersial, kemudahan pemprosesan makanan dan aplikasi perindustrian yang memerlukan perlindungan saliran jangka panjang.'
      ]
    },
    bullets: {
      en: [
        'Dual-layer power redundancy: primary AC supply with an integrated 8-cell AA emergency battery vault',
        'Protects the internal mechanism from thunderstorm surges and keeps dosing on schedule during a blackout',
        'Unattended enzymatic dispersal via a 24-hour real-time digital controller',
        'Precise flow calibration handled automatically after hours, with no daily workforce intervention',
        'Robust moisture-resistant industrial housing for humid commercial dishwashing zones'
      ],
      bm: [
        'Kuasa dua lapisan: bekalan AC utama dengan lapan sel bateri AA kecemasan bersepadu',
        'Melindungi mekanisme dalaman daripada lonjakan ribut petir dan mengekalkan jadual dos semasa gangguan bekalan',
        'Penyebaran enzim tanpa pengawasan melalui pengawal digital masa nyata 24 jam',
        'Penentukuran aliran tepat dikendalikan automatik selepas waktu operasi, tanpa campur tangan pekerja harian',
        'Perumah industri tahan lembapan yang kukuh untuk zon pencucian pinggan mangkuk komersial yang lembap'
      ]
    },
    idealFor: { en: 'Restaurants, food courts, hotels, hospital kitchens and high-volume commercial dining operations prone to severe grease pipe buildup.', bm: 'Restoran, medan selera, hotel, dapur hospital dan operasi hidangan komersial jumlah tinggi yang terdedah kepada pengumpulan gris teruk dalam paip.' },
    specs: [
      spec({ en: 'Model', bm: 'Model' }, 'ADU9291P'),
      spec({ en: 'Dimensions', bm: 'Dimensi' }, '30 (L) x 25 (W) x 25 (H) cm'),
      spec({ en: 'Power supply', bm: 'Bekalan kuasa' }, 'AC/DC 12 V 3A, Malaysia 3-pin plug included'),
      spec({ en: 'Power mode', bm: 'Mod kuasa' }, 'Dual mode: AC plug plus 8 x AA battery backup'),
      spec({ en: 'Timer', bm: 'Pemasa' }, '24-hour digital real-time timer'),
      spec({ en: 'Pump system', bm: 'Sistem pam' }, 'Single pump with voltage drop compensation'),
      spec({ en: 'Power consumption', bm: 'Penggunaan kuasa' }, '7.5 watts'),
      spec({ en: 'Full kit inclusions', bm: 'Kandungan kit penuh' }, '1 x ADU9291P unit, 1 x 5 litre biodispersant enzyme, accessories pack')
    ],
    warranty: {
      en: [
        '1-to-1 replacement warranty: 1 year factory warranty plus a lifetime ADU replacement warranty, on a one-to-one exchange basis. Terms and conditions apply.',
        'Local factory support. Made in Malaysia.',
        'Guaranteed 7-day shipping to any Malaysian destination.'
      ],
      bm: [
        'Waranti penggantian satu dengan satu: waranti kilang 1 tahun serta waranti penggantian ADU seumur hidup, secara pertukaran satu dengan satu. Terma dan syarat dikenakan.',
        'Sokongan kilang tempatan. Buatan Malaysia.',
        'Penghantaran terjamin dalam 7 hari ke mana-mana destinasi di Malaysia.'
      ]
    }
  });

  PRODUCTS.push({
    slug: 'free-auto-dosing-unit-bundle',
    cat: 'auto-dosing', sub: 'offer', model: 'ADU9291P bundle', gpm: 0, litres: 0,
    images: [GT + 'adu-bundle-1.webp', GT + 'adu9291p-2.webp'],
    badges: [BADGE.lifetime, BADGE.made], featured: true,
    name: { en: 'Free Auto Dosing Unit with 12 bottles of Bio-Enzyme', bm: 'Unit Dos Automatik Percuma dengan 12 botol Bio-Enzim' },
    short: { en: 'Commit to a year of enzyme supply, the dosing hardware comes free', bm: 'Komited kepada bekalan enzim setahun, perkakasan dos diberikan percuma' },
    intro: {
      en: [
        'Most kitchens already buy bio-enzyme every month. This bundle converts that recurring spend into a full automated dosing installation at no hardware cost.',
        'Order 12 x 5 litre bottles of GoodBac Grease Trap Bio-Enzyme, roughly a year of supply for a mid-sized kitchen, and the ADU9291P Auto Dosing Unit is supplied free with the same lifetime replacement warranty as a purchased unit.'
      ],
      bm: [
        'Kebanyakan dapur sudah membeli bio-enzim setiap bulan. Pakej ini menukar perbelanjaan berulang itu kepada pemasangan dos automatik penuh tanpa kos perkakasan.',
        'Pesan 12 x botol 5 liter Bio-Enzim Perangkap Minyak GoodBac, lebih kurang bekalan setahun untuk dapur bersaiz sederhana, dan Unit Dos Automatik ADU9291P dibekalkan percuma dengan waranti penggantian seumur hidup yang sama seperti unit yang dibeli.'
      ]
    },
    bullets: {
      en: ['ADU9291P dosing unit supplied at no charge', '12 x 5 litre GoodBac Bio-Enzyme included', 'Approximately one year of supply for a mid-sized kitchen', 'Same lifetime one-to-one replacement warranty on the unit', 'Installation guidance included'],
      bm: ['Unit dos ADU9291P dibekalkan tanpa caj', '12 x 5 liter Bio-Enzim GoodBac disertakan', 'Lebih kurang bekalan setahun untuk dapur bersaiz sederhana', 'Waranti penggantian satu dengan satu seumur hidup yang sama pada unit', 'Panduan pemasangan disertakan']
    },
    idealFor: { en: 'Operators already buying enzyme monthly who want automated dosing without a capital purchase.', bm: 'Pengendali yang sudah membeli enzim setiap bulan dan mahukan dos automatik tanpa pembelian modal.' },
    specs: [
      spec({ en: 'Bundle contents', bm: 'Kandungan pakej' }, '1 x ADU9291P, 12 x 5 litre GoodBac Bio-Enzyme'),
      spec({ en: 'Unit warranty', bm: 'Waranti unit' }, 'Lifetime one-to-one replacement'),
      spec({ en: 'Supply period', bm: 'Tempoh bekalan' }, 'Approximately 12 months, mid-sized kitchen')
    ],
    warranty: {
      en: ['The dosing unit in this bundle carries the same 1 year factory warranty and lifetime one-to-one replacement warranty as a purchased ADU9291P. Terms and conditions apply.'],
      bm: ['Unit dos dalam pakej ini disertakan waranti kilang 1 tahun dan waranti penggantian satu dengan satu seumur hidup yang sama seperti ADU9291P yang dibeli. Terma dan syarat dikenakan.']
    }
  });

  PRODUCTS.push({
    slug: 'free-grease-management-demo',
    cat: 'auto-dosing', sub: 'offer', model: 'Site demo', gpm: 0, litres: 0,
    images: [GT + 'adu-demo-1.webp'],
    badges: [], featured: false,
    name: { en: 'Free grease management presentation and product demo', bm: 'Pembentangan pengurusan gris dan demo produk percuma' },
    short: { en: 'We come to your kitchen, assess the drainage, and leave a sample', bm: 'Kami datang ke dapur anda, menilai saliran, dan meninggalkan sampel' },
    intro: {
      en: [
        'Book a session and our technical team visits your premises to walk the drainage line, inspect the existing trap, and show how automated dosing changes the maintenance cycle.',
        'You receive a written recommendation covering the correct trap model for your meal volume, the matching enzyme dose, and a bio-enzyme sample to trial before committing.'
      ],
      bm: [
        'Tempah sesi dan pasukan teknikal kami akan melawat premis anda untuk menyusuri laluan saliran, memeriksa perangkap sedia ada, dan menunjukkan bagaimana dos automatik mengubah kitaran penyelenggaraan.',
        'Anda menerima cadangan bertulis merangkumi model perangkap yang betul untuk jumlah hidangan anda, dos enzim yang sepadan, dan sampel bio-enzim untuk dicuba sebelum membuat komitmen.'
      ]
    },
    bullets: {
      en: ['On-site drainage walkthrough at no charge', 'Written model and dosing recommendation', 'Free bio-enzyme trial sample', 'Live demonstration of the dosing unit', 'Available across Peninsular Malaysia'],
      bm: ['Tinjauan saliran di tapak tanpa caj', 'Cadangan model dan dos secara bertulis', 'Sampel percubaan bio-enzim percuma', 'Demonstrasi langsung unit dos', 'Tersedia di seluruh Semenanjung Malaysia']
    },
    idealFor: { en: 'Operators comparing suppliers, and consultants specifying grease management for a new build.', bm: 'Pengendali yang membandingkan pembekal, dan perunding yang menetapkan pengurusan gris untuk pembinaan baharu.' },
    specs: [
      spec({ en: 'Format', bm: 'Format' }, 'On-site visit and demonstration'),
      spec({ en: 'Cost', bm: 'Kos' }, 'No charge'),
      spec({ en: 'Coverage', bm: 'Liputan' }, 'Peninsular Malaysia'),
      spec({ en: 'Includes', bm: 'Termasuk' }, 'Written recommendation and enzyme sample')
    ],
    warranty: { en: [], bm: [] }
  });

  /* ------------------------------------------------------------ BIO-ENZYME */
  var enzymeIntro = {
    en: [
      'GoodBac Grease Trap Bio-Enzyme is a highly concentrated blend of natural microorganisms, developed on an advanced UK formulation and engineered to liquefy hard-to-digest organic waste before it causes a costly plumbing emergency.',
      'The biodispersant targets and converts heavy fats, oils and grease, along with cellulose, proteins and hydrocarbons, into harmless natural carbon dioxide and water.'
    ],
    bm: [
      'Bio-Enzim Perangkap Minyak GoodBac ialah campuran mikroorganisma semula jadi yang sangat pekat, dibangunkan berdasarkan formulasi termaju United Kingdom dan direka untuk mencairkan sisa organik yang sukar dihadam sebelum ia menyebabkan kecemasan paip yang mahal.',
      'Biodispersan ini menyasarkan dan menukarkan lemak, minyak dan gris berat, bersama selulosa, protein dan hidrokarbon, kepada karbon dioksida dan air semula jadi yang tidak berbahaya.'
    ]
  };
  var enzymeBullets = {
    en: [
      '95 percent odour eradication: active bacterial cultures suppress hydrogen sulfide and stagnant organic odours at the source',
      'FOG anti-freezing shield: prevents grease from freezing, solidifying or forming thick crusts inside interceptors',
      'Drastic cleanout cycle extension: field testing shows a large reduction in solid grease blankets',
      '100 percent non-corrosive line safety: formulated at a neutral pH of 6.5, safe for PVC pipes, stainless steel traps and welds',
      'Eco-friendly: free from harsh phosphate contamination, non-caustic and non-pathogenic'
    ],
    bm: [
      'Penghapusan bau 95 peratus: kultur bakteria aktif menahan hidrogen sulfida dan bau organik bertakung di puncanya',
      'Perisai anti-beku FOG: menghalang gris daripada membeku, memejal atau membentuk kerak tebal di dalam pemintas',
      'Lanjutan kitaran pembersihan yang ketara: ujian lapangan menunjukkan pengurangan besar lapisan gris pepejal',
      'Keselamatan paip 100 peratus tanpa hakisan: diformulasi pada pH neutral 6.5, selamat untuk paip PVC, perangkap keluli tahan karat dan kimpalan',
      'Mesra alam: bebas daripada pencemaran fosfat keras, tidak kaustik dan tidak patogenik'
    ]
  };
  var enzymeWarranty = {
    en: ['Store in a cool, dry place. Shelf life 24 months from the date of manufacture in an unopened container.'],
    bm: ['Simpan di tempat sejuk dan kering. Jangka hayat 24 bulan dari tarikh pembuatan dalam bekas yang belum dibuka.']
  };

  [
    { slug: 'goodbac-bio-enzyme-500ml', size: '500 ml', img: 'goodbac-500ml.webp', use: { en: 'Touch-up spray for drains, floor traps and small pantry sinks.', bm: 'Semburan penyegar untuk longkang, perangkap lantai dan sinki pantri kecil.' } },
    { slug: 'goodbac-bio-enzyme-1-liter', size: '1 litre', img: 'goodbac-1l.webp', use: { en: 'Manual monthly dosing for a single undersink trap.', bm: 'Dos bulanan manual untuk satu perangkap bawah sinki.' } },
    { slug: 'goodbac-bio-enzyme-5-liter', size: '5 litre', img: 'goodbac-5l.webp', use: { en: 'Standard refill for an Auto Dosing Unit reservoir.', bm: 'Isian semula piawai untuk takungan Unit Dos Automatik.' }, featured: true },
    { slug: 'goodbac-bio-enzyme-5-liter-x4', size: '5 litre x 4 bottles', img: 'goodbac-5l-x4.webp', use: { en: 'Bulk carton for multi-outlet operators and centralized kitchens.', bm: 'Karton pukal untuk pengendali berbilang cawangan dan dapur berpusat.' }, featured: true }
  ].forEach(function (v) {
    PRODUCTS.push({
      slug: v.slug, cat: 'bio-enzyme', sub: 'enzyme', model: 'GoodBac', gpm: 0, litres: 0,
      images: [GT + v.img], badges: [BADGE.made], featured: !!v.featured,
      name: { en: 'GoodBac Grease Trap Bio-Enzyme ' + v.size, bm: 'Bio-Enzim Perangkap Minyak GoodBac ' + v.size },
      short: v.use,
      intro: enzymeIntro, bullets: enzymeBullets, idealFor: v.use,
      specs: [
        spec({ en: 'Pack size', bm: 'Saiz pek' }, v.size),
        spec({ en: 'Formulation', bm: 'Formulasi' }, 'Concentrated liquid bacterial culture'),
        spec({ en: 'pH', bm: 'pH' }, '6.5, neutral'),
        spec({ en: 'Targets', bm: 'Sasaran' }, 'Fats, oils, grease, cellulose, proteins, hydrocarbons'),
        spec({ en: 'Safe on', bm: 'Selamat untuk' }, 'PVC pipe, stainless steel, welded joints'),
        spec({ en: 'Storage', bm: 'Penyimpanan' }, 'Cool, dry place')
      ],
      warranty: enzymeWarranty
    });
  });

  /* ---------------------------------------------------------------- OTHERS */
  PRODUCTS.push({
    slug: 'auto-dosing-lockable-cabinet',
    cat: 'others', sub: 'accessory', model: 'ADU cabinet', gpm: 0, litres: 0,
    images: [GT + 'adu-cabinet-1.webp', GT + 'adu-cabinet-2.webp', GT + 'adu-cabinet-3.webp', GT + 'adu-cabinet-4.webp', GT + 'adu-cabinet-5.webp'],
    badges: [BADGE.ss304], featured: true,
    name: { en: 'Auto Dosing Lockable Cabinet', bm: 'Kabinet Berkunci Unit Dos Automatik' },
    short: { en: 'Stainless steel enclosure that houses the unit and the 5 litre enzyme', bm: 'Kandang keluli tahan karat yang menempatkan unit dan enzim 5 liter' },
    intro: {
      en: [
        'The lockable cabinet mounts the ADU9291P and its 5 litre enzyme container inside one stainless steel enclosure, keeping the pump, tubing and chemical out of reach of kitchen staff and away from wash-down water.',
        'It matters most in shared premises, food courts and school canteens where the dosing unit sits in a common area and tampering or accidental disconnection is a real risk.'
      ],
      bm: [
        'Kabinet berkunci ini memasang ADU9291P dan bekas enzim 5 liternya di dalam satu kandang keluli tahan karat, menjauhkan pam, tiub dan bahan kimia daripada kakitangan dapur serta air pencucian.',
        'Ia paling penting di premis berkongsi, medan selera dan kantin sekolah di mana unit dos berada di kawasan umum dan risiko gangguan atau pemutusan sambungan tidak sengaja adalah nyata.'
      ]
    },
    bullets: {
      en: ['Houses the dosing unit and a 5 litre enzyme container together', 'Keyed lock prevents tampering and accidental disconnection', 'Stainless steel body suits wet kitchen environments', 'Wall mounted, keeps floor space clear', 'Supplied with a free 5 litre GoodBac Bio-Enzyme'],
      bm: ['Menempatkan unit dos dan bekas enzim 5 liter bersama', 'Kunci berkekunci menghalang gangguan dan pemutusan tidak sengaja', 'Badan keluli tahan karat sesuai untuk persekitaran dapur basah', 'Dipasang pada dinding, mengekalkan ruang lantai kosong', 'Dibekalkan dengan Bio-Enzim GoodBac 5 liter percuma']
    },
    idealFor: { en: 'Food courts, school canteens, shared kitchens and any location where the unit is publicly accessible.', bm: 'Medan selera, kantin sekolah, dapur berkongsi dan mana-mana lokasi yang unitnya boleh diakses umum.' },
    specs: [
      spec({ en: 'Dimensions', bm: 'Dimensi' }, '280 (W) x 210 (D) x 610 (H) mm'),
      spec({ en: 'Material', bm: 'Bahan' }, 'ADU stainless steel lockable cabinet'),
      spec({ en: 'Houses', bm: 'Menempatkan' }, 'ADU9291P plus 5 litre enzyme container'),
      spec({ en: 'Mounting', bm: 'Pemasangan' }, 'Wall mounted'),
      spec({ en: 'Included', bm: 'Disertakan' }, 'Free 5 litre GoodBac Grease Trap Bio-Enzyme')
    ],
    warranty: { en: ['1 year factory warranty on the cabinet and lock assembly.'], bm: ['Waranti kilang 1 tahun bagi kabinet dan pemasangan kunci.'] }
  });

  PRODUCTS.push({
    slug: 'auto-dosing-unit-hanging-panel',
    cat: 'others', sub: 'accessory', model: 'ADU panel', gpm: 0, litres: 0,
    images: [GT + 'adu-panel-1.webp'],
    badges: [BADGE.ss304],
    name: { en: 'Auto Dosing Unit Hanging Panel', bm: 'Panel Gantung Unit Dos Automatik' },
    short: { en: 'Open wall panel for kitchens where the unit stays visible', bm: 'Panel dinding terbuka untuk dapur yang unitnya kekal kelihatan' },
    intro: {
      en: [
        'The hanging panel mounts the dosing unit and enzyme container on an open stainless steel backplate rather than inside a locked box, so levels can be checked at a glance during a walk-through.',
        'It is the practical choice in a controlled back-of-house area where access is already restricted and a supervisor wants to see the enzyme level without opening anything.'
      ],
      bm: [
        'Panel gantung memasang unit dos dan bekas enzim pada plat belakang keluli tahan karat terbuka dan bukan di dalam kotak berkunci, jadi paras enzim boleh disemak sekali pandang semasa tinjauan.',
        'Ia pilihan praktikal di kawasan belakang yang terkawal, di mana akses sudah terhad dan penyelia mahu melihat paras enzim tanpa membuka apa-apa.'
      ]
    },
    bullets: {
      en: ['Open backplate, enzyme level visible at a glance', 'Faster bottle changes than a cabinet', 'Stainless steel construction', 'Wall mounted, keeps floor space clear', 'Supplied with a free 5 litre GoodBac Bio-Enzyme'],
      bm: ['Plat belakang terbuka, paras enzim kelihatan sekali pandang', 'Penukaran botol lebih pantas berbanding kabinet', 'Binaan keluli tahan karat', 'Dipasang pada dinding, mengekalkan ruang lantai kosong', 'Dibekalkan dengan Bio-Enzim GoodBac 5 liter percuma']
    },
    idealFor: { en: 'Controlled back-of-house areas, central kitchens and plant rooms.', bm: 'Kawasan belakang terkawal, dapur berpusat dan bilik loji.' },
    specs: [
      spec({ en: 'Dimensions', bm: 'Dimensi' }, '280 (W) x 210 (D) x 610 (H) mm'),
      spec({ en: 'Material', bm: 'Bahan' }, 'ADU stainless steel hanging panel'),
      spec({ en: 'Mounting', bm: 'Pemasangan' }, 'Wall mounted, open backplate'),
      spec({ en: 'Included', bm: 'Disertakan' }, 'Free 5 litre GoodBac Grease Trap Bio-Enzyme')
    ],
    warranty: { en: ['1 year factory warranty on the panel assembly.'], bm: ['Waranti kilang 1 tahun bagi pemasangan panel.'] }
  });

  PRODUCTS.push({
    slug: 'goodbac-bio-brick',
    cat: 'others', sub: 'consumable', model: 'Bio Brick', gpm: 0, litres: 0,
    images: [GT + 'bio-brick-1.webp'],
    badges: [BADGE.made], featured: true,
    name: { en: 'GoodBac Bio Brick', bm: 'Bio Brick GoodBac' },
    short: { en: '1 kg slow-release enzyme block for traps without a dosing unit', bm: 'Blok enzim lepasan perlahan 1 kg untuk perangkap tanpa unit dos' },
    intro: {
      en: [
        'The Bio Brick is a 1 kg solid enzyme block in a mesh bag, suspended inside the grease trap. Every flush of warm wastewater dissolves a small amount of culture, giving a steady low dose without any pump, timer or power supply.',
        'It suits premises where an Auto Dosing Unit cannot be installed, and remote sites where nobody is available to pour a liquid dose each night.'
      ],
      bm: [
        'Bio Brick ialah blok enzim pepejal 1 kg dalam beg jaring, digantung di dalam perangkap minyak. Setiap aliran air sisa suam melarutkan sedikit kultur, memberikan dos rendah yang stabil tanpa sebarang pam, pemasa atau bekalan kuasa.',
        'Ia sesuai untuk premis yang tidak boleh memasang Unit Dos Automatik, dan tapak terpencil yang tiada sesiapa untuk menuang dos cecair setiap malam.'
      ]
    },
    bullets: {
      en: ['No pump, timer or power supply needed', 'Slow release over several weeks', 'Same bacterial culture as the liquid enzyme', 'Neutral pH, safe on PVC and stainless steel', 'Suspended in a mesh bag, removed in seconds'],
      bm: ['Tiada pam, pemasa atau bekalan kuasa diperlukan', 'Lepasan perlahan selama beberapa minggu', 'Kultur bakteria sama seperti enzim cecair', 'pH neutral, selamat untuk PVC dan keluli tahan karat', 'Digantung dalam beg jaring, boleh ditanggalkan dalam beberapa saat']
    },
    idealFor: { en: 'Premises without power at the trap, remote sites and low-volume kitchens.', bm: 'Premis tanpa bekalan kuasa di perangkap, tapak terpencil dan dapur jumlah rendah.' },
    specs: [
      spec({ en: 'Weight', bm: 'Berat' }, '1 kg'),
      spec({ en: 'Form', bm: 'Bentuk' }, 'Solid slow-release block in mesh bag'),
      spec({ en: 'pH', bm: 'pH' }, '6.5, neutral'),
      spec({ en: 'Power required', bm: 'Kuasa diperlukan' }, 'None'),
      spec({ en: 'Storage', bm: 'Penyimpanan' }, 'Cool, dry place')
    ],
    warranty: enzymeWarranty
  });

  PRODUCTS.push({
    slug: 'water-leaking-sensor-system-gta03wlss',
    cat: 'others', sub: 'monitoring', model: 'GTA03WLSS', gpm: 0, litres: 0,
    images: [GT + 'gta03wlss-1.webp'],
    badges: [BADGE.made], featured: true,
    name: { en: 'Water Leaking Sensor System GTA03WLSS', bm: 'Sistem Sensor Kebocoran Air GTA03WLSS' },
    short: { en: 'Detects an overflowing trap before it floods the kitchen floor', bm: 'Mengesan perangkap melimpah sebelum ia membanjiri lantai dapur' },
    intro: {
      en: [
        'The GTA03WLSS watches for water where there should not be any. A one metre electrode cable sits at the point of risk, and when water bridges the electrodes the controller raises an audible and visual alarm.',
        'A blocked grease trap usually announces itself as a flooded kitchen floor discovered the next morning. This system moves that discovery forward by hours, which is the difference between a mop and a closed kitchen.'
      ],
      bm: [
        'GTA03WLSS memantau kehadiran air di tempat yang sepatutnya kering. Kabel elektrod satu meter diletakkan di titik berisiko, dan apabila air merapatkan elektrod, pengawal membunyikan penggera bunyi dan lampu.',
        'Perangkap minyak tersumbat biasanya diketahui apabila lantai dapur ditemui banjir keesokan pagi. Sistem ini memajukan penemuan itu beberapa jam lebih awal, dan itulah perbezaan antara mengemop dan menutup dapur.'
      ]
    },
    bullets: {
      en: [
        'Detects water, wastewater, well water, river water and seawater',
        'Detection sensitivity above 200 kilo-ohm, one-touch detachable electrode cable',
        'One metre electrode cable, extendable using 0.3 mm squared cable up to 100 metres',
        'Optional 4000 mAh lithium battery with UPS control board for automatic charging and discharging',
        'Three core cable output: yellow live, red live closed, blue live open, connected to a power saving electric bell valve'
      ],
      bm: [
        'Mengesan air, air sisa, air perigi, air sungai dan air laut',
        'Kepekaan pengesanan melebihi 200 kilo-ohm, kabel elektrod boleh tanggal satu sentuhan',
        'Kabel elektrod satu meter, boleh dipanjangkan menggunakan kabel 0.3 mm persegi sehingga 100 meter',
        'Bateri litium 4000 mAh pilihan dengan papan kawalan UPS untuk pengecasan dan penyahcasan automatik',
        'Output kabel tiga teras: kuning hidup, merah hidup tertutup, biru hidup terbuka, disambung kepada injap loceng elektrik jimat kuasa'
      ]
    },
    idealFor: { en: 'Basement kitchens, unattended plant rooms, cold rooms and any trap that overflows onto a finished floor.', bm: 'Dapur bawah tanah, bilik loji tanpa pengawasan, bilik sejuk dan mana-mana perangkap yang melimpah ke lantai siap.' },
    specs: [
      spec({ en: 'Model', bm: 'Model' }, 'GTA03WLSS'),
      spec({ en: 'Power supply', bm: 'Bekalan kuasa' }, 'AC 220 V'),
      spec({ en: 'Detection sensitivity', bm: 'Kepekaan pengesanan' }, 'Above 200 kilo-ohm'),
      spec({ en: 'Detectable water types', bm: 'Jenis air boleh dikesan' }, 'Tap, wastewater, well, river, seawater'),
      spec({ en: 'Electrode cable', bm: 'Kabel elektrod' }, '1 metre, extendable to 100 metres'),
      spec({ en: 'Battery, optional', bm: 'Bateri, pilihan' }, '4000 mAh lithium with UPS control board'),
      spec({ en: 'Alarm output', bm: 'Output penggera' }, 'Sound and light alarm')
    ],
    warranty: { en: ['1 year factory warranty on the controller and electrode assembly.'], bm: ['Waranti kilang 1 tahun bagi pengawal dan pemasangan elektrod.'] }
  });

  /* -------------------------------------------------------------- SERVICES */
  var SERVICES = [
    {
      slug: 'grease-trap-cleaning-maintenance',
      fit: 'cover',
      img: 'products/gta325-2.jpg',
      images: ['products/gta325-2.jpg', 'products/gta335-2.jpg', 'service/sewerage-2.webp'],
      icon: 'ph-drop',
      name: { en: 'Grease Trap Cleaning & Maintenance', bm: 'Pembersihan & Penyelenggaraan Perangkap Minyak' },
      short: { en: 'Scheduled pump-out, chamber wash and waste removal', bm: 'Pengepaman berjadual, cucian ruang dan pembuangan sisa' },
      intro: {
        en: [
          'Before our service team arrives to pump grease, your kitchen staff should already be clearing the screen basket every day. If the basket is left, the trap stops functioning and starts to smell, no matter how recently the chambers were pumped.',
          'Our team handles the part your staff cannot: full chamber pump-out, wall and baffle wash-down, inspection of the inlet and outlet, and removal of the collected waste under proper documentation.'
        ],
        bm: [
          'Sebelum pasukan servis kami tiba untuk mengepam gris, kakitangan dapur anda sepatutnya sudah membersihkan bakul penapis setiap hari. Jika bakul dibiarkan, perangkap berhenti berfungsi dan mula berbau, walau seberapa baharu pun ruang itu dipam.',
          'Pasukan kami mengendalikan bahagian yang tidak dapat dilakukan kakitangan anda: pengepaman ruang sepenuhnya, cucian dinding dan sekatan, pemeriksaan salur masuk dan keluar, serta pembuangan sisa yang dikumpulkan dengan dokumentasi yang lengkap.'
        ]
      },
      benefits: {
        en: ['Full chamber pump-out using a vacuum tanker', 'Wall, baffle and basket wash-down', 'Inlet and outlet inspection with a written condition note', 'Waste removed and documented for your compliance file', 'Service intervals set against your model capacity and meal volume'],
        bm: ['Pengepaman ruang penuh menggunakan tangki vakum', 'Cucian dinding, sekatan dan bakul', 'Pemeriksaan salur masuk dan keluar dengan nota keadaan bertulis', 'Sisa dibuang dan didokumenkan untuk fail pematuhan anda', 'Selang servis ditetapkan mengikut kapasiti model dan jumlah hidangan anda']
      },
      why: {
        en: ['Service line covering Perak, Selangor, Penang, Melaka and Johor', 'Trained crews with the right pump capacity for underground chambers', 'Emergency response for a blocked trap during service hours', 'Transparent pricing based on chamber volume and access difficulty'],
        bm: ['Talian servis meliputi Perak, Selangor, Pulau Pinang, Melaka dan Johor', 'Kru terlatih dengan kapasiti pam yang sesuai untuk ruang bawah tanah', 'Tindak balas kecemasan untuk perangkap tersumbat semasa waktu operasi', 'Harga telus berdasarkan isi padu ruang dan kesukaran akses']
      }
    },
    {
      slug: 'sewerage-and-manhole-services',
      fit: 'contain',
      img: 'service/sewerage-1.webp',
      images: ['service/sewerage-1.webp', 'service/sewerage-2.webp', 'service/sewerage-3.webp'],
      video: 'video/sewerage-service.mp4',
      icon: 'ph-flow-arrow',
      name: { en: 'Sewerage and Manhole Services', bm: 'Perkhidmatan Pembetungan dan Lurang' },
      short: { en: 'High pressure jetting, manhole clearing and structural maintenance', bm: 'Jetting tekanan tinggi, pembersihan lurang dan penyelenggaraan struktur' },
      intro: {
        en: [
          'Blockages, sludge accumulation and structural damage in main sewer lines or manholes can paralyse your operations and trigger severe environmental violations.',
          'We provide industrial-grade pipe jetting, manhole clearing and structural maintenance services designed to keep your main drainage networks free-flowing and fully compliant.'
        ],
        bm: [
          'Penyumbatan, pengumpulan enapcemar dan kerosakan struktur di talian pembetungan utama atau lurang boleh melumpuhkan operasi anda dan mencetuskan pelanggaran alam sekitar yang serius.',
          'Kami menyediakan perkhidmatan jetting paip gred industri, pembersihan lurang dan penyelenggaraan struktur yang direka untuk memastikan rangkaian saliran utama anda mengalir lancar dan mematuhi sepenuhnya.'
        ]
      },
      benefits: {
        en: [
          'Eliminate major mainline clogs: powerful removal of deep-seated silt, hardened scale, grease rocks and stubborn debris before they back up into your facility',
          'Restore maximum flow capacity: high-pressure hydraulic jetting cleans pipe walls, reversing structural bottlenecks and preventing recurring drainage failures',
          'Legal and safe operations: full adherence to confined-space safety protocols and environmental regulations, eliminating toxic gas hazards and protecting your business from heavy municipal fines'
        ],
        bm: [
          'Hapuskan sumbatan talian utama: penyingkiran kuat kelodak dalam, kerak keras, ketulan gris dan serpihan degil sebelum ia berpatah balik ke premis anda',
          'Pulihkan kapasiti aliran maksimum: jetting hidraulik tekanan tinggi membersihkan dinding paip, mengembalikan kesesakan struktur dan menghalang kegagalan saliran berulang',
          'Operasi sah dan selamat: pematuhan penuh kepada protokol keselamatan ruang terkurung dan peraturan alam sekitar, menghapuskan bahaya gas toksik dan melindungi perniagaan anda daripada denda majlis yang berat'
        ]
      },
      why: {
        en: [
          '20 years of industrial experience handling complex municipal, commercial and factory sewerage networks across Malaysia',
          'Advanced heavy machinery: high-capacity vacuum tankers, mechanical rodding systems and high-pressure water jetters for any scale of blockage',
          'Emergency and flexible scheduling: we align operations with your off-peak hours, or dispatch rapid-response teams for critical drainage emergencies',
          'Transparent, direct pricing customised to pipeline length, diameter and severity of the blockage'
        ],
        bm: [
          '20 tahun pengalaman industri mengendalikan rangkaian pembetungan majlis, komersial dan kilang yang kompleks di seluruh Malaysia',
          'Jentera berat termaju: tangki vakum berkapasiti tinggi, sistem rodding mekanikal dan jet air tekanan tinggi untuk sebarang skala penyumbatan',
          'Penjadualan kecemasan dan fleksibel: kami menyelaraskan operasi dengan waktu luar puncak anda, atau menghantar pasukan tindak balas pantas untuk kecemasan saliran kritikal',
          'Harga terus dan telus yang disesuaikan mengikut panjang paip, diameter dan tahap keterukan penyumbatan'
        ]
      }
    },
    {
      slug: 'pome-pond-cleaning-desludging',
      fit: 'contain',
      img: 'service/pome-cleaning.webp',
      images: ['service/pome-cleaning.webp'],
      icon: 'ph-waves',
      name: { en: 'POME Pond Cleaning & Desludging', bm: 'Pembersihan & Penyahenapan Kolam POME' },
      short: { en: 'Palm oil mill effluent pond desludging and capacity recovery', bm: 'Penyahenapan kolam efluen kilang sawit dan pemulihan kapasiti' },
      intro: {
        en: [
          'Palm oil mill effluent ponds lose working volume every season as sludge accumulates on the bed. Once retention time drops below the design figure, discharge quality falls and the mill risks a Department of Environment breach.',
          'We desludge anaerobic, facultative and aerobic ponds, restore the designed retention volume, and dispose of recovered sludge through licensed channels.'
        ],
        bm: [
          'Kolam efluen kilang sawit kehilangan isi padu operasi setiap musim apabila enapcemar terkumpul di dasar. Apabila masa penahanan jatuh di bawah angka reka bentuk, kualiti pelepasan menurun dan kilang berisiko melanggar syarat Jabatan Alam Sekitar.',
          'Kami menyahenap kolam anaerobik, fakultatif dan aerobik, memulihkan isi padu penahanan yang direka, dan melupuskan enapcemar yang dipulihkan melalui saluran berlesen.'
        ]
      },
      benefits: {
        en: ['Restores designed retention volume and treatment performance', 'Improves final discharge quality ahead of DOE sampling', 'Reduces odour and short-circuiting across the pond series', 'Licensed disposal of recovered sludge with documentation', 'Scheduled around milling season to minimise downtime'],
        bm: ['Memulihkan isi padu penahanan reka bentuk dan prestasi rawatan', 'Meningkatkan kualiti pelepasan akhir sebelum pensampelan JAS', 'Mengurangkan bau dan pintasan aliran merentas siri kolam', 'Pelupusan berlesen enapcemar yang dipulihkan dengan dokumentasi', 'Dijadualkan mengikut musim pengilangan untuk mengurangkan gangguan operasi']
      },
      why: {
        en: ['Equipment sized for large open ponds, not just tanks', 'Experience with the full anaerobic to aerobic pond series', 'Volume measured before and after so recovery is verifiable', 'Documentation prepared for your environmental compliance file'],
        bm: ['Peralatan disaiz untuk kolam terbuka besar, bukan sekadar tangki', 'Pengalaman dengan siri kolam anaerobik hingga aerobik sepenuhnya', 'Isi padu diukur sebelum dan selepas supaya pemulihan boleh disahkan', 'Dokumentasi disediakan untuk fail pematuhan alam sekitar anda']
      }
    },
    {
      slug: 'schedule-waste-collection-register',
      fit: 'contain',
      img: 'service/schedule-waste.webp',
      images: ['service/schedule-waste.webp'],
      icon: 'ph-clipboard-text',
      name: { en: 'Scheduled Waste Collection & Register', bm: 'Kutipan Sisa Berjadual & Pendaftaran' },
      short: { en: 'Licensed collection with the inventory record DOE expects', bm: 'Kutipan berlesen dengan rekod inventori yang dikehendaki JAS' },
      intro: {
        en: [
          'Scheduled waste is not just a collection problem. Under Malaysian environmental regulations the generator must keep an accurate inventory, label and store waste correctly, and be able to produce consignment records on demand.',
          'We handle collection through licensed channels and set up the register alongside it, so the paperwork matches what actually left your site.'
        ],
        bm: [
          'Sisa berjadual bukan sekadar masalah kutipan. Di bawah peraturan alam sekitar Malaysia, penjana sisa mesti menyimpan inventori yang tepat, melabel dan menyimpan sisa dengan betul, serta mampu mengemukakan rekod konsainan apabila diminta.',
          'Kami mengendalikan kutipan melalui saluran berlesen dan menyediakan daftar bersamanya, supaya dokumentasi sepadan dengan apa yang sebenarnya keluar dari tapak anda.'
        ]
      },
      benefits: {
        en: ['Collection through licensed contractors and disposal facilities', 'Waste inventory and register set up against your waste codes', 'Consignment notes retained and reconciled after every collection', 'Correct labelling and storage guidance for the accumulation area', 'Records ready for inspection without a last-minute scramble'],
        bm: ['Kutipan melalui kontraktor dan kemudahan pelupusan berlesen', 'Inventori dan daftar sisa disediakan mengikut kod sisa anda', 'Nota konsainan disimpan dan diselaraskan selepas setiap kutipan', 'Panduan pelabelan dan penyimpanan yang betul untuk kawasan pengumpulan', 'Rekod sedia untuk pemeriksaan tanpa tergesa-gesa di saat akhir']
      },
      why: {
        en: ['We keep the register, not just the truck schedule', 'Codes mapped correctly the first time, which is where most audits fail', 'Collection frequency matched to your accumulation limit', 'One point of contact for collection and paperwork'],
        bm: ['Kami menyimpan daftar, bukan sekadar jadual lori', 'Kod dipetakan dengan betul dari awal, dan di situlah kebanyakan audit gagal', 'Kekerapan kutipan dipadankan dengan had pengumpulan anda', 'Satu titik hubungan untuk kutipan dan dokumentasi']
      }
    },
    {
      slug: 'water-supply-pumping-palm-oil-mills',
      fit: 'contain',
      img: 'service/water-supply.webp',
      images: ['service/water-supply.webp'],
      icon: 'ph-drop-half-bottom',
      name: { en: 'Water Supply and Pumping to Palm Oil Mills', bm: 'Bekalan Air dan Pengepaman ke Kilang Sawit' },
      short: { en: 'Raw water abstraction, pumping and delivery for mill operations', bm: 'Pengambilan air mentah, pengepaman dan penghantaran untuk operasi kilang' },
      intro: {
        en: [
          'A palm oil mill stops when the water stops. Sterilisation, clarification and boiler make-up all depend on a raw water supply that holds its rate through the milling season, often from a river or reservoir some distance from the plant.',
          'We install and operate abstraction and pumping arrangements for mills, including pipeline runs, pump sets and standby capacity for peak crop.'
        ],
        bm: [
          'Kilang sawit berhenti apabila bekalan air berhenti. Pensterilan, penjernihan dan air tambahan dandang semuanya bergantung pada bekalan air mentah yang mengekalkan kadarnya sepanjang musim pengilangan, selalunya dari sungai atau takungan yang jauh dari loji.',
          'Kami memasang dan mengendalikan susunan pengambilan dan pengepaman untuk kilang, termasuk laluan paip, set pam dan kapasiti sandaran untuk musim puncak.'
        ]
      },
      benefits: {
        en: ['Raw water abstraction from river or reservoir sources', 'Pump sets sized against mill throughput and peak crop', 'Pipeline installation and pressure management', 'Standby capacity so a single pump failure does not stop milling', 'Ongoing operation and maintenance support through the season'],
        bm: ['Pengambilan air mentah dari sumber sungai atau takungan', 'Set pam disaiz mengikut pemprosesan kilang dan musim puncak', 'Pemasangan paip dan pengurusan tekanan', 'Kapasiti sandaran supaya kegagalan satu pam tidak menghentikan pengilangan', 'Sokongan operasi dan penyelenggaraan berterusan sepanjang musim']
      },
      why: {
        en: ['We work to mill throughput figures, not generic pump curves', 'Experience with the full water and effluent loop at palm oil mills', 'Season-aware scheduling for installation and maintenance', 'Same team also handles POME pond desludging on the discharge side'],
        bm: ['Kami bekerja berdasarkan angka pemprosesan kilang, bukan lengkung pam generik', 'Pengalaman dengan keseluruhan gelung air dan efluen di kilang sawit', 'Penjadualan mengikut musim untuk pemasangan dan penyelenggaraan', 'Pasukan yang sama turut mengendalikan penyahenapan kolam POME di bahagian pelepasan']
      }
    }
  ];

  /* ------------------------------------------------------------ categories */
  var CATEGORIES = [
    {
      id: 'grease-trap', href: 'grease-traps.html', icon: 'ph-tray',
      name: { en: 'Grease Traps', bm: 'Perangkap Minyak' },
      blurb: { en: 'Undersink, centralized and oil interceptor models from 10 GPM to 700 GPM.', bm: 'Model bawah sinki, berpusat dan pemintas minyak dari 10 GPM hingga 700 GPM.' },
      img: GT + 'gta335-2.jpg', fit: 'cover',
      subs: [
        { id: 'undersink', name: { en: 'Undersink Grease Trap', bm: 'Perangkap Minyak Bawah Sinki' } },
        { id: 'centralized', name: { en: 'Centralized Grease Trap', bm: 'Perangkap Minyak Berpusat' } },
        { id: 'oil-interceptor', name: { en: 'Oil Interceptor', bm: 'Pemintas Minyak' } }
      ]
    },
    {
      id: 'auto-dosing', href: 'auto-dosing.html', icon: 'ph-timer',
      name: { en: 'Auto Dosing Unit', bm: 'Unit Dos Automatik' },
      blurb: { en: 'Programmed enzyme delivery with battery backup and a lifetime replacement warranty.', bm: 'Penyampaian enzim berprogram dengan sandaran bateri dan waranti penggantian seumur hidup.' },
      img: GT + 'adu9291p-2.webp', fit: 'cover',
      subs: [
        { id: 'unit', name: { en: 'Dosing Units', bm: 'Unit Dos' } },
        { id: 'offer', name: { en: 'Bundles & Demos', bm: 'Pakej & Demo' } }
      ]
    },
    {
      id: 'bio-enzyme', href: 'bio-enzyme.html', icon: 'ph-flask',
      name: { en: 'GoodBac Bio-Enzyme', bm: 'Bio-Enzim GoodBac' },
      blurb: { en: 'Concentrated bacterial culture that converts fats, oils and grease into carbon dioxide and water.', bm: 'Kultur bakteria pekat yang menukarkan lemak, minyak dan gris kepada karbon dioksida dan air.' },
      img: GT + 'goodbac-5l.webp', fit: 'contain',
      subs: [{ id: 'enzyme', name: { en: 'Bio-Enzyme', bm: 'Bio-Enzim' } }]
    },
    {
      id: 'others', href: 'others.html', icon: 'ph-squares-four',
      name: { en: 'Other Products', bm: 'Produk Lain' },
      blurb: { en: 'Dosing cabinets, hanging panels, bio bricks and water leak detection.', bm: 'Kabinet dos, panel gantung, bio brick dan pengesanan kebocoran air.' },
      img: GT + 'adu-cabinet-2.webp', fit: 'contain',
      subs: [
        { id: 'accessory', name: { en: 'Dosing Accessories', bm: 'Aksesori Dos' } },
        { id: 'consumable', name: { en: 'Consumables', bm: 'Bahan Guna Habis' } },
        { id: 'monitoring', name: { en: 'Monitoring', bm: 'Pemantauan' } }
      ]
    }
  ];

  root.PM_CATALOG = {
    models: MODELS,
    dosing: DOSING,
    products: PRODUCTS,
    services: SERVICES,
    categories: CATEGORIES,
    badge: BADGE
  };
})(window);
