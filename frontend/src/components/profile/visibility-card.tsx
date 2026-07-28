"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { mutate } from "@/lib/client-api";
import type { CandidateProfile } from "@/types/api";

export function VisibilityCard({ profile }: { profile: CandidateProfile }) {
  const router = useRouter();

  const settings = [
    {
      id: "searchable",
      label: "Appear in recruiter search",
      detail: `${profile.profileViews} recruiters found you this month.`,
      enabled: profile.searchable,
      field: "searchable" as const,
    },
    {
      id: "showSalary",
      label: "Show salary expectation",
      detail: "Only to companies whose range overlaps yours.",
      enabled: profile.showSalaryExpectation,
      field: "showSalaryExpectation" as const,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Who can see you</CardTitle>
        <CardDescription>
          Changes take effect the moment you toggle them.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3.5">
        {settings.map((setting) => (
          <div key={setting.id} className="flex items-start justify-between gap-3">
            <div className="grid gap-0.5">
              <Label htmlFor={setting.id} className="font-normal">
                {setting.label}
              </Label>
              <span className="text-xs text-muted-foreground">{setting.detail}</span>
            </div>
            <Switch
              id={setting.id}
              defaultChecked={setting.enabled}
              onCheckedChange={async (value) => {
                await mutate("/profile/visibility", "PATCH", {
                  [setting.field]: value,
                });
                router.refresh();
                toast(
                  value
                    ? `On — ${setting.label.toLowerCase()}`
                    : `Off — ${setting.label.toLowerCase()}`,
                );
              }}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
