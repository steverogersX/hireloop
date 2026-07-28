"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BellPlus, LayoutList, MapPin, Rows3, Search, X } from "lucide-react";
import { toast } from "sonner";

import { JobCard } from "@/components/dashboard/job-card";
import { JobsTable } from "@/components/jobs/jobs-table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { mutate } from "@/lib/client-api";
import {
  annualSalary,
  employmentLabel,
  experienceLabel,
  workModeLabel,
} from "@/lib/format";
import type {
  EmploymentType,
  ExperienceLevel,
  ScoredJob,
  WorkMode,
} from "@/types/api";

const WORKPLACES: WorkMode[] = ["REMOTE", "HYBRID", "ONSITE"];
const TYPES: EmploymentType[] = ["FULL_TIME", "CONTRACT", "PART_TIME", "INTERNSHIP"];
const LEVELS: ExperienceLevel[] = ["INTERN", "ENTRY", "MID", "SENIOR", "LEAD"];
const POSTED = [
  { value: "any", label: "Any time" },
  { value: "24", label: "Last 24 hours" },
  { value: "168", label: "Last week" },
  { value: "720", label: "Last month" },
];
const PER_PAGE = 6;

type Filters = {
  query: string;
  where: string;
  workplaces: string[];
  types: string[];
  levels: string[];
  companies: string[];
  skills: string[];
  minSalary: number;
  minMatch: number;
  posted: string;
  easyOnly: boolean;
  hideApplied: boolean;
};

const EMPTY: Filters = {
  query: "",
  where: "",
  workplaces: [],
  types: [],
  levels: [],
  companies: [],
  skills: [],
  minSalary: 0,
  minMatch: 0,
  posted: "any",
  easyOnly: false,
  hideApplied: false,
};

function hoursSince(value: string | null) {
  if (!value) return Number.MAX_SAFE_INTEGER;
  return (Date.now() - new Date(value).getTime()) / 3_600_000;
}

function matches(job: ScoredJob, f: Filters) {
  const haystack =
    `${job.title} ${job.company.name} ${job.skills.join(" ")} ${job.summary ?? ""}`.toLowerCase();

  if (f.query && !haystack.includes(f.query.toLowerCase())) return false;
  if (f.where && !job.location.toLowerCase().includes(f.where.toLowerCase()))
    return false;
  if (f.workplaces.length && !f.workplaces.includes(job.workMode)) return false;
  if (f.types.length && !f.types.includes(job.employmentType)) return false;
  if (f.levels.length && !f.levels.includes(job.experienceLevel)) return false;
  if (f.companies.length && !f.companies.includes(job.company.id)) return false;
  if (f.skills.length && !f.skills.every((s) => job.skills.includes(s))) return false;
  if (annualSalary(job) < f.minSalary) return false;
  if (job.match.score < f.minMatch) return false;
  if (f.posted !== "any" && hoursSince(job.publishedAt) > Number(f.posted)) return false;
  if (f.easyOnly && !job.easyApply) return false;
  if (f.hideApplied && job.applied) return false;
  return true;
}

const sorters: Record<string, (a: ScoredJob, b: ScoredJob) => number> = {
  match: (a, b) => b.match.score - a.match.score,
  newest: (a, b) => hoursSince(a.publishedAt) - hoursSince(b.publishedAt),
  salary: (a, b) => annualSalary(b) - annualSalary(a),
  competition: (a, b) => a.applicantCount - b.applicantCount,
};

export function JobBrowser({ jobs }: { jobs: ScoredJob[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [filters, setFilters] = useState<Filters>({
    ...EMPTY,
    query: params.get("q") ?? "",
    where: params.get("where") ?? "",
  });
  const [sort, setSort] = useState("match");
  const [view, setView] = useState("list");
  const [page, setPage] = useState(1);

  const facetCompanies = useMemo(() => {
    const map = new Map<string, { id: string; name: string; count: number }>();
    for (const job of jobs) {
      const entry = map.get(job.company.id) ?? {
        id: job.company.id,
        name: job.company.name,
        count: 0,
      };
      entry.count += 1;
      map.set(job.company.id, entry);
    }
    return [...map.values()].sort((a, b) => b.count - a.count);
  }, [jobs]);

  const facetSkills = useMemo(() => {
    const counts = new Map<string, number>();
    for (const job of jobs) {
      for (const skill of job.skills) counts.set(skill, (counts.get(skill) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([skill, count]) => ({ skill, count }));
  }, [jobs]);

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const toggle = (
    key: "workplaces" | "types" | "levels" | "companies" | "skills",
    value: string,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((item) => item !== value)
        : [...prev[key], value],
    }));
    setPage(1);
  };

  const results = useMemo(
    () => jobs.filter((job) => matches(job, filters)).sort(sorters[sort]),
    [jobs, filters, sort],
  );

  const totalPages = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const visible = results.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const chips = [
    ...filters.workplaces.map((v) => ({
      label: workModeLabel[v as WorkMode],
      clear: () => toggle("workplaces", v),
    })),
    ...filters.types.map((v) => ({
      label: employmentLabel[v as EmploymentType],
      clear: () => toggle("types", v),
    })),
    ...filters.levels.map((v) => ({
      label: experienceLabel[v as ExperienceLevel],
      clear: () => toggle("levels", v),
    })),
    ...filters.skills.map((v) => ({ label: v, clear: () => toggle("skills", v) })),
    ...filters.companies.map((id) => ({
      label: facetCompanies.find((c) => c.id === id)?.name ?? id,
      clear: () => toggle("companies", id),
    })),
    ...(filters.minSalary > 0
      ? [{ label: `${filters.minSalary / 1000}k+`, clear: () => set("minSalary", 0) }]
      : []),
    ...(filters.minMatch > 0
      ? [{ label: `Match ${filters.minMatch}+`, clear: () => set("minMatch", 0) }]
      : []),
    ...(filters.posted !== "any"
      ? [
          {
            label: POSTED.find((p) => p.value === filters.posted)?.label ?? "",
            clear: () => set("posted", "any"),
          },
        ]
      : []),
    ...(filters.easyOnly
      ? [{ label: "Quick apply", clear: () => set("easyOnly", false) }]
      : []),
    ...(filters.hideApplied
      ? [{ label: "Hiding applied", clear: () => set("hideApplied", false) }]
      : []),
  ];

  return (
    <div className="grid gap-4">
      <Card>
        <CardContent className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={filters.query}
              onChange={(event) => set("query", event.target.value)}
              placeholder="Job title, company or skill"
              className="pl-8"
              aria-label="Job title, company or skill"
            />
          </div>
          <div className="relative flex-1">
            <MapPin className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={filters.where}
              onChange={(event) => set("where", event.target.value)}
              placeholder="City or remote"
              className="pl-8"
              aria-label="Location"
            />
          </div>
          <Button
            className="sm:w-32"
            onClick={() => {
              const next = new URLSearchParams();
              if (filters.query) next.set("q", filters.query);
              if (filters.where) next.set("where", filters.where);
              router.replace(next.size ? `/jobs?${next}` : "/jobs", { scroll: false });
              toast(`${results.length} roles match`);
            }}
          >
            <Search />
            Search
          </Button>
        </CardContent>
      </Card>

      <div className="grid items-start gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-18">
          <Card>
            <CardContent className="grid gap-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Filters</span>
                {chips.length > 0 && (
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => {
                      setFilters(EMPTY);
                      setPage(1);
                    }}
                  >
                    Clear all
                  </Button>
                )}
              </div>

              <Accordion
                type="multiple"
                defaultValue={["workplace", "type", "level", "salary"]}
              >
                <FacetGroup value="workplace" label="Workplace">
                  {WORKPLACES.map((option) => (
                    <FacetCheck
                      key={option}
                      label={workModeLabel[option]}
                      count={jobs.filter((j) => j.workMode === option).length}
                      checked={filters.workplaces.includes(option)}
                      onChange={() => toggle("workplaces", option)}
                    />
                  ))}
                </FacetGroup>

                <FacetGroup value="type" label="Job type">
                  {TYPES.map((option) => (
                    <FacetCheck
                      key={option}
                      label={employmentLabel[option]}
                      count={jobs.filter((j) => j.employmentType === option).length}
                      checked={filters.types.includes(option)}
                      onChange={() => toggle("types", option)}
                    />
                  ))}
                </FacetGroup>

                <FacetGroup value="level" label="Experience level">
                  {LEVELS.map((option) => (
                    <FacetCheck
                      key={option}
                      label={experienceLabel[option]}
                      count={jobs.filter((j) => j.experienceLevel === option).length}
                      checked={filters.levels.includes(option)}
                      onChange={() => toggle("levels", option)}
                    />
                  ))}
                </FacetGroup>

                <FacetGroup value="salary" label="Salary and match">
                  <div className="grid gap-5 py-1">
                    <div className="grid gap-2">
                      <div className="flex items-baseline justify-between">
                        <Label className="text-xs text-muted-foreground">
                          Minimum salary
                        </Label>
                        <span className="font-mono text-xs tabular-nums">
                          {filters.minSalary === 0
                            ? "Any"
                            : `${filters.minSalary / 1000}k`}
                        </span>
                      </div>
                      <Slider
                        value={[filters.minSalary]}
                        onValueChange={([value]) => set("minSalary", value)}
                        min={0}
                        max={160000}
                        step={10000}
                        aria-label="Minimum salary"
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-baseline justify-between">
                        <Label className="text-xs text-muted-foreground">
                          Minimum loop score
                        </Label>
                        <span className="font-mono text-xs tabular-nums">
                          {filters.minMatch === 0 ? "Any" : filters.minMatch}
                        </span>
                      </div>
                      <Slider
                        value={[filters.minMatch]}
                        onValueChange={([value]) => set("minMatch", value)}
                        min={0}
                        max={100}
                        step={5}
                        aria-label="Minimum loop score"
                      />
                    </div>
                  </div>
                </FacetGroup>

                <FacetGroup value="skills" label="Skills">
                  <div className="flex flex-wrap gap-1.5 py-1">
                    {facetSkills.map(({ skill, count }) => {
                      const on = filters.skills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggle("skills", skill)}
                          aria-pressed={on}
                          className="rounded-4xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                        >
                          <Badge variant={on ? "default" : "outline"}>
                            {skill}
                            <span className="font-mono opacity-60">{count}</span>
                          </Badge>
                        </button>
                      );
                    })}
                  </div>
                </FacetGroup>

                <FacetGroup value="company" label="Company">
                  {facetCompanies.map((company) => (
                    <FacetCheck
                      key={company.id}
                      label={company.name}
                      count={company.count}
                      checked={filters.companies.includes(company.id)}
                      onChange={() => toggle("companies", company.id)}
                    />
                  ))}
                </FacetGroup>

                <FacetGroup value="posted" label="Date posted">
                  <RadioGroup
                    value={filters.posted}
                    onValueChange={(value) => set("posted", value)}
                    className="gap-2 py-1"
                  >
                    {POSTED.map((option) => (
                      <div key={option.value} className="flex items-center gap-2">
                        <RadioGroupItem
                          value={option.value}
                          id={`posted-${option.value}`}
                        />
                        <Label
                          htmlFor={`posted-${option.value}`}
                          className="text-sm font-normal"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FacetGroup>
              </Accordion>

              <Separator className="my-1" />

              <div className="grid gap-3 py-1">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="easy-only" className="text-sm font-normal">
                    Quick apply only
                  </Label>
                  <Switch
                    id="easy-only"
                    checked={filters.easyOnly}
                    onCheckedChange={(value) => set("easyOnly", value)}
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="hide-applied" className="text-sm font-normal">
                    Hide roles I applied to
                  </Label>
                  <Switch
                    id="hide-applied"
                    checked={filters.hideApplied}
                    onCheckedChange={(value) => set("hideApplied", value)}
                  />
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="mt-1"
                onClick={async () => {
                  await mutate("/alerts", "POST", {
                    query: filters.query || "Frontend roles",
                    location: filters.where || undefined,
                    frequency: "DAILY",
                    channels: ["EMAIL"],
                  });
                  router.refresh();
                  toast.success("Alert created", {
                    description: "You will get matching roles every morning.",
                  });
                }}
              >
                <BellPlus />
                Alert me about this search
              </Button>
            </CardContent>
          </Card>
        </aside>

        <div className="grid min-w-0 gap-3">
          {chips.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {chips.map((chip) => (
                <Button
                  key={chip.label}
                  variant="secondary"
                  size="xs"
                  onClick={chip.clear}
                >
                  {chip.label}
                  <X data-icon="inline-end" />
                </Button>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-mono font-medium text-foreground tabular-nums">
                {results.length}
              </span>{" "}
              {results.length === 1 ? "role" : "roles"} match your search
            </p>

            <div className="flex items-center gap-1.5">
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger size="sm" className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">Best match</SelectItem>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="salary">Highest salary</SelectItem>
                  <SelectItem value="competition">Fewest applicants</SelectItem>
                </SelectContent>
              </Select>

              <ToggleGroup
                type="single"
                value={view}
                onValueChange={(value) => value && setView(value)}
                variant="outline"
                size="sm"
              >
                <ToggleGroupItem value="list" aria-label="Detailed view">
                  <LayoutList />
                </ToggleGroupItem>
                <ToggleGroupItem value="compact" aria-label="Compact view">
                  <Rows3 />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>

          {view === "compact" ? (
            <JobsTable jobs={results} />
          ) : visible.length === 0 ? (
            <div className="grid justify-items-center gap-2 rounded-xl border border-dashed px-6 py-16 text-center">
              <p className="font-heading text-sm font-medium">
                No roles match every filter
              </p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Loosen the salary floor or drop a filter.
              </p>
              <Button
                size="sm"
                className="mt-1"
                onClick={() => {
                  setFilters(EMPTY);
                  setPage(1);
                }}
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-3">
              {visible.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}

          {view === "list" && totalPages > 1 && (
            <div className="mx-auto flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={current === 1}
                onClick={() => setPage(current - 1)}
              >
                Previous
              </Button>
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                {current} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={current === totalPages}
                onClick={() => setPage(current + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FacetGroup({
  value,
  label,
  children,
}: {
  value: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <AccordionItem value={value}>
      <AccordionTrigger className="text-sm">{label}</AccordionTrigger>
      <AccordionContent className="grid gap-2">{children}</AccordionContent>
    </AccordionItem>
  );
}

function FacetCheck({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <Checkbox checked={checked} onCheckedChange={onChange} />
      <span className="flex-1 truncate">{label}</span>
      <span className="font-mono text-xs text-muted-foreground tabular-nums">
        {count}
      </span>
    </label>
  );
}
