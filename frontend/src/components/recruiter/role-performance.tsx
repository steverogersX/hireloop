import {
  ArrowRight,
  CircleAlert,
  Eye,
  MapPin,
  MessageSquareMore,
  Users,
} from "lucide-react";

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
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  formatBand,
  memberById,
  openPostings,
  statusTone,
} from "@/lib/recruiter-mock-data";

export function RolePerformance() {
  const roles = openPostings();

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Open roles</CardTitle>
        <CardDescription>
          How each posting is converting, newest first
        </CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            All postings
            <ArrowRight data-icon="inline-end" />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="grid gap-3">
        {roles.map((role) => {
          const owner = memberById(role.ownerId);
          const reviewed = role.applicants - role.unreviewed;
          const reviewedShare = role.applicants
            ? (reviewed / role.applicants) * 100
            : 0;

          return (
            <div
              key={role.id}
              className="grid gap-3 rounded-xl border p-3 transition-colors hover:bg-muted/40"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-heading text-sm font-medium">
                      {role.title}
                    </h3>
                    <Badge className={statusTone[role.status]}>
                      {role.status}
                    </Badge>
                    {role.unreviewed > 0 && (
                      <Badge variant="secondary" className="font-mono">
                        {role.unreviewed} unread
                      </Badge>
                    )}
                  </div>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3.5" />
                      {role.location} · {role.workplace}
                    </span>
                    <span className="font-mono tabular-nums">
                      {formatBand(role)}
                    </span>
                    <span>{role.closesIn}</span>
                  </p>
                </div>

                {owner && (
                  <div className="flex items-center gap-2">
                    <Avatar className="size-7">
                      <AvatarFallback
                        className={cn(
                          "text-[10px] font-medium",
                          owner.avatarClass
                        )}
                      >
                        {owner.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">
                      {owner.name}
                    </span>
                  </div>
                )}
              </div>

              {role.attention && (
                <p className="flex items-center gap-1.5 rounded-lg bg-chart-4/10 px-2.5 py-1.5 text-xs text-chart-4">
                  <CircleAlert className="size-3.5 shrink-0" />
                  {role.attention}
                </p>
              )}

              <div className="grid gap-1.5">
                <Progress value={reviewedShare} />
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="inline-flex items-center gap-1">
                      <Users className="size-3.5" />
                      <span className="font-mono text-foreground tabular-nums">
                        {role.applicants}
                      </span>
                      applicants
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Eye className="size-3.5" />
                      <span className="font-mono tabular-nums">
                        {role.views.toLocaleString()}
                      </span>
                      views
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MessageSquareMore className="size-3.5" />
                      <span className="font-mono tabular-nums">
                        {role.interviewing}
                      </span>
                      interviewing
                    </span>
                    <span className="font-mono tabular-nums">
                      {role.conversion}% apply rate
                    </span>
                  </span>
                  <Button variant="ghost" size="xs">
                    Open pipeline
                    <ArrowRight data-icon="inline-end" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
