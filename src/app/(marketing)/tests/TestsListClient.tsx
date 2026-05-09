"use client";

import { App, Spin } from "antd";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { TestCard } from "@/components/tests/TestCard";
import { StartTestModal } from "@/components/tests/StartTestModal";
import { PillTabBar } from "@/components/ui/PillTabBar";
import { fetchTestList } from "@/lib/api/tests";
import type { ApiTestListItem } from "@/lib/api/testsTypes";
import { ApiError } from "@/lib/api/types";
import { useAuth } from "@/providers/AuthProvider";

export type TestsListClientProps = {
  /** When set, only tests linked to this course in the CMS are listed. */
  courseId?: string | null;
  /** Single-column style without Recommended / All tabs (e.g. program homework). */
  compact?: boolean;
};

type TestTabKey = "recommended" | "all";

export function TestsListClient(props: TestsListClientProps = {}) {
  const { courseId = null, compact = false } = props;
  const { message } = App.useApp();
  const router = useRouter();
  const pathname = usePathname();
  const { token, loading: authLoading } = useAuth();
  const [tests, setTests] = useState<ApiTestListItem[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [tab, setTab] = useState<TestTabKey>("all");
  const [modal, setModal] = useState<{ open: boolean; test: ApiTestListItem | null }>({
    open: false,
    test: null,
  });
  const [startLoading, setStartLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const d = await fetchTestList(courseId);
        if (!cancelled) {
          setTests(d.tests);
          setErr(null);
        }
      } catch (e) {
        if (!cancelled) {
          setErr(e instanceof ApiError ? e.message : "Could not load tests");
          setTests(null);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  const returnTo = pathname && pathname.length > 0 ? pathname : "/tests";

  const onStart = useCallback(
    (t: ApiTestListItem) => {
      if (authLoading) return;
      if (!token) {
        message.info("Sign in to start a test.");
        router.push(`/login?returnTo=${encodeURIComponent(returnTo)}`);
        return;
      }
      setModal({ open: true, test: t });
    },
    [token, authLoading, message, router, returnTo],
  );

  const confirmStart = useCallback(() => {
    if (!modal.test) return;
    setStartLoading(true);
    setModal((m) => ({ ...m, open: false }));
    const id = modal.test.id;
    router.push(`/tests/${id}/instructions`);
    setStartLoading(false);
  }, [modal.test, router]);

  if (err) {
    return <p className="text-center text-rose-600 dark:text-rose-400">{err}</p>;
  }
  if (!tests) {
    return (
      <div className="flex justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (compact) {
    return (
      <>
        <motion.div
          className="grid gap-5 sm:grid-cols-2"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {tests.length === 0 ? (
            <p className="text-muted col-span-2">
              No homework tests are linked to this program yet. Check back soon.
            </p>
          ) : (
            tests.map((t) => (
              <TestCard key={t.id} test={t} onStart={onStart} disabledStart={authLoading} />
            ))
          )}
        </motion.div>
        <StartTestModal
          open={modal.open}
          testTitle={modal.test?.title}
          onCancel={() => setModal({ open: false, test: null })}
          onConfirm={confirmStart}
          loading={startLoading}
        />
      </>
    );
  }

  const recommended = tests.filter((t) => t.recommended);
  const all = tests;

  return (
    <>
      <PillTabBar<TestTabKey>
        ariaLabel="Practice tests"
        variant="default"
        className="mb-8"
        activeKey={tab}
        onChange={setTab}
        items={[
          { key: "recommended", label: "Recommended" },
          { key: "all", label: "All tests" },
        ]}
      />

      {tab === "recommended" ? (
        <motion.div
          className="grid gap-5 sm:grid-cols-2"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {recommended.length === 0 ? (
            <p className="text-muted col-span-2">No recommended tests right now. Check all tests.</p>
          ) : (
            recommended.map((t) => (
              <TestCard key={t.id} test={t} onStart={onStart} disabledStart={authLoading} />
            ))
          )}
        </motion.div>
      ) : null}

      {tab === "all" ? (
        <motion.div
          className="grid gap-5 sm:grid-cols-2"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {all.map((t) => (
            <TestCard key={t.id} test={t} onStart={onStart} disabledStart={authLoading} />
          ))}
        </motion.div>
      ) : null}

      <StartTestModal
        open={modal.open}
        testTitle={modal.test?.title}
        onCancel={() => setModal({ open: false, test: null })}
        onConfirm={confirmStart}
        loading={startLoading}
      />
    </>
  );
}
