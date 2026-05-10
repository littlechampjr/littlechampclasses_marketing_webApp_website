"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { IndianMobileField } from "@/components/common/IndianMobileField";
import { OtpInput } from "@/components/common/OtpInput";
import { Button } from "@/components/ui/Button";
import { usePhoneAuth } from "@/hooks/usePhoneAuth";
import { useAuth } from "@/providers/AuthProvider";
import { ApiError } from "@/lib/api/types";
import { formatIndianMobileDisplay } from "@/lib/phoneDisplay";
import { parseIndianMobileNational10 } from "@/lib/phone";
import { site } from "@/lib/site-config";

function safeReturnTo(raw: string | null): string | null {
  if (!raw) return null;
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("://")) return null;
  return raw;
}

function formatResendTime(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

type Step = "phone" | "otp";

export function PhoneAuthFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = safeReturnTo(searchParams.get("returnTo"));
  const { signInWithOtp } = useAuth();
  const { sendLoginOtp, secondsLeft, canResendOtp, resetOtpCooldown } = usePhoneAuth();

  const [step, setStep] = useState<Step>("phone");
  const [national, setNational] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const verifyLock = useRef(false);

  const displayPhone = formatIndianMobileDisplay(national);

  const goBackToPhone = useCallback(() => {
    setStep("phone");
    setOtp("");
    setError(null);
    resetOtpCooldown();
  }, [resetOtpCooldown]);

  const handleSendOtp = async () => {
    setError(null);
    const n = parseIndianMobileNational10(national);
    if (!n) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    setSubmitting(true);
    try {
      setNational(n);
      await sendLoginOtp(n);
      setStep("otp");
      setOtp("");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not send OTP.");
    } finally {
      setSubmitting(false);
    }
  };

  const runVerify = useCallback(
    async (code: string) => {
      if (code.length !== 6 || verifyLock.current) return;
      const n = parseIndianMobileNational10(national);
      if (!n) {
        setError("Invalid phone number.");
        return;
      }
      verifyLock.current = true;
      setError(null);
      setSubmitting(true);
      try {
        const { needsOnboarding } = await signInWithOtp(n, code);
        const after = needsOnboarding ? "/onboarding" : returnTo ?? "/dashboard";
        router.push(after);
        router.refresh();
      } catch (e) {
        setError(e instanceof ApiError ? e.message : "Could not verify OTP.");
      } finally {
        setSubmitting(false);
        verifyLock.current = false;
      }
    },
    [national, router, signInWithOtp, returnTo],
  );

  const onOtpComplete = useCallback(
    (code: string) => {
      void runVerify(code);
    },
    [runVerify],
  );

  const handleResend = async () => {
    if (!canResendOtp) return;
    setError(null);
    const n = parseIndianMobileNational10(national);
    if (!n) {
      setError("Invalid phone number.");
      return;
    }
    setSubmitting(true);
    try {
      await sendLoginOtp(n);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not resend OTP.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="w-full max-w-[420px] h-full rounded-2xl border border-border-soft bg-card p-6 shadow-xl shadow-foreground/5 sm:p-8"
    >
      <div className="mb-4 flex items-center justify-center">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border-soft bg-surface-subtle shadow-sm">
          <Image
            src={`/playful-little-champ-logo.png?v=${site.playfulLittleChampLogoVersion}`}
            alt=""
            width={44}
            height={44}
            className="h-9 w-auto object-contain"
            priority
          />
        </span>
      </div>

      {step === "phone" ? (
        <>
          <h2 className="text-center font-display text-2xl font-bold tracking-tight text-foreground">
            Welcome to {site.name}
          </h2>
          <p className="mt-1 text-center text-xs text-muted">Online • IIT mentors</p>
          <p className="mt-5 text-center text-sm text-muted">
            Please enter your mobile number to <span className="font-medium text-foreground">Login</span> /{" "}
            <span className="font-medium text-foreground">Register</span>
          </p>
          <div className="mt-6">
            <IndianMobileField
              id="auth-phone"
              value={national}
              onChange={setNational}
              disabled={submitting}
              footerAlign="center"
              footer="Course material may be shared via WhatsApp on this number."
            />
          </div>
        </>
      ) : (
        <>
          <p className="text-center text-xs font-medium uppercase tracking-wide text-muted">Verification</p>
          <h2 className="mt-1 text-center text-lg font-bold text-foreground">Enter the code sent to your phone</h2>
          <p className="mt-2 text-center text-sm text-foreground">
            {displayPhone}{" "}
            <button
              type="button"
              onClick={goBackToPhone}
              className="ml-1 text-sm font-semibold text-primary underline decoration-primary/30 underline-offset-2"
            >
              Edit
            </button>
          </p>
          <div className="mt-6">
            <OtpInput
              value={otp}
              onChange={setOtp}
              disabled={submitting}
              onComplete={onOtpComplete}
            />
            <p className="mt-2 text-center text-xs text-muted">
              {secondsLeft > 0 ? `Resend OTP in: ${formatResendTime(secondsLeft)}` : "You can resend the code now."}
            </p>
            <p className="mt-1 text-center text-xs text-muted">SMS will be sent to {displayPhone}</p>
          </div>
        </>
      )}

      {error ? (
        <p
          className="mt-4 rounded-xl bg-red-500/10 px-3 py-2 text-center text-sm text-red-700 dark:text-red-300"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {step === "phone" ? (
        <Button
          type="button"
          variant="primary"
          className="mt-6 w-full min-h-12 text-base"
          disabled={submitting}
          onClick={() => void handleSendOtp()}
        >
          {submitting ? "Please wait…" : "Get OTP"}
        </Button>
      ) : (
        <div className="mt-6 space-y-3">
          <Button
            type="button"
            variant="primary"
            className="w-full min-h-12 text-base"
            disabled={submitting || otp.length !== 6}
            onClick={() => void runVerify(otp)}
          >
            {submitting ? "Verifying…" : "Continue"}
          </Button>
          <button
            type="button"
            disabled={!canResendOtp || submitting}
            onClick={() => void handleResend()}
            className="w-full text-center text-sm font-medium text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            Resend OTP
          </button>
        </div>
      )}

      <p className="mt-6 text-center text-xs text-muted">
        By continuing, you agree to our{" "}
        <Link href="/policies/terms" className="font-semibold text-primary hover:underline">
          terms
        </Link>{" "}
        &amp;{" "}
        <Link href="/policies/privacy" className="font-semibold text-primary hover:underline">
          privacy
        </Link>
        .
      </p>
    </div>
  );
}
