import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
import { MagazineForm } from "@/components/admin/magazine-form";

export default async function AdminRevistasPage() {
  const { supabase } = await requireAdmin();
  const { data: magazines } = await supabase
    .from("magazines")
    .select("id, title, slug, status, published_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Revistas Digitais</h1>
      <p className="mt-2 text-muted">Upload de PDF, capa e descrição.</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <MagazineForm />
        <div>
          <h2 className="font-medium mb-4">Revistas cadastradas</h2>
          <ul className="space-y-3">
            {(magazines ?? []).map((m) => (
              <li key={m.id} className="rounded-lg border border-border px-4 py-3">
                <p className="font-medium">{m.title}</p>
                <p className="text-xs text-muted">{m.status} · /revistas/{m.slug}</p>
              </li>
            ))}
          </ul>
          <Link href="/revistas" className="mt-4 inline-block text-sm text-accent hover:underline">
            Ver no site →
          </Link>
        </div>
      </div>
    </div>
  );
}
