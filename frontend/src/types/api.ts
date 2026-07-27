export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiErrorBody {
  code: string;
  details?: unknown;
}

export interface ApiResponse<T = null> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  meta?: PaginationMeta;
  error?: ApiErrorBody;
  timestamp: string;
}

export type Role = "CANDIDATE" | "EMPLOYER" | "ADMIN";
export type WorkMode = "ONSITE" | "HYBRID" | "REMOTE";
export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP"
  | "TEMPORARY";
export type ExperienceLevel = "INTERN" | "ENTRY" | "MID" | "SENIOR" | "LEAD";
export type JobStatus = "DRAFT" | "PUBLISHED" | "CLOSED";
export type ApplicationStatus =
  | "APPLIED"
  | "IN_REVIEW"
  | "INTERVIEW"
  | "OFFER"
  | "REJECTED"
  | "WITHDRAWN";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl: string | null;
  headline: string | null;
  location: string | null;
  resumeUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  website: string | null;
  logoUrl: string | null;
  description: string | null;
  location: string | null;
  industry: string | null;
  size: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  companyId: string;
  title: string;
  slug: string;
  description: string;
  requirements: string | null;
  location: string;
  workMode: WorkMode;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;
  skills: string[];
  status: JobStatus;
  publishedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JobWithCompany extends Job {
  company: Company;
}

export interface SessionPayload {
  accessToken: string;
  user: User;
}
