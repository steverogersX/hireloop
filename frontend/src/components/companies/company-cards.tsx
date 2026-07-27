import { CalendarClock, Check } from "lucide-react";

import { HiringProcess } from "@/components/companies/hiring-process";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ProcessStep, TeamMember } from "@/lib/mock-data";

export function HiringProcessCard({
  steps,
  title = "Hiring process",
}: {
  steps: ProcessStep[];
  title?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {steps.length} steps · typically{" "}
          {steps.at(-1)?.duration.toLowerCase()} end to end
        </CardDescription>
      </CardHeader>
      <CardContent>
        <HiringProcess steps={steps} />
      </CardContent>
    </Card>
  );
}

export function BenefitsCard({
  benefits,
  title,
  columns = 1,
}: {
  benefits: string[];
  title: string;
  columns?: 1 | 2;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className={columns === 2 ? "grid gap-2 sm:grid-cols-2" : "grid gap-2"}>
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 size-4 shrink-0 text-chart-5" />
              <span className="text-muted-foreground">{benefit}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function TeamCard({
  team,
  description,
}: {
  team: TeamMember[];
  description: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Who you would meet</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {team.map((person) => (
          <div key={person.name} className="flex items-center gap-2.5">
            <Avatar className="size-8">
              <AvatarFallback className="bg-muted text-[11px] font-medium">
                {person.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{person.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {person.role}
              </p>
            </div>
          </div>
        ))}
        <Button variant="outline" size="sm" className="w-full">
          <CalendarClock />
          Ask a question
        </Button>
      </CardContent>
    </Card>
  );
}
