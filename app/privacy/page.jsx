import Link from 'next/link'

export const metadata = {
  title: 'Kebijakan Privasi – Bettazon.id',
  description:
    'Kebijakan Privasi aplikasi Bettazon.id. Pelajari bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.',
}

const sections = [
  {
    id: 1,
    title: 'Informasi yang Kami Kumpulkan',
    color: 'text-[#FE735C]',
    bg: 'bg-[#FE735C]/10',
    content: (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            a. Informasi yang Anda Berikan Langsung
          </h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1.5 leading-relaxed">
            <li>Nama lengkap dan nama pengguna</li>
            <li>Alamat email dan nomor telepon</li>
            <li>Kata sandi (disimpan dalam bentuk terenkripsi)</li>
            <li>Foto profil (opsional)</li>
            <li>Alamat pengiriman (nama, jalan, kota, provinsi, kode pos)</li>
            <li>Informasi identitas untuk verifikasi penjual (foto KTP)</li>
            <li>Informasi toko penjual (nama toko, deskripsi toko)</li>
            <li>Nomor rekening bank untuk pencairan dana penjual</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            b. Informasi yang Dikumpulkan Secara Otomatis
          </h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1.5 leading-relaxed">
            <li>Informasi perangkat (model, versi sistem operasi, pengidentifikasi unik)</li>
            <li>Data penggunaan aplikasi (halaman yang dikunjungi, fitur yang digunakan)</li>
            <li>Alamat IP dan data jaringan</li>
            <li>Token push notification (Firebase Cloud Messaging)</li>
            <li>Log aktivitas dan timestamp transaksi</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            c. Informasi Transaksi & Keuangan
          </h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1.5 leading-relaxed">
            <li>Riwayat pembelian, penjualan, dan penawaran lelang</li>
            <li>Riwayat transaksi dompet digital (saldo, top-up, penarikan)</li>
            <li>
              Data pembayaran diproses oleh gateway pembayaran pihak ketiga (Midtrans/iPaymu) —
              kami <strong>tidak menyimpan</strong> data kartu kredit/debit secara langsung
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">d. Konten yang Anda Buat</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1.5 leading-relaxed">
            <li>Foto dan video produk yang Anda unggah</li>
            <li>Pesan chat dengan penjual atau pembeli lain</li>
            <li>Ulasan dan rating produk</li>
            <li>Konten live streaming</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: 'Cara Kami Menggunakan Informasi Anda',
    color: 'text-[#008080]',
    bg: 'bg-[#008080]/10',
    content: (
      <ul className="space-y-3 text-gray-600">
        {[
          'Membuat dan mengelola akun pengguna Anda',
          'Memproses transaksi pembelian, penjualan, dan lelang',
          'Mengirimkan notifikasi transaksi, penawaran, dan pembaruan pesanan',
          'Memverifikasi identitas penjual untuk keamanan platform',
          'Mengelola saldo dompet digital dan proses escrow transaksi',
          'Menyediakan layanan live streaming dan lelang real-time',
          'Menghitung dan memproses ongkos kirim pengiriman',
          'Mendeteksi dan mencegah penipuan serta aktivitas mencurigakan',
          'Meningkatkan kualitas layanan dan pengalaman pengguna',
          'Memenuhi kewajiban hukum yang berlaku di Indonesia',
        ].map((item) => (
          <li key={item} className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-[#008080] mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: 3,
    title: 'Berbagi Informasi dengan Pihak Ketiga',
    color: 'text-[#FE735C]',
    bg: 'bg-[#FE735C]/10',
    content: (
      <div>
        <p className="text-gray-600 mb-5">
          Kami <strong>tidak menjual</strong> data pribadi Anda kepada pihak manapun. Kami hanya
          berbagi informasi dalam kondisi berikut:
        </p>
        <div className="space-y-4">
          {[
            {
              title: 'Pengguna Lain',
              desc: 'Nama dan foto profil Anda dapat dilihat pengguna lain dalam konteks transaksi, chat, atau sesi live streaming.',
            },
            {
              title: 'Layanan Pembayaran (Midtrans & iPaymu)',
              desc: 'Informasi transaksi diteruskan ke gateway pembayaran untuk memproses pembayaran secara aman.',
            },
            {
              title: 'Layanan Kurir & Pengiriman',
              desc: 'Nama dan alamat pengiriman diteruskan ke mitra kurir (JNE, J&T, dll.) untuk keperluan pengiriman pesanan.',
            },
            {
              title: 'Firebase (Google)',
              desc: 'Token perangkat digunakan untuk mengirimkan push notification melalui Firebase Cloud Messaging.',
            },
            {
              title: 'LiveKit',
              desc: 'ID pengguna dan nama tampilan digunakan sebagai identitas dalam sesi live streaming.',
            },
            {
              title: 'Google Sign-In & Facebook Login',
              desc: 'Saat Anda memilih masuk dengan Google atau Facebook, data profil dasar (nama, email, foto) dibagikan sesuai izin yang Anda berikan pada layanan tersebut.',
            },
            {
              title: 'Raja Ongkir',
              desc: 'Kode kota/wilayah digunakan untuk kalkulasi ongkos kirim dari layanan Raja Ongkir.',
            },
            {
              title: 'Penegak Hukum',
              desc: 'Kami dapat mengungkapkan data Anda jika diwajibkan oleh hukum, perintah pengadilan, atau proses hukum yang berlaku di Indonesia.',
            },
          ].map(({ title, desc }) => (
            <div key={title} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 4,
    title: 'Keamanan Data',
    color: 'text-[#008080]',
    bg: 'bg-[#008080]/10',
    content: (
      <div>
        <p className="text-gray-600 leading-relaxed mb-4">
          Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang wajar untuk
          melindungi data Anda:
        </p>
        <ul className="space-y-2.5 text-gray-600">
          <li className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">🔐</span>
            <span>Enkripsi data dalam transmisi menggunakan HTTPS/TLS</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">🔑</span>
            <span>Kata sandi disimpan menggunakan hashing yang aman (bcrypt)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">🛡️</span>
            <span>
              Autentikasi JWT dengan mekanisme blacklist token untuk mencegah penyalahgunaan
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">🔒</span>
            <span>Sistem escrow untuk melindungi dana selama transaksi berlangsung</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">⚡</span>
            <span>Rate limiting dan proteksi terhadap serangan DDoS pada API</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">🗄️</span>
            <span>Penyimpanan file media menggunakan DigitalOcean Spaces (region Singapura)</span>
          </li>
        </ul>
        <div className="mt-5 bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800">
          ⚠️ Meskipun kami berupaya melindungi data Anda, tidak ada metode transmisi atau
          penyimpanan elektronik yang 100% aman. Kami mendorong Anda untuk menggunakan kata sandi
          yang kuat dan tidak membagikannya kepada siapapun.
        </div>
      </div>
    ),
  },
  {
    id: 5,
    title: 'Penyimpanan & Retensi Data',
    color: 'text-[#FE735C]',
    bg: 'bg-[#FE735C]/10',
    content: (
      <div>
        <p className="text-gray-600 leading-relaxed mb-4">
          Data Anda disimpan di server yang berlokasi di <strong>Singapura</strong> (DigitalOcean
          Spaces, region sgp1). Kami menyimpan data selama akun Anda aktif. Setelah akun dihapus:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1.5">
          <li>Data profil dihapus dalam 30 hari</li>
          <li>Riwayat transaksi disimpan selama 5 tahun untuk kepatuhan hukum</li>
          <li>Pesan chat dihapus sesuai kebijakan retensi yang berlaku</li>
          <li>Log sistem disimpan maksimal 90 hari</li>
          <li>Notifikasi yang sudah lebih dari 30 hari dihapus secara otomatis</li>
        </ul>
      </div>
    ),
  },
  {
    id: 6,
    title: 'Hak-Hak Anda',
    color: 'text-[#008080]',
    bg: 'bg-[#008080]/10',
    content: (
      <div>
        <p className="text-gray-600 mb-5">Sebagai pengguna, Anda memiliki hak untuk:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {[
            { icon: '👁️', title: 'Akses', desc: 'Melihat data pribadi yang kami simpan tentang Anda' },
            { icon: '✏️', title: 'Koreksi', desc: 'Memperbarui informasi yang tidak akurat atau tidak lengkap' },
            { icon: '🗑️', title: 'Penghapusan', desc: 'Meminta penghapusan akun dan data pribadi Anda' },
            { icon: '📤', title: 'Portabilitas', desc: 'Mengekspor data pribadi Anda dalam format yang dapat dibaca' },
            { icon: '🚫', title: 'Keberatan', desc: 'Menolak penggunaan data untuk tujuan pemasaran tertentu' },
            { icon: '🔔', title: 'Notifikasi', desc: 'Mengatur preferensi notifikasi di dalam aplikasi' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{icon}</span>
                <span className="font-semibold text-gray-900">{title}</span>
              </div>
              <p className="text-gray-600 text-sm">{desc}</p>
            </div>
          ))}
        </div>
        <p className="text-gray-600 text-sm">
          Untuk menggunakan hak-hak di atas, hubungi kami di{' '}
          <a href="mailto:official@bettazon.id" className="text-[#008080] font-medium hover:underline">
            official@bettazon.id
          </a>
          . Kami akan merespons permintaan Anda dalam waktu 14 hari kerja.
        </p>
      </div>
    ),
  },
  {
    id: 7,
    title: 'Privasi Anak-Anak',
    color: 'text-[#FE735C]',
    bg: 'bg-[#FE735C]/10',
    content: (
      <p className="text-gray-600 leading-relaxed">
        Aplikasi Bettazon.id ditujukan untuk pengguna berusia <strong>17 tahun ke atas</strong>.
        Kami tidak dengan sengaja mengumpulkan data pribadi dari anak-anak di bawah 17 tahun. Jika
        Anda mengetahui bahwa anak di bawah umur telah memberikan data pribadi kepada kami,
        silakan hubungi kami segera di{' '}
        <a href="mailto:official@bettazon.id" className="text-[#008080] font-medium hover:underline">
          official@bettazon.id
        </a>{' '}
        agar kami dapat menghapus informasi tersebut.
      </p>
    ),
  },
  {
    id: 8,
    title: 'Perubahan Kebijakan Privasi',
    color: 'text-[#008080]',
    bg: 'bg-[#008080]/10',
    content: (
      <p className="text-gray-600 leading-relaxed">
        Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan material akan
        diberitahukan melalui notifikasi di dalam aplikasi atau email setidaknya{' '}
        <strong>7 hari</strong> sebelum perubahan berlaku. Penggunaan berkelanjutan Aplikasi
        setelah perubahan berlaku merupakan bentuk penerimaan Anda terhadap kebijakan yang
        diperbarui.
      </p>
    ),
  },
]

export default function PrivacyPage() {
  return (
    <>
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl">🐠</span>
              <span className="text-lg font-bold">
                <span className="text-[#FE735C]">Bettazon</span>
                <span className="text-[#008080]">.id</span>
              </span>
            </Link>
            <Link
              href="/"
              className="text-sm text-[#008080] hover:text-[#006666] font-medium flex items-center gap-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </nav>

      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#008080] to-teal-700 text-white py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-5xl mb-5">🔒</div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-3">Kebijakan Privasi</h1>
            <p className="text-teal-100 text-lg">Terakhir diperbarui: 9 Maret 2026</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12">

            {/* Intro */}
            <div className="mb-10">
              <p className="text-gray-600 leading-relaxed text-lg">
                Selamat datang di <strong>Bettazon.id</strong> (&quot;kami&quot; atau
                &quot;Bettazon&quot;). Kebijakan Privasi ini menjelaskan bagaimana kami
                mengumpulkan, menggunakan, mengungkapkan, dan melindungi informasi Anda saat
                menggunakan aplikasi mobile Bettazon.id (&quot;Aplikasi&quot;).
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                Dengan mengunduh, mendaftar, atau menggunakan Aplikasi, Anda menyetujui ketentuan
                dalam Kebijakan Privasi ini. Jika Anda tidak menyetujui kebijakan ini, harap tidak
                menggunakan Aplikasi kami.
              </p>
            </div>

            {/* Table of Contents */}
            <div className="bg-gray-50 rounded-2xl p-5 mb-10 border border-gray-100">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
                Daftar Isi
              </h2>
              <ol className="space-y-1.5 text-sm">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#section-${s.id}`}
                      className="text-[#008080] hover:text-[#006666] hover:underline transition-colors"
                    >
                      {s.id}. {s.title}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="#section-contact"
                    className="text-[#008080] hover:text-[#006666] hover:underline transition-colors"
                  >
                    9. Hubungi Kami
                  </a>
                </li>
              </ol>
            </div>

            {/* Sections */}
            <div className="space-y-10">
              {sections.map((section, index) => (
                <div key={section.id}>
                  <section id={`section-${section.id}`}>
                    <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-3">
                      <span
                        className={`w-8 h-8 ${section.bg} ${section.color} rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0`}
                      >
                        {section.id}
                      </span>
                      {section.title}
                    </h2>
                    {section.content}
                  </section>
                  {index < sections.length - 1 && (
                    <hr className="border-gray-100 mt-10" />
                  )}
                </div>
              ))}

              <hr className="border-gray-100" />

              {/* Contact Section */}
              <section id="section-contact">
                <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#FE735C]/10 text-[#FE735C] rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                    9
                  </span>
                  Hubungi Kami
                </h2>
                <p className="text-gray-600 mb-5">
                  Jika Anda memiliki pertanyaan, kekhawatiran, atau permintaan terkait kebijakan
                  privasi ini, silakan hubungi kami melalui:
                </p>
                <div className="bg-gradient-to-br from-[#008080]/5 to-[#FE735C]/5 rounded-2xl p-6 border border-gray-100 space-y-4">
                  <div className="flex items-start gap-3 text-gray-700">
                    <span className="text-xl flex-shrink-0">🏢</span>
                    <div>
                      <div className="font-semibold">Bettazon.id</div>
                      <div className="text-sm text-gray-500">Marketplace Ikan Hias Indonesia</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <span className="text-xl flex-shrink-0">📧</span>
                    <a
                      href="mailto:official@bettazon.id"
                      className="text-[#008080] hover:underline font-medium"
                    >
                      official@bettazon.id
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <span className="text-xl flex-shrink-0">💬</span>
                    <a
                      href="mailto:official@bettazon.id"
                      className="text-[#008080] hover:underline font-medium"
                    >
                      official@bettazon.id
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <span className="text-xl flex-shrink-0">🌐</span>
                    <span>bettazon.id</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-center text-sm">
        <p>© {new Date().getFullYear()} Bettazon.id. Hak cipta dilindungi undang-undang.</p>
        <p className="mt-2">
          <Link href="/" className="text-[#FE735C] hover:underline">
            ← Kembali ke Beranda
          </Link>
          {' · '}
          <a href="mailto:official@bettazon.id" className="hover:text-gray-200 transition-colors">
            official@bettazon.id
          </a>
        </p>
      </footer>
    </>
  )
}
