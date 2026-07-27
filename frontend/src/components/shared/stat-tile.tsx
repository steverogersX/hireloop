import { ArrowUpRight, Minus } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type StatTileProps = {
  label: string;
  value: React.ReactNode;
  hint?: string;
  delta?: string;
  deltaLabel?: string;
  trend?: "up" | "flat";
};

/** Bare label/value/hint stack — use inside an existing card or header. */
export function StatFigure({
  label,
  value,
  hint,
  delta,
  deltaLabel,
  trend,
  size = "md",
}: StatTileProps & { size?: "sm" | "md" | "lg" }) {
  const valueSize = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  }[size];

  return (
    <div className="grid gap-1.5">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </span>
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-mono text-xs",
              trend === "up"
                ? "bg-chart-5/12 text-chart-5"
                : "bg-muted text-muted-foreground"
            )}
          >
            {trend === "up" ? (
              <ArrowUpRight className="size-3" />
            ) : (
              <Minus className="size-3" />
            )}
            {delta}
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span
          className={cn(
            "font-heading leading-none font-semibold tabular-nums",
            valueSize
          )}
        >
          {value}
        </span>
        {deltaLabel && (
          <span className="text-xs text-muted-foreground">{deltaLabel}</span>
        )}
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function StatTile(props: StatTileProps & { size?: "sm" | "md" | "lg" }) {
  return (
    <Card size="sm">
      <CardContent>
        <StatFigure {...props} />
      </CardContent>
    </Card>
  );
}
