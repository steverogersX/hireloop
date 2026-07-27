import {
  JobCardSkeleton,
  PageHeaderSkeleton,
  PanelSkeleton,
  StatCardsSkeleton,
  TableSkeleton,
} from "@/components/skeletons/page-skeletons";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
      <PageHeaderSkeleton />
      <StatCardsSkeleton />

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="grid min-w-0 gap-4">
          <Card>
            <CardHeader className="gap-2 border-b">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-64" />
            </CardHeader>
            <CardContent className="grid gap-4">
              <Skeleton className="h-2 w-full rounded-full" />
              <TableSkeleton rows={4} />
            </CardContent>
          </Card>

          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-72" />
            <Skeleton className="ml-auto h-8 w-40" />
          </div>

          {Array.from({ length: 3 }, (_, index) => (
            <JobCardSkeleton key={index} />
          ))}
        </div>

        <aside className="grid gap-4">
          <PanelSkeleton lines={3} />
          <PanelSkeleton lines={3} />
          <PanelSkeleton lines={3} />
        </aside>
      </div>
    </div>
  );
}
