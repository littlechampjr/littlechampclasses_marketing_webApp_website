"use client";

import { ClockCircleOutlined, PlayCircleOutlined, UserOutlined } from "@ant-design/icons";
import { memo, useState } from "react";
import type { ApiChapterLecture } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { formatDurationHms } from "@/lib/format-duration";
import { subjectInitials, subjectPlaceholderStyles } from "./subject-visuals";

export type VideoCardProps = {
  lecture: ApiChapterLecture;
  subjectKey: string;
  onView: () => void;
  subjectTag?: string;
};

export const VideoCard = memo(function VideoCard({
  lecture,
  subjectKey,
  onView,
  subjectTag,
}: VideoCardProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const tag = subjectTag ?? lecture.subjectTag;
  const ph = subjectPlaceholderStyles(subjectKey);
  const showTeacher = Boolean(lecture.teacherImageUrl?.trim()) && !imgFailed;
  const mentorName = lecture.teacherName?.trim() || "";

  return (
    <div
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border-soft/90 bg-card",
        "shadow-[0_12px_40px_-18px_rgba(0,0,0,0.15)] transition duration-300",
        "hover:border-primary/30 hover:shadow-[0_18px_48px_-16px_rgba(234,88,12,0.18)]",
        "dark:shadow-[0_12px_40px_-18px_rgba(0,0,0,0.45)]",
      )}
    >
      {/* Title row */}
      <div className="flex items-start justify-between gap-3 border-b border-border-soft/70 px-4 py-3.5 sm:px-5 sm:py-4">
        <p className="min-w-0 flex-1 font-display text-base font-bold leading-snug tracking-tight text-foreground line-clamp-2 sm:text-[1.05rem]">
          {lecture.title}
        </p>
        <div
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-full border border-orange-200/80 bg-orange-50/90 px-2.5 py-1",
            "text-xs font-bold tabular-nums text-orange-900 dark:border-orange-900/40 dark:bg-orange-950/35 dark:text-orange-100",
          )}
        >
          <ClockCircleOutlined className="text-sm text-primary" aria-hidden />
          {formatDurationHms(lecture.durationSec)}
        </div>
      </div>

      {/* Subject + mentor — unified panel (no floating empty strip) */}
      <div className="px-3 pt-3 sm:px-4 sm:pt-3.5">
        <div
          className={cn(
            "relative flex min-h-[5.75rem] items-center justify-between gap-4 overflow-hidden rounded-2xl px-4 py-3.5 sm:px-5",
            "border border-orange-100/90 bg-gradient-to-br from-orange-50/95 via-sky-50/40 to-card",
            "dark:border-orange-900/35 dark:from-orange-950/25 dark:via-card dark:to-card",
            "before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_80%_60%_at_90%_20%,rgba(14,165,233,0.12),transparent_65%)]",
            "dark:before:bg-[radial-gradient(ellipse_80%_60%_at_90%_20%,rgba(14,165,233,0.08),transparent_65%)]",
          )}
        >
          <div className="relative z-[1] min-w-0 flex-1 space-y-2">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-muted">Subject</p>
            <span
              className={cn(
                "inline-flex max-w-full items-center rounded-full border px-3 py-1.5 text-xs font-bold shadow-sm backdrop-blur-[2px]",
              )}
              style={{
                background: ph.background,
                color: ph.color,
                borderColor: `${ph.color}4d`,
              }}
            >
              {tag}
            </span>
            {mentorName ? (
              <p className="flex items-center gap-1.5 text-xs font-medium text-foreground/80">
                <UserOutlined className="text-primary/80 text-[0.75rem]" aria-hidden />
                <span className="line-clamp-1">{mentorName}</span>
              </p>
            ) : (
              <p className="text-xs text-muted">Your mentor for this lecture</p>
            )}
          </div>

          <div className="relative z-[1] shrink-0">
            <div
              className={cn(
                "flex h-[4.5rem] w-[4.5rem] items-center justify-center overflow-hidden rounded-2xl sm:h-[5rem] sm:w-[5rem]",
                "ring-[3px] ring-white/90 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.2)] dark:ring-card",
              )}
            >
              {showTeacher ? (
                // eslint-disable-next-line @next/next/no-img-element -- external teacher URLs; avoids remotePatterns config
                <img
                  src={lecture.teacherImageUrl}
                  alt={mentorName || "Teacher"}
                  className="h-full w-full bg-card object-cover object-top"
                  onError={() => setImgFailed(true)}
                />
              ) : (
                <div
                  className="flex h-full w-full flex-col items-center justify-center gap-0.5 text-center"
                  style={{
                    background: `linear-gradient(145deg, ${ph.background}, hsl(0 0% 100% / 0.5))`,
                    color: ph.color,
                  }}
                >
                  <span className="text-lg font-extrabold leading-none tracking-tight sm:text-xl">
                    {subjectInitials(tag)}
                  </span>
                  <span className="text-[0.6rem] font-semibold uppercase tracking-wider opacity-80">
                    Mentor
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-stretch px-4 py-3.5 sm:px-5 sm:py-4">
        <button
          type="button"
          onClick={onView}
          className={cn(
            "inline-flex w-full items-center justify-center gap-2.5 rounded-xl py-3 text-sm font-bold text-primary-foreground",
            "bg-gradient-to-r from-primary via-primary to-orange-600 shadow-[0_8px_20px_-6px_rgba(234,88,12,0.55)]",
            "transition hover:brightness-[1.03] active:scale-[0.99]",
            "sm:w-auto sm:self-end sm:px-8",
          )}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <PlayCircleOutlined className="text-xl" />
          </span>
          Watch lecture
        </button>
      </div>
    </div>
  );
});
