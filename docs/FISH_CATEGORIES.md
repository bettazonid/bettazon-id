# 🐟 Fish Categories — Bettazon.id

## Kategori Utama

| Code | Nama | Contoh Jenis |
|---|---|---|
| `betta` | Ikan Cupang | HM, CT, Plakat, DTHM, Wild Betta |
| `koi` | Koi | Kohaku, Taisho Sanke, Showa |
| `arwana` | Arwana | Super Red, Jardini, Silver, Black |
| `guppy` | Guppy | Mosaic, Moscow Blue, Dumbo |
| `discus` | Discus | Red Melon, Pigeon Blood, Checkerboard |
| `louhan` | Louhan | SRD, Golden Monkey, Zhen Zhu |
| `koki` | Koki | Oranda, Ryukin, Telescope |
| `platy` | Platy & Variasi | Sunset, Mickey Mouse, Tuxedo |
| `molly` | Molly | Black Molly, Balloon Molly |
| `oscar` | Oscar | Red Oscar, Tiger Oscar |
| `cichlid` | Cichlid | Frontosa, Altum Angelfish |
| `corydoras` | Corydoras | Sterbai, Panda, Adolfoi |
| `tetra` | Tetra | Cardinal, Neon, Black Phantom |
| `rasbora` | Rasbora | Harlequin, Lambchop |
| `lele_hias` | Lele Hias | Synodontis, Panda Cory |
| `puffer` | Puffer | Dwarf Puffer, Figure Eight |
| `plant` | Tanaman Air | Anubias, Bucephalandra, Java Moss |
| `invertebrate` | Invertebrata | Red Cherry Shrimp, Nerite Snail |
| `other` | Lainnya | — |

---

## Sub-Kategori Cupang (Betta) — Paling Populer di Indonesia

| Code | Variant |
|---|---|
| `betta_hm` | Halfmoon |
| `betta_ct` | Crowntail |
| `betta_pk` | Plakat |
| `betta_dthm` | Double Tail Halfmoon |
| `betta_vt` | Veiltail |
| `betta_dumbo` | Dumbo Ear (Elephant Ear) |
| `betta_giant` | Giant Betta |
| `betta_wild` | Wild / Alam (Imbellis, Splendens, Mahachai, dll) |
| `betta_fancy` | Fancy / Nemo Pattern |

---

## Atribut Fish-Specific per Kategori

### Semua Ikan
```javascript
fishData: {
  species: String,           // nama ilmiah (e.g. "Betta splendens")
  variant: String,           // e.g. "Halfmoon", "Super Red"
  size_cm: Number,           // panjang tubuh
  age_months: Number,        // usia estimasi
  gender: enum ['male', 'female', 'pair', 'group', 'unknown'],
  healthStatus: enum ['healthy', 'quarantine', 'treatment'],
  guaranteeDOA: Boolean,     // apakah seller memberi garansi DOA
  feedType: [String],        // e.g. ['pellet', 'bloodworm', 'artemia']
  originCountry: String,     // negara asal breed
}
```

### Arwana (tambahan)
```javascript
arwanaData: {
  grade: enum ['A', 'B', 'C'],
  scaleColor: String,         // e.g. "Super Red Grade A"
  citesCertNumber: String,    // wajib untuk perdagangan legal
  microchipNumber: String,    // beberapa arwana punya microchip
}
```

### Koi (tambahan)
```javascript
koiData: {
  type: enum ['kohaku', 'sanke', 'showa', 'tancho', 'butterfly', 'other'],
  bodyLength_cm: Number,
  bodyPattern: String,
}
```

---

## Shipping Restrictions per Category

| Kategori | Max Duration (Domestic) | Int'l Allowed | CITES Required |
|---|---|---|---|
| Betta | 48 jam | ✅ | ❌ |
| Guppy, Platy, Molly | 48 jam | ✅ | ❌ |
| Koi (< 20cm) | 24 jam | ✅ | ❌ |
| Koi (> 20cm) | Cargo udara | Cargo only | ❌ |
| Discus | 36 jam | ✅ | ❌ |
| Arwana (Silver, Jardini) | Cargo udara | ✅ | ❌ |
| **Arwana Asia (Super Red)** | Cargo udara | **Restriksi** | **✅ CITES App. I** |
| Invertebrata/Udang | 24 jam | ✅ | ❌ |
| Tanaman Air | 72 jam | ✅ | ❌ (umumnya) |
