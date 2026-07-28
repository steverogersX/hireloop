import { and, asc, avg, count, desc, eq, ilike, inArray, or, type SQL } from "drizzle-orm";
import { db } from "@/db";
import {
  companies,
  companyFollows,
  companyProfiles,
  companyReviews,
  companyTeamMembers,
  hiringProcessSteps,
  jobs,
  type Company,
} from "@/db/schema";
import { ApiError } from "@/utils/ApiError";
import { buildMeta } from "@/utils/ApiResponse";
import { uniqueSlug } from "@/utils/id";
import type {
  CreateCompanyInput,
  CreateReviewInput,
  ListCompaniesQuery,
  ProcessStepInput,
  TeamMemberInput,
  UpdateCompanyInput,
  UpdateCompanyProfileInput,
} from "./company.schema";

async function requireOwnership(companyId: string, ownerId: string) {
  const company = await db.query.companies.findFirst({ where: eq(companies.id, companyId) });
  if (!company) throw ApiError.notFound("Company not found");
  if (company.ownerId !== ownerId) throw ApiError.forbidden("You do not own this company");
  return company;
}

export async function createCompany(
  ownerId: string,
  input: CreateCompanyInput,
): Promise<Company> {
  const existing = await db.query.companies.findFirst({ where: eq(companies.ownerId, ownerId) });
  if (existing) throw ApiError.conflict("You already own a company profile");

  return db.transaction(async (tx) => {
    const [company] = await tx
      .insert(companies)
      .values({ ...input, ownerId, slug: uniqueSlug(input.name) })
      .returning();

    await tx.insert(companyProfiles).values({ companyId: company!.id });
    return company!;
  });
}

export async function listCompanies(query: ListCompaniesQuery, userId?: string) {
  const filters: SQL[] = [];

  if (query.q) {
    const term = `%${query.q}%`;
    const match = or(
      ilike(companies.name, term),
      ilike(companies.industry, term),
      ilike(companies.location, term),
    );
    if (match) filters.push(match);
  }
  if (query.industry?.length) filters.push(inArray(companies.industry, query.industry));
  if (query.size?.length) filters.push(inArray(companies.size, query.size));

  if (query.followedOnly) {
    if (!userId) throw ApiError.unauthorized("Sign in to filter by companies you follow");
    const followed = await db
      .select({ companyId: companyFollows.companyId })
      .from(companyFollows)
      .where(eq(companyFollows.userId, userId));
    const ids = followed.map((row) => row.companyId);
    if (ids.length === 0) {
      return { items: [], meta: buildMeta(query.page, query.limit, 0) };
    }
    filters.push(inArray(companies.id, ids));
  }

  const where = filters.length ? and(...filters) : undefined;

  const rows = await db.query.companies.findMany({ where, with: { profile: true } });

  const openCounts = await db
    .select({ companyId: jobs.companyId, value: count() })
    .from(jobs)
    .where(eq(jobs.status, "PUBLISHED"))
    .groupBy(jobs.companyId);
  const openMap = new Map(openCounts.map((row) => [row.companyId, row.value]));

  const followed = userId
    ? new Set(
        (
          await db
            .select({ companyId: companyFollows.companyId })
            .from(companyFollows)
            .where(eq(companyFollows.userId, userId))
        ).map((row) => row.companyId),
      )
    : new Set<string>();

  let items = rows.map((company) => ({
    ...company,
    openRoles: openMap.get(company.id) ?? 0,
    following: followed.has(company.id),
  }));

  if (query.hiringOnly) items = items.filter((company) => company.openRoles > 0);
  if (query.minRating != null) {
    items = items.filter((company) => (company.profile?.rating ?? 0) >= query.minRating!);
  }

  items.sort((a, b) => {
    if (query.sort === "rating") return (b.profile?.rating ?? 0) - (a.profile?.rating ?? 0);
    if (query.sort === "name") return a.name.localeCompare(b.name);
    if (query.sort === "newest") return b.createdAt.getTime() - a.createdAt.getTime();
    return b.openRoles - a.openRoles;
  });

  const start = (query.page - 1) * query.limit;

  return {
    items: items.slice(start, start + query.limit),
    meta: buildMeta(query.page, query.limit, items.length),
  };
}

export async function getCompanyBySlug(slug: string, userId?: string) {
  const company = await db.query.companies.findFirst({
    where: eq(companies.slug, slug),
    with: {
      profile: true,
      team: { orderBy: asc(companyTeamMembers.position) },
      process: { orderBy: asc(hiringProcessSteps.position) },
      jobs: { where: eq(jobs.status, "PUBLISHED"), orderBy: desc(jobs.publishedAt) },
    },
  });
  if (!company) throw ApiError.notFound("Company not found");

  const [reviews, [followers], following] = await Promise.all([
    db.query.companyReviews.findMany({
      where: eq(companyReviews.companyId, company.id),
      orderBy: desc(companyReviews.createdAt),
      limit: 20,
    }),
    db
      .select({ value: count() })
      .from(companyFollows)
      .where(eq(companyFollows.companyId, company.id)),
    userId
      ? db.query.companyFollows.findFirst({
          where: and(
            eq(companyFollows.companyId, company.id),
            eq(companyFollows.userId, userId),
          ),
        })
      : Promise.resolve(null),
  ]);

  const techStack = [...new Set(company.jobs.flatMap((job) => job.skills))];

  return {
    ...company,
    reviews,
    techStack,
    openRoles: company.jobs.length,
    followerCount: followers?.value ?? 0,
    following: Boolean(following),
  };
}

export async function getMyCompany(ownerId: string) {
  const company = await db.query.companies.findFirst({
    where: eq(companies.ownerId, ownerId),
    with: { profile: true, team: true, process: true },
  });
  if (!company) throw ApiError.notFound("You have not created a company profile yet");
  return company;
}

export async function updateCompany(
  id: string,
  ownerId: string,
  input: UpdateCompanyInput,
): Promise<Company> {
  await requireOwnership(id, ownerId);

  const [updated] = await db
    .update(companies)
    .set(input)
    .where(eq(companies.id, id))
    .returning();

  return updated!;
}

export async function updateCompanyProfile(
  id: string,
  ownerId: string,
  input: UpdateCompanyProfileInput,
) {
  await requireOwnership(id, ownerId);

  const existing = await db.query.companyProfiles.findFirst({
    where: eq(companyProfiles.companyId, id),
  });

  if (!existing) {
    const [row] = await db
      .insert(companyProfiles)
      .values({ ...input, companyId: id })
      .returning();
    return row!;
  }

  const [row] = await db
    .update(companyProfiles)
    .set(input)
    .where(eq(companyProfiles.companyId, id))
    .returning();
  return row!;
}

export async function replaceTeam(id: string, ownerId: string, members: TeamMemberInput[]) {
  await requireOwnership(id, ownerId);

  return db.transaction(async (tx) => {
    await tx.delete(companyTeamMembers).where(eq(companyTeamMembers.companyId, id));
    if (members.length === 0) return [];
    return tx
      .insert(companyTeamMembers)
      .values(members.map((member) => ({ ...member, companyId: id })))
      .returning();
  });
}

export async function replaceProcess(id: string, ownerId: string, steps: ProcessStepInput[]) {
  await requireOwnership(id, ownerId);

  return db.transaction(async (tx) => {
    await tx.delete(hiringProcessSteps).where(eq(hiringProcessSteps.companyId, id));
    if (steps.length === 0) return [];
    return tx
      .insert(hiringProcessSteps)
      .values(steps.map((step) => ({ ...step, companyId: id })))
      .returning();
  });
}

export async function addReview(
  companyId: string,
  authorId: string,
  input: CreateReviewInput,
) {
  const company = await db.query.companies.findFirst({ where: eq(companies.id, companyId) });
  if (!company) throw ApiError.notFound("Company not found");

  const review = await db.transaction(async (tx) => {
    const [row] = await tx
      .insert(companyReviews)
      .values({ ...input, companyId, authorId })
      .returning();

    const [average] = await tx
      .select({ value: avg(companyReviews.rating) })
      .from(companyReviews)
      .where(eq(companyReviews.companyId, companyId));

    if (average?.value) {
      await tx
        .update(companyProfiles)
        .set({ rating: Math.round(Number(average.value) * 10) })
        .where(eq(companyProfiles.companyId, companyId));
    }

    return row!;
  });

  return review;
}

export async function follow(userId: string, companyId: string) {
  const company = await db.query.companies.findFirst({ where: eq(companies.id, companyId) });
  if (!company) throw ApiError.notFound("Company not found");

  const [row] = await db
    .insert(companyFollows)
    .values({ userId, companyId })
    .onConflictDoNothing()
    .returning();

  return row ?? { userId, companyId };
}

export async function unfollow(userId: string, companyId: string) {
  await db
    .delete(companyFollows)
    .where(and(eq(companyFollows.userId, userId), eq(companyFollows.companyId, companyId)));
}

export async function listFollowed(userId: string) {
  return db.query.companyFollows.findMany({
    where: eq(companyFollows.userId, userId),
    with: { company: { with: { profile: true } } },
    orderBy: desc(companyFollows.createdAt),
  });
}

export async function deleteCompany(id: string, ownerId: string): Promise<void> {
  await requireOwnership(id, ownerId);
  await db.delete(companies).where(eq(companies.id, id));
}

export type CompanyList = Awaited<ReturnType<typeof listCompanies>>;
export type CompanyListItem = CompanyList["items"][number];
export type CompanyDetail = Awaited<ReturnType<typeof getCompanyBySlug>>;
