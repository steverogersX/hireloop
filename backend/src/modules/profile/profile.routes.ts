import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "@/middleware/auth";
import { validate } from "@/middleware/validate";
import * as controller from "./profile.controller";
import {
  createEducationSchema,
  createExperienceSchema,
  createResumeSchema,
  updateEducationSchema,
  updateExperienceSchema,
  updateProfileSchema,
  updateVisibilitySchema,
} from "./profile.schema";

const idParams = z.object({ id: z.string().min(1) });

export const profileRouter = Router();

profileRouter.use(requireAuth);

profileRouter.get("/", controller.me);
profileRouter.patch("/", validate({ body: updateProfileSchema }), controller.update);
profileRouter.patch(
  "/visibility",
  validate({ body: updateVisibilitySchema }),
  controller.updateVisibility,
);

profileRouter.post(
  "/experience",
  validate({ body: createExperienceSchema }),
  controller.addExperience,
);
profileRouter.patch(
  "/experience/:id",
  validate({ params: idParams, body: updateExperienceSchema }),
  controller.updateExperience,
);
profileRouter.delete(
  "/experience/:id",
  validate({ params: idParams }),
  controller.removeExperience,
);

profileRouter.post(
  "/education",
  validate({ body: createEducationSchema }),
  controller.addEducation,
);
profileRouter.patch(
  "/education/:id",
  validate({ params: idParams, body: updateEducationSchema }),
  controller.updateEducation,
);
profileRouter.delete(
  "/education/:id",
  validate({ params: idParams }),
  controller.removeEducation,
);

profileRouter.get("/resumes", controller.listResumes);
profileRouter.post("/resumes", validate({ body: createResumeSchema }), controller.addResume);
profileRouter.patch(
  "/resumes/:id/default",
  validate({ params: idParams }),
  controller.setDefaultResume,
);
profileRouter.delete("/resumes/:id", validate({ params: idParams }), controller.removeResume);
