![alt text](image.png)# 🎵 Live Ambience Music — Bettazon.id Spec

> Fitur background music lokal yang diputar di sisi client (seller & viewer) selama live streaming.
> Music **tidak** dikirim lewat LiveKit stream — sepenuhnya local playback yang disinkronkan via metadata live.

---

## Arsitektur Singkat

```
SELLER SIDE                          VIEWER SIDE
─────────────────────                ─────────────────────────────
1. Pilih track dari catalog    →     4. Fetch live metadata
2. Preview lokal (just_audio)        5. Dapat: musicId + enabled flag
3. Confirm → BE simpan ke DB   →     6. Download / play track lokal
                                     7. Fade-in 1-2 detik
                                     8. Volume default 20% (background)
                                     9. Kontrol volume mandiri (tidak sync)

SYNC EVENT (saat seller ganti lagu):
BE broadcast metadata update → Viewer re-fetch & switch track
```

**Tidak ada audio yang lewat LiveKit.** LiveKit hanya membawa suara mic seller seperti biasa. Music adalah layer terpisah di Flutter audio engine.

---

## Komponen & Status Pengerjaan

### 1. 🗄️ Backend — Music Catalog & Live Metadata

| Task | Detail | Estimasi | Status |
|------|--------|----------|--------|
| Model `MusicTrack` | `_id`, `title`, `artist`, `category`, `fileUrl` (DO Spaces), `coverUrl`, `durationSec`, `isEnabled`, `order` | 2 jam | ⬜ Belum |
| Migration / seeder | Seed 8–10 track royalty-free awal ke MongoDB | 1 jam | ⬜ Belum |
| `GET /api/music/catalog` | Public endpoint — list semua track `isEnabled: true`, no auth | 1 jam | ⬜ Belum |
| `PATCH /api/live/:id/music` | Seller update `musicId` + `musicEnabled` di dokumen live session | 1 jam | ⬜ Belum |
| `GET /api/live/:id` (extend) | Tambahkan field `musicId` + `musicEnabled` ke response yang sudah ada | 0.5 jam | ⬜ Belum |
| Admin CRUD endpoints | `POST/PATCH/DELETE /api/admin/music` + upload ke DO Spaces | 3 jam | ⬜ Belum |
| **Total BE** | | **~8.5 jam** | |

---

### 2. 🎛️ Admin Panel — Music Catalog Manager (Next.js)

| Task | Detail | Estimasi | Status |
|------|--------|----------|--------|
| Halaman `/admin/music` | List semua track: judul, artis, kategori, durasi, status enabled | 2 jam | ⬜ Belum |
| Form upload track | Input: judul, artis, kategori, upload MP3 (ke DO Spaces), cover image, toggle enabled | 3 jam | ⬜ Belum |
| Enable/disable toggle | `PATCH /api/admin/music/:id` — nonaktifkan tanpa hapus | 1 jam | ⬜ Belum |
| Sidebar menu | Tambah `🎵 Music Catalog` di `AdminSidebar.jsx` | 0.25 jam | ⬜ Belum |
| **Total Admin** | | **~6.25 jam** | |

---

### 3. 📱 Flutter — Seller Side (Live Setup & Host Page)

#### 3a. Live Setup Page — Sebelum Mulai Live

| Task | Detail | Estimasi | Status |
|------|--------|----------|--------|
| Fetch catalog saat buka setup | `GET /api/music/catalog` dipanggil di `initState` | 0.5 jam | ⬜ Belum |
| Card UI `AmbienceMusicCard` | Widget baru: toggle ON/OFF + list pilihan track + volume slider | 3 jam | ⬜ Belum |
| Preview playback | Tap track → preview dengan `just_audio`, stop preview jika pilih lain | 2 jam | ⬜ Belum |
| Confirm selection | Pilihan hanya tersimpan lokal di state setup — belum ke BE | 0.5 jam | ⬜ Belum |
| Pass selection ke Host Page | Kirim `selectedMusicId` + `musicEnabled` + `musicVolume` sebagai parameter ke `LiveHostPage` | 0.5 jam | ⬜ Belum |

#### 3b. Live Host Page — Saat Sedang Live

| Task | Detail | Estimasi | Status |
|------|--------|----------|--------|
| Install `just_audio` | Tambah ke `pubspec.yaml` | 0.25 jam | ⬜ Belum |
| `AudioPlayer` lifecycle | Init di `initState`, dispose di `dispose`, pause saat mic mute jika diinginkan | 1 jam | ⬜ Belum |
| Auto-play saat stream start | Saat `_startStream()` sukses → play track, fade-in 1.5 detik | 1 jam | ⬜ Belum |
| Sync ke BE saat mulai live | `PATCH /api/live/:id/music` dengan `musicId` + `musicEnabled` | 0.5 jam | ⬜ Belum |
| Draggable music control icon | Icon `🎵` draggable (sama polanya dengan chat/auction icon) → buka bottom sheet ganti track + volume | 2 jam | ⬜ Belum |
| Ganti track saat live | Pilih track baru → stop lama, play baru (fade cross), PATCH BE → viewer akan sync | 1 jam | ⬜ Belum |
| Stop saat stream berakhir | `_endStream()` → dispose audio player | 0.25 jam | ⬜ Belum |
| **Total Flutter Seller** | | **~12.5 jam** | |

---

### 4. 📱 Flutter — Viewer Side (Live Viewer Page)

| Task | Detail | Estimasi | Status |
|------|--------|----------|--------|
| Fetch music dari live metadata | Saat `fetchLiveStream` → cek `musicId` + `musicEnabled` | 0.5 jam | ⬜ Belum |
| Download / cache track | `just_audio` support URL streaming langsung dari DO Spaces — tidak perlu unduh manual | 0.5 jam | ⬜ Belum |
| Fade-in saat join | Volume mulai dari 0 → target (default 0.20) dalam 1.5 detik | 1 jam | ⬜ Belum |
| Volume default 20% | Music sebagai background, tidak override suara seller dari LiveKit | 0.25 jam | ⬜ Belum |
| Viewer volume control | Tombol `🔊 Ambience` → bottom sheet slider volume (0–100%) — hanya lokal, tidak sync ke seller | 1.5 jam | ⬜ Belum |
| Sync saat seller ganti track | Poll atau WebSocket event `live.music_changed` → viewer switch track + fade-in | 2 jam | ⬜ Belum |
| Pause saat viewer background | `AppLifecycleObserver` → pause music jika app di-background | 0.5 jam | ⬜ Belum |
| Stop saat live berakhir | Event `live_ended` → stop + dispose audio | 0.25 jam | ⬜ Belum |
| **Total Flutter Viewer** | | **~6.5 jam** | |

---

### 5. 🎵 Content — Royalty-Free Music Pack

| Task | Detail | Estimasi | Status |
|------|--------|----------|--------|
| Kurasi 10 track awal | Pilih dari Pixabay Music / Musopen / ccMixter — semua CC0 atau CC-BY | 2 jam | ⬜ Belum |
| Upload ke DO Spaces | Folder `music/ambience/` di bucket yang sama | 0.5 jam | ⬜ Belum |
| Verifikasi lisensi | Simpan bukti lisensi tiap track di dokumen internal | 1 jam | ⬜ Belum |
| **Total Content** | | **~3.5 jam** | |

---

## Ringkasan Total

| Area | Estimasi | Status |
|------|----------|--------|
| Backend (Node.js) | ~8.5 jam | ⬜ Belum |
| Admin Panel (Next.js) | ~6.25 jam | ⬜ Belum |
| Flutter — Seller | ~12.5 jam | ⬜ Belum |
| Flutter — Viewer | ~6.5 jam | ⬜ Belum |
| Content kurasi | ~3.5 jam | ⬜ Belum |
| **TOTAL** | **~37.25 jam** | **⬜ Belum Dimulai** |

> Estimasi untuk 1 developer fokus. Bisa paralel antara BE + Flutter jika 2 developer.

---

## Track Catalog Awal (Usulan)

| # | Judul | Kategori | Sumber | Lisensi |
|---|-------|----------|--------|---------|
| 1 | Ocean Chill | Nature | Pixabay Music | CC0 |
| 2 | Nature Water | Nature | Pixabay Music | CC0 |
| 3 | LoFi Aqua | LoFi | Pixabay Music | CC0 |
| 4 | Relax Instrumental | Instrumental | Pixabay Music | CC0 |
| 5 | Tropical Morning | Nature | Musopen | CC0 |
| 6 | Soft Rain | Nature | ccMixter | CC-BY |
| 7 | Aquarium Ambience | Ambient | Pixabay Music | CC0 |
| 8 | Peaceful Garden | Instrumental | Pixabay Music | CC0 |

> ⚠️ Verifikasi ulang lisensi sebelum upload. CC0 = bebas komersial tanpa atribusi. CC-BY = wajib cantumkan nama artis (bisa di About/Credit page).

---

## Data Model

```javascript
// MongoDB: MusicTrack
{
  _id: ObjectId,
  title: String,          // "Ocean Chill"
  artist: String,         // "Pixabay Music"
  category: String,       // "nature" | "lofi" | "instrumental" | "ambient"
  fileUrl: String,        // "https://spaces.bettazon.id/music/ambience/ocean-chill.mp3"
  coverUrl: String,       // optional thumbnail
  durationSec: Number,    // 180
  isEnabled: Boolean,     // admin toggle
  licenseType: String,    // "CC0" | "CC-BY" | "royalty-free"
  licenseSource: String,  // "Pixabay Music"
  order: Number,          // urutan tampil di UI
  createdAt: Date,
  updatedAt: Date,
}

// LiveStream model — tambahkan field:
{
  // ... existing fields ...
  ambienceMusic: {
    musicId: { type: ObjectId, ref: 'MusicTrack', default: null },
    isEnabled: { type: Boolean, default: false },
  }
}
```

---

## API Endpoints Baru

```
PUBLIC
GET  /api/music/catalog            → list track enabled (no auth)

SELLER (auth required)
PATCH /api/live/:id/music          → { musicId, musicEnabled }

ADMIN (auth + admin role)
GET    /api/admin/music            → list semua track (include disabled)
POST   /api/admin/music            → upload track baru (multipart: mp3 + cover)
PATCH  /api/admin/music/:id        → update metadata / toggle enabled
DELETE /api/admin/music/:id        → hapus track
```

---

## Flutter Dependencies Tambahan

```yaml
# pubspec.yaml — tambahkan:
dependencies:
  just_audio: ^0.9.40          # audio playback lokal
  # just_audio sudah support streaming URL langsung dari DO Spaces
  # Tidak perlu flutter_ffmpeg atau audio mixing native
```

---

## Catatan Keamanan & Lisensi

- ❌ Seller dilarang upload MP3 sendiri (copyright, malware, storage abuse)
- ✅ Hanya track dari curated catalog yang bisa dipilih
- ✅ Semua track wajib CC0 atau CC-BY (royalty-free komersial)
- ✅ Simpan bukti lisensi di folder `docs/music-licenses/`
- ⚠️ Jika di masa depan ingin lagu populer → butuh lisensi performing rights (DMCA, LMRA, dll) → sangat mahal, tunda dulu
- Tambahkan disclaimer di UI: *"Musik yang tersedia telah dilisensikan untuk penggunaan komersial di platform Bettazon.id"*

---

## UX Notes

### Seller
- Toggle OFF → music tidak diputar di sisi seller maupun viewer
- Preview: play 15 detik pertama, bukan full track — hemat data
- Volume seller default: **30%** (seller mendengar musik sebagai monitor)
- Music **tidak masuk ke mic LiveKit** — dua layer terpisah

### Viewer
- Fade-in: 0% → 20% dalam 1.5 detik setelah join
- Volume default viewer: **20%** (background)
- Slider viewer: 0–100% — hanya lokal, tidak broadcast
- Jika seller disable music mid-live → viewer musik fade-out 1 detik → stop
- Jika tidak ada internet untuk stream MP3 → graceful fallback: sembunyikan kontrol musik, tidak error
