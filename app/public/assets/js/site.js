/* =========================================================
   موقع أحمد ماهر الخولي — بيرسم الصفحة من المحتوى المحفوظ (لوحة التحكم)
   ========================================================= */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var D = {};
  try { D = JSON.parse(doc.getElementById('site-data').textContent) || {}; } catch (e) { D = {}; }
  var S = D.settings || {};
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* مش مشكلة */ } }
  };
  function lang() { return root.lang === 'en' ? 'en' : 'ar'; }
  function tx(v) { if (v == null) return ''; if (typeof v === 'string' || typeof v === 'number') return String(v); return v[lang()] || v.ar || v.en || ''; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function arr(a) { return Array.isArray(a) ? a : []; }
  function ic(n, cls) { return '<svg class="ic' + (cls ? ' ' + cls : '') + '" aria-hidden="true"><use href="#i-' + esc(n || 'check') + '"/></svg>'; }
  /* روابط آمنة: http/https/mailto/tel أو مسارات داخلية بس */
  function url(u) {
    u = String(u == null ? '' : u).trim();
    if (!u) return '';
    if (/^(https?:|mailto:|tel:|#|\/(?!\/))/i.test(u) || /^(assets|uploads)\//i.test(u)) return u;
    return /^[a-z0-9][\w\-./%]*$/i.test(u) && !/^[a-z]+:/i.test(u) ? u : '';
  }
  /* نص بسيط: فقرات + قوائم بـ «- » + **عريض** — كله بيتعمله escape */
  function rich(text) {
    var t = tx(text); if (!t) return '';
    return t.split(/\n{2,}/).map(function (blk) {
      var lines = blk.split('\n');
      if (lines.every(function (l) { return /^\s*[-•]\s+/.test(l); })) return '<ul class="dots">' + lines.map(function (l) { return '<li>' + inl(l.replace(/^\s*[-•]\s+/, '')) + '</li>'; }).join('') + '</ul>';
      return '<p>' + lines.map(inl).join('<br>') + '</p>';
    }).join('');
  }
  function inl(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'); }

  /* ---------- نصوص الواجهة الثابتة ---------- */
  var UI = {
    skip: { ar: 'تخطَّ إلى المحتوى', en: 'Skip to content' },
    all: { ar: 'الكل', en: 'All' },
    moreProj: { ar: 'عرض كل الأنظمة والمشاريع', en: 'Show all systems & projects' },
    lessProj: { ar: 'عرض أقل', en: 'Show less' },
    demo: { ar: 'جرّب العرض التفاعلي', en: 'Try the interactive demo' },
    live: { ar: 'اطلب ديمو مباشر', en: 'Request a live demo' },
    visit: { ar: 'زيارة الموقع', en: 'Visit website' },
    shots: { ar: 'صور من النظام', en: 'Screenshots' },
    video: { ar: 'فيديو الديمو', en: 'Demo video' },
    cv: { ar: 'تحميل السيرة الذاتية', en: 'Download CV' },
    cvAlt: { ar: 'English CV', en: 'السيرة الذاتية بالعربي' },
    work: { ar: 'شاهد أعمالي', en: 'View my work' },
    notice: { ar: 'عرض توضيحي تفاعلي ببيانات تجريبية – النظام الكامل متاح عند الطلب', en: 'Interactive demo with sample data – the full system is available on request' },
    loading: { ar: 'جارٍ تحميل العرض…', en: 'Loading the demo…' },
    en: { ar: 'English', en: 'العربية' },
    statusLive: { ar: 'منشور ويعمل', en: 'Live' },
    statusSample: { ar: 'نموذج توضيحي', en: 'Concept demo' },
    statusDemo: { ar: 'ديمو تفاعلي', en: 'Interactive demo' },
    statusDev: { ar: 'قيد التطوير', en: 'In development' },
    groupFeature: { ar: 'الأنظمة والتطبيقات الرئيسية', en: 'Main systems & apps' },
    groupShowcase: { ar: 'نماذج توضيحية جاهزة', en: 'Ready-made concept demos' },
    groupSite: { ar: 'مواقع الشركات', en: 'Company websites' },
    groupMini: { ar: 'أعمال أخرى', en: 'Other work' },
    f_name: { ar: 'الاسم', en: 'Name' }, f_contact: { ar: 'واتساب أو إيميل للرد (اختياري)', en: 'WhatsApp or email to reply (optional)' },
    f_topic: { ar: 'الموضوع', en: 'Topic' }, f_msg: { ar: 'الرسالة', en: 'Message' },
    f_wa: { ar: 'إرسال عبر واتساب', en: 'Send via WhatsApp' }, f_mail: { ar: 'إرسال بالإيميل', en: 'Send by email' }, f_send: { ar: 'إرسال مباشر', en: 'Send directly' },
    f_need: { ar: 'اكتب اسمك ورسالتك أولاً.', en: 'Please enter your name and message first.' },
    f_ok: { ar: 'وصلتني رسالتك، وهرد عليك قريباً.', en: 'Message received — I will get back to you soon.' },
    f_err: { ar: 'تعذّر الإرسال. جرّب واتساب أو الإيميل.', en: 'Could not send. Please try WhatsApp or email.' },
    email: { ar: 'البريد الإلكتروني', en: 'Email' }, wa: { ar: 'واتساب', en: 'WhatsApp' }, place: { ar: 'المكان', en: 'Location' },
    waGeneral: { ar: 'مرحباً أحمد، وصلت إليك من موقعك الشخصي وأودّ التواصل معك.', en: 'Hi Ahmed, I found you through your website and would like to get in touch.' },
    waProject: { ar: 'مرحباً أحمد، شاهدت «{name}» على موقعك، وأرغب في ديمو مباشر ومعرفة المزيد.', en: 'Hi Ahmed, I saw “{name}” on your website and would like a live demo and more details.' },
    shotsOpen: { ar: 'عرض الصور', en: 'View screenshots' },
    menu: { ar: 'القائمة', en: 'Menu' },
    rvKicker: { ar: 'آراء العملاء', en: 'Client reviews' },
    rvTitle: { ar: 'ماذا يقول من تعاملوا معي', en: 'What people who worked with me say' },
    rvSub: { ar: 'كل تقييم يُراجَع قبل نشره، ويُعلَّم بعلامة ✓ عندما أتأكد أنه من عميل فعلي.', en: 'Every review is checked before it is published, and marked with ✓ once I confirm it comes from a real client.' },
    rvForm: { ar: 'قيّم تجربتك معي', en: 'Rate your experience with me' },
    rvEmpty: { ar: 'لا توجد تقييمات منشورة بعد. كن أول من يقيّم تجربته.', en: 'No published reviews yet. Be the first to rate your experience.' },
    rvThanks: { ar: 'شكراً لك! وصلني تقييمك وسيظهر بعد المراجعة.', en: 'Thank you! Your review was received and will appear after it is reviewed.' },
    rvCount: { ar: 'تقييم', en: 'reviews' },
    rvOutOf: { ar: 'من 5', en: 'out of 5' },
    rvWrite: { ar: 'اكتب تقييمك', en: 'Write a review' },
    rvVerified: { ar: 'عميل موثّق', en: 'Verified client' },
    rvVia: { ar: 'عبر', en: 'via' },
    rvReply: { ar: 'رد صاحب الموقع', en: 'Reply from the site owner' },
    rvRating: { ar: 'تقييمك بالنجوم', en: 'Your star rating' },
    rvName: { ar: 'الاسم', en: 'Name' },
    rvRole: { ar: 'صفتك أو شركتك (اختياري)', en: 'Your role or company (optional)' },
    rvText: { ar: 'تقييمك', en: 'Your review' },
    rvContact: { ar: 'واتساب أو إيميل (اختياري، للتحقق فقط ولا يظهر للزوار)', en: 'WhatsApp or email (optional, for verification only — never shown)' },
    rvSend: { ar: 'إرسال التقييم', en: 'Submit review' },
    rvNeedStars: { ar: 'اختر عدد النجوم أولاً.', en: 'Please choose a star rating first.' },
    rvNeedText: { ar: 'اكتب اسمك وتقييمك (10 أحرف على الأقل).', en: 'Please enter your name and a review (at least 10 characters).' },
    rvErr: { ar: 'تعذّر الإرسال. حاول مرة أخرى.', en: 'Could not send. Please try again.' }
  };
  function u(k) { return UI[k] ? UI[k][lang()] : k; }

  /* ---------- واتساب ---------- */
  function waNum() { return String(S.whatsapp || '').replace(/\D/g, ''); }
  function waUrl(msg) { return 'https://wa.me/' + waNum() + '?text=' + encodeURIComponent(msg); }
  function waMsg(kind) {
    var custom = S.waMessages && S.waMessages.general;
    if (!kind || kind === 'general') return custom ? tx(custom) : u('waGeneral');
    var p = arr(D.projects && D.projects.items).filter(function (x) { return x.id === kind; })[0];
    var tpl = (S.waMessages && S.waMessages.project) ? tx(S.waMessages.project) : u('waProject');
    return tpl.replace('{name}', p ? tx(p.title) : '');
  }
  function updateWa() {
    $$('[data-wa]').forEach(function (a) { a.href = waUrl(waMsg(a.getAttribute('data-wa'))); });
  }

  /* ---------- رأس الصفحة والقوائم ---------- */
  var BUILTIN = ['stats', 'about', 'process', 'services', 'projects', 'experience', 'skills', 'reviews', 'contact'];
  function sections() {
    var l = arr(D.layout && D.layout.sections);
    if (!l.length) l = BUILTIN.map(function (id) { return { id: id, visible: true, nav: id !== 'stats' }; });
    // محتوى قديم من غير قسم التقييمات: نضيفه قبل التواصل
    if (!l.some(function (x) { return x && x.id === 'reviews'; })) { var ci = l.map(function (x) { return x && x.id; }).indexOf('contact'); l = l.slice(); l.splice(ci < 0 ? l.length : ci, 0, { id: 'reviews', visible: true, nav: false }); }
    var seen = {};
    return l.filter(function (s) { if (!s || !s.id || seen[s.id]) return false; seen[s.id] = 1; return s.visible !== false; });
  }
  function secId(s) { return s.id.indexOf('c:') === 0 ? s.id.slice(2) : s.id; }
  function secTitle(s) {
    if (s.label && tx(s.label)) return tx(s.label);
    var id = s.id;
    if (id.indexOf('c:') === 0) { var c = arr(D.custom).filter(function (x) { return x.id === id.slice(2); })[0]; return c ? tx(c.title) : ''; }
    var o = D[id]; return o ? tx(o.title) : '';
  }
  function renderHeader() {
    $('#brandMark').textContent = S.initials || 'AK';
    $('#brandName').textContent = tx(S.brand || S.name);
    $('#skipLink').textContent = u('skip');
    var items = sections().filter(function (s) { return s.nav; });
    $('#nav').innerHTML = items.map(function (s) {
      var last = s.id === 'contact';
      return '<a href="#' + esc(secId(s)) + '"' + (last ? ' class="nav-cta"' : '') + '>' + esc(s.navLabel && tx(s.navLabel) || secTitle(s)) + '</a>';
    }).join('');
    $('#langLabel').textContent = u('en');
  }

  /* ---------- الرئيسية ---------- */
  function renderHero() {
    var cv = S.cv ? (tx(S.cv) ) : '', cvOther = S.cv ? (lang() === 'ar' ? (S.cv.en || '') : (S.cv.ar || '')) : '';
    var social = '';
    if (S.linkedin) social += '<a class="btn-round" href="' + esc(url(S.linkedin)) + '" target="_blank" rel="noopener" aria-label="LinkedIn" title="LinkedIn">' + ic('in') + '</a>';
    if (waNum()) social += '<a class="btn-round" data-wa="general" href="#" target="_blank" rel="noopener" aria-label="WhatsApp" title="WhatsApp">' + ic('wa') + '</a>';
    if (S.email) social += '<a class="btn-round" href="mailto:' + esc(S.email) + '" aria-label="Email" title="Email">' + ic('mail') + '</a>';
    if (S.github) social += '<a class="btn-round" href="' + esc(url(S.github)) + '" target="_blank" rel="noopener" aria-label="GitHub" title="GitHub">' + ic('gh') + '</a>';
    var modes = arr(S.modes).map(function (m) { return '<span class="hm-chip">' + esc(tx(m)) + '</span>'; }).join('');
    var chips = arr(S.heroChips);
    return '<section class="hero" id="home"><div class="container hero-inner"><div class="hero-text">' +
      '<p class="hero-hello">' + esc(tx(S.hello)) + '</p>' +
      '<h1 class="hero-name">' + esc(tx(S.name)) + '</h1>' +
      '<p class="hero-role"><span>' + esc(tx(S.role)) + '</span></p>' +
      '<p class="hero-lead">' + esc(tx(S.lead)) + '</p>' +
      (modes ? '<div class="hero-modes"><span class="hm-label">' + esc(tx(S.availLabel)) + '</span>' + modes + '</div>' : '') +
      (S.location ? '<p class="hero-avail">' + ic('pin') + '<span>' + esc(tx(S.location)) + '</span></p>' : '') +
      '<div class="hero-actions">' +
      (cv ? '<a class="btn btn-gold" href="' + esc(url(cv)) + '" download>' + ic('dl') + '<span>' + u('cv') + '</span></a>' : '') +
      '<a class="btn btn-light" href="#projects">' + ic('layers') + '<span>' + u('work') + '</span></a>' + social + '</div>' +
      (cvOther ? '<p class="cv-alt"><a href="' + esc(url(cvOther)) + '" download>' + u('cvAlt') + '</a></p>' : '') +
      '</div><div class="hero-photo"><div class="photo-ring">' +
      (S.photo ? '<img src="' + esc(url(S.photo)) + '" alt="' + esc(tx(S.name)) + '" width="360" height="360" fetchpriority="high" onerror="this.parentNode.classList.add(\'no-photo\');this.remove()">' : '') +
      '<span class="photo-fallback" aria-hidden="true">' + esc(S.initials || 'AK') + '</span></div>' +
      chips.slice(0, 2).map(function (c, i) { return '<div class="hero-chip chip-' + (i ? 'b' : 'a') + '">' + ic(c.icon || 'code') + '<span>' + esc(tx(c.text)) + '</span></div>'; }).join('') +
      '</div></div></section>';
  }
  function head(o, extra) {
    if (!o) return '';
    return '<div class="section-head reveal">' + (o.kicker ? '<p class="kicker">' + esc(tx(o.kicker)) + '</p>' : '') +
      (o.title ? '<h2 class="title">' + esc(tx(o.title)) + '</h2>' : '') + (o.sub ? '<p class="sub">' + esc(tx(o.sub)) + '</p>' : '') + (extra || '') + '</div>';
  }

  var SECTION = {
    stats: function () {
      var st = arr(D.stats); if (!st.length) return '';
      return '<section class="stats" aria-label="Quick facts"><div class="container stats-grid">' +
        st.map(function (x) { return '<div class="stat"><strong>' + esc(tx(x.value)) + '</strong><span>' + esc(tx(x.label)) + '</span></div>'; }).join('') + '</div></section>';
    },
    about: function () {
      var a = D.about || {};
      return '<section class="section" id="about"><div class="container about-grid"><div class="reveal">' +
        (a.kicker ? '<p class="kicker">' + esc(tx(a.kicker)) + '</p>' : '') + (a.title ? '<h2 class="title">' + esc(tx(a.title)) + '</h2>' : '') +
        arr(a.paragraphs).map(function (p, i, all) { return (i === all.length - 1 && a.highlightLast) ? '<p class="honest">' + inl(tx(p)) + '</p>' : '<p>' + inl(tx(p)) + '</p>'; }).join('') +
        '</div><ul class="facts reveal">' + arr(a.facts).map(function (f) {
          return '<li>' + ic(f.icon || 'check') + '<div><b>' + esc(tx(f.title)) + '</b><span>' + esc(tx(f.text)) + '</span></div></li>';
        }).join('') + '</ul></div></section>';
    },
    process: function () {
      var p = D.process || {}; if (!arr(p.steps).length) return '';
      return '<section class="section section-alt process-sec" id="process"><div class="container">' + head(p) +
        '<ol class="process">' + arr(p.steps).map(function (s, i) { return '<li class="reveal"><span class="pnum">' + (i + 1) + '</span><h3>' + esc(tx(s.title)) + '</h3><p>' + esc(tx(s.text)) + '</p></li>'; }).join('') + '</ol></div></section>';
    },
    services: function () {
      var s = D.services || {};
      return '<section class="section" id="services"><div class="container">' + head(s) + '<div class="cards-3">' + arr(s.items).filter(vis).map(function (x) {
        return '<article class="card service reveal"><div class="svc-icon">' + ic(x.icon || 'sys') + '</div><h3>' + esc(tx(x.title)) + '</h3><p>' + esc(tx(x.text)) + '</p>' +
          (arr(x.tags).length ? '<div class="tags">' + arr(x.tags).map(function (t, i) { return '<span class="tag' + (i === 0 && x.goldFirst ? ' tag-gold' : '') + '">' + esc(tx(t)) + '</span>'; }).join('') + '</div>' : '') + '</article>';
      }).join('') + '</div></div></section>';
    },
    projects: function () { return renderProjects(); },
    experience: function () {
      var e = D.experience || {};
      return '<section class="section" id="experience"><div class="container">' + head(e) + '<ol class="timeline">' + arr(e.items).filter(vis).map(function (x) {
        return '<li class="tl-item reveal"><div class="tl-date">' + esc(tx(x.date)) + '</div><div class="card tl-card"><h3>' + esc(tx(x.role)) + '</h3>' +
          (x.org ? '<p class="tl-sub">' + esc(tx(x.org)) + '</p>' : '') +
          (arr(x.bullets).length ? '<ul class="dots">' + arr(x.bullets).map(function (b) { return '<li>' + esc(tx(b)) + '</li>'; }).join('') + '</ul>' : '') + '</div></li>';
      }).join('') + '</ol></div></section>';
    },
    skills: function () {
      var k = D.skills || {};
      return '<section class="section section-alt" id="skills"><div class="container">' + head(k) + '<div class="skills-grid">' + arr(k.groups).filter(vis).map(function (g) {
        return '<div class="card skill-group' + (g.highlight ? ' skill-hl' : '') + ' reveal"><h3>' + ic(g.icon || 'check') + '<span>' + esc(tx(g.title)) + '</span></h3><div class="chips">' +
          arr(g.items).map(function (i) { return '<span>' + esc(tx(i)) + '</span>'; }).join('') + '</div></div>';
      }).join('') + '</div></div></section>';
    },
    contact: function () {
      var c = D.contact || {}, items = '';
      if (S.email) items += '<a class="contact-item" href="mailto:' + esc(S.email) + '"><span class="ci-icon">' + ic('mail') + '</span><span><b>' + u('email') + '</b><span dir="ltr">' + esc(S.email) + '</span></span></a>';
      if (waNum()) items += '<a class="contact-item" data-wa="general" href="#" target="_blank" rel="noopener"><span class="ci-icon ci-wa">' + ic('wa') + '</span><span><b>' + u('wa') + '</b><span dir="ltr">+' + esc(waNum().replace(/^(\d{2})(\d{3})(\d{3})(\d+)$/, '$1 $2 $3 $4')) + '</span></span></a>';
      if (S.linkedin) items += '<a class="contact-item" href="' + esc(url(S.linkedin)) + '" target="_blank" rel="noopener"><span class="ci-icon ci-in">' + ic('in') + '</span><span><b>LinkedIn</b><span dir="ltr">' + esc(String(S.linkedin).replace(/^https?:\/\/(www\.)?/, '')) + '</span></span></a>';
      if (S.github) items += '<a class="contact-item" href="' + esc(url(S.github)) + '" target="_blank" rel="noopener"><span class="ci-icon ci-gh">' + ic('gh') + '</span><span><b>GitHub</b><span dir="ltr">' + esc(String(S.github).replace(/^https?:\/\/(www\.)?/, '')) + '</span></span></a>';
      if (S.location) items += '<div class="contact-item"><span class="ci-icon">' + ic('pin') + '</span><span><b>' + u('place') + '</b><span>' + esc(tx(S.location)) + '</span></span></div>';
      var topics = arr(c.topics).map(function (t) { return '<option value="' + esc(tx(t)) + '">' + esc(tx(t)) + '</option>'; }).join('');
      return '<section class="section contact" id="contact"><div class="container contact-grid"><div class="reveal">' +
        (c.kicker ? '<p class="kicker">' + esc(tx(c.kicker)) + '</p>' : '') + (c.title ? '<h2 class="title">' + esc(tx(c.title)) + '</h2>' : '') + (c.sub ? '<p class="sub">' + esc(tx(c.sub)) + '</p>' : '') +
        '<div class="contact-list">' + items + '</div></div>' +
        '<form class="card contact-form reveal" id="contactForm" novalidate><h3>' + esc(tx(c.formTitle)) + '</h3>' +
        '<label><span>' + u('f_name') + '</span><input type="text" name="name" autocomplete="name" required maxlength="120"></label>' +
        '<label><span>' + u('f_contact') + '</span><input type="text" name="contact" maxlength="160" dir="auto"></label>' +
        (topics ? '<label><span>' + u('f_topic') + '</span><select name="topic">' + topics + '</select></label>' : '') +
        '<label><span>' + u('f_msg') + '</span><textarea name="message" rows="4" required maxlength="3000"></textarea></label>' +
        '<div class="hp" aria-hidden="true"><input type="text" name="website" tabindex="-1" autocomplete="off"></div>' +
        '<p class="form-note" id="formNote" role="status"></p><div class="form-actions">' +
        '<button class="btn btn-primary" type="submit" value="send">' + ic('send') + '<span>' + u('f_send') + '</span></button>' +
        '<button class="btn btn-wa" type="submit" value="wa">' + ic('wa') + '<span>' + u('f_wa') + '</span></button>' +
        '<button class="btn btn-outline" type="submit" value="mail">' + ic('mail') + '<span>' + u('f_mail') + '</span></button></div></form></div></section>';
    }
  };
  function vis(x) { return x && x.visible !== false; }

  /* ---------- التقييمات ---------- */
  var RV = null, rvLoading = false, rvSent = false;
  function starsHtml(n) { var h = ''; for (var i = 1; i <= 5; i++) h += '<i class="' + (i <= Math.round(n) ? 'on' : '') + '">★</i>'; return '<span class="stars" role="img" aria-label="' + esc(n) + ' / 5">' + h + '</span>'; }
  function rvDate(t) { try { return new Date(t).toLocaleDateString(lang() === 'ar' ? 'ar-EG' : 'en-GB', { year: 'numeric', month: 'long' }); } catch (e) { return ''; } }
  function reviewsInner() {
    var R = D.reviews || {}, sm = RV ? RV.summary : { avg: 0, count: 0, dist: [0, 0, 0, 0, 0] }, list = RV ? RV.reviews : [];
    var kick = tx(R.kicker) || u('rvKicker'), title = tx(R.title) || u('rvTitle'), sub = tx(R.sub) || u('rvSub');
    var summary = sm.count ? '<div class="card rv-summary"><div class="rv-avg"><b>' + esc(sm.avg) + '</b>' + starsHtml(sm.avg) + '<span>' + sm.count + ' ' + u('rvCount') + ' · ' + u('rvOutOf') + '</span></div>' +
      '<div class="rv-dist">' + [5, 4, 3, 2, 1].map(function (n) { var c = sm.dist[n - 1] || 0, pc = Math.round((c / sm.count) * 100); return '<div><span>' + n + ' ★</span><span class="track"><span style="width:' + pc + '%"></span></span><b>' + c + '</b></div>'; }).join('') + '</div>' +
      '<a class="btn btn-gold btn-sm" href="#reviewForm" data-rv-write>' + u('rvWrite') + '</a></div>' : '';
    var cards = list.map(function (r) {
      return '<article class="card rv-card reveal in"><div class="rv-top">' + starsHtml(r.rating) + (r.verified ? '<span class="rv-ver">✓ ' + u('rvVerified') + '</span>' : '') + '</div>' +
        '<p class="rv-text">' + esc(r.text).replace(/\n/g, '<br>') + '</p>' +
        '<div class="rv-by"><b>' + esc(r.name) + '</b>' + (r.role ? '<span>' + esc(r.role) + '</span>' : '') + '<small>' + esc(rvDate(r.time)) + (r.via ? ' · ' + u('rvVia') + ' ' + esc(r.via) : '') + '</small></div>' +
        (r.reply ? '<div class="rv-reply"><b>' + u('rvReply') + '</b><p>' + esc(r.reply.text) + '</p></div>' : '') + '</article>';
    }).join('');
    var form = rvSent ? '<div class="card rv-thanks" role="status">✓ ' + esc(tx(R.thanks) || u('rvThanks')) + '</div>' :
      '<form class="card contact-form rv-form reveal in" id="reviewForm" novalidate><h3>' + esc(tx(R.formTitle) || u('rvForm')) + '</h3>' +
      '<div class="f"><span class="lab">' + u('rvRating') + '</span><div class="rv-stars-in" role="radiogroup" aria-label="' + esc(u('rvRating')) + '">' + [1, 2, 3, 4, 5].map(function (n) { return '<button type="button" class="star" role="radio" aria-checked="false" data-star="' + n + '" aria-label="' + n + '">★</button>'; }).join('') + '</div><input type="hidden" name="rating" value=""></div>' +
      '<label><span>' + u('rvName') + '</span><input type="text" name="name" maxlength="60" autocomplete="name" required></label>' +
      '<label><span>' + u('rvRole') + '</span><input type="text" name="role" maxlength="80"></label>' +
      '<label><span>' + u('rvText') + '</span><textarea name="text" rows="4" maxlength="800" required></textarea></label>' +
      '<label><span>' + u('rvContact') + '</span><input type="text" name="contact" maxlength="120" dir="auto"></label>' +
      '<div class="hp" aria-hidden="true"><input type="text" name="website" tabindex="-1" autocomplete="off"></div>' +
      '<p class="form-note" id="rvNote" role="status"></p><button class="btn btn-primary" type="submit">' + u('rvSend') + '</button></form>';
    return head({ kicker: kick, title: title, sub: sub }) +
      '<div class="rv-grid">' + (summary || (RV && !sm.count ? '<p class="rv-empty">' + esc(tx(R.emptyText) || u('rvEmpty')) + '</p>' : '')) + (cards ? '<div class="rv-list">' + cards + '</div>' : '') + '</div>' + form;
  }
  SECTION.reviews = function () {
    var R = D.reviews || {};
    if (R.showWhenEmpty === false && RV && !RV.summary.count) return '';
    return '<section class="section section-alt" id="reviews"><div class="container">' + reviewsInner() + '</div></section>';
  };
  function paintReviews() {
    var sec = $('#reviews'), R = D.reviews || {};
    if (sec) { if (R.showWhenEmpty === false && RV && !RV.summary.count) sec.remove(); else sec.querySelector('.container').innerHTML = reviewsInner(); }
    var hero = $('.hero-text'), old = $('.hero-rating'); if (old) old.remove();
    if (hero && RV && RV.summary.count) {
      var a = doc.createElement('a'); a.className = 'hero-rating'; a.href = '#reviews'; a.innerHTML = starsHtml(RV.summary.avg) + '<b>' + esc(RV.summary.avg) + '</b><span>' + RV.summary.count + ' ' + u('rvCount') + '</span>';
      var act = $('.hero-actions', hero); hero.insertBefore(a, act);
    }
  }
  function loadReviews() {
    if (rvLoading) return; rvLoading = true;
    fetch('/api/reviews', { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (j) { if (j && j.ok) { RV = j; paintReviews(); if (window.__hashRescroll) setTimeout(window.__hashRescroll, 80); } }).catch(function () { /* القسم بيفضل بالنموذج بس */ }).then(function () { rvLoading = false; });
  }
  function submitReview(form) {
    var note = $('#rvNote'), rating = Number(form.rating.value), name = form.name.value.trim(), text = form.text.value.trim();
    if (!rating) { note.textContent = u('rvNeedStars'); note.className = 'form-note err'; return; }
    if (name.length < 2 || text.length < 10) { note.textContent = u('rvNeedText'); note.className = 'form-note err'; return; }
    var btn = $('button[type=submit]', form); btn.disabled = true; note.textContent = '…'; note.className = 'form-note';
    fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rating: rating, name: name, role: form.role.value, text: text, contact: form.contact.value, website: form.website.value, token: RV && RV.token }) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok && j.ok, j: j }; }); })
      .then(function (r) { if (r.ok) { rvSent = true; paintReviews(); } else { btn.disabled = false; note.textContent = (r.j && r.j.message) || u('rvErr'); note.className = 'form-note err'; } })
      .catch(function () { btn.disabled = false; note.textContent = u('rvErr'); note.className = 'form-note err'; });
  }

  /* ---------- أقسام إضافية يضيفها المدير ---------- */
  function renderCustom(c) {
    if (!c) return '';
    var body = '';
    if (c.layout === 'cards') {
      body = '<div class="cards-3">' + arr(c.cards).map(function (x) {
        var inner = '<div class="svc-icon">' + ic(x.icon || 'check') + '</div><h3>' + esc(tx(x.title)) + '</h3><p>' + esc(tx(x.text)) + '</p>';
        return '<article class="card service reveal">' + inner + (url(x.link) ? '<a class="btn btn-outline btn-sm" href="' + esc(url(x.link)) + '" target="_blank" rel="noopener"><span>' + esc(tx(x.linkLabel) || u('visit')) + '</span></a>' : '') + '</article>';
      }).join('') + '</div>';
    } else if (c.layout === 'gallery') {
      body = '<div class="thumbs thumbs-big reveal" data-cgallery="' + esc(c.id) + '">' + arr(c.images).map(function (src, i) { return '<button type="button" class="thumb" data-lb-src="' + esc(url(src)) + '" data-i="' + i + '"><img src="' + esc(url(src)) + '" alt="" loading="lazy"></button>'; }).join('') + '</div>';
    } else {
      body = '<div class="custom-text reveal' + (c.image ? ' has-img' : '') + '"><div class="ct-body">' + rich(c.body) + '</div>' + (c.image ? '<figure class="ct-img"><img src="' + esc(url(c.image)) + '" alt="" loading="lazy"></figure>' : '') + '</div>';
    }
    return '<section class="section' + (c.alt ? ' section-alt' : '') + '" id="' + esc(c.id) + '"><div class="container">' + head(c) + body + '</div></section>';
  }

  /* ---------- المشاريع ---------- */
  function statusBadge(p) {
    var cls = p.status === 'sample' || p.status === 'demo' ? 'badge-ai' : p.status === 'dev' ? 'badge-dev' : p.status === 'none' ? '' : 'badge-live';
    var text = p.badge && tx(p.badge) ? tx(p.badge) : p.status === 'sample' ? u('statusSample') : p.status === 'demo' ? u('statusDemo') : p.status === 'dev' ? u('statusDev') : p.status === 'none' ? '' : u('statusLive');
    return text ? '<span class="badge ' + cls + '">' + esc(text) + '</span>' : '';
  }
  function typeBadge(p) { return p.type && tx(p.type) ? '<span class="badge badge-type">' + esc(tx(p.type)) + '</span>' : ''; }
  function techRow(p) {
    var t = Array.isArray(p.tech) ? p.tech : String(p.tech || '').split(',');
    t = t.map(function (x) { return String(x).trim(); }).filter(Boolean);
    return t.length ? '<div class="tech">' + t.map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</div>' : '';
  }
  function actions(p) {
    var h = '';
    if (p.demo) h += '<button class="btn btn-primary" type="button" data-demo="' + esc(p.demo) + '" data-pid="' + esc(p.id) + '">' + ic('play') + '<span>' + u('demo') + '</span></button>';
    if (url(p.link)) h += '<a class="btn btn-outline" href="' + esc(url(p.link)) + '" target="_blank" rel="noopener">' + ic('ext') + '<span>' + esc(tx(p.linkLabel) || u('visit')) + '</span></a>';
    if (url(p.apk)) h += '<a class="btn btn-gold" href="' + esc(url(p.apk)) + '" rel="noopener">' + ic('dl') + '<span>' + esc(tx(p.apkLabel) || (lang() === 'ar' ? 'تحميل التطبيق (APK)' : 'Download the app (APK)')) + '</span></a>';
    if (url(p.file)) h += '<a class="btn btn-outline" href="' + esc(url(p.file)) + '" download>' + ic('dl') + '<span>' + esc(tx(p.fileLabel) || (lang() === 'ar' ? 'تحميل الملف' : 'Download file')) + '</span></a>';
    if (p.wa !== false && (p.demo || p.kind === 'feature' || p.kind === 'showcase')) h += '<a class="btn btn-wa" data-wa="' + esc(p.id) + '" href="#" target="_blank" rel="noopener">' + ic('wa') + '<span>' + u('live') + '</span></a>';
    return h ? '<div class="project-actions">' + h + '</div>' : '';
  }
  function thumbs(p, cls) {
    var im = arr(p.images).filter(Boolean); if (!im.length) return '';
    return '<div class="gallery" data-pgallery="' + esc(p.id) + '"><p class="media-label">' + ic('image') + '<span>' + u('shots') + '</span></p><div class="thumbs ' + (cls || '') + '">' +
      im.map(function (src, i) { return '<button type="button" class="thumb" data-lb-p="' + esc(p.id) + '" data-i="' + i + '"><img src="' + esc(url(src)) + '" alt="" loading="lazy"></button>'; }).join('') + '</div></div>';
  }
  function feats(p) { return arr(p.features).length ? '<ul class="checks">' + arr(p.features).map(function (f) { return '<li>' + esc(tx(f)) + '</li>'; }).join('') + '</ul>' : ''; }
  function head3(p) { return '<h3 class="project-title">' + esc(tx(p.title)) + '</h3>' + (p.alt && tx(p.alt) ? '<p class="project-alt">' + esc(tx(p.alt)) + '</p>' : ''); }

  function catAttr(p, d) { return [p.cat, p.cat2].filter(Boolean).join(' ') || d; }
  function catHas(attr, f) { return (' ' + (attr || '') + ' ').indexOf(' ' + f + ' ') >= 0; }
  var KIND = {
    feature: function (p, i) {
      var mock = p.demo ? '<button class="demo-preview' + (p.demo === 'hr' ? ' dp-hr' : '') + '" type="button" data-demo="' + esc(p.demo) + '" data-pid="' + esc(p.id) + '" aria-label="' + esc(u('demo')) + '"><span class="dp-bar"><i></i><i></i><i></i></span><span class="dp-body"><span class="dp-side"></span><span class="dp-main"><span class="dp-kpis"><b></b><b></b><b></b></span><span class="dp-rows"><b></b><b></b><b></b><b></b></span></span></span><span class="dp-play">' + ic('play') + '<span>' + u('demo') + '</span></span></button>' : '';
      var cover = !p.demo && arr(p.images)[0] ? '' : '';
      return '<article class="project' + (i % 2 ? ' project-flip' : '') + ' reveal" id="' + esc(p.id) + '" data-cat="' + esc(catAttr(p, 'other')) + '"><div class="project-body"><div class="project-badges">' + statusBadge(p) + typeBadge(p) + '</div>' +
        head3(p) + '<p>' + esc(tx(p.text)) + '</p>' + feats(p) + techRow(p) + actions(p) + '</div><div class="project-media">' + mock + cover + thumbs(p) + videoBox(p) + '</div></article>';
    },
    showcase: function (p) {
      var first = arr(p.images)[0];
      return '<article class="card showcase reveal" id="' + esc(p.id) + '" data-cat="' + esc(catAttr(p, 'other')) + '">' +
        (first ? '<button type="button" class="sc-cover" data-lb-p="' + esc(p.id) + '" data-i="0" aria-label="' + esc(u('shotsOpen')) + '"><img src="' + esc(url(first)) + '" alt="' + esc(tx(p.title)) + '" loading="lazy">' + (arr(p.images).length > 1 ? '<span class="sc-count">' + ic('image') + arr(p.images).length + '</span>' : '') + '</button>' : '') +
        '<div class="sc-body"><div class="project-badges">' + statusBadge(p) + typeBadge(p) + '</div><h3>' + esc(tx(p.title)) + '</h3><p class="sc-text">' + esc(tx(p.text)) + '</p>' +
        (arr(p.features).length ? '<ul class="dots sc-list">' + arr(p.features).slice(0, 4).map(function (f) { return '<li>' + esc(tx(f)) + '</li>'; }).join('') + '</ul>' : '') +
        techRow(p) + actions(p) + '</div></article>';
    },
    site: function (p) {
      var first = arr(p.images)[0] || p.cover;
      return '<article class="card site-card reveal" id="' + esc(p.id) + '" data-cat="' + esc(catAttr(p, 'web')) + '">' +
        (first ? '<div class="site-cover"><img src="' + esc(url(first)) + '" alt="" loading="lazy" width="600" height="315"></div>' : '<div class="site-cover cover-rock"><span class="rock-mark">' + esc(tx(p.title)) + '</span></div>') +
        '<div class="site-body"><div class="project-badges">' + statusBadge(p) + typeBadge(p) + '</div><h3>' + esc(tx(p.title)) + '</h3><p>' + esc(tx(p.text)) + '</p>' + (arr(p.features).length ? '<ul class="dots">' + arr(p.features).map(function (f) { return '<li>' + esc(tx(f)) + '</li>'; }).join('') + '</ul>' : '') + techRow(p) + actions(p).replace('project-actions', 'project-actions sc-actions') + '</div></article>';
    },
    mini: function (p) {
      return '<article class="card mini-project reveal" id="' + esc(p.id) + '" data-cat="' + esc(catAttr(p, 'other')) + '"><div class="svc-icon">' + ic(p.icon || 'layers') + '</div><h3>' + esc(tx(p.title)) + '</h3><p>' + esc(tx(p.text)) + '</p>' + thumbs(p, 'thumbs-sm') + actions(p) + '</article>';
    }
  };
  function videoBox(p) {
    return url(p.video) ? '<div class="video-box"><p class="media-label">' + ic('video') + '<span>' + u('video') + '</span></p><video controls preload="metadata" playsinline src="' + esc(url(p.video)) + '"></video></div>' : '';
  }
  var activeFilter = 'all', moreOpen = false, SC_SHOW = 6;
  function syncMore() {
    var cards = $$('#projects .showcase'), collapse = activeFilter === 'all' && !moreOpen;
    cards.forEach(function (c, i) { c.classList.toggle('m-hide', collapse && i >= SC_SHOW); });
    var b = $('#projects [data-more]'); if (b) { b.parentNode.style.display = activeFilter === 'all' ? '' : 'none'; b.textContent = moreOpen ? u('lessProj') : u('moreProj') + ' (' + cards.length + ')'; }
  }
  function renderProjects() {
    var P = D.projects || {}, items = arr(P.items).filter(vis);
    var cats = arr(P.cats).filter(function (c) { return items.some(function (p) { return p.cat === c.id || p.cat2 === c.id; }); });
    var filters = cats.length > 1 ? '<div class="filters" role="tablist"><button type="button" class="' + (activeFilter === 'all' ? 'on' : '') + '" data-filter="all">' + u('all') + '</button>' +
      cats.map(function (c) { return '<button type="button" class="' + (activeFilter === c.id ? 'on' : '') + '" data-filter="' + esc(c.id) + '">' + esc(tx(c.label)) + '</button>'; }).join('') + '</div>' : '';
    var order = [['feature', 'groupFeature', null], ['showcase', 'groupShowcase', 'cards-3 showcase-grid'], ['site', 'groupSite', 'cards-3'], ['mini', 'groupMini', 'cards-2']];
    var G = P.groupTitles || {};
    var html = order.map(function (g) {
      var list = items.filter(function (p) { return (p.kind || 'feature') === g[0]; }); if (!list.length) return '';
      var title = Object.prototype.hasOwnProperty.call(G, g[0]) ? tx(G[g[0]]) : u(g[1]); // عنوان فاضي = من غير عنوان فرعي
      var sub = title ? '<div class="sub-head reveal" data-group="' + g[0] + '"><h3>' + esc(title) + '</h3></div>' : '';
      var cards = list.map(function (p, i) { return KIND[g[0]](p, i); }).join('');
      return sub + (g[2] ? '<div class="' + g[2] + '">' + cards + '</div>' : cards) + (g[0] === 'showcase' && list.length > SC_SHOW ? '<div class="more-wrap"><button type="button" class="btn btn-ghost" data-more></button></div>' : '');
    }).join('');
    return '<section class="section section-alt" id="projects"><div class="container">' + head(P) + filters + html + '</div></section>';
  }

  /* ---------- التذييل ---------- */
  function renderFooter() {
    var l = '';
    if (S.email) l += '<a href="mailto:' + esc(S.email) + '" aria-label="Email">' + ic('mail') + '</a>';
    if (waNum()) l += '<a data-wa="general" href="#" target="_blank" rel="noopener" aria-label="WhatsApp">' + ic('wa') + '</a>';
    if (S.linkedin) l += '<a href="' + esc(url(S.linkedin)) + '" target="_blank" rel="noopener" aria-label="LinkedIn">' + ic('in') + '</a>';
    if (S.github) l += '<a href="' + esc(url(S.github)) + '" target="_blank" rel="noopener" aria-label="GitHub">' + ic('gh') + '</a>';
    $('#footer').innerHTML = '<div class="container footer-inner"><p>© ' + new Date().getFullYear() + ' ' + esc(tx(S.name)) + (S.role ? ' — ' + esc(tx(S.footer) || tx(S.role)) : '') + '</p><div class="footer-links">' + l + '</div></div>';
  }

  /* ---------- الرسم الكامل ---------- */
  function renderAll(instant) {
    renderHeader();
    var html = renderHero();
    sections().forEach(function (s) {
      if (s.id.indexOf('c:') === 0) html += renderCustom(arr(D.custom).filter(function (c) { return c.id === s.id.slice(2); })[0]);
      else if (SECTION[s.id]) html += SECTION[s.id]();
    });
    $('#main').innerHTML = html;
    renderFooter();
    var wa = $('#waFloat'); wa.style.display = waNum() ? '' : 'none';
    $('#demoNotice').textContent = tx(S.demoNotice) || u('notice');
    $('#demoWaLabel').textContent = u('live');
    var seo = S.seo || {}; if (tx(seo.title)) doc.title = tx(seo.title);
    var m = $('meta[name="description"]'); if (m && tx(seo.description)) m.content = tx(seo.description);
    $$('#projects [data-cat]').forEach(function (el) { el.classList.toggle('f-hide', activeFilter !== 'all' && !catHas(el.getAttribute('data-cat'), activeFilter)); });
    syncMore();
    updateWa();
    if (RV) paintReviews(); else loadReviews();
    initReveal(instant);
    initScrollSpy();
  }

  /* ---------- سلوكيات ---------- */
  var io, spy;
  function initReveal(instant) {
    var els = $$('.reveal');
    if (instant || !('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    if (io) io.disconnect();
    io = new IntersectionObserver(function (entries) { entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }
  function initScrollSpy() {
    if (!('IntersectionObserver' in window)) return;
    if (spy) spy.disconnect();
    var nav = $('#nav'), links = {};
    $$('a[href^="#"]', nav).forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && links[en.target.id]) { $$('a', nav).forEach(function (a) { a.classList.remove('active'); }); if (!links[en.target.id].classList.contains('nav-cta')) links[en.target.id].classList.add('active'); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(function (s) { spy.observe(s); });
  }
  function setTheme(t, save) {
    root.setAttribute('data-theme', t);
    var m = $('meta[name="theme-color"]'); if (m) m.content = t === 'dark' ? '#0A1322' : '#1D4E89';
    if (save) store.set('theme', t);
  }
  function applyLang(l, save) {
    root.lang = l; root.dir = l === 'ar' ? 'rtl' : 'ltr';
    if (save) store.set('lang', l);
    renderAll(true);
    doc.dispatchEvent(new Event('langchange'));
  }
  var toastTimer;
  function toast(msg) { var el = $('#toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(function () { el.classList.remove('show'); }, 3200); }
  window.SiteToast = toast;

  /* عارض الصور */
  var lb, lbImg, lbCap, lbItems = [], lbIndex = 0, lbTitle = '', lastFocus;
  function openLb(srcs, i, title) { lbItems = srcs; lbIndex = i; lbTitle = title; lastFocus = doc.activeElement; showLb(); lb.hidden = false; doc.body.classList.add('no-scroll'); $('.lb-close', lb).focus(); }
  function showLb() { lbImg.src = lbItems[lbIndex]; lbImg.alt = lbTitle + ' – ' + (lbIndex + 1); lbCap.textContent = lbTitle + ' — ' + (lbIndex + 1) + ' / ' + lbItems.length; var multi = lbItems.length > 1; $('.lb-prev', lb).hidden = !multi; $('.lb-next', lb).hidden = !multi; }
  function stepLb(d) { lbIndex = (lbIndex + d + lbItems.length) % lbItems.length; showLb(); }
  function closeLb() { lb.hidden = true; lbImg.removeAttribute('src'); doc.body.classList.remove('no-scroll'); if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  function initLightbox() {
    lb = $('#lightbox'); lbImg = $('img', lb); lbCap = $('figcaption', lb);
    $('.lb-close', lb).addEventListener('click', closeLb);
    $('.lb-prev', lb).addEventListener('click', function () { stepLb(-1); });
    $('.lb-next', lb).addEventListener('click', function () { stepLb(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.tagName === 'FIGURE') closeLb(); });
    doc.addEventListener('keydown', function (e) {
      if (lb.hidden) return; var rtl = root.dir === 'rtl';
      if (e.key === 'Escape') closeLb(); else if (e.key === 'ArrowRight') stepLb(rtl ? -1 : 1); else if (e.key === 'ArrowLeft') stepLb(rtl ? 1 : -1);
    });
    var x0 = null;
    lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(dx) > 50 && lbItems.length > 1) { var rtl = root.dir === 'rtl'; stepLb((dx < 0) !== rtl ? 1 : -1); } });
  }

  /* الديمو التفاعلي */
  var demoLoaded = null;
  function loadScript(src) { return new Promise(function (res, rej) { var s = doc.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; doc.body.appendChild(s); }); }
  function loadDemo() {
    if (!demoLoaded) {
      var v = (doc.querySelector('script[src*="site.js"]').src.split('?v=')[1] || '1');
      var l = doc.createElement('link'); l.rel = 'stylesheet'; l.href = 'assets/css/demo.css?v=' + v; doc.head.appendChild(l);
      var l2 = doc.createElement('link'); l2.rel = 'stylesheet'; l2.href = 'assets/css/demo-more.css?v=' + v; doc.head.appendChild(l2);
      demoLoaded = loadScript('assets/js/demo.js?v=' + v).then(function () { return loadScript('assets/js/demo-more.js?v=' + v); }).then(function () { return loadScript('assets/js/demo-more2.js?v=' + v); }).then(function () { return loadScript('assets/js/demo-en.js?v=' + v); }).catch(function (e) { demoLoaded = null; throw e; });
    }
    return demoLoaded;
  }
  function openDemo(kind, pid, opener) {
    var dlg = $('#demoDialog'), rootEl = $('#demoRoot'), wa = $('#demoWa');
    wa.setAttribute('data-wa', pid || 'general'); wa.href = waUrl(waMsg(pid || 'general'));
    var pj = arr(D.projects && D.projects.items).filter(function (x) { return x.id === pid; })[0];
    $('#demoNotice').textContent = (pj && (pj.status === 'sample' || pj.status === 'demo') && tx(S.demoNoticeSample)) ? tx(S.demoNoticeSample) : (tx(S.demoNotice) || u('notice'));
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    doc.body.classList.add('no-scroll'); dlg._opener = opener;
    rootEl.innerHTML = '<div class="demo-loading">' + u('loading') + '</div>';
    loadDemo().then(function () {
      dlg.classList.toggle('demo-phone', !!(window.MasarDemo.isPhone && window.MasarDemo.isPhone(kind)));
      window.MasarDemo.mount(rootEl, kind);
    }).catch(function () { rootEl.innerHTML = '<div class="demo-loading">Error</div>'; });
  }
  function initDemoDialog() {
    var dlg = $('#demoDialog');
    dlg.addEventListener('close', function () { doc.body.classList.remove('no-scroll'); if (dlg._opener && dlg._opener.focus) dlg._opener.focus(); });
    $('.demo-close', dlg).addEventListener('click', function () { if (dlg.open) dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  }

  /* نموذج التواصل */
  function submitForm(form, how) {
    var name = form.name.value.trim(), msg = form.message.value.trim(), note = $('#formNote');
    if (name.length < 2 || msg.length < 5) { note.textContent = u('f_need'); note.className = 'form-note err'; return; }
    var topic = form.topic ? form.topic.value : '', contact = form.contact.value.trim();
    var text = (lang() === 'ar' ? 'الاسم: ' : 'Name: ') + name + (topic ? '\n' + (lang() === 'ar' ? 'الموضوع: ' : 'Topic: ') + topic : '') + (contact ? '\n' + contact : '') + '\n\n' + msg;
    if (how === 'wa') { window.open(waUrl(text), '_blank', 'noopener'); return; }
    if (how === 'mail') { window.location.href = 'mailto:' + (S.email || '') + '?subject=' + encodeURIComponent(topic || 'Website') + '&body=' + encodeURIComponent(text); return; }
    note.textContent = '…'; note.className = 'form-note';
    fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name, contact: contact, topic: topic, message: msg, website: form.website.value }) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok && j.ok, j: j }; }); })
      .then(function (r) { if (r.ok) { note.textContent = u('f_ok'); note.className = 'form-note ok'; form.reset(); } else { note.textContent = (r.j && r.j.message) || u('f_err'); note.className = 'form-note err'; } })
      .catch(function () { note.textContent = u('f_err'); note.className = 'form-note err'; });
  }

  /* أحداث عامة (event delegation عشان تفضل شغالة بعد إعادة الرسم) */
  function bindGlobal() {
    doc.addEventListener('click', function (e) {
      var t = e.target;
      var d = t.closest && t.closest('[data-demo]');
      if (d) { e.preventDefault(); openDemo(d.getAttribute('data-demo'), d.getAttribute('data-pid'), d); return; }
      var f = t.closest && t.closest('[data-filter]');
      if (f) {
        activeFilter = f.getAttribute('data-filter');
        $$('.filters [data-filter]').forEach(function (b) { b.classList.toggle('on', b === f); b.setAttribute('aria-selected', b === f); });
        $$('#projects [data-cat]').forEach(function (el) { var show = activeFilter === 'all' || catHas(el.getAttribute('data-cat'), activeFilter); el.classList.toggle('f-hide', !show); if (show) el.classList.add('in'); });
        syncMore();
        return;
      }
      if (t.closest && t.closest('[data-more]')) { moreOpen = !moreOpen; syncMore(); $$('#projects .showcase').forEach(function (c) { c.classList.add('in'); }); return; }
      var lp = t.closest && t.closest('[data-lb-p]');
      if (lp) {
        var p = arr(D.projects && D.projects.items).filter(function (x) { return x.id === lp.getAttribute('data-lb-p'); })[0];
        if (p) openLb(arr(p.images).filter(Boolean).map(url), +lp.getAttribute('data-i') || 0, tx(p.title));
        return;
      }
      var lc = t.closest && t.closest('[data-lb-src]');
      if (lc) {
        var box = lc.parentNode, all = $$('[data-lb-src]', box).map(function (b) { return b.getAttribute('data-lb-src'); });
        openLb(all, +lc.getAttribute('data-i') || 0, ''); return;
      }
    });
    doc.addEventListener('click', function (e) {
      var st = e.target.closest && e.target.closest('.star');
      if (st) { var f = st.closest('form'), n = +st.getAttribute('data-star'); f.rating.value = n; $$('.star', f).forEach(function (b) { var on = +b.getAttribute('data-star') <= n; b.classList.toggle('on', on); b.setAttribute('aria-checked', +b.getAttribute('data-star') === n ? 'true' : 'false'); }); }
    });
    doc.addEventListener('submit', function (e) {
      if (e.target.id === 'reviewForm') { e.preventDefault(); submitReview(e.target); return; }
      if (e.target.id !== 'contactForm') return; e.preventDefault();
      var how = (e.submitter && e.submitter.value) || 'send'; submitForm(e.target, how);
    });
  }

  function init() {
    setTheme(root.getAttribute('data-theme') || 'light', false);
    renderAll(false);
    initLightbox(); initDemoDialog(); bindGlobal();
    $('#langToggle').addEventListener('click', function () { applyLang(lang() === 'ar' ? 'en' : 'ar', true); });
    $('#themeToggle').addEventListener('click', function () { setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true); });
    var header = $('.site-header'), nav = $('#nav'), btn = $('#menuToggle');
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    btn.addEventListener('click', function () { var open = nav.classList.toggle('open'); btn.setAttribute('aria-expanded', open); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); } });
    doc.addEventListener('click', function (e) { if (nav.classList.contains('open') && !nav.contains(e.target) && !btn.contains(e.target)) { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); } });
    if (window.matchMedia) {
      var mq = matchMedia('(prefers-color-scheme: dark)');
      var onMq = function (e) { if (!store.get('theme')) setTheme(e.matches ? 'dark' : 'light', false); };
      if (mq.addEventListener) mq.addEventListener('change', onMq);
    }
    /* الروابط المباشرة (#reviewForm مثلاً): الصفحة بتتحرك بعد التحميل (تقييمات وخطوط)، فبنعيد التمرير للهدف لحد ما الزائر يمرّر بنفسه */
    if (location.hash.length > 1) {
      var hashId = decodeURIComponent(location.hash.slice(1)), stop = false;
      var goHash = function () { if (stop) return; var el = doc.getElementById(hashId); if (el) el.scrollIntoView({ block: 'start', behavior: 'instant' }); };
      ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (ev) { window.addEventListener(ev, function () { stop = true; }, { once: true, passive: true }); });
      setTimeout(goHash, 60); setTimeout(goHash, 700); setTimeout(goHash, 1600); window.addEventListener('load', function () { setTimeout(goHash, 100); });
      window.__hashRescroll = goHash;
    }
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init); else init();
})();
