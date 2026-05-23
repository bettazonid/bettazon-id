'use client'

import { useState, useEffect, useCallback } from 'react'
import { adminFetch } from '@/lib/adminApi'

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ isVerified, url }) {
  if (!url) return <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500">Belum Upload</span>
  if (isVerified) return <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 font-medium">✔ Terverifikasi</span>
  return <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-700 font-medium">⏳ Menunggu Review</span>
}

// ── KTP Preview Modal ─────────────────────────────────────────────────────────
function KtpModal({ seller, onClose, onAction }) {
  const [action, setAction] = useState(null) // 'approve' | 'reject'
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const ktpUrl = seller?.ktpDocument?.url
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}${seller.ktpDocument.url}`
    : null

  async function handleSubmit() {
    if (!action) return
    if (action === 'reject' && !reason.trim()) {
      setError('Alasan penolakan wajib diisi')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await adminFetch(`/api/users/admin/sellers/${seller.userId}/verify-ktp`, {
        method: 'POST',
        body: JSON.stringify({
          action,
          rejectionReason: action === 'reject' ? reason.trim() : undefined,
        }),
      })
      onAction(seller.userId, action)
      onClose()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Review KTP Seller</h2>
            <p className="text-sm text-gray-500 mt-0.5">{seller.name} · {seller.email || seller.phone}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none mt-0.5">✕</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Seller Info */}
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-500 text-xs mb-0.5">Nama Toko</p>
              <p className="font-medium text-gray-900">{seller.storeName || '-'}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-0.5">Daftar Sejak</p>
              <p className="font-medium text-gray-900">{formatDate(seller.registeredAt)}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-0.5">Upload KTP</p>
              <p className="font-medium text-gray-900">{formatDate(seller.ktpDocument?.uploadedAt)}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-0.5">Status</p>
              <StatusBadge isVerified={seller.ktpDocument?.isVerified} url={seller.ktpDocument?.url} />
            </div>
          </div>

          {/* KTP Image */}
          {ktpUrl ? (
            <div>
              <p className="text-xs text-gray-500 mb-2 font-medium">Foto KTP</p>
              <a href={ktpUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={ktpUrl}
                  alt="KTP Seller"
                  className="w-full rounded-xl border border-gray-200 object-cover max-h-56 hover:opacity-90 transition-opacity cursor-pointer"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              </a>
              <p className="text-xs text-gray-400 mt-1 text-center">Klik gambar untuk buka di tab baru</p>
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center text-gray-400 text-sm">
              Foto KTP tidak tersedia
            </div>
          )}

          {/* Action selector */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Keputusan</p>
            <div className="flex gap-3">
              <button
                onClick={() => { setAction('approve'); setError(null) }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                  action === 'approve'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 text-gray-600 hover:border-green-300'
                }`}
              >
                ✔ Setujui
              </button>
              <button
                onClick={() => { setAction('reject'); setError(null) }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                  action === 'reject'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 text-gray-600 hover:border-red-300'
                }`}
              >
                ✕ Tolak
              </button>
            </div>
          </div>

          {/* Rejection reason */}
          {action === 'reject' && (
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Alasan Penolakan <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="Contoh: Foto KTP buram, tidak terbaca. Harap upload ulang dengan kualitas lebih baik."
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
              />
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={!action || loading}
            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-50 ${
              action === 'reject' ? 'bg-red-500 hover:bg-red-600' : 'bg-[#008080] hover:bg-[#006666]'
            }`}
          >
            {loading ? 'Memproses...' : action === 'approve' ? 'Setujui KTP' : action === 'reject' ? 'Tolak KTP' : 'Pilih Keputusan'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminSellerVerificationPage() {
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null) // seller being reviewed

  const fetchPending = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await adminFetch('/api/users/admin/sellers/pending-ktp')
      setSellers(res.data || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchPending() }, [fetchPending])

  function handleAction(userId, action) {
    if (action === 'approve') {
      // Mark as verified in local state so it moves out of pending list on next refresh
      setSellers((prev) => prev.filter((s) => s.userId !== userId))
    } else {
      // Keep rejected in list so admin can re-review or track
      setSellers((prev) => prev.map((s) =>
        s.userId === userId
          ? { ...s, ktpDocument: { ...s.ktpDocument, rejected: true } }
          : s
      ))
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Verifikasi KTP Seller</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review dan setujui dokumen KTP yang diunggah calon seller.
          </p>
        </div>
        <button
          onClick={fetchPending}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
        >
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-5 py-4">
          <p className="text-xs text-yellow-700 font-medium">Menunggu Review</p>
          <p className="text-3xl font-bold text-yellow-800 mt-1">{loading ? '—' : sellers.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white px-5 py-4">
          <p className="text-xs text-gray-500 font-medium">Petunjuk Review</p>
          <p className="text-xs text-gray-700 mt-1 leading-relaxed">Klik tombol <strong>Review</strong> untuk membuka foto KTP dan membuat keputusan approve/reject.</p>
        </div>
        <div className="rounded-xl border border-blue-100 bg-blue-50 px-5 py-4">
          <p className="text-xs text-blue-700 font-medium">Info</p>
          <p className="text-xs text-blue-800 mt-1 leading-relaxed">Seller yang disetujui mendapat badge terverifikasi. Seller yang ditolak wajib upload ulang.</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <span>⚠</span> {error}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-gray-400 text-sm">
          Memuat data...
        </div>
      ) : sellers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white p-16 text-center">
          <div className="text-4xl mb-3">✅</div>
          <p className="font-semibold text-gray-700">Semua KTP sudah direview</p>
          <p className="text-sm text-gray-400 mt-1">Tidak ada pengajuan KTP yang perlu ditindaklanjuti.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Seller</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Nama Toko</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Upload KTP</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sellers.map((seller) => (
                <tr key={seller.userId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {seller.avatar ? (
                        <img src={seller.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-sm font-bold text-[#008080] shrink-0">
                          {(seller.name || 'S').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{seller.name || 'Tanpa Nama'}</p>
                        <p className="text-xs text-gray-400">{seller.email || seller.phone || '-'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-700">{seller.storeName || '-'}</td>
                  <td className="px-5 py-3.5 text-xs text-gray-500">{formatDate(seller.ktpDocument?.uploadedAt)}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge isVerified={seller.ktpDocument?.isVerified} url={seller.ktpDocument?.url} />
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <button
                      onClick={() => setSelected(seller)}
                      className="rounded-lg bg-[#008080] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#006666] transition-colors"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selected && (
        <KtpModal
          seller={selected}
          onClose={() => setSelected(null)}
          onAction={handleAction}
        />
      )}
    </div>
  )
}
