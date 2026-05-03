import { apiFetch } from "./client";

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

export async function verifyBookDemoOtp(body: { phone: string; code: string }) {
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

export async function verifyBookDemoPayment(body: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) {
  return apiFetch<{ ok: boolean; enrollmentId: string }>("/api/book-demo/verify-payment", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
