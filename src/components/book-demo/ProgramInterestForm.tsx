"use client";

import { App as AntApp, Input, Space } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { OtpInput } from "@/components/common/OtpInput";
import { confirmInterestWaitlist, sendInterestWaitlistOtp } from "@/lib/api/interest";
import { ApiError } from "@/lib/api/types";
import type { ApiCourse } from "@/lib/api/types";
import { parseIndianMobileNational10 } from "@/lib/phone";
import { cn } from "@/lib/cn";
import { useOtpResendCooldown } from "@/hooks/useOtpResendCooldown";

export type ProgramInterestFormProps = {
  course: ApiCourse;
  onClose: () => void;
  onBackToPrograms?: () => void;
};

function formatMmSs(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function ProgramInterestForm({ course, onClose, onBackToPrograms }: ProgramInterestFormProps) {
  const { message } = AntApp.useApp();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNational, setPhoneNational] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const { secondsLeft, startCooldown, reset: resetCooldown } = useOtpResendCooldown();

  const programTitle = course.marketingTitle?.trim() || course.title || "This program";
  const thumb = course.thumbnailUrl?.trim() || "/courses/thumb-stories.svg";

  useEffect(() => {
    setStep("phone");
    setPhoneNational("");
    setOtp("");
    resetCooldown();
  }, [course.id, resetCooldown]);

  const sendOtp = useCallback(async () => {
    const national = parseIndianMobileNational10(phoneNational);
    if (!national) {
      message.error("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    setBusy(true);
    try {
      const res = await sendInterestWaitlistOtp({
        phone: national,
        courseSlug: course.slug,
      });
      message.success("OTP sent to your mobile.");
      startCooldown(res.resendAfterSeconds);
      setStep("otp");
      setOtp("");
    } catch (e) {
      message.error(e instanceof ApiError ? e.message : "Could not send OTP.");
    } finally {
      setBusy(false);
    }
  }, [course.slug, message, phoneNational, startCooldown]);

  const handleResendOtp = useCallback(async () => {
    if (secondsLeft > 0) return;
    const national = parseIndianMobileNational10(phoneNational);
    if (!national) {
      message.error("Enter a valid mobile number.");
      return;
    }
    setBusy(true);
    try {
      const res = await sendInterestWaitlistOtp({
        phone: national,
        courseSlug: course.slug,
      });
      message.success("OTP resent.");
      startCooldown(res.resendAfterSeconds);
    } catch (e) {
      message.error(e instanceof ApiError ? e.message : "Could not resend OTP.");
    } finally {
      setBusy(false);
    }
  }, [course.slug, message, phoneNational, secondsLeft, startCooldown]);

  const handleConfirm = async () => {
    if (otp.trim().length !== 6) {
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
      const res = await confirmInterestWaitlist({
        phone: national,
        courseSlug: course.slug,
        code: otp.trim(),
      });
      message.success(res.message);
      onClose();
    } catch (e) {
      message.error(e instanceof ApiError ? e.message : "Could not save. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-[380px] flex-col bg-card text-foreground md:flex-row">
      <div className="relative min-h-[200px] flex-1 md:min-h-[440px] md:max-w-[46%]">
        <Image
          src={thumb}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 46vw"
          unoptimized={thumb.endsWith(".svg")}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/45 via-transparent to-transparent" />
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

      <div className="flex flex-1 flex-col justify-center gap-5 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            {step === "phone" ? (
              <>
                <h2 className="font-display text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                  We’ll let you know when {programTitle} opens
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  You’re a little early—demo booking for this program isn’t live yet. Enter your number and
                  we’ll send a one-time code to confirm it, then we’ll add you to the waitlist. No spam.
                </p>
              </>
            ) : (
              <>
                <h2 className="font-display text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                  Enter OTP
                </h2>
                <p className="mt-2 text-sm text-muted">
                  We sent a 6-digit code to +91 {phoneNational}
                </p>
              </>
            )}
          </div>
          {/* <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="rounded-full p-2 text-muted transition hover:bg-surface-subtle hover:text-foreground"
            aria-label="Close"
          >
            <span aria-hidden className="text-xl leading-none">
              ×
            </span>
          </button> */}
        </div>

        <div className="h-px w-full bg-border-soft" />

        {step === "phone" && (
          <>
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
              <p className="mt-2 text-xs text-muted">
                We use this to send your OTP and later reach you on WhatsApp. We won’t share it for marketing.
              </p>
            </div>

            <button
              type="button"
              disabled={busy}
              onClick={() => void sendOtp()}
              className={cn(
                "flex min-h-12 w-full items-center justify-center rounded-2xl text-base font-bold shadow-lg transition",
                "bg-primary text-primary-foreground shadow-primary/25 hover:opacity-95 disabled:opacity-50",
              )}
            >
              {busy ? "Sending…" : "Send OTP"}
            </button>
          </>
        )}

        {step === "otp" && (
          <>
            <OtpInput value={otp} onChange={setOtp} disabled={busy} />

            <p className="text-center text-sm text-muted">
              Didn&apos;t get the code?{" "}
              {secondsLeft > 0 ? (
                <span className="text-primary">Resend in {formatMmSs(secondsLeft)}</span>
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

            <p className="text-center text-xs text-muted">
              By joining the waitlist, you agree to our{" "}
              <Link href="/policies/terms" className="underline" target="_blank">
                terms
              </Link>
              .
            </p>

            <button
              type="button"
              disabled={busy}
              onClick={() => void handleConfirm()}
              className="flex min-h-12 w-full items-center justify-center rounded-2xl bg-primary text-base font-bold text-primary-foreground shadow-lg shadow-primary/25 transition hover:opacity-95 disabled:opacity-50"
            >
              {busy ? "Saving…" : "Verify & join waitlist"}
            </button>

            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setStep("phone");
                setOtp("");
                resetCooldown();
              }}
              className="w-full text-center text-sm font-medium text-muted underline-offset-2 hover:underline"
            >
              Change number
            </button>
          </>
        )}
      </div>
    </div>
  );
}
