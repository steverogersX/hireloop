"use client";

import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { AlertCircle, Paperclip, Send } from "lucide-react";
import { z } from "zod";

import { mutate } from "@/lib/client-api";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { currencySymbol } from "@/lib/format";
import type { ScoredJob } from "@/types/api";

const NOTE_LIMIT = 1200;

const applicationSchema = z.object({
  resume: z.string().min(1, "Pick the resume to send"),
  note: z
    .string()
    .max(NOTE_LIMIT, `Keep the note under ${NOTE_LIMIT} characters`),
  start: z.string().min(1, "Tell them when you could start"),
  salary: z
    .string()
    .min(1, "Add a number so recruiters can match your range")
    .refine((value) => Number(value.replace(/\D/g, "")) >= 1000, {
      message: "Enter a yearly amount, for example 90000",
    }),
  workAuthorized: z.boolean(),
  shareProfile: z.boolean(),
});

export type ApplicationValues = z.infer<typeof applicationSchema>;

export function ApplyForm({
  job,
  onSubmitted,
}: {
  job: ScoredJob;
  onSubmitted: (values: ApplicationValues) => void;
}) {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      resume: "primary",
      note: "",
      start: "notice",
      salary: "",
      workAuthorized: true,
      shareProfile: false,
    } as ApplicationValues,
    validators: { onChange: applicationSchema },
    onSubmit: async ({ value }) => {
      await mutate("/applications", "POST", {
        jobId: job.id,
        coverLetter: value.note || undefined,
        salaryExpectation: Number(value.salary.replace(/\D/g, "")) || undefined,
        availableFrom: value.start,
        source: "DIRECT",
      });
      router.refresh();
      onSubmitted(value);
    },
  });

  return (
    <form
      className="grid gap-5 p-4"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.Field name="resume">
        {(field) => (
          <div className="grid gap-2">
            <Label htmlFor={field.name}>Resume</Label>
            <Select
              value={field.state.value}
              onValueChange={field.handleChange}
            >
              <SelectTrigger id={field.name} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">
                  Default resume on your profile
                </SelectItem>
                <SelectItem value="platform">
                  Platform resume
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Paperclip className="size-3.5" />
              Or upload a different file for this application.
            </p>
            <FieldError field={field} />
          </div>
        )}
      </form.Field>

      <Separator />

      <form.Field name="note">
        {(field) => (
          <div className="grid gap-2">
            <Label htmlFor={field.name}>
              Note to the hiring team
              <span className="font-normal text-muted-foreground">
                Optional
              </span>
            </Label>
            <Textarea
              id={field.name}
              name={field.name}
              rows={5}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              placeholder={`Why this role at ${job.company.name}, in a few lines.`}
            />
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">
                Applications with a note get a reply 2.4× more often.
              </p>
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                {field.state.value.length}/{NOTE_LIMIT}
              </span>
            </div>
            <FieldError field={field} />
          </div>
        )}
      </form.Field>

      <form.Field name="start">
        {(field) => (
          <div className="grid gap-2">
            <Label htmlFor={field.name}>Earliest start</Label>
            <Select
              value={field.state.value}
              onValueChange={field.handleChange}
            >
              <SelectTrigger id={field.name} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediately">Immediately</SelectItem>
                <SelectItem value="notice">
                  After my notice period
                </SelectItem>
                <SelectItem value="two-months">In two months</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
            <FieldError field={field} />
          </div>
        )}
      </form.Field>

      <form.Field name="salary">
        {(field) => (
          <div className="grid gap-2">
            <Label htmlFor={field.name}>Salary expectation</Label>
            <Input
              id={field.name}
              name={field.name}
              inputMode="numeric"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              placeholder={`${currencySymbol(job.currency)}${(job.salaryMin ?? 0).toLocaleString()}`}
              aria-invalid={!field.state.meta.isValid}
            />
            {job.salaryMin != null && job.salaryMax != null && (
              <p className="text-xs text-muted-foreground">
                This role is listed at {currencySymbol(job.currency)}
                {job.salaryMin.toLocaleString()}–{job.salaryMax.toLocaleString()}.
              </p>
            )}
            <FieldError field={field} />
          </div>
        )}
      </form.Field>

      <Separator />

      <div className="grid gap-3">
        <p className="text-sm font-medium">Screening questions</p>

        <form.Field name="workAuthorized">
          {(field) => (
            <label className="flex items-start gap-2.5 text-sm">
              <Checkbox
                checked={field.state.value}
                onCheckedChange={(value) => field.handleChange(value === true)}
                className="mt-0.5"
              />
              <span>
                I have the right to work in {job.location.split(",")[0]} without
                sponsorship.
              </span>
            </label>
          )}
        </form.Field>

        <form.Field name="shareProfile">
          {(field) => (
            <label className="flex items-start gap-2.5 text-sm">
              <Checkbox
                checked={field.state.value}
                onCheckedChange={(value) => field.handleChange(value === true)}
                className="mt-0.5"
              />
              <span>
                Share my profile with {job.company.name} recruiters for other
                open roles.
              </span>
            </label>
          )}
        </form.Field>
      </div>

      <SheetFooter className="flex-row justify-end gap-2 px-0">
        <SheetClose asChild>
          <Button type="button" variant="ghost">
            Cancel
          </Button>
        </SheetClose>
        <form.Subscribe
          selector={(state) => ({
            canSubmit: state.canSubmit,
            isSubmitting: state.isSubmitting,
          })}
        >
          {({ canSubmit, isSubmitting }) => (
            <Button type="submit" disabled={!canSubmit || isSubmitting}>
              <Send />
              {isSubmitting ? "Sending…" : "Send application"}
            </Button>
          )}
        </form.Subscribe>
      </SheetFooter>
    </form>
  );
}

type FieldLike = {
  state: {
    meta: { isTouched: boolean; isValid: boolean; errors: unknown[] };
  };
};

function FieldError({ field }: { field: FieldLike }) {
  const { isTouched, isValid, errors } = field.state.meta;
  if (!isTouched || isValid) return null;

  const message = errors
    .map((error) =>
      typeof error === "string"
        ? error
        : ((error as { message?: string })?.message ?? "")
    )
    .filter(Boolean)[0];

  if (!message) return null;

  return (
    <p className="flex items-center gap-1.5 text-xs text-destructive">
      <AlertCircle className="size-3.5" />
      {message}
    </p>
  );
}
