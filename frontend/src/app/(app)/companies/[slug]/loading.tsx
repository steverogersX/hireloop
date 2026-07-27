import {
  PanelSkeleton,
  TextBlockSkeleton,
} from "@/components/skeletons/page-skeletons";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CompanyLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
      <Skeleton className="h-4 w-64" />

      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-start gap-4">
            <Skeleton className="size-16 rounded-xl" />
            <div className="grid flex-1 gap-2">
              <Skeleton className="h-7 w-56" />
              <Skeleton className="h-4 w-72" />
              <Skeleton className="h-4 w-96" />
              <div className="flex gap-1.5">
                {Array.from({ length: 3 }, (_, index) => (
                  <Skeleton key={index} className="h-5 w-24 rounded-4xl" />
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-44" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>

          <div className="grid gap-3 border-t pt-3 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="grid gap-1.5">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="grid min-w-0 gap-3">
          <div className="flex gap-1.5">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-8 w-28 rounded-lg" />
            ))}
          </div>

          <Card>
            <CardHeader>
              <Skeleton className="h-4 w-44" />
            </CardHeader>
            <CardContent className="grid gap-5">
              <TextBlockSkeleton lines={3} />
              <div className="grid gap-2 sm:grid-cols-2">
                {Array.from({ length: 2 }, (_, index) => (
                  <div key={index} className="grid gap-2 rounded-lg p-3 ring-1 ring-foreground/5">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3.5 w-full" />
                    <Skeleton className="h-3.5 w-2/3" />
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: 6 }, (_, index) => (
                  <Skeleton key={index} className="h-5 w-20 rounded-4xl" />
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <PanelSkeleton lines={4} />
            <PanelSkeleton lines={3} />
          </div>
        </div>

        <aside className="grid gap-4">
          <PanelSkeleton lines={3} />
          <PanelSkeleton lines={3} />
        </aside>
      </div>
    </div>
  );
}
