import Image from "next/image";
import type { ApiCourse } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { FeatureGrid } from "./FeatureGrid";

type Props = { course: ApiCourse; className?: string };

export function CourseDetails({ course, className }: Props) {
  const pf = course.purchaseFlow;
  if (!pf?.enabled) return null;

  const title = course.marketingTitle?.trim() || course.title.trim();
  const subtitle = pf.shortTagline.trim() || course.description.trim().slice(0, 120);
  const thumb = course.thumbnailUrl?.trim() || "/courses/thumb-stories.svg";

  const startLabel =
    (pf.dateRangeDisplay?.trim() || course.batches[0]?.dateRangeLabel || "").trim() ||
    "Starts soon";

  return (
    <div className={cn("space-y-12", className)}>
      <header className="overflow-hidden rounded-3xl border border-border-soft bg-card shadow-[0_20px_50px_-32px_rgba(0,0,0,0.18)] dark:shadow-black/35">
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:gap-8 sm:p-8">
          <div className="relative mx-auto h-44 w-full max-w-[200px] shrink-0 rounded-2xl bg-surface-subtle sm:mx-0 sm:h-[140px] sm:w-[176px]">
            <Image
              src={thumb}
              alt=""
              fill
              className="rounded-2xl object-cover"
              sizes="176px"
            />
          </div>
          <div className="min-w-0 flex-1 pt-2">
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              {course.title.trim()}
            </h1>
            <p className="mt-1 text-lg font-semibold text-foreground">{title}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{subtitle}</p>
            <p className="mt-4 text-xs text-muted sm:text-sm">
              <span className="font-semibold text-foreground">Starts:</span> {startLabel}{" "}
              <span aria-hidden className="text-border-soft px-2">
                ·
              </span>
              <span className="text-emerald-600 dark:text-emerald-400">{pf.emiAvailableCopy}</span>
            </p>
          </div>
        </div>
      </header>

      <section>
        <h2 className="text-center font-display text-xl font-bold text-foreground sm:text-2xl">
          Course features
        </h2>
        <div className="mt-6 flex flex-wrap justify-center gap-2 px-4">
          {pf.subjects.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 rounded-full bg-emerald-500/12 px-3 py-1.5 text-sm font-semibold text-emerald-900 dark:text-emerald-300"
            >
              <span aria-hidden className="text-emerald-600 dark:text-emerald-400">
                ✓
              </span>
              {s}
            </span>
          ))}
        </div>
        <FeatureGrid features={pf.featureCards} />
      </section>

      <section className="rounded-3xl border border-border-soft bg-card p-6 sm:p-8">
        <h2 className="text-center font-display text-xl font-bold text-foreground sm:text-2xl">
          Full course details
        </h2>

        <div className="mt-8 border-t border-border-soft pt-8">
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
    </div>
  );
}
