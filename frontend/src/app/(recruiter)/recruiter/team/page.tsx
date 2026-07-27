import type { Metadata } from "next";
import Link from "next/link";
import { Clock3, Mail, MoreHorizontal, Users } from "lucide-react";

import { ActionButton } from "@/components/recruiter/action-button";
import { InviteDialog } from "@/components/recruiter/invite-dialog";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  billing,
  employer,
  invites,
  team,
  teamRoles,
} from "@/lib/recruiter-mock-data";

export const metadata: Metadata = {
  title: "Team — HireLoop",
  description: "Who can see and act on your hiring pipelines.",
};

const roleTone: Record<string, string> = {
  Admin: "bg-primary/12 text-primary",
  Recruiter: "bg-chart-3/12 text-chart-3",
  Interviewer: "bg-muted text-muted-foreground",
};

export default function TeamPage() {
  const seatShare = (billing.seatsUsed / billing.seatsTotal) * 100;

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
            <BreadcrumbPage>Team</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="grid gap-1">
          <h1 className="font-heading text-2xl leading-tight font-semibold tracking-tight">
            Team
          </h1>
          <p className="text-sm text-muted-foreground">
            {team.length} people with access · {invites.length} invites pending
          </p>
        </div>

        <InviteDialog />
      </header>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="grid min-w-0 gap-4">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Members</CardTitle>
              <CardDescription>
                Everyone who can see candidates in this workspace
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {team.map((member, index) => (
                <div key={member.id} className="grid gap-3">
                  {index > 0 && <Separator />}
                  <div className="flex flex-wrap items-center gap-3">
                    <Avatar className="size-10">
                      <AvatarFallback
                        className={cn(
                          "text-sm font-medium",
                          member.avatarClass
                        )}
                      >
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-40 flex-1">
                      <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                        {member.name}
                        <Badge
                          className={
                            roleTone[
                              teamRoles[member.id as keyof typeof teamRoles]
                            ]
                          }
                        >
                          {teamRoles[member.id as keyof typeof teamRoles]}
                        </Badge>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {member.title}
                      </p>
                    </div>

                    <div className="grid gap-0.5">
                      <span className="text-xs text-muted-foreground">
                        Open roles
                      </span>
                      <span className="font-mono text-sm tabular-nums">
                        {member.openRoles}
                      </span>
                    </div>

                    <div className="grid gap-0.5">
                      <span className="text-xs text-muted-foreground">
                        Awaiting review
                      </span>
                      <span className="font-mono text-sm tabular-nums">
                        {member.awaitingReview}
                      </span>
                    </div>

                    <div className="grid gap-0.5">
                      <span className="text-xs text-muted-foreground">
                        Median reply
                      </span>
                      <span className="font-mono text-sm tabular-nums">
                        {member.medianReply}
                      </span>
                    </div>

                    <ActionButton
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Manage ${member.name}`}
                      className="ml-auto"
                      message={`Manage ${member.name}`}
                      description={`Change their role or remove them from ${employer.name}.`}
                    >
                      <MoreHorizontal />
                    </ActionButton>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <CardTitle>Pending invites</CardTitle>
              <CardDescription>
                They join as soon as they accept
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              {invites.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No invites outstanding.
                </p>
              ) : (
                invites.map((invite) => (
                  <div
                    key={invite.id}
                    className="flex flex-wrap items-center gap-3 rounded-lg border p-3"
                  >
                    <Mail className="size-4 shrink-0 text-muted-foreground" />
                    <span className="min-w-40 flex-1 truncate text-sm">
                      {invite.email}
                    </span>
                    <Badge className={roleTone[invite.role]}>
                      {invite.role}
                    </Badge>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock3 className="size-3.5" />
                      Sent {invite.sentAgo}
                    </span>
                    <div className="ml-auto flex items-center gap-1.5">
                      <ActionButton
                        variant="ghost"
                        size="sm"
                        tone="success"
                        message="Invite resent"
                        description={`A new link is on its way to ${invite.email}.`}
                      >
                        Resend
                      </ActionButton>
                      <ActionButton
                        variant="ghost"
                        size="sm"
                        message="Invite revoked"
                        description={`${invite.email} can no longer join.`}
                      >
                        Revoke
                      </ActionButton>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="grid gap-4 xl:sticky xl:top-18">
          <Card>
            <CardHeader>
              <CardTitle>Seats</CardTitle>
              <CardDescription>
                {billing.seatsUsed} of {billing.seatsTotal} in use on{" "}
                {billing.plan}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Progress value={seatShare} />
              <p className="text-sm text-muted-foreground">
                {billing.seatsTotal - billing.seatsUsed} seats left. Interviewers
                do not use a seat until they accept.
              </p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/recruiter/settings">
                  <Users />
                  Add seats
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What each role can do</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div className="grid gap-0.5">
                <span className="font-medium">Admin</span>
                <span className="text-muted-foreground">
                  Everything, including billing, seats and deleting postings.
                </span>
              </div>
              <Separator />
              <div className="grid gap-0.5">
                <span className="font-medium">Recruiter</span>
                <span className="text-muted-foreground">
                  Create postings, move candidates, message applicants.
                </span>
              </div>
              <Separator />
              <div className="grid gap-0.5">
                <span className="font-medium">Interviewer</span>
                <span className="text-muted-foreground">
                  Sees only candidates on their panels. Submits scorecards.
                </span>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
