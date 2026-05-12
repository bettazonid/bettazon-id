import SellerCenterLayout from '@/components/SellerCenterLayout'

export const metadata = {
  title: 'Cara Kelola Produk – Seller Center Bettazon.id',
  description:
    'Panduan lengkap mengelola produk di Bettazon: tambah produk, upload foto, atur harga, stok, dan kategori ikan hias.',
}

export default function KelolaProductPage() {
  return (
    <SellerCenterLayout
      icon="📦"
      title="Kelola Produk"
      subtitle="Cara tambah, edit, dan optimalkan listing ikanmu agar cepat terjual."
      currentHref="/seller-center/kelola-produk"
    >
      {/* Tambah Produk */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-[#008080] text-white text-xs flex items-center justify-center font-bold">1</span>
          Cara Menambah Produk Baru
        </h2>
        <div className="space-y-3 text-sm text-gray-700">
          <p>Buka menu <strong>Profil → Dashboard Toko → Kelola Produk → tombol (+)</strong>. Isi form berikut:</p>
          <div className="space-y-2">
            {[
              { label: 'Nama Produk', desc: 'Gunakan nama spesies + varietas. Contoh: "Cupang Halfmoon Blue Rim Grade A".' },
              { label: 'Kategori', desc: 'Pilih kategori yang sesuai (Betta, Koi, Arwana, Guppy, Discus, Louhan, Cichlid, Tetra, Goldfish, Other) agar mudah ditemukan di pencarian.' },
              { label: 'Data Ikan (Opsional)', desc: 'Nama ilmiah (species), nama umum, varian, negara asal, ukuran min–max (cm), jenis kelamin, dan kondisi kesehatan.' },
              { label: 'Deskripsi', desc: 'Jelaskan kondisi, keunggulan, dan cara perawatan singkat. Opsional tapi sangat direkomendasikan.' },
              { label: 'Harga', desc: 'Masukkan harga jual dalam Rupiah.' },
              { label: 'Stok', desc: 'Masukkan jumlah stok yang tersedia.' },
              { label: 'Berat Paket', desc: 'Diperlukan untuk kalkulasi ongkir otomatis. Isi berat paket dalam gram.' },
            ].map(({ label, desc }) => (
              <div key={label} className="flex gap-3 bg-gray-50 rounded-xl p-3">
                <span className="text-[#008080] font-bold text-xs mt-0.5 flex-shrink-0">◆</span>
                <div>
                  <span className="font-semibold text-gray-900">{label}: </span>
                  <span>{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Foto */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-[#008080] text-white text-xs flex items-center justify-center font-bold">2</span>
          Tips Foto Produk yang Menjual
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: '📸', tip: 'Upload minimal 1 foto (wajib). Disarankan upload beberapa foto: tampak depan, samping, dan close-up sirip/warna.' },
            { icon: '💡', tip: 'Foto di bawah cahaya natural atau lampu akuarium yang terang. Hindari flash langsung.' },
            { icon: '🧹', tip: 'Pastikan kaca bersih, latar belakang polos atau simpel (hitam/putih paling bagus).' },
            { icon: '📐', tip: 'Gunakan format square (1:1) atau portrait (4:5). Resolusi minimal 800×800 px.' },
            { icon: '🎥', tip: 'Tambahkan video pendek (max 30MB) untuk menunjukkan pergerakan ikan — meningkatkan minat beli.' },
            { icon: '🚫', tip: 'Jangan pakai foto dari listing seller lain atau dari internet tanpa izin. Foto secara otomatis akan diwatermark "bettazon.id".' },
          ].map(({ icon, tip }) => (
            <div key={tip} className="flex gap-3 items-start bg-gray-50 rounded-xl p-3 text-sm text-gray-700">
              <span className="text-xl flex-shrink-0">{icon}</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Tab Status Produk */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-[#008080] text-white text-xs flex items-center justify-center font-bold">3</span>
          Tab Status Produk
        </h2>
        <p className="text-sm text-gray-600 mb-4">Halaman Kelola Produk menampilkan 5 tab untuk memfilter produk berdasarkan statusnya:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-6">
          {[
            { label: 'Semua', color: 'gray', desc: 'Seluruh produk kamu, semua status.' },
            { label: 'Aktif', color: 'teal', desc: 'Produk yang sedang live dan bisa dibeli pembeli.' },
            { label: 'Draft', color: 'yellow', desc: 'Produk yang belum dipublikasi atau sudah kadaluarsa (expired). Bisa diedit dan dipublikasi ulang.' },
            { label: 'Terjual', color: 'blue', desc: 'Produk yang stoknya sudah habis atau sudah selesai transaksi.' },
            { label: 'Dihapus', color: 'red', desc: 'Produk yang sudah dihapus. Riwayat tetap tersimpan untuk keperluan order yang sudah ada.' },
          ].map(({ label, color, desc }) => (
            <div key={label} className="flex gap-3 items-start bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold bg-${color}-100 text-${color}-700 whitespace-nowrap mt-0.5`}>{label}</span>
              <span className="text-gray-700">{desc}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex gap-3 items-start">
            <span className="text-[#008080] font-bold mt-0.5">Edit:</span>
            <span>Tap produk di daftar → tap ikon pensil. Semua perubahan langsung tersimpan.</span>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-[#008080] font-bold mt-0.5">Draft Otomatis:</span>
            <span>Jika kamu keluar saat mengisi form produk baru sebelum dipublikasi, sistem akan menawarkan "Simpan sebagai Draft" — sehingga progresmu tidak hilang.</span>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-orange-500 font-bold mt-0.5">Hapus:</span>
            <span>Produk yang dihapus dipindahkan ke tab <strong>Dihapus</strong> dan tidak akan muncul ke pembeli. Riwayat transaksi yang sudah ada tetap tersimpan secara otomatis.</span>
          </div>
        </div>
      </section>

      {/* Tips stok */}
      <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5 text-sm">
        <h3 className="font-bold text-[#008080] mb-2 flex items-center gap-2"><span>💡</span> Tips Manajemen Stok & Produk</h3>
        <ul className="space-y-1.5 text-gray-700">
          <li>• Selalu perbarui stok setelah setiap penjualan di luar platform untuk menghindari oversell.</li>
          <li>• Pastikan email akun sudah terverifikasi sebelum bisa mengupload foto produk.</li>
          <li>• Minimal 1 foto wajib diunggah sebelum produk bisa dipublikasi.</li>
          <li>• Jika ikan belum siap jual, simpan sebagai Draft dulu — kamu bisa publikasi kapanpun siap.</li>
        </ul>
      </div>
    </SellerCenterLayout>
  )
}
