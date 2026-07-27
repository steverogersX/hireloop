"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import {
  DataTable,
  DataTableColumnHeader,
} from "@/components/ui/data-table";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { applications, type Application, type ApplicationStage } from "@/lib/mock-data";

const stageTone: Record<ApplicationStage, string> = {
  Applied: "bg-muted text-muted-foreground",
  Screening: "bg-chart-3/12 text-chart-3",
  Interview: "bg-chart-2/15 text-chart-2",
  Offer: "bg-chart-5/12 text-chart-5",
  Rejected: "bg-destructive/10 text-destructive",
};

const STAGES: ApplicationStage[] = [
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Rejected",
];

const columns: ColumnDef<Application>[] = [
  {
    accessorKey: "jobTitle",
    meta: { label: "Role" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const application = row.original;
      return (
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-md font-heading text-[11px] font-semibold",
              application.company.logoClass
            )}
            aria-hidden
          >
            {application.company.initials}
          </span>
          <div className="grid leading-tight">
            <span className="font-medium">{application.jobTitle}</span>
            <span className="text-xs text-muted-foreground">
              {application.company.name}
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
    cell: ({ row }) => (
      <Badge className={stageTone[row.original.stage]}>
        {row.original.stage}
      </Badge>
    ),
    filterFn: (row, id, value: string) =>
      value === "all" || row.getValue(id) === value,
  },
  {
    accessorKey: "progress",
    meta: { label: "Progress" },
    size: 180,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Progress" />
    ),
    cell: ({ row }) => (
      <div className="w-40">
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
      <span className="text-muted-foreground">{row.original.nextStep}</span>
    ),
  },
  {
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
  },
];

export function ApplicationsTable() {
  const [stage, setStage] = useState("all");

  const data = useMemo(
    () =>
      stage === "all"
        ? applications
        : applications.filter((item) => item.stage === stage),
    [stage]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      searchColumn="jobTitle"
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
            {STAGES.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    />
  );
}
