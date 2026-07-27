"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";

import { StageBadge } from "@/components/applications/stage-badge";
import { CompanyLogo } from "@/components/companies/company-logo";
import { DataTableColumnHeader } from "@/components/ui/data-table";
import { Progress } from "@/components/ui/progress";
import { jobForApplication, jobHref, type Application } from "@/lib/mock-data";

/**
 * `compact` is the dashboard panel: smaller logo, plain title, no location or
 * relative date. The applications page uses the full variant.
 */
export function applicationColumns({
  compact = false,
}: { compact?: boolean } = {}): ColumnDef<Application>[] {
  return [
    {
      accessorKey: "jobTitle",
      meta: { label: "Role" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      cell: ({ row }) => {
        const item = row.original;
        const job = compact ? null : jobForApplication(item);

        return (
          <div className="flex items-center gap-2.5">
            <CompanyLogo
              company={item.company}
              size={compact ? "xs" : "sm"}
            />
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
                {compact
                  ? item.company.name
                  : `${item.company.name} · ${item.location}`}
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
      filterFn: (row, id, value: string) =>
        value === "all" || row.getValue(id) === value,
    },
    {
      accessorKey: "progress",
      meta: { label: "Progress" },
      size: compact ? 180 : 190,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Progress" />
      ),
      cell: ({ row }) => (
        <div className={compact ? "w-40" : "w-44"}>
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
        <span
          className={
            compact
              ? "text-muted-foreground"
              : "whitespace-normal text-muted-foreground"
          }
        >
          {row.original.nextStep}
        </span>
      ),
    },
    ...(compact
      ? []
      : [
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
          } satisfies ColumnDef<Application>,
        ]),
    compact
      ? {
          accessorKey: "appliedOn",
          meta: { label: "Applied" },
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Applied" />
          ),
          cell: ({ row }) => (
            <span className="font-mono text-xs text-muted-foreground tabular-nums">
              {row.original.appliedOn}
            </span>
          ),
        }
      : {
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
  ];
}
