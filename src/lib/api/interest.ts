import { apiFetch } from "@/lib/api/client";

export async function sendInterestWaitlistOtp(body: { phone: string; courseSlug: string }) {
  return apiFetch<{ ok: true; resendAfterSeconds: number }>("/api/interest/send-otp", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function confirmInterestWaitlist(body: { phone: string; courseSlug: string; code: string }) {
  return apiFetch<{ ok: boolean; message: string }>("/api/interest/confirm", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/**
 * Logged-in waitlist join. No OTP — phone is read from the user's account on the server.
 */
export async function confirmInterestWaitlistAsUser(userToken: string, courseSlug: string) {
  return apiFetch<{ ok: boolean; message: string }>("/api/interest/confirm-as-user", {
    method: "POST",
    body: JSON.stringify({ courseSlug }),
    token: userToken,
  });
}
