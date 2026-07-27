import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Users } from "lucide-react";

import { HiringProcess } from "@/components/companies/hiring-process";
import { PipelineBoard } from "@/components/recruiter/pipeline-board";
import { PostingActions } from "@/components/recruiter/posting-actions";
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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  allPostingSlugs,
  formatBand,
  getPostingBySlug,
  statusTone,
} from "@/lib/recruiter-mock-data";
import { cn } from "@/lib/utils";

// Every posting is prerendered, so an unknown slug is a real 404 rather than a
// loading shell stuck at 200.
export const dynamicParams = false;

export function generateStaticParams() {
  return allPostingSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/recruiter/jobs/[slug]">
) {
  const { slug } = await props.params;
  const result = getPostingBySlug(slug);
  if (!result) return { title: "Posting not found — HireLoop" };
  return {
    title: `${result.posting.title} — HireLoop`,
    description: result.detail.about,
  };
}

export default async function PostingPage(
  props: PageProps<"/recruiter/jobs/[slug]">
) {
  const { slug } = await props.params;
  const result = getPostingBySlug(slug);
  if (!result) notFound();

  const { posting, detail, owner, pool, counts } = result;
  const reviewed = posting.applicants - posting.unreviewed;
  const reviewedShare = posting.applicants
    ? (reviewed / posting.applicants) * 100
    : 0;

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
            <BreadcrumbLink asChild>
              <Link href="/recruiter/jobs">Job postings</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{posting.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-heading text-2xl leading-tight font-semibold tracking-tight">
                  {posting.title}
                </h1>
                <Badge className={statusTone[posting.status]}>
                  {posting.status}
                </Badge>
              </div>
              <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4" />
                  {posting.location} · {posting.workplace}
                </span>
                <span>
                  {posting.employment} · {posting.seniority}
                </span>
                <span className="font-mono tabular-nums">
                  {formatBand(posting)}
                </span>
                <span>
                  {posting.postedAgo} · {posting.closesIn}
                </span>
              </p>
            </div>

            <PostingActions posting={posting} />
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-y py-3">
            <Figure label="Applicants" value={`${posting.applicants}`} />
            <Figure label="Unreviewed" value={`${posting.unreviewed}`} />
            <Figure label="Interviewing" value={`${posting.interviewing}`} />
            <Figure label="Offers" value={`${posting.offers}`} />
            <Figure label="Views" value={posting.views.toLocaleString()} />
            <Figure label="Apply rate" value={`${posting.conversion}%`} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-56 flex-1">
              <Progress value={reviewedShare} />
              <p className="mt-1.5 text-xs text-muted-foreground">
                <span className="font-mono text-foreground tabular-nums">
                  {reviewed}
                </span>{" "}
                of {posting.applicants} applications reviewed
              </p>
            </div>

            {owner && (
              <div className="flex items-center gap-2">
                <Avatar className="size-8">
                  <AvatarFallback
                    className={cn(
                      "text-[11px] font-medium",
                      owner.avatarClass
                    )}
                  >
                    {owner.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid leading-tight">
                  <span className="text-sm font-medium">{owner.name}</span>
                  <span className="text-xs text-muted-foreground">
                    Owns this posting
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="pipeline">
        <TabsList>
          <TabsTrigger value="pipeline">
            <Users />
            Pipeline
            <span className="font-mono text-xs opacity-60 tabular-nums">
              {pool.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="process">Process</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="mt-3">
          {pool.length === 0 ? (
            <div className="grid justify-items-center gap-2 rounded-xl border border-dashed px-6 py-16 text-center">
              <p className="font-heading text-sm font-medium">
                No applicants yet
              </p>
              <p className="max-w-sm text-sm text-muted-foreground">
                {posting.status === "Draft"
                  ? "This role is still a draft. Publish it to start collecting applications."
                  : "Nobody has applied to this role yet. Sourcing is the fastest way to fill it."}
              </p>
            </div>
          ) : (
            <PipelineBoard pool={pool} />
          )}
        </TabsContent>

        <TabsContent value="description" className="mt-3">
          <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
            <Card>
              <CardHeader>
                <CardTitle>About the role</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {detail.about}
                </p>

                <Section title="What they will do">
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Screening questions</CardTitle>
                <CardDescription>
                  Asked of every applicant before they submit
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                {detail.screening.map((question, index) => (
                  <div
                    key={question}
                    className="flex items-start gap-2.5 rounded-lg border p-2.5 text-sm"
                  >
                    <span className="font-mono text-xs text-muted-foreground tabular-nums">
                      {index + 1}
                    </span>
                    <span className="text-muted-foreground">{question}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="process" className="mt-3">
          <Card>
            <CardHeader>
              <CardTitle>Hiring process</CardTitle>
              <CardDescription>
                {detail.process.length} steps · candidates see this on the public
                posting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HiringProcess steps={detail.process} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card size="sm">
        <CardContent className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Stage breakdown
          </span>
          {Object.entries(counts).map(([stage, count]) => (
            <span
              key={stage}
              className="inline-flex items-baseline gap-1.5 text-xs text-muted-foreground"
            >
              {stage}
              <span className="font-mono text-foreground tabular-nums">
                {count}
              </span>
            </span>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-0.5">
      <span className="text-xs tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      <span className="font-mono text-sm font-medium tabular-nums">
        {value}
      </span>
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
