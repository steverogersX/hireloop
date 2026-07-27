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

export const createJobSchema = z
  .object({
    title: z.string().min(3).max(200),
    description: z.string().min(20).max(20000),
    requirements: z.string().max(20000).optional(),
    location: z.string().min(2).max(160),
    workMode: workMode.default("ONSITE"),
    employmentType: employmentType.default("FULL_TIME"),
    experienceLevel: experienceLevel.default("MID"),
    salaryMin: z.number().int().nonnegative().optional(),
    salaryMax: z.number().int().nonnegative().optional(),
    currency: z.string().length(3).toUpperCase().default("USD"),
    skills: z.array(z.string().min(1).max(40)).max(30).default([]),
    status: jobStatus.default("DRAFT"),
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
  workMode: workMode.optional(),
  employmentType: employmentType.optional(),
  experienceLevel: experienceLevel.optional(),
  companyId: z.string().optional(),
  salaryMin: z.coerce.number().int().nonnegative().optional(),
  skills: z
    .union([z.string(), z.array(z.string())])
    .transform((v) => (Array.isArray(v) ? v : v.split(",")))
    .pipe(z.array(z.string().trim().min(1)))
    .optional(),
  sort: z.enum(["newest", "oldest", "salary"]).default("newest"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type ListJobsQuery = z.infer<typeof listJobsQuerySchema>;
