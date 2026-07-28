import { cookies } from "next/headers";
import type { ApiResponse, PaginationMeta } from "@/types/api";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

const DEMO_EMAIL = process.env.HIRELOOP_DEMO_EMAIL ?? "candidate@hireloop.dev";
const DEMO_PASSWORD = process.env.HIRELOOP_DEMO_PASSWORD ?? "password123";

let demoToken: { value: string; expiresAt: number } | null = null;

// Concurrent server components would otherwise each hit /auth/login and trip the
// API's auth rate limiter, leaving every request unauthenticated.
let inFlightLogin: Promise<string | null> | null = null;

async function loginAsDemoUser() {
  if (demoToken && demoToken.expiresAt > Date.now()) return demoToken.value;
  if (inFlightLogin) return inFlightLogin;

  inFlightLogin = requestDemoToken().finally(() => {
    inFlightLogin = null;
  });

  return inFlightLogin;
}

async function requestDemoToken() {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: DEMO_EMAIL, password: DEMO_PASSWORD }),
    cache: "no-store",
  });

  if (!response.ok) return null;

  const payload = (await response.json()) as ApiResponse<{ accessToken: string }>;
  const token = payload.data?.accessToken;
  if (!token) return null;

  demoToken = { value: token, expiresAt: Date.now() + 10 * 60 * 1000 };
  return token;
}

// A signed-in session always wins. The demo login only covers local development
// when no one has signed in yet, and is off unless the env var is set.
const ALLOW_DEMO_LOGIN = process.env.HIRELOOP_DEMO_LOGIN === "true";

async function resolveToken() {
  const store = await cookies();
  const fromCookie = store.get("accessToken")?.value;
  if (fromCookie) return fromCookie;
  return ALLOW_DEMO_LOGIN ? loginAsDemoUser() : null;
}

export interface FetchOptions {
  query?: Record<string, string | number | boolean | undefined>;
  method?: string;
  body?: unknown;
}

function buildUrl(path: string, query?: FetchOptions["query"]) {
  const url = new URL(`${API_URL}${path}`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }
  return url.toString();
}

async function call(path: string, options: FetchOptions, token: string | null) {
  return fetch(buildUrl(path, options.query), {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: "no-store",
  });
}

export async function serverFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<{ data: T | null; meta?: PaginationMeta }> {
  let token = await resolveToken();
  let response = await call(path, options, token);

  // A stale demo token looks identical to being signed out; mint a fresh one once
  // before giving up. Real sessions fall through and surface the 401.
  if (response.status === 401 && ALLOW_DEMO_LOGIN) {
    demoToken = null;
    token = await loginAsDemoUser();
    if (token) response = await call(path, options, token);
  }

  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null;
  if (!payload?.success) return { data: null };

  return { data: payload.data, meta: payload.meta };
}

export async function serverData<T>(path: string, options?: FetchOptions): Promise<T | null> {
  const { data } = await serverFetch<T>(path, options);
  return data;
}

export async function serverList<T>(
  path: string,
  options?: FetchOptions,
): Promise<{ items: T[]; meta?: PaginationMeta }> {
  const { data, meta } = await serverFetch<T[]>(path, options);
  return { items: data ?? [], meta };
}
