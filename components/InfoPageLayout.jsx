import Image from 'next/image'
import Link from 'next/link'

export default function InfoPageLayout({ icon, title, subtitle, children }) {
  return (
    <>
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </nav>

      <main className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-br from-[#008080] to-teal-700 text-white py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-5xl mb-5">{icon}</div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-3">{title}</h1>
            <p className="text-teal-100 text-lg">{subtitle}</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12">
            {children}
          </div>
        </div>
      </main>
    </>
  )
}
