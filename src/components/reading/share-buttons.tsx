"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const encoded = encodeURIComponent(url);
  const text = encodeURIComponent(title);

  const shareNative = async () => {
    if (navigator.share) {
      await navigator.share({ title, url });
      return;
    }
    await navigator.clipboard.writeText(url);
    alert("Link copiado!");
  };

  return (
    <div className="flex gap-2">
      <Button variant="ghost" size="sm" onClick={shareNative} aria-label="Compartilhar">
        <Share2 className="h-4 w-4" />
      </Button>
      <a
        href={`https://twitter.com/intent/tweet?url=${encoded}&text=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full px-3 py-1.5 text-xs text-muted hover:bg-border/40"
      >
        X
      </a>
      <a
        href={`https://wa.me/?text=${text}%20${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full px-3 py-1.5 text-xs text-muted hover:bg-border/40"
      >
        WhatsApp
      </a>
    </div>
  );
}
