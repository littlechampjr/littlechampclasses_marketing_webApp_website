"use client";

import { Collapse } from "antd";
import Image from "next/image";
import type { ApiCourse, ApiProgramFaq, ApiProgramTeacher } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { FeatureGrid } from "@/components/course-purchase/FeatureGrid";
import { useCallback, useMemo } from "react";

type Props = {
  course: ApiCourse;
  teachers: ApiProgramTeacher[];
  faqs: ApiProgramFaq[];
  className?: string;
};

export function CourseDescriptionTab({ course, teachers, faqs, className }: Props) {
  const pf = course.purchaseFlow;

  const scrollToId = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const faqItems = useMemo(
    () =>
      faqs.map((f) => ({
        key: f.id,
        label: <span className="font-semibold text-foreground">{f.question}</span>,
        children: <p className="text-sm leading-relaxed text-muted">{f.answer}</p>,
      })),
    [faqs],
  );

  if (!pf?.enabled) return null;

  return (
    <div className={cn("space-y-12 pb-24", className)}>
      <section id="program-overview" className="scroll-mt-28">
        <div className="mb-6 flex items-center gap-2">
          <span className="h-6 w-1 rounded-full bg-primary" aria-hidden />
          <h2 className="font-display text-lg font-bold text-foreground">Overview</h2>
        </div>
        {pf.shortTagline?.trim() ? (
          <p className="mb-6 rounded-2xl border border-border-soft bg-surface-subtle/50 px-4 py-3 text-sm text-foreground/90 dark:bg-card/50">
            {pf.shortTagline.trim()}
          </p>
        ) : null}
        <FeatureGrid features={pf.featureCards} />
        <div className="mt-10 rounded-3xl border border-border-soft bg-card p-6 sm:p-8">
          <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <span aria-hidden className="text-xl">
              🕐
            </span>
            {pf.scheduleHeading}
          </h3>
          <ul className="mt-4 space-y-2">
            {pf.scheduleBullets.map((b) => (
              <li key={b} className="flex gap-2 text-sm text-foreground/90">
                <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-10 space-y-10">
          {pf.detailSections.map((sec) => (
            <div key={sec.title}>
              <h3 className="flex items-start gap-2 text-lg font-bold text-foreground">
                <span className="text-xl" aria-hidden>
                  {sec.emoji}
                </span>
                {sec.title}
              </h3>
              <ul className="mt-3 space-y-2 ps-9">
                {sec.bullets.map((b) => (
                  <li key={b} className="flex gap-2 text-sm leading-relaxed text-foreground/90">
                    <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="program-teachers" className="scroll-mt-28">
        <div className="mb-6 flex items-center gap-2">
          <span className="h-6 w-1 rounded-full bg-primary" aria-hidden />
          <h2 className="font-display text-lg font-bold text-foreground">Teachers</h2>
        </div>
        {teachers.length === 0 ? (
          <p className="text-sm text-muted">Faculty profiles will appear here soon.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teachers.map((t) => (
              <li
                key={t.id}
                className="overflow-hidden rounded-2xl border border-border-soft bg-card p-4 shadow-sm"
              >
                <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full bg-surface-subtle ring-2 ring-primary/15">
                  {t.imageUrl ? (
                    <Image src={t.imageUrl} alt="" fill className="object-cover" sizes="96px" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-lg font-bold text-muted">
                      {t.name.slice(0, 1)}
                    </div>
                  )}
                </div>
                <p className="mt-3 text-center font-display font-bold text-foreground">{t.name}</p>
                <p className="mt-1 text-center text-xs font-semibold text-primary">{t.subjectLabel}</p>
                {t.bioLine ? (
                  <p className="mt-2 text-center text-xs text-muted">{t.bioLine}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section id="program-faqs" className="scroll-mt-28">
        <div className="mb-6 flex items-center gap-2">
          <span className="h-6 w-1 rounded-full bg-primary" aria-hidden />
          <h2 className="font-display text-lg font-bold text-foreground">FAQs</h2>
        </div>
        {faqItems.length === 0 ? (
          <p className="text-sm text-muted">No FAQs for this program yet.</p>
        ) : (
          <Collapse items={faqItems} bordered={false} className="rounded-2xl bg-card" />
        )}
      </section>

      <nav
        className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 gap-1 rounded-full border border-border-soft bg-neutral-900/90 px-2 py-2 text-xs font-semibold shadow-lg backdrop-blur-md sm:text-sm dark:bg-neutral-950/95"
        aria-label="Course description sections"
      >
        {(
          [
            ["overview", "Details"],
            ["teachers", "Teachers"],
            ["faqs", "FAQs"],
          ] as const
        ).map(([suffix, label]) => (
          <button
            type="button"
            key={suffix}
            onClick={() => scrollToId(`program-${suffix}`)}
            className="rounded-full px-3 py-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
