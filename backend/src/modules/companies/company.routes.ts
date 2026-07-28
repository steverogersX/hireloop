import { Router } from "express";
import { optionalAuth, requireAuth, requireRole } from "@/middleware/auth";
import { validate } from "@/middleware/validate";
import * as controller from "./company.controller";
import {
  companyIdParamSchema,
  companySlugParamSchema,
  createCompanySchema,
  createReviewSchema,
  listCompaniesQuerySchema,
  updateCompanyProfileSchema,
  updateCompanySchema,
} from "./company.schema";

export const companyRouter = Router();

companyRouter.get(
  "/",
  optionalAuth,
  validate({ query: listCompaniesQuerySchema }),
  controller.list,
);
companyRouter.get("/me", requireAuth, requireRole("EMPLOYER", "ADMIN"), controller.getMine);
companyRouter.get("/following", requireAuth, controller.listFollowed);
companyRouter.get(
  "/:slug",
  optionalAuth,
  validate({ params: companySlugParamSchema }),
  controller.getBySlug,
);

companyRouter.post(
  "/",
  requireAuth,
  requireRole("EMPLOYER", "ADMIN"),
  validate({ body: createCompanySchema }),
  controller.create,
);

companyRouter.post(
  "/:id/follow",
  requireAuth,
  validate({ params: companyIdParamSchema }),
  controller.follow,
);

companyRouter.delete(
  "/:id/follow",
  requireAuth,
  validate({ params: companyIdParamSchema }),
  controller.unfollow,
);

companyRouter.post(
  "/:id/reviews",
  requireAuth,
  validate({ params: companyIdParamSchema, body: createReviewSchema }),
  controller.addReview,
);

companyRouter.patch(
  "/:id",
  requireAuth,
  requireRole("EMPLOYER", "ADMIN"),
  validate({ params: companyIdParamSchema, body: updateCompanySchema }),
  controller.update,
);

companyRouter.patch(
  "/:id/profile",
  requireAuth,
  requireRole("EMPLOYER", "ADMIN"),
  validate({ params: companyIdParamSchema, body: updateCompanyProfileSchema }),
  controller.updateProfile,
);

companyRouter.put(
  "/:id/team",
  requireAuth,
  requireRole("EMPLOYER", "ADMIN"),
  validate({ params: companyIdParamSchema, body: controller.teamPayloadSchema }),
  controller.replaceTeam,
);

companyRouter.put(
  "/:id/process",
  requireAuth,
  requireRole("EMPLOYER", "ADMIN"),
  validate({ params: companyIdParamSchema, body: controller.processPayloadSchema }),
  controller.replaceProcess,
);

companyRouter.delete(
  "/:id",
  requireAuth,
  requireRole("EMPLOYER", "ADMIN"),
  validate({ params: companyIdParamSchema }),
  controller.remove,
);
