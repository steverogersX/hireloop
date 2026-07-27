import { ArrowUpRight, Minus } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { hiringStats } from "@/lib/recruiter-mock-data";

export function HiringStats() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {hiringStats.map((stat) => (
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
