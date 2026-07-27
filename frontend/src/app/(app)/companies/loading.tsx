import { PageHeaderSkeleton } from "@/components/skeletons/page-skeletons";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CompaniesLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
      <Skeleton className="h-4 w-48" />
      <PageHeaderSkeleton />

      <div className="grid items-start gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <Card>
          <CardContent className="grid gap-4">
            <Skeleton className="h-4 w-20" />
            {Array.from({ length: 3 }, (_, group) => (
              <div key={group} className="grid gap-2">
                <Skeleton className="h-3 w-28" />
                {Array.from({ length: 4 }, (_, row) => (
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
          <Skeleton className="h-8 w-full" />
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-4 w-28" />
            <div className="flex gap-1.5">
              <Skeleton className="h-8 w-44" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <Card key={index}>
                <CardContent className="grid gap-3">
                  <div className="flex items-start gap-3">
                    <Skeleton className="size-11 rounded-xl" />
                    <div className="grid flex-1 gap-1.5">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <Skeleton className="h-3 w-full" />
                  <div className="flex gap-1.5">
                    {Array.from({ length: 4 }, (_, chip) => (
                      <Skeleton key={chip} className="h-5 w-16 rounded-4xl" />
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-2 border-t pt-3">
                    <Skeleton className="h-5 w-20 rounded-4xl" />
                    <div className="flex gap-1.5">
                      <Skeleton className="h-7 w-20 rounded-lg" />
                      <Skeleton className="h-7 w-24 rounded-lg" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
