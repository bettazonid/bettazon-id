'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { adminFetch } from '@/lib/adminApi'

export default function AdminEmailDetailPage() {
  const params = useParams()
  const [email, setEmail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (params?.id) fetchDetail()
  }, [params?.id])

  const fetchDetail = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await adminFetch(`/emails/admin/inbox/${params.id}`)
      setEmail(response.data || null)

      if (response.data?.status !== 'read') {
        await adminFetch(`/emails/admin/inbox/${params.id}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'read' }),
        })
      }
    } catch (err) {
      setError(err.message || 'Gagal memuat detail email')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-gray-600">Memuat detail email...</div>
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {error}
      </div>
    )
  }

  if (!email) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
        Email tidak ditemukan
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Detail Email Masuk</h1>
        <Link
          href="/admin/emails"
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Kembali ke Inbox
        </Link>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
        <div>
          <p className="text-sm text-gray-600">From</p>
          <p className="font-medium text-gray-900 break-all">{email.from || '-'}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600">To</p>
          <p className="font-medium text-gray-900 break-all">{(email.to || []).join(', ') || '-'}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Subject</p>
          <p className="font-medium text-gray-900">{email.subject || '(Tanpa Subject)'}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Diterima</p>
          <p className="font-medium text-gray-900">
            {email.receivedAt ? new Date(email.receivedAt).toLocaleString('id-ID') : '-'}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-2">Isi Email (Text)</p>
          <pre className="rounded-lg bg-gray-50 border border-gray-200 p-4 text-sm text-gray-800 whitespace-pre-wrap break-words">
            {email.text || '(Tidak ada konten text)'}
          </pre>
        </div>

        {!email.text && email.html ? (
          <div>
            <p className="text-sm text-gray-600 mb-2">Isi Email (HTML)</p>
            <div
              className="rounded-lg bg-gray-50 border border-gray-200 p-4 text-sm text-gray-800 break-words"
              dangerouslySetInnerHTML={{ __html: email.html }}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}
