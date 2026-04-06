import { drizzle } from 'drizzle-orm/d1';
import { eq, desc, and } from 'drizzle-orm';
import { articles, articleViews, settings } from './schema';

export interface Env {
  DB: D1Database;
}

function cors(body: string, status = 200, contentType = 'application/json') {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

function json(data: unknown, status = 200) {
  return cors(JSON.stringify(data), status);
}

function err(msg: string, status = 400) {
  return json({ error: msg }, status);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') return cors('', 204);

    const db  = drizzle(env.DB);
    const url = new URL(request.url);
    const { pathname } = url;

    // ── GET /api/articles ─────────────────────────────────────
    if (pathname === '/api/articles' && request.method === 'GET') {
      const statusFilter = url.searchParams.get('status');
      const rows = await db
        .select()
        .from(articles)
        .where(
          statusFilter && statusFilter !== 'all'
            ? eq(articles.status, statusFilter as any)
            : undefined,
        )
        .orderBy(desc(articles.createdAt))
        .all();
      return json(rows);
    }

    // ── POST /api/articles ────────────────────────────────────
    if (pathname === '/api/articles' && request.method === 'POST') {
      const body = await request.json<any>();
      const now  = Math.floor(Date.now() / 1000);

      const row = {
        id:              body.id ?? crypto.randomUUID(),
        title:           body.title ?? '',
        slug:            body.slug  ?? body.title?.toLowerCase().replace(/\s+/g, '-') ?? '',
        content:         body.content ?? '',
        excerpt:         body.excerpt ?? '',
        category:        body.category ?? '',
        image:           body.image ?? '',
        status:          body.status ?? 'draft',
        author:          body.author ?? 'Admin',
        date:            body.date   ?? new Date().toISOString().split('T')[0],
        metaTitle:       body.metaTitle ?? '',
        metaDescription: body.metaDescription ?? '',
        metaKeywords:    body.metaKeywords ?? '',
        createdAt:       now,
        updatedAt:       now,
      };

      await db
        .insert(articles)
        .values(row)
        .onConflictDoUpdate({
          target: articles.id,
          set: {
            title:           row.title,
            slug:            row.slug,
            content:         row.content,
            excerpt:         row.excerpt,
            category:        row.category,
            image:           row.image,
            status:          row.status,
            author:          row.author,
            date:            row.date,
            metaTitle:       row.metaTitle,
            metaDescription: row.metaDescription,
            metaKeywords:    row.metaKeywords,
            updatedAt:       now,
          },
        });

      return json({ success: true, id: row.id });
    }

    // ── DELETE /api/articles/:id ──────────────────────────────
    const delMatch = pathname.match(/^\/api\/articles\/(.+)$/);
    if (delMatch && request.method === 'DELETE') {
      const id = delMatch[1];
      await db.delete(articles).where(eq(articles.id, id));
      return json({ success: true });
    }

    // ── POST /api/track-view ──────────────────────────────────
    if (pathname === '/api/track-view' && request.method === 'POST') {
      const body = await request.json<{ articleId: string }>();
      const ip   = request.headers.get('CF-Connecting-IP') ?? '';
      const hash = await crypto.subtle
        .digest('SHA-256', new TextEncoder().encode(ip))
        .then((b) => btoa(String.fromCharCode(...new Uint8Array(b))).slice(0, 16));

      await db.insert(articleViews).values({
        articleId: body.articleId,
        ipHash:    hash,
      });
      return json({ success: true });
    }

    // ── POST /api/init-db ─────────────────────────────────────
    if (pathname === '/api/init-db' && request.method === 'POST') {
      await env.DB.exec(`
        CREATE TABLE IF NOT EXISTS articles (
          id TEXT PRIMARY KEY, title TEXT NOT NULL, slug TEXT NOT NULL UNIQUE,
          content TEXT NOT NULL DEFAULT '', excerpt TEXT NOT NULL DEFAULT '',
          category TEXT NOT NULL DEFAULT '', image TEXT NOT NULL DEFAULT '',
          status TEXT NOT NULL DEFAULT 'draft'
            CHECK (status IN ('published','draft','scheduled')),
          author TEXT NOT NULL DEFAULT 'Admin', date TEXT NOT NULL,
          meta_title TEXT NOT NULL DEFAULT '', meta_description TEXT NOT NULL DEFAULT '',
          meta_keywords TEXT NOT NULL DEFAULT '',
          created_at INTEGER NOT NULL DEFAULT (unixepoch()),
          updated_at INTEGER NOT NULL DEFAULT (unixepoch())
        );
        CREATE TABLE IF NOT EXISTS admin_users (
          id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'admin'
            CHECK (role IN ('super_admin','admin','editor')),
          last_login INTEGER,
          created_at INTEGER NOT NULL DEFAULT (unixepoch())
        );
        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY, value TEXT NOT NULL DEFAULT '',
          type TEXT NOT NULL DEFAULT 'string'
            CHECK (type IN ('string','number','boolean','json')),
          updated_at INTEGER NOT NULL DEFAULT (unixepoch())
        );
        CREATE TABLE IF NOT EXISTS article_views (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          article_id TEXT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
          ip_hash TEXT NOT NULL DEFAULT '',
          viewed_at INTEGER NOT NULL DEFAULT (unixepoch())
        );
        CREATE INDEX IF NOT EXISTS idx_articles_status   ON articles (status);
        CREATE INDEX IF NOT EXISTS idx_articles_category ON articles (category);
        CREATE INDEX IF NOT EXISTS idx_articles_date     ON articles (date DESC);
        CREATE INDEX IF NOT EXISTS idx_articles_slug     ON articles (slug);
        CREATE INDEX IF NOT EXISTS idx_views_article     ON article_views (article_id);
        INSERT OR IGNORE INTO settings (key, value, type) VALUES
          ('site_name','Bocker168','string'),
          ('maintenance_mode','false','boolean'),
          ('articles_per_page','9','number'),
          ('default_og_image','','string');
      `);
      return json({ success: true });
    }

    // ── GET /api/config-status ────────────────────────────────
    if (pathname === '/api/config-status') {
      return json({ d1Configured: true, fallbackMode: false });
    }

    return err('Not found', 404);
  },
};
