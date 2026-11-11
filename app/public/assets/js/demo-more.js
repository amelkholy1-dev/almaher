/* =========================================================
   نماذج توضيحية (1/2): المخازن ونقطة البيع • الفواتير • النقل والرحلات • العقارات
   ⚠️ كل البيانات وهمية ومولّدة بالجافاسكريبت. مفيش اتصال بأي سيرفر.
   ========================================================= */
(function () {
  'use strict';
  const D = window.MasarDemo; if (!D || !D.kit) return;
  const { L, T, esc, ic, num, money, pad, fmtD, TODAY, addDays, rng, kpi, bars, table, emptyRow, hl, norm, addIcons, person, mobile } = D.kit;
  const B = (ar, en) => ({ ar, en });
  const pill = (c, t) => `<span class="dm-pill ${c}">${t}</span>`;
  const btn = (act, label, extra, cls) => `<button type="button" class="dm-btn ${cls || ''}" data-act="${act}" ${extra || ''}>${label}</button>`;
  const field = (label, html) => `<label class="x-field"><span>${label}</span>${html}</label>`;

  addIcons({
    cart: 'M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L21 8H6M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM17 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
    box: 'M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10',
    truck: 'M2 6h11v10H2zM13 9h4l4 4v3h-8zM6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
    home: 'M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10',
    key: 'M15 7a4 4 0 1 1-3.9 4.9L3 20v-3l2-2h2v-2h2l2.1-2.1A4 4 0 0 1 15 7z',
    pulse: 'M3 12h4l2-5 4 10 2-5h6',
    calendar: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
    book: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5',
    tag: 'M3 12V4h8l10 10-8 8zM7.5 8h.01',
    list: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01',
    bell: 'M6 9a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7M10 20a2 2 0 0 0 4 0',
    user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
    map: 'M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
    minus: 'M5 12h14',
    receipt: 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6',
    wrench: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z',
    store: 'M4 9l1-5h14l1 5M4 9a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0M5 11v9h14v-9'
  });

  /* =========================================================
     1) المخازن ونقطة البيع
     ========================================================= */
  D.register('pos', () => {
    const CATS = [{ id: 'drinks', n: B('مشروبات', 'Drinks') }, { id: 'grocery', n: B('بقالة', 'Grocery') }, { id: 'dairy', n: B('ألبان', 'Dairy') }, { id: 'clean', n: B('منظفات', 'Cleaning') }, { id: 'sweets', n: B('حلويات', 'Snacks') }];
    const P = (id, ar, en, cat, price, stock, min, e) => ({ id, n: B(ar, en), cat, price, stock, min, e });
    const prods = () => [
      P(1, 'عصير برتقال 1 لتر', 'Orange juice 1L', 'drinks', 38, 42, 12, '🧃'), P(2, 'مياه معدنية 1.5 لتر', 'Mineral water 1.5L', 'drinks', 9, 160, 40, '💧'), P(3, 'شاي أحمر 100 فتلة', 'Black tea 100 bags', 'drinks', 95, 8, 10, '🍵'), P(4, 'مشروب غازي 1 لتر', 'Soft drink 1L', 'drinks', 22, 54, 20, '🥤'),
      P(5, 'أرز مصري 1 كجم', 'Egyptian rice 1kg', 'grocery', 36, 70, 25, '🍚'), P(6, 'مكرونة 400 جم', 'Pasta 400g', 'grocery', 14, 90, 30, '🍝'), P(7, 'زيت عباد الشمس 1 لتر', 'Sunflower oil 1L', 'grocery', 88, 6, 12, '🫒'), P(8, 'سكر 1 كجم', 'Sugar 1kg', 'grocery', 32, 48, 20, '🧂'), P(9, 'دقيق 1 كجم', 'Flour 1kg', 'grocery', 20, 64, 20, '🌾'),
      P(10, 'لبن كامل الدسم 1 لتر', 'Whole milk 1L', 'dairy', 42, 30, 15, '🥛'), P(11, 'جبنة بيضاء 500 جم', 'White cheese 500g', 'dairy', 75, 18, 10, '🧀'), P(12, 'زبادي 170 جم', 'Yoghurt 170g', 'dairy', 9, 96, 30, '🍶'), P(13, 'بيض 30 بيضة', 'Eggs (30)', 'dairy', 160, 14, 10, '🥚'),
      P(14, 'سائل غسيل أطباق', 'Dish liquid', 'clean', 29, 36, 15, '🧴'), P(15, 'مسحوق غسيل 2 كجم', 'Laundry powder 2kg', 'clean', 118, 5, 10, '🧺'), P(16, 'مناديل ورقية', 'Tissues', 'clean', 17, 80, 25, '🧻'),
      P(17, 'شوكولاتة', 'Chocolate bar', 'sweets', 15, 120, 30, '🍫'), P(18, 'بسكويت', 'Biscuits', 'sweets', 11, 140, 40, '🍪'), P(19, 'شيبسي', 'Chips', 'sweets', 10, 150, 40, '🍟'), P(20, 'عصير علبة', 'Juice box', 'drinks', 12, 100, 30, '🧃')
    ];
    const week = [{ d: B('السبت', 'Sat'), v: 21400 }, { d: B('الأحد', 'Sun'), v: 18950 }, { d: B('الاثنين', 'Mon'), v: 23100 }, { d: B('الثلاثاء', 'Tue'), v: 19800 }, { d: B('الأربعاء', 'Wed'), v: 24650 }, { d: B('الخميس', 'Thu'), v: 28900 }, { d: B('الجمعة', 'Fri'), v: 26300 }];
    const status = (p) => (p.stock <= 0 ? pill('pr', L('نافد', 'Out')) : p.stock <= p.min ? pill('p2', L('منخفض', 'Low')) : pill('p5', L('متوفر', 'In stock')));
    const cartTotals = (s) => { const sub = s.cart.reduce((a, l) => a + l.p.price * l.q, 0); const disc = Math.round((sub * s.disc) / 100); return { sub, disc, total: sub - disc, qty: s.cart.reduce((a, l) => a + l.q, 0) }; };
    const grid = (s) => {
      const q = norm(s.q);
      const list = s.p.filter((p) => (s.cat === 'all' || p.cat === s.cat) && (!q || norm(T(p.n)).includes(q)));
      return list.length ? list.map((p) => `<button type="button" class="x-tile ${p.stock <= 0 ? 'off' : ''}" data-act="pPick" data-id="${p.id}" ${p.stock <= 0 ? 'disabled' : ''}><span class="x-em">${p.e}</span><b>${esc(T(p.n))}</b><span class="x-pr">${money(p.price)}</span><small>${L('المخزون', 'Stock')}: ${p.stock}</small></button>`).join('') : `<p class="dm-empty">${L('لا توجد أصناف مطابقة', 'No matching products')}</p>`;
    };
    const cartHtml = (s) => {
      const t = cartTotals(s);
      return `<h3>${ic('cart')} ${L('الفاتورة الحالية', 'Current sale')} <small>${t.qty} ${L('قطعة', 'items')}</small></h3>
        ${s.cart.length ? `<ul class="x-cart">${s.cart.map((l) => `<li><span class="x-nm">${esc(T(l.p.n))}<small>${money(l.p.price)}</small></span><span class="x-qty"><button type="button" data-act="pQty" data-id="${l.p.id}" data-d="-1" aria-label="-">−</button><b>${l.q}</b><button type="button" data-act="pQty" data-id="${l.p.id}" data-d="1" aria-label="+">+</button></span><b class="num">${num(l.p.price * l.q)}</b></li>`).join('')}</ul>` : `<p class="dm-empty">${L('اضغط على صنف لإضافته', 'Tap a product to add it')}</p>`}
        <div class="x-sum"><div><span>${L('الإجمالي الفرعي', 'Subtotal')}</span><b class="num">${money(t.sub)}</b></div>
        <div><span>${L('خصم %', 'Discount %')}</span><input class="dm-input x-disc" type="number" min="0" max="50" value="${s.disc}" data-in="pDisc" aria-label="${L('نسبة الخصم', 'Discount percent')}"></div>
        <div class="x-total"><span>${L('المطلوب', 'Total')}</span><b class="num">${money(t.total)}</b></div></div>
        <button type="button" class="dm-btn gold x-pay" data-act="pPay" ${s.cart.length ? '' : 'disabled'}>${ic('cash')} ${L('إتمام البيع', 'Complete sale')}</button>`;
    };
    return {
      name: B('نظام المخازن والمبيعات', 'Inventory & POS'), sub: B('ديمو تفاعلي', 'Interactive demo'), cls: 'x-pos', mark: B('ن', 'P'),
      nav: [{ id: 'dash', icon: 'dash', label: B('لوحة اليوم', 'Today') }, { id: 'sell', icon: 'cart', label: B('شاشة البيع', 'Point of sale') }, { id: 'stock', icon: 'box', label: B('المخزون', 'Inventory') }, { id: 'reports', icon: 'chart', label: B('التقارير', 'Reports') }],
      state: () => ({ p: prods(), cart: [], disc: 0, cat: 'all', q: '', sales: [{ no: 1048, t: '09:12', total: 412, items: 9 }, { no: 1049, t: '09:40', total: 186, items: 5 }, { no: 1050, t: '10:05', total: 954, items: 17 }, { no: 1051, t: '10:31', total: 233, items: 6 }], base: 17180, nextNo: 1052, cs: { drinks: 5400, grocery: 8700, dairy: 4300, clean: 2600, sweets: 3100 }, sold: {} }),
      views: {
        dash(app) {
          const s = app.s;
          const low = s.p.filter((p) => p.stock <= p.min);
          const value = s.p.reduce((a, p) => a + p.stock * p.price, 0);
          return `<div class="dm-kpis">${kpi('cash', money(s.base + s.sales.slice(4).reduce((a, x) => a + x.total, 0) + 1785), L('مبيعات اليوم', 'Sales today'))}${kpi('receipt', num(s.sales.length + 38), L('عدد الفواتير', 'Invoices'), 'g')}${kpi('box', low.length, L('أصناف تحت حد الطلب', 'Below reorder level'), low.length ? 'r' : '')}${kpi('wallet', money(value), L('قيمة المخزون', 'Stock value'))}</div>
            <div class="dm-cols"><div class="dm-panel"><h3>${L('مبيعات آخر 7 أيام', 'Sales — last 7 days')}</h3>${bars(week.map((w) => ({ l: T(w.d), v: w.v })))}</div>
            <div class="dm-panel"><h3>${L('تنبيهات المخزون', 'Stock alerts')} <small>${low.length}</small></h3>${low.length ? `<ul class="x-alerts">${low.map((p) => `<li><span>${p.e} ${esc(T(p.n))}<small>${L('المتبقي', 'Left')}: ${p.stock} / ${L('الحد', 'min')} ${p.min}</small></span>${btn('pRestock', '+20', `data-id="${p.id}"`, 'sm')}</li>`).join('')}</ul>` : `<p class="dm-empty">${L('كل الأصناف فوق الحد', 'All products above the minimum')}</p>`}</div></div>`;
        },
        sell(app) {
          const s = app.s;
          return `<div class="dm-toolbar"><div class="dm-search">${ic('search')}<input class="dm-input" id="pQ" data-in="pSearch" placeholder="${L('ابحث بالاسم أو امسح الباركود…', 'Search by name or scan a barcode…')}" value="${esc(s.q)}"></div>
            <select class="dm-select" data-ch="pCat" aria-label="${L('التصنيف', 'Category')}"><option value="all">${L('كل التصنيفات', 'All categories')}</option>${CATS.map((c) => `<option value="${c.id}" ${s.cat === c.id ? 'selected' : ''}>${T(c.n)}</option>`).join('')}</select></div>
            <div class="x-sell"><div class="x-grid" id="pGrid">${grid(s)}</div><div class="dm-panel x-cartbox" id="pCart">${cartHtml(s)}</div></div>`;
        },
        stock(app) {
          const s = app.s;
          return `<div class="dm-panel" style="margin-bottom:14px"><h3>${ic('plus')} ${L('إضافة صنف جديد', 'Add a product')}</h3><div class="dm-toolbar" style="margin:0"><input class="dm-input" id="nName" style="flex:2;min-width:160px" placeholder="${L('اسم الصنف', 'Product name')}"><input class="dm-input" id="nPrice" type="number" style="flex:1;min-width:90px" placeholder="${L('السعر', 'Price')}"><input class="dm-input" id="nStock" type="number" style="flex:1;min-width:90px" placeholder="${L('الكمية', 'Qty')}">${btn('pAdd', L('إضافة', 'Add'), '', 'pri')}</div></div>
            ${table([L('الصنف', 'Product'), L('التصنيف', 'Category'), L('السعر', 'Price'), L('المخزون', 'Stock'), L('الحالة', 'Status'), ''], s.p.map((p) => `<tr><td>${p.e} ${esc(T(p.n))}</td><td>${T(CATS.find((c) => c.id === p.cat).n)}</td><td class="num">${num(p.price)}</td><td class="num"><b>${p.stock}</b></td><td>${status(p)}</td><td>${btn('pRestock', '+20', `data-id="${p.id}"`, 'sm')}</td></tr>`).join(''))}`;
        },
        reports(app) {
          const s = app.s; const byCat = CATS.map((c) => ({ l: T(c.n), v: s.cs[c.id] + (s.sold[c.id] || 0) }));
          const top = s.p.map((p) => ({ l: T(p.n), v: (p.id * 37 % 90) + 20 + (s.sold['p' + p.id] || 0) })).sort((a, b) => b.v - a.v).slice(0, 6);
          return `<div class="dm-cols-2"><div class="dm-panel"><h3>${L('المبيعات حسب التصنيف (اليوم)', 'Sales by category (today)')}</h3>${bars(byCat, true)}</div><div class="dm-panel"><h3>${L('الأكثر مبيعاً (قطعة)', 'Top sellers (units)')}</h3>${bars(top)}</div></div>
            <div class="dm-actions" style="margin-top:14px">${btn('pDis', ic('excel') + ' Excel')}${btn('pDis', ic('pdf') + ' PDF')}</div>`;
        }
      },
      acts: {
        pPick(app, el) { const p = app.s.p.find((x) => x.id === +el.dataset.id); const l = app.s.cart.find((x) => x.p.id === p.id); const cur = l ? l.q : 0; if (cur >= p.stock) { app.toast(L('الكمية المتاحة انتهت', 'No more stock available')); return; } if (l) l.q++; else app.s.cart.push({ p, q: 1 }); app.$('#pCart').innerHTML = cartHtml(app.s); },
        pQty(app, el) { const l = app.s.cart.find((x) => x.p.id === +el.dataset.id); l.q += +el.dataset.d; if (l.q > l.p.stock) l.q = l.p.stock; if (l.q <= 0) app.s.cart = app.s.cart.filter((x) => x !== l); app.$('#pCart').innerHTML = cartHtml(app.s); },
        pDisc(app, el) { app.s.disc = Math.max(0, Math.min(50, +el.value || 0)); const t = cartTotals(app.s); const tt = app.$('.x-total b'); if (tt) tt.textContent = money(t.total); },
        pSearch(app, el) { app.s.q = el.value; app.$('#pGrid').innerHTML = grid(app.s); },
        pCat(app, el) { app.s.cat = el.value; app.$('#pGrid').innerHTML = grid(app.s); },
        pPay(app) {
          const s = app.s, t = cartTotals(s); if (!s.cart.length) return;
          const no = s.nextNo++; s.sales.push({ no, t: '11:' + pad(10 + (no % 40)), total: t.total, items: t.qty });
          s.cart.forEach((l) => { l.p.stock -= l.q; s.sold[l.p.cat] = (s.sold[l.p.cat] || 0) + l.p.price * l.q; s.sold['p' + l.p.id] = (s.sold['p' + l.p.id] || 0) + l.q; });
          const lines = s.cart.map((l) => `<tr><td>${esc(T(l.p.n))}</td><td class="num">${l.q}</td><td class="num">${num(l.p.price * l.q)}</td></tr>`).join('');
          const body = `<div class="x-receipt"><p><b>${L('فاتورة رقم', 'Invoice no.')} #${no}</b><br><small>${fmtD(TODAY)} · ${L('الكاشير: تجريبي', 'Cashier: demo')}</small></p>${table([L('الصنف', 'Item'), L('الكمية', 'Qty'), L('الإجمالي', 'Total')], lines, { foot: `<tfoot><tr><td colspan="2">${L('الإجمالي الفرعي', 'Subtotal')}</td><td class="num">${num(t.sub)}</td></tr><tr><td colspan="2">${L('الخصم', 'Discount')}</td><td class="num">${num(t.disc)}</td></tr><tr><td colspan="2">${L('المطلوب', 'Total')}</td><td class="num">${num(t.total)}</td></tr></tfoot>` })}</div>`;
          s.cart = []; s.disc = 0; app.render(); app.drawer(`${ic('receipt')} ${L('تم البيع', 'Sale completed')}`, body); app.toast(L('تم حفظ الفاتورة وتحديث المخزون', 'Invoice saved and stock updated'));
        },
        pRestock(app, el) { const p = app.s.p.find((x) => x.id === +el.dataset.id); p.stock += 20; app.render(); app.toast(L(`تمت إضافة 20 إلى ${T(p.n)}`, `Added 20 to ${T(p.n)}`)); },
        pAdd(app) {
          const n = app.$('#nName').value.trim(), pr = +app.$('#nPrice').value, st = +app.$('#nStock').value;
          if (!n || !(pr > 0) || !(st >= 0)) { app.toast(L('اكتب الاسم والسعر والكمية', 'Enter name, price and quantity')); return; }
          app.s.p.unshift({ id: Date.now() % 100000, n: B(n, n), cat: 'grocery', price: pr, stock: st, min: 10, e: '📦' }); app.render(); app.toast(L('تمت إضافة الصنف', 'Product added'));
        },
        pDis(app) { app.toast(D.kit.disabledMsg(L('التصدير', 'Export'))); },
        closeDrawer(app) { app.closeDrawer(); }
      }
    };
  });

  /* =========================================================
     2) الفواتير والمحاسبة
     ========================================================= */
  D.register('invoices', () => {
    const VAT = 0.14;
    const clientsSeed = [['شركة النور للتجارة', 'Al-Nour Trading'], ['مؤسسة الأمل للمقاولات', 'Al-Amal Contracting'], ['مطعم الشرق', 'El-Sharq Restaurant'], ['مكتبة دار المعرفة', 'Dar El-Maaref Books'], ['شركة المدينة للنقل', 'Madina Transport'], ['صيدلية الشفاء', 'El-Shefaa Pharmacy'], ['مصنع الوادي للبلاستيك', 'El-Wadi Plastics'], ['مركز التقنية الحديثة', 'Modern Tech Center']];
    const items = [['توريد أجهزة مكتبية', 'Office equipment supply', 4500], ['صيانة شهرية', 'Monthly maintenance', 1800], ['خدمات استشارية', 'Consulting services', 3200], ['تركيب شبكات', 'Network installation', 2700], ['مستلزمات تشغيل', 'Operating supplies', 950], ['تصميم هوية', 'Brand design', 3900]];
    const inv = () => {
      const r = rng(31); const out = [];
      for (let i = 0; i < 14; i++) {
        const c = i % 8, n = 1 + (i % 3), lines = []; for (let k = 0; k < n; k++) { const it = items[(i + k * 2) % items.length]; lines.push({ n: B(it[0], it[1]), q: 1 + ((i + k) % 3), p: it[2] }); }
        const age = [3, 9, 15, 22, 28, 34, 41, 47, 52, 58, 64, 70, 76, 83][i];
        out.push({ no: 2026000 + 101 + i, c, date: addDays(TODAY, -age), due: addDays(TODAY, -age + 30), lines, paid: [1, 3, 4, 6, 7, 9, 10, 12].includes(i) || r() < 0.02 });
      }
      return out;
    };
    const totals = (i) => { const sub = i.lines.reduce((a, l) => a + l.q * l.p, 0); const vat = Math.round(sub * VAT); return { sub, vat, total: sub + vat }; };
    const st = (i) => (i.paid ? 'paid' : i.due < TODAY ? 'over' : 'due');
    const stPill = (i) => ({ paid: pill('p5', L('مدفوعة', 'Paid')), due: pill('p2', L('مستحقة', 'Due')), over: pill('pr', L('متأخرة', 'Overdue')) }[st(i)]);
    const cname = (i) => T(B(clientsSeed[i.c][0], clientsSeed[i.c][1]));
    const exp = () => [{ n: B('إيجار المكتب', 'Office rent'), c: B('إيجار', 'Rent'), a: 6500, d: -5 }, { n: B('رواتب الموظفين', 'Salaries'), c: B('رواتب', 'Payroll'), a: 21000, d: -4 }, { n: B('فاتورة الكهرباء والإنترنت', 'Utilities & internet'), c: B('مرافق', 'Utilities'), a: 2100, d: -9 }, { n: B('مستلزمات مكتبية', 'Office supplies'), c: B('مستلزمات', 'Supplies'), a: 1350, d: -12 }, { n: B('إعلانات ممولة', 'Paid ads'), c: B('تسويق', 'Marketing'), a: 3200, d: -15 }];
    const invRows = (app, f) => app.s.inv.filter((i) => f === 'all' || st(i) === f).sort((a, b) => b.no - a.no).map((i) => `<tr class="click" tabindex="0" data-act="iOpen" data-no="${i.no}"><td class="num">#${i.no}</td><td>${esc(cname(i))}</td><td>${fmtD(i.date)}</td><td>${fmtD(i.due)}</td><td class="num">${num(totals(i).total)}</td><td>${stPill(i)}</td></tr>`).join('') || emptyRow(6);
    return {
      name: B('الفواتير والمحاسبة', 'Invoicing & Accounting'), sub: B('ديمو تفاعلي', 'Interactive demo'), cls: 'x-inv', mark: B('ف', 'I'),
      nav: [{ id: 'dash', icon: 'dash', label: B('اللوحة', 'Dashboard') }, { id: 'list', icon: 'receipt', label: B('الفواتير', 'Invoices') }, { id: 'new', icon: 'plus', label: B('فاتورة جديدة', 'New invoice') }, { id: 'clients', icon: 'users', label: B('العملاء', 'Clients') }, { id: 'exp', icon: 'wallet', label: B('المصروفات', 'Expenses') }],
      state: () => ({ inv: inv(), exp: exp(), f: 'all', draft: [{ i: 0, q: 1 }], client: 0, next: 2026000 + 115 }),
      views: {
        dash(app) {
          const s = app.s, paid = s.inv.filter((i) => i.paid).reduce((a, i) => a + totals(i).total, 0), open = s.inv.filter((i) => !i.paid), over = open.filter((i) => i.due < TODAY);
          const ex = s.exp.reduce((a, e) => a + e.a, 0);
          const m = [{ l: L('مايو', 'May'), v: 38200 }, { l: L('يونيو', 'Jun'), v: 41500 }, { l: L('يوليو', 'Jul'), v: 36800 }, { l: L('أغسطس', 'Aug'), v: 44100 }, { l: L('سبتمبر', 'Sep'), v: 47900 }, { l: L('أكتوبر', 'Oct'), v: Math.round(paid) }];
          return `<div class="dm-kpis">${kpi('cash', money(paid), L('إيرادات محصّلة', 'Collected revenue'))}${kpi('clock', money(open.reduce((a, i) => a + totals(i).total, 0)), L('مستحقات لم تُحصّل', 'Outstanding'), 'g')}${kpi('x', over.length, L('فواتير متأخرة', 'Overdue invoices'), over.length ? 'r' : '')}${kpi('wallet', money(paid - ex), L('صافي الربح', 'Net profit'))}</div>
            <div class="dm-cols"><div class="dm-panel"><h3>${L('الإيرادات الشهرية', 'Monthly revenue')}</h3>${bars(m, true)}</div><div class="dm-panel"><h3>${L('فواتير تحتاج متابعة', 'Needs follow-up')}</h3><ul class="x-alerts">${over.slice(0, 4).map((i) => `<li><span>#${i.no} · ${esc(cname(i))}<small>${L('استحقت منذ', 'Overdue by')} ${Math.round((TODAY - i.due) / 864e5)} ${L('يوم', 'days')}</small></span>${btn('iOpen', L('عرض', 'View'), `data-no="${i.no}"`, 'sm')}</li>`).join('') || `<p class="dm-empty">—</p>`}</ul></div></div>`;
        },
        list(app) {
          return `<div class="dm-toolbar"><select class="dm-select" data-ch="iFilter" aria-label="${L('الحالة', 'Status')}">${[['all', L('كل الحالات', 'All statuses')], ['paid', L('مدفوعة', 'Paid')], ['due', L('مستحقة', 'Due')], ['over', L('متأخرة', 'Overdue')]].map((o) => `<option value="${o[0]}" ${app.s.f === o[0] ? 'selected' : ''}>${o[1]}</option>`).join('')}</select><span class="dm-caption">${L('اضغط على فاتورة لعرضها', 'Click an invoice to open it')}</span></div>
            ${table(['#', L('العميل', 'Client'), L('التاريخ', 'Date'), L('الاستحقاق', 'Due'), L('الإجمالي', 'Total'), L('الحالة', 'Status')], invRows(app, app.s.f), { bodyId: 'iBody' })}`;
        },
        new(app) {
          const s = app.s;
          const sub = s.draft.reduce((a, l) => a + items[l.i][2] * l.q, 0), vat = Math.round(sub * VAT);
          return `<div class="dm-panel"><h3>${L('بيانات الفاتورة', 'Invoice details')}</h3><div class="dm-toolbar">${field(L('العميل', 'Client'), `<select class="dm-select" data-ch="iClient">${clientsSeed.map((c, i) => `<option value="${i}" ${s.client === i ? 'selected' : ''}>${T(B(c[0], c[1]))}</option>`).join('')}</select>`)}</div>
            ${s.draft.map((l, k) => `<div class="dm-toolbar"><select class="dm-select" style="flex:2" data-ch="iLine" data-k="${k}">${items.map((it, j) => `<option value="${j}" ${l.i === j ? 'selected' : ''}>${T(B(it[0], it[1]))} — ${num(it[2])}</option>`).join('')}</select><input class="dm-input" type="number" min="1" value="${l.q}" style="max-width:90px" data-in="iQty" data-k="${k}" aria-label="${L('الكمية', 'Qty')}">${s.draft.length > 1 ? btn('iDel', ic('x'), `data-k="${k}" aria-label="${L('حذف', 'Remove')}"`, 'sm') : ''}</div>`).join('')}
            <div class="dm-actions">${btn('iAddLine', ic('plus') + ' ' + L('إضافة بند', 'Add line'))}</div></div>
            <div class="dm-panel" style="margin-top:14px"><div class="x-sum"><div><span>${L('الإجمالي قبل الضريبة', 'Subtotal')}</span><b class="num" id="iSub">${money(sub)}</b></div><div><span>${L('ضريبة القيمة المضافة 14%', 'VAT 14%')}</span><b class="num" id="iVat">${money(vat)}</b></div><div class="x-total"><span>${L('الإجمالي', 'Total')}</span><b class="num" id="iTot">${money(sub + vat)}</b></div></div>${btn('iCreate', ic('save') + ' ' + L('إصدار الفاتورة', 'Issue invoice'), '', 'pri')}</div>`;
        },
        clients(app) {
          const s = app.s;
          return table([L('العميل', 'Client'), L('عدد الفواتير', 'Invoices'), L('إجمالي المبيعات', 'Total billed'), L('الرصيد المستحق', 'Balance due')], clientsSeed.map((c, k) => {
            const mine = s.inv.filter((i) => i.c === k); const tot = mine.reduce((a, i) => a + totals(i).total, 0), due = mine.filter((i) => !i.paid).reduce((a, i) => a + totals(i).total, 0);
            return `<tr><td>${esc(T(B(c[0], c[1])))}</td><td class="num">${mine.length}</td><td class="num">${num(tot)}</td><td class="num ${due ? 'dm-neg' : 'dm-pos'}">${num(due)}</td></tr>`;
          }).join(''));
        },
        exp(app) {
          const s = app.s, by = {}; s.exp.forEach((e) => { by[T(e.c)] = (by[T(e.c)] || 0) + e.a; });
          return `<div class="dm-panel" style="margin-bottom:14px"><h3>${ic('plus')} ${L('تسجيل مصروف', 'Log an expense')}</h3><div class="dm-toolbar" style="margin:0"><input class="dm-input" id="eName" style="flex:2;min-width:160px" placeholder="${L('البند', 'Item')}"><input class="dm-input" id="eAmt" type="number" style="flex:1;min-width:100px" placeholder="${L('المبلغ', 'Amount')}">${btn('eAdd', L('إضافة', 'Add'), '', 'pri')}</div></div>
            <div class="dm-cols"><div>${table([L('البند', 'Item'), L('الفئة', 'Category'), L('التاريخ', 'Date'), L('المبلغ', 'Amount')], s.exp.map((e) => `<tr><td>${esc(T(e.n))}</td><td>${esc(T(e.c))}</td><td>${fmtD(addDays(TODAY, e.d))}</td><td class="num dm-neg">${num(e.a)}</td></tr>`).join(''))}</div><div class="dm-panel"><h3>${L('حسب الفئة', 'By category')}</h3>${bars(Object.keys(by).map((k) => ({ l: k, v: by[k] })), true)}</div></div>`;
        }
      },
      acts: {
        iOpen(app, el) {
          const i = app.s.inv.find((x) => x.no === +el.dataset.no), t = totals(i);
          app.drawer(`${ic('receipt')} ${L('فاتورة', 'Invoice')} #${i.no}`, `<div class="x-receipt"><p><b>${esc(cname(i))}</b><br><small>${L('التاريخ', 'Date')}: ${fmtD(i.date)} · ${L('الاستحقاق', 'Due')}: ${fmtD(i.due)}</small></p><p>${stPill(i)}</p>
            ${table([L('البند', 'Item'), L('الكمية', 'Qty'), L('السعر', 'Price'), L('الإجمالي', 'Total')], i.lines.map((l) => `<tr><td>${esc(T(l.n))}</td><td class="num">${l.q}</td><td class="num">${num(l.p)}</td><td class="num">${num(l.q * l.p)}</td></tr>`).join(''), { foot: `<tfoot><tr><td colspan="3">${L('الإجمالي قبل الضريبة', 'Subtotal')}</td><td class="num">${num(t.sub)}</td></tr><tr><td colspan="3">${L('ضريبة 14%', 'VAT 14%')}</td><td class="num">${num(t.vat)}</td></tr><tr><td colspan="3">${L('الإجمالي', 'Total')}</td><td class="num">${num(t.total)}</td></tr></tfoot>` })}</div>
            <div class="dm-actions">${i.paid ? '' : btn('iPay', ic('check') + ' ' + L('تسجيل كمدفوعة', 'Mark as paid'), `data-no="${i.no}"`, 'ok')}${btn('iDis', ic('pdf') + ' PDF')}</div>`);
        },
        iPay(app, el) { const i = app.s.inv.find((x) => x.no === +el.dataset.no); i.paid = true; app.closeDrawer(); app.render(); app.toast(L('تم تسجيل الدفع', 'Payment recorded')); },
        iDis(app) { app.toast(D.kit.disabledMsg(L('التصدير', 'Export'))); },
        iFilter(app, el) { app.s.f = el.value; app.$('#iBody').innerHTML = invRows(app, app.s.f); },
        iClient(app, el) { app.s.client = +el.value; },
        iLine(app, el) { app.s.draft[+el.dataset.k].i = +el.value; app.render(); },
        iQty(app, el) { app.s.draft[+el.dataset.k].q = Math.max(1, +el.value || 1); const sub = app.s.draft.reduce((a, l) => a + items[l.i][2] * l.q, 0), vat = Math.round(sub * VAT); app.$('#iSub').textContent = money(sub); app.$('#iVat').textContent = money(vat); app.$('#iTot').textContent = money(sub + vat); },
        iAddLine(app) { if (app.s.draft.length < 6) app.s.draft.push({ i: 1, q: 1 }); app.render(); },
        iDel(app, el) { app.s.draft.splice(+el.dataset.k, 1); app.render(); },
        iCreate(app) {
          const s = app.s; const no = s.next++;
          s.inv.push({ no, c: s.client, date: TODAY, due: addDays(TODAY, 30), lines: s.draft.map((l) => ({ n: B(items[l.i][0], items[l.i][1]), q: l.q, p: items[l.i][2] })), paid: false });
          s.draft = [{ i: 0, q: 1 }]; s.f = 'all'; app.go('list'); app.toast(L(`تم إصدار الفاتورة #${no}`, `Invoice #${no} issued`));
        },
        eAdd(app) { const n = app.$('#eName').value.trim(), a = +app.$('#eAmt').value; if (!n || !(a > 0)) { app.toast(L('اكتب البند والمبلغ', 'Enter item and amount')); return; } app.s.exp.unshift({ n: B(n, n), c: B('أخرى', 'Other'), a, d: 0 }); app.render(); },
        closeDrawer(app) { app.closeDrawer(); }
      }
    };
  });

  /* =========================================================
     3) النقل والرحلات
     ========================================================= */
  D.register('fleet', () => {
    const ST = { sch: ['p0', B('مجدولة', 'Scheduled')], run: ['p3', B('جارية', 'Ongoing')], done: ['p5', B('منتهية', 'Completed')], late: ['pr', B('متأخرة', 'Delayed')] };
    const stp = (k) => `<span class="dm-pill ${ST[k][0]}">${T(ST[k][1])}</span>`;
    const drivers = () => { const r = rng(77); return ['محمود', 'أحمد', 'سيد', 'عادل', 'طارق', 'ياسر', 'هشام', 'خالد'].map((n, i) => ({ id: i + 1, n: B(n + ' ' + ['علي', 'حسن', 'فتحي', 'سعد', 'منصور', 'جمال', 'رشاد', 'نصر'][i], ['Mahmoud', 'Ahmed', 'Sayed', 'Adel', 'Tarek', 'Yasser', 'Hesham', 'Khaled'][i] + ' ' + ['Ali', 'Hassan', 'Fathy', 'Saad', 'Mansour', 'Gamal', 'Rashad', 'Nasr'][i]), ph: mobile(r), lic: [210, 95, 28, 340, 160, 14, 480, 75][i], st: i === 5 ? 'off' : 'av' })); };
    const vehicles = () => [['أ ب ج 1234', 'ABC 1234', 'حافلة 45 راكب', 'Bus 45 seats', 45, 4200], ['س ص ع 5521', 'SSA 5521', 'حافلة 45 راكب', 'Bus 45 seats', 45, 800], ['ك ل م 7788', 'KLM 7788', 'ميني باص 20 راكب', 'Minibus 20 seats', 20, 2600], ['د ر ز 3109', 'DRZ 3109', 'ميني باص 20 راكب', 'Minibus 20 seats', 20, 5100], ['ن هـ و 9042', 'NHW 9042', 'سيارة 7 راكب', 'Van 7 seats', 7, 1700], ['ق ف ي 6613', 'QFY 6613', 'سيارة 7 راكب', 'Van 7 seats', 7, 300]].map((v, i) => ({ id: i + 1, pl: B(v[0], v[1]), ty: B(v[2], v[3]), seats: v[4], toService: v[5], maint: i === 3 }));
    const trips = () => [['المطار → الفندق المركزي', 'Airport → Central Hotel', '06:30', 42, 1, 1, 'done'], ['الفندق → المحطة الشمالية', 'Hotel → North Station', '08:15', 38, 2, 2, 'run'], ['الفندق → مدينة الأعمال', 'Hotel → Business City', '09:00', 18, 3, 3, 'run'], ['المحطة → المطار', 'Station → Airport', '10:30', 40, 4, 1, 'late'], ['الفندق → المعرض', 'Hotel → Expo Center', '11:00', 6, 5, 5, 'sch'], ['المطار → الفندق الجنوبي', 'Airport → South Hotel', '12:45', 44, 7, 2, 'sch'], ['الشركة → المصنع', 'Office → Factory', '13:30', 16, 8, 3, 'sch'], ['الفندق → المطار', 'Hotel → Airport', '15:00', 41, 1, 1, 'sch'], ['المعرض → الفندق', 'Expo → Hotel', '17:30', 5, 5, 5, 'sch']].map((t, i) => ({ id: i + 1, r: B(t[0], t[1]), t: t[2], pax: t[3], d: t[4], v: t[5], s: t[6] }));
    const dn = (app, id) => { const d = app.s.d.find((x) => x.id === id); return d ? T(d.n) : '—'; };
    return {
      name: B('جدولة الرحلات والسائقين', 'Trips & Dispatch'), sub: B('ديمو تفاعلي', 'Interactive demo'), cls: 'x-fleet', mark: B('ر', 'T'),
      nav: [{ id: 'dash', icon: 'dash', label: B('لوحة التشغيل', 'Operations') }, { id: 'trips', icon: 'truck', label: B('الرحلات', 'Trips') }, { id: 'drivers', icon: 'users', label: B('السائقون', 'Drivers') }, { id: 'vehicles', icon: 'wrench', label: B('المركبات والصيانة', 'Vehicles') }, { id: 'report', icon: 'pdf', label: B('تقرير اليوم', 'Daily report') }],
      state: () => ({ d: drivers(), v: vehicles(), t: trips(), next: 10 }),
      views: {
        dash(app) {
          const t = app.s.t, run = t.filter((x) => x.s === 'run'), late = t.filter((x) => x.s === 'late');
          const free = app.s.d.filter((d) => d.st === 'av' && !t.some((x) => x.d === d.id && (x.s === 'run' || x.s === 'late'))).length;
          return `<div class="dm-kpis">${kpi('truck', t.length, L('رحلات اليوم', 'Trips today'))}${kpi('next', run.length, L('جارية الآن', 'In progress'), 'g')}${kpi('clock', late.length, L('متأخرة', 'Delayed'), late.length ? 'r' : '')}${kpi('users', free, L('سائقون متاحون', 'Available drivers'))}</div>
            <div class="dm-panel"><h3>${L('الرحلات الحالية والمتأخرة', 'Live & delayed trips')}</h3>${table([L('الرحلة', 'Trip'), L('الموعد', 'Time'), L('الركاب', 'Pax'), L('السائق', 'Driver'), L('الحالة', 'Status')], run.concat(late).map((x) => `<tr class="click" tabindex="0" data-act="fOpen" data-id="${x.id}"><td>${esc(T(x.r))}</td><td class="num">${x.t}</td><td class="num">${x.pax}</td><td>${esc(dn(app, x.d))}</td><td>${stp(x.s)}</td></tr>`).join('') || emptyRow(5))}</div>`;
        },
        trips(app) {
          return `<div class="dm-toolbar"><span class="dm-caption">${L('اضغط على رحلة لتعيين السائق أو تغيير الحالة', 'Open a trip to assign a driver or change status')}</span>${btn('fNew', ic('plus') + ' ' + L('رحلة جديدة', 'New trip'), '', 'pri')}</div>
            ${table(['#', L('الرحلة', 'Trip'), L('الموعد', 'Time'), L('الركاب', 'Pax'), L('السائق', 'Driver'), L('المركبة', 'Vehicle'), L('الحالة', 'Status')], app.s.t.map((x) => `<tr class="click" tabindex="0" data-act="fOpen" data-id="${x.id}"><td class="num">${x.id}</td><td>${esc(T(x.r))}</td><td class="num">${x.t}</td><td class="num">${x.pax}</td><td>${esc(dn(app, x.d))}</td><td>${esc(T((app.s.v.find((v) => v.id === x.v) || { pl: B('—', '—') }).pl))}</td><td>${stp(x.s)}</td></tr>`).join(''))}`;
        },
        drivers(app) {
          return `<div class="x-cards">${app.s.d.map((d) => { const warn = d.lic < 60; return `<div class="dm-panel x-card"><span class="dm-avatar x-av">${esc(T(d.n)[0])}</span><b>${esc(T(d.n))}</b><small class="num" dir="ltr">${d.ph}</small><div>${d.st === 'off' ? pill('p2', L('إجازة', 'Off duty')) : pill('p5', L('متاح', 'Available'))} ${warn ? pill('pr', L('الرخصة تنتهي خلال', 'Licence expires in') + ' ' + d.lic + ' ' + L('يوم', 'd')) : ''}</div></div>`; }).join('')}</div>`;
        },
        vehicles(app) {
          return table([L('اللوحة', 'Plate'), L('النوع', 'Type'), L('المقاعد', 'Seats'), L('الصيانة القادمة بعد', 'Next service in'), L('الحالة', 'Status'), ''], app.s.v.map((v) => `<tr><td>${esc(T(v.pl))}</td><td>${esc(T(v.ty))}</td><td class="num">${v.seats}</td><td class="num">${num(v.toService)} ${L('كم', 'km')}</td><td>${v.maint ? pill('p2', L('في الصيانة', 'In service')) : v.toService < 1000 ? pill('p2', L('تحتاج صيانة قريباً', 'Service due soon')) : pill('p5', L('جاهزة', 'Ready'))}</td><td>${btn('fMaint', v.maint ? L('إنهاء الصيانة', 'Finish service') : L('إرسال للصيانة', 'Send to service'), `data-id="${v.id}"`, 'sm')}</td></tr>`).join(''));
        },
        report(app) {
          const t = app.s.t, c = (k) => t.filter((x) => x.s === k).length, pax = t.reduce((a, x) => a + x.pax, 0);
          return `<div class="dm-panel x-report"><h3>${L('تقرير التشغيل اليومي', 'Daily operations report')} <small>${fmtD(TODAY)}</small></h3>
            <p>${L(`إجمالي الرحلات ${t.length}: منتهية ${c('done')}، جارية ${c('run')}، متأخرة ${c('late')}، مجدولة ${c('sch')}.`, `Total trips ${t.length}: completed ${c('done')}, ongoing ${c('run')}, delayed ${c('late')}, scheduled ${c('sch')}.`)}</p>
            <p>${L(`إجمالي الركاب المنقولين والمجدولين: ${pax}.`, `Total passengers moved and scheduled: ${pax}.`)}</p>
            ${bars([{ l: L('منتهية', 'Completed'), v: c('done') }, { l: L('جارية', 'Ongoing'), v: c('run') }, { l: L('متأخرة', 'Delayed'), v: c('late') }, { l: L('مجدولة', 'Scheduled'), v: c('sch') }], true)}
            <div class="dm-actions">${btn('fDis', ic('pdf') + ' PDF')}${btn('fDis', ic('excel') + ' Excel')}</div></div>`;
        }
      },
      acts: {
        fOpen(app, el) {
          const x = app.s.t.find((t) => t.id === +el.dataset.id);
          app.drawer(`${ic('truck')} ${esc(T(x.r))}`, `<p>${stp(x.s)} · <span class="num">${x.t}</span> · ${x.pax} ${L('راكب', 'pax')}</p>
            ${field(L('السائق', 'Driver'), `<select class="dm-select" data-ch="fDriver" data-id="${x.id}">${app.s.d.map((d) => `<option value="${d.id}" ${x.d === d.id ? 'selected' : ''}>${esc(T(d.n))}</option>`).join('')}</select>`)}
            ${field(L('المركبة', 'Vehicle'), `<select class="dm-select" data-ch="fVeh" data-id="${x.id}">${app.s.v.map((v) => `<option value="${v.id}" ${x.v === v.id ? 'selected' : ''}>${esc(T(v.pl))} — ${esc(T(v.ty))}</option>`).join('')}</select>`)}
            <div class="dm-actions">${btn('fStatus', L('بدء الرحلة', 'Start'), `data-id="${x.id}" data-s="run"`, 'pri')}${btn('fStatus', L('إنهاء', 'Complete'), `data-id="${x.id}" data-s="done"`, 'ok')}${btn('fStatus', L('تسجيل تأخير', 'Mark delayed'), `data-id="${x.id}" data-s="late"`, 'gold')}</div>`);
        },
        fDriver(app, el) { app.s.t.find((t) => t.id === +el.dataset.id).d = +el.value; app.toast(L('تم تعيين السائق', 'Driver assigned')); },
        fVeh(app, el) { app.s.t.find((t) => t.id === +el.dataset.id).v = +el.value; app.toast(L('تم تعيين المركبة', 'Vehicle assigned')); },
        fStatus(app, el) { app.s.t.find((t) => t.id === +el.dataset.id).s = el.dataset.s; app.closeDrawer(); app.render(); app.toast(L('تم تحديث حالة الرحلة', 'Trip status updated')); },
        fNew(app) {
          const id = app.s.next++; app.s.t.push({ id, r: B('رحلة جديدة', 'New trip'), t: '18:00', pax: 12, d: 6, v: 5, s: 'sch' }); app.render(); app.toast(L('تمت إضافة رحلة', 'Trip added'));
        },
        fMaint(app, el) { const v = app.s.v.find((x) => x.id === +el.dataset.id); v.maint = !v.maint; if (!v.maint) v.toService = 10000; app.render(); },
        fDis(app) { app.toast(D.kit.disabledMsg(L('التصدير', 'Export'))); },
        closeDrawer(app) { app.closeDrawer(); }
      }
    };
  });

  /* =========================================================
     4) العقارات والإيجارات
     ========================================================= */
  D.register('realestate', () => {
    const TY = { apt: B('شقة', 'Apartment'), shop: B('محل', 'Shop'), off: B('مكتب', 'Office') };
    const units = () => {
      const r = rng(5), out = [], tenants = [['أحمد السيد', 'Ahmed El-Sayed'], ['منى فتحي', 'Mona Fathy'], ['شركة الريادة', 'Al-Riyada Co.'], ['محمود رمضان', 'Mahmoud Ramadan'], ['سارة منصور', 'Sara Mansour'], ['مكتب الأمل', 'Al-Amal Office'], ['حسن عبدالعزيز', 'Hassan Abdelaziz'], ['نورا جمال', 'Noura Gamal'], ['صيدلية النور', 'Al-Nour Pharmacy'], ['كافيه ركن القهوة', 'Coffee Corner Cafe'], ['ياسر الشافعي', 'Yasser El-Shafei'], ['دينا رشاد', 'Dina Rashad']];
      const plan = [['apt', 1, 6500, 'rent'], ['apt', 1, 6500, 'rent'], ['shop', 0, 14000, 'rent'], ['shop', 0, 12500, 'rent'], ['apt', 2, 7200, 'rent'], ['apt', 2, 7200, 'vacant'], ['off', 3, 9500, 'rent'], ['off', 3, 9500, 'rent'], ['apt', 3, 7800, 'rent'], ['apt', 3, 7800, 'maint'], ['off', 4, 10500, 'rent'], ['apt', 4, 8200, 'rent'], ['shop', 0, 16000, 'rent'], ['apt', 5, 8800, 'vacant'], ['apt', 5, 8800, 'rent'], ['off', 5, 11000, 'rent']];
      let k = 0;
      plan.forEach((p, i) => { const rented = p[3] === 'rent'; out.push({ code: 'A-' + (101 + i), ty: p[0], fl: p[1], rent: p[2], st: p[3], tn: rented ? B(tenants[k % tenants.length][0], tenants[k++ % tenants.length][1]) : null, end: rented ? [18, 40, 75, 120, 210, 300, 33, 90, 150, 260, 55, 340, 25, 180][i % 14] : 0, paid: rented ? r() > 0.3 : false }); });
      return out;
    };
    const stp = (u) => ({ rent: pill('p5', L('مؤجرة', 'Rented')), vacant: pill('p2', L('شاغرة', 'Vacant')), maint: pill('pr', L('صيانة', 'Maintenance')) }[u.st]);
    return {
      name: B('إدارة العقارات والإيجارات', 'Property & Rentals'), sub: B('ديمو تفاعلي', 'Interactive demo'), cls: 'x-re', mark: B('ع', 'R'),
      nav: [{ id: 'dash', icon: 'dash', label: B('اللوحة', 'Dashboard') }, { id: 'units', icon: 'home', label: B('الوحدات', 'Units') }, { id: 'leases', icon: 'key', label: B('العقود', 'Leases') }, { id: 'collect', icon: 'cash', label: B('التحصيل', 'Collections') }],
      state: () => ({ u: units() }),
      views: {
        dash(app) {
          const u = app.s.u, rented = u.filter((x) => x.st === 'rent'), occ = Math.round((rented.length / u.length) * 100);
          const exp = rented.reduce((a, x) => a + x.rent, 0), got = rented.filter((x) => x.paid).reduce((a, x) => a + x.rent, 0);
          const byTy = Object.keys(TY).map((k) => ({ l: T(TY[k]), v: Math.round((u.filter((x) => x.ty === k && x.st === 'rent').length / Math.max(1, u.filter((x) => x.ty === k).length)) * 100) }));
          return `<div class="dm-kpis">${kpi('home', u.length, L('إجمالي الوحدات', 'Total units'))}${kpi('chart', occ + '%', L('نسبة الإشغال', 'Occupancy'), 'g')}${kpi('cash', money(exp), L('الإيجار الشهري المتوقع', 'Expected monthly rent'))}${kpi('wallet', money(exp - got), L('متأخرات لم تُحصّل', 'Uncollected'), exp - got ? 'r' : '')}</div>
            <div class="dm-cols-2"><div class="dm-panel"><h3>${L('الإشغال حسب النوع %', 'Occupancy by type %')}</h3>${bars(byTy, true)}</div><div class="dm-panel"><h3>${L('عقود تنتهي قريباً', 'Leases ending soon')}</h3><ul class="x-alerts">${rented.filter((x) => x.end < 60).sort((a, b) => a.end - b.end).map((x) => `<li><span>${x.code} · ${esc(T(x.tn))}<small>${L('ينتهي بعد', 'Ends in')} ${x.end} ${L('يوم', 'days')}</small></span>${btn('rRenew', L('تجديد', 'Renew'), `data-c="${x.code}"`, 'sm')}</li>`).join('') || `<p class="dm-empty">—</p>`}</ul></div></div>`;
        },
        units(app) {
          return `<div class="dm-toolbar">${pill('p5', L('مؤجرة', 'Rented'))} ${pill('p2', L('شاغرة', 'Vacant'))} ${pill('pr', L('صيانة', 'Maintenance'))}<span class="dm-caption">${L('اضغط على وحدة لعرض التفاصيل', 'Click a unit for details')}</span></div>
            <div class="x-units">${app.s.u.map((x) => `<button type="button" class="x-unit ${x.st}" data-act="rOpen" data-c="${x.code}"><b>${x.code}</b><small>${T(TY[x.ty])} · ${L('دور', 'Floor')} ${x.fl}</small><span class="num">${num(x.rent)}</span><em>${x.tn ? esc(T(x.tn)) : (x.st === 'maint' ? L('تحت الصيانة', 'Under maintenance') : L('متاحة للإيجار', 'Available'))}</em></button>`).join('')}</div>`;
        },
        leases(app) {
          return table([L('الوحدة', 'Unit'), L('المستأجر', 'Tenant'), L('الإيجار', 'Rent'), L('تنتهي بعد', 'Ends in'), L('الحالة', 'Status'), ''], app.s.u.filter((x) => x.st === 'rent').map((x) => `<tr><td>${x.code}</td><td>${esc(T(x.tn))}</td><td class="num">${num(x.rent)}</td><td class="num">${x.end} ${L('يوم', 'd')}</td><td>${x.end < 45 ? pill('p2', L('ينتهي قريباً', 'Ending soon')) : pill('p5', L('ساري', 'Active'))}</td><td>${btn('rRenew', L('تجديد 12 شهر', 'Renew 12 mo'), `data-c="${x.code}"`, 'sm')}</td></tr>`).join(''));
        },
        collect(app) {
          const rows = app.s.u.filter((x) => x.st === 'rent');
          return `<p class="dm-caption" style="margin:0 0 12px">${L('إيجار الشهر الحالي', 'This month’s rent')}: <b class="num">${money(rows.filter((x) => x.paid).reduce((a, x) => a + x.rent, 0))}</b> / ${money(rows.reduce((a, x) => a + x.rent, 0))}</p>
            ${table([L('الوحدة', 'Unit'), L('المستأجر', 'Tenant'), L('المبلغ', 'Amount'), L('الحالة', 'Status'), ''], rows.map((x) => `<tr><td>${x.code}</td><td>${esc(T(x.tn))}</td><td class="num">${num(x.rent)}</td><td>${x.paid ? pill('p5', L('تم التحصيل', 'Collected')) : pill('pr', L('مستحق', 'Due'))}</td><td>${x.paid ? '' : btn('rPay', ic('check') + ' ' + L('تحصيل', 'Collect'), `data-c="${x.code}"`, 'ok sm')}</td></tr>`).join(''))}`;
        }
      },
      acts: {
        rOpen(app, el) {
          const x = app.s.u.find((u) => u.code === el.dataset.c);
          app.drawer(`${ic('home')} ${x.code}`, `<p>${stp(x)} · ${T(TY[x.ty])} · ${L('دور', 'Floor')} ${x.fl}</p><p>${L('الإيجار الشهري', 'Monthly rent')}: <b class="num">${money(x.rent)}</b></p>
            ${x.tn ? `<p>${L('المستأجر', 'Tenant')}: <b>${esc(T(x.tn))}</b></p><p>${L('ينتهي العقد بعد', 'Lease ends in')} <b>${x.end}</b> ${L('يوم', 'days')}</p><div class="dm-actions">${btn('rRenew', L('تجديد 12 شهر', 'Renew 12 months'), `data-c="${x.code}"`, 'pri')}</div>`
              : x.st === 'vacant' ? `<div class="dm-panel"><h3>${L('تأجير الوحدة', 'Rent this unit')}</h3>${field(L('اسم المستأجر', 'Tenant name'), '<input class="dm-input" id="rTn">')}${btn('rLet', ic('key') + ' ' + L('إنشاء عقد', 'Create lease'), `data-c="${x.code}"`, 'pri')}</div>` : `<div class="dm-actions">${btn('rFix', ic('check') + ' ' + L('إنهاء الصيانة', 'Finish maintenance'), `data-c="${x.code}"`, 'ok')}</div>`}`);
        },
        rRenew(app, el) { const x = app.s.u.find((u) => u.code === el.dataset.c); x.end += 365; app.closeDrawer(); app.render(); app.toast(L('تم تجديد العقد 12 شهراً', 'Lease renewed for 12 months')); },
        rPay(app, el) { app.s.u.find((u) => u.code === el.dataset.c).paid = true; app.render(); app.toast(L('تم تسجيل التحصيل', 'Collection recorded')); },
        rLet(app, el) { const n = app.$('#rTn').value.trim(); if (!n) { app.toast(L('اكتب اسم المستأجر', 'Enter the tenant name')); return; } const x = app.s.u.find((u) => u.code === el.dataset.c); x.st = 'rent'; x.tn = B(n, n); x.end = 365; x.paid = false; app.closeDrawer(); app.render(); app.toast(L('تم إنشاء العقد', 'Lease created')); },
        rFix(app, el) { app.s.u.find((u) => u.code === el.dataset.c).st = 'vacant'; app.closeDrawer(); app.render(); },
        closeDrawer(app) { app.closeDrawer(); }
      }
    };
  });
})();
