'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { adminFetch, adminUpload, ADMIN_HEALING_UPLOAD } from '@/lib/adminApi'
import HealingProductPicker from '@/components/admin/HealingProductPicker'
const CATEGORY_LABELS = {
  aquascape: 'Aquascape',
  aquarium: 'Aquarium',
  koi_pond: 'Koi Pond',
  shrimp_tank: 'Shrimp Tank',
  office_setup: 'Office Setup',
  night_scene: 'Night Scene',
}

const STATUS_LABELS = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Arsip',
}

const STATUS_STYLE = {
  draft: 'bg-gray-100 text-gray-600',
  published: 'bg-green-100 text-green-700',
  archived: 'bg-orange-100 text-orange-700',
}

const EMPTY_FORM = {
  title: '',
  description: '',
  category: 'aquascape',
  thumbnailUrl: '',
  mediaUrl: '',
  thumbnailKey: '',
  mediaKey: '',
  backgroundAudioUrl: '',
  relatedProductIds: [],
  isFeatured: false,
  status: 'draft',
  sortOrder: '0',
}

function normalizeRelatedProductIds(value) {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean)
  }
  if (typeof value === 'string' && value.trim()) {
    return value
      .split(/[,\s]+/)
      .map((v) => v.trim())
      .filter(Boolean)
  }
  return []
}
function formatBytes(bytes) {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0
  let val = bytes
  while (val >= 1024 && i < units.length - 1) { val /= 1024; i++ }
  return `${val.toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

function ItemFormModal({ item, onClose, onSuccess }) {
  const isEdit = Boolean(item?.id)
  const thumbnailInputRef = useRef(null)
  const videoInputRef = useRef(null)
  const [form, setForm] = useState(() =>
    item
      ? {
          title: item.title || '',
          description: item.description || '',
          category: item.category || 'aquascape',
          thumbnailUrl: item.thumbnailUrl || '',
          mediaUrl: item.mediaUrl || '',
          thumbnailKey: item.thumbnailKey || '',
          mediaKey: item.mediaKey || '',
          backgroundAudioUrl: item.backgroundAudioUrl || '',
          relatedProductIds: normalizeRelatedProductIds(item.relatedProductIds),
          isFeatured: Boolean(item.isFeatured),
          status: item.status || 'draft',
          sortOrder: String(item.sortOrder ?? 0),
        }
      : { ...EMPTY_FORM }
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)
  const [videoMeta, setVideoMeta] = useState(null)
  const [showManualUrls, setShowManualUrls] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Judul wajib diisi')
      return
    }
    if (form.status === 'published') {
      if (!form.thumbnailUrl.trim()) {
        setError('Thumbnail wajib diupload atau diisi URL sebelum publish')
        return
      }
      if (!form.mediaUrl.trim()) {
        setError('Video wajib diupload atau diisi URL sebelum publish')
        return
      }
    }
    if (uploadingThumbnail || uploadingVideo) {
      setError('Tunggu upload selesai sebelum menyimpan')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const body = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        category: form.category,
        thumbnailUrl: form.thumbnailUrl.trim() || null,
        mediaUrl: form.mediaUrl.trim() || null,
        thumbnailKey: form.thumbnailKey || null,
        mediaKey: form.mediaKey || null,
        backgroundAudioUrl: form.backgroundAudioUrl.trim() || null,
        relatedProductIds: normalizeRelatedProductIds(form.relatedProductIds),
        isFeatured: form.isFeatured,
        status: form.status,
        sortOrder: parseInt(form.sortOrder, 10) || 0,
      }

      const result = isEdit
        ? await adminFetch(`/api/healing/admin/items/${item.id}`, {
            method: 'PATCH',
            body: JSON.stringify(body),
          })
        : await adminFetch('/api/healing/admin/items', {
            method: 'POST',
            body: JSON.stringify(body),
          })

      onSuccess(result.data?.item)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleThumbnailUpload(file) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Format thumbnail tidak valid. Gunakan JPG, PNG, atau WebP')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Thumbnail terlalu besar. Maksimal 5 MB')
      return
    }

    setUploadingThumbnail(true)
    setError(null)
    try {
      const result = await adminUpload(ADMIN_HEALING_UPLOAD.thumbnail, 'thumbnail', file)
      const url = result.data?.thumbnailUrl || result.data?.url
      setForm((f) => ({ ...f, thumbnailUrl: url || f.thumbnailUrl, thumbnailKey: result.data?.thumbnailKey || f.thumbnailKey }))
    } catch (err) {
      setError(err.message)
    } finally {
      setUploadingThumbnail(false)
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = ''
    }
  }

  async function handleVideoUpload(file) {
    if (!file) return
    if (file.type !== 'video/mp4') {
      setError('Format video tidak valid. Gunakan MP4')
      return
    }
    if (file.size > 100 * 1024 * 1024) {
      setError('Video terlalu besar. Maksimal 100 MB')
      return
    }

    setUploadingVideo(true)
    setVideoProgress(0)
    setError(null)
    try {
      const result = await adminUpload(ADMIN_HEALING_UPLOAD.video, 'video', file, {
        onProgress: setVideoProgress,
      })
      const url = result.data?.mediaUrl || result.data?.url
      setForm((f) => ({
        ...f,
        mediaUrl: url || f.mediaUrl,
        mediaKey: result.data?.mediaKey || f.mediaKey,
      }))
      setVideoMeta({
        fileName: result.data?.fileName || file.name,
        fileSizeBytes: result.data?.fileSizeBytes || file.size,
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setUploadingVideo(false)
      setVideoProgress(0)
      if (videoInputRef.current) videoInputRef.current.value = ''
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col max-h-[90vh]">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 text-lg">
            {isEdit ? 'Edit Konten Healing' : 'Tambah Konten Healing'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm">{error}</div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Judul *</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]/30"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Kategori *</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]/30"
              >
                {Object.entries(CATEGORY_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]/30"
              >
                {Object.entries(STATUS_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-4 space-y-3">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">Thumbnail</label>
            {form.thumbnailUrl ? (
              <img
                src={form.thumbnailUrl}
                alt="Thumbnail preview"
                className="w-full h-36 object-cover rounded-lg border border-gray-100"
              />
            ) : (
              <div className="w-full h-36 rounded-lg border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-sm text-gray-400">
                Belum ada thumbnail
              </div>
            )}
            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleThumbnailUpload(e.target.files?.[0])}
            />
            <button
              type="button"
              disabled={uploadingThumbnail}
              onClick={() => thumbnailInputRef.current?.click()}
              className="px-3 py-2 rounded-lg bg-[#008080]/10 text-[#008080] text-sm font-medium hover:bg-[#008080]/20 disabled:opacity-50"
            >
              {uploadingThumbnail ? 'Mengupload thumbnail...' : form.thumbnailUrl ? 'Ganti Thumbnail' : 'Upload Thumbnail'}
            </button>
          </div>

          <div className="rounded-xl border border-gray-200 p-4 space-y-3">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">Video</label>
            {form.mediaUrl ? (
              <div className="rounded-lg border border-gray-100 overflow-hidden bg-black">
                <video src={form.mediaUrl} className="w-full h-40 object-contain bg-black" controls muted />
              </div>
            ) : (
              <div className="w-full h-40 rounded-lg border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-sm text-gray-400">
                Belum ada video
              </div>
            )}
            {(videoMeta?.fileName || form.mediaUrl) && (
              <div className="text-xs text-gray-500 space-y-1">
                {videoMeta?.fileName && <p>📁 {videoMeta.fileName}</p>}
                {videoMeta?.fileSizeBytes && <p>{formatBytes(videoMeta.fileSizeBytes)}</p>}
                {!videoMeta?.fileName && form.mediaUrl && (
                  <p className="truncate">{form.mediaUrl}</p>
                )}
              </div>
            )}
            {uploadingVideo && (
              <div className="space-y-1">
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full bg-[#008080] transition-all duration-200"
                    style={{ width: `${Math.round(videoProgress * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">Mengupload video... {Math.round(videoProgress * 100)}%</p>
              </div>
            )}
            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4"
              className="hidden"
              onChange={(e) => handleVideoUpload(e.target.files?.[0])}
            />
            <button
              type="button"
              disabled={uploadingVideo}
              onClick={() => videoInputRef.current?.click()}
              className="px-3 py-2 rounded-lg bg-[#008080]/10 text-[#008080] text-sm font-medium hover:bg-[#008080]/20 disabled:opacity-50"
            >
              {uploadingVideo ? 'Mengupload video...' : form.mediaUrl ? 'Ganti Video' : 'Upload Video'}
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Background Audio URL (opsional)</label>
            <input
              value={form.backgroundAudioUrl}
              onChange={(e) => setForm((f) => ({ ...f, backgroundAudioUrl: e.target.value }))}
              placeholder="https://cdn.../ambient.mp3"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]/30"
            />
            <p className="mt-1 text-xs text-gray-400">
              Audio tenang diputar bersamaan dengan video di app. Kosongkan jika tidak diperlukan.
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowManualUrls((v) => !v)}
              className="text-xs text-gray-500 hover:text-[#008080] underline"
            >
              {showManualUrls ? 'Sembunyikan input URL manual' : 'Atau paste URL manual'}
            </button>
          </div>

          {showManualUrls && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Thumbnail URL</label>
                <input
                  value={form.thumbnailUrl}
                  onChange={(e) => setForm((f) => ({ ...f, thumbnailUrl: e.target.value }))}
                  placeholder="https://cdn.../thumb.webp"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Media URL (MP4)</label>
                <input
                  value={form.mediaUrl}
                  onChange={(e) => setForm((f) => ({ ...f, mediaUrl: e.target.value }))}
                  placeholder="https://cdn.../video.mp4"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]/30"
                />
              </div>
            </>
          )}

          <HealingProductPicker
            value={form.relatedProductIds}
            onChange={(ids) => setForm((f) => ({ ...f, relatedProductIds: ids }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Urutan (sortOrder)</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]/30"
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
                  className="rounded border-gray-300 text-[#008080] focus:ring-[#008080]"
                />
                Featured (Home row)
              </label>
            </div>
          </div>
        </form>

        <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-[#008080] text-white text-sm font-medium hover:bg-[#006666] disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Buat Konten'}
          </button>
        </div>
      </div>
    </div>
  )
}

function ItemRow({ item, onEdit, onPublish, onArchive, onDelete, onToggleFeatured }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          {item.thumbnailUrl ? (
            <img src={item.thumbnailUrl} alt={item.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg shrink-0">🌿</div>
          )}
          <div>
            <p className="font-medium text-gray-900 text-sm">{item.title}</p>
            <p className="text-xs text-gray-400 font-mono">{item.id}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{CATEGORY_LABELS[item.category] || item.category}</td>
      <td className="px-4 py-3">
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[item.status] || STATUS_STYLE.draft}`}>
          {STATUS_LABELS[item.status] || item.status}
        </span>
      </td>
      <td className="px-4 py-3">
        <button
          onClick={() => onToggleFeatured(item)}
          disabled={item.status !== 'published'}
          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors disabled:opacity-40 ${
            item.isFeatured ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          {item.isFeatured ? '⭐ Featured' : '☆ Non-featured'}
        </button>
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">{item.sortOrder}</td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => onEdit(item)} className="text-[#008080] hover:text-[#006666] text-sm font-medium">Edit</button>
          {item.status !== 'published' && (
            <button onClick={() => onPublish(item)} className="text-green-600 hover:text-green-800 text-sm">Publish</button>
          )}
          {item.status === 'published' && (
            <button onClick={() => onArchive(item)} className="text-orange-600 hover:text-orange-800 text-sm">Archive</button>
          )}
          <button onClick={() => onDelete(item)} className="text-red-400 hover:text-red-600 text-sm">Hapus</button>
        </div>
      </td>
    </tr>
  )
}

export default function HealingContentPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const loadItems = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await adminFetch('/api/healing/admin/items')
      setItems(data.data?.items || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadItems() }, [loadItems])

  function handleFormSuccess(saved) {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === saved.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = saved
        return next
      }
      return [saved, ...prev]
    })
  }

  async function patchStatus(item, status) {
    try {
      const data = await adminFetch(`/api/healing/admin/items/${item.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
      setItems((prev) => prev.map((i) => (i.id === item.id ? data.data.item : i)))
    } catch (e) {
      alert(`Gagal: ${e.message}`)
    }
  }

  async function handleToggleFeatured(item) {
    try {
      const data = await adminFetch(`/api/healing/admin/items/${item.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isFeatured: !item.isFeatured }),
      })
      setItems((prev) => prev.map((i) => (i.id === item.id ? data.data.item : i)))
    } catch (e) {
      alert(`Gagal: ${e.message}`)
    }
  }

  async function handleDelete(item) {
    if (!confirm(`Hapus "${item.title}"? Konten akan disembunyikan dari app.`)) return
    try {
      await adminFetch(`/api/healing/admin/items/${item.id}`, { method: 'DELETE' })
      setItems((prev) => prev.filter((i) => i.id !== item.id))
    } catch (e) {
      alert(`Gagal: ${e.message}`)
    }
  }

  const publishedCount = items.filter((i) => i.status === 'published').length
  const featuredCount = items.filter((i) => i.isFeatured).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">🌿 Healing Content</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Kurasi konten aquatik tenang · {publishedCount} published · {featuredCount} featured
          </p>
        </div>
        <button
          onClick={() => { setEditingItem(null); setShowForm(true) }}
          className="px-4 py-2 bg-[#008080] text-white rounded-lg text-sm font-medium hover:bg-[#006666] transition-colors"
        >
          + Tambah Konten
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm flex items-center gap-2">
          <span>⚠️ {error}</span>
          <button onClick={loadItems} className="ml-auto underline text-xs">Coba lagi</button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#008080]" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🌿</p>
            <p>Belum ada konten healing.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Konten</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Kategori</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Featured</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Urutan</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    onEdit={(row) => { setEditingItem(row); setShowForm(true) }}
                    onPublish={(row) => patchStatus(row, 'published')}
                    onArchive={(row) => patchStatus(row, 'archived')}
                    onDelete={handleDelete}
                    onToggleFeatured={handleToggleFeatured}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <ItemFormModal
          item={editingItem}
          onClose={() => { setShowForm(false); setEditingItem(null) }}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  )
}
