import { z } from "zod";

const mode = z.enum(["VIDEO", "PHONE", "ONSITE"]);
const status = z.enum(["CONFIRMED", "AWAITING", "COMPLETED", "CANCELLED"]);

export const scheduleInterviewSchema = z.object({
  applicationId: z.string().min(1),
  round: z.string().min(2).max(160),
  scheduledAt: z.coerce.date(),
  durationMins: z.number().int().min(5).max(480).default(45),
  mode: mode.default("VIDEO"),
  interviewerName: z.string().max(120).optional(),
  interviewerTitle: z.string().max(160).optional(),
  status: status.default("AWAITING"),
  notes: z.string().max(4000).optional(),
});

export const updateInterviewSchema = scheduleInterviewSchema.partial().omit({
  applicationId: true,
});

export const listInterviewsQuerySchema = z.object({
  upcoming: z.coerce.boolean().default(true),
  days: z.coerce.number().int().min(1).max(365).default(30),
});

export const interviewIdParamSchema = z.object({ id: z.string().min(1) });

export type ScheduleInterviewInput = z.infer<typeof scheduleInterviewSchema>;
export type UpdateInterviewInput = z.infer<typeof updateInterviewSchema>;
export type ListInterviewsQuery = z.infer<typeof listInterviewsQuerySchema>;
