import { created, noContent, paginated } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import * as savedJobService from "./savedJob.service";
import type { SavedJobItem } from "./savedJob.service";
import type { ListSavedJobsQuery, SaveJobInput } from "./savedJob.schema";

interface JobIdParams {
  jobId: string;
}

export const save = asyncHandler<
  Awaited<ReturnType<typeof savedJobService.saveJob>>,
  SaveJobInput
>(async (req, res) => {
  const saved = await savedJobService.saveJob(req.user!.sub, req.body);
  return created(res, saved, "Job saved");
});

export const list = asyncHandler<SavedJobItem[], unknown, ListSavedJobsQuery>(async (req, res) => {
  const result = await savedJobService.listSavedJobs(req.user!.sub, req.query);
  return paginated(res, result, "Saved jobs fetched");
});

export const remove = asyncHandler<null, unknown, unknown, JobIdParams>(async (req, res) => {
  await savedJobService.unsaveJob(req.user!.sub, req.params.jobId);
  return noContent(res, "Job removed from saved list");
});
