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
