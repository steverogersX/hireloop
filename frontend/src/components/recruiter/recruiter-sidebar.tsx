"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Building2,
  CalendarDays,
  ChevronsUpDown,
  LayoutGrid,
  LifeBuoy,
  type LucideIcon,
  MessagesSquare,
  Settings,
  Sparkles,
  Users,
  UserSearch,
} from "lucide-react";

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
import { cn } from "@/lib/utils";
import { employer, recruiter } from "@/lib/recruiter-mock-data";

type NavItem = {
  title: string;
  icon: LucideIcon;
  badge?: string;
  href?: string;
  /** Overview sits at the workspace root, so prefix matching would keep it lit
      on every nested route. */
  exact?: boolean;
};

const hiringNav: NavItem[] = [
  { title: "Overview", icon: LayoutGrid, href: "/recruiter", exact: true },
  { title: "Job postings", icon: Briefcase, badge: "7", href: "/recruiter/jobs" },
  {
    title: "Applicants",
    icon: Users,
    badge: "29",
    href: "/recruiter/applicants",
  },
  {
    title: "Interviews",
    icon: CalendarDays,
    badge: "9",
    href: "/recruiter/interviews",
  },
];

const companyNav: NavItem[] = [
  { title: "Talent search", icon: UserSearch, href: "/recruiter/search" },
  { title: "Company profile", icon: Building2, href: "/recruiter/company" },
  {
    title: "Messages",
    icon: MessagesSquare,
    badge: "2",
    href: "/recruiter/messages",
  },
  { title: "Team", icon: Users, href: "/recruiter/team" },
];

function isCurrent(pathname: string, item: NavItem) {
  if (!item.href) return false;
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function RecruiterSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="gap-2.5">
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg font-heading text-xs font-semibold",
                  employer.logoClass
                )}
              >
                {employer.initials}
              </span>
              <span className="grid text-left leading-tight">
                <span className="font-heading truncate text-sm font-semibold tracking-tight">
                  {employer.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  Hiring workspace
                </span>
              </span>
              <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Hiring</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {hiringNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild={Boolean(item.href)}
                    isActive={isCurrent(pathname, item)}
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
                  {item.badge && (
                    <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Company</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {companyNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild={Boolean(item.href)}
                    isActive={isCurrent(pathname, item)}
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
                  {item.badge && (
                    <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/recruiter/settings"}
                  tooltip="Settings"
                >
                  <Link href="/recruiter/settings">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Help">
                  <a
                    href="https://hireloop.example/help"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <LifeBuoy />
                    <span>Help & feedback</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="rounded-xl bg-sidebar-accent p-3 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-1.5 text-xs font-medium text-sidebar-accent-foreground">
            <Sparkles className="size-3.5" />
            {employer.creditsLeft} sourcing credits left
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Reach passive candidates who never see your job board post.
          </p>
          <Button size="sm" className="mt-2.5 w-full" asChild>
            <Link href="/recruiter/settings">Top up credits</Link>
          </Button>
        </div>

        <SidebarSeparator className="group-data-[collapsible=icon]:hidden" />

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="gap-2.5">
              <Avatar className="size-8 rounded-lg">
                <AvatarFallback
                  className={cn(
                    "rounded-lg text-xs font-medium",
                    recruiter.avatarClass
                  )}
                >
                  {recruiter.initials}
                </AvatarFallback>
              </Avatar>
              <span className="grid text-left leading-tight">
                <span className="truncate text-sm font-medium">
                  {recruiter.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {recruiter.title}
                </span>
              </span>
              <Badge variant="outline" className="ml-auto text-muted-foreground">
                {employer.plan}
              </Badge>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
