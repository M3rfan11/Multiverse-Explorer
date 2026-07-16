"use client";

import { ErrorState } from "@/components/ui/error-state";

export default function InsightsError({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto max-w-7xl px-4 md:px-8">
      <ErrorState
        title="Couldn't compute insights"
        description="Aggregating the multiverse failed. It's usually a network hiccup — try again."
        onRetry={reset}
      />
    </main>
  );
}
