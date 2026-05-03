import type { ReactNode } from "react";
import Link from "next/link";
import { site } from "@/lib/site-config";

type AuthShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6">
      <div className="mx-auto w-full max-w-md">
        <Link
          href="/"
          className="font-display text-lg font-bold text-foreground hover:text-primary"
        >
          ← {site.name}
        </Link>
        <h1 className="mt-8 font-display text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle ? <p className="mt-2 text-sm text-muted">{subtitle}</p> : null}
        <div className="mt-8 rounded-2xl border border-foreground/10 bg-card p-6 shadow-sm sm:p-8">
          {children}
        </div>
        <p className="mt-6 text-center text-sm text-muted">{footer}</p>
      </div>
    </div>
  );
}
