import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  Building2,
  CalendarClock,
  Check,
  Clock3,
  Eye,
  Flag,
  Globe,
  MapPin,
  Star,
  Users,
} from "lucide-react";

import { JobActions, StickyApplyBar } from "@/components/jobs/job-actions";
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
  allJobSlugs,
  formatSalary,
  getJobBySlug,
  jobHref,
  similarJobs,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return allJobSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/jobs/[slug]">) {
  const { slug } = await props.params;
  const result = getJobBySlug(slug);
  if (!result) return { title: "Role not found — HireLoop" };
  return {
    title: `${result.job.title} at ${result.job.company.name} — HireLoop`,
    description: result.job.summary,
  };
}

export default async function JobPage(props: PageProps<"/jobs/[slug]">) {
  const { slug } = await props.params;
  const result = getJobBySlug(slug);
  if (!result) notFound();

  const { job, detail, company } = result;
  const similar = similarJobs(job);

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
              <Link href="/dashboard">Recommended jobs</Link>
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
                job.company.logoClass
              )}
              aria-hidden
            >
              {job.company.initials}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-heading text-2xl leading-tight font-semibold tracking-tight">
                  {job.title}
                </h1>
                {job.urgent && (
                  <Badge className="bg-chart-4/12 text-chart-4">
                    Hiring fast
                  </Badge>
                )}
              </div>
              <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                  <Building2 className="size-4" />
                  {job.company.name}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4" />
                  {job.location} · {job.workplace}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="size-4" />
                  Posted {job.postedAgo}
                </span>
              </p>
            </div>

            <MatchRing score={job.matchScore} size={64} />
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-y py-3">
            <Figure label="Salary" value={formatSalary(job)} />
            {job.equity && <Figure label="Equity" value={job.equity} />}
            <Figure label="Level" value={job.seniority} />
            <Figure label="Contract" value={job.employment} />
            <Figure
              label="Applicants"
              value={`${job.applicants}`}
              icon={<Users className="size-3.5" />}
            />
            <Figure
              label="Views"
              value={job.views.toLocaleString()}
              icon={<Eye className="size-3.5" />}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">{job.respondsIn}</p>
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
              <p className="text-sm leading-relaxed text-muted-foreground">
                {detail.about}
              </p>

              <Section title="What you will do">
                {detail.responsibilities.map((line) => (
                  <Bullet key={line}>{line}</Bullet>
                ))}
              </Section>

              <Section title="What we are looking for">
                {detail.requirements.map((line) => (
                  <Bullet key={line}>{line}</Bullet>
                ))}
              </Section>

              <Section title="Nice to have">
                {detail.niceToHave.map((line) => (
                  <Bullet key={line}>{line}</Bullet>
                ))}
              </Section>

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

          <Card>
            <CardHeader>
              <CardTitle>Hiring process</CardTitle>
              <CardDescription>
                {company.process.length} steps · typically{" "}
                {company.process.at(-1)?.duration.toLowerCase()} end to end
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="grid gap-4">
                {company.process.map((step, index) => (
                  <li key={step.step} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-medium text-primary tabular-nums">
                        {index + 1}
                      </span>
                      {index < company.process.length - 1 && (
                        <span className="mt-1 w-px flex-1 bg-border" />
                      )}
                    </div>
                    <div className="pb-1">
                      <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                        {step.step}
                        <span className="font-mono text-xs font-normal text-muted-foreground">
                          {step.duration}
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {step.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What {job.company.name} offers</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2 sm:grid-cols-2">
                {company.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-chart-5" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

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
                      item.company.logoClass
                    )}
                    aria-hidden
                  >
                    {item.company.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {item.company.name} · {item.location} ·{" "}
                      {formatSalary(item)}
                    </p>
                  </div>
                  <MatchRing score={item.matchScore} size={34} />
                </Link>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button variant="ghost" size="sm">
              <Flag />
              Report this listing
            </Button>
          </div>
        </div>

        <aside className="grid gap-4 xl:sticky xl:top-18">
          <Card>
            <CardHeader>
              <CardTitle>Why you match</CardTitle>
              <CardDescription>
                Your loop score against this role
              </CardDescription>
              <CardAction>
                <MatchRing score={job.matchScore} size={44} />
              </CardAction>
            </CardHeader>
            <CardContent className="grid gap-3">
              {detail.matchBreakdown.map((facet) => (
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

          <Card>
            <CardHeader>
              <CardTitle>{job.company.name}</CardTitle>
              <CardDescription>
                {job.company.industry} · {job.company.hq}
              </CardDescription>
              <CardAction>
                <span
                  className={cn(
                    "flex size-10 items-center justify-center rounded-lg font-heading text-sm font-semibold",
                    job.company.logoClass
                  )}
                  aria-hidden
                >
                  {job.company.initials}
                </span>
              </CardAction>
            </CardHeader>
            <CardContent className="grid gap-3">
              <p className="text-sm text-muted-foreground">{company.about}</p>

              <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                <Meta label="Employees" value={job.company.size} />
                <Meta label="Founded" value={company.founded} />
                <Meta label="Stage" value={job.company.funding} />
                <Meta
                  label="Rating"
                  value={
                    <span className="inline-flex items-center gap-1">
                      <Star className="size-3.5 fill-chart-2 text-chart-2" />
                      <span className="font-mono tabular-nums">
                        {job.company.rating}
                      </span>
                    </span>
                  }
                />
              </dl>

              <Separator />

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Globe />
                  {company.website}
                </Button>
                <Button variant="ghost" size="sm">
                  {company.openRoles} open roles
                  <ArrowUpRight data-icon="inline-end" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Who you would meet</CardTitle>
              <CardDescription>The people running this process</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {company.team.map((person) => (
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

function Meta({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
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
