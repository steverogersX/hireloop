import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TalentSearchLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
      <Skeleton className="h-4 w-52" />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="grid gap-2">
          <Skeleton className="h-7 w-44" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-8 w-36" />
      </div>

      <Card>
        <CardContent className="flex flex-col gap-2 sm:flex-row">
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 sm:w-32" />
        </CardContent>
      </Card>

      <div className="grid items-start gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <Card>
          <CardContent className="grid gap-3">
            <Skeleton className="h-4 w-20" />
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-8 w-full" />
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-3">
          {Array.from({ length: 4 }, (_, index) => (
            <Card key={index}>
              <CardContent className="flex flex-wrap items-start gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="grid min-w-48 flex-1 gap-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-3 w-72" />
                  <div className="flex gap-1.5">
                    {Array.from({ length: 4 }, (_, chip) => (
                      <Skeleton key={chip} className="h-5 w-16 rounded-4xl" />
                    ))}
                  </div>
                </div>
                <Skeleton className="size-13 rounded-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
