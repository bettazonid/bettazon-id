# Bettazon.id Web + Docs

## Purpose
This repo is a hybrid of:
- a small Next.js marketing/deep-link site in `app/` and `components/`
- the product/architecture source of truth in `docs/`

If code and docs disagree about platform behavior, prefer `docs/` for intended business rules and use the app/backend repos to verify implementation status.

## What the web app actually does
- `app/page.jsx` is a static landing page with large inline sections and Tailwind utility classes.
- `app/product/[slug]/page.jsx`, `app/auction/[id]/page.jsx`, and `app/live/[id]/page.jsx` only generate metadata and render `components/AppLanding.jsx`.
- `components/AppLanding.jsx` is the core behavior: mobile deep-link handoff to the Flutter app with Android intent fallback and iOS custom-scheme fallback.
- `app/privacy/page.jsx` is a long static legal page; keep edits content-focused and do not over-componentize it unless repeated patterns justify it.

## Cross-repo contract
- Deep-link URLs here must stay aligned with Flutter parsing in `bettazon-id-app/lib/router.dart` (`deepLinkToPath`).
- Use paths shaped like `bettazon://bettazon.id/<type>/<id>` and Android intent URLs with host `bettazon.id`; do not switch to `bettazon://<type>/<id>`.
- The current App Store URL in `components/AppLanding.jsx` is a placeholder; do not treat it as production truth without confirmation.

## Styling conventions
- This repo uses plain App Router components with Tailwind; there is no shared design system layer.
- Brand colors are repeated directly in JSX: `#FE735C` and `#008080`.
- Prefer matching the current utility-first style over introducing CSS modules or new abstraction layers.

## Metadata and SEO
- Route-level metadata lives in `app/layout.js` and per-page `generateMetadata` functions.
- When adding public pages, set Indonesian copy, `metadataBase`, and Open Graph fields consistently with existing route pages.

## Docs workflow
- Start architecture/product work from `docs/ARCHITECTURE.md`, `docs/API_DESIGN.md`, `docs/AUCTION_SPEC.md`, `docs/LIVE_STREAMING_SPEC.md`, and `docs/SHIPPING_SPEC.md`.
- This project is an ornamental fish marketplace with direct buy, page auctions, live auctions, escrow, and domestic/international shipping.
- Backend heritage from Setorin matters historically, but new docs should use Bettazon roles and flows (`buyer`, `seller`, live commerce) rather than legacy waste-management terminology.

## Developer workflow
- Install with `npm install`.
- Run locally with `npm run dev`.
- Validate production build with `npm run build`.
- Lint with `npm run lint`.
