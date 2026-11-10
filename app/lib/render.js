'use strict';
/* بيجهّز صفحة الموقع: بياخد القالب ويحط فيه عنوان ووصف ومعاينة الروابط (واتساب ولينكد إن) والمحتوى. */
const fs = require('fs');
const path = require('path');

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const bi = (o, l) => (o && typeof o === 'object' ? (o[l] || o.ar || o.en || '') : String(o || ''));

const BUILD = Date.now().toString(36);

function createRenderer(publicDir) {
  const template = fs.readFileSync(path.join(publicDir, 'index.template.html'), 'utf8');
  const icons = fs.readFileSync(path.join(__dirname, '..', 'tools', '_icons.svg'), 'utf8');

  function baseUrl(req, content) {
    const env = process.env.SITE_URL;
    const set = content && content.settings && content.settings.siteUrl;
    let u = env || set || '';
    if (!u || /YOUR-DOMAIN/i.test(u)) {
      const proto = String(req.headers['x-forwarded-proto'] || req.protocol || 'https').split(',')[0];
      u = proto + '://' + (req.headers['x-forwarded-host'] || req.headers.host || 'localhost');
    }
    return u.replace(/\/+$/, '');
  }
  const absolute = (base, p) => (!p ? '' : /^https?:\/\//i.test(p) ? p : base + '/' + String(p).replace(/^\/+/, ''));

  function render(req, content) {
    const st = (content && content.settings) || {};
    const seo = st.seo || {};
    const base = baseUrl(req, content);
    const title = bi(seo.title, 'ar') || bi(st.name, 'ar') || 'Portfolio';
    const titleEn = bi(seo.title, 'en') || bi(st.name, 'en') || title;
    const desc = [bi(seo.description, 'ar'), bi(seo.description, 'en')].filter(Boolean).join(' — ');
    const og = absolute(base, st.ogImage || 'assets/img/og-image.jpg');
    const ld = {
      '@context': 'https://schema.org', '@type': 'Person', name: bi(st.name, 'en'), alternateName: bi(st.name, 'ar'),
      jobTitle: bi(st.role, 'en'), url: base + '/', image: absolute(base, st.photo || 'assets/img/ahmed-alkholy.jpg'),
      email: st.email ? 'mailto:' + st.email : undefined,
      address: { '@type': 'PostalAddress', addressLocality: bi(st.location, 'en') },
      sameAs: [st.linkedin, st.github].filter(Boolean)
    };
    const data = JSON.stringify(content).replace(/</g, '\\u003c').replace(new RegExp(String.fromCharCode(0x2028), 'g'), '\\u2028').replace(new RegExp(String.fromCharCode(0x2029), 'g'), '\\u2029');
    return template
      .replace(/\{\{V\}\}/g, BUILD)
      .replace(/\{\{TITLE\}\}/g, esc(title)).replace('{{TITLE_EN}}', esc(titleEn))
      .replace(/\{\{DESC\}\}/g, esc(desc))
      .replace(/\{\{CANON\}\}/g, esc(base + '/'))
      .replace(/\{\{OGIMG\}\}/g, esc(og))
      .replace('{{SITENAME}}', esc(bi(st.name, 'en')))
      .replace('{{ICONS}}', () => icons)
      .replace('{{LD}}', () => JSON.stringify(ld).replace(/</g, '\\u003c'))
      .replace('{{DATA}}', () => data);
  }
  return { render, esc };
}

module.exports = { createRenderer };
