import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MessagesLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
      <Skeleton className="h-4 w-48" />
      <div className="grid gap-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid gap-3 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-start">
        <Card>
          <CardContent className="grid gap-2">
            <Skeleton className="h-8 w-full" />
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="grid gap-1.5 px-2 py-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="size-7 rounded-md" />
                  <Skeleton className="h-3.5 flex-1" />
                  <Skeleton className="h-3 w-10" />
                </div>
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="grid gap-3">
            <div className="flex items-start gap-3 border-b pb-3">
              <Skeleton className="size-10 rounded-lg" />
              <div className="grid flex-1 gap-1.5">
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-3 w-80" />
              </div>
              <Skeleton className="h-8 w-28" />
            </div>

            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className={
                  index % 2 === 1
                    ? "flex flex-row-reverse gap-2.5"
                    : "flex gap-2.5"
                }
              >
                <Skeleton className="size-7 shrink-0 rounded-full" />
                <Skeleton className="h-16 w-2/3 rounded-xl" />
              </div>
            ))}

            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
