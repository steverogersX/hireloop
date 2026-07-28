"use client";

import Link from "next/link";
import { CalendarClock } from "lucide-react";

import { BOARD_STAGES, stageDot } from "@/components/applications/stage-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { initialsOf, jobHref, logoClass, statusLabel } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Application } from "@/types/api";

const PROGRESS: Record<string, number> = {
  APPLIED: 15,
  IN_REVIEW: 45,
  INTERVIEW: 70,
  OFFER: 95,
  REJECTED: 100,
  WITHDRAWN: 100,
};

export function ApplicationBoard({ items }: { items: Application[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      {BOARD_STAGES.map((stage) => {
        const column = items.filter((item) => item.status === stage);

        return (
          <section key={stage} className="grid content-start gap-2">
            <header className="flex items-center gap-2 px-1">
              <span
                className={cn("size-2 rounded-full", stageDot[stage])}
                aria-hidden
              />
              <h2 className="text-sm font-medium">{statusLabel[stage]}</h2>
              <span className="ml-auto font-mono text-xs text-muted-foreground tabular-nums">
                {column.length}
              </span>
            </header>

            {column.length === 0 ? (
              <p className="rounded-xl border border-dashed px-3 py-6 text-center text-xs text-muted-foreground">
                Nothing here
              </p>
            ) : (
              column.map((item) => (
                <Card key={item.id} size="sm">
                  <CardContent className="grid gap-2">
                    <div className="flex items-start gap-2">
                      <span
                        className={cn(
                          "flex size-7 shrink-0 items-center justify-center rounded-md font-heading text-[10px] font-semibold",
                          logoClass(item.job.company.id)
                        )}
                        aria-hidden
                      >
                        {initialsOf(item.job.company.name)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <Link
                          href={jobHref(item.job)}
                          className="block truncate rounded-sm text-sm font-medium hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                        >
                          {item.job.title}
                        </Link>
                        <p className="truncate text-xs text-muted-foreground">
                          {item.job.company.name}
                        </p>
                      </div>
                    </div>

                    <Progress value={PROGRESS[item.status] ?? 0} />

                    <p className="text-xs text-muted-foreground">
                      {item.lastUpdate ?? "No updates yet"}
                    </p>

                    {item.nextStep && (
                      <p className="flex items-start gap-1.5 text-xs">
                        <CalendarClock className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {item.nextStep}
                        </span>
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </section>
        );
      })}
    </div>
  );
}

export { PROGRESS as STAGE_PROGRESS };
