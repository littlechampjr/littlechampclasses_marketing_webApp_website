"use client";

import { Skeleton } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { PremiumLearnerDashboard } from "@/components/dashboard/PremiumLearnerDashboard";
import { MarketingHomeSections } from "@/components/home/MarketingHomeSections";
import { useLearnerDashboard } from "@/hooks/useLearnerDashboard";
import { formatIndianMobileDisplay } from "@/lib/phoneDisplay";
import { useAuth } from "@/providers/AuthProvider";
import { useBookDemoFlow } from "@/providers/BookDemoFlowProvider";

function DashboardSignedInStrip({
  user,
  onBookDemo,
  onLogout,
}: {
  user: { childName?: string; phoneNational10: string };
  onBookDemo: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="border-b border-border-soft bg-card/40 backdrop-blur-sm dark:bg-card/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Signed in</p>
          <p className="mt-0.5 text-sm text-foreground">
            {user.childName ? (
              <span className="font-semibold">{user.childName}&apos;s parent</span>
            ) : (
              <span className="font-semibold">Learner</span>
            )}{" "}
            · {formatIndianMobileDisplay(user.phoneNational10)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onBookDemo}
            className="inline-flex min-h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 transition hover:opacity-95"
          >
            Book Another Demo
          </button>
          <button
            type="button"
            className="rounded-xl border border-border-soft px-4 py-2 text-sm font-semibold text-muted transition hover:border-primary/40 hover:text-foreground"
            onClick={onLogout}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export function DashboardClient() {
  const router = useRouter();
  const { user, token, loading: authLoading, logout } = useAuth();
  const { openPicker } = useBookDemoFlow();
  const [requestBatchId, setRequestBatchId] = useState<string | undefined>(undefined);
  const { data: learnerDash, loading: learnerLoading, error: learnerError, refetch: refetchLearner } =
    useLearnerDashboard(token, requestBatchId);

  const onBookDemo = useCallback(() => {
    openPicker();
  }, [openPicker]);

  useEffect(() => {
    if (authLoading) return;
    if (user && !user.profileComplete) {
      router.replace("/onboarding");
    }
  }, [authLoading, user, router]);

  if (authLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center text-muted sm:px-6">
        Loading your profile…
      </div>
    );
  }

  if (user && !user.profileComplete) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center text-muted sm:px-6">
        Redirecting to complete your profile…
      </div>
    );
  }

  if (!user || !token) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 sm:px-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-3 text-muted">Sign in to see your programs and schedule.</p>
        <Link
          href="/login"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl border-2 border-primary px-6 font-bold text-primary hover:bg-primary hover:text-primary-foreground"
        >
          Login / Register
        </Link>
      </div>
    );
  }

  if (learnerLoading && !learnerDash) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <Skeleton active paragraph={{ rows: 2 }} className="mb-8" />
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  if (learnerError) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
        <h1 className="font-display text-xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-3 text-muted">{learnerError}</p>
        <button
          type="button"
          className="mt-6 text-sm font-bold text-primary"
          onClick={() => void refetchLearner()}
        >
          Retry
        </button>
      </div>
    );
  }

  const hasPurchases = learnerDash?.hasPurchases ?? false;

  if (!hasPurchases) {
    return (
      <div>
        <DashboardSignedInStrip user={user} onBookDemo={onBookDemo} onLogout={logout} />
        <MarketingHomeSections />
      </div>
    );
  }

  if (!learnerDash) {
    return null;
  }

  return (
    <div>
      <DashboardSignedInStrip user={user} onBookDemo={onBookDemo} onLogout={logout} />
      <PremiumLearnerDashboard
        token={token}
        data={learnerDash}
        loading={learnerLoading}
        requestBatchId={requestBatchId}
        onBatchChange={(id) => setRequestBatchId(id)}
        onRefetch={refetchLearner}
      />
    </div>
  );
}
