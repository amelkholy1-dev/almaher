'use strict';
/* بيرسم صورة معاينة الروابط (واتساب/لينكد إن) 1200×630 من بيانات الموقع.
   أداة للمطوّر بس: محتاجة playwright وخطوط Cairo و Lato.
   FONT_DIR=<فولدر woff2> node tools/build-og.js */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const FONT_DIR = process.env.FONT_DIR || '/tmp/claude-0/cvfonts';
const font = (file) => { const f = fs.readdirSync(FONT_DIR, { recursive: true }).map(String).find((x) => x.endsWith('/' + file) || x === file); if (!f) throw new Error('font missing: ' + file); return 'data:font/woff2;base64,' + fs.readFileSync(path.join(FONT_DIR, f)).toString('base64'); };
const photo = 'data:image/jpeg;base64,' + fs.readFileSync(path.join(root, 'public', 'assets', 'img', 'ahmed-alkholy.jpg')).toString('base64');
const C = JSON.parse(fs.readFileSync(path.join(root, 'seed', 'content.json'), 'utf8')).settings;

const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>
@font-face{font-family:CairoA;font-weight:400;src:url(${font('cairo-arabic-400-normal.woff2')})}
@font-face{font-family:CairoA;font-weight:700;src:url(${font('cairo-arabic-700-normal.woff2')})}
@font-face{font-family:CairoA;font-weight:800;src:url(${font('cairo-arabic-800-normal.woff2')})}
@font-face{font-family:Lato;font-weight:700;src:url(${font('lato-latin-700-normal.woff2')})}
@font-face{font-family:Lato;font-weight:900;src:url(${font('lato-latin-900-normal.woff2')})}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;overflow:hidden;font-family:CairoA,Lato,sans-serif;color:#fff;position:relative;
background:radial-gradient(circle at 12% 8%,rgba(240,168,48,.28),transparent 28%),linear-gradient(135deg,#1b4a85 0%,#1f5da6 100%)}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.055) 1px,transparent 1px);background-size:42px 42px}
.ring{position:absolute;left:80px;top:140px;width:352px;height:352px;border-radius:50%;padding:9px;background:linear-gradient(135deg,#f0a830 0%,#8fa7c9 55%,#2f6db3 100%);box-shadow:0 18px 50px rgba(0,0,0,.28)}
.ring img{width:100%;height:100%;border-radius:50%;object-fit:cover;display:block}
.txt{position:absolute;right:80px;top:118px;width:620px;text-align:right}
.n{font-size:68px;font-weight:800;line-height:1.25}
.e{font-family:Lato;font-weight:900;font-size:36px;color:#f0a830;margin:2px 0 26px;direction:ltr;text-align:right}
.r1{font-size:31px;font-weight:700;line-height:1.5}
.r2{font-size:29px;font-weight:400;line-height:1.5;opacity:.9;margin-bottom:12px}
.en{font-family:Lato;font-weight:700;font-size:22px;line-height:1.5;opacity:.92;direction:ltr;text-align:right}
.pill{display:inline-block;margin-top:26px;padding:9px 26px;border:1.5px solid rgba(255,255,255,.35);border-radius:999px;background:rgba(255,255,255,.08);font-size:21px}
</style></head><body><div class="grid"></div>
<div class="ring"><img src="${photo}" alt=""></div>
<div class="txt"><div class="n">${C.name.ar}</div><div class="e">${C.name.en}</div>
<div class="r1">مهندس أنظمة وحلول أعمال</div><div class="r2">تشغيل ودعم فني</div>
<div class="en">Business Systems Engineer</div><div class="en">Operations &amp; IT Support</div>
<div class="pill">الجيزة، مصر • مصر والخليج وعن بُعد</div></div></body></html>`;

(async () => {
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await p.setContent(html, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  const out = path.join(root, 'public', 'assets', 'img');
  for (const f of ['og-image.jpg', 'og-image-v2.jpg']) await p.screenshot({ path: path.join(out, f), type: 'jpeg', quality: 90 });
  await b.close();
  console.log('og images written');
})().catch((e) => { console.error(e); process.exit(1); });
