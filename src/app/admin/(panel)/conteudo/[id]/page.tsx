import { notFound } from "next/navigation";
import { ContentForm } from "@/components/admin/content-form";
import { requireAdmin } from "@/lib/auth/admin";
import { CONTENT_TABLES, type ContentType } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tipo?: string }>;
}

export default async function EditarConteudoPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { tipo = "poem" } = await searchParams;
  const contentType = tipo as ContentType;
  const { supabase } = await requireAdmin();

  const { data: item } = await supabase
    .from(CONTENT_TABLES[contentType])
    .select("*")
    .eq("id", id)
    .single();

  if (!item) notFound();

  const { data: categories } = await supabase.from("categories").select("id, name").order("sort_order");

  return (
    <ContentForm
      type={contentType}
      initial={item}
      categories={categories ?? []}
    />
  );
}
