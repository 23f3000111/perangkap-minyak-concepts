/* =========================================================================
   Perangkap Minyak - shared site data (EN / BM)
   Sources: perangkapminyak.com.my (legacy) + autodosing.my (GreaseGo)
   Company: Kualiti Alam Hijau (M) Sdn Bhd / KAH Group
   ========================================================================= */
(function (root) {
  'use strict';

  var SITE = {};

  /* ---------------------------------------------------------------- brand */
  SITE.brand = {
    name: 'Perangkap Minyak',
    mark: 'PM',
    legal: 'Kualiti Alam Hijau (M) Sdn Bhd',
    tradingArm: 'GreaseGo Sdn Bhd',
    regNo: '202501011722 (1013136-X)',
    since: 1996,
    tagline: {
      en: 'Grease trap manufacturer, Malaysia',
      bm: 'Pengeluar perangkap minyak, Malaysia'
    }
  };

  /* -------------------------------------------------------------- contact */
  SITE.contact = {
    person: 'Jackie',
    whatsapp: '60178785593',
    whatsappDisplay: '017-878 5593',
    officePhone: '+60361508812',
    officeDisplay: '+603-6150 8812',
    servicePhone: '+6058058540',
    serviceDisplay: '05-805 8540',
    email: 'contact@kahgroup.com.my',
    hours: {
      en: 'Monday to Friday, 8:30 AM to 5:30 PM (excluding public holidays)',
      bm: 'Isnin hingga Jumaat, 8:30 pagi hingga 5:30 petang (kecuali cuti umum)'
    },
    hq: {
      label: { en: 'Head office', bm: 'Ibu pejabat' },
      lines: ['No. 43, Jalan PJU 10/10C, Saujana Damansara', 'PJU 10, 47830 Petaling Jaya', 'Selangor, Malaysia']
    },
    factories: [
      {
        label: { en: 'Factory, Selangor', bm: 'Kilang, Selangor' },
        lines: ['Lot 1336, Batu 18, Jalan Sungai Bakau', '48000 Rawang, Selangor, Malaysia']
      },
      {
        label: { en: 'Factory, Melaka', bm: 'Kilang, Melaka' },
        lines: ['18, Jalan TTC 12A, Taman Teknologi Cheng', '75250 Melaka, Malaysia']
      },
      {
        label: { en: 'Service depot, Perak', bm: 'Depoh servis, Perak' },
        lines: ['19, Laluan Tupai 2, Jalan Tupai', '34000 Taiping, Perak, Malaysia']
      }
    ],
    coverage: {
      en: 'Delivery and installation across Peninsular Malaysia, with service teams in Selangor, Perak, Penang, Melaka and Johor.',
      bm: 'Penghantaran dan pemasangan di seluruh Semenanjung Malaysia, dengan pasukan servis di Selangor, Perak, Pulau Pinang, Melaka dan Johor.'
    }
    /* Company bank details from the legacy site are deliberately not kept
       here. Payment instructions are issued per quotation instead. */
  };

  /* ------------------------------------------------------------ navigation */
  SITE.nav = [
    { href: 'index.html', label: { en: 'Home', bm: 'Utama' } },
    {
      label: { en: 'Products', bm: 'Produk' },
      children: [
        { href: 'grease-traps.html', label: { en: 'Grease Traps', bm: 'Perangkap Minyak' } },
        { href: 'auto-dosing.html', label: { en: 'Auto Dosing Unit', bm: 'Unit Dos Automatik' } },
        { href: 'bio-enzyme.html', label: { en: 'GoodBac Bio-Enzyme', bm: 'Bio-Enzim GoodBac' } },
        { href: 'others.html', label: { en: 'Other Products', bm: 'Produk Lain' } },
        { href: 'model-finder.html', label: { en: 'Model & Size Finder', bm: 'Pencari Model & Saiz' } }
      ]
    },
    { href: 'services.html', label: { en: 'Services', bm: 'Perkhidmatan' } },
    {
      label: { en: 'Compliance', bm: 'Pematuhan' },
      children: [
        { href: 'approvals.html', label: { en: 'Authority Approval', bm: 'Kelulusan Pihak Berkuasa' } },
        { href: 'awards.html', label: { en: 'Awards & Certificates', bm: 'Anugerah & Sijil' } },
        { href: 'lab-test.html', label: { en: 'Lab Test Results', bm: 'Keputusan Ujian Makmal' } },
        { href: 'installation-guide.html', label: { en: 'Installation Guide', bm: 'Panduan Pemasangan' } }
      ]
    },
    {
      label: { en: 'Company', bm: 'Syarikat' },
      children: [
        { href: 'about.html', label: { en: 'Company Profile', bm: 'Profil Syarikat' } },
        { href: 'project-gallery.html', label: { en: 'Project Gallery', bm: 'Galeri Projek' } },
        { href: 'videos.html', label: { en: 'Video Library', bm: 'Pustaka Video' } },
        { href: 'downloads.html', label: { en: 'Brochures & Downloads', bm: 'Brosur & Muat Turun' } },
        { href: 'news.html', label: { en: 'News', bm: 'Berita' } },
        { href: 'careers.html', label: { en: 'Careers & Dealership', bm: 'Kerjaya & Pengedar' } }
      ]
    },
    { href: 'where-to-buy.html', label: { en: 'Where To Buy', bm: 'Tempat Membeli' } },
    { href: 'contact.html', label: { en: 'Contact', bm: 'Hubungi' } }
  ];

  /* ------------------------------------------------- interface dictionary */
  SITE.ui = {
    requestPrice: { en: 'Request price', bm: 'Minta harga' },
    requestQuote: { en: 'Request a quote', bm: 'Minta sebut harga' },
    whatsapp: { en: 'WhatsApp us', bm: 'WhatsApp kami' },
    callUs: { en: 'Call us', bm: 'Hubungi kami' },
    viewAll: { en: 'View all', bm: 'Lihat semua' },
    viewDetails: { en: 'View details', bm: 'Lihat butiran' },
    backTo: { en: 'Back to', bm: 'Kembali ke' },
    specs: { en: 'Specifications', bm: 'Spesifikasi' },
    warranty: { en: 'Warranty & support', bm: 'Waranti & sokongan' },
    whyChoose: { en: 'Why choose this model', bm: 'Mengapa pilih model ini' },
    idealFor: { en: 'Ideal for', bm: 'Sesuai untuk' },
    related: { en: 'Related products', bm: 'Produk berkaitan' },
    enquiry: { en: 'Enquiry', bm: 'Pertanyaan' },
    name: { en: 'Name', bm: 'Nama' },
    mobile: { en: 'Mobile number', bm: 'Nombor telefon' },
    email: { en: 'Email', bm: 'E-mel' },
    productInterest: { en: 'Product of interest', bm: 'Produk yang diminati' },
    serviceRequest: { en: 'Service requested', bm: 'Perkhidmatan diminta' },
    message: { en: 'Message', bm: 'Mesej' },
    submit: { en: 'Send enquiry', bm: 'Hantar pertanyaan' },
    sending: { en: 'Sending', bm: 'Menghantar' },
    sent: { en: 'Thank you. We will reply within one business day.', bm: 'Terima kasih. Kami akan membalas dalam satu hari bekerja.' },
    required: { en: 'This field is required', bm: 'Ruangan ini diperlukan' },
    invalidEmail: { en: 'Enter a valid email address', bm: 'Masukkan alamat e-mel yang sah' },
    invalidPhone: { en: 'Enter a valid Malaysian mobile number', bm: 'Masukkan nombor telefon Malaysia yang sah' },
    pleaseSelect: { en: 'Please select', bm: 'Sila pilih' },
    noResults: { en: 'No models match these filters', bm: 'Tiada model sepadan dengan penapis ini' },
    resetFilters: { en: 'Reset filters', bm: 'Set semula penapis' },
    capacity: { en: 'Capacity', bm: 'Kapasiti' },
    flowRate: { en: 'Flow rate', bm: 'Kadar aliran' },
    dailyMeals: { en: 'Daily meals', bm: 'Hidangan harian' },
    pipeSize: { en: 'Pipe size', bm: 'Saiz paip' },
    dimensions: { en: 'Dimensions', bm: 'Dimensi' },
    material: { en: 'Material', bm: 'Bahan' },
    suggestedFor: { en: 'Suggested for', bm: 'Dicadangkan untuk' },
    theme: { en: 'Toggle theme', bm: 'Tukar tema' },
    menu: { en: 'Menu', bm: 'Menu' },
    close: { en: 'Close', bm: 'Tutup' },
    readMore: { en: 'Read more', bm: 'Baca lagi' },
    loading: { en: 'Loading', bm: 'Memuatkan' },
    notFound: { en: 'We could not find that item.', bm: 'Kami tidak menjumpai item tersebut.' }
  };

  /* ------------------------------------------------ municipal approvals */
  SITE.approvals = [
    { img: 'approvals/dbkl.jpg', name: 'Dewan Bandaraya Kuala Lumpur' },
    { img: 'approvals/mb-petaling-jaya.jpeg', name: 'Majlis Bandaraya Petaling Jaya' },
    { img: 'approvals/mb-ipoh.jpeg', name: 'Majlis Bandaraya Ipoh' },
    { img: 'approvals/mbsa-shah-alam.jpeg', name: 'Majlis Bandaraya Shah Alam' },
    { img: 'approvals/mb-melaka.jpg', name: 'Majlis Bandaraya Melaka Bersejarah' },
    { img: 'approvals/mp-pulau-pinang.jpg', name: 'Majlis Perbandaran Pulau Pinang' },
    { img: 'approvals/mp-manjung.gif', name: 'Majlis Perbandaran Manjung' },
    { img: 'approvals/mp-teluk-intan.jpg', name: 'Majlis Perbandaran Teluk Intan' },
    { img: 'approvals/mp-langkawi.jpg', name: 'Majlis Perbandaran Langkawi' },
    { img: 'approvals/md-kampar.gif', name: 'Majlis Daerah Kampar' }
  ];

  SITE.approvalsExtra = [
    'Majlis Daerah Kinta Barat', 'Majlis Perbandaran Taiping', 'Majlis Daerah Lenggong',
    'Majlis Daerah Kota Tinggi', 'Majlis Daerah Tanjong Malim'
  ];

  SITE.certs = [
    { img: 'approvals/sirim.jpeg', name: 'SIRIM QAS International', note: { en: 'Product certification R018/15', bm: 'Pensijilan produk R018/15' } },
    { img: 'approvals/samm.jpg', name: 'SAMM Accredited Testing', note: { en: 'Effluent analysis by accredited laboratory', bm: 'Analisis efluen oleh makmal terakreditasi' } },
    { img: 'approvals/cert-small.jpg', name: 'Industrial Design 10-00859-0101', note: { en: 'Registered industrial design', bm: 'Reka bentuk perindustrian berdaftar' } },
    { img: 'approvals/warranty-10year.jpg', name: '5+3 Year Warranty', note: { en: 'Factory and on-site cover', bm: 'Perlindungan kilang dan di tapak' } }
  ];

  /* -------------------------------------------------------------- awards */
  SITE.awards = [
    { img: 'certs/award-biogt.jpg', title: { en: 'Grease Trap Interceptor System approval, Majlis Perbandaran Manjung', bm: 'Kelulusan Sistem Perangkap Minyak, Majlis Perbandaran Manjung' }, year: '2010' },
    { img: 'certs/award-manjung.jpg', title: { en: 'Installation endorsement, Majlis Perbandaran Manjung', bm: 'Pengesahan pemasangan, Majlis Perbandaran Manjung' }, year: '2010' },
    { img: 'certs/award-teluk-intan.jpg', title: { en: 'Food premise installation approval, Majlis Perbandaran Teluk Intan', bm: 'Kelulusan pemasangan premis makanan, Majlis Perbandaran Teluk Intan' }, year: '2010' },
    { img: 'certs/award-kempen-patuhi.jpg', title: { en: 'Kempen Patuhi Undang-Undang recognition', bm: 'Pengiktirafan Kempen Patuhi Undang-Undang' }, year: '2008' },
    { img: 'certs/award-chemical-training.jpg', title: { en: 'Chemical Products training certificate, Global Compact Marketing', bm: 'Sijil latihan Produk Kimia, Global Compact Marketing' }, year: '2009' },
    { img: 'certs/award-union-laboratories.jpg', title: { en: 'Certificate of Analysis, Union Laboratories Sdn Bhd', bm: 'Sijil Analisis, Union Laboratories Sdn Bhd' }, year: '2009' },
    { img: 'certs/award-kementerian-kewangan.jpg', title: { en: 'Contractor registration, Kementerian Kewangan Malaysia', bm: 'Pendaftaran kontraktor, Kementerian Kewangan Malaysia' }, year: '2009' },
    { img: 'certs/award-sijil-penghargaan.jpg', title: { en: 'Sijil Penghargaan, Grease Trap Smart Environment Management', bm: 'Sijil Penghargaan, Pengurusan Alam Sekitar Pintar Perangkap Minyak' }, year: '2010' },
    { img: 'certs/award-dewan-negeri-perak.jpg', title: { en: 'Business endorsement, Pejabat Ahli Dewan Negeri Perak', bm: 'Sokongan perniagaan, Pejabat Ahli Dewan Negeri Perak' }, year: '2010' }
  ];

  /* ------------------------------------------------------ project gallery */
  /* These plates come from the company archive. Each one is a composite sheet
     of several completed installations with the site name printed on the
     image itself, so no separate caption is added here. */
  SITE.gallery = [
    { img: 'gallery/project-01.jpg' }, { img: 'gallery/project-02.jpg' },
    { img: 'gallery/project-03.jpg' }, { img: 'gallery/project-04.jpg' },
    { img: 'gallery/project-05.jpg' }, { img: 'gallery/project-06.jpg' },
    { img: 'gallery/project-07.jpg' }, { img: 'gallery/project-08.jpg' },
    { img: 'gallery/project-09.jpg' }, { img: 'gallery/project-10.jpg' },
    { img: 'gallery/project-11.jpg' }, { img: 'gallery/project-12.jpg' },
    { img: 'gallery/project-13.jpg' }, { img: 'gallery/project-14.jpg' },
    { img: 'gallery/project-15.jpg' }, { img: 'gallery/project-16.jpg' },
    { img: 'gallery/project-17.jpg' }, { img: 'gallery/project-18.jpg' }
  ];

  /* Named sites where our traps are installed, taken from the project plates. */
  SITE.clients = [
    { name: 'Petronas Gas Berhad', place: 'Terengganu' },
    { name: 'Universiti Teknologi Petronas', place: 'Perak' },
    { name: 'UEM Builders Berhad', place: 'Pulau Pinang' },
    { name: 'Carsem Sdn Bhd', place: 'Ipoh' },
    { name: 'Aalborg Portland cement plant', place: 'Ipoh, Perak' },
    { name: 'Alam Flora waste transfer station', place: 'Putrajaya' },
    { name: 'Hasrat Prestij Sdn Bhd', place: 'Melaka' },
    { name: 'Continental Resources Sdn Bhd', place: 'Kuala Langat' },
    { name: 'Synico Marketing Sdn Bhd', place: 'Sungai Soi, Kuantan' },
    { name: 'Caya Freight Holdings (Malaysia) Sdn Bhd', place: 'Shah Alam' },
    { name: 'Today Bakeries Products (Klang) Sdn Bhd', place: 'Klang' },
    { name: 'Restoran Bandar Cyber', place: 'Ipoh' },
    { name: '92 schools across Pulau Pinang', place: 'Pulau Pinang' },
    { name: 'Sekolah Menengah Sri Muda', place: 'Penaga, Pulau Pinang' },
    { name: 'Sekolah Menengah Kampung Kastam', place: 'Pulau Pinang' },
    { name: 'Kem PLKN Manjung', place: 'Perak' },
    { name: 'Tambun Hot Springs', place: 'Ipoh' },
    { name: 'Restoran Teluk Intan', place: 'Perak' }
  ];

  /* ---------------------------------------------------- dealer network */
  SITE.dealers = [
    { state: 'Perlis', list: [{ name: 'Advance Base Solution Sdn. Bhd.', addr: '66, Tingkat 2, Persiaran Sultan Abdul Hamid, 05050 Alor Star, Kedah' }] },
    { state: 'Kedah', list: [
      { name: 'Sirako Training & Consultancy', addr: '56, Jalan Impian, Taman Impian, Bt 42, Mk Pulai, 09100 Baling, Kedah' },
      { name: 'Phua Kean Aun', addr: '61, Taman Langkawi MK Kuah, 07000 Langkawi, Kedah' }
    ] },
    { state: 'Pulau Pinang', list: [{ name: 'GT Compact Technology Sdn Bhd', addr: '413-1-G, Wisma Chuan Bee, Lebuh Chulia, 10200 Penang' }] },
    { state: 'Perak', list: [
      { name: 'Biogt Recycle (M) Sdn. Bhd.', addr: '19, Laluan Tupai 2, Jalan Tupai, 34000 Taiping, Perak' },
      { name: 'WCT-BIOGT Builders (M) Sdn. Bhd.', addr: '15, Jalan Lapangan Siber 5, Bandar Siber Ipoh, 31350 Ipoh, Perak' }
    ] },
    { state: 'Selangor', list: [
      { name: 'Biopremium Sdn. Bhd.', addr: '1, Jalan SS21/39, Damansara Utama, Petaling Jaya, Selangor' },
      { name: 'B.Y.S. Trading', addr: '11, Jalan Sungai Keramat 20, Taman Klang Utama, 42100 Klang, Selangor' }
    ] },
    { state: 'Negeri Sembilan', list: [{ name: 'Sem Mah Hardware & Trading', addr: 'Lot 23, Lorong Haruan 5/1, Oakland Commerce Square, 70300 Seremban' }] },
    { state: 'Kuala Lumpur', list: [{ name: 'Moziey Bina Sdn. Bhd.', addr: '64/2 Jalan 8/23e, Taman Danau Kota, 53300 Kuala Lumpur' }] },
    { state: 'Pahang', list: [{ name: 'Bumi Salju Enterprise', addr: 'No 35, Jalan Bendera Puteri, Taman Bukit Bendera, 28400 Mentakab, Pahang' }] },
    { state: 'Johor', list: [
      { name: 'Syscorp Water (M) Sdn Bhd', addr: '74, Jalan Pulai Perdana 11/1, Sri Pulai Perdana, 81110 Johor Bahru, Johor' },
      { name: 'Newton Buildmate Sdn. Bhd.', addr: '6, Jalan Flora, Taman Flora, 83000 Batu Pahat, Johor' }
    ] },
    { state: 'Melaka', list: [
      { name: 'Biogt Group (M) Sdn Bhd', addr: '18, Jalan TTC 12 A, Taman Teknologi Cheng, 75250 Melaka' },
      { name: 'Azre Teguh Enterprise', addr: '183P, Pesta 2, Kg. Kenangan Tun Dr. Ismail 1, Jalan Bakri, 84000 Muar, Johor' }
    ] },
    { state: 'Kelantan', list: [
      { name: 'Srilati Resources', addr: 'Lot 5092, Kepas Apam, 17000 Pasir Mas, Kelantan' },
      { name: 'Sirako Training & Consultancy', addr: 'Lot 2395, Depan Balai Polis Chabang Empat, Sebelah Bangunan D’Mara, 16210 Tumpat, Kelantan' }
    ] },
    { state: 'Terengganu', list: [
      { name: 'Home Deco Trading', addr: '113 Depan Balai Polis, Cabang Tiga, 21300 Kuala Terengganu' },
      { name: 'Berusaha Recycle Enterprise', addr: 'Batu 6, Kampung Tuan Mandak, Jalan Kelantan, 21200 Kuala Terengganu' }
    ] }
  ];

  SITE.dealerVacancies = ['Sarawak', 'Sabah'];

  /* ----------------------------------------------------- buying methods */
  SITE.buying = [
    {
      icon: 'ph-chat-circle-dots',
      title: { en: 'Order direct on WhatsApp', bm: 'Pesan terus melalui WhatsApp' },
      body: {
        en: 'Send your sink count, daily meal volume and photos of the installation space. We reply with the right model, a price and a delivery date, usually the same day.',
        bm: 'Hantar bilangan sinki, jumlah hidangan harian dan gambar ruang pemasangan. Kami membalas dengan model yang sesuai, harga dan tarikh penghantaran, biasanya pada hari yang sama.'
      }
    },
    {
      icon: 'ph-bank',
      title: { en: 'Bank transfer and confirmation', bm: 'Pemindahan bank dan pengesahan' },
      body: {
        en: 'Transfer to the company account, then send the slip with your name and delivery address by WhatsApp. Stock ships by courier once payment clears.',
        bm: 'Buat pemindahan ke akaun syarikat, kemudian hantar slip berserta nama dan alamat penghantaran melalui WhatsApp. Stok dihantar melalui kurier sebaik pembayaran diterima.'
      }
    },
    {
      icon: 'ph-storefront',
      title: { en: 'Cash and carry at an authorised dealer', bm: 'Tunai dan bawa pulang di pengedar sah' },
      body: {
        en: 'Walk in to any dealer below for stock on hand and local installation support. Dealer pricing can differ between states.',
        bm: 'Kunjungi mana-mana pengedar di bawah untuk stok sedia ada dan sokongan pemasangan tempatan. Harga pengedar mungkin berbeza mengikut negeri.'
      }
    }
  ];

  SITE.buyingTerms = {
    en: [
      'Free delivery throughout West Malaysia. Sabah and Sarawak carry an RM100 delivery charge.',
      'GTA01 and GTS02 stock models normally arrive in 1 to 2 days. Other models take up to 7 days.',
      '5 year factory warranty plus 3 year on-site warranty on every grease trap.',
      'Installation takes about 5 minutes for undersink models. Use your own plumber or an authorised dealer plumber.'
    ],
    bm: [
      'Penghantaran percuma di seluruh Semenanjung Malaysia. Sabah dan Sarawak dikenakan caj penghantaran RM100.',
      'Model stok GTA01 dan GTS02 biasanya tiba dalam 1 hingga 2 hari. Model lain mengambil masa sehingga 7 hari.',
      'Waranti kilang 5 tahun serta waranti di tapak 3 tahun bagi setiap perangkap minyak.',
      'Pemasangan mengambil masa kira-kira 5 minit untuk model bawah sinki. Gunakan tukang paip anda sendiri atau tukang paip pengedar sah.'
    ]
  };

  /* -------------------------------------------------------------- careers */
  SITE.dealership = [
    {
      title: { en: 'Grease trap dealership', bm: 'Pengedar perangkap minyak' },
      qualify: {
        en: ['An office or shop lot with room to hold stock', 'Ability to carry a starting range of grease trap models', 'Agreement to follow published market pricing'],
        bm: ['Pejabat atau lot kedai dengan ruang menyimpan stok', 'Keupayaan menyimpan julat permulaan model perangkap minyak', 'Bersetuju mengikut harga pasaran yang diterbitkan']
      },
      benefit: {
        en: ['Every newly registered restaurant needs a grease trap to pass licensing', 'We route hundreds of enquiries a week from across Malaysia', 'Leads are passed to you, so you are not cold calling', 'One appointed dealer per state', 'Your company is listed on our website and in print'],
        bm: ['Setiap restoran baharu memerlukan perangkap minyak untuk lulus pelesenan', 'Kami menyalurkan ratusan pertanyaan setiap minggu dari seluruh Malaysia', 'Petunjuk pelanggan diberikan kepada anda, jadi anda tidak perlu memanggil pelanggan baharu', 'Satu pengedar dilantik bagi setiap negeri', 'Syarikat anda disenaraikan di laman web dan bahan cetak kami']
      }
    },
    {
      title: { en: 'Bio-enzyme sales agent', bm: 'Ejen jualan bio-enzim' },
      qualify: {
        en: ['Able to deliver stock to customers', 'Starter kit purchase to open the account'],
        bm: ['Berupaya menghantar stok kepada pelanggan', 'Pembelian kit permulaan untuk membuka akaun']
      },
      benefit: {
        en: ['Commission on every bio-enzyme sale you make', 'Existing customers in your area are passed to you', 'Payment terms of 30 days once established'],
        bm: ['Komisen bagi setiap jualan bio-enzim yang anda buat', 'Pelanggan sedia ada di kawasan anda diberikan kepada anda', 'Terma pembayaran 30 hari setelah mantap']
      }
    }
  ];

  SITE.jobs = [
    {
      role: { en: 'Plumber, pipe work', bm: 'Tukang paip' },
      location: 'Taiping, Perak',
      requirements: { en: ['Age 16 to 45', 'Conversational Malay', 'Based in or willing to relocate to Taiping'], bm: ['Umur 16 hingga 45', 'Boleh berbahasa Melayu', 'Menetap atau sanggup berpindah ke Taiping'] },
      benefits: { en: ['Bonus, allowance and overtime'], bm: ['Bonus, elaun dan kerja lebih masa'] }
    },
    {
      role: { en: 'Lorry driver', bm: 'Pemandu lori' },
      location: 'Taiping, Perak',
      requirements: { en: ['Age 18 to 40', 'Valid licence for commercial vehicles', 'Conversational Malay'], bm: ['Umur 18 hingga 40', 'Lesen sah untuk kenderaan komersial', 'Boleh berbahasa Melayu'] },
      benefits: { en: ['Bonus, allowance and overtime'], bm: ['Bonus, elaun dan kerja lebih masa'] }
    },
    {
      role: { en: 'General worker, fabrication', bm: 'Pekerja am, fabrikasi' },
      location: 'Taiping, Perak',
      requirements: { en: ['Age 16 to 35', 'Conversational Malay', 'Willing to work in a workshop environment'], bm: ['Umur 16 hingga 35', 'Boleh berbahasa Melayu', 'Sanggup bekerja dalam persekitaran bengkel'] },
      benefits: { en: ['Bonus, allowance and overtime'], bm: ['Bonus, elaun dan kerja lebih masa'] }
    }
  ];

  /* ------------------------------------------------------------- videos */
  SITE.videos = [
    { src: 'video/adu-installation.mp4', poster: 'products/adu9291p-4.webp', title: { en: 'Auto Dosing Unit installation walkthrough', bm: 'Panduan pemasangan Unit Dos Automatik' } },
    { src: 'video/centralized-grease-trap.mp4', poster: 'products/gta325-1.webp', title: { en: 'Centralized grease trap, in position', bm: 'Perangkap minyak berpusat, di kedudukan' } },
    { src: 'video/oil-interceptor-2.mp4', poster: 'products/oil-auto-1.webp', title: { en: 'Automatic oil interceptor in operation', bm: 'Pemintas minyak automatik beroperasi' } },
    { src: 'video/oil-interceptor-1.mp4', poster: 'products/oil-auto-3.webp', title: { en: 'Oil interceptor skimming cycle', bm: 'Kitaran menyisih pemintas minyak' } },
    { src: 'video/sewerage-service.mp4', poster: 'service/sewerage-3.webp', title: { en: 'Sewerage and manhole service team', bm: 'Pasukan servis pembetungan dan lurang' } }
  ];

  /* The company's own YouTube channel. Group ids match SITE.videoGroups
     below, which is what the video library page filters on. */
  SITE.youtube = [
    {
      id: 'bbV9tMLXP2A', group: 'factory', duration: '3:41', featured: true,
      title: { en: 'Manufacturing a grease trap', bm: 'Pembuatan perangkap minyak' },
      blurb: {
        en: 'Sheet to finished tank on our own factory floor: cutting, forming, welding the baffles, pressure testing and the final passivation before a trap is crated.',
        bm: 'Dari kepingan ke tangki siap di lantai kilang kami sendiri: pemotongan, pembentukan, kimpalan sekatan, ujian tekanan dan pempasifan akhir sebelum perangkap dipeti.'
      }
    },
    {
      id: 'lmJMpP_HPNs', group: 'company', duration: '4:12',
      title: { en: 'Kualiti Alam Hijau (M) Sdn Bhd', bm: 'Kualiti Alam Hijau (M) Sdn Bhd' },
      blurb: {
        en: 'The company profile. Two factories, a service fleet and a laboratory-tested product line, built up since 1996.',
        bm: 'Profil syarikat. Dua kilang, armada servis dan barisan produk yang diuji makmal, dibina sejak 1996.'
      }
    },
    {
      id: 'bYxrEcQvzaQ', group: 'install', duration: '2:58',
      title: { en: 'How to install a grease trap', bm: 'Cara pemasangan perangkap minyak' },
      blurb: {
        en: 'Position, set the fall, connect the inlet and outlet, seal, prime with water, commission. The whole sequence in Malay, filmed on a live installation.',
        bm: 'Letakkan, tetapkan kecerunan, sambungkan salur masuk dan keluar, kedapkan, isi dengan air, tauliahkan. Seluruh urutan dalam bahasa Melayu, dirakam pada pemasangan sebenar.'
      }
    },
    {
      id: '164EFtyTFa0', group: 'product', duration: '2:24',
      title: { en: 'Automatic grease trap', bm: 'Perangkap minyak automatik' },
      blurb: {
        en: 'The automatic unit running a full skim cycle, with the dosing head and the collection drum shown in operation.',
        bm: 'Unit automatik menjalankan kitaran menyisih penuh, dengan kepala dos dan tong pengumpul ditunjukkan semasa beroperasi.'
      }
    },
    {
      id: 'lJwMDvWpP0g', group: 'service', duration: '3:05',
      title: { en: 'Cleaning an underground grease trap', bm: 'Pembersihan perangkap minyak bawah tanah' },
      blurb: {
        en: 'A scheduled pump-out on a below-ground chamber: vacuum tanker, chamber wash, baffle inspection and documented waste removal.',
        bm: 'Pengepaman berjadual pada ruang bawah tanah: tangki vakum, cucian ruang, pemeriksaan sekatan dan pembuangan sisa berdokumen.'
      }
    },
    {
      id: 'z2BORASxI90', group: 'service', duration: '2:47',
      title: { en: 'Clearing a blocked drain', bm: 'Membersihkan longkang tersumbat' },
      blurb: {
        en: 'Hardened grease and silt cleared out of a commercial drain line with mechanical rodding and high pressure water.',
        bm: 'Gris keras dan kelodak dikeluarkan dari talian longkang komersial dengan rodding mekanikal dan air tekanan tinggi.'
      }
    },
    {
      id: '477_sZPkhxY', group: 'service', duration: '3:20',
      title: { en: 'Pipeline cleaning services', bm: 'Perkhidmatan pembersihan saluran paip' },
      blurb: {
        en: 'High pressure jetting through a main line, restoring the full bore of the pipe rather than punching a hole through the blockage.',
        bm: 'Jetting tekanan tinggi melalui talian utama, memulihkan keseluruhan bukaan paip dan bukan sekadar menembusi lubang pada sumbatan.'
      }
    }
  ];

  SITE.videoGroups = [
    { id: 'all',     label: { en: 'All videos', bm: 'Semua video' } },
    { id: 'factory', label: { en: 'Manufacturing', bm: 'Pembuatan' } },
    { id: 'product', label: { en: 'Products', bm: 'Produk' } },
    { id: 'install', label: { en: 'Installation', bm: 'Pemasangan' } },
    { id: 'service', label: { en: 'Services', bm: 'Perkhidmatan' } },
    { id: 'company', label: { en: 'Company', bm: 'Syarikat' } }
  ];

  /* youtube.com/embed is the privacy-preserving host and takes the same
     ids. Thumbnails come from the image CDN at a true 16:9 crop. */
  SITE.youtubeEmbed = function (id) {
    return 'https://www.youtube-nocookie.com/embed/' + id + '?rel=0&modestbranding=1';
  };
  SITE.youtubeThumb = function (id) {
    return 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
  };
  SITE.youtubeWatch = function (id) {
    return 'https://www.youtube.com/watch?v=' + id;
  };

  /* ---------------------------------------------------------- downloads */
  SITE.downloads = [
    { name: { en: 'Grease trap full model catalogue', bm: 'Katalog penuh model perangkap minyak' }, meta: 'PDF', icon: 'ph-file-pdf' },
    { name: { en: 'Auto Dosing Unit ADU9291P user manual', bm: 'Manual pengguna Unit Dos Automatik ADU9291P' }, meta: 'PDF', icon: 'ph-file-pdf' },
    { name: { en: 'GoodBac Bio-Enzyme product data sheet', bm: 'Lembaran data produk Bio-Enzim GoodBac' }, meta: 'PDF', icon: 'ph-file-pdf' },
    { name: { en: 'Installation guide, undersink models', bm: 'Panduan pemasangan, model bawah sinki' }, meta: 'PDF', icon: 'ph-file-pdf' },
    { name: { en: 'SIRIM certificate R018/15', bm: 'Sijil SIRIM R018/15' }, meta: 'PDF', icon: 'ph-certificate' },
    { name: { en: 'Dosing chart by grease trap model', bm: 'Carta dos mengikut model perangkap minyak' }, meta: 'PDF', icon: 'ph-table' }
  ];

  /* --------------------------------------------------------------- news */
  SITE.news = [
    {
      slug: 'sirim-certified-grease-trap',
      date: '2026-07-05',
      img: 'news/factory.webp',
      title: { en: 'Why a SIRIM-certified grease trap matters for commercial kitchens', bm: 'Mengapa perangkap minyak diperakui SIRIM penting untuk dapur komersial' },
      excerpt: {
        en: 'A certified trap has been tested against Malaysian quality and performance standards. It is the difference between a smooth municipal licensing inspection and a repeat visit.',
        bm: 'Perangkap yang diperakui telah diuji mengikut piawaian kualiti dan prestasi Malaysia. Ia menentukan sama ada pemeriksaan pelesenan majlis berjalan lancar atau perlu diulang.'
      },
      body: {
        en: [
          ['h', 'Why certification matters'],
          ['p', 'Grease traps are an essential part of every restaurant, cafe, hotel, food court, central kitchen and food manufacturing facility. A high quality trap does more than prevent drain blockages. It improves hygiene, protects the environment, and supports compliance with local authority requirements.'],
          ['p', 'A SIRIM-certified grease trap has been tested to meet Malaysian quality and performance standards. It provides confidence that the trap is designed to separate oil, grease and food waste efficiently while offering reliable performance for daily commercial use.'],
          ['ul', ['Meets Malaysian quality standards', 'Helps support smoother municipal licensing and inspections', 'Improves grease separation efficiency', 'Reduces drain blockages and costly plumbing repairs', 'Extends the lifespan of drainage systems']],
          ['h', 'Advanced 3-compartment design'],
          ['p', 'Not all grease traps perform the same. An advanced 3-compartment trap improves separation by allowing wastewater to pass through multiple chambers.'],
          ['p', 'The first compartment captures large food particles before they enter the separation chambers. The second lets oil and grease float to the surface while cleaner water continues through. The third provides additional separation, allowing cleaner water to exit into the drainage system while retaining remaining grease inside the unit.'],
          ['h', 'The basket sits above the water level'],
          ['p', 'One of the most important innovations is the basket positioned above the water line. In conventional traps the food waste basket sits submerged in dirty wastewater. Our hygienic design keeps food waste above the water surface.'],
          ['ul', ['Food waste stays dry instead of soaking in dirty wastewater', 'Reduces unpleasant odours', 'Easier and faster basket cleaning', 'Improves kitchen hygiene', 'Minimises bacterial growth']],
          ['h', 'Save maintenance costs'],
          ['p', 'A properly designed grease trap prevents grease accumulation inside drainage pipes. That reduces emergency drain blockages, lowers plumbing maintenance costs, extends drainage system lifespan and reduces trap cleaning frequency.'],
          ['h', 'Choosing a manufacturer'],
          ['p', 'When purchasing a grease trap, do not focus only on price. Look for SIRIM-certified quality, efficient 3-compartment separation, a basket positioned above the water level, durable corrosion-resistant construction, easy installation and maintenance, and reliable after-sales support.']
        ],
        bm: [
          ['h', 'Mengapa pensijilan penting'],
          ['p', 'Perangkap minyak adalah komponen penting bagi setiap restoran, kafe, hotel, medan selera, dapur berpusat dan kilang pemprosesan makanan. Perangkap berkualiti tinggi bukan sekadar menghalang penyumbatan longkang. Ia meningkatkan kebersihan, melindungi alam sekitar dan menyokong pematuhan kepada keperluan pihak berkuasa tempatan.'],
          ['p', 'Perangkap minyak diperakui SIRIM telah diuji untuk memenuhi piawaian kualiti dan prestasi Malaysia. Ia memberi keyakinan bahawa perangkap direka untuk memisahkan minyak, gris dan sisa makanan dengan cekap sambil menawarkan prestasi yang boleh diharap untuk kegunaan komersial harian.'],
          ['ul', ['Memenuhi piawaian kualiti Malaysia', 'Membantu melancarkan pelesenan dan pemeriksaan majlis', 'Meningkatkan kecekapan pemisahan gris', 'Mengurangkan penyumbatan longkang dan kos pembaikan paip', 'Memanjangkan jangka hayat sistem saliran']],
          ['h', 'Reka bentuk 3 ruang termaju'],
          ['p', 'Bukan semua perangkap minyak berprestasi sama. Perangkap 3 ruang termaju meningkatkan pemisahan dengan membenarkan air sisa melalui beberapa ruang.'],
          ['p', 'Ruang pertama menangkap zarah makanan besar sebelum memasuki ruang pemisahan. Ruang kedua membiarkan minyak dan gris terapung ke permukaan sementara air yang lebih bersih terus mengalir. Ruang ketiga memberikan pemisahan tambahan, membolehkan air lebih bersih keluar ke sistem saliran sambil mengekalkan baki gris di dalam unit.'],
          ['h', 'Bakul di atas paras air'],
          ['p', 'Salah satu inovasi paling penting ialah bakul yang diletakkan di atas paras air. Dalam perangkap konvensional, bakul sisa makanan tenggelam di dalam air sisa kotor. Reka bentuk higienik kami mengekalkan sisa makanan di atas permukaan air.'],
          ['ul', ['Sisa makanan kekal kering dan tidak direndam air kotor', 'Mengurangkan bau tidak menyenangkan', 'Pembersihan bakul lebih mudah dan cepat', 'Meningkatkan kebersihan dapur', 'Mengurangkan pertumbuhan bakteria']],
          ['h', 'Jimat kos penyelenggaraan'],
          ['p', 'Perangkap minyak yang direka dengan betul menghalang pengumpulan gris di dalam paip saliran. Ini mengurangkan penyumbatan kecemasan, menurunkan kos penyelenggaraan paip, memanjangkan hayat sistem saliran dan mengurangkan kekerapan pembersihan perangkap.'],
          ['h', 'Memilih pengeluar'],
          ['p', 'Semasa membeli perangkap minyak, jangan hanya menumpukan pada harga. Cari kualiti diperakui SIRIM, pemisahan 3 ruang yang cekap, bakul di atas paras air, binaan tahan karat, pemasangan dan penyelenggaraan mudah, serta sokongan selepas jualan yang boleh diharap.']
        ]
      }
    },
    {
      slug: 'auto-dosing-unit-lifetime-warranty',
      date: '2026-05-18',
      img: 'products/adu9291p-1.webp',
      title: { en: 'Malaysia’s first Auto Dosing Unit with a lifetime replacement warranty', bm: 'Unit Dos Automatik pertama Malaysia dengan waranti penggantian seumur hidup' },
      excerpt: {
        en: 'The ADU9291P pairs a 24-hour digital timer with an eight-cell battery vault, so scheduled enzyme dosing survives a thunderstorm power cut.',
        bm: 'ADU9291P menggabungkan pemasa digital 24 jam dengan lapan sel bateri, supaya dos enzim berjadual kekal berjalan walaupun bekalan elektrik terputus.'
      },
      body: {
        en: [
          ['h', 'Dosing that does not stop when the power does'],
          ['p', 'Most plug-in dosing pumps stop the moment the kitchen loses power. The ADU9291P pairs primary AC utility power with an integrated eight-cell AA emergency battery vault, protecting the internal mechanism from thunderstorm surges while maintaining scheduled operation during a total blackout.'],
          ['h', 'Unattended enzymatic dispersal'],
          ['p', 'A built-in 24-hour real-time digital controller handles precise flow calibration automatically after hours. No daily workforce intervention is required to dissolve fat and grease compounds.'],
          ['h', 'Built for a wet kitchen'],
          ['p', 'The unit is encased in a robust, moisture-resistant industrial housing engineered to withstand humid commercial dishwashing zones while actively mitigating stagnant drainage odours.'],
          ['h', 'What the warranty covers'],
          ['ul', ['1 year factory warranty plus lifetime ADU replacement warranty on a one-to-one exchange basis', 'Local factory support, made in Malaysia', 'Guaranteed 7 day shipping to any Malaysian destination']]
        ],
        bm: [
          ['h', 'Dos yang tidak berhenti apabila bekalan elektrik terputus'],
          ['p', 'Kebanyakan pam dos jenis palam berhenti sebaik sahaja dapur kehilangan bekalan elektrik. ADU9291P menggabungkan kuasa AC utama dengan lapan sel bateri AA kecemasan bersepadu, melindungi mekanisme dalaman daripada lonjakan ribu petir sambil mengekalkan operasi berjadual semasa gangguan bekalan sepenuhnya.'],
          ['h', 'Penyebaran enzim tanpa pengawasan'],
          ['p', 'Pengawal digital masa nyata 24 jam terbina dalam mengendalikan penentukuran aliran yang tepat secara automatik selepas waktu operasi. Tiada campur tangan pekerja harian diperlukan untuk melarutkan sebatian lemak dan gris.'],
          ['h', 'Dibina untuk dapur basah'],
          ['p', 'Unit ini dilindungi perumah industri tahan lembapan yang direka untuk menahan zon pencucian pinggan mangkuk komersial yang lembap sambil mengurangkan bau saliran bertakung.'],
          ['h', 'Liputan waranti'],
          ['ul', ['Waranti kilang 1 tahun serta waranti penggantian ADU seumur hidup secara pertukaran satu dengan satu', 'Sokongan kilang tempatan, dibuat di Malaysia', 'Penghantaran terjamin dalam 7 hari ke mana-mana destinasi di Malaysia']]
        ]
      }
    },
    {
      slug: 'grease-trap-cleaning-schedule',
      date: '2026-03-22',
      img: 'gallery/project-11.jpg',
      title: { en: 'How often should a commercial grease trap actually be cleaned?', bm: 'Berapa kerap perangkap minyak komersial perlu dibersihkan?' },
      excerpt: {
        en: 'The screen basket is a daily job for your own kitchen staff. The chamber pump-out is a scheduled service. Confusing the two is what causes the smell.',
        bm: 'Bakul penapis adalah tugas harian kakitangan dapur anda. Pengepaman ruang adalah servis berjadual. Kekeliruan antara keduanya menyebabkan bau.'
      },
      body: {
        en: [
          ['h', 'Two different jobs'],
          ['p', 'Before our service team arrives to pump grease, your kitchen staff should already be clearing the screen basket every day. If the basket is left, the trap stops functioning and starts to smell, no matter how recently the chambers were pumped.'],
          ['h', 'A workable schedule'],
          ['ul', ['Screen basket: emptied daily at close, by kitchen staff', 'Chamber inspection: weekly visual check of the grease blanket', 'Professional pump-out: every 1 to 3 months depending on meal volume', 'Bio-enzyme dosing: nightly, automatically, using an Auto Dosing Unit']],
          ['h', 'Why volume changes the interval'],
          ['p', 'A cafe running 40 to 150 meals a day on a GTA01 will need a very different interval from a food court running several thousand meals through a GTA3250. Use the maximum grease and waste water figure for your model as the guide, and book the service before the grease blanket reaches it.'],
          ['h', 'Booking a service'],
          ['p', 'Our service line covers grease trap pumping, sewerage and manhole clearing, POME pond desludging and scheduled waste collection with proper documentation.']
        ],
        bm: [
          ['h', 'Dua tugas berbeza'],
          ['p', 'Sebelum pasukan servis kami tiba untuk mengepam gris, kakitangan dapur anda sepatutnya sudah membersihkan bakul penapis setiap hari. Jika bakul dibiarkan, perangkap berhenti berfungsi dan mula berbau, walau seberapa baharu pun ruang itu dipam.'],
          ['h', 'Jadual yang praktikal'],
          ['ul', ['Bakul penapis: dikosongkan setiap hari semasa tutup, oleh kakitangan dapur', 'Pemeriksaan ruang: semakan visual mingguan pada lapisan gris', 'Pengepaman profesional: setiap 1 hingga 3 bulan bergantung pada jumlah hidangan', 'Dos bio-enzim: setiap malam, secara automatik, menggunakan Unit Dos Automatik']],
          ['h', 'Mengapa jumlah mengubah selang masa'],
          ['p', 'Sebuah kafe yang menyediakan 40 hingga 150 hidangan sehari menggunakan GTA01 memerlukan selang masa yang jauh berbeza daripada medan selera yang menyediakan beberapa ribu hidangan melalui GTA3250. Gunakan angka maksimum gris dan air sisa bagi model anda sebagai panduan, dan tempah servis sebelum lapisan gris mencapainya.'],
          ['h', 'Menempah servis'],
          ['p', 'Talian servis kami merangkumi pengepaman perangkap minyak, pembersihan pembetungan dan lurang, penyahenapan kolam POME serta kutipan sisa berjadual dengan dokumentasi yang lengkap.']
        ]
      }
    }
  ];

  /* ---------------------------------------------------------------- FAQ */
  SITE.faq = [
    {
      q: { en: 'What is a grease trap?', bm: 'Apakah itu perangkap minyak?' },
      a: {
        en: 'A grease trap is a plumbing device that slows wastewater as it leaves the kitchen so fats, oils and grease can float to the surface and food solids can settle, before the water reaches the public drain. Ours is a lightweight, durable tank built to municipal engineering requirements and specifications, and it installs easily inside a kitchen.',
        bm: 'Perangkap minyak ialah peranti paip yang memperlahankan air sisa semasa ia meninggalkan dapur supaya lemak, minyak dan gris dapat terapung ke permukaan dan pepejal makanan dapat mendap, sebelum air sampai ke longkang awam. Tangki kami ringan, tahan lama, dibina mengikut keperluan dan spesifikasi kejuruteraan majlis, dan mudah dipasang di dalam dapur.'
      }
    },
    {
      q: { en: 'Is the grease trap SIRIM certified?', bm: 'Adakah perangkap minyak ini diperakui SIRIM?' },
      a: {
        en: 'Yes. Our grease traps carry SIRIM product certification R018/15, and the registered industrial design number 10-00859-0101. Effluent samples have also been analysed by a SAMM accredited laboratory.',
        bm: 'Ya. Perangkap minyak kami memegang pensijilan produk SIRIM R018/15 dan nombor reka bentuk perindustrian berdaftar 10-00859-0101. Sampel efluen juga telah dianalisis oleh makmal terakreditasi SAMM.'
      }
    },
    {
      q: { en: 'What material is used to build the traps?', bm: 'Bahan apakah digunakan untuk membina perangkap?' },
      a: {
        en: 'Two options. 304 stainless steel for commercial kitchens that need thermal and chemical resistance, and reinforced fibreglass for lightweight underground and budget installations. Both are corrosion resistant and rated for wastewater above 100 degrees Celsius.',
        bm: 'Dua pilihan. Keluli tahan karat 304 untuk dapur komersial yang memerlukan rintangan haba dan kimia, serta gentian kaca diperkukuh untuk pemasangan bawah tanah yang ringan dan menjimatkan. Kedua-duanya tahan karat dan dinilai untuk air sisa melebihi 100 darjah Celsius.'
      }
    },
    {
      q: { en: 'How long is the warranty?', bm: 'Berapa lamakah tempoh waranti?' },
      a: {
        en: '5 year factory manufacturing warranty paired with an exclusive 3 year on-site warranty. On-site cover includes structural rust-through or material perforation under normal operating conditions. Damage from misuse, physical impact, bending, twisting or external human error is excluded.',
        bm: 'Waranti pembuatan kilang 5 tahun berserta waranti eksklusif 3 tahun di tapak. Perlindungan di tapak merangkumi karat menembusi struktur atau penebukan bahan dalam keadaan operasi biasa. Kerosakan akibat salah guna, hentaman fizikal, bengkokan, pemulasan atau kesilapan manusia luaran adalah dikecualikan.'
      }
    },
    {
      q: { en: 'How long does delivery take?', bm: 'Berapa lama penghantaran mengambil masa?' },
      a: {
        en: 'Stock models such as GTA01 and GTS02 normally arrive within 1 to 2 days. Other models take up to 7 days. Delivery is free throughout West Malaysia. Sabah and Sarawak carry an RM100 charge.',
        bm: 'Model stok seperti GTA01 dan GTS02 biasanya tiba dalam 1 hingga 2 hari. Model lain mengambil masa sehingga 7 hari. Penghantaran percuma di seluruh Semenanjung Malaysia. Sabah dan Sarawak dikenakan caj RM100.'
      }
    },
    {
      q: { en: 'What makes your Auto Dosing Unit different from a standard plug-in unit?', bm: 'Apakah yang membezakan Unit Dos Automatik anda daripada unit palam biasa?' },
      a: {
        en: 'Dual-layer power. The ADU9291P runs on AC utility power with an integrated eight-cell AA emergency battery vault, so a thunderstorm surge or a blackout does not interrupt the dosing schedule. It also carries a lifetime one-to-one replacement warranty.',
        bm: 'Kuasa dua lapisan. ADU9291P beroperasi dengan kuasa AC berserta lapan sel bateri AA kecemasan bersepadu, jadi lonjakan ribut petir atau gangguan bekalan tidak mengganggu jadual dos. Ia turut disertakan waranti penggantian satu dengan satu seumur hidup.'
      }
    },
    {
      q: { en: 'How often does a grease trap need professional servicing?', bm: 'Berapa kerap perangkap minyak memerlukan servis profesional?' },
      a: {
        en: 'The screen basket should be cleared daily by your own kitchen staff. A professional pump-out is typically needed every 1 to 3 months, depending on daily meal volume and whether you are dosing bio-enzyme nightly.',
        bm: 'Bakul penapis perlu dibersihkan setiap hari oleh kakitangan dapur anda. Pengepaman profesional biasanya diperlukan setiap 1 hingga 3 bulan, bergantung pada jumlah hidangan harian dan sama ada anda menggunakan dos bio-enzim setiap malam.'
      }
    },
    {
      q: { en: 'Do you supply custom sizes?', bm: 'Adakah anda membekalkan saiz tersuai?' },
      a: {
        en: 'Yes. Model GTA03 is built to customer specified dimensions. Send your structural drawings or site measurements and we will arrange a physical site evaluation or return a formal quotation within 1 to 2 business days.',
        bm: 'Ya. Model GTA03 dibina mengikut dimensi yang ditetapkan pelanggan. Hantar lukisan struktur atau ukuran tapak anda dan kami akan mengaturkan penilaian tapak fizikal atau mengembalikan sebut harga rasmi dalam 1 hingga 2 hari bekerja.'
      }
    },
    {
      q: { en: 'Which local authorities accept your grease trap?', bm: 'Pihak berkuasa tempatan manakah menerima perangkap minyak anda?' },
      a: {
        en: 'DBKL, Majlis Bandaraya Petaling Jaya, Ipoh, Shah Alam and Melaka Bersejarah, Majlis Perbandaran Pulau Pinang, Manjung, Teluk Intan, Taiping and Langkawi, plus Majlis Daerah Kampar, Kinta Barat, Lenggong, Kota Tinggi and Tanjong Malim, among others.',
        bm: 'DBKL, Majlis Bandaraya Petaling Jaya, Ipoh, Shah Alam dan Melaka Bersejarah, Majlis Perbandaran Pulau Pinang, Manjung, Teluk Intan, Taiping dan Langkawi, serta Majlis Daerah Kampar, Kinta Barat, Lenggong, Kota Tinggi dan Tanjong Malim, antara lain.'
      }
    }
  ];

  /* ------------------------------------------------------- installation */
  SITE.installSteps = [
    {
      img: 'install/step-1.jpg',
      title: { en: 'Position under the sink and set the fall', bm: 'Letakkan di bawah sinki dan tetapkan kecerunan' },
      body: {
        en: 'Place the unit directly below the sink waste outlet on a level, load-bearing surface. Keep a consistent gravity fall from the sink outlet to the trap inlet so wastewater never backs up into the bowl.',
        bm: 'Letakkan unit terus di bawah salur keluar sinki di atas permukaan rata yang boleh menanggung beban. Kekalkan kecerunan graviti yang konsisten dari salur keluar sinki ke salur masuk perangkap supaya air sisa tidak berpatah balik ke dalam besen.'
      }
    },
    {
      img: 'install/step-2.jpg',
      title: { en: 'Connect inlet and outlet, then seal', bm: 'Sambungkan salur masuk dan keluar, kemudian kedapkan' },
      body: {
        en: 'Fit the flexible hose to the inlet using the supplied tank connectors. Match the pipe size to the model, 1 1/4 inch through 6 inch depending on capacity. Seal every joint and confirm there is no lateral strain on the connector.',
        bm: 'Pasang hos fleksibel pada salur masuk menggunakan penyambung tangki yang dibekalkan. Padankan saiz paip dengan model, 1 1/4 inci hingga 6 inci bergantung pada kapasiti. Kedapkan setiap sambungan dan pastikan tiada tekanan sisi pada penyambung.'
      }
    },
    {
      img: 'install/step-3.jpg',
      title: { en: 'Prime with water, then commission', bm: 'Isi dengan air, kemudian tauliahkan' },
      body: {
        en: 'Fill the trap with clean water to the working level before first use, so the separation chambers work from day one. Run the sink for two minutes and check every joint. Brief the kitchen team on the daily basket clean before you hand over.',
        bm: 'Isi perangkap dengan air bersih sehingga paras operasi sebelum penggunaan pertama, supaya ruang pemisahan berfungsi dari hari pertama. Jalankan sinki selama dua minit dan periksa setiap sambungan. Terangkan kepada pasukan dapur tentang pembersihan bakul harian sebelum penyerahan.'
      }
    }
  ];

  /* ---------------------------------------------------------- lab tests */
  SITE.labTests = [
    {
      img: 'lab/input-report.jpg',
      title: { en: 'Total input: solids, oil and grease', bm: 'Jumlah input: pepejal, minyak dan gris' },
      body: {
        en: 'Raw kitchen wastewater sampled at the trap inlet before any separation takes place. This is the load the trap is asked to handle on a normal service day.',
        bm: 'Air sisa dapur mentah disampel di salur masuk perangkap sebelum sebarang pemisahan berlaku. Ini adalah beban yang perlu ditangani oleh perangkap pada hari operasi biasa.'
      }
    },
    {
      img: 'lab/output-report.jpg',
      title: { en: 'Total output: solids, oil and grease', bm: 'Jumlah output: pepejal, minyak dan gris' },
      body: {
        en: 'The same wastewater sampled at the outlet after passing through all three chambers. Analysis was carried out by Union Laboratories Sdn Bhd, a SAMM accredited testing laboratory.',
        bm: 'Air sisa yang sama disampel di salur keluar selepas melalui ketiga-tiga ruang. Analisis dijalankan oleh Union Laboratories Sdn Bhd, sebuah makmal ujian terakreditasi SAMM.'
      }
    },
    {
      img: 'lab/tested.jpg',
      title: { en: 'Field verification on a working kitchen', bm: 'Pengesahan lapangan di dapur beroperasi' },
      body: {
        en: 'Sampling was repeated on an installed unit in a live commercial kitchen rather than on a bench rig, so the result reflects real service conditions.',
        bm: 'Pensampelan diulang pada unit yang dipasang di dapur komersial yang beroperasi dan bukan pada pelantar ujian, jadi keputusannya mencerminkan keadaan servis sebenar.'
      }
    }
  ];

  /* ----------------------------------------------------------- policies */
  SITE.policies = [
    {
      id: 'privacy',
      title: { en: 'Privacy policy', bm: 'Dasar privasi' },
      body: {
        en: [
          ['p', 'This policy explains what we collect when you contact us through this website, and what we do with it.'],
          ['h', 'What we collect'],
          ['p', 'When you submit an enquiry form we collect your name, mobile number, email address, the product or service you selected, and your message. We do not collect payment details through this website.'],
          ['h', 'How we use it'],
          ['ul', ['To reply to your enquiry and prepare a quotation', 'To arrange a site evaluation, delivery or installation', 'To keep a record of warranty registration for units you purchase']],
          ['h', 'Who we share it with'],
          ['p', 'We share your details with an authorised dealer only when your enquiry is routed to them for local service, and with our appointed courier when arranging delivery. We do not sell contact information.'],
          ['h', 'Retention and your rights'],
          ['p', 'Enquiry records are retained for as long as the warranty on any purchased unit remains active. You may ask us to correct or delete your details at any time by emailing contact@kahgroup.com.my.']
        ],
        bm: [
          ['p', 'Dasar ini menerangkan apa yang kami kumpulkan apabila anda menghubungi kami melalui laman web ini, dan apa yang kami lakukan dengannya.'],
          ['h', 'Apa yang kami kumpulkan'],
          ['p', 'Apabila anda menghantar borang pertanyaan, kami mengumpulkan nama, nombor telefon, alamat e-mel, produk atau perkhidmatan yang anda pilih, dan mesej anda. Kami tidak mengumpulkan butiran pembayaran melalui laman web ini.'],
          ['h', 'Bagaimana kami menggunakannya'],
          ['ul', ['Untuk membalas pertanyaan anda dan menyediakan sebut harga', 'Untuk mengatur penilaian tapak, penghantaran atau pemasangan', 'Untuk menyimpan rekod pendaftaran waranti bagi unit yang anda beli']],
          ['h', 'Dengan siapa kami berkongsi'],
          ['p', 'Kami berkongsi butiran anda dengan pengedar sah hanya apabila pertanyaan anda disalurkan kepada mereka untuk servis tempatan, dan dengan kurier lantikan kami semasa mengatur penghantaran. Kami tidak menjual maklumat perhubungan.'],
          ['h', 'Penyimpanan dan hak anda'],
          ['p', 'Rekod pertanyaan disimpan selagi waranti bagi mana-mana unit yang dibeli masih aktif. Anda boleh meminta kami membetulkan atau memadam butiran anda pada bila-bila masa dengan menghantar e-mel ke contact@kahgroup.com.my.']
        ]
      }
    },
    {
      id: 'terms',
      title: { en: 'Terms of use', bm: 'Terma penggunaan' },
      body: {
        en: [
          ['p', 'By using this website you accept the terms below.'],
          ['h', 'Product information'],
          ['p', 'Specifications, dimensions and capacities are published in good faith and are subject to change as designs are improved. Confirm the current specification in writing before placing an order for a critical installation.'],
          ['h', 'Pricing and quotations'],
          ['p', 'Prices are issued by quotation and are valid for the period stated on that quotation. Dealer pricing may differ between states. A quotation is not an offer of stock availability until confirmed.'],
          ['h', 'Warranty'],
          ['p', 'Grease traps carry a 5 year factory warranty and a 3 year on-site warranty. Cover applies to structural rust-through or material perforation under normal operating conditions. Misuse, physical impact, bending, twisting and external human error are excluded.'],
          ['h', 'Intellectual property'],
          ['p', 'Product names, the registered industrial design 10-00859-0101, photography and written content on this site belong to Kualiti Alam Hijau (M) Sdn Bhd and may not be reproduced without written permission.']
        ],
        bm: [
          ['p', 'Dengan menggunakan laman web ini, anda menerima terma di bawah.'],
          ['h', 'Maklumat produk'],
          ['p', 'Spesifikasi, dimensi dan kapasiti diterbitkan dengan niat baik dan tertakluk kepada perubahan apabila reka bentuk ditambah baik. Sahkan spesifikasi semasa secara bertulis sebelum membuat pesanan bagi pemasangan kritikal.'],
          ['h', 'Harga dan sebut harga'],
          ['p', 'Harga dikeluarkan melalui sebut harga dan sah untuk tempoh yang dinyatakan pada sebut harga tersebut. Harga pengedar mungkin berbeza mengikut negeri. Sebut harga bukan tawaran ketersediaan stok sehingga disahkan.'],
          ['h', 'Waranti'],
          ['p', 'Perangkap minyak disertakan waranti kilang 5 tahun dan waranti di tapak 3 tahun. Perlindungan terpakai bagi karat menembusi struktur atau penebukan bahan dalam keadaan operasi biasa. Salah guna, hentaman fizikal, bengkokan, pemulasan dan kesilapan manusia luaran dikecualikan.'],
          ['h', 'Harta intelek'],
          ['p', 'Nama produk, reka bentuk perindustrian berdaftar 10-00859-0101, fotografi dan kandungan bertulis di laman ini adalah milik Kualiti Alam Hijau (M) Sdn Bhd dan tidak boleh diterbitkan semula tanpa kebenaran bertulis.']
        ]
      }
    }
  ];

  root.PM_SITE = SITE;
})(window);
