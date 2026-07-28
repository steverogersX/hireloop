import { Router } from "express";
import { requireAuth, requireRole } from "@/middleware/auth";
import { validate } from "@/middleware/validate";
import * as controller from "./interview.controller";
import {
  interviewIdParamSchema,
  listInterviewsQuerySchema,
  scheduleInterviewSchema,
  updateInterviewSchema,
} from "./interview.schema";

export const interviewRouter = Router();

interviewRouter.use(requireAuth);

interviewRouter.get("/", validate({ query: listInterviewsQuerySchema }), controller.listMine);
interviewRouter.get(
  "/company",
  requireRole("EMPLOYER", "ADMIN"),
  controller.listForCompany,
);
interviewRouter.post(
  "/",
  requireRole("EMPLOYER", "ADMIN"),
  validate({ body: scheduleInterviewSchema }),
  controller.schedule,
);
interviewRouter.patch(
  "/:id",
  requireRole("EMPLOYER", "ADMIN"),
  validate({ params: interviewIdParamSchema, body: updateInterviewSchema }),
  controller.update,
);
