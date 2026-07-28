import { ArrowUpRight, Minus } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { DashboardStats } from "@/types/api";

export function StatCards({ stats }: { stats: DashboardStats }) {
  const tiles = [
    {
      id: "applications",
      label: "Applications sent",
      value: stats.applications.total,
      delta: `+${stats.applications.lastThirtyDays}`,
      deltaLabel: "in the last 30 days",
      trend: stats.applications.lastThirtyDays > 0 ? "up" : "flat",
      hint: `${stats.applications.open} still open`,
    },
    {
      id: "review",
      label: "In review",
      value: stats.inReview,
      delta: `${stats.inReview}`,
      deltaLabel: "moved forward",
      trend: stats.inReview > 0 ? "up" : "flat",
      hint: `${stats.offers} offer${stats.offers === 1 ? "" : "s"} on the table`,
    },
    {
      id: "interviews",
      label: "Interviews",
      value: stats.interviews,
      delta: `${stats.interviews}`,
      deltaLabel: "in your pipeline",
      trend: "flat",
      hint: `${stats.unreadMessages} unread message${stats.unreadMessages === 1 ? "" : "s"}`,
    },
    {
      id: "views",
      label: "Profile views",
      value: stats.profileViews,
      delta: `${stats.following}`,
      deltaLabel: "companies followed",
      trend: "up",
      hint: `${stats.activeAlerts} active alert${stats.activeAlerts === 1 ? "" : "s"}`,
    },
  ] as const;

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {tiles.map((stat) => (
        <Card key={stat.id} size="sm">
          <CardContent className="grid gap-2">
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {stat.label}
              </span>
              <span
                className={
                  stat.trend === "up"
                    ? "inline-flex items-center gap-0.5 rounded-md bg-chart-5/12 px-1.5 py-0.5 font-mono text-xs text-chart-5"
                    : "inline-flex items-center gap-0.5 rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground"
                }
              >
                {stat.trend === "up" ? (
                  <ArrowUpRight className="size-3" />
                ) : (
                  <Minus className="size-3" />
                )}
                {stat.delta}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-3xl leading-none font-semibold tabular-nums">
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground">
                {stat.deltaLabel}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{stat.hint}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
