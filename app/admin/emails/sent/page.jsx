'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { adminFetch } from '@/lib/adminApi'

export default function AdminSentEmailsPage() {
  const [emails, setEmails] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [status, setStatus] = useState('')
  const [fromFilter, setFromFilter] = useState('')
  const [fromOptions, setFromOptions] = useState([])
  const [queryInput, setQueryInput] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    fetchEmails()
  }, [page, status, query, fromFilter])

  useEffect(() => {
    ;(async () => {
      try {
        const res = await adminFetch('/emails/admin/settings')
        setFromOptions(res?.data?.fromOptions || [])
      } catch {
        // noop
      }
    })()
  }, [])

  const fetchEmails = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page,
        limit: 20,
        ...(status && { status }),
        ...(fromFilter && { from: fromFilter }),
        ...(query && { q: query }),
      })

      const response = await adminFetch(`/emails/admin/sent?${params}`)
      setEmails(response.data?.emails || [])
      setTotalPages(response.data?.pagination?.totalPages || 1)
    } catch (err) {
      setError(err.message || 'Gagal memuat sent/outbox log')
    } finally {
      setLoading(false)
    }
  }

  const applySearch = () => {
    setPage(1)
    setQuery(queryInput.trim())
  }

  const resetSearch = () => {
    setQueryInput('')
    setQuery('')
    setStatus('')
    setFromFilter('')
    setPage(1)
  }

  const badgeClass = {
    queued: 'bg-yellow-100 text-yellow-800',
    sent: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sent / Outbox Log</h1>
          <p className="text-sm text-gray-600 mt-1">Riwayat email yang dikirim dari admin panel.</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/emails"
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Inbox
          </Link>
          <Link
            href="/admin/emails/compose"
            className="px-4 py-2 rounded-lg bg-[#008080] text-white font-medium hover:bg-[#006666]"
          >
            Tulis Email
          </Link>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cari</label>
            <input
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applySearch()}
              placeholder="To, subject, isi..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#008080]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value)
                setPage(1)
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#008080]"
            >
              <option value="">Semua Status</option>
              <option value="sent">Sent</option>
              <option value="failed">Failed</option>
              <option value="queued">Queued</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
            <select
              value={fromFilter}
              onChange={(e) => {
                setFromFilter(e.target.value)
                setPage(1)
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#008080]"
            >
              <option value="">Semua Sender</option>
              {fromOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={applySearch}
              className="px-4 py-2 rounded-lg bg-[#008080] text-white font-medium hover:bg-[#006666]"
            >
              Cari
            </button>
            <button
              onClick={resetSearch}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
        {error && <div className="p-4 bg-red-50 text-red-700 border-b border-red-200">{error}</div>}

        {loading ? (
          <div className="p-8 text-center text-gray-500">Memuat sent log...</div>
        ) : emails.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Belum ada email terkirim</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">To</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Subject</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Waktu Kirim</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tindakan</th>
                </tr>
              </thead>
              <tbody>
                {emails.map((email) => (
                  <tr key={email._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{(email.to || []).join(', ') || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 max-w-md truncate">{email.subject || '(Tanpa Subject)'}</div>
                      {!!email.errorMessage && (
                        <div className="text-xs text-red-600 mt-1 max-w-md truncate">Error: {email.errorMessage}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {email.sentAt ? new Date(email.sentAt).toLocaleString('id-ID') : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${badgeClass[email.status] || 'bg-gray-100 text-gray-700'}`}>
                        {email.status || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/emails/sent/${email._id}`}
                        className="text-[#008080] hover:text-[#006666] font-medium text-sm"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && emails.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
            <div className="text-sm text-gray-600">Halaman {page} dari {totalPages}</div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Berikutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
