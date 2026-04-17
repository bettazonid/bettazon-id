import InfoPageLayout from '@/components/InfoPageLayout'

export const metadata = {
  title: 'Refund Policy – Bettazon.id',
  description:
    'Kebijakan refund Bettazon.id: kondisi, prosedur, dan waktu pemrosesan pengembalian dana untuk transaksi di platform kami.',
}

const sections = [
  {
    title: '1. Kondisi yang Memenuhi Syarat Refund',
    points: [
      'Ikan tiba dalam kondisi mati atau sakit parah, bukan akibat kesalahan atau kelalaian pembeli.',
      'Barang yang diterima tidak sesuai dengan deskripsi atau foto yang dicantumkan oleh penjual (spesies, ukuran, atau kondisi berbeda secara signifikan).',
      'Pesanan tidak dikirim oleh penjual dalam batas waktu yang ditentukan tanpa pemberitahuan yang valid.',
      'Penjual membatalkan pesanan sepihak setelah pembayaran diterima.',
      'Pembayaran berhasil tetapi order dibatalkan sebelum diproses.',
      'Terjadi sengketa yang diputuskan berhak menerima refund berdasarkan evaluasi Bettazon.id.',
    ],
  },
  {
    title: '2. Kondisi yang TIDAK Memenuhi Syarat Refund',
    points: [
      'Pembeli menyesal atau berubah pikiran setelah lelang dimenangkan atau pesanan dikonfirmasi.',
      'Kerusakan atau kematian ikan akibat kesalahan penanganan pembeli setelah diterima.',
      'Keterlambatan pengiriman yang disebabkan oleh force majeure atau kondisi di luar kendali penjual dan Bettazon.',
      'Perbedaan warna yang tidak signifikan akibat perbedaan tampilan layar perangkat.',
      'Pengajuan refund yang melewati batas waktu 1×24 jam setelah paket diterima tanpa dokumentasi yang valid.',
    ],
  },
  {
    title: '3. Cara Mengajukan Refund',
    points: [
      'Buka halaman "Pesanan Saya" di aplikasi, pilih pesanan terkait.',
      'Tekan "Ajukan Refund/Komplain" dan isi formulir dengan detail masalah.',
      'Sertakan foto atau video sebagai bukti kondisi ikan atau barang yang diterima.',
      'Tim Bettazon akan meninjau pengajuan dalam 1×3 hari kerja.',
      'Jika disetujui, dana akan diproses sesuai metode pengembalian yang berlaku.',
    ],
  },
  {
    title: '4. Bentuk Pengembalian Dana',
    points: [
      'Refund dapat dikembalikan ke saldo Bettazon Wallet sesuai alur transaksi yang berlaku.',
      'Dalam kondisi tertentu, refund dapat diproses kembali ke kanal pembayaran asal sesuai hasil review operasional dan payment gateway.',
      'Untuk transaksi dengan kartu kredit/debit internasional, proses refund mengikuti kebijakan bank penerbit kartu.',
    ],
  },
  {
    title: '5. Waktu Pemrosesan',
    points: [
      'Refund ke Bettazon Wallet: 1–3 hari kerja setelah persetujuan.',
      'Refund ke rekening bank / Virtual Account: 3–7 hari kerja.',
      'Refund ke dompet digital (GoPay, ShopeePay, dll.): 1–3 hari kerja.',
      'Refund ke kartu kredit/debit: 7–14 hari kerja tergantung kebijakan bank.',
    ],
  },
  {
    title: '6. Kondisi yang Dapat Menunda Refund',
    points: [
      'Data transaksi atau identitas belum lengkap.',
      'Masih ada proses verifikasi sengketa, pengiriman, atau escrow yang berjalan.',
      'Diperlukan klarifikasi tambahan dari pembeli, penjual, atau mitra pembayaran.',
      'Investigasi fraud atau aktivitas mencurigakan pada transaksi terkait.',
    ],
  },
]

export default function RefundPolicyPage() {
  return (
    <InfoPageLayout
      icon="💸"
      title="Kebijakan Refund"
      subtitle="Ketentuan lengkap pengembalian dana untuk transaksi di Bettazon.id"
    >
      <div className="space-y-6">
        <p className="text-gray-600 leading-relaxed">
          Bettazon.id berkomitmen memastikan setiap transaksi berjalan adil dan aman bagi pembeli
          maupun penjual. Kebijakan refund ini mengatur kondisi, prosedur, dan waktu pemrosesan
          pengembalian dana.
        </p>

        {sections.map((section) => (
          <section key={section.title} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-3">{section.title}</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-1.5 leading-relaxed text-sm">
              {section.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </section>
        ))}

        <section className="rounded-2xl border border-[#008080]/20 bg-[#008080]/5 p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Hubungi Kami</h2>
          <p className="text-gray-700 leading-relaxed text-sm">
            Jika Anda membutuhkan bantuan terkait refund, silakan kirim detail order dan kendala
            Anda ke{' '}
            <a href="mailto:official@bettazon.id" className="text-[#008080] font-medium hover:underline">
              official@bettazon.id
            </a>{' '}
            atau WhatsApp{' '}
            <a href="https://wa.me/6282186287929" target="_blank" rel="noopener noreferrer" className="text-[#008080] font-medium hover:underline">
              +62 821-8628-7929
            </a>.
          </p>
        </section>
      </div>
    </InfoPageLayout>
  )
}
