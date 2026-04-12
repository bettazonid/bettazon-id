import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center mb-5">
              <Image
                src="/assets/images/logo-white.png"
                alt="Bettazon.id"
                width={260}
                height={72}
                className="h-12 md:h-14 w-auto object-contain"
                priority
              />
            </div>
            <p className="text-sm leading-relaxed text-gray-500 max-w-xs">
              Platform jual beli ikan hias terlengkap di Indonesia. Temukan ribuan jenis ikan hias
              dari peternak dan penjual terpercaya di seluruh nusantara.
            </p>
            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              <a
                href="https://www.instagram.com/bettazon.id"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 bg-gray-800 hover:bg-pink-600 rounded-full flex items-center justify-center transition-all"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://tiktok.com/@bettazon_indonesia"
                aria-label="TikTok"
                className="w-9 h-9 bg-gray-800 hover:bg-black rounded-full flex items-center justify-center transition-all"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.74a4.85 4.85 0 01-1.01-.05z" />
                </svg>
              </a>
              <a
                href="https://wa.me/6282186287929?text=Halo%20Bettazon%2C%20saya%20ingin%20bertanya%20tentang..."
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 bg-gray-800 hover:bg-green-600 rounded-full flex items-center justify-center transition-all"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="hidden md:block md:col-span-1" />

          {/* Platform links */}
          <div className="md:col-span-3">
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Platform
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#fitur" className="hover:text-[#FE735C] transition-colors">
                  Fitur Unggulan
                </a>
              </li>
              <li>
                <a href="#cara-kerja" className="hover:text-[#FE735C] transition-colors">
                  Cara Kerja
                </a>
              </li>
              <li>
                <a href="#unduh" className="hover:text-[#FE735C] transition-colors">
                  Unduh Aplikasi
                </a>
              </li>
              <li>
                <a href="#unduh" className="hover:text-[#FE735C] transition-colors">
                  Daftar sebagai Penjual
                </a>
              </li>
            </ul>
          </div>

          {/* Legal links */}
          <div className="md:col-span-3">
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Legal & Bantuan
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/faq" className="hover:text-[#FE735C] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#FE735C] transition-colors">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#FE735C] transition-colors">
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-[#FE735C] transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/company-info" className="hover:text-[#FE735C] transition-colors">
                  Informasi Perusahaan
                </Link>
              </li>
              <li>
                <a
                  href="mailto:official@bettazon.id"
                  className="hover:text-[#FE735C] transition-colors"
                >
                  Hubungi Kami
                </a>
              </li>
              <li>
                <a
                  href="mailto:privacy@bettazon.id"
                  className="hover:text-[#FE735C] transition-colors"
                >
                  Pertanyaan Privasi
                </a>
              </li>
              <li className="text-gray-500 pt-1">
                Pembayaran diproses melalui payment gateway berlisensi Bank Indonesia. Layanan tersedia untuk seluruh Indonesia.
              </li>
              <li className="text-gray-500 pt-2 text-xs border-t border-gray-700 mt-3 leading-relaxed">
                <strong>Bettazon.id</strong><br />
                Jl. Husin Basri Perumahan Grand Berdikari Blok G16 Rt/Rw. 002/005<br />
                Kel. Sukamulya, Kec. Sematang Borang<br />
                Palembang, Sumatera Selatan 30162<br />
                +62 821 8628 7929<br />
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <p className="text-gray-500">
            © {currentYear} Bettazon.id. Hak cipta dilindungi undang-undang.
          </p>
          <p className="text-gray-600">Dibuat dengan 🐠 di Indonesia</p>
        </div>
      </div>
    </footer>
  )
}
