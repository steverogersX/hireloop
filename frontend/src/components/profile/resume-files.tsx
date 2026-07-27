"use client";

import { useState } from "react";
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
import { resumeFiles } from "@/lib/mock-data";

export function ResumeFiles() {
  const [defaultId, setDefaultId] = useState(
    resumeFiles.find((file) => file.isDefault)?.id ?? resumeFiles[0].id
  );

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
        {resumeFiles.map((file) => {
          const isDefault = file.id === defaultId;

          return (
            <div
              key={file.id}
              className="flex flex-wrap items-center gap-3 rounded-lg bg-muted/50 p-3"
            >
              <FileText className="size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                  {file.name}
                  {isDefault && (
                    <Badge className="bg-chart-5/12 text-chart-5">
                      <Star />
                      Default
                    </Badge>
                  )}
                </p>
                <p className="font-mono text-xs text-muted-foreground tabular-nums">
                  {file.size} · updated {file.updated} · sent with{" "}
                  {file.usedIn} applications
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                {!isDefault && (
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => {
                      setDefaultId(file.id);
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
                  disabled={isDefault}
                  onClick={() => toast(`${file.name} deleted`)}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
