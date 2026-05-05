"use client";

import { useEffect, useState } from "react";
import { CourseBanner, mapCoursesToBannerSlides } from "./CourseBanner";
import { fetchCoursesForPurchaseBanner } from "@/lib/api/coursePurchase";
import type { ApiCourse } from "@/lib/api/types";

/**
 * When `bleed`, breaks out of a parent horizontal padding (e.g. dashboard `mx-auto max-w-6xl px-4`)
 * so the dark banner stretches edge-to-edge.
 */
export function CoursePurchaseBannerSection({ bleed = false }: { bleed?: boolean }) {
  const [courses, setCourses] = useState<ApiCourse[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const rows = await fetchCoursesForPurchaseBanner();
        if (!cancelled) setCourses(rows);
      } catch {
        if (!cancelled) setCourses([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!courses?.length) return null;
  const slides = mapCoursesToBannerSlides(courses);
  if (!slides.length) return null;

  const banner = <CourseBanner key={courses.map((c) => c.id).join("|")} slides={slides} />;
  if (!bleed) return banner;

  return (
    <div className="-mx-4 w-[calc(100%+2rem)] sm:-mx-6 sm:w-[calc(100%+3rem)]">{banner}</div>
  );
}
