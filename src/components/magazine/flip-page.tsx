"use client";

import { forwardRef } from "react";

interface FlipPageProps {
  pageNumber: number;
  imageSrc?: string;
  isCover?: boolean;
}

export const FlipPage = forwardRef<HTMLDivElement, FlipPageProps>(
  ({ pageNumber, imageSrc, isCover }, ref) => {
    return (
      <div
        ref={ref}
        className="magazine-flip-page"
        data-density={isCover ? "hard" : "soft"}
      >
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={`Página ${pageNumber}`}
            className="magazine-flip-page__img"
            draggable={false}
          />
        ) : (
          <div className="magazine-flip-page__loading">
            <div className="magazine-flip-page__spinner" />
            <span>Página {pageNumber}</span>
          </div>
        )}
      </div>
    );
  }
);

FlipPage.displayName = "FlipPage";
