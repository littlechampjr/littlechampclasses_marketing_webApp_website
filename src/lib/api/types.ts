export type ApiUser = {
  id: string;
  phoneE164: string;
  /** 10-digit national number (India) */
  phoneNational10: string;
  childName: string;
  learningGoal: string;
  childGrade: number | null;
  profileComplete: boolean;
  createdAt?: string;
};

export type ApiPurchaseFeatureCard = {
  iconEmoji: string;
  title: string;
  description: string;
};

export type ApiPurchaseDetailSection = {
  emoji: string;
  title: string;
  bullets: string[];
};

export type ApiPurchaseLimitedOffer = {
  label: string;
  crossedPricePaise: number | null;
  crossedPriceRupees: number | null;
  giftLabel: string;
};

/** Premium checkout CMS — present only when `purchaseFlow.enabled` on the course. */
export type ApiPurchaseFlowPayload = {
  enabled: true;
  bannerEyebrow: string;
  bannerSubtitle: string;
  previewCardProgramLine: string;
  previewCardBadge: string;
  dateLabel: string;
  dateRangeDisplay: string | null;
  subjectsLabel: string;
  subjects: string[];
  shortTagline: string;
  emiAvailableCopy: string;
  scheduleHeading: string;
  featureCards: ApiPurchaseFeatureCard[];
  scheduleBullets: string[];
  detailSections: ApiPurchaseDetailSection[];
  limitedOffers: ApiPurchaseLimitedOffer[];
};

export type ApiCourseBatch = {
  id: string;
  code: string;
  startsAt: string;
  endsAt: string;
  dateRangeLabel: string;
  bookingHeadingDefault: string;
};

export type ApiCourse = {
  id: string;
  title: string;
  slug: string;
  description: string;
  detailDescription: string;
  track: string;
  pricePaise: number;
  priceRupees: number;
  compareAtPricePaise: number | null;
  compareAtPriceRupees: number | null;
  liveSessionsFirst: number;
  liveSessionsSecond: number;
  totalLiveSessions: number;
  isDemo: boolean;
  previewVideoUrl: string;
  thumbnailUrl: string;
  marketingTitle: string;
  marketingBullets: string[];
  classStartsAt: string | null;
  isActive: boolean;
  bookDemoEnabled: boolean;
  batches: ApiCourseBatch[];
  purchaseFlow: ApiPurchaseFlowPayload | null;
};

export type ApiBooking = {
  id: string;
  amountPaise: number;
  amountRupees: number;
  currency: string;
  status: string;
  paymentRef: string;
  scheduledAt: string | null;
  notes: string;
  createdAt: string | null;
  course: {
    id: string;
    title: string;
    slug: string;
    previewVideoUrl: string;
    thumbnailUrl: string;
    liveSessionsFirst: number;
    liveSessionsSecond: number;
    totalLiveSessions: number;
    classStartsAt: string | null;
  } | null;
};

export type ApiLearnerClassSession = {
  id: string;
  title: string;
  subject: string;
  startsAt: string;
  startsAtLabel: string;
  durationMinutes: number;
  durationLabel: string;
  teacherName: string;
  teacherImageUrl: string;
  statusMicrocopy: string;
  hasAttachments: boolean;
  /** Google Meet or other live link; empty when not scheduled in CMS. */
  meetUrl: string;
  /** YYYY-MM-DD in SCHEDULE_TZ for this session. */
  scheduleDateYmd: string;
  /** e.g. "25 Apr · Sat" */
  dayLabel: string;
  isTomorrow: boolean;
};

export type ApiLearnerEnrollmentSummary = {
  enrollmentId: string;
  batchId: string;
  courseId: string;
  courseTitle: string;
  batchCode: string;
  dateRangeLabel: string;
  startsAt: string;
  endsAt: string;
  purchasedAt: string;
};

export type ApiLearnerDashboard = {
  hasPurchases: boolean;
  enrollments: ApiLearnerEnrollmentSummary[];
  defaultBatchId: string | null;
  selectedBatchId: string | null;
  todaySessions: ApiLearnerClassSession[];
  /** Next 7 days after end of “today” in SCHEDULE_TZ; used when today has no classes. */
  upcomingSessions: ApiLearnerClassSession[];
  weekHints: {
    todayYmd: string;
    weekMondayYmd: string;
  };
};

export type ApiScheduleDay = {
  ymd: string;
  dateLabel: string;
  weekdayShort: string;
  relativeLabel?: "Yesterday" | "Today" | "Tomorrow";
  sessions: ApiLearnerClassSession[];
};

export type ApiWeekSchedule = {
  timeZone: string;
  weekStartYmd: string;
  weekRangeLabel: string;
  weekOffset: number | null;
  days: ApiScheduleDay[];
};

export type ApiProgramTeacher = {
  id: string;
  name: string;
  imageUrl: string;
  subjectLabel: string;
  bioLine: string;
};

export type ApiProgramFaq = {
  id: string;
  question: string;
  answer: string;
};

export type ApiStudyChapter = {
  title: string;
  videoCount: number;
  exerciseCount: number;
  noteCount: number;
  sortOrder: number;
};

export type ApiStudySubject = {
  key: string;
  label: string;
  sortOrder: number;
  chapters: ApiStudyChapter[];
};

export type ApiEnrolledProgramEnrollment = {
  enrollmentId: string;
  batchId: string;
  courseId: string;
  batchCode: string;
  purchasedAt: string;
  batchDateRangeLabel: string;
};

export type ApiEnrolledProgramResponse = {
  isEnrolled: boolean;
  enrollment: ApiEnrolledProgramEnrollment;
  course: ApiCourse;
  teachers: ApiProgramTeacher[];
  faqs: ApiProgramFaq[];
  studyRoom: { subjects: ApiStudySubject[] };
};

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
