import cn from "classnames";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-xl bg-gradient-to-r from-space-800 via-space-800/50 to-space-800 bg-[length:200%_100%]",
        className,
      )}
    />
  );
}
