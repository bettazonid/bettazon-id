import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Jual Ikan Hias Online – Buka Toko di Bettazon.id',
  description:
    'Jadilah penjual di Bettazon.id. Jangkau ribuan pembeli ikan hias di seluruh Indonesia & mancanegara. Daftar gratis, 0% fee untuk Founding Seller.',
  openGraph: {
    title: 'Jual Ikan Hias Online – Buka Toko di Bettazon.id',
    description:
      'Platform khusus ikan hias terbesar di Indonesia. Buka toko, live streaming, lelang, dan terima pembayaran — semua dalam satu aplikasi.',
    type: 'website',
  },
}

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=id.bettazon.app'

// ─── HERO ─────────────────────────────────────────────────────────────────────
function SellerHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-orange-50 min-h-screen flex items-center pt-16">
      <div className="absolute top-20 -left-24 w-96 h-96 bg-[#008080]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-24 w-96 h-96 bg-[#FE735C]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 w-full">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#008080]/10 border border-[#008080]/20 text-[#008080] px-4 py-2 rounded-full text-sm font-semibold mb-8">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Khusus Penjual Ikan Hias
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
            Buka Toko Ikanmu{' '}
            <br />
            <span className="text-[#008080]">Jangkau Seluruh</span>{' '}
            <span className="text-[#FE735C]">Indonesia</span>
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed mb-10 max-w-2xl mx-auto">
            Bettazon.id adalah platform <strong>khusus ikan hias</strong> dengan pembeli yang sudah
            ada dan siap bertransaksi. Buka toko, mulai live streaming, dan lelang ikanmu —
            semua dari satu aplikasi. <strong>Gratis daftar.</strong>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#008080] hover:bg-[#006666] text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:shadow-2xl hover:shadow-[#008080]/30 hover:-translate-y-0.5"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.18 23.76c.29.16.64.19.96.09l11.84-6.52-2.59-2.59-10.21 9.02zM.19 1.73C.07 2.01 0 2.33 0 2.68v18.64c0 .35.07.67.19.95l.1.09 10.45-10.45v-.25L.29 1.64l-.1.09zM19.37 10.43l-2.89-1.59-2.91 2.91 2.91 2.91 2.9-1.6c.83-.46.83-1.21-.01-1.63zM4.14.24L16 6.76l-2.59 2.59L3.18.24A.87.87 0 014.14.24z" />
              </svg>
              Mulai Berjualan — Gratis
            </a>
            <a
              href="#cara-berjualan"
              className="inline-flex items-center gap-2 text-[#FE735C] hover:text-[#e5634d] font-semibold text-lg transition-colors group"
            >
              Lihat Cara Kerjanya
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { number: '0%', label: 'Fee Founding Seller' },
              { number: 'Gratis', label: 'Daftar & Buka Toko' },
              { number: 'Live', label: 'Streaming & Lelang' },
              { number: 'Global', label: 'Ekspor ke Mancanegara' },
            ].map(({ number, label }) => (
              <div key={label} className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="text-2xl sm:text-3xl font-bold text-[#008080]">{number}</div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── WHY SELL HERE ────────────────────────────────────────────────────────────
function WhySellSection() {
  const benefits = [
    {
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
        </svg>
      ),
      title: 'Pembeli yang Sudah Ada',
      desc: 'Jangan mulai dari nol. Bettazon sudah memiliki komunitas pembeli ikan hias yang aktif dan siap bertransaksi.',
    },
    {
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
          <polygon points="23 7 16 12 23 17 23 7"/>
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
        </svg>
      ),
      title: 'Live Streaming & Lelang',
      desc: 'Tampilkan ikanmu langsung lewat live streaming. Jalankan lelang real-time dan raih harga terbaik dari pembeli yang antusias.',
    },
    {
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
        </svg>
      ),
      title: 'Terima Pembayaran Otomatis',
      desc: 'Dana dari pembeli masuk ke dompet digital Bettazon-mu. Tarik kapan saja. Sistem escrow otomatis melindungi setiap transaksi.',
    },
    {
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
        </svg>
      ),
      title: 'Jual ke Luar Negeri',
      desc: 'Jaringan transhipper internasional Bettazon memungkinkan ekspor ikan hiasmu ke seluruh dunia — tanpa perlu pusing urusan logistik.',
    },
    {
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
      ),
      title: 'Dashboard Penjualan Lengkap',
      desc: 'Pantau pesanan masuk, riwayat transaksi, ulasan pembeli, dan performa tokomu — semua dari aplikasi di genggamanmu.',
    },
    {
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
        </svg>
      ),
      title: 'Support Langsung dari Tim',
      desc: 'Ada kendala? Tim Bettazon siap membantu via WhatsApp. Founding Seller mendapat prioritas support langsung dari tim kami.',
    },
  ]

  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#008080]/10 text-[#008080] px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Kenapa Berjualan di Bettazon
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Platform yang Dibangun
            <br />
            <span className="text-[#008080]">untuk Penjual Ikan Hias</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Bukan marketplace serba ada yang ramai. Bettazon fokus 100% pada ikan hias —
            artinya pembelinya spesifik, serius, dan siap beli.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((b) => (
            <div key={b.title} className="group p-7 rounded-2xl border border-gray-100 hover:border-[#008080]/30 hover:shadow-lg hover:shadow-[#008080]/5 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-[#008080]/10 to-teal-50 rounded-2xl flex items-center justify-center mb-5 text-[#008080] group-hover:from-[#008080] group-hover:to-teal-600 group-hover:text-white transition-all">
                {b.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{b.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── HOW TO SELL ──────────────────────────────────────────────────────────────
function HowToSellSection() {
  const steps = [
    {
      step: '01',
      title: 'Download & Daftar',
      desc: 'Unduh aplikasi Bettazon dari Play Store. Daftar dengan nomor HP atau akun Google. Gratis, selesai dalam 1 menit.',
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
          <line x1="12" y1="10" x2="12" y2="16"/>
          <polyline points="9 13 12 16 15 13"/>
        </svg>
      ),
    },
    {
      step: '02',
      title: 'Buka Toko & Upload Produk',
      desc: 'Aktifkan mode seller di profil. Upload foto ikan, isi deskripsi, harga, dan stok. Tokomu langsung live dan bisa ditemukan pembeli.',
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
    },
    {
      step: '03',
      title: 'Live Streaming & Lelang',
      desc: 'Jadwalkan sesi live untuk tampilkan ikanmu secara langsung. Aktifkan lelang selama streaming dan raih harga terbaik dari pembeli real-time.',
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
          <polygon points="23 7 16 12 23 17 23 7"/>
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
        </svg>
      ),
    },
    {
      step: '04',
      title: 'Kemas, Kirim & Terima Dana',
      desc: 'Proses pesanan, cetak label kiriman, dan kirim ikan. Dana otomatis masuk ke dompetmu setelah pembeli konfirmasi penerimaan.',
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
        </svg>
      ),
    },
  ]

  return (
    <section id="cara-berjualan" className="py-20 sm:py-28 bg-gradient-to-br from-gray-50 to-teal-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#FE735C]/10 text-[#FE735C] px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            Cara Mulai Berjualan
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Dari Farm ke Pembeli{' '}
            <br />
            <span className="text-[#FE735C]">Semudah 4 Langkah</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Tidak perlu pengalaman jualan online. Jika kamu bisa foto ikan dan chat di WhatsApp,
            kamu sudah siap berjualan di Bettazon.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.step} className="relative text-center">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] right-0 h-0.5 bg-gradient-to-r from-[#008080]/30 to-[#FE735C]/20" />
              )}
              <div className="relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#008080] to-teal-600 text-white rounded-2xl shadow-lg shadow-[#008080]/30 mb-5">
                {step.icon}
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-white border-2 border-[#008080] rounded-full text-[#008080] text-xs font-bold flex items-center justify-center">
                  {step.step}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── FOUNDING SELLER ──────────────────────────────────────────────────────────
function FoundingSellerSection() {
  return (
    <section id="founding-seller" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#FE735C] to-[#e5634d] p-10 sm:p-16 text-white text-center shadow-2xl shadow-[#FE735C]/20">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              🎉 Founding Seller — Slot Terbatas
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight">
              Jadi Founding Seller Bettazon.id
            </h2>
            <p className="text-xl sm:text-2xl font-semibold text-white/90 mb-3">
              Bergabung sekarang &amp; nikmati{' '}
              <span className="underline decoration-white/60">0% fee</span>{' '}
              untuk 3 bulan pertama
            </p>
            <p className="text-white/80 text-base sm:text-lg mb-8 max-w-xl mx-auto">
              Slot terbatas — daftar sebelum penuh dan jadilah bagian dari gelombang pertama
              penjual di marketplace ikan hias terbesar Indonesia.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {[
                '0% fee 3 bulan pertama',
                'Badge Founding Seller',
                'Prioritas tampil di pencarian',
                'Support langsung dari tim',
              ].map((b) => (
                <div key={b} className="flex items-center gap-2 bg-white/15 border border-white/25 px-4 py-2 rounded-full text-sm font-medium">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {b}
                </div>
              ))}
            </div>
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-[#FE735C] hover:bg-gray-50 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:shadow-2xl hover:-translate-y-0.5"
            >
              Daftar Sekarang — Gratis
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <p className="text-white/60 text-sm mt-4">
              Slot terbatas · Gratis daftar · Berlaku selama masa launching
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── SELLER FAQ ───────────────────────────────────────────────────────────────
function SellerFAQSection() {
  const faqs = [
    {
      q: 'Apakah gratis berjualan di Bettazon?',
      a: 'Ya, daftar dan buka toko di Bettazon sepenuhnya gratis. Untuk Founding Seller, biaya layanan 0% selama 3 bulan pertama. Setelah masa launching, biaya layanan akan diumumkan terlebih dahulu.',
    },
    {
      q: 'Siapa yang bisa jadi penjual?',
      a: 'Siapa saja yang memiliki ikan hias untuk dijual — peternak, hobbyist, maupun pedagang ikan hias. Cukup daftar akun, aktifkan mode seller, dan mulai upload produk.',
    },
    {
      q: 'Bagaimana cara menerima pembayaran?',
      a: 'Dana dari setiap transaksi masuk ke dompet digital Bettazon-mu secara otomatis setelah pembeli konfirmasi penerimaan. Kamu bisa tarik dana ke rekening bank kapan saja.',
    },
    {
      q: 'Bagaimana proses pengiriman ikan?',
      a: 'Kamu bertanggung jawab mengemas ikan dengan aman. Bettazon terintegrasi dengan berbagai kurir pengiriman. Label pengiriman bisa dicetak langsung dari aplikasi.',
    },
    {
      q: 'Apakah saya bisa jual ke luar negeri?',
      a: 'Ya! Bettazon memiliki jaringan transhipper internasional. Kamu cukup kirim ke transhipper lokal yang ditunjuk, dan mereka yang akan mengurus pengiriman ke pembeli di luar negeri.',
    },
    {
      q: 'Apa itu live streaming & lelang di Bettazon?',
      a: 'Kamu bisa siaran langsung untuk menampilkan ikanmu secara real-time kepada pembeli. Saat live, kamu bisa mengaktifkan lelang — pembeli langsung menawar dan harga tertinggi menang.',
    },
  ]

  return (
    <section className="py-20 sm:py-28 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Pertanyaan dari Penjual
          </h2>
          <p className="text-gray-600">
            Hal-hal yang sering ditanyakan sebelum mulai berjualan di Bettazon.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map(({ q, a }) => (
            <div key={q} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">{q}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10 text-gray-500 text-sm">
          Masih ada pertanyaan?{' '}
          <a
            href="https://wa.me/6282186287929?text=Halo%20Bettazon%2C%20saya%20ingin%20bertanya%20soal%20jualan%20di%20Bettazon"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#008080] font-semibold hover:underline"
          >
            Chat tim kami via WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}

// ─── FINAL CTA ────────────────────────────────────────────────────────────────
function SellerCTA() {
  return (
    <section className="py-20 sm:py-24 bg-gradient-to-br from-[#008080] to-teal-700 text-white text-center">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
          Ikan Hiasmu Layak
          <br />
          Dilihat Lebih Banyak Orang
        </h2>
        <p className="text-teal-100 text-lg mb-10 max-w-xl mx-auto">
          Bergabung sekarang dan jadilah salah satu dari penjual pertama di Bettazon.id.
          Gratis daftar, 0% fee untuk Founding Seller.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-white text-[#008080] hover:bg-gray-50 px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:shadow-2xl hover:-translate-y-0.5"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.18 23.76c.29.16.64.19.96.09l11.84-6.52-2.59-2.59-10.21 9.02zM.19 1.73C.07 2.01 0 2.33 0 2.68v18.64c0 .35.07.67.19.95l.1.09 10.45-10.45v-.25L.29 1.64l-.1.09zM19.37 10.43l-2.89-1.59-2.91 2.91 2.91 2.91 2.9-1.6c.83-.46.83-1.21-.01-1.63zM4.14.24L16 6.76l-2.59 2.59L3.18.24A.87.87 0 014.14.24z" />
            </svg>
            Mulai Berjualan Sekarang
          </a>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white hover:bg-white/10 px-7 py-3.5 rounded-2xl font-semibold transition-all"
          >
            Lihat Halaman Utama
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function SellerPage() {
  return (
    <>
      <Navbar />
      <main>
        <SellerHero />
        <WhySellSection />
        <HowToSellSection />
        <FoundingSellerSection />
        <SellerFAQSection />
        <SellerCTA />
      </main>
      <Footer />
    </>
  )
}
