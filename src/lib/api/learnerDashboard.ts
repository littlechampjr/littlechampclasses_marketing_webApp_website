import { apiFetch } from "./client";
import type {
  ApiChapterContentResponse,
  ApiEnrolledProgramResponse,
  ApiLearnerDashboard,
  ApiWeekSchedule,
} from "./types";

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

export async function fetchEnrolledProgram(token: string, enrollmentId: string) {
  return apiFetch<ApiEnrolledProgramResponse>(
    `/api/me/enrollments/${encodeURIComponent(enrollmentId)}/program`,
    { method: "GET", token },
  );
}

export async function fetchChapterContent(
  token: string,
  enrollmentId: string,
  chapterId: string,
) {
  return apiFetch<ApiChapterContentResponse>(
    `/api/me/enrollments/${encodeURIComponent(enrollmentId)}/chapters/${encodeURIComponent(chapterId)}`,
    { method: "GET", token },
  );
}
