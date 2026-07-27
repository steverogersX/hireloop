"use client";

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
import { profileVisibility } from "@/lib/mock-data";

export function VisibilityCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Who can see you</CardTitle>
        <CardDescription>
          Changes take effect the moment you toggle them.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3.5">
        {profileVisibility.map((setting) => (
          <div key={setting.id} className="flex items-start justify-between gap-3">
            <div className="grid gap-0.5">
              <Label htmlFor={setting.id} className="font-normal">
                {setting.label}
              </Label>
              <span className="text-xs text-muted-foreground">
                {setting.detail}
              </span>
            </div>
            <Switch
              id={setting.id}
              defaultChecked={setting.enabled}
              onCheckedChange={(value) =>
                toast(
                  value
                    ? `On — ${setting.label.toLowerCase()}`
                    : `Off — ${setting.label.toLowerCase()}`
                )
              }
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
