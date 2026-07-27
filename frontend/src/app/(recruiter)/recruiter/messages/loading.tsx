import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MessagesLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
      <Skeleton className="h-4 w-44" />

      <div className="grid gap-2">
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <Card>
          <CardContent className="grid gap-2 px-3">
            <Skeleton className="h-8 w-full" />
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="flex items-center gap-2.5 px-2.5 py-2">
                <Skeleton className="size-8 rounded-full" />
                <div className="grid flex-1 gap-1.5">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-3 w-36" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="grid gap-3">
            <div className="flex items-center gap-2.5 border-b pb-3">
              <Skeleton className="size-9 rounded-full" />
              <div className="grid flex-1 gap-1.5">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-7 w-28" />
            </div>
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton
                key={index}
                className={index % 2 ? "h-16 w-3/4 justify-self-end" : "h-16 w-3/4"}
              />
            ))}
            <Skeleton className="h-20 w-full border-t" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
