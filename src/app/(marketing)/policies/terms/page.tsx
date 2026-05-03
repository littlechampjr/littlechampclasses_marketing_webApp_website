import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms & conditions",
};

export default function TermsPage() {
  return (
    <Section className="py-12">
      <Link href="/" className="text-sm font-medium text-primary hover:underline">
        ← Home
      </Link>
      <h1 className="mt-6 font-display text-3xl font-bold text-foreground">Terms & conditions</h1>
      <p className="mt-4 text-sm text-muted">
        Placeholder page for {site.name}. Replace this copy with your legal text before launch.
      </p>
      <div className="mt-8 max-w-2xl space-y-4 text-sm leading-relaxed text-muted">
        <p>
          These terms govern use of {site.name} ({site.domain}). Contact{" "}
          <a className="text-primary hover:underline" href={`mailto:${site.contactEmail}`}>
            {site.contactEmail}
          </a>{" "}
          for questions.
        </p>
      </div>
    </Section>
  );
}

