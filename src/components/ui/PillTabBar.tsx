"use client";

import { cn } from "@/lib/cn";

export type PillTabItem<K extends string = string> = {
  key: K;
  label: string;
  /** Optional short hint for narrow screens */
  shortLabel?: string;
};

export type PillTabBarProps<K extends string> = {
  items: PillTabItem<K>[];
  activeKey: K;
  onChange: (key: K) => void;
  /** `default` — neutral surface; `peach` — warm program header style */
  variant?: "default" | "peach";
  /** Accessible name for the tablist */
  ariaLabel: string;
  className?: string;
};

/**
 * Shared pill-style tabs: horizontal scroll on small viewports, comfortable tap targets.
 * Use for filtering (tests) and program sections (enrolled course).
 */
export function PillTabBar<K extends string>({
  items,
  activeKey,
  onChange,
  variant = "default",
  ariaLabel,
  className,
}: PillTabBarProps<K>) {
  return (
    <div
      className={cn(
        "rounded-[1.35rem] border p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] dark:shadow-none",
        variant === "peach"
          ? cn(
              "border-orange-200/70 bg-gradient-to-br from-orange-50/95 via-amber-50/40 to-card",
              "dark:border-orange-900/45 dark:from-orange-950/35 dark:via-card dark:to-card",
            )
          : cn(
              "border-border-soft bg-gradient-to-br from-surface-subtle/80 via-card to-card",
              "dark:from-card dark:via-card dark:to-surface-subtle/25",
            ),
        className,
      )}
    >
      <div
        role="tablist"
        aria-label={ariaLabel}
        className={cn(
          "flex gap-2.5 overflow-x-auto scroll-smooth px-0.5 py-0.5",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "sm:flex-wrap sm:overflow-visible sm:gap-3",
        )}
      >
        {items.map(({ key, label, shortLabel }) => {
          const isActive = activeKey === key;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(key)}
              title={shortLabel ? label : undefined}
              className={cn(
                "relative min-h-[3rem] shrink-0 rounded-2xl px-5 py-3 text-left text-sm font-bold tracking-tight transition-all duration-200 sm:min-h-0 sm:px-6 sm:text-[0.9375rem]",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                isActive
                  ? cn(
                      "bg-primary text-primary-foreground shadow-[0_10px_28px_-8px_rgba(234,88,12,0.55)]",
                      "ring-2 ring-white/40 dark:ring-orange-400/25",
                    )
                  : cn(
                      "border border-border-soft/80 bg-card/85 text-foreground/75 shadow-sm",
                      "hover:border-primary/25 hover:bg-card hover:text-foreground hover:shadow-md",
                      "dark:border-border-soft dark:bg-card/60",
                    ),
              )}
            >
              {shortLabel ? (
                <>
                  <span className="sm:hidden">{shortLabel}</span>
                  <span className="hidden sm:inline">{label}</span>
                </>
              ) : (
                label
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
