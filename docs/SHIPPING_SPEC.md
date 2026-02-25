# 🚚 Shipping Spec — Bettazon.id

## Overview

Dua jalur pengiriman:
1. **Domestik** — dalam negeri via kurir partner (JNE YES, SiCepat HALU, dll)
2. **Internasional** — via transshipper partner yang berlokasi di Jakarta

---

## Shipping Type 1: Domestic (Dalam Negeri)

### Flow
```
Seller (kota manapun)
  → 1. Packaging standar platform (styrofoam box + O2 bag + oxygen tablet)
  → 2. Drop ke kurir partner (JNE YES / SiCepat HALU / Wahana Express)
  → 3. Upload resi di app → Order status: "shipped"
  → 4. Buyer terima dalam 24–48 jam (maks untuk ikan hidup)
  → 5. Buyer konfirmasi terima → Order complete → Escrow release

[Jika ikan mati saat diterima / DOA]
  → Buyer foto + lapor dalam 2 jam setelah terima
  → Dispute DOA dibuka → Admin mediasi
```

### Kurir Partner (Domestic)

Kurir yang **sudah approve live fish** / punya service khusus:

| Kurir | Service | Maks Perjalanan | Keterangan |
|---|---|---|---|
| JNE | YES (Yakin Esok Sampai) | ~24 jam | Direkomendasikan untuk ikan lokal |
| SiCepat | HALU (Hari ini Langsung Sampai) | ~24 jam | Same day untuk kota besar |
| Wahana | Reguler / Express | 1–2 hari | Coverage kota kecil luas |
| TIKI | ONS (Over Night Service) | ~24 jam | |
| AnterAja | Same Day / Next Day | ~24 jam | |
| Cargo Udara | Per maskapai | ~12 jam | Untuk ikan arwana / koi mahal (live cargo) |

### Packaging Requirements (Platform Standard)
- Kantong plastik khusus ikan (polyethylene) + O2 pump
- Styrofoam box (3–4 cm tebal)
- Suhu maks: 28°C (es batu untuk cuaca panas)
- Max stacking: 2 layer
- Seller wajib foto packaging sebelum drop → upload di app

---

## Shipping Type 2: International (Luar Negeri via Transshipper)

### Flow
```
Buyer overseas
  → 1. Checkout → pilih "Pengiriman Internasional"
  → 2. Pilih transshipper partner + negara tujuan
  → 3. Lihat estimasi biaya + estimasi tiba
  → 4. Bayar escrow (product price + domestic shipping seller→transshipper + int'l fee)

Seller
  → 5. Notifikasi: "Kirim ikan ke transshipper [nama] di [alamat]"
  → 6. Packing & kirim dengan JNE/SiCepat ke alamat transshipper di Jakarta
  → 7. Upload resi pengiriman ke transshipper

Transshipper (Jakarta)
  → 8. Terima ikan dari seller → health check
  → 9. Packaging ulang untuk international flight (airline-approved)
  → 10. Proses dokumen export (health cert, CITES jika perlu)
  → 11. Kirim via cargo udara ke negara tujuan

Buyer overseas
  → 12. Terima ikan dari customs/kurir lokal di negara mereka
  → 13. Konfirmasi terima → Escrow release
```

### Transshipper Partner Requirements
Transshipper yang terdaftar di platform harus memenuhi:
- Lokasi: Jakarta (Soekarno-Hatta airport proximity)
- Izin: Memiliki izin ekspor ikan hias dari Kementerian Kelautan
- Dokumen: Mampu mengurus health certificate + CITES (untuk jenis yang dilindungi)
- Live Arrival Guarantee: Minimal menyatakan policy DOA
- Track record: Verified minimal 1 tahun operasi

### Negara Tujuan Tier
| Tier | Countries | Estimated Days | Notes |
|---|---|---|---|
| Asia Tenggara | SG, MY, TH, PH, VN | 2–4 hari | |
| Asia Timur | JP, KR, TW, HK | 3–5 hari | |
| Australia/NZ | AU, NZ | 4–7 hari | Strict biosecurity |
| Eropa | DE, NL, FR, UK, dll | 5–10 hari | |
| Amerika | US, CA, MX, dll | 7–14 hari | |

### CITES & Regulations
Beberapa spesies ikan hias memerlukan dokumen CITES (Convention on International Trade in Endangered Species):
- Arwana Asia (`Scleropages formosus`) — **CITES Appendix I** (restriksi ketat, perlu CITES permit)
- Beberapa jenis koi tertentu
- Platform memvalidasi apakah produk perlu CITES saat seller listing
- Jika CITES required → buyer dan seller diperingatkan → transshipper handle dokumen

---

## MongoDB Schema

### `ShippingPartner.js` (Transshipper List)
```javascript
{
  type: { type: String, enum: ['transshipper', 'courier'] },
  name: String,
  code: String,          // e.g. 'JKT_AQUA', 'BALI_FISH'
  isActive: Boolean,
  
  // For transshippers
  transshipper: {
    address: String,
    city: { type: String, default: 'Jakarta' },
    contactPerson: String,
    phone: String,
    email: String,
    supportedCountries: [String],  // ISO country codes
    estimatedDays: { min: Number, max: Number },
    pricePerBox: Number,
    maxFishPerBox: Number,
    liveArrivalGuarantee: Boolean,
    requiresHealthCert: Boolean,
    handlesCI TES: Boolean,
    verifiedAt: Date,
  },
  
  // For couriers
  courier: {
    serviceCode: String,   // 'JNE_YES', 'SICEPAT_HALU'
    serviceName: String,
    maxDuration_hours: Number,
    isLiveFishApproved: Boolean,
    packagingRequirements: String,
    apiIntegration: Boolean,   // whether we have tracking API
    apiEndpoint: String,
  },
  
  logo: { url: String },
  description: String,
  createdAt: Date,
}
```

---

## API Endpoints

```
GET    /shipping/domestic           List domestic courier partners
GET    /shipping/international      List transshipper partners
GET    /shipping/international/:id  Transshipper detail + supported countries
POST   /shipping/calculate          Estimasi ongkos kirim
         body: { type, origin, destination, weight, itemCount }
GET    /shipping/countries          List negara yang tersedia + tier
GET    /shipping/tracking/:orderId  Track pengiriman
```

---

## DOA (Dead on Arrival) Policy

### Untuk Domestic
- Window lapor: **2 jam** setelah tracking menunjukkan "delivered"
- Bukti: Foto ikan dalam kondisi mati + foto kemasan + foto resi
- Resolusi:
  - Jika packaging seller memenuhi standar → tanggung jawab kurir → eskalasi ke kurir
  - Jika packaging tidak standar → tanggung jawab seller → refund dari seller wallet
  - Admin mediasi dalam 24 jam

### Untuk Internasional (via Transshipper)
- Window lapor: **4 jam** setelah buyer terima dari kurir lokal
- Bukti: Foto ikan mati + foto box kondisi
- Resolusi: Berdasarkan policy transshipper partner (dicantumkan di halaman transshipper)
- Platform tidak menanggung DOA international kecuali bukti negligence transshipper
