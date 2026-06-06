import { getApiBaseUrl } from "./config";

export type PublicTeacher = {
  id: string;
  name: string;
  imageUrl: string;
  bioLine: string;
  modalTagline: string;
  highlights: string[];
};

/**
 * Server-side fetch of active teachers for the marketing homepage. Cached for 5 minutes
 * so admin edits propagate without a redeploy.
 */
export async function getTeachers(): Promise<PublicTeacher[]> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/api/teachers`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { teachers?: PublicTeacher[] };
    return data.teachers ?? [];
  } catch {
    return [];
  }
}
