"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { notificationSettings } from "@/lib/recruiter-mock-data";

type Channel = "email" | "push";

export function NotificationSettings() {
  const [settings, setSettings] = useState(notificationSettings);

  const toggle = (id: string, channel: Channel) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id
          ? { ...setting, [channel]: !setting[channel] }
          : setting
      )
    );
    toast("Notification preferences saved");
  };

  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-3 pr-1 text-xs tracking-wide text-muted-foreground uppercase">
        <span className="flex-1">Event</span>
        <span className="w-12 text-center">Email</span>
        <span className="w-12 text-center">Push</span>
      </div>

      {settings.map((setting, index) => (
        <div key={setting.id} className="grid gap-3">
          {index > 0 && <Separator />}
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{setting.label}</p>
              <p className="text-xs text-muted-foreground">{setting.detail}</p>
            </div>
            <div className="flex w-12 justify-center">
              <Switch
                checked={setting.email}
                onCheckedChange={() => toggle(setting.id, "email")}
                aria-label={`Email notifications for ${setting.label}`}
              />
            </div>
            <div className="flex w-12 justify-center">
              <Switch
                checked={setting.push}
                onCheckedChange={() => toggle(setting.id, "push")}
                aria-label={`Push notifications for ${setting.label}`}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
