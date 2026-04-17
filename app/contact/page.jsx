import InfoPageLayout from '@/components/InfoPageLayout'

export const metadata = {
  title: 'Hubungi Kami – Bettazon.id',
  description:
    'Hubungi tim Bettazon.id melalui WhatsApp, email support, atau pertanyaan privasi. Kami siap membantu Senin–Sabtu, 08.00–17.00 WIB.',
}

const channels = [
  {
    emoji: '💬',
    title: 'WhatsApp',
    subtitle: 'Respons cepat untuk pertanyaan umum',
    value: '+62 821-8628-7929',
    href: 'https://wa.me/6282186287929?text=Halo%20Bettazon%2C%20saya%20butuh%20bantuan.',
    label: 'Buka WhatsApp',
    color: 'bg-green-600',
  },
  {
    emoji: '📧',
    title: 'Email Support',
    subtitle: 'Pertanyaan umum, transaksi, dan bantuan order',
    value: 'official@bettazon.id',
    href: 'mailto:official@bettazon.id?subject=Bantuan%20Bettazon',
    label: 'Kirim Email',
    color: 'bg-[#008080]',
  },
]

const topics = [
  {
    icon: '🔒',
    title: 'Pertanyaan Privasi & Data Pribadi',
    value: 'privacy@bettazon.id',
    href: 'mailto:privacy@bettazon.id?subject=Pertanyaan%20Privasi',
  },
  {
    icon: '🤝',
    title: 'Kemitraan & Seller',
    value: 'official@bettazon.id',
    href: 'mailto:official@bettazon.id?subject=Kemitraan%20Bettazon',
  },
  {
    icon: '🚨',
    title: 'Laporkan Pelanggaran / Fraud',
    value: 'official@bettazon.id',
    href: 'mailto:official@bettazon.id?subject=Laporan%20Pelanggaran',
  },
]

const socials = [
  {
    icon: '📸',
    title: 'Instagram',
    value: '@bettazon.id',
    href: 'https://instagram.com/bettazon.id',
  },
  {
    icon: '🎵',
    title: 'TikTok',
    value: '@bettazon.id',
    href: 'https://tiktok.com/@bettazon.id',
  },
]

export default function ContactPage() {
  return (
    <InfoPageLayout
      icon="📞"
      title="Hubungi Kami"
      subtitle="Pilih saluran komunikasi yang paling sesuai dengan kebutuhanmu"
    >
      <div className="space-y-8">
        {/* Jam Operasional */}
        <div className="flex items-center gap-3 rounded-xl bg-[#008080]/10 border border-[#008080]/20 px-4 py-3">
          <span className="text-lg">🕐</span>
          <p className="text-[#008080] font-medium text-sm">
            Jam operasional: Senin – Sabtu, 08.00 – 17.00 WIB
          </p>
        </div>

        {/* Saluran Utama */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Saluran Komunikasi</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {channels.map((ch) => (
              <div key={ch.title} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-2xl">{ch.emoji}</span>
                  <div>
                    <p className="font-bold text-gray-900">{ch.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{ch.subtitle}</p>
                    <p className="text-sm font-medium text-[#008080] mt-1">{ch.value}</p>
                  </div>
                </div>
                <a
                  href={ch.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-block text-white text-sm font-semibold px-4 py-2 rounded-lg ${ch.color} hover:opacity-90 transition`}
                >
                  {ch.label}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Topik Khusus */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Topik Khusus</h2>
          <div className="space-y-3">
            {topics.map((t) => (
              <a
                key={t.title}
                href={t.href}
                className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 hover:bg-gray-100 transition"
              >
                <span className="text-xl w-8 text-center">{t.icon}</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{t.title}</p>
                  <p className="text-xs text-[#008080] mt-0.5">{t.value}</p>
                </div>
                <span className="text-gray-400">→</span>
              </a>
            ))}
          </div>
        </section>

        {/* Media Sosial */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Media Sosial</h2>
          <div className="space-y-3">
            {socials.map((s) => (
              <a
                key={s.title}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 hover:bg-gray-100 transition"
              >
                <span className="text-xl w-8 text-center">{s.icon}</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{s.title}</p>
                  <p className="text-xs text-[#008080] mt-0.5">{s.value}</p>
                </div>
                <span className="text-gray-400">↗</span>
              </a>
            ))}
          </div>
        </section>

        {/* Alamat */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-3">📍 Alamat Kantor</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Bettazon.id<br />
            Jl. Husin Basri Perumahan Grand Berdikari Blok G16<br />
            Rt/Rw. 002/005, Kel. Sukamulya, Kec. Sematang Borang<br />
            Palembang, Sumatera Selatan 30162, Indonesia
          </p>
        </section>
      </div>
    </InfoPageLayout>
  )
}
