"use client";

import { useState } from "react";
import Link from "next/link";
import { SlidersHorizontal, Sparkles } from "lucide-react";

import { JobCard } from "@/components/dashboard/job-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { annualSalary } from "@/lib/format";
import type { ScoredJob } from "@/types/api";

const TABS = [
  { value: "recommended", label: "Recommended" },
  { value: "recent", label: "Recent" },
  { value: "saved", label: "Saved" },
  { value: "applied", label: "Applied" },
] as const;

const filters = [
  {
    id: "workMode",
    placeholder: "Workplace",
    options: [
      { value: "any", label: "Any workplace" },
      { value: "REMOTE", label: "Remote" },
      { value: "HYBRID", label: "Hybrid" },
      { value: "ONSITE", label: "On-site" },
    ],
  },
  {
    id: "employmentType",
    placeholder: "Job type",
    options: [
      { value: "any", label: "Any type" },
      { value: "FULL_TIME", label: "Full-time" },
      { value: "CONTRACT", label: "Contract" },
      { value: "PART_TIME", label: "Part-time" },
      { value: "INTERNSHIP", label: "Internship" },
    ],
  },
  {
    id: "salary",
    placeholder: "Salary",
    options: [
      { value: "any", label: "Any salary" },
      { value: "60000", label: "60k+" },
      { value: "80000", label: "80k+" },
      { value: "100000", label: "100k+" },
    ],
  },
] as const;

type Picks = { workMode: string; employmentType: string; salary: string };

const ANY: Picks = { workMode: "any", employmentType: "any", salary: "any" };

function listFor(jobs: ScoredJob[], tab: string, picks: Picks) {
  const base =
    tab === "saved"
      ? jobs.filter((job) => job.saved)
      : tab === "applied"
        ? jobs.filter((job) => job.applied)
        : tab === "recommended"
          ? [...jobs].sort((a, b) => b.match.score - a.match.score)
          : [...jobs].sort(
              (a, b) =>
                new Date(b.publishedAt ?? 0).getTime() -
                new Date(a.publishedAt ?? 0).getTime(),
            );

  const floor = picks.salary === "any" ? 0 : Number(picks.salary);

  return base.filter((job) => {
    if (picks.workMode !== "any" && job.workMode !== picks.workMode) return false;
    if (picks.employmentType !== "any" && job.employmentType !== picks.employmentType)
      return false;
    if (floor > 0 && annualSalary(job) < floor) return false;
    return true;
  });
}

export function JobFeed({ jobs }: { jobs: ScoredJob[] }) {
  const [tab, setTab] = useState<string>("recommended");
  const [picks, setPicks] = useState<Picks>(ANY);
  const list = listFor(jobs, tab, picks).slice(0, 6);

  return (
    <section className="grid gap-3">
      <Tabs value={tab} onValueChange={setTab} className="gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <TabsList>
            {TABS.map((item) => (
              <TabsTrigger key={item.value} value={item.value}>
                {item.label}
                <Badge variant="secondary" className="ml-1.5 font-mono">
                  {listFor(jobs, item.value, picks).length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex flex-wrap items-center gap-1.5">
            {filters.map((filter) => (
              <Select
                key={filter.id}
                value={picks[filter.id as keyof Picks]}
                onValueChange={(value) =>
                  setPicks((prev) => ({ ...prev, [filter.id]: value }))
                }
              >
                <SelectTrigger size="sm" className="w-auto min-w-28">
                  <SelectValue placeholder={filter.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
            <Button variant="outline" size="sm" asChild>
              <Link href="/jobs">
                <SlidersHorizontal />
                All filters
              </Link>
            </Button>
          </div>
        </div>

        {TABS.map((item) => (
          <TabsContent key={item.value} value={item.value} className="grid gap-3">
            <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>
                <span className="font-mono text-foreground tabular-nums">
                  {listFor(jobs, item.value, picks).length}
                </span>{" "}
                roles
              </span>
              {item.value === "recommended" && (
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="size-3.5" />
                  Ranked by your loop score
                </span>
              )}
            </div>

            {list.length === 0 ? (
              <EmptyState tab={item.label} />
            ) : (
              list.map((job) => <JobCard key={job.id} job={job} />)
            )}

            {list.length > 0 && (
              <Button variant="outline" className="mx-auto mt-1" asChild>
                <Link href="/jobs">See all matching roles</Link>
              </Button>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}

function EmptyState({ tab }: { tab: string }) {
  return (
    <div className="grid justify-items-center gap-2 rounded-xl border border-dashed px-6 py-12 text-center">
      <p className="font-heading text-sm font-medium">Nothing in {tab} yet</p>
      <p className="max-w-xs text-sm text-muted-foreground">
        Roles you act on show up here. Start from Recommended.
      </p>
      <Button size="sm" className="mt-1" asChild>
        <Link href="/jobs">Browse recommended roles</Link>
      </Button>
    </div>
  );
}
