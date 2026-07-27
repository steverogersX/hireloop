import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bell, Search } from "lucide-react";

import { SavedBrowser } from "@/components/saved/saved-browser";
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
import { savedJobs, savedSearches } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Saved jobs — HireLoop",
  description: "Roles you saved, the notes you left, and your saved searches.",
};

export default function SavedPage() {
  const rows = savedJobs();
  const closing = rows.filter((row) => row.entry.closingIn).length;

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
            <BreadcrumbPage>Saved jobs</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="grid gap-1">
          <h1 className="font-heading text-2xl leading-tight font-semibold tracking-tight">
            Saved jobs
          </h1>
          <p className="text-sm text-muted-foreground">
            <span className="font-mono text-foreground tabular-nums">
              {rows.length}
            </span>{" "}
            roles saved, {closing} closing within two weeks.
          </p>
        </div>
        <Button asChild>
          <Link href="/jobs">
            <Search />
            Find more roles
          </Link>
        </Button>
      </header>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="min-w-0">
          <SavedBrowser />
        </div>

        <aside className="grid gap-4 xl:sticky xl:top-18">
          <Card>
            <CardHeader>
              <CardTitle>Saved searches</CardTitle>
              <CardDescription>
                Filters you kept, re-run every morning
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-1">
              {savedSearches.map((search) => (
                <Link
                  key={search.id}
                  href="/jobs"
                  className="grid gap-0.5 rounded-lg px-2 py-2 transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <span className="flex items-center gap-2 text-sm font-medium">
                    {search.name}
                    {search.newCount > 0 && (
                      <Badge className="bg-chart-5/12 font-mono text-chart-5">
                        {search.newCount} new
                      </Badge>
                    )}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {search.detail}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {search.runAt}
                  </span>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Turn a search into an alert</CardTitle>
              <CardDescription>
                Get matching roles the morning they are posted, instead of
                checking back.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/alerts">
                  <Bell />
                  Manage job alerts
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
