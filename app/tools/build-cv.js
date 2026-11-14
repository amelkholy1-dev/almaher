'use strict';
/* بيولّد السيفيين (عربي/إنجليزي) PDF من نفس بيانات الموقع (seed/content.json) عشان يفضلوا متطابقين.
   أداة للمطوّر بس (مش بتشتغل على الاستضافة): محتاجة playwright وخطوط Cairo و Lato.
   FONT_DIR=<فولدر فيه ملفات woff2> node tools/build-cv.js */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const C = JSON.parse(fs.readFileSync(path.join(root, 'seed', 'content.json'), 'utf8'));
const FONT_DIR = process.env.FONT_DIR || '/tmp/claude-0/cvfonts';
const OUT = path.join(root, 'public', 'assets', 'cv');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const photo = 'data:image/jpeg;base64,' + fs.readFileSync(path.join(root, 'public', 'assets', 'img', 'ahmed-alkholy.jpg')).toString('base64');
const font = (file) => { const f = fs.readdirSync(FONT_DIR, { recursive: true }).map(String).find((x) => x.endsWith('/' + file) || x === file); if (!f) throw new Error('font missing: ' + file); return 'data:font/woff2;base64,' + fs.readFileSync(path.join(FONT_DIR, f)).toString('base64'); };

const S = C.settings;
const L = {
  ar: {
    dir: 'rtl', lang: 'ar', name: 'أحمد ماهر الخولي', role: S.headline.ar.replace(/\*\*/g, ''), loc: 'الجيزة، مصر',
    h: { sum: 'نبذة مهنية', sk: 'المهارات', ex: 'الخبرات العملية', ed: 'التعليم', lg: 'اللغات', ad: 'معلومات إضافية' },
    summary: 'مهندس برمجيات وتطوير أنظمة، فري لانسر منذ يناير 2014، بخبرة عملية قرابة 7 سنوات في الأنظمة والتصميم والعمليات والدعم الفني. أصمّم وأبني أنظمة إدارة ومواقع وتطبيقات تعمل داخل الشركات من اليوم الأول: أفهم الاحتياج، وأبني الحل، وأشغّله على شبكات الشركات أو الاستضافة، وأدرّب الفريق، وأرافقه بالدعم بعد التشغيل. نفّذتُ 17 نظاماً ومشروعاً بين أنظمة وتطبيقات ومواقع، ويعتمد على أنظمتي أكثر من 40 مستخدماً يومياً. ولديّ خبرة قوية في الدعم الفني والشبكات: تجهيز الأجهزة وصيانتها، والشبكات المحلية والراوتر، IP الثابت والجدار الناري، والطابعات والنسخ الاحتياطي. ولديّ إلمام بأدوات الذكاء الاصطناعي مثل Claude، ChatGPT، Gemini وأستخدمها في العمل. ومنذ فبراير 2023 أعمل منسق عمليات وأنظمة في مكتب لإلحاق العمالة المصرية بالخارج.',
    skills: [
      ['تطوير الأنظمة والمواقع', 'React، TypeScript، Node.js، Express، REST APIs، Socket.IO، Tailwind CSS، MySQL، SQL Server، IndexedDB، Firebase، تطبيقات أندرويد (Capacitor)، واجهات عربية وإنجليزية (RTL)، لوحات تحكم وأنظمة صلاحيات'],
      ['تطبيق وتشغيل الأنظمة', 'تحليل الاحتياج ورسم سير الإجراءات، نقل البيانات من ملفات Excel إلى قاعدة بيانات مركزية، تشغيل الأنظمة على شبكات الشركات أو الاستضافة، تدريب المستخدمين، الدعم والتحديثات بعد التشغيل، نسخ احتياطي واستعادة'],
      ['الدعم الفني والشبكات', ['تثبيت وتهيئة Windows 10 / 11 والبرامج والتعريفات', 'تشخيص وإصلاح أعطال الأجهزة والبرامج', 'تجهيز الأجهزة للمستخدمين وصيانتها', 'الشبكات المحلية (LAN) والواي فاي', 'إعداد الراوتر والسويتش', 'IP ثابت، Port Forwarding', 'الجدار الناري وتهيئة الوصول من خارج الشركة', 'مشاركة الملفات والمجلدات على الشبكة', 'تشغيل وصيانة الطابعات والماسحات', 'الوصول عن بُعد للأجهزة', 'النسخ الاحتياطي واستعادة البيانات', 'دعم فني مباشر لـ 9 أجهزة داخل المكتب']],
      ['الذكاء الاصطناعي', 'إلمام بأدوات الذكاء الاصطناعي مثل Claude، ChatGPT، Gemini وغيرها، وفهم لإمكانياتها وحدودها، وكتابة التعليمات (Prompts) للحصول على أفضل النتائج، واستخدامها في البحث والكتابة والتحليل، وربطها بالأنظمة عبر الـ APIs مثل Gemini، Claude لاستخراج البيانات وتحليل السير الذاتية'],
      ['الجودة والأمان', 'صلاحيات تفصيلية (RBAC)، سجل العمليات، التحقق الثنائي (2FA)، تشفير كلمات المرور، اختبارات آلية (Playwright)، نقل ومطابقة البيانات بين SQL Server، MySQL'],
      ['البيانات والمكتبية', 'Excel (المعادلات والجداول المحورية)، Word، PowerPoint، Google Sheets، إدخال البيانات ومراجعتها، الأرشفة الإلكترونية والورقية، إعداد التقارير'],
      ['التصميم والإعلانات', 'Canva، Photoshop، Meta Business Suite، الإعلانات الممولة، أكثر من 150 تصميماً للشركات والصفحات']
    ],
    free: { role: 'مهندس برمجيات مستقل (أنظمة ومواقع وتطبيقات)', org: 'عمل حر | عن بُعد', date: 'يناير 2014 – حتى الآن', extra: [
      '<b>نظام مسار للعمليات والحسابات:</b> إدارة الجوازات والتأشيرات والسفر والحسابات (عملاء ومناديب وعمولات وخزينة)، واستخراج البيانات من الصور، وتقارير Excel، PDF، على قاعدة بيانات بأكثر من 130 جدولاً.',
      '<b>نظام مسار للموارد البشرية:</b> قراءة السير الذاتية بالذكاء الاصطناعي، وبنك مرشحين مركزي، ومطابقة المرشحين مع الوظائف، وصانع سير بـ20 قالباً.',
      '<b>تطبيق وصال (أندرويد):</b> تطبيق عربي للعادات والمهام والعبادات، فردي أو مع العائلة والأصدقاء.',
      '<b>مواقع بلوحات تحكم كاملة:</b> nisrelkhaleeg.com، forsango.com، rocklineg.com، eldahan.com، eldiwanjobs.com.'
    ] },
    ed: ['بكالوريوس التربية النوعية – تكنولوجيا التعليم والحاسب الآلي', 'جامعة المنوفية | 2018 – 2022'],
    lg: '<b>العربية:</b> اللغة الأم &nbsp;|&nbsp; <b>الإنجليزية:</b> جيدة في القراءة والكتابة',
    ad: ['تاريخ الميلاد: 29 ديسمبر 1999', 'الموقف من التجنيد: إعفاء مؤقت', 'رخصة قيادة سيارة خاصة ودراجة نارية']
  },
  en: {
    dir: 'ltr', lang: 'en', name: 'Ahmed Maher Alkholy', role: S.headline.en.replace(/\*\*/g, ''), loc: 'Giza, Egypt',
    h: { sum: 'SUMMARY', sk: 'SKILLS', ex: 'EXPERIENCE', ed: 'EDUCATION', lg: 'LANGUAGES', ad: 'ADDITIONAL INFORMATION' },
    summary: 'Software engineer and systems developer, freelancing since January 2014, with nearly 7 years of hands-on experience in systems, design, operations and IT support. I design and build management systems, websites and apps that work inside companies from day one: I understand the business need, build the solution, deploy it on company networks or hosting, train the team and back it with support after launch. I have delivered 17 systems and projects across systems, apps and websites, with 40+ users relying on my systems daily. I bring strong IT support and networking experience: setting up and maintaining devices, LANs and routers, static IP, firewall, printers and backups. I am also well versed in AI tools (Claude, ChatGPT, Gemini) and use them in my work. Since February 2023 I have also worked as an operations and systems coordinator at an Egyptian overseas-recruitment office.',
    skills: [
      ['Systems & web development', 'React, TypeScript, Node.js, Express, REST APIs, Socket.IO, Tailwind CSS, MySQL, SQL Server, IndexedDB, Firebase, Android apps (Capacitor), Arabic/English (RTL) interfaces, admin panels and permission systems'],
      ['Systems implementation', 'Needs analysis and workflow mapping, data migration from Excel into a central database, deployment on company networks or hosting, user training, post-launch support and updates, backup and restore'],
      ['IT support & networking', ['Windows 10 / 11, software and driver installation and setup', 'Hardware and software troubleshooting and repair', 'Preparing and maintaining user workstations', 'Local networks (LAN) and Wi-Fi', 'Router and switch configuration', 'Static IP and port forwarding', 'Firewall and secure remote access setup', 'File and folder sharing over the network', 'Printers and scanners setup and maintenance', 'Remote access to devices', 'Backup and data recovery', 'Hands-on support for 9 office workstations']],
      ['Artificial intelligence', 'Working knowledge of AI tools such as Claude, ChatGPT and Gemini, understanding their capabilities and limits, writing effective prompts, using them for research, writing and analysis, and connecting them to systems through APIs (Gemini, Claude) for data extraction and CV parsing'],
      ['Quality & security', 'Role-based access control (RBAC), audit logging, two-factor authentication (2FA), password encryption, automated testing (Playwright), SQL Server → MySQL migration and reconciliation'],
      ['Data & office', 'Excel (formulas, pivot tables), Word, PowerPoint, Google Sheets, data entry and verification, digital and paper archiving, reporting'],
      ['Design & ads', 'Canva, Photoshop, Meta Business Suite, paid campaigns, 150+ designs for companies and pages']
    ],
    free: { role: 'Freelance Software Engineer — Systems, Websites & Apps', org: 'Freelance | Remote', date: 'Jan 2014 – Present', extra: [
      '<b>Masar Operations & Accounts System:</b> passports, visas, travel and accounts (clients, agents, commissions, cash management), OCR data extraction, Excel/PDF reports, on a database of 130+ tables.',
      '<b>Masar HR System:</b> AI-based CV parsing, central candidate database, candidate-to-job matching and a 20-template CV builder.',
      '<b>Wesal app (Android):</b> an Arabic habits, tasks and worship app, personal or shared with family and friends.',
      '<b>Websites with full admin panels:</b> nisrelkhaleeg.com, forsango.com, rocklineg.com, eldahan.com and eldiwanjobs.com.'
    ] },
    ed: ['Bachelor of Specific Education – Educational Technology and Computer', 'Menoufia University | 2018 – 2022'],
    lg: '<b>Arabic:</b> Native &nbsp;|&nbsp; <b>English:</b> Good reading and writing',
    ad: ['Date of birth: 29 December 1999', 'Military status: Temporarily exempted', 'Driving license (car and motorcycle)']
  }
};

const SITES = { 'nisrelkhaleeg.com': 'https://nisrelkhaleeg.com', 'forsango.com': 'https://forsango.com', 'rocklineg.com': 'https://rocklineg.com', 'eldahan.com': 'https://www.eldahan.com', 'eldiwanjobs.com': 'https://eldiwanjobs.com' };
const linkify = (x) => x.replace(/\b(nisrelkhaleeg|forsango|rocklineg|eldahan|eldiwanjobs)\.com\b/g, (m) => `<a href="${SITES[m]}">${m}</a>`);
function html(k) {
  const t = L[k], ar = k === 'ar', ex = C.experience.items.filter((e) => e.visible !== false);
  const entry = (e, i) => {
    const role = e.role[k], org = e.org[k], date = e.date[k], bl = e.bullets.map((x) => x[k]);
    const isFree = /2014/.test(e.date.en), isNesr = /2023/.test(e.date.en) && !isFree;
    const extra = isFree ? t.free.extra : [];
    let b = bl.slice(0, 1).concat(extra, bl.slice(1)).filter(Boolean);
    if (isNesr) { const q = b.findIndex((x) => /9 /.test(x)); if (q > 0) b = [b[q]].concat(b.slice(0, q), b.slice(q + 1)); }
    return `<div class="job"><div class="jh"><span class="jr">${esc(isFree ? t.free.role : role)}</span><span class="jd">${esc(isFree ? t.free.date : date)}</span></div><div class="jo">${esc(isFree ? t.free.org : org)}</div><ul>${b.map((x) => `<li>${/<b>/.test(x) ? linkify(x) : esc(x)}</li>`).join('')}</ul></div>`;
  };
  const F = ar ? "'CairoA','CairoL'" : "'Lato'";
  return `<!doctype html><html lang="${t.lang}" dir="${t.dir}"><head><meta charset="utf-8"><title>${esc(t.name)} — CV</title><style>
@font-face{font-family:CairoA;font-weight:400;src:url(${font('cairo-arabic-400-normal.woff2')})}
@font-face{font-family:CairoA;font-weight:600;src:url(${font('cairo-arabic-600-normal.woff2')})}
@font-face{font-family:CairoA;font-weight:700;src:url(${font('cairo-arabic-700-normal.woff2')})}
@font-face{font-family:CairoA;font-weight:800;src:url(${font('cairo-arabic-800-normal.woff2')})}
@font-face{font-family:CairoL;font-weight:400;src:url(${font('cairo-latin-400-normal.woff2')})}
@font-face{font-family:CairoL;font-weight:700;src:url(${font('cairo-latin-700-normal.woff2')})}
@font-face{font-family:Lato;font-weight:400;src:url(${font('lato-latin-400-normal.woff2')})}
@font-face{font-family:Lato;font-weight:700;src:url(${font('lato-latin-700-normal.woff2')})}
@font-face{font-family:Lato;font-weight:900;src:url(${font('lato-latin-900-normal.woff2')})}
@page{size:A4;margin:13mm 15mm 12mm}
*{box-sizing:border-box}html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{margin:0;font-family:${F},sans-serif;color:#1f2937;font-size:${ar ? '9.9pt' : '9.8pt'};line-height:${ar ? '1.62' : '1.48'}}
.top{display:flex;align-items:center;gap:18px;padding-bottom:10px;border-bottom:2.2px solid #1f4e8c}
.top img{width:92px;height:92px;border-radius:50%;object-fit:cover;border:2.5px solid #1f4e8c;flex:none}
.nm{font-size:${ar ? '25pt' : '23pt'};font-weight:${ar ? 800 : 900};color:#1f4e8c;line-height:1.2}
.rl{font-size:${ar ? '12.5pt' : '11.5pt'};font-weight:700;margin:2px 0 5px}
.ct{font-size:8.6pt;color:#5b6573;display:flex;flex-wrap:wrap;gap:3px 14px}.ct span{direction:ltr;unicode-bidi:embed}a{color:inherit;text-decoration:none}li a{color:#1f4e8c}
h2{font-size:${ar ? '12pt' : '10.5pt'};color:#1f4e8c;font-weight:${ar ? 800 : 900};margin:13px 0 6px;padding-bottom:3px;border-bottom:1px solid #d3dbe6;${ar ? '' : 'letter-spacing:.06em;border-bottom:1.5px solid #1f4e8c'}}
p{margin:0 0 4px;text-align:justify}
.sk div{margin:0 0 4.5px}.sk b{color:#111827}.sk .ai{background:#eaf1fb;border-${ar?'right':'left'}:3.5px solid #1f4e8c;border-radius:6px;padding:6px 10px;margin-bottom:7px}.sk .ai>b{color:#1f4e8c;font-size:${ar?'11pt':'10.5pt'}}.sk ul.cols{columns:2;column-gap:22px;margin:4px 0 0}.sk ul.cols li{break-inside:avoid;margin:0 0 2px}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:10px 0 2px}.stats div{background:#f2f6fb;border:1px solid #d3dbe6;border-radius:8px;text-align:center;padding:5px 4px}.stats b{display:block;font-size:${ar?'14pt':'13pt'};color:#1f4e8c;line-height:1.2}.stats span{font-size:8.2pt;color:#4b5563}
.job{margin-bottom:8px}.jh,.jo,h2{break-after:avoid}li{break-inside:avoid}
.jh{display:flex;justify-content:space-between;gap:10px;align-items:baseline}.jr{font-weight:800;font-size:${ar ? '10.8pt' : '10.5pt'}}.jd{color:#5b6573;font-size:8.8pt;white-space:nowrap}
.jo{color:#1f4e8c;font-size:9.2pt;margin:0 0 3px}
ul{margin:0;padding-${ar ? 'right' : 'left'}:16px}li{margin:0 0 2.5px}
.two{display:grid;grid-template-columns:1.25fr 1fr;gap:22px}.two ul{padding-${ar ? 'right' : 'left'}:15px}
.edt{font-weight:800}
</style></head><body>
<div class="top">${ar ? `<img src="${photo}" alt="">` : ''}<div><div class="nm">${esc(t.name)}</div><div class="rl">${esc(t.role)}</div><div class="ct"><span>${esc(t.loc)}</span><span><a href="mailto:${esc(S.email)}">${esc(S.email)}</a></span><span><a href="https://wa.me/${S.whatsapp}">+${S.whatsapp.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})$/, '$1 $2 $3 $4')}</a></span><span><a href="https://www.linkedin.com/in/ahmed-alkholy">linkedin.com/in/ahmed-alkholy</a></span><span><a href="https://ahmedalkholy.com">ahmedalkholy.com</a></span></div></div></div>
${ar ? `<div class="stats">${C.stats.map((x) => `<div><b>${esc(x.value[k])}</b><span>${esc(x.label[k])}</span></div>`).join('')}</div>` : ''}
<h2>${t.h.sum}</h2><p>${esc(t.summary)}</p>
<h2>${t.h.sk}</h2><div class="sk">${t.skills.map(([a, b]) => `<div><b>${esc(a)}:</b> ${esc(Array.isArray(b) ? b.map((x, i) => ar || !i ? x : x[0].toLowerCase() + x.slice(1)).join(ar ? '، ' : ', ') : b)}</div>`).join('')}</div>
<h2>${t.h.ex}</h2>${ex.map(entry).join('')}
<div class="two"><div><h2>${t.h.ed}</h2><div class="edt">${esc(t.ed[0])}</div><div>${esc(t.ed[1])}</div><h2>${t.h.lg}</h2><div>${t.lg}</div></div><div><h2>${t.h.ad}</h2><ul>${t.ad.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div></div>
</body></html>`;
}

(async () => {
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  for (const [k, file] of [['ar', 'Ahmed-Alkholy-CV-AR.pdf'], ['en', 'Ahmed-Alkholy-CV-EN.pdf']]) {
    const p = await b.newPage();
    await p.setContent(html(k), { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    await p.pdf({ path: path.join(OUT, file), format: 'A4', printBackground: true, preferCSSPageSize: true });
    await p.close();
    console.log('wrote', file);
  }
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
