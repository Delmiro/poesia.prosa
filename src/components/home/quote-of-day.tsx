"use client";

import { motion } from "framer-motion";
import type { QuoteOfDay } from "@/types";

export function QuoteOfDayBlock({ quote }: { quote: QuoteOfDay }) {
  return (
    <section className="px-4 py-16 md:px-6">
      <motion.blockquote
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="mx-auto max-w-3xl rounded-3xl bg-footer/60 px-8 py-14 text-center md:px-16"
      >
        <p className="font-display text-2xl italic leading-relaxed text-foreground md:text-3xl">
          &ldquo;{quote.text}&rdquo;
        </p>
        <footer className="mt-6 font-medium text-accent">— {quote.author}</footer>
        <p className="mt-2 text-xs uppercase tracking-widest text-muted">Frase do dia</p>
      </motion.blockquote>
    </section>
  );
}
