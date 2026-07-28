import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";

import { AlertsManager } from "@/components/alerts/alerts-manager";
import { MatchRing } from "@/components/dashboard/match-ring";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatSalary, initialsOf, jobHref, logoClass } from "@/lib/format";
import { getAlerts, getJobs } from "@/lib/queries";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Job alerts — HireLoop",
  description:
    "Set up alerts so matching roles reach you the morning they are posted.",
};

export default async function AlertsPage() {
  const [alerts, { items: jobs }] = await Promise.all([
    getAlerts(),
    getJobs({ sort: "match", limit: 4 }),
  ]);

  const totalNew = alerts
    .filter((alert) => alert.active)
    .reduce((sum, alert) => sum + alert.newCount, 0);

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
            <BreadcrumbPage>Job alerts</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="grid gap-1">
        <h1 className="font-heading text-2xl leading-tight font-semibold tracking-tight">
          Job alerts
        </h1>
        <p className="text-sm text-muted-foreground">
          <span className="font-mono text-foreground tabular-nums">{totalNew}</span>{" "}
          new roles arrived from your alerts recently.
        </p>
      </header>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="min-w-0">
          <AlertsManager alerts={alerts} />
        </div>

        <aside className="grid gap-4 xl:sticky xl:top-18">
          <Card>
            <CardHeader>
              <CardTitle>Latest from your alerts</CardTitle>
              <CardDescription>Highest scoring roles this week</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-1">
              {jobs.map((job) => (
                <Link
                  key={job.id}
                  href={jobHref(job)}
                  className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-lg font-heading text-xs font-semibold",
                      logoClass(job.company.id)
                    )}
                    aria-hidden
                  >
                    {initialsOf(job.company.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{job.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {job.company.name} · {formatSalary(job)}
                    </p>
                  </div>
                  <MatchRing score={job.match.score} size={32} />
                </Link>
              ))}
              <Button variant="ghost" size="sm" className="mt-1 w-full" asChild>
                <Link href="/jobs">See all matching roles</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alerts that work</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2.5 text-sm text-muted-foreground">
              <p className="flex items-start gap-2">
                <Sparkles className="mt-0.5 size-3.5 shrink-0 text-chart-2" />
                Narrow alerts beat broad ones. Two specific alerts get read; one
                catch-all gets ignored.
              </p>
              <p className="flex items-start gap-2">
                <Sparkles className="mt-0.5 size-3.5 shrink-0 text-chart-2" />
                Instant alerts matter for roles with few applicants — being early is
                most of the advantage.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
