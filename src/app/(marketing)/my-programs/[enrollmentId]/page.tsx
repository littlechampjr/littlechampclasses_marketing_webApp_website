import { Skeleton } from "antd";
import { Suspense } from "react";
import { EnrolledProgramClient } from "@/components/my-programs/EnrolledProgramClient";

export default async function EnrolledProgramPage({
  params,
}: {
  params: Promise<{ enrollmentId: string }>;
}) {
  const { enrollmentId } = await params;
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      }
    >
      <EnrolledProgramClient enrollmentId={enrollmentId} />
    </Suspense>
  );
}
