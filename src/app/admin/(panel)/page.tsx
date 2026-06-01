import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
import { BookOpen, Mail, Newspaper } from "lucide-react";

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin();

  const [poems, subscribers, magazines] = await Promise.all([
    supabase.from("poems").select("id", { count: "exact", head: true }),
    supabase.from("subscribers").select("id", { count: "exact", head: true }),
    supabase.from("magazines").select("id", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Poesias", value: poems.count ?? 0, href: "/admin/conteudo?tipo=poem", icon: BookOpen },
    { label: "Assinantes", value: subscribers.count ?? 0, href: "/admin/assinantes", icon: Mail },
    { label: "Revistas", value: magazines.count ?? 0, href: "/admin/revistas", icon: Newspaper },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-muted">Visão geral do portal literário</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {stats.map(({ label, value, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="card-hover rounded-2xl border border-border bg-card p-6"
          >
            <Icon className="h-8 w-8 text-accent" />
            <p className="mt-4 text-3xl font-semibold">{value}</p>
            <p className="text-sm text-muted">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
