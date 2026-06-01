"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, Heart } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { CONTENT_LABELS, type PublicationCard as PubCard } from "@/types";

interface PublicationCardProps {
  item: PubCard;
  index?: number;
  variant?: "default" | "editorial";
}

export function PublicationCard({
  item,
  index = 0,
  variant = "default",
}: PublicationCardProps) {
  const href = `/leitura/${item.type}/${item.slug}`;
  const isEditorial = variant === "editorial";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className={`card-hover group overflow-hidden bg-card ${
        isEditorial
          ? "rounded-3xl border-0 shadow-sm"
          : "rounded-3xl border border-border"
      }`}
    >
      <Link href={href} className="block">
        <div
          className={`relative overflow-hidden bg-border/30 ${
            isEditorial ? "aspect-[3/4]" : "aspect-[16/10]"
          }`}
        >
          {item.cover_image_url ? (
            <Image
              src={item.cover_image_url}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-accent-soft/40 to-accent/15">
              <span className="font-display text-5xl text-accent/35">
                {item.title.charAt(0)}
              </span>
            </div>
          )}
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
            {CONTENT_LABELS[item.type]}
          </span>
        </div>

        <div className={isEditorial ? "p-5 pt-4" : "p-5"}>
          <h3 className="font-display text-lg font-semibold leading-snug transition-colors group-hover:text-accent">
            {item.title}
          </h3>
          <p className="mt-1 text-sm text-muted">{item.author_name}</p>
          {!isEditorial && item.excerpt && (
            <p className="mt-3 line-clamp-2 text-sm text-muted">{item.excerpt}</p>
          )}
          <div className="mt-3 flex items-center justify-between text-xs text-muted">
            <span>{formatDate(item.published_at)}</span>
            <div className="flex gap-3">
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" /> {item.views_count}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-3.5 w-3.5" /> {item.likes_count}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
