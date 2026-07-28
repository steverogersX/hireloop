import { Router } from "express";
import { activityRouter, settingsRouter } from "@/modules/activity/activity.routes";
import { alertRouter, savedSearchRouter } from "@/modules/alerts/alert.routes";
import { applicationRouter } from "@/modules/applications/application.routes";
import { authRouter } from "@/modules/auth/auth.routes";
import { companyRouter } from "@/modules/companies/company.routes";
import { dashboardRouter } from "@/modules/dashboard/dashboard.routes";
import { interviewRouter } from "@/modules/interviews/interview.routes";
import { jobRouter } from "@/modules/jobs/job.routes";
import { messageRouter } from "@/modules/messages/message.routes";
import { profileRouter } from "@/modules/profile/profile.routes";
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
apiRouter.use("/profile", profileRouter);
apiRouter.use("/companies", companyRouter);
apiRouter.use("/jobs", jobRouter);
apiRouter.use("/applications", applicationRouter);
apiRouter.use("/saved-jobs", savedJobRouter);
apiRouter.use("/saved-searches", savedSearchRouter);
apiRouter.use("/alerts", alertRouter);
apiRouter.use("/messages", messageRouter);
apiRouter.use("/interviews", interviewRouter);
apiRouter.use("/activity", activityRouter);
apiRouter.use("/settings", settingsRouter);
apiRouter.use("/dashboard", dashboardRouter);
