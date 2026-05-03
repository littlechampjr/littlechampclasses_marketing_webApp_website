"use client";

import { Modal, App } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { getTestAttempt, submitTestAttempt, fetchTestDetail } from "@/lib/api/tests";
import { ApiError } from "@/lib/api/types";
import { useTestSessionStore } from "@/stores/testSessionStore";
import { TestTimer } from "./TestTimer";
import { QuestionPanel } from "./QuestionPanel";
import { SidebarNavigator } from "./SidebarNavigator";
import { Button } from "@/components/ui/Button";
export function TestAttemptClient() {
  const params = useParams();
  const attemptId = String(params.attemptId ?? "");
  const router = useRouter();
  const { token, loading: authLoading } = useAuth();
  const { message } = App.useApp();
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [instr, setInstr] = useState<{ open: boolean; text: string }>({ open: false, text: "" });
  const submitLock = useRef(false);

  const testId = useTestSessionStore((s) => s.testId);
  const testTitle = useTestSessionStore((s) => s.testTitle);
  const endsAt = useTestSessionStore((s) => s.endsAt);
  const questions = useTestSessionStore((s) => s.questions);
  const currentIndex = useTestSessionStore((s) => s.currentIndex);
  const cells = useTestSessionStore((s) => s.cells);
  const bootstrap = useTestSessionStore((s) => s.bootstrap);
  const setCurrentIndex = useTestSessionStore((s) => s.setCurrentIndex);
  const selectOption = useTestSessionStore((s) => s.selectOption);
  const toggleMarkForReview = useTestSessionStore((s) => s.toggleMarkForReview);
  const saveAndNext = useTestSessionStore((s) => s.saveAndNext);
  const reset = useTestSessionStore((s) => s.reset);
  const buildSubmitAnswers = useTestSessionStore((s) => s.buildSubmitAnswers);

  const q = questions[currentIndex] ?? null;
  const cell = q ? cells[q.id] : undefined;

  const runSubmit = useCallback(async () => {
    if (!token || !attemptId) return;
    if (submitLock.current) return;
    submitLock.current = true;
    try {
      const answers = buildSubmitAnswers();
      await submitTestAttempt(attemptId, { answers }, token);
      reset();
      if (typeof window !== "undefined") {
        try {
          window.localStorage.removeItem("lcc-test-session-v1");
        } catch {
          /* ignore */
        }
      }
      router.replace(`/tests/attempt/${attemptId}/feedback`);
    } catch (e) {
      submitLock.current = false;
      message.error(e instanceof Error ? e.message : "Submit failed");
    }
  }, [token, attemptId, buildSubmitAnswers, message, reset, router]);

  const onTimerExpire = useCallback(() => {
    void runSubmit();
  }, [runSubmit]);

  const openInstr = useCallback(async () => {
    if (!testId) return;
    try {
      const d = await fetchTestDetail(testId);
      setInstr({
        open: true,
        text: [d.test.generalInstructions, d.test.testInstructions].filter(Boolean).join("\n\n"),
      });
    } catch {
      setInstr({ open: true, text: "No additional instructions for this test." });
    }
  }, [testId]);

  useEffect(() => {
    if (authLoading) return;
    if (!token) {
      setLoading(false);
      setLoadError("signin");
      return;
    }
    if (!attemptId) {
      setLoading(false);
      setLoadError("bad");
      return;
    }
    const st = useTestSessionStore.getState();
    if (st.attemptId === attemptId && st.questions.length > 0) {
      if (!st.activeSincePerf) {
        useTestSessionStore.setState({ activeSincePerf: performance.now() });
      }
      setLoading(false);
      return;
    }
    void (async () => {
      try {
        const data = await getTestAttempt(attemptId, token);
        if ("finalized" in data && data.finalized) {
          router.replace(`/tests/attempt/${attemptId}/result`);
          return;
        }
        if (!("questions" in data) || !data.questions.length) {
          setLoadError("empty");
          setLoading(false);
          return;
        }
        const a = data.attempt;
        bootstrap({
          attemptId: a.id,
          testId: a.testId,
          testTitle: a.testTitle ?? "Practice test",
          endsAt: a.endsAt,
          questions: data.questions,
        });
        setLoadError(null);
      } catch (e) {
        if (e instanceof ApiError && e.status === 409) {
          router.replace(`/tests/attempt/${attemptId}/result`);
          return;
        }
        setLoadError("net");
        message.error(e instanceof Error ? e.message : "Could not load attempt");
      } finally {
        setLoading(false);
      }
    })();
  }, [attemptId, token, authLoading, router, message, bootstrap]);

  useEffect(() => {
    if (!q) return;
    const h = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const opts = q.options;
      if (e.key >= "1" && e.key <= "9") {
        const n = parseInt(e.key, 10) - 1;
        if (opts[n]) selectOption(opts[n]!.id);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [q, selectOption]);

  if (loadError === "signin") {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-muted">Sign in to take tests.</p>
        <Button
          className="mt-4"
          variant="primary"
          onClick={() => router.push(`/login?returnTo=${encodeURIComponent(`/tests/attempt/${attemptId}/take`)}`)}
        >
          Sign in
        </Button>
      </div>
    );
  }

  if (loading || !q || !endsAt) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted">
        {loadError ? "Something went wrong. Return to the test list and try again." : "Loading…"}
      </div>
    );
  }

  return (
    <div className="px-3 pb-12 pt-4 sm:px-4 lg:px-8">
      <header className="mb-6 flex flex-col gap-3 border-b border-border-soft pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-lg font-bold text-foreground sm:text-xl">{testTitle}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <TestTimer endsAtIso={endsAt} onExpire={onTimerExpire} />
          <Button type="button" variant="outline" onClick={openInstr} className="min-h-[40px]">
            <FileTextOutlined />
            View instructions
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={() => {
              Modal.confirm({
                title: "Submit test?",
                content: "You will not be able to change your answers after submitting.",
                okText: "Submit",
                cancelText: "Back",
                onOk: () => runSubmit(),
              });
            }}
          >
            Submit test
          </Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <QuestionPanel
            indexLabel={String(currentIndex + 1)}
            question={q}
            selected={cell?.selectedOptionId ?? null}
            onSelect={selectOption}
            marked={cell?.markedForReview ?? false}
            onToggleMark={toggleMarkForReview}
            onSaveAndNext={saveAndNext}
            isLast={currentIndex >= questions.length - 1}
          />
        </div>
        <SidebarNavigator
          questions={questions}
          cells={cells}
          currentIndex={currentIndex}
          onJump={setCurrentIndex}
        />
      </div>

      <Modal
        title="Test instructions"
        open={instr.open}
        onCancel={() => setInstr((s) => ({ ...s, open: false }))}
        footer={null}
        className="max-w-lg"
      >
        <p className="whitespace-pre-wrap text-sm text-foreground/90">{instr.text}</p>
      </Modal>
    </div>
  );
}
