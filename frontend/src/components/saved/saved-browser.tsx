"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Clock3, NotebookPen, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { JobCard } from "@/components/dashboard/job-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { savedFolders, savedJobs } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const rows = savedJobs();

export function SavedBrowser() {
  const [folder, setFolder] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recent");

  const results = useMemo(() => {
    const filtered = rows.filter(({ entry, job }) => {
      if (folder !== "all" && entry.folder !== folder) return false;
      if (!query) return true;
      const haystack =
        `${job.title} ${job.company.name} ${entry.note}`.toLowerCase();
      return haystack.includes(query.toLowerCase());
    });

    return [...filtered].sort((a, b) => {
      if (sort === "match") return b.job.matchScore - a.job.matchScore;
      if (sort === "closing")
        return (a.entry.closingIn ? 0 : 1) - (b.entry.closingIn ? 0 : 1);
      return a.entry.daysAgo - b.entry.daysAgo;
    });
  }, [folder, query, sort]);

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <FolderChip
          label="All"
          count={rows.length}
          active={folder === "all"}
          onClick={() => setFolder("all")}
        />
        {savedFolders.map((name) => (
          <FolderChip
            key={name}
            label={name}
            count={rows.filter((row) => row.entry.folder === name).length}
            active={folder === name}
            onClick={() => setFolder(name)}
          />
        ))}

        <div className="relative ml-auto w-full max-w-56">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search saved roles"
            className="h-8 pl-8"
            aria-label="Search saved roles"
          />
        </div>

        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger size="sm" className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Recently saved</SelectItem>
            <SelectItem value="match">Best match</SelectItem>
            <SelectItem value="closing">Closing soonest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {results.length === 0 ? (
        <div className="grid justify-items-center gap-2 rounded-xl border border-dashed px-6 py-16 text-center">
          <p className="font-heading text-sm font-medium">
            Nothing saved here yet
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Save a role from the feed and it lands in this folder with a note
            you can write yourself.
          </p>
          <Button size="sm" className="mt-1" asChild>
            <Link href="/jobs">Browse open roles</Link>
          </Button>
        </div>
      ) : (
        results.map(({ entry, job }) => (
          <div key={job.id} className="grid gap-2">
            <div className="flex flex-wrap items-center gap-2 px-1 text-xs text-muted-foreground">
              <Badge variant="outline">{entry.folder}</Badge>
              <span>Saved {entry.savedOn}</span>
              {entry.closingIn && (
                <span className="inline-flex items-center gap-1 text-chart-4">
                  <Clock3 className="size-3.5" />
                  {entry.closingIn}
                </span>
              )}
              <Button
                variant="ghost"
                size="xs"
                className="ml-auto"
                onClick={() => toast(`Removed ${job.title} from saved`)}
              >
                <Trash2 />
                Remove
              </Button>
            </div>

            <JobCard job={job} />

            <p className="flex items-start gap-2 rounded-lg bg-muted/60 px-3 py-2 text-sm text-muted-foreground">
              <NotebookPen className="mt-0.5 size-3.5 shrink-0" />
              {entry.note}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

function FolderChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      size="sm"
      onClick={onClick}
      aria-pressed={active}
      className={cn(active && "ring-1 ring-primary/40")}
    >
      {label}
      <Badge variant="outline" className="ml-1 font-mono">
        {count}
      </Badge>
    </Button>
  );
}
