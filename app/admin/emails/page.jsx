'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { adminFetch } from '@/lib/adminApi'

export default function AdminEmailsPage() {
  const [emails, setEmails] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [status, setStatus] = useState('')
  const [toFilter, setToFilter] = useState('')
  const [inboxAddresses, setInboxAddresses] = useState([])
  const [queryInput, setQueryInput] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    fetchEmails()
  }, [page, status, query, toFilter])

  useEffect(() => {
    ;(async () => {
      try {
        const res = await adminFetch('/emails/admin/settings')
        setInboxAddresses(res?.data?.inboxAddresses || [])
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
        ...(toFilter && { to: toFilter }),
        ...(query && { q: query }),
      })

      const response = await adminFetch(`/emails/admin/inbox?${params}`)
      setEmails(response.data?.emails || [])
      setTotalPages(response.data?.pagination?.totalPages || 1)
    } catch (err) {
      setError(err.message || 'Gagal memuat inbox email')
    } finally {
      setLoading(false)
    }
  }

  const markStatus = async (id, nextStatus) => {
    try {
      await adminFetch(`/emails/admin/inbox/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      })
      setEmails((prev) => prev.map((e) => (e._id === id ? { ...e, status: nextStatus } : e)))
    } catch (err) {
      alert(err.message || 'Gagal update status email')
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
    setToFilter('')
    setPage(1)
  }

  const badgeClass = {
    unread: 'bg-yellow-100 text-yellow-800',
    read: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-700',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inbox Email Admin</h1>
        <p className="text-sm text-gray-600 mt-1">Terima dan kelola email masuk dari webhook Resend.</p>
        <div className="mt-3 flex gap-2">
          <Link
            href="/admin/emails/compose"
            className="inline-flex px-4 py-2 rounded-lg bg-[#008080] text-white font-medium hover:bg-[#006666]"
          >
            Tulis Email Baru
          </Link>
          <Link
            href="/admin/emails/sent"
            className="inline-flex px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
          >
            Lihat Sent/Outbox
          </Link>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cari Email</label>
            <input
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applySearch()}
              placeholder="From, subject, isi..."
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
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Inbox Ke</label>
            <select
              value={toFilter}
              onChange={(e) => {
                setToFilter(e.target.value)
                setPage(1)
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#008080]"
            >
              <option value="">Semua Alamat Inbox</option>
              {inboxAddresses.map((addr) => (
                <option key={addr} value={addr}>
                  {addr}
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
          <div className="p-8 text-center text-gray-500">Memuat inbox email...</div>
        ) : emails.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Belum ada email masuk</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">From</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Subject</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Diterima</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tindakan</th>
                </tr>
              </thead>
              <tbody>
                {emails.map((email) => (
                  <tr key={email._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{email.from || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 max-w-md truncate">{email.subject || '(Tanpa Subject)'}</div>
                      <div className="text-xs text-gray-500 mt-1 max-w-md truncate">{email.text || '-'}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {email.receivedAt
                        ? new Date(email.receivedAt).toLocaleString('id-ID')
                        : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${badgeClass[email.status] || 'bg-gray-100 text-gray-700'}`}>
                        {email.status || 'unread'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/emails/${email._id}`}
                          className="text-[#008080] hover:text-[#006666] font-medium text-sm"
                        >
                          Buka
                        </Link>
                        {email.status !== 'read' && (
                          <button
                            onClick={() => markStatus(email._id, 'read')}
                            className="text-green-700 hover:text-green-800 text-sm"
                          >
                            Tandai Read
                          </button>
                        )}
                        {email.status !== 'archived' && (
                          <button
                            onClick={() => markStatus(email._id, 'archived')}
                            className="text-gray-700 hover:text-gray-900 text-sm"
                          >
                            Arsipkan
                          </button>
                        )}
                      </div>
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
