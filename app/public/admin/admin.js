/* لوحة التحكم — محرّر كامل لمحتوى الموقع (نصوص عربي/إنجليزي، مشاريع، مهارات، أقسام، صور، رسائل) */
(function () {
  'use strict';
  var app = document.getElementById('app');
  var C = null, dirty = false, tab = 'general', me = null;

  /* ---------- أدوات ---------- */
  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === 'class') el.className = v;
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
      else if (k === 'text') el.textContent = v;
      else if (k === 'value') el.value = v;
      else if (k === 'checked') el.checked = !!v;
      else el.setAttribute(k, v === true ? '' : v);
    });
    for (var i = 2; i < arguments.length; i++) add(el, arguments[i]);
    return el;
  }
  function add(el, c) { if (c == null || c === false) return; if (Array.isArray(c)) c.forEach(function (x) { add(el, x); }); else el.appendChild(typeof c === 'object' ? c : document.createTextNode(String(c))); }
  var toastT;
  function toast(msg, err) { var t = document.getElementById('toast'); t.textContent = msg; t.className = 'toast show' + (err ? ' err' : ''); clearTimeout(toastT); toastT = setTimeout(function () { t.className = 'toast'; }, 3200); }
  function api(method, url, body, form) {
    var o = { method: method, headers: { 'X-Requested-With': 'admin' }, credentials: 'same-origin' };
    if (form) o.body = body; else if (body !== undefined) { o.headers['Content-Type'] = 'application/json'; o.body = JSON.stringify(body); }
    return fetch('/admin/api' + url, o).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (r.status === 401 && url.indexOf('/login') !== 0 && url !== '/me') { me = null; render(); } j._status = r.status; return j; }); });
  }
  function tx(v) { if (v == null) return ''; if (typeof v === 'string' || typeof v === 'number') return String(v); return v.ar || v.en || ''; }
  function touch() { if (!dirty) { dirty = true; updateTop(); } }
  function rid(p) { return (p || 'x') + '-' + Math.random().toString(36).slice(2, 7); }
  window.addEventListener('beforeunload', function (e) { if (dirty) { e.preventDefault(); e.returnValue = ''; } });

  var ICONS = ['sys', 'web', 'phone', 'ai', 'support', 'users', 'table', 'ops', 'palette', 'code', 'db', 'shield', 'cart', 'share', 'layers', 'check', 'cap', 'lang', 'cal', 'car', 'pin', 'mail', 'send', 'globe', 'image', 'video', 'play', 'dl', 'arrow'].map(function (x) { return [x, x]; });
  var DEMOS = [['', 'بدون ديمو'], ['ops', 'مسار للعمليات'], ['hr', 'مسار HR'], ['app', 'وصال (تطبيق موبايل)'], ['web', 'لوحة تحكم موقع'], ['pos', 'المخازن ونقطة البيع'], ['invoices', 'الفواتير والمحاسبة'], ['fleet', 'النقل والرحلات'], ['realestate', 'العقارات والإيجار'], ['clinic', 'العيادات والمواعيد'], ['school', 'المدارس والحضور'], ['resto', 'تطبيق طلبات المطاعم'], ['eshop', 'المتجر الإلكتروني']];

  /* ---------- مولّد الحقول ---------- */
  var F = {
    text: function (k, l, o) { return Object.assign({ t: 'text', k: k, l: l }, o); },
    num: function (k, l, o) { return Object.assign({ t: 'num', k: k, l: l }, o); },
    bi: function (k, l, o) { return Object.assign({ t: 'bi', k: k, l: l }, o); },
    bita: function (k, l, o) { return Object.assign({ t: 'bita', k: k, l: l }, o); },
    lines: function (k, l, o) { return Object.assign({ t: 'lines', k: k, l: l }, o); },
    bilist: function (k, l, o) { return Object.assign({ t: 'bilist', k: k, l: l }, o); },
    bool: function (k, l, o) { return Object.assign({ t: 'bool', k: k, l: l }, o); },
    sel: function (k, l, opts, o) { return Object.assign({ t: 'sel', k: k, l: l, opts: opts }, o); },
    img: function (k, l, o) { return Object.assign({ t: 'img', k: k, l: l }, o); },
    imgs: function (k, l, o) { return Object.assign({ t: 'imgs', k: k, l: l }, o); },
    list: function (k, l, of, o) { return Object.assign({ t: 'list', k: k, l: l, of: of }, o); },
    group: function (k, l, of, o) { return Object.assign({ t: 'group', k: k, l: l, of: of }, o); }
  };

  function wrap(f, control, extra) {
    return h('div', { class: 'f' }, f.l ? h('div', { class: 'lab', text: f.l }) : null, control, f.help ? h('div', { class: 'help', text: f.help }) : null, extra);
  }
  function renderFields(fields, obj, host) { fields.forEach(function (f) { host.appendChild(renderField(f, obj)); }); return host; }

  function normBi(obj, k) { var v = obj[k]; if (typeof v === 'string') obj[k] = { ar: v, en: v }; else if (!v || typeof v !== 'object') obj[k] = { ar: '', en: '' }; return obj[k]; }
  function linesToText(a) { return (Array.isArray(a) ? a : []).map(function (x) { if (typeof x === 'string') return x; var ar = x.ar || '', en = x.en || ''; return ar === en ? ar : ar + ' | ' + en; }).join('\n'); }
  function textToLines(t) { return t.split('\n').map(function (l) { return l.trim(); }).filter(Boolean).map(function (l) { var i = l.indexOf(' | '); return i < 0 ? l : { ar: l.slice(0, i).trim(), en: l.slice(i + 3).trim() }; }); }
  function optList(f) { return typeof f.opts === 'function' ? f.opts() : f.opts; }

  function renderField(f, obj) {
    var v;
    switch (f.t) {
      case 'text': case 'num':
        return wrap(f, h('input', { type: f.t === 'num' ? 'number' : 'text', value: obj[f.k] == null ? '' : obj[f.k], dir: f.dir || null, placeholder: f.ph || null, oninput: function (e) { obj[f.k] = f.t === 'num' ? Number(e.target.value) : e.target.value; touch(); if (f.onchange) f.onchange(obj); } }));
      case 'bool':
        return h('div', { class: 'f' }, h('label', { class: 'check' }, h('input', { type: 'checkbox', checked: obj[f.k] !== false && !!obj[f.k] || (f.def && obj[f.k] == null), onchange: function (e) { obj[f.k] = e.target.checked; touch(); if (f.onchange) f.onchange(obj); } }), f.l), f.help ? h('div', { class: 'help', text: f.help }) : null);
      case 'sel':
        return wrap(f, h('select', { onchange: function (e) { obj[f.k] = e.target.value; touch(); if (f.onchange) f.onchange(obj); } }, optList(f).map(function (o) { return h('option', { value: o[0], text: o[1], selected: String(obj[f.k] == null ? '' : obj[f.k]) === String(o[0]) }); })));
      case 'bi': case 'bita':
        v = normBi(obj, f.k);
        return wrap(f, h('div', { class: 'bi' },
          ['ar', 'en'].map(function (lg) {
            var el = f.t === 'bi' ? h('input', { type: 'text', value: v[lg] || '', oninput: function (e) { v[lg] = e.target.value; touch(); if (f.onchange) f.onchange(obj); } }) : h('textarea', { rows: f.rows || 4, text: v[lg] || '', oninput: function (e) { v[lg] = e.target.value; touch(); if (f.onchange) f.onchange(obj); } });
            return h('div', { class: 'l ' + lg }, h('span', { text: lg === 'ar' ? 'عربي' : 'English' }), el);
          })));
      case 'lines':
        return wrap(f, h('textarea', { rows: f.rows || 5, text: linesToText(obj[f.k]), placeholder: 'كل سطر عنصر. للترجمة اكتب: عربي | English', oninput: function (e) { obj[f.k] = textToLines(e.target.value); touch(); } }), h('div', { class: 'help', text: 'كل سطر = عنصر. لو الاسم واحد في اللغتين اكتبه مرة واحدة، ولو مختلف اكتب: العربي | English' }));
      case 'bilist': return bilist(f, obj);
      case 'img': return imgField(f, obj);
      case 'imgs': return imgsField(f, obj);
      case 'list': return listField(f, obj);
      case 'group':
        if (!obj[f.k] || typeof obj[f.k] !== 'object') obj[f.k] = {};
        return h('div', { class: 'f' }, f.l ? h('div', { class: 'lab', text: f.l }) : null, renderFields(f.of, obj[f.k], h('div', { class: 'item' , style: 'padding:12px;background:var(--bg)' })));
    }
    return h('div');
  }

  /* قائمة نصوص ثنائية اللغة (فقرات) */
  function bilist(f, obj) {
    if (!Array.isArray(obj[f.k])) obj[f.k] = [];
    var host = h('div');
    function draw() {
      host.innerHTML = '';
      var arr = obj[f.k];
      arr.forEach(function (_, i) {
        var box = h('div', { class: 'card', style: 'padding:12px;margin-bottom:10px' });
        box.appendChild(renderField({ t: 'bita', k: i, l: 'فقرة ' + (i + 1), rows: 4 }, arr));
        box.appendChild(h('div', { class: 'row' }, h('button', { class: 'btn sm', type: 'button', text: '↑', onclick: function () { move(arr, i, -1); draw(); touch(); } }), h('button', { class: 'btn sm', type: 'button', text: '↓', onclick: function () { move(arr, i, 1); draw(); touch(); } }), h('button', { class: 'btn sm danger', type: 'button', text: 'حذف', onclick: function () { arr.splice(i, 1); draw(); touch(); } })));
        host.appendChild(box);
      });
      host.appendChild(h('button', { class: 'btn sm', type: 'button', text: '+ إضافة فقرة', onclick: function () { arr.push({ ar: '', en: '' }); draw(); touch(); } }));
    }
    draw();
    return wrap(f, host);
  }
  function move(arr, i, d) { var j = i + d; if (j < 0 || j >= arr.length) return; var t = arr[i]; arr[i] = arr[j]; arr[j] = t; }

  /* الصور */
  function isImg(p) { return /\.(png|jpe?g|webp|gif)(\?|$)/i.test(p || ''); }
  function imgField(f, obj) {
    var pv = h('div', { class: 'pv' });
    var inp = h('input', { type: 'text', dir: 'ltr', value: obj[f.k] || '', placeholder: 'assets/... أو uploads/...', oninput: function (e) { obj[f.k] = e.target.value.trim(); touch(); sync(); } });
    function sync() { var p = obj[f.k]; pv.style.backgroundImage = isImg(p) ? 'url("/' + encodeURI(p).replace(/"/g, '') + '")' : ''; pv.textContent = isImg(p) ? '' : (p ? 'ملف' : '—'); }
    sync();
    return wrap(f, h('div', { class: 'imgbox' }, pv, inp,
      h('button', { class: 'btn sm', type: 'button', text: 'اختيار / رفع', onclick: function () { pickMedia(f.kinds).then(function (p) { if (p != null) { obj[f.k] = p; inp.value = p; sync(); touch(); } }); } }),
      h('button', { class: 'btn sm danger', type: 'button', text: '✕', 'aria-label': 'مسح', onclick: function () { obj[f.k] = ''; inp.value = ''; sync(); touch(); } })));
  }
  function imgsField(f, obj) {
    if (!Array.isArray(obj[f.k])) obj[f.k] = [];
    var host = h('div');
    function draw() {
      host.innerHTML = '';
      var arr = obj[f.k];
      var grid = h('div', { class: 'imgs' });
      arr.forEach(function (src, i) {
        grid.appendChild(h('div', { class: 'im' }, h('img', { src: '/' + src, alt: '', loading: 'lazy' }), h('div', { class: 'ctl' },
          h('button', { class: 'btn sm', type: 'button', text: '→', title: 'قبل', onclick: function () { move(arr, i, -1); draw(); touch(); } }),
          h('button', { class: 'btn sm danger', type: 'button', text: '✕', onclick: function () { arr.splice(i, 1); draw(); touch(); } }),
          h('button', { class: 'btn sm', type: 'button', text: '←', title: 'بعد', onclick: function () { move(arr, i, 1); draw(); touch(); } }))));
      });
      host.appendChild(grid);
      host.appendChild(h('button', { class: 'btn sm', type: 'button', text: '+ إضافة صورة', onclick: function () { pickMedia(['img'], true).then(function (ps) { if (ps && ps.length) { ps.forEach(function (p) { arr.push(p); }); draw(); touch(); } }); } }));
    }
    draw();
    return wrap(f, host, h('div', { class: 'help', text: f.help || 'الترتيب هنا هو ترتيب ظهور الصور. اضغط على الأسهم للتحريك.' }));
  }

  /* قوائم العناصر القابلة للتكرار */
  function listField(f, obj) {
    if (!Array.isArray(obj[f.k])) obj[f.k] = [];
    var host = h('div'), open = new Set(f.openFirst === false ? [] : [0]);
    function draw() {
      host.innerHTML = '';
      var arr = obj[f.k], items = h('div', { class: 'items' });
      arr.forEach(function (it, i) {
        var title = h('span', { class: 't' });
        var pills = h('span');
        function upd() { title.textContent = (f.title ? f.title(it) : '') || ('عنصر ' + (i + 1)); pills.innerHTML = ''; (f.badges ? f.badges(it) : []).forEach(function (b) { pills.appendChild(h('span', { class: 'pill ' + (b[1] || ''), text: b[0], style: 'margin-inline-start:4px' })); }); }
        upd();
        var d = h('details', { class: 'item' + (it.visible === false ? ' hidden-item' : '') });
        if (open.has(i)) d.setAttribute('open', '');
        d.addEventListener('toggle', function () { if (d.open) open.add(i); else open.delete(i); });
        var ctl = h('span', { class: 'ctl' },
          h('button', { class: 'btn sm', type: 'button', text: '↑', title: 'أعلى', onclick: function (e) { e.preventDefault(); move(arr, i, -1); open.clear(); open.add(Math.max(0, i - 1)); draw(); touch(); } }),
          h('button', { class: 'btn sm', type: 'button', text: '↓', title: 'أسفل', onclick: function (e) { e.preventDefault(); move(arr, i, 1); open.clear(); open.add(Math.min(arr.length - 1, i + 1)); draw(); touch(); } }),
          h('button', { class: 'btn sm', type: 'button', text: 'نسخ', onclick: function (e) { e.preventDefault(); var c = JSON.parse(JSON.stringify(it)); if (c.id) c.id = rid('copy'); arr.splice(i + 1, 0, c); open.clear(); open.add(i + 1); draw(); touch(); } }),
          h('button', { class: 'btn sm danger', type: 'button', text: 'حذف', onclick: function (e) { e.preventDefault(); if (confirm('حذف العنصر ده؟ (تقدر ترجع نسخة قديمة من تبويب النسخ الاحتياطي)')) { arr.splice(i, 1); if (f.onRemove) f.onRemove(it); open.clear(); draw(); touch(); } } }));
        d.appendChild(h('summary', null, h('span', { class: 'n', text: i + 1 }), title, pills, ctl));
        var body = renderFields(f.of, it, h('div', { class: 'body' }));
        body.addEventListener('input', upd); body.addEventListener('change', upd);
        d.appendChild(body); items.appendChild(d);
      });
      host.appendChild(items);
      if (!arr.length) host.appendChild(h('div', { class: 'empty', text: 'لا يوجد عناصر بعد.' }));
      host.appendChild(h('button', { class: 'btn', type: 'button', text: '+ ' + (f.addLabel || 'إضافة'), onclick: function () { var n = f.blank ? f.blank() : {}; arr.push(n); if (f.onAdd) f.onAdd(n); open.clear(); open.add(arr.length - 1); draw(); touch(); } }));
    }
    draw();
    return h('div', { class: 'f' }, f.l ? h('div', { class: 'lab', text: f.l }) : null, host);
  }

  /* ---------- نافذة اختيار/رفع الوسائط ---------- */
  function pickMedia(kinds, multi) {
    return new Promise(function (resolve) {
      var chosen = [];
      var bd = h('div', { class: 'bd' }), modal = h('div', { class: 'modal' });
      function done(v) { modal.remove(); resolve(v); }
      modal.appendChild(h('div', { class: 'box' }, h('div', { class: 'hd' }, h('b', { text: multi ? 'اختر صورة أو أكتر' : 'اختر ملف' }), h('span', { class: 'row' }, multi ? h('button', { class: 'btn pri sm', type: 'button', text: 'تم', onclick: function () { done(chosen); } }) : null, h('button', { class: 'btn sm', type: 'button', text: 'إغلاق', onclick: function () { done(multi ? [] : null); } }))), bd));
      modal.addEventListener('click', function (e) { if (e.target === modal) done(multi ? [] : null); });
      document.body.appendChild(modal);
      function load() {
        bd.innerHTML = 'جارٍ التحميل…';
        api('GET', '/media').then(function (m) {
          bd.innerHTML = '';
          bd.appendChild(uploader(function () { load(); }));
          function grid(title, list) {
            if (!list.length) return;
            bd.appendChild(h('h4', { text: title }));
            bd.appendChild(h('div', { class: 'pick' }, list.map(function (x) {
              var img = isImg(x.url);
              return h('button', { type: 'button', title: x.url, onclick: function (e) { if (multi) { var i = chosen.indexOf(x.url); if (i < 0) { chosen.push(x.url); e.currentTarget.style.borderColor = 'var(--gold)'; } else { chosen.splice(i, 1); e.currentTarget.style.borderColor = ''; } } else done(x.url); } }, img ? h('img', { src: '/' + x.url, alt: '', loading: 'lazy' }) : h('div', { class: 'empty', text: x.name.split('.').pop().toUpperCase() }), h('span', { text: x.name }));
            })));
          }
          var up = m.uploads || [], bu = m.bundled || [];
          if (kinds && kinds[0] === 'img') { up = up.filter(function (x) { return isImg(x.url); }); bu = bu.filter(function (x) { return isImg(x.url); }); }
          grid('الملفات المرفوعة', up); grid('ملفات الموقع الأساسية', bu);
        });
      }
      load();
    });
  }
  function uploader(after) {
    var input = h('input', { type: 'file', multiple: true, accept: 'image/png,image/jpeg,image/webp,image/gif,application/pdf,video/mp4,.xlsx', style: 'display:none' });
    var box = h('div', { class: 'drop' }, 'اسحب الملفات هنا أو ', h('button', { class: 'btn sm', type: 'button', text: 'اختر من جهازك', onclick: function () { input.click(); } }), h('div', { class: 'help', text: 'صور PNG / JPG / WEBP / GIF، وPDF، وفيديو MP4، وExcel. أقصى حجم 40 ميجا للملف.' }), input);
    function send(files) {
      if (!files.length) return;
      var fd = new FormData(); Array.prototype.forEach.call(files, function (f) { fd.append('file', f); });
      toast('جارٍ الرفع…');
      api('POST', '/upload', fd, true).then(function (r) { if (r.ok) { toast('تم رفع ' + r.files.length + ' ملف'); after && after(r.files); } else toast(r.message || 'فشل الرفع', true); });
    }
    input.addEventListener('change', function () { send(input.files); input.value = ''; });
    box.addEventListener('dragover', function (e) { e.preventDefault(); box.classList.add('over'); });
    box.addEventListener('dragleave', function () { box.classList.remove('over'); });
    box.addEventListener('drop', function (e) { e.preventDefault(); box.classList.remove('over'); send(e.dataTransfer.files); });
    return box;
  }

  /* ---------- التبويبات ---------- */
  var pjCats = function () { return ((C.projects && C.projects.cats) || []).map(function (c) { return [c.id, tx(c.label)]; }); };
  var T = F.text, BI = F.bi, BT = F.bita, LN = F.lines, CK = F.bool, SEL = F.sel, IMG = F.img, LIST = F.list;
  var secHead = function () { return [BI('kicker', 'العنوان الصغير فوق القسم'), BI('title', 'عنوان القسم'), BI('sub', 'سطر توضيحي تحت العنوان')]; };

  var TABS = [
    { id: 'general', label: 'الإعدادات العامة', cards: function () { return [
      ['الهوية والعنوان الرئيسي', 'اللي بيظهر في أول الصفحة.', C.settings, [BI('name', 'الاسم الكامل'), BI('brand', 'الاسم المختصر (فوق في القائمة)'), T('initials', 'الحروف في اللوجو (حرفين)', { ph: 'AK' }), BI('hello', 'جملة الترحيب'), BI('role', 'المسمى الوظيفي'), BT('lead', 'الجملة التعريفية الكبيرة', { rows: 4 }), BI('availLabel', 'عنوان «متاح للعمل»'), LN('modes', 'أنماط العمل المتاحة (شرائح)'), BI('location', 'المكان'), LIST('heroChips', 'الشرائح المعلّقة جنب الصورة (حد أقصى 2)', [SEL('icon', 'الأيقونة', ICONS), BI('text', 'النص')], { openFirst: false, title: function (i) { return tx(i.text); } })]],
      ['الصور والسيرة الذاتية', null, C.settings, [IMG('photo', 'صورتك الشخصية', { kinds: ['img'] }), IMG('ogImage', 'صورة مشاركة الرابط (1200×630) — بتظهر على واتساب ولينكد إن', { kinds: ['img'] }), F.group('cv', 'ملفات السيرة الذاتية', [IMG('ar', 'العربي (PDF)'), IMG('en', 'الإنجليزي (PDF)')])]],
      ['بيانات التواصل', 'بتظهر في الأزرار وقسم التواصل.', C.settings, [T('email', 'الإيميل', { dir: 'ltr' }), T('whatsapp', 'رقم واتساب بالكود الدولي من غير + (مثال: 201552084471)', { dir: 'ltr' }), T('linkedin', 'رابط LinkedIn', { dir: 'ltr' }), T('github', 'رابط GitHub (اتركه فاضي لإخفائه)', { dir: 'ltr' }), T('siteUrl', 'رابط الموقع الكامل (مثال: https://ahmedalkholy.com)', { dir: 'ltr', help: 'اختياري. لو فاضي بياخد الدومين تلقائياً.' })]],
      ['محركات البحث ومعاينة الرابط', 'العنوان والوصف اللي بيظهروا في جوجل وعند مشاركة الرابط.', C.settings.seo ? C.settings : (C.settings.seo = {}, C.settings), [F.group('seo', null, [BI('title', 'عنوان الصفحة'), BT('description', 'الوصف', { rows: 3 })])]],
      ['رسائل واتساب والديمو', 'نصوص جاهزة بتتبعت مع أزرار واتساب، وتنبيه الديمو.', C.settings, [F.group('waMessages', 'رسائل واتساب', [BI('general', 'الرسالة العامة'), BI('project', 'رسالة المشروع (اكتب {name} مكان اسم المشروع)')]), BI('demoNotice', 'تنبيه الديمو للأنظمة الحقيقية'), BI('demoNoticeSample', 'تنبيه الديمو للنماذج التوضيحية'), BI('footer', 'سطر التذييل (تحت الصفحة)')]]
    ]; } },
    { id: 'stats', label: 'الأرقام السريعة', cards: function () { return [['الأرقام تحت الصفحة الرئيسية', 'اكتب أرقام حقيقية بس.', C, [LIST('stats', null, [BI('value', 'الرقم'), BI('label', 'الوصف')], { title: function (i) { return tx(i.value) + ' — ' + tx(i.label); }, openFirst: false, addLabel: 'إضافة رقم', blank: function () { return { value: { ar: '', en: '' }, label: { ar: '', en: '' } }; } })]]]; } },
    { id: 'about', label: 'نبذة', cards: function () { return [['قسم «نبذة»', null, C.about, secHead().slice(0, 2).concat([F.bilist('paragraphs', 'الفقرات'), CK('highlightLast', 'إبراز الفقرة الأخيرة (مربع بحافة ذهبية)')])], ['معلومات سريعة', 'الخبرة، التعليم، اللغات…', C.about, [LIST('facts', null, [SEL('icon', 'الأيقونة', ICONS), BI('title', 'العنوان'), BI('text', 'النص')], { title: function (i) { return tx(i.title); }, openFirst: false, addLabel: 'إضافة معلومة', blank: function () { return { icon: 'check', title: { ar: '', en: '' }, text: { ar: '', en: '' } }; } })]]]; } },
    { id: 'process', label: 'طريقة العمل', cards: function () { return [['قسم «طريقة العمل»', 'لو مش عايزه، اخفيه من تبويب «ترتيب الأقسام».', C.process, secHead().concat([LIST('steps', 'الخطوات', [BI('title', 'العنوان'), BI('text', 'الشرح')], { title: function (i) { return tx(i.title); }, openFirst: false, addLabel: 'إضافة خطوة', blank: function () { return { title: { ar: '', en: '' }, text: { ar: '', en: '' } }; } })])]]; } },
    { id: 'services', label: 'الخدمات', cards: function () { return [['قسم «الخدمات»', null, C.services, secHead().concat([LIST('items', 'الخدمات', [CK('visible', 'ظاهرة', { def: true }), SEL('icon', 'الأيقونة', ICONS), BI('title', 'اسم الخدمة'), BT('text', 'الوصف', { rows: 3 }), LN('tags', 'الشرائح (مثال: عمل حر | Freelance)'), CK('goldFirst', 'الشريحة الأولى بلون ذهبي')], { title: function (i) { return tx(i.title); }, badges: function (i) { return i.visible === false ? [['مخفية']] : []; }, openFirst: false, addLabel: 'إضافة خدمة', blank: function () { return { visible: true, icon: 'sys', title: { ar: 'خدمة جديدة', en: 'New service' }, text: { ar: '', en: '' }, tags: [] }; } })])]]; } },
    { id: 'projects', label: 'المشاريع', cards: function () { return [
      ['قسم «المشاريع»', 'العنوان وتصنيفات الفلتر وعناوين المجموعات.', C.projects, secHead().concat([LIST('cats', 'تصنيفات الفلتر', [T('id', 'المعرّف (إنجليزي من غير مسافات)', { dir: 'ltr' }), BI('label', 'الاسم')], { title: function (i) { return tx(i.label); }, openFirst: false, addLabel: 'إضافة تصنيف', blank: function () { return { id: rid('cat'), label: { ar: 'تصنيف جديد', en: 'New' } }; } }), F.group('groupTitles', 'عناوين المجموعات داخل القسم', [BI('feature', 'الأنظمة والتطبيقات الرئيسية'), BI('showcase', 'النماذج التوضيحية'), BI('site', 'مواقع الشركات'), BI('mini', 'أعمال أخرى')])])],
      ['كل المشاريع', 'أضف أو عدّل أو رتّب أو اخفِ أي مشروع. «النوع» بيحدد شكل البطاقة: رئيسي (كبير بديمو)، نموذج (بطاقة بصورة)، موقع (بطاقة موقع)، صغير (نص بس).', C.projects, [LIST('items', null, [
        CK('visible', 'ظاهر في الموقع', { def: true }),
        SEL('kind', 'شكل البطاقة', [['feature', 'رئيسي (كبير مع ديمو)'], ['showcase', 'نموذج توضيحي (بطاقة بصورة)'], ['site', 'موقع شركة'], ['mini', 'عمل صغير (نص وصور)']]),
        SEL('cat', 'التصنيف', pjCats), SEL('status', 'الحالة', [['live', 'منشور ويعمل'], ['sample', 'نموذج توضيحي'], ['dev', 'قيد التطوير'], ['none', 'بدون شارة']]),
        T('id', 'المعرّف (إنجليزي من غير مسافات)', { dir: 'ltr', help: 'بيُستخدم كرابط داخل الصفحة وفي رسالة واتساب. ماتغيّروش بعد النشر لو الرابط متوزع.' }),
        BI('title', 'اسم المشروع'), BI('alt', 'اسم ثانوي (اختياري)'), BI('type', 'نوع المشروع (شريحة)'), BI('badge', 'نص الشارة (اتركه فاضي للافتراضي)'),
        BT('text', 'الوصف', { rows: 4 }), LN('features', 'المميزات (سطر لكل ميزة)', { rows: 6 }), T('tech', 'التقنيات (مفصولة بفاصلة)', { dir: 'ltr' }),
        SEL('demo', 'الديمو التفاعلي', DEMOS), IMGS(), IMG('video', 'فيديو (MP4) — اختياري', { kinds: ['file'] }),
        T('link', 'رابط الموقع/المشروع', { dir: 'ltr' }), BI('linkLabel', 'نص زر الرابط (اختياري)'), T('apk', 'رابط تحميل APK (اختياري)', { dir: 'ltr' }), IMG('file', 'ملف للتحميل (Excel/PDF)', { kinds: ['file'] }), BI('fileLabel', 'نص زر الملف'), SEL('icon', 'أيقونة (للعمل الصغير)', ICONS)
      ], { title: function (i) { return tx(i.title) || 'مشروع جديد'; }, openFirst: false, addLabel: 'إضافة مشروع', badges: function (i) { var b = []; if (i.visible === false) b.push(['مخفي', 'warn']); b.push([({ feature: 'رئيسي', showcase: 'نموذج', site: 'موقع', mini: 'صغير' })[i.kind || 'feature'] || '']); if (i.status === 'sample') b.push(['نموذج توضيحي', 'warn']); return b; }, blank: function () { return { id: rid('project'), visible: true, kind: 'showcase', cat: 'sample', status: 'sample', title: { ar: 'مشروع جديد', en: 'New project' }, alt: { ar: '', en: '' }, type: { ar: '', en: '' }, text: { ar: '', en: '' }, features: [], tech: '', demo: '', images: [], link: '' }; } })]]
    ]; } },
    { id: 'experience', label: 'الخبرات', cards: function () { return [['قسم «الخبرات»', null, C.experience, secHead().slice(0, 2).concat([LIST('items', 'الوظائف', [CK('visible', 'ظاهرة', { def: true }), BI('date', 'الفترة'), BI('role', 'المسمى'), BI('org', 'الجهة'), LN('bullets', 'الإنجازات (سطر لكل نقطة)', { rows: 7 })], { title: function (i) { return tx(i.role); }, badges: function (i) { return i.visible === false ? [['مخفية', 'warn']] : []; }, addLabel: 'إضافة وظيفة', blank: function () { return { visible: true, date: { ar: '', en: '' }, role: { ar: 'وظيفة جديدة', en: 'New role' }, org: { ar: '', en: '' }, bullets: [] }; } })])]]; } },
    { id: 'skills', label: 'المهارات', cards: function () { return [['قسم «المهارات»', 'كل مجموعة فيها شرائح. أضف مهارات جديدة أو احذف أي مهارة مش عايز تظهر.', C.skills, secHead().slice(0, 2).concat([LIST('groups', 'مجموعات المهارات', [CK('visible', 'ظاهرة', { def: true }), CK('highlight', 'إبراز المجموعة (لون مميز)'), SEL('icon', 'الأيقونة', ICONS), BI('title', 'اسم المجموعة'), LN('items', 'المهارات (سطر لكل مهارة، أو: عربي | English)', { rows: 9 })], { title: function (i) { return tx(i.title) + ' (' + ((i.items || []).length) + ')'; }, badges: function (i) { return i.visible === false ? [['مخفية', 'warn']] : []; }, openFirst: false, addLabel: 'إضافة مجموعة', blank: function () { return { visible: true, icon: 'check', title: { ar: 'مجموعة جديدة', en: 'New group' }, items: [] }; } })])]]; } },
    { id: 'contact', label: 'قسم التواصل', cards: function () { return [['قسم «التواصل»', null, C.contact, secHead().concat([BI('formTitle', 'عنوان النموذج'), LN('topics', 'مواضيع الرسالة (سطر لكل موضوع)')])]]; } },
    { id: 'custom', label: 'أقسام إضافية', cards: function () { return [['أقسام جديدة تضيفها بنفسك', 'أنشئ أي قسم (شهادات، عملاء، أخبار، مدونة…). بعد الإنشاء هيظهر في الموقع وفي «ترتيب الأقسام».', C, [LIST('custom', null, [
      T('id', 'المعرّف (إنجليزي من غير مسافات)', { dir: 'ltr' }), BI('kicker', 'العنوان الصغير'), BI('title', 'عنوان القسم'), BI('sub', 'سطر توضيحي'),
      SEL('layout', 'شكل القسم', [['text', 'نص (مع صورة اختيارية)'], ['cards', 'بطاقات'], ['gallery', 'معرض صور']]), CK('alt', 'خلفية مميزة'),
      BT('body', 'النص (للشكل «نص»). سطر فاضي = فقرة جديدة، وسطر يبدأ بـ «- » = نقطة', { rows: 7 }), IMG('image', 'صورة (للشكل «نص»)', { kinds: ['img'] }),
      LIST('cards', 'البطاقات (للشكل «بطاقات»)', [SEL('icon', 'الأيقونة', ICONS), BI('title', 'العنوان'), BI('text', 'النص'), T('link', 'رابط (اختياري)', { dir: 'ltr' }), BI('linkLabel', 'نص الزر')], { openFirst: false, title: function (i) { return tx(i.title); }, addLabel: 'إضافة بطاقة', blank: function () { return { icon: 'check', title: { ar: '', en: '' }, text: { ar: '', en: '' } }; } }),
      F.imgs('images', 'الصور (للشكل «معرض صور»)')
    ], { title: function (i) { return tx(i.title) || 'قسم جديد'; }, openFirst: false, addLabel: 'إضافة قسم', blank: function () { return { id: rid('sec'), kicker: { ar: '', en: '' }, title: { ar: 'قسم جديد', en: 'New section' }, sub: { ar: '', en: '' }, layout: 'text', body: { ar: '', en: '' }, cards: [], images: [] }; }, onAdd: function () { ensureLayout(); }, onRemove: function (n) { C.layout.sections = C.layout.sections.filter(function (s) { return s.id !== 'c:' + n.id; }); } })]]]; } },
    { id: 'layout', label: 'ترتيب الأقسام', custom: layoutTab },
    { sep: true },
    { id: 'media', label: 'الصور والملفات', custom: mediaTab },
    { id: 'messages', label: 'الرسائل', custom: messagesTab, badge: function () { return window.__unread || 0; } },
    { id: 'account', label: 'الحساب والنسخ الاحتياطي', custom: accountTab }
  ];
  function IMGS() { return F.imgs('images', 'صور المشروع (لقطات الشاشة)'); }

  function ensureLayout() {
    if (!C.layout) C.layout = { sections: [] };
    var seen = {}; C.layout.sections = C.layout.sections.filter(function (s) { if (!s || !s.id || seen[s.id]) return false; seen[s.id] = 1; return true; });
    var ids = C.layout.sections.map(function (s) { return s.id; });
    ['stats', 'about', 'process', 'services', 'projects', 'experience', 'skills', 'contact'].forEach(function (id) { if (ids.indexOf(id) < 0) C.layout.sections.push({ id: id, visible: true, nav: id !== 'stats' }); });
    (C.custom || []).forEach(function (c) { if (ids.indexOf('c:' + c.id) < 0) C.layout.sections.push({ id: 'c:' + c.id, visible: true, nav: true, label: c.title }); });
  }

  /* ترتيب الأقسام */
  function layoutTab(host) {
    ensureLayout();
    var names = { stats: 'الأرقام السريعة', about: 'نبذة', process: 'طريقة العمل', services: 'الخدمات', projects: 'المشاريع', experience: 'الخبرات', skills: 'المهارات', contact: 'التواصل' };
    host.appendChild(h('div', { class: 'tip', text: 'من هنا تحدد ترتيب الأقسام في الصفحة، وإظهار أو إخفاء أي قسم، وهل يظهر في القائمة العلوية وباسم إيه. الرئيسية (الصورة والاسم) دايماً أول الصفحة.' }));
    var card = h('div', { class: 'card' }); host.appendChild(card);
    function draw() {
      card.innerHTML = '';
      var arr = C.layout.sections, items = h('div', { class: 'items' });
      arr.forEach(function (s, i) {
        var cst = s.id.indexOf('c:') === 0; var nm = cst ? ((C.custom || []).filter(function (c) { return 'c:' + c.id === s.id; })[0] || {}) : null;
        var name = cst ? (tx(nm.title) || s.id) + ' (قسم إضافي)' : names[s.id] || s.id;
        if (!s.label || typeof s.label !== 'object') s.label = { ar: '', en: '' };
        var d = h('div', { class: 'item', style: 'padding:12px' });
        d.appendChild(h('div', { class: 'row', style: 'justify-content:space-between' }, h('b', { text: (i + 1) + '. ' + name }), h('span', { class: 'row' },
          h('button', { class: 'btn sm', type: 'button', text: '↑', onclick: function () { move(arr, i, -1); draw(); touch(); } }), h('button', { class: 'btn sm', type: 'button', text: '↓', onclick: function () { move(arr, i, 1); draw(); touch(); } }))));
        d.appendChild(h('div', { class: 'row', style: 'margin:8px 0' }, h('label', { class: 'check' }, h('input', { type: 'checkbox', checked: s.visible !== false, onchange: function (e) { s.visible = e.target.checked; touch(); } }), 'ظاهر'), h('label', { class: 'check' }, h('input', { type: 'checkbox', checked: !!s.nav, onchange: function (e) { s.nav = e.target.checked; touch(); } }), 'يظهر في القائمة العلوية')));
        d.appendChild(renderField(BI('label', 'الاسم في القائمة'), s));
        items.appendChild(d);
      });
      card.appendChild(items);
    }
    draw();
  }

  /* الوسائط */
  function mediaTab(host) {
    var list = h('div'); host.appendChild(uploader(function () { load(); })); host.appendChild(list);
    function load() {
      list.innerHTML = 'جارٍ التحميل…';
      api('GET', '/media').then(function (m) {
        list.innerHTML = '';
        var card = h('div', { class: 'card' }, h('h3', { text: 'الملفات المرفوعة (' + (m.uploads || []).length + ')' }), h('p', { class: 'hint', text: 'انسخ المسار والصقه في أي خانة، أو اخترها بزر «اختيار / رفع» جوه المشروع.' }));
        if (!(m.uploads || []).length) card.appendChild(h('div', { class: 'empty', text: 'لسه ماترفعتش أي ملفات.' }));
        card.appendChild(h('div', { class: 'imgs' }, (m.uploads || []).map(function (x) {
          return h('div', { class: 'im' }, isImg(x.url) ? h('img', { src: '/' + x.url, alt: '', loading: 'lazy' }) : h('div', { class: 'empty', text: x.name.split('.').pop().toUpperCase() }), h('div', { style: 'font-size:.7rem;padding:2px 6px;direction:ltr;overflow:hidden;text-overflow:ellipsis;white-space:nowrap', text: x.name }), h('div', { class: 'ctl' },
            h('button', { class: 'btn sm', type: 'button', text: 'نسخ المسار', onclick: function () { (navigator.clipboard ? navigator.clipboard.writeText(x.url) : Promise.reject()).then(function () { toast('اتنسخ: ' + x.url); }).catch(function () { prompt('انسخ المسار:', x.url); }); } }),
            h('button', { class: 'btn sm danger', type: 'button', text: 'حذف', onclick: function () { if (confirm('حذف الملف نهائياً؟ لو مستخدم في الموقع هيختفي.')) api('DELETE', '/media/' + encodeURIComponent(x.name)).then(function () { load(); }); } })));
        })));
        list.appendChild(card);
      });
    }
    load();
  }

  /* الرسائل */
  function messagesTab(host) {
    host.textContent = 'جارٍ التحميل…';
    api('GET', '/messages').then(function (r) {
      host.innerHTML = '';
      var ms = r.messages || []; window.__unread = ms.filter(function (m) { return !m.read; }).length; renderSide();
      if (!ms.length) { host.appendChild(h('div', { class: 'empty', text: 'مفيش رسائل لسه. أي رسالة تتبعت من نموذج «إرسال مباشر» في الموقع هتظهر هنا.' })); return; }
      ms.forEach(function (m) {
        var wa = /^[+\d][\d\s+()-]{7,}$/.test(m.contact || '') ? 'https://wa.me/' + m.contact.replace(/\D/g, '') : null;
        var mail = /@/.test(m.contact || '') ? 'mailto:' + m.contact : null;
        host.appendChild(h('div', { class: 'msg' + (m.read ? '' : ' unread') }, h('div', { class: 'meta' }, h('b', { text: m.name }), m.topic ? h('span', { class: 'pill', text: m.topic }) : null, h('span', { text: new Date(m.time).toLocaleString('ar-EG') }), m.contact ? h('span', { dir: 'ltr', text: m.contact }) : null), h('p', { text: m.message }),
          h('div', { class: 'row' }, wa ? h('a', { class: 'btn sm', href: wa, target: '_blank', rel: 'noopener', text: 'رد على واتساب' }) : null, mail ? h('a', { class: 'btn sm', href: mail, text: 'رد بالإيميل' }) : null, !m.read ? h('button', { class: 'btn sm', type: 'button', text: 'تمت القراءة', onclick: function () { api('POST', '/messages/' + m.id + '/read', {}).then(function () { messagesTab((host.innerHTML = '', host)); }); } }) : null, h('button', { class: 'btn sm danger', type: 'button', text: 'حذف', onclick: function () { if (confirm('حذف الرسالة؟')) api('DELETE', '/messages/' + m.id).then(function () { host.innerHTML = ''; messagesTab(host); }); } }))));
      });
    });
  }


  /* التحقق بخطوتين */
  function twofaCard(host) {
    var box = h('div', { class: 'card' }); host.appendChild(box);
    function head(extra) { box.innerHTML = ''; box.appendChild(h('h3', null, 'التحقق بخطوتين (2FA) ', extra || '')); }
    function showCodes(codes) {
      var txt = codes.join('\n');
      box.appendChild(h('div', { class: 'tip' }, h('b', { text: 'أكواد الاسترجاع — احفظها دلوقتي في مكان آمن!' }), h('p', { text: 'كل كود بيشتغل مرة واحدة بدل كود الموبايل لو ضاع. مش هتظهر تاني.' }), h('pre', { dir: 'ltr', style: 'font-size:1rem;line-height:1.9;margin:8px 0', text: txt }),
        h('div', { class: 'row' }, h('button', { class: 'btn sm', type: 'button', text: 'نسخ', onclick: function () { (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(function () { toast('اتنسخت'); }).catch(function () { prompt('انسخ الأكواد:', txt); }); } }), h('button', { class: 'btn sm', type: 'button', text: 'تنزيل كملف', onclick: function () { var a = h('a', { href: URL.createObjectURL(new Blob([txt], { type: 'text/plain' })), download: 'recovery-codes.txt' }); document.body.appendChild(a); a.click(); a.remove(); } }))));
    }
    function draw() {
      head();
      api('GET', '/2fa').then(function (st) {
        if (!st.ok) return;
        if (st.enabled) {
          head(h('span', { class: 'pill ok', text: 'مفعّل' }));
          box.appendChild(h('p', { class: 'hint', text: 'الدخول بيطلب كود من تطبيق المصادقة بعد كلمة المرور. أكواد الاسترجاع المتبقية: ' + st.recoveryLeft }));
          var code = h('input', { type: 'text', inputmode: 'numeric', autocomplete: 'off', dir: 'ltr', placeholder: 'كود من التطبيق (6 أرقام)' }), pass = h('input', { type: 'password', autocomplete: 'current-password', placeholder: 'كلمة المرور (للتعطيل فقط)' });
          box.appendChild(h('div', { class: 'grid2' }, h('div', { class: 'f' }, h('div', { class: 'lab', text: 'كود التحقق الحالي' }), code), h('div', { class: 'f' }, h('div', { class: 'lab', text: 'كلمة المرور' }), pass)));
          box.appendChild(h('div', { class: 'row' },
            h('button', { class: 'btn sm', type: 'button', text: 'توليد أكواد استرجاع جديدة', onclick: function () { api('POST', '/2fa/recovery', { code: code.value }).then(function (r) { if (r.ok) { draw2(r.recovery); } else toast(r.message || 'فشل', true); }); } }),
            h('button', { class: 'btn sm danger', type: 'button', text: 'تعطيل التحقق بخطوتين', onclick: function () { if (confirm('تعطيل الحماية بخطوتين؟')) api('POST', '/2fa/disable', { pass: pass.value, code: code.value }).then(function (r) { if (r.ok) { toast('اتعطّل'); draw(); } else toast(r.message || 'فشل', true); }); } })));
        } else {
          head(h('span', { class: 'pill warn', text: 'غير مفعّل' }));
          box.appendChild(h('p', { class: 'hint', text: 'بيضيف حماية قوية: حتى لو حد عرف كلمة المرور، مش هيدخل من غير كود من موبايلك. بيشتغل مع Google Authenticator وMicrosoft Authenticator وAuthy.' }));
          box.appendChild(h('button', { class: 'btn pri', type: 'button', text: 'تفعيل التحقق بخطوتين', onclick: setup }));
        }
      });
    }
    function draw2(codes) { draw(); setTimeout(function () { showCodes(codes); }, 400); }
    function setup() {
      api('POST', '/2fa/setup', {}).then(function (r) {
        if (!r.ok) return toast(r.message || 'فشل', true);
        head();
        var code = h('input', { type: 'text', inputmode: 'numeric', autocomplete: 'off', dir: 'ltr', placeholder: '123456', style: 'max-width:200px;text-align:center;font-size:1.2rem;letter-spacing:.2em' });
        var qr = h('div', { style: 'width:210px;height:210px;background:#fff;padding:6px;border-radius:12px;border:1px solid var(--border)' }); qr.innerHTML = r.svg;
        box.appendChild(h('ol', { style: 'line-height:2;padding-inline-start:20px;margin:0 0 12px' }, h('li', { text: 'نزّل تطبيق مصادقة على موبايلك (Google Authenticator مثلاً).' }), h('li', { text: 'اختار «إضافة حساب» ثم «مسح رمز QR»، وصوّر الرمز اللي تحت.' }), h('li', { text: 'اكتب الكود المكوّن من 6 أرقام اللي ظهر في التطبيق، واضغط «تأكيد».' })));
        box.appendChild(h('div', { class: 'row', style: 'align-items:flex-start' }, qr, h('div', null, h('p', { class: 'help', text: 'لو مش قادر تصوّر الرمز، اكتب المفتاح ده يدوياً في التطبيق:' }), h('code', { dir: 'ltr', style: 'display:block;padding:8px 10px;background:var(--bg);border-radius:8px;user-select:all;word-break:break-all', text: r.secret }))));
        box.appendChild(h('div', { class: 'f', style: 'margin-top:14px' }, h('div', { class: 'lab', text: 'الكود من التطبيق' }), code));
        box.appendChild(h('div', { class: 'row' }, h('button', { class: 'btn pri', type: 'button', text: 'تأكيد وتفعيل', onclick: function () { api('POST', '/2fa/enable', { code: code.value }).then(function (x) { if (x.ok) { toast('تم تفعيل التحقق بخطوتين'); draw2(x.recovery); } else toast(x.message || 'فشل', true); }); } }), h('button', { class: 'btn', type: 'button', text: 'إلغاء', onclick: draw })));
        code.focus();
      });
    }
    draw();
  }
  /* الحساب والنسخ الاحتياطي */
  function accountTab(host) {
    twofaCard(host);
    var oldP = h('input', { type: 'password', autocomplete: 'current-password' }), newP = h('input', { type: 'password', autocomplete: 'new-password' });
    host.appendChild(h('div', { class: 'card' }, h('h3', { text: 'تغيير كلمة المرور' }), h('p', { class: 'hint', text: '10 حروف على الأقل. استخدم كلمة قوية ومختلفة عن باقي حساباتك.' }),
      h('div', { class: 'f' }, h('div', { class: 'lab', text: 'كلمة المرور الحالية' }), oldP), h('div', { class: 'f' }, h('div', { class: 'lab', text: 'كلمة المرور الجديدة' }), newP),
      h('button', { class: 'btn pri', type: 'button', text: 'تغيير', onclick: function () { api('POST', '/password', { old: oldP.value, new: newP.value }).then(function (r) { if (r.ok) { toast('تم تغيير كلمة المرور'); oldP.value = newP.value = ''; } else toast(r.message || 'فشل', true); }); } })));
    var bk = h('div');
    host.appendChild(h('div', { class: 'card' }, h('h3', { text: 'النسخ الاحتياطية' }), h('p', { class: 'hint', text: 'بتتعمل نسخة تلقائية قبل كل حفظ (آخر 40 نسخة). تقدر ترجّع أي نسخة قديمة.' }), bk));
    api('GET', '/backups').then(function (r) {
      var bs = r.backups || []; if (!bs.length) { bk.appendChild(h('div', { class: 'empty', text: 'مفيش نسخ لسه.' })); return; }
      bk.appendChild(h('table', { class: 't' }, h('tbody', null, bs.slice(0, 15).map(function (b) { return h('tr', null, h('td', { dir: 'ltr', text: new Date(b.time).toLocaleString('en-GB') }), h('td', { text: Math.round(b.size / 1024) + ' KB' }), h('td', null, h('button', { class: 'btn sm', type: 'button', text: 'استرجاع', onclick: function () { if (confirm('استرجاع النسخة دي؟ الحالية هتتحفظ كنسخة احتياطية.')) api('POST', '/backups/restore', { name: b.name }).then(function (x) { if (x.ok) { dirty = false; load().then(function () { toast('تم الاسترجاع'); }); } else toast('فشل', true); }); } }))); }))));
    });
    var imp = h('input', { type: 'file', accept: 'application/json', style: 'display:none', onchange: function (e) { var f = e.target.files[0]; if (!f) return; f.text().then(function (t) { try { var j = JSON.parse(t); if (!j.settings || !j.layout) throw 0; C = j; touch(); toast('اتحمّل الملف. اضغط «حفظ» عشان يتطبق.'); render(); } catch (x) { toast('الملف مش صالح', true); } }); } });
    host.appendChild(h('div', { class: 'card' }, h('h3', { text: 'تصدير واستيراد المحتوى' }), h('p', { class: 'hint', text: 'نزّل كل محتوى الموقع كملف JSON، أو حمّل ملف قديم (بيتطبق بعد ما تضغط «حفظ»).' }), h('div', { class: 'row' },
      h('button', { class: 'btn', type: 'button', text: 'تنزيل المحتوى', onclick: function () { var a = h('a', { href: URL.createObjectURL(new Blob([JSON.stringify(C, null, 2)], { type: 'application/json' })), download: 'site-content.json' }); document.body.appendChild(a); a.click(); a.remove(); } }), h('button', { class: 'btn', type: 'button', text: 'استيراد ملف', onclick: function () { imp.click(); } }), imp)));
    host.appendChild(h('div', { class: 'card' }, h('h3', { text: 'إعادة المحتوى للافتراضي' }), h('p', { class: 'hint', text: 'بترجّع كل النصوص والمشاريع للنسخة الأصلية. نسختك الحالية بتتحفظ في النسخ الاحتياطية قبل ما تتمسح.' }),
      h('button', { class: 'btn danger', type: 'button', text: 'إعادة للافتراضي', onclick: function () { var t = prompt('عشان تأكد، اكتب كلمة RESET'); if (t === 'RESET') api('POST', '/reset', { confirm: 'RESET' }).then(function (r) { if (r.ok) { dirty = false; load().then(function () { toast('تمت الإعادة'); }); } }); } })));
  }

  /* ---------- الهيكل والعرض ---------- */
  function renderSide() {
    var side = document.querySelector('.side nav'); if (!side) return;
    side.innerHTML = '';
    TABS.forEach(function (t) {
      if (t.sep) { side.appendChild(h('div', { class: 'sep' })); return; }
      var n = t.badge ? t.badge() : 0;
      side.appendChild(h('button', { type: 'button', class: t.id === tab ? 'on' : '', onclick: function () { tab = t.id; document.querySelector('.side').classList.remove('open'); render(); } }, t.label, n ? h('span', { class: 'badge', text: n }) : null));
    });
  }
  function updateTop() {
    var d = document.getElementById('dirtyMark'), s = document.getElementById('saveBtn');
    if (d) d.textContent = dirty ? '● فيه تعديلات غير محفوظة' : '';
    if (s) { s.disabled = !dirty; }
  }
  function save() {
    var s = document.getElementById('saveBtn'); s.disabled = true;
    api('PUT', '/content', { content: C }).then(function (r) { if (r.ok) { dirty = false; toast('تم الحفظ — التعديلات ظاهرة في الموقع دلوقتي'); } else { toast(r.message || 'فشل الحفظ', true); } updateTop(); });
  }
  function load() { return api('GET', '/content').then(function (r) { if (r.ok) { C = r.content; ensureLayout(); dirty = false; render(); } return r; }); }

  function render() {
    app.innerHTML = '';
    if (!me) return renderLogin();
    if (!C) { app.textContent = 'جارٍ التحميل…'; return; }
    var cur = TABS.filter(function (t) { return t.id === tab; })[0] || TABS[0];
    var side = h('aside', { class: 'side' }, h('div', { class: 'brand' }, h('i', { text: 'AK' }), 'لوحة التحكم'), h('nav'),
      h('div', { class: 'foot' }, h('span', { text: 'مسجّل دخول: ' + me }), h('a', { href: '/', target: '_blank', rel: 'noopener', text: '↗ فتح الموقع' }), h('button', { type: 'button', text: 'تسجيل الخروج', onclick: function () { api('POST', '/logout', {}).then(function () { me = null; C = null; render(); }); } })));
    var content = h('div', { class: 'content' });
    var main = h('main', { class: 'main' }, h('div', { class: 'topbar' }, h('div', { class: 'row' }, h('button', { class: 'btn sm menu-btn', type: 'button', text: '☰', 'aria-label': 'القائمة', onclick: function () { side.classList.toggle('open'); } }), h('h2', { text: cur.label })), h('div', { class: 'acts' }, h('span', { class: 'dirty', id: 'dirtyMark' }), h('button', { class: 'btn pri', id: 'saveBtn', type: 'button', text: 'حفظ التعديلات', onclick: save }))), content);
    app.appendChild(h('div', { class: 'shell' }, side, main));
    renderSide(); updateTop();
    if (cur.custom) cur.custom(content);
    else cur.cards().forEach(function (c) {
      var card = h('div', { class: 'card' }, h('h3', { text: c[0] }), c[1] ? h('p', { class: 'hint', text: c[1] }) : null);
      renderFields(c[3], c[2], card); content.appendChild(card);
    });
  }
  function renderLogin(msg) {
    app.innerHTML = '';
    var u = h('input', { type: 'text', autocomplete: 'username', required: true, autocapitalize: 'none', spellcheck: 'false' }), p = h('input', { type: 'password', autocomplete: 'current-password', required: true }), note = h('p', { style: 'color:var(--bad);min-height:1.4em', text: msg || '' });
    app.appendChild(h('div', { class: 'login' }, h('form', { onsubmit: function (e) { e.preventDefault(); note.textContent = ''; api('POST', '/login', { user: u.value, pass: p.value }).then(function (r) {
      if (r.ok) { me = r.user; load(); messagesCount(); }
      else if (r.need2fa) renderCode(r.challenge);
      else note.textContent = r.message || 'فشل الدخول';
    }); } }, h('h1', { text: 'لوحة التحكم' }), h('p', { text: 'سجّل دخولك لتعديل الموقع.' }), h('div', { class: 'f' }, h('div', { class: 'lab', text: 'اسم الدخول' }), u), h('div', { class: 'f' }, h('div', { class: 'lab', text: 'كلمة المرور' }), p), note, h('button', { class: 'btn pri', type: 'submit', text: 'دخول' }))));
    u.focus();
  }
  function renderCode(challenge) {
    app.innerHTML = '';
    var code = h('input', { type: 'text', inputmode: 'text', autocomplete: 'one-time-code', required: true, placeholder: '123456', dir: 'ltr', style: 'text-align:center;font-size:1.4rem;letter-spacing:.3em' }), note = h('p', { style: 'color:var(--bad);min-height:1.4em' });
    app.appendChild(h('div', { class: 'login' }, h('form', { onsubmit: function (e) { e.preventDefault(); note.textContent = ''; api('POST', '/login/2fa', { challenge: challenge, code: code.value }).then(function (r) {
      if (r.ok) { me = r.user; load(); messagesCount(); }
      else if (r.restart) renderLogin(r.message);
      else { note.textContent = r.message || 'الكود غلط'; code.select(); }
    }); } }, h('h1', { text: 'التحقق بخطوتين' }), h('p', { text: 'اكتب الكود المكوّن من 6 أرقام من تطبيق المصادقة في موبايلك. لو ضاع موبايلك، استخدم كود استرجاع (مثال: a1b2c-3d4e5).' }), h('div', { class: 'f' }, code), note, h('div', { class: 'row' }, h('button', { class: 'btn pri', type: 'submit', text: 'تأكيد' }), h('button', { class: 'btn', type: 'button', text: 'رجوع', onclick: function () { renderLogin(); } })))));
    code.focus();
  }
  function messagesCount() { api('GET', '/messages').then(function (r) { window.__unread = (r.messages || []).filter(function (m) { return !m.read; }).length; renderSide(); }); }

  api('GET', '/me').then(function (r) { if (r.ok) { me = r.user; load(); messagesCount(); } else render(); });
})();
