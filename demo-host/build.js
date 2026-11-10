'use strict';
/* =========================================================
   بيجهّز ملف الرفع لـ ahmedalkholy.com:
     node demo-host/build.js
   - بياخد الموقع من site/
   - وبياخد الأنظمة من الريبوهات بتاعتها (من غير أي تعديل عليها)
     وبيظبطها تشتغل تحت /demo-... + بيانات وهمية
   - الناتج: demo-host/dist  و  ahmedalkholy-app.zip
   مكان الريبوهات (لو مختلف): HR_REPO=...
   ========================================================= */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const HERE = __dirname, REPO = path.resolve(HERE, '..');
const DIST = path.join(HERE, 'dist');
const HR_REPO = path.resolve(process.env.HR_REPO || path.join(REPO, '..', 'masar-hr-v3'));

const rm = (p) => fs.rmSync(p, { recursive: true, force: true });
function copy(src, dst, filter) {
  const s = fs.statSync(src);
  if (s.isDirectory()) {
    fs.mkdirSync(dst, { recursive: true });
    for (const n of fs.readdirSync(src)) { if (filter && !filter(path.join(src, n), n)) continue; copy(path.join(src, n), path.join(dst, n), filter); }
  } else { fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.copyFileSync(src, dst); }
}
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);

/* تحويل المسارات المطلقة (/api و /vendor ...) عشان النظام يشتغل جوه فولدر فرعي */
function rebase(text, base, roots) {
  const re = new RegExp('([\\"\'`(])/(' + roots.join('|') + ')(?=[/\'"`?)\\s.]|$)', 'g');
  return text.replace(re, (m, q, r) => q + base + '/' + r).replace(/\$\{location\.origin\}\//g, '${location.origin}' + base + '/');
}

rm(DIST); fs.mkdirSync(DIST, { recursive: true });

/* 1) الموقع */
copy(path.join(REPO, 'site'), path.join(DIST, 'site'), (p, n) => n !== '.gitkeep' && n !== '.htaccess');

/* 2) البوابة */
for (const f of ['gateway.js', 'apps.config.js']) copy(path.join(HERE, f), path.join(DIST, f));

/* 3) مسار HR */
{
  const base = '/demo-hr';
  const src = path.join(HR_REPO, 'server'), dst = path.join(DIST, 'apps/hr/server');
  if (!fs.existsSync(src)) throw new Error('مش لاقي ريبو مسار HR في ' + HR_REPO);
  copy(path.join(src, 'src'), path.join(dst, 'src'));
  copy(path.join(src, 'public'), path.join(dst, 'public'));
  copy(path.join(src, 'package.json'), path.join(dst, 'package.json'));
  copy(path.join(HERE, 'overlays/hr/demo-launch.js'), path.join(dst, 'demo-launch.js'));
  copy(path.join(HERE, 'overlays/hr/demo-banner.js'), path.join(dst, 'public/demo-banner.js'));
  const pub = path.join(dst, 'public');
  const roots = ['api', 'vendor', 'fonts', 'app', 'theme\\.js', 'demo-banner\\.js'];
  let changed = 0;
  for (const f of walk(pub)) {
    if (f.includes(path.sep + 'vendor' + path.sep) || !/\.(html|js|css)$/.test(f)) continue;
    const t = fs.readFileSync(f, 'utf8'); let n = rebase(t, base, roots);
    if (path.basename(f) === 'index.html' && !n.includes('demo-banner.js')) n = n.replace('</head>', `<script src="${base}/demo-banner.js"></script>\n</head>`);
    if (n !== t) { fs.writeFileSync(f, n); changed++; }
  }
  console.log('HR: اتعدّل', changed, 'ملف للمسار', base);
  // اسم شركة وهمي بدل اسم الشركة الحقيقية اللي بتستخدم النظام
  const BRAND = [
    ['src/defaults.js', "company: { name: 'نسر الخليج', sub: 'لإلحاق العمالة المصرية بالخارج', license: '863',", "company: { name: 'شركة تجريبية للتوظيف', sub: 'نسخة تجريبية — بيانات وهمية', license: '0000',"],
    ['public/app/00_core.js', "COMPANY = SETTINGS.company || { name: 'نسر الخليج',", "COMPANY = SETTINGS.company || { name: 'شركة تجريبية للتوظيف',"],
    ['public/app/34_report.js', "label: 'نسر الخليج',", "label: 'كحلي ودهبي',"],
    ['public/app/92_forms.js', '(مثلاً https://nisrelkhaleeg.com)', '(مثلاً https://example.com)'],
    ['public/app/92_forms.js', 'placeholder="https://nisrelkhaleeg.com"', 'placeholder="https://example.com"']
  ];
  for (const [f, a, b] of BRAND) {
    const p = path.join(dst, f); const t = fs.readFileSync(p, 'utf8');
    if (!t.includes(a)) { console.warn('⚠ HR: مش لاقي النص ده عشان أغيّره (يمكن الكود اتغيّر):', f, a.slice(0, 50)); continue; }
    fs.writeFileSync(p, t.split(a).join(b));
  }
  const left = walk(dst).filter((f) => /\.(js|html)$/.test(f) && !f.includes(path.sep + 'vendor' + path.sep)).filter((f) => /نسر الخليج|nisrelkhaleeg/i.test(fs.readFileSync(f, 'utf8')) && !/publicform\.js$/.test(f));
  if (left.length) console.warn('⚠ HR: لسه فيه ذكر لاسم الشركة في:', left.map((f) => path.relative(dst, f)).join(', '));
  // البيانات الوهمية (من test/fixtures — كلها متولّدة ومفيهاش بيانات حقيقية)
  const seed = path.join(DIST, 'seed/hr'); fs.mkdirSync(seed, { recursive: true });
  execFileSync(process.execPath, [path.join(src, 'src/cli.js'), 'import'], {
    cwd: src, stdio: 'inherit',
    env: Object.assign({}, process.env, { DB_MODE: 'memory', MASAR_ALLOW_DEMO: '1', MEMORY_DB_FILE: path.join(seed, 'db.json'), LEGACY_JSON_DIR: path.join(HR_REPO, 'test/fixtures/legacy'), FILE_STORAGE_DIR: path.join(seed, 'storage'), LEGACY_FILE_STORAGE_ROOT: path.join(seed, 'legacy-uploads'), LEGACY_INBOX_POLL_SEC: '0', LEGACY_SERVER_DIR: path.join(seed, 'no-legacy') })
  });
  // ملفات السير المرفقة: عينات سير وهمية من test/samples بدل الملفات الأصلية
  const db = JSON.parse(fs.readFileSync(path.join(seed, 'db.json'), 'utf8'));
  const samples = ['cv_ar.pdf', 'cv_en.pdf'].map((n) => path.join(HR_REPO, 'test/samples', n)).filter((f) => fs.existsSync(f));
  let k = 0;
  for (const a of (db.t.MHR_Attachments || [])) {
    if (!a.IsLegacy || !/\.pdf$/i.test(a.StoredPath) || !samples.length) continue;
    const to = path.join(seed, 'legacy-uploads', a.StoredPath);
    fs.mkdirSync(path.dirname(to), { recursive: true }); fs.copyFileSync(samples[k++ % samples.length], to);
    a.SizeBytes = fs.statSync(to).size;
  }
  fs.writeFileSync(path.join(seed, 'db.json'), JSON.stringify(db));
  console.log('HR: اتحط', k, 'سيرة وهمية كمرفقات');
}

/* 4) نظام الجوازات */
const PP_REPO = path.resolve(process.env.PP_REPO || path.join(REPO, '..', 'nesr-passport-system'));
{
  const base = '/demo-passports';
  const appSrc = path.join(PP_REPO, 'passport-app'), srv = path.join(PP_REPO, 'passport-server');
  if (!fs.existsSync(srv)) throw new Error('مش لاقي ريبو نظام الجوازات في ' + PP_REPO);
  if (!fs.existsSync(path.join(appSrc, 'node_modules'))) throw new Error('محتاج npm ci جوه ' + appSrc + ' الأول');
  // نسخة شغل من الواجهة (الريبو نفسه مبيتغيّرش)
  const work = path.join(HERE, '.work/passport-app'); rm(work);
  copy(appSrc, work, (p, n) => !['node_modules', 'build', '.env'].includes(n));
  fs.symlinkSync(path.join(appSrc, 'node_modules'), path.join(work, 'node_modules'), 'dir');
  const NAME = [
    [/نسر الخليج لإلحاق العمالة المصرية بالخارج/g, 'شركة تجريبية — بيانات وهمية'], [/شركة نسر الخليج/g, 'شركة تجريبية'], [/شعار نسر الخليج/g, 'شعار الشركة'], [/نسر الخليج/g, 'شركة تجريبية'],
    [/Nesr\s*El[\s-]*Khaleeg|Nasr\s*Al[\s-]*Khaleej/gi, 'Demo Company'], [/nisrelkhaleeg\.com/gi, 'example.com'], [/(رقم\s*)863/g, '$10000']
  ];
  let changed = 0;
  for (const f of walk(path.join(work, 'src'))) {
    if (!/\.(js|jsx|css)$/.test(f)) continue;
    const t = fs.readFileSync(f, 'utf8'); let n = t;
    // المسارات المطلقة للسيرفر → تحت /demo-passports
    // ${...URL}/x و ${API_BASE_URL}/x → ${...}/demo-passports/x
    n = n.replace(/(\$\{[^}]*\})\/(?=(?:api|uploads|test|health)(?:[/'"`?]|$))/g, '$1' + base + '/');
    // '/api/...' و '/uploads/...' في نص عادي
    n = n.replace(/(["'`])\/(api|uploads)(?=[/'"`?]|$)/g, (m, q, r) => q + base + '/' + r);
    // تنقلات صريحة لصفحات النظام
    n = n.replace(/(location\.(?:href\s*=|assign\(|replace\()\s*['"`])\/(?!demo-)/g, '$1' + base + '/').replace(/(window\.open\(\s*['"`])\/(?!demo-|\/)/g, '$1' + base + '/');
    for (const [a, b] of NAME) n = n.replace(a, b);
    if (path.basename(f) === 'App.js') n = n.replace(/<Router>/, `<Router basename="${base}">`);
    if (path.basename(f) === 'InternalChat.js') n = n.replace("transports: ['websocket', 'polling'],", `path: '${base}/socket.io', transports: ['websocket', 'polling'],`);
    if (n !== t) { fs.writeFileSync(f, n); changed++; }
  }
  // لوجو محايد بدل لوجو الشركة
  const logo = path.join(work, 'src/assets/nesr-logo.png'), neutral = path.join(work, 'src/assets/masar-logo.png');
  if (fs.existsSync(logo) && fs.existsSync(neutral)) fs.copyFileSync(neutral, logo);
  for (const f of ['public/index.html', 'public/manifest.json']) { const p = path.join(work, f); if (!fs.existsSync(p)) continue; let t = fs.readFileSync(p, 'utf8'); for (const [a, b] of NAME) t = t.replace(a, b); fs.writeFileSync(p, t); }
  console.log('الجوازات: اتعدّل', changed, 'ملف للمسار', base);
  const chk = walk(path.join(work, 'src')).filter((f) => /\.(js|jsx)$/.test(f) && /App\.js$|InternalChat\.js$/.test(f));
  if (!fs.readFileSync(chk.find((f) => /App\.js$/.test(f)), 'utf8').includes('basename=')) console.warn('⚠ الجوازات: مقدرتش أضيف basename للـ Router');
  if (!fs.readFileSync(chk.find((f) => /InternalChat\.js$/.test(f)), 'utf8').includes(base + '/socket.io')) console.warn('⚠ الجوازات: مقدرتش أظبط مسار الشات');
  console.log('الجوازات: بناء الواجهة (react-scripts build)…');
  execFileSync(process.execPath, [path.join(appSrc, 'node_modules/react-scripts/bin/react-scripts.js'), 'build'], { cwd: work, stdio: ['ignore', 'ignore', 'inherit'], env: Object.assign({}, process.env, { PUBLIC_URL: base, CI: 'false', GENERATE_SOURCEMAP: 'false', DISABLE_ESLINT_PLUGIN: 'true' }) });
  const dst = path.join(DIST, 'apps/passports/passport-server');
  copy(srv, dst, (p, n) => !['node_modules', '.env', 'public'].includes(n));
  copy(path.join(work, 'build'), path.join(dst, 'public'));
  copy(path.join(HERE, 'overlays/passports/demo-launch.js'), path.join(dst, 'demo-launch.js'));
  copy(path.join(HERE, 'overlays/passports/demo-banner.js'), path.join(dst, 'public/demo-banner.js'));
  const idx = path.join(dst, 'public/index.html');
  fs.writeFileSync(idx, fs.readFileSync(idx, 'utf8').replace('</head>', `<script src="${base}/demo-banner.js"></script></head>`));
  copy(path.join(HERE, 'seed/passports.sql.gz'), path.join(DIST, 'seed/passports/passports.sql.gz'));
}

/* 5) package.json واحد لكل حاجة (هوستنجر بيعمل npm install) */
const hrPkg = require(path.join(HR_REPO, 'server/package.json'));
const ppPkg = require(path.join(PP_REPO, 'passport-server/package.json'));
const deps = { express: '^4.21.1', 'http-proxy': '^1.18.1' };
for (const k of ['compression', 'multer', 'express']) if (hrPkg.dependencies[k]) deps[k] = hrPkg.dependencies[k];
for (const [k, v] of Object.entries(ppPkg.dependencies)) if (!deps[k]) deps[k] = v;
fs.writeFileSync(path.join(DIST, 'package.json'), JSON.stringify({
  name: 'ahmedalkholy-site', version: '1.0.0', private: true, description: 'Ahmed Alkholy — portfolio + live demos',
  main: 'gateway.js', scripts: { start: 'node gateway.js' }, engines: { node: '>=20' }, dependencies: deps
}, null, 2) + '\n');

console.log('\nتمام ✓  الناتج في:', DIST);
