/**
 * Mock data for the HireLoop recruiter workspace.
 * Static, like the candidate mock — swap these exports for API calls later.
 *
 * The recruiter is Dara Okonkwo at Northwind Labs, the talent partner the
 * candidate mock already names, so both sides of the product tell one story.
 */

export type PostingStatus = "Draft" | "Published" | "Closed";

export type PipelineStage =
  | "Applied"
  | "In review"
  | "Interview"
  | "Offer"
  | "Hired"
  | "Rejected";

export type TeamMember = {
  id: string;
  name: string;
  initials: string;
  title: string;
  avatarClass: string;
  openRoles: number;
  awaitingReview: number;
  medianReply: string;
};

export type Posting = {
  id: string;
  title: string;
  location: string;
  workplace: "Remote" | "Hybrid" | "On-site";
  employment: "Full-time" | "Contract" | "Part-time" | "Internship";
  seniority: "Junior" | "Mid" | "Senior" | "Staff" | "Lead";
  status: PostingStatus;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  postedAgo: string;
  closesIn: string;
  views: number;
  applicants: number;
  unreviewed: number;
  interviewing: number;
  offers: number;
  /** Share of viewers who finished an application — the posting's health signal. */
  conversion: number;
  ownerId: string;
  /** Set when the role needs the recruiter to do something today. */
  attention?: string;
};

export type Candidate = {
  id: string;
  name: string;
  initials: string;
  avatarClass: string;
  headline: string;
  location: string;
  postingId: string;
  role: string;
  stage: PipelineStage;
  score: number;
  scoreReasons: string[];
  appliedAgo: string;
  experience: string;
  noticePeriod: string;
  expected: string;
  topSkills: string[];
  source: "Direct" | "Referral" | "Sourced" | "Job board";
  isNew: boolean;
};

export type RecruiterInterview = {
  id: string;
  candidate: string;
  initials: string;
  avatarClass: string;
  role: string;
  round: string;
  day: string;
  time: string;
  duration: string;
  mode: "Video" | "On-site" | "Phone";
  panel: string[];
  status: "Confirmed" | "Awaiting candidate" | "Needs a panel";
};

export type RecruiterActivity = {
  id: string;
  kind: "applied" | "stage" | "message" | "offer" | "posting";
  title: string;
  detail: string;
  time: string;
};

export const employer = {
  name: "Northwind Labs",
  initials: "NW",
  logoClass: "bg-teal-600 text-white",
  industry: "Developer tools",
  size: "180–400",
  hq: "Amsterdam, NL",
  plan: "Scale",
  seatsUsed: 6,
  seatsTotal: 10,
  creditsLeft: 4,
};

export const recruiter = {
  name: "Dara Okonkwo",
  firstName: "Dara",
  title: "Talent Partner",
  email: "dara.okonkwo@northwindlabs.com",
  initials: "DO",
  avatarClass: "bg-primary/10 text-primary",
};

export const hiringStats = [
  {
    id: "roles",
    label: "Open roles",
    value: 7,
    delta: "+2",
    deltaLabel: "published this month",
    trend: "up" as const,
    hint: "3 close within the week",
  },
  {
    id: "applicants",
    label: "New applicants",
    value: 48,
    delta: "+12",
    deltaLabel: "last 7 days",
    trend: "up" as const,
    hint: "19 still unreviewed",
  },
  {
    id: "interviews",
    label: "In interview",
    value: 14,
    delta: "+5",
    deltaLabel: "across 6 roles",
    trend: "up" as const,
    hint: "4 sessions scheduled today",
  },
  {
    id: "offers",
    label: "Offers out",
    value: 3,
    delta: "2",
    deltaLabel: "awaiting an answer",
    trend: "flat" as const,
    hint: "Median 21 days to hire",
  },
];

export const funnel = [
  { stage: "Applied", count: 214, tone: "bg-chart-1" },
  { stage: "In review", count: 86, tone: "bg-chart-3" },
  { stage: "Interview", count: 34, tone: "bg-chart-2" },
  { stage: "Offer", count: 9, tone: "bg-chart-5" },
  { stage: "Hired", count: 4, tone: "bg-primary" },
];

export const team: TeamMember[] = [
  {
    id: "t-dara",
    name: "Dara Okonkwo",
    initials: "DO",
    title: "Talent Partner",
    avatarClass: "bg-primary/10 text-primary",
    openRoles: 4,
    awaitingReview: 11,
    medianReply: "6h",
  },
  {
    id: "t-sven",
    name: "Sven Aalbers",
    initials: "SA",
    title: "Engineering Manager, Web",
    avatarClass: "bg-indigo-600/15 text-indigo-600 dark:text-indigo-300",
    openRoles: 2,
    awaitingReview: 6,
    medianReply: "1d",
  },
  {
    id: "t-lucia",
    name: "Lucia Ferrari",
    initials: "LF",
    title: "Staff Design Engineer",
    avatarClass: "bg-rose-500/15 text-rose-600 dark:text-rose-300",
    openRoles: 1,
    awaitingReview: 2,
    medianReply: "4h",
  },
];

export const postings: Posting[] = [
  {
    id: "p-1042",
    title: "Senior Frontend Engineer",
    location: "Amsterdam, NL",
    workplace: "Hybrid",
    employment: "Full-time",
    seniority: "Senior",
    status: "Published",
    salaryMin: 82000,
    salaryMax: 104000,
    currency: "€",
    postedAgo: "12 days ago",
    closesIn: "Closes in 9 days",
    views: 320,
    applicants: 14,
    unreviewed: 6,
    interviewing: 3,
    offers: 1,
    conversion: 4.4,
    ownerId: "t-dara",
    attention: "6 applicants waiting on a first read",
  },
  {
    id: "p-0998",
    title: "Senior Frontend Engineer, Billing",
    location: "Remote — Europe",
    workplace: "Remote",
    employment: "Full-time",
    seniority: "Senior",
    status: "Published",
    salaryMin: 80000,
    salaryMax: 100000,
    currency: "€",
    postedAgo: "1 month ago",
    closesIn: "Closes in 3 days",
    views: 1310,
    applicants: 63,
    unreviewed: 9,
    interviewing: 5,
    offers: 1,
    conversion: 4.8,
    ownerId: "t-dara",
    attention: "Closes Friday with 9 unread",
  },
  {
    id: "p-1051",
    title: "Backend Engineer, Ingest",
    location: "Amsterdam, NL",
    workplace: "Hybrid",
    employment: "Full-time",
    seniority: "Mid",
    status: "Published",
    salaryMin: 68000,
    salaryMax: 86000,
    currency: "€",
    postedAgo: "6 days ago",
    closesIn: "Closes in 22 days",
    views: 412,
    applicants: 21,
    unreviewed: 4,
    interviewing: 2,
    offers: 0,
    conversion: 5.1,
    ownerId: "t-sven",
  },
  {
    id: "p-1047",
    title: "Product Designer",
    location: "Amsterdam, NL",
    workplace: "Hybrid",
    employment: "Full-time",
    seniority: "Senior",
    status: "Published",
    salaryMin: 72000,
    salaryMax: 92000,
    currency: "€",
    postedAgo: "18 days ago",
    closesIn: "Closes in 12 days",
    views: 890,
    applicants: 37,
    unreviewed: 2,
    interviewing: 4,
    offers: 1,
    conversion: 4.2,
    ownerId: "t-lucia",
  },
  {
    id: "p-1039",
    title: "Developer Advocate",
    location: "Remote — Europe",
    workplace: "Remote",
    employment: "Full-time",
    seniority: "Mid",
    status: "Published",
    salaryMin: 64000,
    salaryMax: 82000,
    currency: "€",
    postedAgo: "3 weeks ago",
    closesIn: "Closes in 6 days",
    views: 2140,
    applicants: 58,
    unreviewed: 0,
    interviewing: 0,
    offers: 0,
    conversion: 2.7,
    ownerId: "t-dara",
    attention: "No interviews booked after 58 applicants",
  },
  {
    id: "p-1055",
    title: "Site Reliability Engineer",
    location: "Amsterdam, NL",
    workplace: "On-site",
    employment: "Full-time",
    seniority: "Staff",
    status: "Draft",
    salaryMin: 94000,
    salaryMax: 118000,
    currency: "€",
    postedAgo: "Drafted 2 days ago",
    closesIn: "Not published",
    views: 0,
    applicants: 0,
    unreviewed: 0,
    interviewing: 0,
    offers: 0,
    conversion: 0,
    ownerId: "t-sven",
    attention: "Draft waiting on a salary band",
  },
  {
    id: "p-1012",
    title: "Technical Writer",
    location: "Remote — Europe",
    workplace: "Remote",
    employment: "Contract",
    seniority: "Mid",
    status: "Closed",
    salaryMin: 420,
    salaryMax: 540,
    currency: "€",
    postedAgo: "2 months ago",
    closesIn: "Filled 5 days ago",
    views: 640,
    applicants: 29,
    unreviewed: 0,
    interviewing: 0,
    offers: 0,
    conversion: 4.5,
    ownerId: "t-dara",
  },
];

export const candidates: Candidate[] = [
  {
    id: "c-501",
    name: "Priya Raman",
    initials: "PR",
    avatarClass: "bg-teal-600/15 text-teal-700 dark:text-teal-300",
    headline: "Senior Frontend Engineer",
    location: "Amsterdam, NL",
    postingId: "p-1042",
    role: "Senior Frontend Engineer",
    stage: "In review",
    score: 96,
    scoreReasons: ["React + TypeScript", "Design systems", "Amsterdam based"],
    appliedAgo: "2h ago",
    experience: "8 years",
    noticePeriod: "1 month",
    expected: "€95k",
    topSkills: ["React", "TypeScript", "Design systems"],
    source: "Direct",
    isNew: true,
  },
  {
    id: "c-498",
    name: "Marek Nowak",
    initials: "MN",
    avatarClass: "bg-indigo-600/15 text-indigo-600 dark:text-indigo-300",
    headline: "Staff Engineer, Platform",
    location: "Kraków, PL",
    postingId: "p-0998",
    role: "Senior Frontend Engineer, Billing",
    stage: "Interview",
    score: 91,
    scoreReasons: ["Stripe Billing", "Testing depth"],
    appliedAgo: "5h ago",
    experience: "10 years",
    noticePeriod: "3 months",
    expected: "€102k",
    topSkills: ["TypeScript", "Stripe", "Testing"],
    source: "Referral",
    isNew: true,
  },
  {
    id: "c-495",
    name: "Amelie Dubois",
    initials: "AD",
    avatarClass: "bg-rose-500/15 text-rose-600 dark:text-rose-300",
    headline: "Product Designer",
    location: "Utrecht, NL",
    postingId: "p-1047",
    role: "Product Designer",
    stage: "Offer",
    score: 89,
    scoreReasons: ["Systems thinking", "Ships production CSS"],
    appliedAgo: "3 days ago",
    experience: "7 years",
    noticePeriod: "2 months",
    expected: "€88k",
    topSkills: ["Figma", "Design systems", "Prototyping"],
    source: "Sourced",
    isNew: false,
  },
  {
    id: "c-492",
    name: "Tobias Lindqvist",
    initials: "TL",
    avatarClass: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
    headline: "Backend Engineer",
    location: "Stockholm, SE",
    postingId: "p-1051",
    role: "Backend Engineer, Ingest",
    stage: "In review",
    score: 84,
    scoreReasons: ["Streaming pipelines", "Go and Rust"],
    appliedAgo: "8h ago",
    experience: "6 years",
    noticePeriod: "1 month",
    expected: "€82k",
    topSkills: ["Go", "Kafka", "Postgres"],
    source: "Job board",
    isNew: true,
  },
  {
    id: "c-489",
    name: "Isabel Ortega",
    initials: "IO",
    avatarClass: "bg-violet-600/15 text-violet-600 dark:text-violet-300",
    headline: "Frontend Engineer",
    location: "Barcelona, ES",
    postingId: "p-1042",
    role: "Senior Frontend Engineer",
    stage: "Interview",
    score: 82,
    scoreReasons: ["Component library owner", "Accessibility"],
    appliedAgo: "1 day ago",
    experience: "5 years",
    noticePeriod: "6 weeks",
    expected: "€84k",
    topSkills: ["React", "Radix", "Accessibility"],
    source: "Direct",
    isNew: false,
  },
  {
    id: "c-486",
    name: "Kwame Mensah",
    initials: "KM",
    avatarClass: "bg-emerald-600/15 text-emerald-700 dark:text-emerald-300",
    headline: "Developer Advocate",
    location: "Berlin, DE",
    postingId: "p-1039",
    role: "Developer Advocate",
    stage: "Applied",
    score: 78,
    scoreReasons: ["Conference speaking", "Writes well"],
    appliedAgo: "1 day ago",
    experience: "6 years",
    noticePeriod: "Immediate",
    expected: "€76k",
    topSkills: ["DevRel", "Writing", "Node.js"],
    source: "Direct",
    isNew: false,
  },
  {
    id: "c-483",
    name: "Hannah Weiss",
    initials: "HW",
    avatarClass: "bg-cyan-700/15 text-cyan-700 dark:text-cyan-300",
    headline: "Senior React Engineer",
    location: "Remote — DE",
    postingId: "p-0998",
    role: "Senior Frontend Engineer, Billing",
    stage: "In review",
    score: 76,
    scoreReasons: ["Payments background"],
    appliedAgo: "2 days ago",
    experience: "7 years",
    noticePeriod: "2 months",
    expected: "€90k",
    topSkills: ["React", "GraphQL", "Stripe"],
    source: "Job board",
    isNew: false,
  },
  {
    id: "c-480",
    name: "Diego Fernández",
    initials: "DF",
    avatarClass: "bg-slate-800/15 text-slate-700 dark:text-slate-300",
    headline: "Platform Engineer",
    location: "Amsterdam, NL",
    postingId: "p-1051",
    role: "Backend Engineer, Ingest",
    stage: "Applied",
    score: 71,
    scoreReasons: ["Local", "Kubernetes"],
    appliedAgo: "2 days ago",
    experience: "4 years",
    noticePeriod: "1 month",
    expected: "€74k",
    topSkills: ["Kubernetes", "Python", "Terraform"],
    source: "Direct",
    isNew: false,
  },
];

export const todaysInterviews: RecruiterInterview[] = [
  {
    id: "ri-1",
    candidate: "Marek Nowak",
    initials: "MN",
    avatarClass: "bg-indigo-600/15 text-indigo-600 dark:text-indigo-300",
    role: "Senior Frontend Engineer, Billing",
    round: "Craft interview",
    day: "Today",
    time: "11:00 CEST",
    duration: "60 min",
    mode: "Video",
    panel: ["Sven Aalbers", "Lucia Ferrari"],
    status: "Confirmed",
  },
  {
    id: "ri-2",
    candidate: "Isabel Ortega",
    initials: "IO",
    avatarClass: "bg-violet-600/15 text-violet-600 dark:text-violet-300",
    role: "Senior Frontend Engineer",
    round: "Paid work session",
    day: "Today",
    time: "14:00 CEST",
    duration: "3 hrs",
    mode: "Video",
    panel: ["Lucia Ferrari"],
    status: "Confirmed",
  },
  {
    id: "ri-3",
    candidate: "Tobias Lindqvist",
    initials: "TL",
    avatarClass: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
    role: "Backend Engineer, Ingest",
    round: "Intro call",
    day: "Today",
    time: "16:30 CEST",
    duration: "30 min",
    mode: "Phone",
    panel: ["Dara Okonkwo"],
    status: "Awaiting candidate",
  },
  {
    id: "ri-4",
    candidate: "Amelie Dubois",
    initials: "AD",
    avatarClass: "bg-rose-500/15 text-rose-600 dark:text-rose-300",
    role: "Product Designer",
    round: "Team and offer",
    day: "Tomorrow",
    time: "10:00 CEST",
    duration: "45 min",
    mode: "On-site",
    panel: ["Sven Aalbers"],
    status: "Needs a panel",
  },
];

export const sourceMix = [
  { source: "Direct", count: 96, tone: "bg-chart-1" },
  { source: "Job board", count: 61, tone: "bg-chart-3" },
  { source: "Sourced", count: 38, tone: "bg-chart-2" },
  { source: "Referral", count: 19, tone: "bg-chart-5" },
];

export const recruiterActivity: RecruiterActivity[] = [
  {
    id: "ra-1",
    kind: "applied",
    title: "Priya Raman applied to Senior Frontend Engineer",
    detail: "96 fit · design systems match",
    time: "2h ago",
  },
  {
    id: "ra-2",
    kind: "stage",
    title: "Sven moved Marek Nowak to Interview",
    detail: "Craft interview booked for 11:00",
    time: "4h ago",
  },
  {
    id: "ra-3",
    kind: "offer",
    title: "Amelie Dubois has your offer",
    detail: "Sent 3 days ago · answer due Thursday",
    time: "Yesterday",
  },
  {
    id: "ra-4",
    kind: "message",
    title: "Lucia left a note on Isabel Ortega",
    detail: "\"Strong Radix work — push to the work session.\"",
    time: "Yesterday",
  },
  {
    id: "ra-5",
    kind: "posting",
    title: "Developer Advocate hit 2,140 views",
    detail: "Conversion is 2.7%, below your average",
    time: "2 days ago",
  },
];

export const stageTone: Record<PipelineStage, string> = {
  Applied: "bg-muted text-muted-foreground",
  "In review": "bg-chart-3/12 text-chart-3",
  Interview: "bg-chart-2/15 text-chart-2",
  Offer: "bg-chart-5/12 text-chart-5",
  Hired: "bg-primary/12 text-primary",
  Rejected: "bg-destructive/10 text-destructive",
};

export const statusTone: Record<PostingStatus, string> = {
  Published: "bg-chart-5/12 text-chart-5",
  Draft: "bg-muted text-muted-foreground",
  Closed: "bg-destructive/10 text-destructive",
};

export const PIPELINE_STAGES: PipelineStage[] = [
  "Applied",
  "In review",
  "Interview",
  "Offer",
  "Hired",
  "Rejected",
];

const CONTRACT_DAYS_PER_YEAR = 220;

export function annualBudget(posting: Posting) {
  return posting.employment === "Contract"
    ? posting.salaryMin * CONTRACT_DAYS_PER_YEAR
    : posting.salaryMin;
}

export function formatBand(posting: Posting) {
  const compact = (n: number) =>
    n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`;
  const suffix = posting.employment === "Contract" ? " / day" : " / yr";
  const range =
    posting.employment === "Contract"
      ? `${posting.currency}${posting.salaryMin}–${posting.salaryMax}`
      : `${posting.currency}${compact(posting.salaryMin)}–${compact(posting.salaryMax)}`;
  return `${range}${suffix}`;
}

export function memberById(id: string) {
  return team.find((member) => member.id === id);
}

export function openPostings() {
  return postings.filter((posting) => posting.status === "Published");
}

export function postingsNeedingAttention() {
  return postings.filter((posting) => posting.attention);
}

export function unreviewedTotal() {
  return postings.reduce((sum, posting) => sum + posting.unreviewed, 0);
}
