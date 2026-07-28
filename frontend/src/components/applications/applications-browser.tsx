"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

import {
  ApplicationBoard,
  STAGE_PROGRESS,
} from "@/components/applications/application-board";
import {
  BOARD_STAGES,
  StageBadge,
  stageDot,
} from "@/components/applications/stage-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { mutate } from "@/lib/client-api";
import {
  companyHref,
  initialsOf,
  jobHref,
  logoClass,
  shortDate,
  statusLabel,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Application, ApplicationStatus } from "@/types/api";

function buildColumns(onWithdraw: (id: string, title: string, company: string) => void) {
  const columns: ColumnDef<Application>[] = [
    {
      id: "role",
      accessorFn: (row) => row.job.title,
      meta: { label: "Role" },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-2.5">
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-lg font-heading text-[11px] font-semibold",
                logoClass(item.job.company.id)
              )}
              aria-hidden
            >
              {initialsOf(item.job.company.name)}
            </span>
            <div className="grid leading-tight">
              <Link
                href={jobHref(item.job)}
                className="rounded-sm font-medium hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                {item.job.title}
              </Link>
              <span className="text-xs text-muted-foreground">
                {item.job.company.name} · {item.job.location}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      meta: { label: "Stage" },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Stage" />,
      cell: ({ row }) => <StageBadge stage={row.original.status} />,
    },
    {
      id: "progress",
      accessorFn: (row) => STAGE_PROGRESS[row.status] ?? 0,
      meta: { label: "Progress" },
      size: 190,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Progress" />
      ),
      cell: ({ row }) => (
        <div className="w-44">
          <Progress value={STAGE_PROGRESS[row.original.status] ?? 0} />
          <span className="mt-1.5 block text-xs whitespace-normal text-muted-foreground">
            {row.original.lastUpdate ?? "No updates yet"}
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
          {row.original.nextStep ?? "—"}
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
        <span className="text-xs text-muted-foreground capitalize">
          {row.original.source.toLowerCase().replace("_", " ")}
        </span>
      ),
    },
    {
      accessorKey: "daysAgo",
      meta: { label: "Applied" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Applied" />
      ),
      cell: ({ row }) => (
        <div className="grid leading-tight">
          <span className="font-mono text-xs tabular-nums">
            {shortDate(row.original.createdAt)}
          </span>
          <span className="text-xs text-muted-foreground">
            {row.original.daysAgo}d ago
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
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Actions for ${item.job.title}`}
                >
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={jobHref(item.job)}>
                    <ExternalLink />
                    View the role
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={companyHref(item.job.company)}>
                    <Building2 />
                    View company
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/messages">
                    <MessageSquare />
                    Message recruiter
                  </Link>
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
                    onWithdraw(item.id, item.job.title, item.job.company.name)
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

  return columns;
}

export function ApplicationsBrowser({ applications }: { applications: Application[] }) {
  const router = useRouter();
  const [stage, setStage] = useState<ApplicationStatus | "all">("all");
  const [view, setView] = useState("list");

  const withdraw = async (id: string, title: string, company: string) => {
    await mutate(`/applications/${id}/withdraw`, "PATCH");
    router.refresh();
    toast(`Withdrew from ${title}`, { description: `${company} has been notified.` });
  };

  const columns = useMemo(() => buildColumns(withdraw), []); // eslint-disable-line react-hooks/exhaustive-deps

  const counts = BOARD_STAGES.map((name) => ({
    name,
    count: applications.filter((item) => item.status === name).length,
  }));

  const items =
    stage === "all"
      ? applications
      : applications.filter((item) => item.status === stage);

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
            label={statusLabel[entry.name]}
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
              searchColumn="role"
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
        active ? "ring-2 ring-primary" : "ring-foreground/10 hover:bg-muted/60"
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
