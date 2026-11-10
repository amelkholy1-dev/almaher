'use strict';
/* دخول لوحة التحكم:
   - كلمة المرور مشفّرة (scrypt)
   - تحقق بخطوتين اختياري (TOTP متوافق مع Google Authenticator / Microsoft Authenticator / Authy) + أكواد استرجاع
   - جلسة موقّعة في كوكي، وحد لمحاولات الدخول */
const crypto = require('crypto');

/* ---------- كلمات المرور ---------- */
function hashPass(pass, salt) {
  salt = salt || crypto.randomBytes(16).toString('hex');
  return { salt, hash: crypto.scryptSync(String(pass), salt, 64).toString('hex') };
}
function checkPass(pass, user) {
  if (!user || !user.salt || !user.hash) return false;
  const h = crypto.scryptSync(String(pass), user.salt, 64);
  const b = Buffer.from(user.hash, 'hex');
  return b.length === h.length && crypto.timingSafeEqual(b, h);
}
const b64 = (b) => Buffer.from(b).toString('base64url');
const same = (a, b) => { a = Buffer.from(String(a)); b = Buffer.from(String(b)); return a.length === b.length && crypto.timingSafeEqual(a, b); };
/* قيم المتغيرات: بنشيل المسافات وعلامات التنصيص اللي ممكن تتحط بالغلط في لوحة الاستضافة */
const clean = (v) => String(v == null ? '' : v).trim().replace(/^(['"])([\s\S]*)\1$/, '$2').trim();

/* ---------- TOTP (RFC 6238) ---------- */
const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
function b32enc(buf) { let bits = 0, val = 0, out = ''; for (const x of buf) { val = (val << 8) | x; bits += 8; while (bits >= 5) { out += B32[(val >>> (bits - 5)) & 31]; bits -= 5; } } if (bits > 0) out += B32[(val << (5 - bits)) & 31]; return out; }
function b32dec(s) { let bits = 0, val = 0; const out = []; for (const c of String(s).replace(/=+$/, '').toUpperCase()) { const i = B32.indexOf(c); if (i < 0) continue; val = (val << 5) | i; bits += 5; if (bits >= 8) { out.push((val >>> (bits - 8)) & 255); bits -= 8; } } return Buffer.from(out); }
function hotp(key, counter) {
  const msg = Buffer.alloc(8); msg.writeBigUInt64BE(BigInt(counter));
  const h = crypto.createHmac('sha1', key).update(msg).digest(); const o = h[19] & 15;
  return String((((h[o] & 127) << 24) | (h[o + 1] << 16) | (h[o + 2] << 8) | h[o + 3]) % 1000000).padStart(6, '0');
}
/* بيرجّع رقم الخطوة لو الكود صح (وماستُخدمش قبل كده)، وإلا null */
function verifyTotp(secretB32, code, lastStep) {
  code = String(code || '').replace(/\s|-/g, '');
  if (!/^\d{6}$/.test(code)) return null;
  const key = b32dec(secretB32), now = Math.floor(Date.now() / 30000);
  for (const d of [0, -1, 1]) { const s = now + d; if (s <= (lastStep || 0)) continue; if (same(hotp(key, s), code)) return s; }
  return null;
}

function createAuth(store, env) {
  /* سر توقيع الجلسات: من SESSION_SECRET لو موجود، وإلا بيتولّد مرة واحدة ويتحفظ */
  let secret = clean(env.SESSION_SECRET).length >= 16 ? clean(env.SESSION_SECRET) : null;
  if (!secret) {
    const saved = store.readJson('secret.json', null);
    if (saved && saved.secret) secret = saved.secret;
    else { secret = crypto.randomBytes(32).toString('hex'); store.writeJson('secret.json', { secret }); }
  }
  const mac = (s) => crypto.createHmac('sha256', secret).update(s).digest('base64url');

  /* ---------- المستخدمين ---------- */
  const users = () => store.readJson('users.json', { users: [] });
  const saveUsers = (u) => store.writeJson('users.json', u);
  const findUser = (name) => users().users.find((x) => x.name.toLowerCase() === String(name || '').trim().toLowerCase());
  function updateUser(name, fn) { const u = users(); const cur = u.users.find((x) => x.name === name); if (!cur) return null; fn(cur); saveUsers(u); return cur; }
  const rnd = () => crypto.randomBytes(4).toString('hex');

  /* بيتنادى كل ما التطبيق يشتغل: بيطابق الحساب مع ADMIN_USER / ADMIN_PASS */
  function bootstrap(log) {
    const eu = clean(env.ADMIN_USER), ep = clean(env.ADMIN_PASS);
    const u = users(); let changed = false;
    if (eu && ep) {
      if (ep.length < 10) log('[ADMIN] تحذير: ADMIN_PASS قصيرة (' + ep.length + ' حروف). الأفضل 10 حروف أو أكتر.');
      let cur = u.users.find((x) => x.name.toLowerCase() === eu.toLowerCase());
      if (!cur) { cur = Object.assign({ name: eu, pv: rnd() }, hashPass(ep)); u.users.push(cur); changed = true; log('[ADMIN] اتعمل المستخدم "' + eu + '" من المتغيرات'); }
      else if (!checkPass(ep, cur)) { Object.assign(cur, hashPass(ep), { pv: rnd() }); changed = true; log('[ADMIN] اتحدّثت كلمة مرور "' + cur.name + '" من ADMIN_PASS'); }
      const n = u.users.length; u.users = u.users.filter((x) => !x.gen || x === cur);
      if (u.users.length !== n) { changed = true; log('[ADMIN] اتمسح الحساب المؤقت القديم'); }
    } else if (!u.users.length) {
      const name = eu || 'admin', pass = crypto.randomBytes(9).toString('base64url');
      u.users.push(Object.assign({ name, gen: true, pv: rnd() }, hashPass(pass))); changed = true;
      log('[ADMIN] اتعمل حساب مؤقت. اسم الدخول: ' + name + '  —  كلمة المرور المؤقتة: ' + pass + '  — حط ADMIN_USER و ADMIN_PASS في المتغيرات عشان تحدد بياناتك.');
    }
    if (clean(env.ADMIN_DISABLE_2FA) === '1') {
      for (const x of u.users) if (x.totp) { delete x.totp; delete x.totpPending; x.pv = rnd(); changed = true; log('[ADMIN] اتعطّل التحقق بخطوتين للمستخدم "' + x.name + '" (ADMIN_DISABLE_2FA). امسح المتغير ده بعد ما تدخل.'); }
    }
    if (changed) saveUsers(u);
    log('[ADMIN] المستخدمين: ' + u.users.map((x) => x.name + (x.totp && x.totp.enabled ? ' (2FA)' : '')).join(', ') + ' | ADMIN_USER ' + (eu ? 'محدد' : 'غير محدد') + ' | ADMIN_PASS ' + (ep ? 'محددة (' + ep.length + ' حرف)' : 'غير محددة'));
  }

  /* ---------- الجلسة والتوكن ---------- */
  function makeToken(user, kind) {
    const life = kind === 'c' ? 5 * 60 * 1000 : 12 * 3600 * 1000;
    const p = b64(JSON.stringify({ u: user.name, pv: user.pv, t: kind || 's', exp: Date.now() + life }));
    return p + '.' + mac(p);
  }
  function readToken(tok, kind) {
    if (!tok || typeof tok !== 'string' || tok.length > 700) return null;
    const [p, s] = tok.split('.'); if (!p || !s || !same(s, mac(p))) return null;
    let d; try { d = JSON.parse(Buffer.from(p, 'base64url').toString('utf8')); } catch (e) { return null; }
    if (!d || d.exp < Date.now() || (d.t || 's') !== (kind || 's')) return null;
    const user = users().users.find((x) => x.name === d.u);
    return user && user.pv === d.pv ? user : null;
  }
  const cookies = (req) => Object.fromEntries(String(req.headers.cookie || '').split(';').map((c) => c.trim().split('=')).filter((x) => x[0]).map((x) => [x[0], decodeURIComponent(x.slice(1).join('='))]));
  function setCookie(req, res, tok, maxAge) {
    const secure = req.secure || String(req.headers['x-forwarded-proto'] || '').includes('https');
    res.setHeader('Set-Cookie', 'sid=' + encodeURIComponent(tok) + '; Path=/admin; HttpOnly; SameSite=Strict; Max-Age=' + maxAge + (secure ? '; Secure' : ''));
  }

  /* ---------- حد المحاولات ---------- */
  const tries = new Map();
  function limited(key, max, windowMs) { const now = Date.now(); const rec = (tries.get(key) || []).filter((t) => now - t < windowMs); tries.set(key, rec); return rec.length >= max; }
  function hit(key) { const rec = tries.get(key) || []; rec.push(Date.now()); tries.set(key, rec); }
  setInterval(() => { const now = Date.now(); for (const [k, v] of tries) { const r = v.filter((t) => now - t < 3600000); if (r.length) tries.set(k, r); else tries.delete(k); } }, 600000).unref();
  const ip = (req) => String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
  const LOCK = { ok: false, status: 429, message: 'محاولات كتير. جرّب بعد 15 دقيقة.' };

  /* ---------- الدخول (خطوتين لو التحقق مفعّل) ---------- */
  function login(req, res, name, pass, log) {
    const key = 'login:' + ip(req);
    if (limited(key, 8, 15 * 60 * 1000)) return LOCK;
    const user = findUser(name);
    const okPass = checkPass(String(pass == null ? '' : pass), user || { salt: '00', hash: '00'.repeat(64) }); // نحسب hash حتى لو المستخدم مش موجود
    if (!user || !okPass) {
      hit(key);
      if (log) log('[ADMIN] محاولة دخول فاشلة — المستخدم ' + (user ? 'موجود (الباسورد غلط)' : 'مش موجود'));
      return { ok: false, status: 401, message: 'اسم الدخول أو كلمة المرور غلط.' };
    }
    if (user.totp && user.totp.enabled) return { ok: false, need2fa: true, status: 200, challenge: makeToken(user, 'c') };
    setCookie(req, res, makeToken(user), 12 * 3600);
    return { ok: true, user: user.name };
  }
  function login2fa(req, res, challenge, code, log) {
    const key = 'login:' + ip(req);
    if (limited(key, 8, 15 * 60 * 1000)) return LOCK;
    const user = readToken(challenge, 'c');
    if (!user || !user.totp || !user.totp.enabled) return { ok: false, status: 401, message: 'انتهت مهلة الدخول. ابدأ من جديد.', restart: true };
    const step = verifyTotp(user.totp.secret, code, user.totp.lastStep);
    if (step) updateUser(user.name, (x) => { x.totp.lastStep = step; });
    else if (!useRecovery(user, code)) { hit(key); if (log) log('[ADMIN] كود التحقق بخطوتين غلط'); return { ok: false, status: 401, message: 'الكود غلط أو منتهي.' }; }
    setCookie(req, res, makeToken(findUser(user.name)), 12 * 3600);
    return { ok: true, user: user.name };
  }
  function logout(req, res) { setCookie(req, res, '', 0); }
  const current = (req) => readToken(cookies(req).sid, 's');

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
    const cur = updateUser(user.name, (x) => Object.assign(x, hashPass(newPass), { pv: rnd() }));
    return { ok: true, user: cur };
  }

  /* ---------- إدارة التحقق بخطوتين (من لوحة التحكم) ---------- */
  const rh = (c) => crypto.createHmac('sha256', secret).update(String(c).replace(/[\s-]/g, '').toLowerCase()).digest('hex');
  function newRecoveryCodes() { const plain = Array.from({ length: 8 }, () => { const h = crypto.randomBytes(5).toString('hex'); return h.slice(0, 5) + '-' + h.slice(5); }); return { plain, hashes: plain.map(rh) }; }
  function useRecovery(user, code) {
    const t = user.totp; if (!t || !Array.isArray(t.recovery)) return false;
    const h = rh(code); const i = t.recovery.findIndex((x) => same(x, h)); if (i < 0) return false;
    updateUser(user.name, (x) => { x.totp.recovery.splice(i, 1); }); return true;
  }
  const twofa = {
    status: (user) => ({ enabled: !!(user.totp && user.totp.enabled), recoveryLeft: user.totp && user.totp.recovery ? user.totp.recovery.length : 0 }),
    setup(user, issuer) {
      const sec = b32enc(crypto.randomBytes(20));
      updateUser(user.name, (x) => { x.totpPending = sec; });
      const uri = 'otpauth://totp/' + encodeURIComponent(issuer + ':' + user.name) + '?secret=' + sec + '&issuer=' + encodeURIComponent(issuer) + '&algorithm=SHA1&digits=6&period=30';
      return { secret: sec, uri };
    },
    enable(user, code) {
      if (!user.totpPending) return { ok: false, message: 'ابدأ الإعداد الأول.' };
      const step = verifyTotp(user.totpPending, code, 0);
      if (!step) return { ok: false, message: 'الكود غلط. اتأكد من الوقت في موبايلك وجرّب كود جديد.' };
      const rc = newRecoveryCodes();
      const cur = updateUser(user.name, (x) => { x.totp = { enabled: true, secret: x.totpPending, lastStep: step, recovery: rc.hashes }; delete x.totpPending; x.pv = rnd(); });
      return { ok: true, recovery: rc.plain, user: cur };
    },
    disable(user, pass, code) {
      if (!checkPass(pass, user)) return { ok: false, message: 'كلمة المرور غلط.' };
      const step = user.totp && verifyTotp(user.totp.secret, code, user.totp.lastStep);
      if (!step && !useRecovery(user, code)) return { ok: false, message: 'الكود غلط.' };
      const cur = updateUser(user.name, (x) => { delete x.totp; delete x.totpPending; x.pv = rnd(); });
      return { ok: true, user: cur };
    },
    regen(user, code) {
      const step = user.totp && verifyTotp(user.totp.secret, code, user.totp.lastStep);
      if (!step) return { ok: false, message: 'الكود غلط.' };
      const rc = newRecoveryCodes();
      updateUser(user.name, (x) => { x.totp.recovery = rc.hashes; x.totp.lastStep = step; });
      return { ok: true, recovery: rc.plain };
    }
  };

  return { bootstrap, login, login2fa, logout, current, requireAdmin, changePassword, makeToken, setCookie, limited, hit, ip, twofa, _test: { hotp, b32dec, verifyTotp } };
}

module.exports = { createAuth, hotp, b32dec };
