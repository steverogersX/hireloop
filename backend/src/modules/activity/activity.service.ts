import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import {
  activityItems,
  connectedAccounts,
  notificationPreferences,
  type ActivityItem,
} from "@/db/schema";
import { ApiError } from "@/utils/ApiError";

const DEFAULT_PREFERENCES = [
  { key: "ALERT_DIGEST", email: true, push: true },
  { key: "APPLICATION_UPDATES", email: true, push: true },
  { key: "MESSAGES", email: true, push: false },
  { key: "PROFILE_VIEWS", email: false, push: false },
  { key: "INTERVIEW_REMINDERS", email: true, push: true },
  { key: "PRODUCT_NEWS", email: false, push: false },
];

const DEFAULT_ACCOUNTS = ["GITHUB", "LINKEDIN", "GOOGLE_CALENDAR"];

export async function record(
  userId: string,
  kind: ActivityItem["kind"],
  title: string,
  detail?: string,
  href?: string,
) {
  const [item] = await db
    .insert(activityItems)
    .values({ userId, kind, title, detail, href })
    .returning();
  return item!;
}

export async function listActivity(userId: string, limit: number) {
  return db.query.activityItems.findMany({
    where: eq(activityItems.userId, userId),
    orderBy: desc(activityItems.createdAt),
    limit,
  });
}

export async function markAllRead(userId: string) {
  await db
    .update(activityItems)
    .set({ readAt: new Date() })
    .where(and(eq(activityItems.userId, userId), isNull(activityItems.readAt)));
}

export async function listPreferences(userId: string) {
  const existing = await db.query.notificationPreferences.findMany({
    where: eq(notificationPreferences.userId, userId),
  });
  if (existing.length > 0) return existing;

  return db
    .insert(notificationPreferences)
    .values(DEFAULT_PREFERENCES.map((preference) => ({ ...preference, userId })))
    .returning();
}

export async function updatePreference(
  userId: string,
  key: string,
  input: { email?: boolean; push?: boolean },
) {
  await listPreferences(userId);

  const [row] = await db
    .update(notificationPreferences)
    .set(input)
    .where(
      and(eq(notificationPreferences.userId, userId), eq(notificationPreferences.key, key)),
    )
    .returning();

  if (!row) throw ApiError.notFound("Notification preference not found");
  return row;
}

export async function listAccounts(userId: string) {
  const existing = await db.query.connectedAccounts.findMany({
    where: eq(connectedAccounts.userId, userId),
  });
  if (existing.length > 0) return existing;

  return db
    .insert(connectedAccounts)
    .values(DEFAULT_ACCOUNTS.map((provider) => ({ provider, userId })))
    .returning();
}

export async function setAccountConnection(
  userId: string,
  provider: string,
  connected: boolean,
) {
  await listAccounts(userId);

  const [row] = await db
    .update(connectedAccounts)
    .set({ connected, connectedAt: connected ? new Date() : null })
    .where(
      and(eq(connectedAccounts.userId, userId), eq(connectedAccounts.provider, provider)),
    )
    .returning();

  if (!row) throw ApiError.notFound("Account not found");
  return row;
}
