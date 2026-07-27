import { Compass, SlidersHorizontal } from "lucide-react";

import { ApplicationsPanel } from "@/components/dashboard/applications-panel";
import { JobFeed } from "@/components/dashboard/job-feed";
import {
  ActivityCard,
  AlertsCard,
  InterviewsCard,
  ProfileStrengthCard,
} from "@/components/dashboard/side-panels";
import { StatCards } from "@/components/dashboard/stat-cards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { candidate } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="grid gap-1">
          <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
            Monday, 27 July
          </p>
          <h1 className="font-heading text-2xl leading-tight font-semibold tracking-tight">
            Good morning, {candidate.firstName}
          </h1>
          <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            Two interviews this week and an offer waiting on your answer.
            {candidate.openToWork && (
              <Badge
                variant="outline"
                className="border-chart-5/40 text-chart-5"
              >
                Open to work · {candidate.noticePeriod} notice
              </Badge>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline">
            <SlidersHorizontal />
            Job preferences
          </Button>
          <Button>
            <Compass />
            Browse all jobs
          </Button>
        </div>
      </header>

      <StatCards />

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="grid min-w-0 gap-4">
          <ApplicationsPanel />
          <JobFeed />
        </div>

        <aside className="grid gap-4 xl:sticky xl:top-18">
          <ProfileStrengthCard />
          <InterviewsCard />
          <AlertsCard />
          <ActivityCard />
        </aside>
      </div>
    </div>
  );
}
