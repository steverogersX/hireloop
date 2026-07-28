import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { getSession, LANDING_BY_ROLE } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign in — HireLoop",
  description: "Sign in to your HireLoop account.",
};

export default async function LoginPage() {
  const user = await getSession();
  if (user) redirect(LANDING_BY_ROLE[user.role]);

  return <LoginForm />;
}
