"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Banner } from "@/types";

interface HeroBannerProps {
  banner: Banner;
  featuredPoem: {
    title: string;
    slug: string;
    excerpt?: string;
    author_name: string;
  };
  featuredMagazine?: {
    title: string;
    slug: string;
  } | null;
}

export function HeroBanner({ banner, featuredPoem, featuredMagazine }: HeroBannerProps) {
  return (
    <section className="gradient-hero relative overflow-hidden px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
            Destaques da semana
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-6xl">
            {banner.title}
          </h1>
          {banner.subtitle && (
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">{banner.subtitle}</p>
          )}
        </motion.div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-border bg-card/80 p-8 backdrop-blur-sm card-hover"
          >
            <p className="text-xs uppercase tracking-wider text-accent">Poema em destaque</p>
            <h2 className="mt-3 font-display text-2xl font-semibold">{featuredPoem.title}</h2>
            <p className="mt-2 text-sm text-muted">por {featuredPoem.author_name}</p>
            {featuredPoem.excerpt && (
              <p className="mt-4 italic text-muted line-clamp-3">{featuredPoem.excerpt}</p>
            )}
            <Link href={`/leitura/poem/${featuredPoem.slug}`} className="mt-6 inline-block">
              <Button variant="outline" size="sm">
                Ler poema <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          {featuredMagazine && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-border bg-card/80 p-8 backdrop-blur-sm card-hover"
            >
              <p className="text-xs uppercase tracking-wider text-accent">Revista digital</p>
              <h2 className="mt-3 font-display text-2xl font-semibold">{featuredMagazine.title}</h2>
              <p className="mt-4 text-sm text-muted">
                Explore a edição completa em formato digital, com navegação página a página.
              </p>
              <Link href={`/revistas/${featuredMagazine.slug}`} className="mt-6 inline-block">
                <Button size="sm">
                  <BookOpen className="h-4 w-4" /> Ler revista
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
