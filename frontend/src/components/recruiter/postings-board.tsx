"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Ban,
  Copy,
  Eye,
  Link2,
  MoreHorizontal,
  PenLine,
  Send,
  Users,
} from "lucide-react";
import { toast } from "sonner";

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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import {
  formatBand,
  memberById,
  postingCounts,
  postingHref,
  postings,
  statusTone,
  team,
  type Posting,
} from "@/lib/recruiter-mock-data";

const columns: ColumnDef<Posting>[] = [
  {
    accessorKey: "title",
    meta: { label: "Role" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const posting = row.original;
      return (
        <div className="grid leading-tight">
          <span className="flex items-center gap-1.5 font-medium">
            <Link
              href={postingHref(posting)}
              className="rounded-sm hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              {posting.title}
            </Link>
            {posting.unreviewed > 0 && (
              <Badge className="bg-chart-4/12 font-mono text-chart-4">
                {posting.unreviewed} unread
              </Badge>
            )}
          </span>
          <span className="text-xs text-muted-foreground">
            {posting.location} · {posting.workplace} · {posting.seniority}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    meta: { label: "Status" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <div className="grid gap-1 leading-tight">
        <Badge className={statusTone[row.original.status]}>
          {row.original.status}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {row.original.closesIn}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "applicants",
    meta: { label: "Applicants" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Applicants" />
    ),
    cell: ({ row }) => (
      <div className="grid leading-tight">
        <span className="font-mono text-sm tabular-nums">
          {row.original.applicants}
        </span>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {row.original.interviewing} interviewing · {row.original.offers} offer
          {row.original.offers === 1 ? "" : "s"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "views",
    meta: { label: "Reach" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reach" />
    ),
    cell: ({ row }) => (
      <div className="grid leading-tight">
        <span className="font-mono text-sm tabular-nums">
          {row.original.views.toLocaleString()}
        </span>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {row.original.conversion}% apply
        </span>
      </div>
    ),
  },
  {
    id: "band",
    meta: { label: "Salary band" },
    accessorFn: (posting) => posting.salaryMin,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Salary band" />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-sm tabular-nums">
        {formatBand(row.original)}
      </span>
    ),
  },
  {
    id: "owner",
    meta: { label: "Owner" },
    accessorFn: (posting) => memberById(posting.ownerId)?.name ?? "",
    header: "Owner",
    cell: ({ row }) => {
      const owner = memberById(row.original.ownerId);
      if (!owner) return null;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="size-7">
            <AvatarFallback
              className={cn("text-[10px] font-medium", owner.avatarClass)}
            >
              {owner.initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{owner.name}</span>
        </div>
      );
    },
    filterFn: (row, id, value: string) =>
      value === "all" || row.getValue(id) === value,
  },
  {
    accessorKey: "postedAgo",
    meta: { label: "Posted" },
    header: "Posted",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {row.original.postedAgo}
      </span>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    header: "",
    cell: ({ row }) => {
      const posting = row.original;
      return (
        <div className="flex items-center justify-end gap-1.5">
          <Button variant="outline" size="sm" asChild>
            <Link href={postingHref(posting)}>
              <Users />
              Pipeline
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`More actions for ${posting.title}`}
              >
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={postingHref(posting)}>
                  <PenLine />
                  Edit posting
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => toast(`${posting.title} duplicated as a draft`)}
              >
                <Copy />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => toast("Public link copied to clipboard")}
              >
                <Link2 />
                Copy public link
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {posting.status === "Draft" ? (
                <DropdownMenuItem
                  onSelect={() =>
                    toast.success(`${posting.title} is now published`)
                  }
                >
                  <Send />
                  Publish
                </DropdownMenuItem>
              ) : posting.status === "Published" ? (
                <DropdownMenuItem
                  onSelect={() => toast(`${posting.title} closed to new applicants`)}
                >
                  <Ban />
                  Close posting
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onSelect={() => toast(`${posting.title} reopened`)}
                >
                  <Eye />
                  Reopen
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

const STATUSES = ["all", "Published", "Draft", "Closed"] as const;

export function PostingsBoard() {
  const [status, setStatus] = useState<string>("all");
  const [owner, setOwner] = useState("all");
  const counts = postingCounts();

  const data = useMemo(
    () =>
      postings.filter((posting) => {
        if (status !== "all" && posting.status !== status) return false;
        if (owner !== "all" && posting.ownerId !== owner) return false;
        return true;
      }),
    [status, owner]
  );

  return (
    <div className="grid gap-3">
      <ToggleGroup
        type="single"
        value={status}
        onValueChange={(value) => value && setStatus(value)}
        variant="outline"
        size="sm"
        spacing={0}
      >
        {STATUSES.map((option) => (
          <ToggleGroupItem key={option} value={option}>
            {option === "all" ? "All postings" : option}
            <span className="font-mono text-xs opacity-60 tabular-nums">
              {counts[option === "all" ? "all" : option]}
            </span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <DataTable
        columns={columns}
        data={data}
        searchColumn="title"
        searchPlaceholder="Search postings"
        pageSize={8}
        showViewOptions
        emptyMessage="No postings match this filter."
        className="rounded-xl bg-card px-3 py-3 ring-1 ring-foreground/10"
        toolbar={
          <Select value={owner} onValueChange={setOwner}>
            <SelectTrigger size="sm" className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All owners</SelectItem>
              {team.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />
    </div>
  );
}
