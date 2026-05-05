"use client";

import { Select } from "antd";
import type { ApiCourseBatch, ApiPurchaseLimitedOffer } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { formatInrFromPaise } from "@/lib/formatInr";

export type PricingCardProps = {
  listedPricePaise: number;
  /** Catalog discount excluding coupon — price row minus payable before coupon adjustments from strike. */
  catalogDiscountPaise: number;
  couponDiscountPaise: number;
  finalAmountPaise: number;
  limitedOffers: ApiPurchaseLimitedOffer[];
  batches: ApiCourseBatch[];
  selectedBatchId: string;
  onBatchChange: (batchId: string) => void;
  couponInput: string;
  onCouponInput: (v: string) => void;
  couponError: string | null;
  couponBusy: boolean;
  validatedCouponLabel: string | null;
  onApplyCoupon: () => void;
  onOpenCoupons: () => void;
  couponCatalogEmpty: boolean;
  paymentBusy: boolean;
  canPay: boolean;
  onProceed: () => void;
};

export function PricingCard(props: PricingCardProps) {
  const {
    listedPricePaise,
    catalogDiscountPaise,
    couponDiscountPaise,
    finalAmountPaise,
    limitedOffers,
    batches,
    selectedBatchId,
    onBatchChange,
    couponInput,
    onCouponInput,
    couponError,
    couponBusy,
    validatedCouponLabel,
    onApplyCoupon,
    onOpenCoupons,
    couponCatalogEmpty,
    paymentBusy,
    canPay,
    onProceed,
  } = props;

  const totalDiscount = catalogDiscountPaise + couponDiscountPaise;

  return (
    <aside
      className={cn(
        "rounded-3xl border border-border-soft bg-card p-6 shadow-[0_20px_50px_-32px_rgba(0,0,0,0.15)]",
        "lg:sticky lg:top-24",
      )}
    >
      <h2 className="font-display text-lg font-extrabold text-foreground">Order summary</h2>

      {batches.length > 1 ? (
        <div className="mt-4">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="batch-pick">
            Batch
          </label>
          <Select
            id="batch-pick"
            className="mt-1.5 w-full"
            size="large"
            value={selectedBatchId || undefined}
            options={batches.map((b) => ({
              value: b.id,
              label: `${b.code} · ${b.dateRangeLabel}`,
            }))}
            onChange={(v) => onBatchChange(String(v))}
            placeholder="Select batch"
          />
        </div>
      ) : null}

      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Price</dt>
          <dd className="font-semibold text-foreground">{formatInrFromPaise(listedPricePaise)}</dd>
        </div>
        {totalDiscount > 0 ? (
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Discount</dt>
            <dd className="font-semibold text-emerald-600 dark:text-emerald-400">
              − {formatInrFromPaise(totalDiscount)}
            </dd>
          </div>
        ) : null}
      </dl>

      {limitedOffers.length > 0 ? (
        <div className="mt-5 rounded-2xl border border-amber-200/60 bg-amber-50/90 p-4 dark:border-amber-900/50 dark:bg-amber-950/40">
          <p className="inline-block rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            Limited time offer
          </p>
          <ul className="mt-3 space-y-2">
            {limitedOffers.map((o) => (
              <li key={o.label} className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                <span className="font-medium text-foreground">{o.label}</span>
                <span>
                  {o.crossedPricePaise != null ? (
                    <span className="text-muted line-through">
                      {formatInrFromPaise(o.crossedPricePaise)}
                    </span>
                  ) : null}{" "}
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{o.giftLabel}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-6 flex items-baseline justify-between border-t border-border-soft pt-5">
        <span className="text-sm font-semibold text-foreground">Total amount</span>
        <span className="font-display text-2xl font-extrabold text-foreground">
          {formatInrFromPaise(finalAmountPaise)}
        </span>
      </div>

      <div className="mt-5 rounded-2xl border border-dashed border-border-soft bg-surface-subtle/50 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">Apply code / coupon</p>
            <input
              type="text"
              value={couponInput}
              onChange={(e) => onCouponInput(e.target.value)}
              placeholder="Enter code"
              className="mt-2 w-full rounded-xl border border-border-soft bg-card px-3 py-2.5 text-sm text-foreground outline-none ring-primary/30 transition focus:ring-2"
              autoComplete="off"
              disabled={couponBusy}
              aria-label="Coupon code"
            />
            {validatedCouponLabel ? (
              <p className="mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                {validatedCouponLabel}
              </p>
            ) : couponCatalogEmpty ? (
              <p className="mt-1 text-xs text-muted">No coupons available right now.</p>
            ) : null}
            {couponError ? <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{couponError}</p> : null}
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:items-end">
            <button
              type="button"
              onClick={onApplyCoupon}
              disabled={couponBusy || !couponInput.trim()}
              className={cn(
                "h-10 min-w-[88px] rounded-xl px-4 text-sm font-bold transition",
                couponInput.trim()
                  ? "bg-primary text-primary-foreground hover:brightness-105"
                  : "cursor-not-allowed bg-surface-subtle text-muted",
              )}
            >
              {couponBusy ? "…" : "Apply"}
            </button>
            <button
              type="button"
              onClick={onOpenCoupons}
              disabled={couponCatalogEmpty}
              className="text-xs font-semibold text-primary underline-offset-2 hover:underline disabled:pointer-events-none disabled:opacity-40"
            >
              View all coupons ›
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onProceed}
        disabled={!canPay || paymentBusy}
        className={cn(
          "mt-6 flex min-h-[52px] w-full items-center justify-center rounded-2xl font-display text-lg font-extrabold transition",
          "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-900/25",
          "hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-55",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400",
        )}
      >
        {paymentBusy ? "Processing…" : "Proceed to buy"}
      </button>

      <p className="mt-4 text-[11px] leading-relaxed text-muted">
        Secured checkout via Razorpay. You&apos;ll receive confirmations on your registered mobile after
        payment.
      </p>
    </aside>
  );
}
