import type { ProcessStep } from "@/lib/mock-data";

export function HiringProcess({ steps }: { steps: ProcessStep[] }) {
  return (
    <ol className="grid gap-4">
      {steps.map((step, index) => (
        <li key={step.step} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-medium text-primary tabular-nums">
              {index + 1}
            </span>
            {index < steps.length - 1 && (
              <span className="mt-1 w-px flex-1 bg-border" />
            )}
          </div>
          <div className="pb-1">
            <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
              {step.step}
              <span className="font-mono text-xs font-normal text-muted-foreground">
                {step.duration}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">{step.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
