"use client";

import { Bell, BellOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { toggleFollow, useIsFollowing } from "@/hooks/use-follows";

export function FollowButton({
  companyId,
  companyName,
  size,
}: {
  companyId: string;
  companyName: string;
  size?: React.ComponentProps<typeof Button>["size"];
}) {
  const following = useIsFollowing(companyId);

  return (
    <Button
      variant={following ? "secondary" : "outline"}
      size={size}
      aria-pressed={following}
      onClick={() => {
        const now = toggleFollow(companyId);
        toast(
          now
            ? `Following ${companyName}`
            : `You will stop getting ${companyName} alerts`,
          {
            description: now
              ? "New roles here will appear in your alerts."
              : undefined,
          }
        );
      }}
    >
      {following ? <BellOff /> : <Bell />}
      {following ? "Following" : "Follow"}
    </Button>
  );
}
