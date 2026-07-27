import { and, count, desc, eq, inArray, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { applications, companies, jobs, type Application } from "@/db/schema";
import { ApiError } from "@/utils/ApiError";
import { buildMeta } from "@/utils/ApiResponse";
import type {
  ApplyInput,
  ListApplicationsQuery,
  UpdateApplicationStatusInput,
} from "./application.schema";

export async function apply(candidateId: string, input: ApplyInput): Promise<Application> {
  const job = await db.query.jobs.findFirst({ where: eq(jobs.id, input.jobId) });
  if (!job || job.status !== "PUBLISHED") throw ApiError.notFound("Job not found");

  const existing = await db.query.applications.findFirst({
    where: and(eq(applications.jobId, input.jobId), eq(applications.candidateId, candidateId)),
  });
  if (existing) throw ApiError.conflict("You already applied to this job");

  const [application] = await db
    .insert(applications)
    .values({ ...input, candidateId })
    .returning();

  return application!;
}

export async function listMyApplications(candidateId: string, query: ListApplicationsQuery) {
  const filters: SQL[] = [eq(applications.candidateId, candidateId)];
  if (query.status) filters.push(eq(applications.status, query.status));
  if (query.jobId) filters.push(eq(applications.jobId, query.jobId));
  const where = and(...filters);

  const [items, [totals]] = await Promise.all([
    db.query.applications.findMany({
      where,
      with: { job: { with: { company: true } } },
      orderBy: desc(applications.createdAt),
      limit: query.limit,
      offset: (query.page - 1) * query.limit,
    }),
    db.select({ value: count() }).from(applications).where(where),
  ]);

  return { items, meta: buildMeta(query.page, query.limit, totals?.value ?? 0) };
}

export async function listCompanyApplications(ownerId: string, query: ListApplicationsQuery) {
  const company = await db.query.companies.findFirst({ where: eq(companies.ownerId, ownerId) });
  if (!company) throw ApiError.forbidden("You do not have a company profile");

  const companyJobs = await db
    .select({ id: jobs.id })
    .from(jobs)
    .where(eq(jobs.companyId, company.id));

  const jobIds = companyJobs.map((job) => job.id);
  if (jobIds.length === 0) {
    return { items: [], meta: buildMeta(query.page, query.limit, 0) };
  }

  const filters: SQL[] = [inArray(applications.jobId, jobIds)];
  if (query.status) filters.push(eq(applications.status, query.status));
  if (query.jobId) filters.push(eq(applications.jobId, query.jobId));
  const where = and(...filters);

  const [items, [totals]] = await Promise.all([
    db.query.applications.findMany({
      where,
      with: { job: true, candidate: { columns: { passwordHash: false } } },
      orderBy: desc(applications.createdAt),
      limit: query.limit,
      offset: (query.page - 1) * query.limit,
    }),
    db.select({ value: count() }).from(applications).where(where),
  ]);

  return { items, meta: buildMeta(query.page, query.limit, totals?.value ?? 0) };
}

export async function updateStatus(
  applicationId: string,
  ownerId: string,
  input: UpdateApplicationStatusInput,
): Promise<Application> {
  const application = await db.query.applications.findFirst({
    where: eq(applications.id, applicationId),
    with: { job: { with: { company: true } } },
  });
  if (!application) throw ApiError.notFound("Application not found");
  if (application.job.company.ownerId !== ownerId) {
    throw ApiError.forbidden("You do not manage this application");
  }

  const [updated] = await db
    .update(applications)
    .set({ status: input.status })
    .where(eq(applications.id, applicationId))
    .returning();

  return updated!;
}

export async function withdraw(applicationId: string, candidateId: string): Promise<Application> {
  const application = await db.query.applications.findFirst({
    where: eq(applications.id, applicationId),
  });
  if (!application) throw ApiError.notFound("Application not found");
  if (application.candidateId !== candidateId) throw ApiError.forbidden();

  const [updated] = await db
    .update(applications)
    .set({ status: "WITHDRAWN" })
    .where(eq(applications.id, applicationId))
    .returning();

  return updated!;
}

export type MyApplications = Awaited<ReturnType<typeof listMyApplications>>;
export type CompanyApplications = Awaited<ReturnType<typeof listCompanyApplications>>;
export type MyApplication = MyApplications["items"][number];
export type CompanyApplication = CompanyApplications["items"][number];
