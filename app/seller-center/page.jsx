import Link from 'next/link'
import Image from 'next/image'
import Footer from '@/components/Footer'
import SellerCenterIcon from '@/components/seller-center/SellerCenterIcon'

export const metadata = {
  title: 'Seller Center – Bettazon.id',
  description:
    'Panduan lengkap untuk seller Bettazon.id. Tutorial mulai berjualan, kelola produk, pesanan, lelang, live streaming, pembayaran, dan pengiriman.',
  openGraph: {
    title: 'Seller Center – Bettazon.id',
    description:
      'Semua panduan yang kamu butuhkan untuk berjualan sukses di Bettazon.id.',
    type: 'website',
  },
}

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=id.bettazon.app'

const guides = [
  {
    href: '/seller-center/mulai-berjualan',
    iconKey: 'mulai-berjualan',
    title: 'Mulai Berjualan',
    desc: 'Cara daftar, verifikasi KTP, buka toko, dan upload produk pertamamu.',
    badge: 'Mulai di sini',
    badgeColor: 'bg-[#FE735C]/10 text-[#FE735C] border border-[#FE735C]/20',
  },
  {
    href: '/seller-center/kelola-produk',
    iconKey: 'kelola-produk',
    title: 'Kelola Produk',
    desc: 'Tambah, edit, dan atur produk, harga, stok, serta foto yang menarik pembeli.',
  },
  {
    href: '/seller-center/pesanan',
    iconKey: 'pesanan',
    title: 'Mengelola Pesanan',
    desc: 'Konfirmasi pesanan, packing aman, input resi, dan tangani retur atau sengketa.',
  },
  {
    href: '/seller-center/lelang',
    iconKey: 'lelang',
    title: 'Panduan Lelang',
    desc: 'Buat lelang halaman dan lelang live, aturan main, dan tips memenangkan pembeli.',
  },
  {
    href: '/seller-center/live',
    iconKey: 'live',
    title: 'Live Streaming',
    desc: 'Setup live, tampilkan ikan, terima bid langsung, dan tingkatkan penjualan real-time.',
  },
  {
    href: '/seller-center/pembayaran-pencairan',
    iconKey: 'pembayaran',
    title: 'Pembayaran & Pencairan',
    desc: 'Alur escrow, jadwal pencairan, dan langkah tarik saldo ke rekening bank.',
  },
  {
    href: '/seller-center/ongkir-pengiriman',
    iconKey: 'ongkir',
    title: 'Ongkir & Pengiriman',
    desc: 'Kurir tersedia, pengemasan aman untuk ikan, dan pengiriman internasional.',
  },
  {
    href: '/seller-center/faq',
    iconKey: 'faq',
    title: 'FAQ Seller',
    desc: 'Jawaban atas pertanyaan umum seputar komisi, suspend, pesanan, dan lainnya.',
  },
  {
    href: '/seller-center/kebijakan',
    iconKey: 'kebijakan',
    title: 'Kebijakan Seller',
    desc: 'Aturan penting: produk terlarang, standar toko, dan konsekuensi pelanggaran.',
  },
]

export default function SellerCenterPage() {
  return (
    <>
      {/* Sticky Nav */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <Image
                src="/assets/images/logo.png"
                alt="Bettazon.id"
                width={140}
                height={40}
                className="object-contain"
                priority
              />
            </Link>
            <Link
              href="/"
              className="text-sm text-[#008080] hover:text-[#006666] font-medium flex items-center gap-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Beranda
            </Link>
          </div>
        </div>
      </nav>

      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#008080] to-teal-700 text-white py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
              🐠 Khusus Seller Bettazon.id
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Seller Center</h1>
            <p className="text-teal-100 text-base sm:text-lg max-w-xl mx-auto">
              Semua panduan yang kamu butuhkan untuk berjualan sukses di Bettazon — dari daftar sampai cair.
            </p>
          </div>
        </div>

        {/* Guide Cards */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {guides.map(({ href, iconKey, title, desc, badge, badgeColor }) => (
              <Link
                key={href}
                href={href}
                className="group bg-white rounded-2xl border border-gray-100 p-5 hover:border-[#008080]/30 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center text-[#008080] mt-0.5">
                    <SellerCenterIcon name={iconKey} className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h2 className="font-bold text-gray-900 text-sm sm:text-base">{title}</h2>
                      {badge && (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>
                          {badge}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-[#008080] text-sm font-semibold group-hover:gap-2 transition-all">
                  Baca panduan
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          {/* Hubungi Tim */}
          <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Tidak menemukan jawaban?</h3>
              <p className="text-gray-500 text-sm">Tim Bettazon siap membantu kamu via WhatsApp.</p>
            </div>
            <a
              href="https://wa.me/6282186287929?text=Halo%20Bettazon%2C%20saya%20seller%20dan%20ingin%20bertanya%20tentang..."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat via WhatsApp
            </a>
          </div>

          {/* Download CTA */}
          <div className="mt-6 bg-gradient-to-br from-[#008080] to-teal-700 rounded-2xl p-8 text-white text-center">
            <div className="text-4xl mb-3">📱</div>
            <h3 className="text-xl font-bold mb-2">Belum punya akun seller?</h3>
            <p className="text-teal-100 text-sm mb-5 max-w-sm mx-auto">
              Download aplikasi Bettazon, daftar gratis, dan buka toko ikanmu hari ini.
            </p>
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-[#008080] hover:bg-gray-50 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:shadow-lg"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.18 23.76c.29.16.64.19.96.09l11.84-6.52-2.59-2.59-10.21 9.02zM.19 1.73C.07 2.01 0 2.33 0 2.68v18.64c0 .35.07.67.19.95l.1.09 10.45-10.45v-.25L.29 1.64l-.1.09zM19.37 10.43l-2.89-1.59-2.91 2.91 2.91 2.91 2.9-1.6c.83-.46.83-1.21-.01-1.63zM4.14.24L16 6.76l-2.59 2.59L3.18.24A.87.87 0 014.14.24z" />
              </svg>
              Download di Google Play
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
