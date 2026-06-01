import Link from "next/link";
import type { Category, MenuItem } from "@/types";

interface FooterProps {
  footerMenu: MenuItem[];
  categories: Category[];
}

export function Footer({ footerMenu, categories }: FooterProps) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Prosa & Poesia";
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-card/50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3 md:px-6">
        <div>
          <p className="font-display text-xl font-semibold">{siteName}</p>
          <p className="mt-3 text-sm text-muted">
            Portal literário dedicado à poesia, prosa, cultura e arte da palavra escrita.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">
            Categorias
          </h3>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/categoria/${cat.slug}`}
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">
            Institucional
          </h3>
          <ul className="space-y-2">
            {(footerMenu.length ? footerMenu : [
              { id: "f1", label: "Receba Novidades", url: "/receba-novidades" },
              { id: "f2", label: "Buscar", url: "/busca" },
              { id: "f3", label: "Revistas", url: "/revistas" },
            ] as MenuItem[]).map((item) => (
              <li key={item.id}>
                <Link
                  href={item.url}
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/admin/login"
                className="text-sm text-muted transition-colors hover:text-accent"
              >
                Área Administrativa
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-6 text-center text-sm text-muted">
        © {year} {siteName}. Literatura com alma.
      </div>
    </footer>
  );
}
