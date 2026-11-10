'use strict';
/* بيبني seed/content.json — المحتوى الافتراضي للموقع (بيتعدّل بعد كده من لوحة التحكم).
   node tools/build-seed.js */
const fs = require('fs');
const path = require('path');
const I = JSON.parse(fs.readFileSync(path.join(__dirname, '_i18n.json'), 'utf8'));
const b = (ar, en) => ({ ar, en });
const X = (k) => { const o = I[k]; if (!o) throw new Error('مفتاح ناقص: ' + k); return { ar: o.ar.replace(/&amp;/g, '&'), en: o.en.replace(/&amp;/g, '&') }; };
const same = (s) => s; // عنصر مهارة بنفس الاسم في اللغتين

const WA = 'https://github.com/amelkholy1-dev/wesal-updates/releases/latest/download/Wesal.apk';
const imgs = (id, n, ext) => Array.from({ length: n }, (_, i) => `assets/img/projects/${id}-${i + 1}.${ext || 'png'}`);

const content = {
  _v: 3,
  settings: {
    siteUrl: '',
    name: b('أحمد ماهر الخولي', 'Ahmed Maher Alkholy'),
    brand: b('أحمد الخولي', 'Ahmed Alkholy'),
    initials: 'AK',
    hello: b('مرحباً، أنا', 'Hello, I am'),
    role: b('أخصائي أنظمة وحلول أعمال • دعم فني وتشغيل', 'Business Systems Specialist • IT Support & Operations'),
    lead: b(
      'مطوّر أنظمة أبني حلولاً مخصصة لإدارة الأعمال. أفهم طبيعة عملك أولاً، ثم أبني الحل المناسب وأشغّله وأدرّب فريقك، وأبقى بجانبك بعد التشغيل. وإلى جانب ذلك أعمل فري لانسر منذ 2014 في التصميم والمواقع وإدارة البيانات.',
      'I am a systems developer building custom business solutions. I understand how your business works first, then build the right solution, put it into operation, train your team and stay by your side after launch. Alongside that, I have been a freelancer since 2014 in design, websites and data management.'),
    availLabel: b('', ''),
    modes: [],
    location: b('الجيزة، مصر — أعمل مع عملاء في مصر والخليج وعن بُعد', 'Giza, Egypt — working with clients in Egypt, the Gulf and remotely'),
    heroChips: [{ icon: 'code', text: b('أنظمة • مواقع • تطبيقات', 'Systems • Websites • Apps') }, { icon: 'palette', text: b('فري لانسر منذ 2014', 'Freelancer since 2014') }],
    email: 'am.elkholy1@gmail.com',
    whatsapp: '201552084471',
    linkedin: 'https://www.linkedin.com/in/ahmed-alkholy',
    github: 'https://github.com/amelkholy1-dev',
    photo: 'assets/img/ahmed-alkholy.jpg',
    ogImage: 'assets/img/og-image.jpg',
    cv: { ar: 'assets/cv/Ahmed-Alkholy-CV-AR.pdf', en: 'assets/cv/Ahmed-Alkholy-CV-EN.pdf' },
    seo: {
      title: b('أحمد ماهر الخولي | مطوّر أنظمة وحلول أعمال • فري لانسر منذ 2014', 'Ahmed Maher Alkholy | Business Systems Developer • Freelancer since 2014'),
      description: b('أنظمة إدارة أعمال ومواقع وتطبيقات تعمل فعلياً داخل الشركات، وتصميم سوشيال ميديا، ودعم فني وتشغيل. فري لانسر منذ 2014. الجيزة، مصر.', 'Business management systems, websites and apps running inside real companies, plus social-media design, IT support and operations. Freelancer since 2014. Giza, Egypt.')
    },
    demoNotice: b('عرض توضيحي تفاعلي ببيانات تجريبية – النظام الكامل متاح عند الطلب', 'Interactive demo with sample data – the full system is available on request'),
    demoNoticeSample: b('نموذج توضيحي تفاعلي ببيانات تجريبية بالكامل – يمكن تنفيذ نظام مماثل حسب احتياج شركتك', 'Interactive concept demo with fully sample data – a similar system can be built around your company’s needs'),
    waMessages: {
      general: b('مرحباً أحمد، وصلت إليك من موقعك الشخصي وأودّ التواصل معك.', 'Hi Ahmed, I found you through your website and would like to get in touch.'),
      project: b('مرحباً أحمد، شاهدت «{name}» على موقعك، وأرغب في ديمو مباشر ومعرفة المزيد.', 'Hi Ahmed, I saw “{name}” on your website and would like a live demo and more details.')
    },
    footer: b('مطوّر أنظمة وحلول أعمال • فري لانسر منذ 2014', 'Business Systems Developer • Freelancer since 2014')
  },

  stats: [
    { value: b('قرابة 6', 'Nearly 6'), label: b('سنوات خبرة عملية', 'years of hands-on experience') },
    { value: b('7', '7'), label: b('أنظمة ومشاريع منفّذة', 'systems & projects delivered') },
    { value: b('+30', '30+'), label: b('مستخدم يعتمدون على أنظمتي يومياً', 'users relying on my systems daily') },
    { value: b('+150', '150+'), label: b('تصميم لشركات وصفحات', 'designs for companies & pages') }
  ],

  layout: {
    sections: [
      { id: 'stats', visible: true, nav: false, label: b('أرقام سريعة', 'Quick facts') },
      { id: 'about', visible: true, nav: true, label: b('نبذة', 'About') },
      { id: 'process', visible: true, nav: false, label: b('طريقة العمل', 'How I work') },
      { id: 'services', visible: true, nav: true, label: b('الخدمات', 'Services') },
      { id: 'projects', visible: true, nav: true, label: b('المشاريع', 'Projects') },
      { id: 'experience', visible: true, nav: true, label: b('الخبرات', 'Experience') },
      { id: 'skills', visible: true, nav: true, label: b('المهارات', 'Skills') },
      { id: 'contact', visible: true, nav: true, label: b('تواصل معي', 'Contact') }
    ]
  },

  about: {
    kicker: b('نبذة عني', 'About me'),
    title: b('أنظمة تعمل، وفرق تتدرّب، ودعم مستمر', 'Systems that work, teams that get trained, support that lasts'),
    paragraphs: [
      b('أعمل منذ فبراير 2023 منسقاً للعمليات والأنظمة في مكتب لإلحاق العمالة المصرية بالخارج، أتابع آلاف الملفات عبر مراحل الكشف الطبي والبصمة والقنصلية والتأشيرة والسفر، وأدعم الأجهزة والشبكة.',
        'Since February 2023 I have worked as an Operations & Systems Coordinator at an Egyptian overseas-recruitment office, following thousands of files through the medical check, fingerprint, consulate, visa and travel stages, and supporting the devices and network.'),
      b('من قلب العمل اليومي صممتُ نظاماً مركزياً للملفات والحسابات حلّ محل ملفات Excel المتفرقة والورق، وأصبح النظام الأساسي للمكتب. نزل وقت تسجيل الملف من دقائق إلى ثوانٍ، وتوقفت حالات فقد الجوازات بعد نظام الترقيم والأرشفة.',
        'From the daily work I designed a central system for files and accounts that replaced scattered Excel sheets and paper and became the office’s core system. File registration time dropped from minutes to seconds, and passport losses stopped after the numbering-and-archiving system.'),
      b('وإلى جانب العمل الوظيفي، أعمل فري لانسر منذ عام 2014 في تصميم السوشيال ميديا والإعلانات، والمواقع التعريفية، وإدخال البيانات وتنظيم ملفات Excel، وقد نفّذتُ أكثر من 150 تصميماً لشركات وصفحات. ومنذ 2024 أضفتُ إلى ذلك تصميم وتنفيذ أنظمة إدارة الأعمال والمواقع وتطبيقات الموبايل.',
        'Alongside my employment, I have worked as a freelancer since 2014 in social-media and ad design, company websites, data entry and Excel organisation, and have delivered 150+ designs for companies and pages. Since 2024 I have added designing and building business systems, websites and mobile apps.'),
      b('مع الوقت صار عندي ما يشبه فريقاً صغيراً في شخص واحد: أحلل الاحتياج وأصمم وأنفّذ وأشغّل وأدرّب، وهذا يوفّر على العميل التنسيق بين أكثر من جهة.',
        'Over time I became something like a small team in one person: I analyse the need, design, build, deploy and train — which saves the client from coordinating between several parties.')
    ],
    highlightLast: false,
    facts: [
      { icon: 'cal', title: b('الخبرة', 'Experience'), text: b('فري لانسر منذ 2014، وبدوام كامل منذ فبراير 2023', 'Freelancer since 2014, full-time since February 2023') },
      { icon: 'cap', title: b('التعليم', 'Education'), text: b('بكالوريوس التربية النوعية – تكنولوجيا التعليم والحاسب الآلي، جامعة المنوفية (2018–2022) – جيد مرتفع', 'B.Ed. in Specific Education – Educational Technology & Computing, Menoufia University (2018–2022) – Very Good') },
      { icon: 'lang', title: b('اللغات', 'Languages'), text: b('العربية (اللغة الأم)، الإنجليزية (قراءة وكتابة جيدة)', 'Arabic (native), English (good reading and writing)') },
      { icon: 'pin', title: b('المكان', 'Location'), text: b('الجيزة، مصر — أعمل مع عملاء في مصر والخليج وعن بُعد', 'Giza, Egypt — working with clients in Egypt, the Gulf and remotely') },
      { icon: 'car', title: b('رخصة القيادة', 'Driving licence'), text: b('سيارة خاصة ودراجة نارية', 'Private car and motorcycle') }
    ]
  },

  process: {
    kicker: b('طريقة العمل', 'How I work'),
    title: b('من الفكرة حتى التشغيل', 'From idea to go-live'),
    sub: b('نفس الخطوات التي اتبعتها في كل الأنظمة والمواقع التي سلّمتها.', 'The same steps I followed in every system and website I delivered.'),
    steps: [
      { title: b('فهم الاحتياج', 'Understand the need'), text: b('أجلس مع أصحاب الشغل والموظفين، وأفهم الإجراءات الحالية ومشاكلها قبل رسم أي حل.', 'I sit with owners and staff and understand the current procedures and pain points before drawing any solution.') },
      { title: b('تصميم سير العمل', 'Design the workflow'), text: b('أحدد الشاشات والمراحل والصلاحيات والتقارير قبل التنفيذ، ويعتمدها العميل.', 'I define screens, stages, permissions and reports before building, and the client signs off.') },
      { title: b('التنفيذ على مراحل', 'Build in stages'), text: b('أبني النظام جزءاً جزءاً، وأعرض كل مرحلة على العميل لتصحيح المسار مبكراً.', 'I build the system piece by piece and demo each stage to correct course early.') },
      { title: b('الاختبار ونقل البيانات', 'Testing & data migration'), text: b('أختبر على بيانات تجريبية، ثم أنقل البيانات القديمة وأراجع الأرقام حتى تتطابق.', 'I test on sample data, then migrate legacy data and reconcile the numbers until they match.') },
      { title: b('التشغيل والتدريب', 'Go-live & training'), text: b('أشغّل النظام على شبكة الشركة أو الاستضافة، وأدرّب الموظفين على الاستخدام اليومي.', 'I deploy on the company network or hosting and train staff on daily use.') },
      { title: b('الدعم والتحديثات', 'Support & updates'), text: b('متابعة بعد التشغيل، وتعديلات وتحديثات، ونسخ احتياطي منتظم.', 'Follow-up after launch, changes and updates, and regular backups.') }
    ]
  },

  services: {
    kicker: b('الخدمات', 'Services'),
    title: b('كيف يمكنني مساعدتك؟', 'How can I help?'),
    sub: b('أنظمة ومواقع وتطبيقات وتصميم، مع التشغيل والتدريب والدعم — بنظام المشروع أو العمل عن بُعد أو من المقر.', 'Systems, websites, apps and design — with deployment, training and support — per project, remotely or on-site.'),
    items: [
      { icon: 'sys', title: b('تصميم وتنفيذ أنظمة إدارة الأعمال', 'Business management systems'), text: b('أنظمة مخصصة للعمليات والحسابات والمخازن والموارد البشرية: صلاحيات دقيقة، ومتابعة مراحل، وتقارير، وتصدير Excel وPDF، ونسخ احتياطي. أبدأ من فهم شغلك، لا من قالب جاهز.', 'Tailored systems for operations, accounting, inventory and HR: granular permissions, stage tracking, reports, Excel/PDF export and backups. I start from understanding your business, not from a ready-made template.'), tags: [b('عمل حر', 'Freelance'), b('عن بُعد', 'Remote'), b('من المقر', 'On-site')], goldFirst: true },
      { icon: 'web', title: b('مواقع الشركات ولوحات التحكم', 'Company websites & admin panels'), text: b('مواقع بالعربية والإنجليزية سريعة ومتجاوبة مع الموبايل، بلوحة تحكم يعدّل منها صاحب الشركة كل المحتوى بنفسه من غير الرجوع لمبرمج.', 'Fast, mobile-friendly Arabic/English websites with an admin panel so the owner edits every piece of content without going back to a developer.'), tags: [b('عمل حر', 'Freelance'), b('عن بُعد', 'Remote')], goldFirst: true },
      { icon: 'phone', title: b('تطبيقات الموبايل', 'Mobile apps'), text: b('تطبيقات أندرويد بواجهة حديثة تعمل بدون إنترنت وتتزامن تلقائياً عند الاتصال، مع إشعارات وتسجيل دخول آمن.', 'Modern Android apps that work offline and sync automatically when connected, with notifications and secure sign-in.'), tags: [b('عمل حر', 'Freelance'), b('عن بُعد', 'Remote')], goldFirst: true },
      { icon: 'palette', title: b('تصميم السوشيال ميديا والإعلانات', 'Social media & ad design'), text: b('منذ 2014: تصميم إعلانات ومنشورات على Canva وPhotoshop لشركات وصفحات (أكثر من 150 تصميماً)، وإدارة الصفحات والحملات الممولة على Meta Business Suite.', 'Since 2014: ads and posts on Canva and Photoshop for companies and pages (150+ designs), plus page management and paid campaigns on Meta Business Suite.'), tags: [b('عمل حر', 'Freelance'), b('عن بُعد', 'Remote')], goldFirst: true },
      { icon: 'ai', title: b('الأتمتة واستخراج البيانات من المستندات', 'Automation & document data extraction'), text: b('قراءة الجوازات والسير الذاتية والمستندات وتحويلها لسجلات منظمة (OCR)، ومطابقة المرشحين بالوظائف، وتقليل الإدخال اليدوي والأخطاء.', 'Reading passports, CVs and documents into structured records (OCR), matching candidates to jobs, and cutting manual entry and errors.'), tags: [b('عمل حر', 'Freelance'), b('عن بُعد', 'Remote')], goldFirst: true },
      { icon: 'users', title: b('تشغيل الأنظمة والتدريب', 'System rollout & training'), text: b('تشغيل أنظمة الإدارة داخل الشركة، ونقل البيانات من Excel والأنظمة القديمة، وتدريب الموظفين، ودعم ما بعد التشغيل.', 'Rolling out management systems inside the company, migrating data from Excel and legacy systems, training staff and supporting after launch.'), tags: [b('من المقر', 'On-site'), b('عمل حر', 'Freelance')], goldFirst: false },
      { icon: 'support', title: b('الدعم الفني والشبكات', 'IT support & networks'), text: b('تثبيت Windows والبرامج، وحل أعطال الأجهزة، والشبكات المحلية والراوتر، والطابعات والماسحات، والوصول عن بُعد، والنسخ الاحتياطي.', 'Windows and software installation, hardware troubleshooting, LANs and routers, printers and scanners, remote access and backups.'), tags: [b('من المقر', 'On-site'), b('عمل حر', 'Freelance')], goldFirst: false },
      { icon: 'table', title: b('البيانات وExcel', 'Data & Excel'), text: b('إدخال بيانات سريع ودقيق، وتنظيم ملفات Excel ولوحات المتابعة، وتحويل PDF والصور إلى Word وExcel، والأرشفة.', 'Fast, accurate data entry, structured Excel files and tracking dashboards, PDF/image to Word/Excel conversion and archiving.'), tags: [b('عمل حر', 'Freelance'), b('عن بُعد', 'Remote'), b('من المقر', 'On-site')], goldFirst: true },
      { icon: 'ops', title: b('التشغيل الإداري', 'Administrative operations'), text: b('متابعة الإجراءات والملفات، وتنسيق المهام، والتعامل مع الجهات المختلفة، وإعداد التقارير للإدارة.', 'Following up procedures and files, coordinating tasks, dealing with different parties and preparing management reports.'), tags: [b('من المقر', 'On-site'), b('عمل حر', 'Freelance')], goldFirst: false }
    ]
  },

  projects: {
    kicker: b('سابقة الأعمال', 'Portfolio'),
    title: b('المشاريع والعروض التفاعلية', 'Projects & interactive demos'),
    sub: b('أنظمة ومواقع وتطبيقات تعمل فعلياً، ونماذج توضيحية جاهزة. جرّب العروض بنفسك، أو اطلب ديمو مباشر على واتساب.', 'Systems, websites and apps running in production, plus ready-made concept demos. Try them yourself or request a live demo on WhatsApp.'),
    cats: [
      { id: 'sys', label: b('الأنظمة', 'Systems') }, { id: 'web', label: b('المواقع', 'Websites') }, { id: 'app', label: b('التطبيقات', 'Apps') },
      { id: 'sample', label: b('نماذج توضيحية', 'Concept demos') }, { id: 'other', label: b('أخرى', 'Other') }
    ],
    groupTitles: {
      feature: b('الأنظمة والتطبيقات الرئيسية', 'Main systems & apps'),
      showcase: b('نماذج توضيحية جاهزة', 'Ready-made concept demos'),
      site: b('مواقع الشركات', 'Company websites'),
      mini: b('أعمال أخرى', 'Other work')
    },
    items: [
      {
        id: 'masar-ops', kind: 'feature', cat: 'sys', visible: true, status: 'live', badge: X('pj.live'), type: X('type.sys'),
        title: X('ops.t'), alt: X('ops.alt'), text: X('ops.d'), features: [1, 2, 3, 4, 5, 6].map((i) => X('ops.f' + i)),
        tech: 'React, Tailwind CSS, Node.js, Express, MySQL, SQL Server, Socket.IO, Gemini / Google Vision OCR', demo: 'ops', images: imgs('masar-ops', 5)
      },
      {
        id: 'masar-hr', kind: 'feature', cat: 'sys', visible: true, status: 'live', badge: X('pj.live2'), type: X('type.ats'),
        title: X('hr.t'), alt: X('hr.alt'), text: X('hr.d'), features: [1, 2, 3, 4, 5, 6, 7, 8].map((i) => X('hr.f' + i)),
        tech: 'React 18, Node.js, Express, MySQL, SQL Server, Gemini API, Claude API, IndexedDB', demo: 'hr', images: imgs('masar-hr', 3)
      },
      {
        id: 'wesal', kind: 'feature', cat: 'app', visible: true, status: 'live', badge: X('pj.offline'), type: X('type.app'),
        title: X('ws.t'), alt: X('ws.alt'), text: X('ws.d'), features: [1, 2, 3, 4, 5, 6, 7].map((i) => X('ws.f' + i)),
        tech: 'React 19, TypeScript, Vite, Capacitor, Android, Cloudflare Pages + D1, Firebase Auth', demo: 'app', apk: WA, images: imgs('wesal', 7, 'jpg')
      },

      /* ---- نماذج توضيحية جديدة ---- */
      {
        id: 'pos-demo', kind: 'showcase', cat: 'sample', visible: true, status: 'sample', type: b('مخازن ومبيعات', 'Inventory & sales'),
        title: b('نظام المخازن ونقطة البيع', 'Inventory & Point-of-Sale System'),
        text: b('نظام لمحلات الجملة والتجزئة: شاشة بيع سريعة، ومخزون لحظي، وتنبيهات النقص، وتقارير المبيعات.', 'A system for wholesale and retail shops: a fast checkout screen, live stock, low-stock alerts and sales reports.'),
        features: [b('شاشة بيع بالباركود والبحث مع حساب الخصم والإجمالي', 'Checkout with search, discount and automatic totals'), b('مخزون لحظي ينقص مع كل عملية بيع، وتنبيه عند الوصول لحد الطلب', 'Live stock that drops with each sale, with reorder alerts'), b('تعديل المخزون وإضافة الأصناف من الشاشة', 'Adjust stock and add products from the screen'), b('تقارير مبيعات حسب الفئة وأفضل الأصناف', 'Sales by category and top products')],
        tech: 'React, Node.js, MySQL, Barcode', demo: 'pos', images: imgs('pos-demo', 4)
      },
      {
        id: 'invoices-demo', kind: 'showcase', cat: 'sample', visible: true, status: 'sample', type: b('فواتير ومحاسبة', 'Invoicing & accounting'),
        title: b('نظام الفواتير والمحاسبة', 'Invoicing & Accounting System'),
        text: b('إصدار فواتير احترافية ومتابعة التحصيل والمصروفات، مع لوحة أرباح ومستحقات العملاء.', 'Issue professional invoices, track collections and expenses, with a profit and receivables dashboard.'),
        features: [b('إنشاء فاتورة بأصناف وضريبة قيمة مضافة 14% وإجمالي تلقائي', 'Create invoices with line items, 14% VAT and automatic totals'), b('متابعة حالة الفاتورة: مدفوعة، مستحقة، متأخرة', 'Track invoice status: paid, due, overdue'), b('حسابات العملاء وأرصدتهم، وتسجيل المصروفات', 'Client accounts and balances, plus expense logging'), b('لوحة إيرادات ومصروفات وصافي ربح', 'Income, expenses and net profit dashboard')],
        tech: 'React, Node.js, MySQL, PDF export', demo: 'invoices', images: imgs('invoices-demo', 4)
      },
      {
        id: 'fleet-demo', kind: 'showcase', cat: 'sample', visible: true, status: 'sample', type: b('نقل ورحلات', 'Transport & trips'),
        title: b('نظام جدولة الرحلات والسائقين', 'Trips & Driver Dispatch System'),
        text: b('جدولة رحلات النقل وتوزيع السائقين والمركبات ومتابعة التأخير والحالات العاجلة وتقارير التشغيل اليومية.', 'Schedule transport trips, assign drivers and vehicles, track delays and urgent cases, with daily operations reports.'),
        features: [b('جدول رحلات اليوم مع تعيين السائق والمركبة وتغيير الحالة', 'Today’s trip board with driver/vehicle assignment and status changes'), b('بطاقات السائقين وتنبيه انتهاء الرخص', 'Driver cards with licence-expiry alerts'), b('متابعة المركبات والصيانة الدورية', 'Vehicle tracking and scheduled maintenance'), b('تقرير تشغيل يومي جاهز للإدارة', 'A daily operations report ready for management')],
        tech: 'React, Node.js, MySQL', demo: 'fleet', images: imgs('fleet-demo', 4)
      },
      {
        id: 'realestate-demo', kind: 'showcase', cat: 'sample', visible: true, status: 'sample', type: b('عقارات وإيجار', 'Real estate & rentals'),
        title: b('نظام إدارة العقارات والإيجارات', 'Property & Rental Management'),
        text: b('إدارة الوحدات والمستأجرين وعقود الإيجار وتحصيل الأقساط مع تنبيهات انتهاء العقود والمتأخرات.', 'Manage units, tenants, leases and rent collection with expiry and arrears alerts.'),
        features: [b('خريطة وحدات بحالتها: مؤجرة، شاغرة، صيانة', 'Unit map by status: rented, vacant, maintenance'), b('عقود الإيجار وأيام الانتهاء وتجديد بضغطة', 'Leases, days to expiry and one-click renewal'), b('تحصيل الإيجار وتسجيل الدفعات والمتأخرات', 'Rent collection, payments and arrears'), b('نسبة الإشغال والإيراد الشهري', 'Occupancy rate and monthly income')],
        tech: 'React, Node.js, MySQL', demo: 'realestate', images: imgs('realestate-demo', 4)
      },
      {
        id: 'clinic-demo', kind: 'showcase', cat: 'sample', visible: true, status: 'sample', type: b('عيادات ومواعيد', 'Clinics & appointments'),
        title: b('نظام العيادات وحجز المواعيد', 'Clinic & Appointment System'),
        text: b('جدول مواعيد الأطباء، وملفات المرضى، وسجل الزيارات، والتحصيل اليومي في شاشة واحدة.', 'Doctors’ schedules, patient files, visit history and daily collections in one screen.'),
        features: [b('جدول يومي حسب الطبيب مع حجز موعد جديد وتسجيل الحضور', 'Daily schedule per doctor with new bookings and check-in'), b('ملف مريض بسجل الزيارات والتشخيص السابق', 'Patient file with visit history and previous diagnoses'), b('بحث سريع بالاسم أو الموبايل', 'Quick search by name or phone'), b('إيراد اليوم وعدد المرضى', 'Today’s revenue and patient count')],
        tech: 'React, Node.js, MySQL', demo: 'clinic', images: imgs('clinic-demo', 4)
      },
      {
        id: 'school-demo', kind: 'showcase', cat: 'sample', visible: true, status: 'sample', type: b('مدارس وحضور', 'Schools & attendance'),
        title: b('نظام المدارس والحضور والدرجات', 'School Attendance & Grades System'),
        text: b('تسجيل الحضور والغياب بالفصل، وإدخال الدرجات وحساب المتوسط والترتيب، وإشعارات أولياء الأمور.', 'Class attendance, grade entry with averages and ranking, and parent notifications.'),
        features: [b('تحضير الفصل بضغطة: حاضر، غائب، متأخر', 'One-tap class roll call: present, absent, late'), b('نسبة الحضور لكل طالب وتنبيه للغياب المتكرر', 'Attendance rate per student with repeated-absence alerts'), b('رصد الدرجات تلقائياً بالمتوسط والترتيب', 'Grade entry with automatic average and ranking'), b('رسائل لأولياء الأمور', 'Messages to parents')],
        tech: 'React, Node.js, MySQL', demo: 'school', images: imgs('school-demo', 4)
      },
      {
        id: 'resto-demo', kind: 'showcase', cat: 'sample', visible: true, status: 'sample', type: b('تطبيق موبايل', 'Mobile app'),
        title: b('تطبيق طلبات المطاعم', 'Restaurant Ordering App'),
        text: b('تطبيق لطلب الطعام: قائمة بالتصنيفات، وسلة، وكود خصم، وتتبع حالة الطلب لحظة بلحظة.', 'A food-ordering app: categorised menu, cart, promo code and live order tracking.'),
        features: [b('قائمة طعام بتصنيفات وتفاصيل كل طبق', 'Categorised menu with dish details'), b('سلة وكود خصم ورسوم توصيل', 'Cart, promo code and delivery fee'), b('تتبع حالة الطلب: تحضير، في الطريق، تم التسليم', 'Order tracking: preparing, on the way, delivered'), b('سجل الطلبات السابقة وإعادة الطلب', 'Order history and re-order')],
        tech: 'React, Capacitor, Node.js, Firebase', demo: 'resto', images: imgs('resto-demo', 4)
      },
      {
        id: 'eshop-demo', kind: 'showcase', cat: 'sample', visible: true, status: 'sample', type: b('متجر إلكتروني', 'E-commerce'),
        title: b('متجر إلكتروني بلوحة إدارة', 'Online Store with Admin Panel'),
        text: b('واجهة متجر بعرض المنتجات والسلة والدفع، ولوحة إدارة للطلبات والمنتجات والمبيعات.', 'A storefront with products, cart and checkout, plus an admin panel for orders, products and sales.'),
        features: [b('منتجات بتصنيفات وخيارات اللون والمقاس', 'Products with categories and colour/size options'), b('سلة وكوبون خصم وإتمام الطلب', 'Cart, coupon and checkout'), b('لوحة طلبات بتغيير الحالة', 'Orders board with status changes'), b('إدارة المنتجات والمخزون ومبيعات اليوم', 'Product and stock management with today’s sales')],
        tech: 'React, Node.js, MySQL, EJS', demo: 'eshop', images: imgs('eshop-demo', 4)
      },

      /* ---- مواقع ---- */
      { id: 'site-nesr', kind: 'site', cat: 'web', visible: true, status: 'live', badge: X('pj.online'), type: b('عربي / إنجليزي', 'AR / EN'), title: X('w1.t'), text: X('w1.d'), features: [1, 2, 3, 4, 5].map((i) => X('w1.f' + i)), tech: 'Node.js, Express, EJS, JSON', link: 'https://nisrelkhaleeg.com', images: ['assets/img/projects/nesr-site-cover.jpg'] },
      { id: 'site-forsan', kind: 'site', cat: 'web', visible: true, status: 'live', badge: X('pj.online'), type: X('type.travel'), title: X('w2.t'), text: X('w2.d'), features: [1, 2, 3, 4].map((i) => X('w2.f' + i)), tech: 'Node.js, Express, EJS, JSON', link: 'https://forsango.com', images: ['assets/img/projects/forsan-go-cover.jpg'] },
      { id: 'site-rockline', kind: 'site', cat: 'web', visible: true, status: 'live', badge: X('pj.online'), type: X('type.cons'), title: X('w3.t'), text: X('w3.d'), features: [1, 2, 3].map((i) => X('w3.f' + i)), tech: 'Node.js, Express, EJS', link: 'https://rocklineg.com', images: [] },

      /* ---- أخرى ---- */
      { id: 'commission', kind: 'mini', cat: 'web', visible: true, status: 'none', icon: 'share', title: X('cm.t'), text: X('cm.d'), images: [] },
      { id: 'store', kind: 'mini', cat: 'web', visible: true, status: 'none', icon: 'cart', title: X('sh.t'), text: X('sh.d'), images: [] },
      { id: 'excel-sample', kind: 'mini', cat: 'other', visible: false, status: 'none', icon: 'table', title: X('xl.t'), text: X('xl.d'), images: [], file: '', fileLabel: X('xl.btn') },
      { id: 'designs', kind: 'mini', cat: 'other', visible: false, status: 'none', icon: 'palette', title: X('ds.t'), text: X('ds.d'), images: [] }
    ]
  },

  experience: {
    kicker: b('الخبرات', 'Experience'),
    title: b('الخبرة العملية', 'Work experience'),
    items: [
      { visible: true, date: b('فبراير 2023 – حتى الآن', 'Feb 2023 – Present'), role: b('منسق العمليات والأنظمة', 'Operations & Systems Coordinator'), org: b('مكتب نسر الخليج لإلحاق العمالة المصرية بالخارج – الجيزة، مصر', 'Nesr El-Khaleej Overseas Recruitment Office – Giza, Egypt'), bullets: [
        b('صممتُ نظاماً مركزياً للملفات والحسابات استبدل ملفات Excel المتفرقة والسجلات الورقية، وأصبح النظام الأساسي الذي يعتمد عليه المكتب.', 'Designed a central system for files and accounts that replaced scattered Excel sheets and paper records and became the office’s core system.'),
        b('خفّضتُ وقت تسجيل الملف الواحد من عدة دقائق إلى ثوانٍ باستخدام استخراج البيانات من الصور (OCR) والإدخال السريع.', 'Cut the time to register a file from several minutes to seconds using OCR data extraction and fast entry.'),
        b('ابتكرتُ نظام ترقيم وأرشفة يربط كل ملف ورقي بسجله الإلكتروني، فتوقفت حالات فقد الجوازات تماماً.', 'Created a numbering-and-archiving system linking every paper file to its electronic record, which stopped passport losses entirely.'),
        b('أقدّم الدعم الفني لـ 9 أجهزة والشبكة المحلية والطابعات والماسحات والنسخ الاحتياطي.', 'Provide IT support for 9 devices, the local network, printers, scanners and backups.'),
        b('أتابع الإجراءات متعددة المراحل لآلاف الملفات (كشف طبي، بصمة، قنصلية، تأشيرة، سفر) مع الجهات الحكومية والشركاء.', 'Track multi-stage procedures for thousands of files (medical, fingerprint, consulate, visa, travel) with government bodies and partners.'),
        b('أصمم إعلانات الشركة وأدير صفحاتها وحملاتها الممولة على Meta Business Suite.', 'Design the company’s ads and manage its pages and paid campaigns on Meta Business Suite.')
      ] },
      { visible: true, date: b('2014 – حتى الآن', '2014 – Present'), role: b('فري لانسر: تصميم، مواقع، بيانات، وأنظمة أعمال', 'Freelancer: Design, Websites, Data & Business Systems'), org: b('عمل حر – عن بُعد ومن المقر', 'Self-employed – remote and on-site'), bullets: [
        b('منذ 2014: أنفّذ مشاريع حرة في تصميم السوشيال ميديا والإعلانات لشركات وصفحات (أكثر من 150 تصميماً) على Canva وPhotoshop، وأدير الصفحات والحملات الممولة.', 'Since 2014: deliver freelance social-media and ad design for companies and pages (150+ designs) on Canva and Photoshop, and manage pages and paid campaigns.'),
        b('أنفّذ أعمال إدخال البيانات وتنظيم ملفات Excel وتحويل المستندات، ومواقع تعريفية وصفحات هبوط للشركات.', 'Deliver data-entry work, Excel organisation and document conversion, plus company brochure websites and landing pages.'),
        b('منذ 2024: صممتُ وطوّرتُ أنظمة إدارة أعمال تعمل في عدة شركات ويستخدمها أكثر من 30 مستخدماً، ومواقع بلوحات تحكم، وتطبيق أندرويد.', 'Since 2024: designed and built business management systems running in several companies with 30+ users, websites with admin panels, and an Android app.'),
        b('أتولى الدورة كاملة: تحليل الاحتياج، وتصميم سير العمل، والتنفيذ، والاختبار، والتشغيل على الاستضافة أو شبكة الشركة.', 'Own the full cycle: requirements analysis, workflow design, build, testing, and deployment on hosting or the company network.'),
        b('أدرّب الموظفين، وأقدّم الدعم والتعديلات والتحديثات بعد التشغيل.', 'Train staff and provide support, changes and updates after launch.')
      ] },
      { visible: true, date: b('مايو 2025 – أغسطس 2025', 'May 2025 – Aug 2025'), role: b('منسق عمليات النقل (مهمة مؤقتة)', 'Transport Operations Coordinator (temporary assignment)'), org: b('شركة حسين حجازي للنقل والعمرة – مكة المكرمة، السعودية', 'Hussein Hegazy Transport & Umrah Company – Makkah, Saudi Arabia'), bullets: [
        b('نسّقتُ رحلات نقل المعتمرين والموظفين، وتابعتُ الجداول والمواعيد مع السائقين وفرق التشغيل.', 'Coordinated transport trips for pilgrims and staff and followed schedules and timings with drivers and operations teams.'),
        b('تعاملتُ مع التغييرات المفاجئة والحالات العاجلة، وأعددتُ تقارير التشغيل اليومية.', 'Handled sudden changes and urgent cases and prepared daily operations reports.'),
        b('عملتُ مكتبياً وميدانياً في ورديات ممتدة خلال موسم عالي الضغط.', 'Worked in the office and in the field on extended shifts during a high-pressure season.')
      ] }
    ]
  },

  skills: {
    kicker: b('المهارات', 'Skills'),
    title: b('المهارات والأدوات', 'Skills & tools'),
    groups: [
      { icon: 'code', highlight: true, title: b('تطوير الويب والأنظمة', 'Web & systems development'), items: ['React', 'TypeScript', 'JavaScript', 'Node.js', 'Express', 'REST APIs', 'HTML / CSS', 'Tailwind CSS', 'EJS', 'Vite', 'Socket.IO', b('لوحات تحكم وأنظمة صلاحيات', 'Admin panels & permission systems')] },
      { icon: 'db', highlight: true, title: b('قواعد البيانات والنشر', 'Databases & deployment'), items: ['MySQL', 'SQL Server', 'IndexedDB', 'Firebase Auth', 'Cloudflare Pages + D1', 'Hostinger', 'Git & GitHub', b('نقل البيانات بين قواعد مختلفة', 'Cross-database data migration'), b('نسخ احتياطي واستعادة', 'Backup & restore')] },
      { icon: 'ai', highlight: true, title: b('الأتمتة واستخراج البيانات', 'Automation & data extraction'), items: ['Gemini API', 'Claude API', 'OpenAI API', 'OCR', b('استخراج البيانات من المستندات', 'Document data extraction'), b('مطابقة المرشحين بالوظائف', 'Candidate–job matching'), b('أدوات الذكاء الاصطناعي في العمل اليومي', 'AI tools in daily work')] },
      { icon: 'phone', title: b('تطبيقات الموبايل', 'Mobile apps'), items: ['Capacitor', 'Android', b('الإشعارات', 'Push notifications'), b('العمل بدون إنترنت والمزامنة', 'Offline & sync')] },
      { icon: 'shield', title: b('الأمان', 'Security'), items: [b('التحقق الثنائي (2FA)', 'Two-factor authentication'), b('صلاحيات تفصيلية', 'Granular permissions'), b('سجل العمليات', 'Audit log'), b('تشفير كلمات المرور والبيانات', 'Password & data encryption'), b('موافقة الأجهزة الجديدة', 'New-device approval')] },
      { icon: 'support', title: b('الدعم الفني والشبكات', 'IT support & networks'), items: ['Windows 10 / 11', b('تثبيت وتهيئة الأنظمة والبرامج', 'OS & software setup'), b('حل أعطال الأجهزة', 'Hardware troubleshooting'), b('الشبكات المحلية (LAN) والواي فاي', 'LAN & Wi-Fi'), b('إعداد الراوتر والسويتش', 'Router & switch setup'), b('IP ثابت و Port Forwarding', 'Static IP & port forwarding'), b('الجدار الناري', 'Firewall'), b('الطابعات والماسحات', 'Printers & scanners'), b('الوصول عن بُعد', 'Remote access'), b('النسخ الاحتياطي والاستعادة', 'Backup & recovery')] },
      { icon: 'table', title: b('البيانات وExcel والمكتب', 'Data, Excel & Office'), items: ['Excel', b('المعادلات والجداول المحورية', 'Formulas & pivot tables'), b('لوحات متابعة في Excel', 'Excel tracking dashboards'), 'Google Sheets', 'Word', 'PowerPoint', b('إدخال البيانات ومراجعتها', 'Data entry & verification'), b('تنظيف البيانات وتوحيد الصيغ', 'Data cleaning & standardisation'), b('تحويل PDF والصور إلى Word / Excel', 'PDF/image to Word/Excel conversion'), b('الأرشفة الإلكترونية والورقية', 'Digital & paper archiving'), b('إعداد التقارير', 'Report preparation')] },
      { icon: 'ops', title: b('التشغيل الإداري وتحليل الأعمال', 'Operations & business analysis'), items: [b('تحليل الاحتياج', 'Requirements analysis'), b('رسم سير الإجراءات', 'Workflow mapping'), b('متابعة الإجراءات متعددة المراحل', 'Multi-stage procedure follow-up'), b('التنسيق مع الجهات الخارجية', 'External-party coordination'), b('تشغيل الأنظمة', 'System rollout'), b('نقل البيانات من Excel', 'Migrating data from Excel'), b('تدريب المستخدمين', 'User training'), b('إعداد الأدلة والتوثيق', 'Guides & documentation'), b('عرض الأنظمة والبيع', 'System demos & selling')] },
      { icon: 'palette', title: b('التصميم والتسويق', 'Design & marketing'), items: ['Canva', 'Photoshop', 'Meta Business Suite', b('إدارة الصفحات', 'Page management'), b('الإعلانات الممولة', 'Paid campaigns'), b('تصميم الإعلانات والمنشورات (+150 تصميماً)', 'Ad & post design (150+ designs)'), b('تصميم مواقع تعريفية وصفحات هبوط', 'Brochure sites & landing pages')] },
      { icon: 'users', title: b('مهارات شخصية', 'Professional strengths'), items: [b('العمل الحر وإدارة المشاريع باستقلالية', 'Independent freelance project management'), b('الالتزام بالمواعيد', 'Meeting deadlines'), b('العمل تحت ضغط وفي ورديات', 'Working under pressure & in shifts'), b('التواصل مع العملاء', 'Client communication'), b('التعلّم السريع', 'Fast learning'), b('الدقة والاهتمام بالتفاصيل', 'Accuracy & attention to detail'), b('العربية (لغة أم) والإنجليزية', 'Arabic (native) & English')] }
    ]
  },

  contact: {
    kicker: b('التواصل', 'Contact'),
    title: b('لنتواصل', 'Let’s talk'),
    sub: b('لديك مشروع نظام أو موقع أو تطبيق، أو تحتاج تصميماً أو دعماً فنياً، أو تريد ديمو مباشراً لأحد الأنظمة؟ يسعدني أن أسمع منك.', 'Have a system, website or app project, need design or technical support, or want a live demo of one of my systems? I’d be glad to hear from you.'),
    formTitle: b('أرسل رسالة سريعة', 'Send a quick message'),
    topics: [b('فرصة عمل', 'Job opportunity'), b('تطوير نظام أو موقع أو تطبيق', 'System, website or app development'), b('مشروع حر آخر', 'Another freelance project'), b('ديمو مباشر لأحد الأنظمة', 'Live demo of a system'), b('موضوع آخر', 'Something else')]
  },

  custom: []
};

fs.mkdirSync(path.join(__dirname, '..', 'seed'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '..', 'seed', 'content.json'), JSON.stringify(content, null, 2));
console.log('seed ok —', content.projects.items.length, 'مشروع،', content.skills.groups.length, 'مجموعة مهارات');
