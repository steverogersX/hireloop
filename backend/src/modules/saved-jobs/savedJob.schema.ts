import { z } from "zod";

const folder = z.enum(["SHORTLIST", "MAYBE", "RESEARCHING"]);

export const saveJobSchema = z.object({
  jobId: z.string().min(1),
  folder: folder.default("SHORTLIST"),
  note: z.string().max(500).optional(),
});

export const updateSavedJobSchema = z.object({
  folder: folder.optional(),
  note: z.string().max(500).optional(),
});

export const savedJobParamSchema = z.object({
  jobId: z.string().min(1),
});

export const listSavedJobsQuerySchema = z.object({
  folder: folder.optional(),
  q: z.string().trim().min(1).optional(),
  sort: z.enum(["recent", "match"]).default("recent"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type SaveJobInput = z.infer<typeof saveJobSchema>;
export type UpdateSavedJobInput = z.infer<typeof updateSavedJobSchema>;
export type ListSavedJobsQuery = z.infer<typeof listSavedJobsQuerySchema>;
