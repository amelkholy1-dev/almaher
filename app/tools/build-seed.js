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
  _v: 11,
  settings: {
    siteUrl: '',
    name: b('أحمد ماهر الخولي', 'Ahmed Maher Alkholy'),
    brand: b('أحمد الخولي', 'Ahmed Alkholy'),
    initials: 'AK',
    hello: b('مرحباً، أنا', 'Hello, I am'),
    role: b('مهندس أنظمة وحلول أعمال • تشغيل ودعم فني', 'Business Systems Engineer • Operations & IT Support'),
    lead: b(
      'أصمّم وأبني أنظمة إدارة تعمل داخل الشركات من اليوم الأول: أفهم شغلك، وأبني الحل المناسب، وأشغّله، وأدرّب فريقك، وأرافقه بالدعم بعد التشغيل. فري لانسر منذ 2014، وخبرة عملية قرابة 7 سنوات في الأنظمة والتصميم والعمليات.',
      'I design and build management systems that work inside companies from day one: I understand your business, build the right solution, put it into operation, train your team and back it with support after launch. Freelancer since 2014, with nearly 7 years of hands-on experience in systems, design and operations.'),
    availLabel: b('', ''),
    modes: [],
    location: b('الجيزة، مصر — أخدم عملاء في مصر والخليج وعن بُعد', 'Giza, Egypt — serving clients in Egypt, the Gulf and remotely'),
    heroChips: [{ icon: 'code', text: b('أنظمة • مواقع • تطبيقات', 'Systems • Websites • Apps') }, { icon: 'ai', text: b('ذكاء اصطناعي', 'AI-powered') }, { icon: 'palette', text: b('فري لانسر منذ 2014', 'Freelancer since 2014') }],
    email: 'am.elkholy1@gmail.com',
    whatsapp: '201552084471',
    linkedin: 'https://www.linkedin.com/in/ahmed-alkholy',
    github: '',
    photo: 'assets/img/ahmed-alkholy.jpg',
    ogImage: 'assets/img/og-image.jpg',
    showCv: true,
    cv: { ar: 'assets/cv/Ahmed-Alkholy-CV-AR.pdf', en: 'assets/cv/Ahmed-Alkholy-CV-EN.pdf' },
    seo: {
      title: b('أحمد ماهر الخولي | مهندس أنظمة وحلول أعمال', 'Ahmed Maher Alkholy | Business Systems Engineer'),
      description: b('مهندس أنظمة وحلول أعمال، فري لانسر منذ 2014: أنظمة ومواقع وتطبيقات تعمل داخل الشركات، وتصميم سوشيال ميديا، ودعم فني وتشغيل. الجيزة، مصر.', 'Business systems engineer, freelancer since 2014: systems, websites and apps running inside companies, social-media design, IT support and operations. Giza, Egypt.')
    },
    demoNotice: b('عرض توضيحي تفاعلي ببيانات تجريبية – النظام الكامل متاح عند الطلب', 'Interactive demo with sample data – the full system is available on request'),
    demoNoticeSample: b('عرض تفاعلي ببيانات تجريبية بالكامل – يمكن تنفيذ نظام مماثل حسب احتياجك', 'Interactive demo with fully sample data – a similar system can be built around your needs'),
    waMessages: {
      general: b('مرحباً أحمد، وصلت إليك من موقعك الشخصي وأودّ التواصل معك.', 'Hi Ahmed, I found you through your website and would like to get in touch.'),
      project: b('مرحباً أحمد، شاهدت «{name}» على موقعك، وأرغب في ديمو مباشر ومعرفة المزيد.', 'Hi Ahmed, I saw “{name}” on your website and would like a live demo and more details.')
    },
    footer: b('مهندس أنظمة وحلول أعمال • فري لانسر منذ 2014', 'Business Systems Engineer • Freelancer since 2014')
  },

  stats: [
    { value: b('قرابة 7', 'Nearly 7'), label: b('سنوات خبرة عملية', 'years of hands-on experience') },
    { value: b('17', '17'), label: b('أنظمة ومشاريع منفّذة', 'systems & projects delivered') },
    { value: b('+40', '40+'), label: b('مستخدم يعتمدون على أنظمتي يومياً', 'users relying on my systems daily') },
    { value: b('+150', '150+'), label: b('تصميم لشركات وصفحات', 'designs for companies & pages') }
  ],

  layout: {
    sections: [
      { id: 'stats', visible: true, nav: false, label: b('أرقام سريعة', 'Quick facts') },
      { id: 'about', visible: true, nav: true, label: b('نبذة', 'About') },
      { id: 'process', visible: true, nav: false, label: b('طريقة العمل', 'How I work') },
      { id: 'services', visible: true, nav: true, label: b('الخدمات', 'Services') },
      { id: 'c:packages', visible: true, nav: false, label: b('باقات الخدمات', 'Service packages') },
      { id: 'projects', visible: true, nav: true, label: b('المشاريع', 'Projects') },
      { id: 'experience', visible: true, nav: true, label: b('الخبرات', 'Experience') },
      { id: 'skills', visible: true, nav: true, label: b('المهارات', 'Skills') },
      { id: 'reviews', visible: true, nav: false, label: b('آراء العملاء', 'Reviews') },
      { id: 'c:faq', visible: true, nav: false, label: b('أسئلة شائعة', 'FAQ') },
      { id: 'contact', visible: true, nav: true, label: b('تواصل معي', 'Contact') }
    ]
  },

  about: {
    kicker: b('نبذة عني', 'About me'),
    title: b('أنظمة تعمل، وفرق تتدرّب، ودعم مستمر', 'Systems that work, teams that get trained, support that lasts'),
    paragraphs: [
      b('أعمل فري لانسر منذ يناير 2014، أنفّذ للشركات والصفحات تصميمات ومواقع وأعمال بيانات، وأبني أنظمة إدارة أعمال تعمل فعلياً ويعتمد عليها أكثر من 40 مستخدماً كل يوم. نفّذتُ 17 نظاماً ومشروعاً بين أنظمة وتطبيقات ومواقع، وأكثر من 150 تصميماً.',
        'I have worked as a freelancer since January 2014, delivering designs, websites and data work for companies and pages, and building business management systems that run in production and that 40+ users rely on every day. I have delivered 17 systems and projects across systems, apps and websites, plus 150+ designs.'),
      b('ومنذ فبراير 2023 أتولى العمليات والأنظمة في مكتب لإلحاق العمالة المصرية بالخارج: أتابع آلاف الملفات عبر مراحل الكشف الطبي والبصمة والقنصلية والتأشيرة والسفر، وأدير الأجهزة والشبكة.',
        'Since February 2023 I have run operations and systems at an Egyptian overseas-recruitment office: tracking thousands of files through the medical, fingerprint, consulate, visa and travel stages, and managing the devices and network.'),
      b('هناك صممتُ نظاماً مركزياً للملفات والحسابات حلّ محل Excel والورق وصار قلب العمل في المكتب: تسجيل الملف من دقائق إلى ثوانٍ، وتوقفت حالات فقد الجوازات بعد نظام الترقيم والأرشفة.',
        'There I designed a central system for files and accounts that replaced Excel and paper and became the heart of the office’s work: file registration from minutes to seconds, and passport losses stopped after the numbering-and-archiving system.'),
      b('أنا فريق كامل في شخص واحد: أحلل الاحتياج، وأصمم، وأنفّذ، وأشغّل، وأدرّب، وأدعم. فلا يحتاج عميلي إلى التنسيق بين أكثر من جهة.',
        'I am a full team in one person: I analyse the need, design, build, deploy, train and support — so my client never has to coordinate between several parties.')
    ],
    highlightLast: false,
    facts: [
      { icon: 'cal', title: b('الخبرة', 'Experience'), text: b('قرابة 7 سنوات • فري لانسر منذ يناير 2014', 'Nearly 7 years • Freelancer since January 2014') },
      { icon: 'cap', title: b('التعليم', 'Education'), text: b('بكالوريوس التربية النوعية – تكنولوجيا التعليم والحاسب الآلي، جامعة المنوفية (2018–2022) – جيد مرتفع', 'B.Ed. in Specific Education – Educational Technology & Computing, Menoufia University (2018–2022) – Very Good') },
      { icon: 'lang', title: b('اللغات', 'Languages'), text: b('العربية (اللغة الأم)، الإنجليزية (قراءة وكتابة جيدة)', 'Arabic (native), English (good reading and writing)') },
      { icon: 'pin', title: b('المكان', 'Location'), text: b('الجيزة، مصر — أخدم عملاء في مصر والخليج وعن بُعد', 'Giza, Egypt — serving clients in Egypt, the Gulf and remotely') },
      { icon: 'car', title: b('رخصة القيادة', 'Driving licence'), text: b('سيارة خاصة ودراجة نارية', 'Private car and motorcycle') }
    ]
  },

  process: {
    kicker: b('طريقة العمل', 'How I work'),
    title: b('من الفكرة حتى التشغيل', 'From idea to go-live'),
    sub: b('منهج واحد في كل مشروع: من أول اجتماع حتى ما بعد التشغيل.', 'One method on every project: from the first meeting to well after go-live.'),
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
    title: b('ما الذي أنفّذه لك؟', 'What I deliver'),
    sub: b('أنظمة ومواقع وتطبيقات وتصميم، مع التشغيل والتدريب والدعم.', 'Systems, websites, apps and design — with deployment, training and support.'),
    items: [
      { icon: 'sys', title: b('تصميم وتنفيذ أنظمة إدارة الأعمال', 'Business management systems'), text: b('أنظمة إدارة مصمّمة على قياس شركتك: عمليات، وحسابات، ومخازن، وموارد بشرية، بصلاحيات دقيقة وتقارير جاهزة وتصدير Excel وPDF ونسخ احتياطي. أبدأ من شغلك أنت، لا من قالب جاهز.', 'Management systems tailored to your company: operations, accounting, inventory and HR, with granular permissions, ready reports, Excel/PDF export and backups. I start from your business, not from a ready-made template.'), tags: [], goldFirst: false },
      { icon: 'web', title: b('مواقع الشركات ولوحات التحكم', 'Company websites & admin panels'), text: b('مواقع عربية وإنجليزية سريعة ومتجاوبة مع الموبايل، بلوحة تحكم تعدّل منها كل شيء بنفسك دون الرجوع إلى مبرمج.', 'Fast, mobile-friendly Arabic/English websites with an admin panel, so you edit everything yourself without going back to a developer.'), tags: [], goldFirst: false },
      { icon: 'phone', title: b('تطبيقات الموبايل', 'Mobile apps'), text: b('تطبيقات أندرويد بواجهة حديثة، تعمل بدون إنترنت وتتزامن تلقائياً، مع إشعارات وتسجيل دخول آمن.', 'Android apps with a modern interface that work offline and sync automatically, with notifications and secure sign-in.'), tags: [], goldFirst: false },
      { icon: 'palette', title: b('تصميم السوشيال ميديا والإعلانات', 'Social media & ad design'), text: b('هوية وإعلانات ومنشورات تُبرز نشاطك على Canva وPhotoshop، وإدارة صفحاتك وحملاتك الممولة على Meta — أكثر من 150 تصميماً منذ 2014.', 'Branding, ads and posts that showcase your business on Canva and Photoshop, plus management of your pages and paid campaigns on Meta — 150+ designs since 2014.'), tags: [], goldFirst: false },
      { icon: 'ai', title: b('الأتمتة واستخراج البيانات من المستندات', 'Automation & document data extraction'), text: b('أحوّل الجوازات والمستندات والسير الذاتية إلى سجلات منظمة تلقائياً (OCR)، وأطابق المرشحين بالوظائف، وأُنهي الإدخال اليدوي والأخطاء.', 'I turn passports, documents and CVs into structured records automatically (OCR), match candidates to jobs, and eliminate manual entry and errors.'), tags: [], goldFirst: false },
      { icon: 'users', title: b('تشغيل الأنظمة والتدريب', 'System rollout & training'), text: b('أنقل بياناتك من Excel والأنظمة القديمة، وأشغّل النظام داخل شركتك، وأدرّب فريقك حتى يعتمد عليه، وأدعمه بعد التشغيل.', 'I migrate your data from Excel and legacy systems, put the system into operation inside your company, train your team until they rely on it, and support it after launch.'), tags: [], goldFirst: false },
      { icon: 'support', title: b('الدعم الفني والشبكات', 'IT support & networks'), text: b('تثبيت وإدارة Windows والبرامج، وإصلاح الأعطال، والشبكات والراوتر، والطابعات والماسحات، والوصول عن بُعد، والنسخ الاحتياطي.', 'Installing and managing Windows and software, fixing faults, networks and routers, printers and scanners, remote access and backups.'), tags: [], goldFirst: false },
      { icon: 'table', title: b('البيانات وExcel', 'Data & Excel'), text: b('إدخال بيانات دقيق وسريع، وملفات Excel ولوحات متابعة تفهمها الإدارة، وتحويل PDF والصور إلى Word وExcel، وأرشفة منظمة.', 'Fast, accurate data entry, Excel files and tracking dashboards management can read, PDF/image to Word/Excel conversion, and organised archiving.'), tags: [], goldFirst: false },
      { icon: 'ops', title: b('التشغيل الإداري', 'Administrative operations'), text: b('متابعة الإجراءات والملفات، وتنسيق المهام والجهات المختلفة، وتقارير واضحة للإدارة.', 'Following procedures and files, coordinating tasks and different parties, and clear reports for management.'), tags: [], goldFirst: false }
    ]
  },

  projects: {
    kicker: b('سابقة الأعمال', 'Portfolio'),
    title: b('المشاريع والعروض التفاعلية', 'Projects & interactive demos'),
    sub: b('أنظمة ومواقع وتطبيقات بنيتُها وأشغّلها، ونماذج جاهزة للتجربة بواجهات عربية وإنجليزية. جرّبها بنفسك، أو اطلب جولة مباشرة على واتساب.', 'Systems, websites and apps I build and run, plus ready-to-try models with Arabic and English interfaces. Try them yourself or ask for a live walkthrough on WhatsApp.'),
    cats: [
      { id: 'sys', label: b('الأنظمة', 'Systems') }, { id: 'web', label: b('المواقع', 'Websites') }, { id: 'app', label: b('التطبيقات', 'Apps') },
      { id: 'other', label: b('أخرى', 'Other') }
    ],
    groupTitles: {
      feature: b('الأنظمة والتطبيقات', 'Systems & apps'),
      showcase: b('', ''),
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
        id: 'pos-demo', kind: 'showcase', cat: 'sys', visible: true, status: 'none', type: b('مخازن ومبيعات', 'Inventory & sales'),
        title: b('نظام المخازن ونقطة البيع', 'Inventory & Point-of-Sale System'),
        text: b('نظام لمحلات الجملة والتجزئة: شاشة بيع سريعة، ومخزون لحظي، وتنبيهات النقص، وتقارير المبيعات.', 'A system for wholesale and retail shops: a fast checkout screen, live stock, low-stock alerts and sales reports.'),
        features: [b('شاشة بيع بالباركود والبحث مع حساب الخصم والإجمالي', 'Checkout with search, discount and automatic totals'), b('مخزون لحظي ينقص مع كل عملية بيع، وتنبيه عند الوصول لحد الطلب', 'Live stock that drops with each sale, with reorder alerts'), b('تعديل المخزون وإضافة الأصناف من الشاشة', 'Adjust stock and add products from the screen'), b('تقارير مبيعات حسب الفئة وأفضل الأصناف', 'Sales by category and top products')],
        tech: 'React, Node.js, MySQL, Barcode', demo: 'pos', images: imgs('pos-demo', 4)
      },
      {
        id: 'invoices-demo', kind: 'showcase', cat: 'sys', visible: true, status: 'none', type: b('فواتير ومحاسبة', 'Invoicing & accounting'),
        title: b('نظام الفواتير والمحاسبة', 'Invoicing & Accounting System'),
        text: b('إصدار فواتير احترافية ومتابعة التحصيل والمصروفات، مع لوحة أرباح ومستحقات العملاء.', 'Issue professional invoices, track collections and expenses, with a profit and receivables dashboard.'),
        features: [b('إنشاء فاتورة بأصناف وضريبة قيمة مضافة 14% وإجمالي تلقائي', 'Create invoices with line items, 14% VAT and automatic totals'), b('متابعة حالة الفاتورة: مدفوعة، مستحقة، متأخرة', 'Track invoice status: paid, due, overdue'), b('حسابات العملاء وأرصدتهم، وتسجيل المصروفات', 'Client accounts and balances, plus expense logging'), b('لوحة إيرادات ومصروفات وصافي ربح', 'Income, expenses and net profit dashboard')],
        tech: 'React, Node.js, MySQL, PDF export', demo: 'invoices', images: imgs('invoices-demo', 4)
      },
      {
        id: 'fleet-demo', kind: 'showcase', cat: 'sys', visible: true, status: 'none', type: b('نقل ورحلات', 'Transport & trips'),
        title: b('نظام جدولة الرحلات والسائقين', 'Trips & Driver Dispatch System'),
        text: b('جدولة رحلات النقل وتوزيع السائقين والمركبات ومتابعة التأخير والحالات العاجلة وتقارير التشغيل اليومية.', 'Schedule transport trips, assign drivers and vehicles, track delays and urgent cases, with daily operations reports.'),
        features: [b('جدول رحلات اليوم مع تعيين السائق والمركبة وتغيير الحالة', 'Today’s trip board with driver/vehicle assignment and status changes'), b('بطاقات السائقين وتنبيه انتهاء الرخص', 'Driver cards with licence-expiry alerts'), b('متابعة المركبات والصيانة الدورية', 'Vehicle tracking and scheduled maintenance'), b('تقرير تشغيل يومي جاهز للإدارة', 'A daily operations report ready for management')],
        tech: 'React, Node.js, MySQL', demo: 'fleet', images: imgs('fleet-demo', 4)
      },
      {
        id: 'realestate-demo', kind: 'showcase', cat: 'sys', visible: true, status: 'none', type: b('عقارات وإيجار', 'Real estate & rentals'),
        title: b('نظام إدارة العقارات والإيجارات', 'Property & Rental Management'),
        text: b('إدارة الوحدات والمستأجرين وعقود الإيجار وتحصيل الأقساط مع تنبيهات انتهاء العقود والمتأخرات.', 'Manage units, tenants, leases and rent collection with expiry and arrears alerts.'),
        features: [b('خريطة وحدات بحالتها: مؤجرة، شاغرة، صيانة', 'Unit map by status: rented, vacant, maintenance'), b('عقود الإيجار وأيام الانتهاء وتجديد بضغطة', 'Leases, days to expiry and one-click renewal'), b('تحصيل الإيجار وتسجيل الدفعات والمتأخرات', 'Rent collection, payments and arrears'), b('نسبة الإشغال والإيراد الشهري', 'Occupancy rate and monthly income')],
        tech: 'React, Node.js, MySQL', demo: 'realestate', images: imgs('realestate-demo', 4)
      },
      {
        id: 'clinic-demo', kind: 'showcase', cat: 'sys', visible: true, status: 'none', type: b('عيادات ومواعيد', 'Clinics & appointments'),
        title: b('نظام العيادات وحجز المواعيد', 'Clinic & Appointment System'),
        text: b('جدول مواعيد الأطباء، وملفات المرضى، وسجل الزيارات، والتحصيل اليومي في شاشة واحدة.', 'Doctors’ schedules, patient files, visit history and daily collections in one screen.'),
        features: [b('جدول يومي حسب الطبيب مع حجز موعد جديد وتسجيل الحضور', 'Daily schedule per doctor with new bookings and check-in'), b('ملف مريض بسجل الزيارات والتشخيص السابق', 'Patient file with visit history and previous diagnoses'), b('بحث سريع بالاسم أو الموبايل', 'Quick search by name or phone'), b('إيراد اليوم وعدد المرضى', 'Today’s revenue and patient count')],
        tech: 'React, Node.js, MySQL', demo: 'clinic', images: imgs('clinic-demo', 4)
      },
      {
        id: 'school-demo', kind: 'showcase', cat: 'sys', visible: true, status: 'none', type: b('مدارس وحضور', 'Schools & attendance'),
        title: b('نظام المدارس والحضور والدرجات', 'School Attendance & Grades System'),
        text: b('تسجيل الحضور والغياب بالفصل، وإدخال الدرجات وحساب المتوسط والترتيب، وإشعارات أولياء الأمور.', 'Class attendance, grade entry with averages and ranking, and parent notifications.'),
        features: [b('تحضير الفصل بضغطة: حاضر، غائب، متأخر', 'One-tap class roll call: present, absent, late'), b('نسبة الحضور لكل طالب وتنبيه للغياب المتكرر', 'Attendance rate per student with repeated-absence alerts'), b('رصد الدرجات تلقائياً بالمتوسط والترتيب', 'Grade entry with automatic average and ranking'), b('رسائل لأولياء الأمور', 'Messages to parents')],
        tech: 'React, Node.js, MySQL', demo: 'school', images: imgs('school-demo', 4)
      },
      {
        id: 'resto-demo', kind: 'showcase', cat: 'app', cat2: 'sys', visible: true, status: 'none', type: b('تطبيق موبايل', 'Mobile app'),
        title: b('تطبيق طلبات المطاعم', 'Restaurant Ordering App'),
        text: b('تطبيق لطلب الطعام: قائمة بالتصنيفات، وسلة، وكود خصم، وتتبع حالة الطلب لحظة بلحظة.', 'A food-ordering app: categorised menu, cart, promo code and live order tracking.'),
        features: [b('قائمة طعام بتصنيفات وتفاصيل كل طبق', 'Categorised menu with dish details'), b('سلة وكود خصم ورسوم توصيل', 'Cart, promo code and delivery fee'), b('تتبع حالة الطلب: تحضير، في الطريق، تم التسليم', 'Order tracking: preparing, on the way, delivered'), b('سجل الطلبات السابقة وإعادة الطلب', 'Order history and re-order')],
        tech: 'React, Capacitor, Node.js, Firebase', demo: 'resto', images: imgs('resto-demo', 4)
      },
      {
        id: 'eshop-demo', kind: 'showcase', cat: 'web', cat2: 'sys', visible: true, status: 'none', type: b('متجر إلكتروني', 'E-commerce'),
        title: b('متجر إلكتروني بلوحة إدارة', 'Online Store with Admin Panel'),
        text: b('واجهة متجر بعرض المنتجات والسلة والدفع، ولوحة إدارة للطلبات والمنتجات والمبيعات.', 'A storefront with products, cart and checkout, plus an admin panel for orders, products and sales.'),
        features: [b('منتجات بتصنيفات وخيارات اللون والمقاس', 'Products with categories and colour/size options'), b('سلة وكوبون خصم وإتمام الطلب', 'Cart, coupon and checkout'), b('لوحة طلبات بتغيير الحالة', 'Orders board with status changes'), b('إدارة المنتجات والمخزون ومبيعات اليوم', 'Product and stock management with today’s sales')],
        tech: 'React, Node.js, MySQL, EJS', demo: 'eshop', images: imgs('eshop-demo', 4)
      },

      /* ---- English-interface concept projects (for international clients) ---- */
      {
        id: 'pulse-demo', kind: 'showcase', cat: 'sys', visible: true, status: 'none', type: b('لوحة تحليلات SaaS', 'SaaS analytics'),
        title: b('Pulse Analytics', 'Pulse Analytics'),
        text: b('لوحة تحليلات لشركات الاشتراكات: الإيراد الشهري، المستخدمون، معدل الانسحاب وصحة العملاء. واجهة إنجليزية بالكامل.', 'A subscription-analytics dashboard: MRR, active users, churn and customer health, with date ranges and drill-down. Full English interface.'),
        features: [b('مؤشرات MRR والمستخدمين والانسحاب بنطاقات 7 و30 و90 يوماً', 'MRR, active users and churn with 7 / 30 / 90-day ranges'), b('رسم اتجاه الإيراد وحركة MRR', 'Revenue trend chart and MRR movement'), b('قائمة عملاء قابلة للبحث مع مؤشر صحة لكل حساب', 'Searchable customer list with a health score per account'), b('تقارير مجدولة للإدارة', 'Scheduled management reports')],
        tech: 'React, Node.js, PostgreSQL', demo: 'pulse', images: imgs('pulse-demo', 4)
      },
      {
        id: 'crm-demo', kind: 'showcase', cat: 'sys', visible: true, status: 'none', type: b('نظام CRM', 'Sales CRM'),
        title: b('TaskFlow CRM', 'TaskFlow CRM'),
        text: b('نظام لإدارة خط المبيعات بلوحة مراحل: من العميل المحتمل حتى إغلاق الصفقة، مع قيمة كل مرحلة ونسبة الفوز. واجهة إنجليزية.', 'A sales-pipeline CRM with a staged board — from lead to won — showing the value of each stage and the win rate. English interface.'),
        features: [b('لوحة مراحل بنقل الصفقة بضغطة', 'Kanban pipeline: move a deal with one click'), b('قيمة المراحل ومتوسط الصفقة ونسبة الفوز', 'Stage totals, average deal size and win rate'), b('سجل أنشطة لكل صفقة وجهات اتصال', 'Activity timeline per deal and a contacts book'), b('إضافة صفقة جديدة في ثوانٍ', 'Add a new deal in seconds')],
        tech: 'React, Node.js, MySQL', demo: 'crm', images: imgs('crm-demo', 4)
      },
      {
        id: 'track-demo', kind: 'showcase', cat: 'web', cat2: 'sys', visible: true, status: 'none', type: b('بوابة تتبع شحنات', 'Shipment tracking portal'),
        title: b('SwiftTrack', 'SwiftTrack'),
        text: b('موقع لتتبع الشحنات برقم التتبع مع خط زمني للحالة، ولوحة إدارة لإنشاء الشحنات وتحديث حالتها. واجهة إنجليزية.', 'A shipment-tracking website with a status timeline by tracking number, plus an admin area to create shipments and update their status. English interface.'),
        features: [b('تتبع بالرقم مع مسار وخط زمني وموعد وصول', 'Track by number with route, timeline and ETA'), b('إنشاء شحنة وتوليد رقم تتبع', 'Create a shipment and generate a tracking number'), b('تحديث الحالة من لوحة الإدارة', 'Update status from the admin area'), b('مؤشرات الأداء والتسليم في الوقت', 'Performance and on-time delivery insights')],
        tech: 'Node.js, Express, MySQL, REST API', demo: 'track', images: imgs('track-demo', 4)
      },
      {
        id: 'stay-demo', kind: 'showcase', cat: 'web', cat2: 'sys', visible: true, status: 'none', type: b('موقع حجز فلل', 'Villa booking website'),
        title: b('Azure Stay', 'Azure Stay'),
        text: b('موقع حجز فلل وإقامات: بحث وفلاتر، حساب سعر الحجز مع الرسوم والضريبة، وإدارة الحجوزات وإشغال 14 يوماً. واجهة إنجليزية.', 'A villa and stay booking website: search and filters, live price breakdown with fees and tax, reservations management and a 14-day occupancy calendar. English interface.'),
        features: [b('بحث بالموقع وعدد الضيوف', 'Search by location and number of guests'), b('تفصيل سعر الليالي والتنظيف والضريبة لحظياً', 'Live price breakdown: nights, cleaning fee, taxes'), b('إدارة الحجوزات: تأكيد وإلغاء', 'Reservation management: confirm and cancel'), b('تقويم إشغال لكل فيلا', 'Occupancy calendar per villa')],
        tech: 'React, Node.js, MySQL, Stripe-ready', demo: 'stay', images: imgs('stay-demo', 4)
      },
      {
        id: 'fresh-demo', kind: 'showcase', cat: 'app', cat2: 'sys', visible: true, status: 'none', type: b('تطبيق موبايل', 'Mobile app'),
        title: b('FreshCart', 'FreshCart'),
        text: b('تطبيق توصيل بقالة: أقسام ومنتجات وسلة وموعد توصيل وتتبع الطلب. واجهة إنجليزية.', 'A grocery-delivery app: categories, products, basket, delivery slots and live order tracking. English interface.'),
        features: [b('أقسام ومنتجات بالصور والوحدات', 'Categories and products with units and imagery'), b('سلة برسوم توصيل مجاني فوق حد معين', 'Basket with free delivery above a threshold'), b('اختيار موعد التوصيل', 'Delivery slot selection'), b('تتبع حالة الطلب لحظياً', 'Live order tracking')],
        tech: 'React, Capacitor, Node.js, Firebase', demo: 'fresh', images: imgs('fresh-demo', 4)
      },
      {
        id: 'gym-demo', kind: 'showcase', cat: 'sys', visible: true, status: 'none', type: b('إدارة نادٍ رياضي', 'Gym management'),
        title: b('IronPulse Gym', 'IronPulse Gym'),
        text: b('نظام نادٍ رياضي: الأعضاء والاشتراكات، جدول الحصص والحجز، وتسجيل الدخول بالرقم مع التحقق من الاشتراك. واجهة إنجليزية.', 'A gym management system: members and memberships, class timetable with booking, and member check-in with instant membership validation. English interface.'),
        features: [b('أعضاء واشتراكات وتجديد بضغطة', 'Members, memberships and one-click renewals'), b('جدول حصص بحجز وقائمة انتظار', 'Class timetable with booking and waitlist'), b('تسجيل دخول بالرقم مع رفض الاشتراك المنتهي', 'Check-in by ID that denies expired memberships'), b('مؤشرات الحضور بالساعة والإيراد', 'Attendance-by-hour and revenue KPIs')],
        tech: 'React, Node.js, MySQL', demo: 'gym', images: imgs('gym-demo', 4)
      },

      /* ---- مواقع ---- */
      { id: 'site-nesr', kind: 'site', cat: 'web', visible: true, status: 'live', badge: X('pj.online'), type: b('عربي / إنجليزي', 'AR / EN'), title: X('w1.t'), text: X('w1.d'), features: [1, 2, 3, 4, 5].map((i) => X('w1.f' + i)), tech: 'Node.js, Express, EJS, JSON', link: 'https://nisrelkhaleeg.com', images: ['assets/img/projects/nesr-site-cover.jpg'] },
      { id: 'site-forsan', kind: 'site', cat: 'web', visible: true, status: 'live', badge: X('pj.online'), type: X('type.travel'), title: X('w2.t'), text: X('w2.d'), features: [1, 2, 3, 4].map((i) => X('w2.f' + i)), tech: 'Node.js, Express, EJS, JSON', link: 'https://forsango.com', images: ['assets/img/projects/forsan-go-cover.jpg'] },
      { id: 'site-rockline', kind: 'site', cat: 'web', visible: true, status: 'live', badge: X('pj.online'), type: X('type.cons'), title: X('w3.t'), text: X('w3.d'), features: [1, 2, 3].map((i) => X('w3.f' + i)), tech: 'Node.js, Express, EJS', link: 'https://rocklineg.com', images: ['assets/img/projects/rockline-cover.jpg'] },

      { id: 'site-eldahan', kind: 'site', cat: 'web', visible: true, status: 'live', badge: X('pj.online'), type: b('مطعم • طلب أونلاين', 'Restaurant • Online ordering'), title: b('موقع مطعم الدهان للمشويات', 'Eldahan Grills restaurant website'), text: b('موقع مطعم بمنيو كامل وطلب أونلاين: أقسام الأطباق والعروض بأسعارها، وسلة طلب، وتسجيل دخول للعملاء، وصفحة للفروع، بنسخة عربية وأخرى إنجليزية.', 'A restaurant website with a full menu and online ordering: dish categories and offers with prices, an order cart, customer login, a branches page, in Arabic and English.'), features: [b('منيو بأقسام (مشويات، فطائر، سندوتشات، جزارة، صواني)', 'Menu by category (grills, pastries, sandwiches, butcher, trays)'), b('عروض بأسعار قبل وبعد الخصم', 'Offers with before/after-discount prices'), b('سلة طلب وإضافة الأصناف بضغطة', 'Order cart with one-tap add'), b('نسخة عربية وإنجليزية', 'Arabic and English versions')], tech: '', link: 'https://www.eldahan.com/', images: ['assets/img/projects/eldahan-cover.jpg'] },
      { id: 'site-eldiwan', kind: 'site', cat: 'web', visible: true, status: 'live', badge: X('pj.online'), type: b('توظيف • إلحاق عمالة', 'Recruitment agency'), title: b('موقع الديوان للتوظيف بالخارج', 'Al Diwan overseas recruitment website'), text: b('موقع شركة توظيف وإلحاق عمالة بالخارج: تعريف بالشركة وخدماتها، وآراء العملاء وقائمة العملاء، وصفحة للوظائف، وبيانات التواصل، بتصميم داكن حديث وواجهة عربية RTL.', 'A recruitment-agency website: company and services overview, client testimonials and client list, a jobs page and contact details, in a modern dark design with an Arabic RTL interface.'), features: [b('صفحات من نحن والخدمات والوظائف', 'About, services and jobs pages'), b('آراء العملاء وقائمة العملاء', 'Testimonials and client list'), b('بيانات التواصل وزر تواصل مباشر', 'Contact details and a direct contact button')], tech: 'React, Vite', link: 'https://eldiwanjobs.com/', images: ['assets/img/projects/eldiwan-cover.jpg'] },

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
      { visible: true, date: b('يناير 2014 – حتى الآن', 'Jan 2014 – Present'), role: b('مهندس مستقل لأنظمة الأعمال والمواقع', 'Independent Business Systems & Websites Engineer'), org: b('عمل حر', 'Freelance'), bullets: [
        b('أصمّم وأبني أنظمة إدارة أعمال تعمل في عدة شركات ويعتمد عليها أكثر من 40 مستخدماً يومياً.', 'Design and build business management systems running in several companies that 40+ users rely on daily.'),
        b('أطوّر مواقع بلوحات تحكم كاملة وتطبيق أندرويد، وأتولى المشروع من تحليل الاحتياج حتى التشغيل.', 'Develop websites with full admin panels and an Android app, owning each project from requirements analysis to go-live.'),
        b('أصمّم للشركات والصفحات: أكثر من 150 تصميماً للإعلانات والمنشورات على Canva وPhotoshop، وأدير الصفحات والحملات الممولة.', 'Design for companies and pages: 150+ ad and post designs on Canva and Photoshop, and manage pages and paid campaigns.'),
        b('أنفّذ أعمال إدخال البيانات وتنظيم ملفات Excel وتحويل المستندات، ومواقع تعريفية وصفحات هبوط للشركات.', 'Deliver data entry, Excel organisation and document conversion, plus company brochure websites and landing pages.'),
        b('أشغّل الأنظمة على شبكات الشركات أو الاستضافة، وأدرّب الفرق، وأقدّم الدعم والتحديثات بعد التشغيل.', 'Deploy systems on company networks or hosting, train teams, and provide support and updates after launch.')
      ] },
      { visible: true, date: b('فبراير 2023 – حتى الآن', 'Feb 2023 – Present'), role: b('منسق العمليات والأنظمة', 'Operations & Systems Coordinator'), org: b('مكتب نسر الخليج لإلحاق العمالة المصرية بالخارج – الجيزة، مصر', 'Nesr El-Khaleej Overseas Recruitment Office – Giza, Egypt'), bullets: [
        b('صممتُ نظاماً مركزياً للملفات والحسابات حلّ محل ملفات Excel المتفرقة والسجلات الورقية، وصار النظام الأساسي الذي يعتمد عليه المكتب.', 'Designed a central system for files and accounts that replaced scattered Excel sheets and paper records and became the office’s core system.'),
        b('خفّضتُ وقت تسجيل الملف الواحد من عدة دقائق إلى ثوانٍ باستخدام استخراج البيانات من الصور (OCR) والإدخال السريع.', 'Cut the time to register a file from several minutes to seconds using OCR data extraction and fast entry.'),
        b('ابتكرتُ نظام ترقيم وأرشفة يربط كل ملف ورقي بسجله الإلكتروني، فتوقفت حالات فقد الجوازات تماماً.', 'Created a numbering-and-archiving system linking every paper file to its electronic record, which stopped passport losses entirely.'),
        b('أدير الدعم الفني لـ 9 أجهزة والشبكة المحلية والطابعات والماسحات والنسخ الاحتياطي.', 'Manage IT support for 9 devices, the local network, printers, scanners and backups.'),
        b('أتابع الإجراءات متعددة المراحل لآلاف الملفات (كشف طبي، بصمة، قنصلية، تأشيرة، سفر) مع الجهات الحكومية والشركاء.', 'Track multi-stage procedures for thousands of files (medical, fingerprint, consulate, visa, travel) with government bodies and partners.'),
        b('أصمم إعلانات الشركة وأدير صفحاتها وحملاتها الممولة على Meta Business Suite.', 'Design the company’s ads and manage its pages and paid campaigns on Meta Business Suite.')
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
      { icon: 'ai', highlight: true, title: b('الذكاء الاصطناعي والتطوير به', 'AI & AI-driven development'), items: [b('بناء أنظمة وتطبيقات ومواقع كاملة بالذكاء الاصطناعي، من الفكرة حتى التشغيل', 'Building complete systems, apps and websites with AI, from idea to launch'), b('قيادة وكلاء البرمجة (Claude Code): كتابة المواصفات ومراجعة الكود والاختبار', 'Directing AI coding agents (Claude Code): writing specs, reviewing code and testing'), b('دمج Gemini وClaude وOpenAI داخل الأنظمة', 'Embedding Gemini, Claude and OpenAI inside business systems'), b('تحليل السير الذاتية ومطابقة المرشحين بالوظائف', 'CV parsing and candidate–job matching'), b('استخراج البيانات من الجوازات والمستندات بالـOCR والذكاء الاصطناعي', 'Data extraction from passports and documents with OCR and AI'), b('أتمتة الإجراءات اليدوية وتحويلها إلى حلول ذكية', 'Automating manual procedures into smart workflows'), b('هندسة التعليمات (Prompt Engineering) وضبط المخرجات', 'Prompt engineering and output tuning'), b('ضمان جودة كود الذكاء الاصطناعي: اختبارات آلية (Playwright) وأمان وصلاحيات', 'Quality-assuring AI-written code: automated tests (Playwright), security and permissions'), b('ChatGPT وClaude وGemini في العمل اليومي: بحث وكتابة وتحليل وتصميم', 'ChatGPT, Claude and Gemini in daily work: research, writing, analysis and design'), b('إدارة مفاتيح الذكاء الاصطناعي وحدود الاستهلاك والتكلفة', 'Managing AI keys, usage limits and cost')] },
      { icon: 'code', highlight: true, title: b('تطوير الويب والأنظمة', 'Web & systems development'), items: ['React', 'TypeScript', 'JavaScript', 'Node.js', 'Express', 'REST APIs', 'HTML / CSS', 'Tailwind CSS', 'EJS', 'Vite', 'Socket.IO', b('لوحات تحكم وأنظمة صلاحيات', 'Admin panels & permission systems')] },
      { icon: 'db', highlight: true, title: b('قواعد البيانات والنشر', 'Databases & deployment'), items: ['MySQL', 'SQL Server', 'IndexedDB', 'Firebase Auth', 'Cloudflare Pages + D1', 'Hostinger', 'Git', b('نقل البيانات بين قواعد مختلفة', 'Cross-database data migration'), b('نسخ احتياطي واستعادة', 'Backup & restore')] },
      { icon: 'db', title: b('الأتمتة واستخراج البيانات', 'Automation & data extraction'), items: ['OCR', b('استخراج البيانات من الجوازات والمستندات', 'Data extraction from passports and documents'), b('تحويل الإجراءات اليدوية وملفات Excel إلى قاعدة بيانات', 'Turning manual procedures and Excel files into a database'), b('أدوات الذكاء الاصطناعي في العمل اليومي', 'AI tools in daily work')] },
      { icon: 'phone', title: b('تطبيقات الموبايل', 'Mobile apps'), items: ['Capacitor', 'Android', b('الإشعارات', 'Push notifications'), b('العمل بدون إنترنت والمزامنة', 'Offline & sync')] },
      { icon: 'shield', title: b('الأمان', 'Security'), items: [b('التحقق الثنائي (2FA)', 'Two-factor authentication'), b('صلاحيات تفصيلية', 'Granular permissions'), b('سجل العمليات', 'Audit log'), b('تشفير كلمات المرور والبيانات', 'Password & data encryption'), b('موافقة الأجهزة الجديدة', 'New-device approval')] },
      { icon: 'support', title: b('الدعم الفني والشبكات', 'IT support & networks'), items: ['Windows 10 / 11', b('تثبيت وتهيئة الأنظمة والبرامج', 'OS & software setup'), b('حل أعطال الأجهزة', 'Hardware troubleshooting'), b('الشبكات المحلية (LAN) والواي فاي', 'LAN & Wi-Fi'), b('إعداد الراوتر والسويتش', 'Router & switch setup'), b('IP ثابت و Port Forwarding', 'Static IP & port forwarding'), b('الجدار الناري', 'Firewall'), b('الطابعات والماسحات', 'Printers & scanners'), b('الوصول عن بُعد', 'Remote access'), b('النسخ الاحتياطي والاستعادة', 'Backup & recovery')] },
      { icon: 'table', title: b('البيانات وExcel والمكتب', 'Data, Excel & Office'), items: ['Excel', b('المعادلات والجداول المحورية', 'Formulas & pivot tables'), b('لوحات متابعة في Excel', 'Excel tracking dashboards'), 'Google Sheets', 'Word', 'PowerPoint', b('إدخال البيانات ومراجعتها', 'Data entry & verification'), b('تنظيف البيانات وتوحيد الصيغ', 'Data cleaning & standardisation'), b('تحويل PDF والصور إلى Word / Excel', 'PDF/image to Word/Excel conversion'), b('الأرشفة الإلكترونية والورقية', 'Digital & paper archiving'), b('إعداد التقارير', 'Report preparation')] },
      { icon: 'ops', title: b('التشغيل الإداري وتحليل الأعمال', 'Operations & business analysis'), items: [b('تحليل الاحتياج', 'Requirements analysis'), b('رسم سير الإجراءات', 'Workflow mapping'), b('متابعة الإجراءات متعددة المراحل', 'Multi-stage procedure follow-up'), b('التنسيق مع الجهات الخارجية', 'External-party coordination'), b('تشغيل الأنظمة', 'System rollout'), b('نقل البيانات من Excel', 'Migrating data from Excel'), b('تدريب المستخدمين', 'User training'), b('إعداد الأدلة والتوثيق', 'Guides & documentation'), b('عرض الأنظمة والبيع', 'System demos & selling')] },
      { icon: 'palette', title: b('التصميم والتسويق', 'Design & marketing'), items: ['Canva', 'Photoshop', 'Meta Business Suite', b('إدارة الصفحات', 'Page management'), b('الإعلانات الممولة', 'Paid campaigns'), b('تصميم الإعلانات والمنشورات (+150 تصميماً)', 'Ad & post design (150+ designs)'), b('تصميم مواقع تعريفية وصفحات هبوط', 'Brochure sites & landing pages')] },
      { icon: 'shield', highlight: true, title: b('هندسة الجودة والأمان', 'Engineering quality & security'), items: [b('تصميم واجهات REST APIs', 'RESTful API design'), b('أنظمة الصلاحيات (RBAC)', 'Role-based access control (RBAC)'), b('سجل العمليات (Audit log)', 'Audit logging'), b('اختبارات آلية (Playwright)', 'Automated testing (Playwright)'), b('نقل ومطابقة البيانات (SQL Server إلى MySQL)', 'Data migration & reconciliation (SQL Server → MySQL)'), b('ميزات لحظية (Socket.IO)', 'Real-time features (Socket.IO)'), b('تقارير Excel وPDF، وباركود وQR', 'Excel & PDF reports, barcode & QR'), b('واجهات ثنائية اللغة ودعم RTL', 'Bilingual (Arabic/English) & RTL interfaces'), b('تحسين الأداء والتخزين المؤقت', 'Performance & caching (IndexedDB)'), b('تصميم متجاوب للموبايل', 'Responsive, mobile-first design'), b('أساسيات تحسين محركات البحث', 'On-page SEO fundamentals')] },
      { icon: 'users', highlight: true, title: b('التنفيذ مع العملاء', 'Client delivery'), items: [b('جلسات تحليل الاحتياج', 'Requirements workshops'), b('عرض تجريبي في كل مرحلة', 'Milestone demos'), b('التواصل مع العملاء بالعربي والإنجليزي', 'Client communication in Arabic & English'), b('التوثيق وأدلة المستخدم', 'Documentation & user guides'), b('تدريب فرق العميل', 'Client team training'), b('العمل عن بُعد مع عملاء في مصر والخليج', 'Remote work with clients in Egypt & the Gulf'), b('إدارة المشاريع باستقلالية', 'Independent project management')] },
      { icon: 'users', title: b('مهارات شخصية', 'Professional strengths'), items: [b('العمل الحر وإدارة المشاريع باستقلالية', 'Independent freelance project management'), b('الالتزام بالمواعيد', 'Meeting deadlines'), b('العمل تحت ضغط وفي ورديات', 'Working under pressure & in shifts'), b('التواصل مع العملاء', 'Client communication'), b('التعلّم السريع', 'Fast learning'), b('الدقة والاهتمام بالتفاصيل', 'Accuracy & attention to detail'), b('العربية (لغة أم) والإنجليزية', 'Arabic (native) & English')] }
    ]
  },

  reviews: {
    showWhenEmpty: true,
    kicker: b('آراء العملاء', 'Client reviews'),
    title: b('ماذا يقول من تعاملوا معي', 'What people who worked with me say'),
    sub: b('كل تقييم يُراجَع قبل نشره، ويُعلَّم بعلامة ✓ عندما أتأكد أنه من عميل فعلي.', 'Every review is checked before it is published, and marked with ✓ once I confirm it comes from a real client.'),
    formTitle: b('قيّم تجربتك معي', 'Rate your experience with me'),
    emptyText: b('لا توجد تقييمات منشورة بعد. كن أول من يقيّم تجربته.', 'No published reviews yet. Be the first to rate your experience.'),
    thanks: b('شكراً لك! وصلني تقييمك وسيظهر بعد المراجعة.', 'Thank you! Your review was received and will appear after it is reviewed.')
  },

  contact: {
    kicker: b('التواصل', 'Contact'),
    title: b('لنبدأ مشروعك', 'Let’s start your project'),
    sub: b('لديك فكرة نظام أو موقع أو تطبيق، أو تحتاج تصميماً أو دعماً فنياً؟ تواصل معي واحصل على ديمو مباشر لأحد الأنظمة وعرض واضح لما سننفّذه.', 'Have an idea for a system, website or app, or need design or technical support? Reach out and get a live demo of one of my systems and a clear proposal of what we will build.'),
    formTitle: b('أرسل رسالتك', 'Send your message'),
    topics: [b('نظام أو موقع أو تطبيق', 'System, website or app'), b('تصميم سوشيال ميديا', 'Social-media design'), b('دعم فني أو تشغيل', 'IT support or operations'), b('ديمو مباشر لأحد الأنظمة', 'Live demo of a system'), b('تعاون أو شراكة', 'Collaboration or partnership'), b('موضوع آخر', 'Something else')]
  },

  custom: [
    {
      id: 'packages', layout: 'cards', alt: false, kicker: b('باقات الخدمات', 'Service packages'), title: b('أنفّذ لك بنطاق واضح من البداية', 'Clear scope from day one'), sub: b('اختر ما يناسبك، وأرسل لي احتياجك لأرسل لك عرضاً محدداً بالنطاق والمراحل.', 'Pick what fits, tell me what you need, and I will send a specific proposal with scope and milestones.'),
      cards: [
        { icon: 'web', title: b('موقع الشركة', 'Business website'), text: b('موقع سريع بالعربية والإنجليزية ومتجاوب مع الموبايل، بلوحة تحكم تعدّل منها كل شيء بنفسك، وتحسين أساسي لمحركات البحث.', 'A fast, bilingual, mobile-friendly website with an admin panel to edit everything yourself, plus on-page SEO fundamentals.'), link: 'https://wa.me/201552084471?text=Hi Ahmed, I would like a quote for a business website.', linkLabel: b('اطلب عرض سعر', 'Request a quote') },
        { icon: 'sys', title: b('نظام إدارة مخصص', 'Custom management system'), text: b('نظام للعمليات أو الحسابات أو المخازن أو الموارد البشرية على قياس شغلك، بصلاحيات وتقارير ونسخ احتياطي وتدريب لفريقك.', 'An operations, accounting, inventory or HR system built around your workflow, with roles, reports, backups and training for your team.'), link: 'https://wa.me/201552084471?text=Hi Ahmed, I would like a quote for a custom management system.', linkLabel: b('اطلب عرض سعر', 'Request a quote') },
        { icon: 'table', title: b('أتمتة Excel ولوحات المتابعة', 'Excel automation & dashboards'), text: b('ملفات منظمة وتقارير تلقائية ولوحات متابعة تفهمها الإدارة، وتحويل المستندات والصور إلى بيانات قابلة للاستخدام.', 'Clean, structured spreadsheets, automated reports and dashboards your management can read, plus conversion of documents and images into usable data.'), link: 'https://wa.me/201552084471?text=Hi Ahmed, I would like a quote for Excel automation and dashboards.', linkLabel: b('اطلب عرض سعر', 'Request a quote') },
        { icon: 'palette', title: b('باقة تصميم السوشيال ميديا', 'Social media design pack'), text: b('إعلانات ومنشورات جاهزة للنشر على Canva وPhotoshop، مع إدارة الصفحات والحملات الممولة على Meta.', 'Ready-to-post ads and content on Canva and Photoshop, with page and paid-campaign management on Meta.'), link: 'https://wa.me/201552084471?text=Hi Ahmed, I would like a quote for a social media design pack.', linkLabel: b('اطلب عرض سعر', 'Request a quote') }
      ]
    },
    {
      id: 'faq', layout: 'text', alt: true, kicker: b('أسئلة شائعة', 'FAQ'), title: b('قبل أن نبدأ', 'Before we start'), sub: b('', ''),
      body: b('**هل تعمل مع عملاء من خارج مصر؟**\nنعم. أعمل عن بُعد، وأتواصل بالعربية والإنجليزية، وأسلّم الواجهات بأي من اللغتين.\n\n**هل أستطيع رؤية نموذج قبل أن أقرر؟**\nنعم. جرّب العروض التفاعلية في هذه الصفحة، أو اطلب جولة مباشرة على واتساب.\n\n**ماذا يحدث بعد التسليم؟**\nأدرّب فريقك وأظل متاحاً للدعم والتحديثات والنسخ الاحتياطي.\n\n**كيف نبدأ؟**\nأرسل لي ما تحتاجه، فأحدد معك النطاق والمراحل وأعرض عليك نموذجاً مشابهاً قبل التنفيذ.',
        '**Do you work with clients outside Egypt?**\nYes. I work remotely, communicate in Arabic and English, and deliver interfaces in either language.\n\n**Can I see an example before I decide?**\nYes. Try the interactive demos on this page, or ask for a live walkthrough on WhatsApp.\n\n**What happens after delivery?**\nI train your team and stay available for support, updates and backups.\n\n**How do we start?**\nMessage me what you need; we will define the scope and milestones together, and I will show you a similar example before we build.'),
      cards: [], images: []
    }
  ]
};

// روابط واتساب في بطاقات الباقات: ترميز نص الرسالة
for (const c of content.custom) for (const k of (c.cards || [])) if (k.link && k.link.includes('?text=')) { const i = k.link.indexOf('?text='); k.link = k.link.slice(0, i) + '?text=' + encodeURIComponent(k.link.slice(i + 6)); }
// ترتيب النماذج: أول 6 (اللي بتظهر قبل «عرض الكل») تمزج العربي والإنجليزي والتطبيقات
{ const first = ['pos-demo', 'crm-demo', 'invoices-demo', 'stay-demo', 'resto-demo', 'pulse-demo']; const it = content.projects.items; const rank = (p) => { const i = first.indexOf(p.id); return i < 0 ? 99 : i; };
  const sc = it.filter((p) => p.kind === 'showcase').sort((x, y) => rank(x) - rank(y)); let k = 0; content.projects.items = it.map((p) => p.kind === 'showcase' ? sc[k++] : p); }
fs.mkdirSync(path.join(__dirname, '..', 'seed'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '..', 'seed', 'content.json'), JSON.stringify(content, null, 2));
console.log('seed ok —', content.projects.items.length, 'مشروع،', content.skills.groups.length, 'مجموعة مهارات');
