import Link from "next/link";
import {
  BookOpen,
  Home,
  LayoutDashboard,
  Mail,
  Menu,
  Newspaper,
  Search,
  Settings,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth/admin";
import { AdminSignOut } from "@/components/admin/admin-sign-out";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/conteudo", label: "Conteúdo", icon: BookOpen },
  { href: "/admin/revistas", label: "Revistas", icon: Newspaper },
  { href: "/admin/home", label: "Home", icon: Home },
  { href: "/admin/menus", label: "Menus", icon: Menu },
  { href: "/admin/assinantes", label: "Assinantes", icon: Mail },
  { href: "/admin/seo", label: "SEO", icon: Search },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 flex-shrink-0 border-r border-border bg-card p-6 md:block">
        <Link href="/admin" className="font-display text-xl font-semibold text-accent">
          Admin
        </Link>
        <p className="mt-1 text-xs text-muted">Prosa & Poesia</p>

        <nav className="mt-8 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:bg-border/40 hover:text-foreground"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-8">
          <AdminSignOut />
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border px-4 py-4 md:px-8">
          <Link href="/" className="text-sm text-muted hover:text-accent">
            ← Ver site
          </Link>
          <div className="md:hidden">
            <AdminSignOut />
          </div>
        </header>
        <div className="flex-1 p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}
