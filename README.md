# Multiverse Explorer

A responsive app for browsing Rick and Morty characters and the episodes they appear in.

Live demo: _add your Vercel URL here_

## Running it

With Docker (no Node required):

```bash
docker compose up --build
# → http://localhost:3000
```

Or locally:

```bash
npm install
npm run dev
# → http://localhost:3000
```

Other scripts: `npm run build`, `npm run lint`, `npm run typecheck`, `npm test`.

## Stack

Next.js 15 (App Router), TypeScript (strict), TanStack Query v5, Tailwind CSS, classnames, Framer Motion.

## Why the App Router

Two reasons. First, it lets the character detail page demonstrate a real server/client boundary: the route is a server component that prefetches the character into a QueryClient, dehydrates it, and passes it through `HydrationBoundary` — so the character name is in the initial HTML, there's no client-side spinner on direct navigation, and the browser's `useCharacter(id)` hydrates from the same cache instead of refetching. `generateMetadata` gives per-character page titles from the same request (Next memoizes identical GET fetches within a render). Second, it's the current default for new Next.js projects, and I'd rather be evaluated on the architecture I'd actually ship.

## Architecture decisions

**The URL is the only filter state.** `?name=rick&status=alive&page=2` is parsed and sanitized by one hook (`useDashboardFilters`); components never hold filter state. This makes every view shareable and refresh-proof. Typing uses `router.replace` (no history spam), pagination uses `router.push` (back button steps through pages). Invalid params like `status=banana` or `page=-1` fall back to defaults.

**One place talks to the network.** `lib/api/` owns all fetching. The REST client normalizes an API quirk so the UI never sees it: the API returns 404 when filters match nothing, which is converted to an empty result set, so the UI shows "no results" instead of an error. Real failures still throw and reach the error state.

**REST and GraphQL, split deliberately.** The dashboard uses REST — its pagination and filter parameters map 1:1 to the endpoint. The detail page uses GraphQL (`graphql-request`), because it needs a character *and* its episodes: one query returns both, with exactly the fields the page renders, where REST would take two round-trips. GraphQL returns ids as strings and status as a plain `String`, so `lib/api/graphql.ts` narrows the raw response into the app's typed domain model at the boundary. One detail: GraphQL requests are POSTs, which Next's fetch memoization doesn't dedupe — so the route wraps the fetcher in React's `cache()` to share one request between `generateMetadata` and the page prefetch.

**Query keys come from a factory** (`lib/api/query-keys.ts`), so identical filters always produce identical cache keys. `useCharacters` uses `keepPreviousData`, which is why pagination never flashes a skeleton grid — the previous page stays visible, dimmed, while the next loads.

**Styling** is Tailwind with all design tokens in `tailwind.config.ts` (no hard-coded hex in components). All conditional class logic goes through `classnames` — the clearest example is `StatusBadge`, where the status→color mapping is keyed on a TypeScript union (`"Alive" | "Dead" | "unknown"`), so an unhandled status is a compile error, not a gray fallback.

**Motion** lives in `lib/motion/index.ts` — one vocabulary of durations, easings, and variants that components import, so nothing invents its own timing. Everything animates transform/opacity only. All entrance animations respect `prefers-reduced-motion`.

## Trade-offs, given the time box

- **Entrance-only page transitions.** The App Router unmounts the outgoing page immediately, so exit animations require freezing router context — fragile for what it buys. I kept a clean entrance via `template.tsx`.
- **No shared-element image morph** between card and detail for the same reason: `layoutId` across route remounts is unreliable, and a broken morph is worse than none.
- **Pagination over infinite scroll**, because pages are URL-addressable (`?page=5` is a place you can link to; scroll position isn't).
- **Curated species filter list** rather than deriving species from data — the API has no endpoint for distinct species values.
- **Dashboard fetches client-side** (with skeletons) while the detail page is server-prefetched. Filters are interactive client state anyway; the detail page is where SSR actually improves first paint and demonstrates the hydration boundary.
- **Tests target logic, not markup.** Vitest + Testing Library + MSW (no real network — unhandled requests fail the test). Covered: `useCharacters` (success, 404-as-empty, server error, and the `keepPreviousData` pagination behavior), `useDashboardFilters` (URL parsing, garbage-param sanitizing, replace-vs-push semantics), and `StatusBadge` (the status→color mapping). Snapshot-testing every component would add noise, not confidence.

## Project structure

```
src/
  app/                    # routes, layouts, error/not-found boundaries
  components/ui/          # dumb primitives (Badge, Button, Skeleton, …)
  components/characters/  # feature components (Dashboard, CharacterDetail, …)
  components/layout/      # Header, PageTransition
  lib/api/                # REST client, GraphQL client, query key factory
  lib/hooks/              # useCharacters, useCharacterWithEpisodes, useDashboardFilters
  lib/motion/             # shared animation variants
  test/                   # MSW server + test setup
  types/                  # API types
```

The Docker image is a multi-stage build on Next's `standalone` output — dependencies cached in their own layer, and the runtime image contains only traced files, running as a non-root user.
