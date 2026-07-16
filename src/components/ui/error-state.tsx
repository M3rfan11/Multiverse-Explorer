import { Button } from "./button";
import { PortalRing } from "./portal-ring";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something broke in this dimension",
  description = "The request failed. It might be a network hiccup — try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-center gap-4 py-20 text-center">
      <PortalRing className="text-red-400" />
      <div>
        <h2 className="font-display text-lg font-semibold text-white">
          {title}
        </h2>
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </div>
      {onRetry ? <Button onClick={onRetry}>Try again</Button> : null}
    </div>
  );
}
