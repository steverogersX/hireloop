import Link from "next/link";
import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function JobNotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
      <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
        404
      </p>
      <h1 className="font-heading text-xl font-semibold tracking-tight">
        This role is no longer listed
      </h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        The company may have closed it or filled it. Your saved roles and
        applications are unaffected.
      </p>
      <Button asChild className="mt-1">
        <Link href="/dashboard">
          <Compass />
          Back to recommended roles
        </Link>
      </Button>
    </div>
  );
}
