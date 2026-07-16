"use client";

import { ErrorState } from "@/components/ui/error-state";

export default function CharacterError({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto max-w-5xl px-4 md:px-8">
      <ErrorState
        title="Couldn't load this character"
        description="Something went wrong fetching from the multiverse. Give it another shot."
        onRetry={reset}
      />
    </main>
  );
}
