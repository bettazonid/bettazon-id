import SellerCenterLayout from '@/components/SellerCenterLayout'

export const metadata = {
  title: 'Mengelola Pesanan – Seller Center Bettazon.id',
  description:
    'Panduan lengkap mengelola pesanan di Bettazon: konfirmasi, packing ikan, input resi pengiriman, dan penanganan retur atau sengketa.',
}

const orderFlow = [
  {
    icon: '🔔',
    status: 'Pesanan Masuk',
    desc: 'Kamu mendapat notifikasi saat ada pembeli yang checkout. Buka aplikasi dan cek halaman "Pesanan" → tab "Baru".',
    time: 'Batas konfirmasi: 2×24 jam hari kerja',
    note: 'Nomor HP pembeli hanya terlihat setelah kamu konfirmasi pesanan.',
    timeColor: 'text-orange-500',
  },
  {
    icon: '✅',
    status: 'Konfirmasi Pesanan',
    desc: 'Cek detail pesanan (produk, jumlah, alamat tujuan). Jika ikan tersedia dan siap kirim, tap "Terima Pesanan". Jika tidak bisa dipenuhi, tap "Tolak" dan isi alasan.',
    time: '',
    timeColor: '',
  },
  {
    icon: '📦',
    status: 'Packing & Persiapan',
    desc: 'Pack ikan dengan aman (lihat tips packing di bawah). Setelah siap, serahkan ke kurir atau antar ke drop-off point.',
    time: 'Proses & kirim dalam 2×24 jam hari kerja (total)',
    timeColor: 'text-orange-500',
  },
  {
    icon: '🚀',
    status: 'Input Nomor Resi',
    desc: 'Setelah paket diserahkan ke kurir, masuk ke detail pesanan dan tap "Masukkan Resi". Isi nomor resi dan pilih kurir. Pembeli otomatis mendapat notifikasi.',
    time: '',
    timeColor: '',
  },
  {
    icon: '📍',
    status: 'Dalam Pengiriman',
    desc: 'Pembeli dapat melacak paket secara real-time. Kamu juga bisa cek status pengiriman dari halaman detail pesanan.',
    time: '',
    timeColor: '',
  },
  {
    icon: '💰',
    status: 'Pesanan Selesai & Dana Cair',
    desc: 'Pesanan selesai saat pembeli mengkonfirmasi penerimaan, atau otomatis 3 hari setelah paket diterima. Dana langsung masuk ke saldo dompetmu di Bettazon.',
    time: '',
    timeColor: '',
  },
]

export default function PesananPage() {
  return (
    <SellerCenterLayout
      icon="🛒"
      title="Mengelola Pesanan"
      subtitle="Dari notifikasi pesanan masuk sampai dana cair — semua ada di sini."
      currentHref="/seller-center/pesanan"
    >
      {/* Alur Pesanan */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-5">Alur Pesanan</h2>
        <div className="relative">
          <div className="absolute left-4 top-5 bottom-5 w-0.5 bg-gray-100 hidden sm:block" />
          <div className="space-y-5">
            {orderFlow.map(({ icon, status, desc, time, timeColor, note }) => (
              <div key={status} className="flex gap-4 items-start relative">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-teal-50 border-2 border-[#008080]/20 flex items-center justify-center text-lg z-10">
                  {icon}
                </div>
                <div className="flex-1 pb-1">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <h3 className="font-bold text-gray-900 text-sm">{status}</h3>
                    {time && <span className={`text-xs font-semibold ${timeColor}`}>{time}</span>}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
                  {note && <p className="text-xs text-[#008080] mt-1 font-medium">ℹ️ {note}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips Packing */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">🐠 Tips Packing Ikan yang Aman</h2>
        <div className="space-y-3">
          {[
            { step: '1', tip: 'Gunakan plastik PE tebal (bukan kresek biasa) dan isi oksigen dari tabung — bukan tiup mulut.' },
            { step: '2', tip: 'Isi air bersih ±1/3 plastik, sisanya oksigen. Ikat kuat dengan karet dobel.' },
            { step: '3', tip: 'Masukkan ke styrofoam dengan packing kertas koran di sisi-sisi agar tidak bergeser.' },
            { step: '4', tip: 'Untuk pengiriman lebih dari 12 jam, tambahkan ice pack frozen di luar plastik ikan.' },
            { step: '5', tip: 'Puasakan ikan 1–2 hari sebelum pengiriman untuk mengurangi amonia di dalam plastik.' },
            { step: '6', tip: 'Beri label "HATI-HATI MAKHLUK HIDUP" dan "JANGAN TERBALIK" di luar dus.' },
          ].map(({ step, tip }) => (
            <div key={step} className="flex gap-3 items-start text-sm text-gray-700 bg-gray-50 rounded-xl p-3">
              <span className="w-5 h-5 rounded-full bg-[#008080] text-white text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">{step}</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Retur & Sengketa */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">⚠️ Retur & Penanganan Sengketa</h2>
        <div className="space-y-4 text-sm text-gray-700">
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
            <h3 className="font-bold text-orange-700 mb-2">Jika pembeli klaim masalah:</h3>
            <ul className="space-y-1.5">
              <li>1. Pembeli mengajukan komplain dengan foto/video bukti dalam 24 jam setelah paket diterima.</li>
              <li>2. Kamu mendapat notifikasi dan bisa melihat bukti yang diajukan.</li>
              <li>3. Respond dalam 48 jam: terima retur, tawarkan solusi (kompensasi), atau ajukan banding.</li>
              <li>4. Jika tidak ada respons dalam 48 jam, keputusan otomatis berpihak ke pembeli.</li>
            </ul>
          </div>
          <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4">
            <h3 className="font-bold text-[#008080] mb-2">💡 Tips menghindari sengketa:</h3>
            <ul className="space-y-1.5">
              <li>• Foto/video kondisi ikan sebelum packing sebagai bukti kondisi saat dikirim.</li>
              <li>• Deskripsi produk harus jujur — jangan lebih-lebihkan kondisi atau kualitas ikan.</li>
              <li>• Rekomendasikan jasa kurir live fish yang berpengalaman di daerah tujuan.</li>
            </ul>
          </div>
        </div>
      </section>
    </SellerCenterLayout>
  )
}
