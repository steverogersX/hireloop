"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { CalendarPlus, Eye, MoreHorizontal, Star, X } from "lucide-react";
import { toast } from "sonner";

import { MatchRing } from "@/components/dashboard/match-ring";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  candidateHref,
  PIPELINE_STAGES,
  stageTone,
  type Candidate,
} from "@/lib/recruiter-mock-data";

const columns: ColumnDef<Candidate>[] = [
  {
    accessorKey: "name",
    meta: { label: "Candidate" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Candidate" />
    ),
    cell: ({ row }) => {
      const candidate = row.original;
      return (
        <div className="flex items-center gap-2.5">
          <Avatar className="size-8">
            <AvatarFallback
              className={cn("text-[11px] font-medium", candidate.avatarClass)}
            >
              {candidate.initials}
            </AvatarFallback>
          </Avatar>
          <div className="grid leading-tight">
            <Link
              href={candidateHref(candidate)}
              className="flex items-center gap-1.5 rounded-sm font-medium hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              {candidate.name}
              {candidate.isNew && (
                <Badge className="bg-chart-2/15 text-chart-2">New</Badge>
              )}
            </Link>
            <span className="text-xs text-muted-foreground">
              {candidate.headline} · {candidate.location}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    meta: { label: "Applied for" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Applied for" />
    ),
    cell: ({ row }) => (
      <div className="grid leading-tight">
        <span className="max-w-56 truncate">{row.original.role}</span>
        <span className="text-xs text-muted-foreground">
          {row.original.source} · {row.original.appliedAgo}
        </span>
      </div>
    ),
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
  },
  {
    accessorKey: "experience",
    meta: { label: "Experience" },
    header: "Experience",
    cell: ({ row }) => (
      <div className="grid leading-tight">
        <span className="font-mono text-sm tabular-nums">
          {row.original.experience}
        </span>
        <span className="text-xs text-muted-foreground">
          {row.original.expected} · {row.original.noticePeriod}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "score",
    meta: { label: "Fit" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fit" />
    ),
    cell: ({ row }) => (
      <MatchRing score={row.original.score} size={34} label="fit" />
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    header: "",
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-1.5">
        <Button variant="outline" size="sm" asChild>
          <Link href={candidateHref(row.original)}>
            <Eye />
            Review
          </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`More actions for ${row.original.name}`}
            >
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={() =>
                toast.success(`Interview request sent to ${row.original.name}`)
              }
            >
              <CalendarPlus />
              Schedule interview
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => toast(`${row.original.name} shortlisted`)}
            >
              <Star />
              Add to shortlist
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => toast(`${row.original.name} moved to rejected`)}
            >
              <X />
              Reject
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];

export function CandidateRows({
  pool,
  withFilters = false,
  pageSize,
  className,
}: {
  pool: Candidate[];
  withFilters?: boolean;
  pageSize?: number;
  className?: string;
}) {
  const [stage, setStage] = useState("all");

  const data = useMemo(
    () =>
      stage === "all"
        ? pool
        : pool.filter((candidate) => candidate.stage === stage),
    [pool, stage]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      pageSize={pageSize}
      searchColumn={withFilters ? "name" : undefined}
      searchPlaceholder="Search applicants"
      showViewOptions={withFilters}
      emptyMessage="No applicants at this stage."
      className={className}
      toolbar={
        withFilters ? (
          <Select value={stage} onValueChange={setStage}>
            <SelectTrigger size="sm" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All stages</SelectItem>
              {PIPELINE_STAGES.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : undefined
      }
    />
  );
}
