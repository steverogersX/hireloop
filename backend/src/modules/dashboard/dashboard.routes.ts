import { Router } from "express";
import { requireAuth } from "@/middleware/auth";
import { success } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import * as dashboardService from "./dashboard.service";

export const dashboardRouter = Router();

dashboardRouter.use(requireAuth);

dashboardRouter.get(
  "/stats",
  asyncHandler<dashboardService.DashboardStats>(async (req, res) =>
    success(res, await dashboardService.stats(req.user!.sub), "Stats fetched"),
  ),
);

dashboardRouter.get(
  "/insights",
  asyncHandler<dashboardService.ApplicationInsights>(async (req, res) =>
    success(res, await dashboardService.insights(req.user!.sub), "Insights fetched"),
  ),
);
