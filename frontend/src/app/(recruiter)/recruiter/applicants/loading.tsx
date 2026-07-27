import { TableSkeleton } from "@/components/skeletons/page-skeletons";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ApplicantsLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
      <Skeleton className="h-4 w-48" />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="grid gap-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-40" />
        </div>
      </div>

      <Card size="sm">
        <CardContent className="grid gap-3">
          <Skeleton className="h-2 w-full rounded-full" />
          <div className="flex gap-5">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-3 w-20" />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="rounded-xl bg-card px-3 py-3 ring-1 ring-foreground/10">
        <TableSkeleton rows={10} />
      </div>
    </div>
  );
}
