import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Briefcase,
  CalendarPlus,
  Clock3,
  Download,
  FileText,
  Globe,
  Mail,
  MapPin,
  Star,
} from "lucide-react";

import { MatchRing } from "@/components/dashboard/match-ring";
import {
  NoteComposer,
  StageControl,
} from "@/components/recruiter/candidate-actions";
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
import { Separator } from "@/components/ui/separator";
import {
  allCandidateIds,
  getCandidateById,
  postingHref,
} from "@/lib/recruiter-mock-data";
import { cn } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return allCandidateIds().map((id) => ({ id }));
}

export async function generateMetadata(
  props: PageProps<"/recruiter/applicants/[id]">
) {
  const { id } = await props.params;
  const result = getCandidateById(id);
  if (!result) return { title: "Applicant not found — HireLoop" };
  return {
    title: `${result.candidate.name} — HireLoop`,
    description: result.detail.summary,
  };
}

export default async function ApplicantPage(
  props: PageProps<"/recruiter/applicants/[id]">
) {
  const { id } = await props.params;
  const result = getCandidateById(id);
  if (!result) notFound();

  const { candidate, posting, detail } = result;

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
              <Link href="/recruiter/applicants">Applicants</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{candidate.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-start gap-4">
            <Avatar className="size-14">
              <AvatarFallback
                className={cn("text-lg font-medium", candidate.avatarClass)}
              >
                {candidate.initials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-heading text-2xl leading-tight font-semibold tracking-tight">
                  {candidate.name}
                </h1>
                {candidate.isNew && (
                  <Badge className="bg-chart-2/15 text-chart-2">New</Badge>
                )}
              </div>
              <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span>{candidate.headline}</span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4" />
                  {candidate.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="size-4" />
                  Applied {candidate.appliedAgo}
                </span>
                {posting && (
                  <Link
                    href={postingHref(posting)}
                    className="inline-flex items-center gap-1.5 rounded-sm font-medium text-foreground hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    <Briefcase className="size-4" />
                    {posting.title}
                  </Link>
                )}
              </p>
            </div>

            <MatchRing score={candidate.score} size={64} label="fit" />
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-y py-3">
            <Figure label="Experience" value={candidate.experience} />
            <Figure label="Expected" value={candidate.expected} />
            <Figure label="Notice" value={candidate.noticePeriod} />
            <Figure label="Source" value={candidate.source} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <StageControl candidate={candidate} />
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm">
                <Mail />
                Message
              </Button>
              <Button variant="outline" size="sm">
                <CalendarPlus />
                Schedule
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="grid min-w-0 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {detail.summary}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {candidate.topSkills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Experience</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {detail.experience.map((entry, index) => (
                <div key={`${entry.company}-${entry.period}`} className="grid gap-2">
                  {index > 0 && <Separator />}
                  <div>
                    <p className="flex flex-wrap items-baseline gap-x-2 text-sm font-medium">
                      {entry.role}
                      <span className="text-muted-foreground">
                        {entry.company}
                      </span>
                      <span className="ml-auto font-mono text-xs text-muted-foreground tabular-nums">
                        {entry.period}
                      </span>
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {entry.detail}
                    </p>
                  </div>
                </div>
              ))}

              <Separator />

              <div className="grid gap-1">
                <h2 className="font-heading text-sm font-medium">Education</h2>
                {detail.education.map((entry) => (
                  <p
                    key={entry.school}
                    className="flex flex-wrap items-baseline gap-x-2 text-sm text-muted-foreground"
                  >
                    <span className="text-foreground">{entry.school}</span>
                    {entry.qualification}
                    <span className="ml-auto font-mono text-xs tabular-nums">
                      {entry.year}
                    </span>
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Screening answers</CardTitle>
              <CardDescription>
                Submitted with the application, unedited
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {detail.screening.map((entry) => (
                <div key={entry.question} className="grid gap-0.5">
                  <p className="text-xs text-muted-foreground">
                    {entry.question}
                  </p>
                  <p className="text-sm">{entry.answer}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team notes</CardTitle>
              <CardDescription>
                {detail.notes.length === 0
                  ? "Nobody has written anything yet"
                  : `${detail.notes.length} note${detail.notes.length === 1 ? "" : "s"} from your team`}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {detail.notes.map((note) => (
                <div key={note.id} className="flex items-start gap-2.5">
                  <Avatar className="size-8">
                    <AvatarFallback
                      className={cn(
                        "text-[11px] font-medium",
                        note.avatarClass
                      )}
                    >
                      {note.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-baseline gap-2 text-sm font-medium">
                      {note.author}
                      <span className="font-mono text-xs font-normal text-muted-foreground tabular-nums">
                        {note.when}
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground">{note.body}</p>
                  </div>
                </div>
              ))}

              <NoteComposer candidate={candidate} />
            </CardContent>
          </Card>
        </div>

        <aside className="grid gap-4 xl:sticky xl:top-18">
          <Card>
            <CardHeader>
              <CardTitle>Why they match</CardTitle>
              <CardDescription>Fit against this posting</CardDescription>
              <CardAction>
                <MatchRing score={candidate.score} size={44} label="fit" />
              </CardAction>
            </CardHeader>
            <CardContent className="grid gap-2">
              {candidate.scoreReasons.map((reason) => (
                <p
                  key={reason}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <Star className="mt-0.5 size-3.5 shrink-0 text-chart-2" />
                  {reason}
                </p>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div className="flex items-center gap-2.5 rounded-lg border p-2.5">
                <FileText className="size-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate text-sm">
                  {detail.resume}
                </span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Download resume"
                >
                  <Download />
                </Button>
              </div>
              {detail.links.map((link) => (
                <a
                  key={link.href}
                  href={`https://${link.href}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-2.5 rounded-lg border p-2.5 text-sm transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <Globe className="size-4 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1 truncate">{link.href}</span>
                  <span className="text-xs text-muted-foreground">
                    {link.label}
                  </span>
                </a>
              ))}
            </CardContent>
          </Card>

          {detail.scorecards.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Scorecards</CardTitle>
                <CardDescription>
                  {detail.scorecards.length} completed rounds
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                {detail.scorecards.map((card) => (
                  <div key={card.round} className="grid gap-0.5">
                    <p className="flex items-center justify-between gap-2 text-sm font-medium">
                      {card.round}
                      <span className="font-mono text-xs tabular-nums">
                        {card.rating}/5
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {card.interviewer} · {card.verdict}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {detail.timeline.map((entry) => (
                <div key={entry.id} className="flex items-start gap-2.5">
                  <span className="mt-1 size-2 shrink-0 rounded-full bg-primary/60" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug">{entry.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.detail}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
                    {entry.when}
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
