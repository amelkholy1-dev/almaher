'use strict';
/* بيخلي البيانات الوهمية في قاعدة الجوازات التجريبية شكلها طبيعي (أسماء ومهن وشركات بدل «يوسف علي 9»).
   بيشتغل على قاعدة تجريبية بس (اسمها لازم يكون فيه demo):
     MYSQL2=<path to mysql2/promise> DB_NAME=demo_passports DB_USER=... DB_PASSWORD=... node demo-host/tools/polish-passports-seed.js */
const mysql = require(process.env.MYSQL2 || 'mysql2/promise');
const DB = { host: process.env.DB_HOST || '127.0.0.1', user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME, charset: 'utf8mb4' };
if (!/demo/i.test(DB.database || '')) { console.error('اسم القاعدة لازم يكون فيه demo'); process.exit(1); }

const FIRST = [['أحمد', 'Ahmed'], ['محمد', 'Mohamed'], ['محمود', 'Mahmoud'], ['مصطفى', 'Mostafa'], ['علي', 'Ali'], ['حسن', 'Hassan'], ['إبراهيم', 'Ibrahim'], ['يوسف', 'Youssef'], ['عمر', 'Omar'], ['خالد', 'Khaled'], ['طارق', 'Tarek'], ['كريم', 'Karim'], ['سامح', 'Sameh'], ['هشام', 'Hesham'], ['وليد', 'Waleed'], ['شريف', 'Sherif'], ['رامي', 'Ramy'], ['ياسر', 'Yasser'], ['أيمن', 'Ayman'], ['عادل', 'Adel'], ['سعيد', 'Saeed'], ['أسامة', 'Osama'], ['تامر', 'Tamer'], ['محسن', 'Mohsen']];
const LAST = [['عبدالعزيز', 'Abdelaziz'], ['السيد', 'Elsayed'], ['فتحي', 'Fathy'], ['رمضان', 'Ramadan'], ['منصور', 'Mansour'], ['سليمان', 'Soliman'], ['الجندي', 'Elgendy'], ['حمدي', 'Hamdy'], ['زكي', 'Zaki'], ['النجار', 'Elnaggar'], ['عثمان', 'Osman'], ['شاهين', 'Shahin'], ['قاسم', 'Kassem'], ['بدوي', 'Badawy'], ['صبري', 'Sabry'], ['جاد', 'Gad'], ['عبدالحميد', 'Abdelhamid'], ['الشافعي', 'Elshafei']];
const PROF = ['سائق', 'فني كهرباء', 'فني تكييف', 'طباخ', 'عامل بناء', 'نجار مسلح', 'سباك', 'محاسب', 'ممرض', 'فني لحام', 'حداد', 'مبلط', 'نقاش', 'ميكانيكي', 'عامل نظافة', 'مندوب مبيعات'];
const COMP = ['شركة الأفق للمقاولات', 'مؤسسة البناء الحديث', 'شركة النخبة للخدمات', 'مجموعة الريادة للتشغيل', 'شركة الواحة للنقل', 'مؤسسة الإعمار المتحدة', 'شركة المدار للصيانة', 'مجموعة الصفوة الطبية'];
const GOV = ['القاهرة', 'الجيزة', 'المنوفية', 'الشرقية', 'الدقهلية', 'البحيرة', 'أسيوط', 'سوهاج', 'المنيا', 'الفيوم', 'قنا', 'الغربية'];
const BANK = ['البنك الأهلي', 'بنك مصر', 'بنك القاهرة', 'الخزينة الرئيسية'];
const h = (s) => { let x = 2166136261; for (const ch of String(s)) { x ^= ch.charCodeAt(0); x = Math.imul(x, 16777619); } return x >>> 0; };
const pick = (arr, k) => arr[k % arr.length];
const person = (k) => { const f = pick(FIRST, k), m = pick(FIRST, k >>> 5), l = pick(LAST, k >>> 10); return { ar: `${f[0]} ${m[0]} ${l[0]}`, en: `${f[1]} ${m[1]} ${l[1]}` }; };
const synthetic = (v) => v == null || v === 'N/A' || /\d+\s*$/.test(String(v)) || /^[؀-ۿ]+(\s[؀-ۿ]+)?\s\d+/.test(String(v));
const SKIP = /Original|Stored|File|Path|Key|Model|Provider|Operation|Component|Action|Intent|Rule|Section|Preset|SetName|SourceName|PaymentMethod|UserName|Responsible|Evaluator|DisplayName|AiProfile|AccountName/i;

function valueFor(table, col, row, k) {
  const c = col.toLowerCase();
  if (c.includes('profession')) return pick(PROF, k);
  if (c.includes('company') || (table === 'companies' && c === 'companyname')) return pick(COMP, k);
  if (c === 'bankname' || (table === 'banks' && c === 'name') || (table === 'bankaccounts' && c === 'name')) return pick(BANK, k);
  if (c === 'listname') return `قائمة ${pick(['السعودية', 'الكويت', 'قطر', 'الإمارات', 'عُمان'], k)} — دفعة ${(k >>> 4) % 9 + 1}`;
  if (c === 'governorate') return pick(GOV, k);
  if (c === 'address') return `${pick(GOV, k)} — شارع ${pick(['النصر', 'الجمهورية', 'التحرير', 'الجيش', 'السلام'], k >>> 3)}`;
  if (c.endsWith('english')) return person(k).en;
  if (/name|title/i.test(col)) return person(k).ar;
  return null;
}

(async () => {
  const c = await mysql.createConnection(DB);
  const [cols] = await c.query("SELECT TABLE_NAME t, COLUMN_NAME n FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND DATA_TYPE IN ('varchar','text','longtext','mediumtext','char') AND (COLUMN_NAME LIKE '%Name%' OR COLUMN_NAME IN ('Title','Address','Governorate','NameEnglish'))");
  const [pks] = await c.query("SELECT TABLE_NAME t, COLUMN_NAME n FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND CONSTRAINT_NAME = 'PRIMARY'");
  const pkOf = {}; for (const r of pks) if (!pkOf[r.t]) pkOf[r.t] = r.n;
  const byTable = {}; for (const r of cols) if (!SKIP.test(r.n) && pkOf[r.t]) (byTable[r.t] = byTable[r.t] || []).push(r.n);
  let n = 0;
  for (const [t, list] of Object.entries(byTable)) {
    const pk = pkOf[t];
    const [rows] = await c.query(`SELECT \`${pk}\` AS __pk, ${list.map((x) => '`' + x + '`').join(',')} FROM \`${t}\``);
    for (const row of rows) {
      const set = {}; const k = h(t.replace(/s$/, '') + ':' + row.__pk);
      for (const col of list) { if (!synthetic(row[col]) || row[col] == null && !/name/i.test(col)) continue; const v = valueFor(t, col, row, /arabic|english/i.test(col) ? h('p:' + row.__pk) : k); if (v != null) set[col] = v; }
      if (Object.keys(set).length) { await c.query(`UPDATE \`${t}\` SET ? WHERE \`${pk}\` = ?`, [set, row.__pk]); n++; }
    }
  }
  console.log('اتظبط', n, 'صف');
  await c.end();
})().catch((e) => { console.error(e); process.exit(1); });
