'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { adminFetch } from '@/lib/adminApi'

const ROLE_LABEL = {
  buyer: 'Buyer',
  seller: 'Seller',
  admin: 'Admin',
}

function Pill({ children, tone = 'gray' }) {
  const toneClass = {
    gray: 'bg-gray-100 text-gray-700 border-gray-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
  }[tone]

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium ${toneClass}`}>
      {children}
    </span>
  )
}

function StatCard({ label, value, tone = 'gray' }) {
  const valueClass = {
    gray: 'text-gray-900',
    green: 'text-emerald-600',
    red: 'text-red-600',
    blue: 'text-blue-600',
  }[tone]

  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-xl font-bold mt-0.5 ${valueClass}`}>{value}</p>
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

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoadingUserId, setActionLoadingUserId] = useState('')
  const [actionMsg, setActionMsg] = useState(null)

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  const [searchInput, setSearchInput] = useState('')
  const [q, setQ] = useState('')
  const [role, setRole] = useState('')
  const [isActive, setIsActive] = useState('')
  const [isEmailVerified, setIsEmailVerified] = useState('')
  const [sort, setSort] = useState('createdAt')
  const [order, setOrder] = useState('desc')

  const [summary, setSummary] = useState(null)

  const fetchSummary = useCallback(async () => {
    try {
      const res = await adminFetch('/api/users/admin/dashboard')
      setSummary(res?.data?.summary || null)
    } catch {
      // non-blocking
      setSummary(null)
    }
  }, [])

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        sort,
        order,
      })

      if (q) params.set('q', q)
      if (role) params.set('role', role)
      if (isActive) params.set('isActive', isActive)
      if (isEmailVerified) params.set('isEmailVerified', isEmailVerified)

      const res = await adminFetch(`/api/users/search?${params.toString()}`)
      const data = res?.data || {}
      setUsers(data.users || [])
      setTotalPages(data.pagination?.totalPages || 1)
      setTotalItems(data.pagination?.totalItems || 0)
    } catch (err) {
      setError(err.message || 'Gagal memuat data pengguna')
      setUsers([])
      setTotalPages(1)
      setTotalItems(0)
    } finally {
      setLoading(false)
    }
  }, [page, limit, sort, order, q, role, isActive, isEmailVerified])

  useEffect(() => {
    fetchSummary()
  }, [fetchSummary])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const localStats = useMemo(() => {
    const active = users.filter((u) => u.isActive).length
    const inactive = users.length - active
    const verified = users.filter((u) => u.isEmailVerified).length
    return { active, inactive, verified }
  }, [users])

  const onSubmitSearch = (e) => {
    e.preventDefault()
    setPage(1)
    setQ(searchInput.trim())
  }

  const onResetFilters = () => {
    setPage(1)
    setSearchInput('')
    setQ('')
    setRole('')
    setIsActive('')
    setIsEmailVerified('')
    setSort('createdAt')
    setOrder('desc')
  }

  const handleDeactivate = async (user) => {
    const reason = window.prompt(`Masukkan alasan nonaktifkan user ${user.name || user.email || user._id}:`, 'Pelanggaran kebijakan')
    if (reason === null) return

    try {
      setActionLoadingUserId(user._id)
      setActionMsg(null)
      await adminFetch(`/api/users/${user._id}/deactivate`, {
        method: 'PUT',
        body: JSON.stringify({ reason: reason.trim() || 'Dinonaktifkan admin' }),
      })
      setActionMsg({ type: 'success', text: 'User berhasil dinonaktifkan.' })
      await fetchUsers()
      await fetchSummary()
    } catch (err) {
      setActionMsg({ type: 'error', text: err.message || 'Gagal menonaktifkan user.' })
    } finally {
      setActionLoadingUserId('')
    }
  }

  const handleReactivate = async (user) => {
    try {
      setActionLoadingUserId(user._id)
      setActionMsg(null)
      await adminFetch(`/api/users/${user._id}/reactivate`, {
        method: 'PUT',
      })
      setActionMsg({ type: 'success', text: 'User berhasil diaktifkan kembali.' })
      await fetchUsers()
      await fetchSummary()
    } catch (err) {
      setActionMsg({ type: 'error', text: err.message || 'Gagal mengaktifkan user.' })
    } finally {
      setActionLoadingUserId('')
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pengguna</h1>
          <p className="text-sm text-gray-500 mt-0.5">Kelola akun user, status aktif, dan verifikasi</p>
        </div>
        <span className="text-sm text-gray-500">{totalItems.toLocaleString('id-ID')} user</span>
      </div>

      {(summary || users.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Total" value={summary?.totalUsers ?? totalItems} />
          <StatCard label="Aktif (halaman ini)" value={localStats.active} tone="green" />
          <StatCard label="Nonaktif (halaman ini)" value={localStats.inactive} tone="red" />
          <StatCard label="Email Verified (halaman ini)" value={localStats.verified} tone="blue" />
        </div>
      )}

      {actionMsg && (
        <div className={`rounded-xl px-4 py-3 text-sm font-medium border ${
          actionMsg.type === 'success'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          {actionMsg.text}
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
        <form onSubmit={onSubmitSearch} className="flex flex-col lg:flex-row gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari nama / email..."
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-[#008080] text-white text-sm font-medium hover:bg-[#006666]"
          >
            Cari
          </button>
          <button
            type="button"
            onClick={onResetFilters}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm hover:bg-gray-50"
          >
            Reset
          </button>
        </form>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-2">
          <select
            value={role}
            onChange={(e) => { setPage(1); setRole(e.target.value) }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Semua Role</option>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
          </select>

          <select
            value={isActive}
            onChange={(e) => { setPage(1); setIsActive(e.target.value) }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Status Aktif</option>
            <option value="true">Aktif</option>
            <option value="false">Nonaktif</option>
          </select>

          <select
            value={isEmailVerified}
            onChange={(e) => { setPage(1); setIsEmailVerified(e.target.value) }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Email Verification</option>
            <option value="true">Verified</option>
            <option value="false">Belum Verified</option>
          </select>

          <select
            value={sort}
            onChange={(e) => { setPage(1); setSort(e.target.value) }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="createdAt">Sort: Tanggal Daftar</option>
            <option value="updatedAt">Sort: Last Update</option>
            <option value="lastLogin">Sort: Last Login</option>
            <option value="name">Sort: Nama</option>
          </select>

          <select
            value={order}
            onChange={(e) => { setPage(1); setOrder(e.target.value) }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="desc">Urutan: Desc</option>
            <option value="asc">Urutan: Asc</option>
          </select>

          <select
            value={String(limit)}
            onChange={(e) => { setPage(1); setLimit(Number(e.target.value)) }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="10">10 / halaman</option>
            <option value="20">20 / halaman</option>
            <option value="50">50 / halaman</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        {error && (
          <div className="px-6 py-4 bg-red-50 border-b border-red-100 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-gray-400 text-sm">Memuat pengguna...</div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">Tidak ada data pengguna sesuai filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">User</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">Role</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">Status</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">Verifikasi</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">Terdaftar</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">Last Login</th>
                  <th className="px-5 py-3 text-center font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => {
                  const roles = Array.isArray(user.roles)
                    ? user.roles.map((r) => r.role).filter((r) => ['buyer', 'seller', 'admin'].includes(r))
                    : []
                  const isAdmin = roles.includes('admin') || user.currentRole === 'admin'
                  const isBusy = actionLoadingUserId === user._id

                  return (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-gray-900">{user.name || 'Tanpa Nama'}</p>
                        <p className="text-xs text-gray-500">{user.email || 'Tanpa Email'}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{user.phone || 'Tanpa HP'}</p>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-1.5">
                          <Pill tone="blue">Aktif: {ROLE_LABEL[user.currentRole] || '—'}</Pill>
                          {roles.slice(0, 3).map((r) => (
                            <Pill key={`${user._id}-${r}`}>{ROLE_LABEL[r] || r}</Pill>
                          ))}
                          {roles.length > 3 && <Pill>+{roles.length - 3}</Pill>}
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        {user.isActive ? <Pill tone="green">Aktif</Pill> : <Pill tone="red">Nonaktif</Pill>}
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="space-y-1">
                          <div>{user.isEmailVerified ? <Pill tone="green">Email Verified</Pill> : <Pill tone="orange">Email Unverified</Pill>}</div>
                          <div>{user.isPhoneVerified ? <Pill tone="green">HP Verified</Pill> : <Pill>HP Unverified</Pill>}</div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-xs text-gray-600 whitespace-nowrap">
                        {formatDateTime(user.createdAt)}
                      </td>

                      <td className="px-5 py-3.5 text-xs text-gray-600 whitespace-nowrap">
                        {formatDateTime(user.lastLogin)}
                      </td>

                      <td className="px-5 py-3.5 text-center">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/admin/users/${user._id}`}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 text-xs font-medium hover:bg-gray-50"
                          >
                            Detail
                          </Link>
                          {user.isActive ? (
                            <button
                              disabled={isBusy || isAdmin}
                              onClick={() => handleDeactivate(user)}
                              className="px-3 py-1.5 rounded-lg border border-red-200 text-red-700 text-xs font-medium hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
                              title={isAdmin ? 'Akun admin tidak bisa dinonaktifkan dari menu ini' : 'Nonaktifkan user'}
                            >
                              {isBusy ? 'Proses...' : 'Nonaktifkan'}
                            </button>
                          ) : (
                            <button
                              disabled={isBusy}
                              onClick={() => handleReactivate(user)}
                              className="px-3 py-1.5 rounded-lg border border-emerald-200 text-emerald-700 text-xs font-medium hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              {isBusy ? 'Proses...' : 'Aktifkan'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && users.length > 0 && (
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
