"use client";

import Image from "next/image";
import { isCourseBookable } from "@/components/book-demo/courseUtils";
import { useBookDemoFlow } from "@/providers/BookDemoFlowProvider";
import { cn } from "@/lib/cn";

const BULLET_ICONS = ["📚", "📅", "👥", "✅"] as const;
const BULLET_BG = [
  "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-200",
  "bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-200",
  "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-200",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200",
] as const;

const cardClassName =
  "flex w-full flex-col overflow-hidden items-stretch rounded-3xl border border-border-soft bg-card text-left shadow-[0_20px_50px_-24px_rgba(0,0,0,0.2)] transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export function FeaturedPrograms() {
  const { courses, coursesLoading: loading, coursesError: loadError, openBookForCourse, openInterestForCourse } =
    useBookDemoFlow();

  return (
    <section id="programs" className="border-b border-border-soft bg-card/40 px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Pick a learning program &amp; get started!
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-muted sm:text-lg">
            Choose from our <strong className="text-primary">best</strong> courses for your kid{" "}
            <span aria-hidden>⭐</span>
            <span className="sr-only">star</span>
          </p>
        </div>

        {loadError ? (
          <p className="mx-auto mt-8 max-w-lg text-center text-sm text-red-600 dark:text-red-400">{loadError}</p>
        ) : null}

        {loading ? (
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[520px] animate-pulse rounded-3xl bg-surface-subtle ring-1 ring-border-soft"
              />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="mx-auto mt-12 max-w-lg rounded-2xl border border-dashed border-border-soft bg-surface-subtle/50 p-8 text-center">
            <p className="font-medium text-foreground">No courses available at the moment.</p>
          </div>
        ) : (
          <ul className="mt-12 grid gap-8 md:grid-cols-3">
            {courses.map((c, index) => {
              const thumb = c.thumbnailUrl?.trim() || "/courses/thumb-stories.svg";
              const rawBullets = Array.isArray(c.marketingBullets) ? c.marketingBullets : [];
              let lines = rawBullets.map((b) => String(b).trim()).filter(Boolean).slice(0, 4);
              if (lines.length === 0) {
                const a = c.liveSessionsFirst ?? 6;
                const b = c.liveSessionsSecond ?? 6;
                lines = [
                  `Program: ${a} + ${b} live sessions (${a + b} classes)`,
                  `Demo booking: ₹${c.priceRupees ?? 9}`,
                  "Small groups · IIT-trained mentors",
                  "Classes 1–8 · paced batches",
                ];
              }
              const title = (c.marketingTitle ?? c.title ?? "Course").trim();
              const canBookDemo = isCourseBookable(c);

              const inner = (
                <>
                  <div className="relative aspect-[4/3] bg-surface-subtle">
                    <Image
                      src={thumb}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority={index < 3}
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-xl font-extrabold text-foreground sm:text-2xl">
                      {title}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{c.description}</p>
                    <ul className="mt-5 flex flex-1 flex-col gap-3">
                      {lines.slice(0, 4).map((line, i) => (
                        <li key={i} className="flex gap-3 text-sm text-foreground/90">
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base ${BULLET_BG[i % 4]}`}
                            aria-hidden
                          >
                            {BULLET_ICONS[i % 4]}
                          </span>
                          <span className="pt-1 leading-snug">{line}</span>
                        </li>
                      ))}
                    </ul>
                    {canBookDemo ? (
                      <span className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-primary text-center text-base font-bold text-primary-foreground shadow-lg shadow-primary/25 pointer-events-none">
                        Book a Demo
                      </span>
                    ) : (
                      <span className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-2xl border-2 border-dashed border-amber-500/50 bg-amber-500/5 text-center text-base font-bold text-amber-800 dark:text-amber-200/90">
                        Coming soon
                      </span>
                    )}
                  </div>
                </>
              );

              return (
                <li key={c.id}>
                  {canBookDemo ? (
                    <button
                      type="button"
                      className={cn(cardClassName, "cursor-pointer")}
                      style={{ height: "stretch" }}
                      onClick={() => openBookForCourse(c)}
                    >
                      {inner}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={cn(cardClassName, "cursor-pointer border-dashed border-2")}
                      style={{ height: "stretch" }}
                      onClick={() => openInterestForCourse(c)}
                    >
                      {inner}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
