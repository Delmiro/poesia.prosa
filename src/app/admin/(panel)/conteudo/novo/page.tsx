import { ContentForm } from "@/components/admin/content-form";
import { requireAdmin } from "@/lib/auth/admin";
import type { ContentType } from "@/types";

interface PageProps {
  searchParams: Promise<{ tipo?: string }>;
}

export default async function NovoConteudoPage({ searchParams }: PageProps) {
  const { tipo = "poem" } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data: categories } = await supabase.from("categories").select("id, name").order("sort_order");

  return <ContentForm type={tipo as ContentType} categories={categories ?? []} />;
}
