"use client";

import { Radio, Checkbox } from "antd";
import type { ApiTestQuestion } from "@/lib/api/testsTypes";
import { cn } from "@/lib/cn";

type Props = {
  indexLabel: string;
  question: ApiTestQuestion;
  selected: string | null;
  onSelect: (optionId: string) => void;
  marked: boolean;
  onToggleMark: () => void;
  onSaveAndNext: () => void;
  isLast: boolean;
};

export function QuestionPanel({
  indexLabel,
  question,
  selected,
  onSelect,
  marked,
  onToggleMark,
  onSaveAndNext,
  isLast,
}: Props) {
  return (
    <div className="rounded-2xl border border-border-soft bg-card p-5 shadow-sm sm:p-7 dark:bg-card/90">
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted sm:text-sm">
        <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-primary">Q {indexLabel}</span>
        <span>
          (+{question.marks} / -{question.negativeMarks})
        </span>
        <span className="rounded-md bg-foreground/5 px-2 py-0.5 text-foreground/80">Single choice</span>
      </div>
      <h2 className="mt-4 text-base font-semibold leading-relaxed text-foreground sm:text-lg">
        {question.text}
      </h2>
      <Radio.Group
        className="mt-5 w-full"
        value={selected ?? undefined}
        onChange={(e) => onSelect(e.target.value)}
      >
        <ul className="space-y-2.5" role="radiogroup" aria-label="Answer options">
          {question.options.map((o) => (
            <li key={o.id}>
              <label
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl border border-border-soft p-3 transition",
                  "hover:border-primary/30 hover:bg-surface-subtle/60",
                  selected === o.id && "border-primary/50 bg-surface-subtle",
                )}
              >
                <Radio value={o.id} className="shrink-0" />
                <span className="text-sm text-foreground">{o.text}</span>
              </label>
            </li>
          ))}
        </ul>
      </Radio.Group>
      <div className="mt-6 flex flex-col gap-3 border-t border-border-soft pt-5 sm:flex-row sm:items-center sm:justify-between">
        <Checkbox checked={marked} onChange={() => onToggleMark()} className="text-sm">
          Mark for review
        </Checkbox>
        <div className="flex gap-2 sm:ml-auto">
          <button
            type="button"
            onClick={onSaveAndNext}
            disabled={isLast}
            className={cn(
              "inline-flex min-w-[9rem] items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow",
              "hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40",
            )}
          >
            {isLast ? "Last question" : "Save & Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
