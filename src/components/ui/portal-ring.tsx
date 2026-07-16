import cn from "classnames";

interface PortalRingProps {
  className?: string;
}

/** Decorative slowly-rotating portal, used by empty/error states. */
export function PortalRing({ className }: PortalRingProps) {
  return (
    <svg
      aria-hidden
      className={cn(
        "size-24 animate-[spin_12s_linear_infinite] text-portal-500",
        className,
      )}
      viewBox="0 0 100 100"
      fill="none"
    >
      <circle
        cx="50"
        cy="50"
        r="42"
        stroke="currentColor"
        strokeWidth="3"
        strokeDasharray="40 14 60 20"
        strokeLinecap="round"
        className="opacity-70"
      />
      <circle
        cx="50"
        cy="50"
        r="30"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="30 26"
        strokeLinecap="round"
        className="opacity-40"
      />
      <circle cx="50" cy="50" r="16" fill="currentColor" className="opacity-10" />
    </svg>
  );
}
