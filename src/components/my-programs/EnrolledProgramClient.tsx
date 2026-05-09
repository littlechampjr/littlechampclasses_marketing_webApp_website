"use client";

import { ArrowLeftOutlined, CustomerServiceOutlined } from "@ant-design/icons";
import { Skeleton } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { TestsListClient } from "@/app/(marketing)/tests/TestsListClient";
import { CourseDescriptionTab } from "@/components/my-programs/CourseDescriptionTab";
import { CourseProgramHeader } from "@/components/my-programs/CourseProgramHeader";
import { EnrollmentCard } from "@/components/my-programs/EnrollmentCard";
import { StudyRoom } from "@/components/study-room/StudyRoom";
import { PillTabBar } from "@/components/ui/PillTabBar";
import { useEnrolledProgram } from "@/hooks/useEnrolledProgram";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site-config";
import { useAuth } from "@/providers/AuthProvider";

type Props = { enrollmentId: string };

type TabKey = "description" | "study" | "homework";

export function EnrolledProgramClient({ enrollmentId }: Props) {
  const router = useRouter();
  const { token, user, loading: authLoading } = useAuth();
  const { data, loading, error, refetch } = useEnrolledProgram(
    token,
    enrollmentId && enrollmentId.length > 0 ? enrollmentId : null,
  );

  const showEnrolledTabs = Boolean(data?.isEnrolled);

  const tabDefs = useMemo((): { key: TabKey; label: string }[] => {
    const base: { key: TabKey; label: string }[] = [{ key: "description", label: "Course Description" }];
    if (!showEnrolledTabs) return base;
    return [...base, { key: "study", label: "Study Room" }, { key: "homework", label: "Homework" }];
  }, [showEnrolledTabs]);

  const [activeTab, setActiveTab] = useState<TabKey>("description");

  const validKeys = useMemo(() => new Set(tabDefs.map((t) => t.key)), [tabDefs]);
  const effectiveTab = validKeys.has(activeTab) ? activeTab : "description";

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
        <h1 className="font-display text-xl font-bold text-foreground">My program</h1>
        <p className="mt-3 text-muted">Sign in to view your enrolled programs.</p>
        <Link
          href={`/login?returnTo=${encodeURIComponent(`/my-programs/${enrollmentId}`)}`}
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
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
        <h1 className="font-display text-xl font-bold text-foreground">Program</h1>
        <p className="mt-3 text-muted">{error ?? "Could not load this program."}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className="text-sm font-bold text-primary"
            onClick={() => void refetch()}
          >
            Retry
          </button>
          <Link href="/my-programs" className="text-sm font-semibold text-muted hover:text-foreground">
            All programs
          </Link>
        </div>
      </div>
    );
  }

  const { course, enrollment, teachers, faqs, studyRoom } = data;

  if (!course.purchaseFlow?.enabled) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
        <p className="text-muted">This program is not available for viewing.</p>
        <Link href="/my-programs" className="mt-6 inline-block font-bold text-primary">
          Back to programs
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-6 sm:pt-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted underline-offset-2 hover:text-foreground hover:underline"
          onClick={() => router.back()}
        >
          <ArrowLeftOutlined />
          Back
        </button>
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

      <CourseProgramHeader course={course} enrollment={enrollment} className="mb-6" />

      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
        <div className="min-w-0 flex-1">
          <PillTabBar<TabKey>
            variant="peach"
            ariaLabel="Program sections"
            className="mb-2"
            items={tabDefs}
            activeKey={effectiveTab}
            onChange={setActiveTab}
          />

          <div className="mt-8 min-h-[12rem]" role="tabpanel">
            {effectiveTab === "description" ? (
              <CourseDescriptionTab course={course} teachers={teachers} faqs={faqs} />
            ) : null}
            {effectiveTab === "study" ? <StudyRoom subjects={studyRoom.subjects} /> : null}
            {effectiveTab === "homework" ? (
              <div className="pb-8">
                <TestsListClient courseId={enrollment.courseId} compact />
              </div>
            ) : null}
          </div>
        </div>
        <div className="w-full shrink-0 lg:w-[360px] xl:w-[380px]">
          <EnrollmentCard course={course} enrollment={enrollment} />
        </div>
      </div>
    </div>
  );
}
