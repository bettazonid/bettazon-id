import SellerCenterLayout from '@/components/SellerCenterLayout'
import SellerCenterIcon from '@/components/seller-center/SellerCenterIcon'

export const metadata = {
  title: 'Pembayaran & Pencairan – Seller Center Bettazon.id',
  description:
    'Cara kerja sistem escrow Bettazon, alur dana dari pembeli ke seller, jadwal pencairan, dan cara tarik saldo ke rekening bank.',
}

export default function PembayaranPencairanPage() {
  return (
    <SellerCenterLayout
      iconKey="pembayaran"
      title="Pembayaran & Pencairan"
      subtitle="Dana kamu aman di escrow Bettazon — cair otomatis setelah pesanan selesai."
      currentHref="/seller-center/pembayaran-pencairan"
    >
      {/* Cara Kerja Escrow */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">🔒 Cara Kerja Sistem Escrow</h2>
        <p className="text-sm text-gray-600 mb-5 leading-relaxed">
          Escrow adalah sistem keamanan transaksi Bettazon. Dana pembeli ditahan sementara oleh Bettazon, dan baru diteruskan ke seller setelah pesanan dikonfirmasi diterima dengan baik.
        </p>
        <div className="relative">
          <div className="space-y-0">
            {[
              { iconKey: 'credit-card', title: 'Pembeli Bayar', desc: 'Pembeli melakukan pembayaran via transfer bank, e-wallet, atau kartu kredit. Dana masuk ke rekening escrow Bettazon.' },
              { iconKey: 'package', title: 'Seller Kirim', desc: 'Kamu mendapat notifikasi "Pesanan Dibayar". Packing ikan dan kirim dalam 48 jam. Input resi di aplikasi.' },
              { iconKey: 'truck', title: 'Dalam Pengiriman', desc: 'Dana masih ditahan di escrow. Pembeli dapat melacak paket secara real-time.' },
              { iconKey: 'check', title: 'Pembeli Konfirmasi', desc: 'Pembeli mengkonfirmasi pesanan diterima dalam kondisi baik. Atau otomatis dianggap diterima 3 hari setelah status "Terkirim".' },
              { iconKey: 'banknotes', title: 'Dana Cair ke Dompetmu', desc: 'Setelah konfirmasi, dana otomatis masuk ke saldo dompet Bettazon-mu. Siap dicairkan kapan saja.' },
            ].map(({ iconKey, title, desc }, i) => (
              <div key={title} className="flex gap-4 items-start">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-[#008080]/10 border-2 border-[#008080]/30 flex items-center justify-center text-[#008080] flex-shrink-0">
                    <SellerCenterIcon name={iconKey} className="w-5 h-5" />
                  </div>
                  {i < 4 && <div className="w-0.5 h-6 bg-gray-200 my-1" />}
                </div>
                <div className="pb-4">
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kapan Cair */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">⏱️ Kapan Dana Cair?</h2>
        <div className="space-y-3">
          {[
            { scenario: 'Pembeli konfirmasi manual', time: 'Langsung saat itu juga', color: 'bg-green-50 border-green-100' },
            { scenario: 'Pembeli tidak konfirmasi (auto-release)', time: '3 hari setelah status "Terkirim"', color: 'bg-teal-50 border-teal-100' },
            { scenario: 'Ada sengketa/komplain', time: 'Setelah resolusi sengketa selesai', color: 'bg-orange-50 border-orange-100' },
          ].map(({ scenario, time, color }) => (
            <div key={scenario} className={`flex items-center justify-between gap-4 border rounded-xl p-4 ${color}`}>
              <span className="text-sm font-medium text-gray-800">{scenario}</span>
              <span className="text-sm font-bold text-[#008080] text-right whitespace-nowrap">{time}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Tarik Saldo */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">🏦 Cara Tarik Saldo ke Rekening Bank</h2>
        <div className="space-y-3 text-sm text-gray-700">
          {[
            'Buka aplikasi → Profil → Dompet Saya.',
            'Tap "Tarik Saldo" — pastikan kamu sudah menambahkan rekening bank yang valid.',
            'Masukkan nominal yang ingin ditarik (minimal Rp 50.000). Sisa saldo setelah penarikan juga harus minimal Rp 50.000 — kamu tidak bisa menguras saldo hingga nol.',
            'Konfirmasi dengan PIN atau OTP.',
            'Dana masuk ke rekeningmu dalam 1–3 hari kerja (Senin–Jumat, tidak termasuk hari libur nasional).',
          ].map((text, i) => (
            <div key={i} className="flex gap-3 items-start bg-gray-50 rounded-xl p-3">
              <span className="w-5 h-5 rounded-full bg-[#008080]/10 text-[#008080] text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span>{text}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 bg-orange-50 border border-orange-100 rounded-xl p-4 text-sm text-gray-700">
          <strong className="text-orange-700">Penting:</strong> Pastikan nama pemilik rekening bank sama dengan nama KTP yang terdaftar di Bettazon. Rekening atas nama berbeda tidak dapat diproses.
        </div>
        <div className="mt-3 bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm text-gray-700">
          <strong className="text-gray-800">Bank yang didukung (16 bank):</strong>
          <p className="mt-1 text-gray-600">BCA · BNI · BRI · Mandiri · BSI · CIMB Niaga · Danamon · Permata · BTN · OCBC · Panin · Mega · Bukopin · Jago · SeaBank · Jenius</p>
        </div>
      </section>

      {/* Komisi & Biaya */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">📊 Biaya & Komisi</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-3 font-semibold text-gray-700 rounded-tl-xl">Komponen</th>
                <th className="text-left p-3 font-semibold text-gray-700 rounded-tr-xl">Besaran</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              <tr className="border-t border-gray-100">
                <td className="p-3 font-medium text-[#008080]">Komisi Platform (Founding Seller)</td>
                <td className="p-3 font-bold text-[#008080]">0%</td>
              </tr>
              <tr className="border-t border-gray-100">
                <td className="p-3">Biaya Tarik Saldo</td>
                <td className="p-3">Rp 0 (gratis)</td>
              </tr>
              <tr className="border-t border-gray-100">
                <td className="p-3">Biaya Payment Gateway</td>
                <td className="p-3">Ditanggung platform (tidak dipotong dari seller)</td>
              </tr>
              <tr className="border-t border-gray-100">
                <td className="p-3">Ongkos kirim</td>
                <td className="p-3">Ditanggung pembeli (sudah dikalkulasi saat checkout)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-3">* Biaya komisi dapat berubah setelah masa Founding Seller berakhir. Perubahan akan diinformasikan minimal 30 hari sebelumnya melalui notifikasi aplikasi.</p>
      </section>
    </SellerCenterLayout>
  )
}
