import InfoPageLayout from '@/components/InfoPageLayout'

export const metadata = {
  title: 'FAQ – Bettazon.id',
  description:
    'Pertanyaan yang sering diajukan seputar transaksi, pembayaran, refund, pengiriman, dan dukungan pelanggan Bettazon.id.',
}

const faqs = [
  {
    question: 'Apa itu Bettazon.id?',
    answer:
      'Bettazon.id adalah marketplace ikan hias Indonesia yang menggabungkan beli langsung, page auction, live streaming, dan live auction dalam satu platform.',
  },
  {
    question: 'Metode pembayaran apa yang didukung?',
    answer:
      'Bettazon.id menggunakan iPaymu sebagai metode pembayaran utama untuk semua transaksi, top up wallet, dan checkout. iPaymu menyediakan berbagai metode pembayaran yang aman dan terpercaya.',
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
      'Silakan hubungi tim Bettazon.id melalui support@bettazon.id. Untuk pertanyaan kebijakan dan privasi, silakan kirim ke privacy@bettazon.id.',
  },
]

export default function FaqPage() {
  return (
    <InfoPageLayout
      icon="❓"
      title="FAQ"
      subtitle="Pertanyaan umum tentang transaksi, pembayaran, refund, dan layanan Bettazon.id"
    >
      <div className="space-y-5">
        {faqs.map((item, index) => (
          <section key={item.question} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              {index + 1}. {item.question}
            </h2>
            <p className="text-gray-600 leading-relaxed">{item.answer}</p>
          </section>
        ))}

        <section className="rounded-2xl border border-[#008080]/20 bg-[#008080]/5 p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Kontak & Informasi Perusahaan</h2>
          <div className="space-y-2 text-gray-700">
            <p>📧 Support umum: <a href="mailto:support@bettazon.id" className="text-[#008080] font-medium hover:underline">support@bettazon.id</a></p>
            <p>🔒 Privasi & data pribadi: <a href="mailto:privacy@bettazon.id" className="text-[#008080] font-medium hover:underline">privacy@bettazon.id</a></p>
            <p>🌐 Website: <span className="font-medium">https://bettazon.id</span></p>
            <p>📍 Alamat: <a href="/company-info" className="text-[#008080] font-medium hover:underline">Lihat informasi perusahaan lengkap</a></p>
            <p>📍 Wilayah layanan: Indonesia</p>
          </div>
        </section>
      </div>
    </InfoPageLayout>
  )
}
