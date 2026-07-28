import { Router } from "express";
import { requireAuth } from "@/middleware/auth";
import { validate } from "@/middleware/validate";
import * as controller from "./activity.controller";

export const activityRouter = Router();

activityRouter.use(requireAuth);

activityRouter.get(
  "/",
  validate({ query: controller.listActivityQuerySchema }),
  controller.list,
);
activityRouter.post("/read-all", controller.markAllRead);

export const settingsRouter = Router();

settingsRouter.use(requireAuth);

settingsRouter.get("/notifications", controller.listPreferences);
settingsRouter.patch(
  "/notifications/:key",
  validate({ params: controller.keyParamSchema, body: controller.updatePreferenceSchema }),
  controller.updatePreference,
);
settingsRouter.get("/connected-accounts", controller.listAccounts);
settingsRouter.patch(
  "/connected-accounts/:provider",
  validate({ params: controller.providerParamSchema, body: controller.updateAccountSchema }),
  controller.updateAccount,
);
