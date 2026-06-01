import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
import { CONTENT_LABELS, CONTENT_TABLES, type ContentType } from "@/types";
import { DeleteContentButton } from "@/components/admin/delete-content-button";

const types: ContentType[] = ["poem", "chronicle", "story", "article", "news"];

interface PageProps {
  searchParams: Promise<{ tipo?: string }>;
}

export default async function ConteudoPage({ searchParams }: PageProps) {
  const { tipo = "poem" } = await searchParams;
  const contentType = types.includes(tipo as ContentType) ? (tipo as ContentType) : "poem";
  const { supabase } = await requireAdmin();
  const table = CONTENT_TABLES[contentType];

  const { data: items } = await supabase
    .from(table)
    .select("id, title, slug, status, author_name, published_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-semibold">Gestão de Conteúdo</h1>
        <Link
          href={`/admin/conteudo/novo?tipo=${contentType}`}
          className="rounded-full bg-accent px-5 py-2.5 text-sm text-white"
        >
          + Novo conteúdo
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {types.map((t) => (
          <Link
            key={t}
            href={`/admin/conteudo?tipo=${t}`}
            className={`rounded-full px-4 py-1.5 text-sm ${
              t === contentType
                ? "bg-accent text-white"
                : "border border-border text-muted hover:text-foreground"
            }`}
          >
            {CONTENT_LABELS[t]}
          </Link>
        ))}
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-card/50">
            <tr>
              <th className="p-4">Título</th>
              <th className="p-4">Autor</th>
              <th className="p-4">Status</th>
              <th className="p-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {(items ?? []).map((item) => (
              <tr key={item.id} className="border-b border-border/50">
                <td className="p-4 font-medium">{item.title}</td>
                <td className="p-4 text-muted">{item.author_name}</td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      item.status === "published"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-border text-muted"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  <Link
                    href={`/admin/conteudo/${item.id}?tipo=${contentType}`}
                    className="text-accent hover:underline"
                  >
                    Editar
                  </Link>
                  <DeleteContentButton table={table} id={item.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!items?.length && (
          <p className="p-8 text-center text-muted">Nenhum conteúdo cadastrado.</p>
        )}
      </div>
    </div>
  );
}
