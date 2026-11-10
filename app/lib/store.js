'use strict';
/* تخزين بسيط في ملفات JSON (من غير قاعدة بيانات).
   كل البيانات في فولدر برّه فولدر التطبيق، عشان إعادة النشر ماتمسحش حاجة. */
const fs = require('fs');
const path = require('path');
const os = require('os');

function pickDataDir() {
  const cands = [process.env.DATA_DIR, path.join(os.homedir(), 'ahmedalkholy-data'), path.join(os.tmpdir(), 'ahmedalkholy-data')].filter(Boolean);
  for (const c of cands) {
    const d = c.replace(/^~(?=$|\/)/, os.homedir());
    try { fs.mkdirSync(d, { recursive: true }); fs.accessSync(d, fs.constants.W_OK); return path.resolve(d); } catch (e) { /* جرّب اللي بعده */ }
  }
  throw new Error('مفيش فولدر ينفع أحفظ فيه البيانات. حدّد DATA_DIR.');
}

const BAD_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
/* تنضيف أي JSON جاي من اللوحة: يشيل المفاتيح الخطرة ويحدّد الأطوال */
function clean(v, depth) {
  depth = depth || 0;
  if (depth > 12) return null;
  if (typeof v === 'string') return v.replace(/\u0000/g, '').slice(0, 20000);
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
  if (typeof v === 'boolean' || v === null) return v;
  if (Array.isArray(v)) return v.slice(0, 600).map((x) => clean(x, depth + 1));
  if (v && typeof v === 'object') {
    const o = {};
    for (const k of Object.keys(v).slice(0, 200)) { if (BAD_KEYS.has(k)) continue; o[String(k).slice(0, 60)] = clean(v[k], depth + 1); }
    return o;
  }
  return undefined;
}

function createStore(seedFile) {
  const dir = pickDataDir();
  const uploads = path.join(dir, 'uploads');
  const backups = path.join(dir, 'backups');
  fs.mkdirSync(uploads, { recursive: true });
  fs.mkdirSync(backups, { recursive: true });
  const f = (n) => path.join(dir, n);
  function readJson(n, fb) { try { return JSON.parse(fs.readFileSync(f(n), 'utf8')); } catch (e) { return fb; } }
  function writeJson(n, obj) {
    const tmp = f(n) + '.' + process.pid + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(obj, null, 2));
    fs.renameSync(tmp, f(n));
  }

  let content = readJson('content.json', null);
  let upgraded = null;
  if (!content) { content = JSON.parse(fs.readFileSync(seedFile, 'utf8')); writeJson('content.json', content); }
  else {
    /* ترقية المحتوى الافتراضي: لو النسخة الجديدة أحدث ومفيش تعديلات من اللوحة، بنطبّقها (والقديم بيتحفظ نسخة احتياطية) */
    const seed = JSON.parse(fs.readFileSync(seedFile, 'utf8'));
    if ((content._v || 0) < (seed._v || 0)) {
      const edited = !!content._edited || fs.readdirSync(backups).some((n) => /^content-\d/.test(n));
      if (!edited) {
        fs.writeFileSync(path.join(backups, 'content-auto-' + new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14) + '.json'), JSON.stringify(content));
        content = seed; writeJson('content.json', content); upgraded = 'applied';
      } else upgraded = 'skipped-edited';
    }
  }

  const stamp = () => new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
  let lastBackup = 0;
  function backupNow(force) {
    if (!force && Date.now() - lastBackup < 20000) return;
    lastBackup = Date.now();
    try {
      fs.writeFileSync(path.join(backups, 'content-' + stamp() + '-' + Math.floor(Math.random() * 1000) + '.json'), JSON.stringify(content));
      const all = fs.readdirSync(backups).filter((n) => /^content-.*\.json$/.test(n)).sort();
      for (const n of all.slice(0, Math.max(0, all.length - 40))) fs.rmSync(path.join(backups, n), { force: true });
    } catch (e) { /* مش مشكلة لو النسخة الاحتياطية فشلت */ }
  }

  return {
    dir, uploads, backups, readJson, writeJson, clean, upgraded,
    getContent: () => content,
    setContent(next) { backupNow(); content = next; writeJson('content.json', content); },
    listBackups() { return fs.readdirSync(backups).filter((n) => /^content-.*\.json$/.test(n)).sort().reverse().map((n) => ({ name: n, size: fs.statSync(path.join(backups, n)).size, time: fs.statSync(path.join(backups, n)).mtime.toISOString() })); },
    restoreBackup(name) {
      if (!/^content-[\w-]+\.json$/.test(name)) throw new Error('اسم غلط');
      const data = JSON.parse(fs.readFileSync(path.join(backups, name), 'utf8'));
      backupNow(true); content = data; writeJson('content.json', content); return content;
    },
    resetToSeed() { backupNow(true); content = JSON.parse(fs.readFileSync(seedFile, 'utf8')); writeJson('content.json', content); return content; },
    messages: {
      list() { return readJson('messages.json', []); },
      add(m) { const all = readJson('messages.json', []); all.unshift(m); writeJson('messages.json', all.slice(0, 500)); },
      del(id) { writeJson('messages.json', readJson('messages.json', []).filter((m) => m.id !== id)); },
      read(id) { const all = readJson('messages.json', []); const m = all.find((x) => x.id === id); if (m) { m.read = true; writeJson('messages.json', all); } }
    }
  };
}

module.exports = { createStore, clean };
