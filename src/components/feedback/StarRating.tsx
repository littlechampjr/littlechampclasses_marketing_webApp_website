"use client";

import { useState } from "react";

type Props = {
  value: number;
  onChange: (v: number) => void;
  size?: "md" | "lg";
};

const labels = ["Poor", "Fair", "Good", "Very good", "Excellent"];

export function StarRating({ value, onChange, size = "lg" }: Props) {
  const [hover, setHover] = useState(0);
  const display = hover || value;
  const starSize = size === "lg" ? "text-4xl sm:text-5xl" : "text-2xl";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => {
          const active = n <= display;
          return (
            <button
              key={n}
              type="button"
              aria-label={`${n} ${n === 1 ? "star" : "stars"}`}
              aria-pressed={value === n}
              onClick={() => onChange(n)}
              onMouseEnter={() => setHover(n)}
              className={`${starSize} leading-none transition-transform duration-150 hover:scale-110 focus-visible:outline-none focus-visible:scale-110 ${
                active ? "text-amber-400" : "text-foreground/20"
              }`}
            >
              ★
            </button>
          );
        })}
      </div>
      <p className="h-5 text-sm font-medium text-foreground/70">
        {display > 0 ? labels[display - 1] : "Tap to rate"}
      </p>
    </div>
  );
}
