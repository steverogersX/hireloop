import {
  JobCardSkeleton,
  PageHeaderSkeleton,
} from "@/components/skeletons/page-skeletons";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function JobsLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
      <Skeleton className="h-4 w-56" />
      <PageHeaderSkeleton />

      <Card>
        <CardContent className="flex flex-col gap-2 sm:flex-row">
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 sm:w-32" />
        </CardContent>
      </Card>

      <div className="grid items-start gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <Card>
          <CardContent className="grid gap-4">
            <Skeleton className="h-4 w-20" />
            {Array.from({ length: 5 }, (_, group) => (
              <div key={group} className="grid gap-2">
                <Skeleton className="h-3.5 w-32" />
                {Array.from({ length: 3 }, (_, row) => (
                  <div key={row} className="flex items-center gap-2">
                    <Skeleton className="size-4 shrink-0 rounded-sm" />
                    <Skeleton className="h-3 flex-1" />
                    <Skeleton className="h-3 w-5" />
                  </div>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid min-w-0 gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Skeleton className="h-4 w-48" />
            <div className="flex gap-1.5">
              <Skeleton className="h-8 w-44" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
          {Array.from({ length: 4 }, (_, index) => (
            <JobCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
