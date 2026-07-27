import Link from "next/link";
import { Users } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ApplicantNotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
      <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
        404
      </p>
      <h1 className="font-heading text-xl font-semibold tracking-tight">
        This applicant is not in your pipeline
      </h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        They may have withdrawn, or the application belongs to another company
        in your account.
      </p>
      <Button asChild className="mt-1">
        <Link href="/recruiter/applicants">
          <Users />
          Back to applicants
        </Link>
      </Button>
    </div>
  );
}
