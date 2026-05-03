"use client";

import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { useBookDemoFlow } from "@/providers/BookDemoFlowProvider";

const bands = [
  {
    title: "Class 1st–3rd",
    subtitle: "Foundations through play",
    points: ["Sensory & language sparks", "Parent-partnered routines", "Short, lively sessions"],
  },
  {
    title: "Class 4th–5th",
    subtitle: "Pre-primary readiness",
    points: ["Early numeracy & patterns", "Stories & expression", "Focus without fatigue"],
  },
  {
    title: "Class 6th–8th",
    subtitle: "Growing independence",
    points: ["Core concepts with context", "Problem-solving habits", "Confidence in class"],
  },
];

export function Programs() {
  const { openPicker } = useBookDemoFlow();

  return (
    <Section id="programs-by-class">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Programs by Classe
          </h2>
          <p className="mt-2 max-w-xl text-muted">
            Pick the band that matches your child—we tailor pacing, examples, and homework to their
            world.
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          className="shrink-0 self-start sm:self-auto"
          onClick={() => openPicker()}
        >
          Book ₹9 demo
        </Button>
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {bands.map((b) => (
          <article
            key={b.title}
            className="flex flex-col rounded-2xl border border-foreground/10 bg-card p-6 shadow-sm"
          >
            <h3 className="font-display text-xl font-bold text-foreground">{b.title}</h3>
            <p className="mt-1 text-sm font-medium text-primary">{b.subtitle}</p>
            <ul className="mt-4 flex-1 space-y-2 text-sm text-muted">
              {b.points.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="text-primary" aria-hidden>
                    ✓
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  );
}
