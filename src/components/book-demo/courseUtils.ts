import type { ApiCourse } from "@/lib/api/types";

export function isCourseBookable(c: ApiCourse): boolean {
  return c.bookDemoEnabled === true && c.batches.length > 0;
}
