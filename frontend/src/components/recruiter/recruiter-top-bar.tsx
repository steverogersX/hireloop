"use client";

import Link from "next/link";
import {
  Bell,
  Building2,
  CreditCard,
  LogOut,
  Moon,
  Plus,
  Search,
  Settings,
  Sun,
  UserRoundCog,
} from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { recruiter } from "@/lib/recruiter-mock-data";

export function RecruiterTopBar() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur-md sm:px-5">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 h-5" />

      <div className="relative w-full max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search candidates, roles, skills"
          className="h-8 pl-8"
          aria-label="Search candidates"
        />
        <kbd className="pointer-events-none absolute top-1/2 right-2 hidden -translate-y-1/2 rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground sm:block">
          /
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <Button size="sm" className="hidden md:inline-flex" asChild>
          <Link href="/recruiter/jobs/new">
            <Plus />
            Post a job
          </Link>
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Toggle theme"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          <Sun className="hidden dark:block" />
          <Moon className="dark:hidden" />
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          className="relative"
          aria-label="Notifications, 2 unread"
          asChild
        >
          <Link href="/recruiter/messages">
            <Bell />
            <span className="absolute top-1 right-1 size-1.5 rounded-full bg-chart-4 ring-2 ring-background" />
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-full"
              aria-label="Account menu"
            >
              <Avatar className="size-7">
                <AvatarFallback
                  className={cn("text-[11px] font-medium", recruiter.avatarClass)}
                >
                  {recruiter.initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="grid gap-0.5">
              <span className="text-sm font-medium">{recruiter.name}</span>
              <span className="text-xs font-normal text-muted-foreground">
                {recruiter.email}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/recruiter/company">
                  <Building2 />
                  Company profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/recruiter/team">
                  <UserRoundCog />
                  Team and seats
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/recruiter/settings">
                  <CreditCard />
                  Plan & billing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/recruiter/settings">
                  <Settings />
                  Settings
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => toast("Signed out")}>
              <LogOut />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
