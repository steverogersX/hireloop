"use client";

import { useState } from "react";
import Link from "next/link";
import { Columns3, Rows3 } from "lucide-react";

import { MatchRing } from "@/components/dashboard/match-ring";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import {
  candidateHref,
  PIPELINE_STAGES,
  stageTone,
  type Candidate,
  type PipelineStage,
} from "@/lib/recruiter-mock-data";
import { CandidateRows } from "@/components/recruiter/candidate-rows";

export function PipelineBoard({ pool }: { pool: Candidate[] }) {
  const [view, setView] = useState("board");

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          <span className="font-mono font-medium text-foreground tabular-nums">
            {pool.length}
          </span>{" "}
          candidates in this pipeline
        </p>
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(value) => value && setView(value)}
          variant="outline"
          size="sm"
        >
          <ToggleGroupItem value="board" aria-label="Board view">
            <Columns3 />
          </ToggleGroupItem>
          <ToggleGroupItem value="table" aria-label="Table view">
            <Rows3 />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {view === "table" ? (
        <CandidateRows pool={pool} />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {PIPELINE_STAGES.map((stage) => (
            <StageColumn
              key={stage}
              stage={stage}
              pool={pool.filter((candidate) => candidate.stage === stage)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function StageColumn({
  stage,
  pool,
}: {
  stage: PipelineStage;
  pool: Candidate[];
}) {
  return (
    <section className="grid content-start gap-2 rounded-xl bg-muted/40 p-2.5">
      <header className="flex items-center justify-between gap-2 px-0.5">
        <Badge className={stageTone[stage]}>{stage}</Badge>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {pool.length}
        </span>
      </header>

      {pool.length === 0 ? (
        <p className="rounded-lg border border-dashed px-3 py-6 text-center text-xs text-muted-foreground">
          Nobody here yet
        </p>
      ) : (
        pool.map((candidate) => (
          <Link
            key={candidate.id}
            href={candidateHref(candidate)}
            className="grid gap-2 rounded-lg bg-card p-2.5 ring-1 ring-foreground/10 transition-shadow hover:ring-foreground/25 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <div className="flex items-start gap-2.5">
              <Avatar className="size-8">
                <AvatarFallback
                  className={cn(
                    "text-[11px] font-medium",
                    candidate.avatarClass
                  )}
                >
                  {candidate.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 truncate text-sm font-medium">
                  {candidate.name}
                  {candidate.isNew && (
                    <Badge className="bg-chart-2/15 text-chart-2">New</Badge>
                  )}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {candidate.experience} · {candidate.location}
                </p>
              </div>
              <MatchRing score={candidate.score} size={32} label="fit" />
            </div>

            <div className="flex flex-wrap items-center gap-1">
              {candidate.topSkills.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>

            <p className="flex items-center justify-between gap-2 border-t pt-2 text-xs text-muted-foreground">
              <span>{candidate.source}</span>
              <span className="font-mono tabular-nums">
                {candidate.expected}
              </span>
            </p>
          </Link>
        ))
      )}
    </section>
  );
}
