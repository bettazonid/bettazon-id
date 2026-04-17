import InfoPageLayout from '@/components/InfoPageLayout'
import Link from 'next/link'

export const metadata = {
  title: 'Informasi Perusahaan – Bettazon.id',
  description:
    'Informasi lengkap tentang Bettazon.id, termasuk alamat kantor, kontak support, dan metode pembayaran resmi.',
}

export default function CompanyInfoPage() {
  return (
    <InfoPageLayout
      icon="🏢"
      title="Informasi Perusahaan"
      subtitle="Alamat, kontak, dan informasi resmi Bettazon.id"
    >
      <div className="space-y-8">
        {/* Address Section */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📍 Alamat Kantor</h2>
          <div className="space-y-2 text-gray-700 leading-relaxed">
            <p className="font-semibold">Bettazon.id</p>
            <p>Jl. Husin Basri Perumahan Grand Berdikari Blok G16 Rt/Rw. 002/005</p>
            <p>Kel. Sukamulya, Kec. Sematang Borang</p>
            <p>Palembang, Sumatera Selatan 30162</p>
            <p>Indonesia</p>
            <p>+62 821 8628 7929</p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📧 Kontak Resmi</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500 mb-1">Support Umum & Bantuan Transaksi</p>
              <a href="mailto:official@bettazon.id" className="text-lg text-[#008080] font-semibold hover:underline">
                official@bettazon.id
              </a>
            </div>
            <div className="border-t border-gray-100 pt-3">
              <p className="text-sm text-gray-500 mb-1">Pertanyaan Privasi & Data Pribadi</p>
              <a href="mailto:privacy@bettazon.id" className="text-lg text-[#008080] font-semibold hover:underline">
                privacy@bettazon.id
              </a>
            </div>
            <div className="border-t border-gray-100 pt-3">
              <p className="text-sm text-gray-500 mb-1">Website Resmi</p>
              <a href="https://bettazon.id" target="_blank" rel="noopener noreferrer" className="text-lg text-[#008080] font-semibold hover:underline">
                https://bettazon.id
              </a>
            </div>
          </div>
        </section>

        {/* Payment Method Section */}
        <section className="rounded-2xl border border-[#008080]/20 bg-[#008080]/5 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">💳 Metode Pembayaran Resmi</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl bg-white border border-gray-100 p-4 shadow-sm">
                <p className="font-semibold text-gray-900 mb-1">Transfer Bank &amp; Virtual Account</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  BCA, BNI, BRI, Mandiri, Permata, dan bank lainnya melalui sistem Virtual Account yang aman dan terverifikasi otomatis.
                </p>
              </div>
              <div className="rounded-xl bg-white border border-gray-100 p-4 shadow-sm">
                <p className="font-semibold text-gray-900 mb-1">Dompet Digital &amp; QRIS</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  GoPay, ShopeePay, OVO, Dana, dan QRIS universal untuk kemudahan pembayaran dari genggaman tangan.
                </p>
              </div>
              <div className="rounded-xl bg-white border border-gray-100 p-4 shadow-sm">
                <p className="font-semibold text-gray-900 mb-1">Kartu Kredit &amp; Debit</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Visa, Mastercard, dan JCB dengan proteksi 3D Secure untuk keamanan transaksi optimal.
                </p>
              </div>
              <div className="rounded-xl bg-white border border-gray-100 p-4 shadow-sm">
                <p className="font-semibold text-gray-900 mb-1">Minimarket</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Indomaret dan Alfamart — bayar tunai di minimarket terdekat tanpa perlu rekening bank.
                </p>
              </div>
            </div>
            <div className="border-t border-[#008080]/20 pt-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                Semua transaksi diproses melalui <strong>payment gateway berlisensi Bank Indonesia</strong> dengan enkripsi SSL/TLS end-to-end. 
                Sistem escrow kami memastikan dana buyer tersimpan aman hingga produk dikonfirmasi diterima.
              </p>
            </div>
          </div>
        </section>

        {/* Service Area */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🌍 Cakupan Layanan</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Bettazon.id melayani pengguna di seluruh <strong>Indonesia</strong>. Platform ini menyediakan:
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-[#FE735C] font-bold">✓</span>
              <span>Jual beli ikan hias langsung dengan berbagai metode pembayaran</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#FE735C] font-bold">✓</span>
              <span>Sistem lelang page dan live auction untuk ikan hias premium</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#FE735C] font-bold">✓</span>
              <span>Live streaming langsung dari peternak dan penjual</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#FE735C] font-bold">✓</span>
              <span>Pengiriman aman ke seluruh Indonesia melalui partner kurir terpercaya</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#FE735C] font-bold">✓</span>
              <span>Sistem escrow dan dompet digital untuk keamanan transaksi</span>
            </li>
          </ul>
        </section>

        {/* Legal & Support Links */}
        <section className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Dokumen Penting</h2>
          <p className="text-gray-600 mb-4">
            Untuk informasi lebih lanjut tentang kebijakan dan layanan Bettazon.id, silakan kunjungi halaman berikut:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Link
              href="/faq"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-3 text-gray-900 font-medium hover:bg-gray-50 transition-colors"
            >
              ❓ FAQ
            </Link>
            <Link
              href="/terms"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-3 text-gray-900 font-medium hover:bg-gray-50 transition-colors"
            >
              📜 Syarat & Ketentuan
            </Link>
            <Link
              href="/refund-policy"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-3 text-gray-900 font-medium hover:bg-gray-50 transition-colors"
            >
              💰 Refund Policy
            </Link>
          </div>
        </section>

        {/* Verification Banner */}
        <section className="rounded-2xl border-2 border-[#FE735C]/30 bg-[#FE735C]/5 p-6">
          <p className="text-sm text-gray-700 leading-relaxed">
            <strong>🔒 Keamanan Transaksi:</strong> Bettazon.id bekerja sama dengan payment gateway berlisensi resmi 
            Bank Indonesia. Seluruh data pembayaran dienkripsi dan tidak pernah disimpan di server kami. 
            Sistem escrow kami menjamin keamanan dana hingga transaksi selesai dan dikonfirmasi kedua belah pihak.
          </p>
        </section>
      </div>
    </InfoPageLayout>
  )
}
