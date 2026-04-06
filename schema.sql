-- Bocker168 D1 Database Schema
-- Run: wrangler d1 execute bmg-database --file=schema.sql

-- ============================================================
-- 1. articles
-- ============================================================
CREATE TABLE IF NOT EXISTS articles (
  id            TEXT        PRIMARY KEY,
  title         TEXT        NOT NULL,
  slug          TEXT        NOT NULL UNIQUE,
  content       TEXT        NOT NULL DEFAULT '',
  excerpt       TEXT        NOT NULL DEFAULT '',
  category      TEXT        NOT NULL DEFAULT '',
  image         TEXT        NOT NULL DEFAULT '',
  status        TEXT        NOT NULL DEFAULT 'draft'
                            CHECK (status IN ('published', 'draft', 'scheduled')),
  author        TEXT        NOT NULL DEFAULT 'Admin',
  date          TEXT        NOT NULL,
  meta_title    TEXT        NOT NULL DEFAULT '',
  meta_description TEXT     NOT NULL DEFAULT '',
  meta_keywords TEXT        NOT NULL DEFAULT '',
  created_at    INTEGER     NOT NULL DEFAULT (unixepoch()),
  updated_at    INTEGER     NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_articles_status   ON articles (status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles (category);
CREATE INDEX IF NOT EXISTS idx_articles_date     ON articles (date DESC);
CREATE INDEX IF NOT EXISTS idx_articles_slug     ON articles (slug);

-- ============================================================
-- 2. admin_users
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id            INTEGER     PRIMARY KEY AUTOINCREMENT,
  username      TEXT        NOT NULL UNIQUE,
  password_hash TEXT        NOT NULL,
  role          TEXT        NOT NULL DEFAULT 'admin'
                            CHECK (role IN ('super_admin', 'admin', 'editor')),
  last_login    INTEGER,
  created_at    INTEGER     NOT NULL DEFAULT (unixepoch())
);

-- ============================================================
-- 3. settings  (key-value store for site config)
-- ============================================================
CREATE TABLE IF NOT EXISTS settings (
  key           TEXT        PRIMARY KEY,
  value         TEXT        NOT NULL DEFAULT '',
  type          TEXT        NOT NULL DEFAULT 'string'
                            CHECK (type IN ('string', 'number', 'boolean', 'json')),
  updated_at    INTEGER     NOT NULL DEFAULT (unixepoch())
);

-- Default settings
INSERT OR IGNORE INTO settings (key, value, type) VALUES
  ('site_name',           'Bocker168',          'string'),
  ('maintenance_mode',    'false',              'boolean'),
  ('articles_per_page',   '9',                  'number'),
  ('default_og_image',    '',                   'string');

-- ============================================================
-- 4. article_views  (lightweight page-view tracking)
-- ============================================================
CREATE TABLE IF NOT EXISTS article_views (
  id            INTEGER     PRIMARY KEY AUTOINCREMENT,
  article_id    TEXT        NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  ip_hash       TEXT        NOT NULL DEFAULT '',
  viewed_at     INTEGER     NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_views_article ON article_views (article_id);
CREATE INDEX IF NOT EXISTS idx_views_time    ON article_views (viewed_at DESC);
