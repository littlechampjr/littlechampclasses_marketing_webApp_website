import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Almost done",
  description: "Complete your child’s profile to get started.",
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return children;
}

