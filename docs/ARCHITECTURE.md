# 🏗️ Architecture — Bettazon.id

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      BETTAZON.ID                             │
│                                                              │
│  ┌─────────────┐         ┌──────────────────────────────┐  │
│  │  Flutter App │◄───────►│     Backend API (Node.js)    │  │
│  │  (Provider + │  REST   │  Express + Socket.IO         │  │
│  │   go_router) │  +WS    │  Port 5000                   │  │
│  └─────────────┘         └──────────┬───────────────────┘  │
│                                      │                        │
│                           ┌──────────▼───────────────────┐  │
│                           │        MongoDB               │  │
│                           │  Users, Products, Orders,    │  │
│                           │  Auctions, LiveStreams, etc   │  │
│                           └──────────────────────────────┘  │
│                                      │                        │
│                           ┌──────────▼───────────────────┐  │
│                           │         Redis                │  │
│                           │  Token blacklist, rate limit │  │
│                           │  cache, Socket.IO adapter    │  │
│                           └──────────────────────────────┘  │
│                                                              │
│  ┌─────────────┐         ┌──────────────────────────────┐  │
│  │  Flutter App │◄───────►│  LiveKit Server (self-hosted)│  │
│  │  livekit_   │  WebRTC  │  Docker VPS (4vCPU/8GB)     │  │
│  │  client SDK │         │  + Egress (recording)        │  │
│  └─────────────┘         └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Boundaries

### Backend API (`bettazon-id-be`)
```
src/
├── app.js                    # Express app class
├── server.js                 # HTTP + Socket.IO server init
├── config/
│   ├── database.js           # MongoDB connection
│   ├── redis.js              # Redis connection
│   ├── storages.js           # DO Spaces (S3) client
│   └── websocket.js          # Socket.IO server (chat + live + auction events)
├── constants/
│   ├── feeConstants.js       # PLATFORM_FEE_DECIMAL = 0.10
│   └── fishConstants.js      # NEW: fish categories, shipping rules
├── controllers/              # Request handlers (thin layer → delegates to services)
├── middlewares/
│   ├── authMiddleware.js     # JWT authenticate, authorize(role), hasAnyRole
│   ├── errorMiddleware.js    # AppError class, global error handler
│   └── securityMiddleware.js # IP blocking, sanitize, rate limit
├── models/                   # Mongoose schemas (see DATABASE_SCHEMA.md)
├── routes/                   # Express routers
├── services/                 # Business logic (fat layer)
│   ├── authService.js        # Registration, login, OTP, JWT
│   ├── orderService.js       # Order lifecycle, escrow
│   ├── productService.js     # Fish product CRUD, search
│   ├── auctionService.js     # NEW: page + live auction engine
│   ├── liveStreamService.js  # NEW: LiveKit token gen, room management
│   ├── shippingService.js    # NEW: domestic courier + int'l transshipper
│   ├── chatService.js        # Chat CRUD + Socket.IO push
│   ├── walletService.js      # Wallet, escrow deposit/release
│   ├── notificationService.js# FCM, email, SMS OTP
│   └── cronJobService.js     # Scheduled jobs
└── utils/
    ├── i18n.js               # Bilingual response messages (id/en)
    └── logger.js             # Winston factory createLogger("ServiceName")
```

### Flutter App (`bettazon-id-app`)
Architecture: **Provider + go_router + http package**

```
lib/
├── main.dart               # App bootstrap, providers, notifications
├── router.dart             # GoRouter config (all routes)
├── injection.dart          # get_it DI registrations
├── data/
│   ├── api/                # HTTP API calls (auth, product, cart, shipping, etc.)
│   └── model/              # JSON response models
├── provider/               # ChangeNotifier state management
├── pages/                  # UI pages (route targets)
│   ├── auth_login/
│   ├── auth_register/
│   ├── auth_forgot_password/
│   ├── home/
│   ├── explore/
│   ├── search/
│   ├── detail_product/
│   ├── cart/
│   ├── checkout/           # WIP
│   ├── order/
│   ├── profile/
│   ├── live/               # NEW: Live discovery, live room viewer, host live
│   ├── auction/            # NEW: Page auction list + detail
│   └── seller/             # NEW: Seller dashboard, product management
├── utils/                  # helpers, colors, format, navigation
└── widgets/                # Shared reusable widgets
```

---

## Data Flows

### Flow 1: Direct Purchase
```
Buyer → Browse products → Add to cart → Checkout
     → Midtrans Snap (payment) → Order created (pending_payment)
     → Payment confirmed → Order (processing)
     → Seller konfirmasi kirim → Order (shipped)
     → Buyer konfirmasi terima → Escrow released → Seller wallet credited
     → Rating/review
```

### Flow 2: Page Auction
```
Seller → Create product with auctionType: 'page'
       → Set start price, min increment, duration, buyNowPrice
       → Schedule auction start time

Buyer  → Browse /auctions page → Enter auction room (Socket.IO join)
       → Place bid → bid_update broadcast to all in room
       → [If bid in last 5 min] → auto-extend 5 menit
       → Timer ends → Winner notified (FCM) → Order auto-created
       → Winner pays via Midtrans → Escrow → Seller ships → Release
```

### Flow 3: Live Auction (via Live Stream)
```
Seller → POST /live/start → LiveKit room created → Token generated
       → Flutter: start broadcasting via livekit_client SDK
       → Socket.IO: live:start broadcast to followers (FCM push)

Buyer  → GET /live → See active streams → Click join
       → GET /live/:id/viewer-token → Connect LiveKit (watch only)
       → Real-time chat via Socket.IO room
       → Seller triggers auction_start → Auction overlay appears
       → Bid via tap button → Socket.IO auction:bid → broadcast auction:bid_update
       → Auction ends → Winner → Order created → Post-live payment flow
```

### Flow 4: International Shipping (via Transshipper)
```
Buyer abroad → Choose product → Checkout → Select "Internasional"
            → Choose transshipper partner (list from DB)
            → Choose destination country → See estimated cost
            → Pay escrow (product price + shipping fee)

Seller       → Notif: "Kirim ke transshipper [nama] di [alamat Jakarta]"
             → Kirim ikan dengan kurir domestik ke transshipper
             → Upload resi pengiriman ke transshipper

Transshipper → Terima ikan → Health check → Package ulang
             → Export ke negara tujuan buyer
             → Update tracking

Buyer        → Terima ikan → Konfirmasi → Escrow release
```

---

## Key Architectural Decisions

### Why Provider over BLoC?
The existing `bettazon-id-app` uses `provider` + `go_router`. We continue with this architecture for consistency. BLoC's granularity (1 Bloc per action) is overkill for MVP. Provider `ChangeNotifier` is simpler and faster to develop.

### Why LiveKit over Agora?
Self-hosted LiveKit eliminates per-minute fees at scale. Official Flutter SDK, ESM Node.js SDK, and Docker single-command setup. DO Spaces egress integration matches existing storage setup. See [TECH_STACK.md](TECH_STACK.md).

### Why Socket.IO for Auction (not LiveKit DataChannel)?
Page Auctions run independently of live streams — they need Socket.IO anyway. Live Auctions *during* a stream use the same Socket.IO for consistency, keeping auction business logic server-side (authoritative bid server) regardless of whether a stream is active.

### Escrow Model
All purchases (direct, auction, live) go through escrow. Buyer pays → money held → seller ships → buyer confirms receive → release. DOA (Dead on Arrival) dispute opens a refund claim window of 24h after delivery confirmation.
