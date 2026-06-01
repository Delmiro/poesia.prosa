"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const MagazineFlipBook = dynamic(
  () =>
    import("@/components/magazine/magazine-flip-book").then((m) => m.MagazineFlipBook),
  { ssr: false }
);

interface MagazineReaderProps {
  pdfUrl: string;
  title: string;
}

export function MagazineReader({ pdfUrl, title }: MagazineReaderProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const flipApi = useRef<{ flipNext: () => void; flipPrev: () => void } | null>(null);

  const onPageChange = useCallback((page: number, total: number) => {
    setCurrentPage(page);
    setTotalPages(total);
  }, []);

  const onReady = useCallback((api: { flipNext: () => void; flipPrev: () => void }) => {
    flipApi.current = api;
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") flipApi.current?.flipPrev();
      if (e.key === "ArrowRight") flipApi.current?.flipNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copiado!");
    }
  };

  const progress = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;

  return (
    <div
      className={
        fullscreen
          ? "fixed inset-0 z-50 flex flex-col bg-[#1a1612]"
          : "rounded-2xl border border-border bg-card overflow-hidden"
      }
    >
      <div
        className={`flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 ${
          fullscreen ? "bg-[#252019]" : "bg-card"
        }`}
      >
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => flipApi.current?.flipPrev()}
            disabled={currentPage <= 1}
            aria-label="Página anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[7rem] text-center text-sm text-muted">
            {totalPages ? (
              <>
                Pág. <strong className="text-foreground">{currentPage}</strong> / {totalPages}
              </>
            ) : (
              "Abrindo…"
            )}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => flipApi.current?.flipNext()}
            disabled={currentPage >= totalPages}
            aria-label="Próxima página"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="hidden h-1.5 min-w-[80px] max-w-xs flex-1 overflow-hidden rounded-full bg-border sm:block">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFullscreen((f) => !f)}
            aria-label={fullscreen ? "Sair da tela cheia" : "Tela cheia"}
          >
            {fullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
          <Button variant="ghost" size="sm" onClick={share}>
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Compartilhar</span>
          </Button>
        </div>
      </div>

      <div
        className={`flex flex-1 flex-col items-center justify-center overflow-hidden py-6 md:py-10 ${
          fullscreen ? "bg-[#2c2419]" : "magazine-reader-stage"
        }`}
      >
        <MagazineFlipBook
          pdfUrl={pdfUrl}
          onPageChange={onPageChange}
          onReady={onReady}
        />
      </div>
    </div>
  );
}
