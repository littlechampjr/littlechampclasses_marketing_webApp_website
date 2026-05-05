"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { App, Modal } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import type { ApiCourse } from "@/lib/api/types";
import { ApiError } from "@/lib/api/types";
import {
  createPurchaseOrder,
  fetchCouponCatalog,
  fetchPurchasePricing,
  validatePurchaseCoupon,
  verifyPurchasePayment,
  type PurchasePricingResponse,
} from "@/lib/api/coursePurchase";
import { loadRazorpayScript, openRazorpayCheckout } from "@/lib/razorpay/loadRazorpayScript";
import { site } from "@/lib/site-config";
import { CourseDetails } from "./CourseDetails";
import { PricingCard } from "./PricingCard";

const EnrollmentSuccessModal = dynamic(
  () => import("./EnrollmentSuccessModal").then((m) => ({ default: m.EnrollmentSuccessModal })),
  { ssr: false },
);

export function CoursePurchasePageClient({ initialCourse }: { initialCourse: ApiCourse }) {
  const { message } = App.useApp();
  const router = useRouter();
  const pathname = usePathname();
  const { token, user } = useAuth();

  const slug = initialCourse.slug;
  const pf = initialCourse.purchaseFlow;

  const [quote, setQuote] = useState<PurchasePricingResponse | null>(null);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [selectedBatchId, setSelectedBatchId] = useState("");

  const [couponMeta, setCouponMeta] = useState({ loaded: false, empty: true });

  const [couponInput, setCouponInput] = useState("");
  const [couponBusy, setCouponBusy] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [validated, setValidated] = useState<{
    code: string;
    label: string;
    couponDiscountPaise: number;
    finalAmountPaise: number;
  } | null>(null);

  const [successOpen, setSuccessOpen] = useState(false);
  const [payBusy, setPayBusy] = useState(false);
  const [couponsUi, setCouponsUi] = useState<{ open: boolean; items: { code: string; label: string }[] }>({
    open: false,
    items: [],
  });

  useEffect(() => {
    if (!initialCourse.batches?.length) {
      setSelectedBatchId("");
      return;
    }
    setSelectedBatchId((cur) => {
      if (cur && initialCourse.batches.some((b) => b.id === cur)) return cur;
      return initialCourse.batches[0]!.id;
    });
  }, [initialCourse]);

  useEffect(() => {
    if (!token) {
      setQuote(null);
      setCouponMeta({ loaded: false, empty: true });
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        const [pricing, coupons] = await Promise.all([
          fetchPurchasePricing(slug, token),
          fetchCouponCatalog(slug, token),
        ]);
        if (cancelled) return;
        setQuote(pricing);
        setQuoteError(null);
        setCouponMeta({ loaded: true, empty: coupons.items.length === 0 });

        setSelectedBatchId((cur) => {
          if (cur) return cur;
          if (
            pricing.defaultBatchId &&
            initialCourse.batches.some((b) => b.id === pricing.defaultBatchId)
          ) {
            return pricing.defaultBatchId;
          }
          return initialCourse.batches[0]?.id ?? "";
        });
      } catch {
        if (cancelled) return;
        setQuoteError("Could not load personalized pricing.");
        setCouponMeta({ loaded: false, empty: true });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug, token, initialCourse]);

  const listedPricePaise = useMemo(() => {
    if (quote) return quote.strikePricePaise ?? quote.listPricePaise;
    return initialCourse.compareAtPricePaise ?? initialCourse.pricePaise;
  }, [quote, initialCourse.compareAtPricePaise, initialCourse.pricePaise]);

  const salePricePaise = quote?.salePricePaise ?? initialCourse.pricePaise;

  const catalogDiscountPaise = useMemo(() => Math.max(0, listedPricePaise - salePricePaise), [listedPricePaise, salePricePaise]);

  const couponDiscountPaise = validated?.couponDiscountPaise ?? 0;
  const basePayablePaise = quote?.basePayablePaise ?? initialCourse.pricePaise;
  const finalAmountPaise = validated?.finalAmountPaise ?? basePayablePaise;

  const onApplyCoupon = useCallback(async () => {
    const code = couponInput.trim();
    if (!code) return;
    if (!token) {
      message.info("Sign in to apply a coupon.");
      router.push(`/login?returnTo=${encodeURIComponent(pathname)}`);
      return;
    }
    setCouponBusy(true);
    setCouponError(null);
    try {
      const r = await validatePurchaseCoupon(slug, token, code);
      setValidated({
        code: r.code,
        label: r.label,
        couponDiscountPaise: r.couponDiscountPaise,
        finalAmountPaise: r.finalAmountPaise,
      });
      message.success("Coupon applied.");
    } catch (e) {
      setValidated(null);
      setCouponError(e instanceof ApiError ? e.message : "Coupon could not be applied.");
    } finally {
      setCouponBusy(false);
    }
  }, [couponInput, message, pathname, router, slug, token]);

  const loadCoupons = useCallback(async () => {
    if (!token) {
      router.push(`/login?returnTo=${encodeURIComponent(pathname)}`);
      return;
    }
    try {
      const data = await fetchCouponCatalog(slug, token);
      setCouponsUi({ open: true, items: data.items });
    } catch {
      message.error("Could not load coupons.");
    }
  }, [message, pathname, router, slug, token]);

  const proceed = useCallback(async () => {
    if (!token) {
      message.info("Sign in to proceed to checkout.");
      router.push(`/login?returnTo=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!selectedBatchId) {
      message.error("No active batch available for checkout. Contact support.");
      return;
    }
    setPayBusy(true);
    try {
      await loadRazorpayScript();
      const order = await createPurchaseOrder(slug, token, {
        batchId: selectedBatchId,
        couponCode: validated?.code ?? undefined,
      });
      if (!order.keyId) {
        message.error("Payment gateway not configured.");
        setPayBusy(false);
        return;
      }
      setPayBusy(false);
      openRazorpayCheckout({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: site.name,
        description: order.courseTitle,
        prefill: user?.phoneNational10 ? { contact: user.phoneNational10 } : undefined,
        theme: { color: "#f97316" },
        modal: {
          ondismiss: () => {},
        },
        handler: async (resp) => {
          try {
            await verifyPurchasePayment(slug, token, resp);
            setSuccessOpen(true);
          } catch (e) {
            message.error(e instanceof ApiError ? e.message : "Payment verification failed.");
          }
        },
      });
    } catch (e) {
      message.error(e instanceof ApiError ? e.message : "Could not start checkout.");
      setPayBusy(false);
    }
  }, [
    validated?.code,
    message,
    pathname,
    router,
    selectedBatchId,
    slug,
    token,
    user?.phoneNational10,
  ]);

  if (!pf?.enabled) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground">Course unavailable</h1>
        <p className="mt-3 text-muted">Online purchase is not open for this program yet.</p>
        <Link href="/" className="mt-8 inline-flex font-semibold text-primary underline-offset-2 hover:underline">
          Back home
        </Link>
      </div>
    );
  }

  const batches = initialCourse.batches ?? [];
  const canPay =
    batches.length === 0
      ? false
      : Boolean(selectedBatchId) && batches.some((b) => b.id === selectedBatchId);

  const couponCatalogEmpty = Boolean(token && couponMeta.loaded && couponMeta.empty);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:pb-24 lg:pt-10">
      <div className="mb-10 flex justify-between gap-6">
        <button
          type="button"
          className="text-sm font-semibold text-muted underline-offset-2 hover:text-foreground hover:underline"
          onClick={() => router.back()}
        >
          ← Back
        </button>
        {!token ? (
          <Link
            href={`/login?returnTo=${encodeURIComponent(pathname)}`}
            className="text-sm font-semibold text-primary underline-offset-2 hover:underline"
          >
            Sign in to buy
          </Link>
        ) : null}
      </div>

      {quoteError ? (
        <p className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-200">
          {quoteError} Catalog prices are shown; refresh after signing in.
        </p>
      ) : null}

      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
        <div className="min-w-0 flex-1">
          <CourseDetails course={initialCourse} />
        </div>
        <div className="w-full shrink-0 lg:w-[360px] xl:w-[380px]">
          <PricingCard
            listedPricePaise={listedPricePaise}
            catalogDiscountPaise={catalogDiscountPaise}
            couponDiscountPaise={couponDiscountPaise}
            finalAmountPaise={finalAmountPaise}
            limitedOffers={pf.limitedOffers}
            batches={batches}
            selectedBatchId={selectedBatchId}
            onBatchChange={setSelectedBatchId}
            couponInput={couponInput}
            onCouponInput={(v) => {
              setCouponInput(v);
              setCouponError(null);
              setValidated(null);
            }}
            couponError={couponError}
            couponBusy={couponBusy}
            validatedCouponLabel={validated?.label ?? null}
            onApplyCoupon={onApplyCoupon}
            onOpenCoupons={loadCoupons}
            couponCatalogEmpty={couponCatalogEmpty}
            paymentBusy={payBusy}
            canPay={canPay}
            onProceed={proceed}
          />
        </div>
      </div>

      <Modal
        title="Available coupons"
        open={couponsUi.open}
        onCancel={() => setCouponsUi((s) => ({ ...s, open: false }))}
        footer={null}
        destroyOnHidden
      >
        {couponsUi.items.length === 0 ? (
          <p className="text-sm text-muted">No coupons are active for this program.</p>
        ) : (
          <ul className="space-y-3">
            {couponsUi.items.map((c) => (
              <li key={c.code} className="rounded-xl border border-border-soft bg-surface-subtle/50 p-3">
                <p className="font-mono text-sm font-bold text-foreground">{c.code}</p>
                <p className="mt-1 text-sm text-muted">{c.label}</p>
              </li>
            ))}
          </ul>
        )}
      </Modal>

      <EnrollmentSuccessModal open={successOpen} onClose={() => setSuccessOpen(false)} />
    </div>
  );
}
