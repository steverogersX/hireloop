"use client";

import Link from "next/link";
import { useState } from "react";
import { Bookmark, Check, Users, Zap } from "lucide-react";
import { toast } from "sonner";

import { MatchRing } from "@/components/dashboard/match-ring";
import { ApplySheet } from "@/components/jobs/job-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatSalary, jobHref, type Job } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function JobRow({ job }: { job: Job }) {
  const [saved, setSaved] = useState(job.saved);

  return (
    <Card size="sm">
      <CardContent className="flex flex-wrap items-center gap-3">
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg font-heading text-xs font-semibold",
            job.company.logoClass
          )}
          aria-hidden
        >
          {job.company.initials}
        </span>

        <div className="min-w-0 flex-1 basis-64">
          <p className="flex flex-wrap items-center gap-2">
            <Link
              href={jobHref(job)}
              className="truncate rounded-sm font-medium hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              {job.title}
            </Link>
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
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {job.company.name} · {job.location} · {job.workplace} ·{" "}
            {job.postedAgo}
          </p>
        </div>

        <span className="font-mono text-sm tabular-nums">
          {formatSalary(job)}
        </span>

        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="size-3.5" />
          {job.applicants}
        </span>

        <MatchRing score={job.matchScore} size={34} />

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={saved ? "Remove from saved" : "Save job"}
            aria-pressed={saved}
            onClick={() => {
              setSaved(!saved);
              toast(saved ? "Removed from saved" : "Saved to your list");
            }}
          >
            <Bookmark className={cn(saved && "fill-current text-primary")} />
          </Button>
          <ApplySheet
            job={job}
            trigger={<Button size="sm">Apply</Button>}
          />
        </div>
      </CardContent>
    </Card>
  );
}
