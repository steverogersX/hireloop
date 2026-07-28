"use client";

export async function mutate<T = unknown>(
  path: string,
  method: "POST" | "PATCH" | "PUT" | "DELETE",
  body?: unknown,
): Promise<T | null> {
  const response = await fetch(`/api/hireloop${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) return null;
  const payload = (await response.json()) as { data: T | null };
  return payload.data;
}
