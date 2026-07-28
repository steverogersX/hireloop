import { z } from "zod";

export const startThreadSchema = z.object({
  companyId: z.string().min(1),
  jobId: z.string().min(1).optional(),
  subject: z.string().min(2).max(240),
  body: z.string().min(1).max(5000),
});

export const sendMessageSchema = z.object({
  body: z.string().min(1).max(5000),
});

export const threadIdParamSchema = z.object({ id: z.string().min(1) });

export const listThreadsQuerySchema = z.object({
  q: z.string().trim().min(1).optional(),
  starred: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const updateThreadSchema = z.object({
  starred: z.boolean().optional(),
  archived: z.boolean().optional(),
});

export type StartThreadInput = z.infer<typeof startThreadSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type ListThreadsQuery = z.infer<typeof listThreadsQuerySchema>;
export type UpdateThreadInput = z.infer<typeof updateThreadSchema>;
