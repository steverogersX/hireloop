import { and, arrayOverlaps, asc, count, desc, eq, gte, ilike, or, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { companies, jobs, type Job } from "@/db/schema";
import { ApiError } from "@/utils/ApiError";
import { buildMeta, type Paginated } from "@/utils/ApiResponse";
import { uniqueSlug } from "@/utils/id";
import type { CreateJobInput, ListJobsQuery, UpdateJobInput } from "./job.schema";

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

export async function listJobs(query: ListJobsQuery): Promise<Paginated<Job>> {
  const filters: SQL[] = [eq(jobs.status, "PUBLISHED")];

  if (query.q) {
    const term = `%${query.q}%`;
    const match = or(ilike(jobs.title, term), ilike(jobs.description, term));
    if (match) filters.push(match);
  }
  if (query.location) filters.push(ilike(jobs.location, `%${query.location}%`));
  if (query.workMode) filters.push(eq(jobs.workMode, query.workMode));
  if (query.employmentType) filters.push(eq(jobs.employmentType, query.employmentType));
  if (query.experienceLevel) filters.push(eq(jobs.experienceLevel, query.experienceLevel));
  if (query.companyId) filters.push(eq(jobs.companyId, query.companyId));
  if (query.salaryMin != null) filters.push(gte(jobs.salaryMin, query.salaryMin));
  if (query.skills?.length) filters.push(arrayOverlaps(jobs.skills, query.skills));

  const where = and(...filters);
  const orderBy =
    query.sort === "oldest"
      ? asc(jobs.publishedAt)
      : query.sort === "salary"
        ? desc(jobs.salaryMax)
        : desc(jobs.publishedAt);

  const [items, [totals]] = await Promise.all([
    db
      .select()
      .from(jobs)
      .where(where)
      .orderBy(orderBy)
      .limit(query.limit)
      .offset((query.page - 1) * query.limit),
    db.select({ value: count() }).from(jobs).where(where),
  ]);

  return { items, meta: buildMeta(query.page, query.limit, totals?.value ?? 0) };
}

export async function getJobBySlug(slug: string) {
  const job = await db.query.jobs.findFirst({
    where: eq(jobs.slug, slug),
    with: { company: true },
  });
  if (!job) throw ApiError.notFound("Job not found");
  if (job.status !== "PUBLISHED") throw ApiError.notFound("Job not found");
  return job;
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
