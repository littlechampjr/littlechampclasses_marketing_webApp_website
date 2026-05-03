"use client";

import { useCallback } from "react";
import { sendAuthOtp } from "@/lib/api/auth";
import { useOtpResendCooldown } from "./useOtpResendCooldown";

/**
 * Send login OTP and manage resend cooldown. Pair with {@link OtpInput} and {@link useAuth#signInWithOtp}.
 */
export function usePhoneAuth() {
  const { secondsLeft, startCooldown, reset, canResend } = useOtpResendCooldown();

  const sendLoginOtp = useCallback(
    async (phoneNational10: string) => {
      const res = await sendAuthOtp({ phone: phoneNational10 });
      startCooldown(res.resendAfterSeconds);
      return res;
    },
    [startCooldown],
  );

  return {
    sendLoginOtp,
    secondsLeft,
    canResendOtp: canResend,
    resetOtpCooldown: reset,
  };
}
