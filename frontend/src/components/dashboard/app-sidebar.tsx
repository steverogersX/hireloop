"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Bookmark,
  Building2,
  ChevronsUpDown,
  CircleUser,
  FileText,
  LayoutGrid,
  LifeBuoy,
  type LucideIcon,
  MessagesSquare,
  Search,
  Settings,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useShell } from "@/components/dashboard/shell-context";
import { initialsOf } from "@/lib/format";

type NavItem = {
  title: string;
  icon: LucideIcon;
  badge?: string;
  href?: string;
};

const searchNav: NavItem[] = [
  { title: "Overview", icon: LayoutGrid, href: "/dashboard" },
  { title: "Find jobs", icon: Search, badge: "128", href: "/jobs" },
  { title: "Saved jobs", icon: Bookmark, badge: "6", href: "/saved" },
  { title: "Job alerts", icon: Bell, badge: "25", href: "/alerts" },
  { title: "Companies", icon: Building2, href: "/companies" },
];

const trackNav: NavItem[] = [
  { title: "Applications", icon: FileText, badge: "14", href: "/applications" },
  { title: "Messages", icon: MessagesSquare, badge: "3", href: "/messages" },
  { title: "Profile & resume", icon: CircleUser, href: "/profile" },
];

const supportNav: NavItem[] = [
  { title: "Settings", icon: Settings, href: "/settings" },
  { title: "Help & feedback", icon: LifeBuoy },
];

function isCurrent(pathname: string, href?: string) {
  if (!href) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useShell();

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="gap-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <LoopMark />
              </span>
              <span className="grid text-left leading-tight">
                <span className="font-heading text-sm font-semibold tracking-tight">
                  HireLoop
                </span>
                <span className="text-xs text-muted-foreground">
                  Candidate workspace
                </span>
              </span>
              <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Search</SidebarGroupLabel>
          <SidebarGroupContent>
            <NavList items={searchNav} pathname={pathname} />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Track</SidebarGroupLabel>
          <SidebarGroupContent>
            <NavList items={trackNav} pathname={pathname} />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <NavList items={supportNav} pathname={pathname} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="rounded-xl bg-sidebar-accent p-3 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-1.5 text-xs font-medium text-sidebar-accent-foreground">
            <Sparkles className="size-3.5" />
            Try HireLoop Pro
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            See who viewed your profile and how you rank against other
            applicants.
          </p>
          <Button
            size="sm"
            className="mt-2.5 w-full"
            onClick={() =>
              toast("HireLoop Pro, 14 days free", {
                description: "No card needed. Cancel from Settings any time.",
              })
            }
          >
            Start 14-day trial
          </Button>
        </div>

        <SidebarSeparator className="group-data-[collapsible=icon]:hidden" />

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="gap-2.5">
              <Avatar className="size-8 rounded-lg">
                <AvatarFallback className="rounded-lg bg-primary/10 text-xs font-medium text-primary">
                  {initialsOf(user?.name ?? "You")}
                </AvatarFallback>
              </Avatar>
              <span className="grid text-left leading-tight">
                <span className="truncate text-sm font-medium">
                  {user?.name ?? "Your account"}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user?.headline ?? ""}
                </span>
              </span>
              <Badge
                variant="outline"
                className="ml-auto border-chart-5/40 text-chart-5"
              >
                Open
              </Badge>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function NavList({
  items,
  pathname,
}: {
  items: NavItem[];
  pathname: string;
}) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            asChild={Boolean(item.href)}
            isActive={isCurrent(pathname, item.href)}
            tooltip={item.title}
          >
            {item.href ? (
              <Link href={item.href}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            ) : (
              <>
                <item.icon />
                <span>{item.title}</span>
              </>
            )}
          </SidebarMenuButton>
          {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

function LoopMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.1}
      strokeLinecap="round"
      className="size-4"
      aria-hidden
    >
      <path d="M8.5 15.5a4.5 4.5 0 1 1 0-7h7a4.5 4.5 0 1 1 0 7" />
      <path d="M15.5 12h-7" />
    </svg>
  );
}
