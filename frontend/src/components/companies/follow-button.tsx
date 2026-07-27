"use client";

import { useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function FollowButton({ companyName }: { companyName: string }) {
  const [following, setFollowing] = useState(false);

  return (
    <Button
      variant={following ? "secondary" : "outline"}
      aria-pressed={following}
      onClick={() => {
        setFollowing(!following);
        toast(
          following
            ? `You will stop getting ${companyName} alerts`
            : `Following ${companyName}`,
          {
            description: following
              ? undefined
              : "New roles here will appear in your alerts.",
          }
        );
      }}
    >
      {following ? <BellOff /> : <Bell />}
      {following ? "Following" : "Follow"}
    </Button>
  );
}
