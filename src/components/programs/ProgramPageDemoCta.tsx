"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useBookDemoFlow } from "@/providers/BookDemoFlowProvider";

export function ProgramPageDemoCta() {
  const { openPicker } = useBookDemoFlow();

  return (
    <div className="mt-10 flex flex-wrap gap-3">
      <Button type="button" variant="primary" className="min-h-11 px-6" onClick={() => openPicker()}>
        Book a demo (₹9)
      </Button>
      <Link
        href="/"
        className="inline-flex min-h-11 items-center justify-center rounded-xl border-2 border-primary px-6 text-sm font-bold text-primary"
      >
        Back to home
      </Link>
    </div>
  );
}
