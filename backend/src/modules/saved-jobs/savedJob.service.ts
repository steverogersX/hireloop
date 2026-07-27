import { and, count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { jobs, savedJobs } from "@/db/schema";
import { ApiError } from "@/utils/ApiError";
import { buildMeta } from "@/utils/ApiResponse";
import type { ListSavedJobsQuery, SaveJobInput } from "./savedJob.schema";

export async function saveJob(userId: string, input: SaveJobInput) {
  const job = await db.query.jobs.findFirst({ where: eq(jobs.id, input.jobId) });
  if (!job) throw ApiError.notFound("Job not found");

  const existing = await db.query.savedJobs.findFirst({
    where: and(eq(savedJobs.jobId, input.jobId), eq(savedJobs.userId, userId)),
  });
  if (existing) return existing;

  const [saved] = await db.insert(savedJobs).values({ jobId: input.jobId, userId }).returning();
  return saved!;
}

export async function listSavedJobs(userId: string, query: ListSavedJobsQuery) {
  const where = eq(savedJobs.userId, userId);

  const [items, [totals]] = await Promise.all([
    db.query.savedJobs.findMany({
      where,
      with: { job: { with: { company: true } } },
      orderBy: desc(savedJobs.createdAt),
      limit: query.limit,
      offset: (query.page - 1) * query.limit,
    }),
    db.select({ value: count() }).from(savedJobs).where(where),
  ]);

  return { items, meta: buildMeta(query.page, query.limit, totals?.value ?? 0) };
}

export async function unsaveJob(userId: string, jobId: string): Promise<void> {
  await db
    .delete(savedJobs)
    .where(and(eq(savedJobs.jobId, jobId), eq(savedJobs.userId, userId)));
}

export type SavedJobList = Awaited<ReturnType<typeof listSavedJobs>>;
export type SavedJobItem = SavedJobList["items"][number];
