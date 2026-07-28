import type { Interview } from "@/db/schema";
import type { IdParams } from "@/types/http";
import { created, success } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import * as interviewService from "./interview.service";
import type {
  ListInterviewsQuery,
  ScheduleInterviewInput,
  UpdateInterviewInput,
} from "./interview.schema";

export const listMine = asyncHandler<
  interviewService.MyInterviews,
  unknown,
  ListInterviewsQuery
>(async (req, res) => {
  const items = await interviewService.listMyInterviews(req.user!.sub, req.query);
  return success(res, items, "Interviews fetched");
});

export const listForCompany = asyncHandler<interviewService.CompanyInterviews>(
  async (req, res) => {
    const items = await interviewService.listCompanyInterviews(req.user!.sub);
    return success(res, items, "Interviews fetched");
  },
);

export const schedule = asyncHandler<Interview, ScheduleInterviewInput>(async (req, res) => {
  const interview = await interviewService.schedule(req.user!.sub, req.body);
  return created(res, interview, "Interview scheduled");
});

export const update = asyncHandler<Interview, UpdateInterviewInput, unknown, IdParams>(
  async (req, res) => {
    const interview = await interviewService.update(req.user!.sub, req.params.id, req.body);
    return success(res, interview, "Interview updated");
  },
);
