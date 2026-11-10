'use strict';
/* تشغيل مسار HR في وضع النسخة التجريبية: قاعدة بيانات في ملف (بيانات وهمية) + حساب تجريبي جاهز */
const path = require('path');
// لو البوابة اتقفلت، النظام ده يقفل معاها (عشان مايفضلش ماسك البورت)
process.on('disconnect', () => process.exit(0));
const DATA = process.env.DEMO_DATA || path.join(__dirname, 'demo-data');
Object.assign(process.env, {
  DB_MODE: 'memory', MASAR_ALLOW_DEMO: '1', MASAR_NO_AUTOSTART: '1',
  MEMORY_DB_FILE: path.join(DATA, 'db.json'),
  FILE_STORAGE_DIR: path.join(DATA, 'storage'),
  LEGACY_FILE_STORAGE_ROOT: path.join(DATA, 'legacy-uploads'),
  MASAR_DATA_DIR: DATA, MASAR_V3_BACKUP_DIR: path.join(DATA, 'backups'),
  LEGACY_INBOX_POLL_SEC: '0', LEGACY_SERVER_DIR: path.join(DATA, 'no-legacy'),
  MASAR_V3_PORT: process.env.PORT || '4601', TRUST_PROXY: '2',
  DEMO_ADMIN_USER: 'demo', DEMO_ADMIN_PASSWORD: 'demo1234',
  AUTH_SECRET: process.env.DEMO_HR_AUTH_SECRET || require('crypto').randomBytes(24).toString('hex'),
  GEMINI_API_KEY: process.env.DEMO_GEMINI_API_KEY || ''
});
require('./src/server.js').start().then(() => { if (process.send) process.send('ready'); });
