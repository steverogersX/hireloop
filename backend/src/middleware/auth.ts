import type { NextFunction, Request, Response } from "express";
import { ApiError } from "@/utils/ApiError";
import { verifyAccessToken, type AccessTokenPayload } from "@/utils/jwt";
import type { Role } from "@/db/schema";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}

function readToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) return header.slice(7);
  const cookie = req.cookies?.accessToken;
  return typeof cookie === "string" ? cookie : null;
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = readToken(req);
  if (!token) return next(ApiError.unauthorized("Missing access token"));

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(ApiError.unauthorized("Invalid or expired access token"));
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const token = readToken(req);
  if (token) {
    try {
      req.user = verifyAccessToken(token);
    } catch {
      /* ignore */
    }
  }
  next();
}

export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!roles.includes(req.user.role)) return next(ApiError.forbidden());
    next();
  };
}
