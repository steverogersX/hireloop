import {
  JobCardSkeleton,
  PageHeaderSkeleton,
  PanelSkeleton,
} from "@/components/skeletons/page-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function SavedLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
      <Skeleton className="h-4 w-52" />
      <PageHeaderSkeleton />

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="grid min-w-0 gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-7 w-28 rounded-lg" />
            ))}
            <Skeleton className="ml-auto h-8 w-56" />
            <Skeleton className="h-8 w-40" />
          </div>
          {Array.from({ length: 3 }, (_, index) => (
            <JobCardSkeleton key={index} />
          ))}
        </div>

        <aside className="grid gap-4">
          <PanelSkeleton lines={3} />
          <PanelSkeleton lines={1} />
        </aside>
      </div>
    </div>
  );
}
