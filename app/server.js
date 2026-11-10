'use strict';
/* =========================================================
   موقع أحمد ماهر الخولي — تطبيق Node.js واحد بلوحة تحكم
   - "/"         الموقع (بيتبني من محتوى محفوظ في ملف JSON)
   - "/admin"    لوحة التحكم (تعديل كل حاجة + رفع صور وملفات)
   من غير قاعدة بيانات. البيانات في DATA_DIR (برّه فولدر التطبيق).
   ========================================================= */
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const express = require('express');
const multer = require('multer');
const { createStore } = require('./lib/store');
const { createAuth } = require('./lib/auth');
const { createRenderer } = require('./lib/render');

const PUBLIC = path.join(__dirname, 'public');
const PORT = Number(process.env.PORT || 3000);
const log = (...a) => console.log(new Date().toISOString(), ...a);

const store = createStore(path.join(__dirname, 'seed', 'content.json'));
if (store.upgraded === 'applied') log('[CONTENT] اتحدّث المحتوى الافتراضي لنسخة أحدث (النسخة القديمة محفوظة في النسخ الاحتياطية)');
else if (store.upgraded === 'skipped-edited') log('[CONTENT] فيه نسخة محتوى افتراضي أحدث، بس محتواك معدّل من اللوحة فماتغيّرش. لو عايزها: الحساب ← إعادة المحتوى للافتراضي.');
const auth = createAuth(store, process.env);
auth.bootstrap(log);
const renderer = createRenderer(PUBLIC);

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

/* ---------------- الملفات الثابتة ---------------- */
const staticOpts = {
  index: false, etag: true,
  setHeaders(res, p) {
    if (/\.(jpe?g|png|webp|gif|svg|ico|woff2?|mp4|pdf|xlsx)$/i.test(p)) res.setHeader('Cache-Control', 'public, max-age=604800');
    else res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  }
};
app.use('/assets', express.static(path.join(PUBLIC, 'assets'), staticOpts));
app.use('/uploads', express.static(store.uploads, Object.assign({}, staticOpts, { setHeaders(res) { res.setHeader('Cache-Control', 'public, max-age=86400'); res.setHeader('Content-Security-Policy', "default-src 'none'; img-src 'self'; media-src 'self'; style-src 'unsafe-inline'"); } })));
app.get('/robots.txt', (req, res) => res.type('text/plain').send('User-agent: *\nAllow: /\nDisallow: /admin\n'));
app.get('/healthz', (req, res) => res.json({ ok: true, uptimeSec: Math.round(process.uptime()), dataDir: store.dir }));

/* ---------------- الصفحة الرئيسية ---------------- */
app.get('/', (req, res) => {
  res.set('Cache-Control', 'no-cache').type('html').send(renderer.render(req, store.getContent()));
});

/* ---------------- رسائل الزوار ---------------- */
app.post('/api/contact', express.json({ limit: '20kb' }), (req, res) => {
  const key = 'contact:' + auth.ip(req);
  if (auth.limited(key, 5, 60 * 60 * 1000)) return res.status(429).json({ ok: false, message: 'رسائل كتير. جرّب بعد شوية.' });
  const b = req.body || {};
  const name = String(b.name || '').trim().slice(0, 120), message = String(b.message || '').trim().slice(0, 3000);
  if (b.website) return res.json({ ok: true }); // فخ للروبوتات (خانة مخفية)
  if (name.length < 2 || message.length < 5) return res.status(400).json({ ok: false, message: 'اكتب الاسم والرسالة.' });
  auth.hit(key);
  store.messages.add({ id: crypto.randomBytes(6).toString('hex'), time: new Date().toISOString(), name, contact: String(b.contact || '').trim().slice(0, 160), topic: String(b.topic || '').slice(0, 40), message, read: false });
  res.json({ ok: true });
});

/* =========================================================
   لوحة التحكم
   ========================================================= */
const admin = express.Router();
admin.use((req, res, next) => { res.set('Cache-Control', 'no-store'); res.setHeader('X-Robots-Tag', 'noindex, nofollow'); next(); });
admin.get('/', (req, res) => res.sendFile(path.join(PUBLIC, 'admin', 'index.html')));
admin.use('/static', express.static(path.join(PUBLIC, 'admin'), { index: false, setHeaders: (res) => res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate') }));

const api = express.Router();
api.post('/login', express.json({ limit: '5kb' }), (req, res) => {
  const r = auth.login(req, res, (req.body || {}).user, (req.body || {}).pass, log);
  res.status(r.ok || r.need2fa ? 200 : r.status).json(r);
});
api.post('/login/2fa', express.json({ limit: '5kb' }), (req, res) => {
  const r = auth.login2fa(req, res, (req.body || {}).challenge, (req.body || {}).code, log);
  res.status(r.ok ? 200 : r.status).json(r);
});
api.post('/logout', (req, res) => { auth.logout(req, res); res.json({ ok: true }); });
api.get('/me', (req, res) => { const u = auth.current(req); res.json({ ok: !!u, user: u ? u.name : null, twofa: u ? auth.twofa.status(u).enabled : false }); });
api.use(auth.requireAdmin);

api.get('/content', (req, res) => res.json({ ok: true, content: store.getContent() }));
api.put('/content', express.json({ limit: '3mb' }), (req, res) => {
  const c = store.clean(req.body && req.body.content);
  if (!c || typeof c !== 'object' || Array.isArray(c) || !c.settings || !c.layout) return res.status(400).json({ ok: false, message: 'المحتوى مش مكتمل.' });
  c._edited = true; // من هنا ورايح، التعديلات بتاعتك ومفيش ترقية تلقائية فوقها
  store.setContent(c);
  res.json({ ok: true });
});
api.get('/backups', (req, res) => res.json({ ok: true, backups: store.listBackups() }));
api.post('/backups/restore', express.json(), (req, res) => {
  try { store.restoreBackup(String((req.body || {}).name || '')); res.json({ ok: true }); } catch (e) { res.status(400).json({ ok: false, message: 'مقدرتش أرجّع النسخة دي.' }); }
});
api.post('/reset', express.json(), (req, res) => { if ((req.body || {}).confirm !== 'RESET') return res.status(400).json({ ok: false }); store.resetToSeed(); res.json({ ok: true }); });

/* ---- الوسائط (صور وملفات) ---- */
const EXT = { 'image/png': '.png', 'image/jpeg': '.jpg', 'image/webp': '.webp', 'image/gif': '.gif', 'application/pdf': '.pdf', 'video/mp4': '.mp4', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx' };
const MAGIC = { '.png': [0x89, 0x50, 0x4e, 0x47], '.jpg': [0xff, 0xd8, 0xff], '.gif': [0x47, 0x49, 0x46], '.pdf': [0x25, 0x50, 0x44, 0x46], '.xlsx': [0x50, 0x4b] };
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, store.uploads),
    filename: (req, file, cb) => {
      const base = path.basename(file.originalname, path.extname(file.originalname)).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'file';
      cb(null, Date.now().toString(36) + '-' + base + EXT[file.mimetype]);
    }
  }),
  limits: { fileSize: 40 * 1024 * 1024, files: 20 },
  fileFilter: (req, file, cb) => cb(null, !!EXT[file.mimetype])
});
function listBundled() {
  const out = []; const root = path.join(PUBLIC, 'assets');
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.(png|jpe?g|webp|gif|pdf|mp4|xlsx)$/i.test(e.name) && /[\\/]assets[\\/](img|cv|files|video)[\\/]/.test(p)) out.push({ url: 'assets/' + path.relative(root, p).split(path.sep).join('/'), name: e.name, size: fs.statSync(p).size, bundled: true });
    }
  })(root);
  return out;
}
api.get('/media', (req, res) => {
  const mine = fs.readdirSync(store.uploads).filter((n) => !n.startsWith('.')).map((n) => { const st = fs.statSync(path.join(store.uploads, n)); return { url: 'uploads/' + n, name: n, size: st.size, time: st.mtime.toISOString(), bundled: false }; }).sort((a, b) => b.time.localeCompare(a.time));
  res.json({ ok: true, uploads: mine, bundled: listBundled() });
});
api.post('/upload', upload.array('file', 20), (req, res) => {
  const done = [], bad = [];
  for (const f of req.files || []) {
    const ext = path.extname(f.filename).toLowerCase(); const m = MAGIC[ext];
    let ok = true;
    if (m) { const fd = fs.openSync(f.path, 'r'); const buf = Buffer.alloc(m.length); fs.readSync(fd, buf, 0, m.length, 0); fs.closeSync(fd); ok = m.every((b, i) => buf[i] === b); }
    if (ok) done.push({ url: 'uploads/' + f.filename, name: f.filename, size: f.size }); else { fs.rmSync(f.path, { force: true }); bad.push(f.originalname); }
  }
  if (!done.length) return res.status(400).json({ ok: false, message: 'الملف مش مقبول. المسموح: صور (PNG/JPG/WEBP/GIF) وPDF وMP4 وExcel، وأقصى حجم 40 ميجا.' });
  res.json({ ok: true, files: done, rejected: bad });
});
api.delete('/media/:name', (req, res) => {
  const n = path.basename(String(req.params.name));
  const p = path.join(store.uploads, n);
  if (!p.startsWith(store.uploads) || !fs.existsSync(p)) return res.status(404).json({ ok: false });
  fs.rmSync(p, { force: true }); res.json({ ok: true });
});

/* ---- الرسائل ---- */
api.get('/messages', (req, res) => res.json({ ok: true, messages: store.messages.list() }));
api.post('/messages/:id/read', (req, res) => { store.messages.read(req.params.id); res.json({ ok: true }); });
api.delete('/messages/:id', (req, res) => { store.messages.del(req.params.id); res.json({ ok: true }); });

/* ---- التحقق بخطوتين ---- */
const QR = require('qrcode-generator');
const reissue = (req, res, user) => auth.setCookie(req, res, auth.makeToken(user), 12 * 3600);
api.get('/2fa', (req, res) => res.json(Object.assign({ ok: true }, auth.twofa.status(req.admin))));
api.post('/2fa/setup', (req, res) => {
  if (auth.twofa.status(req.admin).enabled) return res.status(400).json({ ok: false, message: 'مفعّل بالفعل.' });
  const r = auth.twofa.setup(req.admin, 'Ahmed Alkholy');
  const q = QR(0, 'M'); q.addData(r.uri); q.make();
  res.json({ ok: true, secret: r.secret, uri: r.uri, svg: q.createSvgTag({ cellSize: 5, margin: 2, scalable: true }) });
});
api.post('/2fa/enable', express.json({ limit: '2kb' }), (req, res) => {
  const r = auth.twofa.enable(req.admin, (req.body || {}).code);
  if (!r.ok) return res.status(400).json(r);
  reissue(req, res, r.user); res.json({ ok: true, recovery: r.recovery });
});
api.post('/2fa/disable', express.json({ limit: '2kb' }), (req, res) => {
  const k = 'tfa:' + auth.ip(req); if (auth.limited(k, 6, 15 * 60 * 1000)) return res.status(429).json({ ok: false, message: 'محاولات كتير. جرّب بعد شوية.' });
  const r = auth.twofa.disable(req.admin, (req.body || {}).pass, (req.body || {}).code);
  if (!r.ok) { auth.hit(k); return res.status(400).json(r); }
  reissue(req, res, r.user); res.json({ ok: true });
});
api.post('/2fa/recovery', express.json({ limit: '2kb' }), (req, res) => {
  const k = 'tfa:' + auth.ip(req); if (auth.limited(k, 6, 15 * 60 * 1000)) return res.status(429).json({ ok: false, message: 'محاولات كتير. جرّب بعد شوية.' });
  const r = auth.twofa.regen(req.admin, (req.body || {}).code);
  if (!r.ok) { auth.hit(k); return res.status(400).json(r); }
  res.json(r);
});

/* ---- الحساب ---- */
api.post('/password', express.json({ limit: '5kb' }), (req, res) => {
  const r = auth.changePassword(req.admin, (req.body || {}).old, (req.body || {}).new);
  if (!r.ok) return res.status(400).json(r);
  auth.setCookie(req, res, auth.makeToken(r.user), 12 * 3600);
  res.json({ ok: true });
});

admin.use('/api', api);
app.use('/admin', admin);

app.use((err, req, res, next) => {
  if (err && err.type === 'entity.too.large') return res.status(413).json({ ok: false, message: 'الحجم أكبر من المسموح.' });
  if (err && err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ ok: false, message: 'الملف أكبر من 40 ميجا.' });
  console.error(new Date().toISOString(), '[ERROR]', err && err.stack || err);
  res.status(500).json({ ok: false, message: 'حصل خطأ.' });
});
app.use((req, res) => res.status(404).type('html').send('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>404</title><body style="font-family:system-ui,Tahoma;display:grid;place-items:center;min-height:90vh;text-align:center;background:#f5f8fc;color:#1D4E89"><div><h1 style="font-size:4rem;margin:0">404</h1><p>الصفحة مش موجودة — Page not found</p><p><a href="/" style="color:#1D4E89">← الرئيسية / Home</a></p></div></body>'));

process.on('uncaughtException', (e) => console.error(new Date().toISOString(), '[uncaughtException]', e && e.stack || e));
process.on('unhandledRejection', (e) => console.error(new Date().toISOString(), '[unhandledRejection]', e && e.stack || e));
app.listen(PORT, () => log('شغال على البورت', PORT, '— بيانات الموقع في:', store.dir));
