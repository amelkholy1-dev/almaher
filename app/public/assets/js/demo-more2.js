/* =========================================================
   نماذج توضيحية (2/2): العيادات • المدارس والحضور • تطبيق المطاعم • المتجر الإلكتروني
   ⚠️ كل البيانات وهمية ومولّدة بالجافاسكريبت. مفيش اتصال بأي سيرفر.
   ========================================================= */
(function () {
  'use strict';
  const D = window.MasarDemo; if (!D || !D.kit) return;
  const { L, T, esc, ic, num, money, pad, fmtD, TODAY, addDays, rng, kpi, bars, table, emptyRow, hl, norm, person, mobile } = D.kit;
  const B = (ar, en) => ({ ar, en });
  const pill = (c, t) => `<span class="dm-pill ${c}">${t}</span>`;
  const btn = (act, label, extra, cls) => `<button type="button" class="dm-btn ${cls || ''}" data-act="${act}" ${extra || ''}>${label}</button>`;
  const field = (label, html) => `<label class="x-field"><span>${label}</span>${html}</label>`;
  const dis = (app, what) => app.toast(D.kit.disabledMsg(what));

  /* =========================================================
     5) العيادات والمواعيد
     ========================================================= */
  D.register('clinic', () => {
    const docs = [{ id: 1, n: B('د. هالة المنصوري', 'Dr. Hala El-Mansouri'), sp: B('باطنة', 'Internal medicine'), fee: 300 }, { id: 2, n: B('د. كريم فتحي', 'Dr. Karim Fathy'), sp: B('أطفال', 'Pediatrics'), fee: 250 }, { id: 3, n: B('د. نادية رشاد', 'Dr. Nadia Rashad'), sp: B('جلدية', 'Dermatology'), fee: 350 }];
    const slots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30'];
    const patients = () => { const r = rng(12); return Array.from({ length: 14 }, (_, i) => { const p = person(r, i % 2 === 1); return { id: i + 1, n: p, ph: mobile(r), age: 6 + ((i * 7) % 60), visits: [{ d: addDays(TODAY, -(20 + i * 9)), dx: B('فحص دوري', 'Routine check'), rx: B('متابعة بعد شهر', 'Follow-up in a month') }, { d: addDays(TODAY, -(70 + i * 5)), dx: B('نزلة برد', 'Common cold'), rx: B('راحة وسوائل ومضاد حيوي', 'Rest, fluids, antibiotic') }] }; }); };
    const appts = () => [[1, '09:00', 1, 'done'], [1, '09:30', 4, 'done'], [1, '10:00', 7, 'in'], [1, '11:00', 9, 'bk'], [1, '12:30', 3, 'bk'], [2, '09:00', 2, 'done'], [2, '10:30', 5, 'in'], [2, '11:30', 8, 'bk'], [2, '13:00', 11, 'bk'], [3, '09:30', 6, 'done'], [3, '10:00', 10, 'bk'], [3, '12:00', 12, 'bk']].map((a, i) => ({ id: i + 1, doc: a[0], t: a[1], pat: a[2], st: a[3] }));
    const stp = (s) => ({ bk: pill('p0', L('محجوز', 'Booked')), in: pill('p2', L('في الانتظار', 'Waiting')), done: pill('p5', L('تمت الزيارة', 'Done')), x: pill('pr', L('ملغي', 'Cancelled')) }[s]);
    const pn = (app, id) => T(app.s.pt.find((p) => p.id === id).n);
    const slotsHtml = (app) => {
      const d = app.s.doc;
      return `<div class="x-slots">${slots.map((t) => { const a = app.s.ap.find((x) => x.doc === d && x.t === t && x.st !== 'x'); return a ? `<div class="x-slot taken"><b class="num">${t}</b><span>${esc(pn(app, a.pat))}</span>${stp(a.st)}<span class="x-acts">${a.st === 'bk' ? btn('cIn', L('وصل', 'Check in'), `data-id="${a.id}"`, 'sm') : ''}${a.st === 'in' ? btn('cDone', L('تمت', 'Done'), `data-id="${a.id}"`, 'ok sm') : ''}${a.st === 'bk' ? btn('cCancel', ic('x'), `data-id="${a.id}" aria-label="${L('إلغاء', 'Cancel')}"`, 'sm') : ''}</span></div>` : `<button type="button" class="x-slot free" data-act="cBook" data-t="${t}"><b class="num">${t}</b><span>${L('متاح — اضغط للحجز', 'Free — click to book')}</span></button>`; }).join('')}</div>`;
    };
    return {
      name: B('العيادات والمواعيد', 'Clinic & Appointments'), sub: B('نموذج توضيحي', 'Concept demo'), cls: 'x-clinic', mark: B('ع', 'C'),
      nav: [{ id: 'dash', icon: 'dash', label: B('اليوم', 'Today') }, { id: 'sched', icon: 'calendar', label: B('جدول المواعيد', 'Schedule') }, { id: 'pts', icon: 'users', label: B('المرضى', 'Patients') }, { id: 'bill', icon: 'cash', label: B('الإيرادات', 'Revenue') }],
      state: () => ({ pt: patients(), ap: appts(), doc: 1, q: '', next: 20 }),
      views: {
        dash(app) {
          const a = app.s.ap.filter((x) => x.st !== 'x'), rev = a.filter((x) => x.st === 'done').reduce((s, x) => s + docs.find((d) => d.id === x.doc).fee, 0);
          const wait = a.filter((x) => x.st === 'in');
          return `<div class="dm-kpis">${kpi('calendar', a.length, L('مواعيد اليوم', 'Appointments today'))}${kpi('clock', wait.length, L('في الانتظار', 'Waiting'), 'g')}${kpi('check', a.filter((x) => x.st === 'done').length, L('تمت زيارتهم', 'Seen'))}${kpi('cash', money(rev), L('إيراد اليوم', 'Revenue today'))}</div>
            <div class="dm-panel"><h3>${L('الانتظار الآن', 'Waiting room')}</h3><ul class="x-alerts">${wait.map((x) => `<li><span>${esc(pn(app, x.pat))}<small>${T(docs.find((d) => d.id === x.doc).n)} · ${x.t}</small></span>${btn('cDone', L('إنهاء الزيارة', 'Finish visit'), `data-id="${x.id}"`, 'ok sm')}</li>`).join('') || `<p class="dm-empty">—</p>`}</ul></div>`;
        },
        sched(app) {
          return `<div class="dm-tabs" role="tablist">${docs.map((d) => `<button type="button" role="tab" class="${app.s.doc === d.id ? 'on' : ''}" data-act="cDoc" data-id="${d.id}">${esc(T(d.n))} <small>${T(d.sp)}</small></button>`).join('')}</div>${slotsHtml(app)}`;
        },
        pts(app) {
          const q = norm(app.s.q), list = app.s.pt.filter((p) => !q || norm(T(p.n)).includes(q) || p.ph.includes(q));
          return `<div class="dm-toolbar"><div class="dm-search">${ic('search')}<input class="dm-input" data-in="cSearch" value="${esc(app.s.q)}" placeholder="${L('ابحث بالاسم أو الموبايل…', 'Search by name or phone…')}"></div></div>
            <div id="cBody">${table([L('المريض', 'Patient'), L('السن', 'Age'), L('الموبايل', 'Phone'), L('آخر زيارة', 'Last visit')], list.map((p) => `<tr class="click" tabindex="0" data-act="cPat" data-id="${p.id}"><td>${hl(T(p.n), q)}</td><td class="num">${p.age}</td><td class="num" dir="ltr">${p.ph}</td><td>${fmtD(p.visits[0].d)}</td></tr>`).join('') || emptyRow(4))}</div>`;
        },
        bill(app) {
          const done = app.s.ap.filter((x) => x.st === 'done'), by = docs.map((d) => ({ l: T(d.n), v: done.filter((x) => x.doc === d.id).length * d.fee }));
          return `<div class="dm-cols-2"><div class="dm-panel"><h3>${L('الإيراد حسب الطبيب', 'Revenue by doctor')}</h3>${bars(by, true)}</div><div class="dm-panel"><h3>${L('آخر المدفوعات', 'Recent payments')}</h3>${table([L('المريض', 'Patient'), L('الطبيب', 'Doctor'), L('المبلغ', 'Amount')], done.map((x) => `<tr><td>${esc(pn(app, x.pat))}</td><td>${esc(T(docs.find((d) => d.id === x.doc).n))}</td><td class="num">${num(docs.find((d) => d.id === x.doc).fee)}</td></tr>`).join('') || emptyRow(3))}</div></div>`;
        }
      },
      acts: {
        cDoc(app, el) { app.s.doc = +el.dataset.id; app.render(); },
        cBook(app, el) {
          app.drawer(`${ic('calendar')} ${L('حجز موعد', 'Book appointment')} — ${el.dataset.t}`, `<p>${esc(T(docs.find((d) => d.id === app.s.doc).n))}</p>${field(L('المريض', 'Patient'), `<select class="dm-select" id="cPt" style="width:100%">${app.s.pt.map((p) => `<option value="${p.id}">${esc(T(p.n))}</option>`).join('')}</select>`)}<div class="dm-actions">${btn('cSave', ic('check') + ' ' + L('تأكيد الحجز', 'Confirm booking'), `data-t="${el.dataset.t}"`, 'pri')}</div>`);
        },
        cSave(app, el) { app.s.ap.push({ id: app.s.next++, doc: app.s.doc, t: el.dataset.t, pat: +app.$('#cPt').value, st: 'bk' }); app.closeDrawer(); app.render(); app.toast(L('تم الحجز', 'Booked')); },
        cIn(app, el) { app.s.ap.find((x) => x.id === +el.dataset.id).st = 'in'; app.render(); },
        cDone(app, el) { app.s.ap.find((x) => x.id === +el.dataset.id).st = 'done'; app.render(); app.toast(L('تم تسجيل الزيارة والتحصيل', 'Visit and payment recorded')); },
        cCancel(app, el) { app.s.ap.find((x) => x.id === +el.dataset.id).st = 'x'; app.render(); },
        cSearch(app, el) { app.s.q = el.value; const q = norm(app.s.q), list = app.s.pt.filter((p) => !q || norm(T(p.n)).includes(q) || p.ph.includes(q)); app.$('#cBody').innerHTML = table([L('المريض', 'Patient'), L('السن', 'Age'), L('الموبايل', 'Phone'), L('آخر زيارة', 'Last visit')], list.map((p) => `<tr class="click" tabindex="0" data-act="cPat" data-id="${p.id}"><td>${hl(T(p.n), q)}</td><td class="num">${p.age}</td><td class="num" dir="ltr">${p.ph}</td><td>${fmtD(p.visits[0].d)}</td></tr>`).join('') || emptyRow(4)); },
        cPat(app, el) {
          const p = app.s.pt.find((x) => x.id === +el.dataset.id);
          app.drawer(`${ic('user')} ${esc(T(p.n))}`, `<p><span class="num" dir="ltr">${p.ph}</span> · ${p.age} ${L('سنة', 'y')}</p><h4>${L('سجل الزيارات', 'Visit history')}</h4><ul class="x-timeline">${p.visits.map((v) => `<li><b>${fmtD(v.d)}</b><span>${esc(T(v.dx))}</span><small>${esc(T(v.rx))}</small></li>`).join('')}</ul>`);
        },
        closeDrawer(app) { app.closeDrawer(); }
      }
    };
  });

  /* =========================================================
     6) المدارس والحضور والدرجات
     ========================================================= */
  D.register('school', () => {
    const classes = [{ id: 'a', n: B('الصف الثالث - أ', 'Grade 3 – A') }, { id: 'b', n: B('الصف الثالث - ب', 'Grade 3 – B') }, { id: 'c', n: B('الصف الرابع - أ', 'Grade 4 – A') }];
    const subjects = [{ id: 'ar', n: B('اللغة العربية', 'Arabic') }, { id: 'ma', n: B('الرياضيات', 'Math') }, { id: 'sc', n: B('العلوم', 'Science') }, { id: 'en', n: B('اللغة الإنجليزية', 'English') }];
    const students = () => { const r = rng(44), out = []; classes.forEach((c, ci) => { for (let i = 0; i < 8; i++) { const p = person(r, r() > 0.5); out.push({ id: ci * 10 + i + 1, c: c.id, n: p, abs: r.int(0, 6), att: null, g: { ar: r.int(60, 100), ma: r.int(55, 100), sc: r.int(60, 100), en: r.int(50, 100) } }); } }); return out; };
    const avg = (s) => Math.round((s.g.ar + s.g.ma + s.g.sc + s.g.en) / 4);
    const attHtml = (app) => {
      const list = app.s.st.filter((x) => x.c === app.s.cls);
      return `<ul class="x-roll">${list.map((s) => `<li><span class="dm-avatar x-av">${esc(T(s.n)[0])}</span><b>${esc(T(s.n))}</b><span class="x-tog">${[['p', L('حاضر', 'Present'), 'ok'], ['l', L('متأخر', 'Late'), 'gold'], ['a', L('غائب', 'Absent'), 'bad']].map((o) => `<button type="button" class="${s.att === o[0] ? 'on ' + o[2] : ''}" data-act="sMark" data-id="${s.id}" data-v="${o[0]}">${o[1]}</button>`).join('')}</span></li>`).join('')}</ul>`;
    };
    return {
      name: B('المدارس والحضور', 'School & Attendance'), sub: B('نموذج توضيحي', 'Concept demo'), cls: 'x-school', mark: B('م', 'S'),
      nav: [{ id: 'dash', icon: 'dash', label: B('اللوحة', 'Dashboard') }, { id: 'att', icon: 'check', label: B('تحضير الفصل', 'Roll call') }, { id: 'stu', icon: 'users', label: B('الطلاب', 'Students') }, { id: 'grades', icon: 'book', label: B('الدرجات', 'Grades') }, { id: 'notice', icon: 'bell', label: B('إشعارات أولياء الأمور', 'Parent notices') }],
      state: () => ({ st: students(), cls: 'a', sub: 'ma', q: '', sent: {} }),
      views: {
        dash(app) {
          const s = app.s.st, marked = s.filter((x) => x.att), pres = marked.filter((x) => x.att !== 'a').length, absn = s.filter((x) => x.att === 'a').length;
          const rate = marked.length ? Math.round((pres / marked.length) * 100) : 94;
          const byC = classes.map((c) => { const m = s.filter((x) => x.c === c.id && x.att); return { l: T(c.n), v: m.length ? Math.round((m.filter((x) => x.att !== 'a').length / m.length) * 100) : 90 + (c.id.charCodeAt(0) % 5) }; });
          return `<div class="dm-kpis">${kpi('users', s.length, L('إجمالي الطلاب', 'Students'))}${kpi('check', rate + '%', L('نسبة الحضور اليوم', 'Attendance today'), 'g')}${kpi('x', absn, L('غائبون اليوم', 'Absent today'), absn ? 'r' : '')}${kpi('chart', Math.round(s.reduce((a, x) => a + avg(x), 0) / s.length), L('متوسط الدرجات', 'Average grade'))}</div>
            <div class="dm-panel"><h3>${L('الحضور حسب الفصل %', 'Attendance by class %')}</h3>${bars(byC, true)}</div>`;
        },
        att(app) {
          return `<div class="dm-tabs" role="tablist">${classes.map((c) => `<button type="button" role="tab" class="${app.s.cls === c.id ? 'on' : ''}" data-act="sCls" data-id="${c.id}">${T(c.n)}</button>`).join('')}</div><div id="sRoll">${attHtml(app)}</div>
            <div class="dm-actions">${btn('sAllP', L('تحضير الكل حاضر', 'Mark all present'))}${btn('sSave', ic('save') + ' ' + L('حفظ التحضير', 'Save roll call'), '', 'pri')}</div>`;
        },
        stu(app) {
          const q = norm(app.s.q), list = app.s.st.filter((s) => !q || norm(T(s.n)).includes(q));
          return `<div class="dm-toolbar"><div class="dm-search">${ic('search')}<input class="dm-input" data-in="sSearch" value="${esc(app.s.q)}" placeholder="${L('ابحث عن طالب…', 'Search a student…')}"></div></div><div id="sBody">${stuTable(list, q)}</div>`;
        },
        grades(app) {
          const sub = app.s.sub, list = app.s.st.filter((x) => x.c === app.s.cls).slice().sort((a, b) => b.g[sub] - a.g[sub]);
          return `<div class="dm-toolbar"><select class="dm-select" data-ch="sCls2">${classes.map((c) => `<option value="${c.id}" ${app.s.cls === c.id ? 'selected' : ''}>${T(c.n)}</option>`).join('')}</select><select class="dm-select" data-ch="sSub">${subjects.map((x) => `<option value="${x.id}" ${sub === x.id ? 'selected' : ''}>${T(x.n)}</option>`).join('')}</select><span class="dm-caption">${L('عدّل الدرجة وسيتغير الترتيب فوراً', 'Edit a mark and the ranking updates instantly')}</span></div>
            ${table(['#', L('الطالب', 'Student'), L('الدرجة (من 100)', 'Mark (/100)'), L('المتوسط العام', 'Overall avg')], list.map((s, i) => `<tr><td class="num">${i + 1}</td><td>${esc(T(s.n))}</td><td><input class="dm-input" type="number" min="0" max="100" value="${s.g[sub]}" style="width:90px" data-in="sMark2" data-id="${s.id}"></td><td class="num">${avg(s)}</td></tr>`).join(''), { bodyId: 'sGrades' })}`;
        },
        notice(app) {
          const ab = app.s.st.filter((x) => x.att === 'a' || x.abs >= 5);
          return `<p class="dm-caption" style="margin:0 0 12px">${L('الطلاب الغائبون اليوم أو أكثر من 4 أيام غياب', 'Students absent today or with more than 4 absences')}</p>${table([L('الطالب', 'Student'), L('الفصل', 'Class'), L('أيام الغياب', 'Absences'), ''], ab.map((s) => `<tr><td>${esc(T(s.n))}</td><td>${T(classes.find((c) => c.id === s.c).n)}</td><td class="num">${s.abs + (s.att === 'a' ? 1 : 0)}</td><td>${app.s.sent[s.id] ? pill('p5', L('تم الإرسال', 'Sent')) : btn('sNotify', ic('bell') + ' ' + L('إشعار ولي الأمر', 'Notify parent'), `data-id="${s.id}"`, 'sm')}</td></tr>`).join('') || emptyRow(4))}`;
        }
      },
      acts: {
        sCls(app, el) { app.s.cls = el.dataset.id; app.render(); },
        sMark(app, el) { app.s.st.find((x) => x.id === +el.dataset.id).att = el.dataset.v; app.$('#sRoll').innerHTML = attHtml(app); },
        sAllP(app) { app.s.st.filter((x) => x.c === app.s.cls).forEach((x) => (x.att = 'p')); app.$('#sRoll').innerHTML = attHtml(app); },
        sSave(app) { app.s.st.filter((x) => x.c === app.s.cls && x.att === 'a').forEach((x) => { if (!x._c) { x.abs++; x._c = 1; } }); app.toast(L('تم حفظ التحضير وتحديث اللوحة', 'Roll call saved and dashboard updated')); },
        sSearch(app, el) { app.s.q = el.value; const q = norm(app.s.q); app.$('#sBody').innerHTML = stuTable(app.s.st.filter((s) => !q || norm(T(s.n)).includes(q)), q); },
        sStu(app, el) {
          const s = app.s.st.find((x) => x.id === +el.dataset.id);
          app.drawer(`${ic('user')} ${esc(T(s.n))}`, `<p>${T(classes.find((c) => c.id === s.c).n)} · ${L('الغياب', 'Absences')}: <b>${s.abs}</b></p>${bars(subjects.map((x) => ({ l: T(x.n), v: s.g[x.id] })), true)}<p style="margin-top:12px">${L('المتوسط العام', 'Overall average')}: <b>${avg(s)}</b></p><div class="dm-actions">${btn('sNotify', ic('bell') + ' ' + L('رسالة لولي الأمر', 'Message parent'), `data-id="${s.id}"`, 'pri')}</div>`);
        },
        sCls2(app, el) { app.s.cls = el.value; app.render(); },
        sSub(app, el) { app.s.sub = el.value; app.render(); },
        sMark2(app, el) { const s = app.s.st.find((x) => x.id === +el.dataset.id); s.g[app.s.sub] = Math.max(0, Math.min(100, +el.value || 0)); },
        sNotify(app, el) { app.s.sent[+el.dataset.id] = true; app.closeDrawer(); app.render(); app.toast(L('تم إرسال الإشعار (محاكاة)', 'Notification sent (simulated)')); },
        closeDrawer(app) { app.closeDrawer(); }
      }
    };
    function stuTable(list, q) {
      return table([L('الطالب', 'Student'), L('الفصل', 'Class'), L('الغياب', 'Absences'), L('المتوسط', 'Average')], list.map((s) => `<tr class="click" tabindex="0" data-act="sStu" data-id="${s.id}"><td>${hl(T(s.n), q)}</td><td>${T(classes.find((c) => c.id === s.c).n)}</td><td class="num ${s.abs >= 5 ? 'dm-neg' : ''}">${s.abs}</td><td class="num">${avg(s)}</td></tr>`).join('') || emptyRow(4));
    }
  });

  /* =========================================================
     7) تطبيق طلبات المطاعم (شاشة موبايل)
     ========================================================= */
  D.register('resto', () => {
    const cats = [{ id: 'burger', n: B('برجر', 'Burgers'), e: '🍔' }, { id: 'pizza', n: B('بيتزا', 'Pizza'), e: '🍕' }, { id: 'grill', n: B('مشويات', 'Grills'), e: '🍢' }, { id: 'salad', n: B('سلطات', 'Salads'), e: '🥗' }, { id: 'drink', n: B('مشروبات', 'Drinks'), e: '🥤' }];
    const dish = (id, c, ar, en, price, e, da, de) => ({ id, c, n: B(ar, en), price, e, d: B(da, de) });
    const menu = [dish(1, 'burger', 'برجر كلاسيك', 'Classic burger', 95, '🍔', 'لحم بقري، جبنة شيدر، خس وطماطم', 'Beef, cheddar, lettuce & tomato'), dish(2, 'burger', 'برجر دجاج مقرمش', 'Crispy chicken burger', 85, '🍗', 'صدر دجاج مقرمش وصوص خاص', 'Crispy chicken breast with house sauce'), dish(3, 'burger', 'برجر مزدوج', 'Double burger', 130, '🍔', 'قطعتا لحم وجبنة مضاعفة', 'Two patties and double cheese'),
      dish(4, 'pizza', 'بيتزا مارجريتا', 'Margherita pizza', 110, '🍕', 'صلصة طماطم وموتزاريلا وريحان', 'Tomato sauce, mozzarella & basil'), dish(5, 'pizza', 'بيتزا بيبروني', 'Pepperoni pizza', 140, '🍕', 'بيبروني وموتزاريلا', 'Pepperoni & mozzarella'), dish(6, 'pizza', 'بيتزا خضار', 'Veggie pizza', 120, '🫑', 'فلفل ومشروم وزيتون', 'Peppers, mushrooms & olives'),
      dish(7, 'grill', 'مشاوي مشكلة', 'Mixed grill', 210, '🍢', 'كفتة وكباب وشيش طاووق مع أرز', 'Kofta, kebab & shish tawook with rice'), dish(8, 'grill', 'شيش طاووق', 'Shish tawook', 120, '🍗', 'أسياخ دجاج متبّلة مع ثومية', 'Marinated chicken skewers with garlic sauce'), dish(9, 'salad', 'سلطة سيزر', 'Caesar salad', 75, '🥗', 'خس وجبنة بارميزان ودجاج مشوي', 'Lettuce, parmesan & grilled chicken'), dish(10, 'salad', 'سلطة يونانية', 'Greek salad', 70, '🥒', 'خيار وطماطم وجبنة فيتا', 'Cucumber, tomato & feta'),
      dish(11, 'drink', 'ليمون بالنعناع', 'Lemon mint', 35, '🍋', 'منعش وطازج', 'Fresh and cool'), dish(12, 'drink', 'مشروب غازي', 'Soft drink', 20, '🥤', 'علبة 330 مل', '330 ml can')];
    const STAGES = [B('تم استلام الطلب', 'Order received'), B('جاري التحضير', 'Preparing'), B('في الطريق إليك', 'On the way'), B('تم التسليم', 'Delivered')];
    const FEE = 25;
    const totals = (s) => { const sub = Object.keys(s.cart).reduce((a, id) => a + menu.find((m) => m.id === +id).price * s.cart[id], 0); const disc = s.promo ? Math.round(sub * 0.1) : 0; return { sub, disc, total: sub ? sub - disc + FEE : 0, qty: Object.values(s.cart).reduce((a, b) => a + b, 0) }; };
    const tracker = (o) => `<ol class="x-track">${STAGES.map((st, i) => `<li class="${i <= o.stage ? 'on' : ''} ${i === o.stage ? 'cur' : ''}"><span>${i < o.stage || o.stage === 3 ? '✓' : i + 1}</span>${T(st)}</li>`).join('')}</ol>`;
    return {
      phone: true, name: B('طلبات الشرق', 'El-Sharq Eats'), logo: B('ط', 'E'), cls: 'x-resto',
      nav: [{ id: 'menu', icon: 'store', label: B('القائمة', 'Menu') }, { id: 'cart', icon: 'cart', label: B('السلة', 'Cart') }, { id: 'orders', icon: 'receipt', label: B('طلباتي', 'Orders') }, { id: 'me', icon: 'user', label: B('حسابي', 'Account') }],
      state: () => ({ cat: 'burger', cart: {}, promo: false, orders: [{ no: 3102, items: 3, total: 285, stage: 3, when: B('أمس', 'Yesterday') }, { no: 3077, items: 2, total: 190, stage: 3, when: B('الأسبوع الماضي', 'Last week') }], next: 3120, active: null }),
      views: {
        menu(app) {
          const s = app.s, list = menu.filter((m) => m.c === s.cat);
          return `<div class="x-addr">${ic('map')}<span><small>${L('التوصيل إلى', 'Deliver to')}</small><b>${L('الدقي، الجيزة', 'Dokki, Giza')}</b></span></div>
            <div class="x-chips">${cats.map((c) => `<button type="button" class="${s.cat === c.id ? 'on' : ''}" data-act="rCat" data-id="${c.id}"><span>${c.e}</span>${T(c.n)}</button>`).join('')}</div>
            <div class="x-dishes">${list.map((m) => `<div class="x-dish"><span class="x-dimg">${m.e}</span><div><b>${esc(T(m.n))}</b><small>${esc(T(m.d))}</small><span class="x-dprice"><b class="num">${money(m.price)}</b>${btn('rAdd', ic('plus'), `data-id="${m.id}" aria-label="${L('أضف', 'Add')}"`, 'pri sm')}${s.cart[m.id] ? `<em>×${s.cart[m.id]}</em>` : ''}</span></div></div>`).join('')}</div>
            ${totals(s).qty ? `<button type="button" class="x-bar" data-view="cart">${ic('cart')} ${totals(s).qty} ${L('أصناف', 'items')} <b class="num">${money(totals(s).sub)}</b></button>` : ''}`;
        },
        cart(app) {
          const s = app.s, t = totals(s), ids = Object.keys(s.cart);
          if (!ids.length) return `<p class="dm-empty">${L('السلة فارغة. اختر من القائمة.', 'Your cart is empty. Pick something from the menu.')}</p>`;
          return `<ul class="x-lines">${ids.map((id) => { const m = menu.find((x) => x.id === +id); return `<li><span class="x-dimg sm">${m.e}</span><span class="x-nm">${esc(T(m.n))}<small>${money(m.price)}</small></span><span class="x-qty"><button type="button" data-act="rQty" data-id="${id}" data-d="-1">−</button><b>${s.cart[id]}</b><button type="button" data-act="rQty" data-id="${id}" data-d="1">+</button></span></li>`; }).join('')}</ul>
            <div class="x-promo"><input class="dm-input" id="rPromo" placeholder="${L('كود الخصم (جرّب WELCOME10)', 'Promo code (try WELCOME10)')}" value="${s.promo ? 'WELCOME10' : ''}">${btn('rPromo', L('تطبيق', 'Apply'), '', 'sm')}</div>
            <div class="x-sum"><div><span>${L('المجموع', 'Subtotal')}</span><b class="num">${money(t.sub)}</b></div>${t.disc ? `<div><span>${L('خصم 10%', '10% off')}</span><b class="num dm-pos">−${money(t.disc)}</b></div>` : ''}<div><span>${L('التوصيل', 'Delivery')}</span><b class="num">${money(FEE)}</b></div><div class="x-total"><span>${L('الإجمالي', 'Total')}</span><b class="num">${money(t.total)}</b></div></div>
            <button type="button" class="dm-btn gold x-pay" data-act="rOrder">${L('تأكيد الطلب', 'Place order')}</button>`;
        },
        orders(app) {
          const s = app.s;
          return `${s.active ? `<div class="dm-panel x-active"><h3>${L('طلبك الحالي', 'Your current order')} <small>#${s.active.no}</small></h3>${tracker(s.active)}<p class="dm-caption">${s.active.stage === 3 ? L('بالهنا والشفا! 🎉', 'Enjoy your meal! 🎉') : L('الوقت المتوقع: 25 دقيقة', 'Estimated time: 25 minutes')}</p></div>` : ''}
            <h4 class="x-h">${L('الطلبات السابقة', 'Previous orders')}</h4><ul class="x-hist">${s.orders.map((o) => `<li><span><b>#${o.no}</b><small>${T(o.when)} · ${o.items} ${L('أصناف', 'items')}</small></span><b class="num">${money(o.total)}</b>${btn('rAgain', L('أعد الطلب', 'Re-order'), '', 'sm')}</li>`).join('')}</ul>`;
        },
        me(app) {
          return `<div class="x-prof"><span class="dm-avatar x-av lg">${L('ت', 'D')}</span><b>${L('مستخدم تجريبي', 'Demo user')}</b><small dir="ltr">+20 100 000 0000</small></div>
            <ul class="x-hist"><li><span><b>${L('العنوان', 'Address')}</b><small>${L('الدقي، الجيزة — شارع التحرير', 'Dokki, Giza — Tahrir St.')}</small></span></li><li><span><b>${L('طريقة الدفع', 'Payment')}</b><small>${L('الدفع عند الاستلام', 'Cash on delivery')}</small></span></li><li><span><b>${L('الإشعارات', 'Notifications')}</b><small>${L('مفعّلة', 'Enabled')}</small></span></li></ul>`;
        }
      },
      acts: {
        rCat(app, el) { app.s.cat = el.dataset.id; app.render(); },
        rAdd(app, el) { const id = el.dataset.id; app.s.cart[id] = (app.s.cart[id] || 0) + 1; app.render(); },
        rQty(app, el) { const id = el.dataset.id; app.s.cart[id] += +el.dataset.d; if (app.s.cart[id] <= 0) delete app.s.cart[id]; app.render(); },
        rPromo(app) { const v = (app.$('#rPromo').value || '').trim().toUpperCase(); if (v === 'WELCOME10') { app.s.promo = true; app.render(); app.toast(L('تم تطبيق الخصم 10%', '10% discount applied')); } else app.toast(L('الكود غير صحيح', 'Invalid code')); },
        rOrder(app) {
          const s = app.s, t = totals(s); const o = { no: s.next++, items: t.qty, total: t.total, stage: 0, when: B('الآن', 'Now') };
          s.active = o; s.orders.unshift({ no: o.no, items: o.items, total: o.total, stage: 0, when: B('الآن', 'Now') }); s.cart = {}; s.promo = false; app.go('orders'); app.toast(L('تم استلام طلبك!', 'Order received!'));
          clearInterval(app._rt);
          app._rt = setInterval(() => { if (!app.root || !app.root.isConnected || !s.active) { clearInterval(app._rt); return; } if (s.active.stage < 3) { s.active.stage++; s.orders[0].stage = s.active.stage; if (app.view === 'orders') app.render(); } else clearInterval(app._rt); }, 3500);
        },
        rAgain(app) { menu.slice(0, 3).forEach((m) => { app.s.cart[m.id] = 1; }); app.go('cart'); },
        closeDrawer(app) { app.closeDrawer(); }
      }
    };
  });

  /* =========================================================
     8) المتجر الإلكتروني بلوحة إدارة
     ========================================================= */
  D.register('eshop', () => {
    const cats = [{ id: 'all', n: B('الكل', 'All') }, { id: 'men', n: B('رجالي', 'Men') }, { id: 'women', n: B('حريمي', 'Women') }, { id: 'acc', n: B('إكسسوارات', 'Accessories') }];
    const pr = (id, c, ar, en, price, e, bg, stock) => ({ id, c, n: B(ar, en), price, e, bg, stock, on: true });
    const prods = () => [pr(1, 'men', 'تيشيرت قطن', 'Cotton T-shirt', 299, '👕', '#dbeafe', 40), pr(2, 'men', 'قميص كلاسيك', 'Classic shirt', 549, '👔', '#e0e7ff', 22), pr(3, 'men', 'بنطلون جينز', 'Denim jeans', 699, '👖', '#cfe3f5', 8), pr(4, 'men', 'حذاء رياضي', 'Sneakers', 1190, '👟', '#fde2e2', 15),
      pr(5, 'women', 'فستان صيفي', 'Summer dress', 799, '👗', '#fce7f3', 18), pr(6, 'women', 'بلوزة أنيقة', 'Elegant blouse', 459, '👚', '#f3e8ff', 26), pr(7, 'women', 'حقيبة يد', 'Handbag', 899, '👜', '#fef3c7', 12), pr(8, 'women', 'كعب عالي', 'High heels', 949, '👠', '#fee2e2', 6),
      pr(9, 'acc', 'ساعة يد', 'Wrist watch', 1490, '⌚', '#e5e7eb', 10), pr(10, 'acc', 'نظارة شمس', 'Sunglasses', 390, '🕶️', '#d1fae5', 30), pr(11, 'acc', 'قبعة', 'Cap', 190, '🧢', '#ffedd5', 44), pr(12, 'acc', 'وشاح', 'Scarf', 260, '🧣', '#fae8ff', 20)];
    const orders = () => [[4021, 'منى فتحي', 'Mona Fathy', 1248, 'new'], [4020, 'أحمد السيد', 'Ahmed El-Sayed', 549, 'prep'], [4019, 'سارة منصور', 'Sara Mansour', 2340, 'ship'], [4018, 'محمود رمضان', 'Mahmoud Ramadan', 699, 'done'], [4017, 'نورا جمال', 'Noura Gamal', 1490, 'done'], [4016, 'حسن عبدالعزيز', 'Hassan Abdelaziz', 889, 'done']].map((o) => ({ no: o[0], c: B(o[1], o[2]), total: o[3], st: o[4] }));
    const STS = { new: [B('جديد', 'New'), 'p0'], prep: [B('قيد التجهيز', 'Preparing'), 'p2'], ship: [B('تم الشحن', 'Shipped'), 'p3'], done: [B('تم التسليم', 'Delivered'), 'p5'] };
    const sp = (k) => `<span class="dm-pill ${STS[k][1]}">${T(STS[k][0])}</span>`;
    const tot = (s) => { const sub = s.cart.reduce((a, l) => a + l.p.price * l.q, 0); const disc = s.coupon ? Math.round(sub * 0.15) : 0; return { sub, disc, ship: sub ? 60 : 0, total: sub ? sub - disc + 60 : 0, qty: s.cart.reduce((a, l) => a + l.q, 0) }; };
    const grid = (s) => s.p.filter((p) => p.on && (s.cat === 'all' || p.c === s.cat)).map((p) => `<button type="button" class="x-prod" data-act="eOpen" data-id="${p.id}"><span class="x-pimg" style="background:${p.bg}">${p.e}</span><b>${esc(T(p.n))}</b><span class="x-pp num">${money(p.price)}</span>${p.stock <= 0 ? `<em class="out">${L('نفد', 'Sold out')}</em>` : ''}</button>`).join('');
    return {
      name: B('متجر الأناقة', 'Elegance Store'), sub: B('نموذج توضيحي', 'Concept demo'), cls: 'x-shop', mark: B('أ', 'E'),
      nav: [{ id: 'store', icon: 'store', label: B('المتجر', 'Storefront') }, { id: 'cart', icon: 'cart', label: B('السلة', 'Cart') }, { id: 'orders', icon: 'receipt', label: B('الطلبات (إدارة)', 'Orders (admin)') }, { id: 'prods', icon: 'tag', label: B('المنتجات (إدارة)', 'Products (admin)') }, { id: 'sales', icon: 'chart', label: B('المبيعات (إدارة)', 'Sales (admin)') }],
      state: () => ({ p: prods(), cat: 'all', cart: [], coupon: false, o: orders(), next: 4022 }),
      views: {
        store(app) {
          const s = app.s;
          return `<div class="x-hero"><div><small>${L('عروض الموسم', 'Season sale')}</small><h3>${L('خصم حتى 30% على الأزياء', 'Up to 30% off fashion')}</h3><span>${L('استخدم كوبون SAVE15 عند الدفع', 'Use coupon SAVE15 at checkout')}</span></div><span class="x-hero-e">🛍️</span></div>
            <div class="dm-tabs" role="tablist">${cats.map((c) => `<button type="button" role="tab" class="${s.cat === c.id ? 'on' : ''}" data-act="eCat" data-id="${c.id}">${T(c.n)}</button>`).join('')}</div><div class="x-prods" id="eGrid">${grid(s)}</div>`;
        },
        cart(app) {
          const s = app.s, t = tot(s);
          if (!s.cart.length) return `<p class="dm-empty">${L('السلة فارغة', 'Your cart is empty')}</p>`;
          return `<div class="dm-cols"><div>${table([L('المنتج', 'Product'), L('الخيار', 'Option'), L('الكمية', 'Qty'), L('السعر', 'Price'), ''], s.cart.map((l, i) => `<tr><td>${l.p.e} ${esc(T(l.p.n))}</td><td>${esc(l.opt)}</td><td class="num">${l.q}</td><td class="num">${num(l.p.price * l.q)}</td><td>${btn('eRm', ic('x'), `data-i="${i}" aria-label="${L('حذف', 'Remove')}"`, 'sm')}</td></tr>`).join(''))}
              <div class="dm-panel" style="margin-top:14px"><h3>${L('بيانات الشحن', 'Shipping details')}</h3><div class="dm-toolbar" style="margin:0"><input class="dm-input" id="eNm" placeholder="${L('الاسم', 'Name')}" style="flex:1;min-width:140px"><input class="dm-input" id="ePh" placeholder="${L('الموبايل', 'Phone')}" style="flex:1;min-width:140px"><input class="dm-input" id="eAd" placeholder="${L('العنوان', 'Address')}" style="flex:2;min-width:180px"></div></div></div>
            <div class="dm-panel"><h3>${L('ملخص الطلب', 'Order summary')}</h3><div class="x-sum"><div><span>${L('المجموع', 'Subtotal')}</span><b class="num">${money(t.sub)}</b></div>${t.disc ? `<div><span>${L('كوبون 15%', 'Coupon 15%')}</span><b class="num dm-pos">−${money(t.disc)}</b></div>` : ''}<div><span>${L('الشحن', 'Shipping')}</span><b class="num">${money(t.ship)}</b></div><div class="x-total"><span>${L('الإجمالي', 'Total')}</span><b class="num">${money(t.total)}</b></div></div>
            <div class="x-promo"><input class="dm-input" id="eCp" placeholder="${L('كوبون الخصم', 'Coupon')}" value="${s.coupon ? 'SAVE15' : ''}">${btn('eCoupon', L('تطبيق', 'Apply'), '', 'sm')}</div>${btn('eOrder', ic('check') + ' ' + L('إتمام الطلب', 'Place order'), '', 'gold x-pay')}</div></div>`;
        },
        orders(app) {
          return `<p class="dm-caption" style="margin:0 0 12px">${L('لوحة الإدارة: غيّر حالة الطلب', 'Admin panel: change the order status')}</p>${table(['#', L('العميل', 'Customer'), L('الإجمالي', 'Total'), L('الحالة', 'Status'), L('تغيير الحالة', 'Change status')], app.s.o.map((o) => `<tr><td class="num">#${o.no}</td><td>${esc(T(o.c))}</td><td class="num">${num(o.total)}</td><td>${sp(o.st)}</td><td><select class="dm-select" data-ch="eSt" data-no="${o.no}">${Object.keys(STS).map((k) => `<option value="${k}" ${o.st === k ? 'selected' : ''}>${T(STS[k][0])}</option>`).join('')}</select></td></tr>`).join(''))}`;
        },
        prods(app) {
          return table([L('المنتج', 'Product'), L('السعر', 'Price'), L('المخزون', 'Stock'), L('الظهور', 'Visible'), ''], app.s.p.map((p) => `<tr><td>${p.e} ${esc(T(p.n))}</td><td class="num">${num(p.price)}</td><td class="num ${p.stock < 10 ? 'dm-neg' : ''}"><b>${p.stock}</b></td><td>${p.on ? pill('p5', L('ظاهر', 'Visible')) : pill('p2', L('مخفي', 'Hidden'))}</td><td>${btn('eStock', '+10', `data-id="${p.id}"`, 'sm')} ${btn('eToggle', p.on ? L('إخفاء', 'Hide') : L('إظهار', 'Show'), `data-id="${p.id}"`, 'sm')}</td></tr>`).join(''));
        },
        sales(app) {
          const s = app.s, today = s.o.filter((o) => o.st !== 'done').reduce((a, o) => a + o.total, 0) + 6300;
          const d = [{ l: L('السبت', 'Sat'), v: 5200 }, { l: L('الأحد', 'Sun'), v: 4300 }, { l: L('الاثنين', 'Mon'), v: 6100 }, { l: L('الثلاثاء', 'Tue'), v: 5700 }, { l: L('الأربعاء', 'Wed'), v: 7400 }, { l: L('الخميس', 'Thu'), v: 9100 }, { l: L('اليوم', 'Today'), v: today }];
          return `<div class="dm-kpis">${kpi('cash', money(today), L('مبيعات اليوم', 'Sales today'))}${kpi('receipt', s.o.length, L('إجمالي الطلبات', 'Orders'), 'g')}${kpi('bell', s.o.filter((o) => o.st === 'new').length, L('طلبات جديدة', 'New orders'))}${kpi('box', s.p.filter((p) => p.stock < 10).length, L('منتجات منخفضة', 'Low stock'), 'r')}</div><div class="dm-panel"><h3>${L('المبيعات اليومية', 'Daily sales')}</h3>${bars(d, true)}</div>`;
        }
      },
      acts: {
        eCat(app, el) { app.s.cat = el.dataset.id; app.render(); },
        eOpen(app, el) {
          const p = app.s.p.find((x) => x.id === +el.dataset.id);
          app.drawer(`${p.e} ${esc(T(p.n))}`, `<div class="x-pimg big" style="background:${p.bg}">${p.e}</div><p class="num"><b>${money(p.price)}</b> · ${p.stock > 0 ? pill('p5', L('متوفر', 'In stock')) : pill('pr', L('نفد', 'Sold out'))}</p>
            ${field(L('المقاس', 'Size'), `<select class="dm-select" id="eSz"><option>S</option><option selected>M</option><option>L</option><option>XL</option></select>`)}${field(L('اللون', 'Colour'), `<select class="dm-select" id="eCl"><option value="${L('أسود', 'Black')}">${L('أسود', 'Black')}</option><option value="${L('أبيض', 'White')}">${L('أبيض', 'White')}</option><option value="${L('كحلي', 'Navy')}">${L('كحلي', 'Navy')}</option></select>`)}${field(L('الكمية', 'Quantity'), '<input class="dm-input" id="eQ" type="number" min="1" max="5" value="1" style="width:100px">')}
            <div class="dm-actions">${btn('eAdd', ic('cart') + ' ' + L('أضف للسلة', 'Add to cart'), `data-id="${p.id}" ${p.stock <= 0 ? 'disabled' : ''}`, 'pri')}</div>`);
        },
        eAdd(app, el) { const p = app.s.p.find((x) => x.id === +el.dataset.id); const q = Math.max(1, Math.min(5, +app.$('#eQ').value || 1)); app.s.cart.push({ p, q, opt: app.$('#eSz').value + ' / ' + app.$('#eCl').value }); app.closeDrawer(); app.toast(L('تمت الإضافة للسلة', 'Added to cart')); },
        eRm(app, el) { app.s.cart.splice(+el.dataset.i, 1); app.render(); },
        eCoupon(app) { if ((app.$('#eCp').value || '').trim().toUpperCase() === 'SAVE15') { app.s.coupon = true; app.render(); app.toast(L('تم تطبيق الكوبون', 'Coupon applied')); } else app.toast(L('الكوبون غير صحيح', 'Invalid coupon')); },
        eOrder(app) {
          const s = app.s, nm = app.$('#eNm').value.trim(); if (!nm) { app.toast(L('اكتب الاسم', 'Enter your name')); return; }
          const t = tot(s), no = s.next++; s.cart.forEach((l) => { l.p.stock = Math.max(0, l.p.stock - l.q); }); s.o.unshift({ no, c: B(nm, nm), total: t.total, st: 'new' }); s.cart = []; s.coupon = false;
          app.render(); app.drawer(`${ic('check')} ${L('تم استلام طلبك', 'Order received')}`, `<p>${L('رقم الطلب', 'Order no.')}: <b>#${no}</b></p><p>${L('الإجمالي', 'Total')}: <b class="num">${money(t.total)}</b></p><p class="dm-caption">${L('ستجده في تبويب «الطلبات (إدارة)» بحالة جديد.', 'You will find it in “Orders (admin)” as New.')}</p>`);
        },
        eSt(app, el) { app.s.o.find((o) => o.no === +el.dataset.no).st = el.value; app.render(); app.toast(L('تم تحديث الحالة', 'Status updated')); },
        eStock(app, el) { app.s.p.find((p) => p.id === +el.dataset.id).stock += 10; app.render(); },
        eToggle(app, el) { const p = app.s.p.find((x) => x.id === +el.dataset.id); p.on = !p.on; app.render(); },
        closeDrawer(app) { app.closeDrawer(); }
      }
    };
  });
})();
