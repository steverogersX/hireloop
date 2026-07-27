"use client";

import { useMemo, useState } from "react";
import {
  BellPlus,
  LayoutList,
  MapPin,
  Rows3,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import {
  annualSalary,
  companyFacets,
  jobs,
  postedHours,
  skillFacets,
  type Job,
} from "@/lib/mock-data";

const WORKPLACES = ["Remote", "Hybrid", "On-site"];
const TYPES = ["Full-time", "Contract", "Part-time", "Internship"];
const LEVELS = ["Junior", "Mid", "Senior", "Staff", "Lead"];
const POSTED = [
  { value: "any", label: "Any time" },
  { value: "24", label: "Last 24 hours" },
  { value: "168", label: "Last week" },
  { value: "720", label: "Last month" },
];
const PER_PAGE = 6;

const facetCompanies = companyFacets();
const facetSkills = skillFacets(8);

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

function matches(job: Job, f: Filters) {
  const haystack =
    `${job.title} ${job.company.name} ${job.skills.join(" ")} ${job.summary}`.toLowerCase();

  if (f.query && !haystack.includes(f.query.toLowerCase())) return false;
  if (f.where && !job.location.toLowerCase().includes(f.where.toLowerCase()))
    return false;
  if (f.workplaces.length && !f.workplaces.includes(job.workplace)) return false;
  if (f.types.length && !f.types.includes(job.employment)) return false;
  if (f.levels.length && !f.levels.includes(job.seniority)) return false;
  if (f.companies.length && !f.companies.includes(job.company.id)) return false;
  if (f.skills.length && !f.skills.every((s) => job.skills.includes(s)))
    return false;
  if (annualSalary(job) < f.minSalary) return false;
  if (job.matchScore < f.minMatch) return false;
  if (f.posted !== "any" && postedHours(job) > Number(f.posted)) return false;
  if (f.easyOnly && !job.easyApply) return false;
  if (f.hideApplied && job.applied) return false;
  return true;
}

const sorters: Record<string, (a: Job, b: Job) => number> = {
  match: (a, b) => b.matchScore - a.matchScore,
  newest: (a, b) => postedHours(a) - postedHours(b),
  salary: (a, b) => annualSalary(b) - annualSalary(a),
  competition: (a, b) => a.applicants - b.applicants,
};

export function JobBrowser() {
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [sort, setSort] = useState("match");
  const [view, setView] = useState("list");
  const [page, setPage] = useState(1);

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const toggle = (key: "workplaces" | "types" | "levels" | "companies" | "skills", value: string) => {
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
    [filters, sort]
  );

  const totalPages = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const visible = results.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const chips = [
    ...filters.workplaces.map((v) => ({ label: v, clear: () => toggle("workplaces", v) })),
    ...filters.types.map((v) => ({ label: v, clear: () => toggle("types", v) })),
    ...filters.levels.map((v) => ({ label: v, clear: () => toggle("levels", v) })),
    ...filters.skills.map((v) => ({ label: v, clear: () => toggle("skills", v) })),
    ...filters.companies.map((id) => ({
      label: facetCompanies.find((c) => c.company.id === id)?.company.name ?? id,
      clear: () => toggle("companies", id),
    })),
    ...(filters.minSalary > 0
      ? [{ label: `€${filters.minSalary / 1000}k+`, clear: () => set("minSalary", 0) }]
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
          <Button className="sm:w-32">
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
                <span className="inline-flex items-center gap-1.5 text-sm font-medium">
                  <SlidersHorizontal className="size-4" />
                  Filters
                </span>
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
                      label={option}
                      count={jobs.filter((j) => j.workplace === option).length}
                      checked={filters.workplaces.includes(option)}
                      onChange={() => toggle("workplaces", option)}
                    />
                  ))}
                </FacetGroup>

                <FacetGroup value="type" label="Job type">
                  {TYPES.map((option) => (
                    <FacetCheck
                      key={option}
                      label={option}
                      count={jobs.filter((j) => j.employment === option).length}
                      checked={filters.types.includes(option)}
                      onChange={() => toggle("types", option)}
                    />
                  ))}
                </FacetGroup>

                <FacetGroup value="level" label="Experience level">
                  {LEVELS.map((option) => (
                    <FacetCheck
                      key={option}
                      label={option}
                      count={jobs.filter((j) => j.seniority === option).length}
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
                            : `€${filters.minSalary / 1000}k`}
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
                  {facetCompanies.map(({ company, count }) => (
                    <FacetCheck
                      key={company.id}
                      label={company.name}
                      count={count}
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
                      <div
                        key={option.value}
                        className="flex items-center gap-2"
                      >
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
                onClick={() =>
                  toast.success("Alert created", {
                    description: "You will get matching roles every morning.",
                  })
                }
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
                Loosen the salary floor or drop a filter. We will alert you when
                something matching turns up.
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
            <Pagination className="mt-1">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    aria-disabled={current === 1}
                    className={
                      current === 1 ? "pointer-events-none opacity-50" : ""
                    }
                    onClick={(event) => {
                      event.preventDefault();
                      setPage(current - 1);
                    }}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      href="#"
                      isActive={current === index + 1}
                      onClick={(event) => {
                        event.preventDefault();
                        setPage(index + 1);
                      }}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    aria-disabled={current === totalPages}
                    className={
                      current === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                    onClick={(event) => {
                      event.preventDefault();
                      setPage(current + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
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
