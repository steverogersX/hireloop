import { z } from "zod";

const csv = z
  .union([z.string(), z.array(z.string())])
  .transform((v) => (Array.isArray(v) ? v : v.split(",")))
  .pipe(z.array(z.string().trim().min(1)));

export const createCompanySchema = z.object({
  name: z.string().min(2).max(160),
  website: z.string().url().optional(),
  logoUrl: z.string().url().optional(),
  description: z.string().max(5000).optional(),
  location: z.string().max(160).optional(),
  industry: z.string().max(120).optional(),
  size: z.string().max(40).optional(),
});

export const updateCompanySchema = createCompanySchema.partial();

export const updateCompanyProfileSchema = z.object({
  tagline: z.string().max(240).optional(),
  about: z.string().max(5000).optional(),
  founded: z.string().max(10).optional(),
  funding: z.string().max(60).optional(),
  rating: z.number().int().min(0).max(50).optional(),
  benefits: z.array(z.string().min(1).max(240)).max(20).optional(),
  values: z
    .array(z.object({ title: z.string().min(1).max(120), detail: z.string().min(1).max(400) }))
    .max(10)
    .optional(),
  offices: z
    .array(z.object({ city: z.string().min(1).max(120), people: z.string().min(1).max(60) }))
    .max(20)
    .optional(),
  metrics: z
    .array(
      z.object({
        label: z.string().min(1).max(80),
        value: z.string().min(1).max(40),
        hint: z.string().max(120),
      }),
    )
    .max(10)
    .optional(),
  ratingBreakdown: z
    .array(z.object({ label: z.string().min(1).max(80), score: z.number().int().min(0).max(100) }))
    .max(10)
    .optional(),
});

export const teamMemberSchema = z.object({
  name: z.string().min(2).max(120),
  role: z.string().min(2).max(160),
  position: z.number().int().min(0).default(0),
});

export const processStepSchema = z.object({
  step: z.string().min(2).max(160),
  detail: z.string().min(2).max(1000),
  duration: z.string().max(60).optional(),
  position: z.number().int().min(0).default(0),
});

export const createReviewSchema = z.object({
  title: z.string().min(4).max(200),
  body: z.string().min(20).max(4000),
  rating: z.number().int().min(1).max(5),
  roleTitle: z.string().max(160).optional(),
});

export const companyIdParamSchema = z.object({ id: z.string().min(1) });
export const companySlugParamSchema = z.object({ slug: z.string().min(1) });

export const listCompaniesQuerySchema = z.object({
  q: z.string().trim().min(1).optional(),
  industry: csv.optional(),
  size: csv.optional(),
  minRating: z.coerce.number().int().min(0).max(50).optional(),
  hiringOnly: z.coerce.boolean().optional(),
  followedOnly: z.coerce.boolean().optional(),
  sort: z.enum(["roles", "rating", "name", "newest"]).default("roles"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
export type UpdateCompanyProfileInput = z.infer<typeof updateCompanyProfileSchema>;
export type TeamMemberInput = z.infer<typeof teamMemberSchema>;
export type ProcessStepInput = z.infer<typeof processStepSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type ListCompaniesQuery = z.infer<typeof listCompaniesQuerySchema>;
