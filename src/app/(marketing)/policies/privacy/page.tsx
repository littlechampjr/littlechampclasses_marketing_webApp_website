import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy policy",
};

export default function PrivacyPage() {
  return (
    <Section className="py-12">
      <Link href="/" className="text-sm font-medium text-primary hover:underline">
        ← Home
      </Link>
      <h1 className="mt-6 font-display text-3xl font-bold text-foreground">Privacy policy</h1>
      <p className="mt-4 text-sm text-muted">
        Placeholder page for {site.name}. Replace with your privacy policy before collecting data.
      </p>
      <div className="mt-8 max-w-2xl space-y-4 text-sm leading-relaxed text-muted">
        <p>
          We respect families’ data. For privacy requests, email{" "}
          <a className="text-primary hover:underline" href={`mailto:${site.contactEmail}`}>
            {site.contactEmail}
          </a>
          .
        </p>
      </div>
    </Section>
  );
}

