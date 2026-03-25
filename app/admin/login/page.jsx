'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminLogin, setAdminToken } from '@/lib/adminApi'

export default function AdminLoginPage() {
  const router = useRouter()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const isEmail = identifier.includes('@')
      const payload = {
        password,
        platform: 'web_app',
        ...(isEmail ? { email: identifier } : { phone: identifier }),
      }

      const result = await adminLogin(payload)
      const accessToken = result?.data?.tokens?.accessToken
      const user = result?.data?.user

      if (!accessToken) {
        throw new Error('Token admin tidak ditemukan di response')
      }

      setAdminToken(accessToken)
      localStorage.setItem('admin_user', JSON.stringify(user || {}))
      router.replace('/admin/dashboard')
    } catch (err) {
      setError(err.message || 'Login admin gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-orange-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Login Admin</h1>
        <p className="text-sm text-gray-500 mb-6">Masuk ke panel internal Bettazon</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email atau Nomor HP</label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#008080]/40"
              placeholder="admin@bettazon.id atau 08xxxx"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FE735C]/40"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#FE735C] hover:bg-[#e5634d] disabled:opacity-60 text-white font-semibold px-4 py-2"
          >
            {loading ? 'Memproses...' : 'Masuk Admin'}
          </button>
        </form>
      </div>
    </div>
  )
}
