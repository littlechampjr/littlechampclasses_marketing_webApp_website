import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import type { ApiCourse } from "@/lib/api/types";

const CoursePurchasePageClient = dynamic(
  () =>
    import("@/components/course-purchase/CoursePurchasePageClient").then((m) => ({
      default: m.CoursePurchasePageClient,
    })),
  { loading: () => <div className="mx-auto max-w-6xl px-4 py-16 text-muted">Loading course…</div> },
);

async function fetchCourse(slug: string): Promise<ApiCourse> {
  const base =
    process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, "") ||
    ("http://localhost:4100" as const);
  const res = await fetch(`${base}/api/courses/${encodeURIComponent(slug)}`, {
    next: { revalidate: 120 },
  });
  if (res.status === 404) notFound();
  if (!res.ok) {
    throw new Error("Failed to load course");
  }
  const json = (await res.json()) as { course: ApiCourse };
  return json.course;
}

/** Premium checkout experience — gated by Mongo `purchaseFlow.enabled`. */
export default async function PurchaseCoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await fetchCourse(slug);
  return <CoursePurchasePageClient initialCourse={course} />;
}
