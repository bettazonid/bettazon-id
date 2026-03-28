'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { adminFetch } from '@/lib/adminApi'

const CRON_DESCRIPTION = {
  expireOldProducts: 'Expire produk lama (per jam)',
  cleanupOldNotifications: 'Bersihkan notifikasi lama (harian)',
  autoHideChats: 'Auto-hide chat sesuai retention',
  deleteExpiredChats: 'Hapus permanen chat yang expired',
  autoEndExpiredPageAuctions: 'Auto-end page auction yang sudah berakhir',
  cancelExpiredPendingOrders: 'Auto-cancel order payment overdue',
  notifyAuctionsEndingSoon: 'Kirim notifikasi auction ending soon',
  refreshCurrencyRates: 'Refresh kurs mata uang (08:00 & 20:00 WIB)',
}

function Badge({ active }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-700'
      }`}
    >
      {active ? 'Aktif' : 'Tidak aktif'}
    </span>
  )
}

function StatCard({ label, value, color = 'text-gray-900' }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
      <p className="text-xs text-gray-500 truncate">{label}</p>
      <p className={`text-xl font-bold mt-0.5 ${color}`}>{value}</p>
    </div>
  )
}

export default function AdminCronJobsPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [triggeringJob, setTriggeringJob] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const fetchJobs = useCallback(async ({ silent = false } = {}) => {
    try {
      if (!silent) setLoading(true)
      setRefreshing(silent)
      setError('')

      const res = await adminFetch('/api/admin/cron-jobs')
      const list = res?.data?.jobs || []
      setJobs(list)

      if (silent) {
        setInfo(`Status cron jobs diperbarui (${new Date().toLocaleTimeString('id-ID')}).`)
      }
    } catch (err) {
      setError(err.message || 'Gagal memuat status cron jobs')
      setJobs([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  const stats = useMemo(() => {
    const total = jobs.length
    const active = jobs.filter((j) => Boolean(j.isRunning)).length
    const inactive = total - active
    return { total, active, inactive }
  }, [jobs])

  const handleTrigger = async (jobName) => {
    try {
      const proceed = window.confirm(`Trigger job \"${jobName}\" sekarang?`)
      if (!proceed) return

      setTriggeringJob(jobName)
      setError('')
      setInfo('')

      const res = await adminFetch(`/api/admin/cron-jobs/${jobName}/trigger`, {
        method: 'POST',
      })

      setInfo(res?.message || `Job ${jobName} berhasil dijalankan`)
      await fetchJobs({ silent: true })
    } catch (err) {
      setError(err.message || `Gagal trigger job ${jobName}`)
    } finally {
      setTriggeringJob('')
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cron Jobs</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Monitor jadwal background job backend dan trigger manual untuk kebutuhan operasional.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchJobs({ silent: true })}
          disabled={loading || refreshing || !!triggeringJob}
          className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {refreshing ? 'Memperbarui...' : 'Refresh Status'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label="Total Job" value={stats.total} />
        <StatCard label="Job Aktif" value={stats.active} color="text-emerald-600" />
        <StatCard label="Job Tidak Aktif" value={stats.inactive} color="text-gray-600" />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        {error ? (
          <div className="px-5 py-3 bg-red-50 border-b border-red-100 text-sm text-red-700">{error}</div>
        ) : null}
        {info ? (
          <div className="px-5 py-3 bg-emerald-50 border-b border-emerald-100 text-sm text-emerald-700">
            {info}
          </div>
        ) : null}

        {loading ? (
          <div className="py-16 text-center text-gray-400 text-sm">Memuat cron jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            Tidak ada cron jobs yang terdaftar. Cek konfigurasi backend (ENABLE_CRON_JOBS).
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">Job Name</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">Deskripsi</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">Schedule</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">Status</th>
                  <th className="px-5 py-3 text-right font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jobs.map((job) => (
                  <tr key={job.name} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-900">{job.name}</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-700 max-w-[380px]">
                      {CRON_DESCRIPTION[job.name] || '—'}
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 font-mono text-xs">{job.schedule || '—'}</td>
                    <td className="px-5 py-3.5">
                      <Badge active={Boolean(job.isRunning)} />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleTrigger(job.name)}
                        disabled={!!triggeringJob}
                        className="px-3 py-1.5 rounded-lg bg-[#008080] text-white text-xs font-semibold hover:bg-[#006666] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {triggeringJob === job.name ? 'Menjalankan...' : 'Trigger Sekarang'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
