"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  Save,
  Send,
  X,
} from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { team } from "@/lib/recruiter-mock-data";

const DESCRIPTION_MIN = 80;

const postingSchema = z.object({
  title: z.string().min(3, "Give the role a title candidates would search for"),
  location: z.string().min(2, "Add a city, or say Remote"),
  workplace: z.string().min(1, "Pick a workplace"),
  employment: z.string().min(1, "Pick a contract type"),
  seniority: z.string().min(1, "Pick a level"),
  ownerId: z.string().min(1, "Someone has to own this posting"),
  salaryMin: z
    .string()
    .min(1, "Publish a floor — postings without one get 40% fewer applicants")
    .refine((value) => Number(value.replace(/\D/g, "")) >= 1000, {
      message: "Enter a yearly amount, for example 80000",
    }),
  salaryMax: z
    .string()
    .min(1, "Add the top of the band")
    .refine((value) => Number(value.replace(/\D/g, "")) >= 1000, {
      message: "Enter a yearly amount, for example 100000",
    }),
  currency: z.string().min(1),
  description: z
    .string()
    .min(DESCRIPTION_MIN, `Write at least ${DESCRIPTION_MIN} characters`),
  requirements: z.string().min(10, "List what you actually require"),
  skills: z.array(z.string()).min(1, "Add at least one skill"),
  screening: z.array(z.string()),
  publishNow: z.boolean(),
});

type PostingValues = z.infer<typeof postingSchema>;

const STEPS = [
  { id: "basics", label: "Basics" },
  { id: "details", label: "Role details" },
  { id: "screening", label: "Screening" },
] as const;

const STEP_FIELDS: Record<string, (keyof PostingValues)[]> = {
  basics: [
    "title",
    "location",
    "workplace",
    "employment",
    "seniority",
    "ownerId",
    "salaryMin",
    "salaryMax",
  ],
  details: ["description", "requirements", "skills"],
  screening: ["screening", "publishNow"],
};

export function PostJobForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [skillDraft, setSkillDraft] = useState("");
  const [questionDraft, setQuestionDraft] = useState("");

  const form = useForm({
    defaultValues: {
      title: "",
      location: "",
      workplace: "Hybrid",
      employment: "Full-time",
      seniority: "Senior",
      ownerId: "t-dara",
      salaryMin: "",
      salaryMax: "",
      currency: "€",
      description: "",
      requirements: "",
      skills: [],
      screening: [
        "Do you have the right to work in the EU without sponsorship?",
      ],
      publishNow: true,
    } as PostingValues,
    validators: { onChange: postingSchema },
    onSubmit: async ({ value }) => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success(
        value.publishNow ? "Posting published" : "Draft saved",
        {
          description: value.publishNow
            ? `${value.title} is live and collecting applications.`
            : `${value.title} is in your drafts.`,
        }
      );
      router.push("/recruiter/jobs");
    },
  });

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit();
      }}
    >
      <ol className="flex flex-wrap items-center gap-2">
        {STEPS.map((item, index) => (
          <li key={item.id} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStep(index)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                index === step
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-muted-foreground hover:bg-muted"
              )}
              aria-current={index === step ? "step" : undefined}
            >
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full font-mono text-[11px] tabular-nums",
                  index < step
                    ? "bg-chart-5/15 text-chart-5"
                    : index === step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                )}
              >
                {index < step ? <Check className="size-3" /> : index + 1}
              </span>
              {item.label}
            </button>
            {index < STEPS.length - 1 && (
              <span className="h-px w-6 bg-border" aria-hidden />
            )}
          </li>
        ))}
      </ol>

      {current.id === "basics" && (
        <Card>
          <CardHeader>
            <CardTitle>Basics</CardTitle>
            <CardDescription>
              What candidates see first in search results
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
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
                    placeholder="Senior Frontend Engineer"
                    aria-invalid={!field.state.meta.isValid}
                  />
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <form.Field name="location">
                {(field) => (
                  <div className="grid gap-2">
                    <Label htmlFor={field.name}>Location</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      placeholder="Amsterdam, NL"
                      aria-invalid={!field.state.meta.isValid}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>

              <form.Field name="workplace">
                {(field) => (
                  <div className="grid gap-2">
                    <Label htmlFor={field.name}>Workplace</Label>
                    <Select
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger id={field.name} className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Remote">Remote</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                        <SelectItem value="On-site">On-site</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </form.Field>

              <form.Field name="employment">
                {(field) => (
                  <div className="grid gap-2">
                    <Label htmlFor={field.name}>Contract type</Label>
                    <Select
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger id={field.name} className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </form.Field>

              <form.Field name="seniority">
                {(field) => (
                  <div className="grid gap-2">
                    <Label htmlFor={field.name}>Level</Label>
                    <Select
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger id={field.name} className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Junior">Junior</SelectItem>
                        <SelectItem value="Mid">Mid</SelectItem>
                        <SelectItem value="Senior">Senior</SelectItem>
                        <SelectItem value="Staff">Staff</SelectItem>
                        <SelectItem value="Lead">Lead</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </form.Field>
            </div>

            <Separator />

            <div className="grid gap-5 sm:grid-cols-3">
              <form.Field name="currency">
                {(field) => (
                  <div className="grid gap-2">
                    <Label htmlFor={field.name}>Currency</Label>
                    <Select
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger id={field.name} className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="€">EUR €</SelectItem>
                        <SelectItem value="$">USD $</SelectItem>
                        <SelectItem value="£">GBP £</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </form.Field>

              <form.Field name="salaryMin">
                {(field) => (
                  <div className="grid gap-2">
                    <Label htmlFor={field.name}>Salary from</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      inputMode="numeric"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      placeholder="82000"
                      aria-invalid={!field.state.meta.isValid}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>

              <form.Field name="salaryMax">
                {(field) => (
                  <div className="grid gap-2">
                    <Label htmlFor={field.name}>Salary to</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      inputMode="numeric"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      placeholder="104000"
                      aria-invalid={!field.state.meta.isValid}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>
            </div>

            <form.Field name="ownerId">
              {(field) => (
                <div className="grid gap-2">
                  <Label htmlFor={field.name}>Posting owner</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger id={field.name} className="w-full sm:w-72">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {team.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} · {member.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    They get every new applicant notification for this role.
                  </p>
                </div>
              )}
            </form.Field>
          </CardContent>
        </Card>
      )}

      {current.id === "details" && (
        <Card>
          <CardHeader>
            <CardTitle>Role details</CardTitle>
            <CardDescription>
              Postings with a specific description get 2.4× more qualified
              applicants
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <form.Field name="description">
              {(field) => (
                <div className="grid gap-2">
                  <Label htmlFor={field.name}>About the role</Label>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    rows={7}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="What the person will own, who they work with, and why the problem is interesting."
                  />
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-muted-foreground">
                      Write what makes this role different, not what every role
                      says.
                    </p>
                    <span className="font-mono text-xs text-muted-foreground tabular-nums">
                      {field.state.value.length}
                    </span>
                  </div>
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>

            <form.Field name="requirements">
              {(field) => (
                <div className="grid gap-2">
                  <Label htmlFor={field.name}>Requirements</Label>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    rows={5}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="One requirement per line. Only list what you would actually reject someone for."
                  />
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>

            <form.Field name="skills">
              {(field) => (
                <div className="grid gap-2">
                  <Label htmlFor="skill-input">Skills</Label>
                  <div className="flex gap-2">
                    <Input
                      id="skill-input"
                      value={skillDraft}
                      onChange={(event) => setSkillDraft(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key !== "Enter") return;
                        event.preventDefault();
                        const value = skillDraft.trim();
                        if (!value || field.state.value.includes(value)) return;
                        field.handleChange([...field.state.value, value]);
                        setSkillDraft("");
                      }}
                      placeholder="React, then press Enter"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const value = skillDraft.trim();
                        if (!value || field.state.value.includes(value)) return;
                        field.handleChange([...field.state.value, value]);
                        setSkillDraft("");
                      }}
                    >
                      <Plus />
                      Add
                    </Button>
                  </div>
                  {field.state.value.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {field.state.value.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                          <button
                            type="button"
                            onClick={() =>
                              field.handleChange(
                                field.state.value.filter(
                                  (item) => item !== skill
                                )
                              )
                            }
                            aria-label={`Remove ${skill}`}
                          >
                            <X data-icon="inline-end" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>
          </CardContent>
        </Card>
      )}

      {current.id === "screening" && (
        <Card>
          <CardHeader>
            <CardTitle>Screening and publishing</CardTitle>
            <CardDescription>
              Questions every applicant answers before they can submit
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <form.Field name="screening">
              {(field) => (
                <div className="grid gap-2">
                  <Label htmlFor="question-input">Screening questions</Label>
                  <div className="flex gap-2">
                    <Input
                      id="question-input"
                      value={questionDraft}
                      onChange={(event) => setQuestionDraft(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key !== "Enter") return;
                        event.preventDefault();
                        const value = questionDraft.trim();
                        if (!value) return;
                        field.handleChange([...field.state.value, value]);
                        setQuestionDraft("");
                      }}
                      placeholder="What is your notice period?"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const value = questionDraft.trim();
                        if (!value) return;
                        field.handleChange([...field.state.value, value]);
                        setQuestionDraft("");
                      }}
                    >
                      <Plus />
                      Add
                    </Button>
                  </div>

                  <ul className="grid gap-2">
                    {field.state.value.map((question, index) => (
                      <li
                        key={question}
                        className="flex items-start gap-2.5 rounded-lg border p-2.5 text-sm"
                      >
                        <span className="font-mono text-xs text-muted-foreground tabular-nums">
                          {index + 1}
                        </span>
                        <span className="flex-1 text-muted-foreground">
                          {question}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          aria-label={`Remove question ${index + 1}`}
                          onClick={() =>
                            field.handleChange(
                              field.state.value.filter(
                                (item) => item !== question
                              )
                            )
                          }
                        >
                          <X />
                        </Button>
                      </li>
                    ))}
                  </ul>

                  {field.state.value.length === 0 && (
                    <p className="rounded-lg border border-dashed px-3 py-6 text-center text-xs text-muted-foreground">
                      No screening questions. Applicants submit with just a
                      resume.
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <Separator />

            <form.Field name="publishNow">
              {(field) => (
                <label className="flex items-start gap-2.5 text-sm">
                  <Checkbox
                    checked={field.state.value}
                    onCheckedChange={(value) => field.handleChange(value === true)}
                    className="mt-0.5"
                  />
                  <span>
                    Publish immediately.
                    <span className="block text-xs text-muted-foreground">
                      Leave this off to save the role as a draft and publish it
                      later.
                    </span>
                  </span>
                </label>
              )}
            </form.Field>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setStep(step - 1)}
          disabled={step === 0}
        >
          <ArrowLeft />
          Back
        </Button>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => toast("Draft saved")}
          >
            <Save />
            Save draft
          </Button>

          {isLast ? (
            <form.Subscribe
              selector={(state) => ({
                canSubmit: state.canSubmit,
                isSubmitting: state.isSubmitting,
                publishNow: state.values.publishNow,
              })}
            >
              {({ canSubmit, isSubmitting, publishNow }) => (
                <Button type="submit" disabled={!canSubmit || isSubmitting}>
                  <Send />
                  {isSubmitting
                    ? "Saving…"
                    : publishNow
                      ? "Publish posting"
                      : "Save as draft"}
                </Button>
              )}
            </form.Subscribe>
          ) : (
            <form.Subscribe selector={(state) => state.fieldMeta}>
              {(fieldMeta) => {
                const blocked = STEP_FIELDS[current.id].some(
                  (name) => (fieldMeta[name]?.errors.length ?? 0) > 0
                );
                return (
                  <Button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    disabled={blocked}
                  >
                    Continue
                    <ArrowRight data-icon="inline-end" />
                  </Button>
                );
              }}
            </form.Subscribe>
          )}
        </div>
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
