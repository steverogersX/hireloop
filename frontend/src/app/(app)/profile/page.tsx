import type { Metadata } from "next";
import Link from "next/link";

import { ProfileStrengthCard } from "@/components/dashboard/side-panels";
import { CareerHistory } from "@/components/profile/career-history";
import { ProfileHeaderActions } from "@/components/profile/profile-header-actions";
import { ProfileForm } from "@/components/profile/profile-form";
import { ResumeFiles } from "@/components/profile/resume-files";
import { VisibilityCard } from "@/components/profile/visibility-card";
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
import { candidate } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Profile & resume — HireLoop",
  description:
    "Keep your profile, resume and job preferences current so the right roles find you.",
};

export default function ProfilePage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Overview</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Profile & resume</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="grid gap-1">
          <h1 className="font-heading text-2xl leading-tight font-semibold tracking-tight">
            Profile & resume
          </h1>
          <p className="text-sm text-muted-foreground">
            218 recruiters viewed this profile in the last 30 days. Three gaps
            are holding your score at {candidate.profileStrength}%.
          </p>
        </div>
        <ProfileHeaderActions />
      </header>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="grid min-w-0 gap-4">
          <ProfileForm />
          <ResumeFiles />
          <CareerHistory />
        </div>

        <aside className="grid gap-4 xl:sticky xl:top-18">
          <ProfileStrengthCard />
          <VisibilityCard />

          <Card>
            <CardHeader>
              <CardTitle>Languages</CardTitle>
              <CardDescription>
                Shown on roles that ask for them
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              {candidate.languages.map((language) => (
                <div
                  key={language.name}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  <span>{language.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {language.level}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
