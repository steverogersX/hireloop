import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Bookmark } from "lucide-react";

import { JobBrowser } from "@/components/jobs/job-browser";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { getJobs } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Find jobs — HireLoop",
  description:
    "Filter open roles by workplace, level, salary and how well they match your profile.",
};

export default async function JobsPage() {
  const { items } = await getJobs({ sort: "match", limit: 100 });

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
            <BreadcrumbPage>Find jobs</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="grid gap-1">
          <h1 className="font-heading text-2xl leading-tight font-semibold tracking-tight">
            Find jobs
          </h1>
          <p className="text-sm text-muted-foreground">
            Every filter here is live. Scores are calculated against your profile,
            not the job title.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/saved">
            <Bookmark />
            Saved searches
          </Link>
        </Button>
      </header>

      <Suspense fallback={null}>
        <JobBrowser jobs={items} />
      </Suspense>
    </div>
  );
}
