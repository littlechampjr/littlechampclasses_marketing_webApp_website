"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useBookDemoFlow } from "@/providers/BookDemoFlowProvider";

/** Opens the book-demo picker when URL contains `?bookDemo=1` (e.g. after /sponsor redirect). */
export function BookDemoUrlSync() {
  const searchParams = useSearchParams();
  const { openPicker } = useBookDemoFlow();
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    if (searchParams.get("bookDemo") === "1") {
      openPicker();
      done.current = true;
      const u = new URL(window.location.href);
      u.searchParams.delete("bookDemo");
      const next = u.pathname + (u.search || "");
      window.history.replaceState(null, "", next);
    }
  }, [searchParams, openPicker]);

  return null;
}
