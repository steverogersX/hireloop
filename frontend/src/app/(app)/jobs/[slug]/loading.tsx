import {
  PanelSkeleton,
  TextBlockSkeleton,
} from "@/components/skeletons/page-skeletons";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function JobLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
      <Skeleton className="h-4 w-72" />

      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-start gap-4">
            <Skeleton className="size-14 rounded-xl" />
            <div className="grid flex-1 gap-2">
              <Skeleton className="h-7 w-80" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="size-16 rounded-full" />
          </div>
          <div className="flex flex-wrap gap-6 border-y py-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="grid gap-1.5">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Skeleton className="h-4 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="size-8" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="grid min-w-0 gap-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent className="grid gap-5">
              <TextBlockSkeleton lines={4} />
              {Array.from({ length: 2 }, (_, group) => (
                <div key={group} className="grid gap-2">
                  <Skeleton className="h-4 w-44" />
                  {Array.from({ length: 4 }, (_, line) => (
                    <Skeleton key={line} className="h-4 w-full" />
                  ))}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="gap-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-52" />
            </CardHeader>
            <CardContent className="grid gap-4">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="flex gap-3">
                  <Skeleton className="size-6 shrink-0 rounded-full" />
                  <div className="grid flex-1 gap-1.5">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3.5 w-full" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <aside className="grid gap-4">
          <PanelSkeleton lines={4} />
          <PanelSkeleton lines={3} />
        </aside>
      </div>
    </div>
  );
}
