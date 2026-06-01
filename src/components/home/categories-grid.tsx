import Link from "next/link";
import type { Category } from "@/types";

const categoryIcons: Record<string, string> = {
  poesia: "✦",
  cronica: "◈",
  conto: "❧",
  artigo: "§",
  revista: "◉",
  cultura: "✺",
  noticias: "◆",
};

export function CategoriesGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="px-4 py-16 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-semibold md:text-4xl">Categorias</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">Explore por gênero literário</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categoria/${cat.slug}`}
              className="card-hover flex flex-col items-center rounded-3xl border border-border/80 bg-card p-6 text-center transition-colors hover:border-accent-soft hover:bg-white"
            >
              <span className="font-display text-2xl text-accent">{categoryIcons[cat.slug] ?? "·"}</span>
              <span className="mt-3 text-sm font-medium text-foreground">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
