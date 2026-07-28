import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_URL } from "@/lib/server-api";
import { clearSession, REFRESH_COOKIE } from "@/lib/session";

export async function POST() {
  const store = await cookies();
  const refreshToken = store.get(REFRESH_COOKIE)?.value;

  if (refreshToken) {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    }).catch(() => null);
  }

  await clearSession();
  return NextResponse.json({ ok: true });
}
