import { apiFetch } from "./client";
import type {
  ApiTestDetail,
  ApiTestListItem,
  GetAttemptResponse,
  GetResultResponse,
  GetReviewResponse,
  StartAttemptResponse,
  SubmitAttemptBody,
} from "./testsTypes";

export function fetchTestList() {
  return apiFetch<{ tests: ApiTestListItem[] }>("/api/tests", { method: "GET" });
}

export function fetchTestDetail(testId: string) {
  return apiFetch<{ test: ApiTestDetail }>(`/api/tests/${testId}`, { method: "GET" });
}

export function startTestAttempt(testId: string, token: string) {
  return apiFetch<StartAttemptResponse>(`/api/tests/${testId}/attempts`, {
    method: "POST",
    token,
  });
}

export function getTestAttempt(attemptId: string, token: string) {
  return apiFetch<GetAttemptResponse>(`/api/tests/attempts/${attemptId}`, {
    method: "GET",
    token,
  });
}

export function submitTestAttempt(attemptId: string, body: SubmitAttemptBody, token: string) {
  return apiFetch<{ ok: boolean; attemptId: string }>(`/api/tests/attempts/${attemptId}/submit`, {
    method: "POST",
    token,
    body: JSON.stringify(body),
  });
}

export function getTestResult(attemptId: string, token: string) {
  return apiFetch<GetResultResponse>(`/api/tests/attempts/${attemptId}/result`, {
    method: "GET",
    token,
  });
}

export function postTestFeedback(
  attemptId: string,
  input: { rating: number | null; skipped: boolean },
  token: string,
) {
  return apiFetch<{ ok: boolean }>(`/api/tests/attempts/${attemptId}/feedback`, {
    method: "POST",
    token,
    body: JSON.stringify(input),
  });
}

export function getTestReview(attemptId: string, token: string) {
  return apiFetch<GetReviewResponse>(`/api/tests/attempts/${attemptId}/review`, {
    method: "GET",
    token,
  });
}
