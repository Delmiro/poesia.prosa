export type ContentStatus = "draft" | "published" | "archived";

export type ContentType =
  | "poem"
  | "chronicle"
  | "story"
  | "article"
  | "news"
  | "magazine";

export type MenuType = "main" | "category" | "footer" | "institutional";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface BasePublication {
  id: string;
  title: string;
  slug: string;
  author_name: string;
  excerpt?: string | null;
  content: string;
  cover_image_url?: string | null;
  category_id?: string | null;
  status: ContentStatus;
  featured: boolean;
  views_count: number;
  likes_count: number;
  meta_title?: string | null;
  meta_description?: string | null;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
  category?: Category | null;
}

export interface Magazine {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  cover_image_url?: string | null;
  pdf_url: string;
  category_id?: string | null;
  status: ContentStatus;
  featured: boolean;
  views_count: number;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
  category?: Category | null;
}

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  menu_type: MenuType;
  sort_order: number;
  is_active: boolean;
  opens_new_tab: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string | null;
  image_url?: string | null;
  link_url?: string | null;
  banner_type: string;
  sort_order: number;
  is_active: boolean;
}

export interface Subscriber {
  id: string;
  name: string;
  email: string;
  whatsapp?: string | null;
  notify_poems: boolean;
  notify_articles: boolean;
  notify_magazines: boolean;
  notify_news: boolean;
  is_active: boolean;
  created_at: string;
}

export interface QuoteOfDay {
  text: string;
  author: string;
}

export interface PublicationCard {
  id: string;
  title: string;
  slug: string;
  author_name: string;
  excerpt?: string | null;
  cover_image_url?: string | null;
  type: ContentType;
  views_count: number;
  likes_count: number;
  published_at?: string | null;
  category?: Category | null;
}

export interface SeoSettings {
  page_key: string;
  meta_title?: string | null;
  meta_description?: string | null;
  og_image_url?: string | null;
  schema_json?: Record<string, unknown> | null;
}

export const CONTENT_TABLES: Record<ContentType, string> = {
  poem: "poems",
  chronicle: "chronicles",
  story: "stories",
  article: "articles",
  news: "news",
  magazine: "magazines",
};

export const CONTENT_LABELS: Record<ContentType, string> = {
  poem: "Poesia",
  chronicle: "Crônica",
  story: "Conto",
  article: "Artigo",
  news: "Notícia",
  magazine: "Revista",
};
