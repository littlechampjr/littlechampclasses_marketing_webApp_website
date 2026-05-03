"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/cn";
import type { ReviewQuestion } from "@/lib/api/testsTypes";
import { CheckOutlined, CloseOutlined, MinusOutlined } from "@ant-design/icons";

type Filter = "all" | "correct" | "incorrect" | "skipped";

const filterOptions: { v: Filter; label: string }[] = [
  { v: "all", label: "All" },
  { v: "correct", label: "Correct" },
  { v: "incorrect", label: "Incorrect" },
  { v: "skipped", label: "Skipped" },
];

function gridTone(s: ReviewQuestion["status"]) {
  if (s === "correct") return "bg-emerald-500 text-white";
  if (s === "incorrect") return "bg-rose-500 text-white";
  return "bg-zinc-400 text-white dark:bg-zinc-600";
}

type Props = {
  questions: ReviewQuestion[];
};

export function ReviewSolutionsView({ questions: all }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const [idx, setIdx] = useState(0);

  const filtered = useMemo(() => {
    if (filter === "all") return all;
    return all.filter((q) => q.status === filter);
  }, [all, filter]);

  const maxI = Math.max(0, filtered.length - 1);
  const safeIdx = Math.min(idx, maxI);
  const q = filtered[safeIdx];
  const globalIndex = q ? all.findIndex((x) => x.id === q.id) + 1 : 0;

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "n") {
        setIdx((i) => Math.min(i + 1, Math.max(0, filtered.length - 1)));
      }
      if (e.key === "ArrowLeft" || e.key === "p") {
        setIdx((i) => Math.max(0, i - 1));
      }
    },
    [filtered.length],
  );

  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKey]);

  if (all.length === 0) {
    return <p className="text-center text-muted">No questions to review.</p>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter questions">
          {filterOptions.map((o) => (
            <button
              key={o.v}
              type="button"
              role="tab"
              aria-selected={filter === o.v}
              onClick={() => {
                setFilter(o.v);
                setIdx(0);
              }}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                filter === o.v
                  ? "border-primary bg-primary/15 text-foreground"
                  : "border-border-soft bg-card text-muted hover:border-primary/30",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="mt-8 text-muted">No questions in this filter.</p>
        ) : !q ? null : (
          <article className="mt-6 rounded-2xl border border-border-soft bg-card p-5 shadow-sm sm:p-7 dark:bg-card/90">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-primary/15 px-2.5 py-0.5 font-medium text-primary">
                Q {globalIndex}
              </span>
              {q.status === "correct" ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-0.5 font-medium text-emerald-700 dark:text-emerald-300">
                  <CheckOutlined /> Correct
                </span>
              ) : q.status === "incorrect" ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/15 px-2 py-0.5 font-medium text-rose-700 dark:text-rose-300">
                  <CloseOutlined /> Incorrect
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-md bg-zinc-400/20 px-2 py-0.5 font-medium text-muted">
                  <MinusOutlined /> Skipped
                </span>
              )}
              <span className="text-muted">Time: {q.timeSpentSec.toFixed(1)}s</span>
            </div>
            <h2 className="mt-4 text-base font-semibold leading-relaxed sm:text-lg">{q.text}</h2>
            <ul className="mt-4 space-y-2">
              {q.options.map((o) => {
                const isSel = q.selectedOptionId === o.id;
                const isCor = q.correctOptionId === o.id;
                return (
                  <li
                    key={o.id}
                    className={cn(
                      "rounded-xl border px-3 py-2.5 text-sm",
                      isCor && "border-emerald-500/50 bg-emerald-500/10",
                      isSel && !isCor && "border-rose-500/50 bg-rose-500/10",
                      !isSel && !isCor && "border-border-soft",
                    )}
                  >
                    {o.text}
                    {isCor ? (
                      <span className="ml-2 text-xs font-semibold text-emerald-600">Correct</span>
                    ) : null}
                    {isSel && !isCor ? (
                      <span className="ml-2 text-xs font-semibold text-rose-600">Your answer</span>
                    ) : null}
                  </li>
                );
              })}
            </ul>
            {q.explanation ? (
              <div className="mt-6 border-t border-border-soft pt-5">
                <p className="text-xs font-bold uppercase tracking-wide text-muted">Solution</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground">{q.explanation}</p>
              </div>
            ) : null}
          </article>
        )}
      </div>

      <aside className="h-fit rounded-2xl border border-border-soft bg-card p-4 shadow-sm dark:bg-card/90">
        <p className="text-sm font-bold text-foreground">Questions</p>
        <div className="mt-3 grid max-h-[min(70vh,520px)] grid-cols-5 gap-2 overflow-y-auto p-0.5 sm:grid-cols-6">
          {filtered.map((qq, i) => (
            <button
              key={qq.id}
              type="button"
              onClick={() => setIdx(i)}
              className={cn(
                "h-9 rounded-lg text-xs font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring",
                gridTone(qq.status),
                i === safeIdx && "ring-2 ring-sky-400 ring-offset-2 ring-offset-card",
              )}
            >
              {all.findIndex((x) => x.id === qq.id) + 1}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted">
          Tip: use ← → or <kbd className="rounded bg-foreground/10 px-1">n</kbd> /{" "}
          <kbd className="rounded bg-foreground/10 px-1">p</kbd> to move.
        </p>
      </aside>
    </div>
  );
}
