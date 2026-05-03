"use client";

import { Rate } from "antd";
import { useState } from "react";
import { CheckCircleFilled } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { postTestFeedback } from "@/lib/api/tests";
import { cn } from "@/lib/cn";

const labels = ["Very poor", "Poor", "OK", "Good", "Excellent"];

type Props = {
  attemptId: string;
  token: string;
};

export function SubmitFeedbackView({ attemptId, token }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [skipped, setSkipped] = useState(false);

  const onContinue = async () => {
    setSubmitting(true);
    try {
      await postTestFeedback(attemptId, { rating: skipped || value < 1 ? null : value, skipped }, token);
    } catch {
      /* still navigate */
    } finally {
      setSubmitting(false);
    }
    router.replace(`/tests/attempt/${attemptId}/result`);
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-0">
      <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 text-4xl text-emerald-600 dark:text-emerald-400">
        <CheckCircleFilled />
      </div>
      <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
        You have successfully submitted your test!
      </h1>
      <p className="mt-3 text-sm text-muted">How was your test experience?</p>
      <div className="mt-8">
        <Rate
          tooltips={labels}
          value={value}
          onChange={setValue}
          allowClear={false}
          className="text-2xl"
          style={{ color: "var(--primary)" }}
        />
        {value > 0 ? <p className="mt-2 text-sm text-muted">{labels[value - 1]}</p> : null}
      </div>
      <div className="mt-4">
        <button
          type="button"
          onClick={() => {
            setSkipped((s) => !s);
            if (!skipped) setValue(0);
          }}
          className={cn(
            "text-sm font-medium text-muted underline decoration-dotted underline-offset-2",
            "hover:text-foreground",
            skipped && "text-foreground",
          )}
        >
          Skip feedback
        </button>
      </div>
      <div className="mt-10">
        <Button type="button" variant="primary" onClick={onContinue} disabled={submitting}>
          {submitting ? "…" : "View results"}
        </Button>
      </div>
    </div>
  );
}
