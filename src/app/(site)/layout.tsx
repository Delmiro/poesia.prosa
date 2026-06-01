import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getCategories, getMenus } from "@/lib/services/content";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mainMenu, footerMenu, categories] = await Promise.all([
    getMenus("main"),
    getMenus("footer"),
    getCategories(),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header mainMenu={mainMenu} />
      <main className="flex-1">{children}</main>
      <Footer footerMenu={footerMenu} categories={categories} />
    </div>
  );
}
