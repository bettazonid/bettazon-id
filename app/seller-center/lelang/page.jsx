import SellerCenterLayout from '@/components/SellerCenterLayout'

export const metadata = {
  title: 'Panduan Lelang – Seller Center Bettazon.id',
  description:
    'Cara membuat lelang halaman dan lelang live di Bettazon.id, aturan lelang, tips harga awal, dan strategi memenangkan pembeli.',
}

export default function LelangPage() {
  return (
    <SellerCenterLayout
      icon="🔨"
      title="Panduan Lelang"
      subtitle="Dua jenis lelang — halaman & live — untuk memaksimalkan harga jual ikanmu."
      currentHref="/seller-center/lelang"
    >
      {/* Perbandingan jenis */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Dua Jenis Lelang di Bettazon</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border-2 border-[#008080]/30 rounded-2xl p-5">
            <div className="text-2xl mb-2">📄</div>
            <h3 className="font-bold text-gray-900 mb-2">Lelang Halaman (Page Auction)</h3>
            <ul className="text-sm text-gray-600 space-y-1.5">
              <li>✓ Tentukan tanggal & jam mulai dan berakhir secara bebas</li>
              <li>✓ Minimal 5 menit, maksimal 30 hari dari sekarang</li>
              <li>✓ Pembeli bid kapan saja selama lelang masih buka</li>
              <li>✓ Otomatis extend jika ada bid di menit-menit terakhir</li>
              <li>✓ Cocok untuk ikan premium yang butuh waktu eksposur</li>
            </ul>
          </div>
          <div className="border-2 border-[#FE735C]/30 rounded-2xl p-5">
            <div className="text-2xl mb-2">🎥</div>
            <h3 className="font-bold text-gray-900 mb-2">Lelang Live (Live Auction)</h3>
            <ul className="text-sm text-gray-600 space-y-1.5">
              <li>✓ Berlangsung real-time saat kamu live</li>
              <li>✓ Pembeli bid langsung di kolom chat live</li>
              <li>✓ Interaksi tinggi = harga jual lebih tinggi</li>
              <li>✓ Cocok untuk batch ikan atau penjualan cepat</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Cara Buat Lelang Halaman */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-[#008080] text-white text-xs flex items-center justify-center font-bold">1</span>
          Cara Membuat Lelang Halaman
        </h2>
        <div className="space-y-3 text-sm text-gray-700">
          {[
            'Buka Kelola Produk → (+) → pilih tipe listing "Lelang Halaman".',
            'Isi detail produk seperti biasa (nama, foto, deskripsi).',
            'Tentukan Harga Awal (opening bid) — disarankan 30–50% dari estimasi harga wajar.',
            'Tentukan Kelipatan Bid Minimum (minimal Rp 1.000, default Rp 10.000).',
            'Tentukan tanggal & jam mulai serta tanggal & jam berakhir secara bebas (min. 5 menit dari sekarang, max. 30 hari).',
            'Tap "Publikasikan". Bid pertama cukup memenuhi Harga Awal; bid berikutnya harus ≥ harga tertinggi saat ini + Kelipatan Bid Minimum.',
          ].map((text, i) => (
            <div key={i} className="flex gap-3 items-start bg-gray-50 rounded-xl p-3">
              <span className="w-5 h-5 rounded-full bg-[#008080]/10 text-[#008080] text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Cara Buat Lelang Live */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-[#FE735C] text-white text-xs flex items-center justify-center font-bold">2</span>
          Cara Membuat Lelang di Sesi Live
        </h2>
        <div className="space-y-3 text-sm text-gray-700">
          {[
            'Mulai sesi live terlebih dahulu (lihat Panduan Live Streaming).',
            'Saat live berlangsung, tap tombol "Buat Lelang" di panel kontrol live.',
            'Masukkan nama ikan dan harga awal. Tidak perlu upload foto — pembeli melihat langsung di video.',
            'Tentukan durasi per item (biasanya 1–5 menit).',
            'Tap "Mulai Lelang" — sistem menampilkan countdown dan input bid di layar pembeli.',
            'Saat waktu habis, pemenang mendapat notifikasi dan diminta checkout dalam 15 menit.',
          ].map((text, i) => (
            <div key={i} className="flex gap-3 items-start bg-gray-50 rounded-xl p-3">
              <span className="w-5 h-5 rounded-full bg-[#FE735C]/10 text-[#FE735C] text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Aturan Lelang */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">📋 Aturan Lelang yang Wajib Diketahui</h2>
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 text-sm text-gray-700 space-y-2">
          <p>• Seller <strong>wajib mengirim</strong> kepada pemenang lelang. Membatalkan lelang yang sudah ada pemenang akan mempengaruhi performa toko.</p>
          <p>• Pemenang yang tidak checkout dalam 24 jam (lelang halaman) dianggap gagal bayar — item dapat dilomba ulang.</p>
          <p>• Harga yang telah tercapai saat lelang berakhir adalah harga final dan tidak bisa dinegosiasi.</p>
          <p>• Shill bidding (memasang bid sendiri/menyuruh orang lain bid palsu) adalah pelanggaran serius yang dapat menyebabkan akun disuspend.</p>
        </div>
      </section>

      {/* Auto-extend */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">⏱️ Aturan Auto-Extend (Perpanjangan Otomatis)</h2>
        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5 text-sm text-gray-700 space-y-2">
          <p>Saat kamu membuat lelang, kamu bisa mengatur berapa menit sebelum berakhir sistem akan memicu perpanjangan jika ada bid masuk (<em>Auto Extend Minutes</em>).</p>
          <p>Setiap bid yang masuk dalam waktu tersebut sebelum lelang berakhir akan <strong>memperpanjang durasi lelang</strong> sebesar nilai tersebut.</p>
          <p className="font-semibold text-[#008080]">Dual cap — perpanjangan berhenti jika salah satu terpenuhi:</p>
          <ul className="list-none space-y-1 pl-2">
            <li>🔢 Maksimum <strong>10 kali</strong> perpanjangan, ATAU</li>
            <li>⏱️ Total perpanjangan mencapai <strong>2 jam (120 menit)</strong></li>
          </ul>
          <p className="text-gray-500 text-xs pt-1">Ini melindungi seller agar lelang tidak tertunda tanpa batas, sekaligus memberikan kesempatan adil bagi semua penawar.</p>
        </div>
      </section>

      {/* Tips */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">💡 Tips Maksimalkan Harga Lelang</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: '📸', tip: 'Foto berkualitas tinggi = more bidders. Tunjukkan keindahan ikan dari berbagai sudut.' },
            { icon: '⏰', tip: 'Jadwalkan lelang berakhir di malam hari (19:00–22:00 WIB) saat pengguna paling aktif.' },
            { icon: '💬', tip: 'Bagikan link lelang ke grup WA atau media sosial untuk mendatangkan lebih banyak peserta.' },
            { icon: '📝', tip: 'Deskripsi lengkap (ukuran, umur, asal indukan) membuat pembeli lebih percaya diri untuk bid tinggi.' },
          ].map(({ icon, tip }) => (
            <div key={tip} className="flex gap-3 items-start bg-teal-50 border border-teal-100 rounded-xl p-3 text-sm text-gray-700">
              <span className="text-xl flex-shrink-0">{icon}</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </section>
    </SellerCenterLayout>
  )
}
