import type { Company } from "@/db/schema";
import type { IdParams, SlugParams } from "@/types/http";
import { created, noContent, paginated, success } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import * as companyService from "./company.service";
import type {
  CreateCompanyInput,
  ListCompaniesQuery,
  UpdateCompanyInput,
} from "./company.schema";

export const create = asyncHandler<Company, CreateCompanyInput>(async (req, res) => {
  const company = await companyService.createCompany(req.user!.sub, req.body);
  return created(res, company, "Company created");
});

export const list = asyncHandler<Company[], unknown, ListCompaniesQuery>(async (req, res) => {
  const result = await companyService.listCompanies(req.query);
  return paginated(res, result, "Companies fetched");
});

export const getBySlug = asyncHandler<
  Awaited<ReturnType<typeof companyService.getCompanyBySlug>>,
  unknown,
  never,
  SlugParams
>(async (req, res) => {
  const company = await companyService.getCompanyBySlug(req.params.slug);
  return success(res, company, "Company fetched");
});

export const getMine = asyncHandler<Company>(async (req, res) => {
  const company = await companyService.getMyCompany(req.user!.sub);
  return success(res, company, "Company fetched");
});

export const update = asyncHandler<Company, UpdateCompanyInput, unknown, IdParams>(
  async (req, res) => {
    const company = await companyService.updateCompany(req.params.id, req.user!.sub, req.body);
    return success(res, company, "Company updated");
  },
);

export const remove = asyncHandler<null, unknown, unknown, IdParams>(async (req, res) => {
  await companyService.deleteCompany(req.params.id, req.user!.sub);
  return noContent(res, "Company deleted");
});
