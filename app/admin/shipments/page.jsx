'use client'

import { useState, useEffect, useCallback } from 'react'
import { adminFetch } from '@/lib/adminApi'

const STATUS_META = {
  unused:    { label: 'Belum Dipakai', color: 'bg-blue-100 text-blue-800' },
  used:      { label: 'Sudah Dipakai', color: 'bg-emerald-100 text-emerald-800' },
  expired:   { label: 'Kadaluarsa', color: 'bg-gray-200 text-gray-600' },
  cancelled: { label: 'Dibatalkan', color: 'bg-red-100 text-red-700' },
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || { label: status, color: 'bg-gray-100 text-gray-700' }
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
      <p className={`text-xl font-bold mt-0.5 ${color}`}>{value ?? '—'}</p>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500 shrink-0">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right break-all">{value || '—'}</span>
    </div>
  )
}

export default function AdminShipmentsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [actionMsg, setActionMsg] = useState(null)
  const [revokeLoading, setRevokeLoading] = useState(null)
  const [selected, setSelected] = useState(null)

  const LIMIT = 20

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams({ page, limit: LIMIT })
      if (statusFilter) params.set('status', statusFilter)
      if (dateFrom) params.set('dateFrom', dateFrom)
      if (dateTo) params.set('dateTo', dateTo)
      const data = await adminFetch(`/api/shipment-verification/admin/list?${params}`)
      const result = data.data || {}
      setItems(result.items || [])
      setTotal(result.total || 0)
    } catch (err) {
      setError(err.message || 'Gagal memuat data')
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter, dateFrom, dateTo])

  useEffect(() => { fetchItems() }, [fetchItems])

  const handleRevoke = async (id) => {
    if (!confirm('Batalkan shipment authorization ini?')) return
    try {
      setRevokeLoading(id)
      setActionMsg(null)
      await adminFetch(`/api/shipment-verification/admin/${id}/revoke`, { method: 'POST' })
      setActionMsg({ type: 'success', text: 'Shipment authorization berhasil dibatalkan' })
      fetchItems()
      if (selected?._id === id) setSelected(null)
    } catch (err) {
      setActionMsg({ type: 'error', text: err.message || 'Gagal membatalkan' })
    } finally {
      setRevokeLoading(null)
    }
  }

  const totalPages = Math.ceil(total / LIMIT)

  // Stats from current page data (simple)
  const stats = {
    unused: items.filter(i => i.status === 'unused').length,
    used: items.filter(i => i.status === 'used').length,
    expired: items.filter(i => i.status === 'expired').length,
    cancelled: items.filter(i => i.status === 'cancelled').length,
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Shipment Authorization</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola label otorisasi pengiriman Bettazon × JNE</p>
      </div>

      {/* Stats (halaman aktif) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Belum Dipakai" value={stats.unused} color="text-blue-600" />
        <StatCard label="Sudah Dipakai" value={stats.used} color="text-emerald-600" />
        <StatCard label="Kadaluarsa" value={stats.expired} color="text-gray-500" />
        <StatCard label="Dibatalkan" value={stats.cancelled} color="text-red-500" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
            className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Semua</option>
            <option value="unused">Belum Dipakai</option>
            <option value="used">Sudah Dipakai</option>
            <option value="expired">Kadaluarsa</option>
            <option value="cancelled">Dibatalkan</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Dari Tanggal</label>
          <input
            type="date"
            value={dateFrom}
            onChange={e => { setDateFrom(e.target.value); setPage(1) }}
            className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Sampai Tanggal</label>
          <input
            type="date"
            value={dateTo}
            onChange={e => { setDateTo(e.target.value); setPage(1) }}
            className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <button
          onClick={() => { setStatusFilter(''); setDateFrom(''); setDateTo(''); setPage(1) }}
          className="text-xs text-gray-500 hover:text-red-500 underline self-end pb-1"
        >
          Reset Filter
        </button>
      </div>

      {actionMsg && (
        <div className={`mb-4 rounded-lg px-4 py-3 text-sm font-medium ${actionMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {actionMsg.text}
        </div>
      )}

      {/* Main content: list + detail side panel */}
      <div className="flex gap-4">
        {/* List */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="text-center py-16 text-gray-400">Memuat data...</div>
          ) : error ? (
            <div className="text-center py-16 text-red-500">{error}</div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 text-gray-400">Tidak ada data</div>
          ) : (
            <>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Token</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Seller</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Order</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Berlaku s/d</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.map(item => (
                      <tr
                        key={item._id}
                        className={`hover:bg-gray-50 cursor-pointer transition-colors ${selected?._id === item._id ? 'bg-teal-50' : ''}`}
                        onClick={() => setSelected(item)}
                      >
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs text-gray-700">{item.jneToken}</span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-gray-600">
                          {item.sellerId?.storeName || item.sellerId?.name || '—'}
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell text-gray-600">
                          {item.orderId?.orderNumber || '—'}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-500">
                          {item.expiredAt ? new Date(item.expiredAt).toLocaleString('id-ID') : '—'}
                        </td>
                        <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                          {(item.status === 'unused') && (
                            <button
                              onClick={() => handleRevoke(item._id)}
                              disabled={revokeLoading === item._id}
                              className="text-xs text-red-500 hover:text-red-700 font-medium disabled:opacity-50"
                            >
                              {revokeLoading === item._id ? 'Membatalkan...' : 'Batalkan'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-500">Total: {total} data</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-50"
                    >
                      ‹ Prev
                    </button>
                    <span className="px-3 py-1.5 text-sm text-gray-600">
                      {page} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-50"
                    >
                      Next ›
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Detail side panel */}
        {selected && (
          <div className="w-80 shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800 text-sm">Detail Authorization</h3>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700 text-lg leading-none">&times;</button>
              </div>
              <div className="space-y-0.5">
                <InfoRow label="Token" value={<span className="font-mono text-xs">{selected.jneToken}</span>} />
                <InfoRow label="Referensi" value={selected.shipmentReference} />
                <InfoRow label="Status" value={<StatusBadge status={selected.status} />} />
                <InfoRow label="Seller" value={selected.sellerId?.storeName || selected.sellerId?.name} />
                <InfoRow label="Order" value={selected.orderId?.orderNumber} />
                <InfoRow label="Penerima" value={selected.shipmentData?.receiverName} />
                <InfoRow label="Layanan" value={selected.shipmentData?.shippingService} />
                <InfoRow label="Dibuat" value={selected.generatedAt ? new Date(selected.generatedAt).toLocaleString('id-ID') : '—'} />
                <InfoRow label="Berlaku s/d" value={selected.expiredAt ? new Date(selected.expiredAt).toLocaleString('id-ID') : '—'} />
                {selected.usedAt && <InfoRow label="Dipakai" value={new Date(selected.usedAt).toLocaleString('id-ID')} />}
                {selected.branchUsed && <InfoRow label="Cabang JNE" value={selected.branchUsed} />}
                {selected.verifiedBy && <InfoRow label="Diverifikasi oleh" value={selected.verifiedBy} />}
              </div>
              {selected.labelUrl && (
                <a
                  href={selected.labelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium transition-colors"
                >
                  📄 Download Label PDF
                </a>
              )}
              {selected.status === 'unused' && (
                <button
                  onClick={() => handleRevoke(selected._id)}
                  disabled={revokeLoading === selected._id}
                  className="mt-2 w-full py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 text-sm font-medium disabled:opacity-50 transition-colors"
                >
                  {revokeLoading === selected._id ? 'Membatalkan...' : 'Batalkan Authorization'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
