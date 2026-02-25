# 🎰 Auction Spec — Bettazon.id

## Two Auction Modes

### Mode A: Page Auction
Lelang di halaman produk, tersedia 24/7, tidak memerlukan live stream.

- Produk punya badge "LELANG" di listing
- Halaman produk punya: countdown timer + bid history + product chat
- Chat di page auction **disimpan ke DB** (beda dari live chat yang ephemeral)
- Pembeli bisa tanya kondisi ikan ke seller sambil menunggu lelang mulai/selesai
- Socket.IO room: `auction_room_{auctionId}` untuk real-time bid updates
- Auto-extend: jika ada bid di 5 menit terakhir → extend 5 menit (max 3x extend)
- Setelah timer habis → notifikasi ke winner + auto-create order

### Mode B: Live Auction
Lelang yang diaktifkan seller **saat sedang live stream**.

- Seller tap tombol "Mulai Lelang" di host live page
- Auction overlay muncul di semua viewer secara real-time
- Countdown timer di overlay video
- Bid via tombol di layar live
- Setelah selesai → winner notified → order auto-created → post-live payment

---

## Auction State Machine

```
         create()
           │
           ▼
       SCHEDULED ──────────────────── cancel()
           │                                │
    startTime reached                       ▼
    (cron / seller trigger)            CANCELLED
           │
           ▼
        ACTIVE ──── placeBid() ──────► bid accepted
           │         (validates min    bid_update broadcast
           │          increment,       auto-extend check
           │          balance check)
           │
    endTime reached                    
    (cron / autoExtend expired)        
           │
           ▼
         ENDED
           │
     has winner?
    ┌───────┴───────┐
    YES             NO (no bids)
    │               │
    ▼               ▼
 createOrder()   notify seller
    │            (no bids, product back to active)
    ▼
 ORDER CREATED
 (buyer pays via Midtrans)
```

---

## Auto-Extend Rules
- Trigger: bid masuk dalam waktu `autoExtendMinutes` (default: 5 menit) sebelum `endTime`
- Extension: `endTime += autoExtendMinutes`
- Maksimal extend: `maxExtensions` kali (default: 3 = max 15 menit tambahan)
- Broadcast: `auction:extend` event ke semua bidder di room

---

## Minimum Bid Increment
- Default: Rp 10.000 (configurable per auction)
- Contoh: currentPrice = Rp 150.000, minIncrement = Rp 10.000 → bid minimum Rp 160.000

---

## Buy Now Price
- Optional: seller bisa set `buyNowPrice` yang langsung memenangkan lelang
- Jika buyer tap "Beli Sekarang" → lelang berakhir seketika → winner = buyer

---

## MongoDB Schema

```javascript
// src/models/Auction.js
{
  product: { type: ObjectId, ref: 'Product', required: true },
  seller: { type: ObjectId, ref: 'User', required: true },
  live: { type: ObjectId, ref: 'LiveStream', default: null }, // null = page auction

  auctionType: { type: String, enum: ['page', 'live'] },
  status: {
    type: String,
    enum: ['scheduled', 'active', 'ended', 'cancelled'],
    default: 'scheduled'
  },

  startPrice: { type: Number, required: true, min: 0 },
  currentPrice: { type: Number },           // updated on each bid
  minIncrement: { type: Number, default: 10000 },
  buyNowPrice: { type: Number },            // optional

  bids: [{
    bidder: { type: ObjectId, ref: 'User' },
    amount: Number,
    timestamp: { type: Date, default: Date.now },
    isWinning: { type: Boolean, default: false },
    ipAddress: String,                       // anti-shill bidding
  }],

  winner: { type: ObjectId, ref: 'User', default: null },
  finalPrice: Number,

  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },   // for page auctions
  autoExtend: { type: Boolean, default: true },
  autoExtendMinutes: { type: Number, default: 5 },
  maxExtensions: { type: Number, default: 3 },
  extensionCount: { type: Number, default: 0 },

  viewerCount: { type: Number, default: 0 }, // for live auctions
  resultOrder: { type: ObjectId, ref: 'Order', default: null },

  cancelReason: String,
}
```

---

## Socket.IO Events

### Server → Client (broadcast ke `auction_room_{auctionId}`)
```javascript
'auction:start'       // { auctionId, product, startPrice, endTime, minIncrement }
'auction:bid_update'  // { currentPrice, bidderName, timeLeft, totalBids, isExtended }
'auction:extend'      // { newEndTime, extensionCount, reason: 'bid_near_end' }
'auction:end'         // { winnerId, winnerName, finalPrice, resultOrderId }
'auction:cancel'      // { reason }
'auction:countdown'   // tick every second: { timeLeft (seconds) }
```

### Client → Server
```javascript
'auction:join'   // join room: { auctionId }
'auction:leave'  // leave room: { auctionId }
'auction:bid'    // place bid: { auctionId, amount }
```

---

## API Endpoints

```
GET    /auctions              List active/upcoming auctions (paginated, filterable)
GET    /auctions/:id          Auction detail + bid history
POST   /auctions              Create auction (seller only)
PUT    /auctions/:id          Update scheduled auction (seller, before start)
DELETE /auctions/:id          Cancel auction (seller/admin)
POST   /auctions/:id/bid      Place bid (buyer, authenticated)
POST   /auctions/:id/buy-now  Buy now (buyer, if buyNowPrice set)
```

---

## Anti-Shill Bidding Rules
1. Seller tidak bisa bid di produk sendiri
2. Satu user tidak bisa bid dua kali berturut-turut (harus ada bidder lain dulu)
3. IP tracking untuk detect koordinasi bid palsu (warning system)
4. Bid terendah valid = `currentPrice + minIncrement`

---

## Post-Auction Payment Flow
```
Auction ended → winner gets FCM notification
             → winner has X jam (default 12 jam) untuk bayar
             → POST /orders/checkout dengan auctionId
             → Midtrans Snap → bayar → escrow hold
             → Seller ships → buyer confirms → escrow release
             
[If winner tidak bayar dalam X jam]
             → Order expired → runner-up ditawari (optional, Phase 3)
             → atau listing kembali ke active
```
