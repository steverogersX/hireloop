import type { Metadata } from "next";
import Link from "next/link";
import { CircleAlert, Plus, Upload } from "lucide-react";

import { ActionButton } from "@/components/recruiter/action-button";
import { PostingsBoard } from "@/components/recruiter/postings-board";
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
import {
  postingCounts,
  postingHref,
  postingsNeedingAttention,
  postingTotals,
  unreviewedTotal,
} from "@/lib/recruiter-mock-data";

export const metadata: Metadata = {
  title: "Job postings — HireLoop",
  description: "Every role you have published, drafted or closed.",
};

export default function RecruiterJobsPage() {
  const counts = postingCounts();
  const totals = postingTotals();
  const stuck = postingsNeedingAttention();

  const summary = [
    { label: "Published", value: counts.Published, hint: "live right now" },
    {
      label: "Applicants",
      value: totals.applicants,
      hint: `${unreviewedTotal()} unreviewed`,
    },
    {
      label: "Interviewing",
      value: totals.interviewing,
      hint: `${totals.offers} at offer`,
    },
    {
      label: "Total reach",
      value: totals.views.toLocaleString(),
      hint: "views on open roles",
    },
  ];

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
            <BreadcrumbPage>Job postings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="grid gap-1">
          <h1 className="font-heading text-2xl leading-tight font-semibold tracking-tight">
            Job postings
          </h1>
          <p className="text-sm text-muted-foreground">
            {counts.all} roles across your workspace · {counts.Draft} drafts
            waiting to go live
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ActionButton
            variant="outline"
            message="ATS import started"
            description="We will email you when your postings finish syncing."
          >
            <Upload />
            Import from ATS
          </ActionButton>
          <Button asChild>
            <Link href="/recruiter/jobs/new">
              <Plus />
              Post a job
            </Link>
          </Button>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <Card key={item.label} size="sm">
            <CardContent className="grid gap-1">
              <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {item.label}
              </span>
              <span className="font-heading text-2xl leading-none font-semibold tabular-nums">
                {item.value}
              </span>
              <span className="text-xs text-muted-foreground">{item.hint}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {stuck.length > 0 && (
        <Card size="sm">
          <CardContent className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <CircleAlert className="size-4 shrink-0 text-chart-4" />
            <p className="flex min-w-0 flex-1 flex-wrap items-center gap-x-1.5 text-sm">
              <span className="font-medium">
                {stuck.length} postings need a decision
              </span>
              <span className="text-muted-foreground">·</span>
              {stuck.map((posting, index) => (
                <span key={posting.id} className="text-muted-foreground">
                  <Link
                    href={postingHref(posting)}
                    className="rounded-sm hover:text-foreground hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    {posting.title}
                  </Link>
                  {index < stuck.length - 1 && ","}
                </span>
              ))}
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link href={postingHref(stuck[0])}>Review them</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <PostingsBoard />
    </div>
  );
}
