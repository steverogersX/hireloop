import {
  PanelSkeleton,
  TextBlockSkeleton,
} from "@/components/skeletons/page-skeletons";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ApplicantLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
      <Skeleton className="h-4 w-64" />

      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-start gap-4">
            <Skeleton className="size-14 rounded-full" />
            <div className="grid flex-1 gap-2">
              <Skeleton className="h-7 w-56" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="size-16 rounded-full" />
          </div>
          <div className="flex gap-6 border-y py-3">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="grid gap-1.5">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-14" />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-7 w-36" />
            <Skeleton className="h-7 w-28" />
          </div>
        </CardContent>
      </Card>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="grid min-w-0 gap-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <TextBlockSkeleton lines={3} />
            </CardContent>
          </Card>
          <PanelSkeleton lines={3} />
          <PanelSkeleton lines={2} />
        </div>

        <aside className="grid gap-4">
          <PanelSkeleton lines={2} />
          <PanelSkeleton lines={2} />
          <PanelSkeleton lines={3} />
        </aside>
      </div>
    </div>
  );
}
