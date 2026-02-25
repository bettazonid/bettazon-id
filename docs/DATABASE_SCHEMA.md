# 🗄️ Database Schema — Bettazon.id

## Models Overview

| Model | Source | Status | Notes |
|---|---|---|---|
| `User.js` | From setorin | Modify | Roles: buyer, seller, admin. Remove rt/rw. |
| `Product.js` | From setorin | Rewrite | Fish product model |
| `Order.js` | From setorin | Modify | orderType: direct_buy, auction_win, live_purchase |
| `Cart.js` | NEW | Create | Shopping cart |
| `Auction.js` | NEW | Create | Page + live auction engine |
| `LiveStream.js` | NEW | Create | Live streaming sessions |
| `ShippingPartner.js` | NEW | Create | Domestic couriers + international transshippers |
| `Chat.js` | From setorin | As-is | Product/order chat (not live chat) |
| `Message.js` | From setorin | As-is | |
| `Wallet.js` | From setorin | As-is | |
| `Transaction.js` | From setorin | As-is | |
| `Withdrawal.js` | From setorin | As-is | |
| `topupTransaction.js` | From setorin | As-is | |
| `Rating.js` | From setorin | Modify | raterRole/rateeRole: buyer/seller |
| `Notification.js` | From setorin | Modify | Update event types for ecommerce |
| `Point.js` | From setorin | As-is | |
| `PointConfig.js` | From setorin | As-is | |
| `PointTransaction.js` | From setorin | Modify | Remove cooking_oil sources |
| `Reward.js` | From setorin | As-is | Digiflazz digital rewards |
| `DigiflazzProduct.js` | From setorin | As-is | |
| `Region.js` | From setorin | As-is | Indonesian administrative regions |
| `BugReport.js` | From setorin | As-is | |
| `ErrorReport.js` | From setorin | As-is | |

---

## Key Schema Modifications

### `User.js` — Role Changes
```javascript
// BEFORE (setorin)
roles: ['individual', 'collector', 'rt', 'rw', 'admin']

// AFTER (bettazon)
roles: ['buyer', 'seller', 'admin']

// Remove: rtRwDataSchema (RT/RW community coordinator fields)
// Rename: collectorDataSchema → sellerDataSchema
sellerData: {
  storeName: String,
  storeDescription: String,
  storeSlug: String,           // URL-friendly store identifier
  storeBanner: { url, publicId },
  storeLocation: { city, province, coordinates },
  businessLicense: String,     // SIUP or similar
  ktpDocument: { url, publicId, verifiedAt },
  isVerified: Boolean,
  rating: { average, count },
  totalSales: Number,
}
```

### `Order.js` — orderType Enum
```javascript
// BEFORE (setorin)
orderType: ['scrap_pickup', 'cooking_oil_warga_to_rt', 
            'cooking_oil_rt_to_rw', 'cooking_oil_rw_to_platform',
            'cooking_oil_warga_to_rw']

// AFTER (bettazon)
orderType: ['direct_buy', 'auction_win', 'live_purchase']

// Remove: paymentBreakdown.kasRtAmount, incentiveAmount
// Keep:   paymentBreakdown.platformFee, totalAmount, cashAmount
// Add:    shippingDetails (embedded)
shippingDetails: {
  type: enum ['domestic', 'international'],
  courierCode: String,          // 'JNE_YES', 'SICEPAT_HALU'
  transshipperId: ObjectId,     // if international
  destinationCountry: String,
  trackingNumber: String,
  estimatedArrival: Date,
  shippingCost: Number,
  proofOfShipmentUrl: String,
}
```

### `Product.js` — Full Rewrite (Fish Model)
```javascript
{
  title: String,
  description: String,

  price: {
    amount: { type: Number, required: true },
    currency: { type: String, enum: ['IDR', 'USD'], default: 'IDR' },
  },
  stock: { type: Number, default: 1 },

  category: {
    type: String,
    enum: ['betta', 'koi', 'arwana', 'guppy', 'discus', 'louhan',
           'koki', 'platy', 'molly', 'oscar', 'cichlid', 'corydoras',
           'tetra', 'rasbora', 'puffer', 'plant', 'invertebrate', 'other'],
  },

  fishData: {
    species: String,
    variant: String,
    size_cm: Number,
    age_months: Number,
    gender: enum ['male', 'female', 'pair', 'group', 'unknown'],
    healthStatus: enum ['healthy', 'quarantine', 'treatment'],
    guaranteeDOA: Boolean,
    tankSize_liter: Number,
    waterTemp_celsius: { min: Number, max: Number },
    feedType: [String],
    originCountry: String,
    certifications: [String],    // e.g. ['CITES', 'health_cert']
  },

  // Auction config (if auctionable)
  auctionConfig: {
    isAuctionable: { type: Boolean, default: false },
    auctionType: enum ['live_only', 'page_only', 'both', 'none'],
  },

  images: [{
    url: String,
    publicId: String,
    isMain: { type: Boolean, default: false },
  }],
  videos: [{
    url: String,
    publicId: String,
    thumbnail: String,
  }],

  seller: { type: ObjectId, ref: 'User', required: true },
  sellerStore: {
    name: String,
    city: String,
    province: String,
  },

  status: enum ['draft', 'active', 'sold', 'banned', 'archived'],

  // Allowed shipping types for this product
  shippingOptions: [{
    type: enum ['domestic', 'international', 'pickup'],
    maxDuration_hours: Number,  // max shipping time for live fish
    requiresAirCargo: Boolean,
    requiresCITES: Boolean,
    allowedCountries: [String], // empty = all countries
  }],

  location: {
    city: String,
    province: String,
    coordinates: GeoJSON,
  },

  views: { type: Number, default: 0 },
  wishlistCount: { type: Number, default: 0 },
}
```

### New: `Cart.js`
```javascript
{
  user: { type: ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 },
    priceAtAdd: Number,          // snapshot price at time of adding
    addedAt: Date,
  }],
  updatedAt: Date,
}
```

---

## Indexes

```javascript
// Product indexes
productSchema.index({ category: 1, status: 1 });
productSchema.index({ seller: 1, status: 1 });
productSchema.index({ 'location.coordinates': '2dsphere' });
productSchema.index({ 'fishData.species': 'text', title: 'text', description: 'text' });

// Auction indexes
auctionSchema.index({ status: 1, startTime: 1 });
auctionSchema.index({ status: 1, endTime: 1 });
auctionSchema.index({ product: 1, status: 1 });

// LiveStream indexes
liveStreamSchema.index({ status: 1, startedAt: -1 });
liveStreamSchema.index({ seller: 1, status: 1 });
```
