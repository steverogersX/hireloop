"use client";

import { Download, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { shortDate, statusLabel } from "@/lib/format";
import type { Application } from "@/types/api";

const COLUMNS = [
  "Role",
  "Company",
  "Location",
  "Stage",
  "Applied",
  "Days ago",
  "Source",
  "Next step",
] as const;

function toCsv(applications: Application[]) {
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;

  const rows = applications.map((item) =>
    [
      item.job.title,
      item.job.company.name,
      item.job.location,
      statusLabel[item.status],
      shortDate(item.createdAt),
      String(item.daysAgo),
      item.source,
      item.nextStep ?? "",
    ]
      .map(escape)
      .join(","),
  );

  return [COLUMNS.join(","), ...rows].join("\r\n");
}

export function ApplicationsActions({
  applications,
}: {
  applications: Application[];
}) {
  const exportCsv = () => {
    const blob = new Blob([toCsv(applications)], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "hireloop-applications.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${applications.length} applications`);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" onClick={exportCsv}>
        <Download />
        Export CSV
      </Button>
      <Button
        onClick={() =>
          toast("Track a role you applied to elsewhere", {
            description: "Paste a job link and it lands in your pipeline.",
          })
        }
      >
        <Plus />
        Add application
      </Button>
    </div>
  );
}
