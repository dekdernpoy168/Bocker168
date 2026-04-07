import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ARTICLES } from '../src/data/articles';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// กำหนดโดเมนเนมของเว็บไซต์
const DOMAIN = 'https://hongkonglex.com';

const today = new Date().toISOString().split('T')[0];

// กำหนดหน้า Static ของเว็บไซต์
const routes = [
  { url: '/', lastmod: today, priority: '1.0' },
  { url: '/features', lastmod: today, priority: '0.9' },
  { url: '/baccarat', lastmod: today, priority: '0.9' },
  { url: '/promotions', lastmod: today, priority: '0.9' },
  { url: '/articles', lastmod: today, priority: '0.9' },
  { url: '/faq', lastmod: today, priority: '0.8' },
  { url: '/contact', lastmod: today, priority: '0.8' },
  { url: '/register-guide', lastmod: today, priority: '0.8' },
  { url: '/deposit-withdraw-guide', lastmod: today, priority: '0.8' },
  { url: '/terms', lastmod: today, priority: '0.7' },
  { url: '/privacy', lastmod: today, priority: '0.7' },
  { url: '/cookies', lastmod: today, priority: '0.7' },
  { url: '/responsible-gambling', lastmod: today, priority: '0.7' },
];

// เพิ่มหน้าบทความแบบ Dynamic ลงใน Sitemap
ARTICLES.forEach(article => {
  routes.push({
    url: `/article/${article.slug}`,
    lastmod: article.date || today,
    priority: '0.8'
  });
});

// สร้างโครงสร้าง XML
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${DOMAIN}${route.url}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

// เขียนไฟล์ sitemap.xml ลงในโฟลเดอร์ public
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
console.log('✅ Sitemap generated successfully at public/sitemap.xml');
