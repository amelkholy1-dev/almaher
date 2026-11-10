/* =========================================================
   Ahmed Maher Alkholy — main.js
   - اللغة (عربي/إنجليزي) + الوضع الليلي
   - فلتر المشاريع، والمعارض، وعارض الصور، والفيديو
   - نموذج التواصل (واتساب / إيميل)
   - تحميل العروض التفاعلية عند الطلب
   ========================================================= */
(function () {
  'use strict';

  /* ---------------- إعدادات سهلة التعديل ---------------- */
  var CONFIG = {
    whatsapp: '201552084471',
    email: 'am.elkholy1@gmail.com',
    cv: { ar: 'assets/cv/Ahmed-Alkholy-CV-AR.pdf', en: 'assets/cv/Ahmed-Alkholy-CV-EN.pdf' },
    // المعارض: الموقع بيدوّر على الصور بالترتيب (1، 2، 3 ...) لحد الرقم max، وبيعرض الموجود بس.
    galleries: {
      ops:        { path: 'assets/img/projects/masar-ops-',    ext: 'png', max: 12, ar: 'نظام مسار للعمليات', en: 'Masar Operations' },
      hr:         { path: 'assets/img/projects/masar-hr-',     ext: 'png', max: 12, ar: 'نظام مسار للموارد البشرية', en: 'Masar HR' },
      wesal:      { path: 'assets/img/projects/wesal-',        ext: 'jpg', max: 12, ar: 'تطبيق وصال', en: 'Wesal app' },
      sites:      { path: 'assets/img/projects/site-',         ext: 'png', max: 12, ar: 'المواقع', en: 'Websites' },
      commission: { path: 'assets/img/projects/commission-',   ext: 'png', max: 6,  ar: 'منصة التسويق بالعمولة', en: 'Affiliate platform' },
      store:      { path: 'assets/img/projects/store-',        ext: 'png', max: 6,  ar: 'المتجر الإلكتروني', en: 'Online store' },
      excel:      { path: 'assets/img/projects/excel-sample-', ext: 'png', max: 6,  ar: 'نموذج Excel', en: 'Excel template' },
      designs:    { path: 'assets/img/designs/design-',        ext: 'jpg', max: 30, ar: 'تصميم', en: 'Design' }
    }
  };

  var WA_MSG = {
    general: { ar: 'مرحباً أحمد، وصلت إليك من موقعك الشخصي وأودّ التواصل معك.', en: 'Hi Ahmed, I found you through your website and would like to get in touch.' },
    ops: { ar: 'مرحباً أحمد، شاهدت «نظام مسار للعمليات والحسابات» على موقعك، وأرغب في ديمو مباشر للنظام.', en: 'Hi Ahmed, I saw the Masar Operations & Accounts System on your website and would like a live demo.' },
    hr: { ar: 'مرحباً أحمد، شاهدت «نظام مسار للموارد البشرية والتوظيف» على موقعك، وأرغب في ديمو مباشر للنظام.', en: 'Hi Ahmed, I saw the Masar HR system on your website and would like a live demo.' },
    app: { ar: 'مرحباً أحمد، شاهدت «تطبيق وصال» على موقعك، وأرغب في معرفة المزيد عنه.', en: 'Hi Ahmed, I saw the Wesal app on your website and would like to know more.' },
    web: { ar: 'مرحباً أحمد، شاهدت مواقع الشركات ولوحات التحكم على موقعك، وأرغب في موقع مشابه.', en: 'Hi Ahmed, I saw your company websites and admin panels and would like a similar website.' }
  };

  /* ---------------- الترجمة الإنجليزية ----------------
     النص العربي موجود في index.html نفسه، وده المقابل الإنجليزي لكل مفتاح */
  var EN = {
    'skip': 'Skip to content', 'brand': 'Ahmed Alkholy',
    'nav.about': 'About', 'nav.services': 'Services', 'nav.projects': 'Projects', 'nav.experience': 'Experience', 'nav.skills': 'Skills', 'nav.contact': 'Contact me',
    'hero.hello': "Hi, I'm", 'hero.name': 'Ahmed Maher Alkholy',
    'hero.role': 'Business Systems &amp; Web Developer • Systems &amp; Support Specialist',
    'hero.lead': 'I build business management systems, websites and mobile apps that are in real use inside companies — from understanding the need to deployment, training and support. Alongside that, I have hands-on experience in IT support, networking and data management.',
    'hero.avail': 'Available for:', 'mode.site': 'On-site full-time', 'mode.remote': 'Remote', 'mode.free': 'Freelance projects',
    'hero.loc': 'Giza, Egypt — Egypt, the Gulf &amp; remote',
    'hero.cv': 'Download CV', 'hero.work': 'See my work', 'hero.cvalt': 'السيرة الذاتية بالعربي',
    'photo.alt': 'Ahmed Maher Alkholy',
    'chip.dev': 'Systems • Websites • Apps', 'chip.support': 'IT support &amp; networks',
    'st.1v': 'Nearly 4', 'st.1': 'years of experience', 'st.2': 'projects: systems, websites &amp; apps', 'st.3': 'users working on my systems', 'st.4': 'social media designs',
    'about.k': 'About me', 'about.t': 'I turn the way a company works into a clear system that runs',
    'about.p1': "I'm Ahmed Maher Alkholy from Giza, Egypt. Since February 2023 I have been working at an overseas recruitment office, responsible for IT support and the network, organizing data and archiving, and following up procedures for thousands of files. Out of that daily work, I built the office a central system for files and accounts that replaced scattered Excel files and paperwork and became its core system.",
    'about.p2': 'I then developed an HR &amp; recruitment system now running in several companies, company websites with full admin panels, and an Android mobile app. I own projects end to end: needs analysis, workflow design, development, testing, deployment on hosting or the company network, then user training and support.',
    'about.p3': '<strong>Looking for:</strong> a full-time on-site role in Egypt or the Gulf, remote work, or freelance projects — in systems and web development, IT support and systems operation, or administrative and data work.',
    'fact.exp.t': 'Experience', 'fact.exp': 'Nearly 4 years (since Feb 2023)',
    'fact.edu.t': 'Education', 'fact.edu': 'Bachelor of Specific Education – Educational Technology &amp; Computer, Menoufia University (2018–2022) – Grade: Good (High)',
    'fact.lang.t': 'Languages', 'fact.lang': 'Arabic (native), English (good reading &amp; writing)',
    'fact.loc.t': 'Location &amp; availability', 'fact.loc': 'Giza, Egypt — open to shift work and relocation within Egypt and the GCC, or remote work',
    'fact.lic.t': 'Driving license', 'fact.lic': 'Car and motorcycle',
    'pr.k': 'How I work', 'pr.t': 'From idea to a running system', 'pr.s': 'The same steps I followed in every system and website I delivered.',
    'p1.t': 'Understand the need', 'p1.d': 'I sit with the owners and staff and understand the current procedures and their pain points.',
    'p2.t': 'Design the workflow', 'p2.d': 'I define the screens, stages, permissions and reports before building.',
    'p3.t': 'Build in stages', 'p3.d': 'I build the system piece by piece and show every stage to the client.',
    'p4.t': 'Test &amp; migrate data', 'p4.d': 'I test on sample data and migrate the old data from Excel.',
    'p5.t': 'Deploy &amp; train', 'p5.d': 'I deploy on the company network or hosting and train the staff.',
    'p6.t': 'Support &amp; updates', 'p6.d': 'Follow-up after launch, changes and updates, and regular backups.',
    'sv.k': 'Services', 'sv.t': 'How can I help?', 'sv.s': 'As a full-time on-site employee, remotely, or per project.',
    'tag.site': 'On-site', 'tag.remote': 'Remote', 'tag.free': 'Freelance',
    's1.t': 'Business systems development', 's1.d': 'Custom systems for operations, accounts and HR: permissions, stage tracking, reports, Excel and PDF export, and backups.',
    's2.t': 'Company websites &amp; admin panels', 's2.d': 'Fast, mobile-friendly Arabic/English websites with an admin panel the owner uses to edit all the content.',
    's3.t': 'Mobile apps', 's3.d': 'Android apps with a modern interface that work offline and sync automatically, with notifications and sign-in.',
    's4.t': 'AI integration in systems', 's4.d': 'Reading CVs and documents and extracting their data, and matching candidates to jobs — with multiple providers such as Gemini, Claude and OpenAI.',
    's5.t': 'IT support &amp; networking', 's5.d': 'Installing Windows and software, fixing hardware issues, local networks and routers, printers, remote access (static IP and port forwarding), and backups.',
    's6.t': 'Systems deployment &amp; training', 's6.d': 'Running management systems inside the company, migrating data from Excel, training staff, and post-launch support.',
    's7.t': 'Data &amp; Excel', 's7.d': 'Fast, accurate data entry, organizing Excel files, converting PDFs and images to Word and Excel, and archiving.',
    's8.t': 'Administrative operations', 's8.d': 'Following up procedures and files, coordinating tasks, dealing with different parties, and preparing reports for management.',
    's9.t': 'Social media design', 's9.d': 'Ads and posts with Canva and Photoshop, and managing pages and paid ads on Meta Business Suite.',
    'pj.k': 'Portfolio', 'pj.t': 'Projects &amp; interactive demos',
    'pj.s': 'Systems, websites and apps I delivered that are in real use. Try the interactive demos yourself, or request a live demo of the full system.',
    'f.all': 'All', 'f.sys': 'Systems', 'f.web': 'Websites', 'f.app': 'Apps', 'f.other': 'Other',
    'pj.live': 'Running in several companies • online or on the local network', 'pj.live2': 'Running in several companies • cloud-hosted',
    'pj.offline': 'Works offline', 'pj.online': 'Live', 'pj.dev': 'In development',
    'type.sys': 'Management system', 'type.ats': 'ATS / recruitment', 'type.app': 'Android app', 'type.travel': 'Travel, Hajj &amp; Umrah', 'type.cons': 'Construction',
    'pj.shots': 'Screenshots', 'pj.appshots': 'App screenshots', 'pj.siteshots': 'Website screenshots', 'pj.video': 'Demo video',
    'ops.t': 'Masar Operations &amp; Accounts System', 'ops.alt': 'Passport system — نظام مسار للعمليات والحسابات',
    'ops.d': 'A complete system for overseas recruitment and travel offices: dozens of screens covering passports, visas, travel and accounts, on a database of more than 130 tables. I migrated it from SQL Server on the office PC to MySQL on cloud hosting, with tests confirming the data and financial figures come out identical.',
    'ops.f1': 'Passport and document management with a barcode for every file, and search by name, passport no., national ID or mobile',
    'ops.f2': 'Reading passport data from the image (online OCR) to register a file in seconds, plus a print agent for barcode printers and scanners',
    'ops.f3': 'Stage tracking: medical check, fingerprint, online registration, consulate, visa and travel, with periodic follow-up',
    'ops.f4': 'Accounts: clients, agents and commissions, employees, the full treasury, and company revenue and expenses',
    'ops.f5': 'Lists and reports (flights, passports, fingerprints, visas, financial reports) with Excel and PDF export',
    'ops.f6': 'Security: server-checked permissions, admin two-factor authentication, new-device approval, audit log, automatic daily backups, and real-time internal chat',
    'hr.t': 'Masar HR &amp; Recruitment System', 'hr.alt': 'نظام مسار للموارد البشرية والتوظيف',
    'hr.d': 'A complete recruitment system: from receiving a CV and reading it with AI, to matching candidates with company requests and tracking them all the way to travel.',
    'hr.f1': 'Inbox: AI reads CVs (PDF, Word, images) and turns them into structured records reviewed before approval',
    'hr.f2': 'Candidate bank with profession-specific fields, quick search and search inside CV text, and duplicate detection and merging',
    'hr.f3': 'Orders: AI reads the company’s demand letter, and matching with “must / important / preferred” requirements groups candidates into matched, needs confirmation and missing a requirement',
    'hr.f4': 'Kanban pipeline up to travel, a procedures table (medical, police record, contract, visa, ticket), plus tasks and follow-ups',
    'hr.f5': 'CV maker with 20 Arabic/English templates, and Excel, PDF, image and ZIP export',
    'hr.f6': 'Protected public application links, an agents portal, and application tracking by number',
    'hr.f7': 'Security: two-factor authentication, device approval, audit log, 35 granular permissions, and field-level restrictions',
    'hr.f8': 'Multiple AI providers (Gemini, Claude, OpenAI and local models) with usage tracking',
    'ws.t': 'Wesal app', 'ws.alt': '“A step from you, a step from me.” — وصال',
    'ws.d': 'An Arabic Android app for habits, tasks and worship — alone or with family and friends — updated from inside the app without a store.',
    'ws.f1': '“Today”: tasks and habits split into morning, afternoon and night, plus a home-screen widget',
    'ws.f2': 'Spaces: a personal space or one shared with family and friends, with points, contests, rewards and encouragement',
    'ws.f3': 'Worship: prayer times, a full-screen adhan, tracking of prayers, sunnah and make-up prayers, plus adhkar and Hisn al-Muslim',
    'ws.f4': 'The full Quran with tafsir and tajweed, a daily portion and khatma, and step-by-step memorization: listening, graded memorizing, exercises, voice recitation and timed review',
    'ws.f5': 'Seasons: Ramadan, the two Eids and the first ten days of Dhul Hijjah, with ready habits, family contests and a look that changes with the season',
    'ws.f6': 'Tools: life goals, money (plan and envelopes), health and medicines, focus, screen-time limits, and a journal',
    'ws.f7': 'Works offline and syncs automatically, with Google sign-in',
    'btn.demo': 'Try the interactive demo', 'btn.live': 'Request a live demo', 'btn.app': 'Try the app', 'btn.cms': 'Try the admin panel', 'btn.apk': 'Download the app (APK)', 'btn.visit': 'Visit website',
    'pj.webs': 'Company websites &amp; admin panels', 'pj.others': 'Other projects',
    'w1.t': 'Nasr Al Khaleej — Egyptian Manpower Recruitment Abroad', 'w1.d': 'An Arabic/English company website with a full admin panel the team uses to edit all content.',
    'w1.f1': 'Jobs with codes, search and filters, and forms sent via WhatsApp or email',
    'w1.f2': 'A ready-to-post image for every job with a QR code, and direct publishing to Facebook',
    'w1.f3': 'Visit statistics, sources and WhatsApp clicks — without cookies',
    'w1.f4': 'Users and permissions, two-factor authentication, and an audit log',
    'w1.f5': 'Secure link with the recruitment system: application links, agents portal and application tracking',
    'w2.t': 'Forsan Go — Travel &amp; Tourism', 'w2.d': 'A website for a Hajj, Umrah, visas and flights company, with a full admin panel.',
    'w2.f1': 'Hajj and Umrah packages with prices, dates and features', 'w2.f2': 'A booking form that fills itself when “Book this package” is clicked',
    'w2.f3': 'Visa destinations, a traveller’s guide and FAQs', 'w2.f4': 'A jobs-abroad section linked to the recruitment system',
    'w3.cover': 'Contracting', 'w3.t': 'Rockline Contracting website', 'w3.d': 'A contracting company website built on the same content management platform, with new additions.',
    'w3.f1': 'Visual editing mode: the admin sees the page exactly as visitors do and edits it in place', 'w3.f2': 'Maintenance mode during updates', 'w3.f3': 'A full admin panel for content, images, news and messages',
    'cm.t': 'Affiliate marketing platform', 'cm.d': 'A platform for managing affiliate marketing: marketers promote products with their own links and earn a commission on every sale.',
    'sh.t': 'Online store', 'sh.d': 'An online store for showcasing products and receiving orders online.',
    'xl.t': 'Excel template – Clients &amp; payments register', 'xl.d': 'An organized Excel template for recording client data and tracking their payments.', 'xl.btn': 'Download the template',
    'ds.t': 'Social media designs', 'ds.d': 'A selection of ads and posts I designed with Canva and Photoshop.',
    'ex.k': 'Experience', 'ex.t': 'Work experience',
    'e1.date': 'Feb 2023 – Present', 'e1.r': 'Operations &amp; Systems Coordinator', 'e1.c': 'Nasr Al Khaleej Office for Recruiting Egyptian Manpower Abroad – Giza, Egypt',
    'e1.b1': 'Replaced scattered Excel files and paper records with a central database system I developed; it became the core system the office relies on for records, process tracking and accounts.',
    'e1.b2': 'Reduced file registration time from minutes to seconds using OCR data extraction and quick-entry features.',
    'e1.b3': 'Designed a numbering and archiving system that links every paper file to its digital record; passport losses stopped completely after implementation.',
    'e1.b4': 'Provide IT support for 9 office workstations: system and software installation, troubleshooting, local network setup, printers, scanners and backups.',
    'e1.b5': 'Track multi-stage procedures (medical checks, consular procedures, visas and travel) for thousands of client files, working with government offices and partners.',
    'e1.b6': 'Design company ads and social media posts, and manage company pages and paid campaigns via Meta Business Suite.',
    'e2.date': 'Jan 2024 – Present', 'e2.r': 'Independent Business Systems &amp; Web Developer', 'e2.c': 'Freelance – Remote',
    'e2.b1': 'Designed and built two business management systems now used by several companies, with 20+ active users.',
    'e2.b2': 'Developed company websites with full admin panels, and an Android mobile app.',
    'e2.b3': 'Handle the full cycle: understanding client needs, designing workflows, building, testing, presenting demos to clients, and closing sales.',
    'e2.b4': 'Deploy systems on company computers over local networks or on hosting, configure remote access (static IP, port forwarding, firewall), and manage backups.',
    'e2.b5': 'Train staff to use the systems and provide technical support, changes and updates after launch.',
    'e3.date': 'May 2025 – Aug 2025', 'e3.r': 'Transport Operations Coordinator (Temporary Assignment)', 'e3.c': 'Hussein Hegazy Transport and Umrah Company – Makkah, Saudi Arabia',
    'e3.b1': 'Coordinated transport trips for pilgrims and staff, managing schedules and timings with drivers and operations teams.',
    'e3.b2': 'Handled last-minute changes and urgent cases, and prepared daily operations reports.',
    'e3.b3': 'Worked in office and field roles on extended shifts during a high-pressure season.',
    'sk.k': 'Skills', 'sk.t': 'Skills &amp; tools',
    'sk.g1': 'Web &amp; systems development', 'sk.g2': 'Databases &amp; deployment', 'sk.g3': 'Artificial intelligence', 'sk.g4': 'Mobile apps', 'sk.g5': 'Security',
    'sk.g6': 'IT support &amp; networking', 'sk.g7': 'Data &amp; office', 'sk.g8': 'Operations &amp; administration', 'sk.g9': 'Design &amp; marketing',
    'sk.c1': 'Software &amp; driver installation', 'sk.c2': 'Hardware troubleshooting', 'sk.c3': 'Local networks (LAN)', 'sk.c4': 'Routers &amp; static IP', 'sk.c5': 'Printers &amp; scanners', 'sk.c6': 'Backup &amp; restore',
    'sk.c7': 'Data entry &amp; verification', 'sk.c9': 'Digital &amp; paper archiving', 'sk.c10': 'Reporting',
    'sk.c11': 'Procedure follow-up', 'sk.c13': 'Needs analysis', 'sk.c14': 'Systems deployment', 'sk.c15': 'User training', 'sk.c17': 'Page management', 'sk.c18': 'Paid ads',
    'sk.c19': 'Document data extraction', 'sk.c20': 'Candidate matching', 'sk.c21': 'Local models (Ollama)', 'sk.c22': 'Notifications', 'sk.c23': 'Offline-first &amp; sync',
    'sk.c24': 'Two-factor auth (2FA)', 'sk.c25': 'Granular permissions', 'sk.c26': 'Audit logs', 'sk.c27': 'Data encryption', 'sk.c28': 'Firewall',
    'sk.c29': 'Amadeus (basic)', 'sk.c30': 'Workflow mapping', 'sk.c31': 'Data migration from Excel', 'sk.c32': 'System demos &amp; sales',
    'ct.k': 'Contact', 'ct.t': "Let's talk",
    'ct.s': 'Whether you have a job, a system, website or app project, or want a live demo of one of the systems, I’d be glad to hear from you.',
    'ct.email': 'Email', 'ct.wa': 'WhatsApp', 'ct.loc': 'Location', 'ct.locv': 'Giza, Egypt — available on-site in Egypt and the Gulf, and remotely',
    'cf.t': 'Send a quick message', 'cf.name': 'Name', 'cf.topic': 'Subject',
    'cf.o1': 'Job opportunity', 'cf.o5': 'Build a system, website or app', 'cf.o2': 'Other freelance project', 'cf.o3': 'Live demo of a system', 'cf.o4': 'Something else',
    'cf.msg': 'Message', 'cf.wa': 'Send via WhatsApp', 'cf.mail': 'Send by email',
    'ft.name': 'Ahmed Maher Alkholy', 'ft.role': 'Business Systems &amp; Web Developer • Systems &amp; Support Specialist',
    'demo.notice': 'Interactive demo with sample data – the full system is available on request',
    'demo.loading': 'Loading the demo…'
  };

  var META = {
    ar: { title: null, desc: null },
    en: { title: 'Ahmed Maher Alkholy | Business Systems & Web Developer • Systems & Support Specialist',
          desc: 'Ahmed Maher Alkholy – business systems, websites and apps developer, and systems & support specialist in Giza, Egypt. Operations, accounts and HR systems, company websites with admin panels, Android apps, IT support and networking. Available on-site in Egypt and the Gulf, and remotely.' }
  };

  var MSG = {
    cvMissing: { ar: 'السيرة الذاتية ستُضاف قريباً. يمكنك التواصل معي مباشرة.', en: 'The CV will be added soon. Feel free to contact me directly.' },
    formName: { ar: 'من فضلك اكتب اسمك والرسالة.', en: 'Please enter your name and message.' },
    topics: {
      job: { ar: 'فرصة عمل', en: 'Job opportunity' }, dev: { ar: 'تطوير نظام أو موقع أو تطبيق', en: 'Build a system, website or app' },
      free: { ar: 'مشروع حر', en: 'Freelance project' }, demo: { ar: 'ديمو مباشر لأحد الأنظمة', en: 'Live demo of a system' }, other: { ar: 'موضوع آخر', en: 'Other' }
    },
    from: { ar: 'الاسم', en: 'Name' }, subj: { ar: 'الموضوع', en: 'Subject' },
    langLabel: { ar: 'English', en: 'العربية' }
  };

  var doc = document, root = doc.documentElement;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------------- Language ---------------- */
  var AR = {}, AR_ATTR = {};
  $$('[data-i18n]').forEach(function (el) { var k = el.getAttribute('data-i18n'); if (!(k in AR)) AR[k] = el.innerHTML; });
  $$('[data-i18n-attr]').forEach(function (el) {
    el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) { var p = pair.split(':'); AR_ATTR[p[1]] = el.getAttribute(p[0]); });
  });
  var metaDesc = $('meta[name="description"]');
  META.ar.title = doc.title; META.ar.desc = metaDesc ? metaDesc.content : '';

  function lang() { return root.lang === 'en' ? 'en' : 'ar'; }
  function tr(obj) { return obj[lang()]; }

  function applyLang(l, save) {
    root.lang = l; root.dir = l === 'ar' ? 'rtl' : 'ltr';
    var dict = l === 'en' ? EN : AR;
    $$('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n'); var v = dict[k] != null ? dict[k] : AR[k];
      if (v != null && el.innerHTML !== v) el.innerHTML = v;
    });
    $$('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var p = pair.split(':'); var v = l === 'en' ? EN[p[1]] : AR_ATTR[p[1]];
        if (v != null) el.setAttribute(p[0], v.replace(/&amp;/g, '&'));
      });
    });
    doc.title = META[l].title;
    if (metaDesc) metaDesc.content = META[l].desc;
    var lbl = $('#langLabel'); if (lbl) lbl.textContent = MSG.langLabel[l];
    // السيرة الذاتية بلغة الموقع، واللينك الصغير للغة التانية
    var cv = $('#cvBtn'), alt = $('#cvAlt');
    if (cv) cv.setAttribute('href', CONFIG.cv[l]);
    if (alt) alt.setAttribute('href', CONFIG.cv[l === 'ar' ? 'en' : 'ar']);
    updateWaLinks();
    root.classList.remove('i18n-pending');
    if (save) store.set('lang', l);
    doc.dispatchEvent(new CustomEvent('langchange', { detail: l }));
  }
  window.SiteLang = function () { return lang(); };

  /* ---------------- WhatsApp links ---------------- */
  function waUrl(text) { return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(text); }
  function updateWaLinks() {
    $$('[data-wa]').forEach(function (a) { var m = WA_MSG[a.getAttribute('data-wa')] || WA_MSG.general; a.href = waUrl(tr(m)); });
    var d = $('#demoWa'); if (d && d.dataset.kind) d.href = waUrl(tr(WA_MSG[d.dataset.kind] || WA_MSG.general));
  }

  /* ---------------- Theme ---------------- */
  function setTheme(t, save) {
    root.setAttribute('data-theme', t);
    var m = $('meta[name="theme-color"]'); if (m) m.content = t === 'dark' ? '#0A1322' : '#1D4E89';
    if (save) store.set('theme', t);
  }

  /* ---------------- Toast ---------------- */
  var toastTimer;
  function toast(msg) {
    var el = $('#toast'); el.textContent = msg; el.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { el.classList.remove('show'); }, 3200);
  }
  window.SiteToast = toast;

  /* ---------------- Header / menu / scrollspy ---------------- */
  function initHeader() {
    var header = $('.site-header'), nav = $('#nav'), btn = $('#menuToggle');
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    btn.addEventListener('click', function () { var open = nav.classList.toggle('open'); btn.setAttribute('aria-expanded', open); });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }); });
    doc.addEventListener('click', function (e) { if (nav.classList.contains('open') && !nav.contains(e.target) && !btn.contains(e.target)) { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); } });
    if ('IntersectionObserver' in window) {
      var links = {}; $$('a[href^="#"]', nav).forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && links[en.target.id]) {
            $$('a', nav).forEach(function (a) { a.classList.remove('active'); });
            if (!links[en.target.id].classList.contains('nav-cta')) links[en.target.id].classList.add('active');
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      $$('main section[id]').forEach(function (s) { spy.observe(s); });
    }
  }

  /* ---------------- Reveal on scroll ---------------- */
  function initReveal() {
    var els = $$('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------------- Project filters ---------------- */
  function initFilters() {
    var btns = $$('.filters [data-filter]');
    btns.forEach(function (b) {
      b.setAttribute('role', 'tab');
      b.addEventListener('click', function () {
        var f = b.getAttribute('data-filter');
        btns.forEach(function (x) { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); });
        $$('#projects [data-cat]').forEach(function (el) {
          var show = f === 'all' || el.getAttribute('data-cat') === f;
          el.classList.toggle('f-hide', !show);
          if (show) el.classList.add('in');
        });
      });
    });
  }

  /* ---------------- Galleries ---------------- */
  function probe(src) {
    return new Promise(function (res) { var i = new Image(); i.onload = function () { res(src); }; i.onerror = function () { res(null); }; i.src = src; });
  }
  function loadGallery(box) {
    var key = box.getAttribute('data-gallery'), cfg = CONFIG.galleries[key];
    if (!cfg || box.dataset.loaded) return; box.dataset.loaded = '1';
    var list = [];
    for (var n = 1; n <= cfg.max; n++) list.push(probe(cfg.path + n + '.' + cfg.ext));
    Promise.all(list).then(function (srcs) {
      srcs = srcs.filter(Boolean);
      var holder = $('.thumbs', box);
      srcs.forEach(function (src, i) {
        var b = doc.createElement('button'); b.type = 'button'; b.className = 'thumb';
        b.innerHTML = '<img loading="lazy" decoding="async" alt="">';
        var img = b.firstChild; img.src = src; img.alt = cfg[lang()] + ' – ' + (i + 1);
        b.addEventListener('click', function () { openLightbox(srcs, i, cfg); });
        holder.appendChild(b);
      });
      if (srcs.length) box.hidden = false;
      var card = box.closest('[data-hide-empty]'); if (card) checkEmptyCard(card);
    });
  }
  function checkEmptyCard(card) {
    var hasGallery = $$('.gallery', card).some(function (g) { return !g.hidden; });
    var btn = $('#excelBtn', card); var hasBtn = btn && !btn.hidden;
    var pending = $$('.gallery', card).some(function (g) { return !g.dataset.loaded; }) || (btn && !btn.dataset.checked);
    if (!pending) card.classList.toggle('empty-hide', !(hasGallery || hasBtn));
  }
  function initGalleries() {
    var boxes = $$('[data-gallery]');
    if (!('IntersectionObserver' in window)) { boxes.forEach(loadGallery); return; }
    // نراقب العنصر الأب لأن المعرض نفسه مخفي لحد ما الصور تتحمّل
    var parents = [];
    boxes.forEach(function (b) { var p = b.parentNode; if (parents.indexOf(p) < 0) { parents.push(p); p._gal = []; } p._gal.push(b); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { io.unobserve(en.target); en.target._gal.forEach(loadGallery); } });
    }, { rootMargin: '600px 0px' });
    parents.forEach(function (p) { io.observe(p); });
  }

  /* ---------------- Lightbox ---------------- */
  var lb, lbImg, lbCap, lbCfg, lbItems = [], lbIndex = 0, lastFocus;
  function openLightbox(srcs, i, cfg) {
    lbItems = srcs; lbIndex = i; lbCfg = cfg; lastFocus = doc.activeElement;
    showLb(); lb.hidden = false; doc.body.classList.add('no-scroll'); $('.lb-close', lb).focus();
  }
  function showLb() {
    lbImg.src = lbItems[lbIndex];
    lbImg.alt = lbCfg[lang()] + ' – ' + (lbIndex + 1);
    lbCap.textContent = lbCfg[lang()] + ' — ' + (lbIndex + 1) + ' / ' + lbItems.length;
    var multi = lbItems.length > 1; $('.lb-prev', lb).hidden = !multi; $('.lb-next', lb).hidden = !multi;
  }
  function stepLb(d) { lbIndex = (lbIndex + d + lbItems.length) % lbItems.length; showLb(); }
  function closeLb() { lb.hidden = true; lbImg.removeAttribute('src'); doc.body.classList.remove('no-scroll'); if (lastFocus) lastFocus.focus(); }
  function initLightbox() {
    lb = $('#lightbox'); lbImg = $('img', lb); lbCap = $('figcaption', lb);
    $('.lb-close', lb).addEventListener('click', closeLb);
    $('.lb-prev', lb).addEventListener('click', function () { stepLb(-1); });
    $('.lb-next', lb).addEventListener('click', function () { stepLb(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.tagName === 'FIGURE') closeLb(); });
    doc.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      var rtl = root.dir === 'rtl';
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowRight') stepLb(rtl ? -1 : 1);
      else if (e.key === 'ArrowLeft') stepLb(rtl ? 1 : -1);
    });
    var x0 = null;
    lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 50 && lbItems.length > 1) { var rtl = root.dir === 'rtl'; stepLb((dx < 0) !== rtl ? 1 : -1); }
    });
  }

  /* ---------------- Videos (تظهر فقط لو الملف موجود) ---------------- */
  function initVideos() {
    $$('[data-video]').forEach(function (box) {
      var v = doc.createElement('video');
      v.controls = true; v.preload = 'metadata'; v.playsInline = true;
      var poster = box.getAttribute('data-poster');
      if (poster) probe(poster).then(function (p) { if (p) v.poster = p; });
      v.addEventListener('loadedmetadata', function () { box.hidden = false; });
      var s = doc.createElement('source'); s.src = box.getAttribute('data-video'); s.type = 'video/mp4';
      s.addEventListener('error', function () { v.remove(); });
      v.appendChild(s); box.appendChild(v);
    });
  }

  /* ---------------- Files that may not exist yet ---------------- */
  function fileExists(url) {
    if (location.protocol === 'file:') return Promise.resolve(true);
    return fetch(url, { method: 'HEAD', cache: 'no-store' }).then(function (r) { return r.ok; }).catch(function () { return true; });
  }
  function initFiles() {
    var cv = $('#cvBtn'), cvOk = {};
    cv.addEventListener('click', function (e) {
      if (cvOk[cv.getAttribute('href')] === false) { e.preventDefault(); toast(tr(MSG.cvMissing)); }
    });
    [CONFIG.cv.ar, CONFIG.cv.en].forEach(function (u) { fileExists(u).then(function (ok) { cvOk[u] = ok; }); });
    var xl = $('#excelBtn');
    fileExists(xl.getAttribute('href')).then(function (ok) {
      xl.hidden = !ok; xl.dataset.checked = '1'; checkEmptyCard(xl.closest('[data-hide-empty]'));
    });
  }

  /* ---------------- Contact form ---------------- */
  function initForm() {
    var f = $('#contactForm'), note = $('#formNote');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var via = (e.submitter && e.submitter.value) || 'wa';
      var name = f.name.value.trim(), msg = f.message.value.trim(), topic = tr(MSG.topics[f.topic.value]);
      if (!name || !msg) { note.textContent = tr(MSG.formName); (name ? f.message : f.name).focus(); return; }
      note.textContent = '';
      var body = tr(MSG.from) + ': ' + name + '\n' + tr(MSG.subj) + ': ' + topic + '\n\n' + msg;
      if (via === 'mail') location.href = 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent(topic + ' — ' + name) + '&body=' + encodeURIComponent(body);
      else window.open(waUrl(body), '_blank', 'noopener');
    });
  }

  /* ---------------- Interactive demos (lazy) ---------------- */
  var demoLoaded = null;
  function loadDemo() {
    if (demoLoaded) return demoLoaded;
    demoLoaded = new Promise(function (res, rej) {
      var l = doc.createElement('link'); l.rel = 'stylesheet'; l.href = 'assets/css/demo.css?v=3'; doc.head.appendChild(l);
      var s = doc.createElement('script'); s.src = 'assets/js/demo.js?v=4'; s.onload = res; s.onerror = function () { demoLoaded = null; rej(); }; doc.body.appendChild(s);
    });
    return demoLoaded;
  }
  function initDemo() {
    var dlg = $('#demoDialog'), rootEl = $('#demoRoot'), wa = $('#demoWa'), opener;
    function close() { if (dlg.open) dlg.close(); }
    dlg.addEventListener('close', function () { doc.body.classList.remove('no-scroll'); if (opener) opener.focus(); });
    $('.demo-close', dlg).addEventListener('click', close);
    dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });
    $$('[data-demo]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var kind = btn.getAttribute('data-demo'); opener = btn;
        wa.dataset.kind = kind; wa.href = waUrl(tr(WA_MSG[kind] || WA_MSG.general));
        dlg.classList.toggle('demo-phone', kind === 'app');
        if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
        doc.body.classList.add('no-scroll');
        loadDemo().then(function () { window.MasarDemo.mount(rootEl, kind); })
          .catch(function () { rootEl.innerHTML = '<div class="demo-loading">Error</div>'; });
      });
    });
  }

  /* ---------------- Init ---------------- */
  function init() {
    applyLang(lang(), false);
    setTheme(root.getAttribute('data-theme') || 'light', false);
    $('#langToggle').addEventListener('click', function () { applyLang(lang() === 'ar' ? 'en' : 'ar', true); });
    $('#themeToggle').addEventListener('click', function () { setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true); });
    if (window.matchMedia) {
      var mq = matchMedia('(prefers-color-scheme: dark)');
      var onMq = function (e) { if (!store.get('theme')) setTheme(e.matches ? 'dark' : 'light', false); };
      if (mq.addEventListener) mq.addEventListener('change', onMq);
    }
    $('#year').textContent = new Date().getFullYear();
    initHeader(); initReveal(); initFilters(); initGalleries(); initLightbox(); initVideos(); initFiles(); initForm(); initDemo();
  }
  setTimeout(function () { root.classList.remove('i18n-pending'); }, 2500);
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init); else init();
})();
