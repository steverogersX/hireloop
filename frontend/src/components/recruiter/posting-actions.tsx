"use client";

import { useState } from "react";
import { Ban, Check, Copy, Eye, Link2, PenLine } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { Posting, PostingStatus } from "@/lib/recruiter-mock-data";

export function PostingActions({ posting }: { posting: Posting }) {
  const [status, setStatus] = useState<PostingStatus>(posting.status);

  const move = (next: PostingStatus, message: string, description: string) => {
    setStatus(next);
    toast.success(message, { description });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        onClick={() => toast("Public link copied to clipboard")}
      >
        <Link2 />
        Copy link
      </Button>

      <Button
        variant="outline"
        onClick={() =>
          toast.success(`${posting.title} duplicated`, {
            description: "The copy is in your drafts.",
          })
        }
      >
        <Copy />
        Duplicate
      </Button>

      {status === "Published" ? (
        <Button
          variant="outline"
          onClick={() =>
            move(
              "Closed",
              `${posting.title} closed`,
              "It no longer accepts new applications."
            )
          }
        >
          <Ban />
          Close
        </Button>
      ) : status === "Draft" ? (
        <Button
          variant="outline"
          onClick={() =>
            move(
              "Published",
              `${posting.title} published`,
              "It is now live on your careers page."
            )
          }
        >
          <Check />
          Publish
        </Button>
      ) : (
        <Button
          variant="outline"
          onClick={() =>
            move(
              "Published",
              `${posting.title} reopened`,
              "Applications are open again."
            )
          }
        >
          <Eye />
          Reopen
        </Button>
      )}

      <Button
        onClick={() =>
          toast("Editor opened", {
            description: `Editing ${posting.title}.`,
          })
        }
      >
        <PenLine />
        Edit posting
      </Button>
    </div>
  );
}
