"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { AlertCircle, Briefcase, Search, UserPlus } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const signupSchema = z.object({
  name: z.string().min(2, "Tell us your name"),
  email: z.string().email("That does not look like an email address"),
  password: z
    .string()
    .min(8, "Use at least 8 characters")
    .max(72, "Keep it under 72 characters"),
  role: z.enum(["CANDIDATE", "EMPLOYER"]),
});

type SignupValues = z.infer<typeof signupSchema>;

const ROLES = [
  {
    value: "CANDIDATE" as const,
    icon: Search,
    title: "I am job hunting",
    detail: "Track applications and get roles scored against your profile.",
  },
  {
    value: "EMPLOYER" as const,
    icon: Briefcase,
    title: "I am hiring",
    detail: "Post roles and run your pipeline from one place.",
  },
];

export function SignupForm() {
  const router = useRouter();
  const [failure, setFailure] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "CANDIDATE",
    } as SignupValues,
    validators: { onChange: signupSchema },
    onSubmit: async ({ value }) => {
      setFailure(null);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });

      const payload = (await response.json().catch(() => null)) as {
        redirectTo?: string;
        error?: string;
      } | null;

      if (!response.ok || !payload?.redirectTo) {
        setFailure(payload?.error ?? "Could not create your account");
        return;
      }

      router.push(payload.redirectTo);
      router.refresh();
    },
  });

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Two minutes now, and every role you see afterwards is scored for you.
        </p>
      </div>

      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field name="role">
          {(field) => (
            <div className="grid gap-2">
              <Label>What brings you here?</Label>
              <div className="grid gap-2">
                {ROLES.map((role) => {
                  const active = field.state.value === role.value;
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => field.handleChange(role.value)}
                      aria-pressed={active}
                      className={cn(
                        "flex items-start gap-3 rounded-lg p-3 text-left ring-1 transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                        active
                          ? "bg-accent/60 ring-2 ring-primary"
                          : "ring-foreground/10 hover:bg-muted/60",
                      )}
                    >
                      <role.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      <span className="grid gap-0.5">
                        <span className="text-sm font-medium">{role.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {role.detail}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </form.Field>

        <form.Field name="name">
          {(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Full name</Label>
              <Input
                id={field.name}
                autoComplete="name"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="Priya Raman"
                aria-invalid={!field.state.meta.isValid}
              />
              <FieldError field={field} />
            </div>
          )}
        </form.Field>

        <form.Field name="email">
          {(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Work email</Label>
              <Input
                id={field.name}
                type="email"
                autoComplete="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="you@example.com"
                aria-invalid={!field.state.meta.isValid}
              />
              <FieldError field={field} />
            </div>
          )}
        </form.Field>

        <form.Field name="password">
          {(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Password</Label>
              <Input
                id={field.name}
                type="password"
                autoComplete="new-password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="At least 8 characters"
                aria-invalid={!field.state.meta.isValid}
              />
              <FieldError field={field} />
            </div>
          )}
        </form.Field>

        {failure && (
          <p className="flex items-center gap-1.5 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
            <AlertCircle className="size-3.5 shrink-0" />
            {failure}
          </p>
        )}

        <form.Subscribe
          selector={(state) => ({
            canSubmit: state.canSubmit,
            isSubmitting: state.isSubmitting,
          })}
        >
          {({ canSubmit, isSubmitting }) => (
            <Button type="submit" disabled={!canSubmit || isSubmitting}>
              <UserPlus />
              {isSubmitting ? "Creating account…" : "Create account"}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <a
          href="/login"
          className="rounded-sm font-medium text-foreground underline underline-offset-4 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          Sign in
        </a>
      </p>
    </div>
  );
}

type FieldLike = {
  state: { meta: { isTouched: boolean; isValid: boolean; errors: unknown[] } };
};

function FieldError({ field }: { field: FieldLike }) {
  const { isTouched, isValid, errors } = field.state.meta;
  if (!isTouched || isValid) return null;

  const message = errors
    .map((error) =>
      typeof error === "string" ? error : ((error as { message?: string })?.message ?? ""),
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
