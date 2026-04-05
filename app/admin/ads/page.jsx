'use client'

import { useCallback, useEffect, useState } from 'react'
import { adminFetch } from '@/lib/adminApi'

const STATUS_LABEL = {
  pending_review: { label: 'Menunggu Review', color: '#2196F3', bg: '#E3F2FD' },
  active:         { label: 'Aktif',           color: '#4CAF50', bg: '#E8F5E9' },
  paused:         { label: 'Dijeda',          color: '#FF9800', bg: '#FFF3E0' },
  exhausted:      { label: 'Budget Habis',    color: '#F44336', bg: '#FFEBEE' },
}

function formatRp(n) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
  }).format(n ?? 0)
}

function StatusBadge({ status }) {
  const cfg = STATUS_LABEL[status] ?? { label: status, color: '#666', bg: '#eee' }
  return (
    <span style={{ background: cfg.bg, color: cfg.color }}
      className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold">
      {cfg.label}
    </span>
  )
}

export default function AdminAdsPage() {
  const [tab, setTab]         = useState('pending_review')
  const [ads, setAds]         = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [actionId, setActionId] = useState(null) // ad id being acted on
  const [noteMap, setNoteMap]   = useState({})   // adId → note text

  const load = useCallback(async (status) => {
    setLoading(true)
    setError('')
    try {
      const res = await adminFetch(`/api/admin/ads?status=${status}&limit=50`)
      setAds(res?.data?.ads ?? [])
    } catch (err) {
      setError(err.message || 'Gagal memuat iklan')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(tab) }, [tab, load])

  async function handleApprove(adId) {
    setActionId(adId)
    try {
      await adminFetch(`/api/admin/ads/${adId}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: noteMap[adId] ?? '' }),
      })
      setAds(prev => prev.filter(a => a._id !== adId))
    } catch (err) {
      setError(err.message || 'Gagal menyetujui iklan')
    } finally {
      setActionId(null)
    }
  }

  async function handleReject(adId) {
    setActionId(adId)
    try {
      await adminFetch(`/api/admin/ads/${adId}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: noteMap[adId] ?? 'Ditolak oleh admin' }),
      })
      setAds(prev => prev.filter(a => a._id !== adId))
    } catch (err) {
      setError(err.message || 'Gagal menolak iklan')
    } finally {
      setActionId(null)
    }
  }

  const TABS = [
    { key: 'pending_review', label: 'Perlu Review' },
    { key: 'active',         label: 'Aktif' },
    { key: 'paused',         label: 'Dijeda' },
    { key: 'exhausted',      label: 'Selesai' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Iklan Sponsor</h1>
        <p className="text-sm text-gray-500 mt-1">
          Tinjau dan setujui iklan seller sebelum tayang di feed.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`pb-2 px-3 text-sm font-medium border-b-2 transition-colors ${
              tab === t.key
                ? 'border-[#008080] text-[#008080]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Memuat...</p>
      ) : ads.length === 0 ? (
        <p className="text-sm text-gray-500">Tidak ada iklan dalam kategori ini.</p>
      ) : (
        <div className="space-y-4">
          {ads.map(ad => {
            const product = ad.productId ?? {}
            const seller  = ad.sellerId  ?? {}
            const img     = product.images?.[0]?.url ?? product.images?.[0] ?? null
            const isBusy  = actionId === ad._id

            return (
              <div key={ad._id} className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="flex items-start gap-4">
                  {/* Product image */}
                  {img ? (
                    <img src={img} alt={product.name} className="h-16 w-16 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="h-16 w-16 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-400 text-xs">
                      No img
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <p className="font-semibold text-sm text-gray-900 truncate">{product.name ?? '—'}</p>
                        <p className="text-xs text-gray-500">
                          Seller: {seller.shopName ?? seller.name ?? '—'} · {seller.email ?? ''}
                        </p>
                      </div>
                      <StatusBadge status={ad.status} />
                    </div>

                    {/* Metrics */}
                    <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-600">
                      <span><span className="font-medium">Budget:</span> {formatRp(ad.budget)}</span>
                      <span><span className="font-medium">CPC:</span> {formatRp(ad.bidPerClick)}</span>
                      <span><span className="font-medium">Tayang:</span> {ad.impressions ?? 0}</span>
                      <span><span className="font-medium">Klik:</span> {ad.clicks ?? 0}</span>
                      <span><span className="font-medium">Berlaku s/d:</span> {new Date(ad.validUntil).toLocaleDateString('id-ID')}</span>
                    </div>

                    {/* Targeting */}
                    {(ad.targeting?.species?.length > 0 || ad.targeting?.categories?.length > 0) && (
                      <div className="mt-1.5 text-xs text-gray-500">
                        Target:{' '}
                        {[...(ad.targeting.species ?? []), ...(ad.targeting.categories ?? [])].join(', ')}
                      </div>
                    )}

                    {/* Admin note input + actions (only for pending_review) */}
                    {tab === 'pending_review' && (
                      <div className="mt-3 space-y-2">
                        <input
                          type="text"
                          placeholder="Catatan admin (opsional)"
                          value={noteMap[ad._id] ?? ''}
                          onChange={e => setNoteMap(prev => ({ ...prev, [ad._id]: e.target.value }))}
                          className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs focus:border-[#008080] focus:outline-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(ad._id)}
                            disabled={isBusy}
                            className="rounded-lg bg-[#008080] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#006666] disabled:opacity-50"
                          >
                            {isBusy ? '...' : 'Setujui'}
                          </button>
                          <button
                            onClick={() => handleReject(ad._id)}
                            disabled={isBusy}
                            className="rounded-lg border border-red-300 px-4 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            {isBusy ? '...' : 'Tolak'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
