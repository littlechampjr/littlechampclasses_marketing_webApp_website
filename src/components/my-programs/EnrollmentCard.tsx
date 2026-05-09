"use client";

import { CalendarOutlined, CheckCircleFilled } from "@ant-design/icons";
import Image from "next/image";
import type { ApiCourse, ApiEnrolledProgramEnrollment } from "@/lib/api/types";
import { cn } from "@/lib/cn";

type Props = {
  course: ApiCourse;
  enrollment: ApiEnrolledProgramEnrollment;
  className?: string;
};

export function EnrollmentCard({ course, enrollment, className }: Props) {
  const pf = course.purchaseFlow;

  const programLine = pf?.previewCardProgramLine?.trim() || "MASTER PROGRAM";
  const thumb = course.thumbnailUrl?.trim() || "/courses/thumb-stories.svg";
  const title = course.marketingTitle?.trim() || course.title.trim();

  const subjectsText =
    pf?.subjects?.length && pf.subjects.length > 0
      ? pf.subjects.join(", ")
      : "—";

  if (!pf?.enabled) {
    return null;
  }

  return (
    <aside
      className={cn(
        "rounded-3xl border border-border-soft bg-card p-6 shadow-[0_20px_50px_-32px_rgba(0,0,0,0.15)]",
        "lg:sticky lg:top-24",
        className,
      )}
    >
      <div className="relative mx-auto mb-4 h-28 max-w-[200px] overflow-hidden rounded-2xl bg-surface-subtle">
        <Image src={thumb} alt="" fill className="object-contain object-center" sizes="200px" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-card/95 to-transparent px-3 pb-2 pt-8">
          <p className="text-center font-display text-[10px] font-extrabold tracking-widest text-primary">
            {programLine}
          </p>
        </div>
      </div>

      <h2 className="font-display text-lg font-extrabold leading-snug text-foreground">{title}</h2>
      <p className="mt-1 text-xs font-semibold text-muted">{course.title.trim()}</p>

      <ul className="mt-5 space-y-3 text-sm">
        <li className="flex gap-2 text-muted">
          <span className="text-foreground/80" aria-hidden>
            ▫
          </span>
          <span>
            <span className="font-semibold text-foreground">Batch:</span> {enrollment.batchCode}
          </span>
        </li>
        <li className="flex gap-2 text-muted">
          <CalendarOutlined className="mt-0.5 shrink-0 text-primary" aria-hidden />
          <span>
            <span className="font-semibold text-foreground">{pf.dateLabel}:</span>{" "}
            {enrollment.batchDateRangeLabel}
          </span>
        </li>
        <li className="flex gap-2 text-muted">
          <span className="mt-0.5 shrink-0 text-primary" aria-hidden>
            📚
          </span>
          <span>
            <span className="font-semibold text-foreground">{pf.subjectsLabel}:</span> {subjectsText}
          </span>
        </li>
      </ul>

      <div className="mt-6 flex min-h-[52px] items-center justify-between gap-3 rounded-2xl border border-border-soft bg-surface-subtle/70 px-4 py-3">
        <span className="font-display text-base font-bold text-foreground">Enrolled</span>
        <CheckCircleFilled className="text-2xl text-emerald-500" aria-label="Enrolled" />
      </div>
    </aside>
  );
}
