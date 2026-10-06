/* =========================================================================
   Perangkap Minyak - the October 2026 additions (EN / BM)
   Loaded by Site D only, after site.js and catalog.js.

   Everything here came in one folder from the client: the GreaseGo slide
   deck (the three common issues, the GreaseGo oil interceptor, scheduled
   waste oil and its penalties, the cleaning range), sixteen field
   installation sheets, and a catalogue plus a drawing & installation
   guide PDF for each model. Figures are transcribed from that material,
   except where the law has moved on since a slide was made; those places
   say so in a comment.
   ========================================================================= */
(function (root) {
  'use strict';

  var LIB = {};

  /* ------------------------------------------------------------ documents
     One product catalogue and one drawing & installation guide per model.
     Page counts and sizes were read from the files. The catalogue supplied
     as "GTA3550" is the GTA3500 sheet and is filed under GTA3500. Paths,
     thumbnails and page images are derived from the model code, so only
     the facts that differ per file are kept here. */
  LIB.documents = [
    { model: 'GTA01',   series: 'undersink',   catalogue: { pages: 1, kb: 301 }, drawing: { pages: 3, kb: 595 } },
    { model: 'GTA02',   series: 'undersink',   catalogue: { pages: 1, kb: 298 }, drawing: { pages: 3, kb: 595 } },
    { model: 'GTS02',   series: 'undersink',   catalogue: { pages: 1, kb: 350 }, drawing: { pages: 3, kb: 566 } },
    { model: 'GTA325',  series: 'centralized', catalogue: { pages: 1, kb: 318 }, drawing: { pages: 2, kb: 161 } },
    { model: 'GTA335',  series: 'centralized', catalogue: { pages: 1, kb: 304 }, drawing: { pages: 2, kb: 161 } },
    { model: 'GTA350',  series: 'centralized', catalogue: { pages: 1, kb: 313 }, drawing: { pages: 2, kb: 161 } },
    { model: 'GTA375',  series: 'centralized', catalogue: { pages: 1, kb: 319 }, drawing: { pages: 2, kb: 161 } },
    { model: 'GTA3100', series: 'centralized', catalogue: { pages: 1, kb: 306 }, drawing: { pages: 2, kb: 161 } },
    { model: 'GTA3150', series: 'centralized', catalogue: { pages: 1, kb: 319 }, drawing: { pages: 2, kb: 161 } },
    { model: 'GTA3200', series: 'centralized', catalogue: { pages: 1, kb: 331 }, drawing: { pages: 2, kb: 161 } },
    { model: 'GTA3250', series: 'centralized', catalogue: { pages: 1, kb: 294 }, drawing: { pages: 2, kb: 162 } },
    { model: 'GTA3300', series: 'centralized', catalogue: { pages: 1, kb: 305 }, drawing: { pages: 2, kb: 161 } },
    { model: 'GTA3350', series: 'centralized', catalogue: { pages: 1, kb: 313 }, drawing: { pages: 2, kb: 161 } },
    { model: 'GTA3400', series: 'centralized', catalogue: { pages: 1, kb: 318 }, drawing: { pages: 2, kb: 161 } },
    { model: 'GTA3450', series: 'centralized', catalogue: { pages: 1, kb: 310 }, drawing: { pages: 2, kb: 161 } },
    { model: 'GTA3500', series: 'centralized', catalogue: { pages: 1, kb: 315 }, drawing: { pages: 2, kb: 161 } },
    { model: 'GTA3800', series: 'drain',       catalogue: { pages: 1, kb: 357 }, drawing: { pages: 2, kb: 334 } }
  ];

  /* ------------------------------------------------------ field sheets
     Sixteen installation records, each a sheet of four site photographs
     with the model and the site printed across the top. The captions
     repeat what is printed, so the sheet can be found by name. */
  LIB.field = [
    { img: 'gallery/field-01.webp', site: { en: 'Workshop, Sime Darby, Kedah', bm: 'Bengkel, Sime Darby, Kedah' } },
    { img: 'gallery/field-02.webp', site: { en: 'MARDI Sedang, Selangor', bm: 'MARDI Sedang, Selangor' } },
    { img: 'gallery/field-03.webp', site: { en: 'Refuse house, Seksyen 16, Putrajaya', bm: 'Rumah sampah, Seksyen 16, Putrajaya' } },
    { img: 'gallery/field-04.webp', model: 'GTA3800', site: { en: 'Kok Beng Motor, Sungai Buloh', bm: 'Kok Beng Motor, Sungai Buloh' } },
    { img: 'gallery/field-05.webp', model: 'GTA325', site: { en: 'Honda service centre, Kota Damansara', bm: 'Pusat servis Honda, Kota Damansara' } },
    { img: 'gallery/field-06.webp', model: 'GTA335', site: { en: 'Sekolah Batang Kali', bm: 'Sekolah Batang Kali' } },
    { img: 'gallery/field-07.webp', model: 'GTA350', site: { en: 'GWM service centre, Ipoh', bm: 'Pusat servis GWM, Ipoh' } },
    { img: 'gallery/field-08.webp', model: 'GTA375', site: { en: 'Honda service centre, Kota Damansara', bm: 'Pusat servis Honda, Kota Damansara' } },
    { img: 'gallery/field-09.webp', model: 'GTA3100', site: { en: 'Sea Frozen Food, Johor', bm: 'Sea Frozen Food, Johor' } },
    { img: 'gallery/field-10.webp', model: 'GTA3150', site: { en: 'Workshop, Pahang', bm: 'Bengkel, Pahang' } },
    { img: 'gallery/field-11.webp', model: 'GTA3200', site: { en: 'Replacement in stainless steel', bm: 'Penggantian dengan keluli tahan karat' } },
    { img: 'gallery/field-12.webp', model: 'GTA3300', site: { en: 'Rembayung, Kuala Lumpur', bm: 'Rembayung, Kuala Lumpur' } },
    { img: 'gallery/field-13.webp', model: 'GTA3400', site: { en: 'Toyota service centre', bm: 'Pusat servis Toyota' } },
    { img: 'gallery/field-14.webp', model: 'GTA3500', site: { en: 'Serpang Gong Fu Precision', bm: 'Serpang Gong Fu Precision' } },
    { img: 'gallery/field-15.webp', site: { en: 'Custom hanging trap, Menara Usahawan', bm: 'Perangkap gantung tersuai, Menara Usahawan' } },
    { img: 'gallery/field-16.webp', model: 'GTA03C', site: { en: 'Car wash, Petaling Jaya', bm: 'Cucian kereta, Petaling Jaya' } },
    /* Not a site sheet but the same kind of record: the auto dosing unit
       going in, drilled, mounted, connected and tested on site. */
    { img: 'brand/sheets/adu-installation.webp', model: 'ADU9291P',
      site: { en: 'Auto dosing unit, installed step by step', bm: 'Unit dos automatik, dipasang langkah demi langkah' } }
  ];

  /* -------------------------------------------------------- common issues
     The deck's A, B and C. Each pairs what goes wrong with why, and with
     the fix the company sells. The sheets are the client's own artwork and
     open full size from the panel. */
  LIB.issues = [
    {
      letter: 'A',
      title: { en: 'Under-sink grease trap', bm: 'Perangkap minyak bawah sinki' },
      summary: {
        en: 'Bad odour, overflow and blockage. Under a sink, all three usually start in the same place: a screener basket that sits in the water.',
        bm: 'Bau busuk, limpahan dan sumbatan. Di bawah sinki, ketiga-tiganya biasanya bermula di tempat yang sama: bakul penapis yang terendam dalam air.'
      },
      complaints: [
        { en: 'Bad odour', bm: 'Bau busuk' },
        { en: 'Overflow', bm: 'Limpahan' },
        { en: 'Blockage', bm: 'Sumbatan' }
      ],
      why: {
        en: [
          'The screener is submerged in water and waste, so trapped food decomposes and smells.',
          'Grease and waste build up faster, which is what leads to overflow and blockage.',
          'Staff have to reach into dirty water to lift the basket, and the smell stays on their hands.',
          'Odour carries over to the food, and customers notice.'
        ],
        bm: [
          'Penapis terendam dalam air dan sisa, jadi makanan yang terperangkap mereput dan berbau.',
          'Gris dan sisa terkumpul lebih cepat, dan itulah punca limpahan dan sumbatan.',
          'Pekerja terpaksa menyeluk air kotor untuk mengangkat bakul, dan baunya kekal di tangan.',
          'Bau terbawa ke makanan, dan pelanggan menyedarinya.'
        ]
      },
      fix: {
        en: [
          'Keep the screener above the water level. Food waste stays dry, so it does not decompose and does not smell.',
          'The basket lifts out clean, so nobody touches dirty water.',
          'The GTS02 is built this way: the only grease trap in Malaysia with an above-water-level screener.'
        ],
        bm: [
          'Letakkan penapis di atas paras air. Sisa makanan kekal kering, jadi ia tidak mereput dan tidak berbau.',
          'Bakul diangkat keluar dalam keadaan bersih, jadi tiada siapa menyentuh air kotor.',
          'GTS02 dibina begini: satu-satunya perangkap minyak di Malaysia dengan penapis di atas paras air.'
        ]
      },
      links: [
        { href: 'product.html?p=undersink-grease-trap-gts02', label: { en: 'See the GTS02', bm: 'Lihat GTS02' } },
        { href: 'auto-dosing.html', label: { en: 'Auto dosing unit', bm: 'Unit dos automatik' } }
      ],
      sheet: { img: 'brand/sheets/issue-a-undersink',
               title: { en: 'Common issues: under-sink grease trap', bm: 'Masalah biasa: perangkap minyak bawah sinki' } },
      more: [
        { img: 'brand/sheets/gts02-sheet', title: { en: 'GTS02 product sheet', bm: 'Helaian produk GTS02' } },
        { img: 'brand/sheets/adu9291p-sheet', title: { en: 'ADU9291P auto dosing unit', bm: 'Unit dos automatik ADU9291P' } },
        { img: 'brand/sheets/adu-installation', title: { en: 'ADU installation, step by step', bm: 'Pemasangan ADU, langkah demi langkah' } }
      ]
    },
    {
      letter: 'B',
      title: { en: 'Centralized grease trap', bm: 'Perangkap minyak berpusat' },
      summary: {
        en: 'A conventional trap holds grease the way a refrigerator holds fat: it sets into hard blocks that clog pipes and drains when the trap is not maintained promptly.',
        bm: 'Perangkap konvensional menyimpan gris seperti peti sejuk menyimpan lemak: ia mengeras menjadi ketulan yang menyumbat paip dan longkang apabila perangkap tidak diselenggara segera.'
      },
      complaints: [
        { en: 'Bad odour', bm: 'Bau busuk' },
        { en: 'Backflow and overflow', bm: 'Aliran balik dan limpahan' },
        { en: 'Expensive cleaning', bm: 'Kos pembersihan tinggi' },
        { en: 'Pipe damage', bm: 'Kerosakan paip' }
      ],
      why: {
        en: [
          'Only about 20% of the grease stays on the surface. The other 80% stays below, mixed with the water.',
          'As more grease comes in, the excess is discharged out of the trap with the water.',
          'Over time that grease and water mixture hardens into blocks that narrow the pipe and then block it.',
          'The bill follows: foul smells, backflow, overflow, and professional cleaning to remove hardened grease.'
        ],
        bm: [
          'Hanya kira-kira 20% gris kekal di permukaan. Baki 80% berada di bawah, bercampur dengan air.',
          'Apabila lebih banyak gris masuk, lebihannya dilepaskan keluar dari perangkap bersama air.',
          'Lama-kelamaan campuran gris dan air itu mengeras menjadi ketulan yang menyempitkan paip dan kemudian menyumbatnya.',
          'Kosnya menyusul: bau busuk, aliran balik, limpahan, dan pembersihan profesional untuk membuang gris yang mengeras.'
        ]
      },
      fix: {
        en: [
          'Change to an automatic grease trap. A skimmer moves the oil into its own storage compartment within five minutes, before it can harden.',
          'Or put the trap on a monthly service, so grease never builds up to the point of blocking the line.'
        ],
        bm: [
          'Tukar kepada perangkap minyak automatik. Penyisih memindahkan minyak ke ruang simpanannya sendiri dalam masa lima minit, sebelum ia sempat mengeras.',
          'Atau letakkan perangkap pada servis bulanan, supaya gris tidak sempat terkumpul sehingga menyumbat saluran.'
        ]
      },
      links: [
        { href: 'product.html?p=automatic-oil-interceptor', label: { en: 'Automatic skimming trap', bm: 'Perangkap penyisih automatik' } },
        { href: 'service.html?s=grease-trap-cleaning-maintenance', label: { en: 'Monthly servicing', bm: 'Servis bulanan' } }
      ],
      sheet: { img: 'brand/sheets/issue-b-centralized',
               title: { en: 'Common issues: centralized grease trap', bm: 'Masalah biasa: perangkap minyak berpusat' } },
      more: [
        { img: 'brand/sheets/autogta-sheet', title: { en: 'AUTOGTA automatic grease trap', bm: 'Perangkap minyak automatik AUTOGTA' } }
      ]
    },
    {
      letter: 'C',
      title: { en: 'Oil interceptor', bm: 'Pemintas minyak' },
      summary: {
        en: 'A conventional interceptor starts letting oil through to the drain once it is about 20% full, and what is pumped out leaves as one expensive oily mixture.',
        bm: 'Pemintas konvensional mula membenarkan minyak mengalir ke longkang apabila ia kira-kira 20% penuh, dan apa yang dipam keluar dilupuskan sebagai satu campuran berminyak yang mahal.'
      },
      complaints: [
        { en: 'Fails DOE Standard B', bm: 'Gagal Standard B JAS' },
        { en: 'High disposal cost', bm: 'Kos pelupusan tinggi' },
        { en: 'Oil reaches the drain', bm: 'Minyak sampai ke longkang' }
      ],
      why: {
        en: [
          'Oil passes to the drain once the interceptor is around 20% full, so the discharge fails the DOE Standard B requirement.',
          'Workshop wastewater mixes oil with water. Left unseparated, the whole mixture is scheduled waste SW312, the costliest to dispose of.',
          'Oily-water mixtures (SW309) are expensive to send for disposal as well.'
        ],
        bm: [
          'Minyak mengalir ke longkang apabila pemintas kira-kira 20% penuh, jadi pelepasan gagal memenuhi keperluan Standard B JAS.',
          'Air sisa bengkel mencampurkan minyak dengan air. Jika tidak diasingkan, keseluruhan campuran menjadi sisa berjadual SW312, yang paling mahal untuk dilupuskan.',
          'Campuran air berminyak (SW309) juga mahal untuk dihantar bagi pelupusan.'
        ]
      },
      fix: {
        en: [
          'Separate first. The oil goes for disposal as a much smaller quantity, and the water can be treated at lower cost.',
          'Clean used engine oil (SW305) and hydraulic oil (SW306) can cost you nothing, or even be sold.',
          'An automatic oil interceptor keeps the oil in an independent storage tank, which can be extended.',
          'Or appoint a service contractor who skims and separates, rather than one who pumps everything out as SW312.'
        ],
        bm: [
          'Asingkan dahulu. Minyak dilupuskan dalam kuantiti yang jauh lebih kecil, dan air boleh dirawat pada kos lebih rendah.',
          'Minyak enjin terpakai (SW305) dan minyak hidraulik (SW306) yang bersih boleh dikutip tanpa kos, malah boleh dijual.',
          'Pemintas minyak automatik menyimpan minyak dalam tangki simpanan berasingan, yang boleh dibesarkan.',
          'Atau lantik kontraktor servis yang menyisih dan mengasingkan, bukan yang mengepam semuanya keluar sebagai SW312.'
        ]
      },
      links: [
        { href: 'oil-interceptor.html', label: { en: 'GreaseGo Oil Interceptor', bm: 'Pemintas Minyak GreaseGo' } },
        { href: 'scheduled-waste.html', label: { en: 'Can I sell my waste oil?', bm: 'Bolehkah saya jual minyak terpakai?' } }
      ],
      sheet: { img: 'brand/sheets/issue-c-oil-interceptor',
               title: { en: 'Common issues: oil interceptor', bm: 'Masalah biasa: pemintas minyak' } },
      more: [
        { img: 'brand/sheets/oil-interceptor-service', title: { en: 'Professional oil interceptor service', bm: 'Servis pemintas minyak profesional' } },
        { img: 'brand/sheets/greasego-oil-interceptor', title: { en: 'GreaseGo Oil Interceptor', bm: 'Pemintas Minyak GreaseGo' } }
      ]
    }
  ];

  /* --------------------------------------------- GreaseGo Oil Interceptor */
  LIB.oilInterceptor = {
    tagline: { en: 'Helps reduce scheduled waste disposal cost', bm: 'Membantu mengurangkan kos pelupusan sisa berjadual' },
    intro: {
      en: [
        'The GreaseGo Oil Interceptor separates free oil, grease, hydrocarbons, grit and suspended solids from workshop wastewater before it is discharged to the sewer or a treatment system.',
        'It keeps the site cleaner, protects the drains, cuts down maintenance problems and supports DOE compliance for automotive service facilities. Built for car service centres and workshops, in 304 stainless steel.'
      ],
      bm: [
        'Pemintas Minyak GreaseGo mengasingkan minyak bebas, gris, hidrokarbon, kelikir dan pepejal terampai daripada air sisa bengkel sebelum ia dilepaskan ke pembetung atau sistem rawatan.',
        'Ia memastikan tapak lebih bersih, melindungi longkang, mengurangkan masalah penyelenggaraan dan menyokong pematuhan JAS bagi kemudahan servis automotif. Dibina untuk pusat servis kereta dan bengkel, dalam keluli tahan karat 304.'
      ]
    },
    steps: [
      { title: { en: 'Inlet and grit capture', bm: 'Salur masuk dan tangkapan kelikir' },
        body: { en: 'Heavier solids and grit are trapped in a removable basket at the inlet.', bm: 'Pepejal berat dan kelikir ditangkap dalam bakul boleh tanggal di salur masuk.' } },
      { title: { en: 'Primary settling', bm: 'Pengenapan awal' },
        body: { en: 'Sludge and sediment settle out behind an adjustable baffle and weir.', bm: 'Enapcemar dan sedimen mendap di belakang sekatan dan empang limpah boleh laras.' } },
      { title: { en: 'Oil separation', bm: 'Pemisahan minyak' },
        body: { en: 'A coalescing plate pack makes oil droplets rise and separate more efficiently.', bm: 'Pek plat pengumpal membantu titisan minyak naik dan terpisah dengan lebih cekap.' } },
      { title: { en: 'Oil collection and outlet', bm: 'Pengumpulan minyak dan salur keluar' },
        body: { en: 'A skimmer lifts the separated oil into a collection tank, and cleaner water leaves over an adjustable outlet weir.', bm: 'Penyisih mengangkat minyak yang terpisah ke tangki pengumpulan, dan air yang lebih bersih keluar melalui empang limpah salur keluar boleh laras.' } }
    ],
    benefits: {
      en: [
        'High efficiency oil and hydrocarbon separation',
        'Retains free oils, grease and hydrocarbons',
        'Removable coalescer and screen, optional',
        'Easy maintenance and cleaning',
        'Complies with standard requirements',
        'Robust construction for long service life'
      ],
      bm: [
        'Pemisahan minyak dan hidrokarbon berkecekapan tinggi',
        'Menahan minyak bebas, gris dan hidrokarbon',
        'Pengumpal dan penapis boleh tanggal, pilihan',
        'Mudah diselenggara dan dibersihkan',
        'Mematuhi keperluan piawai',
        'Binaan kukuh untuk hayat servis yang panjang'
      ]
    },
    material: {
      en: ['Corrosion resistant', 'Durable and long lasting', 'Hygienic and easy to clean'],
      bm: ['Tahan karat', 'Tahan lama', 'Bersih dan mudah dibersihkan']
    },
    applications: [
      { en: 'Car service centres', bm: 'Pusat servis kereta' },
      { en: 'Mechanical workshops', bm: 'Bengkel mekanikal' },
      { en: 'Car wash bays', bm: 'Ruang cucian kereta' },
      { en: 'Fleet maintenance depots', bm: 'Depoh penyelenggaraan armada' }
    ],
    /* The published table, as supplied. GTASP-300's oil capacity is
       printed as 310 litres, below the GTASP-250's 561; it is kept as
       published rather than guessed at. */
    models: [
      { model: 'GTASP-50',  flow: 50,  oil: 220,  water: 918,  pipe: 100, l: 1750, w: 500,  h: 1050, inlet: 850,  outlet: 800 },
      { model: 'GTASP-100', flow: 100, oil: 440,  water: 1836, pipe: 100, l: 1750, w: 1000, h: 1050, inlet: 850,  outlet: 800 },
      { model: 'GTASP-250', flow: 250, oil: 561,  water: 2160, pipe: 150, l: 2400, w: 600,  h: 1500, inlet: 850,  outlet: 800 },
      { model: 'GTASP-300', flow: 300, oil: 310,  water: 1247, pipe: 150, l: 2170, w: 500,  h: 1150, inlet: 950,  outlet: 900 },
      { model: 'GTASP-500', flow: 500, oil: 1123, water: 4320, pipe: 150, l: 2400, w: 1200, h: 1500, inlet: 1300, outlet: 1250 },
      { model: 'GTASP-750', flow: 750, oil: 1620, water: 5400, pipe: 150, l: 3000, w: 1200, h: 1500, inlet: 1300, outlet: 1250 }
    ],
    note: {
      en: 'All specifications are approximate and subject to change without prior notice. Custom sizing and an installation layout can be proposed to suit the site.',
      bm: 'Semua spesifikasi adalah anggaran dan tertakluk kepada perubahan tanpa notis. Saiz tersuai dan susun atur pemasangan boleh dicadangkan mengikut tapak.'
    },
    /* The deck's "Solution 2": the service that goes with the unit. */
    service: {
      steps: [
        { title: { en: 'Inspect the system', bm: 'Periksa sistem' },
          body: { en: 'Check the chambers, the weirs and the oil layer before anything is pumped.', bm: 'Semak ruang, empang limpah dan lapisan minyak sebelum apa-apa dipam.' } },
        { title: { en: 'Skim and separate the oil', bm: 'Sisih dan asingkan minyak' },
          body: { en: 'Professional skimming lifts the oil off, rather than pumping the surface waste with everything under it.', bm: 'Penyisihan profesional mengangkat minyak, bukan mengepam sisa permukaan bersama semua yang di bawahnya.' } },
        { title: { en: 'Reduce the sludge and water', bm: 'Kurangkan enapcemar dan air' },
          body: { en: 'Separating oil from water cuts the volume that has to be treated as scheduled waste.', bm: 'Mengasingkan minyak daripada air mengurangkan isi padu yang perlu dirawat sebagai sisa berjadual.' } },
        { title: { en: 'Minimise the disposal cost', bm: 'Kurangkan kos pelupusan' },
          body: { en: 'In suitable cases, recovered oil and cleaner water reduce disposal charges or avoid them altogether.', bm: 'Dalam keadaan yang sesuai, minyak yang dipulihkan dan air yang lebih bersih mengurangkan caj pelupusan atau mengelakkannya sama sekali.' } }
      ],
      problem: {
        en: 'If a contractor pumps everything out together and classes all of it as SW312, the owner pays the highest scheduled waste disposal cost. Separating first means only what truly needs disposal is disposed of.',
        bm: 'Jika kontraktor mengepam semuanya keluar bersama dan mengelaskan kesemuanya sebagai SW312, pemilik membayar kos pelupusan sisa berjadual yang paling tinggi. Mengasingkan dahulu bermakna hanya yang benar-benar perlu dilupuskan sahaja dilupuskan.'
      }
    }
  };

  /* ------------------------------------------ scheduled waste oil: sell or pay
     The deck's table of the six waste oil codes. "verdict" keys the badge
     colour: sell, free, depends, pay. */
  LIB.wasteOil = {
    lead: {
      en: 'It depends on the type of waste oil, its quality, how contaminated it is, and how much of it there is.',
      bm: 'Ia bergantung pada jenis minyak terpakai, kualitinya, tahap pencemarannya, dan kuantitinya.'
    },
    legend: [
      { key: 'sell',    label: { en: 'Can sell: you get paid', bm: 'Boleh jual: anda dibayar' } },
      { key: 'free',    label: { en: 'Free collection: no cost', bm: 'Kutipan percuma: tiada kos' } },
      { key: 'depends', label: { en: 'Depends: case by case', bm: 'Bergantung: kes demi kes' } },
      { key: 'pay',     label: { en: 'Must pay: disposal cost', bm: 'Mesti bayar: kos pelupusan' } }
    ],
    codes: [
      { code: 'SW305', verdict: 'sell',
        type: { en: 'Spent lubricating oil', bm: 'Minyak pelincir terpakai' },
        examples: { en: 'Used engine oil, motor oil, machinery lubricants', bm: 'Minyak enjin terpakai, minyak motor, pelincir jentera' },
        condition: { en: 'Clean, no water, high oil content, no coolant, solvent or chemical, stored in good condition', bm: 'Bersih, tiada air, kandungan minyak tinggi, tiada penyejuk, pelarut atau bahan kimia, disimpan dengan baik' },
        market: { en: 'High demand for re-refining. Good quality fetches a good price, and the recycler pays you.', bm: 'Permintaan tinggi untuk penapisan semula. Kualiti baik mendapat harga baik, dan pengitar semula membayar anda.' },
        answer: { en: 'Can sell', bm: 'Boleh jual' },
        note: { en: 'The most valuable waste oil. Keep it separate and do not mix.', bm: 'Minyak terpakai paling bernilai. Simpan berasingan dan jangan campur.' } },
      { code: 'SW306', verdict: 'free',
        type: { en: 'Spent hydraulic oil', bm: 'Minyak hidraulik terpakai' },
        examples: { en: 'Hydraulic system oil', bm: 'Minyak sistem hidraulik' },
        condition: { en: 'Mainly oil, low water, no metal particles, no coolant or solvent', bm: 'Kebanyakannya minyak, air rendah, tiada zarah logam, tiada penyejuk atau pelarut' },
        market: { en: 'Usually sold or collected free, depending on quality and the market price.', bm: 'Biasanya dijual atau dikutip percuma, bergantung pada kualiti dan harga pasaran.' },
        answer: { en: 'Can sell or free collection', bm: 'Boleh jual atau kutipan percuma' },
        note: { en: 'High quality can be sold. Slightly contaminated oil may be collected free.', bm: 'Kualiti tinggi boleh dijual. Minyak yang sedikit tercemar mungkin dikutip percuma.' } },
      { code: 'SW309', verdict: 'pay',
        type: { en: 'Oil-water mixture', bm: 'Campuran minyak dan air' },
        examples: { en: 'Ballast water, bilge water', bm: 'Air balast, air lambung kapal' },
        condition: { en: 'Contains water, oil content varies, may contain sludge or sand', bm: 'Mengandungi air, kandungan minyak berbeza-beza, mungkin mengandungi enapcemar atau pasir' },
        market: { en: 'Usually needs oil-water separation. Most cases need to pay; sometimes free or sellable if the oil content is high.', bm: 'Biasanya memerlukan pemisahan minyak dan air. Kebanyakan kes perlu bayar; kadang-kadang percuma atau boleh dijual jika kandungan minyak tinggi.' },
        answer: { en: 'Mostly must pay', bm: 'Kebanyakannya mesti bayar' },
        note: { en: 'The more oil and the less water, the better the chance to sell it or have it collected free.', bm: 'Lebih banyak minyak dan kurang air, lebih baik peluang untuk menjualnya atau dikutip percuma.' } },
      { code: 'SW310', verdict: 'pay',
        type: { en: 'Sludge from a mineral oil storage tank', bm: 'Enapcemar dari tangki simpanan minyak mineral' },
        examples: { en: 'Tank bottom sludge', bm: 'Enapcemar dasar tangki' },
        condition: { en: 'Thick sludge, high water and dirt, usually from the tank bottom', bm: 'Enapcemar pekat, air dan kotoran tinggi, biasanya dari dasar tangki' },
        market: { en: 'Very high treatment cost. Always a disposal cost.', bm: 'Kos rawatan sangat tinggi. Sentiasa ada kos pelupusan.' },
        answer: { en: 'Must pay', bm: 'Mesti bayar' },
        note: { en: 'Tank bottom sludge is expensive to dispose of.', bm: 'Enapcemar dasar tangki mahal untuk dilupuskan.' } },
      { code: 'SW311', verdict: 'depends',
        type: { en: 'Waste oil or oily sludge', bm: 'Minyak buangan atau enapcemar berminyak' },
        examples: { en: 'General waste oil, oil-based muds', bm: 'Minyak buangan am, lumpur berasaskan minyak' },
        condition: { en: 'Oil, water and sludge; quality varies; may contain solid particles', bm: 'Minyak, air dan enapcemar; kualiti berbeza-beza; mungkin mengandungi zarah pepejal' },
        market: { en: 'Depends on oil content. High oil content can sell; high sludge or water must pay.', bm: 'Bergantung pada kandungan minyak. Kandungan minyak tinggi boleh dijual; enapcemar atau air yang tinggi mesti bayar.' },
        answer: { en: 'Depends', bm: 'Bergantung' },
        note: { en: 'Quality decides whether you get paid or have to pay.', bm: 'Kualiti menentukan sama ada anda dibayar atau perlu membayar.' } },
      { code: 'SW312', verdict: 'pay',
        type: { en: 'Oily residue', bm: 'Sisa berminyak' },
        examples: { en: 'Automotive workshops, service stations, grease interceptors', bm: 'Bengkel automotif, stesen servis, pemintas gris' },
        condition: { en: 'Oil mixed with water, food waste and detergents; high sludge or grease; very low oil content', bm: 'Minyak bercampur air, sisa makanan dan detergen; enapcemar atau gris tinggi; kandungan minyak sangat rendah' },
        market: { en: 'Mostly a disposal cost. Treatment is expensive, so you pay.', bm: 'Kebanyakannya kos pelupusan. Rawatan mahal, jadi anda membayar.' },
        answer: { en: 'Mostly must pay', bm: 'Kebanyakannya mesti bayar' },
        note: { en: 'Grease trap and workshop sludge almost always carry a disposal cost.', bm: 'Enapcemar perangkap minyak dan bengkel hampir selalu melibatkan kos pelupusan.' } }
    ],
    guide: [
      { question: { en: 'Is it mostly oil, not mixed with water or sludge?', bm: 'Adakah ia kebanyakannya minyak, tidak bercampur air atau enapcemar?' },
        answer: { en: 'SW305 or SW306. You can sell it, or be paid for it.', bm: 'SW305 atau SW306. Anda boleh menjualnya, atau dibayar untuknya.' }, verdict: 'sell' },
      { question: { en: 'Is it oil mixed with water or sludge?', bm: 'Adakah ia minyak yang bercampur air atau enapcemar?' },
        answer: { en: 'SW309 or SW311. It depends on the oil content: it may be free, or you may pay.', bm: 'SW309 atau SW311. Ia bergantung pada kandungan minyak: mungkin percuma, atau anda mungkin perlu bayar.' }, verdict: 'depends' },
      { question: { en: 'Is it heavy sludge, tank sludge or grease trap residue?', bm: 'Adakah ia enapcemar berat, enapcemar tangki atau sisa perangkap minyak?' },
        answer: { en: 'SW310 or SW312. Mostly, you have to pay.', bm: 'SW310 atau SW312. Kebanyakannya, anda perlu bayar.' }, verdict: 'pay' }
    ],
    factors: [
      { title: { en: 'Oil content', bm: 'Kandungan minyak' }, body: { en: 'Higher oil content, higher value.', bm: 'Kandungan minyak lebih tinggi, nilai lebih tinggi.' } },
      { title: { en: 'Water content', bm: 'Kandungan air' }, body: { en: 'More water, lower value and higher cost.', bm: 'Lebih banyak air, nilai lebih rendah dan kos lebih tinggi.' } },
      { title: { en: 'Solids, sludge and sand', bm: 'Pepejal, enapcemar dan pasir' }, body: { en: 'More solids, higher treatment cost.', bm: 'Lebih banyak pepejal, kos rawatan lebih tinggi.' } },
      { title: { en: 'Contamination', bm: 'Pencemaran' }, body: { en: 'Coolant, solvent, detergents and chemicals greatly reduce the value.', bm: 'Penyejuk, pelarut, detergen dan bahan kimia sangat mengurangkan nilai.' } },
      { title: { en: 'Quantity and location', bm: 'Kuantiti dan lokasi' }, body: { en: 'A large volume that is easy to collect has a better chance of free or paid collection.', bm: 'Isi padu besar yang mudah dikutip mempunyai peluang lebih baik untuk kutipan percuma atau berbayar.' } }
    ],
    notes: {
      en: [
        'All scheduled waste must be handled by a DOE-licensed transporter, recovery facility or disposal facility.',
        'Every consignment goes through the eSWIS consignment system.',
        'Do not mix different types of waste oil. Mixing lowers the value and can turn sellable oil into waste you pay to dispose of.',
        'Store it in sound containers with no leaks, label them properly and keep records.',
        'Waste oil that still has economic value can go for recovery at licensed premises, until it becomes recovered oil that meets the DOE standard.'
      ],
      bm: [
        'Semua sisa berjadual mesti dikendalikan oleh pengangkut, kemudahan pemulihan atau kemudahan pelupusan yang dilesenkan oleh JAS.',
        'Setiap konsainan melalui sistem konsainan eSWIS.',
        'Jangan campurkan jenis minyak terpakai yang berbeza. Mencampurkannya mengurangkan nilai dan boleh menjadikan minyak yang boleh dijual sebagai sisa yang perlu dibayar untuk dilupuskan.',
        'Simpan dalam bekas yang baik tanpa kebocoran, labelkan dengan betul dan simpan rekod.',
        'Minyak terpakai yang masih bernilai ekonomi boleh dihantar untuk pemulihan di premis berlesen, sehingga ia menjadi minyak pulih yang memenuhi piawaian JAS.'
      ]
    },
    footnote: {
      en: 'A positive price is only possible when the oil content is high. Prices vary by location, quality and market.',
      bm: 'Harga positif hanya mungkin apabila kandungan minyak tinggi. Harga berbeza mengikut lokasi, kualiti dan pasaran.'
    },
    sheet: { img: 'brand/sheets/sw-sell-or-pay',
             title: { en: 'Scheduled waste oil: can I sell or do I have to pay?', bm: 'Minyak sisa berjadual: boleh jual atau perlu bayar?' } }
  };

  /* ------------------------------------------------------------ penalties
     From the deck's penalties sheet, with one correction. The sheet gives
     Section 34B as "up to RM500,000" and says that figure "remains" the
     maximum. The Environmental Quality (Amendment) Act 2024 came into
     force on 7 July 2024 and set it at RM100,000 to RM10 million with
     imprisonment of up to five years, so that is what is published here.
     The regulatory figures are as supplied. */
  /* Citations, in each language's own words for the law. */
  function EQA(section) {
    return { en: 'Section ' + section + ', EQA 1974', bm: 'Seksyen ' + section + ', AKAS 1974' };
  }
  function SWR(reg) {
    return reg
      ? { en: 'Regulation ' + reg + ', Scheduled Wastes Regulations 2005', bm: 'Peraturan ' + reg + ', Peraturan Buangan Terjadual 2005' }
      : { en: 'Scheduled Wastes Regulations 2005', bm: 'Peraturan Buangan Terjadual 2005' };
  }

  LIB.penalties = {
    serious: {
      figure: { en: 'RM10 million', bm: 'RM10 juta' },
      caption: { en: 'Serious offences under Section 34B of the Environmental Quality Act 1974: a fine of RM100,000 up to RM10 million, and imprisonment of up to 5 years.',
                 bm: 'Kesalahan serius di bawah Seksyen 34B Akta Kualiti Alam Sekeliling 1974: denda RM100,000 hingga RM10 juta, dan penjara sehingga 5 tahun.' },
      penalty: { en: 'Fine of RM100,000 to RM10 million and imprisonment up to 5 years', bm: 'Denda RM100,000 hingga RM10 juta dan penjara sehingga 5 tahun' }
    },
    regulatory: {
      figure: { en: 'RM50,000', bm: 'RM50,000' },
      caption: { en: 'Regulatory offences under the Scheduled Wastes Regulations 2005: a fine of up to RM50,000 and/or imprisonment of up to 2 years, plus RM1,000 a day while the offence continues.',
                 bm: 'Kesalahan peraturan di bawah Peraturan Buangan Terjadual 2005: denda sehingga RM50,000 dan/atau penjara sehingga 2 tahun, serta RM1,000 sehari selagi kesalahan berterusan.' },
      penalty: { en: 'Fine up to RM50,000 and/or imprisonment up to 2 years, plus RM1,000 a day', bm: 'Denda sehingga RM50,000 dan/atau penjara sehingga 2 tahun, serta RM1,000 sehari' }
    },
    offences: [
      { serious: true, law: EQA('34B(1)(a)'),
        offence: { en: 'Illegal disposal of scheduled waste on land or into waters', bm: 'Pelupusan haram sisa berjadual di atas tanah atau ke dalam perairan' } },
      { serious: true, law: EQA('34B(1)(b)'),
        offence: { en: 'Importing scheduled waste without DOE approval', bm: 'Mengimport sisa berjadual tanpa kelulusan JAS' } },
      { serious: true, law: EQA('34B(1)(b)'),
        offence: { en: 'Exporting scheduled waste without DOE approval', bm: 'Mengeksport sisa berjadual tanpa kelulusan JAS' } },
      { serious: true, law: EQA('34B(1)(c)'),
        offence: { en: 'Transit of scheduled waste without approval', bm: 'Transit sisa berjadual tanpa kelulusan' } },
      { serious: true, law: EQA('34B(3)'),
        offence: { en: 'Receiving or sending scheduled waste using false documents', bm: 'Menerima atau menghantar sisa berjadual menggunakan dokumen palsu' } },
      { law: SWR(),
        offence: { en: 'Failure to label scheduled waste properly', bm: 'Gagal melabel sisa berjadual dengan betul' } },
      { law: SWR(),
        offence: { en: 'Failure to store scheduled waste properly', bm: 'Gagal menyimpan sisa berjadual dengan betul' } },
      { law: SWR(),
        offence: { en: 'Failure to notify the DOE of scheduled waste generation', bm: 'Gagal memaklumkan JAS tentang penjanaan sisa berjadual' } },
      { law: SWR(),
        offence: { en: 'Failure to keep an inventory or records', bm: 'Gagal menyimpan inventori atau rekod' } },
      { law: SWR(),
        offence: { en: 'Failure to use DOE-approved transporters', bm: 'Gagal menggunakan pengangkut yang diluluskan JAS' } },
      { law: SWR(),
        offence: { en: 'Failure to complete eSWIS consignment documentation', bm: 'Gagal melengkapkan dokumentasi konsainan eSWIS' } },
      { law: SWR(9),
        offence: { en: 'Keeping scheduled waste longer than 180 days without DOE approval', bm: 'Menyimpan sisa berjadual lebih daripada 180 hari tanpa kelulusan JAS' } },
      { law: SWR(9),
        offence: { en: 'Storing more than 20 metric tonnes without approval', bm: 'Menyimpan lebih daripada 20 tan metrik tanpa kelulusan' } },
      { law: SWR(15),
        offence: { en: 'Failure to train employees in scheduled waste handling', bm: 'Gagal melatih pekerja dalam pengendalian sisa berjadual' } },
      { law: SWR(),
        offence: { en: 'Failure to respond properly to a scheduled waste spill', bm: 'Gagal bertindak dengan betul terhadap tumpahan sisa berjadual' } },
      { law: SWR(),
        offence: { en: 'Other breaches of the Scheduled Wastes Regulations 2005', bm: 'Pelanggaran lain Peraturan Buangan Terjadual 2005' } }
    ],
    compound: {
      en: 'Some breaches of the Scheduled Wastes Regulations may be settled by compound, subject to DOE approval and the Environmental Quality (Compounding of Offences) Rules.',
      bm: 'Sesetengah pelanggaran Peraturan Buangan Terjadual boleh diselesaikan melalui kompaun, tertakluk kepada kelulusan JAS dan Kaedah-Kaedah Kualiti Alam Sekeliling (Pengkompaunan Kesalahan).'
    },
    amendment: {
      en: 'The Section 34B figures reflect the Environmental Quality (Amendment) Act 2024, in force from 7 July 2024. Before the amendment the maximum fine was RM500,000.',
      bm: 'Angka Seksyen 34B mengikut Akta Kualiti Alam Sekeliling (Pindaan) 2024, berkuat kuasa mulai 7 Julai 2024. Sebelum pindaan, denda maksimum ialah RM500,000.'
    },
    source: {
      en: 'Sources: Environmental Quality Act 1974 (Act 127), as amended in 2024, and the Environmental Quality (Scheduled Wastes) Regulations 2005. This is a summary, not legal advice.',
      bm: 'Sumber: Akta Kualiti Alam Sekeliling 1974 (Akta 127), sebagaimana dipinda pada 2024, dan Peraturan-Peraturan Kualiti Alam Sekeliling (Buangan Terjadual) 2005. Ini ringkasan, bukan nasihat undang-undang.'
    }
  };

  /* -------------------------------------------------------- cleaning range
     Thirty-two GreaseGo products. Each card carries its own name, number,
     capacity and dilution printed into the artwork; they are repeated here
     so they can be read, searched and translated. */
  LIB.cleaningGroups = [
    { id: 'kitchen',    label: { en: 'Kitchen & food areas', bm: 'Dapur & kawasan makanan' } },
    { id: 'floors',     label: { en: 'Floors & surfaces', bm: 'Lantai & permukaan' } },
    { id: 'washroom',   label: { en: 'Washroom & hygiene', bm: 'Tandas & kebersihan diri' } },
    { id: 'laundry',    label: { en: 'Laundry', bm: 'Dobi' } },
    { id: 'industrial', label: { en: 'Industrial & automotive', bm: 'Industri & automotif' } }
  ];

  var STD = '20 L · 10 L · 5 L';
  var READY = { en: 'Ready to use', bm: 'Sedia digunakan' };

  function item(n, slug, name, group, use, dilution, capacity) {
    return {
      n: n, slug: slug, name: name, group: group, use: use,
      dilution: dilution || READY, capacity: capacity || STD,
      img: 'products/cleaning/' + (n < 10 ? '0' : '') + n + '-' + slug + '.webp'
    };
  }

  LIB.cleaning = [
    item(1, 'dish-wash-high-foam', 'Dish Wash High Foam', 'kitchen',
      { en: 'Kitchen cleaning', bm: 'Pembersihan dapur' },
      { en: '1:20 heavy soiling, 1:50 light cleaning', bm: '1:20 kotoran berat, 1:50 pembersihan ringan' }),
    item(2, 'dish-wash-economy', 'Dish Wash Economy', 'kitchen',
      { en: 'Kitchen cleaning', bm: 'Pembersihan dapur' },
      { en: '1:20 heavy soiling, 1:50 light cleaning', bm: '1:20 kotoran berat, 1:50 pembersihan ringan' }),
    item(3, 'fresh-pine-floor-cleaner', 'Fresh Pine Floor Cleaner', 'floors',
      { en: 'Floor care', bm: 'Penjagaan lantai' },
      { en: '1:50 mopping, 1:10 heavy scrubbing', bm: '1:50 mengemop, 1:10 menyental berat' }),
    item(4, 'bleach', 'Bleach', 'laundry',
      { en: 'Laundry and disinfection', bm: 'Dobi dan pembasmian kuman' }),
    item(5, 'hand-wash-liquid', 'Hand Wash Liquid', 'washroom',
      { en: 'Personal care', bm: 'Penjagaan diri' }),
    item(6, 'hand-wash-foam', 'Hand Wash Foam', 'washroom',
      { en: 'Personal care', bm: 'Penjagaan diri' }),
    item(7, 'soap-dispenser', 'Soap Dispenser', 'washroom',
      { en: 'Soap dispenser, liquid or foam', bm: 'Dispenser sabun, cecair atau buih' },
      { en: '0.40 ml per shot', bm: '0.40 ml setiap tekan' }, '800 ml'),
    item(8, 'hand-sanitizer-gel', 'Hand Sanitizer Gel', 'washroom',
      { en: 'Hand hygiene, up to 75% alcohol', bm: 'Kebersihan tangan, sehingga 75% alkohol' }),
    item(9, 'fly-away', 'Fly Away', 'kitchen',
      { en: 'F&B area care, controls flies and insects', bm: 'Penjagaan kawasan F&B, mengawal lalat dan serangga' },
      { en: '1:50 table spray, 1:10 general mopping', bm: '1:50 semburan meja, 1:10 mengemop am' }),
    item(10, 'glass-kleen', 'Glass Kleen', 'floors',
      { en: 'Glass and mirror care', bm: 'Penjagaan kaca dan cermin' },
      { en: '1:1 tough stains, 1:15 general cleaning', bm: '1:1 kotoran degil, 1:15 pembersihan am' }),
    item(11, 'multipurpose-cleaner', 'Multipurpose Cleaner', 'floors',
      { en: 'Hard-surface cleaning', bm: 'Pembersihan permukaan keras' },
      { en: '1:20 scrub, 1:100 mop, 1:150 auto scrubber', bm: '1:20 sental, 1:100 mop, 1:150 mesin sental' }),
    item(12, 'oven-kleen', 'Oven Kleen', 'kitchen',
      { en: 'Heavy-duty kitchen care, ovens, grills and hoods', bm: 'Penjagaan dapur tugas berat, ketuhar, gril dan hud' },
      { en: '1:5 heavy cleaning, 1:25 light cleaning', bm: '1:5 pembersihan berat, 1:25 pembersihan ringan' }),
    item(13, 'fenol', 'Fenol', 'floors',
      { en: 'Disinfectant cleaner', bm: 'Pembersih pembasmi kuman' },
      { en: '1:150 mopping, 1:20 general cleaning', bm: '1:150 mengemop, 1:20 pembersihan am' }),
    item(14, 'urinal-screen', 'Urinal Screen', 'washroom',
      { en: 'Washroom care, up to 30 days per screen', bm: 'Penjagaan tandas, sehingga 30 hari setiap penapis' },
      { en: 'Up to 30 days', bm: 'Sehingga 30 hari' }, '20 g, 15 cm'),
    item(15, 'steel-shine', 'Steel Shine', 'floors',
      { en: 'Metal surface care, stainless steel polish', bm: 'Penjagaan permukaan logam, penggilap keluli tahan karat' }),
    item(16, 'fresh-floor-cleaner', 'Fresh Floor Cleaner', 'floors',
      { en: 'Floor care', bm: 'Penjagaan lantai' },
      { en: '1:15 heavy cleaning, 1:100 general mopping', bm: '1:15 pembersihan berat, 1:100 mengemop am' }),
    item(17, 'dirt-buster', 'Dirt Buster', 'industrial',
      { en: 'Industrial cleaning, super-alkaline', bm: 'Pembersihan industri, super-alkali' }),
    item(18, 'heavy-duty-degreaser', 'Heavy Duty Degreaser', 'industrial',
      { en: 'Industrial degreasing, workshop floors', bm: 'Penyahgris industri, lantai bengkel' },
      { en: '1:30 wash off, 1:130 mop or auto scrubber', bm: '1:30 bilas, 1:130 mop atau mesin sental' }),
    item(19, 'lo-foam', 'Lo Foam', 'floors',
      { en: 'Machine floor care, low-foaming', bm: 'Penjagaan lantai mesin, buih rendah' }),
    item(20, 'bowl-kleen', 'Bowl Kleen', 'washroom',
      { en: 'Washroom hygiene, acidic toilet-bowl cleaner', bm: 'Kebersihan tandas, pembersih mangkuk tandas berasid' }),
    item(21, 'rizz', 'Rizz', 'washroom',
      { en: 'Acidic mosaic cleaner and descaler', bm: 'Pembersih mozek berasid dan penyahkerak' }),
    item(22, 'hair-body-shampoo', 'Hair & Body Shampoo', 'washroom',
      { en: 'Personal care', bm: 'Penjagaan diri' }),
    item(23, 'softener', 'Softener', 'laundry',
      { en: 'Laundry care', bm: 'Penjagaan dobi' }),
    item(24, 'car-shampoo', 'Car Shampoo', 'industrial',
      { en: 'Automotive care, high-foaming', bm: 'Penjagaan automotif, buih tinggi' }),
    item(25, 'degreaser', 'Degreaser', 'kitchen',
      { en: 'Kitchen and industrial care, easy-rinse', bm: 'Penjagaan dapur dan industri, mudah dibilas' }),
    item(26, 'tyre-shine', 'Tyre Shine', 'industrial',
      { en: 'Automotive detailing, tyre dressing', bm: 'Perincian automotif, pengilat tayar' }),
    item(27, 'plastic-coating', 'Plastic Coating', 'industrial',
      { en: 'Automotive detailing, plastic and vinyl trim', bm: 'Perincian automotif, trim plastik dan vinil' }),
    item(28, 'pandango', 'Pandango', 'floors',
      { en: 'Multipurpose detergent, super-concentrated', bm: 'Detergen pelbagai guna, sangat pekat' }),
    item(29, 'vanguard', 'Vanguard', 'kitchen',
      { en: 'Food-area sanitising, three in one', bm: 'Sanitasi kawasan makanan, tiga dalam satu' }),
    item(30, 'quat-sanitizer', 'Quat Sanitizer', 'kitchen',
      { en: 'Food-contact sanitising, non-alcoholic', bm: 'Sanitasi permukaan sentuhan makanan, tanpa alkohol' }),
    item(31, 'stain-off', 'Stain Off', 'kitchen',
      { en: 'Food-area hygiene, boards and utensils', bm: 'Kebersihan kawasan makanan, papan dan perkakas' }),
    item(32, 'laundry-detergent', 'Laundry Detergent', 'laundry',
      { en: 'Laundry care', bm: 'Penjagaan dobi' })
  ];

  /* --------------------------------------------------------------- FAQs
     Grouped by what a reader is trying to do. Entries that already exist
     in SITE.faq are referenced by index rather than copied, so a wording
     fix there reaches this page too. */
  LIB.faqTopics = [
    {
      id: 'grease-traps',
      title: { en: 'Grease traps', bm: 'Perangkap minyak' },
      heading: { en: 'What they are, and what they are made of', bm: 'Apakah ia, dan diperbuat daripada apa' },
      items: [{ id: 'what-is', ref: 0 }, { ref: 1 }, { ref: 2 }, { ref: 7 }, { ref: 8 }]
    },
    {
      id: 'problems',
      title: { en: 'Common problems', bm: 'Masalah biasa' },
      heading: { en: 'Smells, blockages and failed tests', bm: 'Bau, sumbatan dan ujian yang gagal' },
      items: [
        { id: 'smell',
          q: { en: 'Why does my under-sink grease trap smell?', bm: 'Mengapa perangkap minyak bawah sinki saya berbau?' },
          a: { en: 'Usually because the screener basket sits in the water. Trapped food decomposes, grease builds up faster, and staff have to reach into dirty water to clean it. A screener above the water level keeps food waste dry, and the GTS02 is built that way.',
               bm: 'Biasanya kerana bakul penapis terendam dalam air. Makanan yang terperangkap mereput, gris terkumpul lebih cepat, dan pekerja terpaksa menyeluk air kotor untuk membersihkannya. Penapis di atas paras air memastikan sisa makanan kekal kering, dan GTS02 dibina sedemikian.' } },
        { q: { en: 'Why do centralized grease traps block the pipes downstream?', bm: 'Mengapa perangkap minyak berpusat menyumbat paip di hilir?' },
          a: { en: 'Only about 20% of the grease stays on the surface of a conventional trap. The other 80% stays mixed with the water, and the excess is discharged as more comes in. Over time it hardens into blocks that narrow and then block the pipes. An automatic trap that skims the oil into its own compartment, or a monthly service, prevents it.',
               bm: 'Hanya kira-kira 20% gris kekal di permukaan perangkap konvensional. Baki 80% kekal bercampur dengan air, dan lebihannya dilepaskan apabila lebih banyak gris masuk. Lama-kelamaan ia mengeras menjadi ketulan yang menyempitkan dan kemudian menyumbat paip. Perangkap automatik yang menyisih minyak ke ruangnya sendiri, atau servis bulanan, mencegahnya.' } },
        { q: { en: 'Why does our oil interceptor fail the DOE Standard B test?', bm: 'Mengapa pemintas minyak kami gagal ujian Standard B JAS?' },
          a: { en: 'A conventional interceptor starts letting oil through to the drain once it is about 20% full. Separating the oil continuously, with an automatic interceptor or a skimming service, keeps the oil out of the discharge.',
               bm: 'Pemintas konvensional mula membenarkan minyak mengalir ke longkang apabila ia kira-kira 20% penuh. Mengasingkan minyak secara berterusan, dengan pemintas automatik atau servis penyisihan, menghalang minyak daripada keluar bersama pelepasan.' } },
        { q: { en: 'What is an automatic grease trap?', bm: 'Apakah perangkap minyak automatik?' },
          a: { en: 'A trap with a built-in skimmer that lifts the separated oil into its own storage compartment within minutes, so it never hardens in the chamber. The AUTOGTA series runs 24 hours on mains or solar power, from 50 to 1,000 GPM.',
               bm: 'Perangkap dengan penyisih terbina dalam yang mengangkat minyak yang terpisah ke ruang simpanannya sendiri dalam beberapa minit, jadi ia tidak mengeras di dalam ruang. Siri AUTOGTA beroperasi 24 jam dengan kuasa elektrik atau solar, dari 50 hingga 1,000 GPM.' } }
      ]
    },
    {
      id: 'servicing',
      title: { en: 'Servicing and dosing', bm: 'Servis dan dos' },
      heading: { en: 'Keeping it working', bm: 'Memastikan ia terus berfungsi' },
      items: [
        { id: 'servicing', ref: 6 },
        { ref: 5 },
        { q: { en: 'Do you only pump out oil interceptors?', bm: 'Adakah anda hanya mengepam keluar pemintas minyak?' },
          a: { en: 'No. Pumping everything out together means all of it is classed as SW312, the most expensive scheduled waste to dispose of. Our crews skim and separate the oil first, so you only pay to dispose of what truly needs disposal.',
               bm: 'Tidak. Mengepam semuanya keluar bersama bermakna kesemuanya dikelaskan sebagai SW312, sisa berjadual yang paling mahal untuk dilupuskan. Kru kami menyisih dan mengasingkan minyak terlebih dahulu, jadi anda hanya membayar untuk melupuskan apa yang benar-benar perlu dilupuskan.' } }
      ]
    },
    {
      id: 'waste',
      title: { en: 'Scheduled waste and the law', bm: 'Sisa berjadual dan undang-undang' },
      heading: { en: 'What you can sell, and what the law says', bm: 'Apa yang boleh dijual, dan apa kata undang-undang' },
      items: [
        { id: 'sell-oil',
          q: { en: 'Can I sell used engine oil?', bm: 'Bolehkah saya menjual minyak enjin terpakai?' },
          a: { en: 'Often, yes. Clean spent lubricating oil (SW305) and hydraulic oil (SW306), kept separate and free of water, coolant and solvent, are in demand for re-refining, so a recycler will usually pay or collect it free. It must still go through a DOE-licensed transporter and recovery facility.',
               bm: 'Selalunya, ya. Minyak pelincir terpakai (SW305) dan minyak hidraulik (SW306) yang bersih, disimpan berasingan dan bebas daripada air, penyejuk dan pelarut, mendapat permintaan untuk penapisan semula, jadi pengitar semula biasanya akan membayar atau mengutipnya secara percuma. Ia tetap mesti melalui pengangkut dan kemudahan pemulihan yang dilesenkan JAS.' } },
        { q: { en: 'Do I have to pay to dispose of grease trap waste?', bm: 'Adakah saya perlu membayar untuk melupuskan sisa perangkap minyak?' },
          a: { en: 'Almost always. Grease trap and workshop residue is SW312: mostly water, sludge and grease with very little oil, and expensive to treat. Separating the oil first reduces the quantity you pay for.',
               bm: 'Hampir selalu. Sisa perangkap minyak dan bengkel ialah SW312: kebanyakannya air, enapcemar dan gris dengan sangat sedikit minyak, dan mahal untuk dirawat. Mengasingkan minyak terlebih dahulu mengurangkan kuantiti yang anda bayar.' } },
        { id: 'penalty',
          q: { en: 'What is the penalty for illegal disposal of scheduled waste?', bm: 'Apakah hukuman bagi pelupusan haram sisa berjadual?' },
          a: { en: 'Under Section 34B of the Environmental Quality Act 1974, as amended in 2024, a fine of RM100,000 to RM10 million and imprisonment of up to five years.',
               bm: 'Di bawah Seksyen 34B Akta Kualiti Alam Sekeliling 1974, sebagaimana dipinda pada 2024, denda RM100,000 hingga RM10 juta dan penjara sehingga lima tahun.' } },
        { q: { en: 'How long can scheduled waste be stored on site?', bm: 'Berapa lama sisa berjadual boleh disimpan di tapak?' },
          a: { en: 'Up to 180 days, and no more than 20 metric tonnes, unless the DOE approves otherwise. That is Regulation 9 of the Environmental Quality (Scheduled Wastes) Regulations 2005.',
               bm: 'Sehingga 180 hari, dan tidak lebih daripada 20 tan metrik, melainkan JAS meluluskan sebaliknya. Itu Peraturan 9, Peraturan-Peraturan Kualiti Alam Sekeliling (Buangan Terjadual) 2005.' } },
        { q: { en: 'Who is allowed to collect scheduled waste?', bm: 'Siapa yang dibenarkan mengutip sisa berjadual?' },
          a: { en: 'Only a DOE-licensed transporter, delivering to a licensed recovery or disposal facility, with each movement recorded in the eSWIS consignment system.',
               bm: 'Hanya pengangkut yang dilesenkan JAS, yang menghantar ke kemudahan pemulihan atau pelupusan berlesen, dengan setiap pergerakan direkodkan dalam sistem konsainan eSWIS.' } }
      ]
    },
    {
      id: 'ordering',
      title: { en: 'Ordering and documents', bm: 'Pesanan dan dokumen' },
      heading: { en: 'Delivery, warranty and paperwork', bm: 'Penghantaran, waranti dan dokumen' },
      items: [
        { ref: 3 },
        { ref: 4 },
        { q: { en: 'Where can I download the catalogue and drawings?', bm: 'Di mana saya boleh memuat turun katalog dan lukisan?' },
          a: { en: 'On the Brochures & Downloads page. Every model has its product catalogue and its drawing & installation guide as a PDF you can read on the page or download.',
               bm: 'Di halaman Brosur & Muat Turun. Setiap model mempunyai katalog produk serta lukisan & panduan pemasangan dalam bentuk PDF yang boleh anda baca di halaman itu atau muat turun.' } },
        { q: { en: 'Do you supply cleaning chemicals?', bm: 'Adakah anda membekalkan bahan kimia pembersihan?' },
          a: { en: 'Yes. The GreaseGo cleaning range covers 32 products for kitchens, floors, washrooms, laundry and workshops, most of them in 20, 10 and 5 litre containers.',
               bm: 'Ya. Rangkaian pembersihan GreaseGo merangkumi 32 produk untuk dapur, lantai, tandas, dobi dan bengkel, kebanyakannya dalam bekas 20, 10 dan 5 liter.' } }
      ]
    }
  ];

  /* The five the home page shows, by id, in this order. */
  LIB.faqHome = ['what-is', 'smell', 'servicing', 'sell-oil', 'penalty'];

  root.PM_LIBRARY = LIB;
})(window);
