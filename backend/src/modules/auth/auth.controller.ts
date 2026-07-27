import type { CookieOptions } from "express";
import { env, isProd } from "@/config/env";
import type { ApiRes } from "@/types/http";
import { ApiError } from "@/utils/ApiError";
import { created, noContent, success } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import * as authService from "./auth.service";
import type { AuthSession, PublicUser, UserWithCompany } from "./auth.service";
import type { LoginInput, RefreshInput, RegisterInput, UpdateProfileInput } from "./auth.schema";

export interface SessionPayload {
  accessToken: string;
  user: PublicUser;
}

const refreshCookie: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/api/auth",
  maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
};

function sendSession(
  res: ApiRes<SessionPayload>,
  session: AuthSession,
  message: string,
  statusCode = 200,
) {
  res.cookie("refreshToken", session.refreshToken, refreshCookie);
  const payload: SessionPayload = { accessToken: session.accessToken, user: session.user };
  return statusCode === 201
    ? created(res, payload, message)
    : success(res, payload, message, statusCode);
}

export const register = asyncHandler<SessionPayload, RegisterInput>(async (req, res) => {
  const session = await authService.register(req.body);
  return sendSession(res, session, "Account created", 201);
});

export const login = asyncHandler<SessionPayload, LoginInput>(async (req, res) => {
  const session = await authService.login(req.body);
  return sendSession(res, session, "Logged in");
});

export const refresh = asyncHandler<SessionPayload, RefreshInput>(async (req, res) => {
  const token = req.cookies?.refreshToken ?? req.body?.refreshToken;
  if (typeof token !== "string" || !token) throw ApiError.unauthorized("Missing refresh token");
  const session = await authService.refresh(token);
  return sendSession(res, session, "Session refreshed");
});

export const logout = asyncHandler<null, RefreshInput>(async (req, res) => {
  const token = req.cookies?.refreshToken ?? req.body?.refreshToken;
  if (typeof token === "string" && token) await authService.logout(token);
  res.clearCookie("refreshToken", refreshCookie);
  return noContent(res, "Logged out");
});

export const me = asyncHandler<UserWithCompany>(async (req, res) => {
  const user = await authService.getMe(req.user!.sub);
  return success(res, user, "Profile fetched");
});

export const updateProfile = asyncHandler<PublicUser, UpdateProfileInput>(async (req, res) => {
  const user = await authService.updateProfile(req.user!.sub, req.body);
  return success(res, user, "Profile updated");
});
