"use client";

import { useForm } from "@tanstack/react-form";
import { AlertCircle, Plus, Save, X } from "lucide-react";
import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { companyProfile, employer } from "@/lib/recruiter-mock-data";

const ABOUT_MIN = 60;

const companySchema = z.object({
  name: z.string().min(2, "Your company needs a name"),
  tagline: z.string().min(4, "One line candidates will remember"),
  about: z
    .string()
    .min(ABOUT_MIN, `Write at least ${ABOUT_MIN} characters`),
  website: z.string().min(4, "Add your website"),
  industry: z.string().min(2, "Add an industry"),
  size: z.string().min(1, "Pick a headcount range"),
  hq: z.string().min(2, "Where are you based?"),
  founded: z.string().min(4, "Four digits, for example 2018"),
  linkedin: z.string(),
  benefits: z.array(z.string()).min(1, "List at least one benefit"),
});

type CompanyValues = z.infer<typeof companySchema>;

export function CompanyForm() {
  const [benefitDraft, setBenefitDraft] = useState("");

  const form = useForm({
    defaultValues: {
      name: employer.name,
      tagline: companyProfile.tagline,
      about: companyProfile.about,
      website: companyProfile.website,
      industry: employer.industry,
      size: employer.size,
      hq: employer.hq,
      founded: companyProfile.founded,
      linkedin: companyProfile.linkedin,
      benefits: companyProfile.benefits,
    } as CompanyValues,
    validators: { onChange: companySchema },
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success("Company profile saved", {
        description: "Candidates see the update immediately.",
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
          <CardTitle>Public profile</CardTitle>
          <CardDescription>
            What candidates read before they decide to apply
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <form.Field name="name">
              {(field) => (
                <div className="grid gap-2">
                  <Label htmlFor={field.name}>Company name</Label>
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

            <form.Field name="website">
              {(field) => (
                <div className="grid gap-2">
                  <Label htmlFor={field.name}>Website</Label>
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
          </div>

          <form.Field name="tagline">
            {(field) => (
              <div className="grid gap-2">
                <Label htmlFor={field.name}>Tagline</Label>
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

          <form.Field name="about">
            {(field) => (
              <div className="grid gap-2">
                <Label htmlFor={field.name}>About</Label>
                <Textarea
                  id={field.name}
                  name={field.name}
                  rows={6}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-muted-foreground">
                    Say what the company does and what working here is like.
                  </p>
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    {field.state.value.length}
                  </span>
                </div>
                <FieldError field={field} />
              </div>
            )}
          </form.Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Company details</CardTitle>
          <CardDescription>
            Shown as facts on your profile and every posting
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <form.Field name="industry">
            {(field) => (
              <div className="grid gap-2">
                <Label htmlFor={field.name}>Industry</Label>
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

          <form.Field name="size">
            {(field) => (
              <div className="grid gap-2">
                <Label htmlFor={field.name}>Headcount</Label>
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger id={field.name} className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1–20">1–20</SelectItem>
                    <SelectItem value="20–80">20–80</SelectItem>
                    <SelectItem value="180–400">180–400</SelectItem>
                    <SelectItem value="400–1,000">400–1,000</SelectItem>
                    <SelectItem value="1,000+">1,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>

          <form.Field name="hq">
            {(field) => (
              <div className="grid gap-2">
                <Label htmlFor={field.name}>Headquarters</Label>
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

          <form.Field name="founded">
            {(field) => (
              <div className="grid gap-2">
                <Label htmlFor={field.name}>Founded</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  inputMode="numeric"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={!field.state.meta.isValid}
                />
                <FieldError field={field} />
              </div>
            )}
          </form.Field>

          <form.Field name="linkedin">
            {(field) => (
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor={field.name}>
                  LinkedIn
                  <span className="font-normal text-muted-foreground">
                    Optional
                  </span>
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </div>
            )}
          </form.Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Benefits</CardTitle>
          <CardDescription>
            Specific beats generous — name the number where you can
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <form.Field name="benefits">
            {(field) => (
              <div className="grid gap-3">
                <div className="flex gap-2">
                  <Input
                    id="benefit-input"
                    value={benefitDraft}
                    onChange={(event) => setBenefitDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter") return;
                      event.preventDefault();
                      const value = benefitDraft.trim();
                      if (!value) return;
                      field.handleChange([...field.state.value, value]);
                      setBenefitDraft("");
                    }}
                    placeholder="€2,500 yearly learning budget"
                    aria-label="Add a benefit"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const value = benefitDraft.trim();
                      if (!value) return;
                      field.handleChange([...field.state.value, value]);
                      setBenefitDraft("");
                    }}
                  >
                    <Plus />
                    Add
                  </Button>
                </div>

                <ul className="grid gap-2">
                  {field.state.value.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-center gap-2.5 rounded-lg border p-2.5 text-sm"
                    >
                      <span className="flex-1 text-muted-foreground">
                        {benefit}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        aria-label={`Remove ${benefit}`}
                        onClick={() =>
                          field.handleChange(
                            field.state.value.filter((item) => item !== benefit)
                          )
                        }
                      >
                        <X />
                      </Button>
                    </li>
                  ))}
                </ul>

                <FieldError field={field} />
              </div>
            )}
          </form.Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Values</CardTitle>
          <CardDescription>
            Shown on your profile under the about section
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {companyProfile.values.map((value) => (
            <div key={value.title} className="grid gap-1 rounded-lg border p-3">
              <p className="flex items-center gap-2 text-sm font-medium">
                {value.title}
                <Badge variant="outline" className="text-muted-foreground">
                  Published
                </Badge>
              </p>
              <p className="text-sm text-muted-foreground">{value.detail}</p>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() =>
              toast("Add a value", {
                description: "Values show on your profile under the about section.",
              })
            }
          >
            <Plus />
            Add a value
          </Button>
        </CardContent>
      </Card>

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
              {isSubmitting ? "Saving…" : "Save profile"}
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
