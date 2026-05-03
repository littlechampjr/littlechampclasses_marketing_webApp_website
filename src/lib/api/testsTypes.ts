export type ApiTestListItem = {
  id: string;
  title: string;
  questionCount: number;
  totalMarks: number;
  durationMins: number;
  attemptsCount: number;
  startAt: string | null;
  recommended: boolean;
};

export type ApiTestSection = { id: string; title: string; order: number };

export type ApiTestDetail = {
  id: string;
  title: string;
  questionCount: number;
  totalMarks: number;
  durationMins: number;
  startAt: string | null;
  generalInstructions: string;
  testInstructions: string;
  sections: ApiTestSection[];
  attemptsCount: number;
};

export type ApiTestQuestion = {
  id: string;
  sectionId: string;
  type: "single";
  text: string;
  options: { id: string; text: string }[];
  marks: number;
  negativeMarks: number;
};

export type ApiTestAttempt = {
  id: string;
  testId: string;
  testTitle?: string;
  status: "in_progress" | "submitted";
  startedAt: string;
  endsAt: string;
};

export type StartAttemptResponse = {
  attempt: ApiTestAttempt;
  questions: ApiTestQuestion[];
};

export type GetAttemptResponse =
  | {
      finalized: true;
      attempt: { id: string; testId: string; status: string };
    }
  | {
      attempt: ApiTestAttempt;
      questions: ApiTestQuestion[];
    };

export type SubmitAttemptBody = {
  answers: {
    questionId: string;
    selectedOptionId: string | null;
    timeSpentSec: number;
  }[];
};

export type ResultSummary = {
  totalScore: number;
  maxScore: number;
  correct: number;
  incorrect: number;
  skipped: number;
  accuracyPct: number;
  completionPct: number;
  timeTakenSec: number;
};

export type ResultSectionRow = {
  sectionId: string;
  title: string;
  score: number;
  maxScore: number;
  correct: number;
  incorrect: number;
  skipped: number;
  accuracyPct: number;
  timeTakenSec: number;
};

export type PerQuestionResult = {
  questionId: string;
  status: "correct" | "incorrect" | "skipped";
  selectedOptionId: string | null;
  correctOptionId: string;
  marksAwarded: number;
  timeSpentSec: number;
  explanation: string;
};

export type GetResultResponse = {
  attemptId: string;
  test: { id: string; title: string };
  summary: ResultSummary;
  sectionRows: ResultSectionRow[];
  perQuestion: PerQuestionResult[];
};

export type ReviewQuestion = {
  id: string;
  sectionId: string;
  type: string;
  text: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  marks: number;
  negativeMarks: number;
  selectedOptionId: string | null;
  status: "correct" | "incorrect" | "skipped";
  timeSpentSec: number;
  explanation: string;
};

export type GetReviewResponse = {
  attemptId: string;
  test: { id: string; title: string };
  questions: ReviewQuestion[];
};
