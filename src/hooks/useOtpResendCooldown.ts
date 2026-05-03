"use client";

import { useCallback, useEffect, useState } from "react";

export function useOtpResendCooldown() {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = window.setTimeout(() => {
      setSecondsLeft((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => window.clearTimeout(t);
  }, [secondsLeft]);

  const startCooldown = useCallback((sec: number) => {
    setSecondsLeft(Math.max(0, sec));
  }, []);

  const reset = useCallback(() => setSecondsLeft(0), []);

  return { secondsLeft, startCooldown, reset, canResend: secondsLeft === 0 };
}
