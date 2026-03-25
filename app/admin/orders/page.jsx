'use client'

import { useState, useEffect } from 'react'
import { adminFetch } from '@/lib/adminApi'
import Link from 'next/link'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [status, setStatus] = useState('')
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [page, status])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page,
        limit: 20,
        ...(status && { status }),
      })

      const data = await adminFetch(`/orders?${params}`)
      setOrders(data.data?.orders || data.data || [])
      setTotalPages(data.data?.pagination?.totalPages || 1)
    } catch (err) {
      setError(err.message || 'Gagal memuat pesanan')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await adminFetch('/orders/statistics')
      setStats(response.data || {})
    } catch (err) {
      console.error('Gagal memuat statistik:', err)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const handleStatusChange = () => {
    setPage(1)
  }

  const statusColors = {
    pending_payment: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-blue-100 text-blue-800',
    preparing: 'bg-cyan-100 text-cyan-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    completed: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800',
    dispute: 'bg-orange-100 text-orange-800',
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { label: 'Total Pesanan', value: stats.totalOrders || 0 },
            { label: 'Menunggu Pembayaran', value: stats.pendingOrders || 0 },
            { label: 'Dikirim', value: stats.shippedOrders || 0 },
            { label: 'Selesai', value: stats.completedOrders || 0 },
            { label: 'Dibatalkan', value: stats.cancelledOrders || 0 },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter Status Pesanan
        </label>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value)
            handleStatusChange()
          }}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#008080]"
        >
          <option value="">Semua Status</option>
          <option value="pending_payment">Menunggu Pembayaran</option>
          <option value="paid">Dibayar</option>
          <option value="preparing">Sedang Disiapkan</option>
          <option value="shipped">Dikirim</option>
          <option value="delivered">Diterima</option>
          <option value="completed">Selesai</option>
          <option value="cancelled">Dibatalkan</option>
          <option value="dispute">Dispute</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
        {error && (
          <div className="p-4 bg-red-50 text-red-700 border-b border-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Memuat pesanan...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Tidak ada pesanan
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Nomor Pesanan
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Pembeli
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Tindakan
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-mono text-sm font-medium text-gray-900">
                        {order.orderNumber || order._id?.slice(0, 8)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.buyer?.name || order.buyerId || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.buyer?.phone || order.buyer?.email || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">
                        Rp {(order.totalAmount || order.amount)?.toLocaleString('id-ID') || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          statusColors[order.status] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {order.status?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="text-[#008080] hover:text-[#006666] font-medium text-sm"
                      >
                        Lihat
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && orders.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
            <div className="text-sm text-gray-600">
              Halaman {page} dari {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Berikutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
