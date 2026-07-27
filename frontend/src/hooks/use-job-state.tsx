"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { toast } from "sonner";

import { jobs } from "@/lib/mock-data";

type JobStateContextValue = {
  savedIds: ReadonlySet<string>;
  appliedIds: ReadonlySet<string>;
  setSaved: (jobId: string, saved: boolean) => void;
  markApplied: (jobId: string) => void;
};

const JobStateContext = createContext<JobStateContextValue | null>(null);

const seed = (predicate: (job: (typeof jobs)[number]) => boolean) =>
  new Set(jobs.filter(predicate).map((job) => job.id));

/**
 * Saved and applied live here rather than on each card, so the same job shows
 * the same state in the feed, the tables and the detail page.
 */
export function JobStateProvider({ children }: { children: React.ReactNode }) {
  const [savedIds, setSavedIds] = useState(() => seed((job) => job.saved));
  const [appliedIds, setAppliedIds] = useState(() => seed((job) => job.applied));

  const setSaved = useCallback((jobId: string, saved: boolean) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (saved) next.add(jobId);
      else next.delete(jobId);
      return next;
    });
  }, []);

  const markApplied = useCallback((jobId: string) => {
    setAppliedIds((prev) => new Set(prev).add(jobId));
  }, []);

  const value = useMemo(
    () => ({ savedIds, appliedIds, setSaved, markApplied }),
    [savedIds, appliedIds, setSaved, markApplied]
  );

  return (
    <JobStateContext value={value}>{children}</JobStateContext>
  );
}

function useJobStateContext() {
  const context = useContext(JobStateContext);
  if (!context) {
    throw new Error("useJobState must be used inside a JobStateProvider");
  }
  return context;
}

export function useJobLists() {
  const { savedIds, appliedIds } = useJobStateContext();
  return { savedIds, appliedIds };
}

export function useJobState(jobId: string) {
  const { savedIds, appliedIds, setSaved, markApplied } = useJobStateContext();
  const saved = savedIds.has(jobId);

  return {
    saved,
    applied: appliedIds.has(jobId),
    toggleSaved: () => {
      setSaved(jobId, !saved);
      toast(saved ? "Removed from saved" : "Saved to your list");
    },
    markApplied: () => markApplied(jobId),
  };
}
