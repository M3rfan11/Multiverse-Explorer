import cn from "classnames";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  size?: "sm" | "md";
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-portal-500",
        "active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40",
        {
          "bg-portal-500 text-space-950 hover:bg-portal-400":
            variant === "primary",
          "border border-white/10 bg-transparent text-slate-200 hover:border-portal-500/40 hover:bg-white/5":
            variant === "ghost",
        },
        size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-sm",
        className,
      )}
      {...props}
    />
  );
}
