import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

// ─── HERO ────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-orange-50 min-h-screen flex items-center pt-16">
      {/* Decorative blobs */}
      <div className="absolute top-20 -left-24 w-96 h-96 bg-[#FE735C]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-24 w-96 h-96 bg-[#008080]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 w-full">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#FE735C]/10 border border-[#FE735C]/20 text-[#FE735C] px-4 py-2 rounded-full text-sm font-semibold mb-8">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
            Marketplace Ikan Hias #1 di Indonesia
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
            Jual & Beli{' '}
            <span className="text-[#FE735C]">Ikan Hias</span>
            <br />
            <span className="text-[#008080]">Kapan Saja</span>
            {', '}
            Dimana Saja
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-600 leading-relaxed mb-10 max-w-2xl mx-auto">
            Temukan ribuan jenis ikan hias dari penjual terpercaya. Ikuti lelang live, saksikan
            ikan secara langsung lewat streaming, dan nikmati pengiriman aman ke seluruh Indonesia.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <a
              href="#unduh"
              className="inline-flex items-center gap-3 bg-[#FE735C] hover:bg-[#e5634d] text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:shadow-2xl hover:shadow-[#FE735C]/30 hover:-translate-y-0.5"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.18 23.76c.29.16.64.19.96.09l11.84-6.52-2.59-2.59-10.21 9.02zM.19 1.73C.07 2.01 0 2.33 0 2.68v18.64c0 .35.07.67.19.95l.1.09 10.45-10.45v-.25L.29 1.64l-.1.09zM19.37 10.43l-2.89-1.59-2.91 2.91 2.91 2.91 2.9-1.6c.83-.46.83-1.21-.01-1.63zM4.14.24L16 6.76l-2.59 2.59L3.18.24A.87.87 0 014.14.24z" />
              </svg>
              Download di Play Store
            </a>
            <a
              href="#fitur"
              className="inline-flex items-center gap-2 text-[#008080] hover:text-[#006666] font-semibold text-lg transition-colors group"
            >
              Lihat Semua Fitur
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { number: '10.000+', label: 'Pengguna Aktif' },
              { number: '5.000+', label: 'Produk Tersedia' },
              { number: '1.000+', label: 'Penjual Terdaftar' },
              { number: '99%', label: 'Transaksi Sukses' },
            ].map(({ number, label }) => (
              <div
                key={label}
                className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-sm border border-gray-100"
              >
                <div className="text-2xl sm:text-3xl font-bold text-[#FE735C]">{number}</div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── FEATURES ────────────────────────────────────────────────────────────────
const FeatureIcon = ({ id }) => {
  const icons = {
    buy: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
    auction: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    live: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
    shipping: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    wallet: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12V7H5a2 2 0 010-4h14v4" />
        <path d="M3 5v14a2 2 0 002 2h16v-5" />
        <path d="M18 12a2 2 0 000 4h4v-4z" />
      </svg>
    ),
    rating: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  }
  return icons[id] || null
}

const features = [
  {
    iconId: 'buy',
    title: 'Beli Langsung',
    description:
      'Temukan ikan hias favoritmu dan beli langsung dengan harga transparan. Checkout mudah dengan berbagai metode pembayaran.',
    color: 'bg-orange-50 border-orange-100',
    iconColor: 'text-[#FE735C]',
    iconBg: 'bg-[#FE735C]/10',
  },
  {
    iconId: 'auction',
    title: 'Lelang Berbatas Waktu',
    description:
      'Ikuti lelang dengan countdown timer realtime. Auto-extend otomatis jika ada penawaran di menit terakhir — tidak ada yang ketinggalan!',
    color: 'bg-teal-50 border-teal-100',
    iconColor: 'text-[#008080]',
    iconBg: 'bg-[#008080]/10',
  },
  {
    iconId: 'live',
    title: 'Live Streaming + Lelang Live',
    description:
      'Saksikan ikan langsung dari kandang penjual via live streaming. Ajukan penawaran secara real-time saat stream berlangsung.',
    color: 'bg-red-50 border-red-100',
    iconColor: 'text-red-500',
    iconBg: 'bg-red-100',
  },
  {
    iconId: 'shipping',
    title: 'Pengiriman Aman ke Seluruh RI',
    description:
      'Jaringan kurir terpercaya (JNE, J&T, dll.) ke seluruh Indonesia. Layanan transshipper internasional untuk pengiriman ke luar negeri.',
    color: 'bg-blue-50 border-blue-100',
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-100',
  },
  {
    iconId: 'wallet',
    title: 'Dompet Digital & Escrow',
    description:
      'Sistem escrow melindungi setiap transaksi. Dana ditahan hingga pesanan terverifikasi diterima — penjual dan pembeli sama-sama aman.',
    color: 'bg-purple-50 border-purple-100',
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-100',
  },
  {
    iconId: 'rating',
    title: 'Rating & Ulasan',
    description:
      'Sistem rating terpercaya membantu memilih penjual terbaik. Beri ulasan dan bantu komunitas ikan hias tumbuh bersama.',
    color: 'bg-yellow-50 border-yellow-100',
    iconColor: 'text-yellow-500',
    iconBg: 'bg-yellow-100',
  },
]

function FeaturesSection() {
  return (
    <section id="fitur" className="py-20 sm:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#008080]/10 text-[#008080] px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            Kenapa Bettazon.id?
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Semua yang Kamu Butuhkan
            <br />
            <span className="text-[#FE735C]">Ada di Sini</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Platform lengkap untuk komunitas ikan hias Indonesia — dari transaksi biasa hingga
            lelang live yang seru.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className={`rounded-2xl p-7 border ${f.color} transition-all hover:-translate-y-1 hover:shadow-lg`}
            >
              <div
                className={`w-12 h-12 ${f.iconBg} ${f.iconColor} rounded-xl flex items-center justify-center mb-5`}
              >
                <FeatureIcon id={f.iconId} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
              <p className="text-gray-600 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────
const StepIcon = ({ id }) => {
  const icons = {
    download: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
        <line x1="12" y1="10" x2="12" y2="16"/>
        <polyline points="9 13 12 16 15 13"/>
      </svg>
    ),
    search: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    bid: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
      </svg>
    ),
    confirm: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
  }
  return icons[id] || null
}

const steps = [
  {
    step: '01',
    iconId: 'download',
    title: 'Unduh & Daftar',
    description:
      'Download aplikasi Bettazon.id di Play Store. Daftar dengan nomor HP atau akun Google dalam 1 menit.',
  },
  {
    step: '02',
    iconId: 'search',
    title: 'Temukan Ikan Favoritmu',
    description:
      'Jelajahi ribuan produk ikan hias. Filter berdasarkan jenis, ukuran, harga, atau cari langsung lewat search.',
  },
  {
    step: '03',
    iconId: 'bid',
    title: 'Beli, Tawar, atau Tonton Live',
    description:
      'Beli langsung, ikuti lelang dengan penawaran terbaik, atau tonton live streaming penjual favoritmu.',
  },
  {
    step: '04',
    iconId: 'confirm',
    title: 'Terima dengan Aman',
    description:
      'Pesananmu dikirim aman. Dana escrow dicairkan ke penjual setelah kamu konfirmasi penerimaan.',
  },
]

function HowItWorksSection() {
  return (
    <section id="cara-kerja" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#FE735C]/10 text-[#FE735C] px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            Cara Kerja
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Belanja Ikan Hias
            <br />
            <span className="text-[#008080]">Semudah 4 Langkah</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Proses yang sederhana dan transparan dari pencarian hingga ikan sampai di tangan kamu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.step} className="relative text-center">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] right-0 h-0.5 bg-gradient-to-r from-[#FE735C]/30 to-[#008080]/20" />
              )}

              {/* Icon box */}
              <div className="relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#FE735C] to-[#e5634d] text-white rounded-2xl shadow-lg shadow-[#FE735C]/30 mb-5">
                <StepIcon id={step.iconId} />
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-white border-2 border-[#FE735C] rounded-full text-[#FE735C] text-xs font-bold flex items-center justify-center">
                  {step.step}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── LIVE HIGHLIGHT ───────────────────────────────────────────────────────────
function LiveHighlightSection() {
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />
              LIVE SEKARANG
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              Lelang Live{' '}
              <span className="text-[#FE735C]">Real-time</span>
              <br />
              Langsung dari Peternak
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Teknologi live streaming memungkinkan kamu melihat kondisi ikan secara langsung.
              Tawar, beli, dan pastikan kualitas sebelum transaksi — semua dalam satu platform.
            </p>

            <div className="space-y-3">
              {[
                'Live streaming langsung dari kandang peternak',
                'Chat real-time dengan penjual saat streaming',
                'Penawaran lelang live via data packet terenkripsi',
                'Hasil lelang otomatis tersimpan & diproses',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-gray-200 text-base">
                  <svg className="w-5 h-5 text-[#FE735C] mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <a
              href="#unduh"
              className="inline-flex items-center gap-2 mt-8 bg-[#FE735C] hover:bg-[#e5634d] text-white px-7 py-3.5 rounded-xl font-bold transition-all hover:shadow-xl hover:shadow-[#FE735C]/30"
            >
              Coba Sekarang — Gratis
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>

          {/* Mock stream UI */}
          <div className="bg-gray-800/60 backdrop-blur rounded-3xl p-6 border border-gray-700">
            {/* Stream preview */}
            <div className="bg-gray-900 rounded-2xl aspect-video flex items-center justify-center mb-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-900/50 to-gray-900/80" />
              <div className="relative text-center">
                <div className="text-6xl mb-3">🐠</div>
                <div className="text-white font-semibold">Live Stream Preview</div>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-red-400 text-sm font-medium">LIVE</span>
                  <span className="text-gray-400 text-sm">• 247 penonton</span>
                </div>
              </div>
            </div>

            {/* Auction overlay */}
            <div className="bg-gray-800 rounded-xl p-4 mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">🔨 Lelang Aktif</span>
                <span className="text-[#FE735C] font-bold text-sm">⏱ 02:47</span>
              </div>
              <div className="text-white font-bold text-lg">Betta Halfmoon Premium</div>
              <div className="flex items-center justify-between mt-2">
                <div>
                  <span className="text-gray-400 text-xs">Penawaran tertinggi</span>
                  <div className="text-[#FE735C] font-bold text-xl">Rp 850.000</div>
                </div>
                <button className="bg-[#FE735C] text-white px-4 py-2 rounded-lg text-sm font-semibold">
                  Tawar
                </button>
              </div>
            </div>

            {/* Chat mockup */}
            <div className="space-y-2">
              {[
                { user: 'andi_fish', msg: 'Wah bagus banget! 😍' },
                { user: 'siti_betta', msg: 'Nawar 900rb!' },
                { user: 'budi_koi', msg: 'Ikan sehat ga?' },
              ].map(({ user, msg }) => (
                <div key={user} className="flex gap-2 text-xs">
                  <span className="text-[#FE735C] font-semibold">{user}:</span>
                  <span className="text-gray-300">{msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── SELLER CTA ───────────────────────────────────────────────────────────────
function SellerSection() {
  return (
    <section className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#008080] to-teal-700 rounded-3xl p-10 sm:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Punya Ikan Hias untuk Dijual?
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-8">
              Bergabunglah sebagai penjual di Bettazon.id. Jangkau ribuan pembeli ikan hias di
              seluruh Indonesia dan mancanegara.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#unduh"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#008080] hover:bg-gray-50 px-7 py-3.5 rounded-xl font-bold transition-all hover:shadow-xl"
              >
                Daftar sebagai Penjual
              </a>
              <a
                href="#fitur"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white hover:bg-white/10 px-7 py-3.5 rounded-xl font-semibold transition-all"
              >
                Pelajari Selengkapnya
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── TRUST & SUPPORT ─────────────────────────────────────────────────────────
function TrustSupportSection() {
  const cards = [
    {
      title: 'Pembayaran Aman',
      description:
        'Bettazon.id menggunakan iPaymu sebagai metode pembayaran utama untuk top up wallet dan transaksi. Sistem escrow melindungi setiap transaksi pembeli dan penjual.',
      ctaLabel: 'Lihat FAQ',
      ctaHref: '/faq',
    },
    {
      title: 'Refund & Kebijakan',
      description:
        'Transaksi yang memenuhi syarat refund diproses sesuai status order, hasil verifikasi, dan kebijakan Bettazon.id.',
      ctaLabel: 'Refund Policy',
      ctaHref: '/refund-policy',
    },
    {
      title: 'Bantuan & Legal',
      description:
        'Hubungi official@bettazon.id untuk bantuan transaksi dan official@bettazon.id untuk pertanyaan privasi. Syarat layanan tersedia publik di website ini.',
      ctaLabel: 'Syarat & Ketentuan',
      ctaHref: '/terms',
    },
  ]

  return (
    <section className="py-20 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#FE735C]/10 text-[#FE735C] px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Pembayaran, Legal & Bantuan
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Informasi Penting untuk Pengguna Bettazon.id
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Semua informasi penting mengenai metode pembayaran, refund, syarat layanan, dan bantuan pelanggan tersedia secara publik di website Bettazon.id.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-3">{card.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-5">{card.description}</p>
              <Link
                href={card.ctaHref}
                className="inline-flex items-center gap-2 text-[#008080] hover:text-[#006666] font-semibold"
              >
                {card.ctaLabel}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-[#008080]/20 bg-[#008080]/5 p-6 text-sm text-gray-700">
          <p className="font-semibold text-gray-900 mb-2">Kontak publik</p>
          <p>Support umum: <a href="mailto:official@bettazon.id" className="text-[#008080] font-medium hover:underline">official@bettazon.id</a></p>
          <p>Pertanyaan privasi: <a href="mailto:official@bettazon.id" className="text-[#008080] font-medium hover:underline">official@bettazon.id</a></p>
          <p>Wilayah layanan: Indonesia</p>
        </div>
      </div>
    </section>
  )
}

// ─── DOWNLOAD ─────────────────────────────────────────────────────────────────
function DownloadSection() {
  return (
    <section id="unduh" className="py-20 sm:py-28 bg-gradient-to-br from-[#FE735C]/5 via-white to-[#008080]/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-[#FE735C]/10 to-[#008080]/10 rounded-3xl flex items-center justify-center border border-gray-100">
            <svg className="w-10 h-10 text-[#FE735C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
          </div>
        </div>
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
          Siap Bergabung?
          <br />
          <span className="text-[#FE735C]">Download Sekarang</span>
        </h2>
        <p className="text-xl text-gray-600 mb-10 max-w-xl mx-auto leading-relaxed">
          Tersedia di Android. Gratis untuk diunduh dan didaftarkan. Mulai jual atau beli ikan
          hias hari ini!
        </p>

        <div className="flex justify-center">
          <a
            href="#"
            className="inline-flex items-center gap-4 bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-2xl transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.18 23.76c.29.16.64.19.96.09l11.84-6.52-2.59-2.59-10.21 9.02zM.19 1.73C.07 2.01 0 2.33 0 2.68v18.64c0 .35.07.67.19.95l.1.09 10.45-10.45v-.25L.29 1.64l-.1.09zM19.37 10.43l-2.89-1.59-2.91 2.91 2.91 2.91 2.9-1.6c.83-.46.83-1.21-.01-1.63zM4.14.24L16 6.76l-2.59 2.59L3.18.24A.87.87 0 014.14.24z" />
            </svg>
            <div className="text-left">
              <div className="text-xs text-gray-400">Dapatkan di</div>
              <div className="font-bold text-lg">Google Play</div>
            </div>
          </a>
        </div>

        <p className="text-sm text-gray-400 mt-6">Gratis · Android 7.0+ · Update rutin</p>
      </div>
    </section>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <LiveHighlightSection />
        <SellerSection />
        <TrustSupportSection />
        <DownloadSection />
      </main>
      <Footer />
    </>
  )
}
