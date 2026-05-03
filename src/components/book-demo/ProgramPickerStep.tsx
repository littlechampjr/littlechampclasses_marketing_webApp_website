"use client";

import Image from "next/image";
import { isCourseBookable } from "@/components/book-demo/courseUtils";
import { cn } from "@/lib/cn";
import type { ApiCourse } from "@/lib/api/types";

const BULLET_ICONS = ["📚", "📅", "👥", "✅"] as const;
const BULLET_BG = [
  "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-200",
  "bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-200",
  "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-200",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200",
] as const;

const cardClassName =
  "flex w-full flex-col overflow-hidden items-stretch rounded-2xl border-2 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

type Props = {
  courses: ApiCourse[];
  selectedCourseId: string | null;
  onSelect: (id: string) => void;
  loading: boolean;
};

function linesFor(c: ApiCourse): string[] {
  const rawBullets = Array.isArray(c.marketingBullets) ? c.marketingBullets : [];
  const mapped = rawBullets.map((b) => String(b).trim()).filter(Boolean).slice(0, 4);
  if (mapped.length > 0) return mapped;
  const a = c.liveSessionsFirst ?? 6;
  const b = c.liveSessionsSecond ?? 6;
  return [
    `Program: ${a} + ${b} live sessions (${a + b} classes)`,
    `Demo booking: ₹${c.priceRupees ?? 9}`,
    "Small groups · IIT-trained mentors",
    "Classes 1–8 · paced batches",
  ];
}

export function ProgramPickerStep({ courses, selectedCourseId, onSelect, loading }: Props) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 animate-pulse rounded-2xl bg-surface-subtle ring-1 ring-border-soft" />
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <p className="text-center text-sm text-muted">No programs to show right now. Please try again later.</p>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((c) => {
        const selected = c.id === selectedCourseId;
        const thumb = c.thumbnailUrl?.trim() || "/courses/thumb-stories.svg";
        const lineItems = linesFor(c);
        const title = (c.marketingTitle ?? c.title ?? "Course").trim();
        const bookable = isCourseBookable(c);

        return (
          <li key={c.id} className="min-w-0">
            <button
              type="button"
              onClick={() => onSelect(c.id)}
              className={cn(
                cardClassName,
                "border-border-soft bg-card shadow-md hover:-translate-y-0.5 hover:shadow-lg",
                selected
                  ? "border-primary ring-2 ring-primary/30"
                  : "hover:border-primary/40",
              )}
            >
              <div className="relative aspect-[4/3] bg-surface-subtle">
                <Image
                  src={thumb}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 30vw"
                />
                {selected ? (
                  <span
                    className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground shadow-md"
                    aria-hidden
                  >
                    ✓
                  </span>
                ) : null}
              </div>
              <div className="flex flex-1 flex-col p-4 text-left">
                <h3 className="font-display text-lg font-extrabold text-foreground">{title}</h3>
                <p className="mt-2 line-clamp-2 text-left text-xs leading-relaxed text-muted">{c.description}</p>
                <ul className="mt-3 flex flex-1 flex-col gap-1.5 text-left">
                  {lineItems.slice(0, 3).map((line, i) => (
                    <li key={i} className="flex gap-2 text-left text-xs text-foreground/90">
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm ${BULLET_BG[i % 4]}`}
                        aria-hidden
                      >
                        {BULLET_ICONS[i % 4]}
                      </span>
                      <span className="pt-0.5 leading-snug">{line}</span>
                    </li>
                  ))}
                </ul>
                <span
                  className={cn(
                    "mt-3 inline-flex w-full min-h-9 items-center justify-center rounded-xl text-center text-xs font-bold",
                    bookable
                      ? "bg-primary/10 text-primary"
                      : "border border-dashed border-border-soft bg-surface-subtle text-muted",
                  )}
                >
                  {bookable ? "Book a demo" : "Coming soon"}
                </span>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
