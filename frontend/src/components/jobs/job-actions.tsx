"use client";

import { useState } from "react";
import {
  Bookmark,
  Check,
  Link2,
  Paperclip,
  Send,
  Share2,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { candidate, formatSalary, type Job } from "@/lib/mock-data";
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
          <DropdownMenuItem
            onSelect={() => toast("Link copied to clipboard")}
          >
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

  if (job.applied) {
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

        <form
          className="grid gap-5 p-4"
          onSubmit={(event) => {
            event.preventDefault();
            setOpen(false);
            toast.success("Application sent", {
              description: `${job.company.name} usually replies within a few days.`,
            });
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="apply-resume">Resume</Label>
            <Select defaultValue="primary">
              <SelectTrigger id="apply-resume" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">
                  priya-raman-frontend.pdf · updated 4 days ago
                </SelectItem>
                <SelectItem value="platform">
                  priya-raman-platform.pdf · updated in June
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Paperclip className="size-3.5" />
              Or upload a different file for this application.
            </p>
          </div>

          <Separator />

          <div className="grid gap-2">
            <Label htmlFor="apply-note">
              Note to the hiring team
              <span className="font-normal text-muted-foreground">
                Optional
              </span>
            </Label>
            <Textarea
              id="apply-note"
              rows={5}
              placeholder={`Why this role at ${job.company.name}, in a few lines.`}
              defaultValue=""
            />
            <p className="text-xs text-muted-foreground">
              Applications with a note get a reply 2.4× more often.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="apply-notice">Earliest start</Label>
            <Select defaultValue="notice">
              <SelectTrigger id="apply-notice" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediately">Immediately</SelectItem>
                <SelectItem value="notice">
                  After {candidate.noticePeriod} notice
                </SelectItem>
                <SelectItem value="two-months">In two months</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="apply-salary">Salary expectation</Label>
            <Input
              id="apply-salary"
              inputMode="numeric"
              placeholder={`${job.currency}${job.salaryMin.toLocaleString()}`}
            />
          </div>

          <Separator />

          <div className="grid gap-3">
            <p className="text-sm font-medium">Screening questions</p>
            <label className="flex items-start gap-2.5 text-sm">
              <Checkbox defaultChecked className="mt-0.5" />
              <span>
                I have the right to work in {job.location.split(",")[0]} without
                sponsorship.
              </span>
            </label>
            <label className="flex items-start gap-2.5 text-sm">
              <Checkbox className="mt-0.5" />
              <span>
                Share my profile with {job.company.name} recruiters for other
                open roles.
              </span>
            </label>
          </div>

          <SheetFooter className="flex-row justify-end gap-2 px-0">
            <SheetClose asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </SheetClose>
            <Button type="submit">
              <Send />
              Send application
            </Button>
          </SheetFooter>
        </form>
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
