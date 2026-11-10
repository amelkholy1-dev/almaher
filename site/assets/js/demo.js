/* =========================================================
   Masar — Interactive demos (Operations & Accounts / HR)
   ⚠️ كل البيانات هنا وهمية بالكامل ومولّدة بالجافاسكريبت.
   مفيش أي اتصال بسيرفر، وأي تعديل بيتمسح لما الصفحة تتقفل.
   ========================================================= */
(function () {
  'use strict';
  const doc = document;
  const lang = () => (doc.documentElement.lang === 'en' ? 'en' : 'ar');
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
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('tr.click, li.click')) { e.preventDefault(); e.target.click(); }
    };
    this.render();
  };
  App.prototype.render = function () {
    const c = this.cfg, cur = c.nav.find((n) => n.id === this.view);
    this.root.innerHTML = `<div class="dm ${c.cls}">
      <aside class="dm-side">
        <div class="dm-logo"><span class="dm-logo-mark">${L('م', 'M')}</span><div><b>${T(c.name)}</b><small>${T(c.sub)}</small></div></div>
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
            <p class="dm-note">${L('في العرض التوضيحي تُستخدم صورة مستند تجريبية فقط (محاكاة). النظام الكامل يقرأ صور المستندات الحقيقية باستخدام Tesseract.js.', 'This demo uses a sample document image only (simulated). The full system reads real document images using Tesseract.js.')}</p>
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
     2) نظام مسار للموارد البشرية
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
      skills: [['رعاية المرضى', 'Patient care'], ['الإسعافات الأولية', 'First aid'], ['BLS', 'BLS'], ['السجلات الطبية', 'Medical records'], ['العناية المركزة', 'ICU']] },
    { id: 'hvac', ar: 'فني تكييف', en: 'HVAC technician', edu: { ar: 'دبلوم صنايع – تبريد وتكييف', en: 'Technical diploma – HVAC' },
      skills: [['تركيب التكييف', 'AC installation'], ['الصيانة الدورية', 'Preventive maintenance'], ['شحن الفريون', 'Refrigerant charging'], ['التكييف المركزي', 'Central AC']] },
    { id: 'sec', ar: 'سكرتير تنفيذي', en: 'Executive secretary', edu: { ar: 'بكالوريوس آداب', en: 'B.A.' },
      skills: [['Word', 'Word'], ['Excel', 'Excel'], ['تنظيم المواعيد', 'Scheduling'], ['المراسلات', 'Correspondence'], ['الأرشفة', 'Archiving']] },
    { id: 'sal', ar: 'مندوب مبيعات', en: 'Sales representative', edu: { ar: 'بكالوريوس تجارة', en: 'B.Com' },
      skills: [['التفاوض', 'Negotiation'], ['خدمة العملاء', 'Customer service'], ['CRM', 'CRM'], ['رخصة قيادة', "Driver's license"], ['إعداد العروض', 'Presentations']] }
  ];
  const CITIES = [['القاهرة', 'Cairo'], ['الجيزة', 'Giza'], ['الإسكندرية', 'Alexandria'], ['المنوفية', 'Menoufia'], ['الشرقية', 'Sharqia'], ['الدقهلية', 'Dakahlia'], ['أسيوط', 'Assiut'], ['سوهاج', 'Sohag']].map((c) => ({ ar: c[0], en: c[1] }));
  const HR_STAGES = [{ ar: 'جديد', en: 'New', c: 'p0' }, { ar: 'فرز مبدئي', en: 'Screening', c: 'p1' }, { ar: 'مقابلة', en: 'Interview', c: 'p2' }, { ar: 'مقبول', en: 'Accepted', c: 'p5' }, { ar: 'مستبعد', en: 'Rejected', c: 'pr' }];
  const hrPill = (i) => `<span class="dm-pill ${HR_STAGES[i].c}">${T(HR_STAGES[i])}</span>`;
  const specById = (id) => SPECS.find((s) => s.id === id);
  const sk = (pair) => ({ ar: pair[0], en: pair[1] });

  function hrState() {
    const r = rng(777);
    const cands = [];
    const stageBag = [0, 0, 0, 0, 1, 1, 1, 2, 2, 3, 4, 4];
    for (let i = 0; i < 64; i++) {
      const sp = r.pick(SPECS), female = (sp.id === 'nur' || sp.id === 'sec') ? r() < 0.6 : r() < 0.08;
      const pool = sp.skills.slice().sort(() => r() - 0.5);
      cands.push({ id: i + 1, name: person(r, female), spec: sp.id, exp: r.int(0, 14), city: r.pick(CITIES),
        skills: pool.slice(0, r.int(2, pool.length)).map(sk), edu: sp.edu, english: r.pick([{ ar: 'جيد', en: 'Good' }, { ar: 'متوسط', en: 'Intermediate' }, { ar: 'جيد جداً', en: 'Very good' }]),
        mobile: mobile(r), stage: r.pick(stageBag), added: addDays(TODAY, -r.int(0, 120)) });
    }
    cands.sort((a, b) => b.added - a.added);
    const reqs = [
      { id: 1, spec: 'acc', count: 2, minExp: 3, skills: [0, 1, 3] },
      { id: 2, spec: 'ele', count: 5, minExp: 2, skills: [0, 1, 3] },
      { id: 3, spec: 'drv', count: 8, minExp: 3, skills: [0, 1] },
      { id: 4, spec: 'nur', count: 4, minExp: 2, skills: [0, 1, 2] },
      { id: 5, spec: 'civ', count: 1, minExp: 5, skills: [0, 1, 2] }
    ].map((q) => ({ ...q, skills: q.skills.map((i) => sk(specById(q.spec).skills[i])), opened: addDays(TODAY, -r.int(2, 40)) }));
    const backups = [{ date: addDays(TODAY, -2), kind: 'SQL', size: '3.8 MB' }, { date: addDays(TODAY, -9), kind: 'ZIP', size: '41.6 MB' }];
    return { cands, reqs, backups, q: '', spec: 'all', exp: '0', stage: 'all', req: 1, cv: null };
  }

  function matchScore(c, q) {
    if (c.spec !== q.spec || c.stage === 4) return null;
    const have = c.skills.map((s) => s.en);
    const hits = q.skills.filter((s) => have.includes(s.en));
    const expPart = Math.min(1, c.exp / q.minExp) * 30;
    const skillPart = (hits.length / q.skills.length) * 50;
    return { score: Math.round(20 + expPart + skillPart), hits: hits.map((h) => h.en) };
  }

  function hrRows(app) {
    const s = app.s, q = norm(s.q), qq = s.q.trim();
    const list = s.cands.filter((c) => {
      if (s.spec !== 'all' && c.spec !== s.spec) return false;
      if (c.exp < +s.exp) return false;
      if (s.stage !== 'all' && c.stage !== +s.stage) return false;
      if (!q) return true;
      const sp = specById(c.spec);
      const hay = norm([c.name.ar, c.name.en, sp.ar, sp.en, c.city.ar, c.city.en, c.mobile, ...c.skills.map((x) => x.ar + ' ' + x.en)].join(' '));
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
        <dt>${L('التخصص', 'Specialty')}</dt><dd>${T(sp)}</dd>
        <dt>${L('سنوات الخبرة', 'Experience')}</dt><dd>${c.exp} ${L('سنة', 'years')}</dd>
        <dt>${L('المؤهل', 'Education')}</dt><dd>${T(c.edu)}</dd>
        <dt>${L('المدينة', 'City')}</dt><dd>${T(c.city)}</dd>
        <dt>${L('اللغة الإنجليزية', 'English')}</dt><dd>${T(c.english)}</dd>
        <dt>${L('الموبايل', 'Mobile')}</dt><dd>${c.mobile}</dd>
        <dt>${L('تاريخ الإضافة', 'Added')}</dt><dd>${fmtD(c.added)}</dd>
      </dl>
      <p><b>${L('المهارات', 'Skills')}</b></p><div class="dm-skills">${c.skills.map((x) => `<span>${T(x)}</span>`).join('')}</div>
      <div class="dm-form" style="margin-top:18px"><label class="full">${L('مرحلة المرشح', 'Candidate stage')}
        <select class="dm-select dm-input" data-ch="candStage" data-id="${c.id}">${HR_STAGES.map((st, i) => `<option value="${i}" ${i === c.stage ? 'selected' : ''}>${T(st)}</option>`).join('')}</select></label></div>`);
  }

  const SAMPLE_CV = { name: { ar: 'سامح عادل منصور', en: 'Sameh Adel Mansour' }, spec: 'acc', exp: 6, city: CITIES[1], edu: SPECS[0].edu, english: { ar: 'جيد جداً', en: 'Very good' },
    skills: [0, 1, 2, 3, 4].map((i) => sk(SPECS[0].skills[i])), mobile: '01000000000' };

  const HR = {
    cls: 'dm-hr',
    name: { ar: 'مسار HR', en: 'Masar HR' }, sub: { ar: 'الموارد البشرية', en: 'Human Resources' },
    state: hrState,
    nav: [
      { id: 'dash', icon: 'dash', label: { ar: 'لوحة المؤشرات', en: 'Dashboard' } },
      { id: 'upload', icon: 'upload', label: { ar: 'رفع السير الذاتية', en: 'Upload CVs' } },
      { id: 'bank', icon: 'users', label: { ar: 'بنك المرشحين', en: 'Candidate bank' } },
      { id: 'reqs', icon: 'brief', label: { ar: 'طلبات التوظيف', en: 'Job requests' } },
      { id: 'pipe', icon: 'kanban', label: { ar: 'مراحل المرشحين', en: 'Candidate stages' } },
      { id: 'data', icon: 'db', label: { ar: 'Excel والنسخ الاحتياطي', en: 'Excel & backup' } }
    ],
    views: {
      dash(app) {
        const s = app.s, cnt = (i) => s.cands.filter((c) => c.stage === i).length;
        const bySpec = SPECS.map((sp) => ({ l: T(sp), v: s.cands.filter((c) => c.spec === sp.id).length })).sort((a, b) => b.v - a.v);
        const avg = (s.cands.reduce((t, c) => t + c.exp, 0) / s.cands.length).toFixed(1);
        return `<div class="dm-kpis">
            ${kpi('users', num(s.cands.length), L('إجمالي المرشحين', 'Total candidates'))}
            ${kpi('brief', num(s.reqs.length), L('طلبات توظيف مفتوحة', 'Open job requests'), 'g')}
            ${kpi('clock', num(cnt(2)), L('في مرحلة المقابلة', 'At interview stage'))}
            ${kpi('check', num(cnt(3)), L('مقبولون', 'Accepted'), 'ok')}
          </div>
          <div class="dm-cols-2">
            <div class="dm-panel"><h3>${L('المرشحون حسب المرحلة', 'Candidates by stage')}</h3>${bars(HR_STAGES.map((st, i) => ({ l: T(st), v: cnt(i) })))}</div>
            <div class="dm-panel"><h3>${L('المرشحون حسب التخصص', 'Candidates by specialty')}<small>${L('متوسط الخبرة', 'Avg. experience')}: ${avg} ${L('سنة', 'yrs')}</small></h3>${bars(bySpec, true)}</div>
          </div>
          <div class="dm-cols" style="margin-top:14px">
            <div class="dm-panel"><h3>${L('أحدث المرشحين', 'Latest candidates')}<button type="button" class="dm-btn sm" data-view="bank">${L('بنك المرشحين', 'Candidate bank')}</button></h3>
              <ul class="dm-list">${s.cands.slice(0, 5).map((c) => `<li class="click" tabindex="0" data-act="openCand" data-id="${c.id}"><span class="dm-avatar" style="background:var(--surface-2);color:var(--blue)">${esc(T(c.name)[0])}</span><div class="grow"><b>${esc(T(c.name))}</b><small>${T(specById(c.spec))} • ${c.exp} ${L('سنة', 'yrs')}</small></div>${hrPill(c.stage)}</li>`).join('')}</ul></div>
            <div class="dm-panel"><h3>${L('طلبات التوظيف', 'Job requests')}</h3>
              <ul class="dm-list">${s.reqs.map((q) => `<li class="click" tabindex="0" data-act="pickReq" data-id="${q.id}"><div class="grow"><b>${T(specById(q.spec))}</b><small>${L('العدد المطلوب', 'Needed')}: ${q.count} • ${L('خبرة', 'Exp.')} ${q.minExp}+</small></div>${ic('next')}</li>`).join('')}</ul></div>
          </div>`;
      },
      upload(app) {
        const cv = app.s.cv;
        return `<div class="dm-cols-2">
          <div class="dm-panel"><h3>${L('رفع سيرة ذاتية', 'Upload a CV')}</h3>
            <div class="dm-drop" id="dmDrop">${ic('upload')}
              <p>${L('اسحب ملف السيرة الذاتية هنا (PDF / Word / صورة)', 'Drag a CV file here (PDF / Word / image)')}</p>
              <button type="button" class="dm-btn pri" data-act="cvRun">${ic('ai')}${L('جرّب بسيرة ذاتية تجريبية', 'Try with a sample CV')}</button>
            </div>
            <ul class="dm-steps-list" id="dmCvSteps">
              <li>${L('رفع الملف', 'Uploading the file')}</li><li>${L('استخراج النص', 'Extracting text')}</li><li>${L('التحليل بالذكاء الاصطناعي', 'Analyzing with AI')}</li><li>${L('إنشاء سجل منظم', 'Creating a structured record')}</li>
            </ul>
            <p class="dm-note">${L('في العرض التوضيحي يتم تحليل سيرة ذاتية تجريبية فقط (محاكاة)، ولا يتم رفع أي ملف. النظام الكامل يحلّل السير الذاتية باستخدام Gemini API.', 'In this demo only a sample CV is analyzed (simulated) and no file is uploaded. The full system analyzes CVs using the Gemini API.')}</p>
          </div>
          <div class="dm-panel" id="dmCvOut">${cv ? HR.cvRecord(cv) : `<h3>${L('السجل المنظم', 'Structured record')}</h3><p class="muted">${L('ستظهر هنا بيانات المرشح بعد التحليل.', 'The candidate’s data will appear here after analysis.')}</p>`}</div>
        </div>`;
      },
      bank(app) {
        const s = app.s;
        return `<div class="dm-toolbar">
            <label class="dm-search">${ic('search')}<input class="dm-input" type="search" data-in="hrSearch" value="${esc(s.q)}" placeholder="${L('بحث ذكي: اسم، تخصص، مهارة، مدينة… (مثال: محاسب Excel الجيزة)', 'Smart search: name, specialty, skill, city… (e.g. accountant Excel Giza)')}" aria-label="${L('بحث', 'Search')}"></label>
            <select class="dm-select" data-ch="hrSpec" aria-label="${L('التخصص', 'Specialty')}"><option value="all">${L('كل التخصصات', 'All specialties')}</option>${SPECS.map((sp) => `<option value="${sp.id}" ${s.spec === sp.id ? 'selected' : ''}>${T(sp)}</option>`).join('')}</select>
            <select class="dm-select" data-ch="hrExp" aria-label="${L('الخبرة', 'Experience')}">${[0, 2, 5, 10].map((n) => `<option value="${n}" ${s.exp === String(n) ? 'selected' : ''}>${n ? L(`خبرة ${n}+ سنوات`, `${n}+ years`) : L('أي خبرة', 'Any experience')}</option>`).join('')}</select>
            <select class="dm-select" data-ch="hrStage" aria-label="${L('المرحلة', 'Stage')}"><option value="all">${L('كل المراحل', 'All stages')}</option>${HR_STAGES.map((st, i) => `<option value="${i}" ${s.stage === String(i) ? 'selected' : ''}>${T(st)}</option>`).join('')}</select>
            <span class="muted" id="dmCount"></span>
          </div>
          ${table([L('الاسم', 'Name'), L('التخصص', 'Specialty'), L('الخبرة', 'Experience'), L('المدينة', 'City'), L('أهم المهارات', 'Top skills'), L('المرحلة', 'Stage')], '', { bodyId: 'dmBankBody' })}`;
      },
      reqs(app) {
        const s = app.s, q = s.reqs.find((x) => x.id === s.req) || s.reqs[0];
        const ranked = s.cands.map((c) => ({ c, m: matchScore(c, q) })).filter((x) => x.m).sort((a, b) => b.m.score - a.m.score || b.c.exp - a.c.exp).slice(0, 8);
        return `<div class="dm-cols" style="grid-template-columns:1fr 1.5fr">
          <div class="dm-panel"><h3>${L('طلبات التوظيف', 'Job requests')}<small>${s.reqs.length} ${L('مفتوحة', 'open')}</small></h3>
            <ul class="dm-list">${s.reqs.map((x) => `<li class="click" tabindex="0" data-act="pickReq" data-id="${x.id}" style="${x.id === q.id ? 'border-color:var(--blue);box-shadow:0 0 0 2px rgba(42,107,179,.15)' : ''}"><div class="grow"><b>${T(specById(x.spec))}</b><small>${L('العدد', 'Needed')}: ${x.count} • ${L('خبرة', 'Exp.')} ${x.minExp}+ • ${fmtD(x.opened)}</small></div></li>`).join('')}</ul>
          </div>
          <div class="dm-panel"><h3>${L('أفضل المرشحين المطابقين', 'Best matching candidates')}: ${T(specById(q.spec))}</h3>
            <p class="dm-note" style="margin:0 0 6px">${L('المتطلبات', 'Requirements')}: ${L('خبرة', 'experience')} ${q.minExp}+ ${L('سنوات', 'years')}</p>
            <div class="dm-skills" style="margin-bottom:12px">${q.skills.map((x) => `<span>${T(x)}</span>`).join('')}</div>
            <ul class="dm-list">${ranked.map((x, i) => { const v = x.m.score; const col = v >= 80 ? '#16a34a' : v >= 60 ? '#F5A524' : '#94a3b8'; return `<li class="click" tabindex="0" data-act="openCand" data-id="${x.c.id}"><span class="dm-rank">${i + 1}</span><span class="dm-score" style="--v:${v};--c:${col}"><span>${v}%</span></span><div class="grow"><b>${esc(T(x.c.name))}</b><small>${x.c.exp} ${L('سنة خبرة', 'yrs exp.')} • ${T(x.c.city)}</small><div class="dm-skills" style="margin-top:4px">${q.skills.map((r) => `<span class="${x.m.hits.includes(r.en) ? 'hit' : ''}">${T(r)}</span>`).join('')}</div></div>${hrPill(x.c.stage)}</li>`; }).join('') || `<li>${L('لا يوجد مرشحون مطابقون', 'No matching candidates')}</li>`}</ul>
            <p class="dm-note">${L('الترتيب حسب نسبة المطابقة مع التخصص وسنوات الخبرة والمهارات المطلوبة.', 'Ranked by match with the specialty, years of experience and required skills.')}</p>
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
      data(app) {
        const s = app.s;
        return `<div class="dm-cols-2">
          <div class="dm-panel"><h3>${L('استيراد وتصدير Excel', 'Excel import & export')}</h3>
            <p class="muted">${L('استيراد بيانات المرشحين من ملف Excel، أو تصدير بنك المرشحين بالكامل.', 'Import candidate data from an Excel file, or export the entire candidate bank.')}</p>
            <div class="dm-actions"><button type="button" class="dm-btn" data-act="hrExport" data-what="import">${ic('upload')}${L('استيراد من Excel', 'Import from Excel')}</button><button type="button" class="dm-btn" data-act="hrExport" data-what="export">${ic('excel')}${L('تصدير إلى Excel', 'Export to Excel')}</button></div>
          </div>
          <div class="dm-panel"><h3>${L('النسخ الاحتياطي', 'Backup')}</h3>
            <div class="dm-actions" style="margin-bottom:12px"><button type="button" class="dm-btn pri" data-act="hrBackup" data-kind="SQL">${ic('db')}${L('نسخة SQL', 'SQL backup')}</button><button type="button" class="dm-btn" data-act="hrBackup" data-kind="ZIP">${ic('save')}${L('نسخة ZIP (مع الملفات)', 'ZIP backup (with files)')}</button></div>
            ${table([L('التاريخ', 'Date'), L('النوع', 'Type'), L('الحجم', 'Size')], s.backups.map((b) => `<tr><td class="num">${fmtD(b.date)}</td><td><span class="dm-pill ${b.kind === 'SQL' ? 'p0' : 'p2'}">${b.kind}</span></td><td class="num">${b.size}</td></tr>`).join(''))}
          </div></div>`;
      }
    },
    cvRecord(cv) {
      return `<h3>${L('السجل المنظم', 'Structured record')}<span class="dm-pill p5">${L('تم التحليل', 'Analyzed')}</span></h3>
        <dl class="dm-dl">
          <dt>${L('الاسم', 'Name')}</dt><dd>${T(cv.name)}</dd><dt>${L('التخصص', 'Specialty')}</dt><dd>${T(specById(cv.spec))}</dd>
          <dt>${L('سنوات الخبرة', 'Experience')}</dt><dd>${cv.exp} ${L('سنوات', 'years')}</dd><dt>${L('المؤهل', 'Education')}</dt><dd>${T(cv.edu)}</dd>
          <dt>${L('المدينة', 'City')}</dt><dd>${T(cv.city)}</dd><dt>${L('اللغة الإنجليزية', 'English')}</dt><dd>${T(cv.english)}</dd>
        </dl>
        <p><b>${L('المهارات المستخرجة', 'Extracted skills')}</b></p><div class="dm-skills">${cv.skills.map((x) => `<span class="hit">${T(x)}</span>`).join('')}</div>
        <div class="dm-actions" style="margin-top:16px">${cv.saved ? `<button type="button" class="dm-btn" data-view="bank">${ic('users')}${L('عرض في بنك المرشحين', 'View in candidate bank')}</button>` : `<button type="button" class="dm-btn ok" data-act="cvSave">${ic('save')}${L('حفظ في بنك المرشحين', 'Save to candidate bank')}</button>`}</div>`;
    },
    after: {
      bank(app) { app.$('#dmBankBody').innerHTML = hrRows(app); },
      upload(app) {
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
      pickReq(app, el) { app.s.req = +el.dataset.id; if (app.view !== 'reqs') app.go('reqs'); else app.render(); },
      mv(app, el) {
        const c = app.s.cands.find((x) => x.id === +el.dataset.id); const n = c.stage + +el.dataset.d;
        if (n < 0 || n >= HR_STAGES.length) return; c.stage = n; app.render();
        app.toast(L(`${T(c.name)} ← ${T(HR_STAGES[n])}`, `${T(c.name)} → ${T(HR_STAGES[n])}`));
      },
      cvRun(app) {
        if (app._cvBusy) return; app._cvBusy = true;
        const items = app.root.querySelectorAll('#dmCvSteps li'); items.forEach((li) => (li.className = ''));
        app.s.cv = null; const out = app.$('#dmCvOut');
        out.innerHTML = `<h3>${L('السجل المنظم', 'Structured record')}</h3><p class="muted">${L('جارٍ التحليل…', 'Analyzing…')}</p>`;
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
        app.s.cands.unshift({ id, name: cv.name, spec: cv.spec, exp: cv.exp, city: cv.city, skills: cv.skills, edu: cv.edu, english: cv.english, mobile: cv.mobile, stage: 0, added: TODAY });
        cv.saved = true; app.$('#dmCvOut').innerHTML = HR.cvRecord(cv);
        app.toast(L('تمت إضافة المرشح إلى بنك المرشحين', 'Candidate added to the candidate bank'));
      },
      hrExport(app, el) { app.toast(disabledMsg(el.dataset.what === 'import' ? L('الاستيراد من Excel', 'Excel import') : L('التصدير إلى Excel', 'Excel export'))); },
      hrBackup(app, el) {
        const k = el.dataset.kind; app.s.backups.unshift({ date: TODAY, kind: k, size: k === 'SQL' ? '3.9 MB' : '41.8 MB' });
        app.render(); app.toast(L(`تم إنشاء نسخة ${k} (محاكاة)`, `${k} backup created (simulated)`));
      }
    }
  };

  /* =========================================================
     Mount + language sync
     ========================================================= */
  const apps = {}; let current = null, currentRoot = null;
  window.MasarDemo = {
    mount(root, kind) {
      injectIcons();
      if (!apps[kind]) apps[kind] = new App(kind === 'hr' ? HR : OPS);
      current = apps[kind]; currentRoot = root; current.mount(root);
    }
  };
  doc.addEventListener('langchange', () => { if (current && currentRoot && currentRoot.isConnected) current.render(); });
})();
