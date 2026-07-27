import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Building2, Plus } from "lucide-react";

import { ActionButton } from "@/components/recruiter/action-button";
import { CompanyForm } from "@/components/recruiter/company-form";
import { MatchRing } from "@/components/dashboard/match-ring";
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
import { cn } from "@/lib/utils";
import { companyProfile, employer } from "@/lib/recruiter-mock-data";

export const metadata: Metadata = {
  title: "Company profile — HireLoop",
  description: "Edit what candidates see about your company.",
};

export default function CompanyProfilePage() {
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
            <BreadcrumbPage>Company profile</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-xl font-heading text-base font-semibold",
              employer.logoClass
            )}
            aria-hidden
          >
            {employer.initials}
          </span>
          <div className="grid gap-1">
            <h1 className="font-heading text-2xl leading-tight font-semibold tracking-tight">
              Company profile
            </h1>
            <p className="text-sm text-muted-foreground">
              {employer.name} · {employer.industry} · {employer.hq}
            </p>
          </div>
        </div>

        <Button variant="outline" asChild>
          <Link href="/companies/northwind-labs">
            <Building2 />
            View public profile
            <ArrowUpRight data-icon="inline-end" />
          </Link>
        </Button>
      </header>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="min-w-0">
          <CompanyForm />
        </div>

        <aside className="grid gap-4 xl:sticky xl:top-18">
          <Card>
            <CardHeader>
              <CardTitle>Profile strength</CardTitle>
              <CardDescription>
                Stronger profiles convert more applicants
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="flex items-center gap-3">
                <MatchRing
                  score={companyProfile.profileStrength}
                  size={64}
                  label="complete"
                />
                <p className="text-sm text-muted-foreground">
                  Three things left. Each one lifts how often candidates finish
                  an application.
                </p>
              </div>

              <ul className="grid gap-1.5">
                {companyProfile.profileGaps.map((gap) => (
                  <li key={gap.label}>
                    <ActionButton
                      variant="ghost"
                      className="h-auto w-full justify-start px-2 py-1.5 font-normal"
                      message={gap.label}
                      description={`Completing this lifts your profile strength by ${gap.weight}.`}
                    >
                      <Plus className="size-3.5 text-muted-foreground" />
                      <span className="flex-1 text-left">{gap.label}</span>
                      <span className="font-mono text-xs text-chart-5">
                        {gap.weight}
                      </span>
                    </ActionButton>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How it is performing</CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {companyProfile.metrics.map((metric) => (
                <div key={metric.label} className="grid gap-0.5">
                  <span className="text-xs text-muted-foreground">
                    {metric.label}
                  </span>
                  <span className="font-heading text-lg leading-none font-semibold tabular-nums">
                    {metric.value}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {metric.hint}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Offices</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              {companyProfile.offices.map((office) => (
                <div
                  key={office.city}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  <span>{office.city}</span>
                  <span className="text-xs text-muted-foreground">
                    {office.people}
                  </span>
                </div>
              ))}
              <ActionButton
                variant="outline"
                size="sm"
                className="mt-1 w-full"
                message="Add an office"
                description="Offices appear on your public profile and postings."
              >
                <Plus />
                Add an office
              </ActionButton>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
