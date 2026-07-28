import { z } from "zod";
import type { Company, CompanyProfile, CompanyReview } from "@/db/schema";
import type { IdParams, SlugParams } from "@/types/http";
import { created, noContent, paginated, success } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import * as companyService from "./company.service";
import {
  processStepSchema,
  teamMemberSchema,
  type CreateCompanyInput,
  type CreateReviewInput,
  type ListCompaniesQuery,
  type UpdateCompanyInput,
  type UpdateCompanyProfileInput,
} from "./company.schema";

export const teamPayloadSchema = z.object({ members: z.array(teamMemberSchema).max(20) });
export const processPayloadSchema = z.object({ steps: z.array(processStepSchema).max(12) });

export const create = asyncHandler<Company, CreateCompanyInput>(async (req, res) => {
  const company = await companyService.createCompany(req.user!.sub, req.body);
  return created(res, company, "Company created");
});

export const list = asyncHandler<companyService.CompanyListItem[], unknown, ListCompaniesQuery>(
  async (req, res) => {
    const result = await companyService.listCompanies(req.query, req.user?.sub);
    return paginated(res, result, "Companies fetched");
  },
);

export const getBySlug = asyncHandler<
  companyService.CompanyDetail,
  unknown,
  never,
  SlugParams
>(async (req, res) => {
  const company = await companyService.getCompanyBySlug(req.params.slug, req.user?.sub);
  return success(res, company, "Company fetched");
});

export const getMine = asyncHandler<Awaited<ReturnType<typeof companyService.getMyCompany>>>(
  async (req, res) => {
    const company = await companyService.getMyCompany(req.user!.sub);
    return success(res, company, "Company fetched");
  },
);

export const update = asyncHandler<Company, UpdateCompanyInput, unknown, IdParams>(
  async (req, res) => {
    const company = await companyService.updateCompany(req.params.id, req.user!.sub, req.body);
    return success(res, company, "Company updated");
  },
);

export const updateProfile = asyncHandler<
  CompanyProfile,
  UpdateCompanyProfileInput,
  unknown,
  IdParams
>(async (req, res) => {
  const profile = await companyService.updateCompanyProfile(
    req.params.id,
    req.user!.sub,
    req.body,
  );
  return success(res, profile, "Company profile updated");
});

export const replaceTeam = asyncHandler<
  Awaited<ReturnType<typeof companyService.replaceTeam>>,
  z.infer<typeof teamPayloadSchema>,
  unknown,
  IdParams
>(async (req, res) => {
  const team = await companyService.replaceTeam(
    req.params.id,
    req.user!.sub,
    req.body.members,
  );
  return success(res, team, "Hiring team updated");
});

export const replaceProcess = asyncHandler<
  Awaited<ReturnType<typeof companyService.replaceProcess>>,
  z.infer<typeof processPayloadSchema>,
  unknown,
  IdParams
>(async (req, res) => {
  const steps = await companyService.replaceProcess(
    req.params.id,
    req.user!.sub,
    req.body.steps,
  );
  return success(res, steps, "Hiring process updated");
});

export const addReview = asyncHandler<CompanyReview, CreateReviewInput, unknown, IdParams>(
  async (req, res) => {
    const review = await companyService.addReview(req.params.id, req.user!.sub, req.body);
    return created(res, review, "Review published");
  },
);

export const follow = asyncHandler<
  Awaited<ReturnType<typeof companyService.follow>>,
  unknown,
  unknown,
  IdParams
>(async (req, res) => {
  const row = await companyService.follow(req.user!.sub, req.params.id);
  return success(res, row, "Following company");
});

export const unfollow = asyncHandler<null, unknown, unknown, IdParams>(async (req, res) => {
  await companyService.unfollow(req.user!.sub, req.params.id);
  return noContent(res, "Unfollowed company");
});

export const listFollowed = asyncHandler<
  Awaited<ReturnType<typeof companyService.listFollowed>>
>(async (req, res) => {
  const items = await companyService.listFollowed(req.user!.sub);
  return success(res, items, "Followed companies fetched");
});

export const remove = asyncHandler<null, unknown, unknown, IdParams>(async (req, res) => {
  await companyService.deleteCompany(req.params.id, req.user!.sub);
  return noContent(res, "Company deleted");
});
