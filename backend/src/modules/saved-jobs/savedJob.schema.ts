import { z } from "zod";

export const saveJobSchema = z.object({
  jobId: z.string().min(1),
});

export const savedJobParamSchema = z.object({
  jobId: z.string().min(1),
});

export const listSavedJobsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type SaveJobInput = z.infer<typeof saveJobSchema>;
export type ListSavedJobsQuery = z.infer<typeof listSavedJobsQuerySchema>;
