"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchBatchWeekSchedule } from "@/lib/api/learnerDashboard";
import type { ApiWeekSchedule } from "@/lib/api/types";
import { ApiError } from "@/lib/api/types";

export function useBatchWeekSchedule(
  token: string | null,
  batchId: string | null,
  weekOffset: number,
  enabled: boolean,
) {
  const [data, setData] = useState<ApiWeekSchedule | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!enabled || !token || !batchId) {
      setData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const d = await fetchBatchWeekSchedule(token, batchId, { weekOffset });
      setData(d);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load schedule");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [enabled, token, batchId, weekOffset]);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
