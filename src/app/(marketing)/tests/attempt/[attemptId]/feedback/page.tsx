"use client";

import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { SubmitFeedbackView } from "@/components/tests/SubmitFeedbackView";
import { useEffect } from "react";
import { Spin } from "antd";

export default function TestFeedbackPage() {
  const params = useParams();
  const attemptId = String(params.attemptId ?? "");
  const { token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !token) {
      router.replace("/login?returnTo=/tests");
    }
  }, [loading, token, router]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] justify-center py-20">
        <Spin />
      </div>
    );
  }
  if (!token) return null;

  return <SubmitFeedbackView attemptId={attemptId} token={token} />;
}
