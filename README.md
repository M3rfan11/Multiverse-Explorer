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

Other scripts: `npm run build`, `npm run lint`, `npm run typecheck`.

## Stack

Next.js 15 (App Router), TypeScript (strict), TanStack Query v5, Tailwind CSS, classnames, Framer Motion.

## Why the App Router

Two reasons. First, it lets the character detail page demonstrate a real server/client boundary: the route is a server component that prefetches the character into a QueryClient, dehydrates it, and passes it through `HydrationBoundary` — so the character name is in the initial HTML, there's no client-side spinner on direct navigation, and the browser's `useCharacter(id)` hydrates from the same cache instead of refetching. `generateMetadata` gives per-character page titles from the same request (Next memoizes identical GET fetches within a render). Second, it's the current default for new Next.js projects, and I'd rather be evaluated on the architecture I'd actually ship.

## Architecture decisions

**The URL is the only filter state.** `?name=rick&status=alive&page=2` is parsed and sanitized by one hook (`useDashboardFilters`); components never hold filter state. This makes every view shareable and refresh-proof. Typing uses `router.replace` (no history spam), pagination uses `router.push` (back button steps through pages). Invalid params like `status=banana` or `page=-1` fall back to defaults.

**One place talks to the network.** `lib/api/client.ts` owns all fetching. It normalizes two API quirks so the UI never sees them: the API returns 404 when filters match nothing (converted to an empty result set, so the UI shows "no results" instead of an error), and `/episode/:id` returns a bare object instead of an array when given a single id. Episodes are batch-fetched in one request (`/episode/1,2,3`) regardless of count.

**Query keys come from a factory** (`lib/api/query-keys.ts`), so identical filters always produce identical cache keys. `useCharacters` uses `keepPreviousData`, which is why pagination never flashes a skeleton grid — the previous page stays visible, dimmed, while the next loads.

**Styling** is Tailwind with all design tokens in `tailwind.config.ts` (no hard-coded hex in components). All conditional class logic goes through `classnames` — the clearest example is `StatusBadge`, where the status→color mapping is keyed on a TypeScript union (`"Alive" | "Dead" | "unknown"`), so an unhandled status is a compile error, not a gray fallback.

**Motion** lives in `lib/motion/index.ts` — one vocabulary of durations, easings, and variants that components import, so nothing invents its own timing. Everything animates transform/opacity only. All entrance animations respect `prefers-reduced-motion`.

## Trade-offs, given the time box

- **Entrance-only page transitions.** The App Router unmounts the outgoing page immediately, so exit animations require freezing router context — fragile for what it buys. I kept a clean entrance via `template.tsx`.
- **No shared-element image morph** between card and detail for the same reason: `layoutId` across route remounts is unreliable, and a broken morph is worse than none.
- **Pagination over infinite scroll**, because pages are URL-addressable (`?page=5` is a place you can link to; scroll position isn't).
- **Curated species filter list** rather than deriving species from data — the API has no endpoint for distinct species values.
- **Dashboard fetches client-side** (with skeletons) while the detail page is server-prefetched. Filters are interactive client state anyway; the detail page is where SSR actually improves first paint and demonstrates the hydration boundary.
- **No tests yet.** With more time I'd add Vitest + MSW covering `useDashboardFilters` (URL parsing/sanitizing) and the 404-as-empty client behavior, since those carry the most logic.

## Project structure

```
src/
  app/                    # routes, layouts, error/not-found boundaries
  components/ui/          # dumb primitives (Badge, Button, Skeleton, …)
  components/characters/  # feature components (Dashboard, CharacterDetail, …)
  components/layout/      # Header, PageTransition
  lib/api/                # fetch client, query key factory
  lib/hooks/              # useCharacters, useCharacter, useEpisodes, useDashboardFilters
  lib/motion/             # shared animation variants
  types/                  # API types
```

The Docker image is a multi-stage build on Next's `standalone` output — dependencies cached in their own layer, and the runtime image contains only traced files, running as a non-root user.
