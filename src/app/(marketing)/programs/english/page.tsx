import type { Metadata } from "next";
import { ProgramTemplate } from "@/components/programs/ProgramTemplate";

export const metadata: Metadata = {
  title: "Learn English",
};

export default function EnglishPage() {
  return (
    <ProgramTemplate
      eyebrow="Program"
      title="Learn English"
      description="Sounds, stories, and speaking confidence for Classes 1–8—designed like the best global apps, taught by humans who care."
      bullets={[
        "Phonics and vocabulary through games",
        "Read-alouds that build listening stamina",
        "Gentle correction so kids stay brave",
      ]}
    />
  );
}

