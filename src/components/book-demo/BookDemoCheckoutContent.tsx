"use client";

import { App as AntApp, Input, Space } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { OtpInput } from "@/components/common/OtpInput";
import { createBookDemoOrder, verifyBookDemoPayment } from "@/lib/api/bookDemo";
import { ApiError } from "@/lib/api/types";
import type { ApiCourse, ApiCourseBatch } from "@/lib/api/types";
import { buildBookDemoHeading } from "@/lib/bookDemoHeading";
import { parseIndianMobileNational10 } from "@/lib/phone";
import {
  loadRazorpayScript,
  openRazorpayCheckout,
} from "@/lib/razorpay/loadRazorpayScript";
import { site } from "@/lib/site-config";
import { cn } from "@/lib/cn";
import { useOtpChallenge } from "@/hooks/useOtpChallenge";

const GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export type BookDemoCheckoutContentProps = {
  course: ApiCourse;
  onClose: () => void;
  onBackToPrograms?: () => void;
};

function formatMmSs(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function BookDemoCheckoutContent({ course, onClose, onBackToPrograms }: BookDemoCheckoutContentProps) {
  const { message } = AntApp.useApp();
  const [step, setStep] = useState<"form" | "otp">("form");
  const [grade, setGrade] = useState(1);
  const [batchId, setBatchId] = useState("");
  const [phoneNational, setPhoneNational] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const {
    secondsLeft,
    sendBookDemoOtpRequest,
    verifyBookDemoOtpRequest,
    resetCooldown,
  } = useOtpChallenge();

  useEffect(() => {
    setStep("form");
    setGrade(1);
    setBatchId(course.batches[0]?.id ?? "");
    setPhoneNational("");
    setOtp("");
    resetCooldown();
  }, [course, resetCooldown]);

  const batch: ApiCourseBatch | undefined = useMemo(
    () => course.batches.find((b) => b.id === batchId),
    [course, batchId],
  );

  const programTitle = course.marketingTitle?.trim() || course.title || "Program";

  const heading = useMemo(() => {
    if (!batch) return "";
    return buildBookDemoHeading(programTitle, grade, batch.code, batch.startsAt, batch.endsAt);
  }, [batch, grade, programTitle]);

  const courseDurationLine = batch
    ? `Course Duration: ${new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(batch.startsAt))} – ${new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(batch.endsAt))}`
    : "";

  const displayPrice = course.priceRupees ?? 0;
  const strikePrice = course.compareAtPriceRupees;

  const handleClose = useCallback(() => {
    if (!busy) {
      onClose();
    }
  }, [busy, onClose]);

  const handleSendOtp = async () => {
    if (!batch) {
      message.error("Select a batch.");
      return;
    }
    const national = parseIndianMobileNational10(phoneNational);
    if (!national) {
      message.error("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    setBusy(true);
    try {
      await sendBookDemoOtpRequest({
        phone: national,
        courseSlug: course.slug,
        batchId: batch.id,
        grade,
      });
      message.success("OTP sent to your mobile.");
      setStep("otp");
      setOtp("");
    } catch (e) {
      message.error(e instanceof ApiError ? e.message : "Could not send OTP.");
    } finally {
      setBusy(false);
    }
  };

  const handleResendOtp = async () => {
    if (!batch || secondsLeft > 0) return;
    const national = parseIndianMobileNational10(phoneNational);
    if (!national) {
      message.error("Enter a valid mobile number.");
      return;
    }
    setBusy(true);
    try {
      await sendBookDemoOtpRequest({
        phone: national,
        courseSlug: course.slug,
        batchId: batch.id,
        grade,
      });
      message.success("OTP resent.");
    } catch (e) {
      message.error(e instanceof ApiError ? e.message : "Could not resend OTP.");
    } finally {
      setBusy(false);
    }
  };

  const handleBookSeat = async () => {
    if (otp.length !== 6) {
      message.warning("Enter the 6-digit OTP.");
      return;
    }
    const national = parseIndianMobileNational10(phoneNational);
    if (!national) {
      message.error("Invalid phone number.");
      return;
    }
    setBusy(true);
    try {
      const verified = await verifyBookDemoOtpRequest(national, otp);
      await loadRazorpayScript();
      const order = await createBookDemoOrder(verified.token);
      if (!order.keyId) {
        message.error("Payment gateway is not configured.");
        return;
      }
      setBusy(false);
      openRazorpayCheckout({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: site.name,
        description: heading || "Book Demo",
        prefill: { contact: national },
        theme: { color: "#f97316" },
        handler: async (response) => {
          try {
            await verifyBookDemoPayment(response);
            message.success("Payment successful! We will contact you on WhatsApp.");
            onClose();
          } catch (e) {
            message.error(e instanceof ApiError ? e.message : "Payment verification failed.");
          }
        },
      });
    } catch (e) {
      message.error(e instanceof ApiError ? e.message : "Could not start payment.");
      setBusy(false);
    }
  };

  const thumb = course.thumbnailUrl?.trim() || "/courses/thumb-stories.svg";

  return (
    <div className="flex min-h-[420px] flex-col bg-card text-foreground md:flex-row">
      <div className="relative min-h-[200px] flex-1 md:min-h-[480px] md:max-w-[46%]">
        <Image
          src={thumb}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 46vw"
          unoptimized={thumb.endsWith(".svg")}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-transparent" />
        {onBackToPrograms ? (
          <button
            type="button"
            onClick={() => {
              if (!busy) onBackToPrograms();
            }}
            className="absolute left-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-lg text-white transition hover:bg-black/60"
            aria-label="Back to programs"
          >
            ‹
          </button>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-6 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            {step === "form" ? (
              <>
                <h2 className="font-display text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                  {heading || programTitle}
                </h2>
                {batch ? <p className="mt-1 text-sm text-muted">{courseDurationLine}</p> : null}
              </>
            ) : (
              <>
                <h2 className="font-display text-xl font-extrabold text-foreground sm:text-2xl">OTP Verification</h2>
                <p className="mt-1 text-sm text-muted">Enter the code sent to +91 {phoneNational}</p>
              </>
            )}
          </div>
          {/* <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-2 text-muted transition hover:bg-surface-subtle hover:text-foreground"
            aria-label="Close"
          >
            <span aria-hidden className="text-xl leading-none">
              ×
            </span>
          </button> */}
        </div>

        {step === "form" && (
          <>
            <div className="h-px w-full bg-border-soft" />

            <div>
              <p className="text-sm font-semibold text-foreground">Choose class to enroll</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {GRADES.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGrade(g)}
                    className={cn(
                      "min-h-10 min-w-[2.75rem] rounded-full border-2 px-3 text-sm font-semibold transition",
                      grade === g
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border-soft bg-card text-foreground hover:border-primary/50",
                    )}
                  >
                    {g === 1 ? "1st" : g === 2 ? "2nd" : g === 3 ? "3rd" : `${g}th`}
                  </button>
                ))}
              </div>
            </div>

            {course.batches.length > 1 && (
              <div>
                <p className="text-sm font-semibold text-foreground">Choose batch</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {course.batches.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBatchId(b.id)}
                      className={cn(
                        "min-h-10 min-w-10 rounded-full border-2 text-sm font-bold transition",
                        batchId === b.id
                          ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/25"
                          : "border-border-soft bg-card text-foreground hover:border-primary/50",
                      )}
                    >
                      {b.code}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-sm font-semibold text-foreground">Mobile number</p>
              <Space.Compact className="mt-2 w-full" block>
                <Input
                  readOnly
                  value="+91"
                  size="large"
                  className="!w-[4.5rem] !rounded-l-xl !text-center"
                  tabIndex={-1}
                  disabled={busy}
                />
                <Input
                  size="large"
                  className="!min-w-0 !flex-1 !rounded-r-xl"
                  placeholder="9876543210"
                  maxLength={10}
                  value={phoneNational}
                  onChange={(e) => setPhoneNational(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  disabled={busy}
                />
              </Space.Compact>
              <p className="mt-2 text-xs text-muted">Course material and updates will be shared via WhatsApp on this number.</p>
            </div>

            <div className="flex items-end justify-between gap-4 border-t border-border-soft pt-4">
              <span className="text-sm font-medium text-muted">Price</span>
              <div className="text-right">
                <span className="font-display text-2xl font-extrabold text-foreground">₹{displayPrice}</span>
                {strikePrice != null && strikePrice > displayPrice && (
                  <span className="ml-2 text-lg text-muted line-through">₹{strikePrice}</span>
                )}
              </div>
            </div>

            <button
              type="button"
              disabled={busy || !batch}
              onClick={() => void handleSendOtp()}
              className="flex min-h-12 w-full items-center justify-center rounded-2xl bg-primary text-base font-bold text-primary-foreground shadow-lg shadow-primary/25 transition hover:opacity-95 disabled:opacity-50"
            >
              Book Demo
            </button>
          </>
        )}

        {step === "otp" && (
          <>
            <div className="h-px w-full bg-border-soft" />
            <OtpInput value={otp} onChange={setOtp} disabled={busy} />

            <p className="text-center text-sm text-muted">
              Didn&apos;t get an OTP?{" "}
              {secondsLeft > 0 ? (
                <span className="text-primary">Resend OTP in: {formatMmSs(secondsLeft)}</span>
              ) : (
                <button
                  type="button"
                  className="font-semibold text-primary underline-offset-2 hover:underline"
                  onClick={() => void handleResendOtp()}
                  disabled={busy}
                >
                  Resend OTP
                </button>
              )}
            </p>

            <p className="flex items-start gap-2 rounded-xl bg-surface-subtle px-3 py-2 text-xs text-muted">
              <span aria-hidden>💬</span>
              <span>OTP is sent to +91 {phoneNational} via SMS.</span>
            </p>

            <p className="text-center text-xs text-muted">
              By continuing, you agree to our{" "}
              <Link href="/policies/terms" className="underline" target="_blank">
                terms &amp; conditions
              </Link>
              .
            </p>

            <button
              type="button"
              disabled={busy}
              onClick={() => void handleBookSeat()}
              className="flex min-h-12 w-full items-center justify-center rounded-2xl bg-primary text-base font-bold text-primary-foreground shadow-lg shadow-primary/25 transition hover:opacity-95 disabled:opacity-50"
            >
              Book Seat Now
            </button>

            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setStep("form");
                setOtp("");
              }}
              className="w-full text-center text-sm font-medium text-muted underline-offset-2 hover:underline"
            >
              Back to details
            </button>
          </>
        )}
      </div>
    </div>
  );
}
