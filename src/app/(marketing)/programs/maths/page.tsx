import type { Metadata } from "next";
import { ProgramTemplate } from "@/components/programs/ProgramTemplate";

export const metadata: Metadata = {
  title: "Learn Maths",
};

export default function MathsPage() {
  return (
    <ProgramTemplate
      eyebrow="Program"
      title="Learn Maths"
      description="Patterns, numbers, and problem-solving introduced through play—so maths feels like discovery, not pressure."
      bullets={[
        "Concrete to abstract, at the right pace",
        "Visual models kids can touch and draw",
        "Short practice loops that build fluency",
      ]}
    />
  );
}

