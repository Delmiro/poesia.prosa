"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Banner } from "@/types";

const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80";

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
  const heroImage = banner.image_url || DEFAULT_HERO_IMAGE;
  const ctaHref = banner.link_url || `/leitura/poem/${featuredPoem.slug}`;

  return (
    <>
      <section className="relative flex min-h-[min(85vh,720px)] items-center justify-center overflow-hidden">
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[var(--hero-overlay)]" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 mx-auto max-w-3xl px-4 py-20 text-center text-white"
        >
          <h1 className="font-display text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">
            {banner.title}
          </h1>
          {banner.subtitle && (
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/90 md:text-lg">
              {banner.subtitle}
            </p>
          )}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href={ctaHref}>
              <Button
                size="lg"
                className="bg-white text-foreground hover:bg-white/90 hover:opacity-100"
              >
                Explorar leituras
              </Button>
            </Link>
            {featuredMagazine && (
              <Link href={`/revistas/${featuredMagazine.slug}`}>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/80 bg-transparent text-white hover:bg-white/10"
                >
                  <BookOpen className="h-4 w-4" /> Ler revista
                </Button>
              </Link>
            )}
          </div>
        </motion.div>
      </section>

      <section className="bg-background px-4 py-16 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-semibold md:text-4xl">Destaques</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted">
              Poemas e revistas selecionados para inspirar sua leitura
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <motion.article
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-border bg-card p-8 card-hover"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-accent">Poema em destaque</p>
              <h3 className="mt-3 font-display text-2xl font-semibold">{featuredPoem.title}</h3>
              <p className="mt-2 text-sm text-muted">por {featuredPoem.author_name}</p>
              {featuredPoem.excerpt && (
                <p className="mt-4 font-serif italic leading-relaxed text-muted line-clamp-3">
                  {featuredPoem.excerpt}
                </p>
              )}
              <Link href={`/leitura/poem/${featuredPoem.slug}`} className="mt-6 inline-block">
                <Button variant="outline" size="sm">
                  Ler poema <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.article>

            {featuredMagazine && (
              <motion.article
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="rounded-3xl border border-border bg-card p-8 card-hover"
              >
                <p className="text-xs font-medium uppercase tracking-wider text-accent">Revista digital</p>
                <h3 className="mt-3 font-display text-2xl font-semibold">{featuredMagazine.title}</h3>
                <p className="mt-4 text-sm text-muted">
                  Explore a edição completa em formato digital, com navegação página a página.
                </p>
                <Link href={`/revistas/${featuredMagazine.slug}`} className="mt-6 inline-block">
                  <Button size="sm">
                    <BookOpen className="h-4 w-4" /> Ler revista
                  </Button>
                </Link>
              </motion.article>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
