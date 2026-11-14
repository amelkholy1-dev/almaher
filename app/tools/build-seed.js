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
  _v: 18,
  settings: {
    siteUrl: '',
    name: b('أحمد ماهر الخولي', 'Ahmed Maher Alkholy'),
    brand: b('أحمد الخولي', 'Ahmed Alkholy'),
    initials: 'AK',
    hello: b('مرحباً، أنا', 'Hello, I am'),
    role: b('هندسة برمجيات · تطوير أنظمة · دعم فني وشبكات', 'Software Engineering · Systems Development · IT Support & Networking'),
    headline: b('**مهندس برمجيات** وتطوير أنظمة', '**Software engineer** & systems developer'),
    tagline: b('أحوّل احتياج شغلك إلى أنظمة تعمل من اليوم الأول.', 'I turn your business needs into systems that work from day one.'),
    lead: b('أنا أحمد الخولي، أبني للشركات أنظمة ومواقع وتطبيقات سريعة وآمنة وسهلة الاستخدام، وأربط فهم الشغل بالتنفيذ والتشغيل والدعم من أول اجتماع.',
      'I am Ahmed Alkholy. I build fast, secure and easy-to-use systems, websites and apps for companies, linking a real understanding of the business to delivery, deployment and support from the very first meeting.'),
    availLabel: b('', ''),
    modes: [],
    location: b('الجيزة، مصر — أخدم عملاء في مصر والخليج وعن بُعد', 'Giza, Egypt — serving clients in Egypt, the Gulf and remotely'),
    heroChips: [{ icon: 'code', text: b('أنظمة • مواقع • تطبيقات', 'Systems • Websites • Apps') }, { icon: 'support', text: b('دعم فني وشبكات', 'IT Support & Networking') }, { icon: 'cal', text: b('فري لانسر منذ 2014', 'Freelancer since 2014') }],
    email: 'am.elkholy1@gmail.com',
    whatsapp: '201552084471',
    linkedin: 'https://www.linkedin.com/in/ahmed-alkholy',
    github: '',
    photo: 'assets/img/ahmed-alkholy.jpg',
    ogImage: 'assets/img/og-image-v3.jpg',
    skin: 'midnight',
    skinPicker: true,
    showCv: false,
    showCvAr: true,
    showCvEn: true,
    cv: { ar: 'assets/cv/Ahmed-Alkholy-CV-AR.pdf', en: 'assets/cv/Ahmed-Alkholy-CV-EN.pdf' },
    seo: {
      title: b('أحمد ماهر الخولي | مهندس برمجيات وتطوير أنظمة', 'Ahmed Maher Alkholy | Software Engineer & Systems Developer'),
      description: b('مهندس برمجيات وتطوير أنظمة، فري لانسر منذ 2014: أنظمة ومواقع وتطبيقات تعمل داخل الشركات، ودعم فني وشبكات. الجيزة، مصر.', 'Software engineer and systems developer, freelancer since 2014: systems, websites and apps that run inside companies, plus IT support and networking. Giza, Egypt.')
    },
    demoNotice: b('عرض توضيحي تفاعلي ببيانات تجريبية – النظام الكامل متاح عند الطلب', 'Interactive demo with sample data – the full system is available on request'),
    demoNoticeSample: b('عرض تفاعلي ببيانات تجريبية بالكامل – يمكن تنفيذ نظام مماثل حسب احتياجك', 'Interactive demo with fully sample data – a similar system can be built around your needs'),
    waMessages: {
      general: b('مرحباً أحمد، وصلت إليك من موقعك الشخصي وأودّ التواصل معك.', 'Hi Ahmed, I found you through your website and would like to get in touch.'),
      project: b('مرحباً أحمد، شاهدت «{name}» على موقعك، وأرغب في ديمو مباشر ومعرفة المزيد.', 'Hi Ahmed, I saw “{name}” on your website and would like a live demo and more details.')
    },
    footer: b('مهندس برمجيات وتطوير أنظمة • فري لانسر منذ 2014', 'Software Engineer & Systems Developer • Freelancer since 2014')
  },

  stats: [
    { value: b('قرابة 7', 'Nearly 7'), label: b('سنوات خبرة عملية', 'years of hands-on experience') },
    { value: b('36', '36'), label: b('أنظمة ومشاريع منفّذة', 'systems & projects delivered') },
    { value: b('+70', '70+'), label: b('مستخدم يعتمدون على أنظمتي يومياً', 'users relying on my systems daily') },
    { value: b('+150', '150+'), label: b('تصميم لشركات وصفحات', 'designs for companies & pages') }
  ],

  layout: {
    sections: [
      { id: 'stats', visible: true, nav: false, label: b('أرقام سريعة', 'Quick facts') },
      { id: 'c:why', visible: true, nav: false, label: b('لماذا أنا', 'Why me') },
      { id: 'about', visible: true, nav: true, label: b('من أنا', 'About'), navLabel: b('من أنا', 'About') },
      { id: 'services', visible: true, nav: true, label: b('الخدمات', 'Services'), navLabel: b('الخدمات', 'Services') },
      { id: 'skills', visible: true, nav: false, label: b('التقنيات', 'Tech stack') },
      { id: 'process', visible: true, nav: false, label: b('طريقة العمل', 'How I work') },
      { id: 'projects', visible: true, nav: true, label: b('الأعمال', 'Work'), navLabel: b('الأعمال', 'Work') },
      { id: 'experience', visible: true, nav: true, label: b('الخبرة', 'Experience'), navLabel: b('الخبرة', 'Experience') },
      { id: 'reviews', visible: true, nav: false, label: b('آراء العملاء', 'Reviews') },
      { id: 'c:faq', visible: true, nav: false, label: b('أسئلة قبل ما نبدأ', 'Questions before we start') },
      { id: 'c:packages', visible: false, nav: false, label: b('باقات الخدمات', 'Service packages') },
      { id: 'contact', visible: true, nav: true, label: b('التواصل', 'Contact'), navLabel: b('تواصل معي', 'Contact') }
    ]
  },

  about: {
    kicker: b('من أنا', 'About me'),
    title: b('مهندس يفهم شغلك قبل ما يكتب أول سطر كود.', 'An engineer who understands your business before writing the first line of code.'),
    paragraphs: [
      b('منذ فبراير 2023 أتولى العمليات والأنظمة في مكتب لإلحاق العمالة المصرية بالخارج، وهناك صممتُ النظام المركزي الذي حلّ محل Excel والورق وأشغّله يومياً: انخفض وقت تسجيل الملف من دقائق إلى ثوانٍ، وتوقفت حالات فقد الجوازات.',
        'Since February 2023 I have run operations and systems at an Egyptian overseas-recruitment office, where I designed and run the central system that replaced Excel and paper: file registration dropped from minutes to seconds and passport losses stopped.'),
      b('وبالتوازي أعمل فري لانسر منذ يناير 2014، وأبني أنظمة إدارة أعمال ومواقع بلوحات تحكم وتطبيق أندرويد، ويعتمد على أنظمتي أكثر من 70 مستخدماً كل يوم.',
        'In parallel I have freelanced since January 2014, building business management systems, websites with admin panels and an Android app, with 70+ users relying on my systems every day.'),
      b('نظام يُدار فعلاً كل يوم أهم من نظام يُعرض فقط.', 'A system that is actually run every day matters more than one that is only shown.')
    ],
    highlightLast: true,
    facts: [
      { icon: 'cal', title: b('الخبرة', 'Experience'), text: b('قرابة 7 سنوات • فري لانسر منذ يناير 2014', 'Nearly 7 years • Freelancer since January 2014') },
      { icon: 'pin', title: b('المكان', 'Location'), text: b('الجيزة، مصر — أخدم عملاء في مصر والخليج وعن بُعد', 'Giza, Egypt — serving clients in Egypt, the Gulf and remotely') },
      { icon: 'lang', title: b('اللغات', 'Languages'), text: b('العربية والإنجليزية', 'Arabic and English') }
    ]
  },

  process: {
    kicker: b('طريقة العمل', 'How I work'),
    title: b('خطوات واضحة، وقرارات مشروحة، وتسليم على مراحل.', 'Clear steps, explained decisions, staged delivery.'),
    sub: b('', ''),
    steps: [
      { title: b('نفهم شغلك', 'We understand your business'), text: b('أجلس مع أصحاب الشغل والموظفين، وأفهم الإجراءات الحالية ومشاكلها قبل رسم أي حل.', 'I sit with owners and staff and understand the current procedures and pain points before drawing any solution.') },
      { title: b('نصمم الحل', 'We design the solution'), text: b('أحدد الشاشات والمراحل والصلاحيات والتقارير، ويعتمدها العميل قبل التنفيذ.', 'I define screens, stages, permissions and reports, and the client signs off before building.') },
      { title: b('نبني ونجرّب', 'We build and test'), text: b('أسلّم على مراحل، وأعرض كل مرحلة وتجرّبها بنفسك، وأختبر على بيانات تجريبية قبل أي نقل.', 'I deliver in stages, demo each one so you can try it, and test on sample data before any migration.') },
      { title: b('نشغّل وندعم', 'We launch and support'), text: b('أشغّل النظام على شبكتك أو الاستضافة، وأدرّب فريقك، وأتابع معاك بعد التشغيل بتعديلات ونسخ احتياطي.', 'I deploy on your network or hosting, train your team, and follow up after launch with changes and backups.') }
    ]
  },

  services: {
    kicker: b('الخدمات', 'Services'),
    title: b('حلول تقنية تبدأ من هدف شغلك، وتنتهي بنتيجة تعمل.', 'Technical solutions that start from your business goal and end in something that works.'),
    sub: b('', ''),
    items: [
      { icon: 'sys', title: b('أنظمة إدارة الأعمال', 'Business management systems'), text: b('نظام على قياس شركتك: ملفات وعملاء وحسابات وموارد بشرية، بصلاحيات دقيقة وتقارير وتصدير Excel وPDF ونسخ احتياطي. يتركّب على شبكتك أو على استضافة.', 'A system built around your company: files, clients, accounts and HR, with precise permissions, reports, Excel/PDF export and backups. Installed on your network or on hosting.'), tags: ['React', 'Node.js', 'MySQL'], goldFirst: true },
      { icon: 'web', title: b('مواقع بلوحات تحكم', 'Websites with admin panels'), text: b('موقع عربي وإنجليزي سريع ومتجاوب مع الموبايل، تعدّل محتواه بنفسك من لوحة تحكم كاملة، مع أساسيات SEO ومعاينة روابط واتساب.', 'A fast, mobile-friendly Arabic/English website you edit yourself from a full admin panel, with SEO basics and WhatsApp link previews.'), tags: ['Node.js', 'Express', 'SEO'], goldFirst: false },
      { icon: 'phone', title: b('تطبيقات موبايل', 'Mobile apps'), text: b('تطبيق أندرويد بواجهة عربية حديثة، يعمل بدون إنترنت ويتزامن تلقائياً، مع إشعارات وتسجيل دخول آمن.', 'An Android app with a modern interface that works offline and syncs automatically, with notifications and secure sign-in.'), tags: ['Capacitor', 'Firebase', 'Offline-first'], goldFirst: false },
      { icon: 'support', title: b('دعم فني وشبكات', 'IT support & networking'), text: b('تجهيز الأجهزة والشبكة المحلية والراوتر والطابعات والنسخ الاحتياطي والوصول عن بُعد، ومتابعة بعد التشغيل.', 'Preparing devices, the local network, router, printers, backups and remote access, with follow-up after launch.'), tags: ['LAN', 'Windows', 'Backup'], goldFirst: false }
    ]
  },

  projects: {
    kicker: b('الأعمال', 'Work'),
    title: b('من مشكلة في الشغل إلى نظام يعمل', 'From a problem at work to a system that runs'),
    sub: b('أنظمة ومواقع وتطبيقات نفّذتها. اضغط على أي عمل لتشوف التفاصيل أو تجرّب العرض التفاعلي.', 'Systems, websites and apps I built. Click any piece to see the details or try the interactive demo.'),
    visibleCount: '6',
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

      { id: 'site-rawajai', kind: 'site', cat: 'sys', visible: true, status: 'live', badge: X('pj.online'), type: b('منصة تجارة إلكترونية', 'E-commerce platform'), title: b('رواج', 'Rawaj'), text: b('منصة لإدارة التجارة الإلكترونية: المنتجات والقنوات والإعلانات والطلبات والفريق في مكان واحد، مع مساعد ذكاء اصطناعي يجهّز خطة اليوم.', 'A digital-commerce platform: products, channels, ads, orders and your team in one place, with an AI assistant that drafts the day’s plan.'), features: [], tech: '', link: 'https://rawajai.com/en/', images: ['assets/img/projects/w-rawajai.jpg'] },
      { id: 'site-daffaherp', kind: 'site', cat: 'sys', visible: true, status: 'live', badge: X('pj.online'), type: b('نظام ERP سحابي', 'Cloud ERP'), title: b('دفّة ERP', 'Daffa ERP'), text: b('نظام سحابي للمبيعات ونقاط البيع والمخزون والمحاسبة والرواتب والزكاة.', 'A cloud system for sales, point of sale, inventory, accounting, payroll and zakat.'), features: [], tech: '', link: 'https://daffaherp.com/', images: ['assets/img/projects/w-daffaherp.jpg'] },
      { id: 'site-mahalat', kind: 'site', cat: 'sys', visible: true, status: 'live', badge: X('pj.online'), type: b('لوحة تحكم', 'Admin dashboard'), title: b('محلات — لوحة التحكم', 'Mahalat — admin dashboard'), text: b('نظام إدارة المنتجات والطلبات والعملاء لمنصة محلات.', 'A system for managing products, orders and customers for the Mahalat platform.'), features: [], tech: '', link: 'https://mahalat.net/', images: ['assets/img/projects/w-mahalat.jpg'] },
      { id: 'site-kartly', kind: 'site', cat: 'sys', visible: true, status: 'live', badge: X('pj.online'), type: b('أتمتة تسويق', 'Marketing automation'), title: b('كارتلي', 'Kartly'), text: b('أتمتة تسويق لمتاجر سلة: رسائل واتساب تلقائية تسترد السلات المتروكة وتؤكد طلبات الدفع عند الاستلام.', 'Marketing automation for Salla stores: automatic WhatsApp messages that recover abandoned carts and confirm cash-on-delivery orders.'), features: [], tech: '', link: 'https://kartly.io/', images: ['assets/img/projects/w-kartly.jpg'] },
      { id: 'site-ugcmena', kind: 'site', cat: 'sys', visible: true, status: 'live', badge: X('pj.online'), type: b('منصة حملات', 'Campaign platform'), title: b('UGC MENA', 'UGC MENA'), text: b('منصة حملات فيديو بصُنّاع محتوى في الشرق الأوسط: توجيه البريف ومراجعة كل نسخة في مكان واحد.', 'A video-campaign platform with creators across the Middle East: route the brief and review every version in one place.'), features: [], tech: '', link: 'https://ugcmena.com/ar/', images: ['assets/img/projects/w-ugcmena.jpg'] },
      { id: 'site-nahj', kind: 'site', cat: 'sys', visible: true, status: 'live', badge: X('pj.online'), type: b('منصة تدريب', 'Training platform'), title: b('خبرات — إدارة التدريب', 'Khobrat — training management'), text: b('منصة لإدارة الدورات والمتدربين والمدربين: التسجيل والدفع والدروس والاختبارات والحضور والشهادات.', 'A platform for managing courses, trainees and trainers: registration, payment, lessons, tests, attendance and certificates.'), features: [], tech: '', link: 'https://edu.nahj.org.sa/', images: ['assets/img/projects/w-nahj.jpg'] },
      { id: 'site-trinavo', kind: 'site', cat: 'web', visible: true, status: 'live', badge: X('pj.online'), type: b('منصة متاجر', 'Store platform'), title: b('ترينافو', 'Trinavo'), text: b('منصة تجارة إلكترونية متكاملة لبدء المتجر وتشغيله وتطويره.', 'An all-in-one e-commerce platform to launch, run and grow an online store.'), features: [], tech: '', link: 'https://trinavo.com/', images: ['assets/img/projects/w-trinavo.jpg'] },
      { id: 'site-almnssa', kind: 'site', cat: 'web', visible: true, status: 'live', badge: X('pj.online'), type: b('منصة متاجر', 'Store platform'), title: b('المنصة العربية', 'Arab platform'), text: b('منصة لإنشاء المتاجر الإلكترونية والمواقع بخطوة واحدة.', 'A platform for creating online stores and websites in one step.'), features: [], tech: '', link: 'https://almnssa.com/', images: ['assets/img/projects/w-almnssa.jpg'] },
      { id: 'site-manar', kind: 'site', cat: 'web', visible: true, status: 'live', badge: X('pj.online'), type: b('متجر إلكتروني', 'Online store'), title: b('متجر منار', 'Manar store'), text: b('متجر إلكتروني للملابس الداخلية القطنية والثيرمال للعائلة في السعودية.', 'An online store for cotton underwear and thermal wear for the whole family in Saudi Arabia.'), features: [], tech: '', link: 'https://manar.sa/', images: ['assets/img/projects/w-manar.jpg'] },
      { id: 'site-zayenha', kind: 'site', cat: 'web', visible: true, status: 'live', badge: X('pj.online'), type: b('بوابة منصات', 'Platforms portal'), title: b('زيّنها هب', 'Zayenha Hub'), text: b('بوابة تجمع منصات وتطبيقات ذكية للعالم العربي بحساب موحّد ونقاط ومزايا مشتركة.', 'A portal bringing smart platforms and apps for the Arab world together, with one account, shared points and perks.'), features: [], tech: '', link: 'https://zayenha.com/', images: ['assets/img/projects/w-zayenha.jpg'] },
      { id: 'site-nabraas', kind: 'site', cat: 'web', visible: true, status: 'live', badge: X('pj.online'), type: b('منصة تعليمية', 'Learning platform'), title: b('منصة نبراس', 'Nabraas platform'), text: b('منصة تعليمية بدورات مجانية وشهادات معتمدة.', 'A learning platform with free courses and accredited certificates.'), features: [], tech: '', link: 'https://nabraas.com/', images: ['assets/img/projects/w-nabraas.jpg'] },
      { id: 'site-h2academy', kind: 'site', cat: 'web', visible: true, status: 'live', badge: X('pj.online'), type: b('منصة تعليمية', 'Learning platform'), title: b('H2 Academy', 'H2 Academy'), text: b('منصة أكاديمية عربية للتعلم عبر الإنترنت بكورسات عملية.', 'An Arabic online-learning academy with practical courses.'), features: [], tech: '', link: 'https://students.theh2academy.com/', images: ['assets/img/projects/w-h2academy.jpg'] },
      { id: 'site-alhub', kind: 'site', cat: 'web', visible: true, status: 'live', badge: X('pj.online'), type: b('منصة تعليمية', 'Learning platform'), title: b('Alhub', 'Alhub'), text: b('منصة تعليمية سعودية عربية لبرامج تفاعلية ومكتبات رقمية.', 'A Saudi Arabic learning platform with interactive programs and digital libraries.'), features: [], tech: '', link: 'https://alhub.sa/', images: ['assets/img/projects/w-alhub.jpg'] },
      { id: 'site-wasitplus', kind: 'site', cat: 'web', visible: true, status: 'live', badge: X('pj.online'), type: b('منصة ويب', 'Web platform'), title: b('Wasit Plus', 'Wasit Plus'), text: b('منصة ويب بواجهة إنجليزية حديثة.', 'A web platform with a modern English interface.'), features: [], tech: '', link: 'https://km.wasitplus.com/', images: ['assets/img/projects/w-wasitplus.jpg'] },

      /* ---- أخرى ---- */
      { id: 'commission', kind: 'mini', cat: 'web', visible: true, status: 'none', icon: 'share', title: X('cm.t'), text: X('cm.d'), images: [] },
      { id: 'store', kind: 'mini', cat: 'web', visible: true, status: 'none', icon: 'cart', title: X('sh.t'), text: X('sh.d'), images: [] },
      { id: 'excel-sample', kind: 'mini', cat: 'other', visible: false, status: 'none', icon: 'table', title: X('xl.t'), text: X('xl.d'), images: [], file: '', fileLabel: X('xl.btn') },
      { id: 'designs', kind: 'mini', cat: 'other', visible: false, status: 'none', icon: 'palette', title: X('ds.t'), text: X('ds.d'), images: [] }
    ]
  },

  experience: {
    kicker: b('الخبرة', 'Experience'),
    title: b('خبرة عملية في بناء الأنظمة وتشغيلها', 'Hands-on experience building and running systems'),
    items: [
      { visible: true, date: b('فبراير 2023 – حتى الآن', 'Feb 2023 – Present'), role: b('منسق العمليات والأنظمة', 'Operations & Systems Coordinator'), org: b('مكتب نسر الخليج لإلحاق العمالة المصرية بالخارج – الجيزة، مصر', 'Nesr El-Khaleej Overseas Recruitment Office – Giza, Egypt'), bullets: [
        b('صممتُ نظاماً مركزياً للملفات والحسابات حلّ محل ملفات Excel المتفرقة والسجلات الورقية، وصار النظام الأساسي الذي يعتمد عليه المكتب.', 'Designed a central system for files and accounts that replaced scattered Excel sheets and paper records and became the office’s core system.'),
        b('خفّضتُ وقت تسجيل الملف الواحد من عدة دقائق إلى ثوانٍ باستخدام استخراج البيانات من الصور (OCR) والإدخال السريع.', 'Cut the time to register a file from several minutes to seconds using OCR data extraction and fast entry.'),
        b('ابتكرتُ نظام ترقيم وأرشفة يربط كل ملف ورقي بسجله الإلكتروني، فتوقفت حالات فقد الجوازات تماماً.', 'Created a numbering-and-archiving system linking every paper file to its electronic record, which stopped passport losses entirely.'),
        b('أدير الدعم الفني لـ 9 أجهزة والشبكة المحلية والطابعات والماسحات والنسخ الاحتياطي.', 'Manage IT support for 9 devices, the local network, printers, scanners and backups.'),
        b('أتابع الإجراءات متعددة المراحل لآلاف الملفات (كشف طبي، بصمة، قنصلية، تأشيرة، سفر) مع الجهات الحكومية والشركاء.', 'Track multi-stage procedures for thousands of files (medical, fingerprint, consulate, visa, travel) with government bodies and partners.'),
      ] },
      { visible: true, date: b('يناير 2014 – حتى الآن', 'Jan 2014 – Present'), role: b('مهندس برمجيات مستقل (أنظمة ومواقع وتطبيقات)', 'Freelance Software Engineer — Systems, Websites & Apps'), org: b('عمل حر', 'Freelance'), bullets: [
        b('أصمّم وأبني أنظمة إدارة أعمال تعمل في عدة شركات ويعتمد عليها أكثر من 70 مستخدماً يومياً.', 'Design and build business management systems running in several companies that 70+ users rely on daily.'),
        b('أطوّر مواقع بلوحات تحكم كاملة وتطبيق أندرويد، وأتولى المشروع من تحليل الاحتياج حتى التشغيل.', 'Develop websites with full admin panels and an Android app, owning each project from requirements analysis to go-live.'),
        b('أصمّم للشركات والصفحات: أكثر من 150 تصميماً للإعلانات والمنشورات على Canva وPhotoshop، وأدير الصفحات والحملات الممولة.', 'Design for companies and pages: 150+ ad and post designs on Canva and Photoshop, and manage pages and paid campaigns.'),
        b('أشغّل الأنظمة على شبكات الشركات أو الاستضافة، وأدرّب الفرق، وأقدّم الدعم والتحديثات بعد التشغيل.', 'Deploy systems on company networks or hosting, train teams, and provide support and updates after launch.')
      ] },
      { visible: false, date: b('مايو 2025 – أغسطس 2025', 'May 2025 – Aug 2025'), role: b('منسق عمليات النقل (مهمة مؤقتة)', 'Transport Operations Coordinator (temporary assignment)'), org: b('شركة حسين حجازي للنقل والعمرة – مكة المكرمة، السعودية', 'Hussein Hegazy Transport & Umrah Company – Makkah, Saudi Arabia'), bullets: [
        b('نسّقتُ رحلات نقل المعتمرين والموظفين، وتابعتُ الجداول والمواعيد مع السائقين وفرق التشغيل.', 'Coordinated transport trips for pilgrims and staff and followed schedules and timings with drivers and operations teams.'),
        b('تعاملتُ مع التغييرات المفاجئة والحالات العاجلة، وأعددتُ تقارير التشغيل اليومية.', 'Handled sudden changes and urgent cases and prepared daily operations reports.'),
        b('عملتُ مكتبياً وميدانياً في ورديات ممتدة خلال موسم عالي الضغط.', 'Worked in the office and in the field on extended shifts during a high-pressure season.')
      ] }
    ]
  },

  skills: {
    kicker: b('التقنيات', 'Tech stack'),
    title: b('الأدوات اللي بشتغل بيها: كل تقنية هنا اشتغلت في نظام حقيقي.', 'My toolbox: every technology here has run in a real system.'),
    groups: [
      { icon: 'code', title: b('تطوير الأنظمة والمواقع', 'Systems & web development'), items: ['React', 'TypeScript', 'Node.js', 'Express', 'REST APIs', 'Socket.IO', 'Tailwind CSS', b('لوحات تحكم وصلاحيات', 'Admin panels & permissions')] },
      { icon: 'db', title: b('قواعد البيانات والنشر', 'Databases & hosting'), items: ['MySQL', 'SQL Server', 'IndexedDB', 'Cloudflare Pages + D1', 'Hostinger', 'Git', b('نقل البيانات بين القواعد', 'Data migration'), b('نسخ احتياطي واستعادة', 'Backup & restore')] },
      { icon: 'phone', title: b('تطبيقات الموبايل', 'Mobile apps'), items: ['Capacitor', 'Android', 'Firebase Auth', b('الإشعارات', 'Push notifications'), b('العمل بدون إنترنت', 'Offline-first')] },
      { icon: 'support', title: b('الدعم الفني والشبكات', 'IT support & networking'), items: ['Windows 10 / 11', 'LAN & Wi-Fi', 'Router & Switch', b('IP ثابت و Port Forwarding', 'Static IP & port forwarding'), 'Firewall', b('الطابعات والماسحات', 'Printers & scanners'), b('الوصول عن بُعد', 'Remote access')] },
      { icon: 'shield', title: b('الأمان والجودة', 'Security & quality'), items: ['RBAC', b('تحقق بخطوتين (2FA)', 'Two-factor auth (2FA)'), 'Audit log', b('تشفير كلمات المرور', 'Password hashing'), 'Playwright'] },
      { icon: 'ai', title: b('الذكاء الاصطناعي والأتمتة', 'AI & automation'), items: ['Claude', 'ChatGPT', 'Gemini', 'Prompt Engineering', 'OCR', b('تحليل السير ومطابقة المرشحين', 'CV parsing & candidate matching')] }
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
    title: b('عندك مشكلة في الشغل أو فكرة نظام؟ نبدأ بمكالمة قصيرة.', 'Got a business problem or a system idea? Let’s start with a short call.'),
    sub: b('احكيلي عن شغلك باختصار، وأرد عليك بأسئلة قصيرة ثم تصوّر واضح للحل والمراحل.', 'Tell me briefly about your business and I will reply with a few short questions and a clear picture of the solution and stages.'),
    formTitle: b('أرسل رسالتك', 'Send your message'),
    topics: [b('نظام أو موقع أو تطبيق', 'System, website or app'), b('تصميم سوشيال ميديا', 'Social-media design'), b('دعم فني أو تشغيل', 'IT support or operations'), b('ديمو مباشر لأحد الأنظمة', 'Live demo of a system'), b('تعاون أو شراكة', 'Collaboration or partnership'), b('موضوع آخر', 'Something else')]
  },

  custom: [
    {
      id: 'why', layout: 'cards', alt: false, kicker: b('لماذا أنا', 'Why me'), title: b('لا أسلّم كوداً فقط. أسلّم نظاماً يعمل كل يوم.', 'I don’t just deliver code. I deliver a system that runs every day.'), sub: b('', ''),
      body: b('', ''),
      cards: [
        { icon: 'sys', title: b('أنظمة تعمل فعلاً', 'Systems that actually run'), text: b('أنظمة إدارة تُستخدم يومياً داخل الشركات: ملفات وحسابات وصلاحيات وتقارير، مش عروض شكلية.', 'Management systems used daily inside companies: files, accounts, permissions and reports — not show-pieces.') },
        { icon: 'shield', title: b('أمان وصلاحيات', 'Security & permissions'), text: b('تسجيل دخول آمن وتحقق بخطوتين وصلاحيات لكل مستخدم وسجل بكل عملية، والتحقق في السيرفر مش في الواجهة بس.', 'Secure sign-in, two-factor auth, per-user permissions and an audit log — enforced on the server, not just the interface.') },
        { icon: 'users', title: b('من الفكرة للتشغيل', 'From idea to launch'), text: b('أحلل الاحتياج، وأبني الحل، وأشغّله على شبكتك أو الاستضافة، وأدرّب فريقك، وأدعمه بعد التسليم.', 'I analyse the need, build the solution, deploy it, train your team and support it after delivery.') },
        { icon: 'lang', title: b('تواصل بسيط وواضح', 'Clear, simple communication'), text: b('أشرح القرارات التقنية بلغة بسيطة، وأسلّم على مراحل تراجعها وتجرّبها بنفسك، بالعربي أو الإنجليزي.', 'I explain technical decisions in plain language and deliver in stages you can review and try yourself — in Arabic or English.') }
      ], images: []
    },
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
      id: 'faq', layout: 'faq', alt: false, kicker: b('أسئلة قبل ما نبدأ', 'Before we start'), title: b('أسئلة بتتسأل قبل أي مشروع.', 'Questions asked before any project.'), sub: b('', ''),
      body: b('**نظام جاهز ولا مخصص؟**\nالجاهز أسرع وأرخص لو شغلك عادي. المخصص أحسن لو عندك إجراءات خاصة أو بتشتغل على Excel معقد أو نظام قديم. بحدد الأنسب بعد جلسة قصيرة أفهم فيها شغلك.\n\n**كم يستغرق تنفيذ نظام؟**\nيعتمد على حجمه. بعد جلسة التحليل بحدد النطاق وجدول تسليم على مراحل، فتشوف أول نسخة شغالة بدري وتعدّل المسار بدل ما تستنى للآخر.\n\n**هل أملك بياناتي؟**\nأكيد، بياناتك ملكك دايماً وبتتسلّم نسخة احتياطية منها. وتفاصيل ملكية الكود بنتفق عليها مكتوبة قبل ما نبدأ.\n\n**إيه اللي بيحصل بعد التسليم؟**\nتدريب لفريقك، وفترة دعم لإصلاح أي ملاحظة، وبعدها صيانة وتحديثات حسب احتياجك.\n\n**هل بتشتغل مع عملاء خارج مصر؟**\nأيوه، عن بُعد وبالعربي والإنجليزي، وبأي لغة للواجهات.\n\n**إزاي أطلب عرض سعر؟**\nابعتلي على واتساب وصف مختصر لشغلك، وأرد بأسئلة قصيرة ثم عرض مكتوب فيه النطاق والمراحل والسعر ومواعيد التسليم.',
        '**Ready-made or custom system?**\nReady-made is faster and cheaper if your business is standard. Custom is better if you have special procedures, complex Excel files or a legacy system. I decide after a short session to understand your business.\n\n**How long does a system take?**\nIt depends on its size. After the analysis session I define the scope and a staged delivery schedule, so you see a working first version early and can adjust course instead of waiting until the end.\n\n**Do I own my data?**\nAbsolutely. Your data is always yours and you receive a backup of it. Code-ownership details are agreed in writing before we start.\n\n**What happens after delivery?**\nTraining for your team, a support period to fix any issue, then maintenance and updates as you need.\n\n**Do you work with clients outside Egypt?**\nYes — remotely, in Arabic and English, with interfaces in any language.\n\n**How do I request a quote?**\nSend me a short description of your business on WhatsApp, and I reply with a few questions and then a written proposal with scope, stages, price and delivery dates.'),
      cards: [], images: []
    }
  ]
};

// روابط واتساب في بطاقات الباقات: ترميز نص الرسالة
for (const c of content.custom) for (const k of (c.cards || [])) if (k.link && k.link.includes('?text=')) { const i = k.link.indexOf('?text='); k.link = k.link.slice(0, i) + '?text=' + encodeURIComponent(k.link.slice(i + 6)); }
// ترتيب الأعمال: أول 6 هما اللي بيظهروا قبل «عرض المزيد» — أنظمة حقيقية ومواقع منشورة الأول
{ const ord = ['masar-ops', 'masar-hr', 'wesal', 'site-nesr', 'site-forsan', 'site-eldiwan', 'site-eldahan', 'site-rockline', 'site-rawajai', 'site-daffaherp', 'site-mahalat', 'site-kartly', 'site-ugcmena', 'site-nahj', 'site-trinavo', 'site-almnssa', 'site-manar', 'site-zayenha', 'site-nabraas', 'site-h2academy', 'site-alhub', 'site-wasitplus', 'pos-demo', 'crm-demo', 'invoices-demo', 'stay-demo', 'resto-demo', 'pulse-demo', 'fleet-demo', 'realestate-demo', 'clinic-demo', 'school-demo', 'eshop-demo', 'track-demo', 'fresh-demo', 'gym-demo'];
  const rank = (p) => { const i = ord.indexOf(p.id); return i < 0 ? 99 : i; };
  content.projects.items = content.projects.items.slice().sort((x, y) => rank(x) - rank(y));
  for (const p of content.projects.items) if (p.kind === 'mini') p.visible = false; }
// دراسات الحالة (من كود المشاريع نفسها)
{ const cs = {
  'masar-ops': { challenge: b('مكتب إلحاق عمالة كان بيدير الجوازات والتأشيرات والسفر والحسابات في ملفات Excel وسجلات ورقية متفرقة، فبتضيع الملفات، ويتأخر تسجيل الملف الواحد، ويصعب ضبط الحسابات.', 'An overseas-recruitment office managed passports, visas, travel and accounts in scattered Excel files and paper records, so files got lost, registering one file was slow and the accounts were hard to reconcile.'),
    solution: b('نظام مركزي بعشرات الشاشات: ملف لكل جواز مع ترقيم وأرشفة، وقراءة بيانات الجواز من الصورة (OCR)، ومتابعة مراحل الإجراءات، وحسابات العملاء والمناديب والعمولات والخزينة، وتقارير Excel وPDF.', 'A central system with dozens of screens: a record per passport with numbering and archiving, passport data read from the photo (OCR), procedure-stage tracking, client/agent/commission/treasury accounts, and Excel/PDF reports.'),
    decisions: b('الصلاحيات متطبقة في السيرفر مش في الواجهة بس، مع تحقق بخطوتين وموافقة الأجهزة وسجل عمليات. ونقلت النظام من SQL Server على جهاز المكتب لـ MySQL على استضافة سحابية، مع أداة مقارنة بتتأكد إن الأرقام المالية متطابقة.', 'Permissions are enforced on the server, not just the interface, with two-factor auth, device approval and an audit log. I migrated the system from SQL Server on the office PC to MySQL on cloud hosting, with a comparison tool that checks the financial figures match.'),
    result: b('بقى النظام الأساسي اللي بيعتمد عليه المكتب: وقت تسجيل الملف نزل من دقائق لثواني، وحالات فقد الجوازات وقفت.', 'It became the core system the office relies on: file registration dropped from minutes to seconds and passport losses stopped.') },
  'masar-hr': { challenge: b('السير الذاتية بتوصل من واتساب ورفع يدوي بأشكال مختلفة، وكتابة بياناتها يدوياً بطيئة، ومطابقة المرشحين مع طلبات الشركات بتاخد وقت وفيها أخطاء.', 'CVs arrive via WhatsApp and manual upload in many formats, typing their data by hand is slow, and matching candidates to company requests takes time and invites mistakes.'),
    solution: b('نظام توظيف: وارد بيستقبل السير (PDF وصور) ويقراها بالذكاء الاصطناعي، وبنك مرشحين بحقول حسب المهنة، وطلبيات بمطابقة (مطابق / محتاج تأكيد / ناقص شرط / بعيد)، ومسار مراحل لحد السفر، وصانع سير بـ20 قالب.', 'A recruitment system: an inbox that receives CVs (PDF and images) and reads them with AI, a candidate bank with profession-specific fields, orders with matching (match / needs confirmation / missing a condition / far), a stage pipeline up to travel, and a 20-template CV maker.'),
    decisions: b('أي نتيجة من الذكاء الاصطناعي بتعدي على طبقة تحقق وبتتراجع بشرياً قبل الاعتماد، وتعديلات الموظف مبتتكتبش فوقها. النظام بيحمّل البيانات في الذاكرة فالبحث على عشرات الآلاف في ملّي ثواني، والمفاتيح مشفّرة، وعليه 21 اختبار شامل بيفتح متصفح حقيقي.', 'Every AI output passes a validation layer and is reviewed by a person before approval, and staff edits are never overwritten. Data is held in memory so searching tens of thousands is instant, keys are encrypted, and 21 end-to-end tests drive a real browser.'),
    result: b('بنك مرشحين مركزي بحث فوري، وسير بتدخل النظام بعد مراجعة بدل ما تتكتب من الصفر.', 'A central candidate bank with instant search, and CVs that enter the system after review instead of being typed from scratch.') },
  'wesal': { challenge: b('بناء تطبيق عربي واحد يجمع العادات والمهام والعبادات، يشتغل بدون إنترنت، ويتشارك مع العيلة والأصحاب.', 'Build one Arabic app that brings habits, tasks and worship together, works offline, and can be shared with family and friends.'),
    solution: b('تطبيق أندرويد: شاشة «اليوم»، ومساحات مشتركة بنقاط ومسابقات، ومواقيت صلاة وأذان، والمصحف بالتفسير والتجويد، وحفظ بالخطوات، وأدوات للأهداف والفلوس والصحة والتركيز.', 'An Android app: a “Today” screen, shared spaces with points and contests, prayer times and adhan, the Quran with tafsir and tajweed, step-by-step memorisation, and tools for goals, money, health and focus.'),
    decisions: b('React 19 وTypeScript متغلّفين بـ Capacitor عشان كود واحد، وFirebase Auth لتسجيل الدخول بحساب جوجل، وخلفية على Cloudflare مع قاعدة D1، وتخزين محلي ومزامنة تلقائية للعمل بدون إنترنت.', 'React 19 and TypeScript wrapped with Capacitor for a single codebase, Firebase Auth for Google sign-in, a Cloudflare backend with a D1 database, and local storage with automatic sync for offline use.'),
    result: b('تطبيق منشور بنسخة 1.27.0 وبيتحمّل ملف APK مباشرة.', 'A published app at version 1.27.0, downloadable directly as an APK.') },
  'site-nesr': { challenge: b('مكتب نسر الخليج محتاج موقع عربي/إنجليزي يعرّف بالمكتب ويعرض الوظايف، والفريق يعدّل المحتوى بنفسه.', 'Nesr El-Khaleej needed an Arabic/English website presenting the office and its jobs, with content the team can edit itself.'),
    solution: b('موقع بلوحة تحكم كاملة: وظايف بأكواد وبحث وفلترة، وفورمات بتتبعت على واتساب أو الإيميل، وصورة جاهزة للنشر لكل وظيفة بكود QR، وإحصائيات زيارات من غير كوكيز.', 'A site with a full admin panel: jobs with codes, search and filters, forms sent via WhatsApp or email, a ready-to-post image with a QR code for every job, and cookie-free visit statistics.'),
    decisions: b('مستخدمين وصلاحيات وتحقق ثنائي وسجل عمليات، وربط آمن بنظام التوظيف: روابط تقديم وبوابة مناديب ومتابعة الطلب.', 'Users, permissions, two-factor auth and an audit log, plus a secure link to the recruitment system: application links, an agents portal and application tracking.'),
    result: b('موقع منشور على nisrelkhaleeg.com والفريق بيدير محتواه من لوحة التحكم.', 'A live site at nisrelkhaleeg.com whose content the team manages from the admin panel.') }
};
  for (const p of content.projects.items) if (cs[p.id]) p.case = cs[p.id]; }
fs.mkdirSync(path.join(__dirname, '..', 'seed'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '..', 'seed', 'content.json'), JSON.stringify(content, null, 2));
console.log('seed ok —', content.projects.items.length, 'مشروع،', content.skills.groups.length, 'مجموعة مهارات');
