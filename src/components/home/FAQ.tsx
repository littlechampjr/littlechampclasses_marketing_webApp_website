"use client";

import { useState } from "react";
import { Section } from "@/components/layout/Section";
import { cn } from "@/lib/cn";

const faqs = [
  {
    q: "What subjects do you cover?",
    a: "We focus on early numeracy, language, reasoning, and scientific curiosity—presented in a single integrated experience appropriate for Classes 1–8.",
  },
  {
    q: "How long are classes?",
    a: "Younger bands use shorter sessions with breaks; older bands extend gradually. Exact duration is shared after placement so it fits attention spans.",
  },
  {
    q: "Do parents need to sit in?",
    a: "For the youngest learners, a caring adult nearby helps. As children grow, independence increases while you still get clear weekly updates.",
  },
  {
    q: "Can we change batches or timing?",
    a: "Yes—life happens. Reach out to support and we’ll help you find a better slot where capacity allows.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq">
      <h2 className="text-center font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Frequently asked questions
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-muted">
        Straight answers—if you need more detail, we’re one email away.
      </p>
      <div className="mx-auto mt-10 max-w-3xl divide-y divide-foreground/10 rounded-2xl border border-foreground/10 bg-card">
        {faqs.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q} className="px-4 py-1 sm:px-6">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="font-display text-base font-semibold text-foreground">{item.q}</span>
                <span
                  className={cn(
                    "shrink-0 text-primary transition-transform duration-200",
                    isOpen ? "rotate-180" : "",
                  )}
                  aria-hidden
                >
                  ▼
                </span>
              </button>
              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-200 ease-out",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <p className="pb-4 text-sm leading-relaxed text-muted">{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
