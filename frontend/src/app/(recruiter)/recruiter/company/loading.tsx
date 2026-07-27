import { PanelSkeleton } from "@/components/skeletons/page-skeletons";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CompanyProfileLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
      <Skeleton className="h-4 w-52" />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="size-12 rounded-xl" />
          <div className="grid gap-2">
            <Skeleton className="h-7 w-52" />
            <Skeleton className="h-4 w-72" />
          </div>
        </div>
        <Skeleton className="h-8 w-44" />
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="grid gap-4">
          {Array.from({ length: 3 }, (_, card) => (
            <Card key={card}>
              <CardHeader className="gap-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-64" />
              </CardHeader>
              <CardContent className="grid gap-4">
                {Array.from({ length: 3 }, (_, field) => (
                  <div key={field} className="grid gap-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <aside className="grid gap-4">
          <PanelSkeleton lines={3} />
          <PanelSkeleton lines={2} />
        </aside>
      </div>
    </div>
  );
}
