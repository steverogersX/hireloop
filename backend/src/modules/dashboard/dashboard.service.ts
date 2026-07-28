import { and, avg, count, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  applicationEvents,
  applications,
  candidateProfiles,
  companyFollows,
  jobAlerts,
  savedJobs,
  type ApplicationStatus,
} from "@/db/schema";
import { unreadCount } from "@/modules/messages/message.service";

const OPEN_STATUSES: ApplicationStatus[] = ["APPLIED", "IN_REVIEW", "INTERVIEW", "OFFER"];

function daysAgo(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

export async function pipeline(candidateId: string) {
  const rows = await db
    .select({ status: applications.status, value: count() })
    .from(applications)
    .where(eq(applications.candidateId, candidateId))
    .groupBy(applications.status);

  const byStatus = Object.fromEntries(rows.map((row) => [row.status, row.value])) as Record<
    ApplicationStatus,
    number | undefined
  >;

  return {
    APPLIED: byStatus.APPLIED ?? 0,
    IN_REVIEW: byStatus.IN_REVIEW ?? 0,
    INTERVIEW: byStatus.INTERVIEW ?? 0,
    OFFER: byStatus.OFFER ?? 0,
    REJECTED: byStatus.REJECTED ?? 0,
    WITHDRAWN: byStatus.WITHDRAWN ?? 0,
  };
}

export async function stats(candidateId: string) {
  const [
    stages,
    [total],
    [lastMonth],
    [saved],
    [alerts],
    [follows],
    profile,
    unread,
  ] = await Promise.all([
    pipeline(candidateId),
    db
      .select({ value: count() })
      .from(applications)
      .where(eq(applications.candidateId, candidateId)),
    db
      .select({ value: count() })
      .from(applications)
      .where(
        and(
          eq(applications.candidateId, candidateId),
          gte(applications.createdAt, daysAgo(30)),
        ),
      ),
    db.select({ value: count() }).from(savedJobs).where(eq(savedJobs.userId, candidateId)),
    db
      .select({ value: count() })
      .from(jobAlerts)
      .where(and(eq(jobAlerts.userId, candidateId), eq(jobAlerts.active, true))),
    db
      .select({ value: count() })
      .from(companyFollows)
      .where(eq(companyFollows.userId, candidateId)),
    db.query.candidateProfiles.findFirst({
      where: eq(candidateProfiles.userId, candidateId),
    }),
    unreadCount(candidateId),
  ]);

  const open = OPEN_STATUSES.reduce((sum, status) => sum + stages[status], 0);

  return {
    applications: {
      total: total?.value ?? 0,
      lastThirtyDays: lastMonth?.value ?? 0,
      open,
    },
    inReview: stages.IN_REVIEW,
    interviews: stages.INTERVIEW,
    offers: stages.OFFER,
    savedJobs: saved?.value ?? 0,
    activeAlerts: alerts?.value ?? 0,
    following: follows?.value ?? 0,
    profileViews: profile?.profileViews ?? 0,
    unreadMessages: unread,
    pipeline: stages,
  };
}

export async function insights(candidateId: string) {
  const [[total], [replied], [interviewed], [firstReply]] = await Promise.all([
    db
      .select({ value: count() })
      .from(applications)
      .where(eq(applications.candidateId, candidateId)),
    db
      .select({ value: count() })
      .from(applications)
      .where(
        and(
          eq(applications.candidateId, candidateId),
          sql`${applications.status} <> 'APPLIED'`,
        ),
      ),
    db
      .select({ value: count() })
      .from(applications)
      .where(
        and(
          eq(applications.candidateId, candidateId),
          sql`${applications.status} in ('INTERVIEW', 'OFFER')`,
        ),
      ),
    db
      .select({
        value: avg(
          sql`extract(epoch from ${applicationEvents.createdAt} - ${applications.createdAt}) / 86400`,
        ),
      })
      .from(applicationEvents)
      .innerJoin(applications, eq(applicationEvents.applicationId, applications.id))
      .where(eq(applications.candidateId, candidateId)),
  ]);

  const totalValue = total?.value ?? 0;
  const repliedValue = replied?.value ?? 0;
  const interviewedValue = interviewed?.value ?? 0;
  const medianDays = firstReply?.value ? Number(firstReply.value) : null;

  const stale = await db
    .select({ value: count() })
    .from(applications)
    .where(
      and(
        eq(applications.candidateId, candidateId),
        eq(applications.status, "APPLIED"),
        sql`${applications.lastActivityAt} < ${daysAgo(21)}`,
      ),
    );

  return {
    total: totalValue,
    responseRate: totalValue ? Math.round((repliedValue / totalValue) * 100) : 0,
    interviewRate: totalValue ? Math.round((interviewedValue / totalValue) * 100) : 0,
    medianDaysToFirstReply: medianDays == null ? null : Math.round(medianDays * 10) / 10,
    needsAttention: stale[0]?.value ?? 0,
  };
}

export type DashboardStats = Awaited<ReturnType<typeof stats>>;
export type ApplicationInsights = Awaited<ReturnType<typeof insights>>;
