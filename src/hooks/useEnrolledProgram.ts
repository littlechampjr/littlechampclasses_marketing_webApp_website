"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchEnrolledProgram } from "@/lib/api/learnerDashboard";
import type { ApiEnrolledProgramResponse } from "@/lib/api/types";
import { ApiError } from "@/lib/api/types";

export function useEnrolledProgram(token: string | null, enrollmentId: string | null) {
  const [data, setData] = useState<ApiEnrolledProgramResponse | null>(null);
  const [loading, setLoading] = useState(Boolean(token && enrollmentId));
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token || !enrollmentId) {
      setData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const d = await fetchEnrolledProgram(token, enrollmentId);
      setData(d);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load program");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [token, enrollmentId]);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
