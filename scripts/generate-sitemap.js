import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// กำหนดโดเมนเนมของเว็บไซต์ (เปลี่ยนเป็นโดเมนจริงของคุณ)
const DOMAIN = 'https://hongkonglex.com';

// อ่านข้อมูลบทความจากไฟล์ JSON
const articlesPath = path.join(__dirname, '../src/data/articles.json');
let articles = [];
if (fs.existsSync(articlesPath)) {
  const rawData = fs.readFileSync(articlesPath, 'utf-8');
  articles = JSON.parse(rawData);
}

const today = new Date().toISOString().split('T')[0];

// กำหนดหน้า Static ของเว็บไซต์
const routes = [
  { url: '/', lastmod: today, priority: '1.0' },
  // สามารถเพิ่มหน้าอื่นๆ ได้ที่นี่ เช่น { url: '/promotion', lastmod: today, priority: '0.9' }
];

// เพิ่มหน้าบทความแบบ Dynamic ลงใน Sitemap
articles.forEach(article => {
  routes.push({
    url: `/article/${article.slug}`,
    lastmod: article.updatedAt || today,
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
