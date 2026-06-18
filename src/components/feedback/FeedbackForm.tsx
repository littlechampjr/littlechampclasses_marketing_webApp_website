"use client";

import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { submitFeedback } from "@/lib/api/feedback";
import { ApiError } from "@/lib/api/types";
import { parseIndianMobileNational10 } from "@/lib/phone";
import { useAuth } from "@/providers/AuthProvider";
import { StarRating } from "./StarRating";

const DRAFT_KEY = "lcc.feedbackDraft.v1";
const MAX_LEN = 2000;

type FormState = {
  name: string;
  mobile: string;
  email: string;
  featureSuggestions: string;
  improvementSuggestions: string;
  activitiesSuggestions: string;
  academicYearProgramSuggestions: string;
  additionalFeedback: string;
  rating: number;
};

const EMPTY: FormState = {
  name: "",
  mobile: "",
  email: "",
  featureSuggestions: "",
  improvementSuggestions: "",
  activitiesSuggestions: "",
  academicYearProgramSuggestions: "",
  additionalFeedback: "",
  rating: 0,
};

const QUESTIONS: Array<{ key: keyof FormState; label: string; placeholder: string }> = [
  {
    key: "featureSuggestions",
    label: "What features should we add?",
    placeholder: "Tell us about any feature you would like to see…",
  },
  {
    key: "improvementSuggestions",
    label: "What improvements can we make?",
    placeholder: "Share your suggestions to improve your experience…",
  },
  {
    key: "activitiesSuggestions",
    label: "What activities and learning programs would you like to see for children?",
    placeholder: "Examples: Robotics, Public Speaking, Coding, Arts, Science Projects, Sports, etc.",
  },
  {
    key: "academicYearProgramSuggestions",
    label: "What would make a One Academic Year Program truly valuable for parents and students?",
    placeholder: "Share your expectations and ideas…",
  },
  {
    key: "additionalFeedback",
    label: "Additional feedback (optional)",
    placeholder: "Anything else you'd like to tell us?",
  },
];

function fireConfetti() {
  const duration = 1500;
  const end = Date.now() + duration;
  const colors = ["#f97316", "#fbbf24", "#34d399", "#60a5fa", "#a78bfa"];
  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.7 },
      colors,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.7 },
      colors,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

export function FeedbackForm() {
  const { user, token } = useAuth();
  const [state, setState] = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hydrated = useRef(false);

  // Hydrate from auth + localStorage draft. Auth prefill wins over an empty draft;
  // a draft typed by the user wins over auth (so users can edit pre-filled values).
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    let draft: Partial<FormState> = {};
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) draft = JSON.parse(raw) as Partial<FormState>;
    } catch {
      // ignore corrupt draft
    }
    setState((prev) => {
      const fromAuth: Partial<FormState> = user
        ? { name: user.childName ?? "", mobile: user.phoneNational10 ?? "" }
        : {};
      return { ...prev, ...fromAuth, ...draft };
    });
  }, [user]);

  // Persist a debounced draft so navigation doesn't lose progress.
  useEffect(() => {
    if (!hydrated.current || success) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
      } catch {
        // quota or disabled storage — silently skip
      }
    }, 400);
    return () => clearTimeout(t);
  }, [state, success]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const name = state.name.trim();
    const phone = parseIndianMobileNational10(state.mobile);
    if (!name) return setError("Please enter your name.");
    if (!phone) return setError("Please enter a valid 10-digit Indian mobile number.");
    if (state.rating < 1) return setError("Please tap a star to rate your experience.");
    if (state.email.trim() && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(state.email.trim())) {
      return setError("Email address looks invalid.");
    }

    setSubmitting(true);
    try {
      await submitFeedback(
        {
          name,
          mobileNumber: phone,
          email: state.email.trim(),
          featureSuggestions: state.featureSuggestions.trim(),
          improvementSuggestions: state.improvementSuggestions.trim(),
          activitiesSuggestions: state.activitiesSuggestions.trim(),
          academicYearProgramSuggestions: state.academicYearProgramSuggestions.trim(),
          additionalFeedback: state.additionalFeedback.trim(),
          rating: state.rating,
        },
        token,
      );
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        // ignore
      }
      setSuccess(true);
      fireConfetti();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Submission failed. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-foreground/10 bg-card/60 p-8 text-center shadow-sm sm:p-12">
        <div className="text-5xl">🎉</div>
        <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Thank You!
        </h2>
        <p className="mx-auto mt-2 max-w-md text-muted">
          Your feedback has been submitted successfully and will help us improve the platform.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="rounded-2xl border border-foreground/10 bg-card/60 p-6 shadow-sm sm:p-8">
        <h3 className="font-display text-lg font-bold text-foreground">Your contact</h3>
        <p className="mt-1 text-sm text-muted">
          {user ? "We've pre-filled this from your account. Edit if needed." : "So we can follow up if needed."}
        </p>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Full Name"
            required
            value={state.name}
            onChange={(v) => update("name", v)}
            placeholder="e.g. Aarav"
          />
          <Field
            label="Mobile Number"
            required
            inputMode="numeric"
            value={state.mobile}
            onChange={(v) => update("mobile", v.replace(/[^\d+\s-]/g, ""))}
            placeholder="10-digit mobile"
            maxLength={14}
          />
          <div className="sm:col-span-2">
            <Field
              label="Email Address (Optional)"
              type="email"
              value={state.email}
              onChange={(v) => update("email", v)}
              placeholder="you@example.com"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-foreground/10 bg-card/60 p-6 shadow-sm sm:p-8">
        <h3 className="font-display text-lg font-bold text-foreground">How was your experience?</h3>
        <p className="mt-1 text-sm text-muted">Tap a star to rate.</p>
        <div className="mt-5">
          <StarRating value={state.rating} onChange={(v) => update("rating", v)} />
        </div>
      </div>

      <div className="rounded-2xl border border-foreground/10 bg-card/60 p-6 shadow-sm sm:p-8">
        <h3 className="font-display text-lg font-bold text-foreground">Help us improve</h3>
        <p className="mt-1 text-sm text-muted">Answer whichever questions you'd like. All optional.</p>
        <div className="mt-5 space-y-5">
          {QUESTIONS.map((q) => (
            <TextArea
              key={q.key}
              label={q.label}
              value={state[q.key] as string}
              onChange={(v) => update(q.key, v as never)}
              placeholder={q.placeholder}
              maxLength={MAX_LEN}
            />
          ))}
        </div>
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-200"
        >
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-14 w-full items-center justify-center rounded-2xl bg-primary px-6 text-base font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 sm:text-lg"
      >
        {submitting ? "Submitting…" : "Submit Feedback"}
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
  inputMode,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-foreground">
        {label}
        {required ? <span className="ml-0.5 text-rose-500">*</span> : null}
      </span>
      <input
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
        className="mt-1.5 block h-11 w-full rounded-xl border border-foreground/15 bg-background px-3.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength: number;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        placeholder={placeholder}
        rows={4}
        className="mt-1.5 block w-full resize-y rounded-xl border border-foreground/15 bg-background px-3.5 py-2.5 text-sm leading-relaxed text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
      />
      <div className="mt-1 flex justify-end text-xs text-muted">
        {value.length} / {maxLength}
      </div>
    </label>
  );
}
