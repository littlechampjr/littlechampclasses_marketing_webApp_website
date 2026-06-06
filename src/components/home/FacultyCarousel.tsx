import { Section } from "@/components/layout/Section";
import { getTeachers } from "@/lib/api/teachers";
import { FacultyCarouselClient } from "./FacultyCarouselClient";

export async function FacultyCarousel() {
  const teachers = await getTeachers();
  if (teachers.length === 0) return null;

  return (
    <Section id="faculty">
      <h2 className="text-center font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Meet our Faculty
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-muted">
        Our teachers are no less than wizards! <span aria-hidden>🪄</span>
      </p>
      <div className="mt-10">
        <FacultyCarouselClient teachers={teachers} />
      </div>
    </Section>
  );
}
