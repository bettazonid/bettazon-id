'use client'

import { useEffect, useState, useCallback } from 'react'
import { adminFetch } from '@/lib/adminApi'

export default function WhatsAppQRPage() {
  const [status, setStatus] = useState(null) // null = loading, { connected, hasQr, qrBase64 }
  const [error, setError] = useState(null)
  const [lastRefresh, setLastRefresh] = useState(null)
  const [resetting, setResetting] = useState(false)
  const [resetMsg, setResetMsg] = useState(null)

  const fetchStatus = useCallback(async () => {
    try {
      const data = await adminFetch('/api/admin/whatsapp/qr/json')
      setStatus(data)
      setLastRefresh(new Date())
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }, [])

  const handleReset = useCallback(async () => {
    setResetting(true)
    setResetMsg(null)
    try {
      const data = await adminFetch('/api/admin/whatsapp/reset', { method: 'POST' })
      setResetMsg(data?.message?.id ?? 'Sesi direset. Tunggu beberapa detik...')
      // Start polling aggressively after reset to catch the new QR fast
      setTimeout(fetchStatus, 3000)
      setTimeout(fetchStatus, 6000)
      setTimeout(fetchStatus, 10000)
    } catch (err) {
      setResetMsg(`Gagal reset: ${err.message}`)
    } finally {
      setResetting(false)
    }
  }, [fetchStatus])

  useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

  useEffect(() => {
    if (status?.connected) return
    // Poll setiap 10 detik saat menunggu QR, 15 detik jika QR sudah tampil
    const interval = setInterval(fetchStatus, status?.hasQr ? 15000 : 10000)
    return () => clearInterval(interval)
  }, [fetchStatus, status?.connected, status?.hasQr])

  const reasonLabel = {
    loggedOut: '🔓 Sesi logout — nomor di-unlink dari perangkat.',
    badSession: '⚠ Sesi rusak / korup.',
    forbidden: '🚫 Akun dibatasi oleh WhatsApp.',
    connectionReplaced: 'ℹ Koneksi digantikan instance lain.',
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-1">WhatsApp OTP</h1>
      <p className="text-sm text-gray-500 mb-6">
        Kelola koneksi WhatsApp untuk pengiriman OTP ke pengguna.
      </p>

      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            ⚠ {error}
          </div>
        )}

        {resetMsg && (
          <div className="mb-4 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-700">
            {resetMsg}
          </div>
        )}

        {!status && !error && (
          <div className="py-12 text-gray-400 text-sm">
            <div className="animate-spin w-8 h-8 border-2 border-[#FE735C] border-t-transparent rounded-full mx-auto mb-3" />
            Memeriksa status WhatsApp...
          </div>
        )}

        {status?.connected && (
          <div className="py-8">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✅</span>
            </div>
            <h2 className="text-lg font-semibold text-green-700 mb-1">WhatsApp Terhubung</h2>
            <p className="text-sm text-gray-500">Sesi aktif — OTP siap dikirim ke pengguna.</p>
            <div className="mt-4 flex gap-2 justify-center">
              <button
                onClick={fetchStatus}
                className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Cek Ulang Status
              </button>
              <button
                onClick={handleReset}
                disabled={resetting}
                className="px-4 py-2 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                {resetting ? 'Mereset...' : 'Reset Sesi'}
              </button>
            </div>
          </div>
        )}

        {status && !status.connected && !status.hasQr && (
          <div className="py-8">
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⏳</span>
            </div>
            <h2 className="text-lg font-semibold text-yellow-700 mb-1">QR Belum Tersedia</h2>
            {status.lastDisconnectReason && (
              <p className="text-sm text-orange-600 mb-2">
                {reasonLabel[status.lastDisconnectReason] ?? `Putus: ${status.lastDisconnectReason}`}
              </p>
            )}
            <p className="text-sm text-gray-500 mb-4">
              {status.isConnecting
                ? 'Sedang menghubungkan kembali, QR akan muncul sebentar lagi...'
                : 'WhatsApp service sedang memuat. Halaman akan otomatis refresh setiap 10 detik.'}
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={fetchStatus}
                className="px-4 py-2 text-sm rounded-lg bg-[#FE735C] text-white hover:bg-[#e65a43] transition-colors"
              >
                Refresh Sekarang
              </button>
              <button
                onClick={handleReset}
                disabled={resetting}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {resetting ? 'Mereset...' : '🔄 Reset & Scan Ulang'}
              </button>
            </div>
          </div>
        )}

        {status?.hasQr && status.qrBase64 && (
          <div className="py-4">
            <h2 className="text-lg font-semibold mb-2">📱 Scan QR WhatsApp</h2>
            <p className="text-sm text-gray-500 mb-4">
              Buka WhatsApp → <strong>Perangkat Tertaut</strong> → <strong>Tautkan Perangkat</strong>
            </p>
            <div className="inline-block border-2 border-gray-200 rounded-xl p-2 mb-4">
              <img
                src={`data:image/png;base64,${status.qrBase64}`}
                alt="WhatsApp QR Code"
                className="w-64 h-64"
              />
            </div>
            <p className="text-xs text-gray-400">
              QR expired setiap ~20 detik. Halaman auto-refresh tiap 15 detik.
            </p>
            <div className="mt-4 flex gap-2 justify-center">
              <button
                onClick={fetchStatus}
                className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Refresh QR
              </button>
              <button
                onClick={handleReset}
                disabled={resetting}
                className="px-4 py-2 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                {resetting ? 'Mereset...' : '🔄 Generate QR Baru'}
              </button>
            </div>
          </div>
        )}

        {lastRefresh && (
          <p className="text-xs text-gray-300 mt-4">
            Terakhir dicek: {lastRefresh.toLocaleTimeString('id-ID')}
          </p>
        )}
      </div>
    </div>
  )
}
