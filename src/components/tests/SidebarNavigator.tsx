"use client";

import { cn } from "@/lib/cn";
import type { ApiTestQuestion } from "@/lib/api/testsTypes";
import { getNavSummary, getQuestionVisualState, type QuestionCell } from "@/stores/testSessionStore";

const pill =
  "inline-flex items-center gap-1.5 rounded-lg border border-border-soft bg-card px-2 py-1 text-xs text-foreground/90 dark:bg-card/80";

const dot = (color: string) => (
  <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", color)} aria-hidden />
);

type Props = {
  questions: ApiTestQuestion[];
  cells: Record<string, QuestionCell | undefined>;
  currentIndex: number;
  onJump: (i: number) => void;
};

function gridClass(visual: ReturnType<typeof getQuestionVisualState>) {
  switch (visual) {
    case "not_visited":
      return "bg-zinc-200 text-zinc-800 hover:opacity-90 dark:bg-zinc-700 dark:text-zinc-100";
    case "not_answered":
      return "bg-rose-500 text-white hover:opacity-90";
    case "answered":
      return "bg-emerald-500 text-white hover:opacity-90";
    case "marked":
      return "bg-amber-500 text-white hover:opacity-90";
    case "answered_marked":
      return "bg-emerald-500 text-white ring-2 ring-amber-400 ring-inset hover:opacity-90";
    default:
      return "bg-zinc-200";
  }
}

export function SidebarNavigator({ questions, cells, currentIndex, onJump }: Props) {
  const s = getNavSummary(questions, cells as Record<string, QuestionCell>);

  return (
    <aside className="h-fit space-y-5 rounded-2xl border border-border-soft bg-card p-4 shadow-sm dark:bg-card/90">
      <h3 className="text-sm font-bold text-foreground">Question palette</h3>
      <div className="grid grid-cols-1 gap-2 text-[11px] sm:grid-cols-2 sm:text-xs">
        <div className={pill}>
          {dot("bg-emerald-500")}
          <span>Answered: {s.answered}</span>
        </div>
        <div className={pill}>
          {dot("bg-rose-500")}
          <span>Not answered: {s.notAnswered}</span>
        </div>
        <div className={pill}>
          {dot("bg-amber-500")}
          <span>Marked: {s.marked}</span>
        </div>
        <div className={pill}>
          {dot("bg-zinc-300")}
          <span>Not visited: {s.notVisited}</span>
        </div>
        <div className={cn(pill, "sm:col-span-2")}>
          <span className="inline-flex items-center gap-1" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="h-2.5 w-2.5 rounded-full border-2 border-amber-400 bg-emerald-500" />
          </span>
          <span>Answered &amp; marked: {s.answeredMarked}</span>
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-muted">Jump to</p>
        <div
          className="mt-2 grid max-h-64 grid-cols-5 gap-2 overflow-y-auto p-0.5 sm:grid-cols-6"
          role="navigation"
          aria-label="Question numbers"
        >
          {questions.map((q, i) => {
            const visual = getQuestionVisualState(cells[q.id]);
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => onJump(i)}
                className={cn(
                  "h-9 rounded-lg text-xs font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
                  gridClass(visual),
                  i === currentIndex && "ring-2 ring-sky-400 ring-offset-2 ring-offset-card dark:ring-offset-card",
                )}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
