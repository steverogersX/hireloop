import {
  PageHeaderSkeleton,
  PanelSkeleton,
  StatCardsSkeleton,
  TableSkeleton,
} from "@/components/skeletons/page-skeletons";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecruiterOverviewLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
      <PageHeaderSkeleton />
      <StatCardsSkeleton />

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="grid min-w-0 gap-4">
          <Card>
            <CardHeader className="gap-2 border-b">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-72" />
            </CardHeader>
            <CardContent className="grid gap-4">
              <Skeleton className="h-2 w-full rounded-full" />
              <TableSkeleton rows={5} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="gap-2 border-b">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-56" />
            </CardHeader>
            <CardContent className="grid gap-3">
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="grid gap-3 rounded-xl border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="grid gap-2">
                      <Skeleton className="h-4 w-56" />
                      <Skeleton className="h-3 w-72" />
                    </div>
                    <Skeleton className="size-7 rounded-full" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                  <Skeleton className="h-3 w-80" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <aside className="grid gap-4">
          <PanelSkeleton lines={3} />
          <PanelSkeleton lines={4} />
          <PanelSkeleton lines={4} />
        </aside>
      </div>
    </div>
  );
}
