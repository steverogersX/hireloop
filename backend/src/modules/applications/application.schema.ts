import { z } from "zod";

const applicationStatus = z.enum([
  "APPLIED",
  "IN_REVIEW",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
]);

const source = z.enum(["DIRECT", "REFERRAL", "JOB_ALERT", "RECRUITER"]);

export const applySchema = z.object({
  jobId: z.string().min(1),
  coverLetter: z.string().max(10000).optional(),
  resumeUrl: z.string().url().optional(),
  salaryExpectation: z.number().int().nonnegative().optional(),
  availableFrom: z.string().max(60).optional(),
  source: source.default("DIRECT"),
});

export const updateApplicationStatusSchema = z.object({
  status: applicationStatus,
  note: z.string().max(400).optional(),
  nextStep: z.string().max(240).optional(),
});

export const applicationIdParamSchema = z.object({ id: z.string().min(1) });

export const listApplicationsQuerySchema = z.object({
  status: applicationStatus.optional(),
  jobId: z.string().optional(),
  q: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type ApplyInput = z.infer<typeof applySchema>;
export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;
export type ListApplicationsQuery = z.infer<typeof listApplicationsQuerySchema>;
