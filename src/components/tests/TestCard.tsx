"use client";

import { ArrowRightOutlined, ClockCircleOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import type { ApiTestListItem } from "@/lib/api/testsTypes";
import { cn } from "@/lib/cn";

function formatStart(iso: string | null) {
  if (!iso) return "Open now";
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

type Props = {
  test: ApiTestListItem;
  onStart: (test: ApiTestListItem) => void;
  disabledStart?: boolean;
};

export function TestCard({ test, onStart, disabledStart }: Props) {
  const startLabel = formatStart(test.startAt);

  return (
    <div
      className={cn(
        "group flex flex-col justify-between rounded-2xl border border-border-soft/80 bg-card p-6 shadow-sm transition",
        "hover:shadow-md hover:border-primary/25",
        "dark:border-border-soft dark:bg-card/90",
      )}
    >
      <div>
        <h3 className="font-display text-lg font-bold text-foreground sm:text-xl">{test.title}</h3>
        <ul className="mt-4 space-y-2.5 text-sm text-muted">
          <li className="flex items-center gap-2">
            <QuestionCircleOutlined className="text-primary" />
            {test.questionCount} questions
          </li>
          <li>Total marks: {test.totalMarks}</li>
          <li className="flex items-center gap-2">
            <ClockCircleOutlined className="text-primary" />
            {test.durationMins} mins
          </li>
          <li>Attempts: {test.attemptsCount.toLocaleString()}</li>
          <li>Starts: {startLabel}</li>
        </ul>
      </div>
      <div className="mt-6">
        <button
          type="button"
          disabled={Boolean(disabledStart)}
          onClick={() => onStart(test)}
          className={cn(
            "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow",
            "transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-50",
          )}
        >
          Start
          <ArrowRightOutlined className="transition group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}
