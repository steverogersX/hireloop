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
import { initialsOf, logoClass } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Education, Experience } from "@/types/api";

function period(experience: Experience) {
  const format = (value: string) =>
    new Date(value).toLocaleDateString("en-GB", { month: "short", year: "numeric" });

  return `${format(experience.startDate)} — ${
    experience.current || !experience.endDate ? "present" : format(experience.endDate)
  }`;
}

export function CareerHistory({
  experiences,
  educations,
}: {
  experiences: Experience[];
  educations: Education[];
}) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Experience</CardTitle>
          <CardDescription>
            Recruiters read the top entry first.
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
          {experiences.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No roles yet. Adding your work history lifts your profile score.
            </p>
          )}

          {experiences.map((role) => (
            <div key={role.id} className="flex gap-3">
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-lg font-heading text-xs font-semibold",
                  logoClass(role.id)
                )}
                aria-hidden
              >
                {initialsOf(role.company)}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="flex flex-wrap items-center gap-2 font-medium">
                      {role.role}
                      {role.current && (
                        <Badge className="bg-chart-5/12 text-chart-5">Current</Badge>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {role.company}
                      {role.location ? ` · ${role.location}` : ""}
                    </p>
                    <p className="font-mono text-xs text-muted-foreground tabular-nums">
                      {period(role)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Edit ${role.role} at ${role.company}`}
                    onClick={() =>
                      toast(`Editing ${role.role}`, { description: role.company })
                    }
                  >
                    <Pencil />
                  </Button>
                </div>

                {role.summary && (
                  <p className="mt-2 text-sm text-muted-foreground">{role.summary}</p>
                )}

                {role.highlights.length > 0 && (
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
                )}
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
          {educations.map((entry) => (
            <div key={entry.id} className="flex gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <GraduationCap className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{entry.school}</p>
                <p className="text-sm text-muted-foreground">{entry.degree}</p>
                <p className="font-mono text-xs text-muted-foreground tabular-nums">
                  {entry.startYear} — {entry.endYear}
                </p>
                {entry.detail && (
                  <p className="mt-1 text-sm text-muted-foreground">{entry.detail}</p>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
