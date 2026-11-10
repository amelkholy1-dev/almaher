/* شريط النسخة التجريبية + تعبئة بيانات الدخول تلقائياً */
(function () {
  var USER = 'demo', PASS = 'demo1234';
  var css = '#demo-bar{position:fixed;top:0;left:0;right:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;padding:6px 12px;background:linear-gradient(90deg,#143a69,#2A6BB3);color:#fff;font:600 13px/1.4 system-ui,Tahoma,sans-serif;direction:rtl;box-shadow:0 2px 8px rgba(0,0,0,.2)}' +
    '#demo-bar b{color:#F5A524}#demo-bar a{color:#fff;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.3);padding:2px 10px;border-radius:999px;text-decoration:none}#demo-bar code{background:rgba(0,0,0,.25);padding:1px 6px;border-radius:5px;font-family:monospace;direction:ltr}' +
    'html{scroll-padding-top:40px}body{padding-top:34px!important}@media(max-width:700px){body{padding-top:58px!important}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  function bar() {
    if (document.getElementById('demo-bar')) return;
    var d = document.createElement('div'); d.id = 'demo-bar';
    d.innerHTML = '<span><b>نسخة تجريبية حقيقية</b> ببيانات وهمية — بتتمسح وترجع لأولها كل ساعة</span><span>الدخول: <code>' + USER + '</code> / <code>' + PASS + '</code></span><a href="/">← موقع أحمد الخولي</a><a href="https://wa.me/201552084471?text=' + encodeURIComponent('مرحباً أحمد، جرّبت النسخة التجريبية من مسار HR وأرغب في ديمو مباشر.') + '" target="_blank" rel="noopener">اطلب ديمو مباشر</a>';
    document.body.appendChild(d);
  }
  function setVal(el, v) { var s = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; s.call(el, v); el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); }
  function fill() {
    var pw = document.querySelector('input[type="password"]'); if (!pw || pw.dataset.demoFilled) return;
    var form = pw.closest('form') || document; var u = form.querySelector('input[type="text"],input[autocomplete="username"],input:not([type])');
    if (!u || u === pw) return; pw.dataset.demoFilled = '1'; if (!u.value) setVal(u, USER); if (!pw.value) setVal(pw, PASS);
  }
  function tick() { if (document.body) { bar(); fill(); } }
  document.addEventListener('DOMContentLoaded', tick);
  new MutationObserver(tick).observe(document.documentElement, { childList: true, subtree: true });
})();
