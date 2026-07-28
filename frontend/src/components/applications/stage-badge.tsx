import { Badge } from "@/components/ui/badge";
import { statusLabel } from "@/lib/format";
import type { ApplicationStatus } from "@/types/api";
import { cn } from "@/lib/utils";

export const stageTone: Record<ApplicationStatus, string> = {
  APPLIED: "bg-muted text-muted-foreground",
  IN_REVIEW: "bg-chart-3/12 text-chart-3",
  INTERVIEW: "bg-chart-2/15 text-chart-2",
  OFFER: "bg-chart-5/12 text-chart-5",
  REJECTED: "bg-destructive/10 text-destructive",
  WITHDRAWN: "bg-muted text-muted-foreground",
};

export const stageDot: Record<ApplicationStatus, string> = {
  APPLIED: "bg-muted-foreground/50",
  IN_REVIEW: "bg-chart-3",
  INTERVIEW: "bg-chart-2",
  OFFER: "bg-chart-5",
  REJECTED: "bg-destructive",
  WITHDRAWN: "bg-muted-foreground/50",
};

export const BOARD_STAGES: ApplicationStatus[] = [
  "APPLIED",
  "IN_REVIEW",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
];

export function StageBadge({
  stage,
  className,
}: {
  stage: ApplicationStatus;
  className?: string;
}) {
  return (
    <Badge className={cn(stageTone[stage], className)}>{statusLabel[stage]}</Badge>
  );
}
