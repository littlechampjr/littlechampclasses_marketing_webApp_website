import { apiFetch } from "./client";
import type { ApiLearnerDashboard, ApiWeekSchedule } from "./types";

export async function fetchLearnerDashboard(token: string, batchId?: string | null) {
  const q =
    batchId && batchId.length > 0 ? `?batchId=${encodeURIComponent(batchId)}` : "";
  return apiFetch<ApiLearnerDashboard>(`/api/me/dashboard${q}`, {
    method: "GET",
    token,
  });
}

export async function fetchBatchWeekSchedule(
  token: string,
  batchId: string,
  opts: { weekOffset?: number } = {},
) {
  const sp = new URLSearchParams();
  if (opts.weekOffset !== undefined && opts.weekOffset !== 0) {
    sp.set("weekOffset", String(opts.weekOffset));
  }
  const qs = sp.toString();
  return apiFetch<ApiWeekSchedule>(
    `/api/me/batches/${encodeURIComponent(batchId)}/schedule${qs ? `?${qs}` : ""}`,
    { method: "GET", token },
  );
}
