'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { adminFetch } from '@/lib/adminApi'

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatRp(n) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
  }).format(n ?? 0)
}

function formatNum(n) {
  return new Intl.NumberFormat('id-ID').format(n ?? 0)
}

function formatCtr(clicks, impressions) {
  if (!impressions || impressions <= 0) return '0.0%'
  return `${((Number(clicks || 0) / Number(impressions)) * 100).toFixed(1)}%`
}

function monthLabel(year, month) {
  return new Date(year, month - 1, 1).toLocaleDateString('id-ID', { year: 'numeric', month: 'short' })
}

const STATUS_LABEL = {
  pending_review: 'Menunggu Review',
  active:         'Aktif',
  paused:         'Dijeda',
  rejected:       'Ditolak',
  exhausted:      'Selesai',
}

const STATUS_COLOR = {
  pending_review: 'bg-blue-100 text-blue-700',
  active:         'bg-green-100 text-green-700',
  paused:         'bg-yellow-100 text-yellow-700',
  rejected:       'bg-red-100 text-red-700',
  exhausted:      'bg-gray-100 text-gray-600',
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SummaryCard({ label, value, sub }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

function BarRow({ label, value, max, formatted }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="w-32 shrink-0 truncate text-gray-700">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full rounded-full bg-[#008080]" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-24 text-right font-semibold text-gray-800 shrink-0">{formatted}</span>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdsAnalyticsPage() {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')

  useEffect(() => {
    adminFetch('/api/admin/ads/analytics')
      .then(res => setData(res?.data ?? null))
      .catch(err => setError(err.message || 'Gagal memuat analitik'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-sm text-gray-500">Memuat analitik...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    )
  }

  const { summary, monthlyStats, topAdsByCtr, topSellersBySpend } = data ?? {}
  const s = summary ?? {}
  const maxSellerSpend = Math.max(...(topSellersBySpend ?? []).map(x => x.totalSpend ?? 0), 1)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Analitik Iklan Sponsor</h1>
          <p className="text-sm text-gray-500 mt-1">
            Performa iklan keseluruhan, statistik bulanan, dan top performer.
          </p>
        </div>
        <Link
          href="/admin/ads"
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
        >
          ← Kembali ke Review Iklan
        </Link>
      </div>

      {/* Summary Cards */}
      <section>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Ringkasan Semua Waktu</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <SummaryCard label="Total Iklan"      value={formatNum(s.totalAds)} />
          <SummaryCard label="Total Budget"     value={formatRp(s.totalBudget)} />
          <SummaryCard label="Total Terpakai"   value={formatRp(s.totalSpend)} />
          <SummaryCard label="Total Tayang"     value={formatNum(s.totalImpressions)} />
          <SummaryCard label="Total Klik"       value={formatNum(s.totalClicks)} />
          <SummaryCard label="CTR Global"       value={`${s.ctr ?? '0.00'}%`} />
        </div>
      </section>

      {/* Status Breakdown */}
      {s.byStatus && (
        <section>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Status Iklan</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(s.byStatus).map(([status, count]) => (
              <span
                key={status}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLOR[status] ?? 'bg-gray-100 text-gray-600'}`}
              >
                {STATUS_LABEL[status] ?? status}: {count}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Monthly Stats Table */}
      <section>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Statistik Bulanan (12 Bulan Terakhir)</h2>
        {!monthlyStats?.length ? (
          <p className="text-sm text-gray-500">Belum ada data bulanan.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-500">
                  <th className="px-4 py-2.5 text-left font-medium">Bulan</th>
                  <th className="px-4 py-2.5 text-right font-medium">Iklan Baru</th>
                  <th className="px-4 py-2.5 text-right font-medium">Budget Dibayar</th>
                  <th className="px-4 py-2.5 text-right font-medium">Terpakai</th>
                  <th className="px-4 py-2.5 text-right font-medium">Utilisasi</th>
                </tr>
              </thead>
              <tbody>
                {monthlyStats.map((row, i) => {
                  const utilPct = row.totalInitialBudget > 0
                    ? Math.min(100, Math.round((row.totalSpend / row.totalInitialBudget) * 100))
                    : 0
                  return (
                    <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-2.5 text-gray-800 font-medium">
                        {monthLabel(row._id.year, row._id.month)}
                      </td>
                      <td className="px-4 py-2.5 text-right text-gray-700">{row.count}</td>
                      <td className="px-4 py-2.5 text-right text-gray-700">{formatRp(row.totalInitialBudget)}</td>
                      <td className="px-4 py-2.5 text-right text-gray-700">{formatRp(row.totalSpend)}</td>
                      <td className="px-4 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#008080]"
                              style={{ width: `${utilPct}%` }}
                            />
                          </div>
                          <span className="text-gray-600">{utilPct}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Top Ads by CTR */}
      <section>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">
          Top 10 Iklan — CTR Tertinggi
          <span className="ml-1.5 text-xs font-normal text-gray-400">(min. 10 tayang)</span>
        </h2>
        {!topAdsByCtr?.length ? (
          <p className="text-sm text-gray-500">Belum cukup data (butuh min. 10 tayang per iklan).</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-500">
                  <th className="px-4 py-2.5 text-left font-medium">#</th>
                  <th className="px-4 py-2.5 text-left font-medium">Produk</th>
                  <th className="px-4 py-2.5 text-left font-medium">Seller</th>
                  <th className="px-4 py-2.5 text-left font-medium">Status</th>
                  <th className="px-4 py-2.5 text-right font-medium">Tayang</th>
                  <th className="px-4 py-2.5 text-right font-medium">Klik</th>
                  <th className="px-4 py-2.5 text-right font-medium">CTR</th>
                  <th className="px-4 py-2.5 text-right font-medium">Terpakai</th>
                </tr>
              </thead>
              <tbody>
                {topAdsByCtr.map((ad, i) => (
                  <tr key={ad._id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-2.5 text-gray-400 font-medium">{i + 1}</td>
                    <td className="px-4 py-2.5 text-gray-800 font-medium max-w-[160px] truncate">
                      {ad.product?.name ?? '—'}
                    </td>
                    <td className="px-4 py-2.5 text-gray-600">
                      {ad.seller?.shopName ?? ad.seller?.name ?? '—'}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_COLOR[ad.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {STATUS_LABEL[ad.status] ?? ad.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right text-gray-700">{formatNum(ad.impressions)}</td>
                    <td className="px-4 py-2.5 text-right text-gray-700">{formatNum(ad.clicks)}</td>
                    <td className="px-4 py-2.5 text-right font-bold text-[#008080]">
                      {formatCtr(ad.clicks, ad.impressions)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-gray-700">{formatRp(ad.totalSpend)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Top Sellers by Spend */}
      <section>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Top 10 Seller — Pengeluaran Iklan Terbesar</h2>
        {!topSellersBySpend?.length ? (
          <p className="text-sm text-gray-500">Belum ada data pengeluaran iklan.</p>
        ) : (
          <div className="rounded-xl border bg-white shadow-sm p-4 space-y-3">
            {topSellersBySpend.map((row, i) => (
              <div key={row._id} className="space-y-1">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-0.5">
                  <span className="font-medium text-gray-800">
                    {i + 1}. {row.seller?.shopName ?? row.seller?.name ?? '—'}
                    <span className="ml-1.5 font-normal text-gray-400">{row.seller?.email ?? ''}</span>
                  </span>
                  <span className="text-gray-500">
                    {row.totalAds} iklan · {formatCtr(row.totalClicks, row.totalImpressions)} CTR
                  </span>
                </div>
                <BarRow
                  label={`Terpakai: ${formatRp(row.totalSpend)}`}
                  value={row.totalSpend}
                  max={maxSellerSpend}
                  formatted={formatRp(row.totalSpend)}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
