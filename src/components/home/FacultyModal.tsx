"use client";

import { useEffect } from "react";
import type { PublicTeacher } from "@/lib/api/teachers";

type Props = {
  teacher: PublicTeacher | null;
  onClose: () => void;
};

export function FacultyModal({ teacher, onClose }: Props) {
  useEffect(() => {
    if (!teacher) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [teacher, onClose]);

  if (!teacher) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-8 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="faculty-modal-name"
    >
      <div
        className="relative w-full max-w-xl overflow-y-auto rounded-2xl bg-background p-6 shadow-2xl sm:p-8"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-foreground/70 transition hover:bg-foreground/5 hover:text-foreground"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <h3
          id="faculty-modal-name"
          className="pr-10 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
        >
          {teacher.name}
        </h3>
        {teacher.modalTagline ? (
          <p className="mt-2 font-display text-base font-semibold text-foreground">
            {teacher.modalTagline}
          </p>
        ) : null}

        {teacher.imageUrl ? (
          <div className="mt-5 overflow-hidden rounded-xl border border-foreground/10 bg-gradient-to-b from-orange-50 to-orange-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={teacher.imageUrl}
              alt={teacher.name}
              className="mx-auto block h-64 w-auto object-contain sm:h-80"
            />
          </div>
        ) : null}

        {teacher.highlights.length > 0 ? (
          <ul className="mt-6 space-y-3">
            {teacher.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-3 text-foreground">
                <span aria-hidden className="mt-0.5 text-lg leading-none">✨</span>
                <span className="text-sm sm:text-base">{h}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
