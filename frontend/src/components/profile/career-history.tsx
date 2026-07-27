"use client";

import { GraduationCap, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";

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
import { education, experience } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function CareerHistory() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Experience</CardTitle>
          <CardDescription>
            Eight years, three companies. Recruiters read the top entry first.
          </CardDescription>
          <CardAction>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast("Add a role", {
                  description:
                    "Roles you add show above your current one until you set the dates.",
                })
              }
            >
              <Plus />
              Add role
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="grid gap-4">
          {experience.map((role) => (
            <div key={role.id} className="flex gap-3">
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-lg font-heading text-xs font-semibold",
                  role.logoClass
                )}
                aria-hidden
              >
                {role.initials}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="flex flex-wrap items-center gap-2 font-medium">
                      {role.role}
                      {role.current && (
                        <Badge className="bg-chart-5/12 text-chart-5">
                          Current
                        </Badge>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {role.company} · {role.location}
                    </p>
                    <p className="font-mono text-xs text-muted-foreground tabular-nums">
                      {role.period} · {role.duration}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Edit ${role.role} at ${role.company}`}
                    onClick={() =>
                      toast(`Editing ${role.role}`, {
                        description: role.company,
                      })
                    }
                  >
                    <Pencil />
                  </Button>
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                  {role.summary}
                </p>

                <ul className="mt-2 grid gap-1.5">
                  {role.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
          <CardAction>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast("Add a qualification")}
            >
              <Plus />
              Add
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="grid gap-3">
          {education.map((entry) => (
            <div key={entry.id} className="flex gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <GraduationCap className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{entry.school}</p>
                <p className="text-sm text-muted-foreground">{entry.degree}</p>
                <p className="font-mono text-xs text-muted-foreground tabular-nums">
                  {entry.period}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {entry.detail}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
