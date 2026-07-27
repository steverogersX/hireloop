import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
      <Skeleton className="h-4 w-44" />
      <div className="grid gap-2">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid max-w-4xl gap-3">
        <div className="flex gap-1.5">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-8 w-32 rounded-lg" />
          ))}
        </div>

        <Card>
          <CardHeader className="gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-72" />
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="grid gap-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="ml-auto h-8 w-32" />
        </div>
      </div>
    </div>
  );
}
