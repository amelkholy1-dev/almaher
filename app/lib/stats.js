'use strict';
/* إحصائيات زيارات بسيطة وبدون كوكيز: بتعدّ الزيارات والضغطات يومياً. مبنخزنش IP ولا أي بيانات شخصية؛
   «الزائر الفريد» بيتحسب من بصمة مهشّمة لليوم ده بس (IP+المتصفح+ملح عشوائي) وبتتمسح من الذاكرة تلقائياً. */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const EVENTS = ['wa', 'cv', 'demo', 'detail', 'form', 'review', 'mail'];
const BOT = /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|preview|monitor|lighthouse|headless|curl|wget|python|go-http|axios/i;
const day = (d) => (d || new Date()).toISOString().slice(0, 10);

function createStats(dir) {
  const file = path.join(dir, 'stats.json');
  let data = { days: {} };
  try { data = JSON.parse(fs.readFileSync(file, 'utf8')); if (!data.days) data = { days: {} }; } catch (e) { /* أول مرة */ }
  const salt = crypto.randomBytes(16).toString('hex');
  const seen = new Map(); // يوم -> Set بصمات
  let dirty = false;

  function save() {
    if (!dirty) return; dirty = false;
    // نحتفظ بآخر 400 يوم بس
    const keys = Object.keys(data.days).sort(); while (keys.length > 400) delete data.days[keys.shift()];
    try { const tmp = file + '.' + process.pid + '.tmp'; fs.writeFileSync(tmp, JSON.stringify(data)); fs.renameSync(tmp, file); } catch (e) { console.error('[STATS] save failed:', e.message); }
  }
  const timer = setInterval(save, 30000); if (timer.unref) timer.unref();
  process.on('exit', save);

  const slot = (k) => (data.days[k] = data.days[k] || { v: 0, u: 0, ev: {}, ref: {}, lang: {}, dev: {} });
  const bump = (o, k) => { k = String(k || '').slice(0, 60); if (k) o[k] = (o[k] || 0) + 1; };

  function hit(req, body, ip) {
    const ua = String(req.headers['user-agent'] || '');
    if (!ua || BOT.test(ua)) return;
    if (String(req.headers['dnt'] || '') === '1') return;
    const k = day(), d = slot(k); body = body || {};
    if (body.t === 'ev') { if (EVENTS.includes(body.e)) bump(d.ev, body.e); dirty = true; return; }
    d.v++;
    const fp = crypto.createHash('sha256').update(salt + k + ip + ua).digest('hex').slice(0, 20);
    let s = seen.get(k); if (!s) { seen.clear(); s = new Set(); seen.set(k, s); }
    if (!s.has(fp)) { s.add(fp); d.u++; }
    bump(d.lang, body.lang === 'en' ? 'en' : 'ar');
    bump(d.dev, Number(body.w) > 0 && Number(body.w) < 760 ? 'mobile' : 'desktop');
    let ref = ''; try { const u = new URL(String(body.ref || '')); ref = u.hostname.replace(/^www\./, ''); } catch (e) { /* مباشر */ }
    if (ref && String(req.headers.host || '').indexOf(ref) >= 0) ref = '';
    bump(d.ref, ref || 'direct');
    dirty = true;
  }

  function report(n) {
    n = Math.min(Math.max(+n || 30, 1), 365);
    const out = { days: [], total: { v: 0, u: 0, ev: {} }, ref: {}, lang: {}, dev: {} };
    for (let i = n - 1; i >= 0; i--) {
      const k = day(new Date(Date.now() - i * 864e5)), d = data.days[k] || { v: 0, u: 0, ev: {}, ref: {}, lang: {}, dev: {} };
      out.days.push({ d: k, v: d.v, u: d.u });
      out.total.v += d.v; out.total.u += d.u;
      for (const [a, b] of [['ev', out.total.ev], ['ref', out.ref], ['lang', out.lang], ['dev', out.dev]]) for (const x of Object.keys(d[a] || {})) b[x] = (b[x] || 0) + d[a][x];
    }
    return out;
  }
  return { hit, report, save };
}

module.exports = { createStats };
