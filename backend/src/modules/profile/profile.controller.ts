import type { IdParams } from "@/types/http";
import { created, noContent, success } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import * as profileService from "./profile.service";
import type {
  CreateEducationInput,
  CreateExperienceInput,
  CreateResumeInput,
  UpdateEducationInput,
  UpdateExperienceInput,
  UpdateProfileInput,
  UpdateVisibilityInput,
} from "./profile.schema";

type Profile = Awaited<ReturnType<typeof profileService.getProfile>>;

export const me = asyncHandler<Profile>(async (req, res) => {
  const profile = await profileService.getProfile(req.user!.sub);
  return success(res, profile, "Profile fetched");
});

export const update = asyncHandler<Profile, UpdateProfileInput>(async (req, res) => {
  const profile = await profileService.updateProfile(req.user!.sub, req.body);
  return success(res, profile, "Profile updated");
});

export const updateVisibility = asyncHandler<
  Awaited<ReturnType<typeof profileService.updateVisibility>>,
  UpdateVisibilityInput
>(async (req, res) => {
  const visibility = await profileService.updateVisibility(req.user!.sub, req.body);
  return success(res, visibility, "Visibility updated");
});

export const addExperience = asyncHandler<
  Awaited<ReturnType<typeof profileService.addExperience>>,
  CreateExperienceInput
>(async (req, res) => {
  const row = await profileService.addExperience(req.user!.sub, req.body);
  return created(res, row, "Experience added");
});

export const updateExperience = asyncHandler<
  Awaited<ReturnType<typeof profileService.updateExperience>>,
  UpdateExperienceInput,
  unknown,
  IdParams
>(async (req, res) => {
  const row = await profileService.updateExperience(req.user!.sub, req.params.id, req.body);
  return success(res, row, "Experience updated");
});

export const removeExperience = asyncHandler<null, unknown, unknown, IdParams>(
  async (req, res) => {
    await profileService.deleteExperience(req.user!.sub, req.params.id);
    return noContent(res, "Experience removed");
  },
);

export const addEducation = asyncHandler<
  Awaited<ReturnType<typeof profileService.addEducation>>,
  CreateEducationInput
>(async (req, res) => {
  const row = await profileService.addEducation(req.user!.sub, req.body);
  return created(res, row, "Education added");
});

export const updateEducation = asyncHandler<
  Awaited<ReturnType<typeof profileService.updateEducation>>,
  UpdateEducationInput,
  unknown,
  IdParams
>(async (req, res) => {
  const row = await profileService.updateEducation(req.user!.sub, req.params.id, req.body);
  return success(res, row, "Education updated");
});

export const removeEducation = asyncHandler<null, unknown, unknown, IdParams>(
  async (req, res) => {
    await profileService.deleteEducation(req.user!.sub, req.params.id);
    return noContent(res, "Education removed");
  },
);

export const listResumes = asyncHandler<Awaited<ReturnType<typeof profileService.listResumes>>>(
  async (req, res) => {
    const items = await profileService.listResumes(req.user!.sub);
    return success(res, items, "Resumes fetched");
  },
);

export const addResume = asyncHandler<
  Awaited<ReturnType<typeof profileService.addResume>>,
  CreateResumeInput
>(async (req, res) => {
  const row = await profileService.addResume(req.user!.sub, req.body);
  return created(res, row, "Resume uploaded");
});

export const setDefaultResume = asyncHandler<
  Awaited<ReturnType<typeof profileService.setDefaultResume>>,
  unknown,
  unknown,
  IdParams
>(async (req, res) => {
  const row = await profileService.setDefaultResume(req.user!.sub, req.params.id);
  return success(res, row, "Default resume updated");
});

export const removeResume = asyncHandler<null, unknown, unknown, IdParams>(async (req, res) => {
  await profileService.deleteResume(req.user!.sub, req.params.id);
  return noContent(res, "Resume removed");
});
