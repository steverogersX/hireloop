import { z } from "zod";

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

export const companyIdParamSchema = z.object({
  id: z.string().min(1),
});

export const companySlugParamSchema = z.object({
  slug: z.string().min(1),
});

export const listCompaniesQuerySchema = z.object({
  q: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
export type ListCompaniesQuery = z.infer<typeof listCompaniesQuerySchema>;
