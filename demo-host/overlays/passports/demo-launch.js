'use strict';
/* تشغيل نظام الجوازات كنسخة تجريبية:
   1) بيرجّع قاعدة البيانات التجريبية لأولها من seed (بيانات وهمية)
   2) وبعدين بيشغّل السيرفر الحقيقي عليها.
   ⚠ أمان: اسم قاعدة البيانات لازم يكون فيه كلمة demo — عشان مستحيل يمسح قاعدة حقيقية بالغلط. */
const fs = require('fs'); const path = require('path'); const zlib = require('zlib'); const http = require('http');
const DATA = process.env.DEMO_DATA || path.join(__dirname, 'demo-data');
const DB = { host: process.env.DEMO_PASSPORTS_DB_HOST || '127.0.0.1', port: Number(process.env.DEMO_PASSPORTS_DB_PORT || 3306), user: process.env.DEMO_PASSPORTS_DB_USER || '', password: process.env.DEMO_PASSPORTS_DB_PASSWORD || '', database: process.env.DEMO_PASSPORTS_DB_NAME || '' };
function notReady(msg) {
  console.error('[demo-passports]', msg);
  http.createServer((req, res) => {
    const json = req.url.startsWith('/api/');
    res.writeHead(200, { 'Content-Type': json ? 'application/json; charset=utf-8' : 'text/html; charset=utf-8' });
    res.end(json ? JSON.stringify({ ok: false, error: 'النسخة التجريبية لسه متظبطتش' }) : '<!doctype html><meta charset="utf-8"><body dir="rtl" style="font-family:system-ui,Tahoma;display:grid;place-items:center;min-height:90vh;background:#f5f8fc;color:#1D4E89;text-align:center"><div><h2>النسخة التجريبية من نظام الجوازات لسه بتتجهّز</h2><p>جرّب تاني بعد شوية، أو <a href="https://wa.me/201552084471">اطلب ديمو مباشر</a>.</p><p><a href="/">← موقع أحمد الخولي</a></p></div></body>');
  }).listen(Number(process.env.PORT || 4602), () => process.send && process.send('ready'));
}
(async () => {
  if (!DB.user || !DB.database) return notReady('قاعدة البيانات التجريبية مش متظبطة (DEMO_PASSPORTS_DB_NAME / USER / PASSWORD)');
  if (!/demo/i.test(DB.database)) return notReady('اسم قاعدة البيانات لازم يكون فيه demo — رافض أمسح قاعدة: ' + DB.database);
  const seed = path.join(DATA, 'passports.sql.gz');
  try {
    const mysql = require('mysql2/promise');
    const c = await mysql.createConnection(Object.assign({}, DB, { multipleStatements: true, charset: 'utf8mb4_general_ci' }));
    await c.query('SET FOREIGN_KEY_CHECKS = 0');
    const [rows] = await c.query('SELECT TABLE_NAME AS n FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE()');
    for (const r of rows) await c.query('DROP TABLE IF EXISTS `' + String(r.n).replace(/`/g, '') + '`');
    await c.query(zlib.gunzipSync(fs.readFileSync(seed)).toString('utf8'));
    await c.query('SET FOREIGN_KEY_CHECKS = 1');
    await c.end();
    console.log('[demo-passports] رجّعت البيانات التجريبية:', rows.length, '→ جداول جديدة');
  } catch (e) { return notReady('تعذّر تجهيز قاعدة البيانات التجريبية: ' + e.message); }
  Object.assign(process.env, {
    DB_HOST: DB.host, DB_PORT: String(DB.port), DB_USER: DB.user, DB_PASSWORD: DB.password, DB_NAME: DB.database,
    ADMIN_2FA: '0', PASSPORT_DATA_DIR: DATA, PASSPORT_RESET_PASS: '', PASSPORT_RESET_USER: '', SITE_SHARED_SECRET: '', ALLOWED_ORIGINS: '', TRUST_PROXY: '2',
    AUTH_SECRET: process.env.DEMO_PASSPORTS_AUTH_SECRET || require('crypto').randomBytes(24).toString('hex')
  });
  require('./server.js');
})();
