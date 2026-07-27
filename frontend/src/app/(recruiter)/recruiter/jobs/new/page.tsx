import type { Metadata } from "next";
import Link from "next/link";

import { PostJobForm } from "@/components/recruiter/post-job-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { billing } from "@/lib/recruiter-mock-data";

export const metadata: Metadata = {
  title: "Post a job — HireLoop",
  description: "Create a new job posting for your company.",
};

export default function NewPostingPage() {
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
            <BreadcrumbLink asChild>
              <Link href="/recruiter/jobs">Job postings</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Post a job</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="grid gap-1">
        <h1 className="font-heading text-2xl leading-tight font-semibold tracking-tight">
          Post a job
        </h1>
        <p className="text-sm text-muted-foreground">
          Using {billing.jobSlotsUsed} of {billing.jobSlotsTotal} job slots on
          the {billing.plan} plan
        </p>
      </header>

      <div className="max-w-3xl">
        <PostJobForm />
      </div>
    </div>
  );
}
