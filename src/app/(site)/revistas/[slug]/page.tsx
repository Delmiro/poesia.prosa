import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicationBySlug, getMagazines } from "@/lib/services/content";
import { MagazineReader } from "@/components/magazine/magazine-reader";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const mag = await getPublicationBySlug("magazine", slug);
  if (!mag || !("pdf_url" in mag)) return {};
  return { title: mag.title, description: mag.description ?? undefined };
}

export default async function RevistaPage({ params }: PageProps) {
  const { slug } = await params;
  const magazine = await getPublicationBySlug("magazine", slug);

  if (!magazine || !("pdf_url" in magazine)) notFound();

  return (
    <div className="px-4 py-10 md:px-6">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm uppercase tracking-wider text-accent">Revista Digital</p>
        <h1 className="mt-2 font-display text-3xl font-semibold md:text-4xl">
          {magazine.title}
        </h1>
        <p className="mt-2 text-muted">{formatDate(magazine.published_at)}</p>
        {magazine.description && (
          <p className="mt-4 text-muted">{magazine.description}</p>
        )}
      </div>
      <div className="mx-auto mt-10 max-w-5xl">
        <MagazineReader pdfUrl={magazine.pdf_url} title={magazine.title} />
      </div>
    </div>
  );
}
