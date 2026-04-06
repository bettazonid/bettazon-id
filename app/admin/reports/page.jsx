'use client'

import { useCallback, useEffect, useState } from 'react'
import { adminDownload, adminFetch } from '@/lib/adminApi'

const GROUP_OPTIONS = [
  { value: 'day', label: 'Harian' },
  { value: 'week', label: 'Mingguan' },
  { value: 'month', label: 'Bulanan' },
]

function formatCurrency(value) {
  if (value == null || Number.isNaN(Number(value))) return '—'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value))
}

function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatPeriodLabel(id, groupBy) {
  if (!id) return '—'
  if (groupBy === 'week') return id // e.g. "2024-W50"
  if (groupBy === 'month') {
    const [year, month] = id.split('-')
    const d = new Date(Number(year), Number(month) - 1, 1)
    return d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
  }
  // day: "2024-12-15"
  const d = new Date(id + 'T00:00:00')
  if (Number.isNaN(d.getTime())) return id
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

function StatCard({ label, value, sub, color = 'text-gray-900' }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-5 py-4">
      <p className="text-xs text-gray-500 truncate">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

function defaultStart() {
  // Default: 2 years back to catch all historical data
  const d = new Date()
  d.setFullYear(d.getFullYear() - 2)
  return d.toISOString().slice(0, 10)
}

function defaultEnd() {
  return new Date().toISOString().slice(0, 10)
}

export default function AdminReportsPage() {
  const [startDate, setStartDate] = useState(defaultStart)
  const [endDate, setEndDate] = useState(defaultEnd)
  const [groupBy, setGroupBy] = useState('month')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [report, setReport] = useState(null)
  const [exporting, setExporting] = useState(false)

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const params = new URLSearchParams({ groupBy })
      if (startDate) params.set('startDate', new Date(startDate).toISOString())
      if (endDate) params.set('endDate', new Date(`${endDate}T23:59:59`).toISOString())
      const res = await adminFetch(`/api/admin/revenue/report?${params.toString()}`)
      setReport(res?.data ?? null)
    } catch (err) {
      setError(err.message || 'Gagal memuat laporan')
      setReport(null)
    } finally {
      setLoading(false)
    }
  }, [startDate, endDate, groupBy])

  useEffect(() => {
    fetchReport()
  }, [fetchReport])

  async function handleExport() {
    try {
      setExporting(true)
      const params = new URLSearchParams({ format: 'csv', groupBy })
      if (startDate) params.set('startDate', new Date(startDate).toISOString())
      if (endDate) params.set('endDate', new Date(`${endDate}T23:59:59`).toISOString())
      const response = await adminDownload(`/api/admin/revenue/export?${params.toString()}`)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `laporan-pendapatan-${startDate}-${endDate}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err.message || 'Gagal mengekspor laporan')
    } finally {
      setExporting(false)
    }
  }

  const totals = report?.totals ?? {}
  const rows = report?.data ?? []
  const period = report?.period ?? {}

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Laporan &amp; Pendapatan</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Ringkasan pendapatan dan transaksi platform Bettazon
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting || loading || !rows.length}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition"
        >
          {exporting ? 'Mengekspor…' : '⬇ Export CSV'}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-end rounded-xl border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Dari Tanggal</label>
          <input
            type="date"
            value={startDate}
            max={endDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FE735C]/40"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Sampai Tanggal</label>
          <input
            type="date"
            value={endDate}
            min={startDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FE735C]/40"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Grup Berdasarkan</label>
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FE735C]/40"
          >
            {GROUP_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={fetchReport}
          disabled={loading}
          className="rounded-lg bg-[#FE735C] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#e8604b] disabled:opacity-50 transition"
        >
          {loading ? 'Memuat…' : 'Terapkan'}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Pendapatan Platform"
          value={loading ? '…' : formatCurrency(totals.totalRevenue)}
          sub={period.start ? `${formatDate(period.start)} – ${formatDate(period.end)}` : undefined}
          color="text-[#FE735C]"
        />
        <StatCard
          label="Fee Order (Direct/Lelang)"
          value={loading ? '…' : formatCurrency(totals.totalOrderRevenue)}
          sub="Dari order yang selesai"
          color="text-[#008080]"
        />
        <StatCard
          label="Pendapatan Iklan Sponsor"
          value={loading ? '…' : formatCurrency(totals.totalAdRevenue)}
          sub="Budget iklan prepaid seller"
          color="text-purple-600"
        />
        <StatCard
          label="Rata-rata per Transaksi"
          value={loading ? '…' : formatCurrency(totals.averagePerTransaction)}
          sub={`${totals.totalTransactions?.toLocaleString('id-ID') ?? '0'} transaksi`}
        />
      </div>

      {/* Time-series table */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">
            Rincian per Periode
            {rows.length > 0 && (
              <span className="ml-2 text-xs font-normal text-gray-400">
                ({rows.length} baris)
              </span>
            )}
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-gray-400">Memuat data…</div>
        ) : rows.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">Tidak ada data untuk periode ini.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Periode
                  </th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Fee Order
                  </th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Iklan
                  </th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Total
                  </th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Transaksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2.5 text-gray-700 font-medium whitespace-nowrap">
                      {formatPeriodLabel(row._id, groupBy)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-[#008080] tabular-nums">
                      {formatCurrency(row.orderRevenue ?? 0)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-purple-600 tabular-nums">
                      {formatCurrency(Math.max(0, row.adRevenue ?? 0))}
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold text-[#FE735C] tabular-nums">
                      {formatCurrency(row.revenue ?? 0)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-gray-500 tabular-nums">
                      {(row.count ?? 0).toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 border-t border-gray-200 font-semibold">
                  <td className="px-4 py-2.5 text-gray-700">Total</td>
                  <td className="px-4 py-2.5 text-right text-[#008080] tabular-nums">
                    {formatCurrency(totals.totalOrderRevenue)}
                  </td>
                  <td className="px-4 py-2.5 text-right text-purple-600 tabular-nums">
                    {formatCurrency(totals.totalAdRevenue)}
                  </td>
                  <td className="px-4 py-2.5 text-right text-[#FE735C] tabular-nums">
                    {formatCurrency(totals.totalRevenue)}
                  </td>
                  <td className="px-4 py-2.5 text-right text-gray-500 tabular-nums">
                    {totals.totalTransactions?.toLocaleString('id-ID') ?? '—'}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
