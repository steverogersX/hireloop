/**
 * Mock data for the HireLoop candidate dashboard.
 * Everything here is static — swap these exports for API calls later.
 */

export type Workplace = "Remote" | "Hybrid" | "On-site";
export type Employment = "Full-time" | "Contract" | "Part-time" | "Internship";
export type Seniority = "Junior" | "Mid" | "Senior" | "Staff" | "Lead";

export type Company = {
  id: string;
  name: string;
  initials: string;
  /** Tailwind classes for the logo tile — keeps each company recognizable in the feed. */
  logoClass: string;
  industry: string;
  size: string;
  hq: string;
  funding: string;
  rating: number;
};

export type Job = {
  id: string;
  title: string;
  company: Company;
  location: string;
  workplace: Workplace;
  employment: Employment;
  seniority: Seniority;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  equity?: string;
  postedAgo: string;
  applicants: number;
  views: number;
  matchScore: number;
  matchReasons: string[];
  skills: string[];
  saved: boolean;
  applied: boolean;
  urgent?: boolean;
  easyApply?: boolean;
  summary: string;
  respondsIn: string;
};

export type ApplicationStage =
  | "Applied"
  | "Screening"
  | "Interview"
  | "Offer"
  | "Rejected";

export type Application = {
  id: string;
  jobTitle: string;
  company: Company;
  stage: ApplicationStage;
  appliedOn: string;
  lastUpdate: string;
  progress: number;
  nextStep: string;
};

export type Interview = {
  id: string;
  role: string;
  company: Company;
  round: string;
  day: string;
  time: string;
  duration: string;
  mode: "Video" | "On-site" | "Phone";
  interviewer: string;
  interviewerTitle: string;
  status: "Confirmed" | "Awaiting confirmation";
};

export type Alert = {
  id: string;
  query: string;
  location: string;
  frequency: "Daily" | "Weekly" | "Instant";
  newCount: number;
  active: boolean;
};

export type ActivityItem = {
  id: string;
  kind: "view" | "stage" | "message" | "match" | "invite";
  title: string;
  detail: string;
  time: string;
};

const companies = {
  northwind: {
    id: "c-northwind",
    name: "Northwind Labs",
    initials: "NW",
    logoClass: "bg-teal-600 text-white",
    industry: "Developer tools",
    size: "180–400",
    hq: "Amsterdam, NL",
    funding: "Series B",
    rating: 4.6,
  },
  cadence: {
    id: "c-cadence",
    name: "Cadence Health",
    initials: "CH",
    logoClass: "bg-rose-500 text-white",
    industry: "Digital health",
    size: "500–1,000",
    hq: "Boston, MA",
    funding: "Series D",
    rating: 4.2,
  },
  orbital: {
    id: "c-orbital",
    name: "Orbital Freight",
    initials: "OF",
    logoClass: "bg-indigo-600 text-white",
    industry: "Logistics",
    size: "1,000+",
    hq: "Rotterdam, NL",
    funding: "Public",
    rating: 3.9,
  },
  paperkite: {
    id: "c-paperkite",
    name: "Paperkite",
    initials: "PK",
    logoClass: "bg-amber-500 text-amber-950",
    industry: "Design software",
    size: "40–80",
    hq: "Lisbon, PT",
    funding: "Seed",
    rating: 4.8,
  },
  meridian: {
    id: "c-meridian",
    name: "Meridian Bank",
    initials: "MB",
    logoClass: "bg-slate-800 text-white",
    industry: "Financial services",
    size: "5,000+",
    hq: "London, UK",
    funding: "Public",
    rating: 3.7,
  },
  lumen: {
    id: "c-lumen",
    name: "Lumen Grid",
    initials: "LG",
    logoClass: "bg-emerald-600 text-white",
    industry: "Clean energy",
    size: "220–500",
    hq: "Copenhagen, DK",
    funding: "Series C",
    rating: 4.4,
  },
  tessera: {
    id: "c-tessera",
    name: "Tessera AI",
    initials: "TA",
    logoClass: "bg-violet-600 text-white",
    industry: "Applied ML",
    size: "60–120",
    hq: "Berlin, DE",
    funding: "Series A",
    rating: 4.5,
  },
  brightmile: {
    id: "c-brightmile",
    name: "Brightmile",
    initials: "BM",
    logoClass: "bg-cyan-700 text-white",
    industry: "Mobility",
    size: "120–250",
    hq: "Austin, TX",
    funding: "Series B",
    rating: 4.1,
  },
} satisfies Record<string, Company>;

export const candidate = {
  name: "Priya Raman",
  firstName: "Priya",
  title: "Senior Frontend Engineer",
  location: "Amsterdam, NL",
  email: "priya.raman@example.com",
  initials: "PR",
  openToWork: true,
  noticePeriod: "1 month",
  profileStrength: 78,
  profileGaps: [
    { label: "Add two portfolio links", weight: "+8%" },
    { label: "Confirm salary expectation", weight: "+7%" },
    { label: "Verify your last role", weight: "+7%" },
  ],
};

export const stats = [
  {
    id: "applications",
    label: "Applications sent",
    value: 34,
    delta: "+6",
    deltaLabel: "vs last month",
    trend: "up" as const,
    hint: "12 still open",
  },
  {
    id: "review",
    label: "In review",
    value: 9,
    delta: "+3",
    deltaLabel: "moved forward",
    trend: "up" as const,
    hint: "Avg. 4 days to reply",
  },
  {
    id: "interviews",
    label: "Interviews",
    value: 5,
    delta: "2",
    deltaLabel: "scheduled this week",
    trend: "flat" as const,
    hint: "Next one Thursday",
  },
  {
    id: "views",
    label: "Profile views",
    value: 218,
    delta: "+41%",
    deltaLabel: "last 30 days",
    trend: "up" as const,
    hint: "17 recruiters",
  },
];

export const pipeline = [
  { stage: "Applied", count: 34, tone: "bg-chart-1" },
  { stage: "Screening", count: 14, tone: "bg-chart-3" },
  { stage: "Interview", count: 5, tone: "bg-chart-2" },
  { stage: "Offer", count: 1, tone: "bg-chart-5" },
];

export const jobs: Job[] = [
  {
    id: "j-1042",
    title: "Senior Frontend Engineer",
    company: companies.northwind,
    location: "Amsterdam, NL",
    workplace: "Hybrid",
    employment: "Full-time",
    seniority: "Senior",
    salaryMin: 82000,
    salaryMax: 104000,
    currency: "€",
    equity: "0.05–0.12%",
    postedAgo: "2 hours ago",
    applicants: 14,
    views: 320,
    matchScore: 96,
    matchReasons: ["React + TypeScript", "Design systems", "Amsterdam based"],
    skills: ["React", "TypeScript", "Design systems", "Testing"],
    saved: true,
    applied: false,
    urgent: true,
    easyApply: true,
    summary:
      "Own the component library that every Northwind product builds on, and pair with design on the next generation of it.",
    respondsIn: "Usually replies in 2 days",
  },
  {
    id: "j-1038",
    title: "Staff Product Engineer",
    company: companies.paperkite,
    location: "Remote — Europe",
    workplace: "Remote",
    employment: "Full-time",
    seniority: "Staff",
    salaryMin: 95000,
    salaryMax: 125000,
    currency: "€",
    equity: "0.3–0.6%",
    postedAgo: "8 hours ago",
    applicants: 27,
    views: 610,
    matchScore: 92,
    matchReasons: ["Canvas rendering", "Small team experience", "Remote-first"],
    skills: ["TypeScript", "WebGL", "Product sense", "Rust"],
    saved: false,
    applied: false,
    easyApply: true,
    summary:
      "Third engineering hire on a canvas editor used by 40,000 designers. You will ship end to end, from cursor latency to pricing pages.",
    respondsIn: "Usually replies in 1 day",
  },
  {
    id: "j-1031",
    title: "Frontend Platform Lead",
    company: companies.lumen,
    location: "Copenhagen, DK",
    workplace: "Hybrid",
    employment: "Full-time",
    seniority: "Lead",
    salaryMin: 88000,
    salaryMax: 112000,
    currency: "€",
    postedAgo: "1 day ago",
    applicants: 41,
    views: 890,
    matchScore: 88,
    matchReasons: ["Platform work", "Mentoring", "Relocation supported"],
    skills: ["React", "Monorepo", "CI/CD", "Mentoring"],
    saved: true,
    applied: false,
    summary:
      "Lead a four-person platform team building the operator console for 2.3 GW of grid storage.",
    respondsIn: "Usually replies in 4 days",
  },
  {
    id: "j-1029",
    title: "Senior React Engineer",
    company: companies.tessera,
    location: "Berlin, DE",
    workplace: "Remote",
    employment: "Full-time",
    seniority: "Senior",
    salaryMin: 78000,
    salaryMax: 96000,
    currency: "€",
    equity: "0.1–0.2%",
    postedAgo: "1 day ago",
    applicants: 33,
    views: 705,
    matchScore: 85,
    matchReasons: ["React", "Data-heavy UI", "Remote"],
    skills: ["React", "D3", "Python", "Streaming"],
    saved: false,
    applied: true,
    easyApply: true,
    summary:
      "Build the annotation surface where ML researchers correct model output in real time.",
    respondsIn: "Usually replies in 3 days",
  },
  {
    id: "j-1024",
    title: "Product Engineer, Growth",
    company: companies.brightmile,
    location: "Remote — EU/US",
    workplace: "Remote",
    employment: "Full-time",
    seniority: "Mid",
    salaryMin: 70000,
    salaryMax: 90000,
    currency: "$",
    postedAgo: "2 days ago",
    applicants: 58,
    views: 1240,
    matchScore: 81,
    matchReasons: ["Experimentation", "Full-stack comfort"],
    skills: ["Next.js", "A/B testing", "SQL", "Analytics"],
    saved: false,
    applied: false,
    summary:
      "Run the experiment loop on signup and activation for a fleet product used in 19 cities.",
    respondsIn: "Usually replies in 5 days",
  },
  {
    id: "j-1019",
    title: "Senior Engineer, Patient Apps",
    company: companies.cadence,
    location: "Boston, MA",
    workplace: "Hybrid",
    employment: "Full-time",
    seniority: "Senior",
    salaryMin: 145000,
    salaryMax: 175000,
    currency: "$",
    postedAgo: "3 days ago",
    applicants: 96,
    views: 2100,
    matchScore: 74,
    matchReasons: ["React Native", "Accessibility"],
    skills: ["React Native", "HIPAA", "Accessibility", "GraphQL"],
    saved: false,
    applied: false,
    summary:
      "Ship the app 1.2 million patients use to prepare for surgery, with accessibility as a release gate.",
    respondsIn: "Usually replies in 6 days",
  },
  {
    id: "j-1013",
    title: "Frontend Engineer, Trading UI",
    company: companies.meridian,
    location: "London, UK",
    workplace: "On-site",
    employment: "Full-time",
    seniority: "Senior",
    salaryMin: 90000,
    salaryMax: 120000,
    currency: "£",
    postedAgo: "4 days ago",
    applicants: 71,
    views: 1580,
    matchScore: 69,
    matchReasons: ["Low-latency UI", "TypeScript"],
    skills: ["TypeScript", "WebSockets", "Canvas", "Performance"],
    saved: false,
    applied: false,
    summary:
      "Sub-16ms rendering on desk terminals traders keep open for nine hours a day.",
    respondsIn: "Usually replies in 8 days",
  },
  {
    id: "j-1008",
    title: "Design Engineer",
    company: companies.paperkite,
    location: "Lisbon, PT",
    workplace: "Hybrid",
    employment: "Contract",
    seniority: "Mid",
    salaryMin: 480,
    salaryMax: 620,
    currency: "€",
    postedAgo: "5 days ago",
    applicants: 22,
    views: 430,
    matchScore: 77,
    matchReasons: ["Design systems", "Motion"],
    skills: ["Figma", "CSS", "Motion", "React"],
    saved: true,
    applied: false,
    summary:
      "Six-month contract turning the new brand system into shipped interface, day rate.",
    respondsIn: "Usually replies in 2 days",
  },
  {
    id: "j-1004",
    title: "Engineering Manager, Web",
    company: companies.orbital,
    location: "Rotterdam, NL",
    workplace: "Hybrid",
    employment: "Full-time",
    seniority: "Lead",
    salaryMin: 96000,
    salaryMax: 128000,
    currency: "€",
    postedAgo: "6 days ago",
    applicants: 38,
    views: 720,
    matchScore: 64,
    matchReasons: ["Team leadership"],
    skills: ["Leadership", "React", "Hiring", "Roadmapping"],
    saved: false,
    applied: false,
    summary:
      "Take over a nine-person web group behind port scheduling used across 40 terminals.",
    respondsIn: "Usually replies in 7 days",
  },
  {
    id: "j-0998",
    title: "Senior Frontend Engineer, Billing",
    company: companies.northwind,
    location: "Remote — Europe",
    workplace: "Remote",
    employment: "Full-time",
    seniority: "Senior",
    salaryMin: 80000,
    salaryMax: 100000,
    currency: "€",
    postedAgo: "1 week ago",
    applicants: 63,
    views: 1310,
    matchScore: 83,
    matchReasons: ["TypeScript", "Known company"],
    skills: ["TypeScript", "Stripe", "React", "Testing"],
    saved: false,
    applied: true,
    summary:
      "Rebuild checkout and metering for a self-serve product crossing $40M ARR.",
    respondsIn: "Usually replies in 2 days",
  },
];

export const applications: Application[] = [
  {
    id: "a-51",
    jobTitle: "Senior React Engineer",
    company: companies.tessera,
    stage: "Interview",
    appliedOn: "12 Jul",
    lastUpdate: "Moved to onsite loop · 2 days ago",
    progress: 70,
    nextStep: "System design round, Thu 14:00",
  },
  {
    id: "a-48",
    jobTitle: "Senior Frontend Engineer, Billing",
    company: companies.northwind,
    stage: "Screening",
    appliedOn: "9 Jul",
    lastUpdate: "Recruiter opened your profile · 5 hours ago",
    progress: 40,
    nextStep: "Waiting on recruiter call slot",
  },
  {
    id: "a-45",
    jobTitle: "Frontend Platform Lead",
    company: companies.lumen,
    stage: "Screening",
    appliedOn: "7 Jul",
    lastUpdate: "Take-home sent · yesterday",
    progress: 45,
    nextStep: "Take-home due Monday",
  },
  {
    id: "a-40",
    jobTitle: "Product Engineer, Growth",
    company: companies.brightmile,
    stage: "Applied",
    appliedOn: "3 Jul",
    lastUpdate: "No response yet · 24 days",
    progress: 15,
    nextStep: "Follow up with the hiring manager",
  },
  {
    id: "a-36",
    jobTitle: "Design Engineer",
    company: companies.paperkite,
    stage: "Offer",
    appliedOn: "22 Jun",
    lastUpdate: "Offer letter shared · 3 days ago",
    progress: 95,
    nextStep: "Respond by 31 Jul",
  },
  {
    id: "a-30",
    jobTitle: "Frontend Engineer, Trading UI",
    company: companies.meridian,
    stage: "Rejected",
    appliedOn: "14 Jun",
    lastUpdate: "Closed — role paused · 1 week ago",
    progress: 100,
    nextStep: "Ask to be kept on file",
  },
];

export const interviews: Interview[] = [
  {
    id: "i-1",
    role: "Senior React Engineer",
    company: companies.tessera,
    round: "System design",
    day: "Thu, 30 Jul",
    time: "14:00 CEST",
    duration: "60 min",
    mode: "Video",
    interviewer: "Jonas Weber",
    interviewerTitle: "Principal Engineer",
    status: "Confirmed",
  },
  {
    id: "i-2",
    role: "Frontend Platform Lead",
    company: companies.lumen,
    round: "Hiring manager",
    day: "Fri, 31 Jul",
    time: "10:30 CEST",
    duration: "45 min",
    mode: "Video",
    interviewer: "Mette Sørensen",
    interviewerTitle: "Director of Engineering",
    status: "Confirmed",
  },
  {
    id: "i-3",
    role: "Senior Frontend Engineer",
    company: companies.northwind,
    round: "Recruiter screen",
    day: "Mon, 3 Aug",
    time: "16:00 CEST",
    duration: "30 min",
    mode: "Phone",
    interviewer: "Dara Okonkwo",
    interviewerTitle: "Talent Partner",
    status: "Awaiting confirmation",
  },
];

export const alerts: Alert[] = [
  {
    id: "al-1",
    query: "Senior Frontend Engineer",
    location: "Amsterdam + Remote EU",
    frequency: "Daily",
    newCount: 12,
    active: true,
  },
  {
    id: "al-2",
    query: "Design Engineer",
    location: "Remote — Europe",
    frequency: "Weekly",
    newCount: 4,
    active: true,
  },
  {
    id: "al-3",
    query: "Staff Engineer · €100k+",
    location: "Anywhere",
    frequency: "Instant",
    newCount: 0,
    active: false,
  },
];

export const activity: ActivityItem[] = [
  {
    id: "ac-1",
    kind: "view",
    title: "Northwind Labs viewed your profile",
    detail: "Talent partner · third view this week",
    time: "18m ago",
  },
  {
    id: "ac-2",
    kind: "stage",
    title: "Tessera AI moved you to Interview",
    detail: "System design round scheduled for Thursday",
    time: "2h ago",
  },
  {
    id: "ac-3",
    kind: "invite",
    title: "Paperkite invited you to apply",
    detail: "Staff Product Engineer · Remote",
    time: "5h ago",
  },
  {
    id: "ac-4",
    kind: "message",
    title: "Message from Mette Sørensen",
    detail: "\"Sending over the take-home brief today.\"",
    time: "Yesterday",
  },
  {
    id: "ac-5",
    kind: "match",
    title: "6 new roles matched above 85%",
    detail: "From your Senior Frontend Engineer alert",
    time: "Yesterday",
  },
];

export type TeamMember = {
  name: string;
  role: string;
  initials: string;
};

export type ProcessStep = {
  step: string;
  detail: string;
  duration: string;
};

export type CompanyProfile = {
  about: string;
  founded: string;
  website: string;
  openRoles: number;
  benefits: string[];
  process: ProcessStep[];
  team: TeamMember[];
};

export type JobDetail = {
  about: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  matchBreakdown: { label: string; score: number; note: string }[];
};

const companyProfiles: Record<string, CompanyProfile> = {
  "c-northwind": {
    about:
      "Northwind Labs builds the observability layer that 4,000 engineering teams use to see what their services are doing in production. Engineers here own a surface end to end, from schema to pixel.",
    founded: "2018",
    website: "northwindlabs.com",
    openRoles: 11,
    benefits: [
      "€2,500 yearly learning budget, no approval needed",
      "4-day week in July and August",
      "Home office setup up to €3,000",
      "Relocation and visa support for you and your family",
      "26 days holiday plus Dutch public holidays",
    ],
    process: [
      {
        step: "Intro call",
        detail: "30 minutes with a talent partner on your background and what you want next.",
        duration: "Week 1",
      },
      {
        step: "Craft interview",
        detail: "Walk an engineer through something you built and why you built it that way.",
        duration: "Week 1",
      },
      {
        step: "Paid work session",
        detail: "Half a day on a real component with the team. Paid at €600.",
        duration: "Week 2",
      },
      {
        step: "Team and offer",
        detail: "Meet two future colleagues, then a decision within 48 hours.",
        duration: "Week 2",
      },
    ],
    team: [
      { name: "Dara Okonkwo", role: "Talent Partner", initials: "DO" },
      { name: "Sven Aalbers", role: "Engineering Manager, Web", initials: "SA" },
      { name: "Lucia Ferrari", role: "Staff Design Engineer", initials: "LF" },
    ],
  },
  "c-paperkite": {
    about:
      "Paperkite makes a browser-based design canvas used by 40,000 designers. Nine people, one product, shipped weekly since 2022.",
    founded: "2021",
    website: "paperkite.design",
    openRoles: 3,
    benefits: [
      "Meaningful equity, four-year vest with a one-year cliff",
      "Fully remote across European time zones",
      "Two company offsites a year, last one in the Azores",
      "Friday afternoons reserved for your own projects",
    ],
    process: [
      {
        step: "Founder call",
        detail: "45 minutes with Inês on the product and where it goes next.",
        duration: "Week 1",
      },
      {
        step: "Build session",
        detail: "Pair on a real canvas bug for two hours, screen shared.",
        duration: "Week 1",
      },
      {
        step: "Team day",
        detail: "Spend a day with the team, remote or in Lisbon, your choice.",
        duration: "Week 2",
      },
    ],
    team: [
      { name: "Inês Carvalho", role: "Co-founder & CTO", initials: "IC" },
      { name: "Tomás Reis", role: "Founding Designer", initials: "TR" },
    ],
  },
  "c-lumen": {
    about:
      "Lumen Grid runs software for 2.3 GW of grid-scale battery storage across nine European markets. When the software is right, the grid stays balanced.",
    founded: "2016",
    website: "lumengrid.dk",
    openRoles: 7,
    benefits: [
      "Danish pension scheme with 12% employer contribution",
      "Relocation package including a Copenhagen housing stipend",
      "Six weeks paid leave",
      "Free electricity for your home from the Lumen network",
    ],
    process: [
      {
        step: "Recruiter screen",
        detail: "30 minutes on your platform experience and motivation.",
        duration: "Week 1",
      },
      {
        step: "Take-home",
        detail: "A four-hour scoped task on build tooling. Reviewed by two engineers.",
        duration: "Week 1–2",
      },
      {
        step: "Technical deep dive",
        detail: "Ninety minutes on your take-home and the decisions inside it.",
        duration: "Week 2",
      },
      {
        step: "Leadership conversation",
        detail: "How you grow a team, with the Director of Engineering.",
        duration: "Week 3",
      },
    ],
    team: [
      { name: "Mette Sørensen", role: "Director of Engineering", initials: "MS" },
      { name: "Anders Holm", role: "Principal Engineer, Platform", initials: "AH" },
    ],
  },
  "c-tessera": {
    about:
      "Tessera AI builds the labelling and correction tools that research teams use to keep models honest. Small team, heavy craft, real users on the other side of every change.",
    founded: "2020",
    website: "tessera.ai",
    openRoles: 5,
    benefits: [
      "Remote-first with a Berlin studio you can use whenever",
      "€1,800 hardware budget refreshed every two years",
      "Conference speaking supported and paid for",
      "German public holidays plus 28 days",
    ],
    process: [
      {
        step: "Screen",
        detail: "A short call on your work and what you want to build.",
        duration: "Week 1",
      },
      {
        step: "Technical interview",
        detail: "Live coding on a real-time UI problem, no algorithm puzzles.",
        duration: "Week 1",
      },
      {
        step: "System design",
        detail: "Design a streaming annotation surface with a principal engineer.",
        duration: "Week 2",
      },
      {
        step: "Values and offer",
        detail: "Meet the founders, then a decision the same week.",
        duration: "Week 2",
      },
    ],
    team: [
      { name: "Jonas Weber", role: "Principal Engineer", initials: "JW" },
      { name: "Amara Diallo", role: "Head of Product", initials: "AD" },
    ],
  },
  "c-brightmile": {
    about:
      "Brightmile keeps shared-fleet vehicles moving in 19 cities. The growth team owns everything from the first tap to the first ride.",
    founded: "2019",
    website: "brightmile.com",
    openRoles: 9,
    benefits: [
      "Fully remote across EU and US time zones",
      "Unlimited leave with a 20-day floor the company enforces",
      "Quarterly experiment budget you spend without sign-off",
      "Free rides on the Brightmile network",
    ],
    process: [
      {
        step: "Intro call",
        detail: "30 minutes with the growth lead on your experiment track record.",
        duration: "Week 1",
      },
      {
        step: "Experiment review",
        detail: "Walk through a test you ran, including one that failed.",
        duration: "Week 1",
      },
      {
        step: "Working session",
        detail: "Two hours on the real activation funnel with the team.",
        duration: "Week 2",
      },
    ],
    team: [
      { name: "Ruth Alvarez", role: "Growth Lead", initials: "RA" },
      { name: "Kenji Watanabe", role: "Product Analyst", initials: "KW" },
    ],
  },
  "c-cadence": {
    about:
      "Cadence Health builds the app 1.2 million patients use to prepare for surgery. Accessibility is a release gate here, not a backlog item.",
    founded: "2014",
    website: "cadencehealth.com",
    openRoles: 24,
    benefits: [
      "Full medical, dental and vision from day one",
      "401(k) with 6% match",
      "16 weeks parental leave for every parent",
      "Hybrid: two days a week in the Boston office",
    ],
    process: [
      {
        step: "Recruiter screen",
        detail: "30 minutes on your mobile background and the role.",
        duration: "Week 1",
      },
      {
        step: "Technical screen",
        detail: "A React Native session with a senior engineer.",
        duration: "Week 2",
      },
      {
        step: "Onsite loop",
        detail: "Four rounds: coding, accessibility, product sense, values.",
        duration: "Week 3",
      },
      {
        step: "Committee review",
        detail: "A hiring committee reads the packet and decides.",
        duration: "Week 4",
      },
    ],
    team: [
      { name: "Nora Blake", role: "Director, Patient Apps", initials: "NB" },
      { name: "Elias Grant", role: "Accessibility Lead", initials: "EG" },
    ],
  },
  "c-meridian": {
    about:
      "Meridian Bank runs trading desks in London, Singapore and New York. The web platform team owns the terminal traders keep open all day.",
    founded: "1971",
    website: "meridianbank.co.uk",
    openRoles: 42,
    benefits: [
      "Discretionary annual bonus",
      "Private medical for you and dependants",
      "Non-contributory pension at 10%",
      "Season ticket loan and cycle-to-work scheme",
    ],
    process: [
      {
        step: "HR screen",
        detail: "A 30-minute conversation on the role and compensation.",
        duration: "Week 1",
      },
      {
        step: "Technical assessment",
        detail: "A timed exercise on rendering performance.",
        duration: "Week 2",
      },
      {
        step: "Panel interview",
        detail: "Three rounds with the desk engineering team, on site.",
        duration: "Week 3",
      },
    ],
    team: [
      { name: "Priyanka Shah", role: "Head of Web Platform", initials: "PS" },
      { name: "Callum Wright", role: "Lead Engineer, Trading UI", initials: "CW" },
    ],
  },
  "c-orbital": {
    about:
      "Orbital Freight schedules ships, cranes and trucks across 40 terminals. The web group turns that scheduling into something a human can actually operate.",
    founded: "2004",
    website: "orbitalfreight.com",
    openRoles: 18,
    benefits: [
      "Collective labour agreement terms with a 13th month",
      "Hybrid working, two days in Rotterdam",
      "Lease car or a full public transport card",
      "27 days holiday",
    ],
    process: [
      {
        step: "Introduction",
        detail: "A call with the recruiter and the hiring director.",
        duration: "Week 1",
      },
      {
        step: "Leadership case",
        detail: "Present how you would restructure a nine-person group.",
        duration: "Week 2",
      },
      {
        step: "Team meet",
        detail: "Meet four engineers from the group you would lead.",
        duration: "Week 3",
      },
      {
        step: "Final and offer",
        detail: "A closing conversation with the CTO.",
        duration: "Week 4",
      },
    ],
    team: [
      { name: "Wouter de Vries", role: "Director of Engineering", initials: "WV" },
      { name: "Femke Bakker", role: "Principal Product Manager", initials: "FB" },
    ],
  },
};

const jobDetails: Record<string, JobDetail> = {
  "j-1042": {
    about:
      "Northwind's component library sits under six products and every customer-facing surface the company ships. It has grown by accretion for three years and now needs an owner with a point of view. You would take it from a collection of components to a system, working next to the two designers who use it most.",
    responsibilities: [
      "Own the component library end to end: API design, accessibility, docs, release.",
      "Pair weekly with design on the token system and the next generation of the library.",
      "Cut migration paths for six product teams so upgrades never mean a rewrite sprint.",
      "Set the accessibility bar and hold releases that miss it.",
    ],
    requirements: [
      "Five or more years building product UI with React and TypeScript.",
      "You have owned a shared component library that other teams depended on.",
      "Comfortable with WAI-ARIA patterns and keyboard interaction beyond the basics.",
      "You write for other engineers: docs, RFCs, migration guides.",
    ],
    niceToHave: [
      "Experience with a headless primitive library such as Radix or Ark.",
      "You have run a design token pipeline across web and native.",
    ],
    matchBreakdown: [
      { label: "Skills", score: 98, note: "React, TypeScript, design systems — all core to your last three roles" },
      { label: "Seniority", score: 95, note: "Senior, matching your current level" },
      { label: "Location", score: 100, note: "Amsterdam hybrid, 20 minutes from you" },
      { label: "Compensation", score: 90, note: "Range sits just above your stated target" },
    ],
  },
  "j-1038": {
    about:
      "You would be the third engineer at Paperkite, working directly on the canvas that 40,000 designers use every day. The work runs from cursor latency in a WebGL renderer to the copy on the pricing page, sometimes in the same week.",
    responsibilities: [
      "Ship features end to end on a canvas editor with no handoffs in between.",
      "Keep interaction latency under 16ms as the document model grows.",
      "Decide what to build next with the founders, not after them.",
      "Set engineering practice for the people hired after you.",
    ],
    requirements: [
      "Seven or more years shipping product, with real depth in TypeScript.",
      "You have worked on a rendering-heavy or real-time interface.",
      "Comfortable owning a decision without a spec to hide behind.",
      "You have been early at a small company and liked it.",
    ],
    niceToHave: [
      "WebGL, WebGPU or Canvas2D rendering experience.",
      "Rust, or the appetite to learn it for the document engine.",
    ],
    matchBreakdown: [
      { label: "Skills", score: 92, note: "Strong TypeScript overlap; canvas work would be new" },
      { label: "Seniority", score: 88, note: "Staff scope, one step above your current title" },
      { label: "Location", score: 100, note: "Remote across Europe" },
      { label: "Compensation", score: 96, note: "Above your target, with meaningful equity" },
    ],
  },
  "j-1031": {
    about:
      "The operator console is how Lumen's customers dispatch 2.3 GW of storage across nine markets. You would lead the four-person platform team that keeps it fast, typed and shippable, and grow that team to seven over the next year.",
    responsibilities: [
      "Lead a four-person platform team: roadmap, delivery and growth of the people on it.",
      "Own the monorepo, the build pipeline and the release train for six front-end apps.",
      "Cut the median CI run from 19 minutes to under 8.",
      "Stay hands-on for roughly a third of your week.",
    ],
    requirements: [
      "Experience leading a front-end or platform team of three or more.",
      "Deep React and monorepo tooling knowledge, ideally Turborepo or Nx.",
      "You have run a migration across multiple teams without freezing product work.",
      "Willing to be in Copenhagen three days a week; relocation is supported.",
    ],
    niceToHave: [
      "Energy, industrial or other high-consequence domain experience.",
      "You have mentored engineers into senior roles.",
    ],
    matchBreakdown: [
      { label: "Skills", score: 90, note: "Platform and mentoring experience line up" },
      { label: "Seniority", score: 86, note: "Lead scope, a step up from senior IC" },
      { label: "Location", score: 72, note: "Copenhagen hybrid — relocation supported" },
      { label: "Compensation", score: 94, note: "Comfortably above your target" },
    ],
  },
  "j-1029": {
    about:
      "Researchers correct model output on a live stream of thousands of items an hour. The annotation surface has to keep up without losing a keystroke. You would own that surface and the interaction model behind it.",
    responsibilities: [
      "Build the real-time annotation surface, from keyboard model to render loop.",
      "Work directly with ML researchers as your users, in the same week they need it.",
      "Keep a 60fps floor with thousands of items streaming in.",
      "Shape the product with a two-person design team.",
    ],
    requirements: [
      "Five or more years with React and TypeScript in data-heavy interfaces.",
      "Experience with streaming data, virtualisation or windowing.",
      "You care about keyboard-first interaction design.",
      "Working hours overlapping Central European Time.",
    ],
    niceToHave: [
      "Python familiarity for reading the pipeline side.",
      "D3 or another visualisation library.",
    ],
    matchBreakdown: [
      { label: "Skills", score: 88, note: "React and data-heavy UI are a direct match" },
      { label: "Seniority", score: 92, note: "Senior, matching your current level" },
      { label: "Location", score: 100, note: "Remote, CET overlap" },
      { label: "Compensation", score: 78, note: "Slightly below your stated target" },
    ],
  },
  "j-1024": {
    about:
      "Signup and activation is where Brightmile wins or loses a city. You would own the experiment loop across that funnel, with the freedom to ship and the data to know whether it worked.",
    responsibilities: [
      "Run the experiment loop on signup and activation, from hypothesis to readout.",
      "Ship full-stack changes in Next.js without waiting on another team.",
      "Own the activation metric for the cities you are assigned.",
      "Write up what you learned, including the tests that failed.",
    ],
    requirements: [
      "Three or more years shipping product with Next.js or similar.",
      "You have run A/B tests and can explain what you did when results were flat.",
      "SQL comfortable enough to answer your own questions.",
      "Bias toward shipping a small thing this week.",
    ],
    niceToHave: [
      "Marketplace or mobility product experience.",
      "Familiarity with a warehouse-native experimentation stack.",
    ],
    matchBreakdown: [
      { label: "Skills", score: 84, note: "Next.js overlap; experimentation would be newer ground" },
      { label: "Seniority", score: 70, note: "Mid-level scope, below your current title" },
      { label: "Location", score: 100, note: "Remote across EU and US" },
      { label: "Compensation", score: 76, note: "Below your target at the midpoint" },
    ],
  },
  "j-1019": {
    about:
      "1.2 million patients use the Cadence app to get ready for surgery, often on an old phone, often anxious, often the day before. Every release passes an accessibility gate before it ships.",
    responsibilities: [
      "Build and maintain patient-facing React Native features across iOS and Android.",
      "Meet WCAG 2.2 AA on every screen you ship, verified before release.",
      "Work with clinical staff to turn care protocols into flows patients finish.",
      "Keep the app usable on five-year-old hardware.",
    ],
    requirements: [
      "Four or more years with React Native in production.",
      "Demonstrated accessibility practice, not just awareness.",
      "GraphQL experience.",
      "Two days a week in the Boston office.",
    ],
    niceToHave: [
      "Healthcare or another regulated domain.",
      "You have worked under HIPAA constraints.",
    ],
    matchBreakdown: [
      { label: "Skills", score: 74, note: "Accessibility matches; React Native is adjacent to your web work" },
      { label: "Seniority", score: 92, note: "Senior, matching your current level" },
      { label: "Location", score: 30, note: "Boston hybrid, outside your stated regions" },
      { label: "Compensation", score: 96, note: "Well above your target" },
    ],
  },
  "j-1013": {
    about:
      "Traders keep the Meridian terminal open for nine hours a day. A dropped frame during a market move is a real cost, so the rendering budget is 16ms and it is not negotiable.",
    responsibilities: [
      "Own rendering performance on the desk terminal, with a hard 16ms budget.",
      "Build canvas and WebSocket surfaces that stay stable under market load.",
      "Sit with traders on the desk to see how the tools are actually used.",
      "Profile, measure and defend the performance budget in review.",
    ],
    requirements: [
      "Five or more years of TypeScript with a performance focus.",
      "WebSocket and streaming data experience at volume.",
      "Canvas or WebGL rendering.",
      "On site in London five days a week.",
    ],
    niceToHave: [
      "Financial markets background.",
      "Experience with Web Workers and OffscreenCanvas.",
    ],
    matchBreakdown: [
      { label: "Skills", score: 82, note: "TypeScript and performance work align" },
      { label: "Seniority", score: 92, note: "Senior, matching your current level" },
      { label: "Location", score: 20, note: "On site in London, five days a week" },
      { label: "Compensation", score: 88, note: "Above your target" },
    ],
  },
  "j-1008": {
    about:
      "Paperkite's new brand system exists in Figma and nowhere else. This six-month contract turns it into shipped interface: tokens, components, motion, and the documentation that keeps it alive after you leave.",
    responsibilities: [
      "Translate the brand system into production tokens and components.",
      "Own the motion language across the marketing site and the app shell.",
      "Document the system so the in-house team can carry it forward.",
      "Work alongside the founding designer, two days a week in Lisbon.",
    ],
    requirements: [
      "Strong CSS, including modern layout and container queries.",
      "You move fluently between Figma and code.",
      "Motion design experience in a real product, not just prototypes.",
      "Available for a six-month engagement starting in September.",
    ],
    niceToHave: [
      "You have delivered a design system as a contractor before.",
      "Comfort with React server components.",
    ],
    matchBreakdown: [
      { label: "Skills", score: 90, note: "Design systems and CSS depth are a direct match" },
      { label: "Seniority", score: 72, note: "Mid-level contract scope" },
      { label: "Location", score: 64, note: "Lisbon hybrid for two days a week" },
      { label: "Compensation", score: 80, note: "Day rate converts near your current package" },
    ],
  },
  "j-1004": {
    about:
      "Port scheduling runs on software that 40 terminals depend on daily. You would take over a nine-person web group that has shipped steadily but has outgrown its structure.",
    responsibilities: [
      "Manage nine engineers across two web teams, including two seniors ready for staff.",
      "Own hiring for the group, roughly six roles over the next year.",
      "Set the roadmap with product for the terminal scheduling surface.",
      "Keep enough code context to be useful in review.",
    ],
    requirements: [
      "Three or more years managing engineers, including managing managers or leads.",
      "A React background deep enough to earn the team's trust.",
      "Track record hiring and growing senior engineers.",
      "Two days a week in Rotterdam.",
    ],
    niceToHave: [
      "Logistics, supply chain or another operations-heavy domain.",
      "Experience restructuring a team that had drifted.",
    ],
    matchBreakdown: [
      { label: "Skills", score: 62, note: "Management scope is a change of track from IC work" },
      { label: "Seniority", score: 80, note: "Lead scope, above your current level" },
      { label: "Location", score: 78, note: "Rotterdam hybrid, an hour by train" },
      { label: "Compensation", score: 98, note: "The top of your range" },
    ],
  },
  "j-0998": {
    about:
      "Checkout and metering carry $40M of self-serve revenue and have not been touched in two years. You would rebuild both, with the freedom to change the data model underneath them.",
    responsibilities: [
      "Rebuild checkout, plan selection and the metering surfaces.",
      "Work with finance on how usage becomes an invoice a customer understands.",
      "Raise test coverage on the billing paths that currently have none.",
      "Ship behind flags, migrate customers in cohorts.",
    ],
    requirements: [
      "Five or more years with React and TypeScript.",
      "You have worked on billing, payments or another money-touching surface.",
      "Serious about testing where mistakes are expensive.",
      "European time zone.",
    ],
    niceToHave: [
      "Stripe Billing experience.",
      "You have run a pricing migration without a support spike.",
    ],
    matchBreakdown: [
      { label: "Skills", score: 86, note: "React and TypeScript match; billing domain would be new" },
      { label: "Seniority", score: 92, note: "Senior, matching your current level" },
      { label: "Location", score: 100, note: "Remote across Europe" },
      { label: "Compensation", score: 88, note: "In line with your target" },
    ],
  },
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function jobSlug(job: Job) {
  return `${slugify(job.title)}-at-${slugify(job.company.name)}-${job.id}`;
}

export function jobHref(job: Job) {
  return `/jobs/${jobSlug(job)}`;
}

export function getJobBySlug(slug: string) {
  const job = jobs.find((item) => jobSlug(item) === slug);
  if (!job) return null;
  return {
    job,
    detail: jobDetails[job.id],
    company: companyProfiles[job.company.id],
  };
}

export function allJobSlugs() {
  return jobs.map((job) => jobSlug(job));
}

export function similarJobs(job: Job, limit = 4) {
  return jobs
    .filter((item) => item.id !== job.id)
    .map((item) => ({
      item,
      affinity:
        (item.company.id === job.company.id ? 30 : 0) +
        item.skills.filter((skill) => job.skills.includes(skill)).length * 12 +
        (item.seniority === job.seniority ? 10 : 0) +
        item.matchScore / 10,
    }))
    .sort((a, b) => b.affinity - a.affinity)
    .slice(0, limit)
    .map((entry) => entry.item);
}

const CONTRACT_DAYS_PER_YEAR = 220;

export function annualSalary(job: Job) {
  return job.employment === "Contract"
    ? job.salaryMin * CONTRACT_DAYS_PER_YEAR
    : job.salaryMin;
}

const AGE_IN_HOURS = { hour: 1, day: 24, week: 168, month: 720 } as const;

export function postedHours(job: Job) {
  const match = /(\d+)\s+(hour|day|week|month)/.exec(job.postedAgo);
  if (!match) return 0;
  const [, amount, unit] = match;
  return Number(amount) * AGE_IN_HOURS[unit as keyof typeof AGE_IN_HOURS];
}

export function companyFacets() {
  return Object.values(
    jobs.reduce<Record<string, { company: Company; count: number }>>(
      (acc, job) => {
        acc[job.company.id] ??= { company: job.company, count: 0 };
        acc[job.company.id].count += 1;
        return acc;
      },
      {}
    )
  ).sort((a, b) => b.count - a.count || a.company.name.localeCompare(b.company.name));
}

export function skillFacets(limit = 10) {
  const counts = jobs
    .flatMap((job) => job.skills)
    .reduce<Record<string, number>>((acc, skill) => {
      acc[skill] = (acc[skill] ?? 0) + 1;
      return acc;
    }, {});

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([skill, count]) => ({ skill, count }));
}

export function formatSalary(job: Job) {
  const compact = (n: number) =>
    n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`;
  const suffix = job.employment === "Contract" ? " / day" : " / yr";
  const range =
    job.employment === "Contract"
      ? `${job.currency}${job.salaryMin}–${job.salaryMax}`
      : `${job.currency}${compact(job.salaryMin)}–${compact(job.salaryMax)}`;
  return `${range}${suffix}`;
}
