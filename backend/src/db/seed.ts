import bcrypt from "bcryptjs";
import { client, db } from "@/db";
import {
  activityItems,
  applicationEvents,
  applications,
  candidateProfiles,
  companies,
  companyFollows,
  companyProfiles,
  companyReviews,
  companyTeamMembers,
  connectedAccounts,
  educations,
  experiences,
  hiringProcessSteps,
  interviews,
  jobAlerts,
  jobs,
  messageThreads,
  messages,
  notificationPreferences,
  resumes,
  savedJobs,
  savedSearches,
  users,
} from "@/db/schema";
import { slugify } from "@/utils/id";

const now = Date.now();
const days = (n: number) => new Date(now - n * 24 * 60 * 60 * 1000);
const inDays = (n: number, hour = 14) => {
  const date = new Date(now + n * 24 * 60 * 60 * 1000);
  date.setHours(hour, 0, 0, 0);
  return date;
};

const COMPANY_SEED = [
  {
    name: "Northwind Labs",
    industry: "Developer tools",
    location: "Amsterdam, NL",
    size: "180-400",
    website: "https://northwindlabs.com",
    tagline: "Ship the thing, then write about why.",
    about:
      "Northwind Labs builds the observability layer that 4,000 engineering teams use to see what their services are doing in production.",
    founded: "2018",
    funding: "Series B",
    rating: 46,
    benefits: [
      "EUR 2,500 yearly learning budget, no approval needed",
      "Four-day week in July and August",
      "Home office setup up to EUR 3,000",
      "Relocation and visa support",
    ],
    values: [
      {
        title: "Write it down",
        detail: "Every non-trivial decision gets an RFC. Meetings start with ten minutes of reading.",
      },
      {
        title: "One owner per surface",
        detail: "Shared ownership means nobody owns it. Each surface has a name attached.",
      },
    ],
    offices: [
      { city: "Amsterdam", people: "210 people" },
      { city: "Remote, EU", people: "94 people" },
    ],
    metrics: [
      { label: "Headcount growth", value: "+38%", hint: "last 12 months" },
      { label: "Median tenure", value: "3.1 yrs", hint: "engineering" },
      { label: "Offer acceptance", value: "84%", hint: "2025 to date" },
      { label: "Time to hire", value: "18 days", hint: "median, engineering" },
    ],
    ratingBreakdown: [
      { label: "Engineering culture", score: 92 },
      { label: "Work-life balance", score: 88 },
      { label: "Management", score: 84 },
      { label: "Compensation", score: 79 },
    ],
    team: [
      { name: "Dara Okonkwo", role: "Talent Partner" },
      { name: "Sven Aalbers", role: "Engineering Manager, Web" },
    ],
    process: [
      { step: "Intro call", detail: "Thirty minutes with a talent partner.", duration: "Week 1" },
      { step: "Craft interview", detail: "Walk an engineer through something you built.", duration: "Week 1" },
      { step: "Paid work session", detail: "Half a day on a real component, paid at EUR 600.", duration: "Week 2" },
      { step: "Team and offer", detail: "Meet two colleagues, decision within 48 hours.", duration: "Week 2" },
    ],
    reviews: [
      {
        title: "The RFC culture is real, not decoration",
        body: "I have shipped three things that started as a document someone disagreed with. Reviews are slow in the best way.",
        rating: 5,
        roleTitle: "Senior Frontend Engineer",
      },
    ],
  },
  {
    name: "Paperkite",
    industry: "Design software",
    location: "Lisbon, PT",
    size: "40-80",
    website: "https://paperkite.design",
    tagline: "Nine people, one canvas, shipped every Friday.",
    about:
      "Paperkite makes a browser-based design canvas used by 40,000 designers. Nine people, one product, shipped weekly since 2022.",
    founded: "2021",
    funding: "Seed",
    rating: 48,
    benefits: [
      "Meaningful equity, four-year vest",
      "Fully remote across European time zones",
      "Two company offsites a year",
      "Friday afternoons for your own projects",
    ],
    values: [
      { title: "Taste is a requirement", detail: "Everyone here has an opinion about kerning." },
      { title: "No handoffs", detail: "Whoever picks up the work owns it from sketch to production." },
    ],
    offices: [
      { city: "Lisbon", people: "5 people" },
      { city: "Remote, EU", people: "4 people" },
    ],
    metrics: [
      { label: "Headcount growth", value: "+80%", hint: "5 to 9 this year" },
      { label: "Median tenure", value: "1.8 yrs", hint: "company is young" },
      { label: "Offer acceptance", value: "91%", hint: "small sample" },
      { label: "Time to hire", value: "11 days", hint: "median" },
    ],
    ratingBreakdown: [
      { label: "Engineering culture", score: 96 },
      { label: "Work-life balance", score: 82 },
      { label: "Management", score: 91 },
      { label: "Compensation", score: 86 },
    ],
    team: [
      { name: "Ines Carvalho", role: "Co-founder & CTO" },
      { name: "Tomas Reis", role: "Founding Designer" },
    ],
    process: [
      { step: "Founder call", detail: "Forty-five minutes on the product.", duration: "Week 1" },
      { step: "Build session", detail: "Pair on a real canvas bug for two hours.", duration: "Week 1" },
      { step: "Team day", detail: "Spend a day with the team, remote or in Lisbon.", duration: "Week 2" },
    ],
    reviews: [
      {
        title: "Fastest I have ever shipped",
        body: "Idea on Monday, in front of users on Friday. There is no one to catch your mistakes, and that cuts both ways.",
        rating: 5,
        roleTitle: "Product Engineer",
      },
    ],
  },
  {
    name: "Lumen Grid",
    industry: "Clean energy",
    location: "Copenhagen, DK",
    size: "220-500",
    website: "https://lumengrid.dk",
    tagline: "Software that keeps 2.3 GW balanced.",
    about:
      "Lumen Grid runs software for 2.3 GW of grid-scale battery storage across nine European markets.",
    founded: "2016",
    funding: "Series C",
    rating: 44,
    benefits: [
      "Danish pension scheme with 12% employer contribution",
      "Relocation package including housing stipend",
      "Six weeks paid leave",
      "Free electricity from the Lumen network",
    ],
    values: [
      { title: "Consequences are physical", detail: "A bad deploy moves real megawatts." },
      { title: "Grow the people", detail: "Every lead is measured on who they promoted." },
    ],
    offices: [
      { city: "Copenhagen", people: "260 people" },
      { city: "Hamburg", people: "70 people" },
    ],
    metrics: [
      { label: "Headcount growth", value: "+22%", hint: "last 12 months" },
      { label: "Median tenure", value: "4.4 yrs", hint: "company-wide" },
      { label: "Offer acceptance", value: "76%", hint: "relocation is a factor" },
      { label: "Time to hire", value: "31 days", hint: "median, engineering" },
    ],
    ratingBreakdown: [
      { label: "Engineering culture", score: 86 },
      { label: "Work-life balance", score: 94 },
      { label: "Management", score: 88 },
      { label: "Compensation", score: 83 },
    ],
    team: [
      { name: "Mette Sorensen", role: "Director of Engineering" },
      { name: "Anders Holm", role: "Principal Engineer, Platform" },
    ],
    process: [
      { step: "Recruiter screen", detail: "Thirty minutes on your platform experience.", duration: "Week 1" },
      { step: "Take-home", detail: "A four-hour scoped task on build tooling.", duration: "Week 1-2" },
      { step: "Technical deep dive", detail: "Ninety minutes on your take-home.", duration: "Week 2" },
      { step: "Leadership conversation", detail: "How you grow a team.", duration: "Week 3" },
    ],
    reviews: [],
  },
  {
    name: "Tessera AI",
    industry: "Applied ML",
    location: "Berlin, DE",
    size: "60-120",
    website: "https://tessera.ai",
    tagline: "Tools for the people who correct the models.",
    about:
      "Tessera AI builds the labelling and correction tools that research teams use to keep models honest.",
    founded: "2020",
    funding: "Series A",
    rating: 45,
    benefits: [
      "Remote-first with a Berlin studio",
      "EUR 1,800 hardware budget every two years",
      "Conference speaking supported and paid for",
    ],
    values: [
      { title: "Your user sits two desks away", detail: "Feedback arrives fast and blunt." },
      { title: "Latency is a feature", detail: "A dropped keystroke costs someone an afternoon." },
    ],
    offices: [
      { city: "Berlin", people: "48 people" },
      { city: "Remote, EU", people: "37 people" },
    ],
    metrics: [
      { label: "Headcount growth", value: "+64%", hint: "last 12 months" },
      { label: "Median tenure", value: "2.2 yrs", hint: "engineering" },
      { label: "Offer acceptance", value: "88%", hint: "2025 to date" },
      { label: "Time to hire", value: "14 days", hint: "median" },
    ],
    ratingBreakdown: [
      { label: "Engineering culture", score: 90 },
      { label: "Work-life balance", score: 85 },
      { label: "Management", score: 82 },
      { label: "Compensation", score: 80 },
    ],
    team: [
      { name: "Jonas Weber", role: "Principal Engineer" },
      { name: "Amara Diallo", role: "Head of Product" },
    ],
    process: [
      { step: "Screen", detail: "A short call on your work.", duration: "Week 1" },
      { step: "Technical interview", detail: "Live coding on a real-time UI problem.", duration: "Week 1" },
      { step: "System design", detail: "Design a streaming annotation surface.", duration: "Week 2" },
      { step: "Values and offer", detail: "Meet the founders, decision the same week.", duration: "Week 2" },
    ],
    reviews: [
      {
        title: "No algorithm puzzles, real problems instead",
        body: "The interview was a live session on an actual streaming UI problem. Since joining, the same honesty holds.",
        rating: 5,
        roleTitle: "Senior React Engineer",
      },
    ],
  },
  {
    name: "Brightmile",
    industry: "Mobility",
    location: "Austin, TX",
    size: "120-250",
    website: "https://brightmile.com",
    tagline: "Nineteen cities, one activation funnel.",
    about:
      "Brightmile keeps shared-fleet vehicles moving in 19 cities. The growth team owns everything from the first tap to the first ride.",
    founded: "2019",
    funding: "Series B",
    rating: 41,
    benefits: [
      "Fully remote across EU and US time zones",
      "Unlimited leave with a 20-day floor",
      "Quarterly experiment budget",
    ],
    values: [
      { title: "Ship the smallest test", detail: "A result this week beats a perfect design next quarter." },
      { title: "Write up the losses", detail: "Failed experiments get the same readout as the wins." },
    ],
    offices: [
      { city: "Austin", people: "90 people" },
      { city: "Remote, EU and US", people: "120 people" },
    ],
    metrics: [
      { label: "Headcount growth", value: "+15%", hint: "last 12 months" },
      { label: "Median tenure", value: "2.6 yrs", hint: "company-wide" },
      { label: "Offer acceptance", value: "71%", hint: "2025 to date" },
      { label: "Time to hire", value: "22 days", hint: "median" },
    ],
    ratingBreakdown: [
      { label: "Engineering culture", score: 80 },
      { label: "Work-life balance", score: 86 },
      { label: "Management", score: 74 },
      { label: "Compensation", score: 78 },
    ],
    team: [
      { name: "Ruth Alvarez", role: "Growth Lead" },
      { name: "Kenji Watanabe", role: "Product Analyst" },
    ],
    process: [
      { step: "Intro call", detail: "Thirty minutes on your experiment track record.", duration: "Week 1" },
      { step: "Experiment review", detail: "Walk through a test you ran, including one that failed.", duration: "Week 1" },
      { step: "Working session", detail: "Two hours on the real activation funnel.", duration: "Week 2" },
    ],
    reviews: [],
  },
  {
    name: "Cadence Health",
    industry: "Digital health",
    location: "Boston, MA",
    size: "500-1000",
    website: "https://cadencehealth.com",
    tagline: "1.2 million patients, one release gate.",
    about:
      "Cadence Health builds the app 1.2 million patients use to prepare for surgery. Accessibility is a release gate here, not a backlog item.",
    founded: "2014",
    funding: "Series D",
    rating: 42,
    benefits: [
      "Full medical, dental and vision from day one",
      "401(k) with 6% match",
      "16 weeks parental leave for every parent",
    ],
    values: [
      { title: "Accessibility blocks release", detail: "WCAG failures stop a ship the way a failing test does." },
      { title: "Clinicians in the room", detail: "Care protocols are designed with the nurses who run them." },
    ],
    offices: [
      { city: "Boston", people: "610 people" },
      { city: "Remote, US", people: "240 people" },
    ],
    metrics: [
      { label: "Headcount growth", value: "+9%", hint: "last 12 months" },
      { label: "Median tenure", value: "3.8 yrs", hint: "company-wide" },
      { label: "Offer acceptance", value: "68%", hint: "hybrid is a factor" },
      { label: "Time to hire", value: "42 days", hint: "committee review" },
    ],
    ratingBreakdown: [
      { label: "Engineering culture", score: 76 },
      { label: "Work-life balance", score: 81 },
      { label: "Management", score: 72 },
      { label: "Compensation", score: 90 },
    ],
    team: [
      { name: "Nora Blake", role: "Director, Patient Apps" },
      { name: "Elias Grant", role: "Accessibility Lead" },
    ],
    process: [
      { step: "Recruiter screen", detail: "Thirty minutes on your mobile background.", duration: "Week 1" },
      { step: "Technical screen", detail: "A React Native session with a senior engineer.", duration: "Week 2" },
      { step: "Onsite loop", detail: "Four rounds: coding, accessibility, product sense, values.", duration: "Week 3" },
      { step: "Committee review", detail: "A hiring committee reads the packet and decides.", duration: "Week 4" },
    ],
    reviews: [],
  },
  {
    name: "Meridian Bank",
    industry: "Financial services",
    location: "London, UK",
    size: "5000+",
    website: "https://meridianbank.co.uk",
    tagline: "Sixteen milliseconds, nine hours a day.",
    about:
      "Meridian Bank runs trading desks in London, Singapore and New York. The web platform team owns the terminal traders keep open all day.",
    founded: "1971",
    funding: "Public",
    rating: 37,
    benefits: [
      "Discretionary annual bonus",
      "Private medical for you and dependants",
      "Non-contributory pension at 10%",
    ],
    values: [
      { title: "The desk decides", detail: "Traders are the users and their stopwatch is the spec." },
      { title: "Measure before you argue", detail: "Performance claims arrive with a profile attached." },
    ],
    offices: [
      { city: "London", people: "3,400 people" },
      { city: "Singapore", people: "900 people" },
    ],
    metrics: [
      { label: "Headcount growth", value: "+3%", hint: "last 12 months" },
      { label: "Median tenure", value: "5.2 yrs", hint: "company-wide" },
      { label: "Offer acceptance", value: "62%", hint: "five days on site" },
      { label: "Time to hire", value: "38 days", hint: "median" },
    ],
    ratingBreakdown: [
      { label: "Engineering culture", score: 68 },
      { label: "Work-life balance", score: 58 },
      { label: "Management", score: 66 },
      { label: "Compensation", score: 94 },
    ],
    team: [
      { name: "Priyanka Shah", role: "Head of Web Platform" },
      { name: "Callum Wright", role: "Lead Engineer, Trading UI" },
    ],
    process: [
      { step: "HR screen", detail: "Thirty minutes on the role and compensation.", duration: "Week 1" },
      { step: "Technical assessment", detail: "A timed exercise on rendering performance.", duration: "Week 2" },
      { step: "Panel interview", detail: "Three rounds with the desk engineering team.", duration: "Week 3" },
    ],
    reviews: [],
  },
  {
    name: "Orbital Freight",
    industry: "Logistics",
    location: "Rotterdam, NL",
    size: "1000+",
    website: "https://orbitalfreight.com",
    tagline: "Forty terminals depend on this schedule.",
    about:
      "Orbital Freight schedules ships, cranes and trucks across 40 terminals. The web group turns that scheduling into something a human can operate.",
    founded: "2004",
    funding: "Public",
    rating: 39,
    benefits: [
      "Collective labour agreement terms with a 13th month",
      "Hybrid working, two days in Rotterdam",
      "Lease car or a full public transport card",
    ],
    values: [
      { title: "Operators over dashboards", detail: "If a planner cannot use it at 3am, it is not finished." },
      { title: "Boring on purpose", detail: "Stability beats novelty when ships are waiting." },
    ],
    offices: [
      { city: "Rotterdam", people: "820 people" },
      { city: "Antwerp", people: "260 people" },
    ],
    metrics: [
      { label: "Headcount growth", value: "+6%", hint: "last 12 months" },
      { label: "Median tenure", value: "6.0 yrs", hint: "company-wide" },
      { label: "Offer acceptance", value: "74%", hint: "2025 to date" },
      { label: "Time to hire", value: "35 days", hint: "median" },
    ],
    ratingBreakdown: [
      { label: "Engineering culture", score: 70 },
      { label: "Work-life balance", score: 84 },
      { label: "Management", score: 69 },
      { label: "Compensation", score: 81 },
    ],
    team: [
      { name: "Wouter de Vries", role: "Director of Engineering" },
      { name: "Femke Bakker", role: "Principal Product Manager" },
    ],
    process: [
      { step: "Introduction", detail: "A call with the recruiter and hiring director.", duration: "Week 1" },
      { step: "Leadership case", detail: "Present how you would restructure a nine-person group.", duration: "Week 2" },
      { step: "Team meet", detail: "Meet four engineers from the group you would lead.", duration: "Week 3" },
      { step: "Final and offer", detail: "A closing conversation with the CTO.", duration: "Week 4" },
    ],
    reviews: [],
  },
];

const JOB_SEED = [
  {
    company: "Northwind Labs",
    title: "Senior Frontend Engineer",
    summary:
      "Own the component library that every Northwind product builds on, and pair with design on the next generation of it.",
    description:
      "Northwind's component library sits under six products and every customer-facing surface the company ships. It has grown by accretion for three years and now needs an owner with a point of view.",
    responsibilities: [
      "Own the component library end to end: API design, accessibility, docs, release.",
      "Pair weekly with design on the token system.",
      "Cut migration paths for six product teams.",
    ],
    niceToHave: ["Experience with Radix or Ark", "Design token pipelines across web and native"],
    requirements: "Five or more years building product UI with React and TypeScript.",
    location: "Amsterdam, NL",
    workMode: "HYBRID" as const,
    employmentType: "FULL_TIME" as const,
    experienceLevel: "SENIOR" as const,
    salaryMin: 82000,
    salaryMax: 104000,
    currency: "EUR",
    equity: "0.05-0.12%",
    skills: ["React", "TypeScript", "Design systems", "Testing"],
    urgent: true,
    easyApply: true,
    respondsInDays: 2,
    publishedAt: days(0),
    viewCount: 320,
  },
  {
    company: "Paperkite",
    title: "Staff Product Engineer",
    summary:
      "Third engineering hire on a canvas editor used by 40,000 designers. You will ship end to end.",
    description:
      "You would be the third engineer at Paperkite, working directly on the canvas that 40,000 designers use every day.",
    responsibilities: [
      "Ship features end to end on a canvas editor with no handoffs.",
      "Keep interaction latency under 16ms as the document model grows.",
      "Decide what to build next with the founders.",
    ],
    niceToHave: ["WebGL or WebGPU rendering", "Rust, or the appetite to learn it"],
    requirements: "Seven or more years shipping product, with real depth in TypeScript.",
    location: "Remote - Europe",
    workMode: "REMOTE" as const,
    employmentType: "FULL_TIME" as const,
    experienceLevel: "LEAD" as const,
    salaryMin: 95000,
    salaryMax: 125000,
    currency: "EUR",
    equity: "0.3-0.6%",
    skills: ["TypeScript", "WebGL", "Product sense", "Rust"],
    easyApply: true,
    respondsInDays: 1,
    publishedAt: days(1),
    viewCount: 610,
  },
  {
    company: "Lumen Grid",
    title: "Frontend Platform Lead",
    summary: "Lead a four-person platform team building the operator console for 2.3 GW of storage.",
    description:
      "The operator console is how Lumen's customers dispatch 2.3 GW of storage across nine markets.",
    responsibilities: [
      "Lead a four-person platform team.",
      "Own the monorepo, build pipeline and release train.",
      "Cut the median CI run from 19 minutes to under 8.",
    ],
    niceToHave: ["Energy or industrial domain experience", "Mentored engineers into senior roles"],
    requirements: "Experience leading a front-end or platform team of three or more.",
    location: "Copenhagen, DK",
    workMode: "HYBRID" as const,
    employmentType: "FULL_TIME" as const,
    experienceLevel: "LEAD" as const,
    salaryMin: 88000,
    salaryMax: 112000,
    currency: "EUR",
    skills: ["React", "Monorepo", "CI/CD", "Mentoring"],
    easyApply: false,
    respondsInDays: 4,
    publishedAt: days(2),
    viewCount: 890,
  },
  {
    company: "Tessera AI",
    title: "Senior React Engineer",
    summary:
      "Build the annotation surface where ML researchers correct model output in real time.",
    description:
      "Researchers correct model output on a live stream of thousands of items an hour. The annotation surface has to keep up without losing a keystroke.",
    responsibilities: [
      "Build the real-time annotation surface.",
      "Work directly with ML researchers as your users.",
      "Keep a 60fps floor with thousands of items streaming in.",
    ],
    niceToHave: ["Python familiarity", "D3 or another visualisation library"],
    requirements: "Five or more years with React and TypeScript in data-heavy interfaces.",
    location: "Berlin, DE",
    workMode: "REMOTE" as const,
    employmentType: "FULL_TIME" as const,
    experienceLevel: "SENIOR" as const,
    salaryMin: 78000,
    salaryMax: 96000,
    currency: "EUR",
    equity: "0.1-0.2%",
    skills: ["React", "D3", "Python", "Streaming"],
    easyApply: true,
    respondsInDays: 3,
    publishedAt: days(3),
    viewCount: 705,
  },
  {
    company: "Northwind Labs",
    title: "Senior Frontend Engineer, Billing",
    summary: "Rebuild checkout and metering for a self-serve product crossing $40M ARR.",
    description:
      "Checkout and metering carry $40M of self-serve revenue and have not been touched in two years.",
    responsibilities: [
      "Rebuild checkout, plan selection and the metering surfaces.",
      "Work with finance on how usage becomes an invoice.",
      "Raise test coverage on the billing paths.",
    ],
    niceToHave: ["Stripe Billing experience", "Run a pricing migration"],
    requirements: "Five or more years with React and TypeScript.",
    location: "Remote - Europe",
    workMode: "REMOTE" as const,
    employmentType: "FULL_TIME" as const,
    experienceLevel: "SENIOR" as const,
    salaryMin: 80000,
    salaryMax: 100000,
    currency: "EUR",
    skills: ["TypeScript", "Stripe", "React", "Testing"],
    easyApply: false,
    respondsInDays: 2,
    publishedAt: days(7),
    viewCount: 1310,
  },
  {
    company: "Paperkite",
    title: "Design Engineer",
    summary: "Six-month contract turning the new brand system into shipped interface.",
    description:
      "Paperkite's new brand system exists in Figma and nowhere else. This contract turns it into production interface.",
    responsibilities: [
      "Translate the brand system into production tokens and components.",
      "Own the motion language across the marketing site.",
      "Document the system for the in-house team.",
    ],
    niceToHave: ["Delivered a design system as a contractor", "React server components"],
    requirements: "Strong CSS, including modern layout and container queries.",
    location: "Lisbon, PT",
    workMode: "HYBRID" as const,
    employmentType: "CONTRACT" as const,
    experienceLevel: "MID" as const,
    salaryMin: 105600,
    salaryMax: 136400,
    currency: "EUR",
    skills: ["Figma", "CSS", "Motion", "React"],
    easyApply: true,
    respondsInDays: 2,
    publishedAt: days(5),
    viewCount: 430,
  },
  {
    company: "Brightmile",
    title: "Product Engineer, Growth",
    summary: "Run the experiment loop on signup and activation for a fleet product used in 19 cities.",
    description:
      "Signup and activation is where Brightmile wins or loses a city. You would own the experiment loop across that funnel.",
    responsibilities: [
      "Run the experiment loop on signup and activation.",
      "Ship full-stack changes in Next.js without waiting on another team.",
      "Own the activation metric for the cities you are assigned.",
    ],
    niceToHave: ["Marketplace or mobility product experience", "Warehouse-native experimentation stack"],
    requirements: "Three or more years shipping product with Next.js or similar.",
    location: "Remote - EU/US",
    workMode: "REMOTE" as const,
    employmentType: "FULL_TIME" as const,
    experienceLevel: "MID" as const,
    salaryMin: 70000,
    salaryMax: 90000,
    currency: "USD",
    skills: ["Next.js", "A/B testing", "SQL", "Analytics"],
    easyApply: false,
    respondsInDays: 5,
    publishedAt: days(2),
    viewCount: 1240,
  },
  {
    company: "Cadence Health",
    title: "Senior Engineer, Patient Apps",
    summary: "Ship the app 1.2 million patients use to prepare for surgery, with accessibility as a release gate.",
    description:
      "1.2 million patients use the Cadence app to get ready for surgery, often on an old phone, often the day before.",
    responsibilities: [
      "Build patient-facing React Native features across iOS and Android.",
      "Meet WCAG 2.2 AA on every screen you ship.",
      "Work with clinical staff to turn care protocols into flows patients finish.",
    ],
    niceToHave: ["Healthcare or another regulated domain", "Worked under HIPAA constraints"],
    requirements: "Four or more years with React Native in production.",
    location: "Boston, MA",
    workMode: "HYBRID" as const,
    employmentType: "FULL_TIME" as const,
    experienceLevel: "SENIOR" as const,
    salaryMin: 145000,
    salaryMax: 175000,
    currency: "USD",
    skills: ["React Native", "HIPAA", "Accessibility", "GraphQL"],
    easyApply: false,
    respondsInDays: 6,
    publishedAt: days(3),
    viewCount: 2100,
  },
  {
    company: "Meridian Bank",
    title: "Frontend Engineer, Trading UI",
    summary: "Sub-16ms rendering on desk terminals traders keep open for nine hours a day.",
    description:
      "Traders keep the Meridian terminal open for nine hours a day. A dropped frame during a market move is a real cost.",
    responsibilities: [
      "Own rendering performance on the desk terminal, with a hard 16ms budget.",
      "Build canvas and WebSocket surfaces that stay stable under market load.",
      "Sit with traders on the desk to see how the tools are used.",
    ],
    niceToHave: ["Financial markets background", "Web Workers and OffscreenCanvas"],
    requirements: "Five or more years of TypeScript with a performance focus.",
    location: "London, UK",
    workMode: "ONSITE" as const,
    employmentType: "FULL_TIME" as const,
    experienceLevel: "SENIOR" as const,
    salaryMin: 90000,
    salaryMax: 120000,
    currency: "GBP",
    skills: ["TypeScript", "WebSockets", "Canvas", "Performance"],
    easyApply: false,
    respondsInDays: 8,
    publishedAt: days(4),
    viewCount: 1580,
  },
  {
    company: "Orbital Freight",
    title: "Engineering Manager, Web",
    summary: "Take over a nine-person web group behind port scheduling used across 40 terminals.",
    description:
      "Port scheduling runs on software that 40 terminals depend on daily. You would take over a nine-person web group.",
    responsibilities: [
      "Manage nine engineers across two web teams.",
      "Own hiring for the group, roughly six roles over the next year.",
      "Set the roadmap with product for the terminal scheduling surface.",
    ],
    niceToHave: ["Logistics or supply chain domain", "Restructured a team that had drifted"],
    requirements: "Three or more years managing engineers.",
    location: "Rotterdam, NL",
    workMode: "HYBRID" as const,
    employmentType: "FULL_TIME" as const,
    experienceLevel: "LEAD" as const,
    salaryMin: 96000,
    salaryMax: 128000,
    currency: "EUR",
    skills: ["Leadership", "React", "Hiring", "Roadmapping"],
    easyApply: false,
    respondsInDays: 7,
    publishedAt: days(6),
    viewCount: 720,
  },
];

async function seed() {
  await db.delete(activityItems);
  await db.delete(messages);
  await db.delete(messageThreads);
  await db.delete(interviews);
  await db.delete(applicationEvents);
  await db.delete(applications);
  await db.delete(savedJobs);
  await db.delete(savedSearches);
  await db.delete(jobAlerts);
  await db.delete(companyFollows);
  await db.delete(companyReviews);
  await db.delete(hiringProcessSteps);
  await db.delete(companyTeamMembers);
  await db.delete(companyProfiles);
  await db.delete(jobs);
  await db.delete(companies);
  await db.delete(connectedAccounts);
  await db.delete(notificationPreferences);
  await db.delete(resumes);
  await db.delete(educations);
  await db.delete(experiences);
  await db.delete(candidateProfiles);
  await db.delete(users);

  const passwordHash = await bcrypt.hash("password123", 12);

  const [candidate] = await db
    .insert(users)
    .values({
      name: "Priya Raman",
      email: "candidate@hireloop.dev",
      passwordHash,
      role: "CANDIDATE",
      headline: "Senior Frontend Engineer",
      location: "Amsterdam, NL",
    })
    .returning();

  await db.insert(candidateProfiles).values({
    userId: candidate!.id,
    bio: "Frontend engineer with eight years on design systems and data-heavy product UI.",
    phone: "+31 6 12 34 56 78",
    website: "priyaraman.dev",
    github: "github.com/priyaraman",
    linkedin: "linkedin.com/in/priyaraman",
    skills: [
      "React",
      "TypeScript",
      "Design systems",
      "Accessibility",
      "Testing",
      "Next.js",
      "CSS architecture",
      "Mentoring",
    ],
    languages: [
      { name: "English", level: "Fluent" },
      { name: "Dutch", level: "Conversational" },
      { name: "Tamil", level: "Native" },
    ],
    desiredRole: "Senior or Staff Frontend Engineer",
    salaryExpectation: 95000,
    currency: "EUR",
    preferredWorkMode: "HYBRID",
    noticePeriod: "1 month",
    profileViews: 218,
  });

  await db.insert(experiences).values([
    {
      userId: candidate!.id,
      role: "Senior Frontend Engineer",
      company: "Kestrel Software",
      location: "Amsterdam, NL",
      startDate: new Date("2022-03-01"),
      current: true,
      summary: "Own the design system behind four products.",
      highlights: [
        "Cut component duplication across four apps from 180 to 32 shared primitives.",
        "Took keyboard and screen reader support to WCAG 2.2 AA.",
      ],
    },
    {
      userId: candidate!.id,
      role: "Frontend Engineer",
      company: "Vellum Analytics",
      location: "Amsterdam, NL",
      startDate: new Date("2019-06-01"),
      endDate: new Date("2022-02-28"),
      summary: "Built the dashboard layer for a product analytics tool used by 900 teams.",
      highlights: ["Rebuilt the chart renderer, cutting time to interactive by 61%."],
    },
  ]);

  await db.insert(educations).values({
    userId: candidate!.id,
    school: "University of Amsterdam",
    degree: "MSc Information Studies, Human-Centered Multimedia",
    startYear: 2015,
    endYear: 2017,
    detail: "Thesis on keyboard interaction models in data-dense interfaces.",
  });

  await db.insert(resumes).values([
    {
      userId: candidate!.id,
      name: "priya-raman-frontend.pdf",
      url: "https://files.hireloop.dev/priya-raman-frontend.pdf",
      sizeBytes: 290816,
      isDefault: true,
      usedCount: 11,
    },
    {
      userId: candidate!.id,
      name: "priya-raman-platform.pdf",
      url: "https://files.hireloop.dev/priya-raman-platform.pdf",
      sizeBytes: 308224,
      usedCount: 3,
    },
  ]);

  const companyByName = new Map<string, string>();

  for (const seedCompany of COMPANY_SEED) {
    const [owner] = await db
      .insert(users)
      .values({
        name: `${seedCompany.name} Hiring`,
        email: `hiring@${slugify(seedCompany.name)}.dev`,
        passwordHash,
        role: "EMPLOYER",
        location: seedCompany.location,
      })
      .returning();

    const [company] = await db
      .insert(companies)
      .values({
        ownerId: owner!.id,
        name: seedCompany.name,
        slug: slugify(seedCompany.name),
        website: seedCompany.website,
        description: seedCompany.about,
        location: seedCompany.location,
        industry: seedCompany.industry,
        size: seedCompany.size,
      })
      .returning();

    companyByName.set(seedCompany.name, company!.id);

    await db.insert(companyProfiles).values({
      companyId: company!.id,
      tagline: seedCompany.tagline,
      about: seedCompany.about,
      founded: seedCompany.founded,
      funding: seedCompany.funding,
      rating: seedCompany.rating,
      benefits: seedCompany.benefits,
      values: seedCompany.values,
      offices: seedCompany.offices,
      metrics: seedCompany.metrics,
      ratingBreakdown: seedCompany.ratingBreakdown,
    });

    await db.insert(companyTeamMembers).values(
      seedCompany.team.map((member, index) => ({
        companyId: company!.id,
        name: member.name,
        role: member.role,
        position: index,
      })),
    );

    await db.insert(hiringProcessSteps).values(
      seedCompany.process.map((step, index) => ({
        companyId: company!.id,
        step: step.step,
        detail: step.detail,
        duration: step.duration,
        position: index,
      })),
    );

    if (seedCompany.reviews.length > 0) {
      await db.insert(companyReviews).values(
        seedCompany.reviews.map((review) => ({
          companyId: company!.id,
          authorId: candidate!.id,
          title: review.title,
          body: review.body,
          rating: review.rating,
          roleTitle: review.roleTitle,
        })),
      );
    }
  }

  const jobRows = await db
    .insert(jobs)
    .values(
      JOB_SEED.map((job) => ({
        companyId: companyByName.get(job.company)!,
        title: job.title,
        slug: slugify(`${job.title}-at-${job.company}`),
        summary: job.summary,
        description: job.description,
        requirements: job.requirements,
        responsibilities: job.responsibilities,
        niceToHave: job.niceToHave,
        location: job.location,
        workMode: job.workMode,
        employmentType: job.employmentType,
        experienceLevel: job.experienceLevel,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        currency: job.currency,
        equity: job.equity,
        skills: job.skills,
        status: "PUBLISHED" as const,
        urgent: job.urgent ?? false,
        easyApply: job.easyApply,
        respondsInDays: job.respondsInDays,
        viewCount: job.viewCount,
        publishedAt: job.publishedAt,
      })),
    )
    .returning();

  const jobByTitle = new Map(jobRows.map((job) => [job.title, job]));

  const applicationSeed = [
    { title: "Senior React Engineer", status: "INTERVIEW" as const, appliedDays: 15, next: "System design round, Thursday", source: "JOB_ALERT" as const },
    { title: "Senior Frontend Engineer, Billing", status: "IN_REVIEW" as const, appliedDays: 18, next: "Waiting on recruiter call slot", source: "DIRECT" as const },
    { title: "Frontend Platform Lead", status: "IN_REVIEW" as const, appliedDays: 20, next: "Take-home due Monday", source: "RECRUITER" as const },
    { title: "Engineering Manager, Web", status: "INTERVIEW" as const, appliedDays: 22, next: "Panel round, Tuesday 11:00", source: "REFERRAL" as const },
    { title: "Product Engineer, Growth", status: "APPLIED" as const, appliedDays: 24, next: "Follow up with the hiring manager", source: "JOB_ALERT" as const },
    { title: "Senior Engineer, Patient Apps", status: "APPLIED" as const, appliedDays: 26, next: "Nothing scheduled", source: "DIRECT" as const },
    { title: "Design Engineer", status: "OFFER" as const, appliedDays: 35, next: "Respond by 31 Jul", source: "REFERRAL" as const },
    { title: "Frontend Engineer, Trading UI", status: "REJECTED" as const, appliedDays: 43, next: "Ask to be kept on file", source: "JOB_ALERT" as const },
  ];

  for (const item of applicationSeed) {
    const job = jobByTitle.get(item.title)!;

    const [application] = await db
      .insert(applications)
      .values({
        jobId: job.id,
        candidateId: candidate!.id,
        status: item.status,
        source: item.source,
        nextStep: item.next,
        salaryExpectation: 95000,
        availableFrom: "After 1 month notice",
        createdAt: days(item.appliedDays),
        lastActivityAt: days(2),
      })
      .returning();

    await db.insert(applicationEvents).values([
      {
        applicationId: application!.id,
        status: "APPLIED",
        note: `Applied to ${job.title}`,
        createdAt: days(item.appliedDays),
      },
      {
        applicationId: application!.id,
        status: item.status,
        note: `Moved to ${item.status.toLowerCase().replace("_", " ")}`,
        createdAt: days(2),
      },
    ]);

    if (item.status === "INTERVIEW") {
      await db.insert(interviews).values({
        applicationId: application!.id,
        round: "System design",
        scheduledAt: inDays(2),
        durationMins: 60,
        mode: "VIDEO",
        interviewerName: "Jonas Weber",
        interviewerTitle: "Principal Engineer",
        status: "CONFIRMED",
      });
    }
  }

  await db.insert(savedJobs).values([
    {
      jobId: jobByTitle.get("Senior Frontend Engineer")!.id,
      userId: candidate!.id,
      folder: "SHORTLIST",
      note: "Dara replied fast last time. Ask about the design system roadmap.",
    },
    {
      jobId: jobByTitle.get("Staff Product Engineer")!.id,
      userId: candidate!.id,
      folder: "SHORTLIST",
      note: "Equity is the real upside here. Worth the canvas learning curve.",
    },
    {
      jobId: jobByTitle.get("Frontend Platform Lead")!.id,
      userId: candidate!.id,
      folder: "MAYBE",
      note: "Relocation is the open question. Check the housing stipend.",
    },
  ]);

  await db.insert(jobAlerts).values([
    {
      userId: candidate!.id,
      query: "Senior Frontend Engineer",
      location: "Amsterdam",
      frequency: "DAILY",
      channels: ["EMAIL", "PUSH"],
      filters: { experienceLevel: ["SENIOR"], salaryMin: 80000 },
      matchesTotal: 214,
      lastSentAt: days(1),
    },
    {
      userId: candidate!.id,
      query: "Design Engineer",
      location: "Remote",
      frequency: "WEEKLY",
      channels: ["EMAIL"],
      filters: { employmentType: ["CONTRACT", "FULL_TIME"] },
      matchesTotal: 61,
      lastSentAt: days(3),
    },
  ]);

  await db.insert(savedSearches).values({
    userId: candidate!.id,
    name: "Senior frontend, Amsterdam",
    params: { q: "frontend", location: "Amsterdam", salaryMin: 80000 },
    lastRunAt: days(0),
  });

  await db.insert(companyFollows).values([
    { userId: candidate!.id, companyId: companyByName.get("Northwind Labs")! },
    { userId: candidate!.id, companyId: companyByName.get("Paperkite")! },
  ]);

  const tesseraId = companyByName.get("Tessera AI")!;
  const tessera = await db.query.companies.findFirst({
    where: (table, { eq }) => eq(table.id, tesseraId),
  });

  const [thread] = await db
    .insert(messageThreads)
    .values({
      subject: "System design round on Thursday",
      candidateId: candidate!.id,
      companyId: tesseraId,
      jobId: jobByTitle.get("Senior React Engineer")!.id,
      starredByCandidate: true,
      lastMessageAt: days(0),
    })
    .returning();

  await db.insert(messages).values([
    {
      threadId: thread!.id,
      senderId: tessera!.ownerId,
      body: "Hi Priya, the team wants to move you to the system design round. Thursday 14:00 CEST works if it still does for you.",
      createdAt: days(1),
    },
    {
      threadId: thread!.id,
      senderId: candidate!.id,
      body: "Thursday at 14:00 works. Is there anything you would like me to prepare?",
      createdAt: days(1),
      readAt: days(1),
    },
    {
      threadId: thread!.id,
      senderId: tessera!.ownerId,
      body: "Mostly cold, but it will centre on a streaming annotation surface. Worth skimming how you have handled virtualisation before.",
      createdAt: days(0),
    },
  ]);

  await db.insert(activityItems).values([
    {
      userId: candidate!.id,
      kind: "VIEW",
      title: "Northwind Labs viewed your profile",
      detail: "Talent partner, third view this week",
      href: "/profile",
      createdAt: days(0),
    },
    {
      userId: candidate!.id,
      kind: "STAGE",
      title: "Tessera AI moved you to Interview",
      detail: "System design round scheduled for Thursday",
      href: "/applications",
      createdAt: days(0),
    },
    {
      userId: candidate!.id,
      kind: "MESSAGE",
      title: "Message from Tessera AI",
      detail: "Sending the brief today",
      href: "/messages",
      createdAt: days(1),
    },
  ]);

  console.log(
    `Seed complete: ${COMPANY_SEED.length} companies, ${jobRows.length} jobs, ${applicationSeed.length} applications`,
  );
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => client.end());
