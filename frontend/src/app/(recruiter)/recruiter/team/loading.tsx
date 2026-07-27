import { PanelSkeleton } from "@/components/skeletons/page-skeletons";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeamLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
      <Skeleton className="h-4 w-40" />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="grid gap-2">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-8 w-40" />
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="grid gap-4">
          <Card>
            <CardHeader className="gap-2 border-b">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-72" />
            </CardHeader>
            <CardContent className="grid gap-4">
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-full" />
                  <div className="grid flex-1 gap-1.5">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-52" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </CardContent>
          </Card>

          <PanelSkeleton lines={2} />
        </div>

        <aside className="grid gap-4">
          <PanelSkeleton lines={2} />
          <PanelSkeleton lines={3} />
        </aside>
      </div>
    </div>
  );
}
