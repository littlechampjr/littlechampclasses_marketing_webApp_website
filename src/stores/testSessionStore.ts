"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ApiTestQuestion } from "@/lib/api/testsTypes";

export type QuestionCell = {
  selectedOptionId: string | null;
  visited: boolean;
  markedForReview: boolean;
  timeSpentSec: number;
};

export type TestSessionState = {
  attemptId: string | null;
  testId: string | null;
  testTitle: string;
  endsAt: string | null;
  questions: ApiTestQuestion[];
  currentIndex: number;
  cells: Record<string, QuestionCell>;
  /** performance.now() when current question became active */
  activeSincePerf: number | null;
};

type TestSessionActions = {
  reset: () => void;
  bootstrap: (input: {
    attemptId: string;
    testId: string;
    testTitle: string;
    endsAt: string;
    questions: ApiTestQuestion[];
  }) => void;
  flushTimeToCurrent: () => void;
  setCurrentIndex: (i: number) => void;
  selectOption: (optionId: string) => void;
  toggleMarkForReview: () => void;
  saveAndNext: () => void;
  buildSubmitAnswers: () => {
    questionId: string;
    selectedOptionId: string | null;
    timeSpentSec: number;
  }[];
};

const emptyState: TestSessionState = {
  attemptId: null,
  testId: null,
  testTitle: "",
  endsAt: null,
  questions: [],
  currentIndex: 0,
  cells: {},
  activeSincePerf: null,
};

function ensureCells(questions: ApiTestQuestion[]): Record<string, QuestionCell> {
  const cells: Record<string, QuestionCell> = {};
  for (const q of questions) {
    cells[q.id] = {
      selectedOptionId: null,
      visited: false,
      markedForReview: false,
      timeSpentSec: 0,
    };
  }
  return cells;
}

export const useTestSessionStore = create<TestSessionState & TestSessionActions>()(
  persist(
    (set, get) => ({
      ...emptyState,

      reset: () => set({ ...emptyState }),

      bootstrap: ({ attemptId, testId, testTitle, endsAt, questions }) => {
        const cells = ensureCells(questions);
        const first = questions[0];
        if (first) {
          cells[first.id] = {
            ...cells[first.id]!,
            visited: true,
          };
        }
        set({
          attemptId,
          testId,
          testTitle,
          endsAt,
          questions,
          currentIndex: 0,
          cells,
          activeSincePerf: typeof performance !== "undefined" ? performance.now() : null,
        });
      },

      flushTimeToCurrent: () => {
        const s = get();
        const q = s.questions[s.currentIndex];
        if (!q || s.activeSincePerf == null) return;
        const dt = (performance.now() - s.activeSincePerf) / 1000;
        if (dt <= 0) return;
        set((state) => {
          const cell = state.cells[q.id];
          if (!cell) return state;
          return {
            ...state,
            cells: {
              ...state.cells,
              [q.id]: { ...cell, timeSpentSec: cell.timeSpentSec + dt },
            },
            activeSincePerf: performance.now(),
          };
        });
      },

      setCurrentIndex: (i) => {
        const s = get();
        if (i < 0 || i >= s.questions.length) return;
        get().flushTimeToCurrent();
        const id = s.questions[i]!.id;
        set((state) => ({
          currentIndex: i,
          activeSincePerf: performance.now(),
          cells: {
            ...state.cells,
            [id]: { ...state.cells[id]!, visited: true },
          },
        }));
      },

      selectOption: (optionId) => {
        set((state) => {
          const q = state.questions[state.currentIndex];
          if (!q) return state;
          return {
            cells: {
              ...state.cells,
              [q.id]: { ...state.cells[q.id]!, selectedOptionId: optionId },
            },
          };
        });
      },

      toggleMarkForReview: () => {
        set((state) => {
          const q = state.questions[state.currentIndex];
          if (!q) return state;
          const c = state.cells[q.id]!;
          return {
            cells: {
              ...state.cells,
              [q.id]: { ...c, markedForReview: !c.markedForReview },
            },
          };
        });
      },

      saveAndNext: () => {
        get().flushTimeToCurrent();
        const s = get();
        const next = s.currentIndex + 1;
        if (next >= s.questions.length) return;
        const id = s.questions[next]!.id;
        set((state) => ({
          currentIndex: next,
          activeSincePerf: performance.now(),
          cells: {
            ...state.cells,
            [id]: { ...state.cells[id]!, visited: true },
          },
        }));
      },

      buildSubmitAnswers: () => {
        get().flushTimeToCurrent();
        const s = get();
        return s.questions.map((q) => {
          const c = s.cells[q.id] ?? {
            selectedOptionId: null,
            visited: false,
            markedForReview: false,
            timeSpentSec: 0,
          };
          return {
            questionId: q.id,
            selectedOptionId: c.selectedOptionId,
            timeSpentSec: Math.max(0, Math.round(c.timeSpentSec * 10) / 10),
          };
        });
      },
    }),
    {
      name: "lcc-test-session-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        attemptId: s.attemptId,
        testId: s.testId,
        testTitle: s.testTitle,
        endsAt: s.endsAt,
        questions: s.questions,
        currentIndex: s.currentIndex,
        cells: s.cells,
      }),
    },
  ),
);

export function getQuestionVisualState(
  cell: QuestionCell | undefined,
): "not_visited" | "not_answered" | "answered" | "marked" | "answered_marked" {
  if (!cell || !cell.visited) return "not_visited";
  if (cell.markedForReview && cell.selectedOptionId) return "answered_marked";
  if (cell.markedForReview) return "marked";
  if (cell.selectedOptionId) return "answered";
  return "not_answered";
}

export function getNavSummary(questions: ApiTestQuestion[], cells: Record<string, QuestionCell>) {
  let answered = 0;
  let notAnswered = 0;
  let marked = 0;
  let notVisited = 0;
  let answeredMarked = 0;
  for (const q of questions) {
    const c = cells[q.id];
    const v = getQuestionVisualState(c);
    if (v === "not_visited") notVisited += 1;
    else if (v === "answered") answered += 1;
    else if (v === "not_answered") notAnswered += 1;
    else if (v === "marked") marked += 1;
    else if (v === "answered_marked") answeredMarked += 1;
  }
  return { answered, notAnswered, marked, notVisited, answeredMarked };
}
