"use client";

import { useForm } from "@tanstack/react-form";
import { AlertCircle, Check, Link2, Trash2 } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  candidate,
  connectedAccounts,
  notificationSettings,
} from "@/lib/mock-data";

const accountSchema = z
  .object({
    email: z.string().email("That does not look like an email address"),
    currentPassword: z.string(),
    newPassword: z.string(),
    language: z.string(),
    timezone: z.string(),
  })
  .refine(
    (values) =>
      values.newPassword.length === 0 || values.newPassword.length >= 10,
    {
      message: "Use at least 10 characters",
      path: ["newPassword"],
    }
  )
  .refine(
    (values) =>
      values.newPassword.length === 0 || values.currentPassword.length > 0,
    {
      message: "Confirm your current password to change it",
      path: ["currentPassword"],
    }
  );

type AccountValues = z.infer<typeof accountSchema>;

export function SettingsTabs() {
  return (
    <Tabs defaultValue="account" className="gap-3">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="privacy">Privacy</TabsTrigger>
        <TabsTrigger value="connected">Connected apps</TabsTrigger>
      </TabsList>

      <TabsContent value="account">
        <AccountForm />
      </TabsContent>

      <TabsContent value="notifications">
        <NotificationSettings />
      </TabsContent>

      <TabsContent value="privacy">
        <PrivacySettings />
      </TabsContent>

      <TabsContent value="connected">
        <ConnectedApps />
      </TabsContent>
    </Tabs>
  );
}

function AccountForm() {
  const form = useForm({
    defaultValues: {
      email: candidate.email,
      currentPassword: "",
      newPassword: "",
      language: "en",
      timezone: "Europe/Amsterdam",
    } as AccountValues,
    validators: { onChange: accountSchema },
    onSubmit: async ({ value }) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      form.reset({ ...value, currentPassword: "", newPassword: "" });
      toast.success("Account updated");
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
          <CardTitle>Account</CardTitle>
          <CardDescription>
            How you sign in, and where we send anything official.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <form.Field name="email">
            {(field) => (
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor={field.name}>Email address</Label>
                <Input
                  id={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={!field.state.meta.isValid}
                  className="sm:max-w-96"
                />
                <FieldError field={field} />
              </div>
            )}
          </form.Field>

          <form.Field name="currentPassword">
            {(field) => (
              <div className="grid gap-2">
                <Label htmlFor={field.name}>Current password</Label>
                <Input
                  id={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="Only if changing it"
                />
                <FieldError field={field} />
              </div>
            )}
          </form.Field>

          <form.Field name="newPassword">
            {(field) => (
              <div className="grid gap-2">
                <Label htmlFor={field.name}>New password</Label>
                <Input
                  id={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="At least 10 characters"
                  aria-invalid={!field.state.meta.isValid}
                />
                <FieldError field={field} />
              </div>
            )}
          </form.Field>

          <form.Field name="language">
            {(field) => (
              <div className="grid gap-2">
                <Label htmlFor={field.name}>Language</Label>
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger id={field.name} className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="nl">Nederlands</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>

          <form.Field name="timezone">
            {(field) => (
              <div className="grid gap-2">
                <Label htmlFor={field.name}>Time zone</Label>
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger id={field.name} className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Europe/Amsterdam">
                      Europe/Amsterdam
                    </SelectItem>
                    <SelectItem value="Europe/London">Europe/London</SelectItem>
                    <SelectItem value="America/New_York">
                      America/New_York
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              {isDirty ? "You have unsaved changes" : "Everything is saved"}
            </p>
            <Button
              type="submit"
              className="ml-auto"
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? "Saving…" : "Save changes"}
            </Button>
          </div>
        )}
      </form.Subscribe>

      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Delete account</CardTitle>
          <CardDescription>
            Removes your profile, applications and messages. Companies keep
            applications you already sent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            variant="destructive"
            onClick={() =>
              toast("Deleting an account asks for confirmation by email")
            }
          >
            <Trash2 />
            Delete my account
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}

function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Pick what reaches you and where. Interview reminders are worth
          keeping on.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-1">
        <div className="flex items-center gap-3 border-b pb-2 text-xs tracking-wide text-muted-foreground uppercase">
          <span className="flex-1">Notify me about</span>
          <span className="w-14 text-center">Email</span>
          <span className="w-14 text-center">Push</span>
        </div>

        {notificationSettings.map((setting) => (
          <div
            key={setting.id}
            className="flex items-center gap-3 border-b py-2.5 last:border-0"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{setting.label}</p>
              <p className="text-xs text-muted-foreground">{setting.detail}</p>
            </div>
            <div className="flex w-14 justify-center">
              <Switch
                defaultChecked={setting.email}
                aria-label={`${setting.label} by email`}
              />
            </div>
            <div className="flex w-14 justify-center">
              <Switch
                defaultChecked={setting.push}
                aria-label={`${setting.label} by push`}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function PrivacySettings() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Profile visibility</CardTitle>
          <CardDescription>
            Controls who can find you outside of roles you apply to.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3.5">
          <Row
            id="p-search"
            label="Appear in recruiter search"
            detail="17 recruiters found you this month."
            defaultChecked
          />
          <Row
            id="p-employer"
            label="Hide from Kestrel Software"
            detail="Your current employer cannot see your profile."
            defaultChecked
          />
          <Row
            id="p-salary"
            label="Show salary expectation"
            detail="Only to companies whose range overlaps yours."
          />
          <Row
            id="p-activity"
            label="Show when you were last active"
            detail="Recruiters prioritise candidates who are around."
            defaultChecked
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your data</CardTitle>
          <CardDescription>
            Everything HireLoop holds about you, on request.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => toast("We will email your export within an hour")}
          >
            Request a data export
          </Button>
          <Button
            variant="outline"
            onClick={() => toast("Search history cleared")}
          >
            Clear search history
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function ConnectedApps() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected apps</CardTitle>
        <CardDescription>
          Each one can be disconnected without affecting your profile.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        {connectedAccounts.map((account) => (
          <div
            key={account.id}
            className="flex flex-wrap items-center gap-3 rounded-lg bg-muted/50 p-3"
          >
            <Link2 className="size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                {account.name}
                {account.connected && (
                  <Badge className="bg-chart-5/12 text-chart-5">
                    <Check />
                    Connected
                  </Badge>
                )}
              </p>
              <p className="text-xs text-muted-foreground">{account.detail}</p>
              <p className="font-mono text-xs text-muted-foreground">
                {account.since}
              </p>
            </div>
            <Button
              variant={account.connected ? "ghost" : "outline"}
              size="sm"
              onClick={() =>
                toast(
                  account.connected
                    ? `Disconnected ${account.name}`
                    : `Connecting ${account.name}…`
                )
              }
            >
              {account.connected ? "Disconnect" : "Connect"}
            </Button>
          </div>
        ))}

        <Separator className="my-1" />

        <p className="text-xs text-muted-foreground">
          HireLoop never posts anywhere on your behalf.
        </p>
      </CardContent>
    </Card>
  );
}

function Row({
  id,
  label,
  detail,
  defaultChecked,
}: {
  id: string;
  label: string;
  detail: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="grid gap-0.5">
        <Label htmlFor={id} className="font-normal">
          {label}
        </Label>
        <span className="text-xs text-muted-foreground">{detail}</span>
      </div>
      <Switch id={id} defaultChecked={defaultChecked} />
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
