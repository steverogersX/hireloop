import type { JobAlert, SavedSearch } from "@/db/schema";
import type { IdParams } from "@/types/http";
import { created, noContent, success } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import * as alertService from "./alert.service";
import type {
  CreateAlertInput,
  CreateSavedSearchInput,
  UpdateAlertInput,
} from "./alert.schema";

export const list = asyncHandler<alertService.AlertWithCount[]>(async (req, res) => {
  const items = await alertService.listAlerts(req.user!.sub);
  return success(res, items, "Alerts fetched");
});

export const create = asyncHandler<JobAlert, CreateAlertInput>(async (req, res) => {
  const alert = await alertService.createAlert(req.user!.sub, req.body);
  return created(res, alert, "Alert created");
});

export const update = asyncHandler<JobAlert, UpdateAlertInput, unknown, IdParams>(
  async (req, res) => {
    const alert = await alertService.updateAlert(req.user!.sub, req.params.id, req.body);
    return success(res, alert, "Alert updated");
  },
);

export const remove = asyncHandler<null, unknown, unknown, IdParams>(async (req, res) => {
  await alertService.deleteAlert(req.user!.sub, req.params.id);
  return noContent(res, "Alert deleted");
});

export const listSearches = asyncHandler<SavedSearch[]>(async (req, res) => {
  const items = await alertService.listSavedSearches(req.user!.sub);
  return success(res, items, "Saved searches fetched");
});

export const createSearch = asyncHandler<SavedSearch, CreateSavedSearchInput>(
  async (req, res) => {
    const row = await alertService.createSavedSearch(req.user!.sub, req.body);
    return created(res, row, "Search saved");
  },
);

export const removeSearch = asyncHandler<null, unknown, unknown, IdParams>(async (req, res) => {
  await alertService.deleteSavedSearch(req.user!.sub, req.params.id);
  return noContent(res, "Saved search deleted");
});
