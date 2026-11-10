'use strict';
/* دخول لوحة التحكم: كلمة المرور مشفّرة (scrypt)، وجلسة موقّعة في كوكي، وحد لمحاولات الدخول. */
const crypto = require('crypto');

function hashPass(pass, salt) {
  salt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(String(pass), salt, 64).toString('hex');
  return { salt, hash };
}
function checkPass(pass, user) {
  if (!user || !user.salt || !user.hash) return false;
  const h = crypto.scryptSync(String(pass), user.salt, 64);
  const b = Buffer.from(user.hash, 'hex');
  return b.length === h.length && crypto.timingSafeEqual(b, h);
}
const b64 = (b) => Buffer.from(b).toString('base64url');

function createAuth(store, env) {
  /* سر توقيع الجلسات: من SESSION_SECRET لو موجود، وإلا بيتولّد مرة واحدة ويتحفظ */
  let secret = env.SESSION_SECRET && String(env.SESSION_SECRET).length >= 16 ? String(env.SESSION_SECRET) : null;
  if (!secret) {
    const saved = store.readJson('secret.json', null);
    if (saved && saved.secret) secret = saved.secret;
    else { secret = crypto.randomBytes(32).toString('hex'); store.writeJson('secret.json', { secret }); }
  }

  /* أول مستخدم: من ADMIN_USER / ADMIN_PASS، أو باسورد عشوائي يتكتب في اللوج مرة واحدة */
  function users() { return store.readJson('users.json', { users: [] }); }
  function bootstrap(log) {
    const u = users();
    if (u.users.length) {
      // لو ADMIN_PASS اتغيّر في المتغيرات، ده بيعتبر طلب إعادة ضبط
      const eu = env.ADMIN_USER, ep = env.ADMIN_PASS;
      if (eu && ep && ep.length >= 10) {
        const cur = u.users.find((x) => x.name === eu);
        if (cur && !checkPass(ep, cur)) { Object.assign(cur, hashPass(ep), { pv: crypto.randomBytes(4).toString('hex') }); store.writeJson('users.json', u); log('[ADMIN] اتحدّثت كلمة مرور ' + eu + ' من ADMIN_PASS'); }
      }
      return;
    }
    let name = env.ADMIN_USER || 'admin', pass = env.ADMIN_PASS, generated = false;
    if (!pass || pass.length < 10) { pass = crypto.randomBytes(9).toString('base64url'); generated = true; }
    store.writeJson('users.json', { users: [Object.assign({ name, pv: crypto.randomBytes(4).toString('hex') }, hashPass(pass))] });
    if (generated) log('[ADMIN] اتعمل حساب المدير. اسم الدخول: ' + name + '  —  كلمة المرور المؤقتة: ' + pass + '  (غيّرها من لوحة التحكم، أو حط ADMIN_PASS في المتغيرات)');
    else log('[ADMIN] اتعمل حساب المدير: ' + name);
  }

  /* ---- الجلسة ---- */
  const sign = (p) => crypto.createHmac('sha256', secret).update(p).digest('base64url');
  function makeToken(user) {
    const payload = b64(JSON.stringify({ u: user.name, pv: user.pv, exp: Date.now() + 12 * 3600 * 1000 }));
    return payload + '.' + sign(payload);
  }
  function readToken(tok) {
    if (!tok || typeof tok !== 'string' || tok.length > 600) return null;
    const [p, s] = tok.split('.');
    if (!p || !s) return null;
    const exp = sign(p);
    if (s.length !== exp.length || !crypto.timingSafeEqual(Buffer.from(s), Buffer.from(exp))) return null;
    let data; try { data = JSON.parse(Buffer.from(p, 'base64url').toString('utf8')); } catch (e) { return null; }
    if (!data || data.exp < Date.now()) return null;
    const user = users().users.find((x) => x.name === data.u);
    if (!user || user.pv !== data.pv) return null;
    return user;
  }
  const cookies = (req) => Object.fromEntries(String(req.headers.cookie || '').split(';').map((c) => c.trim().split('=')).filter((p) => p[0]).map((p) => [p[0], decodeURIComponent(p.slice(1).join('='))]));
  function setCookie(req, res, tok, maxAge) {
    const secure = req.secure || String(req.headers['x-forwarded-proto'] || '').includes('https');
    res.setHeader('Set-Cookie', 'sid=' + encodeURIComponent(tok) + '; Path=/admin; HttpOnly; SameSite=Strict; Max-Age=' + maxAge + (secure ? '; Secure' : ''));
  }

  /* ---- حد المحاولات ---- */
  const tries = new Map();
  function limited(key, max, windowMs) {
    const now = Date.now(); const rec = (tries.get(key) || []).filter((t) => now - t < windowMs);
    tries.set(key, rec);
    return rec.length >= max;
  }
  function hit(key) { const rec = tries.get(key) || []; rec.push(Date.now()); tries.set(key, rec); }
  setInterval(() => { const now = Date.now(); for (const [k, v] of tries) { const r = v.filter((t) => now - t < 3600000); if (r.length) tries.set(k, r); else tries.delete(k); } }, 600000).unref();

  const ip = (req) => String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();

  function login(req, res, name, pass) {
    const key = 'login:' + ip(req);
    if (limited(key, 8, 15 * 60 * 1000)) return { ok: false, status: 429, message: 'محاولات كتير. جرّب بعد شوية.' };
    const user = users().users.find((x) => x.name === String(name || '').trim());
    // بنحسب الـ hash حتى لو اليوزر مش موجود، عشان التوقيت ميكشفش حاجة
    const okPass = checkPass(pass, user || { salt: '00', hash: '00'.repeat(64) });
    if (!user || !okPass) { hit(key); return { ok: false, status: 401, message: 'اسم الدخول أو كلمة المرور غلط.' }; }
    setCookie(req, res, makeToken(user), 12 * 3600);
    return { ok: true, user: user.name };
  }
  function logout(req, res) { setCookie(req, res, '', 0); }
  function current(req) { return readToken(cookies(req).sid); }

  /* ميدلوير: لازم مدير مسجّل + هيدر X-Requested-With في أي تعديل (حماية CSRF) */
  function requireAdmin(req, res, next) {
    const user = current(req);
    if (!user) return res.status(401).json({ ok: false, message: 'سجّل الدخول الأول.' });
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.headers['x-requested-with'] !== 'admin') return res.status(403).json({ ok: false, message: 'طلب مرفوض.' });
    req.admin = user; next();
  }

  function changePassword(user, oldPass, newPass) {
    if (!checkPass(oldPass, user)) return { ok: false, message: 'كلمة المرور الحالية غلط.' };
    if (String(newPass || '').length < 10) return { ok: false, message: 'كلمة المرور الجديدة لازم تكون 10 حروف على الأقل.' };
    const u = users(); const cur = u.users.find((x) => x.name === user.name);
    Object.assign(cur, hashPass(newPass), { pv: crypto.randomBytes(4).toString('hex') });
    store.writeJson('users.json', u);
    return { ok: true, user: cur };
  }

  return { bootstrap, login, logout, current, requireAdmin, changePassword, makeToken, setCookie, limited, hit, ip };
}

module.exports = { createAuth };
