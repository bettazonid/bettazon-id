'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
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

function formatDateTime(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500 shrink-0">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right break-all">{value || '—'}</span>
    </div>
  )
}

function StatusPill({ status }) {
  const cls = {
    pending: 'bg-amber-100 text-amber-800',
    completed: 'bg-emerald-100 text-emerald-800',
    failed: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-200 text-gray-700',
  }[status] || 'bg-gray-100 text-gray-700'

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${cls}`}>
      {status || 'unknown'}
    </span>
  )
}

export default function AdminTransactionDetailPage() {
  const params = useParams()
  const txId = params?.id

  const [tx, setTx] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [exporting, setExporting] = useState('')

  const fetchDetail = useCallback(async () => {
    if (!txId) return
    try {
      setLoading(true)
      setError('')

      const res = await adminFetch(`/api/admin/transactions/${txId}`)
      setTx(res?.data?.transaction || null)
    } catch (err) {
      setError(err.message || 'Gagal memuat detail transaksi')
      setTx(null)
    } finally {
      setLoading(false)
    }
  }, [txId])

  useEffect(() => {
    fetchDetail()
  }, [fetchDetail])

  const handleExport = async (format) => {
    if (!txId) return
    try {
      setExporting(format)
      setError('')

      const res = await adminDownload(`/api/admin/transactions/${txId}/export?format=${format}`)
      const blob = await res.blob()

      const contentDisposition = res.headers.get('content-disposition') || ''
      const filenameMatch = contentDisposition.match(/filename="?([^\"]+)"?/i)
      const filename = filenameMatch?.[1] || `transaction-${txId}.${format}`

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

  if (loading) {
    return <div className="py-20 text-center text-gray-400 text-sm">Memuat detail transaksi...</div>
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="font-semibold text-red-900 mb-1">Error</p>
        <p className="text-red-700 text-sm mb-4">{error}</p>
        <Link href="/admin/transactions" className="text-[#008080] hover:text-[#006666] text-sm font-medium">
          ← Kembali ke Transaksi
        </Link>
      </div>
    )
  }

  if (!tx) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
        Transaksi tidak ditemukan.{' '}
        <Link href="/admin/transactions" className="text-[#008080] hover:text-[#006666] font-medium">
          Kembali
        </Link>
      </div>
    )
  }

  const amount = Number(tx.amount || 0)

  return (
    <div className="space-y-5 max-w-5xl">
      <div>
        <Link
          href="/admin/transactions"
          className="inline-flex items-center gap-1 text-sm text-[#008080] hover:text-[#006666] font-medium mb-3"
        >
          ← Kembali ke Transaksi
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Detail Transaksi</h1>
            <p className="text-sm text-gray-500 mt-0.5 font-mono">{tx._id}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              type="button"
              onClick={() => handleExport('xlsx')}
              disabled={!!exporting}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting === 'xlsx' ? 'Export...' : 'Export Excel'}
            </button>
            <button
              type="button"
              onClick={() => handleExport('csv')}
              disabled={!!exporting}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-xs font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting === 'csv' ? 'Export...' : 'Export CSV'}
            </button>
            <button
              type="button"
              onClick={() => handleExport('pdf')}
              disabled={!!exporting}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-xs font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting === 'pdf' ? 'Export...' : 'Export Faktur PDF'}
            </button>
            <StatusPill status={tx.status} />
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${amount >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
              Rp {amount.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="font-semibold text-gray-900 mb-3">Informasi Transaksi</h2>
            <div className="space-y-1">
              <InfoRow label="Tipe" value={TYPE_LABEL[tx.type] || tx.type} />
              <InfoRow label="Status" value={tx.status} />
              <InfoRow label="Amount" value={`Rp ${Number(tx.amount || 0).toLocaleString('id-ID')}`} />
              <InfoRow label="Balance Before" value={`Rp ${Number(tx.balanceBefore || 0).toLocaleString('id-ID')}`} />
              <InfoRow label="Balance After" value={`Rp ${Number(tx.balanceAfter || 0).toLocaleString('id-ID')}`} />
              <InfoRow label="Waktu" value={formatDateTime(tx.createdAt)} />
              <InfoRow label="Reference" value={typeof tx.reference === 'object' ? JSON.stringify(tx.reference) : String(tx.reference || '—')} />
              <InfoRow label="Reference Model" value={tx.referenceModel} />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="font-semibold text-gray-900 mb-3">Deskripsi</h2>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{tx.description || '—'}</p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="font-semibold text-gray-900 mb-3">User</h2>
            <div className="space-y-1">
              <InfoRow label="Nama" value={tx.user?.name} />
              <InfoRow label="Email" value={tx.user?.email} />
              <InfoRow label="Phone" value={tx.user?.phone} />
              <InfoRow label="User ID" value={tx.user?._id} />
            </div>
            {tx.user?._id && (
              <Link
                href={`/admin/users/${tx.user._id}`}
                className="mt-3 inline-flex text-xs font-medium text-[#008080] hover:text-[#006666]"
              >
                Lihat Detail User →
              </Link>
            )}
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="font-semibold text-gray-900 mb-3">Wallet Snapshot</h2>
            <div className="space-y-1">
              <InfoRow label="Wallet ID" value={tx.wallet?._id} />
              <InfoRow label="Wallet Status" value={tx.wallet?.status} />
              <InfoRow label="Balance" value={`Rp ${Number(tx.wallet?.balance || 0).toLocaleString('id-ID')}`} />
              <InfoRow label="Held Balance" value={`Rp ${Number(tx.wallet?.heldBalance || 0).toLocaleString('id-ID')}`} />
              <InfoRow label="Available" value={`Rp ${Number(tx.wallet?.availableBalance || 0).toLocaleString('id-ID')}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
