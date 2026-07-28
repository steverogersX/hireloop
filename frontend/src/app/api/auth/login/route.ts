import { NextResponse } from "next/server";
import { authenticate, LANDING_BY_ROLE } from "@/lib/session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const result = await authenticate("/auth/login", body);

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  return NextResponse.json({
    user: result.user,
    redirectTo: LANDING_BY_ROLE[result.user.role],
  });
}
