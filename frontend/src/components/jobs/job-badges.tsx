import { Check, Flame, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function AppliedBadge() {
  return (
    <Badge variant="outline" className="text-muted-foreground">
      <Check />
      Applied
    </Badge>
  );
}

export function QuickApplyBadge({ label = "Quick apply" }: { label?: string }) {
  return (
    <Badge className="bg-chart-2/15 text-chart-2">
      <Zap />
      {label}
    </Badge>
  );
}

export function UrgentBadge() {
  return (
    <Badge className="bg-chart-4/12 text-chart-4">
      <Flame />
      Hiring fast
    </Badge>
  );
}
