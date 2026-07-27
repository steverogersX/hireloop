import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
      <Skeleton className="h-4 w-40" />

      <div className="grid gap-2">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>

      <Skeleton className="h-9 w-80" />

      <div className="grid max-w-3xl gap-4">
        {Array.from({ length: 2 }, (_, card) => (
          <Card key={card}>
            <CardHeader className="gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-64" />
            </CardHeader>
            <CardContent className="grid gap-4">
              {Array.from({ length: 3 }, (_, row) => (
                <div key={row} className="grid gap-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
