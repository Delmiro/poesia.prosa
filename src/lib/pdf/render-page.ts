import type { PDFDocumentProxy } from "pdfjs-dist";

let workerReady = false;

export async function initPdfWorker() {
  if (workerReady) return;
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  workerReady = true;
}

export async function loadPdfDocument(url: string): Promise<PDFDocumentProxy> {
  await initPdfWorker();
  const pdfjs = await import("pdfjs-dist");
  const task = pdfjs.getDocument(url);
  return task.promise;
}

export async function renderPdfPageToImage(
  pdf: PDFDocumentProxy,
  pageNumber: number,
  targetWidth: number
): Promise<{ dataUrl: string; width: number; height: number }> {
  const page = await pdf.getPage(pageNumber);
  const baseViewport = page.getViewport({ scale: 1 });
  const scale = targetWidth / baseViewport.width;
  const viewport = page.getViewport({ scale: scale * (typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1.5) });

  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas não disponível");

  await page.render({ canvasContext: ctx, viewport, canvas }).promise;

  const displayScale = targetWidth / baseViewport.width;
  const displayHeight = baseViewport.height * displayScale;

  return {
    dataUrl: canvas.toDataURL("image/jpeg", 0.92),
    width: targetWidth,
    height: displayHeight,
  };
}

export function calcBookDimensions(
  pageWidth: number,
  pageHeight: number,
  maxHeight: number
): { width: number; height: number } {
  const ratio = pageWidth / pageHeight;
  let height = Math.min(maxHeight, pageHeight);
  let width = height * ratio;

  const maxWidth = typeof window !== "undefined" ? window.innerWidth - 48 : 900;
  if (width > maxWidth) {
    width = maxWidth;
    height = width / ratio;
  }

  return { width: Math.floor(width), height: Math.floor(height) };
}
