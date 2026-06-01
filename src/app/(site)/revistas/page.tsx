import { MagazinesSection } from "@/components/home/magazines-section";
import { getMagazines } from "@/lib/services/content";

export const metadata = {
  title: "Revistas Digitais",
  description: "Revistas literárias em PDF para leitura online.",
};

export default async function RevistasPage() {
  const magazines = await getMagazines(12);

  return (
    <div className="px-4 py-12 md:px-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-display text-4xl font-semibold">Revistas Digitais</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Navegue pelas edições, leia online e compartilhe com outros amantes da literatura.
        </p>
      </div>
      <MagazinesSection magazines={magazines} />
    </div>
  );
}
