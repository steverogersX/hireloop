import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { ShellProvider } from "@/components/dashboard/shell-context";
import { TopBar } from "@/components/dashboard/top-bar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getActivity, getProfile } from "@/lib/queries";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "CANDIDATE") redirect("/recruiter");

  const [profile, activity] = await Promise.all([getProfile(), getActivity(6)]);

  return (
    <ShellProvider
      value={{
        user: profile
          ? {
              id: profile.user.id,
              name: profile.user.name,
              email: profile.user.email,
              headline: profile.user.headline,
            }
          : null,
        activity,
      }}
    >
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar />
          {/* The inset is its own scroll container so the top bar can stay pinned
              inside the rounded panel instead of over the page edge. */}
          <SidebarInset className="h-svh overflow-y-auto md:peer-data-[variant=inset]:h-[calc(100svh-1rem)]">
            <TopBar />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </ShellProvider>
  );
}
