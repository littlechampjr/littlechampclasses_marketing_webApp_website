"use client";

import { useEffect, useRef, useState } from "react";
import { FieldTimeOutlined } from "@ant-design/icons";
import { cn } from "@/lib/cn";

function formatMs(remainingMs: number) {
  if (remainingMs <= 0) return "00:00";
  const s = Math.floor(remainingMs / 1000);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

type Props = {
  endsAtIso: string;
  onExpire: () => void;
  className?: string;
};

export function TestTimer({ endsAtIso, onExpire, className }: Props) {
  const [left, setLeft] = useState(() => Math.max(0, +new Date(endsAtIso) - Date.now()));
  const onExpireRef = useRef(onExpire);
  const expired = useRef(false);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    expired.current = false;
    const end = +new Date(endsAtIso);
    const tick = () => {
      const now = Date.now();
      const l = Math.max(0, end - now);
      setLeft(l);
      if (l === 0 && !expired.current) {
        expired.current = true;
        queueMicrotask(() => onExpireRef.current());
      }
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [endsAtIso]);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border-2 border-primary/30 bg-surface-subtle px-3 py-1.5 text-sm font-bold tabular-nums text-foreground",
        "dark:border-primary/40",
        className,
      )}
      role="timer"
      aria-live="polite"
    >
      <FieldTimeOutlined className="text-primary" aria-hidden />
      <span>{formatMs(left)}</span>
    </div>
  );
}
