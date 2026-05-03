"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/providers/AuthProvider";
import { ApiError } from "@/lib/api/types";
import { cn } from "@/lib/cn";

const GOALS = [
  { id: "School Curriculum" as const, label: "School Curriculum", soon: false },
  { id: "Mental Maths" as const, label: "Mental Maths", soon: true },
  { id: "English by Cambridge" as const, label: "English by Cambridge", soon: true },
] as const;

const GRADES: { value: number; label: string }[] = [
  { value: 1, label: "1st" },
  { value: 2, label: "2nd" },
  { value: 3, label: "3rd" },
  { value: 4, label: "4th" },
  { value: 5, label: "5th" },
  { value: 6, label: "6th" },
  { value: 7, label: "7th" },
  { value: 8, label: "8th" },
];

export function OnboardingForm() {
  const router = useRouter();
  const { completeOnboarding } = useAuth();
  const [childName, setChildName] = useState("");
  const [goal, setGoal] = useState<string>("School Curriculum");
  const [grade, setGrade] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit =
    childName.trim().length >= 1 && goal.length > 0 && grade !== "" && !Number.isNaN(Number(grade));

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!canSubmit) return;
      setError(null);
      setSubmitting(true);
      try {
        await completeOnboarding({
          childName: childName.trim(),
          learningGoal: goal,
          childGrade: Number(grade),
        });
        router.push("/dashboard");
        router.refresh();
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Could not save profile.");
      } finally {
        setSubmitting(false);
      }
    },
    [canSubmit, childName, completeOnboarding, goal, grade, router],
  );

  return (
    <div className="w-full max-w-[420px] h-full rounded-2xl border border-border-soft bg-card p-6 shadow-xl shadow-foreground/5 sm:p-8">
      {/* <div className="mb-4 flex items-center justify-center gap-2">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border-soft bg-surface-subtle">
          <Image
            src={`/playful-little-champ-logo.png?v=${site.playfulLittleChampLogoVersion}`}
            alt=""
            width={40}
            height={40}
            className="h-8 w-auto object-contain"
          />
        </span>
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-extrabold text-background"
          aria-hidden
        >
          LC
        </span>
      </div> */}
      <h2 className="text-center font-display text-2xl font-bold tracking-tight text-foreground">Almost Done</h2>
      <p className="mb-1 border-b border-border-soft pb-4 text-center text-sm text-muted">
        Tell us about your child so we can personalise the journey.
      </p>

      <form onSubmit={(e) => void onSubmit(e)} className="mt-5 space-y-5">
        <div>
          <label htmlFor="child-name" className="block text-xs font-medium text-muted">
            Child&apos;s name
          </label>
          <input
            id="child-name"
            name="childName"
            type="text"
            autoComplete="name"
            maxLength={120}
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            placeholder="Please enter your child’s name"
            className="mt-1.5 w-full rounded-xl border border-border-soft bg-background px-4 py-3 text-foreground placeholder:text-muted/70 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <p className="text-xs font-medium text-muted">Select goal</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {GOALS.map((g) => {
              const selected = g.id === goal;
              if (g.soon) {
                return (
                  <button
                    key={g.id}
                    type="button"
                    disabled
                    className="inline-flex items-center gap-1.5 rounded-full border-2 border-border-soft/80 px-3 py-2 text-xs font-medium text-muted opacity-60"
                    title="Available soon"
                  >
                    {g.label}
                    <span className="text-[10px] uppercase">Soon</span>
                  </button>
                );
              }
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGoal(g.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-2 text-sm font-semibold transition",
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-primary/50 bg-card text-primary hover:bg-primary/10",
                  )}
                >
                  {selected ? (
                    <span className="text-primary-foreground" aria-hidden>
                      ✓
                    </span>
                  ) : null}
                  {g.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label htmlFor="child-grade" className="block text-xs font-medium text-muted">
            Class
          </label>
          <div className="relative mt-1.5">
            <select
              id="child-grade"
              name="grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full appearance-none rounded-xl border border-border-soft bg-background py-3 pl-4 pr-10 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Select class</option>
              {GRADES.map((g) => (
                <option key={g.value} value={String(g.value)}>
                  {g.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden>
              ▾
            </span>
          </div>
        </div>

        {error ? (
          <p className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300" role="alert">
            {error}
          </p>
        ) : null}

        <Button type="submit" variant="primary" className="w-full min-h-12 text-base" disabled={!canSubmit || submitting}>
          {submitting ? "Saving…" : "Continue"}
        </Button>
      </form>
    </div>
  );
}
