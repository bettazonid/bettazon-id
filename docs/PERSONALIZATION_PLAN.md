# Personalization & Recommendation System Plan
**Bettazon.id — Ornamental Fish Marketplace**
**Last updated: 2026-04-05**

---

## Overview

Personalized feed surfaces the right products to the right buyer at the right time. For an ornamental fish marketplace, this means understanding species affinity (betta vs koi vs guppy), price range sensitivity, and local shipping convenience — then progressively layering seller monetization on top.

The system is built in 5 phases, each independently deployable. Phases 1–3 cover organic recommendation. Phases 3–4 add seller monetization. Phase 5 enables ML-grade collaborative filtering once data volume is sufficient.

---

## Architecture Summary

```
User Action (view/cart/purchase/search)
        │
        ▼
POST /api/feed/track  (fire-and-forget, no auth required)
        │
        ▼
UserEvent collection (MongoDB, TTL 90 days)
        │
        ▼
GET /api/feed/feed  (authenticated or anonymous)
        │
   ┌────┴────┐
   │ Phase 1 │  Content-based: last 30 events → species/category/priceRange match
   │ Phase 2 │  Interest Profile: weighted preferences per user (updated async)
   │ Phase 3 │  Boost multiplier from SellerSubscription tier
   │ Phase 4 │  SponsoredAd slots (targeted, labeled "Sponsor")
   │ Phase 5 │  Collaborative filtering (item-based CF, needs ~1000+ purchases)
   └─────────┘
        │
        ▼
Scored & ranked product list → Flutter "Untukmu" section
```

---

## Scoring Formula

```
final_score = (
    species_match_score * 3.0   +   // strongest signal
    category_match_score * 2.0  +
    price_range_score * 1.5     +
    city_proximity_score * 1.0  +   // cheap domestic shipping
    popularity_score * 0.5          // fallback/tie-breaker
) × boost_multiplier                // Phase 3: 1.0–2.0 based on seller tier
```

For new/anonymous users, fall back to pure `popularity_score` (quantitySold + recent views).

---

## Phase 1 — Foundation: Event Tracking + Content-Based Feed

**Status:** ✅ Implemented

### Goals
- Track user behavior (view, cart, purchase, search, skip, wishlist)
- Serve a basic personalized feed based on the last 30 events
- Anonymous users get popularity-based fallback

### Data Models

#### `UserEvent` (new)
```js
{
  userId:     ObjectId | null,   // null for anonymous
  sessionId:  String,            // client-generated UUID for anonymous linking
  productId:  ObjectId | null,   // null for search events
  eventType:  'view' | 'cart' | 'purchase' | 'search' | 'skip' | 'wishlist',
  metadata: {
    species:    String,          // e.g. "halfmoon", "moscow blue"
    category:   String,          // e.g. "betta", "guppy", "koi"
    variant:    String,          // e.g. "HMPK", "galaxy"
    priceRange: String,          // e.g. "0-50000", "50000-200000", "200000+"
    keyword:    String,          // for search events
  },
  duration:   Number,            // seconds on product detail page
  ipHash:     String,            // hashed IP for rate-limiting anonymous events
  timestamp:  Date,              // indexed
}
// TTL index: expires after 90 days
// Compound index: { userId, timestamp } and { sessionId, timestamp }
```

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/feed/track` | Optional | Record a user event |
| GET | `/api/feed/feed` | Optional | Get personalized product list |

#### POST `/api/feed/track`
```json
{
  "sessionId": "uuid-string",
  "productId": "64abc...",
  "eventType": "view",
  "metadata": {
    "species": "halfmoon",
    "category": "betta",
    "variant": "HMPK",
    "priceRange": "50000-200000"
  },
  "duration": 45
}
```
Response: `200 OK` always (fire-and-forget, never blocks the user)

#### GET `/api/feed/feed?page=1&limit=10`
Response:
```json
{
  "data": {
    "products": [...],
    "page": 1,
    "totalPages": 5,
    "isPersonalized": true,
    "fallback": false
  }
}
```

### Feed Algorithm (Phase 1)
1. Pull last 30 events for `userId` or `sessionId`
2. Extract top 3 species, top 2 categories, dominant priceRange
3. Query `Product` with `$or` matching those signals, status=active, quantity>0
4. Score each product using the formula above (boost_multiplier=1.0)
5. Exclude products the user already purchased (via `Order` lookup, only for auth users)
6. Paginate — page 1 = top 10 scored, page 2 = next 10, etc.
7. If fewer than 5 events: fallback to `quantitySold DESC, createdAt DESC`

### Flutter Integration

**New files:**
- `lib/data/service/event_tracking_service.dart` — Singleton, fire-and-forget
- `lib/data/api/feed/feed_api.dart` — `fetchFeed(token?, sessionId, page)`
- `lib/provider/feed_provider.dart` — Manages feed state

**Changed files:**
- `lib/pages/home/home_page.dart` — "Untukmu" section (horizontal scroll above main grid)
- `lib/pages/detail_product/detail_product_page.dart` — `EventTrackingService.trackView()` on mount
- `lib/injection.dart` — register `FeedAPI`, `FeedProvider`
- `lib/main.dart` — add `FeedProvider` to `MultiProvider`

**Event triggers:**
| User Action | Event Type | Where Called |
|-------------|-----------|--------------|
| Open product detail | `view` | `DetailProductPage.initState` |
| Add to cart | `cart` | `CartProvider.addToCart` |
| Complete purchase | `purchase` | `PaymentProvider` after success |
| Enter search query | `search` | `SearchPage` on submit |
| Scroll past without tapping | `skip` | Feed widget, after 3s visible |

---

## Phase 2 — Interest Profile (Weighted Preferences)

**Status:** ✅ Implemented

### Goals
- Build a persistent `UserInterestProfile` per user
- Updated asynchronously after purchase and search events
- Feed API uses profile instead of raw event scan (faster)

### Data Model

#### `UserInterestProfile` (new)
```js
{
  userId:    ObjectId,           // 1:1 with User
  preferences: {
    species:    Map<String, Number>,  // { "halfmoon": 0.85, "moscow_blue": 0.42 }
    categories: Map<String, Number>,  // { "betta": 0.90, "guppy": 0.30 }
    variants:   Map<String, Number>,  // { "HMPK": 0.70 }
    priceRange: {
      min: Number,               // 5th percentile of viewed prices
      max: Number,               // 95th percentile of viewed prices
      mean: Number,
    },
    sellers:    Map<String, Number>,  // { "seller_id": 0.60 } (repeat buyer signal)
    cities:     Map<String, Number>,  // preferred seller cities (shipping preference)
  },
  totalEvents:  Number,          // version counter
  lastUpdated:  Date,
}
```

### Profile Update Logic
```
weight = eventType == 'purchase' ? 1.0
       : eventType == 'cart'     ? 0.6
       : eventType == 'view'     ? 0.2
       : eventType == 'skip'     ? -0.1   // negative signal

preferences.species[species] += weight * decay_factor
// decay_factor = 0.95^(days_since_last_update)
// Normalize all scores to [0, 1] after update
```

### API Changes
- `GET /api/feed/feed` — checks `UserInterestProfile` first if exists, falls back to raw events
- New background job: `src/jobs/updateInterestProfiles.js` — runs every hour, processes event queue

---

## Phase 3 — Seller Subscription Boost

**Status:** ✅ Implemented (backend model + feed scoring + Flutter badge + self-serve purchase flow)

### Goals
- Sellers pay for visibility boost in the organic feed
- Transparent to users (no "Sponsor" label — it's organic boost)
- Tiered pricing: Free → Silver → Gold → Platinum

### Tiers

| Tier | Price/Month | Boost Multiplier | Extra Benefits |
|------|-------------|-----------------|----------------|
| Free | Rp 0 | 1.0× | No boost |
| Silver | Rp 99.000 | 1.2× | "Seller Terpilih" badge |
| Gold | Rp 299.000 | 1.5× | Badge + featured in category pages |
| Platinum | Rp 599.000 | 2.0× | Badge + homepage banner slot |

### Data Model

#### `SellerSubscription` (new)
```js
{
  sellerId:        ObjectId,      // ref User
  tier:            'free' | 'silver' | 'gold' | 'platinum',
  boostMultiplier: Number,        // 1.0 | 1.2 | 1.5 | 2.0
  validFrom:       Date,
  validUntil:      Date,
  paymentRef:      String,        // iPaymu transaction reference (SUB-XXXXXX-timestamp)
  autoRenew:       Boolean,
  status:          'pending_payment' | 'active' | 'expired' | 'cancelled',
}
```

### Feed Integration
```js
// In feedController.getPersonalizedFeed():
const subscriptions = await SellerSubscription.find({
  sellerId: { $in: productSellerIds },
  status: 'active',
  validUntil: { $gte: new Date() },
});
const boostMap = Object.fromEntries(subscriptions.map(s => [s.sellerId.toString(), s.boostMultiplier]));

products.forEach(p => {
  p._score = p._score * (boostMap[p.seller._id.toString()] ?? 1.0);
});
```

### Admin Controls
- `POST /api/admin/subscriptions` — manually assign/override tier
- `PUT /api/admin/subscriptions/:sellerId` — update tier, extend expiry
- `GET /api/admin/subscriptions` — list all subscriptions
- `GET /api/admin/subscriptions/pricing` — read current tier prices *(Sprint 3b)*
- `PUT /api/admin/subscriptions/pricing` — update tier prices *(Sprint 3b)*

### Seller Self-Serve
- `GET /api/subscription/my` — seller views their active subscription
- `POST /api/subscription/purchase` — create pending sub + iPaymu redirect URL
- `POST /api/subscription/notify` — iPaymu webhook; activates on settlement
- Expiry handled by existing cron infrastructure

---

## Sprint 3b — Dynamic Tier Pricing (Admin Configurable)

**Status:** 🔲 Planned

### Problem
Tier prices are currently hardcoded as `TIER_PRICE = { silver: 99_000, gold: 299_000, platinum: 599_000 }` in `subscriptionController.js`. Changing prices requires a code deploy.

### Goal
Admin can adjust prices per tier from the dashboard at any time without redeployment. Prices take effect on the next purchase.

### Data Model

#### `SubscriptionPricingConfig` (new — one singleton document)
```js
{
  _id:         String,         // always "default" (singleton)
  prices: {
    silver:    Number,         // IDR/month, default 99000
    gold:      Number,         // default 299000
    platinum:  Number,         // default 599000
  },
  updatedBy:   ObjectId,       // admin User ref
  updatedAt:   Date,
  notes:       String,         // optional reason for price change
}
```

### Backend Changes

#### New model: `src/models/SubscriptionPricingConfig.js`
- Mongoose schema with `{ _id: 'default', prices: { silver, gold, platinum }, updatedBy, updatedAt, notes }`
- Static method `getCurrent()` — returns the singleton, seeding defaults if not found

#### Controller changes: `src/controllers/subscriptionController.js`
- Remove hardcoded `TIER_PRICE` constant
- `purchaseSubscription`: replace `TIER_PRICE[tier]` with `(await SubscriptionPricingConfig.getCurrent()).prices[tier]`
- In-memory cache (30-second TTL) to avoid a DB round-trip on every purchase request

#### New admin endpoints in `subscriptionRoutes.js`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/admin/subscriptions/pricing` | admin | Read current prices |
| PUT | `/api/admin/subscriptions/pricing` | admin | Update one or more tier prices |

#### Request/Response shape
```json
// PUT /api/admin/subscriptions/pricing
// Body (partial update supported):
{ "silver": 89000, "gold": 279000 }

// Response:
{
  "success": true,
  "data": {
    "prices": { "silver": 89000, "gold": 279000, "platinum": 599000 },
    "updatedAt": "2026-04-05T..."
  }
}
```

### Admin Panel UI (Next.js)
- Route: `/admin/subscription-pricing` in `bettazon-id` web repo
- Reads current prices on mount via `GET /api/admin/subscriptions/pricing`
- Three editable number inputs — one per tier (Silver / Gold / Platinum)
- Shows last-updated timestamp
- Save button → `PUT /api/admin/subscriptions/pricing` → success/error feedback
- Input validation: price must be ≥ 1 and ≤ 10,000,000 IDR
- Optional notes field logged with each price change
- Warning: harga baru berlaku pada pembelian berikutnya

### Checklist
- [ ] `SubscriptionPricingConfig` model + `getCurrent()` static method
- [ ] Seed default prices in `getCurrent()` if collection empty
- [ ] Update `purchaseSubscription` to read prices from DB (with 30s cache)
- [ ] `GET /api/admin/subscriptions/pricing` endpoint
- [ ] `PUT /api/admin/subscriptions/pricing` endpoint (partial update)
- [ ] Register routes in `subscriptionRoutes.js` (literal routes before `:sellerId`)
- [ ] Next.js `AdminSubscriptionPricingPage` (`/admin/subscription-pricing`)
- [ ] Add "Harga Langganan" entry in `AdminSidebar.jsx`
- [ ] Show current price on `SellerSubscriptionPage` (read from API, not hardcoded)

---

## Phase 4 — Sponsored Ads (Targeted)

**Status:** ✅ Implemented

### Goals
- Sellers can pay per-click for guaranteed top-of-feed placement
- Ads are explicitly labeled "Sponsor"
- Targeting: by species, price range, buyer city
- Self-serve dashboard: set budget, bid, targeting, start/pause

### Data Model

#### `SponsoredAd` (new)
```js
{
  sellerId:   ObjectId,
  productId:  ObjectId,
  targeting: {
    species:     [String],       // empty = all species
    priceRange:  String,         // "50000-200000"
    cities:      [String],       // empty = nationwide
  },
  budget:        Number,         // total remaining budget (IDR)
  bidPerClick:   Number,         // cost-per-click (IDR)
  totalSpend:    Number,
  impressions:   Number,
  clicks:        Number,
  status:        'active' | 'paused' | 'exhausted' | 'pending_review',
  createdAt:     Date,
  validUntil:    Date,
}
```

### Feed Slot Layout
```
[Sponsor: Product A]   ← SponsoredAd (targeting matches user profile)
[Sponsor: Product B]   ← max 2 sponsored slots per page
─────────────────────
[Product C]            ← Organic (Phase 1/2/3 scored)
[Product D]
[Product E]
...
```

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/feed/feed` | Optional | Returns ads + organic combined |
| POST | `/api/ads/sponsored` | Seller | Create sponsored ad |
| GET | `/api/ads/sponsored` | Seller | List own ads |
| PUT | `/api/ads/sponsored/:id` | Seller | Update targeting/budget |
| POST | `/api/ads/sponsored/:id/click` | Any | Record click, deduct budget |

---

## Phase 5 — Collaborative Filtering

**Status:** 🔲 Planned (implement after 1000+ completed transactions)

### Goals
- "Pembeli yang mirip kamu juga membeli ini" section
- Item-based collaborative filtering (no ML server needed, pure MongoDB aggregation)
- Similarity matrix computed nightly via cron job

### Algorithm (Item-Based CF)

```
1. Build co-purchase matrix from Order collection:
   { item_a: ObjectId, item_b: ObjectId, coCount: Number }

2. For user U with purchase history [P1, P2, P3]:
   Candidates = all items co-purchased with P1, P2, P3
                that U has NOT purchased yet

3. Score = Σ coCount(Pi, candidate) for each Pi in U's history
           normalized by candidate's popularity

4. Return top-N candidates as "Mirip selera kamu"
```

### Cron Job
```js
// src/jobs/buildCoMatrix.js — runs nightly at 2 AM
// Aggregates Order.items pairs, upserts CoMatrix collection
```

### New Collection: `CoMatrix`
```js
{ itemA: ObjectId, itemB: ObjectId, coCount: Number, lastUpdated: Date }
// Index: { itemA: 1, coCount: -1 }
```

---

## Flutter UI Sections (Home Page)

### Phase 1 Layout
```
┌────────────────────────────────┐
│ [Logo]               [🛒 Cart] │
├────────────────────────────────┤
│ [🔍 Search your fish...]       │ ← pinned
├────────────────────────────────┤
│ [Banner Carousel]              │
├────────────────────────────────┤
│  Untukmu           Lihat Semua │ ← Phase 1
│  ┌──────┐ ┌──────┐ ┌──────┐  │
│  │ Prod │ │ Prod │ │ Prod │  │
│  └──────┘ └──────┘ └──────┘  │
├────────────────────────────────┤
│  Semua Produk                  │ ← existing grid
│  [Grid...]                     │
└────────────────────────────────┘
```

### Phase 5 Addition
```
│  Mirip selera kamu   Lihat semua │ ← Phase 5 (collaborative)
│  [horizontal scroll...]          │
```

---

## Implementation Checklist

### Phase 1 ✅
- [x] `UserEvent` model
- [x] `POST /api/feed/track`
- [x] `GET /api/feed/feed`
- [x] `feedRoutes.js` registered in app.js
- [x] Flutter `EventTrackingService`
- [x] Flutter `FeedAPI`
- [x] Flutter `FeedProvider`
- [x] "Untukmu" section in `home_page.dart`
- [x] Track view in `DetailProductPage`
- [x] Track purchase in backend webhook (`paymentController.js`)
- [x] Track cart in `DetailProductPage._handleAddToCart`
- [x] Track search in `SearchPage` (800ms debounce)

### Phase 2 ✅
- [x] `UserInterestProfile` model (`src/models/UserInterestProfile.js`)
- [x] `interestProfileService.js` — `updateProfileFromEvent` (inline, via `setImmediate`)
- [x] `decayStaleProfiles` daily cron job (3 AM, `cronJobService.js` job #11)
- [x] Feed uses profile when available (fallback to raw events)
- [ ] Admin view of user interest stats

### Phase 3 ✅
- [x] `SellerSubscription` model (`src/models/SellerSubscription.js`) — status enum includes `pending_payment`
- [x] Boost applied in feed scoring (`feedController.getPersonalizedFeed`)
- [x] Seller tier badge in `CardProduct.dart` (Terpilih / Unggulan / Platinum)
- [x] `POST /api/subscription/purchase` — creates pending sub + iPaymu redirect URL
- [x] `POST /api/subscription/notify` — iPaymu webhook; activates sub on settlement
- [x] `GET /api/subscription/my` — seller views active subscription
- [x] Admin CRUD endpoints (`POST/PUT/GET /api/admin/subscriptions`)
- [x] Flutter `SubscriptionAPI` (`lib/data/api/subscription/subscription_api.dart`)
- [x] Flutter `SubscriptionProvider` + DI registration
- [x] Flutter `SellerSubscriptionPage` (`/seller/subscription`) — tier cards, month picker, WebView handoff
- [x] Subscription promo banner in `SellerWalletPage`
- [ ] Admin subscription dashboard (list view + manual override UI)

### Sprint 3b — Dynamic Tier Pricing 🔲
- [x] `SubscriptionPricingConfig` model + `getCurrent()` static method
- [x] Seed default prices in `getCurrent()` if collection empty
- [x] Update `purchaseSubscription` to read prices from DB (30s in-memory cache)
- [x] `GET /api/admin/subscriptions/pricing` endpoint
- [x] `PUT /api/admin/subscriptions/pricing` endpoint (partial update)
- [x] Register pricing routes (must appear *before* `/:sellerId` in router)
- [x] Next.js `AdminSubscriptionPricingPage` (`/admin/subscription-pricing`) — editable per-tier price fields
- [x] Add "Harga Langganan" entry in `AdminSidebar.jsx`
- [x] `SellerSubscriptionPage` reads prices from API instead of displaying hardcoded values

### Phase 4 ✅
- [x] `SponsoredAd` model (`src/models/SponsoredAd.js`) — targeting, budget, bidPerClick, impressions, clicks
- [x] `adsController.js` — seller CRUD + admin approve/reject + click tracking with budget deduction
- [x] `adsRoutes.js` — `/api/ads/sponsored` (seller) + `/api/admin/ads` (admin)
- [x] Registered in `app.js` (both `/api/ads` and legacy prefix)
- [x] Feed injects max 2 sponsored slots at top of page 1 (targeted + impression recorded)
- [x] `adType: 'sponsored'` + `adId` fields injected into product objects in feed response
- [x] Flutter `Product` model: `adType`, `adId`, `isSponsored` getter
- [x] Flutter `AdsAPI` (`lib/data/api/ads/ads_api.dart`) — createAd, listMyAds, updateAd, recordClick
- [x] Flutter `AdsProvider` — create/list/toggle pause/top-up budget
- [x] Flutter `SellerAdsPage` (`/seller/ads`) — list ads, create form, pause/resume
- [x] Flutter `CardProduct` — orange "Sponsor" badge when `isSponsored`
- [x] Flutter `FeedProvider.recordSponsoredClick` — fire-and-forget on sponsored card tap
- [x] Flutter DI: `AdsAPI` registered, `AdsProvider` registered + added to `MultiProvider`
- [x] Flutter router: `/seller/ads` GoRoute added
- [x] Next.js admin `/admin/ads` page — tabbed list (pending/active/paused/exhausted), approve/reject
- [x] `AdminSidebar` — "Iklan Sponsor" menu entry added

### Phase 5 🔲
- [ ] `CoMatrix` collection
- [ ] Nightly co-matrix cron job
- [ ] CF-based recommendation endpoint
- [ ] "Mirip selera kamu" section in home page

---

## Monitoring & KPIs

| Metric | Target (Phase 1) | How to Measure |
|--------|-----------------|----------------|
| Feed CTR (Click-through rate) | > 8% | clicks / feed impressions |
| Feed → Purchase conversion | > 2% | purchases from feed / feed impressions |
| Average session depth | > 3 products viewed | UserEvent count per session |
| Feed response time | < 200ms p95 | Winston slow request logger |
| Event track latency | < 50ms | fire-and-forget, non-blocking |

---

## Data Privacy Notes

- `ipHash` stores `SHA256(ip + salt)` — never raw IP
- `UserEvent` data is deleted after 90 days via MongoDB TTL index
- Event tracking is disclosed in the Privacy Policy under "Data penggunaan"
- Anonymous tracking uses session IDs only; never linked to user identity without login
