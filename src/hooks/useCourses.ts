"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import type { ApiCourse } from "@/lib/api/types";

export function useCourses() {
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<{ courses: ApiCourse[] }>("/api/courses", { method: "GET" });
      setCourses(data.courses);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load courses");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { courses, loading, error, reload: load };
}
