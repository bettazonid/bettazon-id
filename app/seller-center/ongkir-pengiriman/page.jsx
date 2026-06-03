import SellerCenterLayout from '@/components/SellerCenterLayout'

export const metadata = {
  title: 'Ongkir & Pengiriman – Seller Center Bettazon.id',
  description:
    'Panduan pengiriman ikan hias di Bettazon: kurir tersedia, cara hitung ongkir, pengemasan aman, input resi, dan pengiriman ke luar negeri.',
}

// Couriers are dynamic from backend; no hardcoded list

export default function OngkirPengirimanPage() {
  return (
    <SellerCenterLayout
      iconKey="ongkir"
      title="Ongkir & Pengiriman"
      subtitle="Panduan lengkap mengirim ikan dengan aman sampai ke tangan pembeli."
      currentHref="/seller-center/ongkir-pengiriman"
    >
      {/* Kurir Tersedia */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">🚚 Kurir yang Tersedia</h2>
        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5 text-sm text-gray-700 space-y-3">
          <p>Bettazon hanya menampilkan <strong>kurir yang telah diverifikasi untuk pengiriman live fish</strong> — bukan semua kurir umum. Daftar kurir diperbarui secara otomatis oleh sistem dan dapat berbeda tergantung kota asal tokomu dan kota tujuan pembeli.</p>
          <p>Saat kamu mengkonfirmasi pesanan, aplikasi akan langsung menampilkan daftar kurir beserta tarif pengiriman yang relevan untuk rute tersebut. Kamu cukup pilih kurir, kirim paket, lalu input resi.</p>
          <div className="bg-white border border-teal-200 rounded-xl p-3">
            <p className="font-semibold text-[#008080] mb-1">Cara kerja biaya pengiriman:</p>
            <p>Bettazon bekerja sama langsung dengan jasa pengiriman. <strong>Seller tidak perlu membayar ongkir secara manual</strong> — tagihan pengiriman dikelola antara kurir dan Bettazon. Kamu cukup <strong>drop paket ke loket atau titik yang ditentukan</strong>, sistem akan mengurus sisanya.</p>
          </div>
          <div className="bg-white border border-teal-200 rounded-xl p-3">
            <p className="font-semibold text-[#008080] mb-1">Untuk pengiriman internasional:</p>
            <p>Tersedia jaringan <strong>transhipper ikan hias</strong> terintegrasi di aplikasi. Pembeli luar negeri memilih transhipper di negaranya; kamu cukup kirim ke alamat transhipper lokal di Indonesia.</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">Pastikan kota asal toko sudah diisi dengan benar di Pengaturan Toko agar kurir dan tarif yang ditampilkan akurat.</p>
      </section>

      {/* Hitung Ongkir */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">💵 Cara Kerja Kalkulasi Ongkir</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <p>Ongkir dikalkulasi otomatis saat pembeli checkout berdasarkan:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Berat Paket', icon: '⚖️', desc: 'Diambil dari pengaturan produk (berat dalam gram yang kamu isi).' },
              { label: 'Kota Asal Toko', icon: '📍', desc: 'Kota yang kamu daftarkan saat buka toko.' },
              { label: 'Kota Tujuan', icon: '🏠', desc: 'Alamat pengiriman yang dipilih pembeli.' },
            ].map(({ label, icon, desc }) => (
              <div key={label} className="bg-teal-50 border border-teal-100 rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">{icon}</div>
                <div className="font-bold text-gray-900 text-xs mb-1">{label}</div>
                <div className="text-gray-600 text-xs">{desc}</div>
              </div>
            ))}
          </div>
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-3">
            <strong className="text-orange-700">Penting:</strong> Selalu isi berat paket yang akurat di setiap produk. Jika berat tidak diisi, sistem menggunakan nilai default dan ongkir bisa tidak akurat, yang berpotensi menimbulkan komplain dari pembeli.
          </div>
        </div>
      </section>

      {/* Packing Aman */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">📦 Standar Pengemasan Ikan yang Aman</h2>
        <div className="space-y-3 text-sm text-gray-700">
          {[
            { step: '1', tip: 'Plastik PE transparan tebal (bukan kresek) + isi oksigen dari tabung. Satu ikan per plastik.' },
            { step: '2', tip: 'Isi air bersih ±⅓ plastik. Ikat dengan karet rangkap. Tidak bocor = tidak mati.' },
            { step: '3', tip: 'Masukkan ke styrofoam atau kardus double wall. Tambahkan kertas koran sebagai peredam.' },
            { step: '4', tip: 'Untuk perjalanan >8 jam: tambahkan ice pack di luar plastik ikan untuk menjaga suhu.' },
            { step: '5', tip: 'Puasakan ikan 24–48 jam sebelum pengiriman untuk menekan amonia selama perjalanan.' },
            { step: '6', tip: 'Tempel label "FRAGILE", "MAKHLUK HIDUP", dan "JANGAN TERBALIK" pada semua sisi kardus.' },
          ].map(({ step, tip }) => (
            <div key={step} className="flex gap-3 items-start bg-gray-50 rounded-xl p-3">
              <span className="w-5 h-5 rounded-full bg-[#008080]/10 text-[#008080] text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                {step}
              </span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Input Resi */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">🔖 Cara Input Nomor Resi</h2>
        <div className="space-y-2 text-sm text-gray-700">
          <p>Setelah paket diserahkan ke kurir:</p>
          {[
            'Buka Pesanan → pilih pesanan yang sudah dikirim → tap "Masukkan Resi".',
            'Pilih nama kurir dari daftar.',
            'Masukkan nomor resi pengiriman.',
            'Tap "Konfirmasi Pengiriman".',
          ].map((text, i) => (
            <div key={i} className="flex gap-3 items-start bg-gray-50 rounded-xl p-3">
              <span className="w-5 h-5 rounded-full bg-[#008080]/10 text-[#008080] text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span>{text}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">Pembeli langsung mendapat notifikasi beserta nomor resi untuk melacak paket secara real-time.</p>
      </section>

      {/* Internasional */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">✈️ Pengiriman ke Luar Negeri</h2>
        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5 text-sm text-gray-700 space-y-3">
          <p>Bettazon mendukung penjualan ke pembeli luar negeri melalui jaringan <strong>transhipper ikan hias</strong> yang terintegrasi langsung di aplikasi.</p>
          <p>Alurnya:</p>
          <ol className="space-y-1.5 list-none">
            {[
              'Pembeli luar negeri checkout dan pilih transhipper di negaranya.',
              'Kamu mengirim ikan ke alamat transhipper lokal (dalam Indonesia).',
              'Transhipper mengurus pengiriman internasional, karantina, dan dokumen ekspor.',
              'Pembeli mengkonfirmasi ikan diterima dalam kondisi baik — atau otomatis 3 hari setelah status terkirim.',
              'Dana masuk ke saldo dompetmu, sama seperti pesanan domestik.',
            ].map((text, i) => (
              <li key={i} className="flex gap-2 items-start">
                <span className="w-5 h-5 rounded-full bg-[#008080] text-white text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                <span>{text}</span>
              </li>
            ))}
          </ol>
          <div className="bg-white border border-teal-200 rounded-xl p-3 text-xs text-gray-600">
            <strong className="text-[#008080]">Mengapa dana cair setelah buyer konfirmasi?</strong>
            <p className="mt-1">Transhipper adalah perpanjangan kurir — mereka belum tentu mencerminkan kondisi ikan saat sampai ke buyer. Escrow baru release setelah buyer puas, melindungi buyer <em>dan</em> reputasi seller sekaligus. Jika ada masalah di leg transhipper → buyer, Bettazon berperan sebagai mediator.</p>
          </div>
          <p className="text-gray-500 text-xs border-t border-teal-200 pt-3">Untuk informasi lebih lanjut tentang ekspor ikan hias, hubungi tim Bettazon via WhatsApp.</p>
        </div>
      </section>
    </SellerCenterLayout>
  )
}
