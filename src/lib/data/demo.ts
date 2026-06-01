import type {
  Banner,
  Category,
  Magazine,
  MenuItem,
  PublicationCard,
  QuoteOfDay,
} from "@/types";

export const demoCategories: Category[] = [
  { id: "1", name: "Poesia", slug: "poesia", sort_order: 1, is_active: true },
  { id: "2", name: "Crônica", slug: "cronica", sort_order: 2, is_active: true },
  { id: "3", name: "Conto", slug: "conto", sort_order: 3, is_active: true },
  { id: "4", name: "Artigo", slug: "artigo", sort_order: 4, is_active: true },
  { id: "5", name: "Revista", slug: "revista", sort_order: 5, is_active: true },
  { id: "6", name: "Cultura", slug: "cultura", sort_order: 6, is_active: true },
  { id: "7", name: "Notícias", slug: "noticias", sort_order: 7, is_active: true },
];

export const demoMenus: MenuItem[] = [
  { id: "1", label: "Início", url: "/", menu_type: "main", sort_order: 1, is_active: true, opens_new_tab: false },
  { id: "2", label: "Poesias", url: "/categoria/poesia", menu_type: "main", sort_order: 2, is_active: true, opens_new_tab: false },
  { id: "3", label: "Crônicas", url: "/categoria/cronica", menu_type: "main", sort_order: 3, is_active: true, opens_new_tab: false },
  { id: "4", label: "Revistas", url: "/revistas", menu_type: "main", sort_order: 4, is_active: true, opens_new_tab: false },
  { id: "5", label: "Buscar", url: "/busca", menu_type: "main", sort_order: 5, is_active: true, opens_new_tab: false },
  { id: "6", label: "Receba Novidades", url: "/receba-novidades", menu_type: "main", sort_order: 6, is_active: true, opens_new_tab: false },
  { id: "7", label: "Área Administrativa", url: "/admin/login", menu_type: "institutional", sort_order: 1, is_active: true, opens_new_tab: false },
  { id: "8", label: "Receba Novidades", url: "/receba-novidades", menu_type: "footer", sort_order: 1, is_active: true, opens_new_tab: false },
  { id: "9", label: "Buscar", url: "/busca", menu_type: "footer", sort_order: 2, is_active: true, opens_new_tab: false },
  { id: "10", label: "Revistas", url: "/revistas", menu_type: "footer", sort_order: 3, is_active: true, opens_new_tab: false },
  { id: "11", label: "Área Administrativa", url: "/admin/login", menu_type: "footer", sort_order: 4, is_active: true, opens_new_tab: false },
];

export const demoQuote: QuoteOfDay = {
  text: "A literatura é a prova de que a vida não basta.",
  author: "Fernando Pessoa",
};

export const demoBanners: Banner[] = [
  {
    id: "1",
    title: "Destaques da Semana",
    subtitle: "As melhores leituras literárias para inspirar sua alma",
    image_url: null,
    link_url: "/categoria/poesia",
    banner_type: "hero",
    sort_order: 1,
    is_active: true,
  },
];

function makeCard(
  partial: Partial<PublicationCard> & Pick<PublicationCard, "id" | "title" | "slug" | "type">
): PublicationCard {
  return {
    author_name: "Autor Anônimo",
    excerpt: "Um trecho que convida à leitura completa desta bela obra literária.",
    views_count: 120,
    likes_count: 24,
    published_at: new Date().toISOString(),
    ...partial,
  };
}

export const demoPoems: PublicationCard[] = [
  makeCard({ id: "p1", title: "Silêncio da Manhã", slug: "silencio-da-manha", type: "poem", likes_count: 89, views_count: 340 }),
  makeCard({ id: "p2", title: "Versos ao Vento", slug: "versos-ao-vento", type: "poem", likes_count: 56 }),
  makeCard({ id: "p3", title: "Luar de Inverno", slug: "luar-de-inverno", type: "poem", likes_count: 42 }),
];

export const demoChronicles: PublicationCard[] = [
  makeCard({ id: "c1", title: "Café da Esquina", slug: "cafe-da-esquina", type: "chronicle" }),
  makeCard({ id: "c2", title: "Cartas Não Enviadas", slug: "cartas-nao-enviadas", type: "chronicle" }),
];

export const demoStories: PublicationCard[] = [
  makeCard({ id: "s1", title: "O Relógio Parado", slug: "o-relogio-parado", type: "story" }),
  makeCard({ id: "s2", title: "A Última Estação", slug: "a-ultima-estacao", type: "story" }),
];

export const demoMagazines: Magazine[] = [
  {
    id: "m-edicao-20",
    title: "Prosa & Poesia — Edição 20",
    slug: "edicao-20",
    description:
      "Edição 20 da revista digital. Leia página a página no formato revista.",
    cover_image_url: null,
    pdf_url: "/magazines/edicao-20.pdf",
    status: "published",
    featured: true,
    views_count: 0,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const demoFeaturedPoem = {
  id: "fp1",
  title: "Onde a Alma Repousa",
  slug: "onde-a-alma-repousa",
  author_name: "Maria das Letras",
  content: `Entre o ruído do mundo\n e o silêncio do peito,\n há um verso que não dorme,\n há um sonho que não esquece.\n\nLeio-te nas páginas\n que o tempo não apagou,\n e encontro na tua voz\n o abrigo que busquei.`,
  excerpt: "Entre o ruído do mundo e o silêncio do peito, há um verso que não dorme...",
  type: "poem" as const,
  views_count: 512,
  likes_count: 128,
  published_at: new Date().toISOString(),
};
