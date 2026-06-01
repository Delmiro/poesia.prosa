"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Magazine } from "@/types";

export function MagazinesSection({ magazines }: { magazines: Magazine[] }) {
  if (!magazines.length) return null;

  return (
    <section className="bg-card/40 px-4 py-16 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-semibold md:text-4xl">Revistas digitais</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Edições em PDF para leitura online, com experiência de folhear páginas
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {magazines.map((mag, i) => (
            <motion.article
              key={mag.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-hover overflow-hidden rounded-3xl bg-card shadow-sm"
            >
              <div className="relative aspect-[3/4] bg-border/30">
                {mag.cover_image_url ? (
                  <Image
                    src={mag.cover_image_url}
                    alt={mag.title}
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-accent-soft/30 to-accent/10 p-6 text-center">
                    <BookOpen className="h-12 w-12 text-accent/50" />
                    <span className="mt-4 font-display text-lg">{mag.title}</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-display text-lg font-semibold line-clamp-2">{mag.title}</h3>
                <p className="mt-2 text-sm text-muted">{formatDate(mag.published_at)}</p>
                <Link href={`/revistas/${mag.slug}`} className="mt-5 block">
                  <Button variant="outline" size="sm" className="w-full">
                    Ler revista
                  </Button>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/revistas">
            <Button variant="ghost">Ver todas as revistas</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
