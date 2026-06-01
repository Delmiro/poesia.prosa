import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PublicationCard } from "@/components/content/publication-card";
import type { PublicationCard as PubCard } from "@/types";

interface SectionBlockProps {
  title: string;
  subtitle?: string;
  items: PubCard[];
  viewAllHref?: string;
  columns?: 2 | 3;
}

export function SectionBlock({
  title,
  subtitle,
  items,
  viewAllHref,
  columns = 3,
}: SectionBlockProps) {
  if (!items.length) return null;

  const gridClass =
    columns === 2
      ? "grid gap-6 sm:grid-cols-2"
      : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section className="px-4 py-16 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-semibold md:text-4xl">{title}</h2>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-muted">{subtitle}</p>
          )}
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent transition-opacity hover:opacity-80"
            >
              Ver todos <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
        <div className={gridClass}>
          {items.map((item, i) => (
            <PublicationCard key={item.id} item={item} index={i} variant="editorial" />
          ))}
        </div>
      </div>
    </section>
  );
}
