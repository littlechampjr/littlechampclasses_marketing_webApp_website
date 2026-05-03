import type { Metadata } from "next";
import { TestsListClient } from "./TestsListClient";

export const metadata: Metadata = {
  title: "Practice tests",
  description: "Browse and start practice tests with analysis—Little Champ Junior.",
};

export default function TestsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-10 text-center sm:text-left">
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Practice tests</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">
          Practice, learn from detailed analysis, and build confidence. Rank is not shown for
          practice attempts.
        </p>
      </header>
      <TestsListClient />
    </div>
  );
}
