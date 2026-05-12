import SellerCenterLayout from '@/components/SellerCenterLayout'

export const metadata = {
  title: 'FAQ Seller – Seller Center Bettazon.id',
  description:
    'Pertanyaan yang sering diajukan oleh seller Bettazon.id seputar pendaftaran, produk, pesanan, pembayaran, pengiriman, dan live streaming.',
}

const faqs = [
  {
    category: '🏪 Pendaftaran & Toko',
    items: [
      {
        q: 'Berapa biaya untuk menjadi seller di Bettazon?',
        a: 'Gratis! Tidak ada biaya pendaftaran. Untuk Founding Seller (seller yang bergabung di masa launching), komisi transaksi juga 0%. Kamu hanya perlu download aplikasi dan daftar.',
      },
      {
        q: 'Berapa lama proses persetujuan akun seller?',
        a: 'Proses daftar seller langsung aktif setelah kamu submit formulir pendaftaran. Tidak ada masa tunggu — kamu bisa langsung mulai upload produk setelah terdaftar.',
      },
      {
        q: 'Apakah bisa berjualan tanpa verifikasi KTP?',
        a: 'Kamu bisa buka toko dan upload produk, tapi fitur pencairan dana hanya tersedia setelah verifikasi KTP selesai. Verifikasi juga diperlukan untuk mendapat badge "Terverifikasi" yang meningkatkan kepercayaan pembeli.',
      },
      {
        q: 'Bisakah satu akun punya lebih dari satu toko?',
        a: 'Saat ini satu akun hanya bisa memiliki satu toko seller. Jika kamu butuh memisahkan brand, gunakan akun yang berbeda dengan email/nomor HP berbeda.',
      },
      {
        q: 'Bagaimana cara mengubah nama toko?',
        a: 'Buka Profil → Pengaturan Toko → Edit Nama Toko. Simpan perubahan untuk langsung aktif.',
      },
    ],
  },
  {
    category: '📦 Produk & Listing',
    items: [
      {
        q: 'Berapa maksimal foto yang bisa diupload per produk?',
        a: 'Maksimal 8 foto dan 1 video (maks. 30MB) per produk. Minimal 1 foto wajib diunggah sebelum produk bisa dipublikasi. Direkomendasikan upload beberapa foto dari berbagai sudut agar listing terlihat meyakinkan.',
      },
      {
        q: 'Apakah semua jenis ikan bisa dijual di Bettazon?',
        a: 'Bettazon fokus pada ikan hias. Ikan konsumsi tidak tersedia di kategori produk. Pastikan ikan yang dijual bukan termasuk spesies dilindungi. Cek halaman Kebijakan Seller untuk daftar produk yang tidak diizinkan.',
      },
      {
        q: 'Kenapa produk saya tidak muncul di pencarian?',
        a: 'Beberapa kemungkinan: produk masih dalam status draft, kategori tidak sesuai, atau toko kamu sedang dalam pemantauan. Cek tab "Draft" di halaman Kelola Produk untuk produk yang belum dipublikasi.',
      },
      {
        q: 'Bisakah harga produk diubah saat ada pesanan aktif?',
        a: 'Tidak bisa. Harga yang berlaku adalah harga saat pembeli melakukan checkout. Perubahan harga hanya berlaku untuk pesanan baru setelah perubahan disimpan.',
      },
    ],
  },
  {
    category: '🛒 Pesanan & Pengiriman',
    items: [
      {
        q: 'Apa yang terjadi jika saya tidak konfirmasi pesanan dalam 24 jam?',
        a: 'Pesanan otomatis dibatalkan dan dana dikembalikan ke pembeli. Pembatalan yang sering terjadi akan mempengaruhi skor performa toko dan dapat berujung pada peringatan akun.',
      },
      {
        q: 'Apakah saya harus mengantar paket sendiri ke kurir?',
        a: 'Bettazon bekerja sama langsung dengan jasa pengiriman, jadi seller tidak perlu membayar ongkir secara manual. Kamu cukup drop paket ke loket atau titik antar yang ditentukan oleh kurir yang dipilih. Tidak ada proses pickup otomatis saat ini — cukup datang ke counter dan serahkan paket.',
      },
      {
        q: 'Apa yang terjadi jika ikan mati saat pengiriman?',
        a: 'Pembeli bisa mengajukan komplain dengan foto/video bukti dalam 24 jam setelah paket diterima. Tim Bettazon akan memediasi. Pastikan kamu selalu foto kondisi ikan sebelum packing sebagai bukti dari sisi seller.',
      },
      {
        q: 'Bisakah pesanan dibatalkan setelah dikonfirmasi?',
        a: 'Bisa, selama belum ada resi yang diinput. Masuk ke detail pesanan → tap "Batalkan Pesanan" dan isi alasan. Pembatalan oleh seller yang sering terjadi dapat memengaruhi performa toko.',
      },
    ],
  },
  {
    category: '💰 Pembayaran & Pencairan',
    items: [
      {
        q: 'Kapan dana hasil penjualan bisa dicairkan?',
        a: 'Dana masuk ke dompet Bettazon setelah pesanan selesai (pembeli konfirmasi atau auto-release 3 hari setelah terkirim). Setelah itu bisa langsung ditarik ke rekening bank kapan saja.',
      },
      {
        q: 'Berapa minimum penarikan saldo?',
        a: 'Minimal Rp 50.000 per penarikan. Tidak ada biaya admin untuk penarikan.',
      },
      {
        q: 'Berapa lama dana sampai ke rekening setelah tarik saldo?',
        a: 'Dana diproses dalam 1–3 hari kerja (Senin–Jumat, tidak termasuk hari libur nasional).',
      },
      {
        q: 'Metode pembayaran apa saja yang diterima?',
        a: 'Transfer bank (BCA, BNI, BRI, Mandiri, dan 100+ bank lainnya), QRIS, GoPay, OVO, Dana, ShopeePay, serta kartu Visa/Mastercard untuk pembeli internasional.',
      },
    ],
  },
  {
    category: '🎥 Live & Lelang',
    items: [
      {
        q: 'Apakah ada minimum followers untuk bisa live?',
        a: 'Tidak ada syarat minimum followers. Semua seller yang sudah terverifikasi bisa langsung mulai live streaming.',
      },
      {
        q: 'Apa yang terjadi jika pemenang lelang tidak bayar?',
        a: 'Pemenang yang tidak checkout dalam batas waktu (15 menit untuk lelang live, 24 jam untuk lelang halaman) dianggap wanprestasi. Item bisa dilelang ulang dan pembeli tersebut mendapat catatan di akun mereka.',
      },
      {
        q: 'Bisakah sesi live direkam dan dibagikan?',
        a: 'Kamu bisa merekam layarmu sendiri dan membagikannya. Bettazon tidak menyediakan fitur record otomatis untuk saat ini.',
      },
    ],
  },
]

export default function FAQSellerPage() {
  return (
    <SellerCenterLayout
      icon="❓"
      title="FAQ Seller"
      subtitle="Jawaban atas pertanyaan yang paling sering ditanyakan oleh seller Bettazon."
      currentHref="/seller-center/faq"
    >
      <div className="space-y-10">
        {faqs.map(({ category, items }) => (
          <section key={category}>
            <h2 className="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              {category}
            </h2>
            <div className="space-y-4">
              {items.map(({ q, a }) => (
                <div key={q} className="bg-gray-50 rounded-2xl p-4 sm:p-5">
                  <h3 className="font-bold text-gray-900 text-sm mb-2">{q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Kontak */}
      <div className="mt-10 pt-6 border-t border-gray-100 text-center">
        <p className="text-gray-500 text-sm mb-3">Tidak menemukan jawaban yang kamu cari?</p>
        <a
          href="https://wa.me/6282186287929?text=Halo%20Bettazon%2C%20saya%20seller%20dan%20ingin%20bertanya%20tentang..."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Tanya via WhatsApp
        </a>
      </div>
    </SellerCenterLayout>
  )
}
