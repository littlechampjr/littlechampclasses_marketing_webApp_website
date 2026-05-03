"use client";

import { Modal } from "antd";
import { useBookDemoFlow } from "@/providers/BookDemoFlowProvider";
import { isCourseBookable } from "@/components/book-demo/courseUtils";
import { BookDemoCheckoutContent } from "@/components/book-demo/BookDemoCheckoutContent";
import { ProgramPickerStep } from "@/components/book-demo/ProgramPickerStep";
import { ProgramInterestForm } from "@/components/book-demo/ProgramInterestForm";
import { cn } from "@/lib/cn";

function StepDot({
  n,
  label,
  active,
  done,
}: {
  n: 1 | 2;
  label: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1.5 min-w-0">
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold tabular-nums",
          active && "bg-primary text-primary-foreground ring-2 ring-primary/30",
          done && !active && "bg-primary/20 text-primary",
          !active && !done && "bg-surface-subtle text-muted",
        )}
      >
        {n}
      </span>
      <span
        className={cn(
          "text-center text-xs font-semibold",
          active ? "text-foreground" : "text-muted",
        )}
      >
        {label}
      </span>
    </div>
  );
}

export function BookDemoFlowModal() {
  const {
    isOpen,
    step,
    selectedCourseId,
    setSelectedCourseId,
    step2,
    goToStep1,
    goNextFromStep1,
    close,
    courses,
    coursesLoading,
  } = useBookDemoFlow();

  const step1Active = step === 1;
  const step2Active = step === 2;
  const course = step2?.course ?? null;
  const step2IsBook = course ? isCourseBookable(course) : false;

  return (
    <Modal
      open={isOpen}
      onCancel={close}
      footer={null}
      width={1024}
      destroyOnHidden
      centered
      classNames={{ body: "!p-0" }}
      rootClassName="[&_.ant-modal-content]:overflow-hidden [&_.ant-modal-content]:rounded-3xl [&_.ant-modal-content]:p-0"
    >
      <div className="bg-card text-foreground">
        {step1Active && (
          <div className="border-b border-border-soft px-5 py-4 sm:px-8 sm:py-5">
            <div className="mx-auto flex max-w-lg items-stretch justify-between gap-2">
              <div className="flex flex-1 items-center gap-0">
                <StepDot n={1} label="Select goal" active done={false} />
                <div className="h-0.5 flex-1 self-start mt-[1.125rem] min-w-0 bg-border-soft" aria-hidden />
                <StepDot n={2} label="Book or notify" active={false} done={false} />
              </div>
            </div>
            <h2 className="mt-6 text-center font-display text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
              Pick a learning program for your child
            </h2>
          </div>
        )}

        {step1Active && (
          <div className="px-4 py-5 sm:px-6 sm:py-6">
            <ProgramPickerStep
              courses={courses}
              selectedCourseId={selectedCourseId}
              onSelect={setSelectedCourseId}
              loading={coursesLoading}
            />
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => goNextFromStep1()}
                disabled={!selectedCourseId}
                className="min-h-12 w-full max-w-sm rounded-2xl bg-primary px-8 text-base font-bold text-primary-foreground shadow-lg shadow-primary/25 transition hover:opacity-95 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step2Active && course && step2IsBook && (
          <>
            <div className="border-b border-border-soft px-5 py-4 sm:px-8 sm:py-5">
              <div className="mx-auto flex max-w-lg items-stretch justify-between">
                <div className="flex flex-1 items-center gap-0">
                  <button
                    type="button"
                    onClick={goToStep1}
                    className="mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg text-muted transition hover:bg-surface-subtle"
                    aria-label="Back to program selection"
                  >
                    ‹
                  </button>
                  <div className="flex flex-1 items-center">
                    <StepDot n={1} label="Select goal" active={false} done />
                    <div
                      className="h-0.5 flex-1 self-start mt-[1.125rem] min-w-0 bg-primary/30"
                      aria-hidden
                    />
                    <StepDot n={2} label="Book demo" active done />
                  </div>
                </div>
              </div>
            </div>
            <BookDemoCheckoutContent
              course={course}
              onClose={close}
              onBackToPrograms={goToStep1}
            />
          </>
        )}

        {step2Active && course && !step2IsBook && (
          <>
            <div className="border-b border-border-soft px-5 py-4 sm:px-8 sm:py-5">
              <div className="mx-auto flex max-w-lg items-stretch">
                <div className="flex flex-1 items-center gap-0">
                  <button
                    type="button"
                    onClick={goToStep1}
                    className="mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg text-muted transition hover:bg-surface-subtle"
                    aria-label="Back to program selection"
                  >
                    ‹
                  </button>
                  <div className="flex flex-1 items-center">
                    <StepDot n={1} label="Select goal" active={false} done />
                    <div
                      className="h-0.5 flex-1 self-start mt-[1.125rem] min-w-0 bg-primary/30"
                      aria-hidden
                    />
                    <StepDot n={2} label="Get updates" active done />
                  </div>
                </div>
              </div>
            </div>
            <ProgramInterestForm course={course} onClose={close} onBackToPrograms={goToStep1} />
          </>
        )}
      </div>
    </Modal>
  );
}
