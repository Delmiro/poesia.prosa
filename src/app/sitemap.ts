import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/busca`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/revistas`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/receba-novidades`, changeFrequency: "monthly", priority: 0.6 },
  ];

  if (!isSupabaseConfigured()) return staticRoutes;

  const supabase = await createClient();
  const dynamic: MetadataRoute.Sitemap = [];

  const tables = [
    { table: "poems", type: "poem" },
    { table: "chronicles", type: "chronicle" },
    { table: "stories", type: "story" },
    { table: "articles", type: "article" },
    { table: "news", type: "news" },
  ] as const;

  for (const { table, type } of tables) {
    const { data } = await supabase
      .from(table)
      .select("slug, updated_at")
      .eq("status", "published");

    data?.forEach((row) => {
      dynamic.push({
        url: `${siteUrl}/leitura/${type}/${row.slug}`,
        lastModified: row.updated_at ?? new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    });
  }

  const { data: magazines } = await supabase
    .from("magazines")
    .select("slug, updated_at")
    .eq("status", "published");

  magazines?.forEach((row) => {
    dynamic.push({
      url: `${siteUrl}/revistas/${row.slug}`,
      lastModified: row.updated_at ?? new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  });

  return [...staticRoutes, ...dynamic];
}
