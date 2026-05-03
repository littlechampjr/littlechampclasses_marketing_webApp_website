"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchLearnerDashboard } from "@/lib/api/learnerDashboard";
import type { ApiLearnerDashboard } from "@/lib/api/types";
import { ApiError } from "@/lib/api/types";

export function useLearnerDashboard(token: string | null, requestBatchId?: string | null) {
  const [data, setData] = useState<ApiLearnerDashboard | null>(null);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) {
      setData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const d = await fetchLearnerDashboard(
        token,
        requestBatchId && requestBatchId.length > 0 ? requestBatchId : undefined,
      );
      setData(d);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load dashboard");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [token, requestBatchId]);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
