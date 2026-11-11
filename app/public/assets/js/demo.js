/* =========================================================
   Masar — Interactive demos (Operations & Accounts / HR)
   ⚠️ كل البيانات هنا وهمية بالكامل ومولّدة بالجافاسكريبت.
   مفيش أي اتصال بسيرفر، وأي تعديل بيتمسح لما الصفحة تتقفل.
   ========================================================= */
(function () {
  'use strict';
  const doc = document;
  let forced = null; // بعض النماذج (للعملاء الأجانب) واجهتها إنجليزي دايماً بغض النظر عن لغة الموقع
  const lang = () => forced || (doc.documentElement.lang === 'en' ? 'en' : 'ar');
  const L = (ar, en) => (lang() === 'en' ? en : ar);
  const T = (o) => (o == null ? '' : typeof o === 'string' || typeof o === 'number' ? String(o) : o[lang()]);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ic = (n) => `<svg class="ic" aria-hidden="true"><use href="#d-${n}"/></svg>`;
  const num = (n) => Number(n).toLocaleString('en-US');
  const money = (n) => `${num(n)} ${L('ج.م', 'EGP')}`;
  const pad = (n) => String(n).padStart(2, '0');
  // \u2066…\u2069 بيثبّت اتجاه التاريخ جوه النص العربي
  const fmtD = (d) => `\u2066${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}\u2069`;
  const TODAY = new Date(); TODAY.setHours(0, 0, 0, 0);
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const normDigits = (s) => String(s).replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
  const norm = (s) => normDigits(s).toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').trim();

  /* ---------- seeded random (عشان البيانات تفضل ثابتة) ---------- */
  function rng(seed) {
    let a = seed >>> 0;
    const r = () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    r.int = (min, max) => Math.floor(r() * (max - min + 1)) + min;
    r.pick = (arr) => arr[Math.floor(r() * arr.length)];
    r.digits = (n) => { let s = ''; for (let i = 0; i < n; i++) s += Math.floor(r() * 10); return s; };
    return r;
  }

  /* ---------- أسماء وهمية ---------- */
  const MALE = [['أحمد', 'Ahmed'], ['محمد', 'Mohamed'], ['محمود', 'Mahmoud'], ['مصطفى', 'Mostafa'], ['علي', 'Ali'], ['حسن', 'Hassan'], ['حسين', 'Hussein'], ['إبراهيم', 'Ibrahim'], ['يوسف', 'Youssef'], ['عمر', 'Omar'], ['خالد', 'Khaled'], ['طارق', 'Tarek'], ['كريم', 'Karim'], ['سامح', 'Sameh'], ['هشام', 'Hesham'], ['وليد', 'Waleed'], ['شريف', 'Sherif'], ['عبدالله', 'Abdullah'], ['رامي', 'Ramy'], ['ياسر', 'Yasser'], ['أيمن', 'Ayman'], ['عادل', 'Adel'], ['سعيد', 'Saeed'], ['ممدوح', 'Mamdouh'], ['أسامة', 'Osama'], ['تامر', 'Tamer']];
  const FEMALE = [['منى', 'Mona'], ['سارة', 'Sara'], ['نورا', 'Noura'], ['ريهام', 'Reham'], ['دينا', 'Dina'], ['هبة', 'Heba'], ['ياسمين', 'Yasmin'], ['إيمان', 'Eman'], ['مروة', 'Marwa'], ['آية', 'Aya']];
  const LAST = [['عبدالعزيز', 'Abdelaziz'], ['السيد', 'El-Sayed'], ['فتحي', 'Fathy'], ['رمضان', 'Ramadan'], ['الشافعي', 'El-Shafei'], ['منصور', 'Mansour'], ['عبدالرحمن', 'Abdelrahman'], ['سليمان', 'Soliman'], ['الجندي', 'El-Gendy'], ['حمدي', 'Hamdy'], ['زكي', 'Zaki'], ['النجار', 'El-Naggar'], ['البنا', 'El-Banna'], ['عثمان', 'Osman'], ['شاهين', 'Shahin'], ['قاسم', 'Kassem'], ['بدوي', 'Badawy'], ['صبري', 'Sabry'], ['الشربيني', 'El-Sherbiny'], ['جاد', 'Gad']];
  function person(r, female) {
    const f = r.pick(female ? FEMALE : MALE), m = r.pick(MALE), l = r.pick(LAST);
    return { ar: `${f[0]} ${m[0]} ${l[0]}`, en: `${f[1]} ${m[1]} ${l[1]}`, female: !!female };
  }
  const mobile = (r) => '01' + r.pick(['0', '1', '2', '5']) + r.digits(8);
  const nid = (r) => r.pick(['2', '3']) + r.pick(['8', '9', '0']) + r.digits(12);

  /* ---------- أيقونات الديمو ---------- */
  function injectIcons() {
    if (doc.getElementById('demo-icons')) return;
    const p = (d) => `<path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="${d}"/>`;
    const icons = {
      dash: p('M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z'),
      folder: p('M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'),
      scan: p('M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M4 12h16'),
      wallet: p('M4 7h15a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a2 2 0 0 1 2-2h11M16 13.5h.01'),
      cash: p('M3 7h18v10H3zM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM6 10v4M18 10v4'),
      chart: p('M4 20V10M10 20V4M16 20v-7M22 20H2'),
      users: p('M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21a7 7 0 0 1 14 0M16 3.5a4 4 0 0 1 0 7.5M22 21a7 7 0 0 0-4-6.3'),
      shield: p('M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z M9 12l2 2 4-4'),
      upload: p('M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3'),
      kanban: p('M4 4h4v16H4zM10 4h4v10h-4zM16 4h4v13h-4z'),
      db: p('M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3'),
      search: p('M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4'),
      print: p('M7 9V3h10v6M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M7 14h10v7H7z'),
      qr: p('M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2M14 18h2v2M18 18h2v2'),
      excel: p('M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8zM14 3v5h5M9 12l4 5M13 12l-4 5'),
      pdf: p('M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8zM14 3v5h5M8 14h8M8 17h5'),
      plus: p('M12 5v14M5 12h14'),
      save: p('M5 3h11l3 3v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2zM8 3v5h7V3M8 21v-7h8v7'),
      clock: p('M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2'),
      check: p('M5 12.5l4.5 4.5L19 7.5'),
      next: p('M5 12h14m-5-5 5 5-5 5'),
      x: p('M6 6l12 12M18 6 6 18'),
      file: p('M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8zM14 3v5h5M8 13h8M8 17h6'),
      brief: p('M4 7h16v12H4zM9 7V5h6v2M4 12h16'),
      restore: p('M4 12a8 8 0 1 0 2.3-5.7M4 4v4h4'),
      ai: p('M12 3l1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7-4.7-1.8 4.7-1.8z'),
      share: p('M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.6 13.5l6.8 4M15.4 6.5l-6.8 4'),
      star: p('M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z')
    };
    const s = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.id = 'demo-icons'; s.setAttribute('width', '0'); s.setAttribute('height', '0'); s.style.position = 'absolute';
    s.innerHTML = Object.keys(icons).map((k) => `<symbol id="d-${k}" viewBox="0 0 24 24">${icons[k]}</symbol>`).join('');
    doc.body.prepend(s);
  }

  /* =========================================================
     عناصر مشتركة
     ========================================================= */
  function hl(text, q) {
    const t = esc(text);
    if (!q) return t;
    const terms = q.split(/\s+/).filter(Boolean).map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    if (!terms.length) return t;
    try { return t.replace(new RegExp(`(${terms.join('|')})`, 'gi'), '<mark class="dm-hl">$1</mark>'); } catch (e) { return t; }
  }
  function kpi(icon, val, label, cls) {
    return `<div class="dm-kpi"><span class="k-ic ${cls || ''}">${ic(icon)}</span><div><b>${val}</b><span>${label}</span></div></div>`;
  }
  function bars(rows, gold) {
    const max = Math.max(1, ...rows.map((x) => x.v));
    return `<div class="dm-bars">${rows.map((x) => `<div class="dm-bar"><span>${x.l}</span><span class="track"><span class="fill ${gold ? 'g' : ''}" style="width:${Math.round((x.v / max) * 100)}%"></span></span><b>${num(x.v)}</b></div>`).join('')}</div>`;
  }
  function table(head, rows, opts) {
    opts = opts || {};
    return `<div class="dm-table-wrap"><table class="dm-table"><thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody ${opts.bodyId ? `id="${opts.bodyId}"` : ''}>${rows || ''}</tbody>${opts.foot || ''}</table></div>`;
  }
  const emptyRow = (cols) => `<tr><td colspan="${cols}" class="dm-empty">${L('لا توجد نتائج مطابقة', 'No matching results')}</td></tr>`;

  /* =========================================================
     هيكل التطبيق (Sidebar + Topbar + Content)
     ========================================================= */
  function App(cfg) { this.cfg = cfg; this.view = cfg.nav[0].id; this.s = cfg.state(); }
  App.prototype.mount = function (root) {
    this.root = root; const app = this;
    root.onclick = function (e) {
      const v = e.target.closest('[data-view]');
      if (v && root.contains(v)) { app.go(v.getAttribute('data-view')); return; }
      const a = e.target.closest('[data-act]');
      if (a && root.contains(a)) { const fn = app.cfg.acts[a.getAttribute('data-act')]; if (fn) fn(app, a, e); }
    };
    root.oninput = function (e) { const el = e.target.closest('[data-in]'); if (el) { const fn = app.cfg.acts[el.getAttribute('data-in')]; if (fn) fn(app, el, e); } };
    root.onchange = function (e) { const el = e.target.closest('[data-ch]'); if (el) { const fn = app.cfg.acts[el.getAttribute('data-ch')]; if (fn) fn(app, el, e); } };
    root.onkeydown = function (e) {
      if (e.key === 'Escape' && app.root.querySelector('.dm-drawer')) { e.preventDefault(); e.stopPropagation(); app.closeDrawer(); }
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.click')) { e.preventDefault(); e.target.click(); }
    };
    this.render();
  };
  App.prototype.render = function () {
    const c = this.cfg, cur = c.nav.find((n) => n.id === this.view);
    if (c.phone) {
      this.root.innerHTML = `<div class="ph-wrap ${c.cls}"><div class="ph"><div class="ph-screen">
        <header class="ph-top">${c.logo ? `<span class="ph-logo">${T(c.logo)}</span>` : `<img class="ph-logo" src="assets/img/projects/wesal-icon.png" alt="" onerror="this.outerHTML='<span class=ph-logo>${L('و', 'W')}</span>'">`}<div><b>${T(c.name)}</b><small>${T(cur.label)} · ${fmtD(TODAY)}</small></div></header>
        <div class="ph-content dm-main" id="dmContent">${c.views[this.view](this)}</div><div class="dm-toast" role="status" aria-live="polite"></div>
        <nav class="ph-nav" aria-label="${L('قائمة التطبيق', 'App menu')}">${c.nav.map((n) => `<button type="button" data-view="${n.id}" class="${n.id === this.view ? 'on' : ''}" ${n.id === this.view ? 'aria-current="page"' : ''}>${ic(n.icon)}<span>${T(n.label)}</span></button>`).join('')}</nav>
      </div></div></div>`;
      return;
    }
    this.root.innerHTML = `<div class="dm ${c.cls}">
      <aside class="dm-side">
        <div class="dm-logo"><span class="dm-logo-mark">${c.mark ? T(c.mark) : L('م', 'M')}</span><div><b>${T(c.name)}</b><small>${T(c.sub)}</small></div></div>
        <nav class="dm-nav" aria-label="${L('قائمة النظام', 'System menu')}">${c.nav.map((n) => `<button type="button" data-view="${n.id}" class="${n.id === this.view ? 'on' : ''}" ${n.id === this.view ? 'aria-current="page"' : ''}>${ic(n.icon)}<span>${T(n.label)}</span></button>`).join('')}</nav>
        <div class="dm-user"><span class="dm-avatar">${L('ت', 'D')}</span><div><b>${L('مستخدم تجريبي', 'Demo user')}</b>${L('مدير النظام', 'Administrator')}</div></div>
      </aside>
      <section class="dm-main">
        <header class="dm-top"><h2>${T(cur.label)}</h2><span class="dm-date">${ic('clock')} ${fmtD(TODAY)}</span></header>
        <div class="dm-content" id="dmContent">${c.views[this.view](this)}</div>
        <div class="dm-toast" role="status" aria-live="polite"></div>
      </section>
    </div>`;
    const after = c.after && c.after[this.view]; if (after) after(this);
  };
  App.prototype.go = function (view) { this.view = view; this.render(); const n = this.root.querySelector('.dm-nav .on'); if (n && n.scrollIntoView) n.scrollIntoView({ block: 'nearest', inline: 'nearest' }); };
  App.prototype.$ = function (s) { return this.root.querySelector(s); };
  App.prototype.toast = function (msg) {
    const t = this.$('.dm-toast'); if (!t) return;
    t.textContent = msg; t.classList.add('show'); clearTimeout(this._tt); this._tt = setTimeout(() => t.classList.remove('show'), 3000);
  };
  App.prototype.drawer = function (title, body) {
    this.closeDrawer();
    const main = this.$('.dm-main');
    const bg = doc.createElement('div'); bg.className = 'dm-drawer-bg'; bg.onclick = () => this.closeDrawer();
    const d = doc.createElement('div'); d.className = 'dm-drawer'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', title.replace(/<[^>]+>/g, ''));
    d.innerHTML = `<div class="dm-drawer-head"><h3>${title}</h3><button type="button" class="dm-x" data-act="closeDrawer" aria-label="${L('إغلاق', 'Close')}">${ic('x')}</button></div><div class="dm-drawer-body">${body}</div>`;
    main.appendChild(bg); main.appendChild(d);
    const x = d.querySelector('.dm-x'); if (x) x.focus();
  };
  App.prototype.closeDrawer = function () { this.root.querySelectorAll('.dm-drawer,.dm-drawer-bg').forEach((n) => n.remove()); };
  const disabledMsg = (what) => L(`${what} متاح في النظام الكامل – معطّل في العرض التوضيحي`, `${what} is available in the full system – disabled in this demo`);

  /* =========================================================
     1) نظام مسار للعمليات والحسابات
     ========================================================= */
  const STAGES = [
    { ar: 'الكشف الطبي', en: 'Medical check' }, { ar: 'البصمة', en: 'Fingerprint' }, { ar: 'القنصلية', en: 'Consulate' },
    { ar: 'التأشيرة', en: 'Visa' }, { ar: 'السفر', en: 'Travel' }, { ar: 'مكتمل', en: 'Completed' }
  ];
  const NEXT = [
    { ar: 'حجز موعد الكشف الطبي', en: 'Book the medical check appointment' }, { ar: 'حجز موعد البصمة', en: 'Book the fingerprint appointment' },
    { ar: 'تقديم الملف للقنصلية', en: 'Submit the file to the consulate' }, { ar: 'متابعة صدور التأشيرة', en: 'Follow up on visa issuance' },
    { ar: 'تأكيد موعد السفر', en: 'Confirm the travel date' }, { ar: 'لا يوجد – الملف مكتمل', en: 'None – file completed' }
  ];
  const JOBS = [['سائق', 'Driver'], ['فني كهرباء', 'Electrician'], ['فني تكييف', 'HVAC technician'], ['طباخ', 'Cook'], ['عامل بناء', 'Construction worker'], ['نجار', 'Carpenter'], ['سباك', 'Plumber'], ['محاسب', 'Accountant'], ['فني لحام', 'Welder'], ['ممرض', 'Nurse']].map((j) => ({ ar: j[0], en: j[1] }));
  const DEST = [['السعودية', 'Saudi Arabia'], ['الكويت', 'Kuwait'], ['قطر', 'Qatar'], ['الإمارات', 'UAE'], ['عُمان', 'Oman'], ['البحرين', 'Bahrain']].map((j) => ({ ar: j[0], en: j[1] }));
  const stagePill = (i) => `<span class="dm-pill p${i}">${T(STAGES[i])}</span>`;

  function opsState() {
    const r = rng(2026);
    const agents = [];
    for (let i = 0; i < 6; i++) agents.push({ id: i + 1, name: person(r), rate: r.pick([500, 600, 750, 800, 1000]), payouts: [] });
    const files = [];
    const stageBag = [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 5, 5, 5, 5];
    for (let i = 0; i < 48; i++) {
      const stage = r.pick(stageBag), created = addDays(TODAY, -r.int(4 + stage * 12, 30 + stage * 25));
      const fee = r.pick([18000, 20000, 22000, 25000, 28000, 30000]);
      const ratio = Math.min(1, 0.15 + stage * 0.2 + r() * 0.2);
      let left = Math.round((fee * ratio) / 500) * 500; const payments = [];
      let d = created; let k = 0;
      while (left > 0 && k < 4) { const amt = k === 3 ? left : Math.min(left, Math.round((fee * (0.2 + r() * 0.3)) / 500) * 500 || 500); d = addDays(d, r.int(2, 18)); if (d > TODAY) d = TODAY; payments.push({ date: d, amount: amt, receipt: 1000 + r.int(1, 8999) }); left -= amt; k++; }
      files.push({
        id: i + 1, no: `M-${String(TODAY.getFullYear()).slice(2)}-${String(1040 + i).padStart(4, '0')}`,
        name: person(r, r() < 0.12), passport: 'A' + r.digits(8), nid: nid(r), mobile: mobile(r),
        job: r.pick(JOBS), dest: r.pick(DEST), agent: r.int(1, 6), stage, created, fee, payments,
        due: stage === 5 ? null : addDays(TODAY, r.int(-1, 14))
      });
    }
    files.sort((a, b) => b.created - a.created);
    const moves = [];
    files.forEach((f) => f.payments.forEach((p) => moves.push({ date: p.date, type: 'in', cat: { ar: 'دفعة من عميل', en: 'Client payment' }, desc: { ar: `${f.no} – إيصال ${p.receipt}`, en: `${f.no} – receipt ${p.receipt}` }, amount: p.amount })));
    agents.forEach((a) => {
      const total = files.filter((f) => f.agent === a.id).length * a.rate; let paid = Math.round((total * (0.35 + r() * 0.5)) / 100) * 100; let n = 0;
      while (paid > 0 && n < 3) { const amt = n === 2 ? paid : Math.min(paid, Math.round((total * 0.3) / 100) * 100 || paid); const date = addDays(TODAY, -r.int(3, 110)); a.payouts.push({ date, amount: amt }); moves.push({ date, type: 'out', cat: { ar: 'عمولة مندوب', en: 'Agent commission' }, desc: a.name, amount: amt }); paid -= amt; n++; }
    });
    for (let m = 0; m < 5; m++) {
      const base = addDays(TODAY, -m * 30 - 2);
      moves.push({ date: base, type: 'out', cat: { ar: 'إيجار المكتب', en: 'Office rent' }, desc: { ar: 'إيجار شهري', en: 'Monthly rent' }, amount: 6000 });
      moves.push({ date: addDays(base, -3), type: 'out', cat: { ar: 'كهرباء وإنترنت', en: 'Electricity & internet' }, desc: { ar: 'فواتير الشهر', en: 'Monthly bills' }, amount: 900 + r.int(0, 6) * 100 });
      moves.push({ date: addDays(base, -9), type: 'out', cat: { ar: 'أدوات مكتبية', en: 'Office supplies' }, desc: { ar: 'ورق وأحبار', en: 'Paper & ink' }, amount: 300 + r.int(0, 5) * 100 });
    }
    moves.sort((a, b) => b.date - a.date);
    const users = [
      { name: { ar: 'مستخدم تجريبي', en: 'Demo user' }, role: { ar: 'مدير النظام', en: 'Administrator' }, perms: [1, 1, 1, 1, 1, 1] },
      { name: person(r), role: { ar: 'محاسب', en: 'Accountant' }, perms: [1, 0, 1, 1, 1, 0] },
      { name: person(r, true), role: { ar: 'إدخال بيانات', en: 'Data entry' }, perms: [1, 1, 0, 0, 0, 0] },
      { name: person(r), role: { ar: 'متابعة الملفات', en: 'File follow-up' }, perms: [1, 0, 0, 0, 1, 0] }
    ];
    const backups = [0, 1, 2].map((i) => ({ date: addDays(TODAY, -i * 7 - 1), size: (14.2 - i * 0.6).toFixed(1) + ' MB', auto: i > 0 }));
    return { files, agents, moves, users, backups, q: '', stage: 'all', accTab: 'clients', accQ: '', mtype: 'all', rep: 'stages', ocr: null };
  }
  const paidOf = (f) => f.payments.reduce((s, p) => s + p.amount, 0);
  const agentById = (app, id) => app.s.agents.find((a) => a.id === id);
  const agentTotals = (app, a) => { const files = app.s.files.filter((f) => f.agent === a.id); const due = files.length * a.rate; const paid = a.payouts.reduce((s, p) => s + p.amount, 0); return { files: files.length, due, paid, rest: due - paid }; };
  const treasury = (app) => { let i = 0, o = 0; app.s.moves.forEach((m) => (m.type === 'in' ? (i += m.amount) : (o += m.amount))); return { i, o, bal: i - o }; };

  function opsFileRows(app) {
    const q = norm(app.s.q), st = app.s.stage;
    const list = app.s.files.filter((f) => {
      if (st !== 'all' && f.stage !== +st) return false;
      if (!q) return true;
      const hay = norm([f.name.ar, f.name.en, f.passport, f.nid, f.mobile, f.no].join(' '));
      return q.split(/\s+/).every((t) => hay.includes(t));
    });
    const qq = app.s.q.trim();
    const cnt = app.$('#dmCount'); if (cnt) cnt.textContent = L(`${list.length} ملف`, `${list.length} files`);
    if (!list.length) return emptyRow(8);
    return list.map((f) => `<tr class="click" tabindex="0" data-act="openFile" data-id="${f.id}">
      <td class="num">${f.no}</td><td><b>${hl(T(f.name), qq)}</b></td><td class="num">${hl(f.passport, qq)}</td><td class="num">${hl(f.nid, qq)}</td>
      <td class="num">${hl(f.mobile, qq)}</td><td>${T(f.job)}</td><td>${stagePill(f.stage)}</td><td class="muted">${T(NEXT[f.stage])}</td></tr>`).join('');
  }

  function barcode(text) {
    let html = '<i style="width:2px"></i><i class="w" style="width:1px;background:transparent"></i><i style="width:2px"></i>';
    for (const ch of text) {
      const bits = ch.charCodeAt(0).toString(2).padStart(8, '0');
      for (let i = 0; i < bits.length; i++) html += `<i style="width:${bits[i] === '1' ? 3 : 1}px;${i % 2 ? 'background:transparent' : ''}"></i>`;
    }
    return html + '<i style="width:2px"></i><i style="width:1px;background:transparent"></i><i style="width:2px"></i>';
  }
  function qrLike(text) {
    const r = rng([...text].reduce((s, c) => s * 31 + c.charCodeAt(0), 7)); const N = 21; let out = '';
    const finder = (x, y, ox, oy) => { const dx = x - ox, dy = y - oy; if (dx < 0 || dy < 0 || dx > 6 || dy > 6) return null; return dx === 0 || dy === 0 || dx === 6 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4); };
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      let v = finder(x, y, 0, 0); if (v === null) v = finder(x, y, N - 7, 0); if (v === null) v = finder(x, y, 0, N - 7);
      if (v === null) v = (x === 7 || y === 7 || (x === N - 8 && y < 8) || (y === N - 8 && x < 8)) ? false : r() < 0.5;
      out += `<i class="${v ? '' : 'w'}"></i>`;
    }
    return out;
  }

  function fileDrawer(app, f) {
    const a = agentById(app, f.agent);
    const steps = STAGES.slice(0, 5).map((s, i) => `<div class="dm-step ${i < f.stage ? 'done' : i === f.stage ? 'cur' : ''}">${T(s)}</div>`).join('');
    const overdue = f.due && f.due < TODAY;
    const body = `
      <div class="dm-steps">${steps}</div>
      <div class="dm-next">${ic('next')}<div><b>${L('الإجراء التالي', 'Next action')}:</b> ${T(NEXT[f.stage])}${f.due ? ` — <span class="${overdue ? 'dm-neg' : ''}">${fmtD(f.due)}${overdue ? ' ' + L('(متأخر)', '(overdue)') : ''}</span>` : ''}</div></div>
      <dl class="dm-dl">
        <dt>${L('رقم الملف', 'File no.')}</dt><dd class="num">${f.no}</dd>
        <dt>${L('رقم الجواز', 'Passport no.')}</dt><dd>${f.passport}</dd>
        <dt>${L('الرقم القومي', 'National ID')}</dt><dd>${f.nid}</dd>
        <dt>${L('الموبايل', 'Mobile')}</dt><dd>${f.mobile}</dd>
        <dt>${L('المهنة', 'Job')}</dt><dd>${T(f.job)}</dd>
        <dt>${L('الوجهة', 'Destination')}</dt><dd>${T(f.dest)}</dd>
        <dt>${L('المندوب', 'Agent')}</dt><dd>${T(a.name)}</dd>
        <dt>${L('تاريخ التسجيل', 'Registered')}</dt><dd>${fmtD(f.created)}</dd>
        <dt>${L('الحساب', 'Account')}</dt><dd>${money(paidOf(f))} / ${money(f.fee)}</dd>
      </dl>
      <div class="dm-actions">
        ${f.stage < 5 ? `<button type="button" class="dm-btn ok" data-act="advance" data-id="${f.id}">${ic('check')}${L('تسجيل إتمام مرحلة', 'Mark stage complete')} «${T(STAGES[f.stage])}»</button>` : ''}
        <button type="button" class="dm-btn" data-act="label" data-id="${f.id}">${ic('qr')}${L('طباعة Barcode / QR', 'Print Barcode / QR')}</button>
        <button type="button" class="dm-btn" data-act="clientStmt" data-id="${f.id}">${ic('file')}${L('كشف حساب العميل', 'Client statement')}</button>
      </div>
      <div id="dmLabelSlot"></div>`;
    app.drawer(`${esc(T(f.name))}`, body);
  }

  function statementDrawer(app, title, lines) {
    let bal = 0, td = 0, tc = 0;
    const rows = lines.sort((a, b) => a.date - b.date).map((x) => { bal += (x.d || 0) - (x.c || 0); td += x.d || 0; tc += x.c || 0; return `<tr><td class="num">${fmtD(x.date)}</td><td>${T(x.desc)}</td><td class="num">${x.d ? num(x.d) : '—'}</td><td class="num">${x.c ? num(x.c) : '—'}</td><td class="num"><b>${num(bal)}</b></td></tr>`; }).join('');
    const foot = `<tfoot><tr><td></td><td>${L('الإجمالي', 'Total')}</td><td class="num">${num(td)}</td><td class="num">${num(tc)}</td><td class="num">${num(td - tc)}</td></tr></tfoot>`;
    app.drawer(title, `${table([L('التاريخ', 'Date'), L('البيان', 'Description'), L('مستحق', 'Due'), L('مدفوع', 'Paid'), L('الرصيد', 'Balance')], rows, { foot })}
      <p class="dm-note">${L('المبالغ بالجنيه المصري', 'Amounts in EGP')}</p>
      <div class="dm-actions" style="margin-top:12px">
        <button type="button" class="dm-btn" data-act="export" data-what="Excel">${ic('excel')}Excel</button>
        <button type="button" class="dm-btn" data-act="export" data-what="PDF">${ic('pdf')}PDF</button>
        <button type="button" class="dm-btn" data-act="export" data-what="print">${ic('print')}${L('طباعة', 'Print')}</button>
      </div>`);
  }

  const REPORTS = {
    stages: { ar: 'الملفات حسب المرحلة', en: 'Files by stage' },
    treasury: { ar: 'ملخص الخزينة حسب البند', en: 'Treasury summary by category' },
    agents: { ar: 'عمولات المندوبين', en: 'Agent commissions' },
    balances: { ar: 'أرصدة العملاء المتبقية', en: 'Outstanding client balances' }
  };
  function reportBody(app) {
    const s = app.s;
    if (s.rep === 'stages') {
      const rows = STAGES.map((st, i) => { const n = s.files.filter((f) => f.stage === i).length; return `<tr><td>${stagePill(i)}</td><td class="num">${n}</td><td class="num">${Math.round((n / s.files.length) * 100)}%</td></tr>`; }).join('');
      return table([L('المرحلة', 'Stage'), L('عدد الملفات', 'Files'), L('النسبة', 'Share')], rows, { foot: `<tfoot><tr><td>${L('الإجمالي', 'Total')}</td><td class="num">${s.files.length}</td><td class="num">100%</td></tr></tfoot>` });
    }
    if (s.rep === 'treasury') {
      const g = {}; s.moves.forEach((m) => { const k = m.type + '|' + T(m.cat); g[k] = g[k] || { type: m.type, cat: T(m.cat), n: 0, sum: 0 }; g[k].n++; g[k].sum += m.amount; });
      const t = treasury(app);
      const rows = Object.values(g).sort((a, b) => (a.type === b.type ? b.sum - a.sum : a.type === 'in' ? -1 : 1)).map((x) => `<tr><td>${x.cat}</td><td>${x.type === 'in' ? `<span class="dm-pill p5">${L('إيراد', 'Revenue')}</span>` : `<span class="dm-pill pr">${L('مصروف', 'Expense')}</span>`}</td><td class="num">${x.n}</td><td class="num ${x.type === 'in' ? 'dm-pos' : 'dm-neg'}">${num(x.sum)}</td></tr>`).join('');
      return table([L('البند', 'Category'), L('النوع', 'Type'), L('عدد الحركات', 'Entries'), L('المبلغ', 'Amount')], rows, { foot: `<tfoot><tr><td>${L('الرصيد', 'Balance')}</td><td></td><td></td><td class="num">${num(t.bal)}</td></tr></tfoot>` });
    }
    if (s.rep === 'agents') {
      let a1 = 0, a2 = 0, a3 = 0;
      const rows = s.agents.map((a) => { const t = agentTotals(app, a); a1 += t.due; a2 += t.paid; a3 += t.rest; return `<tr><td>${T(a.name)}</td><td class="num">${t.files}</td><td class="num">${num(a.rate)}</td><td class="num">${num(t.due)}</td><td class="num">${num(t.paid)}</td><td class="num dm-neg">${num(t.rest)}</td></tr>`; }).join('');
      return table([L('المندوب', 'Agent'), L('الملفات', 'Files'), L('العمولة/ملف', 'Rate/file'), L('المستحق', 'Due'), L('المدفوع', 'Paid'), L('المتبقي', 'Remaining')], rows, { foot: `<tfoot><tr><td>${L('الإجمالي', 'Total')}</td><td></td><td></td><td class="num">${num(a1)}</td><td class="num">${num(a2)}</td><td class="num">${num(a3)}</td></tr></tfoot>` });
    }
    let tot = 0;
    const list = s.files.map((f) => ({ f, rest: f.fee - paidOf(f) })).filter((x) => x.rest > 0).sort((a, b) => b.rest - a.rest);
    const rows = list.map((x) => { tot += x.rest; return `<tr><td class="num">${x.f.no}</td><td>${T(x.f.name)}</td><td>${stagePill(x.f.stage)}</td><td class="num">${num(x.f.fee)}</td><td class="num dm-neg">${num(x.rest)}</td></tr>`; }).join('');
    return table([L('رقم الملف', 'File no.'), L('العميل', 'Client'), L('المرحلة', 'Stage'), L('الرسوم', 'Fees'), L('المتبقي', 'Remaining')], rows, { foot: `<tfoot><tr><td>${L('الإجمالي', 'Total')}</td><td>${list.length}</td><td></td><td></td><td class="num">${num(tot)}</td></tr></tfoot>` });
  }

  const SAMPLE_DOC = { name: 'KARIM HESHAM EL-NAGGAR', nameAr: 'كريم هشام النجار', passport: 'A0' + '7314592', nat: 'EGYPTIAN', dob: '1994-03-12', exp: '2031-08-20', sex: 'M' };
  const PERM_MODULES = [{ ar: 'الملفات', en: 'Files' }, { ar: 'OCR', en: 'OCR' }, { ar: 'الحسابات', en: 'Accounts' }, { ar: 'الخزينة', en: 'Treasury' }, { ar: 'التقارير', en: 'Reports' }, { ar: 'المستخدمين والنسخ', en: 'Users & backup' }];

  const OPS = {
    cls: 'dm-ops',
    name: { ar: 'مسار', en: 'Masar' }, sub: { ar: 'العمليات والحسابات', en: 'Operations & Accounts' },
    state: opsState,
    nav: [
      { id: 'dash', icon: 'dash', label: { ar: 'لوحة التحكم', en: 'Dashboard' } },
      { id: 'files', icon: 'folder', label: { ar: 'الملفات والجوازات', en: 'Files & passports' } },
      { id: 'ocr', icon: 'scan', label: { ar: 'استخراج من صورة (OCR)', en: 'Extract from image (OCR)' } },
      { id: 'accounts', icon: 'wallet', label: { ar: 'الحسابات والعمولات', en: 'Accounts & commissions' } },
      { id: 'treasury', icon: 'cash', label: { ar: 'الخزينة', en: 'Treasury' } },
      { id: 'reports', icon: 'chart', label: { ar: 'التقارير', en: 'Reports' } },
      { id: 'admin', icon: 'shield', label: { ar: 'المستخدمين والنسخ', en: 'Users & backup' } }
    ],
    views: {
      dash(app) {
        const s = app.s, t = treasury(app);
        const active = s.files.filter((f) => f.stage < 5);
        const upcoming = active.slice().sort((a, b) => a.due - b.due).slice(0, 6);
        return `<div class="dm-kpis">
          ${kpi('folder', num(s.files.length), L('إجمالي الملفات', 'Total files'))}
          ${kpi('clock', num(active.length), L('ملفات قيد الإجراء', 'Files in progress'), 'g')}
          ${kpi('check', num(s.files.filter((f) => f.stage === 5).length), L('ملفات مكتملة', 'Completed files'), 'ok')}
          ${kpi('cash', num(t.bal), L('رصيد الخزينة (ج.م)', 'Treasury balance (EGP)'))}
        </div>
        <div class="dm-cols">
          <div class="dm-panel"><h3>${L('الإجراءات التالية', 'Next actions')}<small>${L('الأقرب موعداً', 'Soonest first')}</small></h3>
            <ul class="dm-list">${upcoming.map((f) => `<li class="click" tabindex="0" data-act="openFile" data-id="${f.id}">${stagePill(f.stage)}<div class="grow"><b>${esc(T(f.name))}</b><small>${T(NEXT[f.stage])}</small></div><small class="num ${f.due < TODAY ? 'dm-neg' : ''}">${fmtD(f.due)}</small></li>`).join('')}</ul>
          </div>
          <div class="dm-panel"><h3>${L('الملفات حسب المرحلة', 'Files by stage')}</h3>
            ${bars(STAGES.map((st, i) => ({ l: T(st), v: s.files.filter((f) => f.stage === i).length })))}
          </div>
        </div>
        <div class="dm-panel" style="margin-top:14px"><h3>${L('آخر حركات الخزينة', 'Latest treasury entries')}<button type="button" class="dm-btn sm" data-view="treasury">${L('عرض الكل', 'View all')}</button></h3>
          ${table([L('التاريخ', 'Date'), L('البند', 'Category'), L('البيان', 'Description'), L('المبلغ', 'Amount')], s.moves.slice(0, 5).map((m) => `<tr><td class="num">${fmtD(m.date)}</td><td>${T(m.cat)}</td><td class="muted">${esc(T(m.desc))}</td><td class="num ${m.type === 'in' ? 'dm-pos' : 'dm-neg'}">${m.type === 'in' ? '+' : '−'}${num(m.amount)}</td></tr>`).join(''))}
        </div>`;
      },
      files(app) {
        return `<div class="dm-toolbar">
          <label class="dm-search">${ic('search')}<input class="dm-input" type="search" data-in="opsSearch" value="${esc(app.s.q)}" placeholder="${L('ابحث بالاسم أو رقم الجواز أو الرقم القومي أو الموبايل', 'Search by name, passport no., national ID or mobile')}" aria-label="${L('بحث', 'Search')}"></label>
          <select class="dm-select" data-ch="opsStage" aria-label="${L('المرحلة', 'Stage')}"><option value="all">${L('كل المراحل', 'All stages')}</option>${STAGES.map((st, i) => `<option value="${i}" ${String(i) === app.s.stage ? 'selected' : ''}>${T(st)}</option>`).join('')}</select>
          <span class="muted" id="dmCount"></span>
          <button type="button" class="dm-btn pri" data-view="ocr">${ic('scan')}${L('ملف جديد من صورة', 'New file from image')}</button>
        </div>
        ${table([L('رقم الملف', 'File no.'), L('الاسم', 'Name'), L('رقم الجواز', 'Passport'), L('الرقم القومي', 'National ID'), L('الموبايل', 'Mobile'), L('المهنة', 'Job'), L('المرحلة', 'Stage'), L('الإجراء التالي', 'Next action')], '', { bodyId: 'dmFilesBody' })}
        <p class="dm-note">${L('جرّب البحث مثلاً بجزء من رقم جواز أو موبايل، واضغط على أي ملف لعرض مراحله.', 'Try searching part of a passport or mobile number, and click any file to see its stages.')}</p>`;
      },
      ocr(app) {
        const o = app.s.ocr || {};
        const f = (k, label, v, full) => `<label class="${full ? 'full' : ''}">${label}<input class="dm-input ${v ? 'filled' : ''}" data-k="${k}" value="${esc(v || '')}" ${k === 'mobile' ? 'inputmode="tel"' : ''}></label>`;
        return `<div class="dm-cols-2">
          <div class="dm-panel"><h3>${L('صورة المستند', 'Document image')}<small>${L('صورة تجريبية', 'Sample image')}</small></h3>
            <div class="dm-doc" id="dmDoc">
              <div class="doc-h"><span>PASSPORT</span><span>SAMPLE • DEMO</span></div>
              <div class="doc-b"><div class="doc-ph"></div><div class="doc-f">
                <div><span>Surname / Given names</span><b>EL-NAGGAR, KARIM HESHAM</b></div><div><span>Passport No.</span><b>${SAMPLE_DOC.passport}</b></div>
                <div><span>Nationality</span><b>${SAMPLE_DOC.nat}</b></div><div><span>Sex</span><b>${SAMPLE_DOC.sex}</b></div>
                <div><span>Date of birth</span><b>${SAMPLE_DOC.dob}</b></div><div><span>Date of expiry</span><b>${SAMPLE_DOC.exp}</b></div>
              </div></div>
              <div class="mrz">P&lt;EGYEL&lt;NAGGAR&lt;&lt;KARIM&lt;HESHAM&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br>${SAMPLE_DOC.passport}0EGY9403128M3108206&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;02</div>
            </div>
            <div class="dm-progress"><i id="dmOcrBar"></i></div>
            <p class="dm-note" id="dmOcrStatus">${o.done ? L('تم استخراج البيانات ✓ راجعها ثم احفظ الملف.', 'Data extracted ✓ Review it, then save the file.') : L('اضغط «استخراج البيانات» لقراءة النص من الصورة.', 'Click “Extract data” to read the text from the image.')}</p>
            <div class="dm-actions" style="margin-top:10px"><button type="button" class="dm-btn pri" data-act="ocrRun">${ic('scan')}${L('استخراج البيانات', 'Extract data')}</button></div>
            <p class="dm-note">${L('في العرض التوضيحي تُستخدم صورة مستند تجريبية فقط (محاكاة). النظام الكامل يقرأ صور الجوازات الحقيقية بخدمات OCR أونلاين.', 'This demo uses a sample document image only (simulated). The full system reads real passport images with online OCR services.')}</p>
          </div>
          <div class="dm-panel"><h3>${L('بيانات الملف', 'File data')}</h3>
            <div class="dm-form" id="dmOcrForm">
              ${f('nameEn', L('الاسم (كما في الجواز)', 'Name (as in passport)'), o.nameEn, true)}
              ${f('passport', L('رقم الجواز', 'Passport no.'), o.passport)}
              ${f('nat', L('الجنسية', 'Nationality'), o.nat)}
              ${f('dob', L('تاريخ الميلاد', 'Date of birth'), o.dob)}
              ${f('exp', L('تاريخ انتهاء الجواز', 'Passport expiry'), o.exp)}
              ${f('sex', L('النوع', 'Sex'), o.sex)}
              ${f('mobile', L('الموبايل (إدخال يدوي)', 'Mobile (manual entry)'), o.mobile)}
            </div>
            <div class="dm-actions" style="margin-top:14px"><button type="button" class="dm-btn ok" data-act="ocrSave" ${o.done ? '' : 'disabled'}>${ic('save')}${L('حفظ كملف جديد', 'Save as new file')}</button></div>
          </div>
        </div>`;
      },
      accounts(app) {
        const s = app.s;
        return `<div class="dm-tabs" role="tablist">
            <button type="button" role="tab" class="${s.accTab === 'clients' ? 'on' : ''}" data-act="accTab" data-tab="clients">${L('حسابات العملاء', 'Client accounts')}</button>
            <button type="button" role="tab" class="${s.accTab === 'agents' ? 'on' : ''}" data-act="accTab" data-tab="agents">${L('المندوبين والعمولات', 'Agents & commissions')}</button>
          </div>
          ${s.accTab === 'clients' ? `<div class="dm-toolbar"><label class="dm-search">${ic('search')}<input class="dm-input" type="search" data-in="accSearch" value="${esc(s.accQ)}" placeholder="${L('ابحث باسم العميل أو رقم الملف', 'Search by client name or file no.')}" aria-label="${L('بحث', 'Search')}"></label></div>
            ${table([L('رقم الملف', 'File no.'), L('العميل', 'Client'), L('إجمالي الرسوم', 'Total fees'), L('المدفوع', 'Paid'), L('المتبقي', 'Remaining'), ''], '', { bodyId: 'dmAccBody' })}`
          : table([L('المندوب', 'Agent'), L('عدد الملفات', 'Files'), L('العمولة/ملف', 'Rate/file'), L('المستحق', 'Due'), L('المدفوع', 'Paid'), L('المتبقي', 'Remaining'), ''],
            s.agents.map((a) => { const t = agentTotals(app, a); return `<tr><td><b>${T(a.name)}</b></td><td class="num">${t.files}</td><td class="num">${num(a.rate)}</td><td class="num">${num(t.due)}</td><td class="num dm-pos">${num(t.paid)}</td><td class="num dm-neg">${num(t.rest)}</td><td><button type="button" class="dm-btn sm" data-act="agentStmt" data-id="${a.id}">${ic('file')}${L('كشف حساب', 'Statement')}</button></td></tr>`; }).join(''))}`;
      },
      treasury(app) {
        const t = treasury(app), s = app.s;
        const list = s.moves.filter((m) => s.mtype === 'all' || m.type === s.mtype);
        return `<div class="dm-kpis">
            ${kpi('cash', num(t.i), L('إجمالي الإيرادات (ج.م)', 'Total revenue (EGP)'), 'ok')}
            ${kpi('wallet', num(t.o), L('إجمالي المصروفات (ج.م)', 'Total expenses (EGP)'), 'r')}
            ${kpi('chart', num(t.bal), L('الرصيد الحالي (ج.م)', 'Current balance (EGP)'))}
            ${kpi('file', num(s.moves.length), L('عدد الحركات', 'Entries'), 'g')}
          </div>
          <div class="dm-toolbar">
            <select class="dm-select" data-ch="mtype" aria-label="${L('النوع', 'Type')}">
              <option value="all" ${s.mtype === 'all' ? 'selected' : ''}>${L('كل الحركات', 'All entries')}</option>
              <option value="in" ${s.mtype === 'in' ? 'selected' : ''}>${L('الإيرادات', 'Revenue')}</option>
              <option value="out" ${s.mtype === 'out' ? 'selected' : ''}>${L('المصروفات', 'Expenses')}</option>
            </select>
            <span style="flex:1"></span>
            <button type="button" class="dm-btn pri" data-act="newMove">${ic('plus')}${L('حركة جديدة', 'New entry')}</button>
          </div>
          ${table([L('التاريخ', 'Date'), L('النوع', 'Type'), L('البند', 'Category'), L('البيان', 'Description'), L('المبلغ (ج.م)', 'Amount (EGP)')],
            list.map((m) => `<tr><td class="num">${fmtD(m.date)}</td><td>${m.type === 'in' ? `<span class="dm-pill p5">${L('إيراد', 'Revenue')}</span>` : `<span class="dm-pill pr">${L('مصروف', 'Expense')}</span>`}</td><td>${T(m.cat)}</td><td class="muted">${esc(T(m.desc))}</td><td class="num ${m.type === 'in' ? 'dm-pos' : 'dm-neg'}">${m.type === 'in' ? '+' : '−'}${num(m.amount)}</td></tr>`).join('') || emptyRow(5))}`;
      },
      reports(app) {
        return `<div class="dm-toolbar">
            <select class="dm-select" data-ch="rep" aria-label="${L('التقرير', 'Report')}">${Object.keys(REPORTS).map((k) => `<option value="${k}" ${app.s.rep === k ? 'selected' : ''}>${T(REPORTS[k])}</option>`).join('')}</select>
            <span style="flex:1"></span>
            <button type="button" class="dm-btn" data-act="export" data-what="Excel">${ic('excel')}${L('تصدير Excel', 'Export Excel')}</button>
            <button type="button" class="dm-btn" data-act="export" data-what="PDF">${ic('pdf')}${L('تصدير PDF', 'Export PDF')}</button>
            <button type="button" class="dm-btn" data-act="export" data-what="print">${ic('print')}${L('طباعة', 'Print')}</button>
          </div>
          <div class="dm-panel"><h3>${T(REPORTS[app.s.rep])}<small>${L('حتى', 'As of')} ${fmtD(TODAY)}</small></h3><div id="dmRep">${reportBody(app)}</div></div>`;
      },
      admin(app) {
        const s = app.s;
        return `<div class="dm-panel"><h3>${L('المستخدمين والصلاحيات', 'Users & permissions')}<small>${L('فعّل أو ألغِ أي صلاحية', 'Toggle any permission')}</small></h3>
            ${table([L('المستخدم', 'User'), L('الدور', 'Role'), ...PERM_MODULES.map(T)],
              s.users.map((u, ui) => `<tr><td><b>${T(u.name)}</b></td><td class="muted">${T(u.role)}</td>${u.perms.map((p, mi) => `<td><input type="checkbox" class="dm-check" data-ch="perm" data-u="${ui}" data-m="${mi}" ${p ? 'checked' : ''} ${ui === 0 ? 'disabled' : ''} aria-label="${esc(T(u.name))} – ${T(PERM_MODULES[mi])}"></td>`).join('')}</tr>`).join(''))}
          </div>
          <div class="dm-panel" style="margin-top:14px"><h3>${L('النسخ الاحتياطي والاستعادة', 'Backup & restore')}<button type="button" class="dm-btn pri sm" data-act="backup">${ic('db')}${L('إنشاء نسخة احتياطية الآن', 'Create backup now')}</button></h3>
            ${table([L('التاريخ', 'Date'), L('الحجم', 'Size'), L('النوع', 'Type'), ''],
              s.backups.map((b, i) => `<tr><td class="num">${fmtD(b.date)}</td><td class="num">${b.size}</td><td>${b.auto ? L('تلقائية', 'Automatic') : L('يدوية', 'Manual')}</td><td><button type="button" class="dm-btn sm" data-act="restore" data-i="${i}">${ic('restore')}${L('استعادة', 'Restore')}</button></td></tr>`).join(''))}
          </div>`;
      }
    },
    after: {
      files(app) { app.$('#dmFilesBody').innerHTML = opsFileRows(app); },
      accounts(app) { if (app.s.accTab === 'clients') OPS.acts.accSearch(app, { value: app.s.accQ }); }
    },
    acts: {
      closeDrawer: (app) => app.closeDrawer(),
      opsSearch(app, el) { app.s.q = el.value; app.$('#dmFilesBody').innerHTML = opsFileRows(app); },
      opsStage(app, el) { app.s.stage = el.value; app.$('#dmFilesBody').innerHTML = opsFileRows(app); },
      openFile(app, el) { const f = app.s.files.find((x) => x.id === +el.dataset.id); if (f) fileDrawer(app, f); },
      advance(app, el) {
        const f = app.s.files.find((x) => x.id === +el.dataset.id); if (!f || f.stage >= 5) return;
        const done = T(STAGES[f.stage]); f.stage++; f.due = f.stage === 5 ? null : addDays(TODAY, 3 + (f.id % 5));
        if (app.view === 'files') app.$('#dmFilesBody').innerHTML = opsFileRows(app); else app.render();
        fileDrawer(app, f); app.toast(L(`تم تسجيل إتمام مرحلة «${done}»`, `Stage “${done}” marked complete`));
      },
      label(app, el) {
        const f = app.s.files.find((x) => x.id === +el.dataset.id);
        app.$('#dmLabelSlot').innerHTML = `<div class="dm-label"><div class="lbl-text"><b>${esc(T(f.name))}</b>${f.no} • ${f.passport}<div class="dm-barcode">${barcode(f.no)}</div></div><div class="dm-qr">${qrLike(f.no + f.passport)}</div></div>
          <p class="dm-caption">${L('معاينة توضيحية لملصق الملف — يُطبع ويُلصق على الملف الورقي.', 'Illustrative preview of the file label — printed and attached to the paper file.')}</p>
          <div class="dm-actions"><button type="button" class="dm-btn" data-act="export" data-what="print">${ic('print')}${L('طباعة الملصق', 'Print label')}</button></div>`;
      },
      clientStmt(app, el) {
        const f = app.s.files.find((x) => x.id === +el.dataset.id);
        const lines = [{ date: f.created, desc: { ar: 'رسوم الملف', en: 'File fees' }, d: f.fee }].concat(f.payments.map((p) => ({ date: p.date, desc: { ar: `دفعة – إيصال ${p.receipt}`, en: `Payment – receipt ${p.receipt}` }, c: p.amount })));
        statementDrawer(app, `${L('كشف حساب', 'Statement')}: ${esc(T(f.name))} <small class="muted">(${f.no})</small>`, lines);
      },
      agentStmt(app, el) {
        const a = agentById(app, +el.dataset.id);
        const lines = app.s.files.filter((f) => f.agent === a.id).map((f) => ({ date: f.created, desc: { ar: `عمولة ملف ${f.no}`, en: `Commission – file ${f.no}` }, d: a.rate }))
          .concat(a.payouts.map((p) => ({ date: p.date, desc: { ar: 'صرف عمولة', en: 'Commission payout' }, c: p.amount })));
        statementDrawer(app, `${L('كشف حساب المندوب', 'Agent statement')}: ${esc(T(a.name))}`, lines);
      },
      accTab(app, el) { app.s.accTab = el.dataset.tab; app.render(); },
      accSearch(app, el) {
        app.s.accQ = el.value; const q = norm(el.value);
        const list = app.s.files.filter((f) => !q || norm(f.name.ar + ' ' + f.name.en + ' ' + f.no).includes(q));
        const body = app.$('#dmAccBody'); if (!body) return;
        body.innerHTML = list.map((f) => { const p = paidOf(f); return `<tr><td class="num">${f.no}</td><td><b>${hl(T(f.name), el.value.trim())}</b></td><td class="num">${num(f.fee)}</td><td class="num dm-pos">${num(p)}</td><td class="num ${f.fee - p ? 'dm-neg' : ''}">${num(f.fee - p)}</td><td><button type="button" class="dm-btn sm" data-act="clientStmt" data-id="${f.id}">${ic('file')}${L('كشف حساب', 'Statement')}</button></td></tr>`; }).join('') || emptyRow(6);
      },
      mtype(app, el) { app.s.mtype = el.value; app.render(); },
      newMove(app) {
        app.drawer(L('حركة خزينة جديدة', 'New treasury entry'), `<div class="dm-form">
          <label>${L('النوع', 'Type')}<select class="dm-select dm-input" id="mvType"><option value="in">${L('إيراد', 'Revenue')}</option><option value="out">${L('مصروف', 'Expense')}</option></select></label>
          <label>${L('المبلغ (ج.م)', 'Amount (EGP)')}<input class="dm-input" id="mvAmt" type="number" min="1" inputmode="numeric" value="500"></label>
          <label class="full">${L('البند', 'Category')}<input class="dm-input" id="mvCat" value="${L('أدوات مكتبية', 'Office supplies')}"></label>
          <label class="full">${L('البيان', 'Description')}<input class="dm-input" id="mvDesc" value="${L('حركة تجريبية', 'Demo entry')}"></label>
        </div><div class="dm-actions" style="margin-top:14px"><button type="button" class="dm-btn ok" data-act="saveMove">${ic('save')}${L('حفظ', 'Save')}</button></div>`);
      },
      saveMove(app) {
        const amt = Math.round(+app.$('#mvAmt').value);
        if (!(amt > 0)) { app.toast(L('اكتب مبلغاً صحيحاً', 'Enter a valid amount')); return; }
        const cat = app.$('#mvCat').value.trim() || '—', desc = app.$('#mvDesc').value.trim() || '—';
        app.s.moves.unshift({ date: TODAY, type: app.$('#mvType').value, cat: { ar: cat, en: cat }, desc: { ar: desc, en: desc }, amount: amt });
        app.closeDrawer(); app.render(); app.toast(L('تم حفظ الحركة وتحديث الرصيد', 'Entry saved and balance updated'));
      },
      rep(app, el) { app.s.rep = el.value; app.render(); },
      export(app, el) {
        const w = el.dataset.what;
        app.toast(disabledMsg(w === 'print' ? L('الطباعة', 'Printing') : L(`التصدير إلى ${w}`, `Export to ${w}`)));
      },
      perm(app, el) {
        app.s.users[+el.dataset.u].perms[+el.dataset.m] = el.checked ? 1 : 0;
        app.toast(L('تم تحديث الصلاحيات', 'Permissions updated'));
      },
      backup(app) {
        app.s.backups.unshift({ date: TODAY, size: (14.2 + app.s.files.length * 0.01).toFixed(1) + ' MB', auto: false });
        app.render(); app.toast(L('تم إنشاء نسخة احتياطية (محاكاة)', 'Backup created (simulated)'));
      },
      restore(app, el) { const b = app.s.backups[+el.dataset.i]; app.toast(L(`تمت محاكاة الاستعادة من نسخة ${fmtD(b.date)}`, `Restore from ${fmtD(b.date)} simulated`)); },
      ocrRun(app) {
        if (app._ocrBusy) return; app._ocrBusy = true;
        const bar = app.$('#dmOcrBar'), st = app.$('#dmOcrStatus'), docEl = app.$('#dmDoc');
        const scan = doc.createElement('div'); scan.className = 'dm-scan'; docEl.appendChild(scan);
        app.s.ocr = null; app.$('#dmOcrForm').querySelectorAll('input').forEach((i) => { i.value = ''; i.classList.remove('filled'); });
        const steps = [[25, L('تحميل الصورة…', 'Loading image…')], [55, L('التعرف على النص…', 'Recognizing text…')], [85, L('تحليل الحقول…', 'Parsing fields…')], [100, L('تم ✓', 'Done ✓')]];
        let k = 0;
        const tick = () => {
          if (!app.$('#dmOcrBar')) { app._ocrBusy = false; return; }
          bar.style.width = steps[k][0] + '%'; st.textContent = steps[k][1]; k++;
          if (k < steps.length) { setTimeout(tick, 550); return; }
          scan.remove(); app._ocrBusy = false;
          app.s.ocr = { done: true, nameEn: SAMPLE_DOC.name, passport: SAMPLE_DOC.passport, nat: SAMPLE_DOC.nat, dob: SAMPLE_DOC.dob, exp: SAMPLE_DOC.exp, sex: SAMPLE_DOC.sex, mobile: '' };
          const inputs = app.$('#dmOcrForm').querySelectorAll('input[data-k]');
          inputs.forEach((inp, i) => setTimeout(() => { const v = app.s.ocr[inp.dataset.k]; if (v) { inp.value = v; inp.classList.add('filled'); } }, i * 120));
          st.textContent = L('تم استخراج البيانات ✓ راجعها ثم احفظ الملف.', 'Data extracted ✓ Review it, then save the file.');
          app.$('[data-act="ocrSave"]').removeAttribute('disabled');
        };
        setTimeout(tick, 200);
      },
      ocrSave(app) {
        const get = (k) => (app.$(`#dmOcrForm [data-k="${k}"]`) || {}).value || '';
        const id = app.s.files.length + 1, r = rng(id * 13);
        const nameEn = get('nameEn').trim() || SAMPLE_DOC.name;
        const f = { id, no: `M-${String(TODAY.getFullYear()).slice(2)}-${String(1040 + id + 100).padStart(4, '0')}`, name: { ar: nameEn === SAMPLE_DOC.name ? SAMPLE_DOC.nameAr : nameEn, en: nameEn.replace(/\b\w+/g, (w) => w[0] + w.slice(1).toLowerCase()) },
          passport: get('passport') || SAMPLE_DOC.passport, nid: nid(r), mobile: normDigits(get('mobile')).replace(/\D/g, '') || mobile(r), job: JOBS[0], dest: DEST[0], agent: 1, stage: 0, created: TODAY, fee: 20000, payments: [], due: addDays(TODAY, 2) };
        app.s.files.unshift(f); app.s.ocr = null; app.s.q = ''; app.s.stage = 'all';
        app.go('files'); fileDrawer(app, f);
        app.toast(L(`تم إنشاء الملف ${f.no} في ثوانٍ`, `File ${f.no} created in seconds`));
      }
    }
  };

  /* =========================================================
     2) نظام مسار للموارد البشرية والتوظيف
     ========================================================= */
  const SPECS = [
    { id: 'acc', ar: 'محاسب', en: 'Accountant', edu: { ar: 'بكالوريوس تجارة – محاسبة', en: 'B.Com – Accounting' },
      skills: [['Excel', 'Excel'], ['القيود المحاسبية', 'Journal entries'], ['التسويات البنكية', 'Bank reconciliation'], ['الضرائب', 'Taxation'], ['برامج ERP', 'ERP software'], ['إعداد الميزانيات', 'Budgeting']] },
    { id: 'civ', ar: 'مهندس مدني', en: 'Civil engineer', edu: { ar: 'بكالوريوس هندسة مدنية', en: 'B.Sc. Civil Engineering' },
      skills: [['AutoCAD', 'AutoCAD'], ['حساب الكميات', 'Quantity surveying'], ['إدارة المواقع', 'Site management'], ['Primavera', 'Primavera'], ['قراءة المخططات', 'Reading drawings']] },
    { id: 'ele', ar: 'فني كهرباء', en: 'Electrician', edu: { ar: 'دبلوم صنايع – كهرباء', en: 'Technical diploma – Electrical' },
      skills: [['التمديدات الكهربائية', 'Electrical wiring'], ['لوحات التوزيع', 'Distribution boards'], ['قراءة المخططات', 'Reading drawings'], ['السلامة المهنية', 'Occupational safety'], ['الصيانة', 'Maintenance']] },
    { id: 'drv', ar: 'سائق', en: 'Driver', edu: { ar: 'مؤهل متوسط', en: 'Secondary education' },
      skills: [['رخصة قيادة مهنية', 'Professional license'], ['نقل ثقيل', 'Heavy vehicles'], ['معرفة الطرق', 'Route knowledge'], ['صيانة خفيفة', 'Basic maintenance']] },
    { id: 'nur', ar: 'ممرض', en: 'Nurse', edu: { ar: 'بكالوريوس تمريض', en: 'B.Sc. Nursing' },
      skills: [['رعاية المرضى', 'Patient care'], ['الإسعافات الأولية', 'First aid'], ['BLS', 'BLS'], ['العناية المركزة (ICU)', 'ICU'], ['السجلات الطبية', 'Medical records']] },
    { id: 'hvac', ar: 'فني تكييف', en: 'HVAC technician', edu: { ar: 'دبلوم صنايع – تبريد وتكييف', en: 'Technical diploma – HVAC' },
      skills: [['تركيب التكييف', 'AC installation'], ['الصيانة الدورية', 'Preventive maintenance'], ['شحن الفريون', 'Refrigerant charging'], ['التكييف المركزي', 'Central AC']] },
    { id: 'sec', ar: 'سكرتير تنفيذي', en: 'Executive secretary', edu: { ar: 'بكالوريوس آداب', en: 'B.A.' },
      skills: [['Word', 'Word'], ['Excel', 'Excel'], ['تنظيم المواعيد', 'Scheduling'], ['المراسلات', 'Correspondence'], ['الأرشفة', 'Archiving']] },
    { id: 'sal', ar: 'مندوب مبيعات', en: 'Sales representative', edu: { ar: 'بكالوريوس تجارة', en: 'B.Com' },
      skills: [['التفاوض', 'Negotiation'], ['خدمة العملاء', 'Customer service'], ['CRM', 'CRM'], ['رخصة قيادة', "Driver's license"], ['إعداد العروض', 'Presentations']] }
  ];
  const CITIES = [['القاهرة', 'Cairo'], ['الجيزة', 'Giza'], ['الإسكندرية', 'Alexandria'], ['المنوفية', 'Menoufia'], ['الشرقية', 'Sharqia'], ['الدقهلية', 'Dakahlia'], ['أسيوط', 'Assiut'], ['سوهاج', 'Sohag']].map((c) => ({ ar: c[0], en: c[1] }));
  const ENG = [{ ar: 'ضعيف', en: 'Basic' }, { ar: 'متوسط', en: 'Intermediate' }, { ar: 'جيد', en: 'Good' }, { ar: 'جيد جداً', en: 'Very good' }];
  const HR_STAGES = [{ ar: 'جديد', en: 'New', c: 'p0' }, { ar: 'ترشيح وتواصل', en: 'Shortlist & contact', c: 'p1' }, { ar: 'قبول العميل', en: 'Client accepted', c: 'p2' }, { ar: 'سافر', en: 'Travelled', c: 'p5' }, { ar: 'خارج المسار', en: 'Out of pipeline', c: 'pr' }];
  const hrPill = (i) => `<span class="dm-pill ${HR_STAGES[i].c}">${T(HR_STAGES[i])}</span>`;
  const specById = (id) => SPECS.find((s) => s.id === id);
  const sk = (pair) => ({ ar: pair[0], en: pair[1] });
  const W = { 3: { ar: 'لازم', en: 'Must' }, 2: { ar: 'مهم', en: 'Important' }, 1: { ar: 'يفضّل', en: 'Preferred' } };
  const GROUPS = {
    match: { ar: 'مطابق', en: 'Matched', c: 'p5', ic: '✅' }, confirm: { ar: 'محتاج تأكيد', en: 'Needs confirmation', c: 'p2', ic: '🟡' },
    miss1: { ar: 'ناقصه شرط', en: 'Missing one requirement', c: 'pr', ic: '🔴' }, far: { ar: 'بعيدين', en: 'Far', c: 'p0', ic: '⚪' }
  };

  function hrState() {
    const r = rng(777);
    const cands = [];
    const stageBag = [0, 0, 0, 0, 1, 1, 1, 2, 2, 3, 4];
    for (let i = 0; i < 70; i++) {
      const sp = r.pick(SPECS), female = (sp.id === 'nur' || sp.id === 'sec') ? r() < 0.6 : r() < 0.08;
      const pool = sp.skills.slice().sort(() => r() - 0.5);
      cands.push({ id: i + 1, name: person(r, female), spec: sp.id, exp: r.int(0, 14), age: r() < 0.1 ? null : r.int(21, 47), city: r.pick(CITIES),
        skills: pool.slice(0, r.int(2, pool.length)).map(sk), edu: sp.edu, eng: r() < 0.18 ? null : r.int(0, 3),
        mobile: mobile(r), stage: r.pick(stageBag), added: addDays(TODAY, -r.int(0, 120)), ref: 'AP-' + (24100 + i) });
    }
    cands.sort((a, b) => b.added - a.added);
    const reqs = [
      { id: 1, spec: 'nur', count: 10, salary: '7,000 SAR', rules: [{ k: 'exp', v: 3, w: 3 }, { k: 'skill', v: 3, w: 3 }, { k: 'skill', v: 2, w: 2 }, { k: 'eng', v: 2, w: 2 }, { k: 'age', v: 40, w: 1 }] },
      { id: 2, spec: 'acc', count: 2, salary: '9,000 SAR', rules: [{ k: 'exp', v: 3, w: 3 }, { k: 'skill', v: 0, w: 3 }, { k: 'skill', v: 3, w: 2 }, { k: 'skill', v: 4, w: 1 }, { k: 'eng', v: 2, w: 1 }] },
      { id: 3, spec: 'ele', count: 5, salary: '3,500 SAR', rules: [{ k: 'exp', v: 2, w: 3 }, { k: 'skill', v: 0, w: 3 }, { k: 'skill', v: 3, w: 2 }, { k: 'age', v: 45, w: 2 }] },
      { id: 4, spec: 'drv', count: 8, salary: '3,000 SAR', rules: [{ k: 'skill', v: 0, w: 3 }, { k: 'exp', v: 3, w: 3 }, { k: 'skill', v: 1, w: 2 }, { k: 'age', v: 45, w: 2 }] },
      { id: 5, spec: 'civ', count: 1, salary: '14,000 SAR', rules: [{ k: 'exp', v: 5, w: 3 }, { k: 'skill', v: 0, w: 3 }, { k: 'skill', v: 3, w: 2 }, { k: 'eng', v: 3, w: 2 }] }
    ].map((q) => ({ ...q, opened: addDays(TODAY, -r.int(2, 40)) }));
    const inbox = [
      { id: 1, name: person(r), src: { ar: 'رابط التقديم', en: 'Application link' }, file: 'CV.pdf', status: 0, date: TODAY },
      { id: 2, name: person(r, true), src: { ar: 'رفع يدوي', en: 'Manual upload' }, file: 'resume.docx', status: 1, date: addDays(TODAY, -1) },
      { id: 3, name: person(r), src: { ar: 'بوابة المناديب', en: 'Agents portal' }, file: 'scan.jpg', status: 1, date: addDays(TODAY, -1) }
    ];
    const backups = [{ date: addDays(TODAY, -2), kind: 'SQL', size: '3.8 MB' }, { date: addDays(TODAY, -9), kind: 'ZIP', size: '41.6 MB' }];
    return { cands, reqs, inbox, backups, q: '', spec: 'all', exp: '0', stage: 'all', req: 1, grp: 'match', cv: null, cvCand: null, cvTpl: 'navy', cvLang: 'ar' };
  }

  function ruleText(rule, spec, lng) {
    const t = (o) => o[lng || lang()];
    if (rule.k === 'exp') return t({ ar: `خبرة ${rule.v}+ سنوات`, en: `${rule.v}+ years experience` });
    if (rule.k === 'skill') return t(sk(spec.skills[rule.v]));
    if (rule.k === 'eng') return t({ ar: `إنجليزي ${ENG[rule.v].ar} أو أعلى`, en: `English ${ENG[rule.v].en} or better` });
    if (rule.k === 'age') return t({ ar: `السن حتى ${rule.v}`, en: `Age up to ${rule.v}` });
    return '';
  }
  function evalRule(c, rule, spec) {
    if (rule.k === 'exp') return { have: `${c.exp} ${L('سنة', 'yrs')}`, ok: c.exp >= rule.v };
    if (rule.k === 'skill') { const need = spec.skills[rule.v][1]; const has = c.skills.some((s) => s.en === need); return { have: has ? '✓' : '—', ok: has }; }
    if (rule.k === 'eng') return c.eng == null ? { have: L('غير مسجّل', 'Not recorded'), ok: null } : { have: T(ENG[c.eng]), ok: c.eng >= rule.v };
    if (rule.k === 'age') return c.age == null ? { have: L('غير مسجّل', 'Not recorded'), ok: null } : { have: String(c.age), ok: c.age <= rule.v };
    return { have: '', ok: false };
  }
  function matchCand(c, q) {
    if (c.spec !== q.spec || c.stage === 4) return null;
    const spec = specById(q.spec); let got = 0, total = 0, mustFail = 0, unknown = 0;
    const rows = q.rules.map((rule) => { const e = evalRule(c, rule, spec); total += rule.w; if (e.ok) got += rule.w; if (e.ok === false && rule.w === 3) mustFail++; if (e.ok === null) unknown++; return { rule, ...e }; });
    const grp = mustFail === 0 ? (unknown ? 'confirm' : 'match') : mustFail === 1 ? 'miss1' : 'far';
    return { score: Math.round((got / total) * 100), grp, rows, ask: rows.filter((x) => x.ok === null) };
  }

  function hrRows(app) {
    const s = app.s, q = norm(s.q), qq = s.q.trim();
    const list = s.cands.filter((c) => {
      if (s.spec !== 'all' && c.spec !== s.spec) return false;
      if (c.exp < +s.exp) return false;
      if (s.stage !== 'all' && c.stage !== +s.stage) return false;
      if (!q) return true;
      const sp = specById(c.spec);
      const hay = norm([c.name.ar, c.name.en, sp.ar, sp.en, c.city.ar, c.city.en, c.mobile, c.ref, ...c.skills.map((x) => x.ar + ' ' + x.en)].join(' '));
      return q.split(/\s+/).every((t) => hay.includes(t));
    });
    const cnt = app.$('#dmCount'); if (cnt) cnt.textContent = L(`${list.length} مرشح`, `${list.length} candidates`);
    if (!list.length) return emptyRow(6);
    return list.map((c) => `<tr class="click" tabindex="0" data-act="openCand" data-id="${c.id}"><td><b>${hl(T(c.name), qq)}</b></td><td>${hl(T(specById(c.spec)), qq)}</td>
      <td class="num">${c.exp} ${L('سنة', 'yrs')}</td><td>${hl(T(c.city), qq)}</td><td class="muted">${hl(c.skills.slice(0, 3).map(T).join('، '), qq)}</td><td>${hrPill(c.stage)}</td></tr>`).join('');
  }

  function candDrawer(app, c) {
    const sp = specById(c.spec);
    app.drawer(esc(T(c.name)), `
      <dl class="dm-dl">
        <dt>${L('رقم التقديم', 'Application no.')}</dt><dd class="num">${c.ref}</dd>
        <dt>${L('التخصص', 'Specialty')}</dt><dd>${T(sp)}</dd>
        <dt>${L('سنوات الخبرة', 'Experience')}</dt><dd>${c.exp} ${L('سنة', 'years')}</dd>
        <dt>${L('السن', 'Age')}</dt><dd>${c.age == null ? `<span class="muted">${L('غير مسجّل', 'Not recorded')}</span>` : c.age}</dd>
        <dt>${L('المؤهل', 'Education')}</dt><dd>${T(c.edu)}</dd>
        <dt>${L('المدينة', 'City')}</dt><dd>${T(c.city)}</dd>
        <dt>${L('اللغة الإنجليزية', 'English')}</dt><dd>${c.eng == null ? `<span class="muted">${L('غير مسجّل', 'Not recorded')}</span>` : T(ENG[c.eng])}</dd>
        <dt>${L('الموبايل', 'Mobile')}</dt><dd>${c.mobile}</dd>
      </dl>
      <p><b>${L('المهارات', 'Skills')}</b></p><div class="dm-skills">${c.skills.map((x) => `<span>${T(x)}</span>`).join('')}</div>
      <div class="dm-form" style="margin-top:18px"><label class="full">${L('مرحلة المرشح', 'Candidate stage')}
        <select class="dm-select dm-input" data-ch="candStage" data-id="${c.id}">${HR_STAGES.map((st, i) => `<option value="${i}" ${i === c.stage ? 'selected' : ''}>${T(st)}</option>`).join('')}</select></label></div>
      <div class="dm-actions" style="margin-top:14px"><button type="button" class="dm-btn" data-act="cvFor" data-id="${c.id}">${ic('file')}${L('اعمل سيرة بقالب', 'Make a templated CV')}</button></div>`);
  }

  function whyDrawer(app, c, q) {
    const m = matchCand(c, q), spec = specById(q.spec);
    const rows = m.rows.map((x) => `<tr><td>${ruleText(x.rule, spec)}</td><td><span class="dm-pill ${x.rule.w === 3 ? 'pr' : x.rule.w === 2 ? 'p2' : 'p0'}">${T(W[x.rule.w])}</span></td><td>${x.have}</td>
      <td>${x.ok === true ? '<span class="dm-pos">✓</span>' : x.ok === false ? '<span class="dm-neg">✗</span>' : '<span class="muted">?</span>'}</td><td class="num">${x.ok ? x.rule.w : 0} / ${x.rule.w}</td></tr>`).join('');
    app.drawer(`${L('ليه؟', 'Why?')} — ${esc(T(c.name))}`, `
      <div class="dm-next"><span class="dm-pill ${GROUPS[m.grp].c}">${T(GROUPS[m.grp])}</span><b>${L('نسبة المطابقة', 'Match')}: ${m.score}%</b></div>
      ${table([L('الشرط', 'Requirement'), L('الأهمية', 'Weight'), L('عند المرشح', 'Candidate'), L('النتيجة', 'Result'), L('النقط', 'Points')], rows)}
      ${m.ask.length ? `<p class="dm-note">${L('اسأله عن', 'Ask about')}: ${m.ask.map((x) => ruleText(x.rule, spec)).join('، ')}</p>` : ''}
      <p class="dm-note">${L('النسبة = النقط اللي جابها ÷ مجموع النقط (لازم = 3، مهم = 2، يفضّل = 1).', 'Score = points earned ÷ total points (must = 3, important = 2, preferred = 1).')}</p>`);
  }

  /* ----- صانع السير ----- */
  const CV_TPLS = [{ id: 'navy', ar: 'كحلي بصورة', en: 'Navy with photo' }, { id: 'classic', ar: 'كلاسيك', en: 'Classic' }, { id: 'band', ar: 'شريط أزرق', en: 'Blue band' }, { id: 'gold', ar: 'كحلي وذهبي', en: 'Navy & gold' }];
  function cvHtml(c, tpl, lng) {
    const t = (o) => (typeof o === 'string' ? o : o[lng]); const sp = specById(c.spec);
    const r = rng(c.id * 97); const yrs = Math.max(1, c.exp);
    const jobs = []; let end = TODAY.getFullYear(); let left = yrs;
    while (left > 0 && jobs.length < 3) { const d = Math.min(left, r.int(1, 4)); jobs.push({ from: end - d, to: end, place: r.pick([{ ar: 'شركة خاصة', en: 'Private company' }, { ar: 'مؤسسة خاصة', en: 'Private establishment' }, { ar: 'مجموعة شركات', en: 'Group of companies' }]), city: r.pick(CITIES) }); end -= d; left -= d; }
    const yAr = (n) => (n === 1 ? 'سنة واحدة' : n === 2 ? 'سنتين' : n <= 10 ? `${n} سنوات` : `${n} سنة`);
    const sum = c.exp === 0
      ? (lng === 'ar' ? `${sp.ar} حديث التخرج، يجيد ${c.skills.slice(0, 3).map((s) => s.ar).join('، ')}. ملتزم ومستعد للتعلّم.` : `Recently graduated ${sp.en.toLowerCase()}, skilled in ${c.skills.slice(0, 3).map((s) => s.en).join(', ')}. Committed and eager to learn.`)
      : (lng === 'ar' ? `${sp.ar} بخبرة ${yAr(c.exp)}، يجيد ${c.skills.slice(0, 3).map((s) => s.ar).join('، ')}. ملتزم ودقيق في العمل.` : `${sp.en} with ${c.exp} year${c.exp > 1 ? 's' : ''} of experience, skilled in ${c.skills.slice(0, 3).map((s) => s.en).join(', ')}. Committed and detail-oriented.`);
    if (c.exp === 0) jobs.length = 0;
    const H = (ar, en) => (lng === 'ar' ? ar : en);
    return `<div class="cv cv-${tpl}" dir="${lng === 'ar' ? 'rtl' : 'ltr'}" lang="${lng}">
      <div class="cv-head">${tpl === 'navy' || tpl === 'gold' ? `<span class="cv-ph">${esc(t(c.name)[0])}</span>` : ''}<div><h4>${esc(t(c.name))}</h4><p class="cv-role">${t(sp)}</p><p class="cv-contact">${H('موبايل', 'Mobile')}: ${c.mobile.slice(0, 4)}•••••••  ·  ${t(c.city)}</p></div></div>
      <div class="cv-body">
        <h5>${H('نبذة مهنية', 'Profile')}</h5><p>${esc(sum)}</p>
        ${jobs.length ? `<h5>${H('الخبرات', 'Experience')}</h5>` : ''}${jobs.map((j) => `<div class="cv-job"><b>${t(sp)} — ${t(j.place)}</b><span>${t(j.city)} (${j.from} – ${j.to})</span></div>`).join('')}
        <h5>${H('المهارات', 'Skills')}</h5><ul>${c.skills.map((s) => `<li>${t(s)}</li>`).join('')}</ul>
        <h5>${H('التعليم واللغات', 'Education & languages')}</h5><p>${t(c.edu)} · ${H('العربية', 'Arabic')}${c.eng != null ? ` · ${H('الإنجليزية', 'English')} (${t(ENG[c.eng])})` : ''}</p>
      </div></div>`;
  }

  const SAMPLE_CV = { name: { ar: 'سامح عادل منصور', en: 'Sameh Adel Mansour' }, spec: 'acc', exp: 6, age: 31, city: CITIES[1], edu: SPECS[0].edu, eng: 3,
    skills: [0, 1, 2, 3, 4].map((i) => sk(SPECS[0].skills[i])), mobile: '01000000000' };

  const HR = {
    cls: 'dm-hr',
    name: { ar: 'مسار HR', en: 'Masar HR' }, sub: { ar: 'الموارد البشرية والتوظيف', en: 'HR & Recruitment' },
    state: hrState,
    nav: [
      { id: 'dash', icon: 'dash', label: { ar: 'لوحة الأرقام', en: 'Dashboard' } },
      { id: 'inbox', icon: 'upload', label: { ar: 'الوارد', en: 'Inbox' } },
      { id: 'bank', icon: 'users', label: { ar: 'بنك المرشحين', en: 'Candidate bank' } },
      { id: 'reqs', icon: 'brief', label: { ar: 'الطلبيات والمطابقة', en: 'Orders & matching' } },
      { id: 'pipe', icon: 'kanban', label: { ar: 'المسار', en: 'Pipeline' } },
      { id: 'cvmaker', icon: 'file', label: { ar: 'صانع السير', en: 'CV maker' } },
      { id: 'data', icon: 'db', label: { ar: 'Excel والنسخ الاحتياطي', en: 'Excel & backup' } }
    ],
    views: {
      dash(app) {
        const s = app.s, cnt = (i) => s.cands.filter((c) => c.stage === i).length;
        const bySpec = SPECS.map((sp) => ({ l: T(sp), v: s.cands.filter((c) => c.spec === sp.id).length })).sort((a, b) => b.v - a.v);
        const avg = (s.cands.reduce((t, c) => t + c.exp, 0) / s.cands.length).toFixed(1);
        return `<div class="dm-kpis">
            ${kpi('users', num(s.cands.length), L('إجمالي المرشحين', 'Total candidates'))}
            ${kpi('brief', num(s.reqs.length), L('طلبيات مفتوحة', 'Open orders'), 'g')}
            ${kpi('upload', num(s.inbox.filter((x) => x.status === 1).length), L('في الوارد للمراجعة', 'Inbox to review'))}
            ${kpi('check', num(cnt(3)), L('سافروا', 'Travelled'), 'ok')}
          </div>
          <div class="dm-cols-2">
            <div class="dm-panel"><h3>${L('المرشحون حسب المرحلة', 'Candidates by stage')}</h3>${bars(HR_STAGES.map((st, i) => ({ l: T(st), v: cnt(i) })))}</div>
            <div class="dm-panel"><h3>${L('المرشحون حسب المهنة', 'Candidates by profession')}<small>${L('متوسط الخبرة', 'Avg. experience')}: ${avg} ${L('سنة', 'yrs')}</small></h3>${bars(bySpec, true)}</div>
          </div>
          <div class="dm-cols" style="margin-top:14px">
            <div class="dm-panel"><h3>${L('أحدث المرشحين', 'Latest candidates')}<button type="button" class="dm-btn sm" data-view="bank">${L('بنك المرشحين', 'Candidate bank')}</button></h3>
              <ul class="dm-list">${s.cands.slice(0, 5).map((c) => `<li class="click" tabindex="0" data-act="openCand" data-id="${c.id}"><span class="dm-avatar" style="background:var(--surface-2);color:var(--blue)">${esc(T(c.name)[0])}</span><div class="grow"><b>${esc(T(c.name))}</b><small>${T(specById(c.spec))} • ${c.exp} ${L('سنة', 'yrs')}</small></div>${hrPill(c.stage)}</li>`).join('')}</ul></div>
            <div class="dm-panel"><h3>${L('الطلبيات', 'Orders')}</h3>
              <ul class="dm-list">${s.reqs.map((q) => `<li class="click" tabindex="0" data-act="pickReq" data-id="${q.id}"><div class="grow"><b>${T(specById(q.spec))} × ${q.count}</b><small>${L('الراتب', 'Salary')}: ${q.salary} • ${q.rules.length} ${L('شروط', 'requirements')}</small></div>${ic('next')}</li>`).join('')}</ul></div>
          </div>`;
      },
      inbox(app) {
        const cv = app.s.cv;
        return `<div class="dm-cols-2">
          <div class="dm-panel"><h3>${L('استقبال سيرة ذاتية', 'Receive a CV')}</h3>
            <div class="dm-drop" id="dmDrop">${ic('upload')}
              <p>${L('اسحب السيرة هنا (PDF / Word / صورة) أو الزق نصها', 'Drop a CV here (PDF / Word / image) or paste its text')}</p>
              <button type="button" class="dm-btn pri" data-act="cvRun">${ic('ai')}${L('جرّب بسيرة ذاتية تجريبية', 'Try with a sample CV')}</button>
            </div>
            <ul class="dm-steps-list" id="dmCvSteps">
              <li>${L('استلام الملف', 'Receiving the file')}</li><li>${L('استخراج النص', 'Extracting text')}</li><li>${L('القراءة بالذكاء الاصطناعي', 'Reading with AI')}</li><li>${L('تجهيز سجل منظم للمراجعة', 'Preparing a structured record for review')}</li>
            </ul>
            <p class="dm-note">${L('محاكاة: في العرض التوضيحي يتم تحليل سيرة تجريبية فقط ولا يتم رفع أي ملف.', 'Simulated: only a sample CV is analyzed in this demo and no file is uploaded.')}</p>
            <h3 style="margin-top:18px">${L('آخر الوارد', 'Latest inbox')}</h3>
            <ul class="dm-list">${app.s.inbox.map((x) => `<li><span class="dm-avatar" style="background:var(--surface-2);color:var(--blue)">${ic('file')}</span><div class="grow"><b>${esc(T(x.name))}</b><small>${T(x.src)} • ${x.file}</small></div><span class="dm-pill ${x.status ? 'p2' : 'p5'}">${x.status ? L('مستني مراجعة', 'Awaiting review') : L('اتعتمد', 'Approved')}</span></li>`).join('')}</ul>
          </div>
          <div class="dm-panel" id="dmCvOut">${cv ? HR.cvRecord(cv) : `<h3>${L('السجل المنظم', 'Structured record')}</h3><p class="muted">${L('بعد القراءة تظهر هنا بيانات المرشح لمراجعتها قبل الاعتماد.', 'After reading, the candidate’s data appears here for review before approval.')}</p>`}</div>
        </div>`;
      },
      bank(app) {
        const s = app.s;
        return `<div class="dm-toolbar">
            <label class="dm-search">${ic('search')}<input class="dm-input" type="search" data-in="hrSearch" value="${esc(s.q)}" placeholder="${L('بحث: اسم، مهنة، مهارة، مدينة، رقم تقديم… (مثال: محاسب Excel الجيزة)', 'Search: name, profession, skill, city, application no… (e.g. accountant Excel Giza)')}" aria-label="${L('بحث', 'Search')}"></label>
            <select class="dm-select" data-ch="hrSpec" aria-label="${L('المهنة', 'Profession')}"><option value="all">${L('كل المهن', 'All professions')}</option>${SPECS.map((sp) => `<option value="${sp.id}" ${s.spec === sp.id ? 'selected' : ''}>${T(sp)}</option>`).join('')}</select>
            <select class="dm-select" data-ch="hrExp" aria-label="${L('الخبرة', 'Experience')}">${[0, 2, 5, 10].map((n) => `<option value="${n}" ${s.exp === String(n) ? 'selected' : ''}>${n ? L(`خبرة ${n}+ سنوات`, `${n}+ years`) : L('أي خبرة', 'Any experience')}</option>`).join('')}</select>
            <select class="dm-select" data-ch="hrStage" aria-label="${L('المرحلة', 'Stage')}"><option value="all">${L('كل المراحل', 'All stages')}</option>${HR_STAGES.map((st, i) => `<option value="${i}" ${s.stage === String(i) ? 'selected' : ''}>${T(st)}</option>`).join('')}</select>
            <span class="muted" id="dmCount"></span>
          </div>
          ${table([L('الاسم', 'Name'), L('المهنة', 'Profession'), L('الخبرة', 'Experience'), L('المدينة', 'City'), L('أهم المهارات', 'Top skills'), L('المرحلة', 'Stage')], '', { bodyId: 'dmBankBody' })}`;
      },
      reqs(app) {
        const s = app.s, q = s.reqs.find((x) => x.id === s.req) || s.reqs[0], spec = specById(q.spec);
        const all = s.cands.map((c) => ({ c, m: matchCand(c, q) })).filter((x) => x.m).sort((a, b) => b.m.score - a.m.score || b.c.exp - a.c.exp);
        const by = (g) => all.filter((x) => x.m.grp === g);
        const list = by(s.grp).slice(0, 12);
        return `<div class="dm-cols" style="grid-template-columns:minmax(0,1fr) minmax(0,1.7fr)">
          <div class="dm-panel"><h3>${L('الطلبيات', 'Orders')}<button type="button" class="dm-btn pri sm" data-act="newReq">${ic('ai')}${L('اقرأ طلب شركة', 'Read a demand letter')}</button></h3>
            <ul class="dm-list">${s.reqs.map((x) => `<li class="click" tabindex="0" data-act="pickReq" data-id="${x.id}" style="${x.id === q.id ? 'border-color:var(--blue);box-shadow:0 0 0 2px rgba(42,107,179,.15)' : ''}"><div class="grow"><b>${T(specById(x.spec))} × ${x.count}</b><small>${x.salary} • ${fmtD(x.opened)}</small></div></li>`).join('')}</ul>
          </div>
          <div class="dm-panel"><h3>${L('المرشحين المقترحين', 'Suggested candidates')}: ${T(spec)} × ${q.count}</h3>
            <div class="dm-rules">${q.rules.map((r) => `<span><i class="dm-pill ${r.w === 3 ? 'pr' : r.w === 2 ? 'p2' : 'p0'}">${T(W[r.w])}</i>${ruleText(r, spec)}</span>`).join('')}</div>
            <div class="dm-tabs" role="tablist">${Object.keys(GROUPS).map((g) => `<button type="button" role="tab" class="${s.grp === g ? 'on' : ''}" data-act="grp" data-g="${g}">${GROUPS[g].ic} ${T(GROUPS[g])} <b class="num">${by(g).length}</b></button>`).join('')}</div>
            <ul class="dm-list">${list.map((x, i) => { const v = x.m.score; const col = v >= 80 ? '#16a34a' : v >= 60 ? '#F5A524' : '#94a3b8'; return `<li><span class="dm-rank">${i + 1}</span><span class="dm-score" style="--v:${v};--c:${col}"><span>${v}%</span></span><div class="grow click" tabindex="0" data-act="openCand" data-id="${x.c.id}" style="cursor:pointer"><b>${esc(T(x.c.name))}</b><small>${x.c.exp} ${L('سنة خبرة', 'yrs exp.')} • ${T(x.c.city)}${x.m.ask.length ? ` • <span style="color:#b45309">${L('اسأله عن', 'Ask about')}: ${x.m.ask.map((a) => ruleText(a.rule, spec)).join('، ')}</span>` : ''}</small></div><button type="button" class="dm-btn sm" data-act="why" data-id="${x.c.id}">${L('ليه؟', 'Why?')}</button></li>`; }).join('') || `<li class="muted">${L('لا يوجد مرشحون في هذه المجموعة', 'No candidates in this group')}</li>`}</ul>
            <div class="dm-actions" style="margin-top:12px"><button type="button" class="dm-btn" data-act="hrExport" data-what="export">${ic('excel')}${L('تصدير الترشيحات', 'Export shortlist')}</button><button type="button" class="dm-btn" data-act="hrExport" data-what="send">${ic('pdf')}${L('إرسال للعميل (PDF / ZIP)', 'Send to client (PDF / ZIP)')}</button></div>
          </div></div>`;
      },
      pipe(app) {
        const s = app.s;
        return `<p class="dm-note" style="margin:0 0 12px">${L('حرّك أي مرشح بين المراحل بالأسهم.', 'Move any candidate between stages using the arrows.')}</p><div class="dm-kanban">${HR_STAGES.map((st, i) => {
          const list = s.cands.filter((c) => c.stage === i);
          return `<div class="dm-col"><h4>${hrPill(i)}<b>${list.length}</b></h4>${list.slice(0, 7).map((c) => `<div class="dm-card"><b>${esc(T(c.name))}</b><small>${T(specById(c.spec))} • ${c.exp} ${L('سنة', 'yrs')}</small>
            <div class="mv"><button type="button" class="back" data-act="mv" data-id="${c.id}" data-d="-1" ${i === 0 ? 'disabled' : ''} aria-label="${L('المرحلة السابقة', 'Previous stage')}">${ic('next')}</button><button type="button" class="fwd" data-act="mv" data-id="${c.id}" data-d="1" ${i === HR_STAGES.length - 1 ? 'disabled' : ''} aria-label="${L('المرحلة التالية', 'Next stage')}">${ic('next')}</button></div></div>`).join('')}
            ${list.length > 7 ? `<small class="muted">+${list.length - 7} ${L('آخرين', 'more')}</small>` : ''}</div>`;
        }).join('')}</div>`;
      },
      cvmaker(app) {
        const s = app.s; const c = s.cands.find((x) => x.id === s.cvCand) || s.cands.find((x) => x.exp >= 3) || s.cands[0]; s.cvCand = c.id;
        return `<div class="dm-cols" style="grid-template-columns:minmax(0,1fr) minmax(0,1.6fr)">
          <div class="dm-panel"><h3>${L('إعدادات السيرة', 'CV settings')}</h3>
            <div class="dm-form">
              <label class="full">${L('المرشح', 'Candidate')}<select class="dm-select dm-input" data-ch="cvCand">${s.cands.slice(0, 40).map((x) => `<option value="${x.id}" ${x.id === c.id ? 'selected' : ''}>${esc(T(x.name))} — ${T(specById(x.spec))}</option>`).join('')}</select></label>
              <label class="full">${L('لغة السيرة', 'CV language')}<select class="dm-select dm-input" data-ch="cvLang"><option value="ar" ${s.cvLang === 'ar' ? 'selected' : ''}>العربية</option><option value="en" ${s.cvLang === 'en' ? 'selected' : ''}>English</option></select></label>
            </div>
            <p style="margin:14px 0 6px"><b>${L('القالب', 'Template')}</b></p>
            <div class="dm-tpls">${CV_TPLS.map((t) => `<button type="button" class="${s.cvTpl === t.id ? 'on' : ''}" data-act="cvTpl" data-t="${t.id}"><i class="tp-${t.id}"></i>${T(t)}</button>`).join('')}</div>
            <div class="dm-actions" style="margin-top:14px"><button type="button" class="dm-btn pri" data-act="hrExport" data-what="pdf">${ic('pdf')}PDF</button><button type="button" class="dm-btn" data-act="hrExport" data-what="word">${ic('file')}Word</button><button type="button" class="dm-btn" data-act="hrExport" data-what="img">${ic('save')}${L('صورة', 'Image')}</button></div>
            <p class="dm-note">${L('النظام الكامل فيه 20 قالباً، مع تحريك العناصر وتظبيط حجم الخط وعدد الصفحات.', 'The full system has 20 templates, with element dragging and font-size and page-count controls.')}</p>
          </div>
          <div class="dm-panel dm-cvwrap">${cvHtml(c, s.cvTpl, s.cvLang)}</div>
        </div>`;
      },
      data(app) {
        const s = app.s;
        return `<div class="dm-cols-2">
          <div class="dm-panel"><h3>${L('استيراد وتصدير Excel', 'Excel import & export')}</h3>
            <p class="muted">${L('استيراد بخطوات: ربط الأعمدة، ومطابقة المهن، وفحص قبل الحفظ، مع إمكانية التراجع عن الدفعة بالكامل.', 'Step-by-step import: column mapping, profession matching and a pre-save check, with full undo per batch.')}</p>
            <div class="dm-actions"><button type="button" class="dm-btn" data-act="hrExport" data-what="import">${ic('upload')}${L('استيراد من Excel', 'Import from Excel')}</button><button type="button" class="dm-btn" data-act="hrExport" data-what="export">${ic('excel')}${L('تصدير إلى Excel', 'Export to Excel')}</button></div>
          </div>
          <div class="dm-panel"><h3>${L('النسخ الاحتياطي', 'Backup')}</h3>
            <div class="dm-actions" style="margin-bottom:12px"><button type="button" class="dm-btn pri" data-act="hrBackup" data-kind="SQL">${ic('db')}${L('نسخة SQL', 'SQL backup')}</button><button type="button" class="dm-btn" data-act="hrBackup" data-kind="ZIP">${ic('save')}${L('نسخة ZIP (مع الملفات)', 'ZIP backup (with files)')}</button></div>
            ${table([L('التاريخ', 'Date'), L('النوع', 'Type'), L('الحجم', 'Size')], s.backups.map((b) => `<tr><td class="num">${fmtD(b.date)}</td><td><span class="dm-pill ${b.kind === 'SQL' ? 'p0' : 'p2'}">${b.kind}</span></td><td class="num">${b.size}</td></tr>`).join(''))}
          </div></div>`;
      }
    },
    cvRecord(cv) {
      return `<h3>${L('السجل المنظم', 'Structured record')}<span class="dm-pill p5">${L('تمت القراءة', 'Read')}</span></h3>
        <dl class="dm-dl">
          <dt>${L('الاسم', 'Name')}</dt><dd>${T(cv.name)}</dd><dt>${L('المهنة', 'Profession')}</dt><dd>${T(specById(cv.spec))}</dd>
          <dt>${L('سنوات الخبرة', 'Experience')}</dt><dd>${cv.exp} ${L('سنوات', 'years')}</dd><dt>${L('السن', 'Age')}</dt><dd>${cv.age}</dd><dt>${L('المؤهل', 'Education')}</dt><dd>${T(cv.edu)}</dd>
          <dt>${L('المدينة', 'City')}</dt><dd>${T(cv.city)}</dd><dt>${L('اللغة الإنجليزية', 'English')}</dt><dd>${T(ENG[cv.eng])}</dd>
        </dl>
        <p><b>${L('المهارات المستخرجة', 'Extracted skills')}</b></p><div class="dm-skills">${cv.skills.map((x) => `<span class="hit">${T(x)}</span>`).join('')}</div>
        <div class="dm-actions" style="margin-top:16px">${cv.saved ? `<button type="button" class="dm-btn" data-view="bank">${ic('users')}${L('عرض في بنك المرشحين', 'View in candidate bank')}</button>` : `<button type="button" class="dm-btn ok" data-act="cvSave">${ic('save')}${L('اعتماد وإضافة للبنك', 'Approve & add to bank')}</button>`}</div>`;
    },
    after: {
      bank(app) { app.$('#dmBankBody').innerHTML = hrRows(app); },
      inbox(app) {
        const z = app.$('#dmDrop'); if (!z) return;
        ['dragenter', 'dragover'].forEach((ev) => z.addEventListener(ev, (e) => { e.preventDefault(); z.classList.add('over'); }));
        ['dragleave', 'drop'].forEach((ev) => z.addEventListener(ev, (e) => { e.preventDefault(); z.classList.remove('over'); }));
        z.addEventListener('drop', () => { app.toast(L('في العرض التوضيحي لا يتم رفع ملفات – سيتم استخدام سيرة ذاتية تجريبية', 'No files are uploaded in the demo – a sample CV will be used')); HR.acts.cvRun(app); });
      }
    },
    acts: {
      closeDrawer: (app) => app.closeDrawer(),
      hrSearch(app, el) { app.s.q = el.value; app.$('#dmBankBody').innerHTML = hrRows(app); },
      hrSpec(app, el) { app.s.spec = el.value; app.$('#dmBankBody').innerHTML = hrRows(app); },
      hrExp(app, el) { app.s.exp = el.value; app.$('#dmBankBody').innerHTML = hrRows(app); },
      hrStage(app, el) { app.s.stage = el.value; app.$('#dmBankBody').innerHTML = hrRows(app); },
      openCand(app, el) { const c = app.s.cands.find((x) => x.id === +el.dataset.id); if (c) candDrawer(app, c); },
      candStage(app, el) {
        const c = app.s.cands.find((x) => x.id === +el.dataset.id); c.stage = +el.value;
        if (app.view === 'bank') app.$('#dmBankBody').innerHTML = hrRows(app);
        else { app.render(); candDrawer(app, c); }
        app.toast(L(`تم نقل المرشح إلى «${T(HR_STAGES[c.stage])}»`, `Candidate moved to “${T(HR_STAGES[c.stage])}”`));
      },
      cvFor(app, el) { app.s.cvCand = +el.dataset.id; app.go('cvmaker'); },
      pickReq(app, el) { app.s.req = +el.dataset.id; app.s.grp = 'match'; if (app.view !== 'reqs') app.go('reqs'); else app.render(); },
      grp(app, el) { app.s.grp = el.dataset.g; app.render(); },
      why(app, el) { const c = app.s.cands.find((x) => x.id === +el.dataset.id); const q = app.s.reqs.find((x) => x.id === app.s.req) || app.s.reqs[0]; whyDrawer(app, c, q); },
      newReq(app) {
        app.drawer(L('قراءة طلب شركة بالذكاء الاصطناعي', 'Read a demand letter with AI'), `
          <p class="muted">${L('خطاب طلب تجريبي:', 'Sample demand letter:')}</p>
          <div class="dm-letter" dir="ltr">We require 6 ICU Nurses, minimum 3 years experience, BLS certified, good English. Age below 40. Salary 7,500 SAR.</div>
          <div class="dm-progress"><i id="dmReqBar"></i></div>
          <div class="dm-actions"><button type="button" class="dm-btn pri" data-act="readReq">${ic('ai')}${L('اقرأ واستخرج الشروط', 'Read & extract requirements')}</button></div>
          <div id="dmReqOut"></div>`);
      },
      readReq(app) {
        const bar = app.$('#dmReqBar'); if (!bar || app._rq) return; app._rq = true; let p = 0;
        const t = setInterval(() => {
          p += 20; if (!app.$('#dmReqBar')) { clearInterval(t); app._rq = false; return; } bar.style.width = p + '%';
          if (p < 100) return; clearInterval(t); app._rq = false;
          const q = { id: app.s.reqs.length + 1, spec: 'nur', count: 6, salary: '7,500 SAR', opened: TODAY, rules: [{ k: 'skill', v: 3, w: 3 }, { k: 'exp', v: 3, w: 3 }, { k: 'skill', v: 2, w: 2 }, { k: 'eng', v: 2, w: 2 }, { k: 'age', v: 40, w: 1 }] };
          app._newReq = q; const spec = specById('nur');
          app.$('#dmReqOut').innerHTML = `<h3 style="margin-top:14px">${T(spec)} × 6 — 7,500 SAR</h3>${table([L('الشرط', 'Requirement'), L('الأهمية', 'Weight')], q.rules.map((r) => `<tr><td>${ruleText(r, spec)}</td><td>${T(W[r.w])}</td></tr>`).join(''))}
            <div class="dm-actions" style="margin-top:12px"><button type="button" class="dm-btn ok" data-act="saveReq">${ic('save')}${L('حفظ الطلبية وعرض المطابقين', 'Save order & show matches')}</button></div>`;
        }, 260);
      },
      saveReq(app) { const q = app._newReq; if (!q) return; app._newReq = null; app.s.reqs.unshift(q); app.s.req = q.id; app.s.grp = 'match'; app.closeDrawer(); app.render(); app.toast(L('تم حفظ الطلبية', 'Order saved')); },
      mv(app, el) {
        const c = app.s.cands.find((x) => x.id === +el.dataset.id); const n = c.stage + +el.dataset.d;
        if (n < 0 || n >= HR_STAGES.length) return; c.stage = n; app.render();
        app.toast(L(`${T(c.name)} ← ${T(HR_STAGES[n])}`, `${T(c.name)} → ${T(HR_STAGES[n])}`));
      },
      cvCand(app, el) { app.s.cvCand = +el.value; app.render(); },
      cvLang(app, el) { app.s.cvLang = el.value; app.render(); },
      cvTpl(app, el) { app.s.cvTpl = el.dataset.t; app.render(); },
      cvRun(app) {
        if (app._cvBusy) return; app._cvBusy = true;
        const items = app.root.querySelectorAll('#dmCvSteps li'); items.forEach((li) => (li.className = ''));
        app.s.cv = null; const out = app.$('#dmCvOut');
        out.innerHTML = `<h3>${L('السجل المنظم', 'Structured record')}</h3><p class="muted">${L('جارٍ القراءة…', 'Reading…')}</p>`;
        let k = 0;
        const step = () => {
          if (!app.$('#dmCvSteps')) { app._cvBusy = false; return; }
          if (k > 0) items[k - 1].className = 'ok';
          if (k < items.length) { items[k].className = 'run'; k++; setTimeout(step, 650); return; }
          app._cvBusy = false; app.s.cv = { ...SAMPLE_CV }; out.innerHTML = HR.cvRecord(app.s.cv);
        };
        step();
      },
      cvSave(app) {
        const cv = app.s.cv; if (!cv || cv.saved) return;
        const id = app.s.cands.length + 1;
        app.s.cands.unshift({ id, name: cv.name, spec: cv.spec, exp: cv.exp, age: cv.age, city: cv.city, skills: cv.skills, edu: cv.edu, eng: cv.eng, mobile: cv.mobile, stage: 0, added: TODAY, ref: 'AP-' + (24200 + id) });
        cv.saved = true; app.$('#dmCvOut').innerHTML = HR.cvRecord(cv);
        app.toast(L('تم الاعتماد والإضافة لبنك المرشحين', 'Approved and added to the candidate bank'));
      },
      hrExport(app, el) {
        const w = el.dataset.what;
        const names = { import: L('الاستيراد من Excel', 'Excel import'), export: L('التصدير إلى Excel', 'Excel export'), send: L('الإرسال للعميل', 'Sending to client'), pdf: L('التنزيل PDF', 'PDF download'), word: L('التنزيل Word', 'Word download'), img: L('التنزيل كصورة', 'Image download') };
        app.toast(disabledMsg(names[w] || w));
      },
      hrBackup(app, el) {
        const k = el.dataset.kind; app.s.backups.unshift({ date: TODAY, kind: k, size: k === 'SQL' ? '3.9 MB' : '41.8 MB' });
        app.render(); app.toast(L(`تم إنشاء نسخة ${k} (محاكاة)`, `${k} backup created (simulated)`));
      }
    }
  };

  /* =========================================================
     3) موقع شركة + لوحة التحكم (CMS)
     ========================================================= */
  const COLORS = [{ v: '#1D4E89', ar: 'كحلي', en: 'Navy' }, { v: '#0f766e', ar: 'أخضر', en: 'Green' }, { v: '#7f1d1d', ar: 'عنابي', en: 'Burgundy' }, { v: '#1f2937', ar: 'فحمي', en: 'Charcoal' }];
  const COUNTRIES = [['السعودية', 'Saudi Arabia'], ['الكويت', 'Kuwait'], ['قطر', 'Qatar'], ['الإمارات', 'UAE'], ['عُمان', 'Oman']].map((c) => ({ ar: c[0], en: c[1] }));
  function webState() {
    const r = rng(4242);
    const jobs = [['ممرض', 'Nurse', 0], ['فني كهرباء', 'Electrician', 1], ['سائق نقل ثقيل', 'Heavy truck driver', 0], ['محاسب', 'Accountant', 2], ['طباخ', 'Cook', 3]]
      .map((j, i) => ({ code: 'EX-' + String(i + 1).padStart(3, '0'), title: { ar: j[0], en: j[1] }, country: COUNTRIES[j[2]], open: i !== 4, views: r.int(40, 420) }));
    const types = [{ ar: 'طلب عمالة (شركة)', en: 'Workforce request (company)' }, { ar: 'تسجيل عامل', en: 'Worker registration' }, { ar: 'استفسار', en: 'Inquiry' }, { ar: 'تقديم على وظيفة', en: 'Job application' }];
    const msgs = []; for (let i = 0; i < 9; i++) msgs.push({ id: i + 1, type: r.pick(types), name: person(r, r() < 0.2), mobile: mobile(r), via: r() < 0.6 ? 'wa' : 'mail', date: addDays(TODAY, -r.int(0, 10)), read: i > 2, job: r() < 0.5 ? jobs[r.int(0, 3)].code : null });
    msgs.sort((a, b) => b.date - a.date);
    const days = []; for (let i = 6; i >= 0; i--) days.push({ d: addDays(TODAY, -i), v: r.int(60, 240) });
    return { site: { title: { ar: 'كفاءات مدرّبة لفرص حقيقية', en: 'Trained talent for real opportunities' }, sub: { ar: 'نوفّر العمالة المؤهلة للشركات، من تحديد الاحتياج حتى الوصول.', en: 'We provide qualified workers to companies, from defining the need to arrival.' }, color: '#1D4E89', jobsOn: true },
      jobs, msgs, days, sources: [['فيسبوك', 'Facebook', 46], ['جوجل', 'Google', 28], ['مباشر', 'Direct', 17], ['واتساب', 'WhatsApp', 9]], post: 'EX-001', postSize: 'sq',
      users: [{ name: { ar: 'مستخدم تجريبي', en: 'Demo user' }, role: { ar: 'المدير', en: 'Owner' }, tfa: true, secs: 7 }, { name: person(r), role: { ar: 'محرر محتوى', en: 'Content editor' }, tfa: true, secs: 3 }, { name: person(r, true), role: { ar: 'الرد على الرسائل', en: 'Messages' }, tfa: false, secs: 1 }],
      devices: [{ name: 'Chrome – Windows', user: 1, ok: false }, { name: 'Safari – iPhone', user: 2, ok: false }],
      audit: [{ ar: 'تسجيل دخول ناجح', en: 'Successful sign-in' }, { ar: 'تعديل نص الواجهة', en: 'Edited hero text' }, { ar: 'إضافة وظيفة EX-004', en: 'Added job EX-004' }, { ar: 'تصدير الرسائل Excel', en: 'Exported messages to Excel' }].map((a, i) => ({ a, t: addDays(TODAY, -i) })) };
  }
  function sitePreview(s) {
    const st = s.site, c = st.color, open = s.jobs.filter((j) => j.open).slice(0, 3);
    return `<div class="wp" style="--wc:${c}">
      <div class="wp-bar"><i></i><i></i><i></i><span>example-company.com</span></div>
      <div class="wp-nav"><b><span class="wp-logo">${L('م', 'E')}</span>${L('شركة المثال', 'Example Co.')}</b><span>${L('الرئيسية', 'Home')}</span><span>${L('الوظائف', 'Jobs')}</span><span>${L('تواصل', 'Contact')}</span></div>
      <div class="wp-hero"><h4>${esc(T(st.title))}</h4><p>${esc(T(st.sub))}</p><span class="wp-btn">${L('اطلب عمالة', 'Request workers')}</span></div>
      ${st.jobsOn ? `<div class="wp-jobs"><h5>${L('أحدث الوظائف', 'Latest jobs')}</h5>${open.map((j) => `<div class="wp-job"><b>${T(j.title)}</b><small>${T(j.country)} · ${j.code}</small><span>${L('قدّم', 'Apply')}</span></div>`).join('') || `<small class="muted">${L('لا توجد وظائف مفتوحة', 'No open jobs')}</small>`}</div>` : ''}
      <div class="wp-foot"><span class="wp-wa">${L('واتساب', 'WhatsApp')}</span><span>${L('اتصال', 'Call')}</span></div>
    </div>`;
  }
  function postCard(s) {
    const j = s.jobs.find((x) => x.code === s.post) || s.jobs[0], st = s.site;
    return `<div class="wpost ${s.postSize === 'story' ? 'story' : ''}" style="--wc:${st.color}">
      <div class="wpost-top"><span class="wp-logo">${L('م', 'E')}</span><b>${L('شركة المثال', 'Example Co.')}</b></div>
      <p class="wpost-k">${L('مطلوب للعمل في', 'Now hiring in')} ${T(j.country)}</p>
      <h4>${T(j.title)}</h4>
      <p class="wpost-code">${L('كود الوظيفة', 'Job code')}: ${j.code}</p>
      <div class="wpost-qr"><div class="dm-qr">${qrLike(j.code)}</div><small>${L('امسح للتقديم', 'Scan to apply')}</small></div>
      <p class="wpost-ft">${L('للتواصل واتساب', 'WhatsApp')}: 010•••••••</p>
    </div>`;
  }
  const WEB = {
    cls: 'dm-web',
    name: { ar: 'لوحة التحكم', en: 'Admin panel' }, sub: { ar: 'موقع شركة تجريبي', en: 'Sample company site' },
    state: webState,
    nav: [
      { id: 'content', icon: 'file', label: { ar: 'المحتوى والمعاينة', en: 'Content & preview' } },
      { id: 'jobs', icon: 'brief', label: { ar: 'الوظائف', en: 'Jobs' } },
      { id: 'post', icon: 'qr', label: { ar: 'صورة للنشر', en: 'Social post image' } },
      { id: 'msgs', icon: 'folder', label: { ar: 'الرسائل', en: 'Messages' } },
      { id: 'stats', icon: 'chart', label: { ar: 'الإحصائيات', en: 'Statistics' } },
      { id: 'users', icon: 'shield', label: { ar: 'المستخدمين والأمان', en: 'Users & security' } }
    ],
    views: {
      content(app) {
        const st = app.s.site;
        return `<div class="dm-cols" style="grid-template-columns:minmax(0,1fr) minmax(0,1.3fr)">
          <div class="dm-panel"><h3>${L('الواجهة الرئيسية', 'Hero section')}<small>${L('عدّل وشوف التغيير فوراً', 'Edit and see it live')}</small></h3>
            <div class="dm-form">
              <label class="full">${L('العنوان', 'Title')}<input class="dm-input" data-in="wTitle" value="${esc(T(st.title))}"></label>
              <label class="full">${L('الوصف', 'Subtitle')}<textarea class="dm-input" rows="3" data-in="wSub">${esc(T(st.sub))}</textarea></label>
              <label>${L('لون الموقع', 'Site color')}<select class="dm-select dm-input" data-ch="wColor">${COLORS.map((c) => `<option value="${c.v}" ${st.color === c.v ? 'selected' : ''}>${T(c)}</option>`).join('')}</select></label>
              <label>${L('قسم الوظائف', 'Jobs section')}<select class="dm-select dm-input" data-ch="wJobsOn"><option value="1" ${st.jobsOn ? 'selected' : ''}>${L('ظاهر', 'Shown')}</option><option value="0" ${st.jobsOn ? '' : 'selected'}>${L('مخفي', 'Hidden')}</option></select></label>
            </div>
            <div class="dm-actions" style="margin-top:14px"><button type="button" class="dm-btn ok" data-act="wSave">${ic('save')}${L('حفظ ونشر', 'Save & publish')}</button></div>
            <p class="dm-note">${L('في المواقع الحقيقية: كل نصوص الموقع والصور والخدمات والأسئلة الشائعة تتعدّل بنفس الطريقة.', 'On the real sites, all texts, images, services and FAQs are edited the same way.')}</p>
          </div>
          <div class="dm-panel"><h3>${L('معاينة الموقع', 'Site preview')}</h3><div id="wPrev">${sitePreview(app.s)}</div></div>
        </div>`;
      },
      jobs(app) {
        return `<div class="dm-cols" style="grid-template-columns:minmax(0,1.5fr) minmax(0,1fr)">
          <div class="dm-panel"><h3>${L('الوظائف', 'Jobs')}<small>${app.s.jobs.filter((j) => j.open).length} ${L('مفتوحة', 'open')}</small></h3>
            ${table([L('الكود', 'Code'), L('الوظيفة', 'Job'), L('الدولة', 'Country'), L('المشاهدات', 'Views'), L('الحالة', 'Status'), ''],
              app.s.jobs.map((j) => `<tr><td class="num">${j.code}</td><td><b>${T(j.title)}</b></td><td>${T(j.country)}</td><td class="num">${j.views}</td>
                <td><button type="button" class="dm-btn sm" data-act="wToggle" data-c="${j.code}">${j.open ? `<span class="dm-pill p5">${L('مفتوحة', 'Open')}</span>` : `<span class="dm-pill pr">${L('مقفولة', 'Closed')}</span>`}</button></td>
                <td><button type="button" class="dm-btn sm" data-act="wPostFor" data-c="${j.code}">${ic('qr')}${L('صورة للنشر', 'Post image')}</button></td></tr>`).join(''))}
          </div>
          <div class="dm-panel"><h3>${L('وظيفة جديدة', 'New job')}</h3>
            <div class="dm-form">
              <label class="full">${L('اسم الوظيفة', 'Job title')}<input class="dm-input" id="wJobT" value="${L('فني تكييف', 'HVAC technician')}"></label>
              <label class="full">${L('الدولة', 'Country')}<select class="dm-select dm-input" id="wJobC">${COUNTRIES.map((c, i) => `<option value="${i}">${T(c)}</option>`).join('')}</select></label>
            </div>
            <div class="dm-actions" style="margin-top:12px"><button type="button" class="dm-btn pri" data-act="wAddJob">${ic('plus')}${L('إضافة (الكود يتعمل تلقائياً)', 'Add (code generated automatically)')}</button></div>
          </div></div>`;
      },
      post(app) {
        const s = app.s;
        return `<div class="dm-cols" style="grid-template-columns:minmax(0,1fr) minmax(0,1.2fr)">
          <div class="dm-panel"><h3>${L('صورة جاهزة للنشر', 'Ready-to-post image')}</h3>
            <div class="dm-form">
              <label class="full">${L('الوظيفة', 'Job')}<select class="dm-select dm-input" data-ch="wPost">${s.jobs.map((j) => `<option value="${j.code}" ${s.post === j.code ? 'selected' : ''}>${j.code} — ${T(j.title)}</option>`).join('')}</select></label>
              <label class="full">${L('المقاس', 'Size')}<select class="dm-select dm-input" data-ch="wPostSize"><option value="sq" ${s.postSize === 'sq' ? 'selected' : ''}>${L('بوست (مربع)', 'Post (square)')}</option><option value="story" ${s.postSize === 'story' ? 'selected' : ''}>${L('ستوري (طولي)', 'Story (vertical)')}</option></select></label>
              <label class="full">${L('نص البوست', 'Post text')}<textarea class="dm-input" rows="4" id="wPostTxt" readonly>${esc(HRpostText(s))}</textarea></label>
            </div>
            <div class="dm-actions" style="margin-top:12px"><button type="button" class="dm-btn" data-act="wCopy">${ic('file')}${L('نسخ النص', 'Copy text')}</button><button type="button" class="dm-btn pri" data-act="wFb">${ic('share')}${L('نشر على فيسبوك', 'Publish to Facebook')}</button></div>
          </div>
          <div class="dm-panel wpost-wrap">${postCard(s)}</div></div>`;
      },
      msgs(app) {
        const s = app.s;
        return `<div class="dm-toolbar"><span class="muted">${s.msgs.filter((m) => !m.read).length} ${L('رسائل جديدة', 'new messages')}</span><span style="flex:1"></span><button type="button" class="dm-btn" data-act="wExport">${ic('excel')}${L('تصدير Excel', 'Export Excel')}</button></div>
          ${table([L('التاريخ', 'Date'), L('النوع', 'Type'), L('الاسم', 'Name'), L('الوظيفة', 'Job'), L('وصلت عبر', 'Via'), ''],
            s.msgs.map((m) => `<tr class="click" tabindex="0" data-act="wMsg" data-id="${m.id}"><td class="num">${fmtD(m.date)}</td><td>${T(m.type)}</td><td>${m.read ? '' : '<span class="dm-dot"></span>'}<b>${esc(T(m.name))}</b></td><td class="num">${m.job || '—'}</td><td>${m.via === 'wa' ? L('واتساب', 'WhatsApp') : L('إيميل', 'Email')}</td><td>${m.read ? '' : `<span class="dm-pill p0">${L('جديدة', 'New')}</span>`}</td></tr>`).join(''))}`;
      },
      stats(app) {
        const s = app.s, week = s.days.reduce((t, d) => t + d.v, 0);
        return `<div class="dm-kpis">
            ${kpi('chart', num(s.days[6].v), L('زيارات اليوم', 'Visits today'))}
            ${kpi('users', num(week), L('زيارات الأسبوع', 'Visits this week'), 'g')}
            ${kpi('share', num(Math.round(week * 0.06)), L('ضغطات واتساب', 'WhatsApp clicks'), 'ok')}
            ${kpi('folder', num(s.msgs.length), L('فورمات اتبعتت', 'Forms sent'))}
          </div>
          <div class="dm-cols-2">
            <div class="dm-panel"><h3>${L('الزيارات آخر 7 أيام', 'Visits, last 7 days')}</h3>${bars(s.days.map((d) => ({ l: fmtD(d.d), v: d.v })))}</div>
            <div class="dm-panel"><h3>${L('الزوار جايين منين', 'Traffic sources')}</h3>${bars(s.sources.map((x) => ({ l: L(x[0], x[1]), v: x[2] })), true)}
              <h3 style="margin-top:16px">${L('أكثر الوظائف مشاهدة', 'Most viewed jobs')}</h3>${bars(s.jobs.slice().sort((a, b) => b.views - a.views).slice(0, 3).map((j) => ({ l: T(j.title), v: j.views })))}</div>
          </div>
          <p class="dm-note">${L('الإحصائيات في المواقع الحقيقية تُجمع بدون كوكيز ولا خدمات خارجية.', 'On the real sites, statistics are collected without cookies or external services.')}</p>`;
      },
      users(app) {
        const s = app.s;
        return `<div class="dm-cols-2">
          <div class="dm-panel"><h3>${L('المستخدمين', 'Users')}</h3>
            ${table([L('المستخدم', 'User'), L('الدور', 'Role'), L('الأقسام', 'Sections'), L('التحقق الثنائي', '2FA')], s.users.map((u) => `<tr><td><b>${T(u.name)}</b></td><td class="muted">${T(u.role)}</td><td class="num">${u.secs}</td><td>${u.tfa ? `<span class="dm-pill p5">${L('مفعّل', 'On')}</span>` : `<span class="dm-pill p2">${L('مطلوب', 'Required')}</span>`}</td></tr>`).join(''))}
            <h3 style="margin-top:16px">${L('أجهزة جديدة تنتظر الموافقة', 'New devices awaiting approval')}</h3>
            <ul class="dm-list">${s.devices.map((d, i) => `<li><div class="grow"><b>${d.name}</b><small>${T(s.users[d.user].name)}</small></div>${d.ok ? `<span class="dm-pill p5">${L('تمت الموافقة', 'Approved')}</span>` : `<button type="button" class="dm-btn sm ok" data-act="wDev" data-i="${i}">${ic('check')}${L('موافقة', 'Approve')}</button>`}</li>`).join('')}</ul>
          </div>
          <div class="dm-panel"><h3>${L('سجل العمليات', 'Audit log')}</h3>
            <ul class="dm-list">${s.audit.map((x) => `<li><span class="dm-avatar" style="background:var(--surface-2);color:var(--blue)">${ic('clock')}</span><div class="grow"><b>${T(x.a)}</b><small class="num">${fmtD(x.t)}</small></div></li>`).join('')}</ul>
            <p class="dm-note">${L('قفل الحساب بعد 5 محاولات خاطئة، وفصل الجلسات فوراً عند تغيير الصلاحيات.', 'Accounts lock after 5 wrong attempts, and sessions end immediately when permissions change.')}</p>
          </div></div>`;
      }
    },
    acts: {
      closeDrawer: (app) => app.closeDrawer(),
      wTitle(app, el) { app.s.site.title = { ar: el.value, en: el.value }; app.$('#wPrev').innerHTML = sitePreview(app.s); },
      wSub(app, el) { app.s.site.sub = { ar: el.value, en: el.value }; app.$('#wPrev').innerHTML = sitePreview(app.s); },
      wColor(app, el) { app.s.site.color = el.value; app.$('#wPrev').innerHTML = sitePreview(app.s); },
      wJobsOn(app, el) { app.s.site.jobsOn = el.value === '1'; app.$('#wPrev').innerHTML = sitePreview(app.s); },
      wSave(app) { app.s.audit.unshift({ a: { ar: 'تعديل محتوى الواجهة', en: 'Edited hero content' }, t: TODAY }); app.toast(L('تم الحفظ والنشر على الموقع', 'Saved and published')); },
      wToggle(app, el) { const j = app.s.jobs.find((x) => x.code === el.dataset.c); j.open = !j.open; app.render(); app.toast(j.open ? L('تم فتح الوظيفة', 'Job opened') : L('تم قفل الوظيفة', 'Job closed')); },
      wAddJob(app) {
        const t = app.$('#wJobT').value.trim(); if (!t) { app.toast(L('اكتب اسم الوظيفة', 'Enter a job title')); return; }
        const code = 'EX-' + String(app.s.jobs.length + 1).padStart(3, '0');
        app.s.jobs.unshift({ code, title: { ar: t, en: t }, country: COUNTRIES[+app.$('#wJobC').value], open: true, views: 0 });
        app.s.audit.unshift({ a: { ar: `إضافة وظيفة ${code}`, en: `Added job ${code}` }, t: TODAY });
        app.render(); app.toast(L(`تمت إضافة الوظيفة بكود ${code}`, `Job added with code ${code}`));
      },
      wPostFor(app, el) { app.s.post = el.dataset.c; app.go('post'); },
      wPost(app, el) { app.s.post = el.value; app.render(); },
      wPostSize(app, el) { app.s.postSize = el.value; app.render(); },
      wCopy(app) { const t = app.$('#wPostTxt').value; (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => app.toast(L('تم نسخ نص البوست', 'Post text copied')), () => app.toast(L('انسخ النص يدوياً', 'Copy the text manually'))); },
      wFb(app) { app.toast(disabledMsg(L('النشر على فيسبوك', 'Publishing to Facebook'))); },
      wExport(app) { app.toast(disabledMsg(L('التصدير إلى Excel', 'Export to Excel'))); },
      wMsg(app, el) {
        const m = app.s.msgs.find((x) => x.id === +el.dataset.id); m.read = true; app.render();
        app.drawer(esc(T(m.name)), `<dl class="dm-dl"><dt>${L('النوع', 'Type')}</dt><dd>${T(m.type)}</dd><dt>${L('الموبايل', 'Mobile')}</dt><dd>${m.mobile}</dd><dt>${L('التاريخ', 'Date')}</dt><dd>${fmtD(m.date)}</dd>${m.job ? `<dt>${L('الوظيفة', 'Job')}</dt><dd>${m.job}</dd>` : ''}</dl>
          <p class="muted">${L('رسالة تجريبية من فورم الموقع.', 'Sample message from the website form.')}</p>
          <div class="dm-actions"><button type="button" class="dm-btn ok" data-act="wReply" data-v="wa">${L('رد على واتساب', 'Reply on WhatsApp')}</button><button type="button" class="dm-btn" data-act="wReply" data-v="mail">${L('رد بالإيميل', 'Reply by email')}</button></div>`);
      },
      wReply(app) { app.toast(disabledMsg(L('الرد', 'Replying'))); },
      wDev(app, el) { app.s.devices[+el.dataset.i].ok = true; app.s.audit.unshift({ a: { ar: 'الموافقة على جهاز جديد', en: 'Approved a new device' }, t: TODAY }); app.render(); app.toast(L('تمت الموافقة على الجهاز', 'Device approved')); }
    }
  };
  function HRpostText(s) {
    const j = s.jobs.find((x) => x.code === s.post) || s.jobs[0];
    return L(`📢 مطلوب ${j.title.ar} للعمل في ${j.country.ar}\n🔖 كود الوظيفة: ${j.code}\n📲 للتقديم أرسل الكود على واتساب أو قدّم من الموقع.`, `📢 Hiring: ${j.title.en} in ${j.country.en}\n🔖 Job code: ${j.code}\n📲 Send the code on WhatsApp or apply on the website.`);
  }

  /* =========================================================
     4) تطبيق وصال (واجهة موبايل)
     ========================================================= */
  function appState() {
    const r = rng(99);
    const habits = [['أذكار الصباح', 'Morning adhkar', '☀️'], ['قراءة ورد القرآن', 'Daily Quran reading', '📖'], ['مشي 30 دقيقة', '30-min walk', '🚶'], ['شرب 8 أكواب ماء', 'Drink 8 glasses of water', '💧'], ['مراجعة مهام الشغل', 'Review work tasks', '🗂️'], ['أذكار المساء', 'Evening adhkar', '🌙']]
      .map((h, i) => ({ id: i + 1, t: { ar: h[0], en: h[1] }, e: h[2], done: i < 2 }));
    const prayers = [['الفجر', 'Fajr', '04:52'], ['الظهر', 'Dhuhr', '11:41'], ['العصر', 'Asr', '14:43'], ['المغرب', 'Maghrib', '17:05'], ['العشاء', 'Isha', '18:24']].map((p, i) => ({ n: { ar: p[0], en: p[1] }, t: p[2], done: i < 2 }));
    const week = []; for (let d = 0; d < 6; d++) week.push(prayers.map(() => r() < 0.8));
    const money = [{ t: { ar: 'الراتب', en: 'Salary' }, a: 12000, in: true }, { t: { ar: 'سوبر ماركت', en: 'Groceries' }, a: 1450 }, { t: { ar: 'مواصلات', en: 'Transport' }, a: 600 }, { t: { ar: 'فاتورة الإنترنت', en: 'Internet bill' }, a: 350 }];
    const members = [person(r), person(r), person(r, true)].map((n, i) => ({ n, p: [83, 50, 67][i], cheered: false }));
    return { habits, prayers, week, money, members, focus: { min: 25, left: 25 * 60, run: false }, sound: 'rain', celebrate: false };
  }
  const SOUNDS = [['rain', 'مطر', 'Rain', '🌧️'], ['sea', 'بحر', 'Sea', '🌊'], ['forest', 'غابة', 'Forest', '🌲'], ['cafe', 'مقهى', 'Café', '☕']];
  const CHEERS = [{ ar: 'عاش! كمّل كده 💪', en: 'Great job! Keep going 💪' }, { ar: 'إنجاز جميل ✨', en: 'Nice progress ✨' }, { ar: 'خطوة ورا خطوة 🌱', en: 'Step by step 🌱' }];
  function ring(p, size) { return `<span class="ap-ring" style="--p:${p};--s:${size || 96}px"><b>${p}%</b></span>`; }
  const APP = {
    cls: 'dm-app', phone: true,
    name: { ar: 'وصال', en: 'Wesal' }, sub: { ar: 'خطوة منك، وخطوة مني', en: 'A step from you, a step from me' },
    state: appState,
    nav: [
      { id: 'today', icon: 'check', label: { ar: 'اليوم', en: 'Today' } },
      { id: 'focus', icon: 'clock', label: { ar: 'التركيز', en: 'Focus' } },
      { id: 'prayer', icon: 'star', label: { ar: 'العبادات', en: 'Worship' } },
      { id: 'money', icon: 'wallet', label: { ar: 'فلوسي', en: 'My money' } },
      { id: 'space', icon: 'users', label: { ar: 'المساحة', en: 'Space' } }
    ],
    views: {
      today(app) {
        const h = app.s.habits, done = h.filter((x) => x.done).length, p = Math.round((done / h.length) * 100);
        const days = []; for (let i = -3; i <= 3; i++) { const d = addDays(TODAY, i); days.push(`<span class="${i === 0 ? 'on' : ''}"><small>${d.toLocaleDateString(lang() === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'narrow' })}</small><b>${d.getDate()}</b></span>`); }
        return `<div class="ap-week">${days.join('')}</div>
          <div class="ap-card ap-prog">${ring(p)}<div><b>${L('تقدّم اليوم', 'Today’s progress')}</b><p>${L(`${done} من ${h.length} مهام`, `${done} of ${h.length} done`)}</p></div></div>
          <ul class="ap-list">${h.map((x) => `<li class="${x.done ? 'done' : ''}"><button type="button" data-act="aHabit" data-id="${x.id}" aria-pressed="${x.done}" aria-label="${esc(T(x.t))}"><span class="ap-chk">${x.done ? '✓' : ''}</span><span class="ap-e">${x.e}</span><span class="ap-t">${esc(T(x.t))}</span></button></li>`).join('')}</ul>
          <div class="ap-add"><input class="dm-input" id="aNew" placeholder="${L('مهمة جديدة…', 'New task…')}"><button type="button" class="dm-btn pri" data-act="aAdd" aria-label="${L('إضافة', 'Add')}">${ic('plus')}</button></div>
          ${app.s.celebrate ? `<div class="ap-cele" aria-live="polite"><div class="ap-conf">${'<i></i>'.repeat(18)}</div><b>🎉</b><p>${T(app.s.celebrate)}</p></div>` : ''}`;
      },
      focus(app) {
        const f = app.s.focus, m = Math.floor(f.left / 60), sec = f.left % 60, p = Math.round((1 - f.left / (f.min * 60)) * 100);
        return `<div class="ap-focus">${ring(p, 190).replace(`<b>${p}%</b>`, `<b class="ap-time" id="aTime">${pad(m)}:${pad(sec)}</b>`)}</div>
          <div class="ap-presets">${[15, 25, 45].map((n) => `<button type="button" class="${f.min === n ? 'on' : ''}" data-act="aPreset" data-n="${n}">${n} ${L('د', 'min')}</button>`).join('')}</div>
          <div class="ap-ctrl"><button type="button" class="dm-btn pri" data-act="aRun">${f.run ? L('إيقاف مؤقت', 'Pause') : L('ابدأ', 'Start')}</button><button type="button" class="dm-btn" data-act="aReset">${L('إعادة', 'Reset')}</button></div>
          <p class="ap-h">${L('أصوات خلفية', 'Ambient sounds')}</p>
          <div class="ap-sounds">${SOUNDS.map((x) => `<button type="button" class="${app.s.sound === x[0] ? 'on' : ''}" data-act="aSound" data-s="${x[0]}"><span>${x[3]}</span>${L(x[1], x[2])}</button>`).join('')}</div>`;
      },
      prayer(app) {
        const s = app.s, next = s.prayers.find((p) => !p.done) || s.prayers[0];
        const all = s.week.flat().concat(s.prayers.map((p) => p.done)); const pc = Math.round((all.filter(Boolean).length / all.length) * 100);
        return `<div class="ap-card ap-next"><small>${L('الصلاة القادمة', 'Next prayer')}</small><b>${T(next.n)}</b><span class="num">${next.t}</span><small class="muted">${L('مواقيت تجريبية', 'Sample times')}</small></div>
          <ul class="ap-list">${s.prayers.map((p, i) => `<li class="${p.done ? 'done' : ''}"><button type="button" data-act="aPray" data-i="${i}" aria-pressed="${p.done}"><span class="ap-chk">${p.done ? '✓' : ''}</span><span class="ap-t">${T(p.n)}</span><span class="num muted">${p.t}</span></button></li>`).join('')}</ul>
          <p class="ap-h">${L('هذا الأسبوع', 'This week')} — ${pc}%</p>
          <div class="ap-grid">${s.prayers.map((p, i) => `<div><small>${T(p.n)}</small>${s.week.map((d) => `<i class="${d[i] ? 'y' : ''}"></i>`).join('')}<i class="${p.done ? 'y' : ''} t"></i></div>`).join('')}</div>`;
      },
      money(app) {
        const s = app.s; let inc = 0, out = 0; s.money.forEach((m) => (m.in ? (inc += m.a) : (out += m.a)));
        return `<div class="ap-card ap-bal"><small>${L('الرصيد المتاح', 'Available balance')}</small><b class="num">${num(inc - out)}</b><div><span class="dm-pos">+${num(inc)}</span><span class="dm-neg">−${num(out)}</span></div></div>
          <ul class="ap-list ap-money">${s.money.map((m) => `<li><span class="ap-t">${esc(T(m.t))}</span><span class="num ${m.in ? 'dm-pos' : 'dm-neg'}">${m.in ? '+' : '−'}${num(m.a)}</span></li>`).join('')}</ul>
          <div class="ap-add"><input class="dm-input" id="aMT" placeholder="${L('البند', 'Item')}"><input class="dm-input" id="aMA" type="number" inputmode="numeric" placeholder="${L('المبلغ', 'Amount')}" style="max-width:110px"><button type="button" class="dm-btn pri" data-act="aSpend" aria-label="${L('إضافة', 'Add')}">${ic('plus')}</button></div>`;
      },
      space(app) {
        const h = app.s.habits, me = Math.round((h.filter((x) => x.done).length / h.length) * 100);
        return `<div class="ap-card"><b>${L('مساحة الأصدقاء', 'Friends space')}</b><p class="muted" style="margin:4px 0 0">${L('كل واحد شايف تقدّم التاني، ويقدر يبعتله تشجيع.', 'Everyone sees each other’s progress and can send encouragement.')}</p></div>
          <ul class="ap-list ap-members"><li><span class="ap-av">${L('أنا', 'Me')}</span><div class="ap-mb"><b>${L('أنت', 'You')}</b><span class="ap-bar"><i style="width:${me}%"></i></span></div><span class="num">${me}%</span></li>
          ${app.s.members.map((m, i) => `<li><span class="ap-av">${esc(T(m.n)[0])}</span><div class="ap-mb"><b>${esc(T(m.n).split(' ')[0])}</b><span class="ap-bar"><i style="width:${m.p}%"></i></span></div><button type="button" class="dm-btn sm ${m.cheered ? '' : 'gold'}" data-act="aCheer" data-i="${i}">${m.cheered ? '✓' : L('شجّعه', 'Cheer')}</button></li>`).join('')}</ul>`;
      }
    },
    acts: {
      aHabit(app, el) {
        const h = app.s.habits.find((x) => x.id === +el.dataset.id); h.done = !h.done;
        if (h.done) { app.s.celebrate = CHEERS[h.id % CHEERS.length]; clearTimeout(app._ct); app._ct = setTimeout(() => { app.s.celebrate = false; if (app.view === 'today' && app.$('.ap-cele')) app.$('.ap-cele').remove(); }, 1600); }
        app.render();
      },
      aAdd(app) { const v = app.$('#aNew').value.trim(); if (!v) return; app.s.habits.push({ id: app.s.habits.length + 1, t: { ar: v, en: v }, e: '📝', done: false }); app.render(); },
      aPreset(app, el) { const f = app.s.focus; clearInterval(app._ft); f.run = false; f.min = +el.dataset.n; f.left = f.min * 60; app.render(); },
      aRun(app) {
        const f = app.s.focus; f.run = !f.run; clearInterval(app._ft);
        if (f.run) app._ft = setInterval(() => {
          if (!app.$('#aTime')) { clearInterval(app._ft); f.run = false; return; }
          f.left = Math.max(0, f.left - 1); if (!f.left) { clearInterval(app._ft); f.run = false; app.render(); app.toast(L('انتهت جلسة التركيز 🎉', 'Focus session complete 🎉')); return; }
          const m = Math.floor(f.left / 60), s = f.left % 60; app.$('#aTime').textContent = `${pad(m)}:${pad(s)}`;
          const r = app.$('.ap-focus .ap-ring'); if (r) r.style.setProperty('--p', Math.round((1 - f.left / (f.min * 60)) * 100));
        }, 1000);
        app.render();
      },
      aReset(app) { const f = app.s.focus; clearInterval(app._ft); f.run = false; f.left = f.min * 60; app.render(); },
      aSound(app, el) { app.s.sound = el.dataset.s; app.render(); app.toast(L('الأصوات بتشتغل في التطبيق نفسه', 'Sounds play in the real app')); },
      aPray(app, el) { const p = app.s.prayers[+el.dataset.i]; p.done = !p.done; app.render(); },
      aSpend(app) {
        const t = app.$('#aMT').value.trim(), a = Math.round(+app.$('#aMA').value);
        if (!t || !(a > 0)) { app.toast(L('اكتب البند والمبلغ', 'Enter the item and amount')); return; }
        app.s.money.push({ t: { ar: t, en: t }, a }); app.render();
      },
      aCheer(app, el) { const m = app.s.members[+el.dataset.i]; if (m.cheered) return; m.cheered = true; app.render(); app.toast(L(`تم إرسال تشجيع لـ ${T(m.n).split(' ')[0]} 💪`, `Encouragement sent to ${T(m.n).split(' ')[0]} 💪`)); }
    }
  };

  /* =========================================================
     Mount + language sync
     ========================================================= */
  const apps = {}; let current = null, currentRoot = null;
  const EXTRA = {};
  function addIcons(map) {
    injectIcons();
    const svg = doc.getElementById('demo-icons');
    Object.keys(map).forEach((k) => { if (doc.getElementById('d-' + k)) return; const sym = doc.createElementNS('http://www.w3.org/2000/svg', 'symbol'); sym.id = 'd-' + k; sym.setAttribute('viewBox', '0 0 24 24'); sym.innerHTML = `<path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="${map[k]}"/>`; svg.appendChild(sym); });
  }
  window.MasarDemo = {
    mount(root, kind) {
      injectIcons();
      const def = { ops: OPS, hr: HR, web: WEB, app: APP }[kind] || EXTRA[kind] || OPS;
      forced = def.forceEn ? 'en' : null; root.dir = def.forceEn ? 'ltr' : '';
      if (!apps[kind]) apps[kind] = new App(def);
      current = apps[kind]; currentRoot = root; current.mount(root);
    },
    isPhone(kind) { const d = ({ app: APP })[kind] || EXTRA[kind]; return !!(d && d.phone); },
    register(kind, factory) { EXTRA[kind] = factory(window.MasarDemo.kit); },
    kit: { L, T, esc, ic, num, money, pad, fmtD, TODAY, addDays, norm, rng, person, kpi, bars, table, emptyRow, hl, addIcons, mobile, disabledMsg }
  };
  doc.addEventListener('langchange', () => { if (current && currentRoot && currentRoot.isConnected) current.render(); });
})();
