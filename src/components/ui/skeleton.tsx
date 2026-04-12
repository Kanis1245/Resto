import { cn } from "@/lib/utils";

export function Squelette({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-gray-200",
        className
      )}
    />
  );
}

export function SqueletteCarteRestaurant() {
  return (
    <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
      <Squelette className="h-44 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Squelette className="h-5 w-3/4" />
        <Squelette className="h-4 w-1/2" />
        <div className="flex gap-2 pt-1">
          <Squelette className="h-6 w-16 rounded-full" />
          <Squelette className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function SqueletteArticleMenu() {
  return (
    <div className="flex gap-3 p-3 rounded-xl border border-gray-100">
      <div className="flex-1 space-y-2">
        <Squelette className="h-5 w-2/3" />
        <Squelette className="h-4 w-full" />
        <Squelette className="h-5 w-20" />
      </div>
      <Squelette className="h-20 w-20 rounded-xl flex-shrink-0" />
    </div>
  );
}
