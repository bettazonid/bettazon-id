'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { adminFetch } from '@/lib/adminApi'

const PREFIXES = ['', 'products/', 'avatars/', 'documents/', 'categories/', 'videos/']
const BUCKET_CDN = process.env.NEXT_PUBLIC_API_BASE_URL
  ? process.env.NEXT_PUBLIC_API_BASE_URL.replace('http://localhost:5000', 'https://bettazon.id')
  : ''

function formatBytes(bytes) {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0
  let val = bytes
  while (val >= 1024 && i < units.length - 1) { val /= 1024; i++ }
  return `${val.toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

function MediaPreview({ item, onSelect, selected }) {
  const isImg = item.type === 'image'
  const isVid = item.type === 'video'
  const [err, setErr] = useState(false)

  return (
    <div
      className={`relative border rounded-lg overflow-hidden cursor-pointer transition-all ${
        selected ? 'border-red-500 ring-2 ring-red-400' : 'border-gray-200 hover:border-gray-400'
      }`}
      onClick={() => onSelect(item.key)}
    >
      {/* Checkbox */}
      <div className="absolute top-1.5 left-1.5 z-10">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(item.key)}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 accent-red-500 cursor-pointer"
        />
      </div>

      {/* Thumbnail */}
      <div className="bg-gray-100 flex items-center justify-center" style={{ height: 120 }}>
        {isImg && !err ? (
          <img
            src={item.url}
            alt={item.key}
            className="w-full h-full object-cover"
            onError={() => setErr(true)}
          />
        ) : isVid ? (
          <div className="flex flex-col items-center gap-1 text-gray-400">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span className="text-xs">Video</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 text-gray-400">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
            <span className="text-xs">{item.type}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2 bg-white">
        <p className="text-xs text-gray-700 truncate font-mono" title={item.key}>
          {item.key.split('/').pop()}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{formatBytes(item.size)}</p>
        <p className="text-xs text-gray-400">
          {item.lastModified ? new Date(item.lastModified).toLocaleDateString('id-ID') : ''}
        </p>
      </div>
    </div>
  )
}

export default function AdminStoragePage() {
  const [prefix, setPrefix] = useState('')
  const [objects, setObjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [nextToken, setNextToken] = useState(null)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)
  const [selected, setSelected] = useState(new Set())
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [deleting, setDeleting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null) // null = bulk, 'key' = single
  const [successMsg, setSuccessMsg] = useState('')
  const [previewItem, setPreviewItem] = useState(null)

  const fetchObjects = useCallback(async (token = null, reset = true) => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({ prefix, maxKeys: 200 })
      if (token) params.set('continuationToken', token)
      const res = await adminFetch(`/api/admin/storage/list?${params}`)
      const { objects: items, isTruncated, nextContinuationToken, keyCount } = res.data
      setObjects(prev => reset ? items : [...prev, ...items])
      setHasMore(isTruncated)
      setNextToken(nextContinuationToken || null)
      if (reset) setTotal(keyCount)
      else setTotal(t => t + keyCount)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [prefix])

  useEffect(() => {
    setObjects([])
    setSelected(new Set())
    setNextToken(null)
    fetchObjects(null, true)
  }, [fetchObjects])

  const toggleSelect = (key) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selected.size === filteredObjects.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filteredObjects.map(o => o.key)))
    }
  }

  const confirmDelete = (key = null) => {
    setDeleteTarget(key) // null = hapus selected (bulk), string = hapus satu
  }

  const doDelete = async () => {
    setDeleting(true)
    setError('')
    try {
      if (deleteTarget) {
        // Single delete
        await adminFetch('/api/admin/storage/delete', {
          method: 'DELETE',
          body: JSON.stringify({ key: deleteTarget }),
        })
        setSuccessMsg('1 file berhasil dihapus')
        setObjects(prev => prev.filter(o => o.key !== deleteTarget))
        setSelected(prev => { const n = new Set(prev); n.delete(deleteTarget); return n })
      } else {
        // Bulk delete
        const keys = [...selected]
        await adminFetch('/api/admin/storage/delete-bulk', {
          method: 'DELETE',
          body: JSON.stringify({ keys }),
        })
        setSuccessMsg(`${keys.length} file berhasil dihapus`)
        setObjects(prev => prev.filter(o => !keys.includes(o.key)))
        setSelected(new Set())
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
      setTimeout(() => setSuccessMsg(''), 4000)
    }
  }

  const filteredObjects = objects.filter(o => {
    const matchSearch = !search || o.key.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'all' || o.type === typeFilter
    return matchSearch && matchType
  })

  const totalSize = filteredObjects.reduce((s, o) => s + (o.size || 0), 0)

  return (
    <div className="p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Media Bucket (Nevacloud)</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tinjau dan hapus file di storage bucket. Hati-hati: penghapusan bersifat permanen.
          </p>
        </div>
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); fetchObjects(null, true) }}
          className="text-sm text-teal-600 hover:underline flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          Refresh
        </a>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex gap-1">
          {PREFIXES.map(p => (
            <button
              key={p || 'all'}
              onClick={() => setPrefix(p)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                prefix === p
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-teal-400'
              }`}
            >
              {p || 'Semua'}
            </button>
          ))}
        </div>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="text-xs border border-gray-300 rounded px-2 py-1.5 bg-white"
        >
          <option value="all">Semua tipe</option>
          <option value="image">Gambar</option>
          <option value="video">Video</option>
          <option value="document">Dokumen</option>
          <option value="other">Lainnya</option>
        </select>
        <input
          type="text"
          placeholder="Cari nama file..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="text-xs border border-gray-300 rounded px-3 py-1.5 flex-1 min-w-48"
        />
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
        <span>
          {filteredObjects.length} file ditampilkan · Total: {formatBytes(totalSize)}
          {selected.size > 0 && (
            <span className="ml-2 text-red-600 font-medium">{selected.size} dipilih</span>
          )}
        </span>
        <div className="flex gap-2">
          <button
            onClick={toggleSelectAll}
            className="text-xs px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
          >
            {selected.size === filteredObjects.length && filteredObjects.length > 0 ? 'Batal Pilih Semua' : 'Pilih Semua'}
          </button>
          {selected.size > 0 && (
            <button
              onClick={() => confirmDelete(null)}
              className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              Hapus {selected.size} File
            </button>
          )}
        </div>
      </div>

      {/* Success / Error */}
      {successMsg && (
        <div className="mb-3 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm">{successMsg}</div>
      )}
      {error && (
        <div className="mb-3 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">{error}</div>
      )}

      {/* Grid */}
      {loading && objects.length === 0 ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <svg className="w-6 h-6 animate-spin mr-2" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
          Memuat data bucket...
        </div>
      ) : filteredObjects.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
          <p>Tidak ada file ditemukan</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          {filteredObjects.map(item => (
            <div key={item.key} className="group relative">
              <MediaPreview
                item={item}
                selected={selected.has(item.key)}
                onSelect={toggleSelect}
              />
              {/* Row actions */}
              <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  title="Preview / Buka"
                  onClick={() => setPreviewItem(item)}
                  className="w-6 h-6 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow text-gray-600 hover:text-teal-600"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                </button>
                <button
                  title="Hapus file ini"
                  onClick={() => confirmDelete(item.key)}
                  className="w-6 h-6 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow text-gray-600 hover:text-red-600"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load more */}
      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={() => fetchObjects(nextToken, false)}
            disabled={loading}
            className="px-6 py-2 border border-teal-600 text-teal-600 rounded-lg text-sm hover:bg-teal-50 disabled:opacity-50"
          >
            {loading ? 'Memuat...' : 'Muat Lebih Banyak'}
          </button>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {(deleteTarget !== undefined) && (deleteTarget !== null || selected.size > 0) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
              </div>
              <h3 className="font-semibold text-gray-800">Konfirmasi Hapus</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              {deleteTarget
                ? <>Hapus file <span className="font-mono text-xs bg-gray-100 px-1 rounded">{deleteTarget.split('/').pop()}</span>?</>
                : <>Hapus <strong>{selected.size} file</strong> yang dipilih?</>
              }
            </p>
            <p className="text-xs text-red-500 mb-5">Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(undefined)}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={doDelete}
                disabled={deleting}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {deleting && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>}
                {deleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="relative bg-white rounded-xl overflow-hidden shadow-2xl max-w-2xl w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <p className="text-sm font-mono text-gray-700 truncate max-w-xs">{previewItem.key}</p>
              <div className="flex gap-2 items-center">
                <a
                  href={previewItem.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-teal-600 hover:underline"
                >
                  Buka URL
                </a>
                <button onClick={() => setPreviewItem(null)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>
            <div className="p-4 flex items-center justify-center bg-gray-50" style={{ minHeight: 300 }}>
              {previewItem.type === 'image' ? (
                <img src={previewItem.url} alt={previewItem.key} className="max-h-96 object-contain rounded" />
              ) : previewItem.type === 'video' ? (
                <video src={previewItem.url} controls className="max-h-96 w-full rounded" />
              ) : (
                <div className="text-center text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                  <p className="text-sm">Preview tidak tersedia untuk tipe file ini</p>
                  <a href={previewItem.url} target="_blank" rel="noreferrer" className="text-teal-600 text-sm hover:underline mt-2 inline-block">Buka file</a>
                </div>
              )}
            </div>
            <div className="px-4 py-3 border-t grid grid-cols-3 gap-4 text-xs text-gray-500">
              <div><p className="font-medium text-gray-700">Ukuran</p><p>{formatBytes(previewItem.size)}</p></div>
              <div><p className="font-medium text-gray-700">Tipe</p><p>{previewItem.type}</p></div>
              <div><p className="font-medium text-gray-700">Diubah</p><p>{previewItem.lastModified ? new Date(previewItem.lastModified).toLocaleDateString('id-ID') : '-'}</p></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
