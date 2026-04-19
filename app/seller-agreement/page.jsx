import InfoPageLayout from '@/components/InfoPageLayout';

export const metadata = {
  metadataBase: new URL('https://bettazon.id'),
  title: 'Perjanjian Seller | Bettazon',
  description:
    'Perjanjian lengkap antara Seller dan platform Bettazon mencakup hak, kewajiban, pengiriman, live auction, wallet, dan ketentuan verifikasi.',
  openGraph: {
    title: 'Perjanjian Seller Bettazon',
    description: 'Ketentuan resmi yang mengatur hubungan antara Seller dan Bettazon.',
    url: 'https://bettazon.id/seller-agreement',
    siteName: 'Bettazon',
    type: 'website',
  },
};

const AGREEMENT_VERSION = '1.0';
const EFFECTIVE_DATE = '1 Juli 2025';

export default function SellerAgreementPage() {
  return (
    <InfoPageLayout title="Perjanjian Seller Bettazon">
      <div className="text-sm text-gray-500 mb-6">
        Versi {AGREEMENT_VERSION} &bull; Berlaku sejak {EFFECTIVE_DATE}
      </div>

      {/* Download Button */}
      <div className="mb-8">
        <a
          href="/docs/Bettazon_Seller_Agreement.docx"
          download
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-medium"
          style={{ backgroundColor: '#008080' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M8 12l4 4 4-4M12 4v12" />
          </svg>
          Unduh Perjanjian (.docx)
        </a>
      </div>

      <p className="text-gray-600 mb-8 leading-relaxed">
        Perjanjian ini (&ldquo;Perjanjian&rdquo;) mengatur hubungan antara pengguna yang mendaftarkan diri
        sebagai Seller (&ldquo;Seller&rdquo;) dengan PT Bettazon Sukses Indonesia (&ldquo;Bettazon&rdquo;) yang
        mengelola platform jual beli ikan hias <strong>Bettazon</strong> melalui aplikasi mobile dan situs web.
        Dengan menekan tombol &ldquo;Setuju&rdquo; saat pendaftaran, Seller dianggap telah membaca,
        memahami, dan menyetujui seluruh ketentuan dalam Perjanjian ini.
      </p>

      <Section title="Pasal 1 — Definisi">
        <p>Dalam Perjanjian ini yang dimaksud dengan:</p>
        <ul>
          <li><strong>Platform</strong>: aplikasi mobile dan situs web Bettazon.</li>
          <li><strong>Seller</strong>: pengguna yang telah mendaftarkan akun sebagai penjual di Platform.</li>
          <li><strong>Buyer</strong>: pengguna yang melakukan pembelian di Platform.</li>
          <li><strong>Produk</strong>: ikan hias dan/atau perlengkapan akuarium yang dijual melalui Platform.</li>
          <li><strong>Wallet</strong>: dompet digital Bettazon milik Seller yang menampung hasil penjualan.</li>
          <li><strong>Escrow</strong>: mekanisme penahanan dana Buyer oleh Bettazon hingga transaksi selesai.</li>
        </ul>
      </Section>

      <Section title="Pasal 2 — Syarat Pendaftaran Seller">
        <p>2.1 Seller wajib merupakan individu berusia minimal 17 tahun atau badan usaha yang sah berdasarkan hukum Indonesia.</p>
        <p>2.2 Seller wajib memberikan informasi yang akurat, lengkap, dan terkini pada saat pendaftaran dan setiap kali terjadi perubahan data.</p>
        <p>2.3 Satu identitas (KTP/badan usaha) hanya dapat dikaitkan dengan satu akun Seller aktif.</p>
      </Section>

      <Section title="Pasal 3 — Kewajiban Seller">
        <p>3.1 Seller wajib menjaga kerahasiaan akun dan bertanggung jawab atas seluruh aktivitas yang dilakukan melalui akunnya.</p>
        <p>3.2 Seller wajib mematuhi seluruh peraturan perundang-undangan Indonesia yang berlaku, termasuk ketentuan terkait perdagangan satwa dan lingkungan hidup.</p>
        <p>3.3 Seller wajib segera melaporkan kepada Bettazon jika mengetahui adanya pelanggaran atau penyalahgunaan akun.</p>
      </Section>

      <Section title="Pasal 4 — Ketentuan Produk dan Listing">
        <p>4.1 Seller bertanggung jawab penuh atas keakuratan judul, deskripsi, foto, dan harga produk yang ditampilkan.</p>
        <p>4.2 Seller dilarang menjual produk yang dilarang oleh hukum, termasuk spesies ikan yang dilindungi tanpa izin resmi.</p>
        <p>4.3 Bettazon berhak menurunkan listing yang melanggar pedoman platform tanpa pemberitahuan terlebih dahulu.</p>
      </Section>

      <Section title="Pasal 5 — Harga dan Komisi">
        <p>5.1 Seller menetapkan harga jual produk secara mandiri.</p>
        <p>5.2 Bettazon memungut komisi atas setiap transaksi yang berhasil. Besaran komisi saat ini adalah <strong>10% (sepuluh persen)</strong> dari nilai transaksi dan tercantum pada halaman Kebijakan Biaya di Platform. Komisi dapat berubah sewaktu-waktu dengan pemberitahuan 14 hari sebelumnya.</p>
        <p>5.3 Komisi dipotong otomatis dari dana yang masuk ke Wallet Seller.</p>
      </Section>

      <Section title="Pasal 6 — Transaksi dan Pembayaran Buyer">
        <p>6.1 Buyer melakukan pembayaran melalui metode yang disediakan oleh Bettazon.</p>
        <p>6.2 Bettazon tidak bertanggung jawab atas kegagalan pembayaran yang disebabkan oleh pihak Buyer atau penyedia layanan pembayaran.</p>
      </Section>

      <Section title="Pasal 7 — Pengembalian Barang dan Sengketa">
        <p>7.1 Kebijakan pengembalian barang mengikuti Kebijakan Pengembalian Bettazon yang berlaku saat transaksi terjadi.</p>
        <p>7.2 Bettazon bertindak sebagai mediator dalam sengketa antara Seller dan Buyer. Keputusan Bettazon bersifat final untuk sengketa di dalam platform.</p>
      </Section>

      <Section title="Pasal 8 — Sanksi dan Penangguhan Akun">
        <p>8.1 Bettazon berhak memberikan peringatan, membatasi fitur, menangguhkan, atau menghapus akun Seller yang terbukti melanggar ketentuan Perjanjian ini.</p>
        <p>8.2 Penangguhan akun tidak serta-merta menghapus kewajiban Seller yang belum terselesaikan.</p>
      </Section>

      <Section title="Pasal 9 — Perubahan Ketentuan">
        <p>9.1 Bettazon berhak mengubah Perjanjian ini sewaktu-waktu.</p>
        <p>9.2 Perubahan material akan diberitahukan melalui notifikasi aplikasi atau email minimal 14 hari sebelum berlaku.</p>
        <p>9.3 Penggunaan Platform setelah tanggal berlakunya perubahan dianggap sebagai persetujuan atas perubahan tersebut.</p>
      </Section>

      <Section title="Pasal 10 — Hukum yang Berlaku">
        <p>Perjanjian ini diatur oleh dan ditafsirkan sesuai dengan hukum Negara Republik Indonesia. Sengketa yang tidak dapat diselesaikan secara musyawarah akan diselesaikan melalui Pengadilan Negeri Palembang.</p>
      </Section>

      <Section title="Pasal 11 — Standar Layanan Pengiriman (SLA)">
        <p>11.1 <strong>Batas Waktu Proses Pesanan:</strong> Seller wajib memproses dan mengkonfirmasi pengiriman pesanan dalam waktu maksimal 2×24 jam hari kerja setelah pembayaran Buyer dikonfirmasi oleh sistem.</p>
        <p>11.2 <strong>Standar Pengemasan:</strong> Seller bertanggung jawab penuh atas standar pengemasan ikan hias yang memadai (kantong oksigen, kardus, insulasi, dll.) untuk memastikan ikan tiba dalam kondisi hidup dan sehat. Kematian ikan akibat pengemasan yang tidak layak menjadi tanggung jawab Seller.</p>
        <p>11.3 <strong>Pemilihan Jasa Kurir:</strong> Seller wajib menggunakan jasa kurir yang tersedia dan diintegrasikan dalam platform Bettazon. Pengiriman di luar sistem platform tidak dijamin dan tidak ter-cover oleh mekanisme escrow.</p>
        <p>11.4 <strong>Pelanggaran SLA:</strong> Kegagalan memenuhi SLA pengiriman secara berulang dapat mengakibatkan penurunan peringkat toko, pembatasan fitur, atau penangguhan akun Seller.</p>
      </Section>

      <Section title="Pasal 12 — Ketentuan Live Streaming dan Live Auction">
        <p>12.1 Seluruh transaksi yang terjadi selama sesi live streaming atau live auction wajib diproses melalui sistem platform Bettazon. Seller dilarang mengarahkan Buyer untuk bertransaksi di luar platform selama atau setelah sesi live.</p>
        <p>12.2 Penawaran yang telah diterima dan dikonfirmasi dalam sesi live auction bersifat mengikat. Seller tidak boleh membatalkan penawaran yang telah dimenangkan Buyer tanpa alasan yang sah dan persetujuan Bettazon.</p>
        <p>12.3 Seller bertanggung jawab atas konten yang ditampilkan selama live streaming, termasuk informasi produk yang akurat. Konten yang melanggar hukum, mengandung unsur penipuan, atau tidak senonoh akan mengakibatkan penghentian sesi dan sanksi akun.</p>
        <p>12.4 Bettazon berhak merekam, menyimpan, dan menggunakan konten live streaming untuk keperluan moderasi, bukti sengketa, dan peningkatan layanan platform.</p>
      </Section>

      <Section title="Pasal 13 — Wallet, Escrow, dan Pencairan Dana">
        <p>13.1 <strong>Mekanisme Escrow:</strong> Dana Buyer akan ditahan dalam sistem escrow Bettazon hingga Buyer mengkonfirmasi penerimaan produk atau batas waktu konfirmasi otomatis habis (maksimal 3 hari kerja setelah status pengiriman &ldquo;terkirim&rdquo;).</p>
        <p>13.2 <strong>Pencairan Dana:</strong> Seller dapat melakukan penarikan dana dari Bettazon Wallet ke rekening bank yang terdaftar. Minimum penarikan adalah Rp 10.000 (sepuluh ribu rupiah). Proses transfer memerlukan 1–3 hari kerja.</p>
        <p>13.3 <strong>Verifikasi Rekening:</strong> Seller wajib mendaftarkan rekening bank atas nama yang sama dengan identitas terdaftar di Bettazon. Bettazon berhak menolak atau menunda pencairan jika terdapat ketidaksesuaian nama rekening.</p>
        <p>13.4 <strong>Hold Dana:</strong> Bettazon berhak menahan dana Seller dalam kondisi: (a) terdapat dispute yang sedang diproses, (b) dugaan aktivitas penipuan, (c) pelanggaran ketentuan yang sedang diinvestigasi, atau (d) kewajiban perpajakan yang belum diselesaikan.</p>
      </Section>

      <Section title="Pasal 14 — Hak Kekayaan Intelektual">
        <p>14.1 Konten yang diunggah Seller (foto, video, deskripsi produk) tetap menjadi milik Seller. Dengan mengunggah konten tersebut, Seller memberikan lisensi non-eksklusif, bebas royalti, dan dapat disublisensikan kepada Bettazon untuk menampilkan, menggandakan, dan mendistribusikan konten tersebut semata-mata untuk keperluan operasional platform.</p>
        <p>14.2 Seller menjamin bahwa seluruh konten yang diunggah tidak melanggar hak kekayaan intelektual pihak manapun. Seller bertanggung jawab atas seluruh klaim pihak ketiga terkait pelanggaran HKI dari konten yang diunggahnya.</p>
        <p>14.3 Logo, merek, desain, dan seluruh kekayaan intelektual milik Bettazon tidak dapat digunakan oleh Seller untuk tujuan apapun tanpa izin tertulis dari Bettazon.</p>
      </Section>

      <Section title="Pasal 14A — Watermark Otomatis pada Konten Produk">
        <p>14A.1 <strong>Penerapan Watermark:</strong> Seluruh foto dan video produk yang diunggah melalui platform Bettazon akan secara otomatis diberi tanda air (<em>watermark</em>) &ldquo;bettazon.id&rdquo; oleh sistem pada sisi server. Proses ini berlaku untuk semua konten yang diunggah sejak fitur ini diaktifkan.</p>
        <p>14A.2 <strong>Tujuan Watermark:</strong> Penerapan watermark bertujuan untuk melindungi integritas konten produk dari penyalahgunaan di luar platform, memperkuat identitas merek Bettazon, dan memberikan bukti keaslian konten yang beredar di internet.</p>
        <p>14A.3 <strong>Tidak Dapat Dihapus:</strong> Watermark ditanamkan langsung ke dalam file foto/video (baked-in) dan tidak dapat dihapus atau dinonaktifkan oleh Seller. Dengan mengunggah konten, Seller menyetujui penerapan watermark ini.</p>
        <p>14A.4 <strong>Kepemilikan Konten:</strong> Penerapan watermark tidak mengubah kepemilikan konten — foto dan video tetap menjadi milik Seller sebagaimana diatur dalam Pasal 14.1. Watermark hanya berfungsi sebagai penanda distribusi melalui platform Bettazon.</p>
      </Section>

      <Section title="Pasal 15 — Force Majeure">
        <p>15.1 Bettazon tidak bertanggung jawab atas keterlambatan atau kegagalan pelaksanaan kewajiban yang disebabkan oleh kejadian di luar kendali yang wajar, termasuk bencana alam, gangguan listrik atau internet secara luas, kebijakan pemerintah, pandemi, atau kerusuhan.</p>
        <p>15.2 Dalam kondisi force majeure, Bettazon akan berupaya memberikan notifikasi kepada Seller sesegera mungkin dan mengambil langkah-langkah yang wajar untuk meminimalkan dampak terhadap operasional platform.</p>
      </Section>

      <Section title="Pasal 16 — Promosi, Iklan, dan Fitur Premium">
        <p>16.1 Bettazon dapat menawarkan fitur promosi berbayar seperti iklan produk (ads), featured listing, dan highlight toko. Biaya dan ketentuan fitur premium tercantum dalam halaman Kebijakan Biaya di platform.</p>
        <p>16.2 Biaya promosi bersifat non-refundable kecuali terjadi kegagalan teknis dari pihak Bettazon yang menyebabkan fitur tidak berfungsi.</p>
        <p>16.3 Bettazon berhak menolak atau menghentikan iklan yang kontennya melanggar ketentuan platform, hukum yang berlaku, atau merugikan reputasi Bettazon.</p>
      </Section>

      <Section title="Pasal 17 — Rating, Ulasan, dan Integritas Platform">
        <p>17.1 Seller dilarang keras memanipulasi sistem rating dan ulasan dengan cara apapun, termasuk meminta, membeli, atau menciptakan ulasan palsu, memaksa Buyer untuk memberikan rating tertentu, atau mengancam Buyer terkait ulasan.</p>
        <p>17.2 Seller boleh merespons ulasan Buyer secara profesional dan sopan. Respons yang bersifat mengancam, menghina, atau memuat informasi pribadi Buyer tanpa izin dilarang dan dapat mengakibatkan penghapusan respons serta sanksi akun.</p>
        <p>17.3 Bettazon berhak menghapus ulasan yang terbukti palsu atau melanggar pedoman komunitas, baik atas laporan Seller maupun atas inisiatif Bettazon sendiri.</p>
      </Section>

      <Section title="Pasal 18 — Dokumen Verifikasi Seller">
        <p>18.1 Dokumen yang wajib diberikan Seller untuk proses verifikasi identitas adalah: (a) foto Kartu Tanda Penduduk (KTP) yang masih berlaku; (b) foto selfie memegang KTP; (c) untuk badan usaha: Nomor Induk Berusaha (NIB) atau Surat Izin Usaha Perdagangan (SIUP).</p>
        <p>18.2 Bettazon dapat sewaktu-waktu meminta dokumen tambahan untuk keperluan kepatuhan (compliance) regulasi, termasuk namun tidak terbatas pada Nomor Pokok Wajib Pajak (NPWP) untuk Seller dengan volume transaksi di atas ambang batas tertentu.</p>
        <p>18.3 Seluruh dokumen yang diserahkan Seller akan diperlakukan sebagai data rahasia dan digunakan semata-mata untuk keperluan verifikasi identitas dan pemenuhan kewajiban regulasi. Dokumen tidak akan dibagikan kepada pihak ketiga kecuali diwajibkan oleh hukum.</p>
      </Section>

      <div className="mt-10 p-4 rounded-lg bg-teal-50 border border-teal-200 text-sm text-teal-800">
        <strong>PT Bettazon Sukses Indonesia</strong><br />
        Jl. Husin Basri Perumahan Grand Berdikari Blok G16 Rt/Rw. 002/005,<br />
        Kel. Sukamulya, Kec. Sematang Borang, Palembang, Sumatera Selatan 30162<br />
        Email: <a href="mailto:official@bettazon.id" className="underline">official@bettazon.id</a>
      </div>
    </InfoPageLayout>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-base font-semibold text-gray-800 mb-3">{title}</h2>
      <div className="space-y-2 text-gray-600 leading-relaxed">{children}</div>
    </div>
  );
}
