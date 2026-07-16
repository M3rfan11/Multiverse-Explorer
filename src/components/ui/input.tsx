import cn from "classnames";
import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-white/10 bg-space-900/80 px-3 py-2 text-sm text-slate-200",
        "placeholder:text-slate-500",
        "transition-shadow duration-150 focus:outline-none focus:ring-2 focus:ring-portal-500/60",
        className,
      )}
      {...props}
    />
  );
}
