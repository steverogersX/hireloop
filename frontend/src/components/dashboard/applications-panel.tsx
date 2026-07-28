import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ApplicationsTable } from "@/components/dashboard/applications-table";
import { BOARD_STAGES, stageDot } from "@/components/applications/stage-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { statusLabel } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Application, DashboardStats } from "@/types/api";

export function ApplicationsPanel({
  applications,
  stats,
}: {
  applications: Application[];
  stats: DashboardStats;
}) {
  const pipeline = BOARD_STAGES.map((stage) => ({
    stage,
    count: stats.pipeline[stage] ?? 0,
  }));
  const total = pipeline.reduce((sum, step) => sum + step.count, 0) || 1;

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Your pipeline</CardTitle>
        <CardDescription>
          {stats.applications.total} applications ·{" "}
          {stats.offers > 0
            ? `${stats.offers} offer waiting on you`
            : "no offers yet"}
        </CardDescription>
        <CardAction>
          <Button variant="outline" size="sm" asChild>
            <Link href="/applications">
              All applications
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <div className="flex h-2 gap-0.5 overflow-hidden rounded-full">
            {pipeline.map((step) => (
              <span
                key={step.stage}
                className={cn("h-full rounded-full", stageDot[step.stage])}
                style={{ width: `${(step.count / total) * 100}%` }}
                aria-hidden
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            {pipeline.map((step) => (
              <span
                key={step.stage}
                className="inline-flex items-baseline gap-1.5 text-xs text-muted-foreground"
              >
                <span
                  className={cn("size-2 self-center rounded-full", stageDot[step.stage])}
                  aria-hidden
                />
                {statusLabel[step.stage]}
                <span className="font-mono text-foreground tabular-nums">
                  {step.count}
                </span>
              </span>
            ))}
          </div>
        </div>

        <ApplicationsTable applications={applications} />
      </CardContent>
    </Card>
  );
}
