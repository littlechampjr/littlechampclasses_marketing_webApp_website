"use client";

import { useEffect, useState } from "react";
import { Section } from "@/components/layout/Section";
import { getApiBaseUrl } from "@/lib/api/config";
import type { PublicTeacher } from "@/lib/api/teachers";
import { FacultyCarouselClient } from "./FacultyCarouselClient";

/**
 * Module-level cache shared across all mounts in the browser session.
 *
 * Why: this component is rendered inside both a server tree (`/`) and a client
 * tree (the learner dashboard). An async server component cannot live inside a
 * client tree — it would be invoked on every re-render, causing dozens of
 * `/api/teachers` calls when the dashboard refreshes. Making the component
 * client-only with a deduped in-memory cache keeps it to a single fetch per
 * TTL window regardless of how many times it mounts or re-renders.
 */
const CACHE_TTL_MS = 5 * 60 * 1000;
let cache: { promise: Promise<PublicTeacher[]>; fetchedAt: number } | null = null;

function fetchTeachersOnce(): Promise<PublicTeacher[]> {
  const now = Date.now();
  if (cache && now - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.promise;
  }
  const promise = fetch(`${getApiBaseUrl()}/api/teachers`)
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
    .then((d: { teachers?: PublicTeacher[] }) => d.teachers ?? [])
    .catch(() => [] as PublicTeacher[]);
  cache = { promise, fetchedAt: now };
  // If the network call ultimately fails, drop the cache so the next mount retries.
  promise.then((list) => {
    if (list.length === 0) cache = null;
  });
  return promise;
}

export function FacultyCarousel() {
  const [teachers, setTeachers] = useState<PublicTeacher[] | null>(null);

  useEffect(() => {
    let alive = true;
    fetchTeachersOnce().then((list) => {
      if (alive) setTeachers(list);
    });
    return () => {
      alive = false;
    };
  }, []);

  if (!teachers || teachers.length === 0) return null;

  return (
    <Section id="faculty">
      <h2 className="text-center font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Meet our Faculty
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-muted">
        Our teachers are no less than wizards! <span aria-hidden>🪄</span>
      </p>
      <div className="mt-10">
        <FacultyCarouselClient teachers={teachers} />
      </div>
    </Section>
  );
}
