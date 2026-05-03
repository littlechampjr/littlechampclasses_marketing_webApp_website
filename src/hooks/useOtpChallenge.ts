"use client";

import { useCallback, useRef } from "react";
import { sendBookDemoOtp, verifyBookDemoOtp } from "@/lib/api/bookDemo";
import { useOtpResendCooldown } from "./useOtpResendCooldown";

export type BookDemoOtpSendParams = {
  phone: string;
  courseSlug: string;
  batchId: string;
  grade: number;
};

/**
 * Book Demo: OTP send/verify plus resend cooldown. Pair with {@link OtpInput} for login/signup flows later.
 */
export function useOtpChallenge() {
  const { secondsLeft, startCooldown, reset, canResend } = useOtpResendCooldown();
  const lastEnrollmentIdRef = useRef<string | null>(null);

  const sendBookDemoOtpRequest = useCallback(
    async (params: BookDemoOtpSendParams) => {
      const res = await sendBookDemoOtp(params);
      lastEnrollmentIdRef.current = res.enrollmentId;
      startCooldown(res.resendAfterSeconds);
      return res;
    },
    [startCooldown],
  );

  const verifyBookDemoOtpRequest = useCallback(async (phone: string, code: string) => {
    const enrollmentId = lastEnrollmentIdRef.current ?? undefined;
    return verifyBookDemoOtp({
      phone,
      code,
      ...(enrollmentId ? { enrollmentId } : {}),
    });
  }, []);

  const resetCooldown = useCallback(() => {
    lastEnrollmentIdRef.current = null;
    reset();
  }, [reset]);

  return {
    secondsLeft,
    canResendOtp: canResend,
    sendBookDemoOtpRequest,
    verifyBookDemoOtpRequest,
    resetCooldown,
  };
}
