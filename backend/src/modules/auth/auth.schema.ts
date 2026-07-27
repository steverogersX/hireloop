import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).max(72),
  role: z.enum(["CANDIDATE", "EMPLOYER"]).default("CANDIDATE"),
});

export const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(1),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1).optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  headline: z.string().max(255).optional(),
  location: z.string().max(160).optional(),
  avatarUrl: z.string().url().optional(),
  resumeUrl: z.string().url().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
