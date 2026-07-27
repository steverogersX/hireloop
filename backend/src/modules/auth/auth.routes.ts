import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requireAuth } from "@/middleware/auth";
import { validate } from "@/middleware/validate";
import * as controller from "./auth.controller";
import {
  loginSchema,
  refreshSchema,
  registerSchema,
  updateProfileSchema,
} from "./auth.schema";

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20 });

export const authRouter = Router();

authRouter.post("/register", authLimiter, validate({ body: registerSchema }), controller.register);
authRouter.post("/login", authLimiter, validate({ body: loginSchema }), controller.login);
authRouter.post("/refresh", validate({ body: refreshSchema }), controller.refresh);
authRouter.post("/logout", validate({ body: refreshSchema }), controller.logout);
authRouter.get("/me", requireAuth, controller.me);
authRouter.patch(
  "/me",
  requireAuth,
  validate({ body: updateProfileSchema }),
  controller.updateProfile,
);
