"use client";

import { BookOutlined, RightOutlined } from "@ant-design/icons";
import Link from "next/link";
import { cn } from "@/lib/cn";
import type { ApiStudyChapter, ApiStudySubject } from "@/lib/api/types";
import { useCallback, useMemo, useState } from "react";

type Props = {
  subjects: ApiStudySubject[];
  enrollmentId: string;
  className?: string;
};

function ChapterCard({
  chapter,
  enrollmentId,
}: {
  chapter: ApiStudyChapter;
  enrollmentId: string;
}) {
  const stats = [
    chapter.videoCount > 0 ? `${chapter.videoCount} Videos` : null,
    `${chapter.exerciseCount} Exercises`,
    chapter.noteCount > 0 ? `${chapter.noteCount} Notes` : null,
  ].filter(Boolean);

  const inner = (
    <>
      <div className="w-1 shrink-0 bg-gradient-to-b from-primary to-primary/70" aria-hidden />
      <div className="flex min-w-0 flex-1 items-center justify-between gap-4 px-4 py-4 sm:px-5">
        <div className="min-w-0">
          <p className="font-display font-bold text-foreground">{chapter.title}</p>
          <p className="mt-1 text-xs text-muted sm:text-sm">{stats.join("  ·  ")}</p>
        </div>
        <RightOutlined className="shrink-0 text-muted" aria-hidden />
      </div>
    </>
  );

  if (chapter.id?.trim()) {
    return (
      <Link
        href={`/my-programs/${encodeURIComponent(enrollmentId)}/chapters/${encodeURIComponent(chapter.id)}`}
        className={cn(
          "flex items-stretch gap-0 overflow-hidden rounded-2xl border border-border-soft bg-card shadow-sm",
          "transition hover:border-primary/25 hover:shadow-md",
        )}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div
      className={cn(
        "flex items-stretch gap-0 overflow-hidden rounded-2xl border border-border-soft bg-card shadow-sm",
      )}
    >
      {inner}
    </div>
  );
}

export function StudyRoom({ subjects, enrollmentId, className }: Props) {
  const sorted = useMemo(
    () => [...subjects].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [subjects],
  );

  const [pickedKey, setPickedKey] = useState<string | null>(null);

  const activeKey = useMemo(() => {
    if (!sorted.length) return "";
    if (pickedKey && sorted.some((s) => s.key === pickedKey)) return pickedKey;
    return sorted[0]!.key;
  }, [sorted, pickedKey]);

  const active = sorted.find((s) => s.key === activeKey) ?? sorted[0];
  const chapters = useMemo(
    () =>
      [...(active?.chapters ?? [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [active],
  );

  const onPick = useCallback((key: string) => {
    setPickedKey(key);
  }, []);

  if (!sorted.length) {
    return (
      <div className={cn("rounded-2xl border border-dashed border-border-soft p-10 text-center", className)}>
        <p className="font-medium text-foreground">Study outline coming soon</p>
        <p className="mt-2 text-sm text-muted">
          Your subject chapters will appear here once they&apos;re published.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-3xl border border-border-soft bg-card p-4 shadow-[0_20px_50px_-32px_rgba(0,0,0,0.12)] sm:p-6",
        className,
      )}
    >
      <div className="mb-6 flex items-center gap-2">
        <span className="h-6 w-1 rounded-full bg-primary" aria-hidden />
        <h2 className="font-display text-lg font-bold text-foreground">Subjects</h2>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <nav
          aria-label="Subjects"
          className={cn(
            "flex gap-3 overflow-x-auto pb-1 lg:w-44 lg:flex-shrink-0 lg:flex-col lg:overflow-visible lg:pb-0",
            "scrollbar-thin",
          )}
        >
          {sorted.map((s) => {
            const isActive = s.key === activeKey;
            return (
              <button
                type="button"
                key={s.key}
                onClick={() => onPick(s.key)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-2xl border px-3 py-3 text-center transition lg:w-full lg:flex-row lg:items-center lg:px-3",
                  isActive
                    ? "border-primary/40 bg-primary/10 shadow-sm"
                    : "border-border-soft bg-surface-subtle/50 hover:border-primary/20",
                )}
              >
                <span
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-full text-primary",
                    isActive ? "bg-primary text-primary-foreground" : "bg-muted/40 text-primary",
                  )}
                >
                  <BookOutlined />
                </span>
                <span
                  className={cn(
                    "max-w-[5.5rem] text-xs font-semibold lg:max-w-none lg:text-left lg:text-sm",
                    isActive ? "text-foreground" : "text-muted",
                  )}
                >
                  {s.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="min-w-0 flex-1">
          <div className="mb-4 flex items-center gap-2">
            <BookOutlined className="text-primary" aria-hidden />
            <h3 className="font-display text-base font-bold text-foreground sm:text-lg">
              {active?.label ?? "Subject"} chapters
            </h3>
          </div>
          <div className="space-y-3">
            {chapters.map((ch) => (
              <ChapterCard
                key={ch.id?.trim() ? ch.id : `${active?.key}-${ch.title}-${ch.sortOrder}`}
                chapter={ch}
                enrollmentId={enrollmentId}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
