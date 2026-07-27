"use client";

import Link from "next/link";
import { CalendarClock } from "lucide-react";

import { stageDot } from "@/components/applications/stage-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  applicationStages,
  jobForApplication,
  jobHref,
  type Application,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function ApplicationBoard({ items }: { items: Application[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      {applicationStages.map((stage) => {
        const column = items.filter((item) => item.stage === stage);

        return (
          <section key={stage} className="grid content-start gap-2">
            <header className="flex items-center gap-2 px-1">
              <span
                className={cn("size-2 rounded-full", stageDot[stage])}
                aria-hidden
              />
              <h2 className="text-sm font-medium">{stage}</h2>
              <span className="ml-auto font-mono text-xs text-muted-foreground tabular-nums">
                {column.length}
              </span>
            </header>

            {column.length === 0 ? (
              <p className="rounded-xl border border-dashed px-3 py-6 text-center text-xs text-muted-foreground">
                Nothing here
              </p>
            ) : (
              column.map((item) => {
                const job = jobForApplication(item);

                return (
                  <Card key={item.id} size="sm">
                    <CardContent className="grid gap-2">
                      <div className="flex items-start gap-2">
                        <span
                          className={cn(
                            "flex size-7 shrink-0 items-center justify-center rounded-md font-heading text-[10px] font-semibold",
                            item.company.logoClass
                          )}
                          aria-hidden
                        >
                          {item.company.initials}
                        </span>
                        <div className="min-w-0 flex-1">
                          {job ? (
                            <Link
                              href={jobHref(job)}
                              className="block truncate rounded-sm text-sm font-medium hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                            >
                              {item.jobTitle}
                            </Link>
                          ) : (
                            <p className="truncate text-sm font-medium">
                              {item.jobTitle}
                            </p>
                          )}
                          <p className="truncate text-xs text-muted-foreground">
                            {item.company.name}
                          </p>
                        </div>
                      </div>

                      <Progress value={item.progress} />

                      <p className="text-xs text-muted-foreground">
                        {item.lastUpdate}
                      </p>

                      <p className="flex items-start gap-1.5 text-xs">
                        <CalendarClock className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {item.nextStep}
                        </span>
                      </p>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </section>
        );
      })}
    </div>
  );
}
