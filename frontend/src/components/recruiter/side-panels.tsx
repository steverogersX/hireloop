import {
  ArrowRight,
  CalendarPlus,
  CircleCheck,
  Clock3,
  FileText,
  Handshake,
  MessageSquare,
  Phone,
  Send,
  Sparkles,
  UserPlus,
  Video,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { cn } from "@/lib/utils";
import {
  employer,
  postingsNeedingAttention,
  recruiterActivity,
  sourceMix,
  team,
  todaysInterviews,
} from "@/lib/recruiter-mock-data";

const modeIcon = { Video, Phone, "On-site": Handshake } as const;

export function InterviewsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview schedule</CardTitle>
        <CardDescription>Today and tomorrow</CardDescription>
        <CardAction>
          <Button variant="ghost" size="icon-sm" aria-label="Schedule interview">
            <CalendarPlus />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-3">
        {todaysInterviews.map((interview, index) => {
          const Icon = modeIcon[interview.mode];
          return (
            <div key={interview.id} className="grid gap-2">
              {index > 0 && <Separator />}
              <div className="flex items-start gap-2.5">
                <Avatar className="size-9">
                  <AvatarFallback
                    className={cn(
                      "text-xs font-medium",
                      interview.avatarClass
                    )}
                  >
                    {interview.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{interview.candidate}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {interview.round} · {interview.role}
                  </p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-xs text-foreground tabular-nums">
                    {interview.day} · {interview.time}
                    <span className="text-muted-foreground">
                      {interview.duration}
                    </span>
                  </p>
                  <p className="mt-1 flex items-center gap-1 truncate text-xs text-muted-foreground">
                    <Icon className="size-3.5 shrink-0" />
                    {interview.panel.join(", ")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 pl-11.5">
                {interview.status === "Confirmed" ? (
                  <Badge className="bg-chart-5/12 text-chart-5">
                    <CircleCheck />
                    Confirmed
                  </Badge>
                ) : interview.status === "Needs a panel" ? (
                  <Badge className="bg-chart-4/12 text-chart-4">
                    Needs a panel
                  </Badge>
                ) : (
                  <Badge className="bg-chart-2/15 text-chart-2">
                    Awaiting candidate
                  </Badge>
                )}
                <Button variant="ghost" size="xs" className="ml-auto">
                  Reschedule
                </Button>
                <Button size="xs">Scorecard</Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export function NeedsAttentionCard() {
  const roles = postingsNeedingAttention();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Needs you today</CardTitle>
        <CardDescription>
          {roles.length} postings are stuck without a decision
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-1">
        {roles.map((role) => (
          <button
            key={role.id}
            type="button"
            className="flex w-full items-start gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <Clock3 className="mt-0.5 size-4 shrink-0 text-chart-4" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">
                {role.title}
              </span>
              <span className="block text-xs text-muted-foreground">
                {role.attention}
              </span>
            </span>
            <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
          </button>
        ))}
      </CardContent>
    </Card>
  );
}

export function SourceMixCard() {
  const total = sourceMix.reduce((sum, entry) => sum + entry.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Where applicants come from</CardTitle>
        <CardDescription>Last 30 days · {total} applications</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="flex h-2 gap-0.5 overflow-hidden rounded-full">
          {sourceMix.map((entry) => (
            <span
              key={entry.source}
              className={cn("h-full rounded-full", entry.tone)}
              style={{ width: `${(entry.count / total) * 100}%` }}
              aria-hidden
            />
          ))}
        </div>
        <ul className="grid gap-1.5">
          {sourceMix.map((entry) => (
            <li
              key={entry.source}
              className="flex items-center gap-2 text-sm"
            >
              <span
                className={cn("size-2 shrink-0 rounded-full", entry.tone)}
                aria-hidden
              />
              <span className="flex-1">{entry.source}</span>
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                {Math.round((entry.count / total) * 100)}%
              </span>
              <span className="w-8 text-right font-mono text-xs tabular-nums">
                {entry.count}
              </span>
            </li>
          ))}
        </ul>
        <Button variant="outline" size="sm" className="w-full">
          <Sparkles />
          Source more candidates
        </Button>
      </CardContent>
    </Card>
  );
}

export function TeamCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your hiring team</CardTitle>
        <CardDescription>
          {employer.seatsUsed} of {employer.seatsTotal} seats in use
        </CardDescription>
        <CardAction>
          <Button variant="ghost" size="icon-sm" aria-label="Invite a teammate">
            <UserPlus />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-3">
        {team.map((member) => (
          <div key={member.id} className="flex items-center gap-2.5">
            <Avatar className="size-8">
              <AvatarFallback
                className={cn("text-[11px] font-medium", member.avatarClass)}
              >
                {member.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{member.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {member.openRoles} roles · replies in {member.medianReply}
              </p>
            </div>
            {member.awaitingReview > 0 && (
              <Badge variant="secondary" className="font-mono">
                {member.awaitingReview}
              </Badge>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

const activityIcon = {
  applied: FileText,
  stage: ArrowRight,
  message: MessageSquare,
  offer: Send,
  posting: Sparkles,
} as const;

export function ActivityCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>Across every role you own</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {recruiterActivity.map((item) => {
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
                {item.time}
              </span>
            </div>
          );
        })}
        <Button variant="ghost" size="sm" className="w-full">
          View all activity
        </Button>
      </CardContent>
    </Card>
  );
}
