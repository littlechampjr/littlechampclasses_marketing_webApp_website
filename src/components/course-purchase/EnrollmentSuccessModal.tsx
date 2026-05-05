"use client";

import { Modal } from "antd";
import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function EnrollmentSuccessModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => {
      void import("canvas-confetti")
        .then(({ default: confetti }) =>
          confetti({
            particleCount: 70,
            spread: 62,
            startVelocity: 28,
            scalar: 0.95,
            origin: { y: 0.32 },
          }),
        )
        .catch(() => {});
    });
    return () => cancelAnimationFrame(raf);
  }, [open]);

  return (
    <Modal open={open} onCancel={onClose} footer={null} centered destroyOnHidden>
      <div className="px-1 py-10 text-center sm:py-14">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 text-3xl">
          🎓
        </div>
        <h2 className="font-display text-2xl font-extrabold text-foreground sm:text-3xl">
          Congratulations!
        </h2>
        <p className="mx-auto mt-4 max-w-sm text-base leading-relaxed text-muted">
          You have enrolled. Our RM will contact you soon.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-9 inline-flex min-h-[48px] min-w-[140px] items-center justify-center rounded-xl bg-primary px-6 font-bold text-primary-foreground shadow-md shadow-primary/25 transition hover:brightness-105"
        >
          Great, thanks!
        </button>
      </div>
    </Modal>
  );
}
