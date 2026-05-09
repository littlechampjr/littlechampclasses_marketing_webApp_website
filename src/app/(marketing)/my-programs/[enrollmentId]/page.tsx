import { EnrolledProgramClient } from "@/components/my-programs/EnrolledProgramClient";

export default async function EnrolledProgramPage({
  params,
}: {
  params: Promise<{ enrollmentId: string }>;
}) {
  const { enrollmentId } = await params;
  return <EnrolledProgramClient enrollmentId={enrollmentId} />;
}
