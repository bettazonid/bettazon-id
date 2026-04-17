import InfoPageLayout from '@/components/InfoPageLayout'

export const metadata = {
  title: 'Syarat & Ketentuan – Bettazon.id',
  description:
    'Syarat dan ketentuan penggunaan platform Bettazon.id untuk pembeli, penjual, transaksi, pembayaran, ketentuan seller, dan layanan pendukung.',
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
    title: '3. Aturan Penjual Umum',
    body:
      'Penjual wajib memastikan informasi produk, kualitas ikan, harga, stok, dan dokumen verifikasi seller sesuai kondisi sebenarnya. Bettazon.id berhak menunda, meninjau, atau menonaktifkan seller yang melanggar kebijakan platform.',
  },
  {
    title: '3a. Produk yang Boleh dan Tidak Boleh Dijual',
    body:
      'Seller diizinkan menjual ikan hias hidup, perlengkapan akuatik, pakan ikan, dan produk pendukung budidaya ikan hias yang sesuai hukum Indonesia. Seller dilarang menjual: (1) spesies ikan yang dilindungi atau masuk daftar CITES tanpa izin yang sah; (2) produk ilegal, berbahaya, atau menyesatkan; (3) produk yang bukan ikan hias atau tidak relevan dengan kategori platform; (4) item yang melanggar hak kekayaan intelektual pihak ketiga. Bettazon.id berhak menghapus listing yang melanggar ketentuan ini tanpa pemberitahuan sebelumnya.',
  },
  {
    title: '3b. Komisi dan Biaya Platform',
    body:
      'Bettazon.id mengenakan biaya layanan (komisi) atas setiap transaksi yang berhasil diselesaikan melalui platform. Besaran komisi, biaya payment gateway, dan biaya fitur premium (iklan, promosi, live auction) tercantum pada halaman Kebijakan Biaya yang dapat diakses di aplikasi atau website. Seller menyetujui bahwa komisi dan biaya tersebut dipotong otomatis dari dana yang diterima sebelum ditransfer ke saldo/rekening seller.',
  },
  {
    title: '3c. Tanggung Jawab Akurasi Listing',
    body:
      'Seller sepenuhnya bertanggung jawab atas kebenaran, kelengkapan, dan keakuratan setiap informasi listing yang dipublikasikan, termasuk foto, deskripsi, kondisi ikan, harga, stok, dan estimasi pengiriman. Seller wajib memperbarui listing secara berkala dan segera menonaktifkan produk yang tidak tersedia. Listing yang terbukti menyesatkan atau mengandung informasi palsu dapat mengakibatkan penghapusan listing, penangguhan akun, dan/atau pengenaan denda sesuai kebijakan platform.',
  },
  {
    title: '3d. Konsekuensi Pelanggaran',
    body:
      'Pelanggaran terhadap ketentuan seller dapat mengakibatkan: (1) penghapusan listing tanpa pemberitahuan; (2) penangguhan sementara akun seller; (3) pencabutan permanen status seller; (4) penahanan dana escrow hingga penyelesaian sengketa; (5) pelaporan kepada pihak berwenang apabila pelanggaran bersifat pidana. Seller yang tidak puas dengan keputusan platform dapat mengajukan keberatan melalui jalur resmi yang tersedia di aplikasi.',
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
    title: '8. Batasan Tanggung Jawab',
    body:
      'Bettazon.id bertindak sebagai platform perantara dan tidak bertanggung jawab atas kerugian yang disebabkan sepenuhnya oleh kelalaian penjual, jasa pengiriman, atau pihak ketiga lainnya. Bettazon.id tidak menjamin ketersediaan layanan 100% sepanjang waktu. Total tanggung jawab Bettazon.id kepada pengguna dalam satu insiden tidak akan melebihi nilai transaksi yang dipersengketakan.',
  },
  {
    title: '9. Kategori Produk dan Item Bernilai Tinggi',
    body:
      'Bettazon.id adalah platform khusus ikan hias dan perlengkapan akuatik. Kategori produk yang diizinkan meliputi: ikan hias hidup, tanaman air, pakan ikan, dan aksesoris akuarium. Untuk item bernilai tinggi (di atas Rp 5.000.000 per unit), Seller wajib menyertakan foto dan video kondisi aktual produk serta menyetujui mekanisme verifikasi tambahan yang ditentukan platform. Bettazon.id berhak menetapkan batas nilai transaksi per kategori sesuai kebijakan manajemen risiko yang berlaku.',
  },
  {
    title: '10. Perubahan Layanan',
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
