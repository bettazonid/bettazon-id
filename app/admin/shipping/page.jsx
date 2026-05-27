'use client';
import Link from 'next/link';

const sections = [
  {
    href: '/admin/shipments',
    title: 'Shipment Authorization',
    desc: 'Kelola label otorisasi pengiriman QR Bettazon. Lihat riwayat token, status penggunaan, dan batalkan authorization. Aktifkan per-kurir di Manajemen Kurir.',
    icon: '🏷️',
    badge: 'JNE • TIKI (soon)',
  },
  {
    href: '/admin/shipping/couriers',
    title: 'Manajemen Kurir',
    desc: 'Aktifkan / nonaktifkan kurir dan kelola jenis layanan (YES, REG, OKE, dll).',
    icon: '🚚',
  },
  {
    href: '/admin/shipping/cities',
    title: 'Cache Kota (MongoDB L3)',
    desc: 'Lihat & kelola mapping nama kota → subdistrict ID RajaOngkir yang tersimpan permanen. Jalankan Warm-up sekali setelah deploy baru.',
    icon: '🏙️',
    badge: 'Jalankan sebelum Sync Kurir',
  },
  {
    href: '/admin/shipping/quarantine',
    title: 'Aturan Karantina',
    desc: 'Konfigurasi rute mana yang wajib menyertakan dokumen karantina ikan.',
    icon: '🧾',
  },
];

export default function AdminShippingPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-2">Pengaturan Pengiriman</h1>
      <p className="text-sm text-gray-500 mb-8">
        Kelola kurir, jenis layanan, dan aturan karantina pengiriman ikan.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="border rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-2">{s.icon}</div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-semibold text-gray-800">{s.title}</h2>
              {s.badge && (
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">{s.badge}</span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
