'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { getAdminToken } from '@/lib/adminApi'

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    const token = getAdminToken()

    if (!isLoginPage && !token) {
      router.replace('/admin/login')
      return
    }

    if (isLoginPage && token) {
      router.replace('/admin/dashboard')
      return
    }

    setReady(true)
  }, [isLoginPage, router])

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Menyiapkan Admin Panel...
      </div>
    )
  }

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
