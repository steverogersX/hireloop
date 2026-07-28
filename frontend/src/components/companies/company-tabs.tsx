"use client";

import { Building2, Check, MessageSquareQuote, Star } from "lucide-react";
import { toast } from "sonner";

import { HiringProcess } from "@/components/companies/hiring-process";
import { JobsTable } from "@/components/jobs/jobs-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CompanyDetail, ScoredJob } from "@/types/api";

export function CompanyTabs({
  company,
  openRoles,
}: {
  company: CompanyDetail;
  openRoles: ScoredJob[];
}) {
  const profile = company.profile;

  return (
    <Tabs defaultValue="overview" className="gap-3">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="roles">
          Open roles
          <Badge variant="secondary" className="ml-1.5 font-mono">
            {openRoles.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="process">Hiring process</TabsTrigger>
        <TabsTrigger value="reviews">
          Reviews
          <Badge variant="secondary" className="ml-1.5 font-mono">
            {company.reviews.length}
          </Badge>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>About {company.name}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {profile?.about ?? company.description}
            </p>

            {profile && profile.values.length > 0 && (
              <div className="grid gap-2">
                <h2 className="font-heading text-sm font-medium">How they work</h2>
                <div className="grid gap-2 sm:grid-cols-2">
                  {profile.values.map((value) => (
                    <div
                      key={value.title}
                      className="rounded-lg bg-muted/60 p-3 ring-1 ring-foreground/5"
                    >
                      <p className="text-sm font-medium">{value.title}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {value.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {company.techStack.length > 0 && (
              <div className="grid gap-2">
                <h2 className="font-heading text-sm font-medium">
                  Tools across their open roles
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {company.techStack.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          {profile && profile.benefits.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>What they offer</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-2">
                  {profile.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-chart-5" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {profile && profile.offices.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Where they work</CardTitle>
                <CardDescription>Headcount by location</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2.5">
                {profile.offices.map((office) => (
                  <div
                    key={office.city}
                    className="flex items-center justify-between gap-2 text-sm"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Building2 className="size-4 text-muted-foreground" />
                      {office.city}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground tabular-nums">
                      {office.people}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>

      <TabsContent value="roles" className="grid gap-3">
        <p className="text-sm text-muted-foreground">
          <span className="font-mono font-medium text-foreground tabular-nums">
            {openRoles.length}
          </span>{" "}
          {openRoles.length === 1 ? "role is" : "roles are"} open here right now.
          Scores are against your profile.
        </p>
        <JobsTable jobs={openRoles} />
      </TabsContent>

      <TabsContent value="process">
        <Card>
          <CardHeader>
            <CardTitle>How they hire</CardTitle>
            <CardDescription>
              {company.process.length} steps · typically{" "}
              {company.process.at(-1)?.duration?.toLowerCase() ?? "a few weeks"} end
              to end
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HiringProcess steps={company.process} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="reviews" className="grid gap-4">
        {profile && profile.ratingBreakdown.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>How employees rate them</CardTitle>
              <CardDescription>
                Verified reviews from people who worked here
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {profile.ratingBreakdown.map((rating) => (
                <div key={rating.label} className="grid gap-1.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm">{rating.label}</span>
                    <span className="font-mono text-xs text-muted-foreground tabular-nums">
                      {(rating.score / 20).toFixed(1)}
                    </span>
                  </div>
                  <Progress value={rating.score} />
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {company.reviews.length === 0 ? (
          <div className="grid justify-items-center gap-2 rounded-xl border border-dashed px-6 py-12 text-center">
            <MessageSquareQuote className="size-5 text-muted-foreground" />
            <p className="font-heading text-sm font-medium">
              No written reviews yet
            </p>
            <p className="max-w-sm text-sm text-muted-foreground">
              The ratings above come from exit surveys. Worked here? Yours would be
              the first review other candidates read.
            </p>
            <Button
              size="sm"
              className="mt-1"
              onClick={() =>
                toast("Reviews open once you have worked somewhere 90 days", {
                  description: `We will ask you about ${company.name} if you join.`,
                })
              }
            >
              Write a review
            </Button>
          </div>
        ) : (
          company.reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="grid gap-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-heading text-sm font-medium">{review.title}</p>
                  <span
                    className="inline-flex items-center gap-0.5"
                    aria-label={`${review.rating} out of 5`}
                  >
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        className={
                          index < review.rating
                            ? "size-3.5 fill-chart-2 text-chart-2"
                            : "size-3.5 text-muted-foreground/40"
                        }
                      />
                    ))}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{review.body}</p>
                <p className="text-xs text-muted-foreground">
                  {review.roleTitle} · Verified employee
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </TabsContent>
    </Tabs>
  );
}
