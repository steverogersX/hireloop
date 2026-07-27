import type { Metadata } from "next";
import Link from "next/link";
import { Bell } from "lucide-react";

import { CompanyBrowser } from "@/components/companies/company-browser";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { companyDirectory } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Companies — HireLoop",
  description:
    "Browse companies hiring on HireLoop, filter by industry, size and rating.",
};

export default function CompaniesPage() {
  const directory = companyDirectory();
  const totalRoles = directory.reduce((sum, entry) => sum + entry.openRoles, 0);

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
            <BreadcrumbPage>Companies</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="grid gap-1">
          <h1 className="font-heading text-2xl leading-tight font-semibold tracking-tight">
            Companies
          </h1>
          <p className="text-sm text-muted-foreground">
            <span className="font-mono text-foreground tabular-nums">
              {directory.length}
            </span>{" "}
            companies hiring, with{" "}
            <span className="font-mono text-foreground tabular-nums">
              {totalRoles}
            </span>{" "}
            open roles between them.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/alerts">
            <Bell />
            Manage job alerts
          </Link>
        </Button>
      </header>

      <CompanyBrowser />
    </div>
  );
}
