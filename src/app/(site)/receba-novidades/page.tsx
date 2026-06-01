import { NewsletterForm } from "@/components/newsletter/newsletter-form";

export const metadata = {
  title: "Receba Novidades",
  description: "Cadastre-se para receber novas poesias, artigos e revistas por e-mail ou WhatsApp.",
};

export default function RecebaNovidadesPage() {
  return (
    <div className="px-4 py-16 md:px-6">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="font-display text-4xl font-semibold">Receba Novidades</h1>
        <p className="mt-4 text-muted">
          Seja o primeiro a saber quando publicarmos novas poesias, artigos, revistas e notícias culturais.
        </p>
      </div>
      <div className="mx-auto mt-12 max-w-md">
        <NewsletterForm />
      </div>
    </div>
  );
}
