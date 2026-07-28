"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { AlertCircle, LogIn } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const loginSchema = z.object({
  email: z.string().email("That does not look like an email address"),
  password: z.string().min(1, "Enter your password"),
});

type LoginValues = z.infer<typeof loginSchema>;

const DEMO = {
  CANDIDATE: { email: "candidate@hireloop.dev", password: "password123" },
  EMPLOYER: { email: "hiring@northwind-labs.dev", password: "password123" },
};

export function LoginForm() {
  const router = useRouter();
  const [audience, setAudience] = useState<"CANDIDATE" | "EMPLOYER">("CANDIDATE");
  const [failure, setFailure] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { email: "", password: "" } as LoginValues,
    validators: { onChange: loginSchema },
    onSubmit: async ({ value }) => {
      setFailure(null);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });

      const payload = (await response.json().catch(() => null)) as {
        redirectTo?: string;
        error?: string;
      } | null;

      if (!response.ok || !payload?.redirectTo) {
        setFailure(payload?.error ?? "Email or password is incorrect");
        return;
      }

      router.push(payload.redirectTo);
      router.refresh();
    },
  });

  const useDemo = () => {
    const demo = DEMO[audience];
    form.setFieldValue("email", demo.email);
    form.setFieldValue("password", demo.password);
  };

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in to pick up where you left off.
        </p>
      </div>

      <Tabs
        value={audience}
        onValueChange={(value) => setAudience(value as "CANDIDATE" | "EMPLOYER")}
      >
        <TabsList className="w-full">
          <TabsTrigger value="CANDIDATE" className="flex-1">
            I am job hunting
          </TabsTrigger>
          <TabsTrigger value="EMPLOYER" className="flex-1">
            I am hiring
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field name="email">
          {(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Email</Label>
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
              <Label htmlFor={field.name}>
                Password
                <button
                  type="button"
                  className="ml-auto text-xs font-normal text-muted-foreground hover:text-foreground"
                >
                  Forgot password?
                </button>
              </Label>
              <Input
                id={field.name}
                type="password"
                autoComplete="current-password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
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
              <LogIn />
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <div className="grid gap-2 rounded-lg bg-muted/60 p-3">
        <p className="text-xs font-medium">Trying it out?</p>
        <p className="text-xs text-muted-foreground">
          Fill in the seeded{" "}
          {audience === "CANDIDATE" ? "candidate" : "recruiter"} account.
        </p>
        <Button type="button" variant="outline" size="sm" onClick={useDemo}>
          Use the demo {audience === "CANDIDATE" ? "candidate" : "recruiter"}
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        New here?{" "}
        <a
          href="/signup"
          className="rounded-sm font-medium text-foreground underline underline-offset-4 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          Create an account
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
