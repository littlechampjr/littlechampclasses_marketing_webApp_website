"use client";

import { App, Spin, Tabs } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { fetchTestList } from "@/lib/api/tests";
import type { ApiTestListItem } from "@/lib/api/testsTypes";
import { TestCard } from "@/components/tests/TestCard";
import { StartTestModal } from "@/components/tests/StartTestModal";
import { motion } from "framer-motion";
import { ApiError } from "@/lib/api/types";

export function TestsListClient() {
  const { message } = App.useApp();
  const router = useRouter();
  const { token, loading: authLoading } = useAuth();
  const [tests, setTests] = useState<ApiTestListItem[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [modal, setModal] = useState<{ open: boolean; test: ApiTestListItem | null }>({
    open: false,
    test: null,
  });
  const [startLoading, setStartLoading] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const d = await fetchTestList();
        setTests(d.tests);
      } catch (e) {
        setErr(e instanceof ApiError ? e.message : "Could not load tests");
      }
    })();
  }, []);

  const onStart = useCallback(
    (t: ApiTestListItem) => {
      if (authLoading) return;
      if (!token) {
        message.info("Sign in to start a test.");
        router.push(`/login?returnTo=${encodeURIComponent("/tests")}`);
        return;
      }
      setModal({ open: true, test: t });
    },
    [token, authLoading, message, router],
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

  const recommended = tests.filter((t) => t.recommended);
  const all = tests;

  return (
    <>
      <Tabs
        defaultActiveKey="all" /* All tests tab is default (spec) */
        className="tests-tabs"
        items={[
          {
            key: "recommended",
            label: "Recommended",
            children: (
              <motion.div
                className="grid gap-5 sm:grid-cols-2"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {recommended.length === 0 ? (
                  <p className="text-muted col-span-2">No recommended tests right now. Check all tests.</p>
                ) : (
                  recommended.map((t) => (
                    <TestCard
                      key={t.id}
                      test={t}
                      onStart={onStart}
                      disabledStart={authLoading}
                    />
                  ))
                )}
              </motion.div>
            ),
          },
          {
            key: "all",
            label: "All tests",
            children: (
              <motion.div
                className="grid gap-5 sm:grid-cols-2"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {all.map((t) => (
                  <TestCard key={t.id} test={t} onStart={onStart} disabledStart={authLoading} />
                ))}
              </motion.div>
            ),
          },
        ]}
      />
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
