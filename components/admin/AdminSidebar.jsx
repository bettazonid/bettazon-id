'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { clearAdminAuth } from '@/lib/adminApi'

const menus = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/reports', label: 'Laporan & Pendapatan' },
  { href: '/admin/fee-policy', label: 'Fee Policy' },
  { href: '/admin/order-config', label: 'Konfigurasi Order' },
  { href: '/admin/subscription-pricing', label: 'Harga Langganan' },
  { href: '/admin/ads', label: 'Iklan Sponsor' },
  { href: '/admin/withdrawals', label: 'Penarikan' },
  { href: '/admin/products', label: 'Produk' },
  { href: '/admin/orders', label: 'Pesanan' },
  { href: '/admin/emails', label: 'Inbox Email' },
  { href: '/admin/emails/sent', label: 'Sent/Outbox' },
  { href: '/admin/users', label: 'Pengguna' },
  { href: '/admin/chats', label: 'Chat Support' },
  { href: '/admin/transactions', label: 'Transaksi' },
  { href: '/admin/international-shipping', label: 'Pengiriman Internasional' },
  { href: '/admin/shipping/couriers', label: 'Kurir Domestik' },
  { href: '/admin/shipping/cities', label: 'Cache Kota (RajaOngkir)' },
  { href: '/admin/shipping/quarantine', label: 'Aturan Karantina' },
  { href: '/admin/cron-jobs', label: 'Cron Jobs' },
  { href: '/admin/whatsapp', label: 'WhatsApp OTP' },
  { href: '/admin/storage', label: 'Media Bucket' },
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
      {/* Logo — always visible */}
      <div className="px-4 pt-4 pb-3 shrink-0">
        <div className="text-lg font-bold">
          <span className="text-[#FE735C]">Bettazon</span>
          <span className="text-[#008080]"> Admin</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Panel Internal</p>
      </div>

      {/* Nav — scrollable */}
      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
        {menus.map((menu) => {
          const active = pathname === menu.href
          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? 'bg-[#FE735C]/10 text-[#FE735C] font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {menu.label}
            </Link>
          )
        })}
      </nav>

      {/* Logout — always visible */}
      <div className="px-4 py-4 shrink-0 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </aside>
  )
}
