"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchChapterContent } from "@/lib/api/learnerDashboard";
import type { ApiChapterContentResponse } from "@/lib/api/types";
import { ApiError } from "@/lib/api/types";

export function useChapterContent(
  token: string | null,
  enrollmentId: string | null,
  chapterId: string | null,
) {
  const [data, setData] = useState<ApiChapterContentResponse | null>(null);
  const [loading, setLoading] = useState(Boolean(token && enrollmentId && chapterId));
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token || !enrollmentId || !chapterId) {
      setData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const d = await fetchChapterContent(token, enrollmentId, chapterId);
      setData(d);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load chapter");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [token, enrollmentId, chapterId]);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
