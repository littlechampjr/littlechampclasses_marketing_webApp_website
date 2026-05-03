"use client";

import Link from "next/link";
import { footerNav, site, type FooterOrActionLink } from "@/lib/site-config";
import { useBookDemoFlow } from "@/providers/BookDemoFlowProvider";

function isBookDemoAction(link: FooterOrActionLink): link is { label: string; openBookDemo: true } {
  return "openBookDemo" in link && link.openBookDemo === true;
}

export function SiteFooter() {
  const { openPicker } = useBookDemoFlow();

  return (
    <footer className="border-t border-border-soft bg-card">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <p className="font-display text-xl font-extrabold text-foreground">{site.name}</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{site.tagline}</p>
            <p className="mt-4 text-xs text-muted">
              Contact us at <code className="rounded bg-surface-subtle px-1"><strong>9453503369</strong></code>
            </p>
          </div>
          {footerNav.map((group) => (
            <div key={group.title}>
              <p className="text-xs font-bold uppercase tracking-wider text-muted">{group.title}</p>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={isBookDemoAction(link) ? "book-demo" : link.href}>
                    {isBookDemoAction(link) ? (
                      <button
                        type="button"
                        onClick={() => openPicker()}
                        className="text-left text-sm font-medium text-foreground/80 transition hover:text-primary"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm font-medium text-foreground/80 transition hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-14 border-t border-border-soft pt-8 text-center text-xs text-muted">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
