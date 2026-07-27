import { Router } from "express";
import { applicationRouter } from "@/modules/applications/application.routes";
import { authRouter } from "@/modules/auth/auth.routes";
import { companyRouter } from "@/modules/companies/company.routes";
import { jobRouter } from "@/modules/jobs/job.routes";
import { savedJobRouter } from "@/modules/saved-jobs/savedJob.routes";
import { success } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";

export const apiRouter = Router();

apiRouter.get(
  "/health",
  asyncHandler<{ status: string; uptime: number }>(async (_req, res) =>
    success(res, { status: "ok", uptime: process.uptime() }, "Service healthy"),
  ),
);

apiRouter.use("/auth", authRouter);
apiRouter.use("/companies", companyRouter);
apiRouter.use("/jobs", jobRouter);
apiRouter.use("/applications", applicationRouter);
apiRouter.use("/saved-jobs", savedJobRouter);
