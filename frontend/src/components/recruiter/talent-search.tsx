"use client";

import { useMemo, useState } from "react";
import { BadgeCheck, MapPin, Search, Send, SlidersHorizontal, X } from "lucide-react";
import { toast } from "sonner";

import { MatchRing } from "@/components/dashboard/match-ring";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { cn } from "@/lib/utils";
import { talentPool, type TalentProfile } from "@/lib/recruiter-mock-data";

const SKILLS = [...new Set(talentPool.flatMap((profile) => profile.skills))]
  .sort()
  .slice(0, 12);

const LOCATIONS = [...new Set(talentPool.map((profile) => profile.location))].sort();

type Filters = {
  query: string;
  where: string;
  skills: string[];
  locations: string[];
  minScore: number;
  openOnly: boolean;
  hideContacted: boolean;
};

const EMPTY: Filters = {
  query: "",
  where: "",
  skills: [],
  locations: [],
  minScore: 0,
  openOnly: false,
  hideContacted: false,
};

function matches(profile: TalentProfile, f: Filters) {
  const haystack =
    `${profile.name} ${profile.headline} ${profile.company} ${profile.skills.join(" ")}`.toLowerCase();

  if (f.query && !haystack.includes(f.query.toLowerCase())) return false;
  if (f.where && !profile.location.toLowerCase().includes(f.where.toLowerCase()))
    return false;
  if (f.skills.length && !f.skills.every((s) => profile.skills.includes(s)))
    return false;
  if (f.locations.length && !f.locations.includes(profile.location)) return false;
  if (profile.score < f.minScore) return false;
  if (f.openOnly && !profile.openTo) return false;
  if (f.hideContacted && profile.contacted) return false;
  return true;
}

const sorters: Record<string, (a: TalentProfile, b: TalentProfile) => number> = {
  match: (a, b) => b.score - a.score,
  experience: (a, b) => parseInt(b.experience) - parseInt(a.experience),
  name: (a, b) => a.name.localeCompare(b.name),
};

export function TalentSearch() {
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [sort, setSort] = useState("match");

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const toggle = (key: "skills" | "locations", value: string) =>
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((item) => item !== value)
        : [...prev[key], value],
    }));

  const results = useMemo(
    () => talentPool.filter((profile) => matches(profile, filters)).sort(sorters[sort]),
    [filters, sort]
  );

  const chips = [
    ...filters.skills.map((v) => ({ label: v, clear: () => toggle("skills", v) })),
    ...filters.locations.map((v) => ({
      label: v,
      clear: () => toggle("locations", v),
    })),
    ...(filters.minScore > 0
      ? [{ label: `Fit ${filters.minScore}+`, clear: () => set("minScore", 0) }]
      : []),
    ...(filters.openOnly
      ? [{ label: "Open to work", clear: () => set("openOnly", false) }]
      : []),
    ...(filters.hideContacted
      ? [{ label: "Hiding contacted", clear: () => set("hideContacted", false) }]
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
              placeholder="Title, company or skill"
              className="pl-8"
              aria-label="Title, company or skill"
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
            onClick={() =>
              toast(
                `${results.length} ${results.length === 1 ? "profile" : "profiles"} match`,
                { description: "Results update as you type." }
              )
            }
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
                <span className="inline-flex items-center gap-1.5 text-sm font-medium">
                  <SlidersHorizontal className="size-4" />
                  Filters
                </span>
                {chips.length > 0 && (
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => setFilters(EMPTY)}
                  >
                    Clear all
                  </Button>
                )}
              </div>

              <Accordion type="multiple" defaultValue={["skills", "fit"]}>
                <AccordionItem value="skills">
                  <AccordionTrigger className="text-sm">Skills</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap gap-1.5 py-1">
                      {SKILLS.map((skill) => {
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
                            </Badge>
                          </button>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="location">
                  <AccordionTrigger className="text-sm">Location</AccordionTrigger>
                  <AccordionContent className="grid gap-2">
                    {LOCATIONS.map((location) => (
                      <label
                        key={location}
                        className="flex cursor-pointer items-center gap-2 text-sm"
                      >
                        <Checkbox
                          checked={filters.locations.includes(location)}
                          onCheckedChange={() => toggle("locations", location)}
                        />
                        <span className="flex-1 truncate">{location}</span>
                        <span className="font-mono text-xs text-muted-foreground tabular-nums">
                          {
                            talentPool.filter((p) => p.location === location)
                              .length
                          }
                        </span>
                      </label>
                    ))}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="fit">
                  <AccordionTrigger className="text-sm">
                    Minimum fit
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-2 py-1">
                      <div className="flex items-baseline justify-between">
                        <Label className="text-xs text-muted-foreground">
                          Fit score
                        </Label>
                        <span className="font-mono text-xs tabular-nums">
                          {filters.minScore === 0 ? "Any" : filters.minScore}
                        </span>
                      </div>
                      <Slider
                        value={[filters.minScore]}
                        onValueChange={([value]) => set("minScore", value)}
                        min={0}
                        max={100}
                        step={5}
                        aria-label="Minimum fit score"
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Separator className="my-1" />

              <div className="grid gap-3 py-1">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="open-only" className="text-sm font-normal">
                    Open to work only
                  </Label>
                  <Switch
                    id="open-only"
                    checked={filters.openOnly}
                    onCheckedChange={(value) => set("openOnly", value)}
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="hide-contacted" className="text-sm font-normal">
                    Hide already contacted
                  </Label>
                  <Switch
                    id="hide-contacted"
                    checked={filters.hideContacted}
                    onCheckedChange={(value) => set("hideContacted", value)}
                  />
                </div>
              </div>
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
              {results.length === 1 ? "profile" : "profiles"} match your search
            </p>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger size="sm" className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="match">Best fit</SelectItem>
                <SelectItem value="experience">Most experience</SelectItem>
                <SelectItem value="name">Name A–Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {results.length === 0 ? (
            <div className="grid justify-items-center gap-2 rounded-xl border border-dashed px-6 py-16 text-center">
              <p className="font-heading text-sm font-medium">
                No profiles match every filter
              </p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Drop a skill or lower the fit floor. New profiles are added to
                the pool every week.
              </p>
              <Button size="sm" className="mt-1" onClick={() => setFilters(EMPTY)}>
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-3">
              {results.map((profile) => (
                <Card key={profile.id}>
                  <CardContent className="flex flex-wrap items-start gap-3">
                    <Avatar className="size-10">
                      <AvatarFallback
                        className={cn(
                          "text-sm font-medium",
                          profile.avatarClass
                        )}
                      >
                        {profile.initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-48 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-heading text-base leading-snug font-medium">
                          {profile.name}
                        </h3>
                        {profile.openTo && (
                          <Badge className="bg-chart-5/12 text-chart-5">
                            <BadgeCheck />
                            Open to work
                          </Badge>
                        )}
                        {profile.contacted && (
                          <Badge variant="outline" className="text-muted-foreground">
                            Contacted
                          </Badge>
                        )}
                      </div>
                      <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {profile.headline}
                        </span>
                        <span>{profile.company}</span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="size-3.5" />
                          {profile.location}
                        </span>
                        <span className="font-mono tabular-nums">
                          {profile.experience}
                        </span>
                      </p>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {profile.skills.map((skill) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <p className="mt-2 text-xs text-muted-foreground">
                        {profile.lastActive}
                      </p>
                    </div>

                    <MatchRing score={profile.score} label="fit" />

                    <div className="flex w-full items-center justify-end gap-1.5 border-t pt-3 sm:w-auto sm:border-0 sm:pt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          toast(`${profile.name} · ${profile.headline}`, {
                            description: `${profile.experience} at ${profile.company}. ${profile.lastActive}.`,
                          })
                        }
                      >
                        View profile
                      </Button>
                      <Button
                        size="sm"
                        disabled={profile.contacted}
                        onClick={() =>
                          toast.success(`Outreach sent to ${profile.name}`, {
                            description: "One sourcing credit used.",
                          })
                        }
                      >
                        <Send />
                        {profile.contacted ? "Contacted" : "Reach out"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
