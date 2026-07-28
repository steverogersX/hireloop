import { and, count, desc, eq, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { jobs, savedJobs, users } from "@/db/schema";
import { ApiError } from "@/utils/ApiError";
import { buildMeta } from "@/utils/ApiResponse";
import { matchJob } from "@/utils/match";
import type {
  ListSavedJobsQuery,
  SaveJobInput,
  UpdateSavedJobInput,
} from "./savedJob.schema";

export async function saveJob(userId: string, input: SaveJobInput) {
  const job = await db.query.jobs.findFirst({ where: eq(jobs.id, input.jobId) });
  if (!job) throw ApiError.notFound("Job not found");

  const [saved] = await db
    .insert(savedJobs)
    .values({ jobId: input.jobId, userId, folder: input.folder, note: input.note })
    .onConflictDoUpdate({
      target: [savedJobs.jobId, savedJobs.userId],
      set: { folder: input.folder, note: input.note },
    })
    .returning();

  return saved!;
}

export async function listSavedJobs(userId: string, query: ListSavedJobsQuery) {
  const filters: SQL[] = [eq(savedJobs.userId, userId)];
  if (query.folder) filters.push(eq(savedJobs.folder, query.folder));
  const where = and(...filters);

  const [rows, [totals], candidate] = await Promise.all([
    db.query.savedJobs.findMany({
      where,
      with: { job: { with: { company: true } } },
      orderBy: desc(savedJobs.createdAt),
    }),
    db.select({ value: count() }).from(savedJobs).where(where),
    db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { location: true, headline: true },
      with: { profile: true },
    }),
  ]);

  let items = rows.map((row) => ({ ...row, match: matchJob(row.job, candidate ?? null) }));

  if (query.q) {
    const term = query.q.toLowerCase();
    items = items.filter((row) =>
      `${row.job.title} ${row.job.company.name} ${row.note ?? ""}`
        .toLowerCase()
        .includes(term),
    );
  }
  if (query.sort === "match") {
    items.sort((a, b) => b.match.score - a.match.score);
  }

  const start = (query.page - 1) * query.limit;

  return {
    items: items.slice(start, start + query.limit),
    meta: buildMeta(query.page, query.limit, query.q ? items.length : (totals?.value ?? 0)),
  };
}

export async function updateSavedJob(
  userId: string,
  jobId: string,
  input: UpdateSavedJobInput,
) {
  const [row] = await db
    .update(savedJobs)
    .set(input)
    .where(and(eq(savedJobs.jobId, jobId), eq(savedJobs.userId, userId)))
    .returning();
  if (!row) throw ApiError.notFound("Saved job not found");
  return row;
}

export async function unsaveJob(userId: string, jobId: string): Promise<void> {
  await db
    .delete(savedJobs)
    .where(and(eq(savedJobs.jobId, jobId), eq(savedJobs.userId, userId)));
}

export type SavedJobList = Awaited<ReturnType<typeof listSavedJobs>>;
export type SavedJobItem = SavedJobList["items"][number];
