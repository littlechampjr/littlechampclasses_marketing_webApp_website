import type { Metadata } from "next";
import { ProgramTemplate } from "@/components/programs/ProgramTemplate";

export const metadata: Metadata = {
  title: "After-School",
};

export default function AfterSchoolPage() {
  return (
    <ProgramTemplate
      eyebrow="Program"
      title="After-School spark"
      description="Structured yet playful sessions that wind down the school day with curiosity—stories, movement, and mini-challenges led by IIT mentors."
      bullets={[
        "Small groups so every child gets attention",
        "Rhythm that matches young attention spans",
        "Parent snapshots so you see progress weekly",
      ]}
    />
  );
}

