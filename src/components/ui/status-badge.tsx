import cn from "classnames";

export type BadgeStatus = "Alive" | "Dead" | "unknown";

interface StatusBadgeProps {
  status: BadgeStatus;
  size?: "sm" | "md";
}

/**
 * Colored status pill. The dot pulses only for living characters —
 * a small "heartbeat" detail.
 */
export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium capitalize",
        {
          "border-emerald-400/30 bg-emerald-400/10 text-emerald-300":
            status === "Alive",
          "border-red-400/30 bg-red-400/10 text-red-300": status === "Dead",
          "border-slate-400/30 bg-slate-400/10 text-slate-300":
            status === "unknown",
        },
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
      )}
    >
      <span
        aria-hidden
        className={cn("size-1.5 rounded-full", {
          "animate-pulse-dot bg-emerald-400": status === "Alive",
          "bg-red-400": status === "Dead",
          "bg-slate-400": status === "unknown",
        })}
      />
      {status}
    </span>
  );
}
