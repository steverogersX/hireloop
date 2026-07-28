"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { AlertCircle, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { mutate } from "@/lib/client-api";
import type { ProfilePayload } from "@/types/api";

const BIO_LIMIT = 800;

const profileSchema = z.object({
  name: z.string().min(2, "Your name needs at least two characters"),
  headline: z
    .string()
    .min(4, "A headline helps recruiters place you")
    .max(90, "Keep the headline under 90 characters"),
  location: z.string().min(2, "Where are you based?"),
  email: z.string().email("That does not look like an email address"),
  phone: z.string(),
  website: z.string(),
  github: z.string(),
  linkedin: z.string(),
  bio: z.string().max(BIO_LIMIT, `Keep your bio under ${BIO_LIMIT} characters`),
  skills: z.array(z.string()).min(3, "Add at least three skills"),
  openToWork: z.boolean(),
  noticePeriod: z.string(),
  desiredRole: z.string().min(2, "What role are you looking for?"),
  salaryExpectation: z
    .string()
    .min(1, "Recruiters filter on this — a number helps")
    .refine((value) => Number(value.replace(/\D/g, "")) >= 1000, {
      message: "Enter a yearly amount, for example 95000",
    }),
  workplace: z.string(),
  willRelocate: z.boolean(),
});

type ProfileValues = z.infer<typeof profileSchema>;

export function ProfileForm({ profile }: { profile: ProfilePayload }) {
  const router = useRouter();
  const [skillDraft, setSkillDraft] = useState("");

  const form = useForm({
    defaultValues: {
      name: profile.user.name,
      headline: profile.user.headline ?? "",
      location: profile.user.location ?? "",
      email: profile.user.email,
      phone: profile.profile.phone ?? "",
      website: profile.profile.website ?? "",
      github: profile.profile.github ?? "",
      linkedin: profile.profile.linkedin ?? "",
      bio: profile.profile.bio ?? "",
      skills: profile.profile.skills,
      openToWork: profile.profile.openToWork,
      noticePeriod: profile.profile.noticePeriod ?? "1 month",
      desiredRole: profile.profile.desiredRole ?? "",
      salaryExpectation: profile.profile.salaryExpectation
        ? String(profile.profile.salaryExpectation)
        : "",
      workplace: (profile.profile.preferredWorkMode ?? "HYBRID").toLowerCase(),
      willRelocate: profile.profile.willRelocate,
    } as ProfileValues,
    validators: { onChange: profileSchema },
    onSubmit: async ({ value }) => {
      await mutate("/profile", "PATCH", {
        name: value.name,
        headline: value.headline,
        location: value.location,
        bio: value.bio,
        phone: value.phone,
        website: value.website,
        github: value.github,
        linkedin: value.linkedin,
        skills: value.skills,
        desiredRole: value.desiredRole,
        salaryExpectation:
          Number(value.salaryExpectation.replace(/\D/g, "")) || undefined,
        preferredWorkMode: value.workplace.toUpperCase(),
        noticePeriod: value.noticePeriod,
        openToWork: value.openToWork,
        willRelocate: value.willRelocate,
      });
      form.reset(value);
      router.refresh();
      toast.success("Profile saved", {
        description: "Recruiters searching now will see the updated version.",
      });
    },
  });

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit();
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Basics</CardTitle>
          <CardDescription>
            This is what a recruiter sees first in search results.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <form.Field name="name">
            {(field) => (
              <Field label="Full name" field={field}>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={!field.state.meta.isValid}
                />
              </Field>
            )}
          </form.Field>

          <form.Field name="headline">
            {(field) => (
              <Field
                label="Headline"
                field={field}
                hint={`${field.state.value.length}/90`}
              >
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={!field.state.meta.isValid}
                />
              </Field>
            )}
          </form.Field>

          <form.Field name="location">
            {(field) => (
              <Field label="Location" field={field}>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </Field>
            )}
          </form.Field>

          <form.Field name="email">
            {(field) => (
              <Field label="Email" field={field}>
                <Input
                  id={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={!field.state.meta.isValid}
                />
              </Field>
            )}
          </form.Field>

          <form.Field name="phone">
            {(field) => (
              <Field label="Phone" field={field} hint="Optional">
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </Field>
            )}
          </form.Field>

          <form.Field name="website">
            {(field) => (
              <Field label="Portfolio" field={field}>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="yourname.dev"
                />
              </Field>
            )}
          </form.Field>

          <form.Field name="github">
            {(field) => (
              <Field label="GitHub" field={field}>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </Field>
            )}
          </form.Field>

          <form.Field name="linkedin">
            {(field) => (
              <Field label="LinkedIn" field={field}>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </Field>
            )}
          </form.Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About you</CardTitle>
          <CardDescription>
            Two or three sentences on what you do and what you want next.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form.Field name="bio">
            {(field) => (
              <Field
                label="Bio"
                field={field}
                hint={`${field.state.value.length}/${BIO_LIMIT}`}
              >
                <Textarea
                  id={field.name}
                  rows={5}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </Field>
            )}
          </form.Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
          <CardDescription>
            These drive your match score. Put the ones you want to be hired for
            first.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form.Field name="skills" mode="array">
            {(field) => {
              const addSkill = () => {
                const value = skillDraft.trim();
                if (!value) return;
                if (field.state.value.includes(value)) {
                  toast(`${value} is already on your profile`);
                  setSkillDraft("");
                  return;
                }
                field.pushValue(value);
                setSkillDraft("");
              };

              return (
                <div className="grid gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {field.state.value.map((skill, index) => (
                      <Badge key={skill} variant="secondary" className="pr-1">
                        {skill}
                        <button
                          type="button"
                          onClick={() => field.removeValue(index)}
                          aria-label={`Remove ${skill}`}
                          className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                        >
                          <X className="size-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      value={skillDraft}
                      onChange={(event) => setSkillDraft(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          addSkill();
                        }
                      }}
                      placeholder="Add a skill and press Enter"
                      aria-label="Add a skill"
                      className="max-w-64"
                    />
                    <Button type="button" variant="outline" onClick={addSkill}>
                      <Plus />
                      Add
                    </Button>
                  </div>

                  <FieldError field={field} />
                </div>
              );
            }}
          </form.Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What you are looking for</CardTitle>
          <CardDescription>
            Used to rank roles in your feed. Never shown next to your name
            unless you allow it.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <form.Field name="desiredRole">
            {(field) => (
              <Field label="Desired role" field={field}>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </Field>
            )}
          </form.Field>

          <form.Field name="salaryExpectation">
            {(field) => (
              <Field
                label="Salary expectation"
                field={field}
                hint="Yearly, gross"
              >
                <Input
                  id={field.name}
                  inputMode="numeric"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="€95000"
                  aria-invalid={!field.state.meta.isValid}
                />
              </Field>
            )}
          </form.Field>

          <form.Field name="workplace">
            {(field) => (
              <Field label="Preferred workplace" field={field}>
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger id={field.name} className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote only</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="onsite">On-site</SelectItem>
                    <SelectItem value="any">No preference</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )}
          </form.Field>

          <form.Field name="noticePeriod">
            {(field) => (
              <Field label="Notice period" field={field}>
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger id={field.name} className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Immediate">Available now</SelectItem>
                    <SelectItem value="2 weeks">2 weeks</SelectItem>
                    <SelectItem value="1 month">1 month</SelectItem>
                    <SelectItem value="3 months">3 months</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )}
          </form.Field>

          <form.Field name="openToWork">
            {(field) => (
              <ToggleRow
                id={field.name}
                label="Open to work"
                detail="Shows an open-to-work badge to recruiters."
                checked={field.state.value}
                onChange={field.handleChange}
              />
            )}
          </form.Field>

          <form.Field name="willRelocate">
            {(field) => (
              <ToggleRow
                id={field.name}
                label="Open to relocating"
                detail="Includes roles outside your current city."
                checked={field.state.value}
                onChange={field.handleChange}
              />
            )}
          </form.Field>
        </CardContent>
      </Card>

      <form.Subscribe
        selector={(state) => ({
          canSubmit: state.canSubmit,
          isSubmitting: state.isSubmitting,
          isDirty: state.isDirty,
        })}
      >
        {({ canSubmit, isSubmitting, isDirty }) => (
          <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t bg-background/90 px-4 py-3 backdrop-blur-md sm:-mx-5 sm:px-5">
            <p className="text-sm text-muted-foreground">
              {isDirty ? "You have unsaved changes" : "Everything is saved"}
            </p>
            <div className="ml-auto flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                disabled={!isDirty || isSubmitting}
                onClick={() => form.reset()}
              >
                Discard
              </Button>
              <Button type="submit" disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? "Saving…" : "Save profile"}
              </Button>
            </div>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}

type FieldLike = {
  name: string;
  state: {
    meta: { isTouched: boolean; isValid: boolean; errors: unknown[] };
  };
};

function Field({
  label,
  hint,
  field,
  children,
}: {
  label: string;
  hint?: string;
  field: FieldLike;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={field.name}>
        {label}
        {hint && (
          <span className="ml-auto font-mono text-xs font-normal text-muted-foreground tabular-nums">
            {hint}
          </span>
        )}
      </Label>
      {children}
      <FieldError field={field} />
    </div>
  );
}

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

function ToggleRow({
  id,
  label,
  detail,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  detail: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg bg-muted/60 p-3">
      <div className="grid gap-0.5">
        <Label htmlFor={id} className="font-medium">
          {label}
        </Label>
        <span className="text-xs text-muted-foreground">{detail}</span>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
