"use client";

import { Download, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { applications } from "@/lib/mock-data";

const COLUMNS = [
  "Role",
  "Company",
  "Location",
  "Stage",
  "Applied",
  "Days ago",
  "Source",
  "Salary",
  "Next step",
] as const;

function toCsv() {
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;

  const rows = applications.map((item) =>
    [
      item.jobTitle,
      item.company.name,
      item.location,
      item.stage,
      item.appliedOn,
      String(item.appliedDaysAgo),
      item.source,
      item.salary,
      item.nextStep,
    ]
      .map(escape)
      .join(",")
  );

  return [COLUMNS.join(","), ...rows].join("\r\n");
}

export function ApplicationsActions() {
  const exportCsv = () => {
    const blob = new Blob([toCsv()], { type: "text/csv;charset=utf-8;" });
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
