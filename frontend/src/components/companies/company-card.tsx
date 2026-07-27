"use client";

import Link from "next/link";
import { ArrowUpRight, Briefcase, MapPin, Star, Users } from "lucide-react";

import { FollowButton } from "@/components/companies/follow-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { companyHref, type DirectoryEntry } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function CompanyCard({ entry }: { entry: DirectoryEntry }) {
  const { company, culture, openRoles, topSkills } = entry;

  return (
    <Card className="group transition-shadow hover:ring-foreground/20">
      <CardContent className="flex h-full flex-col gap-3">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-xl font-heading text-sm font-semibold",
              company.logoClass
            )}
            aria-hidden
          >
            {company.initials}
          </span>
          <div className="min-w-0 flex-1">
            <Link
              href={companyHref(company)}
              className="rounded-sm font-heading text-base font-medium hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              {company.name}
            </Link>
            <p className="truncate text-xs text-muted-foreground">
              {culture.tagline}
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 font-mono text-xs tabular-nums">
            <Star className="size-3.5 fill-chart-2 text-chart-2" />
            {company.rating}
          </span>
        </div>

        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Briefcase className="size-3.5" />
            {company.industry}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" />
            {company.hq}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="size-3.5" />
            {company.size}
          </span>
        </p>

        <div className="flex flex-wrap gap-1.5">
          {topSkills.map((skill) => (
            <Badge key={skill} variant="outline">
              {skill}
            </Badge>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t pt-3">
          <Badge className="bg-chart-5/12 text-chart-5">
            {openRoles} open {openRoles === 1 ? "role" : "roles"}
          </Badge>
          <div className="flex items-center gap-1.5">
            <FollowButton companyName={company.name} size="sm" />
            <Button variant="outline" size="sm" asChild>
              <Link href={companyHref(company)}>
                View profile
                <ArrowUpRight data-icon="inline-end" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
