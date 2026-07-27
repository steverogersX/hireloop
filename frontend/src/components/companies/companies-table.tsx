"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DataTable,
  DataTableColumnHeader,
} from "@/components/ui/data-table";
import { companyHref, type DirectoryEntry } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const columns: ColumnDef<DirectoryEntry>[] = [
  {
    id: "name",
    meta: { label: "Company" },
    accessorFn: (entry) => entry.company.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company" />
    ),
    cell: ({ row }) => {
      const { company, culture } = row.original;
      return (
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-lg font-heading text-[11px] font-semibold",
              company.logoClass
            )}
            aria-hidden
          >
            {company.initials}
          </span>
          <div className="grid leading-tight">
            <Link
              href={companyHref(company)}
              className="rounded-sm font-medium hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              {company.name}
            </Link>
            <span className="max-w-64 truncate text-xs text-muted-foreground">
              {culture.tagline}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    id: "industry",
    meta: { label: "Industry" },
    accessorFn: (entry) => entry.company.industry,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Industry" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.company.industry}
      </span>
    ),
  },
  {
    id: "hq",
    meta: { label: "Headquarters" },
    accessorFn: (entry) => entry.company.hq,
    header: "Headquarters",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.company.hq}</span>
    ),
  },
  {
    id: "size",
    meta: { label: "Size" },
    accessorFn: (entry) => entry.band,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Size" />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground tabular-nums">
        {row.original.company.size}
      </span>
    ),
  },
  {
    id: "rating",
    meta: { label: "Rating" },
    accessorFn: (entry) => entry.company.rating,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rating" />
    ),
    cell: ({ row }) => (
      <span className="inline-flex items-center gap-1 font-mono text-sm tabular-nums">
        <Star className="size-3.5 fill-chart-2 text-chart-2" />
        {row.original.company.rating}
      </span>
    ),
  },
  {
    id: "openRoles",
    meta: { label: "Open roles" },
    accessorFn: (entry) => entry.openRoles,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Open roles" />
    ),
    cell: ({ row }) => (
      <Badge className="bg-chart-5/12 font-mono text-chart-5">
        {row.original.openRoles}
      </Badge>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    header: "",
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Button variant="outline" size="sm" asChild>
          <Link href={companyHref(row.original.company)}>View</Link>
        </Button>
      </div>
    ),
  },
];

export function CompaniesTable({ entries }: { entries: DirectoryEntry[] }) {
  return (
    <DataTable
      columns={columns}
      data={entries}
      pageSize={8}
      showViewOptions
      emptyMessage="No companies match these filters."
      className="rounded-xl bg-card px-3 py-3 ring-1 ring-foreground/10"
    />
  );
}
