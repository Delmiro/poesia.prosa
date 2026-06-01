"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { SeoSettings } from "@/types";

export function SeoSettingsForm({ settings }: { settings: SeoSettings[] }) {
  const home = settings.find((s) => s.page_key === "home") ?? {
    page_key: "home",
    meta_title: "",
    meta_description: "",
    og_image_url: "",
  };

  const [metaTitle, setMetaTitle] = useState(home.meta_title ?? "");
  const [metaDescription, setMetaDescription] = useState(home.meta_description ?? "");
  const [ogImage, setOgImage] = useState(home.og_image_url ?? "");
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    await fetch("/api/admin/seo", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page_key: "home",
        meta_title: metaTitle,
        meta_description: metaDescription,
        og_image_url: ogImage,
      }),
    });
    setLoading(false);
  };

  return (
    <div className="mt-8 max-w-xl space-y-4">
      <div>
        <label className="text-sm font-medium">Meta Title (Home)</label>
        <input
          value={metaTitle}
          onChange={(e) => setMetaTitle(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2.5"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Meta Description</label>
        <textarea
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2.5"
        />
      </div>
      <div>
        <label className="text-sm font-medium">OG Image URL</label>
        <input
          value={ogImage}
          onChange={(e) => setOgImage(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2.5"
        />
      </div>
      <Button onClick={save} disabled={loading}>
        {loading ? "Salvando…" : "Salvar SEO"}
      </Button>
    </div>
  );
}
