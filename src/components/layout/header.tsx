"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BookOpen, Menu, Moon, Search, Sun, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/providers/theme-provider";
import type { MenuItem } from "@/types";

interface HeaderProps {
  mainMenu: MenuItem[];
}

function isActivePath(pathname: string, url: string): boolean {
  if (url === "/") return pathname === "/";
  return pathname === url || pathname.startsWith(`${url}/`);
}

export function Header({ mainMenu }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Prosa & Poesia";

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-white/95 backdrop-blur-sm dark:bg-card/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft/60 text-accent">
            <BookOpen className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-foreground md:text-2xl">
            {siteName}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {mainMenu.map((item) => {
            const active = isActivePath(pathname, item.url);
            return (
              <Link
                key={item.id}
                href={item.url}
                target={item.opens_new_tab ? "_blank" : undefined}
                className={`text-sm tracking-wide transition-colors ${
                  active
                    ? "text-foreground underline decoration-foreground/40 underline-offset-8"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/busca"
            className="rounded-full p-2 text-muted transition-colors hover:bg-border/40 hover:text-foreground lg:hidden"
            aria-label="Buscar"
          >
            <Search className="h-5 w-5" />
          </Link>
          <Link
            href="/receba-novidades"
            className="hidden rounded-full bg-accent-cta px-5 py-2 text-sm font-medium text-foreground transition-opacity hover:opacity-90 sm:inline-flex"
          >
            Receba novidades
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-full p-2 text-muted transition-colors hover:bg-border/40"
            aria-label="Alternar tema"
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
          <button
            type="button"
            className="rounded-full p-2 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border bg-white dark:bg-card lg:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {mainMenu.map((item) => (
                <Link
                  key={item.id}
                  href={item.url}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-foreground hover:bg-border/30"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/receba-novidades"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-full bg-accent-cta px-4 py-2.5 text-center text-sm font-medium text-foreground"
              >
                Receba novidades
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
