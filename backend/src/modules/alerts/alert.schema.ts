import { z } from "zod";

const frequency = z.enum(["INSTANT", "DAILY", "WEEKLY"]);
const channel = z.enum(["EMAIL", "PUSH"]);

export const createAlertSchema = z.object({
  query: z.string().min(2).max(200),
  location: z.string().max(160).optional(),
  frequency: frequency.default("DAILY"),
  channels: z.array(channel).min(1).max(2).default(["EMAIL"]),
  filters: z.record(z.unknown()).default({}),
  active: z.boolean().default(true),
});

export const updateAlertSchema = createAlertSchema.partial();

export const createSavedSearchSchema = z.object({
  name: z.string().min(2).max(160),
  params: z.record(z.unknown()).default({}),
});

export const alertIdParamSchema = z.object({ id: z.string().min(1) });

export type CreateAlertInput = z.infer<typeof createAlertSchema>;
export type UpdateAlertInput = z.infer<typeof updateAlertSchema>;
export type CreateSavedSearchInput = z.infer<typeof createSavedSearchSchema>;
