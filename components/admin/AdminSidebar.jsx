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
    <aside className="w-64 min-h-screen border-r border-gray-200 bg-white p-4">
      <div className="mb-6">
        <div className="text-lg font-bold">
          <span className="text-[#FE735C]">Bettazon</span>
          <span className="text-[#008080]"> Admin</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Panel Internal</p>
      </div>

      <nav className="space-y-1">
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

      <button
        onClick={handleLogout}
        className="mt-8 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Logout
      </button>
    </aside>
  )
}
