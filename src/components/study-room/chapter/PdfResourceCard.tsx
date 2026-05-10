"use client";

import { CalendarOutlined, DownloadOutlined, FilePdfOutlined } from "@ant-design/icons";
import { memo } from "react";
import type { ApiChapterPdfResource } from "@/lib/api/types";
import { cn } from "@/lib/cn";

export type PdfResourceCardProps = {
  resource: ApiChapterPdfResource;
  onViewPdf: () => void;
  onDownload: () => void;
};

export const PdfResourceCard = memo(function PdfResourceCard({
  resource,
  onViewPdf,
  onDownload,
}: PdfResourceCardProps) {
  const dateLine = resource.publishedAtLabel?.trim() || "—";

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-orange-100/70 bg-gradient-to-br from-orange-50/60 to-card shadow-sm",
        "dark:border-orange-900/35 dark:from-orange-950/20 dark:to-card",
      )}
    >
      <span className="block h-1 w-full bg-gradient-to-r from-primary to-primary/60" aria-hidden />
      <div className="flex min-h-0 flex-1 flex-col gap-3 px-4 py-4 sm:px-5">
        <p className="font-display font-bold leading-snug text-foreground line-clamp-3">{resource.title}</p>
        <p className="flex items-center gap-2 text-sm text-muted">
          <CalendarOutlined className="text-primary" aria-hidden />
          {dateLine}
        </p>
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          <button
            type="button"
            onClick={onViewPdf}
            className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-border-soft bg-card px-3 text-sm font-bold text-foreground shadow-sm transition hover:border-primary/30 sm:flex-none sm:px-4"
          >
            <FilePdfOutlined className="text-rose-500" aria-hidden />
            View PDF
          </button>
          <button
            type="button"
            onClick={onDownload}
            className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-border-soft bg-card px-3 text-sm font-bold text-foreground shadow-sm transition hover:border-primary/30 sm:flex-none sm:px-4"
          >
            <DownloadOutlined aria-hidden />
            Download
          </button>
        </div>
      </div>
    </div>
  );
});
