"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spin, App } from "antd";
import { useAuth } from "@/providers/AuthProvider";
import { getTestResult } from "@/lib/api/tests";
import { ApiError } from "@/lib/api/types";
import type { GetResultResponse } from "@/lib/api/testsTypes";
import { ResultCard } from "@/components/tests/ResultCard";
import { ResultSectionTable } from "@/components/tests/ResultSectionTable";
import { ButtonLink } from "@/components/ui/Button";

export default function TestResultPage() {
  const params = useParams();
  const attemptId = String(params.attemptId ?? "");
  const { token, loading: authLoad } = useAuth();
  const { message } = App.useApp();
  const router = useRouter();
  const [data, setData] = useState<GetResultResponse | null>(null);

  useEffect(() => {
    if (authLoad) return;
    if (!token) {
      router.replace("/login?returnTo=/tests");
      return;
    }
    void (async () => {
      try {
        const r = await getTestResult(attemptId, token);
        setData(r);
      } catch (e) {
        if (e instanceof ApiError && e.status === 400) {
          router.replace(`/tests/attempt/${attemptId}/feedback`);
        } else {
          message.error(e instanceof Error ? e.message : "Error");
        }
      }
    })();
  }, [attemptId, token, authLoad, router, message]);

  if (authLoad || !data) {
    return (
      <div className="flex min-h-[40vh] justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold">Result &amp; analysis</h1>
      <p className="text-sm text-muted">{data.test.title}</p>
      <div className="mt-8">
        <ResultCard
          attemptId={attemptId}
          testId={data.test.id}
          testTitle={data.test.title}
          summary={data.summary}
        />
      </div>
      <div id="analysis" className="mt-10 scroll-mt-24">
        <ResultSectionTable rows={data.sectionRows} />
      </div>
      <p className="mt-8 text-center">
        <ButtonLink href="/tests" variant="ghost" className="text-sm text-muted">
          ← More tests
        </ButtonLink>
      </p>
    </div>
  );
}
