import { apiFetch } from "./client";
import type { ApiUser } from "./types";

export async function sendBookDemoOtp(body: {
  phone: string;
  courseSlug: string;
  batchId: string;
  grade: number;
}) {
  return apiFetch<{ ok: boolean; resendAfterSeconds: number; enrollmentId: string }>(
    "/api/book-demo/send-otp",
    { method: "POST", body: JSON.stringify(body) },
  );
}

export async function verifyBookDemoOtp(body: {
  phone: string;
  code: string;
  /** Latest send-otp enrollment; needed when server OTP bypass returns empty meta. */
  enrollmentId?: string;
}) {
  return apiFetch<{ ok: boolean; token: string; enrollmentId: string }>(
    "/api/book-demo/verify-otp",
    { method: "POST", body: JSON.stringify(body) },
  );
}

export async function createBookDemoOrder(token: string) {
  return apiFetch<{
    keyId: string;
    orderId: string;
    amount: number;
    currency: string;
    enrollmentId: string;
  }>("/api/book-demo/create-order", {
    method: "POST",
    body: JSON.stringify({}),
    token,
  });
}

/**
 * Logged-in shortcut: no OTP. Uses the user's auth JWT directly. The server
 * reads the phone from the User record — client cannot override it.
 */
export async function createBookDemoOrderAsUser(
  userToken: string,
  body: { courseSlug: string; batchId: string; grade: number },
) {
  return apiFetch<{
    keyId: string;
    orderId: string;
    amount: number;
    currency: string;
    enrollmentId: string;
  }>("/api/book-demo/create-order-as-user", {
    method: "POST",
    body: JSON.stringify(body),
    token: userToken,
  });
}

export async function verifyBookDemoPayment(body: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) {
  return apiFetch<{
    ok: boolean;
    enrollmentId: string;
    token: string;
    user: ApiUser;
    needsOnboarding: boolean;
  }>("/api/book-demo/verify-payment", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
