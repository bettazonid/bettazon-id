'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { adminFetch } from '@/lib/adminApi'

export default function AdminComposeEmailPage() {
  const [to, setTo] = useState('')
  const [from, setFrom] = useState('')
  const [fromOptions, setFromOptions] = useState([])
  const [inboxAddresses, setInboxAddresses] = useState([])
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await adminFetch('/emails/admin/settings')
        const settings = res?.data || {}
        const options = settings.fromOptions || []
        setFromOptions(options)
        setInboxAddresses(settings.inboxAddresses || [])
        setFrom(settings.defaultFrom || options[0] || '')
      } catch {
        // keep default empty, backend will validate if needed
      }
    })()
  }, [])

  const handleSend = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      await adminFetch('/emails/admin/send', {
        method: 'POST',
        body: JSON.stringify({
          from,
          to,
          subject,
          text: message,
        }),
      })

      setSuccess('Email berhasil dikirim')
      setMessage('')
    } catch (err) {
      setError(err.message || 'Gagal mengirim email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tulis Email</h1>
          <p className="text-sm text-gray-600 mt-1">Kirim email custom dari admin panel Bettazon.</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/emails"
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Kembali ke Inbox
          </Link>
          <Link
            href="/admin/emails/sent"
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Sent/Outbox
          </Link>
        </div>
      </div>

      <form onSubmit={handleSend} className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Dari</label>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#008080]"
          >
            {fromOptions.length === 0 ? (
              <option value="">Default sender</option>
            ) : (
              fromOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))
            )}
          </select>
          {inboxAddresses.length > 0 && (
            <p className="mt-2 text-xs text-gray-500">
              Inbox dipantau: {inboxAddresses.join(', ')}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Kepada</label>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="email1@domain.com, email2@domain.com"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#008080]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subjek</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#008080]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Isi Email</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={10}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#008080]"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-[#008080] text-white font-medium hover:bg-[#006666] disabled:opacity-50"
          >
            {loading ? 'Mengirim...' : 'Kirim Email'}
          </button>
        </div>
      </form>
    </div>
  )
}
