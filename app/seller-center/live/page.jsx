import SellerCenterLayout from '@/components/SellerCenterLayout'

export const metadata = {
  title: 'Panduan Live Streaming – Seller Center Bettazon.id',
  description:
    'Cara mulai live streaming di Bettazon, menjual dan lelang ikan secara real-time, tips agar live ramai, dan cara mendapat lebih banyak penonton.',
}

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=id.bettazon.app'

export default function LivePage() {
  return (
    <SellerCenterLayout
      iconKey="live"
      title="Panduan Live Streaming"
      subtitle="Jual ikan langsung ke ratusan pembeli — real-time, interaktif, dan lebih menguntungkan."
      currentHref="/seller-center/live"
    >
      {/* Persiapan */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-[#008080] text-white text-xs flex items-center justify-center font-bold">1</span>
          Persiapan Sebelum Live
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: '📶', label: 'Koneksi Internet', desc: 'Gunakan WiFi stabil atau 4G dengan sinyal penuh. Koneksi upload minimal 2–4 Mbps direkomendasikan untuk kualitas video stabil.' },
            { icon: '📱', label: 'Perangkat', desc: 'HP dengan kamera yang jernih. Gunakan tripod atau stand HP agar gambar tidak goyang.' },
            { icon: '💡', label: 'Pencahayaan', desc: 'Pastikan ruangan terang. Ring light atau lampu akuarium yang kuat sangat membantu.' },
            { icon: '🐠', label: 'Stok Ikan', desc: 'Siapkan ikan yang akan dijual/dilelang. Susun berurutan agar sesi berjalan lancar.' },
            { icon: '🎙️', label: 'Suara', desc: 'Minimalisasi kebisingan latar. Bicara jelas dan antusias — itu kunci penonton betah.' },
            { icon: '📋', label: 'List Produk', desc: 'Buat daftar ikan beserta harga awal dan minimum bid sebelum live dimulai.' },
          ].map(({ icon, label, desc }) => (
            <div key={label} className="flex gap-3 items-start bg-gray-50 rounded-xl p-3 text-sm">
              <span className="text-xl flex-shrink-0">{icon}</span>
              <div>
                <span className="font-semibold text-gray-900">{label}: </span>
                <span className="text-gray-600">{desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mulai Live */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-[#008080] text-white text-xs flex items-center justify-center font-bold">2</span>
          Cara Mulai Sesi Live
        </h2>
        <div className="space-y-3 text-sm text-gray-700">
          {[
            'Buka aplikasi Bettazon → tap ikon kamera/live di navigasi bawah.',
            'Pastikan kamu sudah login sebagai seller. Jika belum, daftar seller dulu.',
            'Isi judul sesi live yang menarik, contoh: "Flash Sale Cupang Premium Malam Ini! 🔥"',
            'Pilih kategori live (jual langsung / lelang / keduanya).',
            'Tap "Mulai Live" — kamera aktif dan pembeli bisa langsung bergabung.',
            'Sapa penonton yang baru masuk agar mereka betah dan invite teman.',
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

      {/* Jual di Live */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-[#008080] text-white text-xs flex items-center justify-center font-bold">3</span>
          Cara Menjual & Lelang di Live
        </h2>
        <div className="space-y-4 text-sm text-gray-700">
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-bold text-gray-900 mb-2">Jual Langsung (Beli Sekarang)</h3>
            <p>Tap "Tampilkan Produk" → pilih produk dari katalog tokomu → tap "Pinkan di Live". Produk muncul di layar pembeli dengan tombol beli. Pembeli tap → langsung checkout.</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-bold text-gray-900 mb-2">Lelang di Live</h3>
            <p>Tap <strong>"Buat Lelang"</strong> → isi 3 field: <em>nama ikan</em>, <em>harga awal</em>, dan <em>kelipatan bid minimum</em> → tap <strong>"Mulai"</strong>. <strong>Tidak ada durasi</strong> — lelang berjalan hingga kamu tap <strong>"Stop Lelang"</strong> untuk menetapkan pemenang. Pemenang mendapat notifikasi dan wajib checkout dalam <strong>15 menit</strong>.</p>
          </div>
        </div>
      </section>

      {/* Akhiri */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-[#008080] text-white text-xs flex items-center justify-center font-bold">4</span>
          Mengakhiri Sesi Live
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          Tap tombol "Akhiri Live" di pojok atas. Pastikan semua item yang dilelang sudah ada pemenangnya atau ditutup terlebih dahulu. Setelah sesi selesai, kamu bisa melihat rekap penjualan: total pembeli, item terjual, dan total omzet sesi tersebut.
        </p>
      </section>

      {/* Tips */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">💡 Tips Live Selalu Ramai</h2>
        <div className="space-y-2.5 text-sm text-gray-700">
          {[
            { icon: '📢', tip: 'Umumkan jadwal live H-1 di grup WA seller dan story medsos kamu.' },
            { icon: '⏰', tip: 'Jam live terbaik: Sabtu–Minggu pukul 19:00–22:00 WIB, atau weekday setelah jam 20:00.' },
            { icon: '🎁', tip: 'Buat gimmick: "Penonton ke-50 dapat diskon!" atau "First buyer dapat bonus anabul!"' },
            { icon: '💬', tip: 'Aktif balas komentar dan pertanyaan penonton — interaksi = penonton betah lebih lama.' },
            { icon: '🔄', tip: 'Konsisten live di hari dan jam yang sama setiap minggu agar penonton setia.' },
            { icon: '📌', tip: 'Share link live aktif kamu ke grup WA pembeli agar mereka langsung bergabung.' },
          ].map(({ icon, tip }) => (
            <div key={tip} className="flex gap-3 items-start bg-teal-50 border border-teal-100 rounded-xl p-3">
              <span className="text-lg flex-shrink-0">{icon}</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </section>
    </SellerCenterLayout>
  )
}
