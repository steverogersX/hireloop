import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createId } from "@/utils/id";

export const roleEnum = pgEnum("role", ["CANDIDATE", "EMPLOYER", "ADMIN"]);

export const employmentTypeEnum = pgEnum("employment_type", [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "TEMPORARY",
]);

export const workModeEnum = pgEnum("work_mode", ["ONSITE", "HYBRID", "REMOTE"]);

export const experienceLevelEnum = pgEnum("experience_level", [
  "INTERN",
  "ENTRY",
  "MID",
  "SENIOR",
  "LEAD",
]);

export const jobStatusEnum = pgEnum("job_status", ["DRAFT", "PUBLISHED", "CLOSED"]);

export const applicationStatusEnum = pgEnum("application_status", [
  "APPLIED",
  "IN_REVIEW",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
]);

export const applicationSourceEnum = pgEnum("application_source", [
  "DIRECT",
  "REFERRAL",
  "JOB_ALERT",
  "RECRUITER",
]);

export const savedFolderEnum = pgEnum("saved_folder", [
  "SHORTLIST",
  "MAYBE",
  "RESEARCHING",
]);

export const alertFrequencyEnum = pgEnum("alert_frequency", [
  "INSTANT",
  "DAILY",
  "WEEKLY",
]);

export const interviewModeEnum = pgEnum("interview_mode", ["VIDEO", "PHONE", "ONSITE"]);

export const interviewStatusEnum = pgEnum("interview_status", [
  "CONFIRMED",
  "AWAITING",
  "COMPLETED",
  "CANCELLED",
]);

export const activityKindEnum = pgEnum("activity_kind", [
  "VIEW",
  "STAGE",
  "MESSAGE",
  "MATCH",
  "INVITE",
]);

export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 30 }).primaryKey().$defaultFn(createId),
    email: varchar("email", { length: 255 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    role: roleEnum("role").notNull().default("CANDIDATE"),
    avatarUrl: text("avatar_url"),
    headline: varchar("headline", { length: 255 }),
    location: varchar("location", { length: 160 }),
    resumeUrl: text("resume_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [uniqueIndex("users_email_key").on(t.email)],
);

export const refreshTokens = pgTable(
  "refresh_tokens",
  {
    id: varchar("id", { length: 30 }).primaryKey().$defaultFn(createId),
    token: text("token").notNull(),
    userId: varchar("user_id", { length: 30 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("refresh_tokens_token_key").on(t.token),
    index("refresh_tokens_user_id_idx").on(t.userId),
  ],
);

export const candidateProfiles = pgTable(
  "candidate_profiles",
  {
    id: varchar("id", { length: 30 }).primaryKey().$defaultFn(createId),
    userId: varchar("user_id", { length: 30 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    bio: text("bio"),
    phone: varchar("phone", { length: 40 }),
    website: varchar("website", { length: 200 }),
    github: varchar("github", { length: 200 }),
    linkedin: varchar("linkedin", { length: 200 }),
    skills: text("skills").array().notNull().default([]),
    languages: jsonb("languages")
      .$type<{ name: string; level: string }[]>()
      .notNull()
      .default([]),
    desiredRole: varchar("desired_role", { length: 200 }),
    salaryExpectation: integer("salary_expectation"),
    currency: varchar("currency", { length: 3 }).notNull().default("EUR"),
    preferredWorkMode: workModeEnum("preferred_work_mode"),
    noticePeriod: varchar("notice_period", { length: 40 }),
    openToWork: boolean("open_to_work").notNull().default(true),
    willRelocate: boolean("will_relocate").notNull().default(false),
    searchable: boolean("searchable").notNull().default(true),
    hiddenFromCompanyIds: text("hidden_from_company_ids").array().notNull().default([]),
    showSalaryExpectation: boolean("show_salary_expectation").notNull().default(false),
    profileViews: integer("profile_views").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [uniqueIndex("candidate_profiles_user_id_key").on(t.userId)],
);

export const experiences = pgTable(
  "experiences",
  {
    id: varchar("id", { length: 30 }).primaryKey().$defaultFn(createId),
    userId: varchar("user_id", { length: 30 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 200 }).notNull(),
    company: varchar("company", { length: 160 }).notNull(),
    location: varchar("location", { length: 160 }),
    startDate: timestamp("start_date", { withTimezone: true }).notNull(),
    endDate: timestamp("end_date", { withTimezone: true }),
    current: boolean("current").notNull().default(false),
    summary: text("summary"),
    highlights: text("highlights").array().notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("experiences_user_id_idx").on(t.userId)],
);

export const educations = pgTable(
  "educations",
  {
    id: varchar("id", { length: 30 }).primaryKey().$defaultFn(createId),
    userId: varchar("user_id", { length: 30 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    school: varchar("school", { length: 200 }).notNull(),
    degree: varchar("degree", { length: 240 }).notNull(),
    startYear: integer("start_year"),
    endYear: integer("end_year"),
    detail: text("detail"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("educations_user_id_idx").on(t.userId)],
);

export const resumes = pgTable(
  "resumes",
  {
    id: varchar("id", { length: 30 }).primaryKey().$defaultFn(createId),
    userId: varchar("user_id", { length: 30 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 200 }).notNull(),
    url: text("url").notNull(),
    sizeBytes: integer("size_bytes").notNull().default(0),
    isDefault: boolean("is_default").notNull().default(false),
    usedCount: integer("used_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index("resumes_user_id_idx").on(t.userId)],
);

export const companies = pgTable(
  "companies",
  {
    id: varchar("id", { length: 30 }).primaryKey().$defaultFn(createId),
    ownerId: varchar("owner_id", { length: 30 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 160 }).notNull(),
    slug: varchar("slug", { length: 200 }).notNull(),
    website: text("website"),
    logoUrl: text("logo_url"),
    description: text("description"),
    location: varchar("location", { length: 160 }),
    industry: varchar("industry", { length: 120 }),
    size: varchar("size", { length: 40 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    uniqueIndex("companies_slug_key").on(t.slug),
    uniqueIndex("companies_owner_id_key").on(t.ownerId),
  ],
);

export const companyProfiles = pgTable(
  "company_profiles",
  {
    id: varchar("id", { length: 30 }).primaryKey().$defaultFn(createId),
    companyId: varchar("company_id", { length: 30 })
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    tagline: varchar("tagline", { length: 240 }),
    about: text("about"),
    founded: varchar("founded", { length: 10 }),
    funding: varchar("funding", { length: 60 }),
    rating: integer("rating").notNull().default(0),
    benefits: text("benefits").array().notNull().default([]),
    values: jsonb("values").$type<{ title: string; detail: string }[]>().notNull().default([]),
    offices: jsonb("offices").$type<{ city: string; people: string }[]>().notNull().default([]),
    metrics: jsonb("metrics")
      .$type<{ label: string; value: string; hint: string }[]>()
      .notNull()
      .default([]),
    ratingBreakdown: jsonb("rating_breakdown")
      .$type<{ label: string; score: number }[]>()
      .notNull()
      .default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [uniqueIndex("company_profiles_company_id_key").on(t.companyId)],
);

export const companyTeamMembers = pgTable(
  "company_team_members",
  {
    id: varchar("id", { length: 30 }).primaryKey().$defaultFn(createId),
    companyId: varchar("company_id", { length: 30 })
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 120 }).notNull(),
    role: varchar("role", { length: 160 }).notNull(),
    position: integer("position").notNull().default(0),
  },
  (t) => [index("company_team_members_company_id_idx").on(t.companyId)],
);

export const hiringProcessSteps = pgTable(
  "hiring_process_steps",
  {
    id: varchar("id", { length: 30 }).primaryKey().$defaultFn(createId),
    companyId: varchar("company_id", { length: 30 })
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    position: integer("position").notNull().default(0),
    step: varchar("step", { length: 160 }).notNull(),
    detail: text("detail").notNull(),
    duration: varchar("duration", { length: 60 }),
  },
  (t) => [index("hiring_process_steps_company_id_idx").on(t.companyId)],
);

export const companyReviews = pgTable(
  "company_reviews",
  {
    id: varchar("id", { length: 30 }).primaryKey().$defaultFn(createId),
    companyId: varchar("company_id", { length: 30 })
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    authorId: varchar("author_id", { length: 30 }).references(() => users.id, {
      onDelete: "set null",
    }),
    title: varchar("title", { length: 200 }).notNull(),
    body: text("body").notNull(),
    rating: integer("rating").notNull(),
    roleTitle: varchar("role_title", { length: 160 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("company_reviews_company_id_idx").on(t.companyId)],
);

export const companyFollows = pgTable(
  "company_follows",
  {
    id: varchar("id", { length: 30 }).primaryKey().$defaultFn(createId),
    userId: varchar("user_id", { length: 30 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    companyId: varchar("company_id", { length: 30 })
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("company_follows_user_company_key").on(t.userId, t.companyId)],
);

export const jobs = pgTable(
  "jobs",
  {
    id: varchar("id", { length: 30 }).primaryKey().$defaultFn(createId),
    companyId: varchar("company_id", { length: 30 })
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 240 }).notNull(),
    summary: varchar("summary", { length: 400 }),
    description: text("description").notNull(),
    requirements: text("requirements"),
    responsibilities: text("responsibilities").array().notNull().default([]),
    niceToHave: text("nice_to_have").array().notNull().default([]),
    location: varchar("location", { length: 160 }).notNull(),
    workMode: workModeEnum("work_mode").notNull().default("ONSITE"),
    employmentType: employmentTypeEnum("employment_type").notNull().default("FULL_TIME"),
    experienceLevel: experienceLevelEnum("experience_level").notNull().default("MID"),
    salaryMin: integer("salary_min"),
    salaryMax: integer("salary_max"),
    currency: varchar("currency", { length: 3 }).notNull().default("USD"),
    equity: varchar("equity", { length: 60 }),
    skills: text("skills").array().notNull().default([]),
    status: jobStatusEnum("status").notNull().default("DRAFT"),
    urgent: boolean("urgent").notNull().default(false),
    easyApply: boolean("easy_apply").notNull().default(true),
    respondsInDays: integer("responds_in_days"),
    viewCount: integer("view_count").notNull().default(0),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    uniqueIndex("jobs_slug_key").on(t.slug),
    index("jobs_status_published_at_idx").on(t.status, t.publishedAt),
    index("jobs_company_id_idx").on(t.companyId),
  ],
);

export const applications = pgTable(
  "applications",
  {
    id: varchar("id", { length: 30 }).primaryKey().$defaultFn(createId),
    jobId: varchar("job_id", { length: 30 })
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    candidateId: varchar("candidate_id", { length: 30 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    coverLetter: text("cover_letter"),
    resumeUrl: text("resume_url"),
    status: applicationStatusEnum("status").notNull().default("APPLIED"),
    source: applicationSourceEnum("source").notNull().default("DIRECT"),
    nextStep: varchar("next_step", { length: 240 }),
    salaryExpectation: integer("salary_expectation"),
    availableFrom: varchar("available_from", { length: 60 }),
    lastActivityAt: timestamp("last_activity_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    uniqueIndex("applications_job_candidate_key").on(t.jobId, t.candidateId),
    index("applications_candidate_id_idx").on(t.candidateId),
  ],
);

export const applicationEvents = pgTable(
  "application_events",
  {
    id: varchar("id", { length: 30 }).primaryKey().$defaultFn(createId),
    applicationId: varchar("application_id", { length: 30 })
      .notNull()
      .references(() => applications.id, { onDelete: "cascade" }),
    status: applicationStatusEnum("status").notNull(),
    note: varchar("note", { length: 400 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("application_events_application_id_idx").on(t.applicationId)],
);

export const interviews = pgTable(
  "interviews",
  {
    id: varchar("id", { length: 30 }).primaryKey().$defaultFn(createId),
    applicationId: varchar("application_id", { length: 30 })
      .notNull()
      .references(() => applications.id, { onDelete: "cascade" }),
    round: varchar("round", { length: 160 }).notNull(),
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }).notNull(),
    durationMins: integer("duration_mins").notNull().default(45),
    mode: interviewModeEnum("mode").notNull().default("VIDEO"),
    interviewerName: varchar("interviewer_name", { length: 120 }),
    interviewerTitle: varchar("interviewer_title", { length: 160 }),
    status: interviewStatusEnum("status").notNull().default("AWAITING"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("interviews_application_id_idx").on(t.applicationId)],
);

export const savedJobs = pgTable(
  "saved_jobs",
  {
    id: varchar("id", { length: 30 }).primaryKey().$defaultFn(createId),
    jobId: varchar("job_id", { length: 30 })
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    userId: varchar("user_id", { length: 30 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    folder: savedFolderEnum("folder").notNull().default("SHORTLIST"),
    note: varchar("note", { length: 500 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("saved_jobs_job_user_key").on(t.jobId, t.userId)],
);

export const jobAlerts = pgTable(
  "job_alerts",
  {
    id: varchar("id", { length: 30 }).primaryKey().$defaultFn(createId),
    userId: varchar("user_id", { length: 30 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    query: varchar("query", { length: 200 }).notNull(),
    location: varchar("location", { length: 160 }),
    frequency: alertFrequencyEnum("frequency").notNull().default("DAILY"),
    channels: text("channels").array().notNull().default(["EMAIL"]),
    filters: jsonb("filters").$type<Record<string, unknown>>().notNull().default({}),
    active: boolean("active").notNull().default(true),
    matchesTotal: integer("matches_total").notNull().default(0),
    lastSentAt: timestamp("last_sent_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index("job_alerts_user_id_idx").on(t.userId)],
);

export const savedSearches = pgTable(
  "saved_searches",
  {
    id: varchar("id", { length: 30 }).primaryKey().$defaultFn(createId),
    userId: varchar("user_id", { length: 30 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 160 }).notNull(),
    params: jsonb("params").$type<Record<string, unknown>>().notNull().default({}),
    lastRunAt: timestamp("last_run_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("saved_searches_user_id_idx").on(t.userId)],
);

export const messageThreads = pgTable(
  "message_threads",
  {
    id: varchar("id", { length: 30 }).primaryKey().$defaultFn(createId),
    subject: varchar("subject", { length: 240 }).notNull(),
    candidateId: varchar("candidate_id", { length: 30 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    companyId: varchar("company_id", { length: 30 })
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    jobId: varchar("job_id", { length: 30 }).references(() => jobs.id, {
      onDelete: "set null",
    }),
    starredByCandidate: boolean("starred_by_candidate").notNull().default(false),
    archivedByCandidate: boolean("archived_by_candidate").notNull().default(false),
    lastMessageAt: timestamp("last_message_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("message_threads_candidate_id_idx").on(t.candidateId),
    index("message_threads_company_id_idx").on(t.companyId),
  ],
);

export const messages = pgTable(
  "messages",
  {
    id: varchar("id", { length: 30 }).primaryKey().$defaultFn(createId),
    threadId: varchar("thread_id", { length: 30 })
      .notNull()
      .references(() => messageThreads.id, { onDelete: "cascade" }),
    senderId: varchar("sender_id", { length: 30 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    readAt: timestamp("read_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("messages_thread_id_idx").on(t.threadId)],
);

export const activityItems = pgTable(
  "activity_items",
  {
    id: varchar("id", { length: 30 }).primaryKey().$defaultFn(createId),
    userId: varchar("user_id", { length: 30 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    kind: activityKindEnum("kind").notNull(),
    title: varchar("title", { length: 240 }).notNull(),
    detail: varchar("detail", { length: 400 }),
    href: varchar("href", { length: 240 }),
    readAt: timestamp("read_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("activity_items_user_id_idx").on(t.userId, t.createdAt)],
);

export const notificationPreferences = pgTable(
  "notification_preferences",
  {
    id: varchar("id", { length: 30 }).primaryKey().$defaultFn(createId),
    userId: varchar("user_id", { length: 30 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    key: varchar("key", { length: 60 }).notNull(),
    email: boolean("email").notNull().default(true),
    push: boolean("push").notNull().default(false),
  },
  (t) => [uniqueIndex("notification_preferences_user_key").on(t.userId, t.key)],
);

export const connectedAccounts = pgTable(
  "connected_accounts",
  {
    id: varchar("id", { length: 30 }).primaryKey().$defaultFn(createId),
    userId: varchar("user_id", { length: 30 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: varchar("provider", { length: 60 }).notNull(),
    connected: boolean("connected").notNull().default(false),
    connectedAt: timestamp("connected_at", { withTimezone: true }),
  },
  (t) => [uniqueIndex("connected_accounts_user_provider_key").on(t.userId, t.provider)],
);

export const usersRelations = relations(users, ({ one, many }) => ({
  company: one(companies, { fields: [users.id], references: [companies.ownerId] }),
  profile: one(candidateProfiles, {
    fields: [users.id],
    references: [candidateProfiles.userId],
  }),
  experiences: many(experiences),
  educations: many(educations),
  resumes: many(resumes),
  applications: many(applications),
  savedJobs: many(savedJobs),
  refreshTokens: many(refreshTokens),
  alerts: many(jobAlerts),
  savedSearches: many(savedSearches),
  follows: many(companyFollows),
  activity: many(activityItems),
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, { fields: [refreshTokens.userId], references: [users.id] }),
}));

export const candidateProfilesRelations = relations(candidateProfiles, ({ one }) => ({
  user: one(users, { fields: [candidateProfiles.userId], references: [users.id] }),
}));

export const experiencesRelations = relations(experiences, ({ one }) => ({
  user: one(users, { fields: [experiences.userId], references: [users.id] }),
}));

export const educationsRelations = relations(educations, ({ one }) => ({
  user: one(users, { fields: [educations.userId], references: [users.id] }),
}));

export const resumesRelations = relations(resumes, ({ one }) => ({
  user: one(users, { fields: [resumes.userId], references: [users.id] }),
}));

export const companiesRelations = relations(companies, ({ one, many }) => ({
  owner: one(users, { fields: [companies.ownerId], references: [users.id] }),
  profile: one(companyProfiles, {
    fields: [companies.id],
    references: [companyProfiles.companyId],
  }),
  jobs: many(jobs),
  team: many(companyTeamMembers),
  process: many(hiringProcessSteps),
  reviews: many(companyReviews),
  followers: many(companyFollows),
}));

export const companyProfilesRelations = relations(companyProfiles, ({ one }) => ({
  company: one(companies, {
    fields: [companyProfiles.companyId],
    references: [companies.id],
  }),
}));

export const companyTeamMembersRelations = relations(companyTeamMembers, ({ one }) => ({
  company: one(companies, {
    fields: [companyTeamMembers.companyId],
    references: [companies.id],
  }),
}));

export const hiringProcessStepsRelations = relations(hiringProcessSteps, ({ one }) => ({
  company: one(companies, {
    fields: [hiringProcessSteps.companyId],
    references: [companies.id],
  }),
}));

export const companyReviewsRelations = relations(companyReviews, ({ one }) => ({
  company: one(companies, {
    fields: [companyReviews.companyId],
    references: [companies.id],
  }),
  author: one(users, { fields: [companyReviews.authorId], references: [users.id] }),
}));

export const companyFollowsRelations = relations(companyFollows, ({ one }) => ({
  company: one(companies, {
    fields: [companyFollows.companyId],
    references: [companies.id],
  }),
  user: one(users, { fields: [companyFollows.userId], references: [users.id] }),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  company: one(companies, { fields: [jobs.companyId], references: [companies.id] }),
  applications: many(applications),
  savedBy: many(savedJobs),
}));

export const applicationsRelations = relations(applications, ({ one, many }) => ({
  job: one(jobs, { fields: [applications.jobId], references: [jobs.id] }),
  candidate: one(users, { fields: [applications.candidateId], references: [users.id] }),
  events: many(applicationEvents),
  interviews: many(interviews),
}));

export const applicationEventsRelations = relations(applicationEvents, ({ one }) => ({
  application: one(applications, {
    fields: [applicationEvents.applicationId],
    references: [applications.id],
  }),
}));

export const interviewsRelations = relations(interviews, ({ one }) => ({
  application: one(applications, {
    fields: [interviews.applicationId],
    references: [applications.id],
  }),
}));

export const savedJobsRelations = relations(savedJobs, ({ one }) => ({
  job: one(jobs, { fields: [savedJobs.jobId], references: [jobs.id] }),
  user: one(users, { fields: [savedJobs.userId], references: [users.id] }),
}));

export const jobAlertsRelations = relations(jobAlerts, ({ one }) => ({
  user: one(users, { fields: [jobAlerts.userId], references: [users.id] }),
}));

export const savedSearchesRelations = relations(savedSearches, ({ one }) => ({
  user: one(users, { fields: [savedSearches.userId], references: [users.id] }),
}));

export const messageThreadsRelations = relations(messageThreads, ({ one, many }) => ({
  candidate: one(users, {
    fields: [messageThreads.candidateId],
    references: [users.id],
  }),
  company: one(companies, {
    fields: [messageThreads.companyId],
    references: [companies.id],
  }),
  job: one(jobs, { fields: [messageThreads.jobId], references: [jobs.id] }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  thread: one(messageThreads, {
    fields: [messages.threadId],
    references: [messageThreads.id],
  }),
  sender: one(users, { fields: [messages.senderId], references: [users.id] }),
}));

export const activityItemsRelations = relations(activityItems, ({ one }) => ({
  user: one(users, { fields: [activityItems.userId], references: [users.id] }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type CandidateProfile = typeof candidateProfiles.$inferSelect;
export type Experience = typeof experiences.$inferSelect;
export type Education = typeof educations.$inferSelect;
export type Resume = typeof resumes.$inferSelect;
export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
export type CompanyProfile = typeof companyProfiles.$inferSelect;
export type CompanyReview = typeof companyReviews.$inferSelect;
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
export type ApplicationEvent = typeof applicationEvents.$inferSelect;
export type Interview = typeof interviews.$inferSelect;
export type SavedJob = typeof savedJobs.$inferSelect;
export type JobAlert = typeof jobAlerts.$inferSelect;
export type SavedSearch = typeof savedSearches.$inferSelect;
export type MessageThread = typeof messageThreads.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type ActivityItem = typeof activityItems.$inferSelect;
export type NotificationPreference = typeof notificationPreferences.$inferSelect;
export type ConnectedAccount = typeof connectedAccounts.$inferSelect;
export type Role = (typeof roleEnum.enumValues)[number];
export type ApplicationStatus = (typeof applicationStatusEnum.enumValues)[number];
