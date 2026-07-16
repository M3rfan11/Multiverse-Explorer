import type { Metadata } from "next";
import { InsightsDashboard } from "@/components/insights/insights-dashboard";
import { getAnalytics } from "@/lib/api/analytics";

export const metadata: Metadata = {
  title: "Insights · Multiverse Explorer",
  description:
    "Analytics across the Rick and Morty multiverse: character demographics, episode cast sizes, and the most populated locations.",
};

// Rendered per request (no build-time API dependency), but the underlying
// paginated fetches in getAnalytics are each cached for an hour — so in
// practice the page is served from cached data.
export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  const analytics = await getAnalytics();

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 md:px-8 lg:px-12">
      <InsightsDashboard analytics={analytics} />
    </main>
  );
}
