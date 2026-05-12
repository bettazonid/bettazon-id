import SellerCenterLayout from '@/components/SellerCenterLayout'

export const metadata = {
  title: 'Kebijakan Seller – Seller Center Bettazon.id',
  description:
    'Aturan penting yang wajib dipahami seller Bettazon.id: produk yang boleh dan tidak boleh dijual, standar performa toko, pelanggaran, dan sanksi.',
}

export default function KebijakanPage() {
  return (
    <SellerCenterLayout
      icon="📋"
      title="Kebijakan Seller"
      subtitle="Pahami aturan mainnya agar tokomu tetap aktif dan terpercaya."
      currentHref="/seller-center/kebijakan"
    >
      {/* Produk yang Boleh Dijual */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">✅ Produk yang Boleh Dijual</h2>
        <div className="space-y-2 text-sm text-gray-700">
          {[
            'Ikan hias air tawar (cupang, koi, arwana, louhan, diskus, dll.)',
            'Ikan hias air laut (ikan hias laut yang tidak dilindungi)',
            'Perlengkapan akuarium (filter, pompa, termometer, dll.)',
            'Tanaman air dan koral hias (yang legal)',
            'Pakan ikan hidup maupun kering (cacing, artemia, pelet, dll.)',
            'Aksesoris dan dekorasi akuarium',
          ].map((item) => (
            <div key={item} className="flex items-start gap-2 bg-green-50 border border-green-100 rounded-xl p-3">
              <span className="text-green-600 font-bold flex-shrink-0 mt-0.5">✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Produk Terlarang */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">🚫 Produk yang Tidak Diizinkan</h2>
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
          <div className="space-y-2 text-sm text-gray-700">
            {[
              'Spesies ikan yang dilindungi UU (termasuk yang masuk daftar CITES Appendix I & II tanpa izin resmi)',
              'Ikan invasif yang dilarang masuk ke Indonesia',
              'Produk palsu atau imitasi merek terkenal',
              'Obat-obatan ikan yang tidak memiliki izin edar resmi',
              'Ikan konsumsi (kategori ini tidak tersedia di Bettazon)',
              'Hewan selain ikan (reptil, burung, mamalia, dll.) kecuali akuatik yang legal',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <span className="text-red-500 font-bold flex-shrink-0 mt-0.5">✗</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Seller yang melanggar kebijakan produk dapat langsung disuspend tanpa peringatan. Jika ragu apakah produkmu diizinkan, hubungi tim Bettazon sebelum mempublikasikan listing.
        </p>
      </section>

      {/* Standar Toko */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">⭐ Standar Performa Toko</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-3 font-semibold text-gray-700">Metrik</th>
                <th className="text-left p-3 font-semibold text-gray-700">Standar Minimum</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {[
                ['Tingkat Konfirmasi Pesanan', '≥ 95%'],
                ['Tingkat Pengiriman Tepat Waktu', '≥ 90%'],
                ['Rating Toko', '≥ 4.0 / 5.0'],
                ['Tingkat Komplain', '≤ 5%'],
                ['Waktu Respons Chat', '≤ 24 jam'],
              ].map(([metric, standard]) => (
                <tr key={metric} className="border-t border-gray-100">
                  <td className="p-3">{metric}</td>
                  <td className="p-3 font-semibold text-[#008080]">{standard}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-3">Performa toko dievaluasi setiap 30 hari. Toko yang konsisten di bawah standar dapat dikenai pembatasan fitur.</p>
      </section>

      {/* Standar Foto & Deskripsi */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">📸 Standar Foto & Deskripsi Produk</h2>
        <div className="space-y-2 text-sm text-gray-700">
          {[
            { ok: true, text: 'Foto asli milik sendiri atau dengan izin sumber aslinya.' },
            { ok: true, text: 'Foto jernih, tidak blur, dan menampilkan kondisi ikan yang sebenarnya.' },
            { ok: true, text: 'Deskripsi jujur — tidak melebih-lebihkan kualitas, ukuran, atau grade ikan.' },
            { ok: false, text: 'Dilarang menggunakan foto dari listing seller lain atau dari internet tanpa izin.' },
            { ok: false, text: 'Dilarang mencantumkan kontak pribadi (WA, Instagram) di deskripsi atau foto untuk menghindari sistem.' },
            { ok: false, text: 'Dilarang menggunakan kata-kata menyesatkan seperti "Garansi 100% Hidup" tanpa ketentuan yang jelas.' },
          ].map(({ ok, text }) => (
            <div key={text} className={`flex items-start gap-2 rounded-xl p-3 ${ok ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
              <span className={`font-bold flex-shrink-0 mt-0.5 ${ok ? 'text-green-600' : 'text-red-500'}`}>
                {ok ? '✓' : '✗'}
              </span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Pelanggaran & Sanksi */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">⚠️ Pelanggaran & Sanksi</h2>
        <div className="space-y-3">
          {[
            { level: 'Peringatan', color: 'bg-yellow-50 border-yellow-200 text-yellow-800', desc: 'Pelanggaran pertama yang ringan (deskripsi tidak akurat, respons lambat). Toko masih aktif, seller mendapat notifikasi peringatan.' },
            { level: 'Pembatasan Fitur', color: 'bg-orange-50 border-orange-200 text-orange-800', desc: 'Pelanggaran berulang atau sedang. Fitur tertentu (live, lelang) dibatasi sementara. Berlaku 7–30 hari.' },
            { level: 'Suspend Sementara', color: 'bg-red-50 border-red-200 text-red-800', desc: 'Pelanggaran serius (shill bidding, produk tidak sesuai listing). Toko tidak aktif selama 30–90 hari. Bisa mengajukan banding.' },
            { level: 'Suspend Permanen', color: 'bg-gray-100 border-gray-300 text-gray-800', desc: 'Pelanggaran berat atau berulang (menjual produk terlarang, penipuan, fraud). Akun ditutup permanen, dana masih bisa dicairkan setelah audit.' },
          ].map(({ level, color, desc }) => (
            <div key={level} className={`border rounded-xl p-4 ${color}`}>
              <h3 className="font-bold text-sm mb-1">{level}</h3>
              <p className="text-sm opacity-80 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Banding */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">🔄 Cara Mengajukan Banding</h2>
        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5 text-sm text-gray-700 space-y-2">
          <p>Jika kamu merasa keputusan suspend tidak adil, kamu bisa mengajukan banding melalui:</p>
          <div className="space-y-2 mt-3">
            <div className="flex items-center gap-2">
              <span className="text-[#008080] font-bold">→</span>
              <span>Aplikasi Bettazon → Profil → Bantuan → Ajukan Banding</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#008080] font-bold">→</span>
              <span>Email: official@bettazon.id dengan subject "Banding Akun – [Nama Toko]"</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#008080] font-bold">→</span>
              <span>WhatsApp: 0821-8628-7929</span>
            </div>
          </div>
          <p className="text-gray-500 text-xs border-t border-teal-200 pt-3 mt-3">Banding diproses dalam 3–5 hari kerja. Sertakan bukti yang relevan untuk mempercepat proses.</p>
        </div>
      </section>
    </SellerCenterLayout>
  )
}
