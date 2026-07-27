import { and, count, desc, eq, ilike } from "drizzle-orm";
import { db } from "@/db";
import { companies, type Company } from "@/db/schema";
import { ApiError } from "@/utils/ApiError";
import { buildMeta, type Paginated } from "@/utils/ApiResponse";
import { uniqueSlug } from "@/utils/id";
import type {
  CreateCompanyInput,
  ListCompaniesQuery,
  UpdateCompanyInput,
} from "./company.schema";

export async function createCompany(
  ownerId: string,
  input: CreateCompanyInput,
): Promise<Company> {
  const existing = await db.query.companies.findFirst({ where: eq(companies.ownerId, ownerId) });
  if (existing) throw ApiError.conflict("You already own a company profile");

  const [company] = await db
    .insert(companies)
    .values({ ...input, ownerId, slug: uniqueSlug(input.name) })
    .returning();

  return company!;
}

export async function listCompanies(query: ListCompaniesQuery): Promise<Paginated<Company>> {
  const filters = query.q ? [ilike(companies.name, `%${query.q}%`)] : [];
  const where = filters.length ? and(...filters) : undefined;

  const [items, [totals]] = await Promise.all([
    db
      .select()
      .from(companies)
      .where(where)
      .orderBy(desc(companies.createdAt))
      .limit(query.limit)
      .offset((query.page - 1) * query.limit),
    db.select({ value: count() }).from(companies).where(where),
  ]);

  return { items, meta: buildMeta(query.page, query.limit, totals?.value ?? 0) };
}

export async function getCompanyBySlug(slug: string) {
  const company = await db.query.companies.findFirst({
    where: eq(companies.slug, slug),
    with: { jobs: true },
  });
  if (!company) throw ApiError.notFound("Company not found");
  return company;
}

export async function getMyCompany(ownerId: string): Promise<Company> {
  const company = await db.query.companies.findFirst({ where: eq(companies.ownerId, ownerId) });
  if (!company) throw ApiError.notFound("You have not created a company profile yet");
  return company;
}

export async function updateCompany(
  id: string,
  ownerId: string,
  input: UpdateCompanyInput,
): Promise<Company> {
  const company = await db.query.companies.findFirst({ where: eq(companies.id, id) });
  if (!company) throw ApiError.notFound("Company not found");
  if (company.ownerId !== ownerId) throw ApiError.forbidden("You do not own this company");

  const [updated] = await db
    .update(companies)
    .set(input)
    .where(eq(companies.id, id))
    .returning();

  return updated!;
}

export async function deleteCompany(id: string, ownerId: string): Promise<void> {
  const company = await db.query.companies.findFirst({ where: eq(companies.id, id) });
  if (!company) throw ApiError.notFound("Company not found");
  if (company.ownerId !== ownerId) throw ApiError.forbidden("You do not own this company");

  await db.delete(companies).where(eq(companies.id, id));
}
