import { apiFetch } from "./client";
import type { ApiCourse } from "./types";

export type PurchasePricingResponse = {
  courseId: string;
  slug: string;
  listPricePaise: number;
  strikePricePaise: number | null;
  salePricePaise: number;
  userAdjustmentPaise: number;
  basePayablePaise: number;
  currency: string;
  defaultBatchId: string;
  dateRangeDisplay: string;
  emiCopy: string;
};

export type CouponValidateResponse = {
  ok: true;
  code: string;
  label: string;
  couponDiscountPaise: number;
  finalAmountPaise: number;
  basePayablePaise: number;
};

export type CouponCatalogResponse = {
  items: { code: string; label: string }[];
};

export type CreatePurchaseOrderResponse = {
  keyId: string | undefined;
  orderId: string;
  amount: number;
  currency: string;
  purchaseId: string;
  courseTitle: string;
  batchCode: string;
};

export async function fetchCoursesForPurchaseBanner(): Promise<ApiCourse[]> {
  const data = await apiFetch<{ courses: ApiCourse[] }>("/api/courses?purchaseFlow=1", {
    method: "GET",
  });
  return data.courses;
}

export async function fetchCourseBySlug(slug: string): Promise<ApiCourse> {
  const data = await apiFetch<{ course: ApiCourse }>(`/api/courses/${encodeURIComponent(slug)}`, {
    method: "GET",
  });
  return data.course;
}

export async function fetchPurchasePricing(
  slug: string,
  token: string,
): Promise<PurchasePricingResponse> {
  return apiFetch(`/api/courses/${encodeURIComponent(slug)}/purchase/pricing`, {
    method: "GET",
    token,
  });
}

export async function validatePurchaseCoupon(
  slug: string,
  token: string,
  code: string,
): Promise<CouponValidateResponse> {
  return apiFetch(`/api/courses/${encodeURIComponent(slug)}/purchase/validate-coupon`, {
    method: "POST",
    token,
    body: JSON.stringify({ code }),
  });
}

export async function fetchCouponCatalog(
  slug: string,
  token: string,
): Promise<CouponCatalogResponse> {
  return apiFetch(`/api/courses/${encodeURIComponent(slug)}/purchase/coupons`, {
    method: "GET",
    token,
  });
}

export async function createPurchaseOrder(
  slug: string,
  token: string,
  body: { batchId: string; couponCode?: string | null },
): Promise<CreatePurchaseOrderResponse> {
  return apiFetch(`/api/courses/${encodeURIComponent(slug)}/purchase/orders`, {
    method: "POST",
    token,
    body: JSON.stringify(body),
  });
}

export async function verifyPurchasePayment(
  slug: string,
  token: string,
  body: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  },
): Promise<{ ok: boolean; purchaseId: string; alreadyPaid?: boolean }> {
  return apiFetch(`/api/courses/${encodeURIComponent(slug)}/purchase/verify-payment`, {
    method: "POST",
    token,
    body: JSON.stringify(body),
  });
}
