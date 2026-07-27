import { cn } from "@/lib/utils";

export function MatchRing({
  score,
  size = 52,
  label = "match",
  className,
}: {
  score: number;
  size?: number;
  label?: string;
  className?: string;
}) {
  const stroke = size >= 48 ? 4 : 3;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;

  const tone =
    score >= 90
      ? "text-chart-5"
      : score >= 80
        ? "text-chart-1"
        : score >= 70
          ? "text-chart-2"
          : "text-muted-foreground";

  return (
    <div
      className={cn("relative shrink-0", tone, className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${score} percent ${label}`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-border"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="stroke-current transition-[stroke-dasharray] duration-700 ease-out"
        />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-mono font-medium tabular-nums text-foreground"
          style={{ fontSize: size * 0.28 }}
        >
          {score}
        </span>
        {size >= 48 && (
          <span className="text-[9px] leading-none tracking-wide text-muted-foreground uppercase">
            {label}
          </span>
        )}
      </span>
    </div>
  );
}
