# 📊 Project Status — Bettazon.id
> Last updated: Juli 2025
> Audit menyeluruh tiga repo: `bettazon-id-be` (Backend) + `bettazon-id-app` (Flutter) + `bettazon-id` (Next.js Web + Admin Panel)

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
| Facebook Login | 🟡 | 🟡 | BE siap; Flutter UI disembunyikan pending Meta Business Verification |
| Lupa password via OTP | ✅ | ✅ | |
| Reset password | ✅ | ✅ | |
| Refresh token / logout | ✅ | ✅ | Token blacklist via Redis |
| Avatar / foto profil | ✅ | ✅ | `POST /api/users/avatar`; `ProfileDetailPage` punya upload avatar |
| Update profil (nama, bio, dll) | ✅ | ✅ | `ProfileDetailPage` |
| Ganti password (in-app) | ✅ | ✅ | `ProfilePasswordPage` |

---

## 2. 🐟 Product Module

| Fitur | Backend | Flutter | Catatan |
|-------|---------|---------|---------|
| List produk (public) | ✅ | ✅ | |
| Detail produk (slug) | ✅ | ✅ | Tap-to-fullscreen media gallery |
| Search produk | ✅ | ✅ | `SearchPage` |
| Filter produk (harga, kondisi, dll) | ✅ | ✅ | `ModalFilterProduct` widget |
| Explore produk | ✅ | ✅ | `ExplorePage` dengan infinite scroll |
| Upload gambar produk | ✅ | ✅ | DigitalOcean Spaces (S3) |
| Seller buat produk | ✅ | ✅ | `SellerProductFormPage` |
| Seller edit produk | ✅ | ✅ | |
| Seller hapus produk | ✅ | ✅ | |
| Seller publish/unpublish | ✅ | ✅ | |
| Seller daftar produknya | ✅ | ✅ | `SellerProductsPage` |
| Favorit produk (wishlist) | ✅ | ✅ | `FavoritesPage`; terdaftar di `router.dart` |
| Fish category taxonomy | ✅ | ❌ | BE punya seed data kategori ikan; Flutter tidak ada filter per kategori di UI |

---

## 3. 🛒 Cart & Checkout

| Fitur | Backend | Flutter | Catatan |
|-------|---------|---------|---------|
| Tambah ke keranjang | ✅ | ✅ | |
| Lihat keranjang | ✅ | ✅ | |
| Update qty / hapus item | ✅ | ✅ | |
| Pilih alamat pengiriman | ✅ | ✅ | `ProfileAddressPage` + `ProfileAddressFormPage` |
| Province/city selector (RajaOngkir) | ✅ | ✅ | `ShippingAPI` punya `fetchProvince`/`fetchCity` |
| Selector kurir domestik | ✅ | 🟡 | `GET /api/shipping/domestic` ada; `ShippingAPI`+`ShippingProvider` ada; integrasi di checkout perlu diverifikasi |
| Estimasi ongkos kirim | ✅ | 🟡 | `POST /api/shipping/calculate` + `calculate-all` ada; Flutter API ada |
| Tracking pengiriman | ✅ | 🟡 | `GET /api/shipping/tracking/:orderId` ada; UI di `OrderDetailPage` perlu diverifikasi |
| Pilih transshipper internasional | ✅ | 🟡 | Routes internasional ada; `ShippingAPI` ada; UI checkout internasional belum diverifikasi penuh |
| Summary harga + ongkir | ✅ | ✅ | `CheckoutPage` ada |
| Buat order (direct buy) | ✅ | ✅ | `POST /api/orders/buy` |
| Cart checkout (multi-item) | ✅ | ✅ | `POST /api/orders/cart-checkout` |
| Redirect ke Midtrans | ✅ | ✅ | `PaymentWebviewPage` |

---

## 4. 📦 Order & Post-Purchase Flow

| Fitur | Backend | Flutter | Catatan |
|-------|---------|---------|---------|
| Daftar order saya (buyer) | ✅ | ✅ | `OrderPage` — tabs: Semua/Belum Bayar/Dikemas/Dikirim/Selesai/Dibatalkan |
| Detail order (buyer) | ✅ | ✅ | `OrderDetailPage` ada dan terdaftar di router |
| Midtrans payment webhook | ✅ | — | BE handles callback otomatis |
| Seller konfirmasi & proses order | ✅ | ✅ | `PATCH /api/orders/:id/process`; `SellerOrderDetailPage` |
| Seller input nomor resi & kirim | ✅ | ✅ | `PATCH /api/orders/:id/ship`; `SellerOrderDetailPage` |
| Seller daftar order masuk | ✅ | ✅ | `SellerOrdersPage` + `SellerOrderDetailPage` |
| Buyer konfirmasi terima barang | ✅ | 🟡 | `POST /api/orders/:id/confirm-receive` ada; tombol di `OrderDetailPage` perlu diverifikasi |
| DOA (Dead on Arrival) dispute | ✅ | 🟡 | `POST /:id/dispute` + `respond` + `resolve` ada; UI Flutter belum diverifikasi penuh |
| Upload bukti DOA (foto) | ✅ | 🟡 | `POST /api/orders/:id/doa-evidence` ada; UI perlu diverifikasi |
| Penggantian barang (replacement) | ✅ | 🟡 | `PATCH /api/orders/:id/replacement/ship` ada; UI Flutter belum diverifikasi |
| Batal order | ✅ | 🟡 | `PATCH /api/orders/:id/cancel` ada; tombol di Flutter perlu diverifikasi |
| Status tracking realtime (Socket.IO) | ✅ | ✅ | BE `order:status_updated` di `processOrder`/`shipOrder`/`confirmReceive`; Flutter `ChatProvider` listener → `OrderProvider.handleSocketOrderEvent`; socket connect di `HomePage.initState` |
| Escrow otomatis saat order paid | ✅ | — | Via webhook Midtrans |
| Release escrow ke seller | ✅ | — | Trigger dari `confirm-receive` buyer + cron `expireHeldEscrows` |

> **Catatan**: `orderRoutes.js` masih mengandung sisa kode Setorin (collector, RT pickup, cooking oil) yang tidak relevan. Perlu dibersihkan.

---

## 5. 🏷️ Auction System (Lelang Halaman)

### 5a. Backend — Auction Routes (`/api/auctions`)

| Route | Status | Catatan |
|-------|--------|---------|
| `GET /` — list lelang aktif (dengan filter) | ✅ | Ada |
| `GET /:id` — detail lelang | ✅ | Ada |
| `POST /` — buat page auction (seller) | ✅ | Ada |
| `POST /live` — buat live auction objek (seller) | ✅ | Ada |
| `PUT /:id` — update auction (seller) | ✅ | Ada |
| `DELETE /:id` — cancel auction | ✅ | Ada |
| `POST /:id/bid` — tawar page auction (buyer) | ✅ | Ada |
| `POST /:id/live-bid` — tawar live auction (buyer) | ✅ | Ada |
| `POST /:id/buy-now` — beli BIN price | ✅ | Ada |
| `GET /:id/bids` — riwayat penawaran | ✅ | Ada |
| `PATCH /:id/end` — akhiri live auction (seller) | ✅ | Ada |
| `POST /:id/settle` — selesaikan lelang + buat Order | ✅ | Ada |
| `GET /:id/my-order` — order saya di lelang ini | ✅ | Ada |
| `POST /:id/proxy-bid` — proxy/auto bid | ✅ | Ada |
| `DELETE /:id/proxy-bid` — hapus proxy bid | ✅ | Ada |
| `GET /:id/my-proxy-bid` — lihat proxy bid saya | ✅ | Ada |

### 5b. Backend — Cron Jobs Lelang

| Cron Job | Status | Catatan |
|----------|--------|---------|
| Auto-end page auction yang expired | ✅ | `autoEndExpiredPageAuctions` di `cronJobService.js` |
| Auto-start pending page auction | ✅ | `autoStartPendingPageAuctions` |
| Notifikasi lelang akan berakhir | ✅ | `notifyAuctionsEndingSoon` |
| Auto-extend waktu saat ada bid mepet batas | ✅ | Logika ada di `auctionService.js` (auto-extend 5 menit) |
| Cancel order lelang tidak dibayar | ✅ | Cron cancel expired orders |

### 5c. Flutter — Auction

| Item | Status | Catatan |
|------|--------|---------|
| `AuctionAPI` (`lib/data/api/auction/`) | ✅ | Ada dan terdaftar di `injection.dart` |
| `AuctionProvider` (`lib/provider/auction_provider.dart`) | ✅ | Ada dan terdaftar di `injection.dart` + `MultiProvider` |
| Halaman daftar lelang aktif | ✅ | `AuctionListPage` terdaftar di `router.dart` |
| Halaman detail lelang (timer + bid) | ✅ | `AuctionDetailPage` dengan tap-to-fullscreen media |
| Formulir buat lelang (seller) | ✅ | `AuctionFormPage` terdaftar di `router.dart` |
| Overlay bid live di LiveViewerPage | ✅ | `_buildAuctionOverlay()` fully implemented; DataPacket `live_bid`/`live_auction_start/end` |
| Overlay kelola lelang di LiveHostPage | 🟡 | `LiveHostPage` ada; integrasi `PATCH /api/livestreams/:id/auction` perlu diverifikasi |
| Route di `router.dart` | ✅ | Semua halaman terdaftar |
| Registrasi di `injection.dart` | ✅ | `AuctionAPI` + `AuctionProvider` terdaftar |

---

## 6. 📡 Live Streaming

| Fitur | Backend | Flutter | Catatan |
|-------|---------|---------|---------|
| Daftar stream aktif (`GET /api/livestreams`) | ✅ | ✅ | `LiveListPage` |
| Buat stream (`POST /api/livestreams`) | ✅ | ✅ | Dari `LiveHostPage` |
| Start stream (`PATCH /:id/start`) | ✅ | ✅ | |
| End stream (`PATCH /:id/end`) | ✅ | ✅ | |
| Generate token LiveKit (host & viewer) | ✅ | ✅ | |
| Set auction state di stream (`PATCH /:id/auction`) | ✅ | 🟡 | BE ada; `LiveHostPage` perlu diverifikasi apakah memanggil ini |
| Penonton join room LiveKit | ✅ | ✅ | `LiveViewerPage` |
| Host publish video | ✅ | ✅ | `LiveHostPage` |
| Viewer count realtime | ✅ | ✅ | Redis counter; `liveProvider.liveViewerCount` ditampilkan di `LiveViewerPage` |
| DataPacket bid live dari viewer | ✅ | ✅ | Flutter kirim & terima DataPacket: `live_bid`, `live_auction_start/end`, `viewerCount` |
| State lelang live (Redis → DB settle) | ✅ | 🟡 | BE ada `settleLiveAuction`; trigger dari Flutter perlu diverifikasi |
| Live chat realtime (Socket.IO in-stream) | ❌ | ❌ | Belum ada integrasi Socket.IO untuk obrolan di dalam livestream |
| Stream di-pass ke halaman via Router | ✅ | ✅ | Bug lama FIXED — `router.dart` pass `state.extra as LiveStreamModel` ke constructor |

---

## 7. 🚚 Shipping System

| Item | Backend | Flutter | Catatan |
|------|---------|---------|---------|
| Model `ShippingPartner.js` | ✅ | — | Ada di `src/models/ShippingPartner.js` |
| `GET /api/shipping/domestic` — list kurir | ✅ | ✅ | `ShippingAPI` ada |
| `GET /api/shipping/cities` — daftar kota | ✅ | ✅ | RajaOngkir |
| `GET /api/shipping/countries` — negara tujuan | ✅ | ✅ | |
| `GET /api/shipping/international` — list transshipper | ✅ | 🟡 | API ada; integrasi UI perlu diverifikasi |
| `GET /api/shipping/international/:id` — detail transshipper | ✅ | 🟡 | |
| `GET /api/shipping/product-origin/:productId` | ✅ | — | |
| `POST /api/shipping/calculate` — estimasi ongkir | ✅ | 🟡 | API ada di `ShippingAPI`; integrasi di checkout perlu diverifikasi |
| `POST /api/shipping/calculate-all` — semua kurir sekaligus | ✅ | 🟡 | |
| `GET /api/shipping/tracking/:orderId` — tracking | ✅ | 🟡 | API ada; UI di `OrderDetailPage` perlu diverifikasi |
| Flutter `ShippingProvider` + `ShippingAPI` | — | ✅ | Keduanya ada dan terdaftar di `injection.dart` |

---

## 8. ⭐ Rating & Review

| Item | Backend | Flutter | Catatan |
|------|---------|---------|---------|
| Model `Rating.js` | ✅ | — | Ada |
| `POST /api/ratings` — buat rating | ✅ | ✅ | BE ada; `RatingFormPage` ada |
| `GET /api/ratings/user/:id` — rating user | ✅ | 🟡 | API ada; tampil di profil seller perlu diverifikasi |
| `GET /api/ratings/:id` | ✅ | 🟡 | |
| `RatingAPI` di Flutter | ✅ | ✅ | Ada dan terdaftar di `injection.dart` |
| `RatingProvider` di Flutter | ✅ | ✅ | Ada dan terdaftar di `injection.dart` |
| Halaman form rating setelah order selesai | ✅ | ✅ | `RatingFormPage` terdaftar di `router.dart` |
| Tampilkan rating di profil seller | 🟡 | 🟡 | `SellerProfilePage` ada; apakah rating ditampilkan perlu diverifikasi |
| Tampilkan rating di detail produk | 🟡 | 🟡 | Perlu diverifikasi |

---

## 9. 💬 In-App Chat

| Item | Backend | Flutter | Catatan |
|------|---------|---------|---------|
| Model `Chat.js` + `Message.js` | ✅ | — | |
| Buat / buka chat (`POST /api/chat`) | ✅ | ✅ | |
| Kirim pesan (`POST /api/chat/message`) | ✅ | ✅ | |
| Daftar chat (`GET /api/chat`) | ✅ | ✅ | `ChatListPage` |
| Pesan dalam chat (`GET /api/chat/:id/messages`) | ✅ | ✅ | `ChatDetailPage` |
| Upload attachment (`POST /api/chat/upload`) | ✅ | 🟡 | BE ada; UI attachment perlu diverifikasi |
| Mark as read | ✅ | ✅ | |
| Unread count | ✅ | ✅ | |
| Chat retention config (admin) | ✅ | — | `ChatConfig` model ada |
| Realtime Socket.IO — BE emit event | ✅ | — | BE emit `chat_message`, `chat:conversation-updated`, `chat:messagesRead`, `newMessage` |
| Realtime Socket.IO — Flutter listener | ✅ | ✅ | Polling dihapus; `ChatProvider` sudah full Socket.IO (`chat_message`, `chat:conversation-updated`, presence); socket connect saat app start di `HomePage.initState` |
| `ChatAPI` + `ChatProvider` di Flutter | ✅ | ✅ | Ada dan terdaftar di `injection.dart` |
| Halaman Chat List | ✅ | ✅ | `ChatListPage` terdaftar di `router.dart` |
| Halaman Chat Detail | ✅ | ✅ | `ChatDetailPage` terdaftar di `router.dart` |

---

## 10. 🏪 Seller Features

| Fitur | Backend | Flutter | Catatan |
|-------|---------|---------|---------|
| Daftar & kelola produk | ✅ | ✅ | `SellerProductsPage` |
| Buat / edit / hapus produk | ✅ | ✅ | `SellerProductFormPage` |
| Upgrade ke seller (onboarding + setup toko) | ✅ | ✅ | `POST /api/users/roles/switch`; `SellerRegistrationPage` — 3 step: info toko → upload KTP → sukses |
| Verifikasi KTP | ✅ | ✅ | `POST /api/users/seller/ktp`; upload KTP + selfie ada di step 2 `SellerRegistrationPage` |
| Admin approve KTP seller | ✅ | — | `PATCH /api/users/admin/sellers/:userId/verify-ktp`; via Next.js Admin Panel |
| Setting toko (nama, deskripsi, banner) | ✅ | ✅ | `SellerStoreSettingsPage` |
| Profil publik toko | ✅ | ✅ | `SellerProfilePage` (inline di `router.dart`) |
| Dashboard statistik seller | 🟡 | ❌ | `dashboardRoutes.js` ada di BE; Flutter tidak punya halaman dashboard seller khusus |
| Seller kelola order masuk | ✅ | ✅ | `SellerOrdersPage` + `SellerOrderDetailPage` |
| Seller proses & kirim order | ✅ | ✅ | Endpoint + UI ada |
| Seller buat live stream | ✅ | ✅ | `LiveHostPage` |
| Seller buat / kelola lelang | ✅ | ✅ | `AuctionFormPage`; live auction dari `LiveHostPage` |
| Seller subscription (paket berlangganan) | ✅ | ✅ | `SellerSubscriptionPage` + `SellerSubscriptionCheckoutPage` |
| Seller kelola iklan (sponsored ads) | ✅ | ✅ | `SellerAdsPage` |
| Seller wallet & saldo | ✅ | ✅ | `SellerWalletPage` |
| Seller riwayat transaksi | ✅ | ✅ | `WalletHistoryPage` + `TransactionDetailPage` |
| Seller withdraw ke rekening bank | ✅ | ✅ | `WithdrawalPage` terdaftar di `router.dart` |

---

## 11. 💰 Wallet & Keuangan

| Fitur | Backend | Flutter | Catatan |
|-------|---------|---------|---------|
| Lihat saldo wallet | ✅ | ✅ | |
| Top-up wallet (Midtrans) | ✅ | ✅ | `WalletTopupPage` |
| Riwayat transaksi wallet | ✅ | ✅ | `WalletHistoryPage` terdaftar di `router.dart` |
| Detail transaksi | ✅ | ✅ | `TransactionDetailPage` terdaftar di `router.dart` |
| Escrow otomatis saat order paid | ✅ | — | Via webhook Midtrans |
| Release escrow ke seller | ✅ | — | Trigger `confirm-receive` buyer + cron `expireHeldEscrows` |
| Withdrawal ke bank | ✅ | ✅ | `withdrawalRoutes.js` + `WithdrawalPage` |
| Top-up digital (pulsa/token) via Digiflazz | ✅ | ❌ | BE ada `digiflazzRoutes.js` + `topupRoutes.js`; Flutter tidak ada halaman topup digital |

---

## 12. 🔔 Notifikasi

| Item | Backend | Flutter | Catatan |
|------|---------|---------|---------|
| `notificationService.js` — send FCM | ✅ | — | Firebase Admin SDK |
| `notificationRoutes.js` | ✅ | — | CRUD notifikasi ada |
| `NotificationAPI` di Flutter | ✅ | ✅ | Ada dan terdaftar di `injection.dart` |
| `NotificationProvider` di Flutter | ✅ | ✅ | Ada; unread count di-fetch di `HomePage` |
| Notifikasi order baru (seller) | ✅ | ❓ | BE kirim FCM; Flutter setup Firebase perlu diverifikasi |
| Notifikasi status order (buyer) | ✅ | ❓ | |
| Notifikasi bid lelang (menang/kalah) | ✅ | ❓ | BE kirim; Flutter perlu diverifikasi |
| Badge / unread count di UI | 🟡 | 🟡 | `NotificationProvider.fetchUnreadCounts` ada; badge di nav bar perlu diverifikasi |
| Halaman notifikasi in-app (list notif) | ✅ | ✅ | `NotificationPage` — 5 tab, swipe-to-delete, mark-all-read, badge per kategori; terdaftar di `router.dart`; bell icon di `HomePage` |
| Firebase `google-services.json` / APNs setup | — | ❓ | Belum diverifikasi apakah sudah dikonfigurasi penuh di `android/` dan `ios/` |

---

## 13. 📣 Sistem Iklan (Sponsored Ads)

| Fitur | Backend | Flutter | Catatan |
|-------|---------|---------|---------|
| Model `SponsoredAd.js` | ✅ | — | Ada |
| `adsRoutes.js` — CRUD iklan seller | ✅ | ✅ | Seller buat/kelola iklan |
| `SellerAdsPage` di Flutter | ✅ | ✅ | Ada dan terdaftar di `router.dart` |
| `AdsAPI` + `AdsProvider` di Flutter | ✅ | ✅ | Ada dan terdaftar di `injection.dart` |
| Ads analytics di Admin Panel (Next.js) | ✅ | — | `/admin/ads` + `/admin/ads/analytics` |
| Fee iklan masuk ke revenue platform | ✅ | — | `Wallet.transactions type: ad_budget` dicatat dan masuk ke revenue report |

---

## 14. 🎟️ Subscription Seller

| Fitur | Backend | Flutter | Catatan |
|-------|---------|---------|---------|
| Model `SellerSubscription.js` + `SubscriptionPricingConfig.js` | ✅ | — | Ada |
| `subscriptionRoutes.js` — seller + admin | ✅ | ✅ | Seller bisa subscribe; admin kelola harga |
| `SellerSubscriptionPage` di Flutter | ✅ | ✅ | Ada dan terdaftar di `router.dart` |
| `SellerSubscriptionCheckoutPage` di Flutter | ✅ | ✅ | Ada dan terdaftar di `router.dart` |
| `SubscriptionAPI` + `SubscriptionProvider` di Flutter | ✅ | ✅ | Ada dan terdaftar di `injection.dart` |
| Admin kelola harga subscription (Next.js) | ✅ | — | `/admin/subscription-pricing` |

---

## 15. 🏆 Loyalty / Points / Rewards

| Fitur | Backend | Flutter | Catatan |
|-------|---------|---------|---------|
| Model `Point.js`, `PointConfig.js`, `PointTransaction.js` | ✅ | — | Ada |
| Model `Reward.js` | ✅ | — | Ada |
| `loyaltyRoutes.js` + `rewardRoutes.js` | ✅ | — | Ada |
| `pointsRoutes.js` + `pointConfigRoutes.js` | ✅ | — | Ada |
| Halaman loyalty / poin di Flutter | ❌ | ❌ | BE sudah siap; Flutter tidak ada halaman sama sekali |
| Halaman reward di Flutter | ❌ | ❌ | |
| Tampilkan saldo poin di profil Flutter | ❌ | ❌ | |

---

## 16. 💱 Currency Rate System

| Fitur | Backend | Flutter | Catatan |
|-------|---------|---------|---------|
| Model `CurrencyRate.js` | ✅ | — | Ada |
| `currencyRoutes.js` | ✅ | — | Ada |
| `CurrencyProvider` di Flutter | ✅ | ✅ | Ada dan terdaftar di `injection.dart` |
| Tampilkan harga dalam mata uang asing | 🟡 | 🟡 | Provider ada; implementasi di UI produk perlu diverifikasi |

---

## 17. 👥 Social / Follower System

| Fitur | Backend | Flutter | Catatan |
|-------|---------|---------|---------|
| Follow seller | ❌ | ❌ | Belum ada route, model, maupun halaman |
| Unfollow | ❌ | ❌ | |
| Daftar following / follower | ❌ | ❌ | |
| Feed produk dari seller yang difollow | ❌ | ❌ | `feedRoutes.js` ada tapi untuk product feed umum, bukan following-based |

---

## 18. 🛡️ Admin Panel (Next.js Web)

Admin panel adalah aplikasi web Next.js terpisah di folder `bettazon-id/app/admin/`. **Bukan** bagian dari Flutter app.

| Halaman | Status | Catatan |
|---------|--------|---------|
| `/admin/login` | ✅ | |
| `/admin/dashboard` | ✅ | Statistik platform, ringkasan order, user, revenue |
| `/admin/users` + `/admin/users/[id]` | ✅ | Kelola user, verifikasi KTP seller |
| `/admin/orders` + `/admin/orders/[id]` | ✅ | Pantau semua order |
| `/admin/products` + `/admin/products/[id]` | ✅ | Moderasi produk |
| `/admin/reports` | ✅ | Revenue report — fee order + iklan; groupBy day/week/month; **baru diperbaiki** |
| `/admin/ads` + `/admin/ads/analytics` | ✅ | Kelola dan analitik iklan sponsor |
| `/admin/chats` | ✅ | Monitor percakapan |
| `/admin/cron-jobs` | ✅ | Lihat status cron job |
| `/admin/emails` | ✅ | Pantau email masuk |
| `/admin/fee-policy` | ✅ | Kelola fee platform |
| `/admin/order-config` | ✅ | Konfigurasi order |
| `/admin/subscription-pricing` | ✅ | Kelola harga paket seller |
| `/admin/transactions` + `/admin/transactions/[id]` | ✅ | Riwayat transaksi |
| `/admin/withdrawals` + `/admin/withdrawals/[id]` | ✅ | Proses withdrawal seller |

---

## 19. 🧹 Technical Debt & Bug

| Item | File | Prioritas | Detail |
|------|------|-----------|--------|
| Health route masih "Setorin" | `src/app.js` | 🟡 Medium | Response health check masih bertuliskan "Setorin Waste Management API" |
| Kode Setorin di orderRoutes | `src/routes/orderRoutes.js` | 🟡 Medium | Endpoint collector, RT pickup, cooking oil tidak relevan dengan Bettazon |
| Kode Setorin di orderService | `src/services/orderService.js` | 🟡 Medium | Perlu audit — hapus fungsi yang tidak dipakai |
| Live host auction management | `lib/pages/live/live_host_page.dart` | 🟡 Medium | Perlu diverifikasi apakah memanggil `PATCH /api/livestreams/:id/auction` |
| Live chat in-stream belum ada | — | 🟡 Medium | Socket.IO chat di dalam livestream belum diimplementasi |
| Facebook login UI disembunyikan | `lib/pages/auth_login/login_page.dart` | 🟢 Low | Pending Meta Business Verification |
| Fish category filter Flutter | `lib/pages/explore/explore_page.dart` | 🟢 Low | `ModalFilterProduct` tidak punya filter per kategori ikan |

> **Bug lama yang SUDAH DIPERBAIKI ✅:**
> - ~~`Navigator.pushNamed` bukan GoRouter di `live_list_page.dart`~~ → ✅ Fixed
> - ~~`stream` tidak diteruskan ke `LiveViewerPage`/`LiveHostPage` di `router.dart`~~ → ✅ Fixed
> - ~~Tidak ada cron auto-end page auction~~ → ✅ `autoEndExpiredPageAuctions` sudah ada
> - ~~`OrderDetailPage` tidak ada di Flutter~~ → ✅ Ada
> - ~~Revenue report admin menampilkan Rp 0~~ → ✅ Fixed (query `Order.payment.platformFee` + `Wallet.ad_budget`)

---

## 20. 📋 Ringkasan Prioritas Pengerjaan

### 🔴 HIGH PRIORITY (Blocker untuk pengalaman pengguna)

1. **Halaman notifikasi Flutter** — ✅ Selesai: `NotificationPage` 5-tab, swipe-delete, bell icon di HomePage
2. **Chat real-time (Socket.IO Flutter)** — ✅ Selesai: polling dihapus, `ChatProvider` full Socket.IO, socket connect di `HomePage.initState`
3. **Order status real-time Flutter** — ✅ Selesai: BE emit `order:status_updated` di `processOrder`/`shipOrder`/`confirmReceive`; Flutter `OrderProvider.handleSocketOrderEvent`
4. **Fish category filter** — tambahkan filter kategori ikan di `ModalFilterProduct` / `ExplorePage`

### 🟡 MEDIUM PRIORITY (Penting untuk kelengkapan)

5. **Live host auction management** — verifikasi & implementasikan panggilan `PATCH /api/livestreams/:id/auction` dari `LiveHostPage`
6. **Live chat in-stream** — Socket.IO chat di dalam `LiveViewerPage`/`LiveHostPage`
7. **Loyalty / Points UI Flutter** — BE sudah siap; tinggal buat halaman di Flutter
8. **Digiflazz (pulsa/token) Flutter** — BE ada; buat halaman topup digital
9. **Rating di profil seller & detail produk** — verifikasi dan tampilkan rating
10. **Shipping calculator di checkout** — pastikan `ShippingProvider` ter-integrasikan di `CheckoutPage`

### 🟢 LOW PRIORITY (Post-MVP)

11. **Follower / Following system** — perlu dibangun dari nol (BE + Flutter)
12. **Dashboard statistik seller Flutter** — halaman khusus (penjualan, visitor, konversi)
13. **Firebase FCM setup verifikasi** — pastikan `google-services.json` dan APNs dikonfigurasi benar
14. **International shipping full flow** — verifikasi alur checkout internasional end-to-end
15. **Facebook login** — unblock setelah Meta Business Verification
16. **Bersihkan kode Setorin** di `orderRoutes.js` dan `orderService.js`

---

## 21. 📁 File yang Masih Perlu Dibuat / Dilengkapi

### Flutter — Halaman baru
```
lib/pages/notification/notification_page.dart  # Daftar notifikasi in-app
lib/pages/loyalty/loyalty_page.dart            # Saldo poin & riwayat
lib/pages/loyalty/reward_page.dart             # Tukar poin dengan reward
lib/pages/profile/topup_digital_page.dart      # Pulsa/token via Digiflazz
```

### Flutter — Integrasi yang perlu ditambahkan ke file yang sudah ada
```
lib/pages/chat/chat_list_page.dart             # Ganti polling → Socket.IO real-time listener
lib/pages/chat/chat_detail_page.dart           # Socket.IO incoming messages
lib/pages/order/order_detail_page.dart         # Socket.IO listener: order:updated/completed
lib/pages/live/live_host_page.dart             # Panggil PATCH /api/livestreams/:id/auction
lib/pages/explore/explore_page.dart            # Tambahkan filter fish category
lib/widgets/modal_filter_product.dart          # Tambahkan pilihan kategori ikan
```
