import { ArrowRight } from "lucide-react";

import { ApplicantsTable } from "@/components/recruiter/applicants-table";
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
import { funnel, unreviewedTotal } from "@/lib/recruiter-mock-data";

export function PipelinePanel() {
  const total = funnel.reduce((sum, step) => sum + step.count, 0);

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Hiring pipeline</CardTitle>
        <CardDescription>
          {total} candidates across 7 open roles · {unreviewedTotal()} waiting on
          a first read
        </CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            All applicants
            <ArrowRight data-icon="inline-end" />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <div className="flex h-2 gap-0.5 overflow-hidden rounded-full">
            {funnel.map((step) => (
              <span
                key={step.stage}
                className={cn("h-full rounded-full", step.tone)}
                style={{ width: `${(step.count / total) * 100}%` }}
                aria-hidden
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            {funnel.map((step) => (
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

        <ApplicantsTable />
      </CardContent>
    </Card>
  );
}
