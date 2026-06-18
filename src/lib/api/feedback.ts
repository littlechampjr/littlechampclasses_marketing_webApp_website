import { apiFetch } from "./client";

export type FeedbackSubmitInput = {
  name: string;
  mobileNumber: string;
  email?: string;
  featureSuggestions?: string;
  improvementSuggestions?: string;
  activitiesSuggestions?: string;
  academicYearProgramSuggestions?: string;
  additionalFeedback?: string;
  rating: number;
};

export async function submitFeedback(input: FeedbackSubmitInput, token?: string | null) {
  return apiFetch<{ ok: true; id: string; message: string }>("/api/feedback", {
    method: "POST",
    body: JSON.stringify(input),
    token: token ?? undefined,
  });
}
