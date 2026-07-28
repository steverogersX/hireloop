import type { CandidateProfile, Job, User } from "@/db/schema";

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

const LEVEL_ORDER = ["INTERN", "ENTRY", "MID", "SENIOR", "LEAD"] as const;

const WEIGHTS = { skills: 0.45, seniority: 0.2, location: 0.2, compensation: 0.15 };

type Candidate = Pick<User, "location" | "headline"> & {
  profile?: Pick<
    CandidateProfile,
    "skills" | "preferredWorkMode" | "salaryExpectation" | "willRelocate"
  > | null;
};

function normalise(value: string) {
  return value.trim().toLowerCase();
}

function scoreSkills(job: Job, skills: string[]): MatchFacet {
  if (job.skills.length === 0) {
    return { label: "Skills", score: 60, note: "This role does not list skills" };
  }

  const owned = new Set(skills.map(normalise));
  const overlap = job.skills.filter((skill) => owned.has(normalise(skill)));
  const score = Math.round((overlap.length / job.skills.length) * 100);

  return {
    label: "Skills",
    score,
    note: overlap.length
      ? `${overlap.slice(0, 3).join(", ")} match your profile`
      : "None of the listed skills are on your profile yet",
  };
}

function scoreSeniority(job: Job, headline: string | null): MatchFacet {
  const jobIndex = LEVEL_ORDER.indexOf(job.experienceLevel);
  const text = normalise(headline ?? "");
  const ownIndex = LEVEL_ORDER.findIndex((level) =>
    text.includes(level.toLowerCase().replace("_", " ")),
  );

  if (ownIndex === -1) {
    return { label: "Seniority", score: 70, note: `Listed as ${job.experienceLevel}` };
  }

  const distance = Math.abs(jobIndex - ownIndex);
  const score = Math.max(0, 100 - distance * 25);
  const note =
    distance === 0
      ? "Matches your current level"
      : jobIndex > ownIndex
        ? "A step up from your current level"
        : "Below your current level";

  return { label: "Seniority", score, note };
}

function scoreLocation(job: Job, candidate: Candidate): MatchFacet {
  if (job.workMode === "REMOTE") {
    return { label: "Location", score: 100, note: "Remote, so location is not a factor" };
  }

  const home = normalise(candidate.location ?? "");
  const city = normalise(job.location.split(",")[0] ?? "");

  if (home && city && home.includes(city)) {
    return { label: "Location", score: 100, note: `${job.location} is where you are based` };
  }
  if (candidate.profile?.willRelocate) {
    return { label: "Location", score: 65, note: "Outside your city, but you are open to moving" };
  }
  return { label: "Location", score: 25, note: `${job.location} is outside your area` };
}

function scoreCompensation(job: Job, expectation: number | null | undefined): MatchFacet {
  if (!expectation) {
    return { label: "Compensation", score: 70, note: "Add a salary expectation to sharpen this" };
  }
  if (job.salaryMax == null) {
    return { label: "Compensation", score: 60, note: "This role does not publish a range" };
  }
  if (job.salaryMax >= expectation) {
    const headroom = Math.round(((job.salaryMax - expectation) / expectation) * 100);
    return {
      label: "Compensation",
      score: Math.min(100, 85 + headroom),
      note: headroom > 5 ? "Above your target" : "In line with your target",
    };
  }

  const shortfall = (expectation - job.salaryMax) / expectation;
  return {
    label: "Compensation",
    score: Math.max(0, Math.round((1 - shortfall) * 85)),
    note: "Below your stated target",
  };
}

export function matchJob(job: Job, candidate: Candidate | null): MatchResult {
  if (!candidate) {
    return { score: 0, facets: [], reasons: [] };
  }

  const facets = [
    scoreSkills(job, candidate.profile?.skills ?? []),
    scoreSeniority(job, candidate.headline),
    scoreLocation(job, candidate),
    scoreCompensation(job, candidate.profile?.salaryExpectation),
  ];

  const [skills, seniority, location, compensation] = facets as [
    MatchFacet,
    MatchFacet,
    MatchFacet,
    MatchFacet,
  ];

  const score = Math.round(
    skills.score * WEIGHTS.skills +
      seniority.score * WEIGHTS.seniority +
      location.score * WEIGHTS.location +
      compensation.score * WEIGHTS.compensation,
  );

  const reasons = facets.filter((facet) => facet.score >= 80).map((facet) => facet.note);

  return { score, facets, reasons };
}

export function profileStrength(input: {
  profile: CandidateProfile | null;
  experienceCount: number;
  educationCount: number;
  resumeCount: number;
}): { score: number; gaps: { label: string; weight: number }[] } {
  const checks = [
    { label: "Add a bio", weight: 15, done: Boolean(input.profile?.bio) },
    {
      label: "Add at least three skills",
      weight: 20,
      done: (input.profile?.skills.length ?? 0) >= 3,
    },
    { label: "Add your work history", weight: 20, done: input.experienceCount > 0 },
    { label: "Add your education", weight: 10, done: input.educationCount > 0 },
    { label: "Upload a resume", weight: 15, done: input.resumeCount > 0 },
    {
      label: "Confirm salary expectation",
      weight: 10,
      done: Boolean(input.profile?.salaryExpectation),
    },
    {
      label: "Add two portfolio links",
      weight: 10,
      done: Boolean(input.profile?.website) && Boolean(input.profile?.github),
    },
  ];

  return {
    score: checks.filter((c) => c.done).reduce((sum, c) => sum + c.weight, 0),
    gaps: checks.filter((c) => !c.done).map(({ label, weight }) => ({ label, weight })),
  };
}
