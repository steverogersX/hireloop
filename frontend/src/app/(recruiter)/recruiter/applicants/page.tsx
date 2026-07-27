import type { Metadata } from "next";
import Link from "next/link";
import { Download, UserSearch } from "lucide-react";

import { ActionButton } from "@/components/recruiter/action-button";
import { CandidateRows } from "@/components/recruiter/candidate-rows";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  candidates,
  PIPELINE_STAGES,
  stageCounts,
  unreviewedTotal,
} from "@/lib/recruiter-mock-data";

export const metadata: Metadata = {
  title: "Applicants — HireLoop",
  description: "Every candidate across every role you are hiring for.",
};

const stageBar: Record<string, string> = {
  Applied: "bg-chart-1",
  "In review": "bg-chart-3",
  Interview: "bg-chart-2",
  Offer: "bg-chart-5",
  Hired: "bg-primary",
  Rejected: "bg-destructive",
};

export default function ApplicantsPage() {
  const counts = stageCounts(candidates);
  const total = candidates.length;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/recruiter">Overview</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Applicants</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="grid gap-1">
          <h1 className="font-heading text-2xl leading-tight font-semibold tracking-tight">
            Applicants
          </h1>
          <p className="text-sm text-muted-foreground">
            {total} candidates in your pipelines · {unreviewedTotal()} across all
            roles still need a first read
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ActionButton
            variant="outline"
            tone="success"
            message="Export started"
            description={`${candidates.length} applicants will arrive by email.`}
          >
            <Download />
            Export CSV
          </ActionButton>
          <Button asChild>
            <Link href="/recruiter/search">
              <UserSearch />
              Source candidates
            </Link>
          </Button>
        </div>
      </header>

      <Card size="sm">
        <CardContent className="grid gap-3">
          <div className="flex h-2 gap-0.5 overflow-hidden rounded-full">
            {PIPELINE_STAGES.map((stage) =>
              counts[stage] > 0 ? (
                <span
                  key={stage}
                  className={cn("h-full rounded-full", stageBar[stage])}
                  style={{ width: `${(counts[stage] / total) * 100}%` }}
                  aria-hidden
                />
              ) : null
            )}
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            {PIPELINE_STAGES.map((stage) => (
              <span
                key={stage}
                className="inline-flex items-baseline gap-1.5 text-xs text-muted-foreground"
              >
                <span
                  className={cn(
                    "size-2 self-center rounded-full",
                    stageBar[stage]
                  )}
                  aria-hidden
                />
                {stage}
                <span className="font-mono text-foreground tabular-nums">
                  {counts[stage]}
                </span>
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <CandidateRows
        pool={candidates}
        withFilters
        pageSize={10}
        className="rounded-xl bg-card px-3 py-3 ring-1 ring-foreground/10"
      />
    </div>
  );
}
