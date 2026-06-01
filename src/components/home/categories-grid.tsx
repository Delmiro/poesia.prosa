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
    <section className="px-4 py-14 md:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-display text-3xl font-semibold">Categorias</h2>
        <p className="mt-2 text-center text-muted">Explore por gênero literário</p>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categoria/${cat.slug}`}
              className="card-hover flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center transition-colors hover:border-accent/40"
            >
              <span className="text-2xl text-accent">{categoryIcons[cat.slug] ?? "·"}</span>
              <span className="mt-3 text-sm font-medium">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
