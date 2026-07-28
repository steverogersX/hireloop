"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";

import { STAGE_PROGRESS } from "@/components/applications/application-board";
import { BOARD_STAGES, StageBadge } from "@/components/applications/stage-badge";
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { initialsOf, jobHref, logoClass, shortDate, statusLabel } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Application } from "@/types/api";

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
              "flex size-7 shrink-0 items-center justify-center rounded-md font-heading text-[11px] font-semibold",
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
              {item.job.company.name}
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
    size: 180,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Progress" />
    ),
    cell: ({ row }) => (
      <div className="w-40">
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
      <span className="text-muted-foreground">{row.original.nextStep ?? "—"}</span>
    ),
  },
  {
    id: "applied",
    accessorFn: (row) => row.daysAgo,
    meta: { label: "Applied" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Applied" />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground tabular-nums">
        {shortDate(row.original.createdAt)}
      </span>
    ),
  },
];

export function ApplicationsTable({ applications }: { applications: Application[] }) {
  const [stage, setStage] = useState("all");

  const data = useMemo(
    () =>
      stage === "all"
        ? applications
        : applications.filter((item) => item.status === stage),
    [stage, applications],
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      searchColumn="role"
      searchPlaceholder="Search applications"
      showViewOptions
      emptyMessage="No applications at this stage."
      toolbar={
        <Select value={stage} onValueChange={setStage}>
          <SelectTrigger size="sm" className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All stages</SelectItem>
            {BOARD_STAGES.map((option) => (
              <SelectItem key={option} value={option}>
                {statusLabel[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    />
  );
}
