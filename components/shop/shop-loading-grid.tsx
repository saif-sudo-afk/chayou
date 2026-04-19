import { Skeleton } from "@/components/ui/skeleton";

export function ShopLoadingGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          className="space-y-4 rounded-[2rem] border border-border bg-panel/60 p-4"
          key={index}
        >
          <Skeleton className="h-80 rounded-[1.75rem]" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-11 rounded-full" />
        </div>
      ))}
    </div>
  );
}
