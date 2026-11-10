'use strict';
/* =========================================================
   ahmedalkholy.com — تطبيق واحد على Hostinger (Node.js)
   - "/"                 → الموقع الشخصي (ملفات ثابتة من site/)
   - "/demo-hr/..."      → نسخة تجريبية حقيقية من مسار HR
   - "/demo-passports/…" → نسخة تجريبية من نظام الجوازات
   - "/demo-wesal/…"     → نسخة ويب تجريبية من تطبيق وصال
   كل نظام بيشتغل كعملية لوحده على بورت داخلي، والبيانات بترجع
   لأولها (بيانات وهمية) كل RESET_MINUTES دقيقة.
   ========================================================= */
const http = require('http');
const path = require('path');
const fs = require('fs');
const { fork } = require('child_process');
const express = require('express');
const httpProxy = require('http-proxy');

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 3000);
const DATA_ROOT = path.resolve(process.env.DEMO_DATA_DIR || path.join(ROOT, 'data'));
const DATA = path.join(DATA_ROOT, String(process.pid)); // لكل نسخة من البوابة فولدر لوحدها (لو الاستضافة شغّلت أكتر من واحدة)
const RESET_MIN = Math.max(10, Number(process.env.DEMO_RESET_MINUTES || 60));
const APPS = require('./apps.config');

const log = (...a) => console.log(new Date().toISOString(), '[GATEWAY]', ...a);
fs.mkdirSync(DATA, { recursive: true });
// امسح فولدرات النسخ القديمة اللي اتقفلت
const alive = (pid) => { try { process.kill(pid, 0); return true; } catch (e) { return e.code === 'EPERM'; } };
try { for (const n of fs.readdirSync(DATA_ROOT)) if (/^\d+$/.test(n) && Number(n) !== process.pid && !alive(Number(n))) fs.rmSync(path.join(DATA_ROOT, n), { recursive: true, force: true }); } catch (e) {}
const net = require('net');
/* بورت فاضي لكل نظام فرعي في كل تشغيل — عشان لو فيه عملية قديمة لسه ماسكة بورت مايحصلش تعارض */
const freePort = () => new Promise((resolve, reject) => { const s = net.createServer(); s.on('error', reject); s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => resolve(p)); }); });

/* ---------------- تشغيل الأنظمة التجريبية ---------------- */
function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) copyDir(s, d); else fs.copyFileSync(s, d);
  }
}
const state = {};
function startApp(a) {
  const st = state[a.id] || (state[a.id] = { ready: false, child: null, resetAt: 0, restarts: 0, port: 0, starting: false });
  if (st.starting || st.child) return;
  st.starting = true; st.ready = false;
  freePort().then((port) => { st.starting = false; launch(a, st, port); })
    .catch((e) => { st.starting = false; log(a.id, 'مفيش بورت فاضي:', e.message); setTimeout(() => startApp(a), 5000); });
}
function launch(a, st, port) {
  st.port = port;
  const dataDir = path.join(DATA, a.id);
  // بيانات جديدة من النسخة الأصلية الوهمية
  fs.rmSync(dataDir, { recursive: true, force: true });
  if (a.seed && fs.existsSync(path.join(ROOT, a.seed))) copyDir(path.join(ROOT, a.seed), dataDir); else fs.mkdirSync(dataDir, { recursive: true });
  st.ready = false; st.resetAt = Date.now();
  const env = Object.assign({}, process.env, a.env(dataDir), { PORT: String(port), DEMO_BASE: a.prefix });
  const child = fork(path.join(ROOT, a.entry), [], { cwd: path.join(ROOT, a.cwd || path.dirname(a.entry)), env, stdio: ['ignore', 'inherit', 'inherit', 'ipc'] });
  st.child = child;
  child.on('message', (m) => { if (m === 'ready' && st.child === child) { st.ready = true; log(a.id, 'جاهز'); } });
  child.on('exit', (code) => {
    if (st.child !== child) return;
    st.ready = false; st.child = null;
    log(a.id, 'وقف (', code, ') — هيتعاد تشغيله');
    const wait = Math.min(60000, 2000 * (++st.restarts));
    setTimeout(() => { if (!st.child) startApp(a); }, wait);
  });
  // بعض الأنظمة مبتبعتش "ready": نختبر البورت
  const probe = setInterval(() => {
    if (st.child !== child) return clearInterval(probe);
    const r = http.get({ host: '127.0.0.1', port, path: a.health || '/', timeout: 2000 }, (res) => { res.resume(); if (res.statusCode < 500) { st.ready = true; st.restarts = 0; clearInterval(probe); } });
    r.on('error', () => {}); r.on('timeout', () => r.destroy());
  }, 1500);
}
function resetApp(a) {
  const st = state[a.id];
  log(a.id, 'إعادة ضبط البيانات');
  if (st && st.child) { const c = st.child; st.child = null; st.ready = false; c.kill('SIGTERM'); setTimeout(() => { try { c.kill('SIGKILL'); } catch (e) {} }, 4000); }
  setTimeout(() => startApp(a), 1200);
}
for (const a of APPS) startApp(a);
setInterval(() => { for (const a of APPS) if (Date.now() - (state[a.id]?.resetAt || 0) >= RESET_MIN * 60000) resetApp(a); }, 60000).unref();
const killAll = () => { for (const s of Object.values(state)) try { s.child && s.child.kill('SIGKILL'); } catch (e) {} };
process.on('exit', killAll);
for (const sig of ['SIGTERM', 'SIGINT', 'SIGHUP']) process.on(sig, () => process.exit(0));

/* ---------------- البروكسي ---------------- */
const proxy = httpProxy.createProxyServer({ xfwd: true, ws: true, proxyTimeout: 120000 });
proxy.on('error', (err, req, res) => {
  if (res && res.writeHead && !res.headersSent) { res.writeHead(502, { 'Content-Type': 'text/html; charset=utf-8', 'Retry-After': '5' }); res.end(waitPage()); }
  else if (res && res.destroy) res.destroy();
});
proxy.on('proxyRes', (pr, req) => {
  const a = req._demo; if (!a) return;
  const loc = pr.headers.location;
  if (loc && loc.startsWith('/') && !loc.startsWith('//') && !loc.startsWith(a.prefix + '/')) pr.headers.location = a.prefix + loc;
  if (pr.headers['set-cookie']) pr.headers['set-cookie'] = [].concat(pr.headers['set-cookie']).map((c) => c.replace(/;\s*Path=\/(?=;|$)/i, '; Path=' + a.prefix + '/'));
  delete pr.headers['strict-transport-security'];
});
function waitPage() {
  return '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="4"><title>جارٍ التجهيز…</title>' +
    '<body style="font-family:system-ui,Tahoma,sans-serif;display:grid;place-items:center;min-height:90vh;background:#f5f8fc;color:#1D4E89;text-align:center" dir="rtl">' +
    '<div><div style="width:46px;height:46px;border:5px solid #dbe5f2;border-top-color:#F5A524;border-radius:50%;margin:0 auto 16px;animation:s 1s linear infinite"></div>' +
    '<b style="font-size:1.2rem">النسخة التجريبية بتتجهّز…</b><p style="color:#55657C">ثواني وهتفتح لوحدها.<br>The demo is starting — this page refreshes automatically.</p></div>' +
    '<style>@keyframes s{to{transform:rotate(360deg)}}</style></body>';
}
const sendJson = (res, code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(obj)); };
const BLOCK_MSG = { ok: false, message: 'الخاصية دي مقفولة في النسخة التجريبية. اطلب ديمو مباشر للنظام الكامل. — Disabled in the demo.' };

function matchApp(url) { return APPS.find((a) => url === a.prefix || url.startsWith(a.prefix + '/') || url.startsWith(a.prefix + '?')); }

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.get('/healthz', (req, res) => res.json({ ok: true, apps: Object.fromEntries(APPS.map((a) => [a.id, { ready: !!state[a.id]?.ready, resetAt: new Date(state[a.id]?.resetAt || 0).toISOString() }])) }));
app.use((req, res, next) => {
  const a = matchApp(req.url);
  if (!a) return next();
  if (req.url === a.prefix || req.url.startsWith(a.prefix + '?')) return res.redirect(301, a.prefix + '/' + req.url.slice(a.prefix.length));
  const st = state[a.id];
  if (!st || !st.ready) { res.status(503).set({ 'Retry-After': '5', 'Cache-Control': 'no-store' }); return req.path.includes('/api/') ? sendJson(res, 503, { ok: false, message: 'النسخة التجريبية بتتجهّز — جرّب كمان ثواني' }) : res.type('html').send(waitPage()); }
  const inner = req.url.slice(a.prefix.length) || '/';
  const pathOnly = inner.split('?')[0];
  if ((a.block || []).some((b) => (!b.method || b.method.test(req.method)) && b.path.test(pathOnly))) return sendJson(res, 403, BLOCK_MSG);
  const len = Number(req.headers['content-length'] || 0);
  if (len > (a.maxBody || 8) * 1024 * 1024) return sendJson(res, 413, { ok: false, message: `أقصى حجم للملفات في النسخة التجريبية ${a.maxBody || 8} ميجا` });
  req.url = inner; req._demo = a;
  proxy.web(req, res, { target: `http://127.0.0.1:${st.port}` });
});

/* ---------------- الموقع الشخصي ---------------- */
const SITE = path.join(ROOT, 'site');
app.use(express.static(SITE, {
  extensions: ['html'],
  setHeaders: (res, p) => {
    if (/\.(css|js|jpe?g|png|webp|svg|woff2?|mp4|pdf)$/i.test(p)) res.setHeader('Cache-Control', 'public, max-age=604800');
    else res.setHeader('Cache-Control', 'no-cache');
  }
}));
app.use((req, res) => res.status(404).sendFile(path.join(SITE, 'index.html')));

const server = http.createServer(app);
server.on('upgrade', (req, socket, head) => {
  const a = matchApp(req.url);
  if (!a || !state[a.id]?.ready) return socket.destroy();
  req.url = req.url.slice(a.prefix.length) || '/'; req._demo = a;
  proxy.ws(req, socket, head, { target: `http://127.0.0.1:${state[a.id].port}` });
});
server.listen(PORT, () => log('شغال على البورت', PORT, '— الأنظمة:', APPS.map((a) => a.prefix).join(' ')));
