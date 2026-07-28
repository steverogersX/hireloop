import { and, asc, eq, gte, inArray, lte } from "drizzle-orm";
import { db } from "@/db";
import { applications, companies, interviews, jobs } from "@/db/schema";
import { ApiError } from "@/utils/ApiError";
import type {
  ListInterviewsQuery,
  ScheduleInterviewInput,
  UpdateInterviewInput,
} from "./interview.schema";

async function candidateApplicationIds(candidateId: string) {
  const rows = await db
    .select({ id: applications.id })
    .from(applications)
    .where(eq(applications.candidateId, candidateId));
  return rows.map((row) => row.id);
}

export async function listMyInterviews(candidateId: string, query: ListInterviewsQuery) {
  const ids = await candidateApplicationIds(candidateId);
  if (ids.length === 0) return [];

  const now = new Date();
  const horizon = new Date(now.getTime() + query.days * 24 * 60 * 60 * 1000);

  return db.query.interviews.findMany({
    where: and(
      inArray(interviews.applicationId, ids),
      ...(query.upcoming
        ? [gte(interviews.scheduledAt, now), lte(interviews.scheduledAt, horizon)]
        : []),
    ),
    with: { application: { with: { job: { with: { company: true } } } } },
    orderBy: asc(interviews.scheduledAt),
  });
}

async function requireEmployerAccess(applicationId: string, ownerId: string) {
  const application = await db.query.applications.findFirst({
    where: eq(applications.id, applicationId),
    with: { job: { with: { company: true } } },
  });
  if (!application) throw ApiError.notFound("Application not found");
  if (application.job.company.ownerId !== ownerId) {
    throw ApiError.forbidden("You do not manage this application");
  }
  return application;
}

export async function schedule(ownerId: string, input: ScheduleInterviewInput) {
  await requireEmployerAccess(input.applicationId, ownerId);

  return db.transaction(async (tx) => {
    const [interview] = await tx.insert(interviews).values(input).returning();

    await tx
      .update(applications)
      .set({ status: "INTERVIEW", lastActivityAt: new Date(), nextStep: input.round })
      .where(eq(applications.id, input.applicationId));

    return interview!;
  });
}

export async function update(ownerId: string, id: string, input: UpdateInterviewInput) {
  const existing = await db.query.interviews.findFirst({ where: eq(interviews.id, id) });
  if (!existing) throw ApiError.notFound("Interview not found");
  await requireEmployerAccess(existing.applicationId, ownerId);

  const [interview] = await db
    .update(interviews)
    .set(input)
    .where(eq(interviews.id, id))
    .returning();

  return interview!;
}

export async function listCompanyInterviews(ownerId: string) {
  const company = await db.query.companies.findFirst({ where: eq(companies.ownerId, ownerId) });
  if (!company) throw ApiError.forbidden("You do not have a company profile");

  const companyJobs = await db
    .select({ id: jobs.id })
    .from(jobs)
    .where(eq(jobs.companyId, company.id));
  const jobIds = companyJobs.map((job) => job.id);
  if (jobIds.length === 0) return [];

  const rows = await db
    .select({ id: applications.id })
    .from(applications)
    .where(inArray(applications.jobId, jobIds));
  const applicationIds = rows.map((row) => row.id);
  if (applicationIds.length === 0) return [];

  return db.query.interviews.findMany({
    where: inArray(interviews.applicationId, applicationIds),
    with: {
      application: {
        with: {
          job: true,
          candidate: { columns: { id: true, name: true, headline: true } },
        },
      },
    },
    orderBy: asc(interviews.scheduledAt),
  });
}

export type MyInterviews = Awaited<ReturnType<typeof listMyInterviews>>;
export type CompanyInterviews = Awaited<ReturnType<typeof listCompanyInterviews>>;
