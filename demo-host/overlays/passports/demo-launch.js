'use strict';
/* تشغيل نظام الجوازات كنسخة تجريبية:
   1) بيرجّع قاعدة البيانات التجريبية لأولها من seed (بيانات وهمية)
   2) وبعدين بيشغّل السيرفر الحقيقي عليها.
   ⚠ أمان: اسم قاعدة البيانات لازم يكون فيه كلمة demo — عشان مستحيل يمسح قاعدة حقيقية بالغلط. */
// لو البوابة اتقفلت، النظام ده يقفل معاها (عشان مايفضلش ماسك البورت)
process.on('disconnect', () => process.exit(0));
const fs = require('fs'); const path = require('path'); const zlib = require('zlib'); const http = require('http');
const DATA = process.env.DEMO_DATA || path.join(__dirname, 'demo-data');
// بنشيل المسافات وعلامات التنصيص اللي ممكن تتحط بالغلط حوالين القيم في لوحة هوستنجر
const clean = (v) => String(v == null ? '' : v).trim().replace(/^(['"])([\s\S]*)\1$/, '$2').trim();
const DB = { host: clean(process.env.DEMO_PASSPORTS_DB_HOST) || '127.0.0.1', port: Number(clean(process.env.DEMO_PASSPORTS_DB_PORT) || 3306), user: clean(process.env.DEMO_PASSPORTS_DB_USER), password: clean(process.env.DEMO_PASSPORTS_DB_PASSWORD), database: clean(process.env.DEMO_PASSPORTS_DB_NAME) };
// "localhost" في Node بيروح على IPv6 (::1) وهوستنجر مبيسمحش بيه — نجبره على IPv4
if (/^localhost$/i.test(DB.host)) DB.host = '127.0.0.1';
/* طرق الاتصال بالترتيب: socket (لو متحدد أو موجود في أماكنه المعروفة) ثم TCP على 127.0.0.1 */
function candidates() {
  const list = [];
  const sockets = process.env.DEMO_PASSPORTS_DB_SOCKET ? [process.env.DEMO_PASSPORTS_DB_SOCKET] : ['/var/run/mysqld/mysqld.sock', '/run/mysqld/mysqld.sock', '/var/lib/mysql/mysql.sock', '/tmp/mysql.sock'].filter((f) => { try { return fs.existsSync(f); } catch (e) { return false; } });
  for (const sp of sockets) list.push({ label: 'socket ' + sp, opts: { socketPath: sp } });
  list.push({ label: 'tcp ' + DB.host + ':' + DB.port, opts: { host: DB.host, port: DB.port } });
  return list;
}
const PORT = Number(process.env.PORT || 4602);
let stub = null;
/* صفحة «لسه بيتجهّز» لحد ما القاعدة تشتغل — وبنعيد المحاولة كل 30 ثانية من غير ما حد يعمل Deploy */
function notReady(msg) {
  console.error('[demo-passports]', msg);
  if (stub) return;
  stub = http.createServer((req, res) => {
    const json = req.url.startsWith('/api/');
    res.writeHead(200, { 'Content-Type': json ? 'application/json; charset=utf-8' : 'text/html; charset=utf-8' });
    res.end(json ? JSON.stringify({ ok: false, error: 'النسخة التجريبية لسه متظبطتش' }) : '<!doctype html><meta charset="utf-8"><body dir="rtl" style="font-family:system-ui,Tahoma;display:grid;place-items:center;min-height:90vh;background:#f5f8fc;color:#1D4E89;text-align:center"><div><h2>النسخة التجريبية من نظام الجوازات لسه بتتجهّز</h2><p>جرّب تاني بعد شوية، أو <a href="https://wa.me/201552084471">اطلب ديمو مباشر</a>.</p><p><a href="/">← موقع أحمد الخولي</a></p></div></body>');
  }).listen(PORT, () => process.send && process.send('ready'));
}
async function connectAny() {
  const mysql = require('mysql2/promise'); const errors = [];
  for (const cand of candidates()) {
    try {
      const c = await mysql.createConnection(Object.assign({ user: DB.user, password: DB.password, database: DB.database, connectTimeout: 8000, multipleStatements: true, charset: 'utf8mb4_general_ci' }, cand.opts));
      console.log('[demo-passports] اتصلت بالقاعدة عن طريق', cand.label);
      return { c, cand };
    } catch (e) { errors.push(cand.label + ' → ' + (e.code || 'ERR') + ': ' + e.message); }
  }
  throw new Error(errors.join('  |  '));
}
async function boot() {
  if (!DB.user || !DB.database) return notReady('قاعدة البيانات التجريبية مش متظبطة (DEMO_PASSPORTS_DB_NAME / USER / PASSWORD)');
  if (!/demo/i.test(DB.database)) return notReady('اسم قاعدة البيانات لازم يكون فيه demo — رافض أمسح قاعدة: ' + DB.database);
  const seed = path.join(DATA, 'passports.sql.gz');
  let cand;
  try {
    const got = await connectAny(); cand = got.cand; const c = got.c;
    await c.query('SET FOREIGN_KEY_CHECKS = 0');
    const [rows] = await c.query('SELECT TABLE_NAME AS n FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE()');
    for (const r of rows) await c.query('DROP TABLE IF EXISTS `' + String(r.n).replace(/`/g, '') + '`');
    await c.query(zlib.gunzipSync(fs.readFileSync(seed)).toString('utf8'));
    await c.query('SET FOREIGN_KEY_CHECKS = 1');
    await c.end();
    console.log('[demo-passports] رجّعت البيانات التجريبية:', rows.length, '→ جداول جديدة');
  } catch (e) { notReady('تعذّر تجهيز قاعدة البيانات التجريبية (المستخدم: ' + DB.user + ' • القاعدة: ' + DB.database + ' • طول الباسورد: ' + DB.password.length + ' حرف): ' + e.message + ' — هعيد المحاولة بعد 30 ثانية'); return setTimeout(boot, 30000); }
  if (stub) { await new Promise((r) => { stub.close(r); if (stub.closeAllConnections) stub.closeAllConnections(); }); stub = null; }
  Object.assign(process.env, {
    DB_HOST: DB.host, DB_PORT: String(DB.port), DB_USER: DB.user, DB_PASSWORD: DB.password, DB_NAME: DB.database,
    ADMIN_2FA: '0', PASSPORT_DATA_DIR: DATA, PASSPORT_RESET_PASS: '', PASSPORT_RESET_USER: '', SITE_SHARED_SECRET: '', ALLOWED_ORIGINS: '', TRUST_PROXY: '2',
    AUTH_SECRET: process.env.DEMO_PASSPORTS_AUTH_SECRET || require('crypto').randomBytes(24).toString('hex')
  });
  // لو الاتصال نجح عن طريق socket، السيرفر الحقيقي لازم يستخدمه برضه
  if (cand.opts.socketPath) {
    const m = require('mysql2/promise'); const orig = m.createPool;
    m.createPool = (cfg) => { const o = Object.assign({}, cfg, { socketPath: cand.opts.socketPath }); delete o.host; delete o.port; return orig.call(m, o); };
  }
  require('./server.js');
}
boot();
