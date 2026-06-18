import type { Metadata } from "next";
import { Section } from "@/components/layout/Section";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";

export const metadata: Metadata = {
  title: "Share Feedback",
  description:
    "Help us shape Little Champ Junior. Share suggestions, request features, and tell us how we can serve your child better.",
};

export default function FeedbackPage() {
  return (
    <Section id="feedback">
      <div className="mx-auto max-w-3xl">
        <header className="text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            We Would Love To Hear Your Thoughts <span aria-hidden>❤️</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Help us improve by sharing your suggestions and ideas.
          </p>
        </header>
        <div className="mt-10">
          <FeedbackForm />
        </div>
      </div>
    </Section>
  );
}
