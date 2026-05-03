import { apiFetch } from "./client";
import type { ApiUser } from "./types";

export async function sendAuthOtp(body: { phone: string }) {
  return apiFetch<{ ok: boolean; resendAfterSeconds: number }>("/api/auth/send-otp", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function verifyAuthOtp(body: { phone: string; code: string }) {
  return apiFetch<{ token: string; user: ApiUser; needsOnboarding: boolean }>(
    "/api/auth/verify-otp",
    { method: "POST", body: JSON.stringify(body) },
  );
}

export async function patchUserProfile(
  body: { childName: string; learningGoal: string; childGrade: number },
  token: string,
) {
  return apiFetch<{ user: ApiUser }>("/api/users/me", {
    method: "PATCH",
    body: JSON.stringify(body),
    token,
  });
}
