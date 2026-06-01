"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/utils";
import { CONTENT_LABELS, CONTENT_TABLES, type ContentType } from "@/types";

interface ContentFormProps {
  type: ContentType;
  initial?: Record<string, unknown>;
  categories: { id: string; name: string }[];
}

export function ContentForm({ type, initial, categories }: ContentFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState((initial?.title as string) ?? "");
  const [slug, setSlug] = useState((initial?.slug as string) ?? "");
  const [author, setAuthor] = useState((initial?.author_name as string) ?? "");
  const [excerpt, setExcerpt] = useState((initial?.excerpt as string) ?? "");
  const [content, setContent] = useState((initial?.content as string) ?? "");
  const [status, setStatus] = useState((initial?.status as string) ?? "draft");
  const [featured, setFeatured] = useState(Boolean(initial?.featured));
  const [categoryId, setCategoryId] = useState((initial?.category_id as string) ?? "");
  const [loading, setLoading] = useState(false);

  if (type === "magazine") return null;

  const table = CONTENT_TABLES[type];
  const isEdit = Boolean(initial?.id);

  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (!isEdit || !slug) setSlug(slugify(v));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title,
      slug: slug || slugify(title),
      author_name: author,
      excerpt,
      content,
      status,
      featured,
      category_id: categoryId || null,
      published_at: status === "published" ? new Date().toISOString() : null,
    };

    const res = await fetch("/api/admin/content", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        table,
        id: initial?.id,
        data: payload,
      }),
    });

    setLoading(false);
    if (res.ok) router.push("/admin/conteudo");
  };

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-5">
      <h2 className="font-display text-2xl">
        {isEdit ? "Editar" : "Novo"} {CONTENT_LABELS[type]}
      </h2>

      <div>
        <label className="mb-1 block text-sm font-medium">Título</label>
        <input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Slug (URL)</label>
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Autor</label>
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Categoria</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5"
        >
          <option value="">— Selecione —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Resumo</label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Conteúdo</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={12}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-mono text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-border bg-background px-4 py-2.5"
          >
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
            <option value="archived">Arquivado</option>
          </select>
        </div>
        <label className="flex items-center gap-2 self-end text-sm">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          Destaque
        </label>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Salvando…" : "Salvar"}
      </Button>
    </form>
  );
}
