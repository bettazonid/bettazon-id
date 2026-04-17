import InfoPageLayout from '@/components/InfoPageLayout'

export const metadata = {
  title: 'FAQ – Bettazon.id',
  description:
    'Pertanyaan yang sering diajukan seputar transaksi, pembayaran, refund, pengiriman, penjualan, dan dukungan pelanggan Bettazon.id.',
}

const categories = [
  {
    title: 'Umum',
    items: [
      {
        question: 'Apa itu Bettazon.id?',
        answer:
          'Bettazon.id adalah marketplace khusus ikan hias terpercaya di Indonesia. Platform ini menghubungkan pembeli dan penjual ikan hias melalui fitur beli langsung, lelang halaman (page auction), dan lelang live streaming.',
      },
      {
        question: 'Apakah aplikasi Bettazon gratis?',
        answer:
          'Mengunduh dan menggunakan aplikasi Bettazon sepenuhnya gratis. Pembeli tidak dikenakan biaya pendaftaran. Penjual dikenakan biaya layanan 0% selama masa launching sebagai bagian dari program Founding Seller.',
      },
      {
        question: 'Bagaimana cara mendaftar?',
        answer:
          'Unduh aplikasi Bettazon dari Google Play Store, lalu pilih "Daftar Sekarang". Isi email atau nomor HP, verifikasi melalui OTP, dan akun Anda siap digunakan. Daftar juga bisa menggunakan akun Google.',
      },
      {
        question: 'Apakah Bettazon melayani pembeli dari luar negeri?',
        answer:
          'Ya. Pembeli dari luar negeri dapat melakukan pembelian dan membayar menggunakan kartu Visa atau Mastercard. Pengiriman ke luar negeri difasilitasi melalui jaringan transhipper yang terintegrasi di dalam aplikasi.',
      },
    ],
  },
  {
    title: 'Pembelian',
    items: [
      {
        question: 'Bagaimana cara membeli ikan hias?',
        answer:
          'Cari ikan yang diinginkan di halaman Jelajah. Pilih produk, tekan "Beli Sekarang" atau "Tambah ke Keranjang". Pilih alamat pengiriman, metode pembayaran, lalu konfirmasi pesanan.',
      },
      {
        question: 'Apa itu sistem Escrow?',
        answer:
          'Escrow adalah fitur keamanan transaksi Bettazon. Dana pembayaran Anda ditahan oleh Bettazon dan baru diteruskan ke penjual setelah Anda menerima dan mengkonfirmasi kondisi ikan. Jika ada masalah, dana dikembalikan ke Anda.',
      },
      {
        question: 'Bagaimana cara mengikuti lelang halaman?',
        answer:
          'Buka halaman detail produk lelang, lalu tekan "Pasang Penawaran". Masukkan nominal bid di atas harga saat ini. Jika Anda adalah penawar tertinggi saat waktu habis, Anda memenangkan lelang dan dapat langsung checkout.',
      },
      {
        question: 'Bagaimana cara mengikuti lelang live?',
        answer:
          'Buka menu Live di navigasi bawah. Pilih sesi live yang sedang berlangsung. Saat seller menampilkan ikan, masukkan penawaran via kolom bid. Pemenang akan diminta checkout di akhir sesi.',
      },
    ],
  },
  {
    title: 'Penjualan',
    items: [
      {
        question: 'Bagaimana cara menjadi penjual?',
        answer:
          'Buka halaman Profil, lalu pilih "Daftar Jadi Seller". Isi data toko termasuk nama toko, kota asal, dan informasi kontak. Setelah pendaftaran disetujui, Anda dapat mulai menambahkan produk.',
      },
      {
        question: 'Berapa biaya untuk berjualan di Bettazon?',
        answer:
          'Selama masa launching, penjual Founding Seller tidak dikenakan biaya komisi (0%). Setelah masa launching berakhir, detail biaya layanan akan diinformasikan melalui notifikasi aplikasi.',
      },
      {
        question: 'Bagaimana cara menambahkan produk?',
        answer:
          'Di halaman Profil, pilih "Kelola Produk" lalu tekan tombol (+). Isi detail produk meliputi nama, jenis, deskripsi, harga, stok, foto, dan jenis listing (langsung/lelang). Simpan untuk dipublikasikan.',
      },
      {
        question: 'Kapan dana hasil penjualan cair?',
        answer:
          'Dana dari penjualan masuk ke Bettazon Wallet setelah pembeli mengkonfirmasi penerimaan barang, atau secara otomatis setelah batas waktu konfirmasi habis. Selanjutnya Anda dapat melakukan penarikan ke rekening bank.',
      },
    ],
  },
  {
    title: 'Pembayaran',
    items: [
      {
        question: 'Metode pembayaran apa saja yang tersedia?',
        answer:
          'Untuk pembeli dalam negeri: Transfer bank (Virtual Account BCA, BNI, BRI, Mandiri, dll.), dompet digital (GoPay, ShopeePay, OVO, DANA), gerai minimarket (Indomaret, Alfamart), QRIS, dan Bettazon Wallet. Untuk pembeli internasional: kartu kredit/debit Visa dan Mastercard.',
      },
      {
        question: 'Apa itu Bettazon Wallet?',
        answer:
          'Bettazon Wallet adalah dompet digital di dalam aplikasi. Anda dapat mengisi saldo (top up) dan menggunakannya untuk pembayaran yang lebih cepat. Penjual juga menerima hasil penjualan di Wallet sebelum menariknya ke rekening bank.',
      },
      {
        question: 'Apakah transaksi aman?',
        answer:
          'Ya. Bettazon.id menggunakan mekanisme escrow sehingga dana pembeli ditahan sementara sampai pesanan diterima atau proses transaksi selesai. Semua pembayaran diproses oleh payment gateway berlisensi Bank Indonesia.',
      },
      {
        question: 'Transaksi saya gagal, apa yang harus dilakukan?',
        answer:
          'Pastikan metode pembayaran Anda memiliki saldo/limit cukup. Jika dana sudah terpotong namun status pesanan tidak berubah, hubungi kami di official@bettazon.id dengan menyertakan screenshot bukti pembayaran dan nomor pesanan.',
      },
    ],
  },
  {
    title: 'Pengiriman',
    items: [
      {
        question: 'Bagaimana pengiriman ikan hias dilakukan?',
        answer:
          'Penjual mengemas ikan sesuai standar dan mengirim melalui jasa ekspedisi yang dipilih. Metode pengemasan harus sesuai agar ikan aman selama perjalanan. Nomor resi dapat dilacak di halaman pesanan.',
      },
      {
        question: 'Apa itu transhipper?',
        answer:
          'Transhipper adalah mitra pengiriman yang membantu pengiriman ikan hias ke luar negeri. Seller mengirimkan ikan ke gudang transhipper lokal, lalu transhipper mengurus pengiriman internasional ke negara tujuan.',
      },
      {
        question: 'Apakah tersedia pengiriman internasional?',
        answer:
          'Ya. Bettazon menyediakan layanan pengiriman internasional melalui jaringan transhipper. Pada proses checkout, pilih opsi pengiriman internasional dan pilih transhipper yang tersedia di kota Anda.',
      },
      {
        question: 'Bagaimana jika ikan saya mati saat pengiriman?',
        answer:
          'Segera dokumentasikan kondisi ikan (foto/video) saat menerima paket. Ajukan komplain melalui halaman pesanan dalam waktu 1×24 jam setelah paket diterima. Tim Bettazon akan memediasi penyelesaian dengan penjual.',
      },
    ],
  },
  {
    title: 'Refund & Sengketa',
    items: [
      {
        question: 'Kapan saya bisa mengajukan refund?',
        answer:
          'Refund dapat diajukan jika: (1) ikan tidak sesuai deskripsi, (2) ikan mati/sakit saat tiba dan bukan akibat kesalahan pembeli, (3) paket tidak datang dalam batas waktu yang ditentukan, (4) penjual membatalkan pesanan sepihak.',
      },
      {
        question: 'Bagaimana cara mengajukan refund?',
        answer:
          'Buka halaman "Pesanan Saya", pilih pesanan terkait, lalu tekan "Ajukan Refund/Komplain". Sertakan foto/video bukti dan deskripsi masalah. Tim Bettazon akan merespons dalam 1×3 hari kerja.',
      },
      {
        question: 'Berapa lama proses refund?',
        answer:
          'Setelah pengajuan disetujui, dana dikembalikan dalam 3–7 hari kerja ke metode pembayaran asal. Untuk Bettazon Wallet, refund bisa lebih cepat.',
      },
    ],
  },
]

// kept for backward compat — unused after refactor
// kept for backward compat — unused after refactor
const faqs = [
  {
    question: 'Apa itu Bettazon.id?',
    answer:
      'Bettazon.id adalah marketplace ikan hias Indonesia yang menggabungkan beli langsung, page auction, live streaming, dan live auction dalam satu platform.',
  },
  {
    question: 'Metode pembayaran apa yang didukung?',
    answer:
      'Bettazon.id menggunakan payment gateway berlisensi Bank Indonesia untuk semua transaksi, top up wallet, dan checkout. Tersedia transfer bank / virtual account (BCA, BNI, BRI, dll.), dompet digital (GoPay, ShopeePay, QRIS), kartu kredit/debit, dan minimarket (Indomaret, Alfamart).',
  },
  {
    question: 'Apakah transaksi aman?',
    answer:
      'Ya. Bettazon.id menggunakan mekanisme escrow sehingga dana pembeli ditahan sementara sampai pesanan diterima atau proses transaksi selesai sesuai status order.',
  },
  {
    question: 'Bagaimana proses refund?',
    answer:
      'Refund mengikuti status transaksi dan hasil verifikasi. Dana dapat dikembalikan jika pesanan dibatalkan, pembayaran gagal, atau terjadi kondisi tertentu sesuai kebijakan refund Bettazon.id.',
  },
  {
    question: 'Apakah Bettazon.id melayani pengiriman ke luar negeri?',
    answer:
      'Ya, Bettazon.id menyiapkan alur pengiriman domestik dan internasional melalui mitra transshipper sesuai spesifikasi pengiriman yang berlaku.',
  },
  {
    question: 'Bagaimana cara menjadi penjual?',
    answer:
      'Anda dapat mendaftar sebagai seller melalui aplikasi Bettazon.id, melengkapi profil toko, serta menyerahkan dokumen verifikasi yang dibutuhkan sebelum mulai berjualan.',
  },
  {
    question: 'Bagaimana jika saya butuh bantuan terkait order atau pembayaran?',
    answer:
      'Silakan hubungi tim Bettazon.id melalui official@bettazon.id. Untuk pertanyaan kebijakan dan privasi, silakan kirim ke official@bettazon.id.',
  },
]

export default function FaqPage() {
  return (
    <InfoPageLayout
      icon="❓"
      title="FAQ & Bantuan"
      subtitle="Pertanyaan umum tentang transaksi, pembayaran, refund, pengiriman, dan layanan Bettazon.id"
    >
      <div className="space-y-8">
        {categories.map((cat) => (
          <section key={cat.title}>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{cat.title}</h2>
            <div className="space-y-3">
              {cat.items.map((item, index) => (
                <div key={item.question} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                  <h3 className="text-base font-bold text-gray-900 mb-2">
                    {index + 1}. {item.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className="rounded-2xl border border-[#008080]/20 bg-[#008080]/5 p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Masih ada pertanyaan?</h2>
          <div className="space-y-2 text-gray-700 text-sm">
            <p>💬 WhatsApp: <a href="https://wa.me/6282186287929" target="_blank" rel="noopener noreferrer" className="text-[#008080] font-medium hover:underline">+62 821-8628-7929</a></p>
            <p>📧 Support umum: <a href="mailto:official@bettazon.id" className="text-[#008080] font-medium hover:underline">official@bettazon.id</a></p>
            <p>🔒 Privasi & data pribadi: <a href="mailto:privacy@bettazon.id" className="text-[#008080] font-medium hover:underline">privacy@bettazon.id</a></p>
            <p>🌐 Website: <span className="font-medium">https://bettazon.id</span></p>
            <p>📍 <a href="/company-info" className="text-[#008080] font-medium hover:underline">Lihat informasi perusahaan lengkap</a></p>
            <p className="text-gray-500 pt-1">Jam operasional: Senin – Sabtu, 08.00 – 17.00 WIB</p>
          </div>
        </section>
      </div>
    </InfoPageLayout>
  )
}
