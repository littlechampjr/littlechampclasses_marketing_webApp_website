"use client";

import { ShareAltOutlined } from "@ant-design/icons";
import { App } from "antd";
import { useCallback } from "react";
import type { ApiChapterMeta } from "@/lib/api/types";
import { cn } from "@/lib/cn";

type Props = {
  meta: ApiChapterMeta;
  className?: string;
};

export function ChapterContentHeader({ meta, className }: Props) {
  const { message } = App.useApp();

  const onShare = useCallback(async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      message.success("Link copied to clipboard.");
    } catch {
      message.info(url);
    }
  }, [message]);

  const titleLine = `${meta.chapterTitle}${meta.batchDateRangeLabel ? ` (${meta.batchDateRangeLabel})` : ""}`;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-orange-100/80 bg-gradient-to-br from-orange-50/95 via-amber-50/60 to-card dark:border-orange-900/40 dark:from-orange-950/40 dark:via-card dark:to-card",
        className,
      )}
    >
      <div className="p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              {titleLine}
            </h1>
            <p className="mt-2 text-sm font-medium text-muted">
              {meta.programTitle} · {meta.subjectLabel}
            </p>
          </div>
          <button
            type="button"
            onClick={onShare}
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-2xl border-2 border-primary/40 bg-card/80 px-4 py-2.5 text-sm font-bold text-primary shadow-sm backdrop-blur-sm transition hover:bg-primary hover:text-primary-foreground dark:bg-card/60"
          >
            <ShareAltOutlined />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
