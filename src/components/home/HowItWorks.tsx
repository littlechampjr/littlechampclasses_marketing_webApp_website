import { Section } from "@/components/layout/Section";

const steps = [
  { step: "01", title: "Tell us about your child", body: "Age, goals, and schedule—takes a few minutes." },
  { step: "02", title: "Match with a cohort", body: "We place learners in small groups at the right level." },
  { step: "03", title: "Learn live, weekly", body: "Interactive classes, practice, and mentor support." },
];

export function HowItWorks() {
  return (
    <Section id="how-it-works" className="bg-card/50">
      <h2 className="text-center font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        How it works
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-muted">
        A simple loop: enroll, join live sessions, and see steady progress—with humans, not just
        videos.
      </p>
      <ol className="mt-12 grid gap-8 md:grid-cols-3">
        {steps.map((s, i) => (
          <li
            key={s.step}
            className="relative rounded-2xl border border-foreground/10 bg-background p-6 pt-10"
          >
            <span className="absolute left-6 top-0 -translate-y-1/2 rounded-full bg-primary px-3 py-1 font-display text-xs font-bold text-primary-foreground">
              {s.step}
            </span>
            <h3 className="font-display text-lg font-bold text-foreground">{s.title}</h3>
            <p className="mt-2 text-sm text-muted">{s.body}</p>
            {i < steps.length - 1 ? (
              <span
                className="absolute -right-4 top-1/2 hidden h-0.5 w-8 -translate-y-1/2 bg-primary/30 md:block"
                aria-hidden
              />
            ) : null}
          </li>
        ))}
      </ol>
    </Section>
  );
}
