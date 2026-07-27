import Link from "next/link";
import { Briefcase } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function PostingNotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
      <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
        404
      </p>
      <h1 className="font-heading text-xl font-semibold tracking-tight">
        This posting no longer exists
      </h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        It may have been deleted by a teammate. Applicants who already applied
        are still in your pipeline.
      </p>
      <Button asChild className="mt-1">
        <Link href="/recruiter/jobs">
          <Briefcase />
          Back to job postings
        </Link>
      </Button>
    </div>
  );
}
