"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { cn } from "@/lib/cn";

const LENGTH = 6;

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  onComplete?: (value: string) => void;
  className?: string;
  "aria-label"?: string;
};

export function OtpInput({
  value,
  onChange,
  disabled,
  onComplete,
  className,
  "aria-label": ariaLabel = "One-time password",
}: OtpInputProps) {
  const baseId = useId();
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const focusAt = useCallback((index: number) => {
    const el = inputsRef.current[Math.max(0, Math.min(index, LENGTH - 1))];
    el?.focus();
    el?.select();
  }, []);

  useEffect(() => {
    if (value.length === LENGTH) {
      onComplete?.(value);
    }
  }, [value, onComplete]);

  const applyDigits = useCallback(
    (digits: string) => {
      const cleaned = digits.replace(/\D/g, "").slice(0, LENGTH);
      onChange(cleaned);
      return cleaned.length;
    },
    [onChange],
  );

  const handleChange = (index: number, raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (digits.length > 1) {
      const len = applyDigits(digits);
      requestAnimationFrame(() => focusAt(Math.min(len, LENGTH - 1)));
      return;
    }
    const ch = digits[0] ?? "";
    const prefix = value.slice(0, index);
    const suffix = value.slice(index + 1);
    const next = (prefix + ch + suffix).slice(0, LENGTH);
    onChange(next);
    if (ch && index < LENGTH - 1) {
      requestAnimationFrame(() => focusAt(index + 1));
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!value[index] && index > 0) {
        e.preventDefault();
        onChange(value.slice(0, index - 1) + value.slice(index));
        focusAt(index - 1);
      } else if (value[index]) {
        onChange(value.slice(0, index) + value.slice(index + 1));
      }
    }
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      focusAt(index - 1);
    }
    if (e.key === "ArrowRight" && index < LENGTH - 1) {
      e.preventDefault();
      focusAt(index + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const len = applyDigits(e.clipboardData.getData("text"));
    requestAnimationFrame(() => focusAt(Math.min(Math.max(len - 1, 0), LENGTH - 1)));
  };

  const cells = Array.from({ length: LENGTH }, (_, i) => value[i] ?? "");

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn("flex flex-wrap justify-center gap-2 sm:gap-3", className)}
    >
      {cells.map((d, i) => (
        <input
          key={`${baseId}-${i}`}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          id={`${baseId}-otp-${i}`}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={d}
          disabled={disabled}
          className={cn(
            "h-12 w-11 rounded-lg border-2 border-border-soft bg-card text-center text-lg font-semibold text-foreground shadow-sm outline-none transition",
            "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/40",
            "disabled:opacity-50",
          )}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </div>
  );
}
