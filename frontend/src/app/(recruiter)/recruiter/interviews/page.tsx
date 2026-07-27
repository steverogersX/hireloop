import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarPlus,
  CircleCheck,
  Handshake,
  Phone,
  Users,
  Video,
} from "lucide-react";

import { ActionButton } from "@/components/recruiter/action-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { schedule, scheduleByDay } from "@/lib/recruiter-mock-data";

export const metadata: Metadata = {
  title: "Interviews — HireLoop",
  description: "Every scheduled interview across your open roles.",
};

const modeIcon = { Video, Phone, "On-site": Handshake } as const;

export default function InterviewsPage() {
  const days = scheduleByDay();
  const needsPanel = schedule.filter(
    (session) => session.status === "Needs a panel"
  ).length;
  const awaiting = schedule.filter(
    (session) => session.status === "Awaiting candidate"
  ).length;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/recruiter">Overview</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Interviews</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="grid gap-1">
          <h1 className="font-heading text-2xl leading-tight font-semibold tracking-tight">
            Interviews
          </h1>
          <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {schedule.length} sessions this week
            {needsPanel > 0 && (
              <Badge
                variant="outline"
                className="border-chart-4/40 text-chart-4"
              >
                {needsPanel} without a panel
              </Badge>
            )}
            {awaiting > 0 && (
              <Badge
                variant="outline"
                className="border-chart-2/40 text-chart-2"
              >
                {awaiting} awaiting the candidate
              </Badge>
            )}
          </p>
        </div>

        <ActionButton
          tone="success"
          message="Scheduler opened"
          description="Pick a candidate and a panel to book a session."
        >
          <CalendarPlus />
          Schedule interview
        </ActionButton>
      </header>

      <div className="grid gap-4">
        {days.map((group) => (
          <section key={group.day} className="grid gap-2">
            <div className="flex items-baseline gap-2">
              <h2 className="font-heading text-sm font-medium">{group.day}</h2>
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                {group.sessions.length} session
                {group.sessions.length === 1 ? "" : "s"}
              </span>
              <span className="h-px flex-1 bg-border" aria-hidden />
            </div>

            <div className="grid gap-2">
              {group.sessions.map((session) => {
                const Icon = modeIcon[session.mode];
                return (
                  <Card key={session.id} size="sm">
                    <CardContent className="flex flex-wrap items-center gap-3">
                      <div className="grid w-24 shrink-0 gap-0.5">
                        <span className="font-mono text-sm font-medium tabular-nums">
                          {session.time.replace(" CEST", "")}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground tabular-nums">
                          {session.duration}
                        </span>
                      </div>

                      <Avatar className="size-9">
                        <AvatarFallback
                          className={cn(
                            "text-xs font-medium",
                            session.avatarClass
                          )}
                        >
                          {session.initials}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-48 flex-1">
                        <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                          <Link
                            href={`/recruiter/applicants/${session.candidateId}`}
                            className="rounded-sm hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                          >
                            {session.candidate}
                          </Link>
                          <span className="text-xs font-normal text-muted-foreground">
                            {session.round}
                          </span>
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {session.role}
                        </p>
                      </div>

                      <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Icon className="size-3.5" />
                        {session.mode}
                      </p>

                      <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Users className="size-3.5" />
                        {session.panel.join(", ")}
                      </p>

                      {session.status === "Confirmed" ? (
                        <Badge className="bg-chart-5/12 text-chart-5">
                          <CircleCheck />
                          Confirmed
                        </Badge>
                      ) : session.status === "Needs a panel" ? (
                        <Badge className="bg-chart-4/12 text-chart-4">
                          Needs a panel
                        </Badge>
                      ) : (
                        <Badge className="bg-chart-2/15 text-chart-2">
                          Awaiting candidate
                        </Badge>
                      )}

                      <div className="ml-auto flex items-center gap-1.5">
                        <ActionButton
                          variant="ghost"
                          size="sm"
                          message={`Reschedule request sent to ${session.candidate}`}
                        >
                          Reschedule
                        </ActionButton>
                        <ActionButton
                          variant="outline"
                          size="sm"
                          message={`Scorecard opened for ${session.round}`}
                          description={`${session.candidate} · ${session.role}`}
                        >
                          Scorecard
                        </ActionButton>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
