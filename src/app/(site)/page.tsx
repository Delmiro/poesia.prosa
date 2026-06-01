import { HeroBanner } from "@/components/home/hero-banner";
import { SectionBlock } from "@/components/home/section-block";
import { QuoteOfDayBlock } from "@/components/home/quote-of-day";
import { MagazinesSection } from "@/components/home/magazines-section";
import { CategoriesGrid } from "@/components/home/categories-grid";
import {
  getBanners,
  getCategories,
  getChronicles,
  getFeaturedPoem,
  getMagazines,
  getPoems,
  getQuoteOfDay,
  getStories,
} from "@/lib/services/content";

export default async function HomePage() {
  const [
    banners,
    featuredPoem,
    poemsRecent,
    poemsPopular,
    poemsLiked,
    chronicles,
    stories,
    magazines,
    quote,
    categories,
  ] = await Promise.all([
    getBanners(),
    getFeaturedPoem(),
    getPoems({ limit: 3, sort: "recent" }),
    getPoems({ limit: 3, sort: "views" }),
    getPoems({ limit: 3, sort: "likes" }),
    getChronicles(4),
    getStories(4, true),
    getMagazines(3),
    getQuoteOfDay(),
    getCategories(),
  ]);

  const heroBanner = banners[0] ?? {
    id: "default",
    title: "Bem-vindo ao mundo da palavra",
    subtitle: "Poesia, prosa e cultura reunidas em um portal dedicado à literatura com alma.",
    banner_type: "hero",
    sort_order: 0,
    is_active: true,
  };

  const featuredMagazine = magazines.find((m) => m.featured) ?? magazines[0];

  return (
    <>
      <HeroBanner
        banner={heroBanner}
        featuredPoem={{
          title: featuredPoem.title,
          slug: featuredPoem.slug,
          excerpt: featuredPoem.excerpt,
          author_name: featuredPoem.author_name,
        }}
        featuredMagazine={
          featuredMagazine
            ? { title: featuredMagazine.title, slug: featuredMagazine.slug }
            : null
        }
      />

      <SectionBlock
        title="Poesias Recentes"
        subtitle="As últimas vozes publicadas"
        items={poemsRecent}
        viewAllHref="/categoria/poesia"
      />

      <SectionBlock
        title="Mais Lidas"
        subtitle="O que os leitores mais visitaram"
        items={poemsPopular}
        columns={3}
      />

      <SectionBlock
        title="Mais Curtidas"
        subtitle="Amadas pela comunidade"
        items={poemsLiked}
        columns={3}
      />

      <SectionBlock
        title="Crônicas"
        subtitle="Últimas publicações"
        items={chronicles}
        viewAllHref="/categoria/cronica"
      />

      <SectionBlock
        title="Contos em Destaque"
        subtitle="Narrativas que convidam à imaginação"
        items={stories}
        viewAllHref="/categoria/conto"
        columns={2}
      />

      <MagazinesSection magazines={magazines} />

      <QuoteOfDayBlock quote={quote} />

      <CategoriesGrid categories={categories} />
    </>
  );
}
