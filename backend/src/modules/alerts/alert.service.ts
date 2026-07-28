import { and, count, desc, eq, gt, ilike, or, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { jobAlerts, jobs, savedSearches, type JobAlert } from "@/db/schema";
import { ApiError } from "@/utils/ApiError";

const FREQUENCY_WINDOW_HOURS = { INSTANT: 1, DAILY: 24, WEEKLY: 168 } as const;

function windowStart(alert: JobAlert) {
  const hours = FREQUENCY_WINDOW_HOURS[alert.frequency];
  return alert.lastSentAt ?? new Date(Date.now() - hours * 60 * 60 * 1000);
}

async function countNewMatches(alert: JobAlert) {
  if (!alert.active) return 0;

  const term = `%${alert.query}%`;
  const filters: SQL[] = [
    eq(jobs.status, "PUBLISHED"),
    gt(jobs.publishedAt, windowStart(alert)),
  ];

  const keyword = or(ilike(jobs.title, term), ilike(jobs.description, term));
  if (keyword) filters.push(keyword);
  if (alert.location) filters.push(ilike(jobs.location, `%${alert.location}%`));

  const [row] = await db
    .select({ value: count() })
    .from(jobs)
    .where(and(...filters));

  return row?.value ?? 0;
}

export async function listAlerts(userId: string) {
  const items = await db.query.jobAlerts.findMany({
    where: eq(jobAlerts.userId, userId),
    orderBy: desc(jobAlerts.createdAt),
  });

  return Promise.all(
    items.map(async (alert) => ({ ...alert, newCount: await countNewMatches(alert) })),
  );
}

export async function createAlert(userId: string, input: Record<string, unknown>) {
  const [alert] = await db
    .insert(jobAlerts)
    .values({ ...(input as typeof jobAlerts.$inferInsert), userId })
    .returning();
  return alert!;
}

async function requireAlert(userId: string, id: string) {
  const alert = await db.query.jobAlerts.findFirst({
    where: and(eq(jobAlerts.id, id), eq(jobAlerts.userId, userId)),
  });
  if (!alert) throw ApiError.notFound("Alert not found");
  return alert;
}

export async function updateAlert(userId: string, id: string, input: Record<string, unknown>) {
  await requireAlert(userId, id);
  const [alert] = await db
    .update(jobAlerts)
    .set(input)
    .where(eq(jobAlerts.id, id))
    .returning();
  return alert!;
}

export async function deleteAlert(userId: string, id: string) {
  await requireAlert(userId, id);
  await db.delete(jobAlerts).where(eq(jobAlerts.id, id));
}

export async function listSavedSearches(userId: string) {
  return db.query.savedSearches.findMany({
    where: eq(savedSearches.userId, userId),
    orderBy: desc(savedSearches.createdAt),
  });
}

export async function createSavedSearch(userId: string, input: Record<string, unknown>) {
  const [row] = await db
    .insert(savedSearches)
    .values({ ...(input as typeof savedSearches.$inferInsert), userId })
    .returning();
  return row!;
}

export async function deleteSavedSearch(userId: string, id: string) {
  const [row] = await db
    .delete(savedSearches)
    .where(and(eq(savedSearches.id, id), eq(savedSearches.userId, userId)))
    .returning();
  if (!row) throw ApiError.notFound("Saved search not found");
}

export type AlertWithCount = Awaited<ReturnType<typeof listAlerts>>[number];
