"use client";

import { ArrowLeftOutlined, CustomerServiceOutlined } from "@ant-design/icons";
import { Skeleton } from "antd";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { ChapterContentHeader } from "@/components/study-room/chapter/ChapterContentHeader";
import { ChapterEmptyPanel } from "@/components/study-room/chapter/ChapterEmptyPanel";
import { ChapterTabs, type ChapterTabKey } from "@/components/study-room/chapter/ChapterTabs";
import { PdfResourceCard } from "@/components/study-room/chapter/PdfResourceCard";
import { PdfViewerModal } from "@/components/study-room/chapter/PdfViewerModal";
import { VideoCard } from "@/components/study-room/chapter/VideoCard";
import { VideoPlayerModal } from "@/components/study-room/chapter/VideoPlayerModal";
import type { ApiChapterLecture, ApiChapterPdfResource } from "@/lib/api/types";
import { site } from "@/lib/site-config";
import { cn } from "@/lib/cn";
import { useChapterContent } from "@/hooks/useChapterContent";
import { useAuth } from "@/providers/AuthProvider";

type Props = {
  enrollmentId: string;
  chapterId: string;
};

function triggerPdfDownload(resource: ApiChapterPdfResource) {
  const a = document.createElement("a");
  a.href = resource.pdfUrl;
  a.download = `${resource.title.replace(/[^\w\-]+/g, "_").slice(0, 80) || "document"}.pdf`;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function ChapterContentClient({ enrollmentId, chapterId }: Props) {
  const { token, user, loading: authLoading } = useAuth();
  const { data, loading, error, refetch } = useChapterContent(
    token,
    enrollmentId || null,
    chapterId || null,
  );

  const [tab, setTab] = useState<ChapterTabKey>("lectures");
  const [videoOpen, setVideoOpen] = useState<{ title: string; url: string } | null>(null);
  const [pdfOpen, setPdfOpen] = useState<{ title: string; url: string } | null>(null);

  const backHref = `/my-programs/${encodeURIComponent(enrollmentId)}?tab=study`;

  const onViewLecture = useCallback((lecture: ApiChapterLecture) => {
    setVideoOpen({ title: lecture.title, url: lecture.videoUrl });
  }, []);

  const onViewPdfResource = useCallback((resource: ApiChapterPdfResource) => {
    if (resource.viewerMode === "newTab") {
      window.open(resource.pdfUrl, "_blank", "noopener,noreferrer");
      return;
    }
    setPdfOpen({ title: resource.title, url: resource.pdfUrl });
  }, []);

  const onDownloadPdf = useCallback((resource: ApiChapterPdfResource) => {
    triggerPdfDownload(resource);
  }, []);

  const tabHeading = useMemo(() => {
    if (tab === "lectures") return "Videos";
    if (tab === "classNotes") return "Class Notes";
    if (tab === "chapterPdf") return "Chapter PDF";
    return "DHA's Sol";
  }, [tab]);

  if (authLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <Skeleton active className="py-8" />
      </div>
    );
  }

  if (!token || !user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
        <h1 className="font-display text-xl font-bold text-foreground">Chapter</h1>
        <p className="mt-3 text-muted">Sign in to view this material.</p>
        <Link
          href={`/login?returnTo=${encodeURIComponent(`/my-programs/${enrollmentId}/chapters/${chapterId}`)}`}
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl border-2 border-primary px-6 font-bold text-primary hover:bg-primary hover:text-primary-foreground"
        >
          Login / Register
        </Link>
      </div>
    );
  }

  if (loading && !data) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <Skeleton active paragraph={{ rows: 2 }} className="mb-8" />
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
        <h1 className="font-display text-xl font-bold text-foreground">Chapter</h1>
        <p className="mt-3 text-muted">{error ?? "Could not load this chapter."}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className="text-sm font-bold text-primary"
            onClick={() => void refetch()}
          >
            Retry
          </button>
          <Link href={backHref} className="text-sm font-semibold text-muted hover:text-foreground">
            Back to study room
          </Link>
        </div>
      </div>
    );
  }

  const { chapterMeta } = data;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-6 sm:pt-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted underline-offset-2 hover:text-foreground hover:underline"
        >
          <ArrowLeftOutlined />
          Back
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${site.contactEmail}`}
            className={cn(
              "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border-2 border-primary px-4 text-sm font-bold text-primary",
              "transition hover:bg-primary hover:text-primary-foreground",
            )}
          >
            <CustomerServiceOutlined />
            Contact us
          </a>
          <span className="text-sm text-muted">
            Hi,{" "}
            <span className="font-semibold text-foreground">
              {user.childName?.trim() || "there"}
            </span>
          </span>
        </div>
      </div>

      <ChapterContentHeader meta={chapterMeta} className="mb-6" />

      <ChapterTabs activeKey={tab} onChange={setTab} className="mb-6" />

      <div
        className="rounded-3xl border border-border-soft bg-card p-4 shadow-[0_20px_50px_-32px_rgba(0,0,0,0.12)] sm:p-6"
        role="tabpanel"
        aria-labelledby={`chapter-tab-${tab}`}
      >
        <div className="mb-6 flex items-center gap-2">
          <span className="h-6 w-1 rounded-full bg-primary" aria-hidden />
          <h2 className="font-display text-lg font-bold text-foreground">{tabHeading}</h2>
        </div>

        {tab === "lectures" ? (
          data.lectures.length === 0 ? (
            <ChapterEmptyPanel />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {data.lectures.map((lecture) => (
                <VideoCard
                  key={lecture.id}
                  lecture={lecture}
                  subjectKey={chapterMeta.subjectKey}
                  onView={() => onViewLecture(lecture)}
                />
              ))}
            </div>
          )
        ) : null}

        {tab === "classNotes" ? (
          data.classNotes.length === 0 ? (
            <ChapterEmptyPanel />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {data.classNotes.map((resource) => (
                <PdfResourceCard
                  key={resource.id}
                  resource={resource}
                  onViewPdf={() => onViewPdfResource(resource)}
                  onDownload={() => onDownloadPdf(resource)}
                />
              ))}
            </div>
          )
        ) : null}

        {tab === "chapterPdf" ? (
          data.chapterPdfs.length === 0 ? (
            <ChapterEmptyPanel />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {data.chapterPdfs.map((resource) => (
                <PdfResourceCard
                  key={resource.id}
                  resource={resource}
                  onViewPdf={() => onViewPdfResource(resource)}
                  onDownload={() => onDownloadPdf(resource)}
                />
              ))}
            </div>
          )
        ) : null}

        {tab === "dhaSol" ? (
          data.dhaSolutions.length === 0 ? (
            <ChapterEmptyPanel />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {data.dhaSolutions.map((resource) => (
                <PdfResourceCard
                  key={resource.id}
                  resource={resource}
                  onViewPdf={() => onViewPdfResource(resource)}
                  onDownload={() => onDownloadPdf(resource)}
                />
              ))}
            </div>
          )
        ) : null}
      </div>

      <VideoPlayerModal
        open={Boolean(videoOpen)}
        title={videoOpen?.title ?? ""}
        videoUrl={videoOpen?.url ?? ""}
        onClose={() => setVideoOpen(null)}
      />

      <PdfViewerModal
        open={Boolean(pdfOpen)}
        title={pdfOpen?.title ?? ""}
        pdfUrl={pdfOpen?.url ?? ""}
        onClose={() => setPdfOpen(null)}
      />
    </div>
  );
}
