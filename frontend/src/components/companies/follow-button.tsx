"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, BellOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { mutate } from "@/lib/client-api";

export function FollowButton({
  companyId,
  companyName,
  following: initial,
  size,
}: {
  companyId: string;
  companyName: string;
  following: boolean;
  size?: React.ComponentProps<typeof Button>["size"];
}) {
  const router = useRouter();
  const [following, setFollowing] = useState(initial);

  return (
    <Button
      variant={following ? "secondary" : "outline"}
      size={size}
      aria-pressed={following}
      onClick={async () => {
        const next = !following;
        setFollowing(next);
        await mutate(`/companies/${companyId}/follow`, next ? "POST" : "DELETE");
        router.refresh();
        toast(
          next
            ? `Following ${companyName}`
            : `You will stop getting ${companyName} alerts`,
          {
            description: next
              ? "New roles here will appear in your alerts."
              : undefined,
          },
        );
      }}
    >
      {following ? <BellOff /> : <Bell />}
      {following ? "Following" : "Follow"}
    </Button>
  );
}
