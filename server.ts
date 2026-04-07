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
        date TEXT,
        metaTitle TEXT,
        metaDescription TEXT,
        metaKeywords TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await queryD1(sql);
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
        INSERT INTO articles (id, title, slug, content, excerpt, category, image, status, author, date, metaTitle, metaDescription, metaKeywords)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          title = excluded.title,
          slug = excluded.slug,
          content = excluded.content,
          excerpt = excluded.excerpt,
          category = excluded.category,
          image = excluded.image,
          status = excluded.status,
          author = excluded.author,
          date = excluded.date,
          metaTitle = excluded.metaTitle,
          metaDescription = excluded.metaDescription,
          metaKeywords = excluded.metaKeywords
      `;
      const params = [
        article.id, article.title, article.slug, article.content, article.excerpt,
        article.category, article.image, article.status, article.author, article.date,
        article.metaTitle, article.metaDescription, article.metaKeywords
      ];
      
      try {
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
          date TEXT,
          metaTitle TEXT,
          metaDescription TEXT,
          metaKeywords TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `;
      await queryD1(sql);
      res.json({ success: true, message: 'Database initialized successfully' });
    } catch (error: any) {
      console.error('Error initializing database:', error);
      res.status(500).json({ error: error.message });
    }
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
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  server.on('error', (error: any) => {
    console.error('Server error:', error);
  });
}

startServer();
