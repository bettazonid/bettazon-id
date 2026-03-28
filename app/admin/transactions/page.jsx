'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { adminDownload, adminFetch } from '@/lib/adminApi'

const TYPE_LABEL = {
  topup: 'Top Up',
  fee_deduction: 'Potongan Fee',
  refund: 'Refund',
  adjustment: 'Adjustment Admin',
  withdrawal: 'Withdrawal',
  escrow_deposit: 'Escrow Deposit',
  escrow_release: 'Escrow Release',
  collector_earning: 'Collector Earning',
  platform_fee: 'Platform Fee',
  payment_gateway_fee: 'Gateway Fee',
}

const STATUS_TONE = {
  pending: 'bg-amber-100 text-amber-800',
  completed: 'bg-emerald-100 text-emerald-800',
  failed: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-200 text-gray-700',
}

function StatusBadge({ status }) {
  const cls = STATUS_TONE[status] || 'bg-gray-100 text-gray-700'
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {status || 'unknown'}
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

function formatDateTime(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const [type, setType] = useState('')
  const [status, setStatus] = useState('')
  const [userInput, setUserInput] = useState('')
  const [user, setUser] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [exporting, setExporting] = useState('')

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      })
      if (type) params.set('type', type)
      if (status) params.set('status', status)
      if (user) params.set('user', user)
      if (startDate) params.set('startDate', new Date(startDate).toISOString())
      if (endDate) params.set('endDate', new Date(`${endDate}T23:59:59`).toISOString())

      const res = await adminFetch(`/api/admin/transactions?${params.toString()}`)
      const data = res?.data || {}
      setTransactions(data.transactions || [])
      setTotalPages(data.pagination?.totalPages || 1)
      setTotal(data.pagination?.total || 0)
    } catch (err) {
      setError(err.message || 'Gagal memuat transaksi')
      setTransactions([])
      setTotalPages(1)
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [page, limit, type, status, user, startDate, endDate])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const stats = useMemo(() => {
    const completed = transactions.filter((t) => t.status === 'completed').length
    const failed = transactions.filter((t) => t.status === 'failed').length
    const totalAmount = transactions.reduce((sum, t) => sum + Number(t.amount || 0), 0)
    return { completed, failed, totalAmount }
  }, [transactions])

  const onApplyUserFilter = (e) => {
    e.preventDefault()
    setPage(1)
    setUser(userInput.trim())
  }

  const onReset = () => {
    setPage(1)
    setLimit(20)
    setType('')
    setStatus('')
    setStartDate('')
    setEndDate('')
    setUser('')
    setUserInput('')
  }

  const handleExport = async (format) => {
    try {
      setExporting(format)

      const params = new URLSearchParams({ format })
      if (type) params.set('type', type)
      if (status) params.set('status', status)
      if (user) params.set('user', user)
      if (startDate) params.set('startDate', new Date(startDate).toISOString())
      if (endDate) params.set('endDate', new Date(`${endDate}T23:59:59`).toISOString())

      const res = await adminDownload(`/api/admin/transactions/export?${params.toString()}`)
      const blob = await res.blob()

      const contentDisposition = res.headers.get('content-disposition') || ''
      const filenameMatch = contentDisposition.match(/filename="?([^\"]+)"?/i)
      const filename = filenameMatch?.[1] || `transactions-export.${format}`

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err.message || 'Gagal export transaksi')
    } finally {
      setExporting('')
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transaksi</h1>
          <p className="text-sm text-gray-500 mt-0.5">Audit semua transaksi wallet lintas pengguna</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleExport('xlsx')}
            disabled={!!exporting}
            className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting === 'xlsx' ? 'Export...' : 'Export Excel'}
          </button>
          <button
            type="button"
            onClick={() => handleExport('csv')}
            disabled={!!exporting}
            className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting === 'csv' ? 'Export...' : 'Export CSV'}
          </button>
          <button
            type="button"
            onClick={() => handleExport('pdf')}
            disabled={!!exporting}
            className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting === 'pdf' ? 'Export...' : 'Export PDF'}
          </button>
          <span className="text-sm text-gray-500">{total.toLocaleString('id-ID')} transaksi</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total (filtered)" value={total} />
        <StatCard label="Completed (halaman ini)" value={stats.completed} color="text-emerald-600" />
        <StatCard label="Failed (halaman ini)" value={stats.failed} color="text-red-600" />
        <StatCard label="Net Amount (halaman ini)" value={`Rp ${stats.totalAmount.toLocaleString('id-ID')}`} color="text-blue-600" />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-2">
          <select
            value={type}
            onChange={(e) => { setPage(1); setType(e.target.value) }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Semua Tipe</option>
            {Object.entries(TYPE_LABEL).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => { setPage(1); setStatus(e.target.value) }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Semua Status</option>
            <option value="pending">pending</option>
            <option value="completed">completed</option>
            <option value="failed">failed</option>
            <option value="cancelled">cancelled</option>
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => { setPage(1); setStartDate(e.target.value) }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => { setPage(1); setEndDate(e.target.value) }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />

          <select
            value={String(limit)}
            onChange={(e) => { setPage(1); setLimit(Number(e.target.value)) }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="10">10 / halaman</option>
            <option value="20">20 / halaman</option>
            <option value="50">50 / halaman</option>
          </select>

          <button
            type="button"
            onClick={onReset}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Reset Filter
          </button>
        </div>

        <form onSubmit={onApplyUserFilter} className="flex gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Filter user (nama/email/nomor HP)"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-[#008080] text-white text-sm font-medium hover:bg-[#006666]"
          >
            Terapkan
          </button>
        </form>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        {error && (
          <div className="px-6 py-4 bg-red-50 border-b border-red-100 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-gray-400 text-sm">Memuat transaksi...</div>
        ) : transactions.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">Tidak ada transaksi sesuai filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">Tanggal</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">User</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">Tipe</th>
                  <th className="px-5 py-3 text-right font-semibold text-gray-700">Amount</th>
                  <th className="px-5 py-3 text-right font-semibold text-gray-700">Before → After</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">Status</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">Deskripsi</th>
                  <th className="px-5 py-3 text-center font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 text-xs text-gray-600 whitespace-nowrap">
                      {formatDateTime(tx.createdAt)}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-900">{tx.user?.name || '—'}</p>
                      <p className="text-xs text-gray-500">{tx.user?.email || tx.user?.phone || '—'}</p>
                      {tx.user?._id ? (
                        <Link href={`/admin/users/${tx.user._id}`} className="text-xs text-[#008080] hover:text-[#006666]">
                          Detail User →
                        </Link>
                      ) : null}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-gray-700">{TYPE_LABEL[tx.type] || tx.type || '—'}</span>
                    </td>
                    <td className={`px-5 py-3.5 text-right font-semibold ${Number(tx.amount) >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                      Rp {Number(tx.amount || 0).toLocaleString('id-ID')}
                    </td>
                    <td className="px-5 py-3.5 text-right text-xs text-gray-600 whitespace-nowrap">
                      {Number(tx.balanceBefore || 0).toLocaleString('id-ID')} → {Number(tx.balanceAfter || 0).toLocaleString('id-ID')}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={tx.status} />
                    </td>
                    <td className="px-5 py-3.5 max-w-[320px]">
                      <p className="truncate text-gray-700" title={tx.description || '—'}>{tx.description || '—'}</p>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <Link
                        href={`/admin/transactions/${tx._id}`}
                        className="text-[#008080] hover:text-[#006666] font-medium text-xs"
                      >
                        Detail →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && transactions.length > 0 && (
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
                disabled={page >= totalPages}
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
