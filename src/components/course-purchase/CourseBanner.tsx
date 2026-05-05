"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import type { ApiCourse } from "@/lib/api/types";

export type CourseBannerSlide = {
  slug: string;
  displayTitle: string;
  eyebrow: string;
  subtitle: string;
  thumbnailUrl: string;
  previewCardProgramLine: string;
  previewCardBadge: string;
  dateLabel: string;
  dateRangeDisplay: string;
  subjectsLabel: string;
  subjectsLine: string;
};

function slideFromCourse(c: ApiCourse): CourseBannerSlide | null {
  const pf = c.purchaseFlow;
  if (!pf?.enabled) return null;
  const displayTitle =
    ((c.marketingTitle ?? "").trim() || (c.title ?? "").trim()).trim() || "Program";
  const dateRangeDisplay =
    (pf.dateRangeDisplay?.trim() ||
      (c.batches[0]?.dateRangeLabel ?? "").trim()) ||
    "Flexible start · see details";
  return {
    slug: c.slug,
    displayTitle,
    eyebrow: pf.bannerEyebrow.trim() || "Premium program",
    subtitle: pf.bannerSubtitle.trim() || c.description.trim(),
    thumbnailUrl: c.thumbnailUrl?.trim() || "/courses/thumb-stories.svg",
    previewCardProgramLine: pf.previewCardProgramLine.trim() || "MASTER PROGRAM",
    previewCardBadge: pf.previewCardBadge.trim() || "SCHOOL CURRICULUM",
    dateLabel: pf.dateLabel.trim() || "Schedule",
    dateRangeDisplay,
    subjectsLabel: pf.subjectsLabel.trim() || "Focus",
    subjectsLine: pf.subjects.length > 0 ? pf.subjects.join(", ") : c.description.trim(),
  };
}

export function mapCoursesToBannerSlides(courses: ApiCourse[]): CourseBannerSlide[] {
  return courses.map(slideFromCourse).filter(Boolean) as CourseBannerSlide[];
}

export function CourseBanner({ slides }: { slides: CourseBannerSlide[] }) {
  const [idx, setIdx] = useState(0);
  const n = slides.length;
  const k = n === 0 ? 0 : idx % n;
  const current = slides[k];

  const prev = useCallback(() => setIdx((i) => (n <= 1 ? i : (i - 1 + n) % n)), [n]);
  const next = useCallback(() => setIdx((i) => (n <= 1 ? i : (i + 1) % n)), [n]);

  if (!current || n === 0) return null;

  const isVectorThumb = /\.svg(\?.*)?$/i.test(current.thumbnailUrl);

  const gotoDetail = `/courses/${encodeURIComponent(current.slug)}`;

  const onKeyCarousel = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  return (
    <section
      className="border-b border-neutral-900 bg-[#09090b] text-white"
      aria-label="Premium programs"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="text-center">
          <p className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="text-amber-400/95" aria-hidden>
              ❧
            </span>{" "}
            <span>{current.eyebrow}</span>{" "}
            <span className="text-amber-400/95" aria-hidden>
              ❧
            </span>
          </p>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-neutral-400 sm:text-base">
            {current.subtitle}
          </p>
        </div>

        <div className="mt-10 lg:mt-12" tabIndex={0} onKeyDown={onKeyCarousel} role="region">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-stretch lg:gap-14">
            <div className="relative flex-shrink-0 lg:w-[42%]">
              <Link
                href={gotoDetail}
                className="focus-visible group block outline-none"
                prefetch={false}
              >
                <div className="relative flex min-h-0 flex-col overflow-hidden rounded-2xl border border-neutral-700/80 bg-[#fcf6e9] shadow-2xl shadow-black/35 transition-transform duration-300 hover:-translate-y-0.5">
                  <div className="relative aspect-[4/5] min-h-[224px] w-full overflow-hidden bg-gradient-to-br from-neutral-400/30 via-[#e8dfd1] to-[#fcf6e9] sm:aspect-[15/13] sm:min-h-[280px] lg:min-h-[300px]">
                    <Image
                      src={current.thumbnailUrl}
                      alt=""
                      fill
                      className={cn(
                        !isVectorThumb
                          ? "object-contain object-center"
                          : "object-contain object-center p-6 sm:p-8",
                        "motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.02]",
                        "pointer-events-none",
                      )}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 52vw, 420px"
                      priority={k === 0}
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-28 bg-gradient-to-t from-neutral-950/35 to-transparent sm:h-36"
                    />
                  </div>
                  <div className="relative z-[2] flex flex-wrap items-center justify-center gap-x-3 gap-y-2 border-t border-[#ebe3d7] bg-[#fcf6e9] px-4 py-3.5 sm:px-6 sm:py-4">
                    <span className="text-center font-display text-xs font-extrabold tracking-[0.14em] text-indigo-950 sm:text-sm">
                      {current.previewCardProgramLine}
                    </span>
                    <span className="rounded-lg bg-orange-500 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm shadow-orange-700/35 sm:text-xs">
                      {current.previewCardBadge}
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            <div className="flex flex-1 flex-col justify-between gap-8">
              <div className="space-y-5">
                <MetaRow icon="📺" label="Master Course">
                  <p className="text-base font-bold text-white sm:text-lg">{current.displayTitle}</p>
                </MetaRow>
                <MetaRow icon="📆" label={current.dateLabel}>
                  <p className="text-base font-bold text-white sm:text-lg">{current.dateRangeDisplay}</p>
                </MetaRow>
                <MetaRow icon="📚" label={current.subjectsLabel}>
                  <p className="text-base font-semibold leading-relaxed text-white/95 sm:text-lg">
                    {current.subjectsLine}
                  </p>
                </MetaRow>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <Link
                  href={gotoDetail}
                  prefetch={false}
                  className={cn(
                    "inline-flex h-[52px] min-h-[52px] w-full flex-1 items-center justify-center rounded-xl",
                    "bg-gradient-to-br from-orange-500 to-orange-600 text-center font-bold text-white",
                    "shadow-lg shadow-orange-900/35 transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                  )}
                >
                  Enroll Now
                </Link>
                <Link
                  href={gotoDetail}
                  prefetch={false}
                  className={cn(
                    "inline-flex h-[52px] min-h-[52px] w-full flex-1 items-center justify-center rounded-xl",
                    "bg-[#fdf6eb] font-bold text-orange-700",
                    "transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400",
                  )}
                >
                  Explore
                </Link>
              </div>
            </div>
          </div>
        </div>

        {n > 1 ? (
          <div className="mt-12 flex justify-center gap-8">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous program"
              className="flex h-10 w-12 items-center justify-center rounded-xl border border-neutral-700 bg-neutral-950 text-neutral-100 transition hover:border-neutral-600"
            >
              ←
            </button>
            <div className="flex items-center gap-2 px-4">
              {slides.map((s, i) => (
                <button
                  key={s.slug}
                  type="button"
                  aria-current={k === i}
                  onClick={() => setIdx(i)}
                  className={cn(
                    "h-2 w-8 rounded-full transition-colors",
                    k === i ? "bg-orange-400" : "bg-neutral-700 hover:bg-neutral-600",
                  )}
                  aria-label={`Go to program ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              aria-label="Next program"
              className="flex h-10 w-12 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 transition hover:bg-white"
            >
              →
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function MetaRow(props: { icon: string; label: string; children: ReactNode }) {
  return (
    <div className="flex gap-4">
      <div
        aria-hidden
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-neutral-800 text-2xl shadow-inner shadow-black/20"
      >
        {props.icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{props.label}</p>
        {props.children}
      </div>
    </div>
  );
}
