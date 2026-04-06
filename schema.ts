import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ============================================================
// articles
// ============================================================
export const articles = sqliteTable(
  'articles',
  {
    id:               text('id').primaryKey(),
    title:            text('title').notNull(),
    slug:             text('slug').notNull().unique(),
    content:          text('content').notNull().default(''),
    excerpt:          text('excerpt').notNull().default(''),
    category:         text('category').notNull().default(''),
    image:            text('image').notNull().default(''),
    status:           text('status', { enum: ['published', 'draft', 'scheduled'] })
                        .notNull().default('draft'),
    author:           text('author').notNull().default('Admin'),
    date:             text('date').notNull(),
    metaTitle:        text('meta_title').notNull().default(''),
    metaDescription:  text('meta_description').notNull().default(''),
    metaKeywords:     text('meta_keywords').notNull().default(''),
    createdAt:        integer('created_at').notNull().default(sql`(unixepoch())`),
    updatedAt:        integer('updated_at').notNull().default(sql`(unixepoch())`),
  },
  (t) => ({
    statusIdx:   index('idx_articles_status').on(t.status),
    categoryIdx: index('idx_articles_category').on(t.category),
    dateIdx:     index('idx_articles_date').on(t.date),
    slugIdx:     index('idx_articles_slug').on(t.slug),
  }),
);

// ============================================================
// admin_users
// ============================================================
export const adminUsers = sqliteTable('admin_users', {
  id:           integer('id').primaryKey({ autoIncrement: true }),
  username:     text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role:         text('role', { enum: ['super_admin', 'admin', 'editor'] })
                  .notNull().default('admin'),
  lastLogin:    integer('last_login'),
  createdAt:    integer('created_at').notNull().default(sql`(unixepoch())`),
});

// ============================================================
// settings
// ============================================================
export const settings = sqliteTable('settings', {
  key:       text('key').primaryKey(),
  value:     text('value').notNull().default(''),
  type:      text('type', { enum: ['string', 'number', 'boolean', 'json'] })
               .notNull().default('string'),
  updatedAt: integer('updated_at').notNull().default(sql`(unixepoch())`),
});

// ============================================================
// article_views
// ============================================================
export const articleViews = sqliteTable(
  'article_views',
  {
    id:        integer('id').primaryKey({ autoIncrement: true }),
    articleId: text('article_id').notNull().references(() => articles.id, { onDelete: 'cascade' }),
    ipHash:    text('ip_hash').notNull().default(''),
    viewedAt:  integer('viewed_at').notNull().default(sql`(unixepoch())`),
  },
  (t) => ({
    articleIdx: index('idx_views_article').on(t.articleId),
    timeIdx:    index('idx_views_time').on(t.viewedAt),
  }),
);

// ============================================================
// Inferred Types
// ============================================================
export type Article      = typeof articles.$inferSelect;
export type NewArticle   = typeof articles.$inferInsert;
export type AdminUser    = typeof adminUsers.$inferSelect;
export type Setting      = typeof settings.$inferSelect;
export type ArticleView  = typeof articleViews.$inferSelect;
