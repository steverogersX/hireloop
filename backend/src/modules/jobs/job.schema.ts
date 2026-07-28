import { z } from "zod";

const employmentType = z.enum([
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "TEMPORARY",
]);
const workMode = z.enum(["ONSITE", "HYBRID", "REMOTE"]);
const experienceLevel = z.enum(["INTERN", "ENTRY", "MID", "SENIOR", "LEAD"]);
const jobStatus = z.enum(["DRAFT", "PUBLISHED", "CLOSED"]);

const csv = z
  .union([z.string(), z.array(z.string())])
  .transform((v) => (Array.isArray(v) ? v : v.split(",")))
  .pipe(z.array(z.string().trim().min(1)));

export const createJobSchema = z
  .object({
    title: z.string().min(3).max(200),
    summary: z.string().max(400).optional(),
    description: z.string().min(20).max(20000),
    requirements: z.string().max(20000).optional(),
    responsibilities: z.array(z.string().min(1).max(400)).max(20).default([]),
    niceToHave: z.array(z.string().min(1).max(400)).max(20).default([]),
    location: z.string().min(2).max(160),
    workMode: workMode.default("ONSITE"),
    employmentType: employmentType.default("FULL_TIME"),
    experienceLevel: experienceLevel.default("MID"),
    salaryMin: z.number().int().nonnegative().optional(),
    salaryMax: z.number().int().nonnegative().optional(),
    currency: z.string().length(3).toUpperCase().default("USD"),
    equity: z.string().max(60).optional(),
    skills: z.array(z.string().min(1).max(40)).max(30).default([]),
    status: jobStatus.default("DRAFT"),
    urgent: z.boolean().default(false),
    easyApply: z.boolean().default(true),
    respondsInDays: z.number().int().min(1).max(90).optional(),
    expiresAt: z.coerce.date().optional(),
  })
  .refine((v) => v.salaryMin == null || v.salaryMax == null || v.salaryMax >= v.salaryMin, {
    message: "salaryMax must be greater than or equal to salaryMin",
    path: ["salaryMax"],
  });

export const updateJobSchema = createJobSchema.innerType().partial();

export const jobIdParamSchema = z.object({ id: z.string().min(1) });
export const jobSlugParamSchema = z.object({ slug: z.string().min(1) });

export const listJobsQuerySchema = z.object({
  q: z.string().trim().min(1).optional(),
  location: z.string().trim().min(1).optional(),
  workMode: csv.pipe(z.array(workMode)).optional(),
  employmentType: csv.pipe(z.array(employmentType)).optional(),
  experienceLevel: csv.pipe(z.array(experienceLevel)).optional(),
  companyId: csv.optional(),
  salaryMin: z.coerce.number().int().nonnegative().optional(),
  skills: csv.optional(),
  postedWithinHours: z.coerce.number().int().min(1).max(8760).optional(),
  easyApplyOnly: z.coerce.boolean().optional(),
  minMatch: z.coerce.number().int().min(0).max(100).optional(),
  excludeApplied: z.coerce.boolean().optional(),
  sort: z.enum(["newest", "oldest", "salary", "match", "applicants"]).default("newest"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type ListJobsQuery = z.infer<typeof listJobsQuerySchema>;
