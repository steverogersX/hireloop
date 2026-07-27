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
import {
  allCompanySlugs,
  companyHref,
  getCompanyBySlug,
  similarCompanies,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type CompanyPageProps = { params: Promise<{ slug: string }> };

// Every profile is prerendered, so an unlisted slug is a real 404. Without this
// the loading shell streams first and the response is stuck at 200.
export const dynamicParams = false;

export function generateStaticParams() {
  return allCompanySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(props: CompanyPageProps) {
  const { slug } = await props.params;
  const result = getCompanyBySlug(slug);
  if (!result) return { title: "Company not found — HireLoop" };
  return {
    title: `${result.company.name} — HireLoop`,
    description: result.profile.about,
  };
}

export default async function CompanyPage(props: CompanyPageProps) {
  const { slug } = await props.params;
  const result = getCompanyBySlug(slug);
  if (!result) notFound();

  const { company, profile, culture, openRoles, techStack } = result;
  const similar = similarCompanies(company);

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
                company.logoClass
              )}
              aria-hidden
            >
              {company.initials}
            </span>

            <div className="min-w-0 flex-1">
              <h1 className="font-heading text-2xl leading-tight font-semibold tracking-tight">
                {company.name}
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {culture.tagline}
              </p>
              <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Briefcase className="size-4" />
                  {company.industry}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4" />
                  {company.hq}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="size-4" />
                  {company.size} employees
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Star className="size-4 fill-chart-2 text-chart-2" />
                  <span className="font-mono tabular-nums">
                    {company.rating}
                  </span>
                </span>
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Badge variant="secondary">{company.funding}</Badge>
                <Badge variant="secondary">Founded {profile.founded}</Badge>
                <Badge className="bg-chart-5/12 text-chart-5">
                  {openRoles.length} open{" "}
                  {openRoles.length === 1 ? "role" : "roles"}
                </Badge>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" asChild>
                <a
                  href={`https://${profile.website}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <Globe />
                  {profile.website}
                  <ArrowUpRight data-icon="inline-end" />
                </a>
              </Button>
              <FollowButton companyName={company.name} />
            </div>
          </div>

          <div className="grid gap-3 border-t pt-3 sm:grid-cols-2 xl:grid-cols-4">
            {culture.metrics.map((metric) => (
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
        </CardContent>
      </Card>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="min-w-0">
          <CompanyTabs
            company={company}
            profile={profile}
            culture={culture}
            openRoles={openRoles}
            techStack={techStack}
          />
        </div>

        <aside className="grid gap-4 xl:sticky xl:top-18">
          <Card>
            <CardHeader>
              <CardTitle>Who you would meet</CardTitle>
              <CardDescription>
                The people running their hiring
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {profile.team.map((person) => (
                <div key={person.name} className="flex items-center gap-2.5">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-muted text-[11px] font-medium">
                      {person.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {person.name}
                    </p>
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

          <Card>
            <CardHeader>
              <CardTitle>Similar companies</CardTitle>
              <CardDescription>
                Same industry and stage, also hiring
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-1">
              {similar.map((item) => (
                <Link
                  key={item.id}
                  href={companyHref(item)}
                  className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-lg font-heading text-xs font-semibold",
                      item.logoClass
                    )}
                    aria-hidden
                  >
                    {item.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {item.industry} · {item.hq}
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 font-mono text-xs text-muted-foreground tabular-nums">
                    <Star className="size-3 fill-chart-2 text-chart-2" />
                    {item.rating}
                  </span>
                </Link>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
