"use client";

import { cn } from "@/lib/cn";

type Props = { title?: string; className?: string };

export function ChapterEmptyPanel({ title = "No results found", className }: Props) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border-soft bg-surface-subtle/30 py-16 px-6 text-center",
        className,
      )}
    >
      <div
        className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-100/90 to-amber-50 text-4xl opacity-90 dark:from-orange-950/50 dark:to-card"
        aria-hidden
      >
        📄
      </div>
      <p className="text-base font-semibold text-muted">{title}</p>
      <p className="max-w-sm text-sm text-muted/90">
        Content will appear here when your mentors publish materials for this chapter.
      </p>
    </div>
  );
}
