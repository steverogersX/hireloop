import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  Briefcase,
  CalendarClock,
  Globe,
  MapPin,
  Star,
  Users,
} from "lucide-react";

import { CompanyTabs } from "@/components/companies/company-tabs";
import { FollowButton } from "@/components/companies/follow-button";
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
import { initialsOf, logoClass } from "@/lib/format";
import { getCompany, getJobs } from "@/lib/queries";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type CompanyPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata(props: CompanyPageProps) {
  const { slug } = await props.params;
  const company = await getCompany(slug);
  if (!company) return { title: "Company not found — HireLoop" };
  return {
    title: `${company.name} — HireLoop`,
    description: company.profile?.about ?? undefined,
  };
}

export default async function CompanyPage(props: CompanyPageProps) {
  const { slug } = await props.params;
  const company = await getCompany(slug);
  if (!company) notFound();

  const { items: scoredJobs } = await getJobs({ companyId: company.id, limit: 50 });
  const profile = company.profile;

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
            <BreadcrumbLink asChild>
              <Link href="/companies">Companies</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{company.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-start gap-4">
            <span
              className={cn(
                "flex size-16 shrink-0 items-center justify-center rounded-xl font-heading text-xl font-semibold",
                logoClass(company.id)
              )}
              aria-hidden
            >
              {initialsOf(company.name)}
            </span>

            <div className="min-w-0 flex-1">
              <h1 className="font-heading text-2xl leading-tight font-semibold tracking-tight">
                {company.name}
              </h1>
              {profile?.tagline && (
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {profile.tagline}
                </p>
              )}
              <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Briefcase className="size-4" />
                  {company.industry}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4" />
                  {company.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="size-4" />
                  {company.size} employees
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Star className="size-4 fill-chart-2 text-chart-2" />
                  <span className="font-mono tabular-nums">
                    {((profile?.rating ?? 0) / 10).toFixed(1)}
                  </span>
                </span>
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {profile?.funding && (
                  <Badge variant="secondary">{profile.funding}</Badge>
                )}
                {profile?.founded && (
                  <Badge variant="secondary">Founded {profile.founded}</Badge>
                )}
                <Badge className="bg-chart-5/12 text-chart-5">
                  {company.openRoles} open{" "}
                  {company.openRoles === 1 ? "role" : "roles"}
                </Badge>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {company.website && (
                <Button variant="outline" asChild>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <Globe />
                    Website
                    <ArrowUpRight data-icon="inline-end" />
                  </a>
                </Button>
              )}
              <FollowButton
                companyId={company.id}
                companyName={company.name}
                following={company.following}
              />
            </div>
          </div>

          {profile && profile.metrics.length > 0 && (
            <div className="grid gap-3 border-t pt-3 sm:grid-cols-2 xl:grid-cols-4">
              {profile.metrics.map((metric) => (
                <div key={metric.label} className="grid gap-0.5">
                  <span className="text-xs tracking-wide text-muted-foreground uppercase">
                    {metric.label}
                  </span>
                  <span className="font-heading text-xl leading-none font-semibold tabular-nums">
                    {metric.value}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {metric.hint}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="min-w-0">
          <CompanyTabs company={company} openRoles={scoredJobs} />
        </div>

        <aside className="grid gap-4 xl:sticky xl:top-18">
          {company.team.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Who you would meet</CardTitle>
                <CardDescription>The people running their hiring</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                {company.team.map((person) => (
                  <div key={person.id} className="flex items-center gap-2.5">
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-muted text-[11px] font-medium">
                        {initialsOf(person.name)}
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
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/messages">
                    <CalendarClock />
                    Ask a question
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}
