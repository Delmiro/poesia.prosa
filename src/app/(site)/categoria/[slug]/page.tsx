import { notFound } from "next/navigation";
import { PublicationCard } from "@/components/content/publication-card";
import { getCategories, getPoems, getChronicles, getStories } from "@/lib/services/content";
import type { ContentType } from "@/types";

const slugToType: Record<string, { type: ContentType; fetch: (limit: number) => Promise<unknown[]> }> = {
  poesia: { type: "poem", fetch: (l) => getPoems({ limit: l }) },
  cronica: { type: "chronicle", fetch: (l) => getChronicles(l) },
  conto: { type: "story", fetch: (l) => getStories(l) },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const categories = await getCategories();
  const cat = categories.find((c) => c.slug === slug);
  return { title: cat?.name ?? "Categoria" };
}

export default async function CategoriaPage({ params }: PageProps) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) notFound();

  const config = slugToType[slug];
  let items: Awaited<ReturnType<typeof getPoems>> = [];

  if (config) {
    items = (await config.fetch(12)) as typeof items;
  }

  if (slug === "revista") {
    return (
      <div className="px-4 py-12 text-center md:px-6">
        <h1 className="font-display text-4xl font-semibold">{category.name}</h1>
        <p className="mt-4 text-muted">
          <a href="/revistas" className="text-accent hover:underline">
            Ver revistas digitais →
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-12 md:px-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-display text-4xl font-semibold">{category.name}</h1>
        {category.description && (
          <p className="mt-2 text-muted">{category.description}</p>
        )}

        {items.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <PublicationCard key={item.id} item={item} index={i} />
            ))}
          </div>
        ) : (
          <p className="mt-12 text-center text-muted">
            Em breve novos conteúdos nesta categoria.
          </p>
        )}
      </div>
    </div>
  );
}
