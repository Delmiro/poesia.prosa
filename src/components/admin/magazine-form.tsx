"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function MagazineForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile || !title) return;
    setLoading(true);
    setMessage("");

    const supabase = createClient();
    const slug = slugify(title);
    const pdfPath = `magazines/${slug}-${Date.now()}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("magazines")
      .upload(pdfPath, pdfFile);

    if (uploadError) {
      setMessage(`Erro no upload: ${uploadError.message}`);
      setLoading(false);
      return;
    }

    const { data: pdfUrl } = supabase.storage.from("magazines").getPublicUrl(pdfPath);

    let coverUrl: string | null = null;
    if (coverFile) {
      const coverPath = `covers/${slug}-${Date.now()}.jpg`;
      await supabase.storage.from("publications").upload(coverPath, coverFile);
      coverUrl = supabase.storage.from("publications").getPublicUrl(coverPath).data.publicUrl;
    }

    const res = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        table: "magazines",
        data: {
          title,
          slug,
          description,
          pdf_url: pdfUrl.publicUrl,
          cover_image_url: coverUrl,
          status: "published",
          published_at: new Date().toISOString(),
        },
      }),
    });

    setLoading(false);
    setMessage(res.ok ? "Revista publicada!" : "Erro ao salvar.");
    if (res.ok) {
      setTitle("");
      setDescription("");
      setPdfFile(null);
      setCoverFile(null);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl border border-border p-6">
      <h2 className="font-medium">Nova revista</h2>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título"
        required
        className="w-full rounded-lg border border-border bg-background px-4 py-2.5"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descrição"
        rows={3}
        className="w-full rounded-lg border border-border bg-background px-4 py-2.5"
      />
      <div>
        <label className="text-sm text-muted">PDF</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
          required
          className="mt-1 block w-full text-sm"
        />
      </div>
      <div>
        <label className="text-sm text-muted">Capa (opcional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
          className="mt-1 block w-full text-sm"
        />
      </div>
      {message && <p className="text-sm text-accent">{message}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Enviando…" : "Publicar revista"}
      </Button>
    </form>
  );
}
