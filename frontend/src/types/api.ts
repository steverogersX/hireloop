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
export type ApplicationSource = "DIRECT" | "REFERRAL" | "JOB_ALERT" | "RECRUITER";
export type SavedFolder = "SHORTLIST" | "MAYBE" | "RESEARCHING";
export type AlertFrequency = "INSTANT" | "DAILY" | "WEEKLY";
export type InterviewMode = "VIDEO" | "PHONE" | "ONSITE";
export type InterviewStatus = "CONFIRMED" | "AWAITING" | "COMPLETED" | "CANCELLED";
export type ActivityKind = "VIEW" | "STAGE" | "MESSAGE" | "MATCH" | "INVITE";

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

export interface CandidateProfile {
  id: string;
  userId: string;
  bio: string | null;
  phone: string | null;
  website: string | null;
  github: string | null;
  linkedin: string | null;
  skills: string[];
  languages: { name: string; level: string }[];
  desiredRole: string | null;
  salaryExpectation: number | null;
  currency: string;
  preferredWorkMode: WorkMode | null;
  noticePeriod: string | null;
  openToWork: boolean;
  willRelocate: boolean;
  searchable: boolean;
  hiddenFromCompanyIds: string[];
  showSalaryExpectation: boolean;
  profileViews: number;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  current: boolean;
  summary: string | null;
  highlights: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  startYear: number | null;
  endYear: number | null;
  detail: string | null;
}

export interface Resume {
  id: string;
  name: string;
  url: string;
  sizeBytes: number;
  isDefault: boolean;
  usedCount: number;
  updatedAt: string;
}

export interface ProfileStrength {
  score: number;
  gaps: { label: string; weight: number }[];
}

export interface ProfilePayload {
  user: User;
  profile: CandidateProfile;
  experiences: Experience[];
  educations: Education[];
  resumes: Resume[];
  strength: ProfileStrength;
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

export interface CompanyProfile {
  tagline: string | null;
  about: string | null;
  founded: string | null;
  funding: string | null;
  rating: number;
  benefits: string[];
  values: { title: string; detail: string }[];
  offices: { city: string; people: string }[];
  metrics: { label: string; value: string; hint: string }[];
  ratingBreakdown: { label: string; score: number }[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
}

export interface ProcessStep {
  id: string;
  step: string;
  detail: string;
  duration: string | null;
}

export interface CompanyReview {
  id: string;
  title: string;
  body: string;
  rating: number;
  roleTitle: string | null;
  createdAt: string;
}

export interface CompanyListItem extends Company {
  profile: CompanyProfile | null;
  openRoles: number;
  following: boolean;
}

export interface MatchFacet {
  label: string;
  score: number;
  note: string;
}

export interface MatchResult {
  score: number;
  facets: MatchFacet[];
  reasons: string[];
}

export interface Job {
  id: string;
  companyId: string;
  title: string;
  slug: string;
  summary: string | null;
  description: string;
  requirements: string | null;
  responsibilities: string[];
  niceToHave: string[];
  location: string;
  workMode: WorkMode;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;
  equity: string | null;
  skills: string[];
  status: JobStatus;
  urgent: boolean;
  easyApply: boolean;
  respondsInDays: number | null;
  viewCount: number;
  publishedAt: string | null;
  createdAt: string;
}

export interface JobWithCompany extends Job {
  company: Company;
}

export interface ScoredJob extends JobWithCompany {
  match: MatchResult;
  applicantCount: number;
  saved: boolean;
  applied: boolean;
}

export interface CompanyDetail extends Company {
  profile: CompanyProfile | null;
  team: TeamMember[];
  process: ProcessStep[];
  jobs: Job[];
  reviews: CompanyReview[];
  techStack: string[];
  openRoles: number;
  followerCount: number;
  following: boolean;
}

export interface JobDetail extends ScoredJob {
  company: Company & {
    profile: CompanyProfile | null;
    team: TeamMember[];
    process: ProcessStep[];
  };
}

export interface ApplicationEvent {
  id: string;
  status: ApplicationStatus;
  note: string | null;
  createdAt: string;
}

export interface Interview {
  id: string;
  round: string;
  scheduledAt: string;
  durationMins: number;
  mode: InterviewMode;
  interviewerName: string | null;
  interviewerTitle: string | null;
  status: InterviewStatus;
}

export interface Application {
  id: string;
  jobId: string;
  status: ApplicationStatus;
  source: ApplicationSource;
  nextStep: string | null;
  salaryExpectation: number | null;
  createdAt: string;
  lastActivityAt: string;
  job: JobWithCompany;
  events: ApplicationEvent[];
  interviews: Interview[];
  lastUpdate: string | null;
  daysAgo: number;
}

export interface InterviewWithContext extends Interview {
  application: { job: JobWithCompany };
}

export interface SavedJob {
  id: string;
  jobId: string;
  folder: SavedFolder;
  note: string | null;
  createdAt: string;
  job: JobWithCompany;
  match: MatchResult;
}

export interface JobAlert {
  id: string;
  query: string;
  location: string | null;
  frequency: AlertFrequency;
  channels: string[];
  filters: Record<string, unknown>;
  active: boolean;
  matchesTotal: number;
  lastSentAt: string | null;
  createdAt: string;
  newCount: number;
}

export interface SavedSearch {
  id: string;
  name: string;
  params: Record<string, unknown>;
  lastRunAt: string | null;
}

export interface Message {
  id: string;
  senderId: string;
  body: string;
  readAt: string | null;
  createdAt: string;
  sender?: { id: string; name: string; role: Role };
}

export interface MessageThread {
  id: string;
  subject: string;
  candidateId: string;
  companyId: string;
  starredByCandidate: boolean;
  lastMessageAt: string;
  company: Company;
  preview: string;
  unread: number;
}

export interface MessageThreadDetail
  extends Omit<MessageThread, "preview" | "unread"> {
  messages: Message[];
}

export interface ActivityItem {
  id: string;
  kind: ActivityKind;
  title: string;
  detail: string | null;
  href: string | null;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationPreference {
  id: string;
  key: string;
  email: boolean;
  push: boolean;
}

export interface ConnectedAccount {
  id: string;
  provider: string;
  connected: boolean;
  connectedAt: string | null;
}

export interface DashboardStats {
  applications: { total: number; lastThirtyDays: number; open: number };
  inReview: number;
  interviews: number;
  offers: number;
  savedJobs: number;
  activeAlerts: number;
  following: number;
  profileViews: number;
  unreadMessages: number;
  pipeline: Record<ApplicationStatus, number>;
}

export interface ApplicationInsights {
  total: number;
  responseRate: number;
  interviewRate: number;
  medianDaysToFirstReply: number | null;
  needsAttention: number;
}

export interface SessionPayload {
  accessToken: string;
  user: User;
}
