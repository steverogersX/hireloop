import { CandidateRows } from "@/components/recruiter/candidate-rows";
import { candidates } from "@/lib/recruiter-mock-data";

export function ApplicantsTable() {
  return <CandidateRows pool={candidates} withFilters pageSize={6} />;
}
