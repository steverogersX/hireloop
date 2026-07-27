import {
  PageHeaderSkeleton,
  PanelSkeleton,
} from "@/components/skeletons/page-skeletons";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
      <Skeleton className="h-4 w-56" />
      <PageHeaderSkeleton />

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="grid min-w-0 gap-4">
          <Card>
            <CardHeader className="gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-64" />
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 8 }, (_, index) => (
                <div key={index} className="grid gap-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-72" />
            </CardHeader>
            <CardContent className="grid gap-2">
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-80" />
            </CardHeader>
            <CardContent className="flex flex-wrap gap-1.5">
              {Array.from({ length: 8 }, (_, index) => (
                <Skeleton key={index} className="h-5 w-24 rounded-4xl" />
              ))}
            </CardContent>
          </Card>

          <PanelSkeleton lines={3} />
        </div>

        <aside className="grid gap-4">
          <PanelSkeleton lines={3} />
          <PanelSkeleton lines={3} />
        </aside>
      </div>
    </div>
  );
}
