"use client";

import { Modal } from "antd";
import { useEffect } from "react";

export type PaymentSuccessMode = "course" | "demo";

type Props = {
  open: boolean;
  onClose: () => void;
  mode: PaymentSuccessMode;
  /** Optional — shown as a subtle line below the headline (e.g. course title). */
  courseTitle?: string;
  /** Primary CTA. Defaults to closing the modal. */
  primaryLabel?: string;
  onPrimary?: () => void;
  /** Optional secondary CTA (e.g. "Stay here"). Hidden if not provided. */
  secondaryLabel?: string;
  onSecondary?: () => void;
};

const COPY: Record<PaymentSuccessMode, { emoji: string; title: string; body: string }> = {
  course: {
    emoji: "🎓",
    title: "Congratulations — you're enrolled!",
    body: "We're so glad to have you on this journey. Our learning manager will reach out shortly to set you up.",
  },
  demo: {
    emoji: "🎉",
    title: "Your demo seat is booked!",
    body: "Looking forward to meeting you in class. Our learning manager will share class details shortly.",
  },
};

/**
 * Celebration modal shown after a successful payment (course purchase or
 * book-demo). Multi-burst confetti, gradient background, friendly copy.
 *
 * Future hook: pass a WhatsApp link / join link via an extra prop and render
 * it as a third CTA — copy already designed to read well with that addition.
 */
export function PaymentSuccessModal({
  open,
  onClose,
  mode,
  courseTitle,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
}: Props) {
  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    void import("canvas-confetti").then(({ default: confetti }) => {
      if (cancelled) return;
      // Burst 1 — wide cluster from low-center
      confetti({
        particleCount: 90,
        spread: 90,
        startVelocity: 38,
        scalar: 1,
        origin: { x: 0.5, y: 0.4 },
      });
      // Burst 2 — angled from the left (small delay)
      setTimeout(() => {
        if (cancelled) return;
        confetti({
          particleCount: 55,
          angle: 60,
          spread: 60,
          startVelocity: 45,
          scalar: 0.9,
          origin: { x: 0.1, y: 0.5 },
        });
      }, 220);
      // Burst 3 — angled from the right
      setTimeout(() => {
        if (cancelled) return;
        confetti({
          particleCount: 55,
          angle: 120,
          spread: 60,
          startVelocity: 45,
          scalar: 0.9,
          origin: { x: 0.9, y: 0.5 },
        });
      }, 420);
      // Burst 4 — gentle rain from top
      setTimeout(() => {
        if (cancelled) return;
        confetti({
          particleCount: 40,
          spread: 120,
          startVelocity: 22,
          scalar: 0.8,
          gravity: 0.7,
          origin: { x: 0.5, y: 0 },
        });
      }, 700);
    });

    return () => {
      cancelled = true;
    };
  }, [open]);

  const copy = COPY[mode];
  const handlePrimary = () => {
    if (onPrimary) onPrimary();
    else onClose();
  };
  const handleSecondary = () => {
    if (onSecondary) onSecondary();
    else onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      destroyOnHidden
      width={460}
      // Drop default body padding so our gradient sits flush to the edges.
      styles={{ body: { padding: 0 } }}
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 px-6 py-9 text-center sm:px-8 sm:py-11 dark:from-amber-950/50 dark:via-orange-950/40 dark:to-rose-950/40">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 0%, rgba(249,115,22,0.20) 0, transparent 50%), radial-gradient(circle at 90% 100%, rgba(244,63,94,0.18) 0, transparent 45%)",
          }}
          aria-hidden
        />

        <div className="relative">
          {/* Badge / emoji */}
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white text-4xl shadow-lg shadow-primary/20 ring-4 ring-primary/15 dark:bg-neutral-900">
            <span className="inline-block animate-bounce" style={{ animationDuration: "1.4s" }}>
              {copy.emoji}
            </span>
          </div>

          <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {copy.title}
          </h2>

          {courseTitle ? (
            <p className="mx-auto mt-2 max-w-sm text-sm font-semibold text-primary">
              {courseTitle}
            </p>
          ) : null}

          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted sm:text-base">
            {copy.body}
          </p>

          <div className="mt-8 flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handlePrimary}
              className="inline-flex min-h-[48px] min-w-[160px] items-center justify-center rounded-xl bg-primary px-6 font-bold text-primary-foreground shadow-md shadow-primary/25 transition hover:brightness-105"
            >
              {primaryLabel ?? "Continue"}
            </button>
            {secondaryLabel ? (
              <button
                type="button"
                onClick={handleSecondary}
                className="inline-flex min-h-[48px] min-w-[140px] items-center justify-center rounded-xl border border-border-soft bg-card px-6 font-semibold text-foreground transition hover:bg-surface-subtle"
              >
                {secondaryLabel}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </Modal>
  );
}
