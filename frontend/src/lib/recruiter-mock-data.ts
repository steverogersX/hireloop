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
    hint: "29 still unreviewed",
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
    id: "p-1053",
    title: "Solutions Engineer",
    location: "Remote — Europe",
    workplace: "Remote",
    employment: "Full-time",
    seniority: "Mid",
    status: "Published",
    salaryMin: 66000,
    salaryMax: 84000,
    currency: "€",
    postedAgo: "9 days ago",
    closesIn: "Closes in 19 days",
    views: 528,
    applicants: 26,
    unreviewed: 3,
    interviewing: 2,
    offers: 0,
    conversion: 4.9,
    ownerId: "t-dara",
  },
  {
    id: "p-1049",
    title: "Data Platform Engineer",
    location: "Amsterdam, NL",
    workplace: "Hybrid",
    employment: "Full-time",
    seniority: "Senior",
    status: "Published",
    salaryMin: 78000,
    salaryMax: 98000,
    currency: "€",
    postedAgo: "2 weeks ago",
    closesIn: "Closes in 8 days",
    views: 604,
    applicants: 31,
    unreviewed: 5,
    interviewing: 3,
    offers: 0,
    conversion: 5.1,
    ownerId: "t-sven",
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
    id: "p-1056",
    title: "Engineering Manager, Platform",
    location: "Amsterdam, NL",
    workplace: "Hybrid",
    employment: "Full-time",
    seniority: "Lead",
    status: "Draft",
    salaryMin: 98000,
    salaryMax: 124000,
    currency: "€",
    postedAgo: "Drafted 6 days ago",
    closesIn: "Not published",
    views: 0,
    applicants: 0,
    unreviewed: 0,
    interviewing: 0,
    offers: 0,
    conversion: 0,
    ownerId: "t-dara",
    attention: "Draft needs approval from finance",
  },
  {
    id: "p-1021",
    title: "QA Engineer",
    location: "Remote — Europe",
    workplace: "Remote",
    employment: "Full-time",
    seniority: "Mid",
    status: "Closed",
    salaryMin: 58000,
    salaryMax: 72000,
    currency: "€",
    postedAgo: "3 months ago",
    closesIn: "Closed without a hire",
    views: 810,
    applicants: 44,
    unreviewed: 0,
    interviewing: 0,
    offers: 0,
    conversion: 5.4,
    ownerId: "t-sven",
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
  {
    id: "c-477",
    name: "Yuki Tanaka",
    initials: "YT",
    avatarClass: "bg-chart-3/15 text-chart-3",
    headline: "Design Engineer",
    location: "Remote — PT",
    postingId: "p-1042",
    role: "Senior Frontend Engineer",
    stage: "Applied",
    score: 88,
    scoreReasons: ["Token pipelines", "Motion work"],
    appliedAgo: "3 days ago",
    experience: "6 years",
    noticePeriod: "1 month",
    expected: "€86k",
    topSkills: ["React", "CSS", "Design systems"],
    source: "Referral",
    isNew: false,
  },
  {
    id: "c-474",
    name: "Sofia Almeida",
    initials: "SA",
    avatarClass: "bg-emerald-600/15 text-emerald-700 dark:text-emerald-300",
    headline: "Staff Frontend Engineer",
    location: "Lisbon, PT",
    postingId: "p-1042",
    role: "Senior Frontend Engineer",
    stage: "Offer",
    score: 93,
    scoreReasons: ["Owned a design system", "WAI-ARIA depth"],
    appliedAgo: "1 week ago",
    experience: "9 years",
    noticePeriod: "2 months",
    expected: "€98k",
    topSkills: ["React", "Radix", "Testing"],
    source: "Sourced",
    isNew: false,
  },
  {
    id: "c-471",
    name: "Oliver Brandt",
    initials: "OB",
    avatarClass: "bg-slate-800/15 text-slate-700 dark:text-slate-300",
    headline: "Frontend Engineer",
    location: "Vienna, AT",
    postingId: "p-1042",
    role: "Senior Frontend Engineer",
    stage: "Rejected",
    score: 58,
    scoreReasons: ["Mostly Angular"],
    appliedAgo: "1 week ago",
    experience: "4 years",
    noticePeriod: "1 month",
    expected: "€72k",
    topSkills: ["Angular", "RxJS", "SCSS"],
    source: "Job board",
    isNew: false,
  },
  {
    id: "c-468",
    name: "Nadia Haddad",
    initials: "NH",
    avatarClass: "bg-rose-500/15 text-rose-600 dark:text-rose-300",
    headline: "Payments Engineer",
    location: "Paris, FR",
    postingId: "p-0998",
    role: "Senior Frontend Engineer, Billing",
    stage: "Interview",
    score: 87,
    scoreReasons: ["Stripe migrations", "Invoicing UX"],
    appliedAgo: "4 days ago",
    experience: "8 years",
    noticePeriod: "3 months",
    expected: "€96k",
    topSkills: ["TypeScript", "Stripe", "React"],
    source: "Direct",
    isNew: false,
  },
  {
    id: "c-465",
    name: "Ruben Castillo",
    initials: "RC",
    avatarClass: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
    headline: "Full-stack Engineer",
    location: "Valencia, ES",
    postingId: "p-0998",
    role: "Senior Frontend Engineer, Billing",
    stage: "Applied",
    score: 69,
    scoreReasons: ["Broad stack", "No billing work yet"],
    appliedAgo: "5 days ago",
    experience: "5 years",
    noticePeriod: "1 month",
    expected: "€78k",
    topSkills: ["Node.js", "React", "Postgres"],
    source: "Job board",
    isNew: false,
  },
  {
    id: "c-462",
    name: "Lena Fischer",
    initials: "LF",
    avatarClass: "bg-violet-600/15 text-violet-600 dark:text-violet-300",
    headline: "Senior Product Designer",
    location: "Amsterdam, NL",
    postingId: "p-1047",
    role: "Product Designer",
    stage: "Interview",
    score: 85,
    scoreReasons: ["Ships production CSS", "Local"],
    appliedAgo: "6 days ago",
    experience: "8 years",
    noticePeriod: "1 month",
    expected: "€84k",
    topSkills: ["Figma", "Design systems", "Research"],
    source: "Direct",
    isNew: false,
  },
  {
    id: "c-459",
    name: "Idris Bello",
    initials: "IB",
    avatarClass: "bg-cyan-700/15 text-cyan-700 dark:text-cyan-300",
    headline: "Product Designer",
    location: "Remote — NG",
    postingId: "p-1047",
    role: "Product Designer",
    stage: "In review",
    score: 74,
    scoreReasons: ["Strong portfolio", "Timezone gap"],
    appliedAgo: "1 week ago",
    experience: "5 years",
    noticePeriod: "Immediate",
    expected: "€68k",
    topSkills: ["Figma", "Prototyping", "Branding"],
    source: "Sourced",
    isNew: false,
  },
  {
    id: "c-456",
    name: "Elena Petrova",
    initials: "EP",
    avatarClass: "bg-indigo-600/15 text-indigo-600 dark:text-indigo-300",
    headline: "Data Engineer",
    location: "Amsterdam, NL",
    postingId: "p-1049",
    role: "Data Platform Engineer",
    stage: "Interview",
    score: 90,
    scoreReasons: ["dbt and Spark", "Local"],
    appliedAgo: "4 days ago",
    experience: "7 years",
    noticePeriod: "2 months",
    expected: "€92k",
    topSkills: ["Spark", "dbt", "Python"],
    source: "Referral",
    isNew: false,
  },
  {
    id: "c-453",
    name: "Jonas Beck",
    initials: "JB",
    avatarClass: "bg-teal-600/15 text-teal-700 dark:text-teal-300",
    headline: "Analytics Engineer",
    location: "Hamburg, DE",
    postingId: "p-1049",
    role: "Data Platform Engineer",
    stage: "In review",
    score: 77,
    scoreReasons: ["Warehouse modelling"],
    appliedAgo: "6 days ago",
    experience: "5 years",
    noticePeriod: "6 weeks",
    expected: "€82k",
    topSkills: ["dbt", "Snowflake", "SQL"],
    source: "Direct",
    isNew: false,
  },
  {
    id: "c-450",
    name: "Farah Rahimi",
    initials: "FR",
    avatarClass: "bg-chart-3/15 text-chart-3",
    headline: "Solutions Engineer",
    location: "Remote — NL",
    postingId: "p-1053",
    role: "Solutions Engineer",
    stage: "In review",
    score: 81,
    scoreReasons: ["Pre-sales with developers", "Demo craft"],
    appliedAgo: "3 days ago",
    experience: "6 years",
    noticePeriod: "1 month",
    expected: "€80k",
    topSkills: ["Pre-sales", "APIs", "Python"],
    source: "Direct",
    isNew: false,
  },
  {
    id: "c-447",
    name: "Tom Berg",
    initials: "TB",
    avatarClass: "bg-emerald-600/15 text-emerald-700 dark:text-emerald-300",
    headline: "Backend Engineer",
    location: "Oslo, NO",
    postingId: "p-1051",
    role: "Backend Engineer, Ingest",
    stage: "Interview",
    score: 86,
    scoreReasons: ["High-volume ingest", "Go"],
    appliedAgo: "4 days ago",
    experience: "7 years",
    noticePeriod: "3 months",
    expected: "€88k",
    topSkills: ["Go", "Kafka", "ClickHouse"],
    source: "Sourced",
    isNew: false,
  },
  {
    id: "c-444",
    name: "Grace Adeyemi",
    initials: "GA",
    avatarClass: "bg-rose-500/15 text-rose-600 dark:text-rose-300",
    headline: "Developer Advocate",
    location: "London, UK",
    postingId: "p-1039",
    role: "Developer Advocate",
    stage: "In review",
    score: 83,
    scoreReasons: ["Large following", "Writes tutorials"],
    appliedAgo: "5 days ago",
    experience: "7 years",
    noticePeriod: "1 month",
    expected: "€84k",
    topSkills: ["DevRel", "Video", "TypeScript"],
    source: "Direct",
    isNew: false,
  },
  {
    id: "c-441",
    name: "Pieter Janssen",
    initials: "PJ",
    avatarClass: "bg-slate-800/15 text-slate-700 dark:text-slate-300",
    headline: "Community Manager",
    location: "Rotterdam, NL",
    postingId: "p-1039",
    role: "Developer Advocate",
    stage: "Rejected",
    score: 52,
    scoreReasons: ["No engineering background"],
    appliedAgo: "1 week ago",
    experience: "4 years",
    noticePeriod: "Immediate",
    expected: "€62k",
    topSkills: ["Community", "Events", "Copywriting"],
    source: "Job board",
    isNew: false,
  },
  {
    id: "c-438",
    name: "Mira Kovač",
    initials: "MK",
    avatarClass: "bg-violet-600/15 text-violet-600 dark:text-violet-300",
    headline: "Senior Frontend Engineer",
    location: "Zagreb, HR",
    postingId: "p-0998",
    role: "Senior Frontend Engineer, Billing",
    stage: "Hired",
    score: 94,
    scoreReasons: ["Billing rebuild at scale", "Testing rigour"],
    appliedAgo: "3 weeks ago",
    experience: "9 years",
    noticePeriod: "Starts 1 Sep",
    expected: "€99k",
    topSkills: ["TypeScript", "Stripe", "Playwright"],
    source: "Referral",
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

export function postingCounts() {
  return {
    all: postings.length,
    Published: postings.filter((p) => p.status === "Published").length,
    Draft: postings.filter((p) => p.status === "Draft").length,
    Closed: postings.filter((p) => p.status === "Closed").length,
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function postingSlug(posting: Posting) {
  return `${slugify(posting.title)}-${posting.id}`;
}

export function postingHref(posting: Posting) {
  return `/recruiter/jobs/${postingSlug(posting)}`;
}

export function allPostingSlugs() {
  return postings.map((posting) => postingSlug(posting));
}

export function candidateHref(candidate: Candidate) {
  return `/recruiter/applicants/${candidate.id}`;
}

export function candidatesForPosting(postingId: string) {
  return candidates.filter((candidate) => candidate.postingId === postingId);
}

export function stageCounts(pool: Candidate[]) {
  return PIPELINE_STAGES.reduce<Record<PipelineStage, number>>(
    (acc, stage) => {
      acc[stage] = pool.filter((candidate) => candidate.stage === stage).length;
      return acc;
    },
    {} as Record<PipelineStage, number>
  );
}

export type PostingDetail = {
  about: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  screening: string[];
  process: { step: string; detail: string; duration: string }[];
};

const postingDetails: Record<string, PostingDetail> = {
  "p-1042": {
    about:
      "Northwind's component library sits under six products and every customer-facing surface we ship. It has grown by accretion for three years and now needs an owner with a point of view.",
    responsibilities: [
      "Own the component library end to end: API design, accessibility, docs, release.",
      "Pair weekly with design on the token system and the next generation of the library.",
      "Cut migration paths for six product teams so upgrades never mean a rewrite sprint.",
    ],
    requirements: [
      "Five or more years building product UI with React and TypeScript.",
      "You have owned a shared component library other teams depended on.",
      "Comfortable with WAI-ARIA patterns and keyboard interaction beyond the basics.",
    ],
    niceToHave: [
      "Experience with a headless primitive library such as Radix or Ark.",
      "You have run a design token pipeline across web and native.",
    ],
    screening: [
      "Do you have the right to work in the Netherlands without sponsorship?",
      "Link a component library or design system you owned.",
      "What is your salary expectation for this role?",
    ],
    process: [
      { step: "Intro call", detail: "30 minutes with a talent partner.", duration: "Week 1" },
      { step: "Craft interview", detail: "Walk an engineer through something you built.", duration: "Week 1" },
      { step: "Paid work session", detail: "Half a day on a real component. Paid at €600.", duration: "Week 2" },
      { step: "Team and offer", detail: "Meet two future colleagues, decision in 48 hours.", duration: "Week 2" },
    ],
  },
  "p-0998": {
    about:
      "Checkout and metering carry $40M of self-serve revenue and have not been touched in two years. You would rebuild both, with the freedom to change the data model underneath them.",
    responsibilities: [
      "Rebuild checkout, plan selection and the metering surfaces.",
      "Work with finance on how usage becomes an invoice a customer understands.",
      "Raise test coverage on billing paths that currently have none.",
    ],
    requirements: [
      "Five or more years with React and TypeScript.",
      "You have worked on billing, payments or another money-touching surface.",
      "Serious about testing where mistakes are expensive.",
    ],
    niceToHave: ["Stripe Billing experience.", "You have run a pricing migration without a support spike."],
    screening: [
      "Are you based in a European time zone?",
      "Describe a billing or payments surface you shipped.",
      "What is your notice period?",
    ],
    process: [
      { step: "Intro call", detail: "30 minutes with a talent partner.", duration: "Week 1" },
      { step: "Technical interview", detail: "Live session on a metering UI problem.", duration: "Week 1" },
      { step: "Team and offer", detail: "Meet the billing team, then a decision.", duration: "Week 2" },
    ],
  },
};

const defaultPostingDetail: PostingDetail = {
  about:
    "This posting is still using the default template. Open the editor to write the role description before it goes live.",
  responsibilities: [
    "Own the surface end to end, from schema to pixel.",
    "Work directly with the team that depends on your output.",
  ],
  requirements: [
    "Relevant production experience at the level of this role.",
    "Comfortable owning a decision without a spec to hide behind.",
  ],
  niceToHave: ["Domain experience in developer tools."],
  screening: [
    "Do you have the right to work in the EU without sponsorship?",
    "What is your salary expectation?",
  ],
  process: [
    { step: "Intro call", detail: "30 minutes with a talent partner.", duration: "Week 1" },
    { step: "Technical interview", detail: "A working session with the team.", duration: "Week 2" },
    { step: "Team and offer", detail: "Meet the team, then a decision.", duration: "Week 3" },
  ],
};

export function getPostingBySlug(slug: string) {
  const posting = postings.find((item) => postingSlug(item) === slug);
  if (!posting) return null;

  const pool = candidatesForPosting(posting.id);

  return {
    posting,
    detail: postingDetails[posting.id] ?? defaultPostingDetail,
    owner: memberById(posting.ownerId),
    pool,
    counts: stageCounts(pool),
  };
}

export type CandidateDetail = {
  summary: string;
  resume: string;
  links: { label: string; href: string }[];
  experience: { role: string; company: string; period: string; detail: string }[];
  education: { school: string; qualification: string; year: string }[];
  screening: { question: string; answer: string }[];
  notes: {
    id: string;
    author: string;
    initials: string;
    avatarClass: string;
    body: string;
    when: string;
  }[];
  scorecards: { round: string; interviewer: string; rating: number; verdict: string }[];
  timeline: { id: string; label: string; detail: string; when: string }[];
};

const candidateDetails: Record<string, CandidateDetail> = {
  "c-501": {
    summary:
      "Eight years of product UI, the last three owning the component library at a Series B developer tools company. Wants the same problem with more scope, and lives twenty minutes from the office.",
    resume: "priya-raman-frontend.pdf",
    links: [
      { label: "Portfolio", href: "priya.design" },
      { label: "GitHub", href: "github.com/priyaraman" },
    ],
    experience: [
      {
        role: "Senior Frontend Engineer",
        company: "Kestrel Systems",
        period: "2021 — now",
        detail: "Owns the design system used by four product teams. Cut bundle size 38%.",
      },
      {
        role: "Frontend Engineer",
        company: "Bolt Interactive",
        period: "2018 — 2021",
        detail: "Built the analytics dashboard and the charting layer under it.",
      },
    ],
    education: [
      { school: "TU Delft", qualification: "MSc Computer Science", year: "2017" },
    ],
    screening: [
      { question: "Right to work in the Netherlands?", answer: "Yes, no sponsorship needed" },
      { question: "Design system you owned", answer: "kestrel-ui — 60 components, 4 teams" },
      { question: "Salary expectation", answer: "€95,000" },
    ],
    notes: [
      {
        id: "n-1",
        author: "Dara Okonkwo",
        initials: "DO",
        avatarClass: "bg-primary/10 text-primary",
        body: "Strongest application on this role. Portfolio shows real token pipeline work, not just Figma screenshots. Fast-track to the craft interview.",
        when: "1h ago",
      },
    ],
    scorecards: [],
    timeline: [
      { id: "tl-1", label: "Applied", detail: "Direct application with a note", when: "2h ago" },
      { id: "tl-2", label: "Moved to In review", detail: "By Dara Okonkwo", when: "1h ago" },
    ],
  },
  "c-498": {
    summary:
      "Ten years across platform and payments, most recently leading the Stripe Billing migration at a Polish fintech. Three-month notice is the main risk.",
    resume: "marek-nowak-cv.pdf",
    links: [{ label: "GitHub", href: "github.com/mnowak" }],
    experience: [
      {
        role: "Staff Engineer, Platform",
        company: "Zenta Pay",
        period: "2020 — now",
        detail: "Led the migration to Stripe Billing across three products with no downtime.",
      },
      {
        role: "Senior Engineer",
        company: "Allegro",
        period: "2016 — 2020",
        detail: "Checkout and payment methods for the largest marketplace in Poland.",
      },
    ],
    education: [
      { school: "AGH Kraków", qualification: "BSc Computer Science", year: "2014" },
    ],
    screening: [
      { question: "European time zone?", answer: "Yes, CET" },
      { question: "Billing surface you shipped", answer: "Zenta Pay metering and invoicing rebuild" },
      { question: "Notice period", answer: "3 months" },
    ],
    notes: [
      {
        id: "n-2",
        author: "Sven Aalbers",
        initials: "SA",
        avatarClass: "bg-indigo-600/15 text-indigo-600 dark:text-indigo-300",
        body: "Deep billing background, exactly the migration we are about to run. Notice period is long — worth asking if it can be bought out.",
        when: "4h ago",
      },
    ],
    scorecards: [
      { round: "Intro call", interviewer: "Dara Okonkwo", rating: 4, verdict: "Advance" },
    ],
    timeline: [
      { id: "tl-1", label: "Applied", detail: "Referred by Mira Kovač", when: "5h ago" },
      { id: "tl-2", label: "Moved to Interview", detail: "Craft interview booked for 11:00", when: "4h ago" },
    ],
  },
  "c-495": {
    summary:
      "Seven years of product design with real production CSS. Offer sent three days ago; she asked for until Thursday to answer.",
    resume: "amelie-dubois-portfolio.pdf",
    links: [{ label: "Portfolio", href: "ameliedubois.fr" }],
    experience: [
      {
        role: "Product Designer",
        company: "Studio Vermeer",
        period: "2021 — now",
        detail: "Design system and marketing surfaces for three SaaS clients.",
      },
      {
        role: "Designer",
        company: "Rondo",
        period: "2018 — 2021",
        detail: "Shipped the mobile app redesign that lifted retention 14%.",
      },
    ],
    education: [
      { school: "ArtEZ Arnhem", qualification: "BA Graphic Design", year: "2017" },
    ],
    screening: [
      { question: "Right to work in the Netherlands?", answer: "Yes" },
      { question: "Portfolio link", answer: "ameliedubois.fr" },
      { question: "Salary expectation", answer: "€88,000" },
    ],
    notes: [
      {
        id: "n-3",
        author: "Lucia Ferrari",
        initials: "LF",
        avatarClass: "bg-rose-500/15 text-rose-600 dark:text-rose-300",
        body: "Best portfolio in the round and she writes her own CSS. Team loved her. Send the offer at the top of the band.",
        when: "4 days ago",
      },
    ],
    scorecards: [
      { round: "Intro call", interviewer: "Dara Okonkwo", rating: 4, verdict: "Advance" },
      { round: "Portfolio review", interviewer: "Lucia Ferrari", rating: 5, verdict: "Strong hire" },
      { round: "Team day", interviewer: "Sven Aalbers", rating: 4, verdict: "Hire" },
    ],
    timeline: [
      { id: "tl-1", label: "Applied", detail: "Sourced via LinkedIn", when: "3 days ago" },
      { id: "tl-2", label: "Moved to Offer", detail: "Offer letter sent", when: "3 days ago" },
    ],
  },
};

export function getCandidateById(id: string) {
  const candidate = candidates.find((item) => item.id === id);
  if (!candidate) return null;

  const posting = postings.find((item) => item.id === candidate.postingId);

  return {
    candidate,
    posting,
    detail: candidateDetails[id] ?? fallbackDetail(candidate),
  };
}

/** Keeps every applicant openable while only the featured few are hand-written. */
function fallbackDetail(candidate: Candidate): CandidateDetail {
  return {
    summary: `${candidate.experience} as a ${candidate.headline.toLowerCase()}, based in ${candidate.location}. Applied ${candidate.appliedAgo.toLowerCase()} via ${candidate.source.toLowerCase()}.`,
    resume: `${slugify(candidate.name)}-cv.pdf`,
    links: [{ label: "LinkedIn", href: `linkedin.com/in/${slugify(candidate.name)}` }],
    experience: [
      {
        role: candidate.headline,
        company: "Current employer",
        period: "Most recent",
        detail: `Working with ${candidate.topSkills.join(", ")}.`,
      },
    ],
    education: [{ school: "Not provided", qualification: "—", year: "—" }],
    screening: [
      { question: "Salary expectation", answer: candidate.expected },
      { question: "Notice period", answer: candidate.noticePeriod },
    ],
    notes: [],
    scorecards: [],
    timeline: [
      {
        id: "tl-1",
        label: "Applied",
        detail: `${candidate.source} application`,
        when: candidate.appliedAgo,
      },
      {
        id: "tl-2",
        label: `Moved to ${candidate.stage}`,
        detail: "Current stage",
        when: candidate.appliedAgo,
      },
    ],
  };
}

export function allCandidateIds() {
  return candidates.map((candidate) => candidate.id);
}

export type ScheduledInterview = RecruiterInterview & {
  candidateId: string;
  postingId: string;
};

export const schedule: ScheduledInterview[] = [
  ...todaysInterviews.map((interview, index) => ({
    ...interview,
    candidateId: ["c-498", "c-489", "c-492", "c-495"][index],
    postingId: ["p-0998", "p-1042", "p-1051", "p-1047"][index],
  })),
  {
    id: "ri-5",
    candidate: "Nadia Haddad",
    initials: "NH",
    avatarClass: "bg-rose-500/15 text-rose-600 dark:text-rose-300",
    role: "Senior Frontend Engineer, Billing",
    round: "Technical interview",
    day: "Wed, 29 Jul",
    time: "13:00 CEST",
    duration: "90 min",
    mode: "Video",
    panel: ["Sven Aalbers"],
    status: "Confirmed",
    candidateId: "c-468",
    postingId: "p-0998",
  },
  {
    id: "ri-6",
    candidate: "Elena Petrova",
    initials: "EP",
    avatarClass: "bg-indigo-600/15 text-indigo-600 dark:text-indigo-300",
    role: "Data Platform Engineer",
    round: "System design",
    day: "Wed, 29 Jul",
    time: "15:30 CEST",
    duration: "60 min",
    mode: "Video",
    panel: ["Sven Aalbers", "Dara Okonkwo"],
    status: "Confirmed",
    candidateId: "c-456",
    postingId: "p-1049",
  },
  {
    id: "ri-7",
    candidate: "Tom Berg",
    initials: "TB",
    avatarClass: "bg-emerald-600/15 text-emerald-700 dark:text-emerald-300",
    role: "Backend Engineer, Ingest",
    round: "Craft interview",
    day: "Thu, 30 Jul",
    time: "10:00 CEST",
    duration: "60 min",
    mode: "Video",
    panel: ["Sven Aalbers"],
    status: "Awaiting candidate",
    candidateId: "c-447",
    postingId: "p-1051",
  },
  {
    id: "ri-8",
    candidate: "Lena Fischer",
    initials: "LF",
    avatarClass: "bg-violet-600/15 text-violet-600 dark:text-violet-300",
    role: "Product Designer",
    round: "Portfolio review",
    day: "Thu, 30 Jul",
    time: "14:00 CEST",
    duration: "45 min",
    mode: "On-site",
    panel: ["Lucia Ferrari"],
    status: "Confirmed",
    candidateId: "c-462",
    postingId: "p-1047",
  },
  {
    id: "ri-9",
    candidate: "Sofia Almeida",
    initials: "SA",
    avatarClass: "bg-emerald-600/15 text-emerald-700 dark:text-emerald-300",
    role: "Senior Frontend Engineer",
    round: "Team and offer",
    day: "Fri, 31 Jul",
    time: "11:00 CEST",
    duration: "45 min",
    mode: "Video",
    panel: ["Dara Okonkwo", "Lucia Ferrari"],
    status: "Needs a panel",
    candidateId: "c-474",
    postingId: "p-1042",
  },
];

export const scheduleDays = [
  "Today",
  "Tomorrow",
  "Wed, 29 Jul",
  "Thu, 30 Jul",
  "Fri, 31 Jul",
];

export function scheduleByDay() {
  return scheduleDays
    .map((day) => ({
      day,
      sessions: schedule.filter((session) => session.day === day),
    }))
    .filter((group) => group.sessions.length > 0);
}

export type TalentProfile = {
  id: string;
  name: string;
  initials: string;
  avatarClass: string;
  headline: string;
  company: string;
  location: string;
  experience: string;
  skills: string[];
  openTo: boolean;
  score: number;
  lastActive: string;
  contacted: boolean;
};

export const talentPool: TalentProfile[] = [
  {
    id: "tp-1",
    name: "Anouk Visser",
    initials: "AV",
    avatarClass: "bg-teal-600/15 text-teal-700 dark:text-teal-300",
    headline: "Staff Frontend Engineer",
    company: "Adyen",
    location: "Amsterdam, NL",
    experience: "11 years",
    skills: ["React", "TypeScript", "Design systems", "Accessibility"],
    openTo: true,
    score: 94,
    lastActive: "Active this week",
    contacted: false,
  },
  {
    id: "tp-2",
    name: "Bram de Wit",
    initials: "BW",
    avatarClass: "bg-indigo-600/15 text-indigo-600 dark:text-indigo-300",
    headline: "Principal Engineer, Platform",
    company: "Booking.com",
    location: "Amsterdam, NL",
    experience: "14 years",
    skills: ["Monorepo", "CI/CD", "React", "Mentoring"],
    openTo: false,
    score: 89,
    lastActive: "Active 3 weeks ago",
    contacted: true,
  },
  {
    id: "tp-3",
    name: "Chiara Rossi",
    initials: "CR",
    avatarClass: "bg-rose-500/15 text-rose-600 dark:text-rose-300",
    headline: "Design Engineer",
    company: "Linear",
    location: "Remote — IT",
    experience: "7 years",
    skills: ["React", "CSS", "Motion", "Figma"],
    openTo: true,
    score: 91,
    lastActive: "Active today",
    contacted: false,
  },
  {
    id: "tp-4",
    name: "Kofi Boateng",
    initials: "KB",
    avatarClass: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
    headline: "Senior Data Engineer",
    company: "Miro",
    location: "Berlin, DE",
    experience: "9 years",
    skills: ["Spark", "dbt", "Airflow", "Python"],
    openTo: true,
    score: 87,
    lastActive: "Active this week",
    contacted: false,
  },
  {
    id: "tp-5",
    name: "Saskia Mulder",
    initials: "SM",
    avatarClass: "bg-emerald-600/15 text-emerald-700 dark:text-emerald-300",
    headline: "Engineering Manager",
    company: "Mollie",
    location: "Amsterdam, NL",
    experience: "12 years",
    skills: ["Leadership", "Hiring", "React", "Roadmapping"],
    openTo: true,
    score: 85,
    lastActive: "Active 2 days ago",
    contacted: false,
  },
  {
    id: "tp-6",
    name: "Victor Lindgren",
    initials: "VL",
    avatarClass: "bg-violet-600/15 text-violet-600 dark:text-violet-300",
    headline: "Site Reliability Engineer",
    company: "Klarna",
    location: "Stockholm, SE",
    experience: "8 years",
    skills: ["Kubernetes", "Terraform", "Go", "Observability"],
    openTo: false,
    score: 82,
    lastActive: "Active last month",
    contacted: true,
  },
  {
    id: "tp-7",
    name: "Leila Nasser",
    initials: "LN",
    avatarClass: "bg-cyan-700/15 text-cyan-700 dark:text-cyan-300",
    headline: "Product Designer",
    company: "Framer",
    location: "Remote — NL",
    experience: "6 years",
    skills: ["Figma", "Prototyping", "Design systems"],
    openTo: true,
    score: 88,
    lastActive: "Active today",
    contacted: false,
  },
  {
    id: "tp-8",
    name: "Hugo Martins",
    initials: "HM",
    avatarClass: "bg-slate-800/15 text-slate-700 dark:text-slate-300",
    headline: "Developer Advocate",
    company: "Vercel",
    location: "Lisbon, PT",
    experience: "8 years",
    skills: ["DevRel", "Writing", "Next.js", "Video"],
    openTo: true,
    score: 90,
    lastActive: "Active this week",
    contacted: false,
  },
];

export type MessageThread = {
  id: string;
  candidateId: string;
  name: string;
  initials: string;
  avatarClass: string;
  role: string;
  preview: string;
  when: string;
  unread: boolean;
  messages: {
    id: string;
    from: "them" | "us";
    author: string;
    body: string;
    when: string;
  }[];
};

export const threads: MessageThread[] = [
  {
    id: "th-1",
    candidateId: "c-501",
    name: "Priya Raman",
    initials: "PR",
    avatarClass: "bg-teal-600/15 text-teal-700 dark:text-teal-300",
    role: "Senior Frontend Engineer",
    preview: "Thursday afternoon works well for me — anything after 14:00.",
    when: "18m ago",
    unread: true,
    messages: [
      {
        id: "m-1",
        from: "us",
        author: "Dara Okonkwo",
        body: "Hi Priya — thanks for applying. Your token pipeline work is exactly the problem we have. Could we do a 30 minute intro this week?",
        when: "1h ago",
      },
      {
        id: "m-2",
        from: "them",
        author: "Priya Raman",
        body: "Thursday afternoon works well for me — anything after 14:00.",
        when: "18m ago",
      },
    ],
  },
  {
    id: "th-2",
    candidateId: "c-495",
    name: "Amelie Dubois",
    initials: "AD",
    avatarClass: "bg-rose-500/15 text-rose-600 dark:text-rose-300",
    role: "Product Designer",
    preview: "Could I have until Thursday to give you an answer?",
    when: "2h ago",
    unread: true,
    messages: [
      {
        id: "m-1",
        from: "us",
        author: "Dara Okonkwo",
        body: "The offer letter is in your inbox. The team is thrilled. Let me know if anything in it needs a conversation.",
        when: "3 days ago",
      },
      {
        id: "m-2",
        from: "them",
        author: "Amelie Dubois",
        body: "Could I have until Thursday to give you an answer? I want to talk it through at home first.",
        when: "2h ago",
      },
    ],
  },
  {
    id: "th-3",
    candidateId: "c-498",
    name: "Marek Nowak",
    initials: "MN",
    avatarClass: "bg-indigo-600/15 text-indigo-600 dark:text-indigo-300",
    role: "Senior Frontend Engineer, Billing",
    preview: "Confirmed for 11:00. Should I prepare anything?",
    when: "4h ago",
    unread: false,
    messages: [
      {
        id: "m-1",
        from: "us",
        author: "Dara Okonkwo",
        body: "Craft interview is booked for 11:00 with Sven and Lucia. Bring something you built and are still proud of.",
        when: "5h ago",
      },
      {
        id: "m-2",
        from: "them",
        author: "Marek Nowak",
        body: "Confirmed for 11:00. Should I prepare anything?",
        when: "4h ago",
      },
    ],
  },
  {
    id: "th-4",
    candidateId: "c-474",
    name: "Sofia Almeida",
    initials: "SA",
    avatarClass: "bg-emerald-600/15 text-emerald-700 dark:text-emerald-300",
    role: "Senior Frontend Engineer",
    preview: "Two months notice, but I could start part-time sooner.",
    when: "Yesterday",
    unread: false,
    messages: [
      {
        id: "m-1",
        from: "us",
        author: "Dara Okonkwo",
        body: "We would like to move to a final conversation. What does your notice period look like?",
        when: "2 days ago",
      },
      {
        id: "m-2",
        from: "them",
        author: "Sofia Almeida",
        body: "Two months notice, but I could start part-time sooner if that helps.",
        when: "Yesterday",
      },
    ],
  },
];

export const companyProfile = {
  tagline: "Ship the thing, then write about why.",
  about:
    "Northwind Labs builds the observability layer that 4,000 engineering teams use to see what their services are doing in production. Engineers here own a surface end to end, from schema to pixel.",
  website: "northwindlabs.com",
  founded: "2018",
  linkedin: "linkedin.com/company/northwind-labs",
  benefits: [
    "€2,500 yearly learning budget, no approval needed",
    "4-day week in July and August",
    "Home office setup up to €3,000",
    "Relocation and visa support for you and your family",
    "26 days holiday plus Dutch public holidays",
  ],
  offices: [
    { city: "Amsterdam", people: "210 people" },
    { city: "Remote, EU", people: "94 people" },
  ],
  values: [
    {
      title: "Write it down",
      detail:
        "Every non-trivial decision gets an RFC. Meetings start with ten minutes of reading.",
    },
    {
      title: "One owner per surface",
      detail:
        "Shared ownership means nobody owns it. Each surface has a name attached.",
    },
  ],
  profileStrength: 82,
  profileGaps: [
    { label: "Add three team photos", weight: "+7%" },
    { label: "Record a 60-second culture video", weight: "+6%" },
    { label: "Publish your salary bands", weight: "+5%" },
  ],
  metrics: [
    { label: "Profile views", value: "8,420", hint: "last 30 days" },
    { label: "Follower count", value: "1,204", hint: "+118 this month" },
    { label: "Offer acceptance", value: "84%", hint: "2025 to date" },
    { label: "Time to hire", value: "18 days", hint: "median, engineering" },
  ],
};

export type Invite = {
  id: string;
  email: string;
  role: "Admin" | "Recruiter" | "Interviewer";
  sentAgo: string;
};

export const invites: Invite[] = [
  { id: "in-1", email: "nienke.bos@northwindlabs.com", role: "Interviewer", sentAgo: "2 days ago" },
  { id: "in-2", email: "omar.haddad@northwindlabs.com", role: "Recruiter", sentAgo: "5 days ago" },
];

export const teamRoles = {
  "t-dara": "Admin" as const,
  "t-sven": "Recruiter" as const,
  "t-lucia": "Interviewer" as const,
};

export const notificationSettings = [
  {
    id: "new-applicant",
    label: "New applicant",
    detail: "Someone applies to a role you own",
    email: true,
    push: true,
  },
  {
    id: "stage-change",
    label: "Stage changes",
    detail: "A teammate moves a candidate forward or rejects them",
    email: true,
    push: false,
  },
  {
    id: "interview",
    label: "Interview reminders",
    detail: "One hour before a session you are on the panel for",
    email: true,
    push: true,
  },
  {
    id: "digest",
    label: "Weekly digest",
    detail: "Monday summary of every pipeline you own",
    email: true,
    push: false,
  },
  {
    id: "posting-health",
    label: "Posting health",
    detail: "A role is underperforming or about to expire",
    email: false,
    push: false,
  },
];

export const billing = {
  plan: "Scale",
  price: "€490",
  cycle: "per month, billed yearly",
  renewsOn: "1 March 2027",
  seatsUsed: 6,
  seatsTotal: 10,
  jobSlotsUsed: 7,
  jobSlotsTotal: 15,
  creditsLeft: 4,
  creditsTotal: 25,
  invoices: [
    { id: "inv-1", number: "NW-2026-07", amount: "€490.00", date: "1 Jul 2026", status: "Paid" },
    { id: "inv-2", number: "NW-2026-06", amount: "€490.00", date: "1 Jun 2026", status: "Paid" },
    { id: "inv-3", number: "NW-2026-05", amount: "€490.00", date: "1 May 2026", status: "Paid" },
  ],
};

export function postingTotals() {
  const open = openPostings();
  return {
    applicants: open.reduce((sum, posting) => sum + posting.applicants, 0),
    interviewing: open.reduce((sum, posting) => sum + posting.interviewing, 0),
    offers: open.reduce((sum, posting) => sum + posting.offers, 0),
    views: open.reduce((sum, posting) => sum + posting.views, 0),
  };
}
