"use client";

import { Spin, App } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/providers/AuthProvider";
import { fetchTestDetail, startTestAttempt } from "@/lib/api/tests";
import type { ApiTestDetail } from "@/lib/api/testsTypes";
import { ApiError } from "@/lib/api/types";
import { useTestSessionStore } from "@/stores/testSessionStore";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/Button";

export function InstructionsClient() {
  const { testId } = useParams<{ testId: string }>();
  const router = useRouter();
  const { message } = App.useApp();
  const { token, loading: authLoading } = useAuth();
  const bootstrap = useTestSessionStore((s) => s.bootstrap);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [detail, setDetail] = useState<ApiTestDetail | null>(null);

  useEffect(() => {
    if (!testId) return;
    void (async () => {
      try {
        const d = await fetchTestDetail(String(testId));
        setDetail(d.test);
      } catch (e) {
        message.error(e instanceof ApiError ? e.message : "Could not load test");
      } finally {
        setLoading(false);
      }
    })();
  }, [testId, message]);

  const onStart = useCallback(async () => {
    if (!testId) return;
    if (!token) {
      message.info("Sign in to start.");
      router.push(
        `/login?returnTo=${encodeURIComponent(`/tests/${testId}/instructions`)}`,
      );
      return;
    }
    setStarting(true);
    try {
      const res = await startTestAttempt(String(testId), token);
      bootstrap({
        attemptId: res.attempt.id,
        testId: res.attempt.testId,
        testTitle: detail?.title ?? "Test",
        endsAt: res.attempt.endsAt,
        questions: res.questions,
      });
      router.push(`/tests/attempt/${res.attempt.id}/take`);
    } catch (e) {
      message.error(e instanceof ApiError ? e.message : "Could not start test");
    } finally {
      setStarting(false);
    }
  }, [testId, token, message, router, bootstrap, detail?.title]);

  if (loading || !detail) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-2">
        <ButtonLink href="/tests" variant="ghost" className="px-0 text-sm text-muted">
          ← All tests
        </ButtonLink>
      </div>
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center sm:text-left"
      >
        <h1 className="font-display text-2xl font-bold sm:text-3xl">{detail.title}</h1>
        <p className="mt-2 text-sm text-muted">
          {detail.questionCount} questions · {detail.totalMarks} marks · {detail.durationMins} mins
        </p>
      </motion.header>

      <section className="mt-8 rounded-2xl border border-border-soft bg-card p-6 shadow-sm dark:bg-card/90 sm:p-8">
        <h2 className="text-sm font-bold uppercase tracking-wide text-primary">General instructions</h2>
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
          {detail.generalInstructions || "—"}
        </p>
      </section>

      <section className="mt-5 rounded-2xl border border-border-soft bg-card p-6 shadow-sm dark:bg-card/90 sm:p-8">
        <h2 className="text-sm font-bold uppercase tracking-wide text-primary">Test instructions</h2>
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
          {detail.testInstructions || "—"}
        </p>
      </section>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={() => router.push("/tests")}>
          Back
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={onStart}
          disabled={authLoading || starting}
        >
          {starting ? "Starting…" : "Start test"}
        </Button>
      </div>
    </div>
  );
}
