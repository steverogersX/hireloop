import { RecruiterSidebar } from "@/components/recruiter/recruiter-sidebar";
import { RecruiterTopBar } from "@/components/recruiter/recruiter-top-bar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <RecruiterSidebar />
        {/* Matches the candidate shell: the inset owns the scroll so the top bar
            stays pinned inside the rounded panel. */}
        <SidebarInset className="h-svh overflow-y-auto md:peer-data-[variant=inset]:h-[calc(100svh-1rem)]">
          <RecruiterTopBar />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
