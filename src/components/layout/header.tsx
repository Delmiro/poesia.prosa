"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Moon, Search, Sun, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/providers/theme-provider";
import type { MenuItem } from "@/types";

interface HeaderProps {
  mainMenu: MenuItem[];
}

export function Header({ mainMenu }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Prosa & Poesia";

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {siteName}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {mainMenu.map((item) => (
            <Link
              key={item.id}
              href={item.url}
              target={item.opens_new_tab ? "_blank" : undefined}
              className="text-sm tracking-wide text-muted transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/busca"
            className="rounded-full p-2 text-muted transition-colors hover:bg-border/40 hover:text-accent"
            aria-label="Buscar"
          >
            <Search className="h-5 w-5" />
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
            className="rounded-full p-2 md:hidden"
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
            className="overflow-hidden border-t border-border md:hidden"
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
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
