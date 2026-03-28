'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
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

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500 shrink-0">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right break-all">{value || '—'}</span>
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

export default function AdminUserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params?.id

  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [actionMsg, setActionMsg] = useState(null)

  const isAdminAccount = useMemo(() => {
    if (!user) return false
    const roles = Array.isArray(user.roles) ? user.roles.map((r) => r.role) : []
    return user.currentRole === 'admin' || roles.includes('admin')
  }, [user])

  const fetchDetail = useCallback(async () => {
    if (!userId) return
    try {
      setLoading(true)
      setError('')

      const [userRes, statsRes] = await Promise.all([
        adminFetch(`/api/users/${userId}?populate=addresses`),
        adminFetch(`/api/users/${userId}/statistics`),
      ])

      setUser(userRes?.data || null)
      setStats(statsRes?.data || null)
    } catch (err) {
      setError(err.message || 'Gagal memuat detail user')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchDetail()
  }, [fetchDetail])

  const handleDeactivate = async () => {
    if (!user?._id) return
    const reason = window.prompt('Masukkan alasan nonaktifkan user:', 'Pelanggaran kebijakan')
    if (reason === null) return

    try {
      setActionLoading(true)
      setActionMsg(null)
      await adminFetch(`/api/users/${user._id}/deactivate`, {
        method: 'PUT',
        body: JSON.stringify({ reason: reason.trim() || 'Dinonaktifkan admin' }),
      })
      setActionMsg({ type: 'success', text: 'User berhasil dinonaktifkan.' })
      await fetchDetail()
    } catch (err) {
      setActionMsg({ type: 'error', text: err.message || 'Gagal menonaktifkan user.' })
    } finally {
      setActionLoading(false)
    }
  }

  const handleReactivate = async () => {
    if (!user?._id) return

    try {
      setActionLoading(true)
      setActionMsg(null)
      await adminFetch(`/api/users/${user._id}/reactivate`, {
        method: 'PUT',
      })
      setActionMsg({ type: 'success', text: 'User berhasil diaktifkan kembali.' })
      await fetchDetail()
    } catch (err) {
      setActionMsg({ type: 'error', text: err.message || 'Gagal mengaktifkan user.' })
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return <div className="py-20 text-center text-gray-400 text-sm">Memuat detail user...</div>
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="font-semibold text-red-900 mb-1">Error</p>
        <p className="text-red-700 text-sm mb-4">{error}</p>
        <button
          onClick={() => router.push('/admin/users')}
          className="text-[#008080] hover:text-[#006666] text-sm font-medium"
        >
          ← Kembali ke Pengguna
        </button>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
        User tidak ditemukan.{' '}
        <Link href="/admin/users" className="text-[#008080] hover:text-[#006666] font-medium">
          Kembali
        </Link>
      </div>
    )
  }

  const roles = Array.isArray(user.roles)
    ? user.roles.map((r) => r.role).filter((r) => ['buyer', 'seller', 'admin'].includes(r))
    : []

  const addresses = Array.isArray(user.addresses) ? user.addresses : []

  return (
    <div className="space-y-5 max-w-6xl">
      <div>
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1 text-sm text-[#008080] hover:text-[#006666] font-medium mb-3"
        >
          ← Kembali ke Pengguna
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{user.name || 'Tanpa Nama'}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{user.email || 'Tanpa Email'}</p>
          </div>
          <div className="flex gap-2 items-center">
            {user.isActive ? <Pill tone="green">Aktif</Pill> : <Pill tone="red">Nonaktif</Pill>}
            <Pill tone="blue">Role Aktif: {ROLE_LABEL[user.currentRole] || user.currentRole || '—'}</Pill>
          </div>
        </div>
      </div>

      {actionMsg && (
        <div className={`rounded-xl px-4 py-3 text-sm font-medium border ${
          actionMsg.type === 'success'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          {actionMsg.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="font-semibold text-gray-900 mb-3">Profil</h2>
            <div className="space-y-1">
              <InfoRow label="Nama" value={user.name} />
              <InfoRow label="Email" value={user.email} />
              <InfoRow label="No HP" value={user.phone} />
              <InfoRow label="Gender" value={user.gender} />
              <InfoRow label="Tanggal Lahir" value={user.dateOfBirth ? formatDateTime(user.dateOfBirth) : '—'} />
              <InfoRow label="Terdaftar" value={formatDateTime(user.createdAt)} />
              <InfoRow label="Last Login" value={formatDateTime(user.lastLogin)} />
              <InfoRow label="ID" value={user._id} />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="font-semibold text-gray-900 mb-3">Alamat</h2>
            {addresses.length === 0 ? (
              <p className="text-sm text-gray-400">Belum ada alamat.</p>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr, idx) => (
                  <div key={idx} className="rounded-lg border border-gray-100 p-3">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-sm font-semibold text-gray-900">Alamat #{idx + 1}</p>
                      {addr.isDefault ? <Pill tone="blue">Default</Pill> : null}
                    </div>
                    <p className="text-sm text-gray-700 break-words">
                      {[addr.street, addr.village, addr.district, addr.city, addr.province, addr.postalCode]
                        .filter(Boolean)
                        .join(', ') || '—'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="font-semibold text-gray-900 mb-3">Role</h2>
            <div className="flex flex-wrap gap-2">
              {roles.length ? roles.map((r) => (
                <Pill key={r} tone={r === user.currentRole ? 'blue' : 'gray'}>{ROLE_LABEL[r] || r}</Pill>
              )) : <p className="text-sm text-gray-400">Tidak ada role aktif.</p>}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="font-semibold text-gray-900 mb-3">Verifikasi</h2>
            <div className="space-y-2">
              <div>{user.isEmailVerified ? <Pill tone="green">Email Verified</Pill> : <Pill tone="orange">Email Unverified</Pill>}</div>
              <div>{user.isPhoneVerified ? <Pill tone="green">HP Verified</Pill> : <Pill>HP Unverified</Pill>}</div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="font-semibold text-gray-900 mb-3">Statistik</h2>
            <div className="space-y-1">
              <InfoRow label="Profile Completeness" value={stats?.basicInfo?.profileCompleteness != null ? `${stats.basicInfo.profileCompleteness}%` : '—'} />
              <InfoRow label="Total Roles" value={String(stats?.basicInfo?.totalRoles ?? '—')} />
              <InfoRow label="Points Balance" value={String(stats?.pointsSummary?.currentBalance ?? 0)} />
              <InfoRow label="Points Lifetime" value={String(stats?.pointsSummary?.lifetimePoints ?? 0)} />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="font-semibold text-gray-900 mb-3">Aksi Admin</h2>
            {user.isActive ? (
              <button
                disabled={actionLoading || isAdminAccount}
                onClick={handleDeactivate}
                className="w-full px-4 py-2 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm font-medium hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed"
                title={isAdminAccount ? 'Akun admin tidak bisa dinonaktifkan dari menu ini' : 'Nonaktifkan user'}
              >
                {actionLoading ? 'Memproses...' : 'Nonaktifkan User'}
              </button>
            ) : (
              <button
                disabled={actionLoading}
                onClick={handleReactivate}
                className="w-full px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-medium hover:bg-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {actionLoading ? 'Memproses...' : 'Aktifkan User'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}