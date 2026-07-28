"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { mutate } from "@/lib/client-api";

export function InterviewCalendarButton({ count }: { count: number }) {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Add interviews to calendar"
      onClick={() =>
        toast(`Added ${count} interview${count === 1 ? "" : "s"} to your calendar`, {
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
  id,
  query,
  active,
}: {
  id: string;
  query: string;
  active: boolean;
}) {
  const router = useRouter();
  const [on, setOn] = useState(active);

  return (
    <Switch
      checked={on}
      onCheckedChange={async (value) => {
        setOn(value);
        await mutate(`/alerts/${id}`, "PATCH", { active: value });
        router.refresh();
        toast(value ? `"${query}" is on again` : `Paused "${query}"`);
      }}
      aria-label={`Alert for ${query}`}
    />
  );
}
