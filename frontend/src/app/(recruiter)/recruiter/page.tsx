import type { Metadata } from "next";
import { Plus, Users } from "lucide-react";

import { HiringStats } from "@/components/recruiter/hiring-stats";
import { PipelinePanel } from "@/components/recruiter/pipeline-panel";
import { RolePerformance } from "@/components/recruiter/role-performance";
import {
  ActivityCard,
  InterviewsCard,
  NeedsAttentionCard,
  SourceMixCard,
  TeamCard,
} from "@/components/recruiter/side-panels";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { recruiter, unreviewedTotal } from "@/lib/recruiter-mock-data";

export const metadata: Metadata = {
  title: "Hiring overview — HireLoop",
  description:
    "Track every open role, applicant and interview across your hiring team.",
};

export default function RecruiterOverviewPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="grid gap-1">
          <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
            Monday, 27 July
          </p>
          <h1 className="font-heading text-2xl leading-tight font-semibold tracking-tight">
            Good morning, {recruiter.firstName}
          </h1>
          <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            Four interviews today and a billing role closing on Friday.
            <Badge variant="outline" className="border-chart-4/40 text-chart-4">
              {unreviewedTotal()} applicants unreviewed
            </Badge>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline">
            <Users />
            Review applicants
          </Button>
          <Button>
            <Plus />
            Post a job
          </Button>
        </div>
      </header>

      <HiringStats />

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="grid min-w-0 gap-4">
          <PipelinePanel />
          <RolePerformance />
        </div>

        <aside className="grid gap-4 xl:sticky xl:top-18">
          <NeedsAttentionCard />
          <InterviewsCard />
          <SourceMixCard />
          <TeamCard />
          <ActivityCard />
        </aside>
      </div>
    </div>
  );
}
