"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Bell,
  CircleUser,
  CreditCard,
  LogOut,
  Mail,
  MessageSquare,
  Moon,
  Search,
  Settings,
  Sparkles,
  Sun,
  UploadCloud,
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
import { activity, candidate } from "@/lib/mock-data";

const activityIcon = {
  view: Sparkles,
  stage: ArrowRight,
  message: MessageSquare,
  match: Sparkles,
  invite: Mail,
} as const;

const activityHref: Record<string, string> = {
  view: "/profile",
  stage: "/applications",
  message: "/messages",
  match: "/jobs",
  invite: "/jobs",
};

export function TopBar() {
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const search = () => {
    const term = query.trim();
    router.push(term ? `/jobs?q=${encodeURIComponent(term)}` : "/jobs");
  };

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur-md sm:px-5">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 h-5" />

      <div className="relative w-full max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              search();
            }
          }}
          placeholder="Search roles, companies, skills"
          className="h-8 pl-8"
          aria-label="Search jobs"
        />
        <kbd className="pointer-events-none absolute top-1/2 right-2 hidden -translate-y-1/2 rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground sm:block">
          ⏎
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          className="hidden md:inline-flex"
          asChild
        >
          <Link href="/profile">
            <UploadCloud />
            Upload resume
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="relative"
              aria-label={`Notifications, ${activity.length} recent`}
            >
              <Bell />
              <span className="absolute top-1 right-1 size-1.5 rounded-full bg-chart-4 ring-2 ring-background" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between gap-2">
              Notifications
              <button
                type="button"
                onClick={() => toast("All notifications marked as read")}
                className="rounded-sm text-xs font-normal text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                Mark all read
              </button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {activity.map((item) => {
              const Icon = activityIcon[item.kind];
              return (
                <DropdownMenuItem key={item.id} asChild className="gap-2.5">
                  <Link href={activityHref[item.kind] ?? "/dashboard"}>
                    <Icon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                    <span className="grid gap-0.5">
                      <span className="text-sm leading-snug">{item.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.detail} · {item.time}
                      </span>
                    </span>
                  </Link>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/applications" className="justify-center text-sm">
                See all activity
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-full"
              aria-label="Account menu"
            >
              <Avatar className="size-7">
                <AvatarFallback className="bg-primary/10 text-[11px] font-medium text-primary">
                  {candidate.initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="grid gap-0.5">
              <span className="text-sm font-medium">{candidate.name}</span>
              <span className="text-xs font-normal text-muted-foreground">
                {candidate.email}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <CircleUser />
                  View public profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => toast("Billing opens once you start a plan")}
              >
                <CreditCard />
                Plan & billing
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
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
