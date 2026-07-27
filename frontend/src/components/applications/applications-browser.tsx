"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Ban,
  Bell,
  Building2,
  ExternalLink,
  Kanban,
  LayoutList,
  MessageSquare,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "sonner";

import { ApplicationBoard } from "@/components/applications/application-board";
import {
  StageBadge,
  stageDot,
} from "@/components/applications/stage-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DataTable,
  DataTableColumnHeader,
} from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  applications,
  applicationStages,
  companyHref,
  jobForApplication,
  jobHref,
  type Application,
  type ApplicationStage,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const columns: ColumnDef<Application>[] = [
  {
    accessorKey: "jobTitle",
    meta: { label: "Role" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const item = row.original;
      const job = jobForApplication(item);

      return (
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-lg font-heading text-[11px] font-semibold",
              item.company.logoClass
            )}
            aria-hidden
          >
            {item.company.initials}
          </span>
          <div className="grid leading-tight">
            {job ? (
              <Link
                href={jobHref(job)}
                className="rounded-sm font-medium hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                {item.jobTitle}
              </Link>
            ) : (
              <span className="font-medium">{item.jobTitle}</span>
            )}
            <span className="text-xs text-muted-foreground">
              {item.company.name} · {item.location}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "stage",
    meta: { label: "Stage" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stage" />
    ),
    cell: ({ row }) => <StageBadge stage={row.original.stage} />,
  },
  {
    accessorKey: "progress",
    meta: { label: "Progress" },
    size: 190,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Progress" />
    ),
    cell: ({ row }) => (
      <div className="w-44">
        <Progress value={row.original.progress} />
        <span className="mt-1.5 block text-xs whitespace-normal text-muted-foreground">
          {row.original.lastUpdate}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "nextStep",
    meta: { label: "Next step" },
    header: "Next step",
    cell: ({ row }) => (
      <span className="whitespace-normal text-muted-foreground">
        {row.original.nextStep}
      </span>
    ),
  },
  {
    accessorKey: "source",
    meta: { label: "Source" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Source" />
    ),
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {row.original.source}
      </span>
    ),
  },
  {
    accessorKey: "appliedDaysAgo",
    meta: { label: "Applied" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Applied" />
    ),
    cell: ({ row }) => (
      <div className="grid leading-tight">
        <span className="font-mono text-xs tabular-nums">
          {row.original.appliedOn}
        </span>
        <span className="text-xs text-muted-foreground">
          {row.original.appliedDaysAgo}d ago
        </span>
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    header: "",
    cell: ({ row }) => {
      const item = row.original;
      const job = jobForApplication(item);

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Actions for ${item.jobTitle}`}
              >
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {job && (
                <DropdownMenuItem asChild>
                  <Link href={jobHref(job)}>
                    <ExternalLink />
                    View the role
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link href={companyHref(item.company)}>
                  <Building2 />
                  View company
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => toast("Draft opened", { description: `Message to ${item.company.name}` })}
              >
                <MessageSquare />
                Message recruiter
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => toast("Reminder set for tomorrow")}
              >
                <Bell />
                Remind me to follow up
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() =>
                  toast(`Withdrew from ${item.jobTitle}`, {
                    description: `${item.company.name} has been notified.`,
                  })
                }
              >
                <Ban />
                Withdraw application
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export function ApplicationsBrowser() {
  const [stage, setStage] = useState<ApplicationStage | "all">("all");
  const [view, setView] = useState("list");

  const counts = useMemo(
    () =>
      applicationStages.map((name) => ({
        name,
        count: applications.filter((item) => item.stage === name).length,
      })),
    []
  );

  const items = useMemo(
    () =>
      stage === "all"
        ? applications
        : applications.filter((item) => item.stage === stage),
    [stage]
  );

  return (
    <div className="grid gap-4">
      <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-6">
        <StageTile
          label="All applications"
          count={applications.length}
          active={stage === "all"}
          onClick={() => setStage("all")}
        />
        {counts.map((entry) => (
          <StageTile
            key={entry.name}
            label={entry.name}
            count={entry.count}
            dot={stageDot[entry.name]}
            active={stage === entry.name}
            onClick={() => setStage(entry.name)}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-mono font-medium text-foreground tabular-nums">
            {items.length}
          </span>{" "}
          of{" "}
          <span className="font-mono text-foreground tabular-nums">
            {applications.length}
          </span>{" "}
          applications
        </p>

        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(value) => value && setView(value)}
          variant="outline"
          size="sm"
        >
          <ToggleGroupItem value="list" aria-label="List view">
            <LayoutList />
            List
          </ToggleGroupItem>
          <ToggleGroupItem value="board" aria-label="Board view">
            <Kanban />
            Board
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {view === "board" ? (
        <ApplicationBoard items={items} />
      ) : (
        <Card>
          <CardContent>
            <DataTable
              columns={columns}
              data={items}
              searchColumn="jobTitle"
              searchPlaceholder="Search by role"
              pageSize={8}
              showViewOptions
              emptyMessage="No applications at this stage."
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StageTile({
  label,
  count,
  dot,
  active,
  onClick,
}: {
  label: string;
  count: number;
  dot?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "grid gap-1 rounded-xl bg-card px-3 py-2.5 text-left ring-1 transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        active
          ? "ring-2 ring-primary"
          : "ring-foreground/10 hover:bg-muted/60"
      )}
    >
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {dot && <span className={cn("size-2 rounded-full", dot)} aria-hidden />}
        {label}
      </span>
      <span className="font-heading text-xl leading-none font-semibold tabular-nums">
        {count}
      </span>
    </button>
  );
}
