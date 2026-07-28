import type {
  ApplicationStatus,
  Company,
  EmploymentType,
  ExperienceLevel,
  Job,
  SavedFolder,
  WorkMode,
} from "@/types/api";

const CURRENCY_SYMBOL: Record<string, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
  INR: "₹",
};

const LOGO_CLASSES = [
  "bg-teal-600 text-white",
  "bg-rose-500 text-white",
  "bg-indigo-600 text-white",
  "bg-amber-500 text-amber-950",
  "bg-slate-800 text-white",
  "bg-emerald-600 text-white",
  "bg-violet-600 text-white",
  "bg-cyan-700 text-white",
];

export const workModeLabel: Record<WorkMode, string> = {
  ONSITE: "On-site",
  HYBRID: "Hybrid",
  REMOTE: "Remote",
};

export const employmentLabel: Record<EmploymentType, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
  TEMPORARY: "Temporary",
};

export const experienceLabel: Record<ExperienceLevel, string> = {
  INTERN: "Intern",
  ENTRY: "Junior",
  MID: "Mid",
  SENIOR: "Senior",
  LEAD: "Lead",
};

export const statusLabel: Record<ApplicationStatus, string> = {
  APPLIED: "Applied",
  IN_REVIEW: "Screening",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

export const folderLabel: Record<SavedFolder, string> = {
  SHORTLIST: "Shortlist",
  MAYBE: "Maybe",
  RESEARCHING: "Researching",
};

export function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]!.toUpperCase())
    .join("");
}

export function logoClass(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return LOGO_CLASSES[hash % LOGO_CLASSES.length]!;
}

export function currencySymbol(code: string) {
  return CURRENCY_SYMBOL[code] ?? `${code} `;
}

export function formatSalary(job: Pick<Job, "salaryMin" | "salaryMax" | "currency" | "employmentType">) {
  if (job.salaryMin == null && job.salaryMax == null) return "Not disclosed";

  const symbol = currencySymbol(job.currency);
  const compact = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`);
  const min = job.salaryMin ?? job.salaryMax!;
  const max = job.salaryMax ?? job.salaryMin!;

  return `${symbol}${compact(min)}–${compact(max)} / yr`;
}

export function annualSalary(job: Pick<Job, "salaryMin" | "salaryMax">) {
  return job.salaryMin ?? job.salaryMax ?? 0;
}

export function jobHref(job: Pick<Job, "slug">) {
  return `/jobs/${job.slug}`;
}

export function companyHref(company: Pick<Company, "slug">) {
  return `/companies/${company.slug}`;
}

export function relativeTime(value: string | Date | null | undefined) {
  if (!value) return "—";

  const date = typeof value === "string" ? new Date(value) : value;
  const diff = Date.now() - date.getTime();
  const minutes = Math.round(diff / 60000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.round(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;

  const months = Math.round(days / 30);
  return months === 1 ? "1 month ago" : `${months} months ago`;
}

export function shortDate(value: string | Date | null | undefined) {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function dayLabel(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function timeLabel(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export function respondsIn(days: number | null) {
  if (!days) return "Response time varies";
  return days === 1 ? "Usually replies in 1 day" : `Usually replies in ${days} days`;
}

export function sizeBand(size: string | null) {
  const leading = Number((size ?? "").replace(/,/g, "").match(/\d+/)?.[0] ?? 0);
  if (leading >= 5000) return "5,000+";
  if (leading >= 500) return "500–5,000";
  if (leading >= 100) return "100–500";
  return "1–100";
}

export const sizeBands = ["1–100", "100–500", "500–5,000", "5,000+"] as const;
