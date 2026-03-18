# 🛠️ Bettazon.id – Admin Panel Plan

## Rekomendasi: Web-Based Admin Panel (Next.js)

### Mengapa Web, Bukan Mobile?

| Aspek | Web (Next.js) | Mobile (Flutter) |
|---|---|---|
| Data table & bulk action | ✅ Ideal | ❌ Sempit |
| Dashboard chart/grafik | ✅ Leluasa | ⚠️ Terbatas |
| Approve withdrawal 1-per-1 | ✅ Mudah | ⚠️ Bisa tapi kurang nyaman |
| Tidak perlu rilis ke Play Store | ✅ | ❌ Harus build ulang |
| Akses internal / private URL | ✅ Mudah dikontrol | ❌ App bisa di-reverse |
| Sudah ada repo Next.js (`bettazon-id`) | ✅ Tinggal tambah route `/admin` | — |

### URL Strategy
- **Opsi A** *(Recommended)*: `bettazon.id/admin` — di balik auth, tidak diindex Google (robots.txt)
- **Opsi B**: `admin.bettazon.id` — subdomain terpisah, lebih isolasi
- **Proteksi tambahan**: IP whitelist di Nginx, atau basic HTTP auth di level server

---

## Kondisi Saat Ini (Already Built di BE)

### ✅ Admin Routes yang Sudah Ada (`adminRoutes.js`)
| Endpoint | Fungsi |
|---|---|
| `GET /api/admin/dashboard/overview` | Statistik overview |
| `GET /api/admin/system/health` | System health check |
| `GET /api/admin/transactions` | Semua transaksi + filter |
| `GET /api/admin/transactions/export` | Export CSV/JSON |
| `GET /api/admin/products` | Produk + fee status |
| `GET /api/admin/products/statistics` | Statistik produk |
| `GET /api/admin/wallets/statistics` | Statistik wallet |
| `GET /api/admin/revenue/report` | Laporan revenue (day/week/month) |
| `GET /api/admin/revenue/export` | Export revenue |
| `GET /api/admin/cron-jobs` | Status cron jobs |
| `POST /api/admin/cron-jobs/:name/trigger` | Manual trigger cron job |

### ✅ Withdrawal Admin Routes (`withdrawalRoutes.js`)
| Endpoint | Fungsi |
|---|---|
| `GET /api/withdrawals/admin/all` | Semua request penarikan |
| `GET /api/withdrawals/admin/stats` | Statistik withdrawal |
| `GET /api/withdrawals/admin/:id` | Detail satu withdrawal |
| `POST /api/withdrawals/admin/:id/approve` | Approve withdrawal |
| `POST /api/withdrawals/admin/:id/manual-approve` | Manual approve (transfer bank) |
| `POST /api/withdrawals/admin/:id/reject` | Reject withdrawal |

### ❌ Admin Routes yang Masih Perlu Dibuat di BE
- User management (list, ban, ubah role)
- Product moderation (approve/reject/takedown)
- Order dispute resolution
- Seller verification review
- Broadcast notification
- **Chat admin↔user** (lihat semua chat, join sebagai admin, kirim pesan)
- **Chat seller↔buyer** (monitoring, intervensi jika ada dispute)

---

## Tech Stack Admin Panel

```
bettazon-id/ (repo Next.js yang sudah ada)
  app/
    admin/              ← NEW: semua halaman admin di sini
      layout.js         ← sidebar + auth guard
      page.jsx          ← redirect ke /admin/dashboard
      login/
        page.jsx        ← form login admin (terpisah dari user login)
      dashboard/
        page.jsx        ← overview, stats, revenue chart
      withdrawals/
        page.jsx        ← list semua withdrawal request
        [id]/page.jsx   ← detail + approve/reject action
      products/
        page.jsx        ← list produk + moderasi
      orders/
        page.jsx        ← list semua order
        [id]/page.jsx   ← detail order + dispute
      users/
        page.jsx        ← list user + ban/role management
      cron-jobs/
        page.jsx        ← status & manual trigger
      transactions/
        page.jsx        ← semua transaksi wallet
      chat/
        page.jsx        ← inbox: semua thread chat (admin↔user)
        [chatId]/
          page.jsx      ← detail chat, real-time messages via Socket.IO
      support/
        page.jsx        ← monitoring chat seller↔buyer (read-only + intervensi)
```

**Dependencies yang dibutuhkan:**
- `recharts` atau `chart.js` — grafik revenue & statistik
- `@tanstack/react-table` — data table dengan sorting/filter/pagination
- `js-cookie` atau `localStorage` — simpan admin JWT token
- `socket.io-client` — real-time chat di admin panel
- Tailwind CSS (sudah ada di repo)

---

## Rundown Implementasi

### 🔴 Phase 1 — Foundation & Auth (Estimasi: 1–2 hari)
**Tujuan**: Admin bisa login dan lihat halaman

**BE:**
1. Tambah route `POST /api/admin/auth/login` — login khusus admin (cek `currentRole === 'admin'`)
2. Pastikan user dengan role `admin` bisa di-set via script/seed

**Frontend (Next.js):**
1. Buat `app/admin/layout.js` — layout dengan sidebar navigasi + auth guard (redirect ke `/admin/login` jika belum login)
2. Buat `app/admin/login/page.jsx` — form login, simpan JWT ke cookie `admin_token`
3. Buat `lib/adminApi.js` — helper fetch dengan `Authorization: Bearer <admin_token>`
4. Buat `app/admin/page.jsx` — redirect ke `/admin/dashboard`
5. Komponen sidebar dengan menu: Dashboard, Penarikan, Produk, Pesanan, Pengguna, Transaksi, Cron Jobs

---

### 🟠 Phase 2 — Dashboard & Withdrawal Management (Estimasi: 2–3 hari)
**Tujuan**: Fitur paling critical — proses penarikan dana seller

**Frontend:**
1. `app/admin/dashboard/page.jsx`
   - Card stats: total user, total seller, total order, total revenue
   - Grafik revenue (line chart, filter by day/week/month)
   - Card: withdrawal pending count, escrow held total
   - Quick link ke halaman withdrawal

2. `app/admin/withdrawals/page.jsx`
   - Tabel: withdrawal number, seller, jumlah, bank, status, tanggal request
   - Filter: status (pending/processing/completed/rejected), tanggal
   - Tombol batch: approve selected, reject selected
   - Badge warna per status

3. `app/admin/withdrawals/[id]/page.jsx`
   - Detail lengkap: info seller, bank detail, jumlah, riwayat status
   - Form approve: input `adminNotes`, tombol "Approve & Transfer"
   - Form reject: input `rejectionReason`, tombol "Reject"
   - Konfirmasi dialog sebelum action

**BE (baru):**
- Pastikan response `POST /admin/:id/manual-approve` mengurangi `heldBalance` dan set status ke `completed`
- Kirim notifikasi ke seller saat withdrawal diproses

---

### 🟡 Phase 3 — Product & Order Management (Estimasi: 2–3 hari)
**Tujuan**: Admin bisa moderasi produk dan resolve dispute order

**Frontend:**
1. `app/admin/products/page.jsx`
   - Tabel: gambar, nama, seller, harga, status, tanggal upload
   - Filter: status (active/draft/deleted), auctionType, tanggal
   - Action per row: takedown (set status `deleted`), view detail

2. `app/admin/orders/page.jsx`
   - Tabel: order number, buyer, seller, total, status, orderType, tanggal
   - Filter: status, orderType (direct_buy/auction_win/live_purchase)
   - Action: lihat detail, resolve dispute → force complete / force cancel + refund

**BE (baru):**
- `PATCH /api/admin/products/:id/status` — ubah status produk
- `POST /api/admin/orders/:id/resolve` — resolve dispute (complete/refund)
- `GET /api/admin/orders` — list semua order dengan filter

---

### 🟢 Phase 4 — User Management (Estimasi: 1–2 hari)
**Tujuan**: Admin bisa kelola user, verifikasi seller, ban user

**Frontend:**
1. `app/admin/users/page.jsx`
   - Tabel: nama, email, role, status, tanggal daftar, last login
   - Filter: role, status (active/banned)
   - Action: lihat detail, ban/unban, ubah role

2. Detail user: riwayat order, wallet balance, produk yang dimiliki

**BE (baru):**
- `GET /api/admin/users` — list semua user
- `GET /api/admin/users/:id` — detail user
- `PATCH /api/admin/users/:id/ban` — ban/unban user
- `PATCH /api/admin/users/:id/role` — ubah role
- `GET /api/admin/users/:id/orders` — order history user

---

### 🔵 Phase 5 — Transactions, Cron & Notifications (Estimasi: 1–2 hari)
**Tujuan**: Visibilitas finansial dan kontrol sistem

**Frontend:**
1. `app/admin/transactions/page.jsx`
   - Tabel semua wallet transactions: user, type, amount, status, tanggal
   - Filter lengkap + export CSV
   - Summary cards: total topup hari ini, total withdrawal pending

2. `app/admin/cron-jobs/page.jsx`
   - List semua cron jobs, status (running/idle), last run, next run
   - Tombol "Trigger Now" per job

3. `app/admin/notifications/page.jsx` *(opsional)*
   - Form broadcast notifikasi ke semua user / semua seller

---

### 💬 Phase 6 — Chat System (Estimasi: 3–4 hari)
**Tujuan**: Komunikasi langsung admin↔user dan monitoring chat seller↔buyer

#### 6A. Admin ↔ User/Seller Chat

**Konteks penggunaan:**
- Buyer komplain ke admin soal pesanan
- Seller tanya soal withdrawal yang lama diproses
- Admin menghubungi user soal produk bermasalah

**BE (baru — `chatRoutes.js` tambahan):**
```
GET  /api/admin/chat                    → List semua thread chat yang melibatkan admin
GET  /api/admin/chat/unread-count       → Jumlah pesan belum dibaca oleh admin
POST /api/admin/chat/start/:userId      → Admin mulai thread baru ke user tertentu
GET  /api/admin/chat/:chatId/messages   → Ambil pesan dalam thread
POST /api/admin/chat/:chatId/message    → Admin kirim pesan (reuse sendMessage dengan flag isAdmin)
```

> **Catatan**: Chat route yang ada sudah support `POST /api/chat` (buat chat baru) dan `POST /api/chat/message` (kirim pesan). Cukup tambahkan query filter `participants: admin` untuk list chat admin.

**Socket.IO events (reuse existing websocket.js):**
```
chat:new_message          → admin terima pesan baru real-time
chat:admin_joined         → user notif bahwa admin bergabung ke thread
chat:typing               → indikator mengetik
```

**Frontend Admin Panel:**
1. `app/admin/chat/page.jsx` — Inbox admin
   - List thread chat dengan badge unread
   - Filter: semua / belum dibalas / dari seller / dari buyer
   - Search by nama user
   - Klik thread → buka detail chat

2. `app/admin/chat/[chatId]/page.jsx` — Detail thread
   - Bubble chat real-time (Socket.IO client)
   - Info user di sidebar kanan: nama, role, email, link ke profil user
   - Input kirim pesan + upload gambar (reuse `/api/chat/upload`)
   - Tombol "Tandai Selesai" → close thread

**Flutter (seller/buyer side — fitur baru di mobile app):**
```
lib/pages/chat/
  chat_list_page.dart       ← list semua thread chat user
  chat_detail_page.dart     ← detail thread, real-time via Socket.IO
lib/data/api/chat/
  chat_api.dart             ← createChat, sendMessage, getMessages, markRead
lib/provider/
  chat_provider.dart        ← state management chat list + active thread
```
- Socket.IO di Flutter via package `socket_io_client`
- Notifikasi pesan baru via FCM (sudah ada di BE)
- Entry point: icon chat 💬 di AppBar profil atau halaman order detail ("Hubungi Admin")

---

#### 6B. Admin Monitoring Chat Seller ↔ Buyer

**Konteks penggunaan:**
- Admin lihat percakapan seller↔buyer saat ada dispute order
- Admin intervensi jika ada fraud / konten bermasalah
- Admin bisa kirim pesan ke thread (mode mediator)

**BE (baru):**
```
GET  /api/admin/support/chats                    → List semua chat seller↔buyer
GET  /api/admin/support/chats?orderId=xxx        → Filter chat berdasarkan order
GET  /api/admin/support/chats/:chatId/messages   → Lihat semua pesan dalam thread
POST /api/admin/support/chats/:chatId/intervene  → Admin join thread sebagai mediator
PATCH /api/admin/support/chats/:chatId/flag      → Flag chat untuk review lebih lanjut
```

**Frontend Admin Panel:**
1. `app/admin/support/page.jsx` — Monitor chat seller↔buyer
   - Tabel: participants (seller & buyer), order terkait, total pesan, last message, status
   - Filter: flagged / active / all
   - Tombol "Lihat" → buka thread dalam mode read-only
   - Tombol "Intervensi" → admin masuk ke thread sebagai mediator

2. View thread di `/admin/support/[chatId]`
   - Tampilkan semua pesan dengan label siapa pengirimnya
   - Admin bisa kirim pesan sebagai mediator (diberi label "Admin Bettazon")
   - Tombol "Flag" untuk tandai percakapan mencurigakan

---

#### 6C. Chat Seller ↔ Buyer (Mobile App — Pengembangan Lanjutan)

**Scope** *(terpisah dari admin panel, dikerjakan setelah Phase 6A selesai)*:

| Fitur | Status |
|---|---|
| User bisa mulai chat dari halaman detail produk | ❌ Belum |
| User bisa chat dari halaman order detail | ❌ Belum |
| List semua thread chat di profil/menu | ❌ Belum |
| Real-time message via Socket.IO | ❌ Belum |
| Notifikasi pesan baru via FCM | ✅ BE sudah support |
| Upload gambar dalam chat | ✅ BE sudah support (`/api/chat/upload`) |
| Indikator "sedang mengetik" | ✅ BE sudah support (Socket.IO event `chat:typing`) |
| Mark as read | ✅ BE sudah support (`PUT /api/chat/:chatId/read`) |

> **BE chat sudah hampir lengkap** — `chatRoutes.js` sudah ada `createChat`, `sendMessage`, `getMessages`, `markRead`, `unreadCount`, upload attachment. Tinggal implement di Flutter.

**Entry points di Flutter yang direncanakan:**
- Tombol 💬 di `DetailProductPage` → mulai chat dengan seller
- Tombol 💬 di `OrderDetailPage` → chat terkait order (seller atau admin)
- Icon chat di AppBar → buka `ChatListPage`
- Bottom sheet "Hubungi Admin" di halaman komplain

---

## Estimasi Total Waktu

| Phase | Konten | Estimasi |
|---|---|---|
| Phase 1 | Auth + Layout + Foundation | 1–2 hari |
| Phase 2 | Dashboard + Withdrawal | 2–3 hari |
| Phase 3 | Product + Order | 2–3 hari |
| Phase 4 | User Management | 1–2 hari |
| Phase 5 | Transactions + Cron + Notif | 1–2 hari |
| Phase 6A | Chat Admin↔User (web + mobile) | 2–3 hari |
| Phase 6B | Monitor Chat Seller↔Buyer | 1–2 hari |
| Phase 6C | Chat Seller↔Buyer di Flutter | 2–3 hari |
| **Total** | | **12–20 hari kerja** |

---

## Urutan Prioritas (What to Build First)

```
1. Login admin          → tanpa ini tidak bisa apa-apa
2. Dashboard overview   → langsung ada value, lihat kondisi bisnis
3. Withdrawal approve   → PALING CRITICAL: seller sudah bisa request, admin harus bisa approve
4. Product moderation   → cegah konten bermasalah
5. Order dispute        → handle komplain buyer/seller
6. User management      → ban user bermasalah
7. Chat admin↔user      → support channel langsung
8. Monitor seller↔buyer → intervensi dispute via chat
9. Chat seller↔buyer (Flutter) → fitur marketplace lengkap
10. Transactions view   → audit trail keuangan
11. Cron jobs           → monitoring sistem
```

---

## Security Checklist

- [ ] JWT admin token expires 4 jam (lebih pendek dari user token)
- [ ] Semua admin API route wajib `authorize("admin")`
- [ ] Tambah `robots.txt` block untuk `/admin/*`
- [ ] Rate limiting ketat di `/admin/*` (10 req/menit)
- [ ] Log semua admin action ke collection `AdminLogs`
- [ ] Nginx: opsional IP whitelist untuk `/admin` path
- [ ] HTTPS only (sudah via existing SSL)
- [ ] Chat rate limit: max 30 pesan/menit per user (cegah spam)
- [ ] Admin chat audit log: semua pesan admin disimpan permanen (tidak kena retention delete)
- [ ] File upload di chat: validasi MIME type (image only) + size limit 5MB
- [ ] Seller↔Buyer chat: auto-archive setelah order `completed` / `cancelled`

---

## Cara Mulai (Quick Start)

```bash
# 1. Masuk ke repo Next.js
cd d:\Soemanto\bettazon-id

# 2. Install dependencies tambahan
npm install recharts @tanstack/react-table js-cookie socket.io-client

# 3. Buat admin user di BE (via script)
# Set user.roles += { role: 'admin', isActive: true }
# Set user.currentRole = 'admin'

# 4. Test login admin
POST https://api.bettazon.id/api/auth/login
{ "email": "admin@bettazon.id", "password": "...", "role": "admin" }
```
