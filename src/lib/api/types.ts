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

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
