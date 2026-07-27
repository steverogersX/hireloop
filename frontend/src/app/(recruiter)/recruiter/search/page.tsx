import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";

import { TalentSearch } from "@/components/recruiter/talent-search";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { billing } from "@/lib/recruiter-mock-data";

export const metadata: Metadata = {
  title: "Talent search — HireLoop",
  description: "Search the candidate pool and reach out directly.",
};

export default function TalentSearchPage() {
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
            <BreadcrumbPage>Talent search</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="grid gap-1">
          <h1 className="font-heading text-2xl leading-tight font-semibold tracking-tight">
            Talent search
          </h1>
          <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            Reach people who will never see your job board post.
            <Badge variant="outline" className="border-chart-5/40 text-chart-5">
              {billing.creditsLeft} of {billing.creditsTotal} credits left
            </Badge>
          </p>
        </div>

        <Button variant="outline" asChild>
          <Link href="/recruiter/settings">
            <Sparkles />
            Top up credits
          </Link>
        </Button>
      </header>

      <TalentSearch />
    </div>
  );
}
