import SellerCenterLayout from '@/components/SellerCenterLayout'

export const metadata = {
  title: 'Panduan Mulai Berjualan – Seller Center Bettazon.id',
  description:
    'Langkah-langkah lengkap untuk mulai berjualan di Bettazon.id: daftar akun, verifikasi KTP, buka toko, dan upload produk pertamamu.',
}

const steps = [
  {
    num: '1',
    title: 'Download Aplikasi Bettazon',
    body: 'Unduh aplikasi Bettazon dari Google Play Store. Gratis, tidak ada biaya apapun untuk download maupun membuat akun.',
  },
  {
    num: '2',
    title: 'Daftar Akun',
    body: 'Buka aplikasi, pilih "Daftar". Masukkan nomor HP atau email, lalu verifikasi dengan kode OTP yang dikirim via WhatsApp/SMS. Kamu juga bisa daftar pakai akun Google.',
  },
  {
    num: '3',
    title: 'Daftar Jadi Seller',
    body: 'Masuk ke halaman Profil → tap banner "Jadi Seller". Isi nama toko (min. 3 karakter), deskripsi toko (opsional), provinsi, dan kota/kabupaten. Baca dan centang Perjanjian Seller, lalu tap "Setuju & Lanjutkan" — akun seller langsung aktif saat itu juga, tidak perlu menunggu persetujuan.',
  },
  {
    num: '4',
    title: 'Upload Foto KTP',
    body: 'Setelah toko aktif, kamu akan diminta upload foto KTP (format JPG/PNG, max 10MB). Kamu bisa lewati langkah ini dulu dan selesaikan nanti via "Lewati — upload nanti". KTP diperlukan untuk mengaktifkan fitur pencairan dana dan mendapat badge "Terverifikasi" di tokomu.',
  },
  {
    num: '5',
    title: 'Lengkapi Alamat Toko',
    body: 'Di halaman Profil → Dashboard Toko → Pengaturan Toko, lengkapi alamat toko: kecamatan, alamat lengkap, dan kode pos. Alamat ini digunakan sebagai titik asal pengiriman untuk kalkulasi ongkir otomatis ke pembeli.',
  },
  {
    num: '6',
    title: 'Upload Produk Pertama',
    body: 'Buka Profil → Dashboard Toko → Kelola Produk → tap tombol (+). Isi detail ikan, upload minimal 1 foto, dan publikasikan. Pastikan email akun sudah terverifikasi sebelum bisa upload produk.',
  },
]

export default function MulaiBerjualanPage() {
  return (
    <SellerCenterLayout
      iconKey="mulai-berjualan"
      title="Panduan Mulai Berjualan"
      subtitle="Dari download app sampai produk pertama tampil — selesai dalam 30 menit."
      currentHref="/seller-center/mulai-berjualan"
    >
      {/* Steps */}
      <div className="space-y-6">
        {steps.map(({ num, title, body }) => (
          <div key={num} className="flex gap-4">
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#008080] text-white flex items-center justify-center font-bold text-sm">
              {num}
            </div>
            <div className="pt-1">
              <h2 className="font-bold text-gray-900 mb-1">{title}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="mt-10 bg-teal-50 border border-teal-100 rounded-2xl p-5">
        <h3 className="font-bold text-[#008080] mb-3 flex items-center gap-2">
          <span>💡</span> Tips Agar Tokomu Cepat Laku
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-[#008080] font-bold mt-0.5">✓</span>
            <span>Gunakan nama toko yang mudah diingat dan relevan dengan jenis ikan yang kamu jual.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#008080] font-bold mt-0.5">✓</span>
            <span>Upload minimal 5 produk saat pertama kali buka toko agar profil terlihat aktif.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#008080] font-bold mt-0.5">✓</span>
            <span>Segera verifikasi KTP untuk mendapat badge "Terverifikasi" yang meningkatkan konversi penjualan.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#008080] font-bold mt-0.5">✓</span>
            <span>Aktifkan notifikasi di HP agar tidak melewatkan pesanan masuk.</span>
          </li>
        </ul>
      </div>

      {/* Syarat */}
      <div className="mt-6 bg-orange-50 border border-orange-100 rounded-2xl p-5">
        <h3 className="font-bold text-orange-700 mb-3 flex items-center gap-2">
          <span>📋</span> Syarat Menjadi Seller
        </h3>
        <ul className="space-y-1.5 text-sm text-gray-700">
          <li>• WNI dengan KTP yang valid</li>
          <li>• Usia minimal 17 tahun</li>
          <li>• Email akun sudah terverifikasi (diperlukan untuk upload produk)</li>
          <li>• Memiliki rekening bank aktif untuk pencairan dana</li>
          <li>• Menjual produk yang sesuai dengan kategori Bettazon (ikan hias dan produk pendukungnya)</li>
        </ul>
      </div>

      {/* Lanjut ke */}
      <div className="mt-8 pt-6 border-t border-gray-100 text-sm text-gray-500 text-center">
        Sudah buka toko? Lanjut ke panduan berikutnya untuk mengelola produkmu. 👇
      </div>
    </SellerCenterLayout>
  )
}
