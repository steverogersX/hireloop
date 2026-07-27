import jwt, { type SignOptions } from "jsonwebtoken";
import { randomBytes } from "node:crypto";
import { env } from "@/config/env";
import type { Role } from "@/db/schema";

export interface AccessTokenPayload {
  sub: string;
  role: Role;
  email: string;
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.ACCESS_TOKEN_TTL,
  } as SignOptions);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
}

export function createRefreshToken(): { token: string; expiresAt: Date } {
  const token = randomBytes(48).toString("hex");
  const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
  return { token, expiresAt };
}
