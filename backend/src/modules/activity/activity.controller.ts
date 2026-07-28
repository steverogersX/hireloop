import { z } from "zod";
import type {
  ActivityItem,
  ConnectedAccount,
  NotificationPreference,
} from "@/db/schema";
import { noContent, success } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import * as activityService from "./activity.service";

export const listActivityQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const updatePreferenceSchema = z.object({
  email: z.boolean().optional(),
  push: z.boolean().optional(),
});

export const updateAccountSchema = z.object({ connected: z.boolean() });

export const keyParamSchema = z.object({ key: z.string().min(1).max(60) });
export const providerParamSchema = z.object({ provider: z.string().min(1).max(60) });

export const list = asyncHandler<
  ActivityItem[],
  unknown,
  z.infer<typeof listActivityQuerySchema>
>(async (req, res) => {
  const items = await activityService.listActivity(req.user!.sub, req.query.limit);
  return success(res, items, "Activity fetched");
});

export const markAllRead = asyncHandler<null>(async (req, res) => {
  await activityService.markAllRead(req.user!.sub);
  return noContent(res, "Notifications marked as read");
});

export const listPreferences = asyncHandler<NotificationPreference[]>(async (req, res) => {
  const items = await activityService.listPreferences(req.user!.sub);
  return success(res, items, "Notification preferences fetched");
});

export const updatePreference = asyncHandler<
  NotificationPreference,
  z.infer<typeof updatePreferenceSchema>,
  unknown,
  { key: string }
>(async (req, res) => {
  const row = await activityService.updatePreference(
    req.user!.sub,
    req.params.key,
    req.body,
  );
  return success(res, row, "Preference updated");
});

export const listAccounts = asyncHandler<ConnectedAccount[]>(async (req, res) => {
  const items = await activityService.listAccounts(req.user!.sub);
  return success(res, items, "Connected accounts fetched");
});

export const updateAccount = asyncHandler<
  ConnectedAccount,
  z.infer<typeof updateAccountSchema>,
  unknown,
  { provider: string }
>(async (req, res) => {
  const row = await activityService.setAccountConnection(
    req.user!.sub,
    req.params.provider,
    req.body.connected,
  );
  return success(res, row, "Account updated");
});
