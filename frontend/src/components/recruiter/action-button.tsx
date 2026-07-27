"use client";

import type { ComponentProps } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

/**
 * Lets the server-rendered recruiter pages keep working controls without each
 * one needing its own client component.
 */
export function ActionButton({
  message,
  description,
  tone = "default",
  ...props
}: ComponentProps<typeof Button> & {
  message: string;
  description?: string;
  tone?: "default" | "success";
}) {
  return (
    <Button
      {...props}
      onClick={() => {
        const options = description ? { description } : undefined;
        if (tone === "success") toast.success(message, options);
        else toast(message, options);
      }}
    />
  );
}
