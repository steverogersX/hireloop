"use client";

import { useMemo, useState } from "react";
import { LayoutGrid, Rows3, Search, X } from "lucide-react";

import { CompaniesTable } from "@/components/companies/companies-table";
import { CompanyCard } from "@/components/companies/company-card";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useFollowedCompanies } from "@/hooks/use-follows";
import {
  companyDirectory,
  industryFacets,
  sizeBands,
  type DirectoryEntry,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const directory = companyDirectory();
const industries = industryFacets();

const sorters: Record<string, (a: DirectoryEntry, b: DirectoryEntry) => number> =
  {
    roles: (a, b) => b.openRoles - a.openRoles,
    rating: (a, b) => b.company.rating - a.company.rating,
    match: (a, b) => b.bestMatch - a.bestMatch,
    name: (a, b) => a.company.name.localeCompare(b.company.name),
  };

export function CompanyBrowser() {
  const [query, setQuery] = useState("");
  const [pickedIndustries, setPickedIndustries] = useState<string[]>([]);
  const [bands, setBands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [hiringOnly, setHiringOnly] = useState(false);
  const [followedOnly, setFollowedOnly] = useState(false);
  const [sort, setSort] = useState("roles");
  const [view, setView] = useState("grid");
  const followed = useFollowedCompanies();

  const toggle = (
    value: string,
    list: string[],
    set: (next: string[]) => void
  ) =>
    set(
      list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value]
    );

  const results = useMemo(
    () =>
      directory
        .filter((entry) => {
          const haystack =
            `${entry.company.name} ${entry.company.industry} ${entry.company.hq} ${entry.culture.tagline}`.toLowerCase();
          if (query && !haystack.includes(query.toLowerCase())) return false;
          if (
            pickedIndustries.length &&
            !pickedIndustries.includes(entry.company.industry)
          )
            return false;
          if (bands.length && !bands.includes(entry.band)) return false;
          if (entry.company.rating < minRating) return false;
          if (hiringOnly && entry.openRoles === 0) return false;
          if (followedOnly && !followed.has(entry.company.id)) return false;
          return true;
        })
        .sort(sorters[sort]),
    [query, pickedIndustries, bands, minRating, hiringOnly, followedOnly, followed, sort]
  );

  const chips = [
    ...pickedIndustries.map((value) => ({
      label: value,
      clear: () => toggle(value, pickedIndustries, setPickedIndustries),
    })),
    ...bands.map((value) => ({
      label: `${value} people`,
      clear: () => toggle(value, bands, setBands),
    })),
    ...(minRating > 0
      ? [{ label: `${minRating.toFixed(1)}+ rating`, clear: () => setMinRating(0) }]
      : []),
    ...(hiringOnly
      ? [{ label: "Hiring now", clear: () => setHiringOnly(false) }]
      : []),
    ...(followedOnly
      ? [{ label: "Following only", clear: () => setFollowedOnly(false) }]
      : []),
  ];

  const clearAll = () => {
    setQuery("");
    setPickedIndustries([]);
    setBands([]);
    setMinRating(0);
    setHiringOnly(false);
    setFollowedOnly(false);
  };

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-18">
        <Card>
          <CardContent className="grid gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Filters</span>
              {chips.length > 0 && (
                <Button variant="ghost" size="xs" onClick={clearAll}>
                  Clear all
                </Button>
              )}
            </div>

            <div className="grid gap-2">
              <Label className="text-xs text-muted-foreground">Industry</Label>
              {industries.map(({ industry, count }) => (
                <label
                  key={industry}
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <Checkbox
                    checked={pickedIndustries.includes(industry)}
                    onCheckedChange={() =>
                      toggle(industry, pickedIndustries, setPickedIndustries)
                    }
                  />
                  <span className="flex-1 truncate">{industry}</span>
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    {count}
                  </span>
                </label>
              ))}
            </div>

            <Separator />

            <div className="grid gap-2">
              <Label className="text-xs text-muted-foreground">
                Company size
              </Label>
              {sizeBands.map((band) => (
                <label
                  key={band}
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <Checkbox
                    checked={bands.includes(band)}
                    onCheckedChange={() => toggle(band, bands, setBands)}
                  />
                  <span className="flex-1">{band}</span>
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    {directory.filter((entry) => entry.band === band).length}
                  </span>
                </label>
              ))}
            </div>

            <Separator />

            <div className="grid gap-2">
              <div className="flex items-baseline justify-between">
                <Label className="text-xs text-muted-foreground">
                  Minimum rating
                </Label>
                <span className="font-mono text-xs tabular-nums">
                  {minRating === 0 ? "Any" : minRating.toFixed(1)}
                </span>
              </div>
              <Slider
                value={[minRating]}
                onValueChange={([value]) => setMinRating(value)}
                min={0}
                max={5}
                step={0.5}
                aria-label="Minimum rating"
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="hiring-only" className="text-sm font-normal">
                Hiring right now
              </Label>
              <Switch
                id="hiring-only"
                checked={hiringOnly}
                onCheckedChange={setHiringOnly}
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="followed-only" className="text-sm font-normal">
                Only companies I follow
              </Label>
              <Switch
                id="followed-only"
                checked={followedOnly}
                onCheckedChange={setFollowedOnly}
              />
            </div>
          </CardContent>
        </Card>
      </aside>

      <div className="grid min-w-0 gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search companies by name, industry or city"
            className="pl-8"
            aria-label="Search companies"
          />
        </div>

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
            {results.length === 1 ? "company" : "companies"}
          </p>

          <div className="flex items-center gap-1.5">
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger size="sm" className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="roles">Most open roles</SelectItem>
                <SelectItem value="match">Best match for you</SelectItem>
                <SelectItem value="rating">Highest rated</SelectItem>
                <SelectItem value="name">Name A–Z</SelectItem>
              </SelectContent>
            </Select>

            <ToggleGroup
              type="single"
              value={view}
              onValueChange={(value) => value && setView(value)}
              variant="outline"
              size="sm"
            >
              <ToggleGroupItem value="grid" aria-label="Grid view">
                <LayoutGrid />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view">
                <Rows3 />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="grid justify-items-center gap-2 rounded-xl border border-dashed px-6 py-16 text-center">
            <p className="font-heading text-sm font-medium">
              No companies match these filters
            </p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Try a lower rating floor or clear the industry filter.
            </p>
            <Button size="sm" className="mt-1" onClick={clearAll}>
              Clear all filters
            </Button>
          </div>
        ) : view === "grid" ? (
          <div className={cn("grid gap-3 md:grid-cols-2 2xl:grid-cols-3")}>
            {results.map((entry) => (
              <CompanyCard key={entry.company.id} entry={entry} />
            ))}
          </div>
        ) : (
          <CompaniesTable entries={results} />
        )}
      </div>
    </div>
  );
}
