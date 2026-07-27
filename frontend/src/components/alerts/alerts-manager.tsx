"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import {
  AlertCircle,
  Bell,
  BellPlus,
  Mail,
  Pencil,
  Smartphone,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { alerts, type Alert } from "@/lib/mock-data";

const alertSchema = z.object({
  query: z.string().min(2, "What should this alert watch for?"),
  location: z.string().min(2, "Add a location, or type Anywhere"),
  frequency: z.string(),
  email: z.boolean(),
  push: z.boolean(),
});

type AlertValues = z.infer<typeof alertSchema>;

export function AlertsManager() {
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          <span className="font-mono font-medium text-foreground tabular-nums">
            {alerts.filter((alert) => alert.active).length}
          </span>{" "}
          active of{" "}
          <span className="font-mono text-foreground tabular-nums">
            {alerts.length}
          </span>{" "}
          alerts
        </p>
        <CreateAlertSheet />
      </div>

      {alerts.map((alert) => (
        <AlertRow key={alert.id} alert={alert} />
      ))}
    </div>
  );
}

function AlertRow({ alert }: { alert: Alert }) {
  const [active, setActive] = useState(alert.active);

  return (
    <Card>
      <CardContent className="grid gap-3">
        <div className="flex flex-wrap items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Bell className="size-4" />
          </span>

          <div className="min-w-0 flex-1">
            <p className="flex flex-wrap items-center gap-2 font-medium">
              {alert.query}
              {alert.newCount > 0 && active && (
                <Badge className="bg-chart-5/12 font-mono text-chart-5">
                  {alert.newCount} new
                </Badge>
              )}
              {!active && <Badge variant="outline">Paused</Badge>}
            </p>
            <p className="text-sm text-muted-foreground">
              {alert.location} · {alert.frequency}
            </p>
            <p className="font-mono text-xs text-muted-foreground tabular-nums">
              {alert.created} · {alert.lastSent} · {alert.matchesTotal} matches
              so far
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Edit the ${alert.query} alert`}
              onClick={() =>
                toast(`Editing "${alert.query}"`, {
                  description: `${alert.location} · ${alert.frequency}`,
                })
              }
            >
              <Pencil />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Delete alert"
              onClick={() => toast(`Deleted the "${alert.query}" alert`)}
            >
              <Trash2 />
            </Button>
            <Switch
              checked={active}
              onCheckedChange={(value) => {
                setActive(value);
                toast(
                  value
                    ? `"${alert.query}" is on again`
                    : `Paused "${alert.query}"`
                );
              }}
              aria-label={`Alert for ${alert.query}`}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 border-t pt-3">
          {alert.filters.map((filter) => (
            <Badge key={filter} variant="secondary">
              {filter}
            </Badge>
          ))}
          <span className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            {alert.channels.includes("Email") && (
              <span className="inline-flex items-center gap-1">
                <Mail className="size-3.5" />
                Email
              </span>
            )}
            {alert.channels.includes("Push") && (
              <span className="inline-flex items-center gap-1">
                <Smartphone className="size-3.5" />
                Push
              </span>
            )}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function CreateAlertSheet() {
  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      query: "",
      location: "Remote — Europe",
      frequency: "Daily",
      email: true,
      push: false,
    } as AlertValues,
    validators: { onChange: alertSchema },
    onSubmit: async ({ value }) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setOpen(false);
      form.reset();
      toast.success("Alert created", {
        description: `Matching roles for "${value.query}" will arrive ${value.frequency.toLowerCase()}.`,
      });
    },
  });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <BellPlus />
          New alert
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle>New job alert</SheetTitle>
          <SheetDescription>
            We check new postings as they arrive and send only what matches.
          </SheetDescription>
        </SheetHeader>

        <form
          className="grid gap-5 p-4"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field name="query">
            {(field) => (
              <div className="grid gap-2">
                <Label htmlFor={field.name}>Keywords</Label>
                <Input
                  id={field.name}
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

          <form.Field name="location">
            {(field) => (
              <div className="grid gap-2">
                <Label htmlFor={field.name}>Location</Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={!field.state.meta.isValid}
                />
                <FieldError field={field} />
              </div>
            )}
          </form.Field>

          <form.Field name="frequency">
            {(field) => (
              <div className="grid gap-2">
                <Label htmlFor={field.name}>How often</Label>
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger id={field.name} className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Instant">
                      Instantly, as roles are posted
                    </SelectItem>
                    <SelectItem value="Daily">Once a day, 08:00</SelectItem>
                    <SelectItem value="Weekly">Mondays, 08:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>

          <div className="grid gap-3">
            <p className="text-sm font-medium">Where to send it</p>
            <form.Field name="email">
              {(field) => (
                <label className="flex items-center gap-2.5 text-sm">
                  <Checkbox
                    checked={field.state.value}
                    onCheckedChange={(value) => field.handleChange(value === true)}
                  />
                  Email to priya.raman@example.com
                </label>
              )}
            </form.Field>
            <form.Field name="push">
              {(field) => (
                <label className="flex items-center gap-2.5 text-sm">
                  <Checkbox
                    checked={field.state.value}
                    onCheckedChange={(value) => field.handleChange(value === true)}
                  />
                  Push notification
                </label>
              )}
            </form.Field>
          </div>

          <SheetFooter className="flex-row justify-end gap-2 px-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <form.Subscribe
              selector={(state) => ({
                canSubmit: state.canSubmit,
                isSubmitting: state.isSubmitting,
              })}
            >
              {({ canSubmit, isSubmitting }) => (
                <Button type="submit" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting ? "Creating…" : "Create alert"}
                </Button>
              )}
            </form.Subscribe>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
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
