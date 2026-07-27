import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { TopBar } from "@/components/dashboard/top-bar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
  );
}
