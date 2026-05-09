"use client";

import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { useLearnerDashboard } from "@/hooks/useLearnerDashboard";
import { Skeleton } from "antd";
import { RightOutlined } from "@ant-design/icons";

export default function MyProgramsPage() {
  const { token, user, loading: authLoading } = useAuth();
  const { data, loading, error, refetch } = useLearnerDashboard(token);

  if (authLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  if (!user || !token) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
        <h1 className="font-display text-2xl font-bold text-foreground">My programs</h1>
        <p className="mt-3 text-muted">Sign in to see programs you&apos;re enrolled in.</p>
        <Link
          href={`/login?returnTo=${encodeURIComponent("/my-programs")}`}
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-xl border-2 border-primary px-6 font-bold text-primary hover:bg-primary hover:text-primary-foreground"
        >
          Login / Register
        </Link>
      </div>
    );
  }

  if (loading && !data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  if (error || !data?.hasPurchases || data.enrollments.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
        <h1 className="font-display text-2xl font-bold text-foreground">My programs</h1>
        <p className="mt-3 text-muted">
          {error ??
            "You don&apos;t have any enrolled programs yet. Explore our premium courses to get started."}
        </p>
        {error ? (
          <button
            type="button"
            className="mt-6 text-sm font-bold text-primary"
            onClick={() => void refetch()}
          >
            Retry
          </button>
        ) : (
          <Link
            href="/programs/after-school"
            className="mt-8 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-6 font-bold text-primary-foreground"
          >
            Browse programs
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">My programs</h1>
      <p className="mt-2 text-sm text-muted">Open a program to study, review materials, and homework.</p>
      <ul className="mt-8 space-y-3">
        {data.enrollments.map((e) => (
          <li key={e.enrollmentId}>
            <Link
              href={`/my-programs/${e.enrollmentId}`}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-border-soft bg-card p-4 shadow-sm transition hover:border-primary/30 hover:shadow-md"
            >
              <div className="min-w-0">
                <p className="font-display font-bold text-foreground group-hover:text-primary">
                  {e.courseTitle}
                </p>
                <p className="mt-1 text-xs text-muted sm:text-sm">
                  Batch {e.batchCode} · {e.dateRangeLabel}
                </p>
              </div>
              <RightOutlined className="shrink-0 text-muted group-hover:text-primary" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
