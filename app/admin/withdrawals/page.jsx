'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { adminFetch } from '@/lib/adminApi'

const statusOptions = [
  { value: '', label: 'Semua Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
  { value: 'cancelled', label: 'Cancelled' },
]

function statusBadge(status) {
  const map = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-700',
  }
  return map[status] || 'bg-gray-100 text-gray-700'
}

export default function AdminWithdrawalsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState(null)
  const [rows, setRows] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 20 })
  const [status, setStatus] = useState('')

  const queryString = useMemo(() => {
    const params = new URLSearchParams()
    params.set('page', String(pagination.page || 1))
    params.set('limit', String(pagination.limit || 20))
    if (status) params.set('status', status)
    return params.toString()
  }, [pagination.page, pagination.limit, status])

  useEffect(() => {
    let active = true

    async function loadData() {
      setLoading(true)
      setError('')

      try {
        const [statsRes, listRes] = await Promise.all([
          adminFetch('/api/withdrawals/admin/stats'),
          adminFetch(`/api/withdrawals/admin/all?${queryString}`),
        ])

        if (!active) return
        setStats(statsRes?.data || null)
        setRows(listRes?.data?.withdrawals || [])
        setPagination((prev) => ({
          ...prev,
          ...(listRes?.data?.pagination || {}),
        }))
      } catch (err) {
        if (!active) return
        setError(err.message || 'Gagal memuat data penarikan')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadData()
    return () => {
      active = false
    }
  }, [queryString])

  const totalPending = stats?.statusBreakdown?.pending || 0
  const totalCompleted = stats?.statusBreakdown?.completed || 0
  const totalAmount = stats?.totalAmount || 0

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Withdrawal Management</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola request penarikan seller.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-700">{totalPending}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-green-700">{totalCompleted}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Total Nominal</p>
          <p className="text-2xl font-bold text-gray-900">Rp {Number(totalAmount || 0).toLocaleString('id-ID')}</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex gap-2 items-center">
            <label className="text-sm text-gray-600">Filter Status:</label>
            <select
              value={status}
              onChange={(e) => {
                setPagination((p) => ({ ...p, page: 1 }))
                setStatus(e.target.value)
              }}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <p className="text-sm text-gray-500">Total data: {pagination.total || 0}</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-x-auto">
        {loading ? (
          <div className="p-6 text-gray-600">Memuat data penarikan...</div>
        ) : error ? (
          <div className="p-6 text-red-700">{error}</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-3">Nomor</th>
                <th className="text-left p-3">Seller</th>
                <th className="text-left p-3">Bank</th>
                <th className="text-left p-3">Jumlah</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Tanggal</th>
                <th className="text-left p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500">
                    Tidak ada data penarikan.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row._id} className="border-b border-gray-100">
                    <td className="p-3 font-medium text-gray-900">{row.withdrawalNumber}</td>
                    <td className="p-3">
                      <div className="font-medium text-gray-900">{row.user?.name || '-'}</div>
                      <div className="text-xs text-gray-500">{row.user?.email || row.user?.phone || '-'}</div>
                    </td>
                    <td className="p-3">
                      <div className="text-gray-900">{row.bankDetails?.bankName || '-'}</div>
                      <div className="text-xs text-gray-500">{row.bankDetails?.accountNumber || '-'}</div>
                    </td>
                    <td className="p-3 font-semibold">Rp {Number(row.amount || 0).toLocaleString('id-ID')}</td>
                    <td className="p-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusBadge(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">{new Date(row.createdAt).toLocaleString('id-ID')}</td>
                    <td className="p-3">
                      <Link
                        href={`/admin/withdrawals/${row._id}`}
                        className="inline-flex rounded-lg border border-gray-300 px-3 py-1.5 hover:bg-gray-100"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          disabled={(pagination.page || 1) <= 1}
          onClick={() => setPagination((p) => ({ ...p, page: Math.max(1, (p.page || 1) - 1) }))}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:opacity-50"
        >
          Sebelumnya
        </button>
        <p className="text-sm text-gray-600">
          Halaman {pagination.page || 1} / {pagination.pages || 1}
        </p>
        <button
          disabled={(pagination.page || 1) >= (pagination.pages || 1)}
          onClick={() => setPagination((p) => ({ ...p, page: Math.min(p.pages || 1, (p.page || 1) + 1) }))}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:opacity-50"
        >
          Berikutnya
        </button>
      </div>
    </div>
  )
}
