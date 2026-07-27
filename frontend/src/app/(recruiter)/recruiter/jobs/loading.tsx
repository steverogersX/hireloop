import { TableSkeleton } from "@/components/skeletons/page-skeletons";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecruiterJobsLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
      <Skeleton className="h-4 w-52" />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="grid gap-2">
          <Skeleton className="h-7 w-44" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-8 w-28" />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Card key={index} size="sm">
            <CardContent className="grid gap-1.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-14" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Skeleton className="h-8 w-80" />

      <div className="rounded-xl bg-card px-3 py-3 ring-1 ring-foreground/10">
        <TableSkeleton rows={8} />
      </div>
    </div>
  );
}
