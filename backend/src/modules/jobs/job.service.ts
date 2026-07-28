import {
  and,
  arrayOverlaps,
  asc,
  count,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  ne,
  or,
  sql,
  type SQL,
} from "drizzle-orm";
import { db } from "@/db";
import { applications, companies, jobs, savedJobs, users, type Job } from "@/db/schema";
import { ApiError } from "@/utils/ApiError";
import { buildMeta, type Paginated } from "@/utils/ApiResponse";
import { uniqueSlug } from "@/utils/id";
import { matchJob, type MatchResult } from "@/utils/match";
import type { CreateJobInput, ListJobsQuery, UpdateJobInput } from "./job.schema";

type JobWithCompany = Job & { company: typeof companies.$inferSelect };

export type ScoredJob = JobWithCompany & {
  match: MatchResult;
  applicantCount: number;
  saved: boolean;
  applied: boolean;
};

async function loadCandidate(userId?: string) {
  if (!userId) return null;
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { location: true, headline: true },
    with: { profile: true },
  });
  return user ?? null;
}

async function requireOwnedCompany(ownerId: string) {
  const company = await db.query.companies.findFirst({ where: eq(companies.ownerId, ownerId) });
  if (!company) throw ApiError.forbidden("Create a company profile before posting jobs");
  return company;
}

async function requireOwnedJob(jobId: string, ownerId: string) {
  const job = await db.query.jobs.findFirst({
    where: eq(jobs.id, jobId),
    with: { company: true },
  });
  if (!job) throw ApiError.notFound("Job not found");
  if (job.company.ownerId !== ownerId) throw ApiError.forbidden("You do not own this job");
  return job;
}

async function decorate(items: JobWithCompany[], userId?: string): Promise<ScoredJob[]> {
  if (items.length === 0) return [];

  const jobIds = items.map((job) => job.id);
  const candidate = await loadCandidate(userId);

  const [counts, saved, applied] = await Promise.all([
    db
      .select({ jobId: applications.jobId, value: count() })
      .from(applications)
      .where(inArray(applications.jobId, jobIds))
      .groupBy(applications.jobId),
    userId
      ? db
          .select({ jobId: savedJobs.jobId })
          .from(savedJobs)
          .where(and(eq(savedJobs.userId, userId), inArray(savedJobs.jobId, jobIds)))
      : Promise.resolve([]),
    userId
      ? db
          .select({ jobId: applications.jobId })
          .from(applications)
          .where(
            and(eq(applications.candidateId, userId), inArray(applications.jobId, jobIds)),
          )
      : Promise.resolve([]),
  ]);

  const countMap = new Map(counts.map((row) => [row.jobId, row.value]));
  const savedSet = new Set(saved.map((row) => row.jobId));
  const appliedSet = new Set(applied.map((row) => row.jobId));

  return items.map((job) => ({
    ...job,
    match: matchJob(job, candidate),
    applicantCount: countMap.get(job.id) ?? 0,
    saved: savedSet.has(job.id),
    applied: appliedSet.has(job.id),
  }));
}

export async function createJob(ownerId: string, input: CreateJobInput): Promise<Job> {
  const company = await requireOwnedCompany(ownerId);

  const [job] = await db
    .insert(jobs)
    .values({
      ...input,
      companyId: company.id,
      slug: uniqueSlug(input.title),
      publishedAt: input.status === "PUBLISHED" ? new Date() : null,
    })
    .returning();

  return job!;
}

export async function listJobs(
  query: ListJobsQuery,
  userId?: string,
): Promise<Paginated<ScoredJob>> {
  const filters: SQL[] = [eq(jobs.status, "PUBLISHED")];

  if (query.q) {
    const term = `%${query.q}%`;
    const match = or(
      ilike(jobs.title, term),
      ilike(jobs.description, term),
      ilike(jobs.summary, term),
      sql`exists (select 1 from unnest(${jobs.skills}) skill where skill ilike ${term})`,
    );
    if (match) filters.push(match);
  }
  if (query.location) filters.push(ilike(jobs.location, `%${query.location}%`));
  if (query.workMode?.length) filters.push(inArray(jobs.workMode, query.workMode));
  if (query.employmentType?.length) {
    filters.push(inArray(jobs.employmentType, query.employmentType));
  }
  if (query.experienceLevel?.length) {
    filters.push(inArray(jobs.experienceLevel, query.experienceLevel));
  }
  if (query.companyId?.length) filters.push(inArray(jobs.companyId, query.companyId));
  if (query.salaryMin != null) filters.push(gte(jobs.salaryMax, query.salaryMin));
  if (query.skills?.length) filters.push(arrayOverlaps(jobs.skills, query.skills));
  if (query.easyApplyOnly) filters.push(eq(jobs.easyApply, true));
  if (query.postedWithinHours != null) {
    const since = new Date(Date.now() - query.postedWithinHours * 60 * 60 * 1000);
    filters.push(gte(jobs.publishedAt, since));
  }
  if (query.excludeApplied && userId) {
    filters.push(
      sql`not exists (select 1 from ${applications} a where a.job_id = ${jobs.id} and a.candidate_id = ${userId})`,
    );
  }

  const where = and(...filters);

  // Match and applicant sorting need decorated rows, so those two sorts page in memory.
  const inMemorySort = query.sort === "match" || query.sort === "applicants";

  const orderBy =
    query.sort === "oldest"
      ? asc(jobs.publishedAt)
      : query.sort === "salary"
        ? desc(jobs.salaryMax)
        : desc(jobs.publishedAt);

  if (!inMemorySort && query.minMatch == null) {
    const [rows, [totals]] = await Promise.all([
      db.query.jobs.findMany({
        where,
        with: { company: true },
        orderBy,
        limit: query.limit,
        offset: (query.page - 1) * query.limit,
      }),
      db.select({ value: count() }).from(jobs).where(where),
    ]);

    return {
      items: await decorate(rows, userId),
      meta: buildMeta(query.page, query.limit, totals?.value ?? 0),
    };
  }

  const rows = await db.query.jobs.findMany({ where, with: { company: true }, orderBy });
  let decorated = await decorate(rows, userId);

  if (query.minMatch != null) {
    decorated = decorated.filter((job) => job.match.score >= query.minMatch!);
  }
  if (query.sort === "match") {
    decorated.sort((a, b) => b.match.score - a.match.score);
  }
  if (query.sort === "applicants") {
    decorated.sort((a, b) => a.applicantCount - b.applicantCount);
  }

  const start = (query.page - 1) * query.limit;
  return {
    items: decorated.slice(start, start + query.limit),
    meta: buildMeta(query.page, query.limit, decorated.length),
  };
}

export async function getJobBySlug(slug: string, userId?: string) {
  const job = await db.query.jobs.findFirst({
    where: eq(jobs.slug, slug),
    with: {
      company: {
        with: { profile: true, team: true, process: true },
      },
    },
  });
  if (!job || job.status !== "PUBLISHED") throw ApiError.notFound("Job not found");

  await db
    .update(jobs)
    .set({ viewCount: sql`${jobs.viewCount} + 1` })
    .where(eq(jobs.id, job.id));

  const [decorated] = await decorate([job as unknown as JobWithCompany], userId);

  return { ...job, ...decorated, company: job.company };
}

export async function similarJobs(slug: string, userId?: string, limit = 4) {
  const job = await db.query.jobs.findFirst({ where: eq(jobs.slug, slug) });
  if (!job) throw ApiError.notFound("Job not found");

  const rows = await db.query.jobs.findMany({
    where: and(
      eq(jobs.status, "PUBLISHED"),
      ne(jobs.id, job.id),
      or(
        arrayOverlaps(jobs.skills, job.skills),
        eq(jobs.companyId, job.companyId),
        eq(jobs.experienceLevel, job.experienceLevel),
      )!,
    ),
    with: { company: true },
    limit: 25,
  });

  const decorated = await decorate(rows, userId);

  return decorated
    .map((item) => ({
      item,
      affinity:
        (item.companyId === job.companyId ? 30 : 0) +
        item.skills.filter((skill) => job.skills.includes(skill)).length * 12 +
        (item.experienceLevel === job.experienceLevel ? 10 : 0) +
        item.match.score / 10,
    }))
    .sort((a, b) => b.affinity - a.affinity)
    .slice(0, limit)
    .map((entry) => entry.item);
}

export async function listCompanyJobs(ownerId: string): Promise<Job[]> {
  const company = await requireOwnedCompany(ownerId);
  return db
    .select()
    .from(jobs)
    .where(eq(jobs.companyId, company.id))
    .orderBy(desc(jobs.createdAt));
}

export async function updateJob(
  jobId: string,
  ownerId: string,
  input: UpdateJobInput,
): Promise<Job> {
  const existing = await requireOwnedJob(jobId, ownerId);

  const publishedAt =
    input.status === "PUBLISHED" && !existing.publishedAt
      ? new Date()
      : (existing.publishedAt ?? null);

  const [updated] = await db
    .update(jobs)
    .set({ ...input, publishedAt })
    .where(eq(jobs.id, jobId))
    .returning();

  return updated!;
}

export async function deleteJob(jobId: string, ownerId: string): Promise<void> {
  await requireOwnedJob(jobId, ownerId);
  await db.delete(jobs).where(eq(jobs.id, jobId));
}

export type JobDetail = Awaited<ReturnType<typeof getJobBySlug>>;
