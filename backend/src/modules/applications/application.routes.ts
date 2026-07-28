import { Router } from "express";
import { requireAuth, requireRole } from "@/middleware/auth";
import { validate } from "@/middleware/validate";
import * as controller from "./application.controller";
import {
  applicationIdParamSchema,
  applySchema,
  listApplicationsQuerySchema,
  updateApplicationStatusSchema,
} from "./application.schema";

export const applicationRouter = Router();

applicationRouter.use(requireAuth);

applicationRouter.post(
  "/",
  requireRole("CANDIDATE"),
  validate({ body: applySchema }),
  controller.apply,
);

applicationRouter.get(
  "/me",
  requireRole("CANDIDATE"),
  validate({ query: listApplicationsQuerySchema }),
  controller.listMine,
);

applicationRouter.get(
  "/me/:id",
  requireRole("CANDIDATE"),
  validate({ params: applicationIdParamSchema }),
  controller.detail,
);

applicationRouter.get(
  "/company",
  requireRole("EMPLOYER", "ADMIN"),
  validate({ query: listApplicationsQuerySchema }),
  controller.listForCompany,
);

applicationRouter.patch(
  "/:id/status",
  requireRole("EMPLOYER", "ADMIN"),
  validate({ params: applicationIdParamSchema, body: updateApplicationStatusSchema }),
  controller.updateStatus,
);

applicationRouter.patch(
  "/:id/withdraw",
  requireRole("CANDIDATE"),
  validate({ params: applicationIdParamSchema }),
  controller.withdraw,
);
