import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { applications, pipeline, type ApplicationStage } from "@/lib/mock-data";

const stageTone: Record<ApplicationStage, string> = {
  Applied: "bg-muted text-muted-foreground",
  Screening: "bg-chart-3/12 text-chart-3",
  Interview: "bg-chart-2/15 text-chart-2",
  Offer: "bg-chart-5/12 text-chart-5",
  Rejected: "bg-destructive/10 text-destructive",
};

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
          <Button variant="outline" size="sm">
            All applications
            <ArrowRight data-icon="inline-end" />
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

        <div className="-mx-(--card-spacing) overflow-x-auto">
          <Table className="min-w-[42rem]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-(--card-spacing)">Role</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead className="w-40">Progress</TableHead>
                <TableHead>Next step</TableHead>
                <TableHead className="pr-(--card-spacing) text-right">
                  Applied
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="pl-(--card-spacing)">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          "flex size-7 shrink-0 items-center justify-center rounded-md font-heading text-[11px] font-semibold",
                          application.company.logoClass
                        )}
                        aria-hidden
                      >
                        {application.company.initials}
                      </span>
                      <div className="grid leading-tight">
                        <span className="font-medium">
                          {application.jobTitle}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {application.company.name}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={stageTone[application.stage]}>
                      {application.stage}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Progress value={application.progress} />
                    <span className="mt-1.5 block text-xs text-muted-foreground">
                      {application.lastUpdate}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {application.nextStep}
                  </TableCell>
                  <TableCell className="pr-(--card-spacing) text-right font-mono text-xs text-muted-foreground tabular-nums">
                    {application.appliedOn}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
