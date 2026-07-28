import { z } from "zod";

const workMode = z.enum(["ONSITE", "HYBRID", "REMOTE"]);

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  headline: z.string().min(2).max(255).optional(),
  location: z.string().min(2).max(160).optional(),
  bio: z.string().max(2000).optional(),
  phone: z.string().max(40).optional(),
  website: z.string().max(200).optional(),
  github: z.string().max(200).optional(),
  linkedin: z.string().max(200).optional(),
  skills: z.array(z.string().min(1).max(40)).max(50).optional(),
  languages: z
    .array(z.object({ name: z.string().min(1).max(60), level: z.string().min(1).max(40) }))
    .max(20)
    .optional(),
  desiredRole: z.string().max(200).optional(),
  salaryExpectation: z.number().int().nonnegative().optional(),
  currency: z.string().length(3).toUpperCase().optional(),
  preferredWorkMode: workMode.optional(),
  noticePeriod: z.string().max(40).optional(),
  openToWork: z.boolean().optional(),
  willRelocate: z.boolean().optional(),
});

export const updateVisibilitySchema = z.object({
  searchable: z.boolean().optional(),
  showSalaryExpectation: z.boolean().optional(),
  hiddenFromCompanyIds: z.array(z.string().min(1)).max(50).optional(),
});

const experienceFields = z.object({
  role: z.string().min(2).max(200),
  company: z.string().min(1).max(160),
  location: z.string().max(160).optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  current: z.boolean().default(false),
  summary: z.string().max(2000).optional(),
  highlights: z.array(z.string().min(1).max(400)).max(10).default([]),
});

export const createExperienceSchema = experienceFields
  .refine((v) => v.current || v.endDate != null, {
    message: "Set an end date, or mark the role as current",
    path: ["endDate"],
  })
  .refine((v) => v.endDate == null || v.endDate >= v.startDate, {
    message: "endDate must be after startDate",
    path: ["endDate"],
  });

export const updateExperienceSchema = experienceFields.partial();

export const createEducationSchema = z.object({
  school: z.string().min(2).max(200),
  degree: z.string().min(2).max(240),
  startYear: z.number().int().min(1950).max(2100).optional(),
  endYear: z.number().int().min(1950).max(2100).optional(),
  detail: z.string().max(1000).optional(),
});

export const updateEducationSchema = createEducationSchema.partial();

export const createResumeSchema = z.object({
  name: z.string().min(1).max(200),
  url: z.string().url(),
  sizeBytes: z.number().int().nonnegative().default(0),
  isDefault: z.boolean().default(false),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateVisibilityInput = z.infer<typeof updateVisibilitySchema>;
export type CreateExperienceInput = z.infer<typeof createExperienceSchema>;
export type UpdateExperienceInput = z.infer<typeof updateExperienceSchema>;
export type CreateEducationInput = z.infer<typeof createEducationSchema>;
export type UpdateEducationInput = z.infer<typeof updateEducationSchema>;
export type CreateResumeInput = z.infer<typeof createResumeSchema>;
