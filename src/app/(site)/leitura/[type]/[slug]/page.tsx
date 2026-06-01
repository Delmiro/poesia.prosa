import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, Share2, Clock } from "lucide-react";
import { PublicationCard } from "@/components/content/publication-card";
import { ShareButtons } from "@/components/reading/share-buttons";
import { LikeButton } from "@/components/reading/like-button";
import {
  getPublicationBySlug,
  getRelated,
} from "@/lib/services/content";
import { formatDate, readingTime } from "@/lib/utils";
import { CONTENT_LABELS, type ContentType } from "@/types";

const VALID_TYPES: ContentType[] = ["poem", "chronicle", "story", "article", "news"];

interface PageProps {
  params: Promise<{ type: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type, slug } = await params;
  if (!VALID_TYPES.includes(type as ContentType)) return {};
  const pub = await getPublicationBySlug(type as ContentType, slug);
  if (!pub || "pdf_url" in pub) return {};
  return {
    title: pub.meta_title ?? pub.title,
    description: pub.meta_description ?? pub.excerpt ?? undefined,
    openGraph: {
      title: pub.title,
      description: pub.excerpt ?? undefined,
      images: pub.cover_image_url ? [{ url: pub.cover_image_url }] : undefined,
    },
  };
}

export default async function ReadingPage({ params }: PageProps) {
  const { type, slug } = await params;

  if (!VALID_TYPES.includes(type as ContentType)) notFound();

  const publication = await getPublicationBySlug(type as ContentType, slug);
  if (!publication || "pdf_url" in publication) notFound();

  const related = await getRelated(
    type as ContentType,
    publication.category_id,
    publication.id,
    3
  );

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const shareUrl = `${siteUrl}/leitura/${type}/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: publication.title,
    author: { "@type": "Person", name: publication.author_name },
    datePublished: publication.published_at,
    description: publication.excerpt,
  };

  return (
    <article className="px-4 py-10 md:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-wider text-accent">
          {CONTENT_LABELS[type as ContentType]}
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl">
          {publication.title}
        </h1>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted">
          <span>por <strong className="text-foreground">{publication.author_name}</strong></span>
          <span>·</span>
          <time dateTime={publication.published_at ?? undefined}>
            {formatDate(publication.published_at)}
          </time>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {readingTime(publication.content)} min de leitura
          </span>
        </div>

        {publication.cover_image_url && (
          <div className="relative mt-10 aspect-video overflow-hidden rounded-2xl">
            <Image
              src={publication.cover_image_url}
              alt={publication.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        <div
          className="prose-literary mt-12 whitespace-pre-wrap"
          dangerouslySetInnerHTML={{
            __html: publication.content.replace(/\n/g, "<br />"),
          }}
        />

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
          <div className="flex items-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" /> {publication.views_count} visualizações
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-4 w-4" /> {publication.likes_count} curtidas
            </span>
          </div>
          <div className="flex items-center gap-3">
            <LikeButton
              publicationType={type}
              publicationId={publication.id}
              initialLikes={publication.likes_count}
            />
            <ShareButtons url={shareUrl} title={publication.title} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mx-auto mt-20 max-w-6xl border-t border-border pt-14">
          <h2 className="font-display text-2xl font-semibold">Conteúdos relacionados</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, i) => (
              <PublicationCard key={item.id} item={item} index={i} />
            ))}
          </div>
          {related[0] && (
            <div className="mt-10 text-center">
              <p className="text-sm text-muted">Próxima leitura recomendada</p>
              <Link
                href={`/leitura/${related[0].type}/${related[0].slug}`}
                className="mt-2 inline-block font-display text-xl text-accent hover:underline"
              >
                {related[0].title}
              </Link>
            </div>
          )}
        </section>
      )}
    </article>
  );
}
