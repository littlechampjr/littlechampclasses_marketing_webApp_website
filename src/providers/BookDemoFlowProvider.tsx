"use client";

import { App as AntApp } from "antd";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { BookDemoFlowModal } from "@/components/book-demo/BookDemoFlowModal";
import { isCourseBookable } from "@/components/book-demo/courseUtils";
import { apiFetch } from "@/lib/api/client";
import type { ApiCourse } from "@/lib/api/types";

type FlowStep2 = { course: ApiCourse };

type BookDemoFlowContextValue = {
  courses: ApiCourse[];
  coursesLoading: boolean;
  coursesError: string | null;
  reloadCourses: () => Promise<void>;
  isOpen: boolean;
  step: 1 | 2;
  selectedCourseId: string | null;
  setSelectedCourseId: (id: string | null) => void;
  step2: FlowStep2 | null;
  openPicker: () => void;
  openBookForCourse: (course: ApiCourse) => void;
  openInterestForCourse: (course: ApiCourse) => void;
  goToStep1: () => void;
  goNextFromStep1: () => void;
  close: () => void;
};

const BookDemoFlowContext = createContext<BookDemoFlowContextValue | null>(null);

function loadCoursesRequest(): Promise<ApiCourse[]> {
  return apiFetch<{ courses: ApiCourse[] }>("/api/courses?featured=1", { method: "GET" }).then(
    (d) => d.courses,
  );
}

export function BookDemoFlowProvider({ children }: { children: ReactNode }) {
  const { message } = AntApp.useApp();
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [step2, setStep2] = useState<FlowStep2 | null>(null);

  const reloadCourses = useCallback(async () => {
    setCoursesLoading(true);
    setCoursesError(null);
    try {
      const data = await loadCoursesRequest();
      setCourses(data);
    } catch (e) {
      setCoursesError(e instanceof Error ? e.message : "Failed to load programs");
      setCourses([]);
    } finally {
      setCoursesLoading(false);
    }
  }, []);

  useEffect(() => {
    void reloadCourses();
  }, [reloadCourses]);

  const close = useCallback(() => {
    setIsOpen(false);
    setStep(1);
    setSelectedCourseId(null);
    setStep2(null);
  }, []);

  const openPicker = useCallback(() => {
    setStep(1);
    setSelectedCourseId(null);
    setStep2(null);
    setIsOpen(true);
  }, []);

  const openInterestForCourse = useCallback((course: ApiCourse) => {
    setStep(2);
    setStep2({ course });
    setSelectedCourseId(course.id);
    setIsOpen(true);
  }, []);

  const openBookForCourse = useCallback(
    (course: ApiCourse) => {
      if (!isCourseBookable(course)) {
        openInterestForCourse(course);
        return;
      }
      setStep(2);
      setStep2({ course });
      setSelectedCourseId(course.id);
      setIsOpen(true);
    },
    [openInterestForCourse],
  );

  const goToStep1 = useCallback(() => {
    setStep(1);
    setStep2(null);
  }, []);

  const goNextFromStep1 = useCallback(() => {
    if (!selectedCourseId) {
      message.warning("Pick a learning program to continue.");
      return;
    }
    const course = courses.find((c) => c.id === selectedCourseId);
    if (!course) {
      message.error("That program is no longer available. Refresh and try again.");
      return;
    }
    setStep(2);
    setStep2({ course });
  }, [courses, message, selectedCourseId]);

  const value = useMemo<BookDemoFlowContextValue>(
    () => ({
      courses,
      coursesLoading,
      coursesError,
      reloadCourses,
      isOpen,
      step,
      selectedCourseId,
      setSelectedCourseId,
      step2,
      openPicker,
      openBookForCourse,
      openInterestForCourse,
      goToStep1,
      goNextFromStep1,
      close,
    }),
    [
      close,
      courses,
      coursesError,
      coursesLoading,
      goNextFromStep1,
      goToStep1,
      isOpen,
      openBookForCourse,
      openInterestForCourse,
      openPicker,
      reloadCourses,
      selectedCourseId,
      step,
      step2,
    ],
  );

  return (
    <BookDemoFlowContext.Provider value={value}>
      {children}
      <BookDemoFlowModal />
    </BookDemoFlowContext.Provider>
  );
}

export function useBookDemoFlow() {
  const ctx = useContext(BookDemoFlowContext);
  if (!ctx) {
    throw new Error("useBookDemoFlow must be used within BookDemoFlowProvider");
  }
  return ctx;
}
