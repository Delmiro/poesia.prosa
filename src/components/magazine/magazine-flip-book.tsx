"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { FlipPage } from "@/components/magazine/flip-page";
import {
  calcBookDimensions,
  loadPdfDocument,
  renderPdfPageToImage,
} from "@/lib/pdf/render-page";

const HTMLFlipBook = dynamic(
  () => import("react-pageflip").then((m) => m.default),
  { ssr: false }
);

interface MagazineFlipBookProps {
  pdfUrl: string;
  onPageChange?: (page: number, total: number) => void;
  onReady?: (api: { flipNext: () => void; flipPrev: () => void }) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FlipBookRef = any;

export function MagazineFlipBook({
  pdfUrl,
  onPageChange,
  onReady,
}: MagazineFlipBookProps) {
  const bookRef = useRef<FlipBookRef>(null);
  const pdfRef = useRef<PDFDocumentProxy | null>(null);
  const renderingRef = useRef<Set<number>>(new Set());
  const imagesRef = useRef<Record<number, string>>({});

  const [numPages, setNumPages] = useState(0);
  const [pageImages, setPageImages] = useState<Record<number, string>>({});
  const [bookSize, setBookSize] = useState({ width: 420, height: 594 });
  const [error, setError] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  const targetPageWidth = useCallback(() => {
    if (typeof window === "undefined") return 450;
    const isMobile = window.innerWidth < 768;
    return isMobile ? Math.min(window.innerWidth - 32, 420) : Math.min(520, window.innerWidth * 0.42);
  }, []);

  const renderPage = useCallback(
    async (pageNum: number) => {
      const pdf = pdfRef.current;
      if (!pdf || imagesRef.current[pageNum] || renderingRef.current.has(pageNum)) return;

      renderingRef.current.add(pageNum);
      try {
        const tw = targetPageWidth();
        const { dataUrl } = await renderPdfPageToImage(pdf, pageNum, tw);
        imagesRef.current[pageNum] = dataUrl;
        setPageImages((prev) => ({ ...prev, [pageNum]: dataUrl }));
      } finally {
        renderingRef.current.delete(pageNum);
      }
    },
    [targetPageWidth]
  );

  const prefetchAround = useCallback(
    (center: number) => {
      if (!numPages) return;
      const start = Math.max(1, center - 1);
      const end = Math.min(numPages, center + 3);
      for (let i = start; i <= end; i++) {
        void renderPage(i);
      }
    },
    [numPages, renderPage]
  );

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      setInitializing(true);
      setError(null);
      setPageImages({});

      try {
        const pdf = await loadPdfDocument(pdfUrl);
        if (cancelled) return;

        pdfRef.current = pdf;
        setNumPages(pdf.numPages);

        const tw = targetPageWidth();
        const first = await renderPdfPageToImage(pdf, 1, tw);
        if (cancelled) return;

        const maxH = typeof window !== "undefined" ? window.innerHeight * 0.72 : 700;
        const dims = calcBookDimensions(first.width, first.height, maxH);
        setBookSize(dims);
        imagesRef.current = { 1: first.dataUrl };
        setPageImages({ 1: first.dataUrl });
        setLoadProgress(Math.round((1 / pdf.numPages) * 100));
        setInitializing(false);

        prefetchAround(1);

        for (let i = 2; i <= pdf.numPages; i++) {
          if (cancelled) break;
          if (!imagesRef.current[i]) {
            const { dataUrl } = await renderPdfPageToImage(pdf, i, tw);
            if (cancelled) break;
            imagesRef.current[i] = dataUrl;
            setPageImages((prev) => ({ ...prev, [i]: dataUrl }));
          }
          if (!cancelled) {
            setLoadProgress(Math.round((i / pdf.numPages) * 100));
          }
          await new Promise((r) => setTimeout(r, 0));
        }
      } catch {
        if (!cancelled) {
          setError("Não foi possível abrir a revista. Verifique o arquivo PDF.");
          setInitializing(false);
        }
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
      pdfRef.current = null;
    };
  }, [pdfUrl, prefetchAround, targetPageWidth]);

  useEffect(() => {
    if (!onReady || initializing) return;
    onReady({
      flipNext: () => bookRef.current?.pageFlip()?.flipNext(),
      flipPrev: () => bookRef.current?.pageFlip()?.flipPrev(),
    });
  }, [onReady, initializing]);

  const handleFlip = useCallback(
    (e: { data: number }) => {
      const current = e.data + 1;
      onPageChange?.(current, numPages);
      prefetchAround(current);
    },
    [numPages, onPageChange, prefetchAround]
  );

  if (error) {
    return (
      <div className="magazine-flip-error rounded-xl bg-card p-8 text-center text-muted">
        {error}
      </div>
    );
  }

  if (initializing || !pageImages[1]) {
    return (
      <div className="magazine-flip-loading">
        <div className="magazine-flip-loading__book">
          <div className="magazine-flip-loading__page" />
          <div className="magazine-flip-loading__page magazine-flip-loading__page--back" />
        </div>
        <p className="mt-6 text-sm text-muted">Preparando a revista…</p>
        <div className="mt-3 h-1 w-48 overflow-hidden rounded-full bg-border">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${loadProgress}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="magazine-flip-wrapper">
      <HTMLFlipBook
        ref={bookRef}
        style={{}}
        className="magazine-flip-book"
        width={bookSize.width}
        height={bookSize.height}
        size="fixed"
        minWidth={280}
        maxWidth={700}
        minHeight={380}
        maxHeight={1000}
        startPage={0}
        showCover
        mobileScrollSupport={false}
        clickEventForward
        useMouseEvents
        usePortrait
        swipeDistance={24}
        showPageCorners
        disableFlipByClick={false}
        drawShadow
        maxShadowOpacity={0.65}
        flippingTime={900}
        startZIndex={0}
        autoSize={false}
        onFlip={handleFlip}
      >
        {Array.from({ length: numPages }, (_, i) => {
          const pageNum = i + 1;
          return (
            <FlipPage
              key={pageNum}
              pageNumber={pageNum}
              imageSrc={pageImages[pageNum]}
              isCover={pageNum === 1 || pageNum === numPages}
            />
          );
        })}
      </HTMLFlipBook>

      <p className="magazine-flip-hint">
        Arraste o canto da página, clique na borda ou use ← → para virar como em uma revista de papel
      </p>
    </div>
  );
}
