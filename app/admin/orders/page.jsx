'use client'

import { useState, useEffect, useCallback } from 'react'
import { adminFetch } from '@/lib/adminApi'
import Link from 'next/link'

const STATUS_META = {
  pending:         { label: 'Menunggu Pembayaran', color: 'bg-yellow-100 text-yellow-800' },
  payment_pending: { label: 'Konfirmasi Pembayaran', color: 'bg-amber-100 text-amber-800' },
  paid:            { label: 'Dibayar', color: 'bg-blue-100 text-blue-800' },
  processing:      { label: 'Diproses', color: 'bg-cyan-100 text-cyan-800' },
  shipped:         { label: 'Dikirim', color: 'bg-purple-100 text-purple-800' },
  delivered:       { label: 'Diterima', color: 'bg-indigo-100 text-indigo-800' },
  completed:       { label: 'Selesai', color: 'bg-emerald-100 text-emerald-800' },
  cancelled:       { label: 'Dibatalkan', color: 'bg-red-100 text-red-800' },
  disputed:        { label: 'Dispute', color: 'bg-orange-100 text-orange-800' },
  refunded:        { label: 'Refund', color: 'bg-gray-200 text-gray-700' },
}

const ORDER_TYPE_META = {
  direct_buy:    'Beli Langsung',
  auction_win:   'Lelang',
  live_purchase: 'Live Purchase',
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || { label: status?.replace(/_/g, ' ') || '—', color: 'bg-gray-100 text-gray-700' }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${meta.color}`}>
      {meta.label}
    </span>
  )
}

function StatCard({ label, value, color = 'text-gray-900' }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
      <p className="text-xs text-gray-500 truncate">{label}</p>
      <p className={`text-xl font-bold mt-0.5 ${color}`}>{value}</p>
    </div>
  )
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState('')
  const [orderType, setOrderType] = useState('')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [stats, setStats] = useState(null)

  const fetchStats = useCallback(async () => {
    try {
      const res = await adminFetch('/api/admin/orders/statistics')
      setStats(res.data || {})
    } catch (err) {
      console.error('Gagal memuat statistik:', err)
    }
  }, [])

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams({ page, limit: 20 })
      if (status) params.set('status', status)
      if (orderType) params.set('orderType', orderType)
      if (search) params.set('search', search)
      const data = await adminFetch(`/api/orders/my-orders?${params}`)
      const result = data.data || {}
      setOrders(result.orders || [])
      setTotalPages(result.pagination?.totalPages || 1)
      setTotal(result.pagination?.total || 0)
    } catch (err) {
      setError(err.message || 'Gagal memuat pesanan')
    } finally {
      setLoading(false)
    }
  }, [page, status, orderType, search])

  useEffect(() => { fetchStats() }, [fetchStats])
  useEffect(() => { fetchOrders() }, [fetchOrders])

  const handleFilter = (field, value) => {
    setPage(1)
    if (field === 'status') setStatus(value)
    if (field === 'orderType') setOrderType(value)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    setSearch(searchInput)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pesanan</h1>
          <p className="text-sm text-gray-500 mt-0.5">Kelola semua transaksi pesanan pembeli</p>
        </div>
        {total > 0 && (
          <span className="text-sm text-gray-500">{total.toLocaleString('id-ID')} pesanan</span>
        )}
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
          <StatCard label="Total" value={stats.totalOrders ?? 0} />
          <StatCard
            label="Menunggu Bayar"
            value={(stats.pendingOrders ?? 0) + (stats.paymentPendingOrders ?? 0)}
            color="text-yellow-600"
          />
          <StatCard
            label="Diproses / Dikirim"
            value={(stats.processingOrders ?? 0) + (stats.shippedOrders ?? 0)}
            color="text-blue-600"
          />
          <StatCard label="Selesai" value={stats.completedOrders ?? 0} color="text-emerald-600" />
          <StatCard
            label="Dispute / Batal"
            value={(stats.disputedOrders ?? 0) + (stats.cancelledOrders ?? 0)}
            color="text-red-600"
          />
        </div>
      )}

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-0">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari nomor pesanan..."
            className="flex-1 min-w-0 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#008080]"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-[#008080] text-white text-sm font-medium hover:bg-[#006666] transition-colors"
          >
            Cari
          </button>
          {search && (
            <button
              type="button"
              onClick={() => { setSearch(''); setSearchInput(''); setPage(1) }}
              className="px-3 py-2 rounded-lg border border-gray-300 text-gray-500 text-sm hover:bg-gray-50 transition-colors"
            >
              ✕
            </button>
          )}
        </form>
        <select
          value={status}
          onChange={(e) => handleFilter('status', e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#008080]"
        >
          <option value="">Semua Status</option>
          {Object.entries(STATUS_META).map(([val, { label }]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
        <select
          value={orderType}
          onChange={(e) => handleFilter('orderType', e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#008080]"
        >
          <option value="">Semua Tipe</option>
          {Object.entries(ORDER_TYPE_META).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        {error && (
          <div className="px-6 py-4 bg-red-50 border-b border-red-100 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-gray-400 text-sm">Memuat pesanan...</div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            {search || status || orderType ? 'Tidak ada pesanan yang sesuai filter' : 'Belum ada pesanan'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">No. Pesanan</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">Pembeli</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">Produk</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">Tipe</th>
                  <th className="px-5 py-3 text-right font-semibold text-gray-700">Total</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">Status</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">Tanggal</th>
                  <th className="px-5 py-3 text-center font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => {
                  const productName =
                    order.product?.name ||
                    order.product?.title ||
                    (order.items?.length ? `${order.items.length} item` : '—')
                  const totalAmount =
                    order.payment?.totalAmount ||
                    order.pricing?.totalAmount ||
                    order.totalAmount || 0
                  return (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs font-semibold text-gray-800">
                          {order.orderNumber || order._id?.slice(-8)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-gray-900">{order.buyer?.name || '—'}</p>
                        <p className="text-xs text-gray-400">{order.buyer?.phone || order.buyer?.email || ''}</p>
                      </td>
                      <td className="px-5 py-3.5 max-w-[160px]">
                        <p className="truncate text-gray-700">{productName}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs text-gray-500">
                          {ORDER_TYPE_META[order.orderType] || order.orderType || '—'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-semibold text-gray-900">
                        Rp {totalAmount.toLocaleString('id-ID')}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString('id-ID', {
                          day: '2-digit', month: 'short', year: 'numeric',
                        })}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <Link
                          href={`/admin/orders/${order._id}`}
                          className="text-[#008080] hover:text-[#006666] font-medium text-xs"
                        >
                          Detail →
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && orders.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 text-sm">
            <p className="text-gray-500">Halaman {page} dari {totalPages}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
