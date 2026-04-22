import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ARTICLES_FILE = path.join(process.cwd(), 'articles_local.json');

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

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

  const injectSEO = async (template: string, url: string) => {
    const articleMatch = url.match(/\/article\/([^\/\?]+)/);
    const slug = articleMatch ? articleMatch[1] : null;
    
    let title = "บาคาร่าออนไลน์ Bocker168 เว็บตรงไม่ผ่านเอเย่นต์ ฝากถอนไม่มีขั้นต่ำ";
    let description = "Bocker168 บาคาร่าเว็บตรงไม่ผ่านเอเย่นต์ อันดับ 1 ฝากถอนออโต้ไม่มีขั้นต่ำ รองรับทรูวอเลท (True Wallet) คาสิโนสด SA Gaming, Sexy Baccarat สมัครวันนี้รับโปรโมชั่นพิเศษ";
    let keywords = "Bocker168, บาคาร่า, บาคาร่าออนไลน์, บาคาร่าเว็บตรง, สมัครบาคาร่า, บาคาร่าทรูวอเลท, บาคาร่าไม่มีขั้นต่ำ, คาสิโนออนไลน์, SA Gaming, Sexy Baccarat, เว็บบาคาร่าอันดับ1";
    let canonical = `https://hongkonglex.com${url.split('?')[0]}`;
    let ogType = "website";

    let bodyContent = "";

    const jsonLd = [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://hongkonglex.com/#website",
        "url": "https://hongkonglex.com/",
        "name": "Bocker168",
        "alternateName": "บาคาร่าออนไลน์ Bocker168",
        "description": "เว็บไซต์บาคาร่าออนไลน์อันดับ 1 เว็บตรงไม่ผ่านเอเย่นต์ ปลอดภัย 100% ฝากถอนออโต้ ไม่มีขั้นต่ำ",
        "inLanguage": "th-TH"
      },
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": "https://hongkonglex.com/#organization",
        "name": "Bocker168",
        "url": "https://hongkonglex.com/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://img2.pic.in.th/A2-Logo-Bocker-168.png"
        },
        "sameAs": [
          "https://www.facebook.com/bocker168",
          "https://line.me/R/ti/p/@bocker168"
        ]
      }
    ];

    if (slug) {
      const article = await getArticleBySlug(slug);
      if (article) {
        title = article.metaTitle || article.title;
        description = article.metaDescription || article.excerpt || description;
        keywords = article.metaKeywords || keywords;
        ogType = "article";
        bodyContent = `
          <div style="display:none">
            <h1>${article.title}</h1>
            <p>${article.excerpt || ''}</p>
          </div>
        `;
        jsonLd.push({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": article.title,
          "description": article.metaDescription || article.excerpt,
          "image": article.image,
          "author": {
            "@type": "Person",
            "name": "Bocker168 Admin",
            "url": "https://hongkonglex.com"
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
        } as any);
      }
    }

    return template
      .replace('<div id="root"></div>', `<div id="root">${bodyContent}</div>`)
      .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
      .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${description}" />`)
      .replace(/<meta name="keywords" content=".*?" \/>/, `<meta name="keywords" content="${keywords}" />`)
      .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${title}" />`)
      .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${description}" />`)
      .replace(/<meta property="og:type" content=".*?" \/>/, `<meta property="og:type" content="${ogType}" />`)
      .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${canonical}" />`)
      .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${canonical}" />`)
      .replace('</head>', `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n</head>`);
  };

  // API Routes
  app.get('/api/config-status', (req, res) => {
    res.json({
      d1Configured: isD1Configured(),
      fallbackMode: !isD1Configured()
    });
  });

  app.get('/api/articles', async (req, res) => {
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

  // --- Authors API ---

  app.get('/api/authors', async (req, res) => {
    console.log('GET /api/authors');
    if (!isD1Configured()) return res.json([]);
    try {
      const result = await queryD1('SELECT * FROM authors ORDER BY name ASC');
      res.json(result.results || []);
    } catch (error: any) {
      console.error('Error fetching authors:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/authors', express.json(), async (req, res) => {
    console.log('POST /api/authors');
    if (!isD1Configured()) return res.status(503).json({ error: 'D1 not configured' });
    try {
      const author = req.body;
      if (!author.id || !author.name) {
        return res.status(400).json({ error: 'Missing required fields: id, name' });
      }

      await queryD1(
        `INSERT INTO authors (id, name, image, position, description) 
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           name = excluded.name,
           image = excluded.image,
           position = excluded.position,
           description = excluded.description`,
        [author.id, author.name, author.image, author.position, author.description]
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
          date TEXT,
          metaTitle TEXT,
          metaDescription TEXT,
          metaKeywords TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `;
      await queryD1(sql);
      
      // Attempt to add authorImage column if it doesn't exist
      try {
        await queryD1(`ALTER TABLE articles ADD COLUMN authorImage TEXT;`);
      } catch (e) {
        // Ignore error
      }
      
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

  app.get('/sitemap.xml', async (req, res) => {
    const DOMAIN = 'https://hongkonglex.com';
    const today = new Date().toISOString().split('T')[0];
    
    const staticRoutes = [
      { url: '/', priority: '1.0' },
      { url: '/features', priority: '0.9' },
      { url: '/baccarat', priority: '0.9' },
      { url: '/promotions', priority: '0.9' },
      { url: '/articles', priority: '0.9' },
      { url: '/faq', priority: '0.8' },
      { url: '/contact', priority: '0.8' },
      { url: '/register-guide', priority: '0.8' },
      { url: '/deposit-withdraw-guide', priority: '0.8' },
      { url: '/terms', priority: '0.7' },
      { url: '/privacy', priority: '0.7' },
      { url: '/cookies', priority: '0.7' },
      { url: '/responsible-gambling', priority: '0.7' },
    ];

    let articles: any[] = [];
    try {
      if (!isD1Configured()) {
        articles = await getLocalArticles();
      } else {
        const result = await queryD1('SELECT slug, date FROM articles');
        articles = result.results || [];
      }
    } catch (error) {
      console.error('Error fetching articles for sitemap:', error);
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes.map(route => `  <url>
    <loc>${DOMAIN}${route.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
${articles.map(article => `  <url>
    <loc>${DOMAIN}/article/${article.slug}</loc>
    <lastmod>${article.date || today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    
    // SPA Fallback for development
    app.get('*all', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = await fs.readFile(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        template = await injectSEO(template, url);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
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
        template = await injectSEO(template, req.originalUrl);
        res.status(200).set({ 'Content-Type': 'text/html' }).send(template);
      } catch (error) {
        res.sendFile(path.join(distPath, 'index.html'));
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
