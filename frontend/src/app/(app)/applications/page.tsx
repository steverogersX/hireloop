import type { Metadata } from "next";
import Link from "next/link";

import { ApplicationsActions } from "@/components/applications/applications-actions";
import { ApplicationsBrowser } from "@/components/applications/applications-browser";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { getApplicationInsights, getApplications } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Applications — HireLoop",
  description:
    "Track every application, what stage it is at, and what needs your attention next.",
};

export default async function ApplicationsPage() {
  const [applications, insights] = await Promise.all([
    getApplications(),
    getApplicationInsights(),
  ]);

  const tiles = [
    {
      label: "Response rate",
      value: `${insights?.responseRate ?? 0}%`,
      hint: `${insights?.total ?? 0} applications sent`,
    },
    {
      label: "Median time to first reply",
      value:
        insights?.medianDaysToFirstReply == null
          ? "—"
          : `${insights.medianDaysToFirstReply} days`,
      hint: "across all applications",
    },
    {
      label: "Interview conversion",
      value: `${insights?.interviewRate ?? 0}%`,
      hint: "reached interview or offer",
    },
    {
      label: "Needs your attention",
      value: `${insights?.needsAttention ?? 0}`,
      hint: "no reply in over three weeks",
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Overview</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Applications</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="grid gap-1">
          <h1 className="font-heading text-2xl leading-tight font-semibold tracking-tight">
            Applications
          </h1>
          <p className="text-sm text-muted-foreground">
            {insights?.needsAttention ?? 0} need your attention, and{" "}
            {applications.filter((a) => a.status === "OFFER").length} offer to
            answer.
          </p>
        </div>
        <ApplicationsActions applications={applications} />
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map((tile) => (
          <Card key={tile.label} size="sm">
            <CardContent className="grid gap-1.5">
              <span className="text-xs tracking-wide text-muted-foreground uppercase">
                {tile.label}
              </span>
              <span className="font-heading text-2xl leading-none font-semibold tabular-nums">
                {tile.value}
              </span>
              <span className="text-xs text-muted-foreground">{tile.hint}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <ApplicationsBrowser applications={applications} />
    </div>
  );
}
