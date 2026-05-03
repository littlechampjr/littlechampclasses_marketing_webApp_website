import { Section } from "@/components/layout/Section";
import { ProgramPageDemoCta } from "@/components/programs/ProgramPageDemoCta";

type ProgramTemplateProps = {
  title: string;
  eyebrow: string;
  description: string;
  bullets: string[];
};

export function ProgramTemplate({ title, eyebrow, description, bullets }: ProgramTemplateProps) {
  return (
    <Section className="py-12 sm:py-16">
      <p className="text-sm font-bold uppercase tracking-wide text-primary">{eyebrow}</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-foreground sm:text-4xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">{description}</p>
      <ul className="mt-8 max-w-xl space-y-3 text-foreground">
        {bullets.map((b) => (
          <li key={b} className="flex gap-3">
            <span className="text-primary" aria-hidden>
              ✓
            </span>
            {b}
          </li>
        ))}
      </ul>
      <ProgramPageDemoCta />
    </Section>
  );
}
