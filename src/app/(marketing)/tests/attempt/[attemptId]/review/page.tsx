"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spin, App } from "antd";
import { useAuth } from "@/providers/AuthProvider";
import { getTestReview } from "@/lib/api/tests";
import { ApiError } from "@/lib/api/types";
import type { GetReviewResponse } from "@/lib/api/testsTypes";
import { ReviewSolutionsView } from "@/components/tests/ReviewSolutionsView";
import { ButtonLink } from "@/components/ui/Button";

export default function TestReviewPage() {
  const params = useParams();
  const attemptId = String(params.attemptId ?? "");
  const { token, loading: authLoad } = useAuth();
  const { message } = App.useApp();
  const router = useRouter();
  const [data, setData] = useState<GetReviewResponse | null>(null);

  useEffect(() => {
    if (authLoad) return;
    if (!token) {
      router.replace("/login?returnTo=/tests");
      return;
    }
    void (async () => {
      try {
        setData(await getTestReview(attemptId, token));
      } catch (e) {
        message.error(e instanceof ApiError ? e.message : "Could not load review");
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
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold">Review answers</h1>
      <p className="text-sm text-muted">{data.test.title}</p>
      <div className="mt-2">
        <ButtonLink
          href={`/tests/attempt/${attemptId}/result`}
          variant="ghost"
          className="text-sm text-muted"
        >
          ← Result summary
        </ButtonLink>
      </div>
      <div className="mt-8">
        <ReviewSolutionsView questions={data.questions} />
      </div>
    </div>
  );
}
