"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Check, Zap } from "lucide-react";

import { MatchRing } from "@/components/dashboard/match-ring";
import { ApplySheet } from "@/components/jobs/job-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table";
import {
  annualSalary,
  employmentLabel,
  formatSalary,
  initialsOf,
  jobHref,
  logoClass,
  relativeTime,
  workModeLabel,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ScoredJob } from "@/types/api";

const columns: ColumnDef<ScoredJob>[] = [
  {
    accessorKey: "title",
    meta: { label: "Role" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
    cell: ({ row }) => {
      const job = row.original;
      return (
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-lg font-heading text-[11px] font-semibold",
              logoClass(job.company.id)
            )}
            aria-hidden
          >
            {initialsOf(job.company.name)}
          </span>
          <div className="grid leading-tight">
            <Link
              href={jobHref(job)}
              className="flex items-center gap-1.5 rounded-sm font-medium hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              {job.title}
              {job.easyApply && !job.applied && (
                <Badge className="bg-chart-2/15 text-chart-2">
                  <Zap />
                  Quick
                </Badge>
              )}
              {job.applied && (
                <Badge variant="outline" className="text-muted-foreground">
                  <Check />
                  Applied
                </Badge>
              )}
            </Link>
            <span className="text-xs text-muted-foreground">{job.company.name}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "location",
    meta: { label: "Location" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
    cell: ({ row }) => (
      <div className="grid leading-tight">
        <span>{row.original.location}</span>
        <span className="text-xs text-muted-foreground">
          {workModeLabel[row.original.workMode]} ·{" "}
          {employmentLabel[row.original.employmentType]}
        </span>
      </div>
    ),
  },
  {
    id: "salary",
    meta: { label: "Salary" },
    accessorFn: (job) => annualSalary(job),
    header: ({ column }) => <DataTableColumnHeader column={column} title="Salary" />,
    cell: ({ row }) => (
      <span className="font-mono text-sm tabular-nums">
        {formatSalary(row.original)}
      </span>
    ),
  },
  {
    accessorKey: "applicantCount",
    meta: { label: "Applicants" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Applicants" />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-sm text-muted-foreground tabular-nums">
        {row.original.applicantCount}
      </span>
    ),
  },
  {
    id: "posted",
    meta: { label: "Posted" },
    accessorFn: (job) => job.publishedAt,
    header: "Posted",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {relativeTime(row.original.publishedAt)}
      </span>
    ),
  },
  {
    id: "match",
    meta: { label: "Match" },
    accessorFn: (job) => job.match.score,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Match" />,
    cell: ({ row }) => <MatchRing score={row.original.match.score} size={34} />,
  },
  {
    id: "actions",
    enableHiding: false,
    header: "",
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-1.5">
        <Button variant="outline" size="sm" asChild>
          <Link href={jobHref(row.original)}>View</Link>
        </Button>
        <ApplySheet
          job={row.original}
          trigger={<Button size="sm">Apply</Button>}
        />
      </div>
    ),
  },
];

export function JobsTable({ jobs }: { jobs: ScoredJob[] }) {
  return (
    <DataTable
      columns={columns}
      data={jobs}
      pageSize={8}
      showViewOptions
      emptyMessage="No roles match every filter."
      className="rounded-xl bg-card px-3 py-3 ring-1 ring-foreground/10"
    />
  );
}
