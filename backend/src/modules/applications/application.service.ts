import { and, asc, count, desc, eq, inArray, type SQL } from "drizzle-orm";
import { db } from "@/db";
import {
  applicationEvents,
  applications,
  companies,
  jobs,
  type Application,
} from "@/db/schema";
import * as activityService from "@/modules/activity/activity.service";
import { ApiError } from "@/utils/ApiError";
import { buildMeta } from "@/utils/ApiResponse";
import type {
  ApplyInput,
  ListApplicationsQuery,
  UpdateApplicationStatusInput,
} from "./application.schema";

export async function apply(candidateId: string, input: ApplyInput): Promise<Application> {
  const job = await db.query.jobs.findFirst({
    where: eq(jobs.id, input.jobId),
    with: { company: true },
  });
  if (!job || job.status !== "PUBLISHED") throw ApiError.notFound("Job not found");

  const existing = await db.query.applications.findFirst({
    where: and(eq(applications.jobId, input.jobId), eq(applications.candidateId, candidateId)),
  });
  if (existing) throw ApiError.conflict("You already applied to this job");

  const application = await db.transaction(async (tx) => {
    const [row] = await tx
      .insert(applications)
      .values({ ...input, candidateId, nextStep: "Waiting on the first response" })
      .returning();

    await tx.insert(applicationEvents).values({
      applicationId: row!.id,
      status: "APPLIED",
      note: `Applied to ${job.title}`,
    });

    return row!;
  });

  await activityService.record(
    candidateId,
    "STAGE",
    `Applied to ${job.title}`,
    job.company.name,
    "/applications",
  );

  return application;
}

export async function listMyApplications(candidateId: string, query: ListApplicationsQuery) {
  const filters: SQL[] = [eq(applications.candidateId, candidateId)];
  if (query.status) filters.push(eq(applications.status, query.status));
  if (query.jobId) filters.push(eq(applications.jobId, query.jobId));
  const where = and(...filters);

  const [items, [totals]] = await Promise.all([
    db.query.applications.findMany({
      where,
      with: {
        job: { with: { company: true } },
        events: { orderBy: desc(applicationEvents.createdAt), limit: 1 },
        interviews: true,
      },
      orderBy: desc(applications.createdAt),
      limit: query.limit,
      offset: (query.page - 1) * query.limit,
    }),
    db.select({ value: count() }).from(applications).where(where),
  ]);

  const filtered = query.q
    ? items.filter((item) =>
        `${item.job.title} ${item.job.company.name}`
          .toLowerCase()
          .includes(query.q!.toLowerCase()),
      )
    : items;

  return {
    items: filtered.map((item) => ({
      ...item,
      lastUpdate: item.events[0]?.note ?? null,
      daysAgo: Math.floor(
        (Date.now() - item.createdAt.getTime()) / (24 * 60 * 60 * 1000),
      ),
    })),
    meta: buildMeta(query.page, query.limit, totals?.value ?? 0),
  };
}

export async function getMyApplication(candidateId: string, id: string) {
  const application = await db.query.applications.findFirst({
    where: and(eq(applications.id, id), eq(applications.candidateId, candidateId)),
    with: {
      job: { with: { company: true } },
      events: { orderBy: asc(applicationEvents.createdAt) },
      interviews: true,
    },
  });
  if (!application) throw ApiError.notFound("Application not found");
  return application;
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
      with: {
        job: true,
        candidate: { columns: { passwordHash: false }, with: { profile: true } },
        events: { orderBy: desc(applicationEvents.createdAt), limit: 1 },
        interviews: true,
      },
      orderBy: desc(applications.createdAt),
      limit: query.limit,
      offset: (query.page - 1) * query.limit,
    }),
    db.select({ value: count() }).from(applications).where(where),
  ]);

  const filtered = query.q
    ? items.filter((item) =>
        `${item.candidate.name} ${item.job.title}`
          .toLowerCase()
          .includes(query.q!.toLowerCase()),
      )
    : items;

  return { items: filtered, meta: buildMeta(query.page, query.limit, totals?.value ?? 0) };
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

  const updated = await db.transaction(async (tx) => {
    const [row] = await tx
      .update(applications)
      .set({
        status: input.status,
        nextStep: input.nextStep ?? application.nextStep,
        lastActivityAt: new Date(),
      })
      .where(eq(applications.id, applicationId))
      .returning();

    await tx.insert(applicationEvents).values({
      applicationId,
      status: input.status,
      note: input.note ?? `Moved to ${input.status.toLowerCase().replace("_", " ")}`,
    });

    return row!;
  });

  await activityService.record(
    application.candidateId,
    "STAGE",
    `${application.job.company.name} moved you to ${input.status.toLowerCase().replace("_", " ")}`,
    application.job.title,
    "/applications",
  );

  return updated;
}

export async function withdraw(applicationId: string, candidateId: string): Promise<Application> {
  const application = await db.query.applications.findFirst({
    where: eq(applications.id, applicationId),
  });
  if (!application) throw ApiError.notFound("Application not found");
  if (application.candidateId !== candidateId) throw ApiError.forbidden();

  return db.transaction(async (tx) => {
    const [row] = await tx
      .update(applications)
      .set({ status: "WITHDRAWN", lastActivityAt: new Date(), nextStep: null })
      .where(eq(applications.id, applicationId))
      .returning();

    await tx.insert(applicationEvents).values({
      applicationId,
      status: "WITHDRAWN",
      note: "You withdrew this application",
    });

    return row!;
  });
}

export type MyApplications = Awaited<ReturnType<typeof listMyApplications>>;
export type CompanyApplications = Awaited<ReturnType<typeof listCompanyApplications>>;
export type MyApplication = MyApplications["items"][number];
export type ApplicationDetail = Awaited<ReturnType<typeof getMyApplication>>;
export type CompanyApplication = CompanyApplications["items"][number];
