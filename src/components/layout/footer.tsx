import Link from "next/link";
import type { Category, MenuItem } from "@/types";

interface FooterProps {
  footerMenu: MenuItem[];
  categories: Category[];
}

function uniqueMenuByUrl(items: MenuItem[]): MenuItem[] {
  return items.filter(
    (item, index, list) => list.findIndex((other) => other.url === item.url) === index
  );
}

export function Footer({ footerMenu, categories }: FooterProps) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Prosa & Poesia";
  const year = new Date().getFullYear();

  const institutionalLinks = uniqueMenuByUrl(
    footerMenu.length
      ? footerMenu
      : ([
          { id: "f1", label: "Receba Novidades", url: "/receba-novidades" },
          { id: "f2", label: "Buscar", url: "/busca" },
          { id: "f3", label: "Revistas", url: "/revistas" },
          { id: "f4", label: "Área Administrativa", url: "/admin/login" },
        ] as MenuItem[])
  );

  return (
    <footer className="mt-auto bg-footer text-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3 md:px-6">
        <div>
          <p className="font-display text-2xl font-semibold">{siteName}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            Portal literário dedicado à poesia, prosa, cultura e arte da palavra escrita.
          </p>
          <p className="mt-6 text-xs text-muted">
            <Link href="/receba-novidades" className="hover:text-foreground">
              Receba novidades
            </Link>
            <span className="mx-2">·</span>
            <Link href="/busca" className="hover:text-foreground">
              Buscar
            </Link>
          </p>
        </div>

        <div>
          <h3 className="font-display text-lg font-semibold">Categorias</h3>
          <ul className="mt-4 space-y-2.5">
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
          <h3 className="font-display text-lg font-semibold">Institucional</h3>
          <ul className="mt-4 space-y-2.5">
            {institutionalLinks.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.url}
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-foreground/10 py-6 text-center text-sm text-muted">
        © {year} {siteName}. Literatura com alma.
      </div>
    </footer>
  );
}
