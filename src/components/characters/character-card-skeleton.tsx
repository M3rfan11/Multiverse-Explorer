import { Skeleton } from "@/components/ui/skeleton";

/** Mirrors CharacterCard's exact dimensions so the swap causes no layout shift. */
export function CharacterCardSkeleton() {
  return (
    <li className="list-none overflow-hidden rounded-card border border-white/5 bg-space-900/60">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="mt-1 h-5 w-16 rounded-full" />
      </div>
    </li>
  );
}
