"use client";

import { useCallback } from "react";
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

  const sendBookDemoOtpRequest = useCallback(
    async (params: BookDemoOtpSendParams) => {
      const res = await sendBookDemoOtp(params);
      startCooldown(res.resendAfterSeconds);
      return res;
    },
    [startCooldown],
  );

  const verifyBookDemoOtpRequest = useCallback(async (phone: string, code: string) => {
    return verifyBookDemoOtp({ phone, code });
  }, []);

  return {
    secondsLeft,
    canResendOtp: canResend,
    sendBookDemoOtpRequest,
    verifyBookDemoOtpRequest,
    resetCooldown: reset,
  };
}
