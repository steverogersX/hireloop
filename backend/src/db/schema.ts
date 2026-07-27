import {
  index,
  integer,
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

export const jobs = pgTable(
  "jobs",
  {
    id: varchar("id", { length: 30 }).primaryKey().$defaultFn(createId),
    companyId: varchar("company_id", { length: 30 })
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 240 }).notNull(),
    description: text("description").notNull(),
    requirements: text("requirements"),
    location: varchar("location", { length: 160 }).notNull(),
    workMode: workModeEnum("work_mode").notNull().default("ONSITE"),
    employmentType: employmentTypeEnum("employment_type").notNull().default("FULL_TIME"),
    experienceLevel: experienceLevelEnum("experience_level").notNull().default("MID"),
    salaryMin: integer("salary_min"),
    salaryMax: integer("salary_max"),
    currency: varchar("currency", { length: 3 }).notNull().default("USD"),
    skills: text("skills").array().notNull().default([]),
    status: jobStatusEnum("status").notNull().default("DRAFT"),
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
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("saved_jobs_job_user_key").on(t.jobId, t.userId)],
);

export const usersRelations = relations(users, ({ one, many }) => ({
  company: one(companies, { fields: [users.id], references: [companies.ownerId] }),
  applications: many(applications),
  savedJobs: many(savedJobs),
  refreshTokens: many(refreshTokens),
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, { fields: [refreshTokens.userId], references: [users.id] }),
}));

export const companiesRelations = relations(companies, ({ one, many }) => ({
  owner: one(users, { fields: [companies.ownerId], references: [users.id] }),
  jobs: many(jobs),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  company: one(companies, { fields: [jobs.companyId], references: [companies.id] }),
  applications: many(applications),
  savedBy: many(savedJobs),
}));

export const applicationsRelations = relations(applications, ({ one }) => ({
  job: one(jobs, { fields: [applications.jobId], references: [jobs.id] }),
  candidate: one(users, { fields: [applications.candidateId], references: [users.id] }),
}));

export const savedJobsRelations = relations(savedJobs, ({ one }) => ({
  job: one(jobs, { fields: [savedJobs.jobId], references: [jobs.id] }),
  user: one(users, { fields: [savedJobs.userId], references: [users.id] }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
export type Role = (typeof roleEnum.enumValues)[number];
