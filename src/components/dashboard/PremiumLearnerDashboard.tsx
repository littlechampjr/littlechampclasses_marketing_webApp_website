"use client";

import {CalendarOutlined, ClockCircleOutlined, LeftOutlined, PaperClipOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Drawer, Select, Skeleton, Space } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { useBatchWeekSchedule } from "@/hooks/useBatchWeekSchedule";
import type { ApiLearnerClassSession, ApiLearnerDashboard } from "@/lib/api/types";

const FALLBACK_THUMB = "/courses/thumb-stories.svg";

function teacherThumbForSubject(subject: string): string {
  const s = subject.toLowerCase();
  if (s.includes("math")) return "/courses/thumb-maths.svg";
  if (s.includes("sci")) return "/courses/thumb-science.svg";
  if (s.includes("eng")) return "/courses/thumb-english.webp";
  return FALLBACK_THUMB;
}

type Props = {
  token: string;
  data: ApiLearnerDashboard;
  loading: boolean;
  requestBatchId: string | undefined;
  onBatchChange: (batchId: string) => void;
  onRefetch: () => void;
};

export function PremiumLearnerDashboard({
  token,
  data,
  loading,
  requestBatchId,
  onBatchChange,
  onRefetch,
}: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  const openScheduleDrawer = useCallback(() => {
    setWeekOffset(0);
    setDrawerOpen(true);
  }, []);

  const closeScheduleDrawer = useCallback(() => {
    setWeekOffset(0);
    setDrawerOpen(false);
  }, []);

  const batchId = data.selectedBatchId;

  const { data: weekData, loading: weekLoading } = useBatchWeekSchedule(
    token,
    batchId,
    weekOffset,
    drawerOpen && Boolean(batchId),
  );

  const selectOptions = useMemo(
    () =>
      data.enrollments.map((e) => ({
        value: e.batchId,
        label: `${e.courseTitle} · Batch ${e.batchCode} (${e.dateRangeLabel})`,
      })),
    [data.enrollments],
  );

  const selectValue = requestBatchId ?? data.selectedBatchId ?? undefined;

  const onSelect = useCallback(
    (value: string) => {
      onBatchChange(value);
    },
    [onBatchChange],
  );

  const bumpWeek = useCallback((delta: number) => {
    setWeekOffset((w) => w + delta);
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
            Your learning hub
          </h1>
          <p className="mt-1 text-sm text-muted">
            Pick a program batch to see today&apos;s live plan and your week at a glance.
          </p>
        </div>
        <Button
          type="default"
          icon={<CalendarOutlined />}
          className="h-11 rounded-xl border-2 border-primary bg-card font-semibold text-primary shadow-sm transition duration-200 hover:bg-primary hover:text-primary-foreground hover:shadow-md hover:shadow-primary/20 px-4 py-2"
          onClick={openScheduleDrawer}
        >
          Weekly schedule
        </Button>
      </div>

      <div className="mt-8 max-w-xl">
        <Select
          size="large"
          className="w-full border-2 border-border-soft bg-card rounded-xl px-4 py-2 shadow-sm transition duration-200 hover:border-primary/40 focus:border-primary focus:shadow-md focus:shadow-primary/20"
          classNames={{
            popup: { root: "px-4 py-2 text-sm bg-primary/10" },
          }}
          options={selectOptions}
          value={selectValue}
          onChange={onSelect}
          loading={loading}
          placeholder="Select a course"
          popupMatchSelectWidth={false}
        />
      </div>

      <section className="mt-12" aria-labelledby="your-classes-heading">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="your-classes-heading" className="font-display text-xl font-bold text-foreground">
            Your classes
          </h2>
        </div>
        <p className="mt-1 text-sm text-muted">
          {data.todaySessions.length > 0
            ? "Today’s schedule for the batch you selected."
            : "When there’s no class today, we show the next sessions in the next 7 days."}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {loading ? (
            <>
              <Skeleton active paragraph={{ rows: 3 }} className="rounded-2xl border border-border-soft bg-card p-4" />
              <Skeleton active paragraph={{ rows: 3 }} className="rounded-2xl border border-border-soft bg-card p-4" />
            </>
          ) : data.todaySessions.length > 0 ? (
            data.todaySessions.map((session) => (
              <LearnerClassCard key={session.id} session={session} mode="today" />
            ))
          ) : data.upcomingSessions.length > 0 ? (
            data.upcomingSessions.map((session) => (
              <LearnerClassCard key={session.id} session={session} mode="upcoming" />
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-border-soft bg-surface-subtle/60 px-6 py-14 text-center dark:bg-card">
              <p className="font-display text-lg font-semibold text-foreground">No classes in the next week</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted">
                There&apos;s nothing on the calendar for this batch in the next 7 days. Check the full weekly
                schedule or pick another enrolled program above.
              </p>
              <Button type="primary" className="mt-6 !rounded-xl" onClick={openScheduleDrawer}>
                Open weekly schedule
              </Button>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col items-center gap-6 sm:mt-10">
          <Link
            href="/programs/after-school"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border-2 border-primary px-6 text-sm font-bold text-primary transition hover:bg-primary hover:text-primary-foreground"
          >
            View all programs
          </Link>
          <div className="relative h-40 w-full max-w-md opacity-90 dark:opacity-80">
            <Image
              src="/courses/thumb-stories.svg"
              alt=""
              fill
              className="object-contain object-bottom"
              unoptimized
            />
          </div>
        </div>
      </section>

      <Drawer
        title={
          <span className="font-display text-lg font-bold text-foreground">Weekly schedule</span>
        }
        placement="right"
        size={420}
        onClose={closeScheduleDrawer}
        open={drawerOpen}
        destroyOnClose
        styles={{
          body: {
            paddingTop: 16,
            paddingBottom: 24,
            paddingLeft: 20,
            paddingRight: 20,
            background: "var(--background)",
          },
          header: {
            borderBottomColor: "var(--border-soft)",
            paddingTop: 18,
            paddingBottom: 18,
            paddingLeft: 20,
            paddingRight: 20,
          },
        }}
        // className="[&_.ant-drawer-close]:!text-foreground [&_.ant-drawer-close]:!top-4 [&_.ant-drawer-close]:!right-4"
      >
        <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-border-soft bg-card px-3 py-2 shadow-sm dark:shadow-none">
          <Button
            type="text"
            size="large"
            onClick={() => bumpWeek(-1)}
            aria-label="Previous week"
            className="!text-base !font-bold px-4 py-2 rounded-xl !text-primary hover:!bg-primary/10"
          >
            <LeftOutlined/>
          </Button>
          <div className="flex-1 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Selected week</p>
            <div className="text-sm font-bold text-foreground">
              {weekLoading && !weekData ? (
                <Skeleton.Button active size="small" className="!w-40" />
              ) : (
                weekData?.weekRangeLabel ?? "—"
              )}
            </div>
          </div>
          <Button
            type="text"
            size="large"
            onClick={() => bumpWeek(1)}
            aria-label="Next week"
            className="!text-base !font-bold px-4 py-2 rounded-xl !text-primary hover:!bg-primary/10"
          >
            <RightOutlined/>
          </Button>
        </div>

        {weekLoading && !weekData ? (
          <Skeleton active paragraph={{ rows: 8 }} />
        ) : weekData ? (
          <div className="space-y-8">
            {weekData.days.map((day) => (
              <div key={day.ymd}>
                <div className="flex flex-wrap items-center gap-2 border-b border-primary/25 pb-2">
                  <span className="text-sm font-bold text-primary">
                    {day.dateLabel} · {day.weekdayShort}
                  </span>
                  {day.relativeLabel ? (
                    <span className="rounded-full border border-primary/40 px-2 py-0.5 text-xs font-semibold text-primary">
                      {day.relativeLabel}
                    </span>
                  ) : null}
                </div>
                {day.sessions.length === 0 ? (
                  <p className="mt-3 text-sm font-semibold text-muted">No classes scheduled</p>
                ) : (
                  <ul className="mt-3 space-y-3">
                    {day.sessions.map((s) => (
                      <li
                        key={s.id}
                        className="rounded-xl border border-border-soft bg-card p-3 shadow-sm transition hover:border-primary/30 dark:shadow-none"
                      >
                        <div className="flex gap-3">
                          <div className="relative h-15 w-16 shrink-0 overflow-hidden rounded-lg bg-foreground/5">
                            <Image
                              src={
                                s.teacherImageUrl?.trim()
                                  ? s.teacherImageUrl.trim()
                                  : teacherThumbForSubject(s.subject)
                              }
                              alt=""
                              fill
                              className="object-cover"
                              sizes="64px"
                              unoptimized={
                                !s.teacherImageUrl?.trim() ||
                                s.teacherImageUrl.endsWith(".svg") ||
                                s.teacherImageUrl.endsWith(".webp")
                              }
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-accent">{s.subject}</p>
                            <p className="truncate font-bold text-foreground">{s.title}</p>
                            <Space size={10} className="mt-1 text-xs text-muted">
                              <span className="inline-flex items-center gap-1">
                                <ClockCircleOutlined />
                                {s.startsAtLabel}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <ClockCircleOutlined />
                                {s.durationLabel}
                              </span>
                            </Space>
                          </div>
                          {s.hasAttachments ? (
                            <PaperClipOutlined className="mt-auto shrink-0 text-primary" aria-label="Attachments" />
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">Unable to load this week.</p>
        )}

        <div className="mt-8">
          <Button type="link" onClick={() => void onRefetch()} className="!p-0">
            Refresh today&apos;s classes
          </Button>
        </div>
      </Drawer>
    </div>
  );
}

function LearnerClassCard({ session, mode }: { session: ApiLearnerClassSession; mode: "today" | "upcoming" }) {
  const thumb =
    session.teacherImageUrl?.trim() || teacherThumbForSubject(session.subject);
  const svg = thumb.endsWith(".svg");

  const whenBadge =
    mode === "today" ? (
      <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:text-emerald-200">
        Today
      </span>
    ) : session.isTomorrow ? (
      <span className="inline-flex items-center rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-950 dark:text-amber-100">
        Tomorrow
      </span>
    ) : (
      <span className="inline-flex max-w-full truncate rounded-full bg-sky-500/15 px-2.5 py-0.5 text-xs font-semibold text-sky-950 dark:text-sky-100">
        {session.dayLabel}
      </span>
    );

  return (
    <article className="group overflow-hidden rounded-2xl border border-border-soft bg-card shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md dark:shadow-none">
      <div className="flex gap-4 p-4 sm:p-5">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-surface-subtle/70 ring-1 ring-border-soft sm:h-28 sm:w-28 dark:bg-card">
          <div className="absolute inset-0 bg-[radial-gradient(120px_80px_at_30%_10%,rgba(249,115,22,0.18),transparent_60%),radial-gradient(120px_80px_at_80%_90%,rgba(14,165,233,0.12),transparent_55%)]" />
          <Image
            src={thumb}
            alt=""
            fill
            className="relative object-cover"
            sizes="112px"
            unoptimized={svg}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {whenBadge}
            <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold">
              {session.subject}
            </span>
          </div>

          <h3 className="mt-1 font-display text-lg font-extrabold leading-snug text-foreground">
            {session.title}
          </h3>

          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5">
              <ClockCircleOutlined className="text-primary/80" />
              {session.startsAtLabel}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ClockCircleOutlined className="text-primary/80" />
              {session.durationLabel}
            </span>
          </div>

          {session.statusMicrocopy ? (
            <div className="mt-1 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-950 dark:text-emerald-100">
              {session.statusMicrocopy}
            </div>
          ) : null}
        </div>
      </div>
      {session.statusMicrocopy ? (
        <div className="sr-only">{session.statusMicrocopy}</div>
      ) : null}
    </article>
  );
}
