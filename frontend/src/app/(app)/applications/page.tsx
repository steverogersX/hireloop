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
import { applicationInsights } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Applications — HireLoop",
  description:
    "Track every application, what stage it is at, and what needs your attention next.",
};

export default function ApplicationsPage() {
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
            Four need your attention: one offer to answer, one take-home due,
            and two with no reply in over three weeks.
          </p>
        </div>
        <ApplicationsActions />
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {applicationInsights.map((insight) => (
          <Card key={insight.label} size="sm">
            <CardContent className="grid gap-1.5">
              <span className="text-xs tracking-wide text-muted-foreground uppercase">
                {insight.label}
              </span>
              <span className="font-heading text-2xl leading-none font-semibold tabular-nums">
                {insight.value}
              </span>
              <span className="text-xs text-muted-foreground">
                {insight.hint}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <ApplicationsBrowser />
    </div>
  );
}
