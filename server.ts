import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { S3Client, ListObjectsV2Command, PutObjectCommand } from '@aws-sdk/client-s3';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ARTICLES_FILE = path.join(process.cwd(), 'articles_local.json');

const CATEGORY_MAP: Record<string, string> = {
  'บาคาร่า': 'baccarat',
  'วิธีเล่นเบื้องต้น': 'beginner-guide',
  'สูตรบาคาร่า': 'baccarat-strategy',
  'ทริคระดับเซียน': 'expert-tips',
  'ข่าวสารคาสิโน': 'casino-news',
  'เทคนิคการเดินเงิน': 'money-management',
  'เคล็ดลับการเล่น': 'playing-tips'
};

const REVERSE_CATEGORY_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_MAP).map(([k, v]) => [v, k])
);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // 301 Redirects for Category URLs (Thai to English)
  app.use((req, res, next) => {
    const categoryMatch = req.url.match(/^\/category\/([^/]+)(\/.*)?$/);
    if (categoryMatch) {
      const decodedCat = decodeURIComponent(categoryMatch[1]);
      if (CATEGORY_MAP[decodedCat]) {
        const rest = categoryMatch[2] || '';
        const newUrl = `/category/${CATEGORY_MAP[decodedCat]}${rest}`;
        console.log(`[SEO] Redirecting 301: ${req.url} -> ${newUrl}`);
        return res.redirect(301, newUrl);
      }
    }
    next();
  });

  // Logging middleware
  app.use((req, res, next) => {
    // Log only non-static requests for analytics
    const isStatic = req.url.includes('.') || req.url.startsWith('/@') || req.url.startsWith('/src');
    if (!isStatic && isD1Configured()) {
      logRequestToD1(req).catch(console.error);
    }
    next();
  });

  // Helper to check if D1 is configured
  const isD1Configured = () => {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    
    // Check if they are not just placeholders
    return !!(accountId && accountId !== 'YOUR_ACCOUNT_ID' && 
              databaseId && databaseId !== 'YOUR_DATABASE_ID' && 
              apiToken && apiToken !== 'YOUR_API_TOKEN');
  };

  // Local JSON Helper
  const getLocalArticles = async () => {
    try {
      const data = await fs.readFile(ARTICLES_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  };

  const saveLocalArticles = async (articles: any[]) => {
    await fs.writeFile(ARTICLES_FILE, JSON.stringify(articles, null, 2));
  };

  // Cloudflare D1 Helper
  const queryD1 = async (sql: string, params: any[] = []) => {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    if (!accountId || !databaseId || !apiToken) {
      throw new Error('Cloudflare D1 credentials are not configured.');
    }

    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql,
          params,
        }),
      });

      const data: any = await response.json();
      if (!data.success) {
        const errorMsg = data.errors?.[0]?.message || JSON.stringify(data.errors);
        if (errorMsg.includes('Authentication error')) {
          throw new Error('Cloudflare API Token ไม่ถูกต้อง หรือไม่มีสิทธิ์เข้าถึง D1 Database (Authentication Error)');
        }
        throw new Error(`D1 Query Error: ${errorMsg}`);
      }
      return data.result[0];
    } catch (error: any) {
      if (error.message.includes('fetch')) {
        throw new Error('ไม่สามารถเชื่อมต่อกับ Cloudflare API ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต');
      }
      throw error;
    }
  };

  // Helper to initialize table
  const initTable = async () => {
    // Create authors table
    await queryD1(`
      CREATE TABLE IF NOT EXISTS authors (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        image TEXT,
        position TEXT,
        description TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create categories table
    await queryD1(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed categories if empty
    try {
      const catCountResult = await queryD1('SELECT COUNT(*) as count FROM categories');
      const count = catCountResult.results[0].count;
      
      if (count === 0) {
        console.log('[D1] Seeding initial categories...');
        const initialCategories = [
          { id: 'cat-1', name: 'บาคาร่า', slug: 'baccarat', description: 'บทความเกี่ยวกับบาคาร่า ทั้งวิธีการเล่นและพื้นฐาน' },
          { id: 'cat-2', name: 'วิธีเล่นเบื้องต้น', slug: 'beginner-guide', description: 'คู่มือการเล่นคาสิโนออนไลน์สำหรับมือใหม่' },
          { id: 'cat-3', name: 'สูตรบาคาร่า', slug: 'baccarat-strategy', description: 'รวมสูตรบาคาร่าที่ใช้งานได้จริง เทคนิคการเอาชนะ' },
          { id: 'cat-4', name: 'ทริคระดับเซียน', slug: 'expert-tips', description: 'เทคนิคขั้นสูงจากเหล่าเซียนบาคาร่า' },
          { id: 'cat-5', name: 'ข่าวสารคาสิโน', slug: 'casino-news', description: 'เกาะติดข่าวสารวงการคาสิโนและโปรโมชั่นใหม่ๆ' },
          { id: 'cat-6', name: 'เทคนิคการเดินเงิน', slug: 'money-management', description: 'สอนการบริหารจัดการเงินและทุนในการเดิมพัน' },
          { id: 'cat-7', name: 'เคล็ดลับการเล่น', slug: 'playing-tips', description: 'เคล็ดลับเล็กๆ น้อยๆ ที่จะช่วยให้คุณเล่นได้ดีขึ้น' }
        ];

        for (const cat of initialCategories) {
          await queryD1(
            'INSERT INTO categories (id, name, slug, description) VALUES (?, ?, ?, ?)',
            [cat.id, cat.name, cat.slug, cat.description]
          );
        }
      }
    } catch (e) {
      console.error('Error seeding categories:', e);
    }

    // Create pages table
    await queryD1(`
      CREATE TABLE IF NOT EXISTS pages (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        image TEXT,
        status TEXT CHECK(status IN ('published', 'draft', 'scheduled')),
        metaTitle TEXT,
        metaDescription TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const sql = `
      CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        category TEXT,
        image TEXT,
        status TEXT CHECK(status IN ('published', 'draft', 'scheduled')),
        author TEXT,
        authorImage TEXT,
        authorPosition TEXT,
        authorDescription TEXT,
        date TEXT,
        metaTitle TEXT,
        metaDescription TEXT,
        metaKeywords TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await queryD1(sql);
    
    // Attempt to add new columns if they don't exist (for existing databases)
    const columnsToAdd = [
      { name: 'authorImage', type: 'TEXT' },
      { name: 'authorPosition', type: 'TEXT' },
      { name: 'authorDescription', type: 'TEXT' }
    ];

    for (const col of columnsToAdd) {
      try {
        await queryD1(`ALTER TABLE articles ADD COLUMN ${col.name} ${col.type};`);
      } catch (e) {
        // Ignore error if column already exists
      }
    }

    // Create request_logs table
    try {
      await queryD1(`
        CREATE TABLE IF NOT EXISTS request_logs (
          id TEXT PRIMARY KEY,
          url TEXT,
          method TEXT,
          headers TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
    } catch (e) {
      console.error('Error creating request_logs table:', e);
    }
  };

  const logRequestToD1 = async (req: express.Request) => {
    if (!isD1Configured()) return;
    try {
      const id = Math.random().toString(36).substring(2, 11);
      const url = req.originalUrl || req.url;
      const method = req.method;
      const headers = JSON.stringify(req.headers);
      
      await queryD1(
        'INSERT INTO request_logs (id, url, method, headers) VALUES (?, ?, ?, ?)',
        [id, url, method, headers]
      );
    } catch (e: any) {
      if (e.message?.includes('no such table: request_logs')) {
        console.log('Table "request_logs" not found. Initializing...');
        await initTable();
        // Retry once
        try {
          const id = Math.random().toString(36).substring(2, 11);
          const url = req.originalUrl || req.url;
          const method = req.method;
          const headers = JSON.stringify(req.headers);
          await queryD1(
            'INSERT INTO request_logs (id, url, method, headers) VALUES (?, ?, ?, ?)',
            [id, url, method, headers]
          );
        } catch (retryError) {
          console.error('Retry logging error:', retryError);
        }
        return;
      }
      // Background logging should not crash the app
      console.error('Logging error:', e);
    }
  };


  const getArticleBySlug = async (slug: string) => {
    try {
      if (!isD1Configured()) {
        const local = await getLocalArticles();
        return local.find((a: any) => a.slug === slug);
      }
      const result = await queryD1('SELECT * FROM articles WHERE slug = ? LIMIT 1', [slug]);
      return result.results?.[0];
    } catch (error) {
      console.error('Error fetching article by slug:', error);
      return null;
    }
  };

  const getPageBySlug = async (slug: string) => {
    try {
      if (!isD1Configured()) return null;
      const result = await queryD1('SELECT * FROM pages WHERE slug = ? LIMIT 1', [slug]);
      return result.results?.[0];
    } catch (error) {
      console.error('Error fetching page by slug:', error);
      return null;
    }
  };

  const injectSEO = async (template: string, url: string) => {
    const DOMAIN = 'https://hongkonglex.com';
    const pathParts = url.split('?')[0].split('/').filter(Boolean);
    let statusCode = 200;
    
    // Dynamic Category Map
    let dynamicReverseMap = REVERSE_CATEGORY_MAP;
    if (isD1Configured()) {
      try {
        const catResult = await queryD1('SELECT name, slug FROM categories');
        if (catResult.results?.length > 0) {
          const revMap: any = {};
          catResult.results.forEach((c: any) => {
            revMap[c.slug] = c.name;
          });
          dynamicReverseMap = revMap;
        }
      } catch (e) {}
    }

    // Default SEO
    let title = "บาคาร่าออนไลน์ Bocker168 เว็บตรงไม่ผ่านเอเย่นต์ ฝากถอนไม่มีขั้นต่ำ";
    let description = "Bocker168 บาคาร่าเว็บตรงไม่ผ่านเอเย่นต์ อันดับ 1 ฝากถอนออโต้ไม่มีขั้นต่ำ รองรับทรูวอเลท (True Wallet) คาสิโนสด SA Gaming, Sexy Baccarat สมัครวันนี้รับโปรโมชั่นพิเศษ";
    let keywords = "Bocker168, บาคาร่า, บาคาร่าออนไลน์, บาคาร่าเว็บตรง, สมัครบาคาร่า, บาคาร่าทรูวอเลท, บาคาร่าไม่มีขั้นต่ำ, คาสิโนออนไลน์, SA Gaming, Sexy Baccarat, เว็บบาคาร่าอันดับ1";
    const canonical = `${DOMAIN}${url.split('?')[0]}`;
    let ogType = "website";
    let ogImage = "https://img2.pic.in.th/A2-Logo-Bocker-168.png";
    let bodyContent = "";

    const reservedRoutes = ['category', 'author', 'admin', 'dashboard', 'api', 'assets'];

    // 1. Check for Category Page /category/:slug
    if (pathParts[0] === 'category' && pathParts[1]) {
      const catSlug = decodeURIComponent(pathParts[1]);
      const catName = dynamicReverseMap[catSlug] || catSlug;
      title = `${catName} - บทความและเทคนิคบาคาร่า Bocker168`;
      description = `อ่านบทความทั้งหมดเกี่ยวกับ ${catName} เทคนิคการเล่นบาคาร่าและข่าวสารคาสิโนออนไลน์ที่ Bocker168`;
    } 
    // 2. Check for Single Slug (Page or Post)
    else if ((pathParts.length === 1 && !reservedRoutes.includes(pathParts[0])) || pathParts.length === 0) {
      const slug = pathParts.length === 0 ? 'home' : decodeURIComponent(pathParts[0]);
      
      // Try find Page first
      const page = await getPageBySlug(slug);
      if (page) {
        title = page.metaTitle || (slug === 'home' ? title : `${page.title} - Bocker168`);
        description = page.metaDescription || (slug === 'home' ? description : (page.excerpt || description));
        ogImage = page.image || ogImage;
      } else if (pathParts.length !== 0) {
        // Try find Post (only if not home page)
        const article = await getArticleBySlug(slug);
        if (article) {
          title = article.metaTitle || article.title;
          description = article.metaDescription || article.excerpt || description;
          keywords = article.metaKeywords || keywords;
          ogType = "article";
          ogImage = article.image || ogImage;
          
          // JSON-LD Article
          const jsonLdArticle = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": article.title,
            "description": article.metaDescription || article.excerpt,
            "image": article.image,
            "author": {
              "@type": "Person",
              "name": article.author || "Bocker168 Admin"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Bocker168",
              "logo": {
                "@type": "ImageObject",
                "url": "https://img2.pic.in.th/A2-Logo-Bocker-168.png"
              }
            },
            "datePublished": article.date,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": canonical
            }
          };

          template = template.replace('</head>', `<script type="application/ld+json">${JSON.stringify(jsonLdArticle).replace(/</g, '\\u003c')}</script>\n</head>`);
        } else {
           statusCode = 404;
           title = "ไม่พบหน้าที่ต้องการ - Bocker168";
        }
      }
    } else if (pathParts.length > 1 && !reservedRoutes.includes(pathParts[0])) {
        statusCode = 404;
        title = "ไม่พบหน้าที่ต้องการ - Bocker168";
    }

    console.log(`[SEO INJECT] URL: ${url}, pathParts: ${JSON.stringify(pathParts)}, statusCode: ${statusCode}`);

    let robotsContent = "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1";
    const privateRoutes = ['admin', 'dashboard', 'api'];

    if (statusCode === 404 || (pathParts[0] && privateRoutes.includes(pathParts[0]))) {
      robotsContent = "noindex, nofollow";
    }

    const html = template
      .replace('<div id="root"></div>', `<div id="root">${bodyContent}</div>`)
      .replace(/<title>.*?<\/title>/i, `<title>${title.replace(/&/g, '&amp;')}</title>`)
      .replace(/<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="description" content="${description.replace(/"/g, '&quot;')}" />`)
      .replace(/<meta\s+name=["']keywords["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="keywords" content="${keywords.replace(/"/g, '&quot;')}" />`)
      .replace(/<meta\s+property=["']og:title["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />`)
      .replace(/<meta\s+property=["']og:description["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:description" content="${description.replace(/"/g, '&quot;')}" />`)
      .replace(/<meta\s+property=["']og:type["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:type" content="${ogType}" />`)
      .replace(/<meta\s+property=["']og:url["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:url" content="${canonical}" />`)
      .replace(/<meta\s+property=["']og:image["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:image" content="${ogImage}" />`)
      .replace(/<link\s+rel=["']canonical["']\s+href=["'].*?["']\s*\/?>/i, `<link rel="canonical" href="${canonical}" />`)
      .replace('</head>', `<meta name="robots" content="${robotsContent}" />\n<script type="application/ld+json">${JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "url": DOMAIN + "/",
        "name": "Bocker168",
        "alternateName": "บาคาร่าออนไลน์ Bocker168",
        "description": "เว็บไซต์บาคาร่าออนไลน์อันดับ 1 เว็บตรงไม่ผ่านเอเย่นต์",
        "inLanguage": "th-TH"
      }).replace(/</g, '\\u003c')}</script>\n</head>`);
      
      return { html, statusCode };
  };

  // API Routes
  app.get('/api/config-status', (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.json({
      d1Configured: isD1Configured(),
      fallbackMode: !isD1Configured()
    });
  });

  app.get('/api/articles', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    console.log('GET /api/articles');
    try {
      if (!isD1Configured()) {
        const local = await getLocalArticles();
        return res.json(local);
      }
      try {
        const result = await queryD1('SELECT * FROM articles ORDER BY date DESC LIMIT 100');
        res.json(result.results || []);
      } catch (error: any) {
        if (error.message.includes('no such table: articles')) {
          console.log('Table "articles" not found. Initializing...');
          await initTable();
          const result = await queryD1('SELECT * FROM articles ORDER BY date DESC LIMIT 100');
          return res.json(result.results || []);
        }
        throw error;
      }
    } catch (error: any) {
      console.error('Error fetching articles:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/articles/:id', async (req, res) => {
    try {
      if (!isD1Configured()) {
        const local = await getLocalArticles();
        const article = local.find((a: any) => a.id === req.params.id);
        return res.json(article || null);
      }
      const result = await queryD1('SELECT * FROM articles WHERE id = ? LIMIT 1', [req.params.id]);
      res.json(result.results?.[0] || null);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- R2 API ---
  app.get('/api/r2/images', async (req, res) => {
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const bucketName = process.env.R2_BUCKET_NAME;
    const accountId = process.env.R2_ACCOUNT_ID;
    const publicUrl = process.env.R2_PUBLIC_URL || '';

    if (!accessKeyId || !secretAccessKey || !bucketName || !accountId) {
      return res.status(400).json({ error: 'R2 configuration is incomplete' });
    }

    try {
      const s3Client = new S3Client({
        region: 'auto',
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });

      const command = new ListObjectsV2Command({
        Bucket: bucketName,
      });

      let formattedPublicUrl = publicUrl.trim();
      if (formattedPublicUrl && !/^https?:\/\//i.test(formattedPublicUrl)) {
        formattedPublicUrl = `https://${formattedPublicUrl}`;
      }

      const response = await s3Client.send(command);
      const images = (response.Contents || [])
        .filter(obj => {
          const ext = obj.Key?.toLowerCase().split('.').pop();
          return ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext || '');
        })
        .map(obj => ({
          key: obj.Key,
          url: formattedPublicUrl && obj.Key ? `${formattedPublicUrl.replace(/\/$/, '')}/${obj.Key.split('/').map(encodeURIComponent).join('/')}` : null,
          size: obj.Size,
          lastModified: obj.LastModified,
        }));

      res.json(images);
    } catch (error: any) {
      console.error('R2 List Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/upload-image', express.json({ limit: '10mb' }), async (req, res) => {
    try {
      const { filename, base64 } = req.body;
      if (!filename || !base64) {
        return res.status(400).json({ error: 'Missing filename or base64 data' });
      }

      const accessKeyId = process.env.R2_ACCESS_KEY_ID;
      const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
      const bucketName = process.env.R2_BUCKET_NAME;
      const accountId = process.env.R2_ACCOUNT_ID;
      const publicUrl = process.env.R2_PUBLIC_URL || '';

      if (!accessKeyId || !secretAccessKey || !bucketName || !accountId) {
        return res.status(400).json({ error: 'R2 configuration is incomplete' });
      }

      const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, 'base64');
      const ext = filename.split('.').pop()?.toLowerCase();
      const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : ext === 'svg' ? 'image/svg+xml' : ext === 'gif' ? 'image/gif' : 'image/jpeg';
      
      const uniqueFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');

      const s3Client = new S3Client({
        region: 'auto',
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: uniqueFilename,
        Body: buffer,
        ContentType: mimeType,
      });

      await s3Client.send(command);

      let formattedPublicUrl = publicUrl.trim();
      if (formattedPublicUrl && !/^https?:\/\//i.test(formattedPublicUrl)) {
        formattedPublicUrl = `https://${formattedPublicUrl}`;
      }

      const fileUrl = formattedPublicUrl ? `${formattedPublicUrl.replace(/\/$/, '')}/${uniqueFilename}` : `/${uniqueFilename}`;

      res.json({ success: true, url: fileUrl });
    } catch (error: any) {
      console.error('Error uploading image to R2:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/keywords-volume', express.json(), async (req, res) => {
    try {
      const apiKey = process.env.KEYWORDS_EVERYWHERE_API_KEY;
      if (!apiKey) {
        return res.json({ configured: false });
      }

      const { keywords } = req.body;
      if (!keywords || !Array.isArray(keywords)) {
        return res.status(400).json({ error: 'Keywords array required' });
      }

      const params = new URLSearchParams();
      keywords.forEach((kw: string) => params.append('kw[]', kw));

      const response = await fetch('https://api.keywordseverywhere.com/v1/get_keyword_data', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      });

      if (response.ok) {
        const data = await response.json() as any;
        res.json({ configured: true, data: data?.data });
      } else {
        const err = await response.text();
        res.status(response.status).json({ error: err });
      }
    } catch (error: any) {
      console.error('Error fetching keywords:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/request-logs', async (req, res) => {
    try {
      if (!isD1Configured()) {
        return res.json([]);
      }
      const result = await queryD1('SELECT * FROM request_logs ORDER BY timestamp DESC LIMIT 50');
      res.json(result.results || []);
    } catch (error: any) {
      console.error('Error fetching logs:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/articles', async (req, res) => {
    console.log('POST /api/articles');
    try {
      const article = req.body;
      
      if (!isD1Configured()) {
        const local = await getLocalArticles();
        const index = local.findIndex((a: any) => a.id === article.id);
        if (index >= 0) {
          local[index] = article;
        } else {
          local.unshift(article);
        }
        await saveLocalArticles(local);
        return res.json({ success: true, local: true });
      }

      const sql = `
        INSERT INTO articles (id, title, slug, content, excerpt, category, image, status, author, authorImage, authorPosition, authorDescription, date, metaTitle, metaDescription, metaKeywords)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          title = excluded.title,
          slug = excluded.slug,
          content = excluded.content,
          excerpt = excluded.excerpt,
          category = excluded.category,
          image = excluded.image,
          status = excluded.status,
          author = excluded.author,
          authorImage = excluded.authorImage,
          authorPosition = excluded.authorPosition,
          authorDescription = excluded.authorDescription,
          date = excluded.date,
          metaTitle = excluded.metaTitle,
          metaDescription = excluded.metaDescription,
          metaKeywords = excluded.metaKeywords
      `;
      const params = [
        article.id, article.title, article.slug, article.content, article.excerpt,
        article.category, article.image, article.status, article.author, article.authorImage,
        article.authorPosition, article.authorDescription,
        article.date,
        article.metaTitle, article.metaDescription, article.metaKeywords
      ];
      
      try {
        const contentSize = Buffer.byteLength(article.content || '');
        if (contentSize > 800 * 1024) {
          throw new Error('บทความมีขนาดใหญ่เกินไป กรุณาแบ่งเนื้อหาออกเป็นส่วนๆ หรือบีบอัดรูปภาพ');
        }
        await queryD1(sql, params);
      } catch (error: any) {
        if (error.message.includes('no such table: articles')) {
          console.log('Table "articles" not found during save. Initializing...');
          await initTable();
          await queryD1(sql, params);
        } else {
          throw error;
        }
      }
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error saving article:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/articles/:id', async (req, res) => {
    try {
      if (!isD1Configured()) {
        const local = await getLocalArticles();
        const filtered = local.filter((a: any) => a.id !== req.params.id);
        await saveLocalArticles(filtered);
        return res.json({ success: true, local: true });
      }
      await queryD1('DELETE FROM articles WHERE id = ?', [req.params.id]);
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error deleting article:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // --- Pages API ---
  app.get('/api/pages', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    try {
      if (!isD1Configured()) return res.json([]);
      const result = await queryD1('SELECT * FROM pages ORDER BY createdAt DESC');
      
      const pagesToSeed = [
        { slug: 'terms', title: 'ข้อตกลงและเงื่อนไข', content: '<p>ยินดีต้อนรับสู่ Bocker168 ในการใช้บริการเว็บไซต์ของเรา คุณตกลงที่จะปฏิบัติตามข้อกำหนดและเงื่อนไขดังต่อไปนี้:</p><h3>1. การสมัครสมาชิก</h3><p>ผู้สมัครต้องมีอายุไม่ต่ำกว่า 18 ปีบริบูรณ์ และต้องให้ข้อมูลที่เป็นจริงเท่านั้น หากตรวจพบข้อมูลเท็จ ทางเราขอสงวนสิทธิ์ในการระงับบัญชีทันที</p><h3>2. การรักษาความปลอดภัย</h3><p>สมาชิกมีหน้าที่รับผิดชอบในการรักษาความลับของรหัสผ่านและข้อมูลบัญชีของตนเอง ทางเว็บไซต์จะไม่รับผิดชอบต่อความเสียหายที่เกิดจากการละเลยของผู้ใช้</p><h3>3. กฎกติกาการเล่น</h3><p>การเดิมพันทั้งหมดต้องเป็นไปตามกฎกติกาที่เว็บไซต์กำหนด หากตรวจพบการใช้โปรแกรมช่วยเล่นหรือการกระทำที่ส่อไปในทางทุจริต ทางเราจะยกเลิกยอดเงินและระงับบัญชีถาวร</p>' },
        { slug: 'privacy', title: 'นโยบายความเป็นส่วนตัว', content: '<p>Bocker168 ให้ความสำคัญกับความเป็นส่วนตัวของสมาชิกทุกท่าน ข้อมูลของคุณจะถูกเก็บรักษาเป็นความลับสูงสุด:</p><h3>1. การเก็บรวบรวมข้อมูล</h3><p>เราเก็บรวบรวมข้อมูลที่จำเป็นสำหรับการให้บริการ เช่น ชื่อ-นามสกุล, เบอร์โทรศัพท์, และข้อมูลบัญชีธนาคาร เพื่อใช้ในการทำรายการฝาก-ถอน</p><h3>2. การใช้งานข้อมูล</h3><p>ข้อมูลของคุณจะถูกใช้เพื่อวัตถุประสงค์ในการให้บริการ ปรับปรุงประสบการณ์การใช้งาน และแจ้งข่าวสารโปรโมชั่นที่น่าสนใจเท่านั้น</p><h3>3. การรักษาความปลอดภัย</h3><p>เราใช้ระบบเข้ารหัสข้อมูลขั้นสูง (SSL) เพื่อป้องกันการเข้าถึงข้อมูลโดยไม่ได้รับอนุญาต คุณจึงมั่นใจได้ว่าข้อมูลของคุณจะปลอดภัย 100%</p>' },
        { slug: 'cookies', title: 'นโยบายคุกกี้', content: '<p>เว็บไซต์ของเรามีการใช้งานคุกกี้ (Cookies) เพื่อเพิ่มประสิทธิภาพในการใช้งานและมอบประสบการณ์ที่ดีที่สุดให้กับคุณ:</p><h3>คุกกี้คืออะไร?</h3><p>คุกกี้คือไฟล์ขนาดเล็กที่ถูกเก็บไว้ในอุปกรณ์ของคุณเมื่อคุณเข้าชมเว็บไซต์ ช่วยให้เราจดจำการตั้งค่าและพฤติกรรมการใช้งานของคุณได้</p><h3>เราใช้คุกกี้อย่างไร?</h3><ul><li>คุกกี้ที่จำเป็น: เพื่อให้เว็บไซต์ทำงานได้อย่างถูกต้อง</li><li>คุกกี้เพื่อการวิเคราะห์: เพื่อทำความเข้าใจว่าผู้ใช้งานเข้าถึงส่วนใดของเว็บมากที่สุด</li><li>คุกกี้เพื่อการตลาด: เพื่อนำเสนอโปรโมชั่นที่ตรงกับความสนใจของคุณ</li></ul>' },
        { slug: 'responsible-gambling', title: 'ความรับผิดชอบต่อสังคม', content: '<p>Bocker168 สนับสนุนการเล่นพนันอย่างมีความรับผิดชอบ เพื่อให้การเดิมพันเป็นเพียงกิจกรรมสันทนาการที่สนุกสนาน:</p><h3>คำแนะนำในการเล่นอย่างมีความรับผิดชอบ</h3><ul><li>เล่นเพื่อความสนุกสนาน ไม่ใช่เพื่อหารายได้หลัก</li><li>กำหนดงบประมาณที่สามารถเสียได้และไม่เดือดร้อนต่อตนเองและครอบครัว</li><li>ไม่ควรใช้เวลาในการเล่นมากเกินไปจนกระทบต่อหน้าที่การงานหรือการเรียน</li><li>หากรู้สึกว่าการเล่นเริ่มส่งผลเสียต่อชีวิตประจำวัน ควรหยุดพักและขอคำปรึกษา</li></ul><p>"การพนันควรเป็นเรื่องของความบันเทิง กรุณาเล่นอย่างมีสติ"</p>' },
        { slug: 'register-guide', title: 'วิธีสมัครสมาชิก', content: '<h3>1. คลิกปุ่มสมัครสมาชิก</h3><p>กดที่ปุ่ม "สมัครสมาชิก" บนหน้าเว็บไซต์ Bocker168 เพื่อเข้าสู่ระบบการสมัครอัตโนมัติ</p><h3>2. กรอกข้อมูลส่วนตัว</h3><p>ระบุเบอร์โทรศัพท์มือถือที่ใช้งานจริง และข้อมูลบัญชีธนาคาร (ชื่อ-นามสกุล ต้องตรงกับชื่อบัญชีธนาคารเพื่อความรวดเร็วในการฝาก-ถอน)</p><h3>3. ยืนยันและรับยูสเซอร์</h3><p>ตรวจสอบความถูกต้องของข้อมูลแล้วกดยืนยัน ระบบจะส่ง Username และ Password ให้คุณทันที สามารถเข้าเล่นได้เลย!</p>' },
        { slug: 'deposit-withdraw-guide', title: 'วิธีฝาก-ถอนเงิน', content: '<h3>วิธีการฝากเงิน</h3><ul><li>เข้าสู่ระบบด้วยยูสเซอร์ของคุณ</li><li>เลือกเมนู "ฝากเงิน"</li><li>คัดลอกเลขบัญชีของทางเว็บ</li><li>โอนเงินผ่านแอปธนาคารของคุณ (ต้องใช้บัญชีที่สมัครเท่านั้น)</li><li>รอระบบอัปเดตยอดเงินภายใน 10 วินาที</li></ul><h3>วิธีการถอนเงิน</h3><ul><li>เลือกเมนู "ถอนเงิน"</li><li>ระบุจำนวนเงินที่ต้องการถอน</li><li>กดยืนยันการถอนเงิน</li><li>เงินจะเข้าบัญชีธนาคารของคุณโดยอัตโนมัติ</li></ul>' },
        { slug: 'faq', title: 'คำถามที่พบบ่อย (FAQ)', content: '<p>หน้านี้ใช้รูปแบบพิเศษ (Custom Layout) การแก้ไขเนื้อหาในกล่องนี้จะไม่มีผลต่อรูปแบบหน้า แต่คุณสามารถแก้ไข Title และ URL รูปภาพได้เพื่อตั้งค่า SEO</p>' },
        { slug: 'contact', title: 'ติดต่อเรา', content: '<p>หน้านี้ใช้รูปแบบพิเศษ (Custom Layout) การแก้ไขเนื้อหาในกล่องนี้จะไม่มีผลต่อรูปแบบหน้า แต่คุณสามารถแก้ไข Title และ URL รูปภาพได้เพื่อตั้งค่า SEO</p>' },
        { slug: 'baccarat', title: 'บาคาร่าออนไลน์', content: '<p>หน้านี้ใช้รูปแบบพิเศษ (Custom Layout) การแก้ไขเนื้อหาในกล่องนี้จะไม่มีผลต่อรูปแบบหน้า แต่คุณสามารถแก้ไข Title และ URL รูปภาพได้เพื่อตั้งค่า SEO</p>' },
        { slug: 'features', title: 'จุดเด่นของเรา', content: '<p>หน้านี้ใช้รูปแบบพิเศษ (Custom Layout) การแก้ไขเนื้อหาในกล่องนี้จะไม่มีผลต่อรูปแบบหน้า แต่คุณสามารถแก้ไข Title และ URL รูปภาพได้เพื่อตั้งค่า SEO</p>' },
        { slug: 'promotions', title: 'โปรโมชั่น', content: '<p>หน้านี้ใช้รูปแบบพิเศษ (Custom Layout) การแก้ไขเนื้อหาในกล่องนี้จะไม่มีผลต่อรูปแบบหน้า แต่คุณสามารถแก้ไข Title และ URL รูปภาพได้เพื่อตั้งค่า SEO</p>' },
        { slug: 'articles', title: 'บทความ', content: '<p>หน้านี้ใช้รูปแบบพิเศษ (Custom Layout) การแก้ไขเนื้อหาในกล่องนี้จะไม่มีผลต่อรูปแบบหน้า แต่คุณสามารถแก้ไข Title และ URL รูปภาพได้เพื่อตั้งค่า SEO</p>' },
        { slug: 'home', title: 'หน้าแรก', content: '<p>หน้านี้ใช้รูปแบบพิเศษ (Custom Layout) การแก้ไขเนื้อหาในกล่องนี้จะไม่มีผลต่อรูปแบบหน้า แต่คุณสามารถแก้ไข Title และ URL รูปภาพได้เพื่อตั้งค่า SEO</p>' }
      ];

      let currentPages = result.results || [];
      let didSeed = false;

      for (const page of pagesToSeed) {
        if (!currentPages.find((p: any) => p.slug === page.slug)) {
          const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
          const now = new Date().toISOString();
          await queryD1(
            'INSERT INTO pages (id, title, slug, content, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, page.title, page.slug, page.content, 'published', now, now]
          );
          didSeed = true;
        }
      }

      if (didSeed) {
        const newResult = await queryD1('SELECT * FROM pages ORDER BY createdAt DESC');
        currentPages = newResult.results || [];
      }

      res.json(currentPages);
    } catch (error: any) {
      console.error('Error fetching pages:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/pages', async (req, res) => {
    try {
      const page = req.body;
      if (!isD1Configured()) return res.status(503).json({ error: 'D1 not configured' });

      const sql = `
        INSERT INTO pages (id, title, slug, content, excerpt, image, status, metaTitle, metaDescription)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          title = excluded.title,
          slug = excluded.slug,
          content = excluded.content,
          excerpt = excluded.excerpt,
          image = excluded.image,
          status = excluded.status,
          metaTitle = excluded.metaTitle,
          metaDescription = excluded.metaDescription,
          updatedAt = CURRENT_TIMESTAMP
      `;
      await queryD1(sql, [page.id, page.title, page.slug, page.content, page.excerpt, page.image, page.status, page.metaTitle, page.metaDescription]);
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error saving page:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/pages/:id', async (req, res) => {
    try {
      if (!isD1Configured()) return res.status(503).json({ error: 'D1 not configured' });
      await queryD1('DELETE FROM pages WHERE id = ?', [req.params.id]);
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error deleting page:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // --- Authors API ---

  app.get('/api/authors', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    console.log('GET /api/authors');
    if (!isD1Configured()) return res.json({ success: true, authors: [] });
    try {
      const result = await queryD1(`
        SELECT 
          id, 
          name, 
          image,
          image AS avatar_url, 
          position, 
          description,
          description AS bio, 
          createdAt,
          createdAt AS created_at 
        FROM authors 
        ORDER BY createdAt DESC
      `);
      res.json({
        success: true,
        authors: result.results || []
      });
    } catch (error: any) {
      console.error('Error fetching authors:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post('/api/authors', express.json(), async (req, res) => {
    console.log('POST /api/authors');
    if (!isD1Configured()) return res.status(503).json({ error: 'D1 not configured' });
    try {
      const author = req.body;
      if (!author.name) {
        return res.status(400).json({ error: 'Missing required fields: name' });
      }

      // Generate ID if not provided
      const authorId = author.id || Date.now().toString();

      await queryD1(
        `INSERT INTO authors (id, name, image, position, description) 
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           name = excluded.name,
           image = excluded.image,
           position = excluded.position,
           description = excluded.description`,
        [authorId, author.name, author.image, author.position, author.description]
      );
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error saving author:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/authors/:id', async (req, res) => {
    console.log('DELETE /api/authors', req.params.id);
    if (!isD1Configured()) return res.status(503).json({ error: 'D1 not configured' });
    try {
      await queryD1('DELETE FROM authors WHERE id = ?', [req.params.id]);
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error deleting author:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // --- Categories API ---

  app.get('/api/categories', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    console.log('GET /api/categories');
    if (!isD1Configured()) return res.json([]);
    try {
      const result = await queryD1('SELECT * FROM categories ORDER BY name ASC');
      res.json(result.results || []);
    } catch (error: any) {
      if (error.message.includes('no such table: categories')) {
          await initTable();
          const result = await queryD1('SELECT * FROM categories ORDER BY name ASC');
          return res.json(result.results || []);
      }
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/categories', async (req, res) => {
    if (!isD1Configured()) return res.status(503).json({ error: 'D1 not configured' });
    try {
      const category = req.body;
      const categoryId = category.id || `cat-${Date.now()}`;
      const sql = `
        INSERT INTO categories (id, name, slug, description)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          slug = excluded.slug,
          description = excluded.description,
          updatedAt = CURRENT_TIMESTAMP
      `;
      await queryD1(sql, [categoryId, category.name, category.slug, category.description]);
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error saving category:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/categories/:id', async (req, res) => {
    if (!isD1Configured()) return res.status(503).json({ error: 'D1 not configured' });
    try {
      await queryD1('DELETE FROM categories WHERE id = ?', [req.params.id]);
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error deleting category:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Initialize Table Route (One-time setup)
  app.post('/api/init-db', async (req, res) => {
    try {
      if (!isD1Configured()) {
        return res.status(400).json({ error: 'Cloudflare D1 is not configured. Cannot initialize remote DB.' });
      }
      const sql = `
        CREATE TABLE IF NOT EXISTS articles (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          content TEXT NOT NULL,
          excerpt TEXT,
          category TEXT,
          image TEXT,
          status TEXT CHECK(status IN ('published', 'draft', 'scheduled')),
          author TEXT,
          authorImage TEXT,
          authorPosition TEXT,
          authorDescription TEXT,
          date TEXT,
          metaTitle TEXT,
          metaDescription TEXT,
          metaKeywords TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `;
      await queryD1(sql);
      
      // Attempt to add columns if they don't exist (migrations)
      try { await queryD1(`ALTER TABLE articles ADD COLUMN authorImage TEXT;`); } catch (e) {}
      try { await queryD1(`ALTER TABLE articles ADD COLUMN authorPosition TEXT;`); } catch (e) {}
      try { await queryD1(`ALTER TABLE articles ADD COLUMN authorDescription TEXT;`); } catch (e) {}
      
      res.json({ success: true, message: 'Database initialized successfully' });
    } catch (error: any) {
      console.error('Error initializing database:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/proxy-image', async (req, res) => {
    const imageUrl = req.query.url as string;
    if (!imageUrl) {
      return res.status(400).send('URL is required');
    }

    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
      
      const contentType = response.headers.get('content-type');
      const buffer = await response.arrayBuffer();
      
      if (contentType) res.setHeader('Content-Type', contentType);
      res.send(Buffer.from(buffer));
    } catch (error: any) {
      console.error('Proxy image error:', error);
      res.status(500).send(error.message);
    }
  });

  // Robots.txt
  app.get('/robots.txt', (req, res) => {
    const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /dashboard
Disallow: /api/
Sitemap: https://hongkonglex.com/sitemap.xml`;
    res.header('Content-Type', 'text/plain');
    res.send(robots);
  });

  // Sitemap Index
  app.get('/sitemap.xml', (req, res) => {
    const DOMAIN = 'https://hongkonglex.com';
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${DOMAIN}/post-sitemap.xml</loc></sitemap>
  <sitemap><loc>${DOMAIN}/page-sitemap.xml</loc></sitemap>
  <sitemap><loc>${DOMAIN}/category-sitemap.xml</loc></sitemap>
  <sitemap><loc>${DOMAIN}/author-sitemap.xml</loc></sitemap>
</sitemapindex>`;
    res.header('Content-Type', 'application/xml');
    res.send(sitemapIndex);
  });

  // Post Sitemap
  app.get('/post-sitemap.xml', async (req, res) => {
    const DOMAIN = 'https://hongkonglex.com';
    const today = new Date().toISOString().split('T')[0];
    
    let articles: any[] = [];
    try {
      if (!isD1Configured()) {
        articles = await getLocalArticles();
      } else {
        const result = await queryD1('SELECT slug, date, status FROM articles WHERE status = ?', ['published']);
        articles = result.results || [];
      }
    } catch (error) {
      console.error('Error fetching articles for post-sitemap:', error);
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${articles.map(article => `  <url>
    <loc>${DOMAIN}/${article.slug || article.title.replace(/\s+/g, '-').toLowerCase()}</loc>
    <lastmod>${article.date || today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;
    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  });

  // Page Sitemap
  app.get('/page-sitemap.xml', async (req, res) => {
    const DOMAIN = 'https://hongkonglex.com';
    const today = new Date().toISOString().split('T')[0];
    
    let dynamicPages: any[] = [];
    try {
      if (isD1Configured()) {
        const result = await queryD1('SELECT slug FROM pages WHERE status = ?', ['published']);
        dynamicPages = result.results || [];
      }
    } catch (error) {
      console.error('Error fetching dynamic pages:', error);
    }

    const staticRoutes = [
      { url: '/', priority: '1.0' },
      { url: '/features', priority: '0.9' },
      { url: '/baccarat', priority: '0.9' },
      { url: '/promotions', priority: '0.9' },
      { url: '/articles', priority: '0.9' },
      { url: '/faq', priority: '0.8' },
      { url: '/contact', priority: '0.8' },
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes.map(route => `  <url>
    <loc>${DOMAIN}${route.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
${dynamicPages.map(p => `  <url>
    <loc>${DOMAIN}/${p.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`;
    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  });

  // Category Sitemap
  app.get('/category-sitemap.xml', async (req, res) => {
    const DOMAIN = 'https://hongkonglex.com';
    const today = new Date().toISOString().split('T')[0];
    
    let categoryData: {name: string, slug: string}[] = [];
    try {
      if (isD1Configured()) {
        const result = await queryD1('SELECT name, slug FROM categories');
        if (result.results && result.results.length > 0) {
          categoryData = result.results as any;
        } else {
          // Fallback if categories table is empty
          const artResult = await queryD1('SELECT DISTINCT category FROM articles WHERE category IS NOT NULL AND status = "published"');
          categoryData = (artResult.results || []).map((r: any) => ({ name: r.category, slug: r.category }));
        }
      } else {
        const result = await getLocalArticles();
        const cats = [...new Set(result.map(a => a.category).filter(Boolean))] as string[];
        categoryData = cats.map(c => ({ name: c, slug: CATEGORY_MAP[c] || c }));
      }
    } catch (error) {
      console.error('Error fetching categories for category-sitemap:', error);
    }
    
    if (categoryData.length === 0) {
      categoryData = Object.entries(CATEGORY_MAP).map(([name, slug]) => ({ name, slug }));
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${categoryData.map(cat => `  <url>
    <loc>${DOMAIN}/category/${encodeURI(cat.slug || cat.name)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`.replace(/>\n\s*</g, '><');
    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  });

  // Author Sitemap
  app.get('/author-sitemap.xml', async (req, res) => {
    const DOMAIN = 'https://hongkonglex.com';
    const today = new Date().toISOString().split('T')[0];
    
    let authors: any[] = [];
    try {
      if (isD1Configured()) {
        const result = await queryD1('SELECT id FROM authors');
        authors = result.results || [];
      }
    } catch (error) {
      console.error('Error fetching authors for author-sitemap:', error);
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${authors.map(author => `  <url>
    <loc>${DOMAIN}/author/${author.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`).join('\n')}
</urlset>`;
    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
    
    // SPA Fallback for development
    app.get('*all', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = await fs.readFile(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        const seoResult = await injectSEO(template, url);
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.status(seoResult.statusCode).set({ 'Content-Type': 'text/html' }).end(seoResult.html);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', async (req, res) => {
      try {
        let template = await fs.readFile(path.join(distPath, 'index.html'), 'utf-8');
        const seoResult = await injectSEO(template, req.originalUrl);
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.status(seoResult.statusCode).set({ 'Content-Type': 'text/html' }).send(seoResult.html);
      } catch (error) {
        res.status(404).sendFile(path.join(distPath, 'index.html'));
      }
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  server.on('error', (error: any) => {
    console.error('Server error:', error);
  });

  // Proactively initialize database if configured
  if (isD1Configured()) {
    initTable().catch(e => console.error('Early DB init error:', e));
  }
}

startServer();
