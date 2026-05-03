"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { mainNav, site } from "@/lib/site-config";
import { cn } from "@/lib/cn";
import { useAuth } from "@/providers/AuthProvider";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, logout, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border-soft bg-card/95 shadow-sm backdrop-blur-md">
      <div className="relative mx-auto flex min-h-[5rem] max-w-6xl items-center justify-between gap-4 px-4 py-2 sm:min-h-[5.25rem] sm:px-6 sm:py-2.5">
        <Logo />

        <nav
          id="mobile-nav"
          className={cn(
            "absolute left-0 right-0 top-full z-40 max-h-[min(70vh,calc(100dvh-5rem))] overflow-y-auto border-b border-border-soft bg-card p-4 shadow-lg sm:static sm:z-auto sm:max-h-none sm:overflow-visible sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none",
            open ? "flex flex-col" : "hidden sm:flex sm:flex-1 sm:flex-row sm:items-center sm:justify-center",
          )}
          aria-label="Main"
        >
          <ul className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-1 lg:gap-2">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground/85 transition hover:bg-surface-subtle hover:text-foreground sm:py-2"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                  {item.label === "Activity Kits" ? (
                    <span className="ml-1 inline-block text-xs opacity-70" aria-hidden>
                      ⚖️
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-col gap-2 border-t border-border-soft pt-4 sm:ml-4 sm:mt-0 sm:flex-row sm:items-center sm:border-0 sm:pt-0 lg:ml-6">
            {!loading && user ? (
              <>
                <Link
                  href="/dashboard"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 transition hover:opacity-95 sm:min-h-10"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  className="rounded-xl px-3 py-2 text-left text-sm font-semibold text-muted hover:text-foreground sm:text-center"
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                >
                  Log Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border-2 border-primary px-5 text-sm font-bold text-primary transition hover:bg-primary hover:text-primary-foreground sm:min-h-10"
                onClick={() => setOpen(false)}
              >
                Login / Register
              </Link>
            )}
          </div>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border-soft text-foreground sm:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      <p className="sr-only">{site.tagline}</p>
    </header>
  );
}
