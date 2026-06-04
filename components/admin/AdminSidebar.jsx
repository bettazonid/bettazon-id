'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { clearAdminAuth } from '@/lib/adminApi'

const menus = [
  // ── Overview ─────────────────────────────────────────────
  { group: 'Overview' },
  { href: '/admin/dashboard',            label: 'Dashboard',                  icon: '📊' },
  { href: '/admin/reports',              label: 'Laporan & Pendapatan',        icon: '💰' },
  { href: '/admin/transactions',         label: 'Transaksi',                   icon: '💳' },

  // ── Marketplace ──────────────────────────────────────────
  { group: 'Marketplace' },
  { href: '/admin/products',             label: 'Produk',                      icon: '🐟' },
  { href: '/admin/orders',               label: 'Pesanan',                     icon: '📦' },
  { href: '/admin/users',                label: 'Pengguna',                    icon: '👥' },
  { href: '/admin/seller-verification',  label: 'Verifikasi KTP Seller',       icon: '🪪' },
  { href: '/admin/withdrawals',          label: 'Penarikan',                   icon: '🏦' },

  // ── Pengiriman ────────────────────────────────────────────
  { group: 'Pengiriman' },
  { href: '/admin/shipments',            label: 'Label JNE Authorization',     icon: '🏷️' },
  { href: '/admin/international-shipping', label: 'Pengiriman Internasional',  icon: '🌍' },
  { href: '/admin/shipping/couriers',    label: 'Kurir Domestik',              icon: '🚚' },
  { href: '/admin/shipping/cities',      label: 'Cache Kota (RajaOngkir)',     icon: '🏙️' },
  { href: '/admin/shipping/quarantine',  label: 'Aturan Karantina',            icon: '🔬' },

  // ── Konfigurasi ───────────────────────────────────────────
  { group: 'Konfigurasi' },
  { href: '/admin/fee-policy',           label: 'Fee Policy',                  icon: '⚙️' },
  { href: '/admin/order-config',         label: 'Konfigurasi Order',           icon: '🔧' },
  { href: '/admin/subscription-pricing', label: 'Harga Langganan',             icon: '💎' },
  { href: '/admin/ads',                  label: 'Iklan Sponsor',               icon: '📢' },

  // ── Konten & Media ────────────────────────────────────────
  { group: 'Konten & Media' },
  { href: '/admin/music',                label: 'Musik Ambience Live',         icon: '🎵' },
  { href: '/admin/healing-content',      label: 'Healing Content',             icon: '🌿' },
  { href: '/admin/storage',              label: 'Media Bucket',                icon: '🗄️' },

  // ── Komunikasi ────────────────────────────────────────────
  { group: 'Komunikasi' },
  { href: '/admin/chats',                label: 'Chat Support',                icon: '💬' },
  { href: '/admin/emails',               label: 'Inbox Email',                 icon: '📥' },
  { href: '/admin/emails/sent',          label: 'Sent / Outbox',               icon: '📤' },
  { href: '/admin/whatsapp',             label: 'WhatsApp OTP',                icon: '📱' },

  // ── Sistem ───────────────────────────────────────────────
  { group: 'Sistem' },
  { href: '/admin/cron-jobs',            label: 'Cron Jobs',                   icon: '⏰' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  function handleLogout() {
    clearAdminAuth()
    router.replace('/admin/login')
  }

  return (
    <aside className="w-64 h-screen sticky top-0 flex flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="px-4 pt-4 pb-3 shrink-0">
        <div className="text-lg font-bold">
          <span className="text-[#FE735C]">Bettazon</span>
          <span className="text-[#008080]"> Admin</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Panel Internal</p>
      </div>

      {/* Nav — scrollable */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        {menus.map((menu, i) => {
          if (menu.group) {
            return (
              <p key={i} className="px-2 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                {menu.group}
              </p>
            )
          }
          const active = pathname === menu.href || (menu.href !== '/admin/dashboard' && pathname.startsWith(menu.href))
          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? 'bg-[#FE735C]/10 text-[#FE735C] font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="text-base leading-none">{menu.icon}</span>
              <span>{menu.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 py-4 shrink-0 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  )
}

