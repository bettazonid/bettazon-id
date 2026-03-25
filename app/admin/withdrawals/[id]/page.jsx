'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { adminFetch } from '@/lib/adminApi'

function badgeClass(status) {
  const map = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-700',
  }
  return map[status] || 'bg-gray-100 text-gray-700'
}

export default function AdminWithdrawalDetailPage() {
  const params = useParams()
  const id = params?.id
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [withdrawal, setWithdrawal] = useState(null)
  const [notes, setNotes] = useState('')
  const [reason, setReason] = useState('')

  async function loadDetail() {
    setLoading(true)
    setError('')
    try {
      const res = await adminFetch(`/api/withdrawals/admin/${id}`)
      setWithdrawal(res?.data?.withdrawal || null)
    } catch (err) {
      setError(err.message || 'Gagal memuat detail withdrawal')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDetail()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function handleApprove(manual = false) {
    setSubmitting(true)
    setError('')
    setSuccess('')
    try {
      const path = manual
        ? `/api/withdrawals/admin/${id}/manual-approve`
        : `/api/withdrawals/admin/${id}/approve`

      const payload = manual
        ? { notes: notes || 'Manual transfer dikonfirmasi admin' }
        : { notes }

      const res = await adminFetch(path, {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      setSuccess(res?.message || 'Withdrawal berhasil diproses')
      await loadDetail()
    } catch (err) {
      setError(err.message || 'Gagal memproses withdrawal')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleReject() {
    if (!reason.trim()) {
      setError('Alasan reject wajib diisi')
      return
    }
    setSubmitting(true)
    setError('')
    setSuccess('')
    try {
      const res = await adminFetch(`/api/withdrawals/admin/${id}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      })
      setSuccess(res?.message || 'Withdrawal berhasil ditolak')
      await loadDetail()
    } catch (err) {
      setError(err.message || 'Gagal reject withdrawal')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <p className="text-gray-600">Memuat detail withdrawal...</p>
  }

  if (!withdrawal) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
        Data withdrawal tidak ditemukan.
      </div>
    )
  }

  const isPending = withdrawal.status === 'pending'

  return (
    <div>
      <div className="mb-4">
        <Link href="/admin/withdrawals" className="text-sm text-[#008080] hover:underline">
          ← Kembali ke daftar penarikan
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{withdrawal.withdrawalNumber}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Diajukan: {new Date(withdrawal.requestedAt || withdrawal.createdAt).toLocaleString('id-ID')}
            </p>
          </div>
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeClass(withdrawal.status)}`}>
            {withdrawal.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-2 text-sm">
            <h2 className="font-semibold text-gray-900">Info Seller</h2>
            <p><span className="text-gray-500">Nama:</span> {withdrawal.user?.name || '-'}</p>
            <p><span className="text-gray-500">Email:</span> {withdrawal.user?.email || '-'}</p>
            <p><span className="text-gray-500">Phone:</span> {withdrawal.user?.phone || '-'}</p>
          </div>

          <div className="space-y-2 text-sm">
            <h2 className="font-semibold text-gray-900">Info Bank</h2>
            <p><span className="text-gray-500">Bank:</span> {withdrawal.bankDetails?.bankName || '-'}</p>
            <p><span className="text-gray-500">Kode Bank:</span> {withdrawal.bankDetails?.bankCode || '-'}</p>
            <p><span className="text-gray-500">No Rek:</span> {withdrawal.bankDetails?.accountNumber || '-'}</p>
            <p><span className="text-gray-500">Nama Rek:</span> {withdrawal.bankDetails?.accountName || '-'}</p>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Nominal Withdrawal</p>
          <p className="text-2xl font-bold text-gray-900">Rp {Number(withdrawal.amount || 0).toLocaleString('id-ID')}</p>
        </div>

        {withdrawal.rejectionReason ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            Alasan reject: {withdrawal.rejectionReason}
          </div>
        ) : null}

        {withdrawal.adminNotes ? (
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
            Catatan admin: {withdrawal.adminNotes}
          </div>
        ) : null}

        {error ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
        ) : null}
        {success ? (
          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">{success}</div>
        ) : null}

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Approve</h3>
            <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              <p className="font-semibold mb-1">Kapan pakai tombol ini?</p>
              <p>
                <strong>Approve (Gateway)</strong> dipakai jika payout Midtrans/IRIS sudah aktif.
                <strong> Manual Approve</strong> dipakai jika admin transfer manual dari bank operasional.
              </p>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Catatan admin (opsional, wajib untuk manual approve)"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <div className="flex gap-2 mt-3">
              <button
                disabled={!isPending || submitting}
                onClick={() => handleApprove(false)}
                className="rounded-lg bg-[#008080] hover:bg-[#006666] disabled:opacity-50 text-white px-3 py-2 text-sm"
              >
                Approve (Gateway)
              </button>
              <button
                disabled={!isPending || submitting}
                onClick={() => handleApprove(true)}
                className="rounded-lg bg-[#FE735C] hover:bg-[#e5634d] disabled:opacity-50 text-white px-3 py-2 text-sm"
              >
                Manual Approve
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Reject</h3>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Alasan reject (wajib)"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <button
              disabled={!isPending || submitting}
              onClick={handleReject}
              className="mt-3 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-3 py-2 text-sm"
            >
              Reject Withdrawal
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
