"use client";

import { cn } from "@/lib/cn";
import type { ResultSummary } from "@/lib/api/testsTypes";
import { ButtonLink } from "@/components/ui/Button";

type Props = {
  summary: ResultSummary;
  attemptId: string;
  testId: string;
  testTitle: string;
  className?: string;
};

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-border-soft bg-surface-subtle/50 p-4 dark:bg-surface-subtle/30">
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="mt-1 text-lg font-bold tabular-nums text-foreground">{value}</p>
      {sub ? <p className="text-xs text-muted">{sub}</p> : null}
    </div>
  );
}

function formatDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s}s`;
}

export function ResultCard({ summary, attemptId, testId, testTitle, className }: Props) {
  return (
    <div className={cn("space-y-8", className)}>
      <div
        className={cn(
          "rounded-2xl border-2 border-primary/25 bg-gradient-to-br from-surface-subtle to-card p-6 text-center shadow-sm",
          "dark:from-surface-subtle/80",
        )}
      >
        <p className="text-sm font-medium text-muted">Score</p>
        <p className="mt-1 font-display text-4xl font-extrabold text-primary sm:text-5xl">
          {summary.totalScore}
          <span className="text-lg font-bold text-muted sm:text-2xl">
            /{summary.maxScore}
          </span>
        </p>
        <p className="mt-2 text-sm text-muted">{testTitle}</p>
      </div>

      <div>
        <h3 className="text-sm font-bold text-foreground">Performance</h3>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Stat label="Correct" value={String(summary.correct)} />
          <Stat label="Incorrect" value={String(summary.incorrect)} />
          <Stat label="Skipped" value={String(summary.skipped)} />
          <Stat label="Accuracy" value={`${summary.accuracyPct.toFixed(1)}%`} />
          <Stat label="Completion" value={`${summary.completionPct.toFixed(1)}%`} />
          <Stat label="Time taken" value={formatDuration(summary.timeTakenSec)} />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <a
          href="#analysis"
          className="inline-flex min-w-[10rem] items-center justify-center rounded-xl border-2 border-primary/40 bg-transparent px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-primary/10"
        >
          View detailed analysis
        </a>
        <ButtonLink href={`/tests/attempt/${attemptId}/review`} variant="primary" className="min-w-[10rem]">
          View solutions
        </ButtonLink>
        <ButtonLink href={`/tests/${testId}/instructions`} variant="outline" className="min-w-[10rem]">
          Reattempt
        </ButtonLink>
      </div>
    </div>
  );
}
