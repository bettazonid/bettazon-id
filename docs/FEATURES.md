# ✨ Features — Bettazon.id

## Phase 1: Ecommerce Core

### For Buyers
- [ ] Browse & search fish products (filter: species, variant, size, price range, location, gender)
- [ ] Product detail with fish specs (species, variant, size, health status, DOA guarantee)
- [ ] Add to cart / wishlist
- [ ] Checkout with shipping selection
  - [ ] Domestic via courier partner (JNE YES, SiCepat HALU, dll)
  - [ ] International via transshipper Jakarta
- [ ] Payment via Midtrans Snap (VA, GoPay, QRIS, kartu kredit)
- [ ] Track order status
- [ ] Confirm received → trigger escrow release
- [ ] DOA dispute (2 jam window setelah terima)
- [ ] Rating & review produk + seller

### For Sellers
- [ ] Seller onboarding & store setup (nama toko, deskripsi, lokasi)
- [ ] KTP verification (upload)
- [ ] Create fish product listing (full spec: species, variant, size, age, health, feeding, photos, video)
- [ ] Set shipping options (domestic/international/pickup) per produk
- [ ] Manage inventory (edit, archive, delete)
- [ ] Process incoming orders (konfirmasi, upload resi)
- [ ] Wallet & withdrawal

### Platform
- [ ] FCM push notifications (order updates, chat, review requests)
- [ ] In-app chat (buyer ↔ seller per produk/order)
- [ ] Points & loyalty rewards
- [ ] Digital rewards via Digiflazz (pulsa/data top-up)
- [ ] Indonesian region selector (province → kota → kecamatan)

---

## Phase 2: Auction System

### Page Auction
- [ ] Seller dapat menandai produk sebagai "Lelang"
- [ ] Set: harga awal, minimum kenaikan bid, waktu mulai & selesai, harga beli langsung (optional)
- [ ] Halaman lelang dengan countdown timer real-time
- [ ] Chat di halaman lelang (buyer bisa tanya seller, disimpan ke DB)
- [ ] Bid real-time via Socket.IO
- [ ] Auto-extend 5 menit jika ada bid di last 5 menit (max 3x)
- [ ] Notifikasi FCM: "Kamu tertinggi!", "Kamu dilampaui!", "Lelang selesai - kamu menang!"
- [ ] Auto-create order untuk pemenang

### Live Auction
- [ ] Seller bisa start lelang saat sedang live streaming
- [ ] Auction overlay muncul di semua viewer real-time
- [ ] Bid via tap di layar live
- [ ] Timer countdown di overlay video
- [ ] Auto-create order untuk pemenang setelah live selesai

---

## Phase 2: Live Streaming

- [ ] Seller bisa go live (self-hosted LiveKit)
- [ ] Live discovery page (daftar live aktif + jadwal)
- [ ] Live room: watch video stream
- [ ] Live chat overlay (real-time, ephemeral, tidak disimpan DB)
- [ ] Viewer count real-time
- [ ] Seller bisa showcase produk saat live (featured products)
- [ ] Seller bisa start auction saat live
- [ ] FCM notifikasi ke followers: "[Seller] sedang live sekarang!"
- [ ] Replay recording (tersimpan di DO Spaces)

---

## Phase 3: Advanced Features

- [ ] Seller analytics (GMV, views, conversion rate)
- [ ] Followers / following seller
- [ ] Flash sale (harga diskon terbatas waktu)
- [ ] Pre-order (deposit untuk ikan yang belum siap kirim)
- [ ] Admin panel: moderasi produk, manajemen user, dispute resolution
- [ ] International shipping tracking integration
- [ ] Seller badge/verification tier

---

## Existing Features (dari teman, sudah ada di bettazon-id-app)

- [x] Login, register, forgot password
- [x] Home page
- [x] Explore products
- [x] Search
- [x] Product detail
- [x] Cart
- [x] Checkout (WIP)
- [x] Order list
- [x] Profile & address management
