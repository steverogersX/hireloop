"use client";

import { useRouter } from "next/navigation";
import { Download, FileText, Star, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mutate } from "@/lib/client-api";
import { relativeTime } from "@/lib/format";
import type { Resume } from "@/types/api";

function formatSize(bytes: number) {
  if (bytes <= 0) return "—";
  return `${Math.round(bytes / 1024)} KB`;
}

export function ResumeFiles({ resumes }: { resumes: Resume[] }) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumes</CardTitle>
        <CardDescription>
          The default goes out with every quick apply.
        </CardDescription>
        <CardAction>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast("Choose a PDF or DOCX up to 5 MB")}
          >
            <UploadCloud />
            Upload
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-2">
        {resumes.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No resume yet. Upload one so quick apply has something to send.
          </p>
        )}

        {resumes.map((file) => (
          <div
            key={file.id}
            className="flex flex-wrap items-center gap-3 rounded-lg bg-muted/50 p-3"
          >
            <FileText className="size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                {file.name}
                {file.isDefault && (
                  <Badge className="bg-chart-5/12 text-chart-5">
                    <Star />
                    Default
                  </Badge>
                )}
              </p>
              <p className="font-mono text-xs text-muted-foreground tabular-nums">
                {formatSize(file.sizeBytes)} · updated {relativeTime(file.updatedAt)}{" "}
                · sent with {file.usedCount} applications
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              {!file.isDefault && (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={async () => {
                    await mutate(`/profile/resumes/${file.id}/default`, "PATCH");
                    router.refresh();
                    toast(`${file.name} is now your default resume`);
                  }}
                >
                  Make default
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Download ${file.name}`}
                onClick={() => toast(`Downloading ${file.name}`)}
              >
                <Download />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Delete ${file.name}`}
                disabled={file.isDefault}
                onClick={async () => {
                  await mutate(`/profile/resumes/${file.id}`, "DELETE");
                  router.refresh();
                  toast(`${file.name} deleted`);
                }}
              >
                <Trash2 />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
