import { cookies } from "next/headers";
import { API_URL } from "@/lib/server-api";
import type { ApiResponse, Role, SessionPayload, User } from "@/types/api";

export const ACCESS_COOKIE = "accessToken";
export const REFRESH_COOKIE = "refreshToken";

const ACCESS_MAX_AGE = 60 * 60 * 24 * 30;

export const LANDING_BY_ROLE: Record<Role, string> = {
  CANDIDATE: "/dashboard",
  EMPLOYER: "/recruiter",
  ADMIN: "/recruiter",
};

function refreshTokenFrom(setCookie: string | null) {
  if (!setCookie) return null;
  const match = /refreshToken=([^;]+)/.exec(setCookie);
  return match?.[1] ?? null;
}

export async function authenticate(
  path: "/auth/login" | "/auth/register",
  body: Record<string, unknown>,
): Promise<{ user: User } | { error: string }> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const payload = (await response
    .json()
    .catch(() => null)) as ApiResponse<SessionPayload> | null;

  if (!payload?.success || !payload.data) {
    return { error: payload?.message ?? "Could not reach the server" };
  }

  const store = await cookies();
  const secure = process.env.NODE_ENV === "production";

  store.set(ACCESS_COOKIE, payload.data.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: ACCESS_MAX_AGE,
  });

  const refresh = refreshTokenFrom(response.headers.get("set-cookie"));
  if (refresh) {
    store.set(REFRESH_COOKIE, refresh, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: ACCESS_MAX_AGE,
    });
  }

  return { user: payload.data.user };
}

export async function clearSession() {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
}

export async function getSession(): Promise<User | null> {
  const store = await cookies();
  const token = store.get(ACCESS_COOKIE)?.value;
  if (!token) return null;

  const response = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!response.ok) return null;

  const payload = (await response.json().catch(() => null)) as ApiResponse<User> | null;
  return payload?.data ?? null;
}
