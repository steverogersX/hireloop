import { Router } from "express";
import { optionalAuth, requireAuth, requireRole } from "@/middleware/auth";
import { validate } from "@/middleware/validate";
import * as controller from "./job.controller";
import {
  createJobSchema,
  jobIdParamSchema,
  jobSlugParamSchema,
  listJobsQuerySchema,
  updateJobSchema,
} from "./job.schema";

export const jobRouter = Router();

jobRouter.get(
  "/",
  optionalAuth,
  validate({ query: listJobsQuerySchema }),
  controller.list,
);
jobRouter.get("/mine", requireAuth, requireRole("EMPLOYER", "ADMIN"), controller.listMine);
jobRouter.get(
  "/:slug",
  optionalAuth,
  validate({ params: jobSlugParamSchema }),
  controller.getBySlug,
);
jobRouter.get(
  "/:slug/similar",
  optionalAuth,
  validate({ params: jobSlugParamSchema }),
  controller.similar,
);

jobRouter.post(
  "/",
  requireAuth,
  requireRole("EMPLOYER", "ADMIN"),
  validate({ body: createJobSchema }),
  controller.create,
);

jobRouter.patch(
  "/:id",
  requireAuth,
  requireRole("EMPLOYER", "ADMIN"),
  validate({ params: jobIdParamSchema, body: updateJobSchema }),
  controller.update,
);

jobRouter.delete(
  "/:id",
  requireAuth,
  requireRole("EMPLOYER", "ADMIN"),
  validate({ params: jobIdParamSchema }),
  controller.remove,
);
