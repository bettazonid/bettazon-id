'use client'

import { useEffect, useState } from 'react'
import { adminFetch } from '@/lib/adminApi'

function StatCard({ title, value, subtitle }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {subtitle ? <p className="text-xs text-gray-500 mt-1">{subtitle}</p> : null}
    </div>
  )
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [overview, setOverview] = useState(null)
  const [health, setHealth] = useState(null)

  useEffect(() => {
    let mounted = true

    async function loadData() {
      setLoading(true)
      setError('')

      try {
        const [overviewRes, healthRes] = await Promise.all([
          adminFetch('/api/admin/dashboard/overview'),
          adminFetch('/api/admin/system/health'),
        ])

        if (!mounted) return
        setOverview(overviewRes?.data || null)
        setHealth(healthRes?.data || null)
      } catch (err) {
        if (!mounted) return
        setError(err.message || 'Gagal memuat dashboard admin')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadData()
    return () => {
      mounted = false
    }
  }, [])

  if (loading) {
    return <p className="text-gray-600">Memuat dashboard...</p>
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
        {error}
      </div>
    )
  }

  const users = overview?.users || {}
  const revenue = overview?.revenue || {}
  const products = overview?.products || {}
  const wallets = overview?.wallets || {}
  const redisStatus =
    health?.redis?.status ||
    (health?.redis?.connected === true
      ? 'connected'
      : health?.redis?.connected === false
      ? 'disconnected'
      : 'unknown')

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        Ringkasan sistem Bettazon untuk monitoring cepat.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total User" value={users.total ?? 0} subtitle={`Seller/role aktif: ${users.collectors ?? 0}`} />
        <StatCard title="Total Produk" value={products.total ?? 0} subtitle={`Aktif: ${products.active ?? 0}`} />
        <StatCard title="Revenue Total" value={`Rp ${(revenue.totalRevenue ?? 0).toLocaleString('id-ID')}`} />
        <StatCard title="Wallet Aktif" value={wallets.totalWallets ?? 0} subtitle={`Saldo total: Rp ${(wallets.totalBalance ?? 0).toLocaleString('id-ID')}`} />
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="font-semibold text-gray-900 mb-2">System Health</h2>
        <div className="text-sm text-gray-600 space-y-1">
          <p>Status: <span className="font-medium text-gray-900">{health?.status || 'unknown'}</span></p>
          <p>Database: <span className="font-medium text-gray-900">{health?.database?.status || 'unknown'}</span></p>
          <p>Redis: <span className="font-medium text-gray-900">{redisStatus}</span></p>
        </div>
      </div>
    </div>
  )
}
