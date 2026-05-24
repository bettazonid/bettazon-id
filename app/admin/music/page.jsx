'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { adminFetch } from '@/lib/adminApi'

const CATEGORY_LABELS = {
  ambient: 'Ambient',
  upbeat: 'Upbeat',
  relaxing: 'Relaxing',
  nature: 'Nature',
  other: 'Lainnya',
}

function formatDuration(sec) {
  if (!sec) return '-'
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

// ── Track Row ─────────────────────────────────────────────────────────────────
function TrackRow({ track, onToggle, onDelete, onPlay }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          {track.coverUrl ? (
            <img src={track.coverUrl} alt={track.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg shrink-0">🎵</div>
          )}
          <div>
            <p className="font-medium text-gray-900 text-sm">{track.title}</p>
            <p className="text-xs text-gray-500">{track.artist || '-'}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{CATEGORY_LABELS[track.category] || track.category}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{formatDuration(track.durationSec)}</td>
      <td className="px-4 py-3 text-sm text-gray-500">{track.licenseType}</td>
      <td className="px-4 py-3">
        <button
          onClick={() => onToggle(track._id, !track.isEnabled)}
          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
            track.isEnabled
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          {track.isEnabled ? '✔ Aktif' : '✕ Nonaktif'}
        </button>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPlay(track.fileUrl)}
            className="text-[#008080] hover:text-[#006666] text-sm font-medium"
            title="Preview"
          >
            ▶
          </button>
          <button
            onClick={() => onDelete(track._id, track.title)}
            className="text-red-400 hover:text-red-600 text-sm"
            title="Hapus"
          >
            🗑
          </button>
        </div>
      </td>
    </tr>
  )
}

// ── Upload Modal ──────────────────────────────────────────────────────────────
function UploadModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: '', artist: '', category: 'ambient', durationSec: '',
    licenseType: 'CC0', licenseSource: '', order: '0',
  })
  const [audioFile, setAudioFile] = useState(null)
  const [coverFile, setCoverFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!audioFile) { setError('File audio wajib diunggah'); return }
    if (!form.title.trim()) { setError('Judul wajib diisi'); return }

    setLoading(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('audio', audioFile)
      if (coverFile) fd.append('cover', coverFile)
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))

      const token = localStorage.getItem('admin_token')
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'
      const res = await fetch(`${base}/api/music/admin`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.message?.id || data?.message?.en || 'Upload gagal')
      }
      const data = await res.json()
      onSuccess(data.data)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 text-lg">Upload Track Musik</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm">{error}</div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Judul *</label>
              <input
                value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Nama lagu"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Artis</label>
              <input
                value={form.artist} onChange={e => setForm(f => ({ ...f, artist: e.target.value }))}
                placeholder="Nama artis"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Kategori</label>
              <select
                value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]/30"
              >
                {Object.entries(CATEGORY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Durasi (detik)</label>
              <input
                type="number" value={form.durationSec} onChange={e => setForm(f => ({ ...f, durationSec: e.target.value }))}
                placeholder="e.g. 180"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Lisensi</label>
              <select
                value={form.licenseType} onChange={e => setForm(f => ({ ...f, licenseType: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]/30"
              >
                <option value="CC0">CC0</option>
                <option value="CC-BY">CC-BY</option>
                <option value="royalty-free">Royalty-Free</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Sumber Lisensi</label>
              <input
                value={form.licenseSource} onChange={e => setForm(f => ({ ...f, licenseSource: e.target.value }))}
                placeholder="e.g. pixabay.com/music/..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">File Audio * (MP3/OGG, maks 20MB)</label>
            <input
              type="file" accept="audio/*"
              onChange={e => setAudioFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#008080]/10 file:text-[#008080] hover:file:bg-[#008080]/20 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Cover Gambar (opsional)</label>
            <input
              type="file" accept="image/*"
              onChange={e => setCoverFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-600 hover:file:bg-gray-200 cursor-pointer"
            />
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
            {loading ? 'Mengupload...' : 'Upload Track'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function MusicCatalogPage() {
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showUpload, setShowUpload] = useState(false)
  const [playingUrl, setPlayingUrl] = useState(null)
  const audioRef = useRef(null)

  const loadTracks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await adminFetch('/api/music/admin')
      setTracks(data.data || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadTracks() }, [loadTracks])

  // Audio preview
  function handlePlay(url) {
    if (playingUrl === url) {
      audioRef.current?.pause()
      setPlayingUrl(null)
      return
    }
    setPlayingUrl(url)
    if (audioRef.current) {
      audioRef.current.src = url
      audioRef.current.play().catch(() => {})
    }
  }

  async function handleToggle(id, isEnabled) {
    try {
      await adminFetch(`/api/music/admin/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isEnabled }),
      })
      setTracks(prev => prev.map(t => t._id === id ? { ...t, isEnabled } : t))
    } catch (e) {
      alert('Gagal memperbarui: ' + e.message)
    }
  }

  async function handleDelete(id, title) {
    if (!confirm(`Hapus track "${title}"? Tindakan ini tidak dapat dibatalkan.`)) return
    try {
      await adminFetch(`/api/music/admin/${id}`, { method: 'DELETE' })
      setTracks(prev => prev.filter(t => t._id !== id))
    } catch (e) {
      alert('Gagal menghapus: ' + e.message)
    }
  }

  function handleUploadSuccess(newTrack) {
    setTracks(prev => [newTrack, ...prev])
  }

  const enabledCount = tracks.filter(t => t.isEnabled).length

  return (
    <div className="space-y-6">
      {/* Hidden audio element for preview */}
      <audio ref={audioRef} onEnded={() => setPlayingUrl(null)} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">🎵 Katalog Musik Ambience</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Musik royalty-free untuk live streaming seller · {enabledCount} track aktif
          </p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="px-4 py-2 bg-[#008080] text-white rounded-lg text-sm font-medium hover:bg-[#006666] transition-colors"
        >
          + Upload Track
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm flex items-center gap-2">
          <span>⚠️ {error}</span>
          <button onClick={loadTracks} className="ml-auto underline text-xs">Coba lagi</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#008080]" />
          </div>
        ) : tracks.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🎵</p>
            <p className="font-medium">Belum ada musik</p>
            <p className="text-sm mt-1">Upload track pertama untuk seller</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Track</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Kategori</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Durasi</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Lisensi</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tracks.map(track => (
                  <TrackRow
                    key={track._id}
                    track={track}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    onPlay={handlePlay}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </div>
  )
}
