import InfoPageLayout from '@/components/InfoPageLayout'

export const metadata = {
  title: 'Refund Policy – Bettazon.id',
  description:
    'Kebijakan refund Bettazon.id untuk transaksi yang dibatalkan, gagal, bermasalah, atau membutuhkan penyelesaian dana.',
}

const sections = [
  {
    title: 'Kapan refund dapat diproses?',
    points: [
      'Pembayaran berhasil tetapi order dibatalkan sebelum diproses.',
      'Pembayaran gagal diverifikasi atau ada kegagalan sistem transaksi.',
      'Pesanan tidak dapat dipenuhi sesuai status transaksi dan hasil verifikasi.',
      'Terjadi sengketa yang diputuskan berhak menerima refund berdasarkan evaluasi Bettazon.id.',
    ],
  },
  {
    title: 'Bentuk refund',
    points: [
      'Refund dapat dikembalikan ke saldo wallet sesuai alur transaksi yang berlaku.',
      'Dalam kondisi tertentu, refund dapat diproses kembali ke kanal pembayaran sesuai hasil review operasional dan payment gateway.',
    ],
  },
  {
    title: 'Waktu pemrosesan',
    points: [
      'Refund ke wallet diproses setelah status transaksi memenuhi syarat refund.',
      'Waktu penerimaan akhir dapat dipengaruhi oleh jadwal operasional bank, payment gateway, dan proses verifikasi internal.',
    ],
  },
  {
    title: 'Kondisi yang dapat menunda refund',
    points: [
      'Data transaksi atau identitas belum lengkap.',
      'Masih ada proses verifikasi sengketa, pengiriman, atau escrow yang berjalan.',
      'Diperlukan klarifikasi tambahan dari pembeli, penjual, atau mitra pembayaran.',
    ],
  },
]

export default function RefundPolicyPage() {
  return (
    <InfoPageLayout
      icon="💸"
      title="Refund Policy"
      subtitle="Kebijakan pengembalian dana untuk transaksi di Bettazon.id"
    >
      <div className="space-y-6">
        <p className="text-gray-600 leading-relaxed">
          Bettazon.id berkomitmen menjaga proses transaksi yang aman dan transparan. Kebijakan ini
          menjelaskan kondisi umum ketika refund dapat dilakukan dan bagaimana proses penanganannya.
        </p>

        {sections.map((section) => (
          <section key={section.title} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-3">{section.title}</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-1.5 leading-relaxed">
              {section.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </section>
        ))}

        <section className="rounded-2xl border border-[#008080]/20 bg-[#008080]/5 p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Hubungi Kami</h2>
          <p className="text-gray-700 leading-relaxed">
            Jika Anda membutuhkan bantuan terkait refund, silakan kirim detail order dan kendala
            Anda ke <a href="mailto:official@bettazon.id" className="text-[#008080] font-medium hover:underline">official@bettazon.id</a>.
          </p>
        </section>
      </div>
    </InfoPageLayout>
  )
}
