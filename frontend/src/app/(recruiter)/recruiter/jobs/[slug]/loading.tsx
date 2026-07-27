import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PostingLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
      <Skeleton className="h-4 w-72" />

      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="grid gap-2">
              <Skeleton className="h-7 w-72" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
          <div className="flex gap-6 border-y py-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="grid gap-1.5">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-10" />
              </div>
            ))}
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </CardContent>
      </Card>

      <Skeleton className="h-9 w-72" />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, column) => (
          <div key={column} className="grid gap-2 rounded-xl bg-muted/40 p-2.5">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-20 rounded-4xl" />
              <Skeleton className="h-3 w-4" />
            </div>
            {Array.from({ length: 2 }, (_, card) => (
              <div
                key={card}
                className="grid gap-2 rounded-lg bg-card p-2.5 ring-1 ring-foreground/10"
              >
                <div className="flex items-start gap-2.5">
                  <Skeleton className="size-8 rounded-full" />
                  <div className="grid flex-1 gap-1.5">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                  <Skeleton className="size-8 rounded-full" />
                </div>
                <div className="flex gap-1">
                  <Skeleton className="h-5 w-14 rounded-4xl" />
                  <Skeleton className="h-5 w-16 rounded-4xl" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
