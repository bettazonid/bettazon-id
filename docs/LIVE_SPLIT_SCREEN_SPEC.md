# Live Split Screen (Co-host / Battle Live) — Feature Spec

> **Status**: 📋 PLANNED — belum dimulai  
> **Priority**: P2 (setelah core flow stabil)  
> **Estimasi dev**: ~2 minggu  
> **Referensi**: TikTok Live Battle, Shopee Live Co-host

---

## 1. Konsep

Split Screen Live memungkinkan dua seller siaran secara bersamaan dalam satu layar terbagi dua (50/50), sementara buyer dapat menonton dan bid ke keduanya secara real-time. Ada dua sub-mode:

| Mode | Deskripsi |
|---|---|
| **Co-host** | Seller A mengundang Seller B untuk bergabung bersama |
| **Battle** | Seller A menantang Seller B; penonton "vote" dengan bid |

---

## 2. Alur Bisnis

```
Seller A mulai stream biasa
     │
     ├─► Tap "Undang Co-host" → pilih seller dari daftar
     │
Seller B terima notifikasi undangan
     │
     ├─► Seller B accept → kedua layar terbagi 50/50
     │
Buyer melihat 2 stream side-by-side
     │
     ├─► Bid ke seller A  →  masuk auction stream A
     ├─► Bid ke seller B  →  masuk auction stream B
     │
Salah satu seller end stream
     ├─► Layout kembali ke 1 seller (full screen)
     └─► Session berakhir jika keduanya end
```

---

## 3. Teknologi

### LiveKit (existing)
- Tidak perlu room baru — 2 publisher di 1 room sudah didukung
- `canPublish: true` untuk kedua host
- `canPublishData: true` untuk keduanya (bid packets)
- Layout split ditangani di **Flutter sisi client** via `VideoTrack` tiles

### Redis State
```js
// Tambahkan ke live_auction state yang sudah ada
`live_split:${streamId}` = {
  coHostStreamId: String,       // streamId partner
  coHostUserId: String,
  status: 'invited' | 'active' | 'ended',
  startedAt: ISO8601,
}
```

### Socket.IO Events (baru)
```
live:cohost_invite        { streamId, inviteeId, inviterName }
live:cohost_accept        { streamId, coHostUserId }
live:cohost_reject        { streamId }
live:cohost_ended         { streamId, endedBy }
```

---

## 4. Backend Changes

### Models
```js
// LiveStream.js — tambah fields
coHost: {
  user: { type: ObjectId, ref: 'User' },
  streamId: String,
  status: { type: String, enum: ['invited', 'active', 'rejected', 'ended'] },
  startedAt: Date,
  endedAt: Date,
},
splitMode: { type: Boolean, default: false },
```

### New Endpoints
| Method | Path | Auth | Deskripsi |
|---|---|---|---|
| `POST` | `/api/livestreams/:id/cohost/invite` | seller | Undang co-host |
| `POST` | `/api/livestreams/:id/cohost/accept` | seller | Terima undangan |
| `POST` | `/api/livestreams/:id/cohost/reject` | seller | Tolak undangan |
| `POST` | `/api/livestreams/:id/cohost/end` | seller | Akhiri split session |

### Services
- `liveStreamService.inviteCoHost(streamId, inviteeId)` — validasi seller aktif streaming, kirim Socket event
- `liveStreamService.acceptCoHost(streamId, coHostUserId)` — join room yang sama, update Redis state
- `liveStreamService.endCoHost(streamId, userId)` — cleanup Redis, emit `live:cohost_ended`

---

## 5. Flutter Changes

### Layout
```
LiveViewerPage — tambah state: bool isSplitMode
├── isSplitMode = false → VideoTrack full screen (behavior sekarang)
└── isSplitMode = true  → Row([
      Expanded(child: VideoTrack(hostA)),
      VerticalDivider(width: 1),
      Expanded(child: VideoTrack(hostB)),
    ])
```

### New Widget: `SplitStreamView`
```dart
lib/pages/live/widgets/split_stream_view.dart
```
- Menerima 2 `VideoTrack` + 2 `AuctionState`
- Bid buttons per sisi
- Swap sisi (optional gesture)

### LiveHostPage Changes
- Tambah "Undang Co-host" FAB button
- Terima undangan via Socket → dialog confirm
- End co-host session button

### Provider Changes  
```dart
LiveStreamProvider:
  + bool isSplitMode
  + String? coHostStreamId
  + Future<void> inviteCoHost(streamId, inviteeId, token)
  + Future<void> acceptCoHost(streamId, token)
  + Future<void> endCoHost(streamId, token)
  + void _handleCoHostEvents(Map data)  // from socket
```

---

## 6. Model Premium (Opsional)

Jika akan dimonetisasi:

| Tier | Fitur | Harga |
|---|---|---|
| Basic (semua seller) | Normal live | Gratis |
| **Pro Seller** | Split screen co-host | Rp 99.000/bulan |
| Per-session | Battle challenge | Rp 10.000/sesi |

Perlu tambahan:
- `User.sellerData.subscriptionTier: 'basic' | 'pro'`
- `User.sellerData.subscriptionExpiresAt: Date`
- Middleware: `requireProSeller` → cek tier + expiry
- BE: endpoint subscription management
- Flutter: subscription purchase flow (in-app purchase atau transfer manual)

---

## 7. Resource Impact

| Aspek | Normal | Split Screen |
|---|---|---|
| Bandwidth per viewer | ~1 Mbps | ~1.8 Mbps |
| Server egress per stream | N × 1 Mbps | N × 2 Mbps |
| Redis keys tambahan | 0 | +2 per session |
| Flutter widget complexity | Medium | High |

**Estimasi biaya tambahan**: ~2x bandwidth cost untuk sesi split active.

---

## 8. Checklist Implementasi

### Backend
- [ ] Update `LiveStream.js` model — tambah `coHost` + `splitMode` fields
- [ ] Buat `liveStreamService.inviteCoHost()`
- [ ] Buat `liveStreamService.acceptCoHost()`
- [ ] Buat `liveStreamService.endCoHost()`
- [ ] Tambah Redis state `live_split:${streamId}`
- [ ] Register 4 endpoint baru di `liveRoutes.js`
- [ ] Emit Socket events untuk invite/accept/reject/end
- [ ] Tes dengan 2 koneksi LiveKit bersamaan

### Flutter
- [ ] Buat `SplitStreamView` widget
- [ ] Update `LiveViewerPage` untuk handle split layout
- [ ] Update `LiveHostPage` — tambah invite button + accept dialog
- [ ] Update `LiveStreamProvider` — tambah co-host state & methods
- [ ] Tambah Socket listener untuk `live:cohost_invite`
- [ ] Handle bid routing (bid ke auction mana?)
- [ ] Tes end-to-end di emulator (2 device)

### Premium (jika diputuskan)
- [ ] Model `subscriptionTier` di User
- [ ] Endpoint subscription management
- [ ] Middleware `requireProSeller`
- [ ] Flutter: subscription page

---

## 9. Dependencies

- Fitur ini **tidak bisa** diimplementasi sebelum:
  - Live streaming berjalan stabil (single host mode)
  - Auction live state terbukti reliable
  - User base cukup untuk testing co-host

---

*Dibuat: 17 Maret 2026 — berdasarkan diskusi product dengan tim*
