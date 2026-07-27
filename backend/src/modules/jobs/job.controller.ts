import type { Job } from "@/db/schema";
import type { IdParams, SlugParams } from "@/types/http";
import { created, noContent, paginated, success } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import * as jobService from "./job.service";
import type { CreateJobInput, ListJobsQuery, UpdateJobInput } from "./job.schema";

export const create = asyncHandler<Job, CreateJobInput>(async (req, res) => {
  const job = await jobService.createJob(req.user!.sub, req.body);
  return created(res, job, "Job created");
});

export const list = asyncHandler<Job[], unknown, ListJobsQuery>(async (req, res) => {
  const result = await jobService.listJobs(req.query);
  return paginated(res, result, "Jobs fetched");
});

export const getBySlug = asyncHandler<
  Awaited<ReturnType<typeof jobService.getJobBySlug>>,
  unknown,
  unknown,
  SlugParams
>(async (req, res) => {
  const job = await jobService.getJobBySlug(req.params.slug);
  return success(res, job, "Job fetched");
});

export const listMine = asyncHandler<Job[]>(async (req, res) => {
  const items = await jobService.listCompanyJobs(req.user!.sub);
  return success(res, items, "Jobs fetched");
});

export const update = asyncHandler<Job, UpdateJobInput, unknown, IdParams>(async (req, res) => {
  const job = await jobService.updateJob(req.params.id, req.user!.sub, req.body);
  return success(res, job, "Job updated");
});

export const remove = asyncHandler<null, unknown, unknown, IdParams>(async (req, res) => {
  await jobService.deleteJob(req.params.id, req.user!.sub);
  return noContent(res, "Job deleted");
});
