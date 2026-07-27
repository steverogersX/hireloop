import type { Metadata } from "next";
import Link from "next/link";
import { CreditCard, Download, LogOut, Trash2 } from "lucide-react";

import { AccountForm } from "@/components/recruiter/account-form";
import { ActionButton } from "@/components/recruiter/action-button";
import { NotificationSettings } from "@/components/recruiter/notification-settings";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { billing, employer, recruiter } from "@/lib/recruiter-mock-data";

export const metadata: Metadata = {
  title: "Settings — HireLoop",
  description: "Account, notifications and billing for your workspace.",
};

export default function SettingsPage() {
  const usage = [
    {
      label: "Seats",
      used: billing.seatsUsed,
      total: billing.seatsTotal,
      hint: "people with workspace access",
    },
    {
      label: "Job slots",
      used: billing.jobSlotsUsed,
      total: billing.jobSlotsTotal,
      hint: "published postings at once",
    },
    {
      label: "Sourcing credits",
      used: billing.creditsTotal - billing.creditsLeft,
      total: billing.creditsTotal,
      hint: "resets on renewal",
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/recruiter">Overview</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="grid gap-1">
        <h1 className="font-heading text-2xl leading-tight font-semibold tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Your account and the {employer.name} workspace
        </p>
      </header>

      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Plan & billing</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="mt-3">
          <div className="grid max-w-3xl gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Your details</CardTitle>
                <CardDescription>
                  Candidates see your name and title on outreach
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5">
                <div className="flex items-center gap-3">
                  <Avatar className="size-14">
                    <AvatarFallback
                      className={cn(
                        "text-lg font-medium",
                        recruiter.avatarClass
                      )}
                    >
                      {recruiter.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1.5">
                    <ActionButton
                      variant="outline"
                      size="sm"
                      message="Choose a photo"
                      description="Square JPG or PNG, at least 200×200."
                    >
                      Upload a photo
                    </ActionButton>
                    <p className="text-xs text-muted-foreground">
                      Square JPG or PNG, at least 200×200
                    </p>
                  </div>
                </div>

                <Separator />

                <AccountForm />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                  How you sign in to this workspace
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div className="flex flex-wrap items-center gap-3 rounded-lg border p-3">
                  <div className="min-w-40 flex-1">
                    <p className="text-sm font-medium">Password</p>
                    <p className="text-xs text-muted-foreground">
                      Last changed 4 months ago
                    </p>
                  </div>
                  <ActionButton
                    variant="outline"
                    size="sm"
                    message="Password reset sent"
                    description={`Check ${recruiter.email} for the link.`}
                    tone="success"
                  >
                    Change password
                  </ActionButton>
                </div>
                <div className="flex flex-wrap items-center gap-3 rounded-lg border p-3">
                  <div className="min-w-40 flex-1">
                    <p className="flex items-center gap-2 text-sm font-medium">
                      Two-factor authentication
                      <Badge className="bg-chart-5/12 text-chart-5">On</Badge>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Authenticator app, added March 2026
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
                <div className="flex flex-wrap items-center gap-3 rounded-lg border p-3">
                  <div className="min-w-40 flex-1">
                    <p className="text-sm font-medium">Active sessions</p>
                    <p className="text-xs text-muted-foreground">
                      3 devices signed in
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <LogOut />
                    Sign out everywhere
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Danger zone</CardTitle>
                <CardDescription>
                  Deleting the workspace removes every posting and applicant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-3 rounded-lg border border-destructive/30 p-3">
                  <div className="min-w-40 flex-1">
                    <p className="text-sm font-medium">Delete workspace</p>
                    <p className="text-xs text-muted-foreground">
                      This cannot be undone. Applicant data is erased within 30
                      days.
                    </p>
                  </div>
                  <ActionButton
                    variant="destructive"
                    size="sm"
                    message="Deleting a workspace needs an owner"
                    description="Contact support to start the process."
                  >
                    <Trash2 />
                    Delete workspace
                  </ActionButton>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-3">
          <Card className="max-w-3xl">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Applies to you only, not the rest of the team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-3">
          <div className="grid max-w-3xl gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Current plan</CardTitle>
                <CardDescription>
                  Renews on {billing.renewsOn}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div className="grid gap-1">
                    <p className="flex items-center gap-2">
                      <span className="font-heading text-2xl font-semibold">
                        {billing.plan}
                      </span>
                      <Badge className="bg-primary/12 text-primary">
                        Active
                      </Badge>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-mono tabular-nums">
                        {billing.price}
                      </span>{" "}
                      {billing.cycle}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <ActionButton
                      variant="outline"
                      message="Payment method"
                      description="Visa ending 4242, expires 09/28."
                    >
                      <CreditCard />
                      Payment method
                    </ActionButton>
                    <ActionButton
                      message="Compare plans"
                      description={`You are on ${billing.plan} at ${billing.price} ${billing.cycle}.`}
                    >
                      Change plan
                    </ActionButton>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4">
                  {usage.map((item) => (
                    <div key={item.label} className="grid gap-1.5">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground tabular-nums">
                          {item.used} / {item.total}
                        </span>
                      </div>
                      <Progress value={(item.used / item.total) * 100} />
                      <p className="text-xs text-muted-foreground">
                        {item.hint}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Invoices</CardTitle>
                <CardDescription>Last three billing periods</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                {billing.invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex flex-wrap items-center gap-3 rounded-lg border p-3"
                  >
                    <span className="font-mono text-sm tabular-nums">
                      {invoice.number}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {invoice.date}
                    </span>
                    <Badge className="bg-chart-5/12 text-chart-5">
                      {invoice.status}
                    </Badge>
                    <span className="ml-auto font-mono text-sm tabular-nums">
                      {invoice.amount}
                    </span>
                    <ActionButton
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Download invoice ${invoice.number}`}
                      message={`Downloading ${invoice.number}`}
                      description={`${invoice.amount} · ${invoice.date}`}
                    >
                      <Download />
                    </ActionButton>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
