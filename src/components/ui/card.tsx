import cn from "classnames";
import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

/** Glassmorphism surface used across the app. */
export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-white/5 bg-space-900/60 backdrop-blur",
        className,
      )}
      {...props}
    />
  );
}
