import { redirect } from "next/navigation";

import { getSession, LANDING_BY_ROLE } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getSession();
  redirect(user ? LANDING_BY_ROLE[user.role] : "/login");
}
