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
import { jobs } from "@/lib/mock-data";

const TABS = [
  { value: "recommended", label: "Recommended" },
  { value: "recent", label: "Recent" },
  { value: "saved", label: "Saved" },
  { value: "applied", label: "Applied" },
] as const;

const filters = [
  {
    id: "workplace",
    placeholder: "Workplace",
    options: ["Any workplace", "Remote", "Hybrid", "On-site"],
  },
  {
    id: "employment",
    placeholder: "Job type",
    options: ["Any type", "Full-time", "Contract", "Part-time", "Internship"],
  },
  {
    id: "salary",
    placeholder: "Salary",
    options: ["Any salary", "€60k+", "€80k+", "€100k+", "€120k+"],
  },
];

function listFor(tab: string) {
  if (tab === "saved") return jobs.filter((job) => job.saved);
  if (tab === "applied") return jobs.filter((job) => job.applied);
  if (tab === "recommended")
    return [...jobs].sort((a, b) => b.matchScore - a.matchScore);
  return jobs;
}

export function JobFeed() {
  const [tab, setTab] = useState<string>("recommended");
  const list = listFor(tab);

  return (
    <section className="grid gap-3">
      <Tabs value={tab} onValueChange={setTab} className="gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <TabsList>
            {TABS.map((item) => (
              <TabsTrigger key={item.value} value={item.value}>
                {item.label}
                <Badge variant="secondary" className="ml-1.5 font-mono">
                  {listFor(item.value).length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex flex-wrap items-center gap-1.5">
            {filters.map((filter) => (
              <Select key={filter.id}>
                <SelectTrigger size="sm" className="w-auto min-w-28">
                  <SelectValue placeholder={filter.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {filter.options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
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
                <span className="font-mono tabular-nums text-foreground">
                  {list.length}
                </span>{" "}
                roles · updated 4 minutes ago
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
        Roles you act on show up here. Start from Recommended — 6 of them match
        above 85%.
      </p>
      <Button size="sm" className="mt-1" asChild>
        <Link href="/jobs">Browse recommended roles</Link>
      </Button>
    </div>
  );
}
