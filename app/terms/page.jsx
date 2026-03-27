import InfoPageLayout from '@/components/InfoPageLayout'

export const metadata = {
  title: 'Syarat & Ketentuan – Bettazon.id',
  description:
    'Syarat dan ketentuan penggunaan platform Bettazon.id untuk pembeli, penjual, transaksi, pembayaran, dan layanan pendukung.',
}

const sections = [
  {
    title: '1. Ruang Lingkup Layanan',
    body:
      'Bettazon.id adalah platform marketplace ikan hias yang memfasilitasi pembeli dan penjual untuk melakukan transaksi jual beli langsung, page auction, live streaming, dan live auction.',
  },
  {
    title: '2. Akun Pengguna',
    body:
      'Pengguna wajib memberikan informasi yang benar, akurat, dan terbaru saat mendaftar. Pengguna bertanggung jawab menjaga kerahasiaan akun, kata sandi, dan seluruh aktivitas yang terjadi di akun tersebut.',
  },
  {
    title: '3. Aturan Penjual',
    body:
      'Penjual wajib memastikan informasi produk, kualitas ikan, harga, stok, dan dokumen verifikasi seller sesuai kondisi sebenarnya. Bettazon.id berhak menunda, meninjau, atau menonaktifkan seller yang melanggar kebijakan platform.',
  },
  {
    title: '4. Pembayaran dan Escrow',
    body:
      'Pembayaran diproses melalui payment gateway dan/atau wallet sesuai metode yang tersedia. Pada transaksi tertentu, dana pembeli dapat ditahan sementara melalui mekanisme escrow sampai order selesai atau kondisi transaksi terpenuhi.',
  },
  {
    title: '5. Lelang dan Live Auction',
    body:
      'Penawaran pada page auction dan live auction bersifat mengikat. Pemenang lelang wajib menyelesaikan pembayaran dalam waktu yang ditentukan. Bettazon.id berhak membatalkan hasil lelang bila ditemukan indikasi pelanggaran, fraud, atau gangguan teknis.',
  },
  {
    title: '6. Pengiriman dan Penerimaan',
    body:
      'Pengiriman dilakukan menggunakan mitra logistik dan/atau transshipper sesuai jenis transaksi. Risiko, tanggung jawab, dan proses klaim mengikuti kebijakan pengiriman serta kebijakan refund Bettazon.id.',
  },
  {
    title: '7. Larangan Penggunaan',
    body:
      'Pengguna dilarang menggunakan platform untuk penipuan, manipulasi harga, penawaran palsu, penyalahgunaan pembayaran, spam, atau aktivitas yang bertentangan dengan hukum yang berlaku di Indonesia.',
  },
  {
    title: '8. Perubahan Layanan',
    body:
      'Bettazon.id dapat menyesuaikan fitur, alur transaksi, metode pembayaran, dan kebijakan layanan dari waktu ke waktu dengan pemberitahuan yang wajar melalui aplikasi atau website.',
  },
]

export default function TermsPage() {
  return (
    <InfoPageLayout
      icon="📜"
      title="Syarat & Ketentuan"
      subtitle="Ketentuan penggunaan platform Bettazon.id untuk pembeli dan penjual"
    >
      <div className="space-y-6">
        <p className="text-gray-600 leading-relaxed">
          Dengan mengakses website, mengunduh aplikasi, mendaftar akun, atau menggunakan layanan
          Bettazon.id, Anda menyatakan telah membaca, memahami, dan menyetujui syarat & ketentuan
          berikut ini.
        </p>

        {sections.map((section) => (
          <section key={section.title} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-2">{section.title}</h2>
            <p className="text-gray-600 leading-relaxed">{section.body}</p>
          </section>
        ))}

        <section className="rounded-2xl border border-[#FE735C]/20 bg-[#FE735C]/5 p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Kontak</h2>
          <p className="text-gray-700 leading-relaxed">
            Jika Anda memerlukan klarifikasi terkait syarat & ketentuan ini, silakan hubungi
            Bettazon.id melalui <a href="mailto:official@bettazon.id" className="text-[#008080] font-medium hover:underline">official@bettazon.id</a>.
          </p>
        </section>
      </div>
    </InfoPageLayout>
  )
}
