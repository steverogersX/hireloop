import { Router } from "express";
import { requireAuth, requireRole } from "@/middleware/auth";
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

jobRouter.get("/", validate({ query: listJobsQuerySchema }), controller.list);
jobRouter.get("/mine", requireAuth, requireRole("EMPLOYER", "ADMIN"), controller.listMine);
jobRouter.get("/:slug", validate({ params: jobSlugParamSchema }), controller.getBySlug);

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
