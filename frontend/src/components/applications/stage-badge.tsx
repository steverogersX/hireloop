import { Badge } from "@/components/ui/badge";
import type { ApplicationStage } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const stageTone: Record<ApplicationStage, string> = {
  Applied: "bg-muted text-muted-foreground",
  Screening: "bg-chart-3/12 text-chart-3",
  Interview: "bg-chart-2/15 text-chart-2",
  Offer: "bg-chart-5/12 text-chart-5",
  Rejected: "bg-destructive/10 text-destructive",
};

export const stageDot: Record<ApplicationStage, string> = {
  Applied: "bg-muted-foreground/50",
  Screening: "bg-chart-3",
  Interview: "bg-chart-2",
  Offer: "bg-chart-5",
  Rejected: "bg-destructive",
};

export function StageBadge({
  stage,
  className,
}: {
  stage: ApplicationStage;
  className?: string;
}) {
  return <Badge className={cn(stageTone[stage], className)}>{stage}</Badge>;
}
