import Link from "next/link";
import {
  ArrowRight,
  Bell,
  CircleCheck,
  Handshake,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  Sparkles,
  Video,
} from "lucide-react";

import { MatchRing } from "@/components/dashboard/match-ring";
import {
  AlertToggle,
  InterviewActions,
  InterviewCalendarButton,
} from "@/components/dashboard/panel-controls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  dayLabel,
  initialsOf,
  logoClass,
  relativeTime,
  timeLabel,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import type {
  ActivityItem,
  InterviewWithContext,
  JobAlert,
  ProfilePayload,
} from "@/types/api";

export function ProfileStrengthCard({ profile }: { profile: ProfilePayload }) {
  const gaps = profile.strength.gaps.slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile strength</CardTitle>
        <CardDescription>
          Stronger profiles surface higher in recruiter search.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="flex items-center gap-3">
          <MatchRing score={profile.strength.score} size={64} label="ready" />
          <p className="text-sm text-muted-foreground">
            {gaps.length === 0
              ? "Your profile is complete."
              : `${gaps.length} step${gaps.length === 1 ? "" : "s"} left. Each one lifts how often you appear in search.`}
          </p>
        </div>

        <ul className="grid gap-1.5">
          {gaps.map((gap) => (
            <li key={gap.label}>
              <Link
                href="/profile"
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <Plus className="size-3.5 text-muted-foreground" />
                <span className="flex-1">{gap.label}</span>
                <span className="font-mono text-xs text-chart-5">
                  +{gap.weight}%
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href="/profile">Finish profile</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

const modeIcon = { VIDEO: Video, PHONE: Phone, ONSITE: Handshake } as const;

export function InterviewsCard({
  interviews,
}: {
  interviews: InterviewWithContext[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming interviews</CardTitle>
        <CardDescription>Next 30 days</CardDescription>
        <CardAction>
          <InterviewCalendarButton count={interviews.length} />
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-3">
        {interviews.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nothing scheduled. Interviews appear here once a company books one.
          </p>
        )}

        {interviews.map((interview, index) => {
          const Icon = modeIcon[interview.mode];
          const company = interview.application.job.company;

          return (
            <div key={interview.id} className="grid gap-2">
              {index > 0 && <Separator />}
              <div className="flex items-start gap-2.5">
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg font-heading text-xs font-semibold",
                    logoClass(company.id)
                  )}
                  aria-hidden
                >
                  {initialsOf(company.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{interview.round}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {interview.application.job.title} · {company.name}
                  </p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-xs text-foreground tabular-nums">
                    {dayLabel(interview.scheduledAt)} ·{" "}
                    {timeLabel(interview.scheduledAt)}
                    <span className="text-muted-foreground">
                      {interview.durationMins} min
                    </span>
                  </p>
                  {interview.interviewerName && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Icon className="size-3.5" />
                      {interview.interviewerName} · {interview.interviewerTitle}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 pl-11.5">
                {interview.status === "CONFIRMED" ? (
                  <Badge className="bg-chart-5/12 text-chart-5">
                    <CircleCheck />
                    Confirmed
                  </Badge>
                ) : (
                  <Badge className="bg-chart-2/15 text-chart-2">Awaiting you</Badge>
                )}
                <InterviewActions
                  round={interview.round}
                  company={company.name}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export function AlertsCard({ alerts }: { alerts: JobAlert[] }) {
  const newRoles = alerts
    .filter((alert) => alert.active)
    .reduce((sum, alert) => sum + alert.newCount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job alerts</CardTitle>
        <CardDescription>{newRoles} new roles since Monday</CardDescription>
        <CardAction>
          <Button variant="ghost" size="icon-sm" aria-label="Create alert" asChild>
            <Link href="/alerts">
              <Plus />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-2.5">
        {alerts.slice(0, 4).map((alert) => (
          <div key={alert.id} className="flex items-start gap-2.5">
            <Bell className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{alert.query}</p>
              <p className="truncate text-xs text-muted-foreground">
                {alert.location ?? "Anywhere"} · {alert.frequency.toLowerCase()}
              </p>
            </div>
            {alert.newCount > 0 && (
              <Badge variant="secondary" className="font-mono">
                {alert.newCount} new
              </Badge>
            )}
            <AlertToggle id={alert.id} query={alert.query} active={alert.active} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

const activityIcon = {
  VIEW: Sparkles,
  STAGE: ArrowRight,
  MESSAGE: MessageSquare,
  MATCH: Sparkles,
  INVITE: Mail,
} as const;

export function ActivityCard({ activity }: { activity: ActivityItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>What happened while you were away</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {activity.map((item) => {
          const Icon = activityIcon[item.kind];
          return (
            <div key={item.id} className="flex items-start gap-2.5">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Icon className="size-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-snug">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.detail}</p>
              </div>
              <span className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
                {relativeTime(item.createdAt)}
              </span>
            </div>
          );
        })}
        <Button variant="ghost" size="sm" className="w-full" asChild>
          <Link href="/applications">View all activity</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
