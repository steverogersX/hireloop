import Link from "next/link";
import { CircleCheck } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-[1fr_minmax(0,28rem)]">
      <aside className="relative hidden flex-col justify-between bg-sidebar p-10 lg:flex">
        <Link href="/" className="flex items-center gap-2.5 w-fit">
          <span className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <LoopMark />
          </span>
          <span className="font-heading text-base font-semibold tracking-tight">
            HireLoop
          </span>
        </Link>

        <div className="grid max-w-md gap-6">
          <p className="font-heading text-3xl leading-tight font-semibold tracking-tight">
            Every role scored against your profile, not your job title.
          </p>
          <ul className="grid gap-3 text-sm text-muted-foreground">
            {[
              "A loop score on every role, with the reasoning shown",
              "One pipeline for applications, interviews and offers",
              "Alerts that reach you the morning a role is posted",
            ].map((line) => (
              <li key={line} className="flex items-start gap-2.5">
                <CircleCheck className="mt-0.5 size-4 shrink-0 text-chart-5" />
                {line}
              </li>
            ))}
          </ul>
        </div>

        <p className="font-mono text-xs text-muted-foreground">
          Trusted by teams hiring across 19 cities
        </p>
      </aside>

      <main className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}

function LoopMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.1}
      strokeLinecap="round"
      className="size-4"
      aria-hidden
    >
      <path d="M8.5 15.5a4.5 4.5 0 1 1 0-7h7a4.5 4.5 0 1 1 0 7" />
      <path d="M15.5 12h-7" />
    </svg>
  );
}
