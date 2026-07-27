"use client";

import { useForm } from "@tanstack/react-form";
import { AlertCircle, Save } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { recruiter } from "@/lib/recruiter-mock-data";

const accountSchema = z.object({
  name: z.string().min(2, "Add your full name"),
  title: z.string().min(2, "Candidates see this on your outreach"),
  email: z.string().email("Enter a valid work email"),
});

type AccountValues = z.infer<typeof accountSchema>;

export function AccountForm() {
  const form = useForm({
    defaultValues: {
      name: recruiter.name,
      title: recruiter.title,
      email: recruiter.email,
    } as AccountValues,
    validators: { onChange: accountSchema },
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success("Account updated");
    },
  });

  return (
    <form
      className="grid gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <form.Field name="name">
          {(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Full name</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={!field.state.meta.isValid}
              />
              <FieldError field={field} />
            </div>
          )}
        </form.Field>

        <form.Field name="title">
          {(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Job title</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={!field.state.meta.isValid}
              />
              <FieldError field={field} />
            </div>
          )}
        </form.Field>

        <form.Field name="email">
          {(field) => (
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor={field.name}>Work email</Label>
              <Input
                id={field.name}
                name={field.name}
                type="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={!field.state.meta.isValid}
              />
              <FieldError field={field} />
            </div>
          )}
        </form.Field>
      </div>

      <div className="flex justify-end">
        <form.Subscribe
          selector={(state) => ({
            canSubmit: state.canSubmit,
            isSubmitting: state.isSubmitting,
          })}
        >
          {({ canSubmit, isSubmitting }) => (
            <Button type="submit" disabled={!canSubmit || isSubmitting}>
              <Save />
              {isSubmitting ? "Saving…" : "Save changes"}
            </Button>
          )}
        </form.Subscribe>
      </div>
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
