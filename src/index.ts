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
  authorImage: text('authorImage'),
  authorPosition: text('authorPosition'),
  authorDescription: text('authorDescription'),
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
  R2_IMAGES: R2Bucket;
  R2_PUBLIC_URL: string;
  KEYWORDS_EVERYWHERE_API_KEY?: string;
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
              INSERT INTO articles (id, title, slug, content, excerpt, category, image, status, author, authorImage, authorPosition, authorDescription, date, metaTitle, metaDescription, metaKeywords)
              VALUES (${article.id}, ${article.title}, ${article.slug}, ${article.content}, ${article.excerpt}, ${article.category}, ${article.image}, ${article.status}, ${article.author}, ${article.authorImage}, ${article.authorPosition}, ${article.authorDescription}, ${article.date}, ${article.metaTitle}, ${article.metaDescription}, ${article.metaKeywords})
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

        // Route to list R2 images
        if (url.pathname === '/api/r2/images' && request.method === 'GET') {
          try {
            if (!env.R2_IMAGES) {
              console.warn('R2 binding (R2_IMAGES) is missing. Returning empty image list.');
              return new Response(JSON.stringify([]), { 
                status: 200,
                headers: { 'Content-Type': 'application/json' }
              });
            }

            const publicUrl = env.R2_PUBLIC_URL || '';
            let formattedPublicUrl = publicUrl.trim();
            if (formattedPublicUrl && !/^https?:\/\//i.test(formattedPublicUrl)) {
              formattedPublicUrl = `https://${formattedPublicUrl}`;
            }

            const listed = await env.R2_IMAGES.list();
            
            const images = listed.objects
              .filter(obj => {
                const ext = obj.key?.toLowerCase().split('.').pop();
                return ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext || '');
              })
              .map(obj => ({
                key: obj.key,
                url: formattedPublicUrl && obj.key ? `${formattedPublicUrl.replace(/\/$/, '')}/${obj.key.split('/').map(encodeURIComponent).join('/')}` : null,
                size: obj.size,
                lastModified: obj.uploaded,
              }));

            return new Response(JSON.stringify(images), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          } catch (error: any) {
             return new Response(JSON.stringify({ error: error.message }), { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
             });
          }
        }

        // Route to upload image to R2
        if (url.pathname === '/api/upload-image' && request.method === 'POST') {
          try {
            if (!env.R2_IMAGES) {
               return new Response(JSON.stringify({ error: 'R2 bucket not bound' }), { status: 500, headers: { 'Content-Type': 'application/json' }});
            }

            const body = await request.json() as any;
            const { filename, base64 } = body;
            
            if (!filename || !base64) {
              return new Response(JSON.stringify({ error: 'Missing filename or base64' }), { status: 400, headers: { 'Content-Type': 'application/json' }});
            }

            const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
            const binaryString = atob(base64Data);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            const ext = filename.split('.').pop()?.toLowerCase();
            const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : ext === 'svg' ? 'image/svg+xml' : ext === 'gif' ? 'image/gif' : 'image/jpeg';
            const uniqueFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');

            await env.R2_IMAGES.put(uniqueFilename, bytes.buffer, {
               httpMetadata: { contentType: mimeType }
            });

            const publicUrl = env.R2_PUBLIC_URL || '';
            let formattedPublicUrl = publicUrl.trim();
            if (formattedPublicUrl && !/^https?:\/\//i.test(formattedPublicUrl)) {
              formattedPublicUrl = `https://${formattedPublicUrl}`;
            }

            const fileUrl = formattedPublicUrl ? `${formattedPublicUrl.replace(/\/$/, '')}/${uniqueFilename}` : `/${uniqueFilename}`;

            return new Response(JSON.stringify({ success: true, url: fileUrl }), {
               status: 200,
               headers: { 'Content-Type': 'application/json' }
            });
          } catch(error: any) {
             return new Response(JSON.stringify({ error: error.message }), { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
             });
          }
        }

        // Route to get keyword volume
        if (url.pathname === '/api/keywords-volume' && request.method === 'POST') {
          try {
            const apiKey = env.KEYWORDS_EVERYWHERE_API_KEY;
            if (!apiKey) {
               return new Response(JSON.stringify({ configured: false }), { status: 200, headers: { 'Content-Type': 'application/json' }});
            }

            const body = await request.json() as any;
            const { keywords } = body;
            
            if (!keywords || !Array.isArray(keywords)) {
              return new Response(JSON.stringify({ error: 'Keywords array required' }), { status: 400, headers: { 'Content-Type': 'application/json' }});
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
              body: params.toString()
            });

            if (response.ok) {
              const data = await response.json() as any;
              return new Response(JSON.stringify({ configured: true, data: data.data }), {
                 status: 200,
                 headers: { 'Content-Type': 'application/json' }
              });
            } else {
               const err = await response.text();
               return new Response(JSON.stringify({ error: err }), { 
                  status: response.status,
                  headers: { 'Content-Type': 'application/json' }
               });
            }
          } catch(error: any) {
             return new Response(JSON.stringify({ error: error.message }), { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
             });
          }
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
              authorImage TEXT,
              authorPosition TEXT,
              authorDescription TEXT,
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
          await db.run(sql`
            CREATE TABLE IF NOT EXISTS authors (
              id TEXT PRIMARY KEY,
              name TEXT NOT NULL,
              image TEXT,
              position TEXT,
              description TEXT,
              createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
          `);
          await db.run(sql`
            CREATE TABLE IF NOT EXISTS categories (
              id TEXT PRIMARY KEY,
              name TEXT NOT NULL,
              slug TEXT UNIQUE NOT NULL,
              description TEXT,
              createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
          `);

          // Attempt migrations for legacy DBs
          try { await db.run(sql`ALTER TABLE articles ADD COLUMN authorImage TEXT;`); } catch(e){}
          try { await db.run(sql`ALTER TABLE articles ADD COLUMN authorPosition TEXT;`); } catch(e){}
          try { await db.run(sql`ALTER TABLE articles ADD COLUMN authorDescription TEXT;`); } catch(e){}

          return Response.json({ success: true, message: 'Database initialized successfully' });
        }

        // --- Categories API ---
        if (url.pathname === '/api/categories') {
          if (request.method === 'GET') {
            try {
              const result = await env.DB.prepare('SELECT * FROM categories ORDER BY createdAt DESC').all();
              return Response.json(result.results || []);
            } catch (error: any) {
              if (error.message.includes('no such table')) return Response.json([]);
              return new Response(error.message, { status: 500 });
            }
          }
          if (request.method === 'POST') {
            try {
              const cat = await request.json() as any;
              await db.run(sql`
                INSERT INTO categories (id, name, slug, description)
                VALUES (${cat.id}, ${cat.name}, ${cat.slug}, ${cat.description})
                ON CONFLICT(id) DO UPDATE SET
                  name = excluded.name,
                  slug = excluded.slug,
                  description = excluded.description
              `);
              return Response.json({ success: true });
            } catch (error: any) {
              return new Response(error.message, { status: 500 });
            }
          }
        }
        if (url.pathname.startsWith('/api/categories/') && request.method === 'DELETE') {
          const id = url.pathname.split('/').pop();
          if (id) {
            await db.run(sql`DELETE FROM categories WHERE id = ${id}`);
            return Response.json({ success: true });
          }
        }

        // --- Authors API ---
        if (url.pathname === '/api/authors') {
          if (request.method === 'GET') {
            try {
              const result = await env.DB.prepare(`
                SELECT 
                  id, name, image, position, description, createdAt,
                  image as avatar_url,
                  description as bio,
                  createdAt as created_at
                FROM authors
                ORDER BY createdAt DESC
              `).all();
              return Response.json({ success: true, authors: result.results || [] });
            } catch (error: any) {
              if (error.message.includes('no such table')) return Response.json({ success: true, authors: [] });
              return new Response(error.message, { status: 500 });
            }
          }
          if (request.method === 'POST') {
            try {
              const author = await request.json() as any;
              await db.run(sql`
                INSERT INTO authors (id, name, image, position, description)
                VALUES (${author.id}, ${author.name}, ${author.image}, ${author.position}, ${author.description})
                ON CONFLICT(id) DO UPDATE SET
                  name = excluded.name,
                  image = excluded.image,
                  position = excluded.position,
                  description = excluded.description
              `);
              return Response.json({ success: true });
            } catch (error: any) {
              return new Response(error.message, { status: 500 });
            }
          }
        }
        if (url.pathname.startsWith('/api/authors/') && request.method === 'DELETE') {
          const id = url.pathname.split('/').pop();
          if (id) {
            await db.run(sql`DELETE FROM authors WHERE id = ${id}`);
            return Response.json({ success: true });
          }
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
      // Sitemap Index
      if (url.pathname === '/sitemap.xml') {
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${url.origin}/post-sitemap.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${url.origin}/page-sitemap.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${url.origin}/category-sitemap.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${url.origin}/author-sitemap.xml</loc>
  </sitemap>
</sitemapindex>`.trim();
        return new Response(xml, { headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'public, max-age=3600' } });
      }

      // Individual Sitemaps
      if (url.pathname === '/post-sitemap.xml') {
        const allArticles = await db.select().from(articles).where(eq(articles.status, 'published')).all();
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allArticles.map(article => `
  <url>
    <loc>${url.origin}/${article.slug || article.title.replace(/\s+/g, '-').toLowerCase()}</loc>
    <lastmod>${article.updatedAt ? article.updatedAt.split(' ')[0] : (article.date ? new Date(article.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0])}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`.trim();
        return new Response(xml, { headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'public, max-age=3600' } });
      }

      if (url.pathname === '/page-sitemap.xml') {
        const allPages = await db.select().from(pages).where(eq(pages.status, 'published')).all();
        const today = new Date().toISOString().split('T')[0];
        
        const staticRoutes = [
          { loc: '/', priority: '1.0', changefreq: 'daily' },
          { loc: '/articles', priority: '0.9', changefreq: 'daily' },
          { loc: '/promotions', priority: '0.8', changefreq: 'weekly' },
          { loc: '/faq', priority: '0.7', changefreq: 'weekly' },
          { loc: '/contact', priority: '0.7', changefreq: 'monthly' },
        ];

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticRoutes.map(route => `
  <url>
    <loc>${url.origin}${route.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('')}
  ${allPages.map(page => `
  <url>
    <loc>${url.origin}/${page.slug}</loc>
    <lastmod>${page.updatedAt ? page.updatedAt.split(' ')[0] : today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`.trim();
        return new Response(xml, { headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'public, max-age=3600' } });
      }
      
      if (url.pathname === '/category-sitemap.xml') {
        let xml = '';
        const today = new Date().toISOString().split('T')[0];
        try {
          const result = await env.DB.prepare('SELECT name, slug FROM categories').all();
          if (result.results && result.results.length > 0) {
            const categoryData = result.results as { name: string, slug: string }[];
            xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${categoryData.map(cat => `
  <url>
    <loc>${url.origin}/category/${encodeURIComponent(cat.slug || cat.name)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
</urlset>`.trim();
          }
        } catch (e) {}

        if (!xml) {
          const CATEGORY_MAP: Record<string, string> = {
            'บาคาร่า': 'baccarat',
            'วิธีเล่นเบื้องต้น': 'beginner-guide',
            'สูตรบาคาร่า': 'baccarat-strategy',
            'ทริคระดับเซียน': 'expert-tips',
            'ข่าวสารคาสิโน': 'casino-news',
            'เทคนิคการเดินเงิน': 'money-management',
            'เคล็ดลับการเล่น': 'playing-tips'
          };
          const allArticles = await db.select().from(articles).where(eq(articles.status, 'published')).all();
          const categories = Array.from(new Set(allArticles.map(a => a.category).filter(Boolean)));
          xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${categories.map(cat => {
    const slug = CATEGORY_MAP[cat as string] || cat as string;
    return `
  <url>
    <loc>${url.origin}/category/${encodeURIComponent(slug)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }).join('')}
</urlset>`.trim();
        }
        return new Response(xml, { headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'public, max-age=3600' } });
      }

      if (url.pathname === '/author-sitemap.xml') {
        const result = await env.DB.prepare(`SELECT DISTINCT author FROM articles WHERE status = 'published'`).all();
        const authors = (result.results || []).map((r: any) => r.author).filter(Boolean);
        const today = new Date().toISOString().split('T')[0];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${authors.map(author => `
  <url>
    <loc>${url.origin}/author/${encodeURIComponent(author as string)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
</urlset>`.trim();
        return new Response(xml, { headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'public, max-age=3600' } });
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
