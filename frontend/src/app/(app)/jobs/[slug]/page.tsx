import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  Building2,
  CalendarClock,
  Check,
  Clock3,
  Eye,
  Globe,
  MapPin,
  Star,
  Users,
} from "lucide-react";

import { HiringProcess } from "@/components/companies/hiring-process";
import {
  JobActions,
  ReportListingButton,
  StickyApplyBar,
} from "@/components/jobs/job-actions";
import { MatchRing } from "@/components/dashboard/match-ring";
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
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  companyHref,
  employmentLabel,
  experienceLabel,
  formatSalary,
  initialsOf,
  jobHref,
  logoClass,
  relativeTime,
  respondsIn,
  workModeLabel,
} from "@/lib/format";
import { getJob, getSimilarJobs } from "@/lib/queries";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type JobPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata(props: JobPageProps) {
  const { slug } = await props.params;
  const job = await getJob(slug);
  if (!job) return { title: "Role not found — HireLoop" };
  return {
    title: `${job.title} at ${job.company.name} — HireLoop`,
    description: job.summary ?? undefined,
  };
}

export default async function JobPage(props: JobPageProps) {
  const { slug } = await props.params;
  const job = await getJob(slug);
  if (!job) notFound();

  const similar = await getSimilarJobs(slug);
  const company = job.company;
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
              <Link href="/jobs">Find jobs</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{job.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-start gap-4">
            <span
              className={cn(
                "flex size-14 shrink-0 items-center justify-center rounded-xl font-heading text-lg font-semibold",
                logoClass(company.id)
              )}
              aria-hidden
            >
              {initialsOf(company.name)}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-heading text-2xl leading-tight font-semibold tracking-tight">
                  {job.title}
                </h1>
                {job.urgent && (
                  <Badge className="bg-chart-4/12 text-chart-4">Hiring fast</Badge>
                )}
              </div>
              <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <Link
                  href={companyHref(company)}
                  className="inline-flex items-center gap-1.5 rounded-sm font-medium text-foreground hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <Building2 className="size-4" />
                  {company.name}
                </Link>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4" />
                  {job.location} · {workModeLabel[job.workMode]}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="size-4" />
                  Posted {relativeTime(job.publishedAt)}
                </span>
              </p>
            </div>

            <MatchRing score={job.match.score} size={64} />
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-y py-3">
            <Figure label="Salary" value={formatSalary(job)} />
            {job.equity && <Figure label="Equity" value={job.equity} />}
            <Figure label="Level" value={experienceLabel[job.experienceLevel]} />
            <Figure label="Contract" value={employmentLabel[job.employmentType]} />
            <Figure
              label="Applicants"
              value={`${job.applicantCount}`}
              icon={<Users className="size-3.5" />}
            />
            <Figure
              label="Views"
              value={job.viewCount.toLocaleString()}
              icon={<Eye className="size-3.5" />}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {respondsIn(job.respondsInDays)}
            </p>
            <JobActions job={job} />
          </div>
        </CardContent>
      </Card>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="grid min-w-0 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>About the role</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5">
              <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                {job.description}
              </p>

              {job.responsibilities.length > 0 && (
                <Section title="What you will do">
                  {job.responsibilities.map((line) => (
                    <Bullet key={line}>{line}</Bullet>
                  ))}
                </Section>
              )}

              {job.requirements && (
                <Section title="What we are looking for">
                  <Bullet>{job.requirements}</Bullet>
                </Section>
              )}

              {job.niceToHave.length > 0 && (
                <Section title="Nice to have">
                  {job.niceToHave.map((line) => (
                    <Bullet key={line}>{line}</Bullet>
                  ))}
                </Section>
              )}

              <div className="grid gap-2">
                <h2 className="font-heading text-sm font-medium">
                  Tools you will work with
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {job.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {company.process.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Hiring process</CardTitle>
                <CardDescription>
                  {company.process.length} steps · typically{" "}
                  {company.process.at(-1)?.duration?.toLowerCase() ?? "a few weeks"}{" "}
                  end to end
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HiringProcess steps={company.process} />
              </CardContent>
            </Card>
          )}

          {profile && profile.benefits.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>What {company.name} offers</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-2 sm:grid-cols-2">
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

          {similar.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Similar roles</CardTitle>
                <CardDescription>
                  Matched on skills and level, not just job title
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-1">
                {similar.map((item) => (
                  <Link
                    key={item.id}
                    href={jobHref(item)}
                    className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-lg font-heading text-xs font-semibold",
                        logoClass(item.company.id)
                      )}
                      aria-hidden
                    >
                      {initialsOf(item.company.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{item.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {item.company.name} · {item.location} · {formatSalary(item)}
                      </p>
                    </div>
                    <MatchRing score={item.match.score} size={34} />
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          <div className="flex justify-center">
            <ReportListingButton title={job.title} />
          </div>
        </div>

        <aside className="grid gap-4 xl:sticky xl:top-18">
          {job.match.facets.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Why you match</CardTitle>
                <CardDescription>Your loop score against this role</CardDescription>
                <CardAction>
                  <MatchRing score={job.match.score} size={44} />
                </CardAction>
              </CardHeader>
              <CardContent className="grid gap-3">
                {job.match.facets.map((facet) => (
                  <div key={facet.label} className="grid gap-1.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm font-medium">{facet.label}</span>
                      <span className="font-mono text-xs text-muted-foreground tabular-nums">
                        {facet.score}
                      </span>
                    </div>
                    <Progress value={facet.score} />
                    <p className="text-xs text-muted-foreground">{facet.note}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>{company.name}</CardTitle>
              <CardDescription>
                {company.industry} · {company.location}
              </CardDescription>
              <CardAction>
                <span
                  className={cn(
                    "flex size-10 items-center justify-center rounded-lg font-heading text-sm font-semibold",
                    logoClass(company.id)
                  )}
                  aria-hidden
                >
                  {initialsOf(company.name)}
                </span>
              </CardAction>
            </CardHeader>
            <CardContent className="grid gap-3">
              {profile?.about && (
                <p className="text-sm text-muted-foreground">{profile.about}</p>
              )}

              <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                <Meta label="Employees" value={company.size ?? "—"} />
                <Meta label="Founded" value={profile?.founded ?? "—"} />
                <Meta label="Stage" value={profile?.funding ?? "—"} />
                <Meta
                  label="Rating"
                  value={
                    <span className="inline-flex items-center gap-1">
                      <Star className="size-3.5 fill-chart-2 text-chart-2" />
                      <span className="font-mono tabular-nums">
                        {((profile?.rating ?? 0) / 10).toFixed(1)}
                      </span>
                    </span>
                  }
                />
              </dl>

              <Separator />

              <div className="flex flex-wrap gap-2">
                {company.website && (
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <Globe />
                      Website
                    </a>
                  </Button>
                )}
                <Button variant="ghost" size="sm" asChild>
                  <Link href={companyHref(company)}>
                    View profile
                    <ArrowUpRight data-icon="inline-end" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {company.team.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Who you would meet</CardTitle>
                <CardDescription>The people running this process</CardDescription>
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

      <StickyApplyBar job={job} />
    </div>
  );
}

function Figure({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="grid gap-0.5">
      <span className="text-xs tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      <span className="inline-flex items-center gap-1.5 font-mono text-sm font-medium tabular-nums">
        {icon}
        {value}
      </span>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid gap-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <h2 className="font-heading text-sm font-medium">{title}</h2>
      <ul className="grid gap-1.5">{children}</ul>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm text-muted-foreground">
      <span className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground/50" />
      {children}
    </li>
  );
}
