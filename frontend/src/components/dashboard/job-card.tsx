"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  Building2,
  Check,
  Clock3,
  EyeOff,
  Flame,
  MapPin,
  MoreHorizontal,
  Share2,
  Users,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { MatchRing } from "@/components/dashboard/match-ring";
import { ApplySheet } from "@/components/jobs/job-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  companyHref,
  employmentLabel,
  experienceLabel,
  formatSalary,
  initialsOf,
  jobHref,
  logoClass,
  relativeTime,
  respondsIn,
  workModeLabel,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ScoredJob } from "@/types/api";

export function JobCard({ job }: { job: ScoredJob }) {
  const [saved, setSaved] = useState(job.saved);

  return (
    <Card className="group transition-shadow hover:ring-foreground/20">
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg font-heading text-sm font-semibold",
              logoClass(job.company.id)
            )}
            aria-hidden
          >
            {initialsOf(job.company.name)}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h3 className="font-heading text-base leading-snug font-medium">
                <Link
                  href={jobHref(job)}
                  className="rounded-sm hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  {job.title}
                </Link>
              </h3>
              {job.urgent && (
                <Badge className="bg-chart-4/12 text-chart-4">
                  <Flame />
                  Hiring fast
                </Badge>
              )}
              {job.applied && (
                <Badge variant="outline" className="text-muted-foreground">
                  <Check />
                  Applied
                </Badge>
              )}
            </div>
            <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
              <Link
                href={companyHref(job.company)}
                className="inline-flex items-center gap-1 rounded-sm font-medium text-foreground hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <Building2 className="size-3.5" />
                {job.company.name}
              </Link>
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3.5" />
                {job.location}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock3 className="size-3.5" />
                {relativeTime(job.publishedAt)}
              </span>
            </p>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <MatchRing score={job.match.score} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-56">
              <p className="font-medium">Why this matches</p>
              <p className="text-xs opacity-80">
                {job.match.reasons.length
                  ? job.match.reasons.join(" · ")
                  : "Add more skills to your profile to lift this score"}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        {job.summary && (
          <p className="text-sm text-muted-foreground">{job.summary}</p>
        )}

        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary">{workModeLabel[job.workMode]}</Badge>
          <Badge variant="secondary">{employmentLabel[job.employmentType]}</Badge>
          <Badge variant="secondary">{experienceLabel[job.experienceLevel]}</Badge>
          {job.skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="outline">
              {skill}
            </Badge>
          ))}
          {job.skills.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{job.skills.length - 3}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="font-mono text-sm font-medium text-foreground tabular-nums">
              {formatSalary(job)}
            </span>
            {job.equity && <span>Equity {job.equity}</span>}
            <span className="inline-flex items-center gap-1">
              <Users className="size-3.5" />
              {job.applicantCount} applicants
            </span>
            <span>{respondsIn(job.respondsInDays)}</span>
          </div>

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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label="More actions">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onSelect={() => toast("Link copied to clipboard")}
                >
                  <Share2 />
                  Share this role
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={companyHref(job.company)}>
                    <Building2 />
                    View company
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() =>
                    toast(`Fewer roles like ${job.title}`, {
                      description: "Your feed updates on the next refresh.",
                    })
                  }
                >
                  <EyeOff />
                  Hide similar roles
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm" asChild>
              <Link href={jobHref(job)}>View role</Link>
            </Button>
            <ApplySheet
              job={job}
              trigger={
                <Button size="sm">
                  {job.easyApply && <Zap />}
                  {job.easyApply ? "Quick apply" : "Apply"}
                </Button>
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
