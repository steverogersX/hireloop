import Link from "next/link";
import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function CompanyNotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
      <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
        404
      </p>
      <h1 className="font-heading text-xl font-semibold tracking-tight">
        No company profile here
      </h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        This company has not claimed a HireLoop profile, or the link has
        changed.
      </p>
      <Button asChild className="mt-1">
        <Link href="/jobs">
          <Compass />
          Browse open roles
        </Link>
      </Button>
    </div>
  );
}
