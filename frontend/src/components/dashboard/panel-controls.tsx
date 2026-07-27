"use client";

import { useState } from "react";
import { CalendarPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export function InterviewCalendarButton() {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Add interviews to calendar"
      onClick={() =>
        toast("Added 3 interviews to your calendar", {
          description: "Reminders go out a day and an hour before each one.",
        })
      }
    >
      <CalendarPlus />
    </Button>
  );
}

export function InterviewActions({
  round,
  company,
}: {
  round: string;
  company: string;
}) {
  return (
    <>
      <Button
        variant="ghost"
        size="xs"
        className="ml-auto"
        onClick={() =>
          toast(`Asked ${company} for a new time`, {
            description: `They will suggest slots for the ${round.toLowerCase()}.`,
          })
        }
      >
        Reschedule
      </Button>
      <Button
        size="xs"
        onClick={() =>
          toast(`Prep notes for the ${round.toLowerCase()}`, {
            description: `What ${company} asks, and who you are meeting.`,
          })
        }
      >
        Prep notes
      </Button>
    </>
  );
}

export function AlertToggle({
  query,
  active,
}: {
  query: string;
  active: boolean;
}) {
  const [on, setOn] = useState(active);

  return (
    <Switch
      checked={on}
      onCheckedChange={(value) => {
        setOn(value);
        toast(value ? `"${query}" is on again` : `Paused "${query}"`);
      }}
      aria-label={`Alert for ${query}`}
    />
  );
}
