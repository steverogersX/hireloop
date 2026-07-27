import type { ApiResponse, PaginationMeta } from "@/types/api";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export class ApiRequestError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  token?: string;
  query?: Record<string, string | number | boolean | undefined>;
}

function buildUrl(path: string, query?: RequestOptions["query"]) {
  const url = new URL(`${API_URL}${path}`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }
  return url.toString();
}

export async function apiFetch<T>(
  path: string,
  { body, token, query, headers, ...init }: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const response = await fetch(buildUrl(path, query), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: "include",
  });

  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null;

  if (!payload) {
    throw new ApiRequestError(response.status, "Malformed response from server");
  }

  if (!payload.success) {
    throw new ApiRequestError(
      payload.statusCode,
      payload.message,
      payload.error?.code,
      payload.error?.details,
    );
  }

  return payload;
}

export async function apiData<T>(path: string, options?: RequestOptions): Promise<T> {
  const payload = await apiFetch<T>(path, options);
  if (payload.data === null) {
    throw new ApiRequestError(payload.statusCode, "Expected data in response");
  }
  return payload.data;
}

export async function apiList<T>(
  path: string,
  options?: RequestOptions,
): Promise<{ items: T[]; meta: PaginationMeta | undefined }> {
  const payload = await apiFetch<T[]>(path, options);
  return { items: payload.data ?? [], meta: payload.meta };
}
