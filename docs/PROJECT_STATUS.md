# 📊 Project Status — Bettazon.id
> Last updated: Juni 2025
> Audit menyeluruh kedua repo: `bettazon-id-be` (Backend) + `bettazon-id-app` (Flutter)

---

## Legend
| Simbol | Arti |
|--------|------|
| ✅ | Selesai & berfungsi |
| 🟡 | Sebagian (ada tapi tidak lengkap) |
| ❌ | Belum diimplementasi sama sekali |
| ⚠️ | Ada tapi ada bug / inconsistency |

---

## 1. 🔐 Auth Module

| Fitur | Backend | Flutter | Catatan |
|-------|---------|---------|---------|
| Register email | ✅ | ✅ | |
| Login email | ✅ | ✅ | |
| Login nomor HP | ✅ | ✅ | |
| OTP via SMS (Nevacloud) | ✅ | ✅ | |
| Google OAuth | ✅ | ✅ | |
| Facebook Login | 🟡 | 🟡 | BE siap; Flutter UI disembunyikan pending Meta verification |
| Lupa password via OTP | ✅ | ✅ | |
| Reset password | ✅ | ✅ | |
| Refresh token / logout | ✅ | ✅ | Token blacklist via Redis |

---

## 2. 🐟 Product Module

| Fitur | Backend | Flutter | Catatan |
|-------|---------|---------|---------|
| List produk (public) | ✅ | ✅ | |
| Detail produk (slug) | ✅ | ✅ | |
| Search & filter produk | ✅ | ✅ | |
| Explore produk | ✅ | ✅ | |
| Upload gambar produk | ✅ | ✅ | DO Spaces (S3) |
| Seller buat produk | ✅ | ✅ | `SellerProductFormPage` |
| Seller edit produk | ✅ | ✅ | |
| Seller hapus produk | ✅ | ✅ | |
| Seller publish/unpublish | ✅ | ✅ | |
| Seller daftar produknya | ✅ | ✅ | `SellerProductsPage` |
| Fish category taxonomy | ✅ | ❌ | BE ada seed data; Flutter tidak ada filter per kategori di UI |

---

## 3. 🛒 Cart & Checkout

| Fitur | Backend | Flutter | Catatan |
|-------|---------|---------|---------|
| Tambah ke keranjang | ✅ | ✅ | |
| Lihat keranjang | ✅ | ✅ | |
| Update qty / hapus item | ✅ | ✅ | |
| Pilih alamat pengiriman | ✅ | ✅ | |
| Selector kurir domestik | ❌ | ❌ | `shippingRoutes.js` tidak ada; `shipping_api.dart` hanya punya province/city fetcher |
| Estimasi ongkos kirim | ❌ | ❌ | `POST /shipping/calculate` belum ada |
| Pilih transshipper internasional | ❌ | ❌ | Seluruh alur internasional belum ada |
| Summary harga + ongkir | 🟡 | 🟡 | Checkout ada tapi pakai hardcoded / tanpa kalkulasi ongkir nyata |
| Buat order (direct buy) | ✅ | ✅ | `POST /orders/buy` |
| Redirect ke Midtrans | ✅ | ✅ | `PaymentWebviewPage` |

---

## 4. 📦 Order & Post-Purchase Flow

| Fitur | Backend | Flutter | Catatan |
|-------|---------|---------|---------|
| Daftar order saya | ✅ | ✅ | Tabs: Semua/Belum Bayar/Dikemas/Dikirim/Selesai/Dibatalkan |
| Detail order | ✅ (`GET /:id`) | ❌ | Tidak ada `OrderDetailPage` di Flutter; tap order di list tidak ke mana-mana |
| Midtrans payment webhook | ✅ | — | BE handles callback |
| Seller konfirmasi & proses order | ❌ | ❌ | Tidak ada endpoint `PATCH /:id/process` atau `PATCH /:id/ship` untuk seller |
| Seller input nomor resi | ❌ | ❌ | Belum ada endpoint + UI |
| Buyer konfirmasi terima barang | ❌ | ❌ | `POST /:id/confirm-receive` tidak ada di `orderRoutes.js` |
| DOA (Dead on Arrival) dispute | ❌ | ❌ | `POST /:id/dispute` tidak ada |
| Batal order | ✅ (`PATCH /:id/cancel`) | ❌ | BE ada, Flutter tidak ada tombol cancel di order list/detail |
| Status tracking realtime (Socket.IO) | ❌ | ❌ | Belum ada Socket event untuk order status update |

> **Catatan penting**: `orderRoutes.js` masih memiliki banyak sisa kode Setorin (collector, RT pickup, cooking oil) yang tidak relevan dengan Bettazon. Perlu dibersihkan.

---

## 5. 🏷️ Auction System (Lelang)

### 5a. Backend — Auction Routes (`/api/auctions`)

| Route | Status | Catatan |
|-------|--------|---------|
| `GET /` — list semua lelang aktif | ❌ | Tidak ada |
| `GET /:id` — detail lelang | ✅ | Ada |
| `POST /` — buat page auction (seller) | ✅ | Ada |
| `POST /live` — buat live auction (seller) | ✅ | Ada |
| `PUT /:id` — update auction (seller) | ❌ | Tidak ada |
| `DELETE /:id` / cancel | ❌ | Tidak ada |
| `POST /:id/bid` — tawar (buyer) | ✅ | Ada |
| `POST /:id/live-bid` — tawar live (buyer) | ✅ | Ada |
| `PATCH /:id/end` — akhiri live auction (seller) | ✅ | Ada |
| `POST /:id/buy-now` — beli langsung (jika ada harga BIN) | ❌ | Tidak ada |
| `GET /:id/bids` — riwayat penawaran | ❌ | Tidak ada |
| `POST /:id/settle` — selesaikan lelang + buat Order | ❌ | Tidak ada (untuk page auction) |

### 5b. Backend — Cron Jobs Lelang

| Cron Job | Status | Catatan |
|----------|--------|---------|
| Auto-end page auction yang expired | ❌ | **KRITIS** — tanpa ini, lelang halaman tidak pernah berakhir otomatis |
| Notifikasi pemenang lelang | ❌ | |
| Expire order lelang yang tidak dibayar | ❌ | |
| Auto-extend waktu saat ada bid mepet batas | 🟡 | Logika ada di `auctionService.js` tapi belum ditest |

### 5c. Flutter — Auction

| Item | Status | Catatan |
|------|--------|---------|
| `AuctionAPI` (`lib/data/api/auction/`) | ❌ | Direktori tidak ada |
| `AuctionProvider` (`lib/provider/auction_provider.dart`) | ❌ | Tidak ada |
| Halaman daftar lelang aktif | ❌ | Tidak ada halaman |
| Halaman detail lelang (timer + bid + chat) | ❌ | Tidak ada halaman |
| Formulir buat lelang (seller) | ❌ | Tidak ada halaman |
| Overlay lelang di LiveHostPage | ❌ | Host tidak bisa kelola lelang live dari app |
| Overlay tawaran di LiveViewerPage | ❌ | Viewer tidak bisa menawar dari app |
| Route di `router.dart` | ❌ | Tidak ada |
| Registrasi di `injection.dart` | ❌ | Tidak ada |

---

## 6. 📡 Live Streaming

| Fitur | Backend | Flutter | Catatan |
|-------|---------|---------|---------|
| Daftar stream aktif (`GET /api/livestreams`) | ✅ | ✅ | |
| Buat stream (`POST /api/livestreams`) | ✅ | ✅ | |
| Start stream (`PATCH /:id/start`) | ✅ | ✅ | |
| End stream (`PATCH /:id/end`) | ✅ | ✅ | |
| Generate token LiveKit | ✅ | ✅ | |
| Set auction state di stream | ✅ | ❌ | BE ada `PATCH /:id/auction`; Flutter `LiveHostPage` tidak memanggil ini |
| Penonton join room LiveKit | ✅ | ✅ | `LiveViewerPage` |
| Host publish video | ✅ | ✅ | `LiveHostPage` |
| Viewer count realtime | ✅ (Redis) | ❌ | Flutter tidak menampilkan jumlah penonton |
| Chat realtime di stream (Socket.IO) | ❌ | ❌ | Belum ada integrasi Socket.IO untuk live chat |
| LiveKit Data Packets untuk bid live | ✅ (BE menerima) | ❌ | Flutter tidak mengirim bid via DataPacket |
| State lelang live (Redis snapshot → DB) | 🟡 | ❌ | BE ada `settleLiveAuction` tapi tidak dipanggil dari Flutter |

### Bug di Flutter Live Pages

| Bug | File | Detail |
|-----|------|--------|
| `Navigator.pushNamed` bukan GoRouter | [lib/pages/live/live_list_page.dart](../bettazon-id-app/lib/pages/live/live_list_page.dart) | Baris 150: pakai `Navigator.pushNamed('/live/viewer')` yang tidak terdaftar di GoRouter → crash |
| `stream` tidak diteruskan ke halaman | [lib/router.dart](../bettazon-id-app/lib/router.dart) | `LiveViewerPage` dan `LiveHostPage` di router mengextract `state.extra` ke variabel `stream` tapi tidak meneruskannya ke constructor widget |

---

## 7. 🚚 Shipping System

| Item | Backend | Flutter | Catatan |
|------|---------|---------|---------|
| Model `ShippingOption.js` | ❌ | — | Belum dibuat |
| Model `ShippingPartner.js` (transshipper) | ❌ | — | Belum dibuat |
| `GET /shipping/domestic` — list kurir | ❌ | ❌ | `shippingRoutes.js` tidak ada di repo |
| `GET /shipping/international` — list transshipper | ❌ | ❌ | |
| `GET /shipping/international/:id` — detail transshipper | ❌ | ❌ | |
| `POST /shipping/calculate` — estimasi ongkir | ❌ | ❌ | |
| Seed data kurir domestik (JNE, SiCepat, dll) | ❌ | — | |
| Seed data transshipper Jakarta | ❌ | — | |
| Flutter: ShippingPage (pilih kurir) | ❌ | ❌ | |
| Flutter: International shipping info page | ❌ | ❌ | |
| Province/city selector (RajaOngkir) | ✅ | ✅ | `shipping_api.dart` sudah ada fetchProvince/fetchCity |

---

## 8. ⭐ Rating & Review

| Item | Backend | Flutter | Catatan |
|------|---------|---------|---------|
| Model `Rating.js` | ✅ | — | Ada |
| `POST /api/ratings` — buat rating | ✅ | ❌ | BE ada, Flutter tidak ada UI |
| `GET /api/ratings/user/:id` — rating user | ✅ | ❌ | |
| `GET /api/ratings/:id` | ✅ | ❌ | |
| `RatingAPI` di Flutter | ❌ | ❌ | Direktori `lib/data/api/rating/` tidak ada |
| `RatingProvider` di Flutter | ❌ | ❌ | Tidak ada |
| Halaman rating setelah order selesai | ❌ | ❌ | |
| Tampilkan rating di profil seller | ❌ | ❌ | |
| Tampilkan rating di detail produk | ❌ | ❌ | |

---

## 9. 💬 In-App Chat

| Item | Backend | Flutter | Catatan |
|------|---------|---------|---------|
| Model `Chat.js` + `Message.js` | ✅ | — | |
| Buat chat (`POST /api/chat`) | ✅ | ❌ | |
| Kirim pesan (`POST /api/chat/message`) | ✅ | ❌ | |
| Daftar chat (`GET /api/chat`) | ✅ | ❌ | |
| Pesan dalam chat (`GET /api/chat/:id/messages`) | ✅ | ❌ | |
| Upload attachment (`POST /api/chat/upload`) | ✅ | ❌ | |
| Mark as read (`PUT /api/chat/:id/read`) | ✅ | ❌ | |
| Unread count (`GET /api/chat/unread-count`) | ✅ | ❌ | |
| Chat retention config (admin) | ✅ | — | |
| Realtime via Socket.IO | ❌ | ❌ | BE belum emit event untuk pesan baru |
| `ChatAPI` di Flutter | ❌ | ❌ | Direktori `lib/data/api/chat/` tidak ada |
| `ChatProvider` di Flutter | ❌ | ❌ | |
| Halaman Chat (list conversation) | ❌ | ❌ | Tidak ada `lib/pages/chat/` |
| Halaman Chat Detail (per conversation) | ❌ | ❌ | |

---

## 10. 🏪 Seller Features

| Fitur | Backend | Flutter | Catatan |
|-------|---------|---------|---------|
| Daftar & kelola produk | ✅ | ✅ | `SellerProductsPage` |
| Buat / edit produk | ✅ | ✅ | `SellerProductFormPage` |
| Upgrade ke seller (jadi penjual) | ❌ | ❌ | Tidak ada flow onboarding seller; tidak ada endpoint `POST /users/become-seller` |
| Verifikasi KTP | ❌ | ❌ | |
| Setup data toko (`sellerData.storeName`, dll) | ❌ | ❌ | |
| Dashboard seller (statistik penjualan) | 🟡 | ❌ | BE ada `dashboardRoutes.js` tapi tidak tahu apakah sudah seller-specific; Flutter tidak ada halaman |
| Seller kelola order masuk | ❌ | ❌ | Tidak ada halaman seller order management |
| Seller mark order sebagai "diproses" / kirim | ❌ | ❌ | Tidak ada endpoint + UI |
| Seller buat live stream | ✅ (BE) | ✅ (`LiveHostPage`) | |
| Seller buat / kelola lelang | 🟡 (BE routes ada) | ❌ | Flutter tidak ada UI sama sekali |
| Seller withdraw ke rekening bank | ✅ (BE) | ❌ | `withdrawalRoutes.js` ada, Flutter tidak ada halaman |
| Seller lihat riwayat transaksi wallet | ✅ (BE) | 🟡 | `WalletTopupPage` ada tapi riwayat/withdrawal belum |

---

## 11. 💰 Wallet & Keuangan

| Fitur | Backend | Flutter | Catatan |
|-------|---------|---------|---------|
| Lihat saldo wallet | ✅ | ✅ | `WalletTopupPage` |
| Top-up wallet | ✅ | ✅ | Via Midtrans |
| Riwayat transaksi wallet | ✅ | ❌ | BE ada, Flutter tidak ada halaman history |
| Escrow sistem (hold payment) | ✅ | — | Otomatis di BE saat order paid |
| Release escrow ke seller | 🟡 | — | Logika ada di `expireHeldEscrows` cron; tapi trigger dari `confirm-receive` buyer belum ada |
| Withdrawal ke bank | ✅ (routes) | ❌ | `withdrawalRoutes.js` ada; Flutter tidak ada halaman |
| Digiflazz top-up (pulsa/token) | ✅ | ❌ | BE ada; Flutter tidak ada halaman |

---

## 12. 🔔 Notifikasi Push (FCM)

| Item | Backend | Flutter | Catatan |
|------|---------|---------|---------|
| `notificationService.js` — send FCM | ✅ | — | Firebase Admin SDK |
| Notifikasi order baru (seller) | ✅ | ❓ | BE kirim; Flutter setup FCM tidak diverifikasi |
| Notifikasi status order (buyer) | ✅ | ❓ | |
| Notifikasi bid kalah/menang | ❌ | ❌ | Tidak ada karena auction belum complete |
| Halaman notifikasi (in-app) | ❌ | ❌ | Tidak ada `NotificationPage` di Flutter |
| `NotificationProvider` | ❌ | ❌ | |
| Firebase `google-services.json` / APNs setup | — | ❓ | Tidak terverifikasi apakah sudah dikonfigurasi di `android/` dan `ios/` |
| Badge / unread count | ❌ | ❌ | |

---

## 13. 👥 Social / Follower System

| Fitur | Backend | Flutter | Catatan |
|-------|---------|---------|---------|
| Follow seller | ❌ | ❌ | Belum ada di BE maupun Flutter |
| Unfollow | ❌ | ❌ | |
| Daftar following/follower | ❌ | ❌ | |
| Feed produk dari seller yang difollow | ❌ | ❌ | |

---

## 14. 🛡️ Admin Panel

| Fitur | Backend | Flutter | Catatan |
|-------|---------|---------|---------|
| `adminRoutes.js` | ✅ | — | Ada di BE |
| Dashboard admin | ✅ (BE) | ❌ | Tidak ada halaman admin di Flutter |
| Kelola user | ✅ (BE) | ❌ | |
| Kelola produk | ✅ (BE) | ❌ | |
| Kelola order | ✅ (BE) | ❌ | |
| Kelola withdrawal | ✅ (BE) | ❌ | |
| Approve KTP seller | ❌ | ❌ | Flow belum ada |

> **Catatan**: Admin panel mungkin lebih cocok sebagai web app terpisah, bukan bagian dari Flutter app.

---

## 15. 🧹 Technical Debt & Bug

| Item | File | Prioritas | Detail |
|------|------|-----------|--------|
| Health route masih "Setorin" | `src/app.js` | 🟡 Medium | Response health check masih bertuliskan "Setorin Waste Management API" |
| Kode Setorin di orderRoutes | `src/routes/orderRoutes.js` | 🟡 Medium | Endpoint collector, RT pickup, cooking oil tidak relevan |
| Kode Setorin di orderService | `src/services/orderService.js` | 🟡 Medium | Perlu audit — hapus fungsi yang tidak dipakai |
| Navigator.pushNamed bukan GoRouter | `lib/pages/live/live_list_page.dart:150` | 🔴 High (Bug) | Crash saat tap live stream dari list |
| `stream` tidak diteruskan ke LiveViewerPage | `lib/router.dart` | 🔴 High (Bug) | `state.extra` di-cast ke `LiveStreamModel` tapi tidak di-pass ke widget constructor |
| `stream` tidak diteruskan ke LiveHostPage | `lib/router.dart` | 🔴 High (Bug) | Sama seperti di atas |
| Tidak ada cron auto-end page auction | `src/services/cronJobService.js` | 🔴 High | Lelang halaman tidak pernah berakhir otomatis |
| Facebook login UI disembunyikan | `lib/pages/auth_login/login_page.dart` | 🟢 Low | Pending Meta Business Verification |

---

## 16. 📋 Ringkasan Prioritas Pengerjaan

### 🔴 HIGH PRIORITY (Blocker untuk MVP)

1. **Bug fix live pages** — fix `Navigator.pushNamed` + stream parameter di GoRouter
2. **Cron job auction auto-end** — tambahkan di `cronJobService.js`
3. **Order Detail Page** (Flutter) — tap order di list tidak ke mana-mana
4. **Seller order management** — seller perlu bisa proses & kirim order
5. **Buyer confirm-receive** — trigger release escrow
6. **Auction Flutter** — buat `AuctionAPI`, `AuctionProvider`, halaman list + detail + bid

### 🟡 MEDIUM PRIORITY (Penting untuk pengalaman pengguna)

7. **Shipping selector** — BE `shippingRoutes.js` + Flutter UI pilih kurir + estimasi ongkir
8. **Rating & Review** — Flutter page + `RatingAPI` + `RatingProvider`
9. **Live streaming auction overlay** — tombol bid di `LiveViewerPage`, kelola lelang di `LiveHostPage`
10. **Chat in-app** — Flutter `ChatAPI`, `ChatProvider`, `ChatPage`, `ChatDetailPage`
11. **Seller onboarding** — upgrade-to-seller flow + setup toko

### 🟢 LOW PRIORITY (Post-MVP)

12. **Notification page** Flutter (FCM sudah kirim dari BE, tinggal UI)
13. **Withdrawal page** Flutter
14. **Follower/following system**
15. **Admin panel** (kemungkinan web app terpisah)
16. **International shipping** transshipper flow
17. **Facebook login** (unblock setelah Meta verification)
18. **Clean up Setorin sisa-sisa** di BE codebase

---

## 17. 📁 File Penting yang Perlu Dibuat

### Backend (`bettazon-id-be`)
```
src/routes/shippingRoutes.js          # GET /domestic, /international, POST /calculate
src/controllers/shippingController.js
src/services/shippingService.js
src/models/ShippingOption.js
src/models/ShippingPartner.js
src/seeders/shippingPartnerSeeder.js
```

### Flutter (`bettazon-id-app`)
```
lib/data/api/auction/auction_api.dart
lib/data/api/chat/chat_api.dart
lib/data/api/rating/rating_api.dart
lib/provider/auction_provider.dart
lib/provider/chat_provider.dart
lib/provider/rating_provider.dart
lib/provider/notification_provider.dart
lib/pages/order/order_detail_page.dart
lib/pages/auction/auction_list_page.dart
lib/pages/auction/auction_detail_page.dart
lib/pages/auction/auction_form_page.dart       # untuk seller
lib/pages/chat/chat_list_page.dart
lib/pages/chat/chat_detail_page.dart
lib/pages/rating/rating_form_page.dart
lib/pages/notification/notification_page.dart
lib/pages/seller/seller_orders_page.dart
lib/pages/seller/seller_onboarding_page.dart
lib/pages/wallet/wallet_history_page.dart
lib/pages/wallet/withdrawal_page.dart
```

---

## 18. 📐 Endpoint yang Perlu Ditambahkan di Backend

### Order Routes
```
PATCH  /api/orders/:id/process          # Seller konfirmasi & mulai proses
PATCH  /api/orders/:id/ship             # Seller input resi & tandai dikirim
POST   /api/orders/:id/confirm-receive  # Buyer konfirmasi terima → release escrow
POST   /api/orders/:id/dispute          # Buyer ajukan DOA claim
```

### Auction Routes (Tambahan)
```
GET    /api/auctions                    # List lelang aktif (dengan filter)
PUT    /api/auctions/:id                # Update page auction (seller, jika belum ada bid)
DELETE /api/auctions/:id                # Cancel auction (seller)
POST   /api/auctions/:id/buy-now        # Beli langsung (BIN price)
GET    /api/auctions/:id/bids           # Riwayat penawaran
POST   /api/auctions/:id/settle         # Selesaikan lelang halaman (manual atau via cron)
```

### Shipping Routes (Semua Baru)
```
GET    /api/shipping/domestic           # List kurir domestik
GET    /api/shipping/international      # List transshipper
GET    /api/shipping/international/:id  # Detail transshipper + negara tujuan
POST   /api/shipping/calculate          # Estimasi ongkir
```

### User Routes (Tambahan)
```
POST   /api/users/become-seller         # Upgrade akun ke role seller
POST   /api/users/verify-ktp            # Upload KTP + selfie untuk verifikasi
```
