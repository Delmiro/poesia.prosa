-- Portal Literário Prosa & Poesia — Schema inicial

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Roles
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO roles (name, description) VALUES
  ('admin', 'Administrador do portal'),
  ('editor', 'Editor de conteúdo'),
  ('reader', 'Leitor registrado');

-- Users (perfil estendido do auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role_id UUID REFERENCES roles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admins
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO categories (name, slug, sort_order) VALUES
  ('Poesia', 'poesia', 1),
  ('Crônica', 'cronica', 2),
  ('Conto', 'conto', 3),
  ('Artigo', 'artigo', 4),
  ('Revista', 'revista', 5),
  ('Cultura', 'cultura', 6),
  ('Notícias', 'noticias', 7);

-- Tags
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Base content fields (shared structure)
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Poems / Poesias
CREATE TABLE poems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  author_name TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  category_id UUID REFERENCES categories(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT FALSE,
  views_count INT DEFAULT 0,
  likes_count INT DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER poems_updated_at BEFORE UPDATE ON poems
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TABLE poem_tags (
  poem_id UUID REFERENCES poems(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (poem_id, tag_id)
);

-- Chronicles
CREATE TABLE chronicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  author_name TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  category_id UUID REFERENCES categories(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT FALSE,
  views_count INT DEFAULT 0,
  likes_count INT DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER chronicles_updated_at BEFORE UPDATE ON chronicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Stories
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  author_name TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  category_id UUID REFERENCES categories(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT FALSE,
  views_count INT DEFAULT 0,
  likes_count INT DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER stories_updated_at BEFORE UPDATE ON stories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Articles
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  author_name TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  category_id UUID REFERENCES categories(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT FALSE,
  views_count INT DEFAULT 0,
  likes_count INT DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER articles_updated_at BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- News (notícias culturais)
CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  author_name TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  category_id UUID REFERENCES categories(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT FALSE,
  views_count INT DEFAULT 0,
  likes_count INT DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER news_updated_at BEFORE UPDATE ON news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Magazines
CREATE TABLE magazines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  cover_image_url TEXT,
  pdf_url TEXT NOT NULL,
  category_id UUID REFERENCES categories(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT FALSE,
  views_count INT DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER magazines_updated_at BEFORE UPDATE ON magazines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Subscribers (Receba Novidades — público)
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  notify_poems BOOLEAN DEFAULT TRUE,
  notify_articles BOOLEAN DEFAULT TRUE,
  notify_magazines BOOLEAN DEFAULT TRUE,
  notify_news BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX subscribers_email_idx ON subscribers(email);

-- Notifications log
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  body TEXT,
  type TEXT NOT NULL,
  reference_id UUID,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menus
CREATE TABLE menus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  menu_type TEXT NOT NULL CHECK (menu_type IN ('main', 'category', 'footer', 'institutional')),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  opens_new_tab BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Banners
CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT,
  link_url TEXT,
  banner_type TEXT DEFAULT 'hero' CHECK (banner_type IN ('hero', 'sidebar', 'promo')),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Homepage settings (JSON flexível)
CREATE TABLE homepage_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO homepage_settings (key, value) VALUES
  ('quote_of_day', '{"text": "A poesia é o que se perde na tradução.", "author": "Robert Frost"}'),
  ('sections', '{"poems": true, "chronicles": true, "stories": true, "magazines": true, "quote": true}'),
  ('featured_poem_id', 'null'),
  ('featured_magazine_id', 'null');

-- SEO settings
CREATE TABLE seo_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_key TEXT NOT NULL UNIQUE,
  meta_title TEXT,
  meta_description TEXT,
  og_image_url TEXT,
  schema_json JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO seo_settings (page_key, meta_title, meta_description) VALUES
  ('home', 'Prosa & Poesia — Portal Literário', 'Portal de poesias, crônicas, contos, artigos e revistas digitais. Literatura, cultura e inspiração.');

-- Publication likes (anonymous by session)
CREATE TABLE publication_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  publication_type TEXT NOT NULL,
  publication_id UUID NOT NULL,
  session_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(publication_type, publication_id, session_id)
);

-- RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE chronicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE magazines ENABLE ROW LEVEL SECURITY;
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- Public read published content
CREATE POLICY "Public read published poems" ON poems FOR SELECT USING (status = 'published');
CREATE POLICY "Public read published chronicles" ON chronicles FOR SELECT USING (status = 'published');
CREATE POLICY "Public read published stories" ON stories FOR SELECT USING (status = 'published');
CREATE POLICY "Public read published articles" ON articles FOR SELECT USING (status = 'published');
CREATE POLICY "Public read published news" ON news FOR SELECT USING (status = 'published');
CREATE POLICY "Public read published magazines" ON magazines FOR SELECT USING (status = 'published');
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active menus" ON menus FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active banners" ON banners FOR SELECT USING (is_active = true);
CREATE POLICY "Public read homepage_settings" ON homepage_settings FOR SELECT USING (true);
CREATE POLICY "Public read seo_settings" ON seo_settings FOR SELECT USING (true);

-- Anyone can subscribe
CREATE POLICY "Public insert subscribers" ON subscribers FOR INSERT WITH CHECK (true);

-- Storage buckets (run in Supabase dashboard or via API):
-- publications, magazines, banners
