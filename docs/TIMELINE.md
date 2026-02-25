# 📅 Timeline & Status — Bettazon.id

> Last updated: February 2026

## Legend
| Icon | Status |
|---|---|
| ✅ | Done |
| 🔄 | In Progress |
| 📋 | Planned |
| ⏸️ | Blocked |

---

## Phase 0 — Setup & Cleanup

**Target: 1–2 minggu** | **Status: 🔄 In Progress**

| Task | Status | Notes |
|---|---|---|
| Clone bettazon-id-app dari GitHub | ✅ Done | Repo teman, sudah ada: auth, home, product, cart, checkout, profile |
| Clone setorin-id-be sebagai base backend | ✅ Done | d:\Soemanto\bettazon-id-be |
| Hapus file waste-management dari backend | ✅ Done | cookingOil, rw, platformPrice, categoryEducation removed |
| Update package.json (name, scripts) | ✅ Done | name: bettazon-id-be |
| Hapus collector-only wallet guard | ✅ Done | walletService.js |
| Hapus route waste-mgmt dari app.js | ✅ Done | rwRoutes, platformPriceRoutes, categoryEducationRoutes |
| Buat workspace file VS Code | ✅ Done | d:\Soemanto\bettazon.code-workspace |
| Buat docs repo (bettazon-id) | ✅ Done | README, docs/, .github/ |
| Update User model roles (individual→buyer, collector→seller) | 📋 Planned | |
| Update Order model orderType enum | 📋 Planned | |
| Update authMiddleware role names | 📋 Planned | |
| Update cronJobService jobs | 📋 Planned | |
| Update i18n translations (waste→ecommerce) | 📋 Planned | |
| Buat .env.example | 📋 Planned | Tambah LIVEKIT_* vars |

---

## Phase 1a — Fish Product Catalog Backend

**Target: 3–4 minggu setelah Phase 0** | **Status: 📋 Planned**

| Task | Status | Notes |
|---|---|---|
| Buat model Product.js baru (fish product) | 📋 Planned | species, variant, size, gender, DOA guarantee |
| Buat model ShippingOption.js | 📋 Planned | domestic courier + international transshipper |
| Buat productService.js baru (fish-specific) | 📋 Planned | rewrite dari setorin base |
| Buat sellerService.js (store management) | 📋 Planned | |
| Buat fishCategorySeeder | 📋 Planned | betta, koi, arwana, guppy, dll |
| API: GET /products (filter: species, size, price, location) | 📋 Planned | |
| API: POST /products (create fish listing) | 📋 Planned | |
| API: GET /stores/:sellerId | 📋 Planned | |
| API: POST /stores/setup | 📋 Planned | |
| Upload gambar produk (DO Spaces) | 📋 Planned | reuse fileUploadService |
| Unit tests | 📋 Planned | |

---

## Phase 1b — Cart, Checkout, Order Backend

**Target: 2–3 minggu** | **Status: 📋 Planned**

| Task | Status | Notes |
|---|---|---|
| Buat model Cart.js | 📋 Planned | |
| Buat model Order.js (rewrite dari setorin) | 📋 Planned | orderType: direct_buy, auction_win, live_purchase |
| Buat cartService.js | 📋 Planned | add/remove/update cart items |
| Update orderService.js (remove waste logic) | 📋 Planned | |
| API: POST /cart/add, GET /cart, DELETE /cart/:id | 📋 Planned | |
| API: POST /orders/checkout (Midtrans Snap) | 📋 Planned | |
| API: POST /orders/:id/confirm-receive | 📋 Planned | escrow release |
| API: POST /orders/:id/dispute (DOA claim) | 📋 Planned | Dead on Arrival flow |
| Midtrans webhook handler | 📋 Planned | reuse midtransService |
| Cron: expire unpaid orders (2 jam) | 📋 Planned | |

---

## Phase 1c — Flutter App (Buyer Side)

**Target: 4–5 minggu** | **Status: 🔄 Partial (teman sudah kerjakan)**

| Task | Status | Notes |
|---|---|---|
| Auth (login, register, forgot password) | ✅ Done | Sudah ada |
| Home page | ✅ Done | Sudah ada (perlu redesign untuk fish content) |
| Explore/search products | ✅ Done | Sudah ada (perlu filter fish-specific) |
| Product detail page | ✅ Done | Sudah ada |
| Cart | ✅ Done | Sudah ada |
| Checkout (WIP) | 🔄 In Progress | Sudah dimulai teman |
| Profile & address management | ✅ Done | Sudah ada |
| Order list page | ✅ Done | Sudah ada |
| Shipping selector UI | 📋 Planned | domestic/international choice |
| DOA dispute flow | 📋 Planned | |
| Filter produk: species, size, price range | 📋 Planned | |
| Seller store page | 📋 Planned | |

---

## Phase 1d — Flutter App (Seller Side)

**Target: 3–4 minggu** | **Status: 📋 Planned**

| Task | Status | Notes |
|---|---|---|
| Seller onboarding (setup toko) | 📋 Planned | |
| Seller dashboard (home) | 📋 Planned | inventory, incoming orders, earnings |
| Tambah produk (fish form lengkap) | 📋 Planned | species, variant, size, health status, DOA |
| Kelola produk (edit/delete/archive) | 📋 Planned | |
| Kelola order masuk | 📋 Planned | konfirmasi, kirim, dll |
| Wallet & withdrawal | 📋 Planned | |
| Statistik toko | 📋 Planned | |

---

## Phase 2a — Shipping System

**Target: 2–3 minggu** | **Status: 📋 Planned**

| Task | Status | Notes |
|---|---|---|
| Model ShippingPartner.js (transshipper list) | 📋 Planned | |
| Model CourierPartner.js (domestic courier list) | 📋 Planned | |
| Seed data: transshipper Jakarta partners | 📋 Planned | |
| Seed data: domestic courier partners (JNE YES, SiCepat HALU, dll) | 📋 Planned | |
| API: GET /shipping/domestic (list couriers) | 📋 Planned | |
| API: GET /shipping/international (list transshippers + countries) | 📋 Planned | |
| API: POST /shipping/calculate (ongkos kirim estimasi) | 📋 Planned | |
| Tracking integration (JNE/SiCepat API) | 📋 Planned | |
| Flutter: Shipping selector page | 📋 Planned | |
| Flutter: International shipping info + transshipper guide | 📋 Planned | |

---

## Phase 2b — Page Auction System

**Target: 3–4 minggu** | **Status: 📋 Planned**

| Task | Status | Notes |
|---|---|---|
| Model Auction.js | 📋 Planned | status, bids[], autoExtend, winner |
| auctionService.js | 📋 Planned | createAuction, placeBid, endAuction, notifyWinner |
| Socket.IO: auction room events | 📋 Planned | bid, bid_update, extend, end |
| Cron: auto-end expired auctions | 📋 Planned | |
| Auto-extend 5 menit jika ada bid di last 5 menit | 📋 Planned | |
| Auto-create order setelah auction selesai | 📋 Planned | |
| API: GET /auctions (list aktif) | 📋 Planned | |
| API: POST /auctions/:id/bid | 📋 Planned | |
| Flutter: Auction list page | 📋 Planned | |
| Flutter: Auction detail page (timer + bid history + chat) | 📋 Planned | |
| Flutter: Place bid widget | 📋 Planned | |

---

## Phase 2c — Live Streaming Setup

**Target: 2–3 minggu** | **Status: 📋 Planned**

| Task | Status | Notes |
|---|---|---|
| Setup LiveKit server (Docker, VPS terpisah) | 📋 Planned | 4vCPU/8GB RAM, Caddy + Redis |
| Konfigurasi LiveKit egress ke DO Spaces | 📋 Planned | recording ke S3 |
| Install livekit-server-sdk di backend | 📋 Planned | sudah di package.json |
| liveStreamService.js | 📋 Planned | generateHostToken, generateViewerToken, startLive, endLive |
| Model LiveStream.js | 📋 Planned | |
| API: POST /live/start | 📋 Planned | generate Agora token + create room |
| API: GET /live (list aktif) | 📋 Planned | |
| API: GET /live/:id | 📋 Planned | |
| API: POST /live/:id/end | 📋 Planned | |
| Flutter: tambah livekit_client ke pubspec.yaml | 📋 Planned | |

---

## Phase 2d — Live Streaming App

**Target: 5–6 minggu** | **Status: 📋 Planned**

| Task | Status | Notes |
|---|---|---|
| Flutter: Live discovery page (daftar live aktif) | 📋 Planned | |
| Flutter: Live room viewer (LiveKit player + chat overlay) | 📋 Planned | |
| Flutter: Host live page (broadcast controls) | 📋 Planned | |
| Flutter: Live chat overlay (ephemeral, tidak disimpan ke DB) | 📋 Planned | |
| Flutter: Live auction overlay (bid button + countdown) | 📋 Planned | |
| Socket.IO live events (join, leave, viewer_count) | 📋 Planned | |
| Live auction via LiveKit Data Packets | 📋 Planned | |
| FCM: notifikasi "seller X mulai live" ke followers | 📋 Planned | |

---

## Phase 3 — Notifications, Analytics, Admin

**Target: 2–3 minggu** | **Status: 📋 Planned**

| Task | Status | Notes |
|---|---|---|
| FCM: bid outbid notification | 📋 Planned | |
| FCM: auction ended, you won! | 📋 Planned | |
| FCM: order status updates | 📋 Planned | |
| FCM: live started (untuk followers) | 📋 Planned | |
| Admin panel (basic): user management, product moderation | 📋 Planned | |
| Analytics dashboard (GMV, DAU, live views) | 📋 Planned | |

---

## Phase 4 — QA & Release

**Target: 4–5 minggu** | **Status: 📋 Planned**

| Task | Status | Notes |
|---|---|---|
| End-to-end testing semua flow | 📋 Planned | |
| Performance testing (100+ concurrent live viewers) | 📋 Planned | |
| Play Store submission | 📋 Planned | |
| App Store submission | 📋 Planned | |
| Production deployment (VPS + LiveKit VPS) | 📋 Planned | |

---

## 📊 Total Estimasi

| Phase | Durasi | Status |
|---|---|---|
| Phase 0 | 1–2 minggu | 🔄 ~60% done |
| Phase 1a+1b | 5–7 minggu | 📋 |
| Phase 1c+1d | 7–9 minggu | 🔄 ~30% (teman) |
| Phase 2a | 2–3 minggu | 📋 |
| Phase 2b | 3–4 minggu | 📋 |
| Phase 2c+2d | 7–9 minggu | 📋 |
| Phase 3 | 2–3 minggu | 📋 |
| Phase 4 | 4–5 minggu | 📋 |
| **Total** | **~31–42 minggu** | |
