"use client";

import { Download, ExternalLink, Eye } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { candidate } from "@/lib/mock-data";

export function ProfileHeaderActions() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        onClick={() =>
          toast("Building your PDF", {
            description: "It will download in a few seconds.",
          })
        }
      >
        <Download />
        Download as PDF
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast("Public profile preview", {
            description: `hireloop.com/in/${candidate.name.toLowerCase().replace(/\s+/g, "-")}`,
          })
        }
      >
        <Eye />
        Preview public profile
        <ExternalLink data-icon="inline-end" />
      </Button>
    </div>
  );
}
