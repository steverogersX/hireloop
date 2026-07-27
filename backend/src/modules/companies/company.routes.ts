import { Router } from "express";
import { requireAuth, requireRole } from "@/middleware/auth";
import { validate } from "@/middleware/validate";
import * as controller from "./company.controller";
import {
  companyIdParamSchema,
  companySlugParamSchema,
  createCompanySchema,
  listCompaniesQuerySchema,
  updateCompanySchema,
} from "./company.schema";

export const companyRouter = Router();

companyRouter.get("/", validate({ query: listCompaniesQuerySchema }), controller.list);
companyRouter.get("/me", requireAuth, requireRole("EMPLOYER", "ADMIN"), controller.getMine);
companyRouter.get("/:slug", validate({ params: companySlugParamSchema }), controller.getBySlug);

companyRouter.post(
  "/",
  requireAuth,
  requireRole("EMPLOYER", "ADMIN"),
  validate({ body: createCompanySchema }),
  controller.create,
);

companyRouter.patch(
  "/:id",
  requireAuth,
  requireRole("EMPLOYER", "ADMIN"),
  validate({ params: companyIdParamSchema, body: updateCompanySchema }),
  controller.update,
);

companyRouter.delete(
  "/:id",
  requireAuth,
  requireRole("EMPLOYER", "ADMIN"),
  validate({ params: companyIdParamSchema }),
  controller.remove,
);
