import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ApplicationsTable } from "@/components/dashboard/applications-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { pipeline } from "@/lib/mock-data";

export function ApplicationsPanel() {
  const total = pipeline.reduce((sum, step) => sum + step.count, 0);

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Your pipeline</CardTitle>
        <CardDescription>
          34 applications since March · 1 offer waiting on you
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
                className={cn("h-full rounded-full", step.tone)}
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
                  className={cn("size-2 self-center rounded-full", step.tone)}
                  aria-hidden
                />
                {step.stage}
                <span className="font-mono text-foreground tabular-nums">
                  {step.count}
                </span>
              </span>
            ))}
          </div>
        </div>

        <ApplicationsTable />
      </CardContent>
    </Card>
  );
}
