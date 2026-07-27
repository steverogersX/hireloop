import { PanelSkeleton } from "@/components/skeletons/page-skeletons";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AlertsLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
      <Skeleton className="h-4 w-52" />
      <div className="grid gap-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-80" />
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="grid min-w-0 gap-3">
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-8 w-28" />
          </div>
          {Array.from({ length: 4 }, (_, index) => (
            <Card key={index}>
              <CardContent className="grid gap-3">
                <div className="flex items-start gap-3">
                  <Skeleton className="size-9 rounded-lg" />
                  <div className="grid flex-1 gap-1.5">
                    <Skeleton className="h-4 w-56" />
                    <Skeleton className="h-3 w-40" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                  <Skeleton className="h-6 w-24" />
                </div>
                <div className="flex gap-1.5 border-t pt-3">
                  {Array.from({ length: 3 }, (_, chip) => (
                    <Skeleton key={chip} className="h-5 w-24 rounded-4xl" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <aside className="grid gap-4">
          <PanelSkeleton lines={4} />
          <PanelSkeleton lines={2} />
        </aside>
      </div>
    </div>
  );
}
