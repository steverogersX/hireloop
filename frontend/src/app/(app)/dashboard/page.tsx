import Link from "next/link";
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
import {
  getActivity,
  getAlerts,
  getApplications,
  getDashboardStats,
  getInterviews,
  getJobs,
  getProfile,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [stats, profile, applications, jobsResult, interviews, alerts, activity] =
    await Promise.all([
      getDashboardStats(),
      getProfile(),
      getApplications(),
      getJobs({ sort: "match", limit: 40 }),
      getInterviews(),
      getAlerts(),
      getActivity(5),
    ]);

  if (!stats || !profile) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-center">
        <p className="max-w-sm text-sm text-muted-foreground">
          Could not reach the HireLoop API. Start the backend with{" "}
          <span className="font-mono">npm run dev</span> in{" "}
          <span className="font-mono">backend/</span>.
        </p>
      </div>
    );
  }

  const firstName = profile.user.name.split(" ")[0];
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="grid gap-1">
          <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
            {today}
          </p>
          <h1 className="font-heading text-2xl leading-tight font-semibold tracking-tight">
            Good morning, {firstName}
          </h1>
          <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {stats.interviews} interview{stats.interviews === 1 ? "" : "s"} in your
            pipeline and {stats.offers} offer{stats.offers === 1 ? "" : "s"} on the
            table.
            {profile.profile.openToWork && (
              <Badge variant="outline" className="border-chart-5/40 text-chart-5">
                Open to work
                {profile.profile.noticePeriod
                  ? ` · ${profile.profile.noticePeriod} notice`
                  : ""}
              </Badge>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/profile">
              <SlidersHorizontal />
              Job preferences
            </Link>
          </Button>
          <Button asChild>
            <Link href="/jobs">
              <Compass />
              Browse all jobs
            </Link>
          </Button>
        </div>
      </header>

      <StatCards stats={stats} />

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="grid min-w-0 gap-4">
          <ApplicationsPanel applications={applications} stats={stats} />
          <JobFeed jobs={jobsResult.items} />
        </div>

        <aside className="grid gap-4 xl:sticky xl:top-18">
          <ProfileStrengthCard profile={profile} />
          <InterviewsCard interviews={interviews} />
          <AlertsCard alerts={alerts} />
          <ActivityCard activity={activity} />
        </aside>
      </div>
    </div>
  );
}
