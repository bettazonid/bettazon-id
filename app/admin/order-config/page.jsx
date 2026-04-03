'use client'

import { useCallback, useEffect, useState } from 'react'
import { adminFetch } from '@/lib/adminApi'

export default function AdminOrderConfigPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    autoCompleteDays: 3,
    autoCompleteReplacementDays: 3,
  })

  const loadConfig = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await adminFetch('/api/admin/order-config')
      const config = res?.data?.config
      if (config) {
        setForm({
          autoCompleteDays: config.autoCompleteDays ?? 3,
          autoCompleteReplacementDays: config.autoCompleteReplacementDays ?? 3,
        })
      }
    } catch (err) {
      setError(err.message || 'Gagal memuat konfigurasi')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadConfig()
  }, [loadConfig])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: Number(value) }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    const days = Number(form.autoCompleteDays)
    const replacementDays = Number(form.autoCompleteReplacementDays)

    if (!Number.isInteger(days) || days < 1 || days > 30) {
      setError('Auto-complete pesanan harus antara 1 dan 30 hari')
      setSaving(false)
      return
    }
    if (!Number.isInteger(replacementDays) || replacementDays < 1 || replacementDays > 30) {
      setError('Auto-complete penggantian harus antara 1 dan 30 hari')
      setSaving(false)
      return
    }

    try {
      const res = await adminFetch('/api/admin/order-config', {
        method: 'PUT',
        body: JSON.stringify({
          autoCompleteDays: days,
          autoCompleteReplacementDays: replacementDays,
        }),
      })
      const updated = res?.data?.config
      if (updated) {
        setForm({
          autoCompleteDays: updated.autoCompleteDays ?? days,
          autoCompleteReplacementDays: updated.autoCompleteReplacementDays ?? replacementDays,
        })
      }
      setSuccess('Konfigurasi berhasil disimpan.')
    } catch (err) {
      setError(err.message || 'Gagal menyimpan konfigurasi')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-bold text-gray-900 mb-1">Konfigurasi Order</h1>
      <p className="text-sm text-gray-500 mb-6">
        Atur batas waktu (hari) sebelum pesanan yang sudah dikirim otomatis diselesaikan oleh sistem
        dan dana escrow dicairkan ke seller.
      </p>

      {loading ? (
        <p className="text-sm text-gray-500">Memuat konfigurasi...</p>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Info box */}
          <div className="rounded-xl border border-[#008080]/30 bg-[#008080]/5 p-4 text-sm text-[#008080]">
            Jika pembeli tidak mengkonfirmasi penerimaan dalam batas waktu yang ditentukan,
            sistem akan otomatis menyelesaikan pesanan dan melepas dana escrow ke seller.
            Cron job berjalan setiap jam.
          </div>

          {/* Section: Pesanan Biasa */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">📦</span>
              <h2 className="font-semibold text-gray-800">
                Auto-Selesai Pesanan <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">shipped</span>
              </h2>
            </div>
            <p className="text-xs text-gray-500">
              Pesanan dengan status <strong>Dikirim</strong> akan otomatis selesai setelah X hari
              jika pembeli belum mengkonfirmasi penerimaan.
            </p>
            <div className="flex items-center gap-3">
              <input
                type="number"
                name="autoCompleteDays"
                min={1}
                max={30}
                step={1}
                value={form.autoCompleteDays}
                onChange={handleChange}
                className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]/40"
                required
              />
              <span className="text-sm text-gray-600">hari</span>
            </div>
          </div>

          {/* Section: Produk Pengganti */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">🔄</span>
              <h2 className="font-semibold text-gray-800">
                Auto-Selesai Penggantian <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">replacing_shipped</span>
              </h2>
            </div>
            <p className="text-xs text-gray-500">
              Pesanan penggantian yang sudah dikirim akan otomatis selesai setelah X hari
              jika pembeli belum mengkonfirmasi penerimaan produk pengganti.
            </p>
            <div className="flex items-center gap-3">
              <input
                type="number"
                name="autoCompleteReplacementDays"
                min={1}
                max={30}
                step={1}
                value={form.autoCompleteReplacementDays}
                onChange={handleChange}
                className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]/40"
                required
              />
              <span className="text-sm text-gray-600">hari</span>
            </div>
          </div>

          {/* Feedback */}
          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </p>
          )}
          {success && (
            <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">
              {success}
            </p>
          )}

          {/* Save button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-[#008080] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#006666] disabled:opacity-50 transition-colors"
          >
            {saving ? 'Menyimpan...' : 'Simpan Konfigurasi'}
          </button>
        </form>
      )}
    </div>
  )
}
