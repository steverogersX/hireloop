import type { Metadata } from "next";
import Link from "next/link";

import { SettingsTabs } from "@/components/settings/settings-tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  getConnectedAccounts,
  getNotificationPreferences,
  getProfile,
} from "@/lib/queries";

export const metadata: Metadata = {
  title: "Settings — HireLoop",
  description:
    "Account, notifications, privacy and connected apps for your HireLoop account.",
};

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [profile, preferences, accounts] = await Promise.all([
    getProfile(),
    getNotificationPreferences(),
    getConnectedAccounts(),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Overview</Link>
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
          Everything about the account itself. Your public profile lives under{" "}
          <Link
            href="/profile"
            className="rounded-sm font-medium text-foreground underline underline-offset-4 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            Profile & resume
          </Link>
          .
        </p>
      </header>

      <div className="max-w-4xl">
        {profile && (
          <SettingsTabs
            profile={profile}
            preferences={preferences}
            accounts={accounts}
          />
        )}
      </div>
    </div>
  );
}
