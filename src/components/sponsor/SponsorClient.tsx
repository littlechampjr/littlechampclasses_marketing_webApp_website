"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Section } from "@/components/layout/Section";
import { CourseDetail } from "@/components/sponsor/CourseDetail";
import { useCourses } from "@/hooks/useCourses";
import { apiFetch } from "@/lib/api/client";
import { ApiError } from "@/lib/api/types";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/cn";

function trackLabel(track: string) {
  const map: Record<string, string> = {
    "after-school": "After-School",
    english: "English",
    maths: "Maths",
    activity: "Activity Kits",
  };
  return map[track] ?? track;
}

const FALLBACK_THUMB = "/courses/thumb-stories.svg";

export function SponsorClient() {
  const { courses, loading, error, reload } = useCourses();
  const { token, user } = useAuth();
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (loading || error || courses.length === 0) return;
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash.startsWith("program-")) return;
    const id = window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 150);
    return () => window.clearTimeout(id);
  }, [loading, error, courses]);

  async function book(courseId: string) {
    setMsg(null);
    setErr(null);
    setBookingId(courseId);
    if (!token) {
      setErr("Please log in or register to book this ₹9 demo.");
      setBookingId(null);
      return;
    }
    try {
      await apiFetch("/api/bookings", {
        method: "POST",
        token,
        body: JSON.stringify({ courseId }),
      });
      setMsg(
        "Booking saved in the database. No payment was taken—when you add a gateway, you can charge the full program fee there.",
      );
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Booking failed");
    } finally {
      setBookingId(null);
    }
  }

  return (
    <Section className="py-12 sm:py-16">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Demo courses</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
          Book for <span className="text-primary">₹9</span> — join the class list
        </h1>
        <p className="mt-3 text-muted">
          All copy below is stored in <strong className="text-foreground">MongoDB</strong> and served by the backend.
          Each full program is <strong className="text-foreground">6 live + 6 live</strong> sessions (12 classes).
          Anyone can browse; sign in to book. <strong className="text-foreground">No payment gateway</strong> is wired
          yet—only a database row is created so you can plug Razorpay (or similar) in later.
        </p>
      </div>

      {!user ? (
        <div className="mt-8 rounded-2xl border border-border-soft bg-card/80 p-4 text-sm text-foreground shadow-sm backdrop-blur-sm">
          <Link href="/login" className="font-bold text-primary hover:underline">
            Log in / Register
          </Link>{" "}
          to book. ₹9 is recorded as a demo fee in the database; checkout comes later.
        </div>
      ) : null}

      {msg ? (
        <p className="mt-6 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm font-medium text-foreground">
          {msg}{" "}
          <Link href="/dashboard" className="text-primary underline">
            Open dashboard
          </Link>
        </p>
      ) : null}
      {err ? (
        <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {err}
        </p>
      ) : null}

      <div className="mt-10">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-96 animate-pulse rounded-2xl bg-surface-subtle ring-1 ring-border-soft"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-border-soft bg-card p-6 shadow-sm">
            <p className="text-foreground">{error}</p>
            <p className="mt-2 text-sm text-muted">
              Start the API, then run{" "}
              <code className="rounded bg-surface-subtle px-1">npm run seed --prefix backend</code>
            </p>
            <button
              type="button"
              className="mt-4 rounded-xl border border-primary px-4 py-2 text-sm font-bold text-primary"
              onClick={() => void reload()}
            >
              Retry
            </button>
          </div>
        ) : (
          <ul className="grid gap-8 sm:grid-cols-2">
            {courses.map((c) => {
              const thumb = c.thumbnailUrl?.trim() || FALLBACK_THUMB;
              return (
                <li
                  id={`program-${c.slug}`}
                  key={c.id}
                  className={cn(
                    "group flex flex-col overflow-hidden rounded-2xl border border-border-soft bg-card shadow-md transition",
                    "hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/10",
                  )}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface-subtle">
                    <Image
                      src={thumb}
                      alt=""
                      fill
                      className="object-cover transition duration-300 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 100vw, 50vw"
                      unoptimized={thumb.endsWith(".svg")}
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-black/55 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                      {trackLabel(c.track)}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary">
                        ₹{c.priceRupees} demo
                      </span>
                      <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent">
                        {c.liveSessionsFirst} + {c.liveSessionsSecond} live · {c.totalLiveSessions} classes
                      </span>
                    </div>
                    <h2 className="mt-3 font-display text-lg font-bold text-foreground sm:text-xl">
                      {c.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{c.description}</p>
                    {c.detailDescription ? (
                      <CourseDetail detailDescription={c.detailDescription} idPrefix={c.slug} />
                    ) : null}
                    <p className="mt-4 text-sm text-foreground">
                      <span className="font-bold text-primary">₹{c.priceRupees}</span>{" "}
                      <span className="text-muted">— book demo (no gateway yet)</span>
                    </p>
                    {c.classStartsAt ? (
                      <p className="mt-1 text-xs text-muted">
                        Suggested window: {new Date(c.classStartsAt).toLocaleString()}
                      </p>
                    ) : null}
                    <button
                      type="button"
                      disabled={bookingId === c.id}
                      className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:opacity-95 disabled:opacity-50"
                      onClick={() => void book(c.id)}
                    >
                      {bookingId === c.id ? "Saving…" : `Book for ₹${c.priceRupees}`}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Section>
  );
}
