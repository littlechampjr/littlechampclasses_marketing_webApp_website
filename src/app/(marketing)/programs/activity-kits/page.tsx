import type { Metadata } from "next";
import { ProgramTemplate } from "@/components/programs/ProgramTemplate";

export const metadata: Metadata = {
  title: "Activity Kits",
};

export default function ActivityKitsPage() {
  return (
    <ProgramTemplate
      eyebrow="Program"
      title="Activity Kits"
      description="Hands-on builds and experiments you can do with simple materials—imagine the full kit delivered to your door."
      bullets={[
        "STEM sparks without expensive gear",
        "Step-by-step demos in live class",
        "Extensions for kids who want more",
      ]}
    />
  );
}

