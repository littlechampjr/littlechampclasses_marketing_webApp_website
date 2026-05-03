"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import type { ApiBooking } from "@/lib/api/types";

export function useMyBookings(token: string | null) {
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) {
      setBookings([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<{ bookings: ApiBooking[] }>("/api/bookings/mine", {
        method: "GET",
        token,
      });
      setBookings(data.bookings);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  return { bookings, loading, error, reload: load };
}
