import { ChapterContentClient } from "@/components/study-room/chapter/ChapterContentClient";

export default async function ChapterContentPage({
  params,
}: {
  params: Promise<{ enrollmentId: string; chapterId: string }>;
}) {
  const { enrollmentId, chapterId } = await params;
  return <ChapterContentClient enrollmentId={enrollmentId} chapterId={chapterId} />;
}
