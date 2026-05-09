"use client";

import { BookOutlined, CalendarOutlined, ShareAltOutlined } from "@ant-design/icons";
import { App } from "antd";
import { useCallback } from "react";
import type { ApiCourse, ApiEnrolledProgramEnrollment } from "@/lib/api/types";
import { cn } from "@/lib/cn";

type Props = {
  course: ApiCourse;
  enrollment: ApiEnrolledProgramEnrollment;
  className?: string;
};

export function CourseProgramHeader({ course, enrollment, className }: Props) {
  const pf = course.purchaseFlow;
  const { message } = App.useApp();

  const title = course.marketingTitle?.trim() || course.title.trim();
  const dateLine =
    pf?.dateRangeDisplay?.trim() ||
    enrollment.batchDateRangeLabel ||
    course.batches[0]?.dateRangeLabel ||
    "";

  const subjectsLine =
    pf?.subjects?.length && pf.subjects.length > 0 ? pf.subjects.join(", ") : "";

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
              {title}
            </h1>
            <p className="mt-1 text-sm font-medium text-muted">{course.title.trim()}</p>
            <div className="mt-4 space-y-2 text-sm text-foreground/90">
              {dateLine ? (
                <p className="flex flex-wrap items-center gap-2">
                  <CalendarOutlined className="text-primary" aria-hidden />
                  <span>{dateLine}</span>
                </p>
              ) : null}
              {subjectsLine ? (
                <p className="flex flex-wrap items-center gap-2">
                  <BookOutlined className="text-primary" aria-hidden />
                  <span>{subjectsLine}</span>
                </p>
              ) : null}
            </div>
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
