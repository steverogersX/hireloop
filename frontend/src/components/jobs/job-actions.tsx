"use client";

import { useState } from "react";
import { Bookmark, Check, Link2, Send, Share2, Zap } from "lucide-react";
import { toast } from "sonner";

import { ApplyForm } from "@/components/jobs/apply-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatSalary, type Job } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function JobActions({
  job,
  className,
}: {
  job: Job;
  className?: string;
}) {
  const [saved, setSaved] = useState(job.saved);

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Button
        variant="outline"
        onClick={() => {
          setSaved(!saved);
          toast(saved ? "Removed from saved" : "Saved to your list");
        }}
        aria-pressed={saved}
      >
        <Bookmark className={cn(saved && "fill-current text-primary")} />
        {saved ? "Saved" : "Save"}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Share this role">
            <Share2 />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => toast("Link copied to clipboard")}>
            <Link2 />
            Copy link
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => toast("Draft opened in email")}>
            <Send />
            Email to a friend
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ApplySheet job={job} />
    </div>
  );
}

export function ApplySheet({
  job,
  trigger,
}: {
  job: Job;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  if (job.applied || sent) {
    return (
      <Button disabled>
        <Check />
        Applied
      </Button>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger ?? (
          <Button>
            {job.easyApply && <Zap />}
            {job.easyApply ? "Quick apply" : "Apply now"}
          </Button>
        )}
      </SheetTrigger>

      <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-lg">
        <SheetHeader className="border-b">
          <SheetTitle>Apply to {job.title}</SheetTitle>
          <SheetDescription>
            {job.company.name} · {job.location} · {formatSalary(job)}
          </SheetDescription>
        </SheetHeader>

        <ApplyForm
          job={job}
          onSubmitted={() => {
            setOpen(false);
            setSent(true);
            toast.success("Application sent", {
              description: `${job.company.name} usually replies within a few days.`,
            });
          }}
        />
      </SheetContent>
    </Sheet>
  );
}

export function StickyApplyBar({ job }: { job: Job }) {
  return (
    <div className="sticky bottom-0 z-10 -mx-4 mt-2 flex items-center gap-3 border-t bg-background/90 px-4 py-3 backdrop-blur-md sm:-mx-5 sm:px-5 xl:hidden">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{job.title}</p>
        <p className="truncate font-mono text-xs text-muted-foreground tabular-nums">
          {formatSalary(job)} · {job.company.name}
        </p>
      </div>
      {job.easyApply && !job.applied && (
        <Badge className="hidden bg-chart-2/15 text-chart-2 sm:inline-flex">
          <Zap />
          Quick apply
        </Badge>
      )}
      <ApplySheet job={job} />
    </div>
  );
}
