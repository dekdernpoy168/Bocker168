import { drizzle } from 'drizzle-orm/d1';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql, eq, desc } from 'drizzle-orm';

// 1) Define the tables
const articles = sqliteTable('articles', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  category: text('category'),
  image: text('image'),
  status: text('status'), // 'published', 'draft', 'scheduled'
  author: text('author'),
  date: text('date'),
  metaTitle: text('metaTitle'),
  metaDescription: text('metaDescription'),
  metaKeywords: text('metaKeywords'),
  createdAt: text('createdAt').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updatedAt').default(sql`CURRENT_TIMESTAMP`),
});

const pages = sqliteTable('pages', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  image: text('image'),
  status: text('status'), // 'published', 'draft', 'scheduled'
  metaTitle: text('metaTitle'),
  metaDescription: text('metaDescription'),
  createdAt: text('createdAt').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updatedAt').default(sql`CURRENT_TIMESTAMP`),
});

// 2) Describe your Env interface
export interface Env {
  DB: D1Database;
  ASSETS: { fetch: (request: Request) => Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env) {
    try {
      if (!env.DB) {
        return new Response("D1 Database binding 'DB' is missing. Please check your wrangler.jsonc/toml.", { status: 500 });
      }

      const db = drizzle(env.DB);
      const url = new URL(request.url);

      // API Routes
      if (url.pathname.startsWith('/api/')) {
        // Route to get all articles
        if (url.pathname === '/api/articles' && request.method === 'GET') {
          try {
            const allArticles = await db.select().from(articles).orderBy(desc(articles.date)).limit(100).all();
            return Response.json(allArticles);
          } catch (error: any) {
            if (error.message.includes('no such table')) {
               return Response.json([]);
            }
            return new Response(error.message, { status: 500 });
          }
        }

        // Route to get all pages
        if (url.pathname === '/api/pages' && request.method === 'GET') {
          try {
            const allPages = await db.select().from(pages).orderBy(desc(pages.createdAt)).limit(100).all();
            return Response.json(allPages);
          } catch (error: any) {
            if (error.message.includes('no such table')) {
               return Response.json([]);
            }
            return new Response(error.message, { status: 500 });
          }
        }

        // Route to add/update an article
        if (url.pathname === '/api/articles' && request.method === 'POST') {
          try {
            const article = await request.json() as any;
            
            await db.run(sql`
              INSERT INTO articles (id, title, slug, content, excerpt, category, image, status, author, date, metaTitle, metaDescription, metaKeywords)
              VALUES (${article.id}, ${article.title}, ${article.slug}, ${article.content}, ${article.excerpt}, ${article.category}, ${article.image}, ${article.status}, ${article.author}, ${article.date}, ${article.metaTitle}, ${article.metaDescription}, ${article.metaKeywords})
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
                metaKeywords = excluded.metaKeywords,
                updatedAt = CURRENT_TIMESTAMP
            `);
            
            return Response.json({ success: true });
          } catch (error: any) {
            return new Response(error.message, { status: 500 });
          }
        }

        // Route to add/update a page
        if (url.pathname === '/api/pages' && request.method === 'POST') {
          try {
            const pageData = await request.json() as any;
            
            await db.run(sql`
              INSERT INTO pages (id, title, slug, content, excerpt, image, status, metaTitle, metaDescription)
              VALUES (${pageData.id}, ${pageData.title}, ${pageData.slug}, ${pageData.content}, ${pageData.excerpt}, ${pageData.image}, ${pageData.status}, ${pageData.metaTitle}, ${pageData.metaDescription})
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
            `);
            
            return Response.json({ success: true });
          } catch (error: any) {
            return new Response(error.message, { status: 500 });
          }
        }

        // Route to delete an article
        if (url.pathname.startsWith('/api/articles/') && request.method === 'DELETE') {
          const id = url.pathname.split('/').pop();
          if (id) {
            await db.delete(articles).where(eq(articles.id, id)).run();
            return Response.json({ success: true });
          }
          return new Response('ID missing', { status: 400 });
        }

        // Route to delete a page
        if (url.pathname.startsWith('/api/pages/') && request.method === 'DELETE') {
          const id = url.pathname.split('/').pop();
          if (id) {
            await db.delete(pages).where(eq(pages.id, id)).run();
            return Response.json({ success: true });
          }
          return new Response('ID missing', { status: 400 });
        }

        // Route to check config status
        if (url.pathname === '/api/config-status') {
          return Response.json({ d1Configured: true, fallbackMode: false });
        }

        // Route to initialize the database
        if (url.pathname === '/api/init-db' && request.method === 'POST') {
          await db.run(sql`
            CREATE TABLE IF NOT EXISTS articles (
              id TEXT PRIMARY KEY,
              title TEXT NOT NULL,
              slug TEXT UNIQUE NOT NULL,
              content TEXT NOT NULL,
              excerpt TEXT,
              category TEXT,
              image TEXT,
              status TEXT,
              author TEXT,
              date TEXT,
              metaTitle TEXT,
              metaDescription TEXT,
              metaKeywords TEXT,
              createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
              updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
          `);
          await db.run(sql`
            CREATE TABLE IF NOT EXISTS pages (
              id TEXT PRIMARY KEY,
              title TEXT NOT NULL,
              slug TEXT UNIQUE NOT NULL,
              content TEXT NOT NULL,
              excerpt TEXT,
              image TEXT,
              status TEXT,
              metaTitle TEXT,
              metaDescription TEXT,
              createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
              updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
          `);
          return Response.json({ success: true, message: 'Database initialized successfully' });
        }
      }

      // Route to handle IndexNow requests
      if (url.pathname === '/IndexNow' && request.method === 'POST') {
        try {
          const body = await request.json() as any;
          const { host, key, keyLocation, urlList } = body;

          if (!host || !key || !urlList) {
            return new Response('Missing required fields: host, key, or urlList', { status: 400 });
          }

          const indexNowResponse = await fetch('https://api.indexnow.org/indexnow', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify({
              host,
              key,
              keyLocation,
              urlList,
            }),
          });

          if (indexNowResponse.ok) {
            return new Response('IndexNow submission successful', { status: 200 });
          } else {
            const errorText = await indexNowResponse.text();
            return new Response(`IndexNow submission failed: ${errorText}`, { status: indexNowResponse.status });
          }
        } catch (error) {
          return new Response(`Error processing IndexNow request: ${error instanceof Error ? error.message : String(error)}`, { status: 500 });
        }
      }

      // Route to handle sitemap.xml
      if (url.pathname === '/sitemap.xml') {
        const allArticles = await db.select().from(articles).where(eq(articles.status, 'published')).all();
        
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${url.origin}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${allArticles.map(article => `
  <url>
    <loc>${url.origin}/article/${article.slug}</loc>
    <lastmod>${article.updatedAt ? article.updatedAt.split(' ')[0] : new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`;

        return new Response(xml, {
          headers: {
            'Content-Type': 'application/xml',
          },
        });
      }

      // SPA Fallback: If asset not found (404) and it's likely a navigation request
      // (doesn't look like a file with an extension), serve index.html
      const isNavRequest = !url.pathname.split('/').pop()?.includes('.');
      
      // Serve static assets
      if (env.ASSETS) {
        try {
          let response = await env.ASSETS.fetch(request);

          if (response.status === 404 && isNavRequest) {
            const indexUrl = new URL('/index.html', url.origin);
            const indexRequest = new Request(indexUrl, {
              method: 'GET',
              headers: request.headers,
            });
            response = await env.ASSETS.fetch(indexRequest);
            
            if (response.status === 404) {
              return new Response(`SPA Fallback Error: index.html not found in assets. Path: ${url.pathname}`, { status: 404 });
            }
          }
          return response;
        } catch (assetError: any) {
          // If ASSETS.fetch fails, it might be because the environment is not fully ready
          // or the binding is not working as expected.
          return new Response(`Asset Fetch Error: ${assetError.message}`, { status: 500 });
        }
      }

      // If we reach here, it means env.ASSETS is missing or we couldn't serve the request
      return new Response(`Worker running. Path: ${url.pathname}. Method: ${request.method}. env.ASSETS is ${env.ASSETS ? 'defined' : 'undefined'}. Please ensure your deployment is configured correctly for static assets.`, { status: 404 });
    } catch (globalError: any) {
      return new Response(`Global Worker Error: ${globalError.message}\n${globalError.stack}`, { status: 500 });
    }
  },
  async queue(batch: MessageBatch<any>, env: Env): Promise<void> {
    console.log(`Processing ${batch.messages.length} messages from queue: ${batch.queue}`);
    for (const message of batch.messages) {
      console.log(`Processing message ${message.id}:`, message.body);
      // Here you can add logic to save to D1 or perform background tasks
      // Example: 
      // const db = drizzle(env.DB);
      // await db.insert(logs).values({ ...message.body });
      
      message.ack(); // Acknowledge message processing
    }
  },
};
