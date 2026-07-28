import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { SignupForm } from "@/components/auth/signup-form";
import { getSession, LANDING_BY_ROLE } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Create an account — HireLoop",
  description: "Join HireLoop as a candidate or start hiring.",
};

export default async function SignupPage() {
  const user = await getSession();
  if (user) redirect(LANDING_BY_ROLE[user.role]);

  return <SignupForm />;
}
