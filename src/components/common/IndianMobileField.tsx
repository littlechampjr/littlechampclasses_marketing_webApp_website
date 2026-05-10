"use client";

import type { ReactNode } from "react";

export type IndianMobileFieldProps = {
  id: string;
  value: string;
  onChange: (national10Digits: string) => void;
  disabled?: boolean;
  footer?: ReactNode;
  /** Login uses centered helper text; forms often use start alignment. */
  footerAlign?: "center" | "start";
};

export function IndianMobileField({
  id,
  value,
  onChange,
  disabled,
  footer,
  footerAlign = "start",
}: IndianMobileFieldProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted" htmlFor={id}>
        Mobile number
      </label>
      <div className="mt-1.5 flex overflow-hidden rounded-xl border border-border-soft bg-background focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
        <div className="flex shrink-0 items-center border-r border-border-soft bg-foreground/5 px-3 text-sm font-semibold text-foreground">
          +91
          <span className="ml-0.5 text-muted" aria-hidden>
            ▾
          </span>
        </div>
        <input
          id={id}
          name="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder="10-digit number"
          maxLength={10}
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 10))}
          disabled={disabled}
          className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-base text-foreground outline-none disabled:opacity-60"
        />
      </div>
      {footer ? (
        <p
          className={
            footerAlign === "center"
              ? "mt-2 text-center text-xs text-muted"
              : "mt-2 text-xs text-muted"
          }
        >
          {footer}
        </p>
      ) : null}
    </div>
  );
}
