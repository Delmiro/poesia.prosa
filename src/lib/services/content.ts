import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  demoBanners,
  demoCategories,
  demoChronicles,
  demoFeaturedPoem,
  demoMagazines,
  demoMenus,
  demoPoems,
  demoQuote,
  demoStories,
} from "@/lib/data/demo";
import type {
  Banner,
  BasePublication,
  Category,
  ContentType,
  Magazine,
  MenuItem,
  PublicationCard,
  QuoteOfDay,
} from "@/types";
import { CONTENT_TABLES } from "@/types";

const TEXT_TYPES: ContentType[] = ["poem", "chronicle", "story", "article", "news"];

function mapRow(type: ContentType, row: Record<string, unknown>): PublicationCard {
  return {
    id: row.id as string,
    title: row.title as string,
    slug: row.slug as string,
    author_name: row.author_name as string,
    excerpt: (row.excerpt as string) ?? null,
    cover_image_url: (row.cover_image_url as string) ?? null,
    type,
    views_count: (row.views_count as number) ?? 0,
    likes_count: (row.likes_count as number) ?? 0,
    published_at: (row.published_at as string) ?? null,
    category: (row.category as Category) ?? null,
  };
}

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) return demoCategories;
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  return data ?? demoCategories;
}

export async function getMenus(type?: MenuItem["menu_type"]): Promise<MenuItem[]> {
  if (!isSupabaseConfigured()) {
    return type ? demoMenus.filter((m) => m.menu_type === type) : demoMenus;
  }
  const supabase = await createClient();
  let query = supabase.from("menus").select("*").eq("is_active", true).order("sort_order");
  if (type) query = query.eq("menu_type", type);
  const { data } = await query;
  return data?.length ? data : demoMenus;
}

export async function getBanners(): Promise<Banner[]> {
  if (!isSupabaseConfigured()) return demoBanners;
  const supabase = await createClient();
  const { data } = await supabase
    .from("banners")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  return data?.length ? data : demoBanners;
}

export async function getQuoteOfDay(): Promise<QuoteOfDay> {
  if (!isSupabaseConfigured()) return demoQuote;
  const supabase = await createClient();
  const { data } = await supabase
    .from("homepage_settings")
    .select("value")
    .eq("key", "quote_of_day")
    .single();
  if (data?.value) return data.value as QuoteOfDay;
  return demoQuote;
}

async function fetchFromTable(
  type: ContentType,
  options: { limit?: number; orderBy?: string; featured?: boolean } = {}
): Promise<PublicationCard[]> {
  const { limit = 6, orderBy = "published_at", featured } = options;
  if (type === "magazine") return [];

  if (!isSupabaseConfigured()) {
    const map: Partial<Record<ContentType, PublicationCard[]>> = {
      poem: demoPoems,
      chronicle: demoChronicles,
      story: demoStories,
    };
    return map[type] ?? [];
  }

  const supabase = await createClient();
  const table = CONTENT_TABLES[type];
  let query = supabase
    .from(table)
    .select("*, category:categories(*)")
    .eq("status", "published")
    .order(orderBy, { ascending: false })
    .limit(limit);

  if (featured) query = query.eq("featured", true);

  const { data } = await query;
  return (data ?? []).map((row) => mapRow(type, row as Record<string, unknown>));
}

export async function getPoems(options?: { limit?: number; sort?: "recent" | "views" | "likes" }) {
  const orderBy =
    options?.sort === "views" ? "views_count" : options?.sort === "likes" ? "likes_count" : "published_at";
  return fetchFromTable("poem", { limit: options?.limit ?? 6, orderBy });
}

export async function getChronicles(limit = 4) {
  return fetchFromTable("chronicle", { limit });
}

export async function getStories(limit = 4, featured = false) {
  return fetchFromTable("story", { limit, featured });
}

export async function getMagazines(limit = 4): Promise<Magazine[]> {
  if (!isSupabaseConfigured()) return demoMagazines.slice(0, limit);
  const supabase = await createClient();
  const { data } = await supabase
    .from("magazines")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);
  return data ?? demoMagazines;
}

export async function getFeaturedPoem() {
  if (!isSupabaseConfigured()) return demoFeaturedPoem;
  const supabase = await createClient();
  const { data: setting } = await supabase
    .from("homepage_settings")
    .select("value")
    .eq("key", "featured_poem_id")
    .single();

  const poemId = setting?.value as string | null;
  if (poemId && poemId !== "null") {
    const { data } = await supabase.from("poems").select("*").eq("id", poemId).single();
    if (data) return { ...data, type: "poem" as const };
  }

  const { data } = await supabase
    .from("poems")
    .select("*")
    .eq("status", "published")
    .eq("featured", true)
    .order("published_at", { ascending: false })
    .limit(1)
    .single();

  return data ? { ...data, type: "poem" as const } : demoFeaturedPoem;
}

export async function getPublicationBySlug(
  type: ContentType,
  slug: string
): Promise<(BasePublication & { type: ContentType }) | Magazine | null> {
  if (!isSupabaseConfigured()) {
    if (type === "magazine") {
      return demoMagazines.find((m) => m.slug === slug) ?? demoMagazines[0];
    }
    if (slug === demoFeaturedPoem.slug) {
      return { ...demoFeaturedPoem, status: "published", featured: true, created_at: "", updated_at: "", category_id: null } as BasePublication & { type: ContentType };
    }
    return null;
  }

  const supabase = await createClient();
  const table = CONTENT_TABLES[type];
  const { data } = await supabase
    .from(table)
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!data) {
    if (type === "magazine") {
      return demoMagazines.find((m) => m.slug === slug) ?? null;
    }
    return null;
  }
  if (type === "magazine") return data as Magazine;
  return { ...(data as BasePublication), type };
}

export async function searchPublications(query: string): Promise<PublicationCard[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  if (!isSupabaseConfigured()) {
    const all = [...demoPoems, ...demoChronicles, ...demoStories];
    return all.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.author_name.toLowerCase().includes(q) ||
        (p.excerpt?.toLowerCase().includes(q) ?? false)
    );
  }

  const supabase = await createClient();
  const results: PublicationCard[] = [];

  for (const type of TEXT_TYPES) {
    const table = CONTENT_TABLES[type];
    const { data } = await supabase
      .from(table)
      .select("*, category:categories(*)")
      .eq("status", "published")
      .or(`title.ilike.%${q}%,author_name.ilike.%${q}%,content.ilike.%${q}%,excerpt.ilike.%${q}%`)
      .limit(10);

    if (data) results.push(...data.map((row) => mapRow(type, row as Record<string, unknown>)));
  }

  return results;
}

export async function getRelated(
  type: ContentType,
  categoryId: string | null | undefined,
  excludeId: string,
  limit = 3
): Promise<PublicationCard[]> {
  if (!isSupabaseConfigured()) return demoPoems.filter((p) => p.id !== excludeId).slice(0, limit);
  if (type === "magazine" || !TEXT_TYPES.includes(type)) return [];

  const supabase = await createClient();
  const table = CONTENT_TABLES[type];
  let query = supabase
    .from(table)
    .select("*, category:categories(*)")
    .eq("status", "published")
    .neq("id", excludeId)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (categoryId) query = query.eq("category_id", categoryId);

  const { data } = await query;
  return (data ?? []).map((row) => mapRow(type, row as Record<string, unknown>));
}

export async function incrementViews(type: ContentType, id: string) {
  if (!isSupabaseConfigured()) return;
  const supabase = await createClient();
  const table = CONTENT_TABLES[type];
  const { data: row } = await supabase.from(table).select("views_count").eq("id", id).single();
  if (row) {
    await supabase
      .from(table)
      .update({ views_count: (row.views_count ?? 0) + 1 })
      .eq("id", id);
  }
}
