import bcrypt from "bcryptjs";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db/index";
import { refreshTokens, users, type Company, type User } from "@/db/schema";
import { ApiError } from "@/utils/ApiError";
import { createRefreshToken, signAccessToken } from "@/utils/jwt";
import type { LoginInput, RegisterInput, UpdateProfileInput } from "./auth.schema";

export type PublicUser = Omit<User, "passwordHash">;

export type UserWithCompany = PublicUser & { company: Company | null };

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  user: PublicUser;
}

function toPublicUser(user: User): PublicUser {
  const { passwordHash: _passwordHash, ...rest } = user;
  return rest;
}

async function issueTokens(user: User): Promise<AuthSession> {
  const accessToken = signAccessToken({ sub: user.id, role: user.role, email: user.email });
  const { token, expiresAt } = createRefreshToken();

  await db.insert(refreshTokens).values({ token, userId: user.id, expiresAt });

  return { accessToken, refreshToken: token, user: toPublicUser(user) };
}

export async function register(input: RegisterInput) {
  const existing = await db.query.users.findFirst({ where: eq(users.email, input.email) });
  if (existing) throw ApiError.conflict("Email already registered");

  const passwordHash = await bcrypt.hash(input.password, 12);
  const [user] = await db
    .insert(users)
    .values({
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
    })
    .returning();

  return issueTokens(user!);
}

export async function login(input: LoginInput) {
  const user = await db.query.users.findFirst({ where: eq(users.email, input.email) });
  if (!user) throw ApiError.unauthorized("Invalid credentials");

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) throw ApiError.unauthorized("Invalid credentials");

  return issueTokens(user);
}

export async function refresh(token: string) {
  const stored = await db.query.refreshTokens.findFirst({
    where: and(eq(refreshTokens.token, token), isNull(refreshTokens.revokedAt)),
  });

  if (!stored || stored.expiresAt < new Date()) {
    throw ApiError.unauthorized("Invalid or expired refresh token");
  }

  const user = await db.query.users.findFirst({ where: eq(users.id, stored.userId) });
  if (!user) throw ApiError.unauthorized("Invalid refresh token");

  await db
    .update(refreshTokens)
    .set({ revokedAt: new Date() })
    .where(eq(refreshTokens.id, stored.id));

  return issueTokens(user);
}

export async function logout(token: string) {
  await db
    .update(refreshTokens)
    .set({ revokedAt: new Date() })
    .where(eq(refreshTokens.token, token));
}

export async function getMe(userId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: { company: true },
  });
  if (!user) throw ApiError.notFound("User not found");

  const { passwordHash: _passwordHash, ...rest } = user;
  return rest;
}

export async function updateProfile(userId: string, input: UpdateProfileInput) {
  const [user] = await db.update(users).set(input).where(eq(users.id, userId)).returning();
  if (!user) throw ApiError.notFound("User not found");
  return toPublicUser(user);
}
