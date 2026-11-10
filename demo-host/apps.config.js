'use strict';
/* الأنظمة التجريبية: كل نظام بيشتغل على بورت داخلي، والبوابة بتوصّل له من /<prefix>/ */
const path = require('path');
module.exports = [
  {
    id: 'hr', prefix: '/demo-hr', port: 4601,
    entry: 'apps/hr/server/demo-launch.js', cwd: 'apps/hr/server', seed: 'seed/hr', health: '/api/health', maxBody: 8,
    env: (data) => ({ DEMO_DATA: data }),
    // خصائص مقفولة في النسخة التجريبية (عشان محدش يقفل الحساب على الباقيين أو يغيّر إعدادات حساسة)
    block: [
      { method: /^(POST|PUT|PATCH|DELETE)$/, path: /^\/api\/(users|security)(\/|$)/ },
      { method: /^(POST|PUT|PATCH|DELETE)$/, path: /^\/api\/auth\/(change-password|owner-reset|setup|2fa\/)/ },
      { method: /^(POST|PUT|PATCH|DELETE)$/, path: /^\/api\/ai\/(keys|keys-order|models|local|benchmark|import-legacy)(\/|$)/ },
      { method: /^(POST|PUT|PATCH|DELETE)$/, path: /^\/api\/(backup\/restore|backup\/restore-upload|setup\/|candidates\/purge|gdrive)/ },
      { method: /^(POST|PUT|PATCH|DELETE)$/, path: /^\/api\/settings\/(ai|backup|backupMail|gdrive|mail|email|smtp|security|siteKey|site|publicForm|cron)(\/|$)/i },
      { method: /^GET$/, path: /^\/api\/cron\// }
    ]
  },
  {
    id: 'passports', prefix: '/demo-passports', port: 4602,
    entry: 'apps/passports/passport-server/demo-launch.js', cwd: 'apps/passports/passport-server', seed: 'seed/passports', health: '/api/health', maxBody: 8,
    env: (data) => ({ DEMO_DATA: data }),
    block: [
      { method: /^(POST|PUT|PATCH|DELETE)$/, path: /^\/api\/(users|security|site|ocr-settings)(\/|$)/ },
      { method: /^(POST|PUT|PATCH|DELETE)$/, path: /^\/api\/backup\// },
      { method: /^(POST|PUT|PATCH|DELETE)$/, path: /^\/api\/(passports|companies|delegates|professions)\/bulk-delete/ },
      { method: /^(POST|PUT|PATCH|DELETE)$/, path: /^\/api\/login\/otp-setup/ },
      { path: /^\/print-agent\// }
    ]
  }
];
