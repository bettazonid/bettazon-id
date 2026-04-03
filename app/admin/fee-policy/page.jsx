'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { adminFetch } from '@/lib/adminApi'

function StatCard({ label, value, color = 'text-gray-900' }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
      <p className="text-xs text-gray-500 truncate">{label}</p>
      <p className={`text-xl font-bold mt-0.5 ${color}`}>{value}</p>
    </div>
  )
}

function toNumber(value, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

export default function AdminFeePolicyPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [policy, setPolicy] = useState(null)
  const [form, setForm] = useState({
    defaultSellerFeePercent: 10,
    firstCohortSellerCount: 10,
    firstCohortFeePercent: 0,
    firstCohortDurationDays: 90,
    secondCohortSellerCount: 20,
    secondCohortFeePercent: 5,
    secondCohortDurationDays: 90,
  })

  const [previewKeyword, setPreviewKeyword] = useState('')
  const [previewSearching, setPreviewSearching] = useState(false)
  const [previewCandidates, setPreviewCandidates] = useState([])
  const [selectedPreviewSeller, setSelectedPreviewSeller] = useState(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewResult, setPreviewResult] = useState(null)

  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [sellersLoading, setSellersLoading] = useState(false)
  const [sellerRows, setSellerRows] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0, limit: 20 })

  const hydrateFormFromPolicy = useCallback((nextPolicy) => {
    if (!nextPolicy) return
    setForm({
      defaultSellerFeePercent: toNumber(nextPolicy.defaultSellerFeePercent, 10),
      firstCohortSellerCount: toNumber(nextPolicy.firstCohort?.limit, 10),   // DB field = limit
      firstCohortFeePercent: toNumber(nextPolicy.firstCohort?.feePercent, 0),
      firstCohortDurationDays: toNumber(nextPolicy.firstCohort?.durationDays, 90),
      secondCohortSellerCount: toNumber(nextPolicy.secondCohort?.limit, 20), // DB field = limit
      secondCohortFeePercent: toNumber(nextPolicy.secondCohort?.feePercent, 5),
      secondCohortDurationDays: toNumber(nextPolicy.secondCohort?.durationDays, 90),
    })
  }, [])

  const loadPolicy = useCallback(async () => {
    const res = await adminFetch('/api/admin/fee-policy')
    const nextPolicy = res?.data?.policy || null
    setPolicy(nextPolicy)
    hydrateFormFromPolicy(nextPolicy)
  }, [hydrateFormFromPolicy])

  const loadSellers = useCallback(async (nextPage = page, nextSearch = search) => {
    setSellersLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(nextPage),
        limit: '20',
      })
      if (nextSearch) params.set('search', nextSearch)

      const res = await adminFetch(`/api/admin/fee-policy/sellers?${params.toString()}`)
      const payload = res?.data || {}
      const rows = payload.sellers || payload.items || []
      const pager = payload.pagination || {}

      setSellerRows(rows)
      setPagination({
        page: toNumber(pager.page, nextPage),
        totalPages: toNumber(pager.totalPages, 1),
        total: toNumber(pager.total, 0),
        limit: toNumber(pager.limit, 20),
      })
    } catch (err) {
      setError(err.message || 'Gagal memuat status promo seller')
      setSellerRows([])
    } finally {
      setSellersLoading(false)
    }
  }, [page, search])

  const loadInitial = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      await Promise.all([loadPolicy(), loadSellers(1, '')])
      setPage(1)
      setSearch('')
      setSearchInput('')
    } catch (err) {
      setError(err.message || 'Gagal memuat pengaturan fee policy')
    } finally {
      setLoading(false)
    }
  }, [loadPolicy, loadSellers])

  useEffect(() => {
    loadInitial()
  }, [loadInitial])

  const policyVersion = policy?.policyVersion || 1

  const cohortSummary = useMemo(() => {
    const firstEnd = toNumber(form.firstCohortSellerCount, 0)
    const secondEnd = firstEnd + toNumber(form.secondCohortSellerCount, 0)
    return {
      firstLabel: `Seller #1 - #${firstEnd}`,
      secondLabel: `Seller #${firstEnd + 1} - #${secondEnd}`,
    }
  }, [form.firstCohortSellerCount, form.secondCohortSellerCount])

  const onChange = (key) => (e) => {
    const value = e.target.value
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const payload = {
        defaultSellerFeePercent: toNumber(form.defaultSellerFeePercent, 10),
        firstCohort: {
          limit: toNumber(form.firstCohortSellerCount, 10),  // schema field = limit
          feePercent: toNumber(form.firstCohortFeePercent, 0),
          durationDays: toNumber(form.firstCohortDurationDays, 90),
        },
        secondCohort: {
          limit: toNumber(form.secondCohortSellerCount, 20), // schema field = limit
          feePercent: toNumber(form.secondCohortFeePercent, 5),
          durationDays: toNumber(form.secondCohortDurationDays, 90),
        },
      }

      const res = await adminFetch('/api/admin/fee-policy', {
        method: 'PUT',
        body: JSON.stringify(payload),
      })

      const nextPolicy = res?.data?.policy || null
      setPolicy(nextPolicy)
      hydrateFormFromPolicy(nextPolicy)
      setSuccess('Fee policy berhasil diperbarui')
      await loadSellers(page, search)
    } catch (err) {
      setError(err.message || 'Gagal menyimpan fee policy')
    } finally {
      setSaving(false)
    }
  }

  const handlePreviewSellerSearch = async () => {
    const keyword = previewKeyword.trim()
    if (!keyword) {
      setError('Masukkan nama atau email seller')
      setPreviewCandidates([])
      return
    }

    setPreviewSearching(true)
    setError('')

    try {
      const params = new URLSearchParams({
        page: '1',
        limit: '8',
        search: keyword,
      })
      const res = await adminFetch(`/api/admin/fee-policy/sellers?${params.toString()}`)
      const rows = res?.data?.sellers || []
      const candidates = rows.map((row) => row.seller).filter(Boolean)
      setPreviewCandidates(candidates)

      if (candidates.length === 0) {
        setSelectedPreviewSeller(null)
        setPreviewResult(null)
        setError('Seller tidak ditemukan')
      }
    } catch (err) {
      setError(err.message || 'Gagal mencari seller')
      setPreviewCandidates([])
    } finally {
      setPreviewSearching(false)
    }
  }

  const handleSelectPreviewSeller = (seller) => {
    setSelectedPreviewSeller(seller)
    setPreviewCandidates([])
    setPreviewResult(null)
    setPreviewKeyword(`${seller?.name || '-'}${seller?.email ? ` (${seller.email})` : ''}`)
    setError('')
  }

  const handlePreview = async (sellerOverride = null) => {
    const targetSeller = sellerOverride || selectedPreviewSeller

    if (!targetSeller?._id) {
      setError('Pilih seller dulu (cari nama/email seller)')
      return
    }

    setPreviewLoading(true)
    setError('')
    setSuccess('')
    setSelectedPreviewSeller(targetSeller)

    try {
      const params = new URLSearchParams({ sellerId: targetSeller._id })
      const res = await adminFetch(`/api/admin/fee-policy/preview?${params.toString()}`)
      setPreviewResult(res?.data?.fee || null)
    } catch (err) {
      setError(err.message || 'Gagal memuat preview fee seller')
      setPreviewResult(null)
    } finally {
      setPreviewLoading(false)
    }
  }

  const handleSearchSubmit = async (e) => {
    e.preventDefault()
    const nextSearch = searchInput.trim()
    setPage(1)
    setSearch(nextSearch)
    await loadSellers(1, nextSearch)
  }

  const handleResetSearch = async () => {
    setSearch('')
    setSearchInput('')
    setPage(1)
    await loadSellers(1, '')
  }

  const goToPage = async (nextPage) => {
    if (nextPage < 1 || nextPage > pagination.totalPages) return
    setPage(nextPage)
    await loadSellers(nextPage, search)
  }

  if (loading) {
    return <p className="text-gray-600">Memuat fee policy...</p>
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fee Policy</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Atur fee seller dinamis dan pantau status promo seller dari admin panel.
          </p>
        </div>
        <button
          type="button"
          onClick={loadInitial}
          disabled={saving || sellersLoading || previewLoading}
          className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label="Policy Version" value={policyVersion} />
        <StatCard
          label="Default Fee Seller"
          value={`${toNumber(form.defaultSellerFeePercent, 10)}%`}
          color="text-[#008080]"
        />
        <StatCard
          label="Total Seller (Result)"
          value={pagination.total.toLocaleString('id-ID')}
          color="text-gray-700"
        />
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : null}
      {success ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{success}</div>
      ) : null}

      <form onSubmit={handleSave} className="rounded-xl border border-gray-200 bg-white p-5 space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Konfigurasi Fee</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Policy ini digunakan backend saat membuat snapshot fee untuk order baru.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Default Seller Fee (%)</span>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={form.defaultSellerFeePercent}
              onChange={onChange('defaultSellerFeePercent')}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#008080]"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-lg border border-gray-200 p-4 space-y-3">
            <h3 className="font-semibold text-gray-900">Cohort 1</h3>
            <p className="text-xs text-gray-500">{cohortSummary.firstLabel}</p>

            <label className="block">
              <span className="text-sm text-gray-700">Jumlah Seller</span>
              <input
                type="number"
                min="0"
                value={form.firstCohortSellerCount}
                onChange={onChange('firstCohortSellerCount')}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]"
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-700">Fee (%)</span>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={form.firstCohortFeePercent}
                onChange={onChange('firstCohortFeePercent')}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]"
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-700">Durasi Promo (hari)</span>
              <input
                type="number"
                min="0"
                value={form.firstCohortDurationDays}
                onChange={onChange('firstCohortDurationDays')}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]"
              />
            </label>
          </div>

          <div className="rounded-lg border border-gray-200 p-4 space-y-3">
            <h3 className="font-semibold text-gray-900">Cohort 2</h3>
            <p className="text-xs text-gray-500">{cohortSummary.secondLabel}</p>

            <label className="block">
              <span className="text-sm text-gray-700">Jumlah Seller</span>
              <input
                type="number"
                min="0"
                value={form.secondCohortSellerCount}
                onChange={onChange('secondCohortSellerCount')}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]"
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-700">Fee (%)</span>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={form.secondCohortFeePercent}
                onChange={onChange('secondCohortFeePercent')}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]"
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-700">Durasi Promo (hari)</span>
              <input
                type="number"
                min="0"
                value={form.secondCohortDurationDays}
                onChange={onChange('secondCohortDurationDays')}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]"
              />
            </label>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-[#008080] text-white text-sm font-semibold hover:bg-[#006666] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Menyimpan...' : 'Simpan Fee Policy'}
          </button>
        </div>
      </form>

      <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Preview Fee Seller</h2>
          <p className="text-sm text-gray-500 mt-0.5">Cari seller pakai nama/email, lalu preview fee aktifnya.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 items-start">
          <input
            type="text"
            value={previewKeyword}
            onChange={(e) => {
              setPreviewKeyword(e.target.value)
              setSelectedPreviewSeller(null)
            }}
            placeholder="Cari nama/email seller"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#008080]"
          />
          <button
            type="button"
            onClick={handlePreviewSellerSearch}
            disabled={previewSearching}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            {previewSearching ? 'Mencari...' : 'Cari Seller'}
          </button>
          <button
            type="button"
            onClick={handlePreview}
            disabled={previewLoading}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            {previewLoading ? 'Memuat...' : 'Preview'}
          </button>
        </div>

        {previewCandidates.length > 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-2 space-y-2">
            {previewCandidates.map((seller) => (
              <button
                key={seller._id}
                type="button"
                onClick={() => handleSelectPreviewSeller(seller)}
                className="w-full text-left rounded-md border border-gray-200 bg-white px-3 py-2 hover:bg-gray-100"
              >
                <p className="text-sm font-medium text-gray-900">{seller.name || '-'}</p>
                <p className="text-xs text-gray-500">{seller.email || seller._id}</p>
              </button>
            ))}
          </div>
        ) : null}

        {selectedPreviewSeller ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            Seller dipilih: <span className="font-semibold">{selectedPreviewSeller.name || '-'}</span>
            <span className="text-emerald-700"> {selectedPreviewSeller.email ? `(${selectedPreviewSeller.email})` : ''}</span>
          </div>
        ) : null}

        {previewResult ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 space-y-1">
            <p>
              Applied Fee: <span className="font-semibold text-gray-900">{toNumber(previewResult.appliedPercent, 0)}%</span>
            </p>
            <p>Source: <span className="font-medium">{previewResult.source || 'default'}</span></p>
            <p>Seller Rank: <span className="font-medium">{previewResult.sellerRank ?? '-'}</span></p>
            <p>
              Promo Aktif:{' '}
              <span className="font-medium">{previewResult.isPromo ? 'Ya' : 'Tidak'}</span>
            </p>
            {previewResult.promoExpiresAt ? (
              <p>Promo Expired: <span className="font-medium">{new Date(previewResult.promoExpiresAt).toLocaleString('id-ID')}</span></p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Status Promo Seller</h2>
          <p className="text-sm text-gray-500 mt-0.5">Daftar seller dan fee efektif berdasarkan policy aktif.</p>
        </div>

        <div className="p-4 border-b border-gray-100">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-col sm:flex-row">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari nama/email seller"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#008080]"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#008080] text-white text-sm font-medium hover:bg-[#006666]"
            >
              Cari
            </button>
            {search ? (
              <button
                type="button"
                onClick={handleResetSearch}
                className="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm hover:bg-gray-50"
              >
                Reset
              </button>
            ) : null}
          </form>
        </div>

        {sellersLoading ? (
          <div className="py-12 text-center text-sm text-gray-400">Memuat data seller...</div>
        ) : sellerRows.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-400">Tidak ada data seller.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Seller</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Rank</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Applied Fee</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Source</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Promo</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Expired</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sellerRows.map((row) => {
                  const seller = row.seller || {}
                  const fee = row.fee || {}

                  return (
                  <tr key={seller._id || `${seller.email}-${fee.sellerRank || 0}`} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900">
                      <p className="font-medium">{seller.name || '-'}</p>
                      <p className="text-xs text-gray-500">{seller.email || seller._id || '-'}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{fee.sellerRank ?? '-'}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {toNumber(fee.appliedPercent, 0)}%
                    </td>
                    <td className="px-4 py-3 text-gray-700">{fee.source || 'default'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                          fee.isPromo ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {fee.isPromo ? 'Aktif' : 'Tidak'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {fee.promoExpiresAt ? new Date(fee.promoExpiresAt).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handlePreview(seller)}
                        disabled={previewLoading}
                        className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        {previewLoading && selectedPreviewSeller?._id === seller._id ? 'Memuat...' : 'Preview'}
                      </button>
                    </td>
                  </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm">
          <p className="text-gray-500">
            Halaman {pagination.page} dari {pagination.totalPages} • Total {pagination.total.toLocaleString('id-ID')} seller
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goToPage(pagination.page - 1)}
              disabled={pagination.page <= 1 || sellersLoading}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              Sebelumnya
            </button>
            <button
              type="button"
              onClick={() => goToPage(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages || sellersLoading}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
