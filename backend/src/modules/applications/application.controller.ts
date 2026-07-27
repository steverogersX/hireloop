import type { Application } from "@/db/schema";
import type { IdParams } from "@/types/http";
import { created, paginated, success } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import * as applicationService from "./application.service";
import type { CompanyApplication, MyApplication } from "./application.service";
import type {
  ApplyInput,
  ListApplicationsQuery,
  UpdateApplicationStatusInput,
} from "./application.schema";

export const apply = asyncHandler<Application, ApplyInput>(async (req, res) => {
  const application = await applicationService.apply(req.user!.sub, req.body);
  return created(res, application, "Application submitted");
});

export const listMine = asyncHandler<MyApplication[], unknown, ListApplicationsQuery>(
  async (req, res) => {
    const result = await applicationService.listMyApplications(req.user!.sub, req.query);
    return paginated(res, result, "Applications fetched");
  },
);

export const listForCompany = asyncHandler<CompanyApplication[], unknown, ListApplicationsQuery>(
  async (req, res) => {
    const result = await applicationService.listCompanyApplications(req.user!.sub, req.query);
    return paginated(res, result, "Applications fetched");
  },
);

export const updateStatus = asyncHandler<
  Application,
  UpdateApplicationStatusInput,
  unknown,
  IdParams
>(async (req, res) => {
  const application = await applicationService.updateStatus(
    req.params.id,
    req.user!.sub,
    req.body,
  );
  return success(res, application, "Application status updated");
});

export const withdraw = asyncHandler<Application, unknown, unknown, IdParams>(async (req, res) => {
  const application = await applicationService.withdraw(req.params.id, req.user!.sub);
  return success(res, application, "Application withdrawn");
});
