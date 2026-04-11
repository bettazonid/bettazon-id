'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { adminDownload, adminFetch, getAdminToken } from '@/lib/adminApi'

// ── Constants ──────────────────────────────────────────────────────────────
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:5000'
const CURRENCIES = ['USD', 'IDR', 'SGD', 'MYR']
const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

const emptyRate = {
  transhipper: '',
  transhipperCode: '',
  warehouseCity: '',
  destinationCountry: '',
  destinationCountryCode: '',
  zone: '',
  currency: 'USD',
  ratePerBox: '',
  ratePerKg: '',
  maxFishPerBox: 8,
  maxWeightPerBox_kg: '',
  estimatedDaysMin: '',
  estimatedDaysMax: '',
  notes: '',
  isActive: true,
}

const emptySchedule = {
  transhipper: '',
  transhipperCode: '',
  origin: 'Jakarta',
  destinationCountry: '',
  destinationCountryCode: '',
  departureDays: [],
  frequency: '',
  cutoffDay: '',
  estimatedArrival: '',
  notes: '',
  isActive: true,
}

// ── Helper: upload with FormData (not JSON) ────────────────────────────────
async function adminUpload(path, formData) {
  const token = getAdminToken()
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  const json = await res.json()
  if (!res.ok) {
    const msg =
      json?.message?.id ||
      json?.message?.en ||
      json?.message ||
      'Upload gagal'
    throw new Error(msg)
  }
  return json
}

// ── UI primitives ──────────────────────────────────────────────────────────
function Badge({ active }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
        active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
      }`}
    >
      {active ? 'Aktif' : 'Nonaktif'}
    </span>
  )
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FE735C] border-t-transparent" />
    </div>
  )
}

function EmptyRow({ cols, message = 'Belum ada data.' }) {
  return (
    <tr>
      <td colSpan={cols} className="py-10 text-center text-sm text-gray-400">
        {message}
      </td>
    </tr>
  )
}

function Pagination({ page, pages, total, onChange }) {
  if (pages <= 1) return null
  return (
    <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 text-sm text-gray-500">
      <span>{total} data total</span>
      <div className="flex gap-2">
        <button
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="rounded border border-gray-200 px-3 py-1 disabled:opacity-40 hover:bg-gray-50"
        >
          ‹ Sebelumnya
        </button>
        <span className="rounded border border-gray-200 px-3 py-1 font-medium">
          {page} / {pages}
        </span>
        <button
          disabled={page >= pages}
          onClick={() => onChange(page + 1)}
          className="rounded border border-gray-200 px-3 py-1 disabled:opacity-40 hover:bg-gray-50"
        >
          Berikutnya ›
        </button>
      </div>
    </div>
  )
}

// ── Import modal ───────────────────────────────────────────────────────────
function ImportModal({ type, onClose, onDone }) {
  const [mode, setMode] = useState('upsert')
  const [file, setFile] = useState(null)
  const [drag, setDrag] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const inputRef = useRef()

  async function handleDownloadTemplate() {
    try {
      const res = await adminDownload(
        `/api/international-shipping/admin/${type}/template`
      )
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `template_${type}.xlsx`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleUpload() {
    if (!file) {
      setError('Pilih file Excel atau CSV terlebih dahulu.')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await adminUpload(
        `/api/international-shipping/admin/${type}/import?mode=${mode}`,
        fd
      )
      setResult(res?.data || res)
      onDone()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    setDrag(false)
    const f = e.dataTransfer.files?.[0]
    if (f) setFile(f)
  }

  const typeName = type === 'rates' ? 'Rate' : 'Jadwal'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-base font-bold text-gray-900">Import {typeName} dari Excel / CSV</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
            ×
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Mode */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">Mode Import</p>
            <div className="flex gap-3">
              {[
                { v: 'upsert', label: 'Upsert', desc: 'Update jika sudah ada, insert jika baru' },
                { v: 'append', label: 'Append', desc: 'Selalu insert baru (duplikat mungkin terjadi)' },
              ].map((m) => (
                <label
                  key={m.v}
                  className={`flex-1 cursor-pointer rounded-lg border p-3 text-sm transition-colors ${
                    mode === m.v
                      ? 'border-[#FE735C] bg-[#FE735C]/5'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    checked={mode === m.v}
                    onChange={() => setMode(m.v)}
                  />
                  <span className="font-semibold block">{m.label}</span>
                  <span className="text-xs text-gray-500">{m.desc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Dropzone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
            onDragLeave={() => setDrag(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
              drag ? 'border-[#FE735C] bg-[#FE735C]/5' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              className="sr-only"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {file ? (
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl">📄</span>
                <span className="text-sm font-medium text-gray-800">{file.name}</span>
                <span className="text-xs text-gray-400">
                  {(file.size / 1024).toFixed(1)} KB — klik untuk ganti
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1 text-gray-400">
                <span className="text-3xl">📂</span>
                <span className="text-sm">Drop file di sini, atau klik untuk pilih</span>
                <span className="text-xs">.xlsx, .xls, .csv • max 5 MB</span>
              </div>
            )}
          </div>

          {/* Template download */}
          <button
            onClick={handleDownloadTemplate}
            className="w-full rounded-lg border border-gray-200 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            ⬇ Download Template Excel
          </button>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          {result && (
            <div className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">
              ✓ Berhasil: <strong>{result.inserted ?? 0}</strong> ditambah,{' '}
              <strong>{result.updated ?? 0}</strong> diupdate
              {result.skipped > 0 && `, ${result.skipped} dilewati`}
            </div>
          )}
        </div>

        <div className="flex gap-3 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-200 py-2 text-sm hover:bg-gray-50"
          >
            Tutup
          </button>
          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className="flex-1 rounded-lg bg-[#FE735C] py-2 text-sm font-semibold text-white hover:bg-[#e55e49] disabled:opacity-50"
          >
            {loading ? 'Mengupload...' : 'Upload & Import'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Rate Modal (Add / Edit) ────────────────────────────────────────────────
function RateModal({ initial, onClose, onSaved }) {
  const isEdit = !!initial?._id
  const [form, setForm] = useState(() => ({
    ...emptyRate,
    ...(initial
      ? {
          ...initial,
          ratePerBox: initial.ratePerBox ?? '',
          ratePerKg: initial.ratePerKg ?? '',
          maxFishPerBox: initial.maxFishPerBox ?? 8,
          maxWeightPerBox_kg: initial.maxWeightPerBox_kg ?? '',
          estimatedDaysMin: initial.estimatedDays?.min ?? '',
          estimatedDaysMax: initial.estimatedDays?.max ?? '',
        }
      : {}),
  }))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set(key, val) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...form,
        ratePerBox: form.ratePerBox !== '' ? Number(form.ratePerBox) : undefined,
        ratePerKg: form.ratePerKg !== '' ? Number(form.ratePerKg) : undefined,
        maxFishPerBox: Number(form.maxFishPerBox) || 8,
        maxWeightPerBox_kg:
          form.maxWeightPerBox_kg !== '' ? Number(form.maxWeightPerBox_kg) : undefined,
        estimatedDays: {
          min: form.estimatedDaysMin !== '' ? Number(form.estimatedDaysMin) : undefined,
          max: form.estimatedDaysMax !== '' ? Number(form.estimatedDaysMax) : undefined,
        },
      }
      delete payload.estimatedDaysMin
      delete payload.estimatedDaysMax

      if (isEdit) {
        await adminFetch(`/api/international-shipping/admin/rates/${initial._id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
      } else {
        await adminFetch('/api/international-shipping/admin/rates', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
      }
      onSaved()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-base font-bold text-gray-900">
            {isEdit ? 'Edit Rate' : 'Tambah Rate Baru'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nama Transhipper *" required>
              <input
                className="input-base"
                value={form.transhipper}
                onChange={(e) => set('transhipper', e.target.value)}
                required
                placeholder="misal: JBG Transhipping"
              />
            </Field>
            <Field label="Kode Transhipper *" required>
              <input
                className="input-base uppercase"
                value={form.transhipperCode}
                onChange={(e) => set('transhipperCode', e.target.value.toUpperCase())}
                required
                placeholder="misal: JBG"
              />
            </Field>
            <Field label="Kota Warehouse / Pickup Transhipper">
              <input
                className="input-base"
                value={form.warehouseCity}
                onChange={(e) => set('warehouseCity', e.target.value)}
                placeholder="misal: Jakarta, Surabaya"
              />
              <p className="mt-0.5 text-xs text-gray-400">Dipakai untuk hitung ongkir seller → transhipper di checkout.</p>
            </Field>
            <Field label="Negara Tujuan *" required>
              <input
                className="input-base"
                value={form.destinationCountry}
                onChange={(e) => set('destinationCountry', e.target.value)}
                required
                placeholder="misal: Singapura"
              />
            </Field>
            <Field label="Kode Negara *" required>
              <input
                className="input-base uppercase"
                value={form.destinationCountryCode}
                onChange={(e) => set('destinationCountryCode', e.target.value.toUpperCase())}
                required
                placeholder="misal: SG"
                maxLength={3}
              />
            </Field>
            <Field label="Zona / Region">
              <input
                className="input-base"
                value={form.zone}
                onChange={(e) => set('zone', e.target.value)}
                placeholder="misal: Southeast Asia"
              />
            </Field>
            <Field label="Mata Uang *" required>
              <select
                className="input-base"
                value={form.currency}
                onChange={(e) => set('currency', e.target.value)}
                required
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Rate per Kotak">
              <input
                type="number"
                min="0"
                step="0.01"
                className="input-base"
                value={form.ratePerBox}
                onChange={(e) => set('ratePerBox', e.target.value)}
                placeholder="misal: 25"
              />
            </Field>
            <Field label="Rate per Kg">
              <input
                type="number"
                min="0"
                step="0.01"
                className="input-base"
                value={form.ratePerKg}
                onChange={(e) => set('ratePerKg', e.target.value)}
                placeholder="misal: 5"
              />
            </Field>
            <Field label="Max Ikan per Kotak">
              <input
                type="number"
                min="1"
                className="input-base"
                value={form.maxFishPerBox}
                onChange={(e) => set('maxFishPerBox', e.target.value)}
              />
            </Field>
            <Field label="Max Berat per Kotak (kg)">
              <input
                type="number"
                min="0"
                step="0.1"
                className="input-base"
                value={form.maxWeightPerBox_kg}
                onChange={(e) => set('maxWeightPerBox_kg', e.target.value)}
                placeholder="misal: 10"
              />
            </Field>
            <Field label="Est. Hari (min)">
              <input
                type="number"
                min="0"
                className="input-base"
                value={form.estimatedDaysMin}
                onChange={(e) => set('estimatedDaysMin', e.target.value)}
                placeholder="misal: 3"
              />
            </Field>
            <Field label="Est. Hari (max)">
              <input
                type="number"
                min="0"
                className="input-base"
                value={form.estimatedDaysMax}
                onChange={(e) => set('estimatedDaysMax', e.target.value)}
                placeholder="misal: 5"
              />
            </Field>
          </div>

          <Field label="Catatan">
            <textarea
              className="input-base resize-none"
              rows={2}
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="Informasi tambahan, persyaratan khusus, dll."
            />
          </Field>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => set('isActive', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-[#FE735C]"
            />
            <span className="text-sm text-gray-700">Aktifkan rute ini</span>
          </label>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-[#FE735C] py-2.5 text-sm font-semibold text-white hover:bg-[#e55e49] disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Rate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Schedule Modal (Add / Edit) ────────────────────────────────────────────
function ScheduleModal({ initial, onClose, onSaved }) {
  const isEdit = !!initial?._id
  const [form, setForm] = useState(() => ({
    ...emptySchedule,
    ...(initial
      ? {
          ...initial,
          departureDays: initial.departureDays || [],
        }
      : {}),
  }))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set(key, val) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  function toggleDay(day) {
    setForm((f) => ({
      ...f,
      departureDays: f.departureDays.includes(day)
        ? f.departureDays.filter((d) => d !== day)
        : [...f.departureDays, day],
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (isEdit) {
        await adminFetch(`/api/international-shipping/admin/schedules/${initial._id}`, {
          method: 'PUT',
          body: JSON.stringify(form),
        })
      } else {
        await adminFetch('/api/international-shipping/admin/schedules', {
          method: 'POST',
          body: JSON.stringify(form),
        })
      }
      onSaved()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-base font-bold text-gray-900">
            {isEdit ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nama Transhipper *" required>
              <input
                className="input-base"
                value={form.transhipper}
                onChange={(e) => set('transhipper', e.target.value)}
                required
                placeholder="misal: JBG Transhipping"
              />
            </Field>
            <Field label="Kode Transhipper *" required>
              <input
                className="input-base uppercase"
                value={form.transhipperCode}
                onChange={(e) => set('transhipperCode', e.target.value.toUpperCase())}
                required
                placeholder="misal: JBG"
              />
            </Field>
            <Field label="Kota Asal">
              <input
                className="input-base"
                value={form.origin}
                onChange={(e) => set('origin', e.target.value)}
                placeholder="Jakarta"
              />
            </Field>
            <Field label="Negara Tujuan *" required>
              <input
                className="input-base"
                value={form.destinationCountry}
                onChange={(e) => set('destinationCountry', e.target.value)}
                required
                placeholder="misal: Singapura"
              />
            </Field>
            <Field label="Kode Negara *" required>
              <input
                className="input-base uppercase"
                value={form.destinationCountryCode}
                onChange={(e) => set('destinationCountryCode', e.target.value.toUpperCase())}
                required
                placeholder="misal: SG"
                maxLength={3}
              />
            </Field>
            <Field label="Frekuensi Pengiriman">
              <input
                className="input-base"
                value={form.frequency}
                onChange={(e) => set('frequency', e.target.value)}
                placeholder="misal: Setiap Senin & Kamis"
              />
            </Field>
            <Field label="Hari Cutoff Order">
              <input
                className="input-base"
                value={form.cutoffDay}
                onChange={(e) => set('cutoffDay', e.target.value)}
                placeholder="misal: Jumat 17:00 WIB"
              />
            </Field>
            <Field label="Estimasi Tiba">
              <input
                className="input-base"
                value={form.estimatedArrival}
                onChange={(e) => set('estimatedArrival', e.target.value)}
                placeholder="misal: 3-5 hari setelah keberangkatan"
              />
            </Field>
          </div>

          <Field label="Hari Keberangkatan">
            <div className="flex flex-wrap gap-2 mt-1">
              {DAYS.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    form.departureDays.includes(day)
                      ? 'border-[#008080] bg-[#008080] text-white'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Catatan">
            <textarea
              className="input-base resize-none"
              rows={2}
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="Informasi jadwal khusus, hari libur, dll."
            />
          </Field>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => set('isActive', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-[#FE735C]"
            />
            <span className="text-sm text-gray-700">Aktifkan jadwal ini</span>
          </label>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-[#FE735C] py-2.5 text-sm font-semibold text-white hover:bg-[#e55e49] disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Jadwal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, children, required }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

// ── Rates Tab ──────────────────────────────────────────────────────────────
function RatesTab() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [rows, setRows] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [filterTransshipper, setFilterTransshipper] = useState('')
  const [filterCountry, setFilterCountry] = useState('')
  const [filterActive, setFilterActive] = useState('')
  const [modal, setModal] = useState(null) // null | 'add' | { _id, ... }
  const [importOpen, setImportOpen] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const load = useCallback(
    async (page = 1) => {
      setLoading(true)
      setError('')
      try {
        const params = new URLSearchParams({ page, limit: 20 })
        if (filterTransshipper) params.set('transhipper', filterTransshipper)
        if (filterCountry) params.set('country', filterCountry)
        if (filterActive !== '') params.set('active', filterActive)
        const res = await adminFetch(
          `/api/international-shipping/admin/rates?${params.toString()}`
        )
        setRows(res?.data?.rates || res?.data || [])
        setPagination(
          res?.data?.pagination || { page: 1, pages: 1, total: res?.data?.length || 0 }
        )
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    },
    [filterTransshipper, filterCountry, filterActive]
  )

  useEffect(() => {
    load(1)
  }, [load])

  async function handleDelete(id) {
    if (!confirm('Hapus rate ini?')) return
    setDeletingId(id)
    try {
      await adminFetch(`/api/international-shipping/admin/rates/${id}`, { method: 'DELETE' })
      load(pagination.page)
    } catch (e) {
      alert(e.message)
    } finally {
      setDeletingId(null)
    }
  }

  async function handleToggleActive(row) {
    try {
      await adminFetch(`/api/international-shipping/admin/rates/${row._id}`, {
        method: 'PUT',
        body: JSON.stringify({ isActive: !row.isActive }),
      })
      load(pagination.page)
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          className="input-base w-44"
          placeholder="Filter transhipper..."
          value={filterTransshipper}
          onChange={(e) => setFilterTransshipper(e.target.value)}
        />
        <input
          className="input-base w-44"
          placeholder="Filter negara (kode)..."
          value={filterCountry}
          onChange={(e) => setFilterCountry(e.target.value)}
        />
        <select
          className="input-base w-36"
          value={filterActive}
          onChange={(e) => setFilterActive(e.target.value)}
        >
          <option value="">Semua Status</option>
          <option value="true">Aktif</option>
          <option value="false">Nonaktif</option>
        </select>
        <div className="flex-1" />
        <button
          onClick={() => setImportOpen(true)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          ⬆ Import Excel / CSV
        </button>
        <button
          onClick={() => setModal('add')}
          className="rounded-lg bg-[#FE735C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e55e49]"
        >
          + Tambah Rate
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3">Transhipper</th>
                <th className="px-4 py-3">Negara Tujuan</th>
                <th className="px-4 py-3">Rate / Kotak</th>
                <th className="px-4 py-3">Rate / Kg</th>
                <th className="px-4 py-3">Max Ikan</th>
                <th className="px-4 py-3">Est. Hari</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8}>
                    <Spinner />
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <EmptyRow
                  cols={8}
                  message="Belum ada data rate. Tambah manual atau import dari Excel."
                />
              ) : (
                rows.map((row) => (
                  <tr
                    key={row._id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-800">{row.transhipper}</span>
                      <br />
                      <span className="text-xs text-gray-400">{row.transhipperCode}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium">{row.destinationCountry}</span>
                      <br />
                      <span className="text-xs text-gray-400">{row.destinationCountryCode}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#008080]">
                      {row.ratePerBox != null
                        ? `${row.currency} ${Number(row.ratePerBox).toLocaleString()}`
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {row.ratePerKg != null
                        ? `${row.currency} ${Number(row.ratePerKg).toLocaleString()}`
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{row.maxFishPerBox ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {row.estimatedDays?.min != null
                        ? `${row.estimatedDays.min}–${row.estimatedDays.max ?? '?'} hari`
                        : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleActive(row)}
                        title="Klik untuk toggle aktif/nonaktif"
                      >
                        <Badge active={row.isActive} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setModal(row)}
                          className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs hover:bg-gray-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(row._id)}
                          disabled={deletingId === row._id}
                          className="rounded-lg border border-red-200 px-2.5 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === row._id ? '...' : 'Hapus'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          page={pagination.page}
          pages={pagination.pages}
          total={pagination.total}
          onChange={(p) => load(p)}
        />
      </div>

      {/* Modals */}
      {importOpen && (
        <ImportModal
          type="rates"
          onClose={() => setImportOpen(false)}
          onDone={() => { load(1) }}
        />
      )}
      {modal === 'add' && (
        <RateModal
          initial={null}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load(pagination.page) }}
        />
      )}
      {modal && modal !== 'add' && (
        <RateModal
          initial={modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load(pagination.page) }}
        />
      )}
    </div>
  )
}

// ── Schedules Tab ──────────────────────────────────────────────────────────
function SchedulesTab() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [rows, setRows] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [filterTransshipper, setFilterTransshipper] = useState('')
  const [filterCountry, setFilterCountry] = useState('')
  const [modal, setModal] = useState(null)
  const [importOpen, setImportOpen] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const load = useCallback(
    async (page = 1) => {
      setLoading(true)
      setError('')
      try {
        const params = new URLSearchParams({ page, limit: 20 })
        if (filterTransshipper) params.set('transhipper', filterTransshipper)
        if (filterCountry) params.set('country', filterCountry)
        const res = await adminFetch(
          `/api/international-shipping/admin/schedules?${params.toString()}`
        )
        setRows(res?.data?.schedules || res?.data || [])
        setPagination(
          res?.data?.pagination || { page: 1, pages: 1, total: res?.data?.length || 0 }
        )
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    },
    [filterTransshipper, filterCountry]
  )

  useEffect(() => {
    load(1)
  }, [load])

  async function handleDelete(id) {
    if (!confirm('Hapus jadwal ini?')) return
    setDeletingId(id)
    try {
      await adminFetch(`/api/international-shipping/admin/schedules/${id}`, { method: 'DELETE' })
      load(pagination.page)
    } catch (e) {
      alert(e.message)
    } finally {
      setDeletingId(null)
    }
  }

  async function handleToggleActive(row) {
    try {
      await adminFetch(`/api/international-shipping/admin/schedules/${row._id}`, {
        method: 'PUT',
        body: JSON.stringify({ isActive: !row.isActive }),
      })
      load(pagination.page)
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          className="input-base w-44"
          placeholder="Filter transhipper..."
          value={filterTransshipper}
          onChange={(e) => setFilterTransshipper(e.target.value)}
        />
        <input
          className="input-base w-44"
          placeholder="Filter negara (kode)..."
          value={filterCountry}
          onChange={(e) => setFilterCountry(e.target.value)}
        />
        <div className="flex-1" />
        <button
          onClick={() => setImportOpen(true)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          ⬆ Import Excel / CSV
        </button>
        <button
          onClick={() => setModal('add')}
          className="rounded-lg bg-[#FE735C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e55e49]"
        >
          + Tambah Jadwal
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3">Transhipper</th>
                <th className="px-4 py-3">Rute</th>
                <th className="px-4 py-3">Hari Keberangkatan</th>
                <th className="px-4 py-3">Cutoff Order</th>
                <th className="px-4 py-3">Est. Tiba</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7}>
                    <Spinner />
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <EmptyRow
                  cols={7}
                  message="Belum ada data jadwal. Tambah manual atau import dari Excel."
                />
              ) : (
                rows.map((row) => (
                  <tr
                    key={row._id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-800">{row.transhipper}</span>
                      <br />
                      <span className="text-xs text-gray-400">{row.transhipperCode}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium">{row.origin || 'Jakarta'}</span>
                      <span className="mx-1 text-gray-400">→</span>
                      <span className="font-medium">{row.destinationCountry}</span>
                      <br />
                      <span className="text-xs text-gray-400">
                        {row.frequency || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(row.departureDays || []).map((d) => (
                          <span
                            key={d}
                            className="inline-block rounded-full bg-[#008080]/10 px-2 py-0.5 text-xs text-[#008080] font-medium"
                          >
                            {d}
                          </span>
                        ))}
                        {(!row.departureDays || row.departureDays.length === 0) && (
                          <span className="text-gray-400">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {row.cutoffDay || '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {row.estimatedArrival || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleToggleActive(row)} title="Klik untuk toggle">
                        <Badge active={row.isActive} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setModal(row)}
                          className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs hover:bg-gray-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(row._id)}
                          disabled={deletingId === row._id}
                          className="rounded-lg border border-red-200 px-2.5 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === row._id ? '...' : 'Hapus'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          page={pagination.page}
          pages={pagination.pages}
          total={pagination.total}
          onChange={(p) => load(p)}
        />
      </div>

      {/* Modals */}
      {importOpen && (
        <ImportModal
          type="schedules"
          onClose={() => setImportOpen(false)}
          onDone={() => { load(1) }}
        />
      )}
      {modal === 'add' && (
        <ScheduleModal
          initial={null}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load(pagination.page) }}
        />
      )}
      {modal && modal !== 'add' && (
        <ScheduleModal
          initial={modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load(pagination.page) }}
        />
      )}
    </div>
  )
}

const emptyLocalTransshipper = {
  transhipperName: '',
  country: '',
  countryCode: '',
  partneredWithCodes: '',   // comma-separated input, sent as array
  contactWhatsapp: '',
  contactInstagram: '',
  contactEmail: '',
  contactOther: '',
  receiptDays: [],
  receiptScheduleNote: '',
  notes: '',
  isActive: true,
}

// ── Local Transhipper Modal ────────────────────────────────────────────────
function LocalTransshipperModal({ initial, onClose, onSaved }) {
  const isEdit = !!initial?._id
  const [form, setForm] = useState(() => ({
    ...emptyLocalTransshipper,
    ...(initial
      ? {
          ...initial,
          partneredWithCodes: (initial.partneredWithCodes || []).join(', '),
          receiptDays: initial.receiptDays || [],
        }
      : {}),
  }))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set(key, val) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  function toggleReceiptDay(day) {
    setForm((f) => ({
      ...f,
      receiptDays: f.receiptDays.includes(day)
        ? f.receiptDays.filter((d) => d !== day)
        : [...f.receiptDays, day],
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...form,
        partneredWithCodes: form.partneredWithCodes
          .split(',')
          .map((s) => s.trim().toUpperCase())
          .filter(Boolean),
      }
      if (isEdit) {
        await adminFetch(`/api/international-shipping/admin/local-transhippers/${initial._id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
      } else {
        await adminFetch('/api/international-shipping/admin/local-transhippers', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
      }
      onSaved()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-base font-bold text-gray-900">
            {isEdit ? 'Edit Transhipper Lokal' : 'Tambah Transhipper Lokal'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nama Transhipper Lokal *" required>
              <input
                className="input-base"
                value={form.transhipperName}
                onChange={(e) => set('transhipperName', e.target.value)}
                required
                placeholder="misal: Kenny Seaw"
              />
            </Field>
            <Field label="Negara *" required>
              <input
                className="input-base"
                value={form.country}
                onChange={(e) => set('country', e.target.value)}
                required
                placeholder="misal: Singapura"
              />
            </Field>
            <Field label="Kode Negara *" required>
              <input
                className="input-base uppercase"
                value={form.countryCode}
                onChange={(e) => set('countryCode', e.target.value.toUpperCase())}
                required
                placeholder="misal: SG"
                maxLength={3}
              />
            </Field>
            <Field label="Bekerjasama dengan (kode transhipper Indo)">
              <input
                className="input-base"
                value={form.partneredWithCodes}
                onChange={(e) => set('partneredWithCodes', e.target.value)}
                placeholder="misal: JBG, XYZ — kosong = semua"
              />
              <p className="text-xs text-gray-400 mt-1">Pisahkan dengan koma. Kosong = muncul untuk semua transhipper Indonesia.</p>
            </Field>
          </div>

          <p className="text-xs font-semibold text-gray-500 -mb-1">Kontak</p>
          <div className="grid grid-cols-2 gap-4">
            <Field label="WhatsApp">
              <input
                className="input-base"
                value={form.contactWhatsapp}
                onChange={(e) => set('contactWhatsapp', e.target.value)}
                placeholder="+65-xxxx-xxxx"
              />
            </Field>
            <Field label="Instagram">
              <input
                className="input-base"
                value={form.contactInstagram}
                onChange={(e) => set('contactInstagram', e.target.value)}
                placeholder="@username"
              />
            </Field>
            <Field label="Email">
              <input
                className="input-base"
                value={form.contactEmail}
                onChange={(e) => set('contactEmail', e.target.value)}
                placeholder="email@domain.com"
              />
            </Field>
            <Field label="Kontak Lain">
              <input
                className="input-base"
                value={form.contactOther}
                onChange={(e) => set('contactOther', e.target.value)}
                placeholder="Telegram, WeChat, dll."
              />
            </Field>
          </div>

          <Field label="Hari Penerimaan">
            <div className="flex flex-wrap gap-2 mt-1">
              {DAYS.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleReceiptDay(day)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    form.receiptDays.includes(day)
                      ? 'border-[#008080] bg-[#008080] text-white'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Catatan Jadwal Terima">
            <input
              className="input-base"
              value={form.receiptScheduleNote}
              onChange={(e) => set('receiptScheduleNote', e.target.value)}
              placeholder="misal: Penerimaan jam 10.00–18.00 waktu setempat"
            />
          </Field>

          <Field label="Catatan Tambahan">
            <textarea
              className="input-base resize-none"
              rows={2}
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="Informasi lain yang relevan untuk buyer."
            />
          </Field>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => set('isActive', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-[#FE735C]"
            />
            <span className="text-sm text-gray-700">Aktifkan transhipper lokal ini</span>
          </label>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-[#FE735C] py-2.5 text-sm font-semibold text-white hover:bg-[#e55e49] disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Transhipper Lokal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Local Transhippers Tab ─────────────────────────────────────────────────
function LocalTransshippersTab() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [filterCountry, setFilterCountry] = useState('')
  const [filterActive, setFilterActive] = useState('')
  const [modal, setModal] = useState(null)   // null | 'add' | item object
  const [deletingId, setDeletingId] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })

  const load = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: 20 })
      if (filterCountry) params.set('country', filterCountry.toUpperCase())
      if (filterActive !== '') params.set('includeInactive', filterActive === 'all' ? 'true' : 'false')
      const data = await adminFetch(`/api/international-shipping/admin/local-transhippers?${params}`)
      const list = data?.data ?? []
      setItems(list)
      setPagination({
        page: data?.page ?? 1,
        pages: data?.pages ?? 1,
        total: data?.total ?? list.length,
      })
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [filterCountry, filterActive])

  useEffect(() => { load(1) }, [load])

  async function handleToggleActive(item) {
    try {
      await adminFetch(`/api/international-shipping/admin/local-transhippers/${item._id}`, {
        method: 'PUT',
        body: JSON.stringify({ isActive: !item.isActive }),
      })
      load(pagination.page)
    } catch {/* swallow */}
  }

  async function handleDelete(id) {
    if (!confirm('Hapus transhipper lokal ini?')) return
    setDeletingId(id)
    try {
      await adminFetch(`/api/international-shipping/admin/local-transhippers/${id}`, {
        method: 'DELETE',
      })
      load(pagination.page)
    } catch {/* swallow */}
    finally { setDeletingId(null) }
  }

  return (
    <div>
      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          className="input-base w-36"
          placeholder="Filter kode negara"
          value={filterCountry}
          onChange={(e) => setFilterCountry(e.target.value)}
        />
        <select
          className="input-base w-36"
          value={filterActive}
          onChange={(e) => setFilterActive(e.target.value)}
        >
          <option value="">Aktif saja</option>
          <option value="all">Semua status</option>
        </select>
        <div className="flex-1" />
        <button
          onClick={() => setModal('add')}
          className="rounded-lg bg-[#FE735C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e55e49]"
        >
          + Tambah Transhipper Lokal
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <Spinner />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">Nama</th>
                <th className="px-4 py-3 text-left">Negara</th>
                <th className="px-4 py-3 text-left">Bekerjasama dengan</th>
                <th className="px-4 py-3 text-left">Kontak Utama</th>
                <th className="px-4 py-3 text-left">Hari Terima</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {items.length === 0 ? (
                <EmptyRow cols={7} message="Belum ada transhipper lokal." />
              ) : (
                items.map((item) => {
                  const primaryContact =
                    item.contactWhatsapp ||
                    item.contactInstagram ||
                    item.contactEmail ||
                    item.contactOther ||
                    '—'
                  const receiptDaysText = (item.receiptDays || []).join(', ') || '—'
                  const partnered = (item.partneredWithCodes || []).join(', ') || 'Semua'
                  return (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {item.transhipperName}
                        {item.receiptScheduleNote && (
                          <p className="text-xs text-gray-400 font-normal mt-0.5">
                            {item.receiptScheduleNote}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {item.country}
                        <span className="ml-1.5 text-xs text-gray-400">({item.countryCode})</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{partnered}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{primaryContact}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{receiptDaysText}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleToggleActive(item)}
                          title="Klik untuk toggle"
                        >
                          <Badge active={item.isActive} />
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setModal(item)}
                            className="rounded border border-gray-200 px-3 py-1 text-xs hover:bg-gray-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            disabled={deletingId === item._id}
                            className="rounded border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-40"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        page={pagination.page}
        pages={pagination.pages}
        total={pagination.total}
        onChange={(p) => load(p)}
      />

      {modal === 'add' && (
        <LocalTransshipperModal
          initial={null}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load(pagination.page) }}
        />
      )}
      {modal && modal !== 'add' && (
        <LocalTransshipperModal
          initial={modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load(pagination.page) }}
        />
      )}
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function AdminInternationalShippingPage() {
  const [tab, setTab] = useState('rates')

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pengiriman Internasional</h1>
        <p className="text-sm text-gray-500 mt-1">
          Kelola rate dan jadwal keberangkatan transhipper untuk pengiriman ikan ke luar negeri.
        </p>
      </div>

      {/* Info banner */}
      <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
        <strong>💡 Catatan:</strong> Data negara tujuan di aplikasi muncul otomatis dari rate yang
        aktif di sini. Tambahkan minimal satu rate per negara agar negara tersebut tampil di
        pilihan checkout.
      </div>

      {/* Tabs */}
      <div className="mb-5 flex border-b border-gray-200">
        {[
          { key: 'rates', label: '💰 Rate Pengiriman' },
          { key: 'schedules', label: '📅 Jadwal Keberangkatan' },
          { key: 'local', label: '🏠 Transhipper Lokal' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t.key
                ? 'border-[#FE735C] text-[#FE735C]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'rates' && <RatesTab />}
      {tab === 'schedules' && <SchedulesTab />}
      {tab === 'local' && <LocalTransshippersTab />}

    </div>
  )
}
