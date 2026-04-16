# Bettazon.id Web + Docs

## Big picture
- This repo combines a Next.js App Router frontend and product docs: public marketing/deep-link pages in `app/` + `components/`, internal admin panel in `app/admin/*`, and architecture source-of-truth docs in `docs/`.
- If docs and implementation diverge, treat `docs/` as intended behavior, then verify shipped behavior in `bettazon-id-be` and `bettazon-id-app`.

## Runtime architecture and boundaries
- Public routes are mostly static JSX with Tailwind (example: `app/page.jsx`, `app/privacy/page.jsx`).
- Deep-link routes (`app/product/[slug]/page.jsx`, `app/auction/[id]/page.jsx`, `app/live/[id]/page.jsx`) only set metadata and delegate to `components/AppLanding.jsx`.
- Admin panel is client-side (`'use client'`) and talks directly to backend REST via `lib/adminApi.js` using bearer token from `localStorage` (`admin_token`).
- Realtime admin chat (`app/admin/chats/page.jsx`) uses `socket.io-client` with `auth: { token }`; keep REST + websocket behavior aligned.

## Cross-repo contracts (do not break)
- Deep links must stay compatible with Flutter `deepLinkToPath` in `bettazon-id-app/lib/router.dart`.
- Keep deep-link shape exactly: `bettazon://bettazon.id/<type>/<id>` and Android intent host `bettazon.id`.
- API base URL comes from `NEXT_PUBLIC_API_BASE_URL` (fallback `http://localhost:5000`) in `lib/adminApi.js`.
- Backend error payloads are multilingual objects; frontend pattern is `message.id || message.en || error.id || error.en`.

## Project-specific coding patterns
- Use path alias `@/*` from `jsconfig.json`; prefer `@/components/...` imports over deep relative paths.
- Keep Indonesian copy/tone for user-facing/admin UI text.
- Styling is utility-first Tailwind inline; avoid introducing CSS modules/design-system abstractions unless repeated pain is clear.
- Brand colors are used directly in JSX (`#FE735C`, `#008080`) across marketing/admin screens.
- For metadata/SEO, follow existing `generateMetadata` + `metadataBase` + Open Graph patterns (`app/layout.js`, dynamic route pages).
- For admin auth gating, follow `app/admin/layout.js` redirect flow (`/admin/login` vs `/admin/dashboard`).
- For binary exports in admin pages, use `adminDownload(...)` (raw `Response`) instead of `adminFetch(...)` JSON parsing.
- Preserve `next.config.mjs` `.well-known` headers (Android App Links verification depends on this behavior).

## High-value docs to read first
- `docs/ARCHITECTURE.md`, `docs/API_DESIGN.md`, `docs/AUCTION_SPEC.md`, `docs/LIVE_STREAMING_SPEC.md`, `docs/SHIPPING_SPEC.md`, `docs/ADMIN_PANEL_PLAN.md`.

## Developer workflow
- Install: `npm install`
- Local web: `npm run dev`
- Lint: `npm run lint`
- Prod build check: `npm run build`
- For full feature testing, run backend repo (`bettazon-id-be`) on port `5000` so admin/deep-link flows resolve correctly.
