import { Router } from "express";
import { requireAuth } from "@/middleware/auth";
import { validate } from "@/middleware/validate";
import * as controller from "./alert.controller";
import {
  alertIdParamSchema,
  createAlertSchema,
  createSavedSearchSchema,
  updateAlertSchema,
} from "./alert.schema";

export const alertRouter = Router();

alertRouter.use(requireAuth);

alertRouter.get("/", controller.list);
alertRouter.post("/", validate({ body: createAlertSchema }), controller.create);
alertRouter.patch(
  "/:id",
  validate({ params: alertIdParamSchema, body: updateAlertSchema }),
  controller.update,
);
alertRouter.delete("/:id", validate({ params: alertIdParamSchema }), controller.remove);

export const savedSearchRouter = Router();

savedSearchRouter.use(requireAuth);

savedSearchRouter.get("/", controller.listSearches);
savedSearchRouter.post(
  "/",
  validate({ body: createSavedSearchSchema }),
  controller.createSearch,
);
savedSearchRouter.delete(
  "/:id",
  validate({ params: alertIdParamSchema }),
  controller.removeSearch,
);
