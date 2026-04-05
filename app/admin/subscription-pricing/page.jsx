'use client'

import { useCallback, useEffect, useState } from 'react'
import { adminFetch } from '@/lib/adminApi'

const TIERS = [
  {
    key: 'silver',
    label: 'Silver — Seller Terpilih',
    boost: '1.2×',
    color: '#9E9E9E',
  },
  {
    key: 'gold',
    label: 'Gold — Seller Unggulan',
    boost: '1.5×',
    color: '#FFC107',
  },
  {
    key: 'platinum',
    label: 'Platinum — Seller Platinum',
    boost: '2.0×',
    color: '#008080',
  },
]

function toInt(val, fallback) {
  const n = parseInt(val, 10)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

function formatRp(n) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n)
}

export default function AdminSubscriptionPricingPage() {
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')
  const [updatedAt, setUpdatedAt] = useState(null)
  const [notes, setNotes]       = useState('')

  const [form, setForm] = useState({
    silver:   99000,
    gold:     299000,
    platinum: 599000,
  })

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await adminFetch('/api/admin/subscriptions/pricing')
      const prices = res?.data?.prices ?? {}
      setForm({
        silver:   toInt(prices.silver,   99000),
        gold:     toInt(prices.gold,     299000),
        platinum: toInt(prices.platinum, 599000),
      })
      setNotes(res?.data?.notes ?? '')
      setUpdatedAt(res?.data?.updatedAt ?? null)
    } catch (err) {
      setError(err.message || 'Gagal memuat harga tier')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function handleSave(e) {
    e.preventDefault()
    setSuccess('')
    setError('')

    for (const { key, label } of TIERS) {
      const n = toInt(form[key], 0)
      if (n < 1 || n > 10_000_000) {
        setError(`Harga ${label} tidak valid (1 – 10.000.000)`)
        return
      }
    }

    setSaving(true)
    try {
      const body = {
        silver:   form.silver,
        gold:     form.gold,
        platinum: form.platinum,
      }
      if (notes.trim()) body.notes = notes.trim()

      const res = await adminFetch('/api/admin/subscriptions/pricing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const saved = res?.data?.prices ?? {}
      setForm({
        silver:   toInt(saved.silver,   form.silver),
        gold:     toInt(saved.gold,     form.gold),
        platinum: toInt(saved.platinum, form.platinum),
      })
      setUpdatedAt(res?.data?.updatedAt ?? null)
      setSuccess('Harga berhasil diperbarui ✓')
    } catch (err) {
      setError(err.message || 'Gagal menyimpan harga')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Harga Tier Langganan</h1>
        <p className="text-sm text-gray-500 mt-1">
          Harga baru berlaku pada pembelian berikutnya. Langganan aktif tidak
          terpengaruh.
        </p>
        {updatedAt && (
          <p className="text-xs text-gray-400 mt-1">
            Terakhir diubah:{' '}
            {new Date(updatedAt).toLocaleString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Memuat...</p>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          {/* Tier price fields */}
          {TIERS.map(({ key, label, boost, color }) => (
            <div
              key={key}
              className="rounded-xl border bg-white p-4"
              style={{ borderColor: `${color}55` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  style={{ background: `${color}22`, color }}
                >
                  {label}
                </span>
                <span className="text-xs text-gray-400">boost {boost}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-600 shrink-0">
                  Rp
                </span>
                <input
                  type="number"
                  min={1}
                  max={10000000}
                  step={1}
                  value={form[key]}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [key]: e.target.value === '' ? '' : Number(e.target.value) }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#008080] focus:outline-none focus:ring-1 focus:ring-[#008080]"
                  required
                />
                <span className="text-xs text-gray-400 shrink-0 whitespace-nowrap">
                  / bulan
                </span>
              </div>

              <p className="text-xs text-gray-400 mt-1.5">
                Preview: {formatRp(toInt(form[key], 0))} / bulan
              </p>
            </div>
          ))}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catatan Perubahan{' '}
              <span className="text-gray-400 font-normal">(opsional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={200}
              rows={2}
              placeholder='Mis. "Promo Lebaran 2026 — diskon 10%"'
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#008080] focus:outline-none focus:ring-1 focus:ring-[#008080] resize-none"
            />
          </div>

          {/* Warning */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
            ⚠️ Harga yang disimpan langsung berlaku untuk semua seller yang membuka
            halaman langganan. Cache backend akan refresh dalam 30 detik.
          </div>

          {/* Feedback */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#008080] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#006666] disabled:opacity-50 transition-colors"
            >
              {saving ? 'Menyimpan...' : 'Simpan Harga'}
            </button>
            <button
              type="button"
              onClick={load}
              disabled={loading || saving}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Reset
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
