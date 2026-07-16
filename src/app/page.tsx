import { Suspense } from "react";
import { Dashboard } from "@/components/characters/dashboard";
import { CharacterGridSkeleton } from "@/components/characters/character-grid";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 md:px-8 lg:px-12">
      {/* useSearchParams requires a Suspense boundary during prerender */}
      <Suspense
        fallback={
          <div className="pt-10">
            <CharacterGridSkeleton />
          </div>
        }
      >
        <Dashboard />
      </Suspense>
    </main>
  );
}
