"use client";

import { useState } from "react";
import { ArrowRight, MessageSquarePlus, Star, X } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  PIPELINE_STAGES,
  stageTone,
  type Candidate,
  type PipelineStage,
} from "@/lib/recruiter-mock-data";

const ADVANCE_ORDER: PipelineStage[] = [
  "Applied",
  "In review",
  "Interview",
  "Offer",
  "Hired",
];

export function StageControl({ candidate }: { candidate: Candidate }) {
  const [stage, setStage] = useState<PipelineStage>(candidate.stage);

  const index = ADVANCE_ORDER.indexOf(stage);
  const next = index >= 0 ? ADVANCE_ORDER[index + 1] : undefined;

  const move = (value: PipelineStage) => {
    setStage(value);
    toast.success(`${candidate.name} moved to ${value}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge className={stageTone[stage]}>{stage}</Badge>

      <Select value={stage} onValueChange={(value) => move(value as PipelineStage)}>
        <SelectTrigger size="sm" className="w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PIPELINE_STAGES.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {next && (
        <Button size="sm" onClick={() => move(next)}>
          Move to {next}
          <ArrowRight data-icon="inline-end" />
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => toast(`${candidate.name} shortlisted`)}
      >
        <Star />
        Shortlist
      </Button>

      {stage !== "Rejected" && (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => move("Rejected")}
        >
          <X />
          Reject
        </Button>
      )}
    </div>
  );
}

export function NoteComposer({ candidate }: { candidate: Candidate }) {
  const [body, setBody] = useState("");

  return (
    <div className="grid gap-2">
      <Textarea
        rows={3}
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder={`Leave a note about ${candidate.name.split(" ")[0]} for the hiring team.`}
      />
      <div className="flex justify-end">
        <Button
          size="sm"
          disabled={body.trim().length === 0}
          onClick={() => {
            setBody("");
            toast.success("Note added", {
              description: "Your team can see it on this profile.",
            });
          }}
        >
          <MessageSquarePlus />
          Add note
        </Button>
      </div>
    </div>
  );
}
