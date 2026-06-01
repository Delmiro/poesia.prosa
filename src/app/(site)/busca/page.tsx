import { SearchForm } from "@/components/search/search-form";
import { PublicationCard } from "@/components/content/publication-card";
import { searchPublications } from "@/lib/services/content";

interface PageProps {
  searchParams: Promise<{ q?: string; categoria?: string }>;
}

export const metadata = {
  title: "Buscar",
  description: "Busque por título, autor, categoria ou palavra-chave.",
};

export default async function BuscaPage({ searchParams }: PageProps) {
  const { q = "", categoria } = await searchParams;
  const results = q ? await searchPublications(q) : [];
  const filtered = categoria
    ? results.filter((r) => r.category?.slug === categoria)
    : results;

  return (
    <div className="px-4 py-12 md:px-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-display text-4xl font-semibold">Buscar</h1>
        <p className="mt-2 text-muted">
          Encontre poesias, crônicas, contos e artigos por título, autor ou palavra-chave.
        </p>

        <div className="mt-8">
          <SearchForm initialQuery={q} />
        </div>

        {q && (
          <p className="mt-8 text-sm text-muted">
            {filtered.length} resultado(s) para &ldquo;{q}&rdquo;
            {categoria && ` em ${categoria}`}
          </p>
        )}

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {filtered.map((item, i) => (
            <PublicationCard key={`${item.type}-${item.id}`} item={item} index={i} />
          ))}
        </div>

        {q && filtered.length === 0 && (
          <p className="mt-12 text-center text-muted">
            Nenhum conteúdo encontrado. Tente outros termos.
          </p>
        )}
      </div>
    </div>
  );
}
