import { NextResponse } from "next/server";
import { serverFetch } from "@/lib/server-api";

type Context = { params: Promise<{ path: string[] }> };

async function forward(request: Request, context: Context, method: string) {
  const { path } = await context.params;
  const target = `/${path.join("/")}`;
  const search = new URL(request.url).search;

  const body =
    method === "GET" || method === "DELETE"
      ? undefined
      : await request.json().catch(() => undefined);

  const result = await serverFetch<unknown>(`${target}${search}`, { method, body });

  return NextResponse.json(result, { status: result.data === null ? 502 : 200 });
}

export async function GET(request: Request, context: Context) {
  return forward(request, context, "GET");
}

export async function POST(request: Request, context: Context) {
  return forward(request, context, "POST");
}

export async function PATCH(request: Request, context: Context) {
  return forward(request, context, "PATCH");
}

export async function PUT(request: Request, context: Context) {
  return forward(request, context, "PUT");
}

export async function DELETE(request: Request, context: Context) {
  return forward(request, context, "DELETE");
}
