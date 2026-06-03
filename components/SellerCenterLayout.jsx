import Image from 'next/image'
import Link from 'next/link'
import SellerCenterIcon from '@/components/seller-center/SellerCenterIcon'

const PAGES = [
  { href: '/seller-center/mulai-berjualan', label: 'Mulai Berjualan' },
  { href: '/seller-center/kelola-produk', label: 'Kelola Produk' },
  { href: '/seller-center/pesanan', label: 'Mengelola Pesanan' },
  { href: '/seller-center/lelang', label: 'Panduan Lelang' },
  { href: '/seller-center/live', label: 'Live Streaming' },
  { href: '/seller-center/pembayaran-pencairan', label: 'Pembayaran & Pencairan' },
  { href: '/seller-center/ongkir-pengiriman', label: 'Ongkir & Pengiriman' },
  { href: '/seller-center/faq', label: 'FAQ Seller' },
  { href: '/seller-center/kebijakan', label: 'Kebijakan Seller' },
]

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=id.bettazon.app'

export default function SellerCenterLayout({ iconKey, title, subtitle, currentHref, children }) {
  const idx = PAGES.findIndex((p) => p.href === currentHref)
  const prev = idx > 0 ? PAGES[idx - 1] : null
  const next = idx < PAGES.length - 1 ? PAGES[idx + 1] : null

  return (
    <>
      {/* Sticky nav */}
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
            <div className="flex items-center gap-1.5 text-sm overflow-hidden">
              <Link
                href="/seller-center"
                className="text-[#008080] hover:text-[#006666] font-medium transition-colors whitespace-nowrap"
              >
                Seller Center
              </Link>
              {idx >= 0 && (
                <>
                  <svg
                    className="w-4 h-4 text-gray-300 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="text-gray-600 font-medium truncate max-w-[130px] sm:max-w-xs">{title}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#008080] to-teal-700 text-white py-14 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 border border-white/30 mb-4">
              <SellerCenterIcon name={iconKey} className="w-9 h-9 text-white" title={title} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">{title}</h1>
            <p className="text-teal-100 text-base sm:text-lg">{subtitle}</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-10">
            {children}
          </div>

          {/* Prev / Next */}
          {(prev || next) && (
            <div className="flex items-stretch justify-between mt-6 gap-3">
              {prev ? (
                <Link
                  href={prev.href}
                  className="flex items-center gap-2 text-sm font-medium text-[#008080] hover:text-[#006666] bg-white border border-gray-200 hover:border-[#008080]/40 rounded-xl px-4 py-3 transition-all hover:shadow-sm flex-1 sm:flex-none sm:max-w-[220px]"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="truncate">{prev.label}</span>
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link
                  href={next.href}
                  className="flex items-center justify-end gap-2 text-sm font-medium text-[#008080] hover:text-[#006666] bg-white border border-gray-200 hover:border-[#008080]/40 rounded-xl px-4 py-3 transition-all hover:shadow-sm flex-1 sm:flex-none sm:max-w-[220px] text-right"
                >
                  <span className="truncate">{next.label}</span>
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <div />
              )}
            </div>
          )}

          {/* Download App CTA */}
          <div className="mt-6 bg-gradient-to-br from-[#008080] to-teal-700 rounded-2xl p-6 sm:p-8 text-white text-center">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="font-bold text-lg mb-2">Mulai Berjualan di Bettazon</h3>
            <p className="text-teal-100 text-sm mb-5">Download aplikasinya sekarang — gratis daftar, 0% fee untuk Founding Seller!</p>
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
    </>
  )
}
