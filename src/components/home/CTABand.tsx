"use client";

import { Section } from "@/components/layout/Section";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useBookDemoFlow } from "@/providers/BookDemoFlowProvider";

export function CTABand() {
  const { openPicker } = useBookDemoFlow();

  return (
    <Section id="cta" className="pb-20 sm:pb-24">
      <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-12 text-center sm:px-12 sm:py-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, white 0, transparent 40%), radial-gradient(circle at 80% 80%, white 0, transparent 35%)",
          }}
          aria-hidden
        />
        <div className="relative">
          <h2 className="font-display text-2xl font-bold text-primary-foreground sm:text-3xl">
            Ready to see your child shine?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-primary-foreground/90 sm:text-base">
            Join a cohort led by mentors who combine rigor with warmth—starting with a guided trial.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              type="button"
              variant="secondary"
              className="min-h-12 min-w-[200px] border-0 bg-card text-foreground hover:opacity-95"
              onClick={() => openPicker()}
            >
              View demo classes (₹9)
            </Button>
            <ButtonLink
              href="/signup"
              variant="outline"
              className="min-h-12 min-w-[200px] border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10"
            >
              Create account
            </ButtonLink>
          </div>
        </div>
      </div>
    </Section>
  );
}
