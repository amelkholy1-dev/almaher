/* =========================================================
   Ahmed Maher Alkholy — main.js
   - اللغة (عربي/إنجليزي) + الوضع الليلي
   - معارض الصور + عارض الصور
   - الفيديو (يظهر فقط لو الملف موجود)
   - نموذج التواصل (واتساب / إيميل)
   - تحميل الديمو التفاعلي عند الطلب
   ========================================================= */
(function () {
  'use strict';

  /* ---------------- إعدادات سهلة التعديل ---------------- */
  var CONFIG = {
    whatsapp: '201552084471',
    email: 'am.elkholy1@gmail.com',
    // المعارض: الموقع بيدوّر على الصور بالترتيب (1، 2، 3 ...) لحد الرقم max
    // وبيعرض الموجود بس. ضيف صورك بنفس الأسماء دي.
    galleries: {
      ops:     { path: 'assets/img/projects/masar-ops-',    ext: 'png', max: 12, ar: 'نظام مسار للعمليات', en: 'Masar Operations' },
      hr:      { path: 'assets/img/projects/masar-hr-',     ext: 'png', max: 12, ar: 'نظام مسار للموارد البشرية', en: 'Masar HR' },
      excel:   { path: 'assets/img/projects/excel-sample-', ext: 'png', max: 6,  ar: 'نموذج Excel', en: 'Excel template' },
      designs: { path: 'assets/img/designs/design-',        ext: 'jpg', max: 30, ar: 'تصميم', en: 'Design' }
    }
  };

  var WA_MSG = {
    general: { ar: 'مرحباً أحمد، وصلت إليك من موقعك الشخصي وأودّ التواصل معك.', en: 'Hi Ahmed, I found you through your website and would like to get in touch.' },
    ops: { ar: 'مرحباً أحمد، شاهدت «نظام مسار للعمليات والحسابات» على موقعك، وأرغب في ديمو مباشر للنظام.', en: 'Hi Ahmed, I saw the Masar Operations & Accounts System on your website and would like a live demo.' },
    hr: { ar: 'مرحباً أحمد، شاهدت «نظام مسار للموارد البشرية» على موقعك، وأرغب في ديمو مباشر للنظام.', en: 'Hi Ahmed, I saw the Masar HR System on your website and would like a live demo.' }
  };

  /* ---------------- الترجمة الإنجليزية ----------------
     النص العربي موجود في index.html نفسه، وده المقابل الإنجليزي لكل مفتاح */
  var EN = {
    'skip': 'Skip to content',
    'brand': 'Ahmed Alkholy',
    'nav.about': 'About', 'nav.services': 'Services', 'nav.projects': 'Projects', 'nav.experience': 'Experience', 'nav.skills': 'Skills', 'nav.contact': 'Contact me',
    'hero.hello': "Hi, I'm",
    'hero.name': 'Ahmed Maher Alkholy',
    'hero.role': 'Systems &amp; Support Specialist',
    'hero.lead': 'I help companies with IT support, data &amp; Excel, administrative operations, and running business systems and training their users. With the help of AI tools, I have built business management systems that are in daily use across several companies.',
    'hero.avail': 'Giza, Egypt — available for work in Egypt, the Gulf &amp; remotely',
    'hero.cv': 'Download CV', 'hero.contact': 'Contact me',
    'photo.alt': 'Ahmed Maher Alkholy',
    'chip.support': 'IT Support', 'chip.ai': 'AI-assisted business systems',
    'st.1v': 'Nearly 4', 'st.1': 'years of experience',
    'st.2v': '2 systems', 'st.2': 'running in several companies',
    'st.3': 'system users', 'st.4': 'social media designs',
    'about.k': 'About me',
    'about.t': 'Support, organization and operations — with a problem-solving mindset',
    'about.p1': "I'm Ahmed Maher Alkholy, a Systems &amp; Support Specialist based in Giza, Egypt. Since February 2023 I have been working at an overseas employment office, responsible for IT support for the devices and network, organizing data and archiving, and following up procedures for thousands of files with different parties.",
    'about.p2': 'When I found the work depended on scattered Excel files and paper, I built — with the help of AI — a central database system that became the office’s main system. After that I built two business management systems that now run in several companies, and I handled their deployment, user training and support.',
    'about.p3': '<strong>To be clear:</strong> I am not a professional programmer; I rely on AI tools to write the code. My role is understanding the need, designing the workflow, testing, then deployment, training and support.',
    'fact.exp.t': 'Experience', 'fact.exp': 'Nearly 4 years (since Feb 2023)',
    'fact.edu.t': 'Education', 'fact.edu': 'Bachelor of Specific Education – Educational Technology &amp; Computer Science, Menoufia University (2018–2022) – Grade: Good (High)',
    'fact.lang.t': 'Languages', 'fact.lang': 'Arabic (native), English (good reading &amp; writing)',
    'fact.loc.t': 'Location &amp; availability', 'fact.loc': 'Giza, Egypt — available in Egypt, the Gulf &amp; remotely',
    'sv.k': 'Services', 'sv.t': 'How can I help?', 'sv.s': 'Available for computer-based office roles and for freelance projects.',
    'tag.job': 'Job', 'tag.free': 'Freelance',
    's1.t': 'IT Support', 's1.d': 'Installing Windows and software, fixing hardware issues, local networks and routers, printers, and backups.',
    's2.t': 'Data &amp; Excel', 's2.d': 'Fast, accurate data entry, organizing Excel files, converting PDFs and images to Word and Excel, and archiving.',
    's3.t': 'Administrative Operations', 's3.d': 'Following up procedures and files, coordinating tasks, and preparing reports for management.',
    's4.t': 'Systems Deployment &amp; Training', 's4.d': 'Running management systems inside the company, migrating data from Excel, training staff, and post-launch support.',
    's5.t': 'Business Websites', 's5.d': 'Company websites and landing pages — fast and mobile-friendly.',
    's6.t': 'Social Media Design', 's6.d': 'Ads and posts with Canva and Photoshop, and managing pages and paid ads on Meta Business Suite.',
    'pj.k': 'Portfolio', 'pj.t': 'Projects &amp; interactive demos',
    'pj.s': 'Systems I built with the help of AI that are in real use, shown here as samples of my work. Try the interactive demo, or request a live demo.',
    'pj.live': 'Running in several companies on their local network (LAN)', 'pj.live2': 'Running in several companies',
    'pj.ai': 'Built with the help of AI', 'pj.shots': 'Screenshots', 'pj.video': 'Demo video',
    'ops.t': 'Masar Operations &amp; Accounts System', 'ops.alt': 'نظام مسار للعمليات والحسابات',
    'ops.d': 'A browser-based system for managing documents and passports, tracking the stages of every file, and managing accounts and the treasury.',
    'ops.f1': 'Document and passport management, with search by name, passport number, national ID or mobile',
    'ops.f2': 'Extracting data from document images (OCR)',
    'ops.f3': 'Tracking each file’s stages (medical check, fingerprint, consulate, visa, travel) and the next action',
    'ops.f4': 'Client and agent accounts and commissions, treasury, revenue and expenses',
    'ops.f5': 'Account statements and reports, export to Excel and PDF, Barcode and QR printing',
    'ops.f6': 'User permissions, backup and restore',
    'hr.t': 'Masar HR System', 'hr.alt': 'نظام مسار للموارد البشرية',
    'hr.d': 'A system for managing candidates and job requests — from uploading the CV to tracking each candidate’s stage.',
    'hr.f1': 'Uploading CVs and analyzing them with AI, turning them into structured records',
    'hr.f2': 'A central candidate bank with smart search and filtering',
    'hr.f3': 'Job requests, matching candidates to job requirements and ranking them',
    'hr.f4': 'Tracking each candidate’s stage, with dashboards and analytics',
    'hr.f5': 'Excel import and export, SQL and ZIP backups',
    'btn.demo': 'Try the interactive demo', 'btn.live': 'Request a live demo',
    'xl.t': 'Excel template – Clients &amp; payments register', 'xl.d': 'An organized Excel template for recording client data and tracking their payments.', 'xl.btn': 'Download the template',
    'ds.t': 'Social media designs', 'ds.d': 'A selection of ads and posts I designed with Canva and Photoshop.',
    'ex.k': 'Experience', 'ex.t': 'Work experience',
    'e1.date': 'Feb 2023 – Present', 'e1.r': 'Operations &amp; Systems Coordinator',
    'e1.c': 'Nesr Al Khaleej Office for Egyptian Employment Abroad – Giza',
    'e1.b1': 'Replaced scattered Excel files and paperwork with a central database system I built with the help of AI, which became the office’s main system.',
    'e1.b2': 'Cut file registration time from several minutes to seconds (OCR + fast entry).',
    'e1.b3': 'Designed a numbering and archiving system linking every paper file to its electronic record; after it, passport loss incidents stopped completely.',
    'e1.b4': 'IT support for 9 computers, the local network, printers and scanners, and backups.',
    'e1.b5': 'Following up multi-stage procedures for thousands of files with government bodies and partners.',
    'e1.b6': 'Designing the company’s ads and managing its pages and paid campaigns.',
    'e2.date': 'Jan 2024 – Present', 'e2.r': 'Independent AI-Assisted Business Systems Developer', 'e2.c': 'Freelance – Remote',
    'e2.b1': 'Built two business management systems running in several companies, with more than 20 users.',
    'e2.b2': 'Handled needs analysis, deployment on company networks, staff training, support and updates.',
    'e3.date': 'May 2025 – Aug 2025', 'e3.r': 'Transport Operations Coordinator (Temporary Assignment)',
    'e3.c': 'Hussein Hegazy Transport &amp; Umrah Company – Makkah, Saudi Arabia',
    'e3.b1': 'Coordinated transport trips and schedules with drivers, handled urgent cases, and prepared daily reports.',
    'sk.k': 'Skills', 'sk.t': 'Skills &amp; tools',
    'sk.g1': 'IT support &amp; networking', 'sk.c1': 'Software installation', 'sk.c2': 'Hardware troubleshooting', 'sk.c3': 'Local networks (LAN)', 'sk.c4': 'Routers', 'sk.c5': 'Printers &amp; scanners', 'sk.c6': 'Backups',
    'sk.g2': 'Data &amp; office', 'sk.c7': 'Data entry', 'sk.c8': 'PDF &amp; image conversion (OCR)', 'sk.c9': 'Archiving', 'sk.c10': 'Reporting',
    'sk.g3': 'Operations &amp; administration', 'sk.c11': 'Procedure follow-up', 'sk.c12': 'Task coordination', 'sk.c13': 'Needs analysis', 'sk.c14': 'Systems deployment', 'sk.c15': 'User training', 'sk.c16': 'Post-launch support',
    'sk.g4': 'Design &amp; marketing', 'sk.c17': 'Page management', 'sk.c18': 'Paid ads',
    'sk.g5': 'AI-assisted systems building', 'sk.g5d': 'Technologies I have used to build systems, relying on AI tools to write the code.',
    'ct.k': 'Contact', 'ct.t': "Let's talk",
    'ct.s': 'Whether you have a job opportunity, a freelance project, or want a live demo of one of the systems, I’d be glad to hear from you.',
    'ct.email': 'Email', 'ct.wa': 'WhatsApp', 'ct.loc': 'Location', 'ct.locv': 'Giza, Egypt — available in Egypt, the Gulf &amp; remotely',
    'cf.t': 'Send a quick message', 'cf.name': 'Name', 'cf.topic': 'Subject',
    'cf.o1': 'Job opportunity', 'cf.o2': 'Freelance project', 'cf.o3': 'Live demo of a system', 'cf.o4': 'Something else',
    'cf.msg': 'Message', 'cf.wa': 'Send via WhatsApp', 'cf.mail': 'Send by email',
    'ft.name': 'Ahmed Maher Alkholy', 'ft.role': 'Systems &amp; Support Specialist',
    'demo.notice': 'Interactive demo with sample data – the full system is available on request',
    'demo.loading': 'Loading the demo…'
  };

  var META = {
    ar: { title: 'أحمد ماهر الخولي | أخصائي أنظمة ودعم فني', desc: null },
    en: { title: 'Ahmed Maher Alkholy | Systems & Support Specialist',
          desc: 'Ahmed Maher Alkholy – Systems & Support Specialist in Giza, Egypt. IT support, data & Excel, administrative operations, systems deployment and user training, business websites and social media design. Available in Egypt, the Gulf and remotely.' }
  };

  var MSG = {
    cvMissing: { ar: 'السيرة الذاتية ستُضاف قريباً. يمكنك التواصل معي مباشرة.', en: 'The CV will be added soon. Feel free to contact me directly.' },
    formName: { ar: 'من فضلك اكتب اسمك والرسالة.', en: 'Please enter your name and message.' },
    topics: {
      job: { ar: 'فرصة عمل', en: 'Job opportunity' }, free: { ar: 'مشروع حر', en: 'Freelance project' },
      demo: { ar: 'ديمو مباشر لأحد الأنظمة', en: 'Live demo of a system' }, other: { ar: 'موضوع آخر', en: 'Other' }
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
  $$('[data-i18n-attr]').forEach(function (el, i) {
    el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
      var p = pair.split(':'); AR_ATTR[p[1]] = el.getAttribute(p[0]);
    });
  });
  var metaDesc = $('meta[name="description"]');
  META.ar.desc = metaDesc ? metaDesc.content : '';

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
    var d = $('#demoWa'); if (d && d.dataset.kind) d.href = waUrl(tr(WA_MSG[d.dataset.kind]));
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
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open'); btn.setAttribute('aria-expanded', open);
    });
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

  /* ---------------- Galleries ---------------- */
  var lbItems = [], lbIndex = 0;
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
        var img = b.firstChild; img.src = src;
        b.dataset.caption = key; b.dataset.n = i + 1;
        img.alt = cfg[lang()] + ' – ' + (i + 1);
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
    if (!pending) card.style.display = (hasGallery || hasBtn) ? '' : 'none';
  }
  function initGalleries() {
    var boxes = $$('[data-gallery]');
    if (!('IntersectionObserver' in window)) { boxes.forEach(loadGallery); return; }
    // نراقب العنصر الأب لأن المعرض نفسه مخفي لحد ما الصور تتحمّل
    var parents = [];
    boxes.forEach(function (b) {
      var p = b.parentNode; if (parents.indexOf(p) < 0) { parents.push(p); p._gal = []; } p._gal.push(b);
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { io.unobserve(en.target); en.target._gal.forEach(loadGallery); } });
    }, { rootMargin: '600px 0px' });
    parents.forEach(function (p) { io.observe(p); });
  }

  /* ---------------- Lightbox ---------------- */
  var lb, lbImg, lbCap, lbCfg, lastFocus;
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
    // في العربي "السابق" على اليمين، فالاتجاه البصري بيفضل منطقي
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
      v.addEventListener('error', function () { v.remove(); }, true);
      var s = doc.createElement('source'); s.src = box.getAttribute('data-video'); s.type = 'video/mp4';
      s.addEventListener('error', function () { v.remove(); });
      v.appendChild(s); box.appendChild(v);
    });
  }

  /* ---------------- Files that may not exist yet (CV, Excel) ---------------- */
  function fileExists(url) {
    if (location.protocol === 'file:') return Promise.resolve(true);
    return fetch(url, { method: 'HEAD', cache: 'no-store' }).then(function (r) { return r.ok; }).catch(function () { return true; });
  }
  function initFiles() {
    var cv = $('#cvBtn');
    fileExists(cv.getAttribute('href')).then(function (ok) {
      if (!ok) cv.addEventListener('click', function (e) { e.preventDefault(); toast(tr(MSG.cvMissing)); });
    });
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

  /* ---------------- Interactive demo (lazy) ---------------- */
  var demoLoaded = null;
  function loadDemo() {
    if (demoLoaded) return demoLoaded;
    demoLoaded = new Promise(function (res, rej) {
      var l = doc.createElement('link'); l.rel = 'stylesheet'; l.href = 'assets/css/demo.css'; doc.head.appendChild(l);
      var s = doc.createElement('script'); s.src = 'assets/js/demo.js'; s.onload = res; s.onerror = rej; doc.body.appendChild(s);
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
        wa.dataset.kind = kind; wa.href = waUrl(tr(WA_MSG[kind]));
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
    initHeader(); initReveal(); initGalleries(); initLightbox(); initVideos(); initFiles(); initForm(); initDemo();
  }
  // أمان: لو حصل أي خطأ، اظهر الصفحة
  setTimeout(function () { root.classList.remove('i18n-pending'); }, 2500);
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init); else init();
})();
