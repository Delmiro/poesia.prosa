"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface HomeSettingsFormProps {
  settings: { key: string; value: Record<string, unknown> }[];
  banners: { id: string; title: string; subtitle?: string | null; is_active: boolean }[];
  poems: { id: string; title: string }[];
  magazines: { id: string; title: string }[];
}

export function HomeSettingsForm({
  settings,
  banners,
  poems,
  magazines,
}: HomeSettingsFormProps) {
  const quoteSetting = settings.find((s) => s.key === "quote_of_day");
  const quote = (quoteSetting?.value ?? { text: "", author: "" }) as {
    text: string;
    author: string;
  };

  const [quoteText, setQuoteText] = useState(quote.text);
  const [quoteAuthor, setQuoteAuthor] = useState(quote.author);
  const [featuredPoem, setFeaturedPoem] = useState("");
  const [featuredMagazine, setFeaturedMagazine] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const save = async () => {
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/admin/home", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quote_of_day: { text: quoteText, author: quoteAuthor },
        featured_poem_id: featuredPoem || null,
        featured_magazine_id: featuredMagazine || null,
      }),
    });

    setLoading(false);
    setMessage(res.ok ? "Configurações salvas!" : "Erro ao salvar.");
  };

  return (
    <div className="mt-8 max-w-xl space-y-8">
      <section className="rounded-xl border border-border p-6">
        <h2 className="font-medium">Frase do dia</h2>
        <textarea
          value={quoteText}
          onChange={(e) => setQuoteText(e.target.value)}
          rows={3}
          className="mt-3 w-full rounded-lg border border-border bg-background px-4 py-2.5"
          placeholder="Frase inspiradora"
        />
        <input
          value={quoteAuthor}
          onChange={(e) => setQuoteAuthor(e.target.value)}
          className="mt-3 w-full rounded-lg border border-border bg-background px-4 py-2.5"
          placeholder="Autor da citação"
        />
      </section>

      <section className="rounded-xl border border-border p-6 space-y-4">
        <h2 className="font-medium">Destaques</h2>
        <div>
          <label className="text-sm text-muted">Poema em destaque</label>
          <select
            value={featuredPoem}
            onChange={(e) => setFeaturedPoem(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2.5"
          >
            <option value="">Automático (último destaque)</option>
            {poems.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-muted">Revista em destaque</label>
          <select
            value={featuredMagazine}
            onChange={(e) => setFeaturedMagazine(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2.5"
          >
            <option value="">Automático</option>
            {magazines.map((m) => (
              <option key={m.id} value={m.id}>{m.title}</option>
            ))}
          </select>
        </div>
      </section>

      <section className="rounded-xl border border-border p-6">
        <h2 className="font-medium">Banners ativos ({banners.length})</h2>
        <p className="mt-2 text-sm text-muted">
          Edite banners completos em Configurações → Banners (em breve) ou diretamente no Supabase.
        </p>
        <ul className="mt-4 space-y-2 text-sm">
          {banners.map((b) => (
            <li key={b.id} className="flex justify-between">
              <span>{b.title}</span>
              <span className={b.is_active ? "text-green-600" : "text-muted"}>
                {b.is_active ? "Ativo" : "Inativo"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {message && <p className="text-sm text-accent">{message}</p>}
      <Button onClick={save} disabled={loading}>
        {loading ? "Salvando…" : "Salvar configurações da home"}
      </Button>
    </div>
  );
}
