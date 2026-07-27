import Link from "next/link";
import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";

export function NotFoundState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: { label: string; href: string };
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
      <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
        404
      </p>
      <h1 className="font-heading text-xl font-semibold tracking-tight">
        {title}
      </h1>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      <Button asChild className="mt-1">
        <Link href={action.href}>
          <Compass />
          {action.label}
        </Link>
      </Button>
    </div>
  );
}
