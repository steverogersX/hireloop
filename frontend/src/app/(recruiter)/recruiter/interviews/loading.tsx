import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function InterviewsLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
      <Skeleton className="h-4 w-48" />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="grid gap-2">
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-8 w-44" />
      </div>

      {Array.from({ length: 3 }, (_, group) => (
        <section key={group} className="grid gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
          {Array.from({ length: 2 }, (_, row) => (
            <Card key={row} size="sm">
              <CardContent className="flex flex-wrap items-center gap-3">
                <div className="grid w-24 gap-1.5">
                  <Skeleton className="h-4 w-14" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <Skeleton className="size-9 rounded-full" />
                <div className="grid min-w-48 flex-1 gap-1.5">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-56" />
                </div>
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-24 rounded-4xl" />
                <div className="ml-auto flex gap-1.5">
                  <Skeleton className="h-7 w-24" />
                  <Skeleton className="h-7 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      ))}
    </div>
  );
}
