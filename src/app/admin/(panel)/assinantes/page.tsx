import { SubscribersTable } from "@/components/admin/subscribers-table";
import { requireAdmin } from "@/lib/auth/admin";

interface PageProps {
  searchParams: Promise<{ de?: string; ate?: string }>;
}

export default async function AssinantesPage({ searchParams }: PageProps) {
  const { de, ate } = await searchParams;
  const { supabase } = await requireAdmin();

  let query = supabase
    .from("subscribers")
    .select("*")
    .order("created_at", { ascending: false });

  if (de) query = query.gte("created_at", de);
  if (ate) query = query.lte("created_at", `${ate}T23:59:59`);

  const { data: subscribers } = await query;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Gestão de Assinantes</h1>
      <p className="mt-2 text-muted">
        Visitantes cadastrados em Receba Novidades — exportação e filtros por data.
      </p>
      <SubscribersTable subscribers={subscribers ?? []} />
    </div>
  );
}
