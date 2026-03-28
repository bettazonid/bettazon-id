'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { adminFetch } from '@/lib/adminApi'
import Link from 'next/link'

const STATUS_META = {
  pending:         { label: 'Menunggu Pembayaran', color: 'bg-yellow-100 text-yellow-800' },
  payment_pending: { label: 'Konfirmasi Pembayaran', color: 'bg-amber-100 text-amber-800' },
  paid:            { label: 'Dibayar', color: 'bg-blue-100 text-blue-800' },
  processing:      { label: 'Diproses', color: 'bg-cyan-100 text-cyan-800' },
  shipped:         { label: 'Dikirim', color: 'bg-purple-100 text-purple-800' },
  delivered:       { label: 'Diterima', color: 'bg-indigo-100 text-indigo-800' },
  completed:       { label: 'Selesai', color: 'bg-emerald-100 text-emerald-800' },
  cancelled:       { label: 'Dibatalkan', color: 'bg-red-100 text-red-800' },
  disputed:        { label: 'Dispute', color: 'bg-orange-100 text-orange-800' },
  refunded:        { label: 'Refund', color: 'bg-gray-200 text-gray-700' },
}

const ORDER_TYPE_LABEL = {
  direct_buy:    'Beli Langsung',
  auction_win:   'Lelang',
  live_purchase: 'Live Purchase',
}

const CANCEL_REASON_LABEL = {
  seller_request:    'Permintaan Penjual',
  buyer_request:     'Permintaan Pembeli',
  no_collector:      'Tidak Ada Kurir',
  quality_issue:     'Masalah Kualitas',
  timeout:           'Timeout',
  other:             'Lainnya (CS)',
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || { label: status?.replace(/_/g, ' ') || '—', color: 'bg-gray-100 text-gray-700' }
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${meta.color}`}>
      {meta.label}
    </span>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500 shrink-0">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right break-all">{value || '—'}</span>
    </div>
  )
}

export default function AdminOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionMsg, setActionMsg] = useState(null)
  const [cancelReason, setCancelReason] = useState('')
  const [cancelNotes, setCancelNotes] = useState('')
  const [showCancelForm, setShowCancelForm] = useState(false)

  const fetchOrder = useCallback(async () => {
    if (!params?.id) return
    try {
      setLoading(true)
      setError(null)
      const data = await adminFetch(`/api/orders/${params.id}`)
      setOrder(data.data?.order || data.data || null)
    } catch (err) {
      setError(err.message || 'Gagal memuat detail pesanan')
    } finally {
      setLoading(false)
    }
  }, [params?.id])

  useEffect(() => { fetchOrder() }, [fetchOrder])

  const CS_CANCEL_REASONS = [
    { value: 'cs_cancelled',       label: 'Dibatalkan oleh CS' },
    { value: 'collector_failed',   label: 'Kurir gagal pickup' },
    { value: 'pickup_timeout',     label: 'Timeout pickup' },
    { value: 'customer_complaint', label: 'Komplain pembeli' },
    { value: 'other',              label: 'Lainnya' },
  ]

  const handleCancelByCS = async () => {
    if (!cancelReason) {
      setActionMsg({ type: 'error', text: 'Alasan pembatalan wajib dipilih' })
      return
    }
    try {
      setActionLoading(true)
      setActionMsg(null)
      await adminFetch(`/api/orders/${params.id}/cancel-by-cs`, {
        method: 'PATCH',
        body: JSON.stringify({
          reason: cancelReason,
          csNotes: cancelNotes.trim() || undefined,
        }),
      })
      setActionMsg({ type: 'success', text: 'Pesanan berhasil dibatalkan oleh CS' })
      setShowCancelForm(false)
      setCancelReason('')
      setCancelNotes('')
      fetchOrder()
    } catch (err) {
      setActionMsg({ type: 'error', text: err.message || 'Gagal membatalkan pesanan' })
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-400 text-sm">Memuat detail pesanan...</div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="font-semibold text-red-900 mb-1">Error</p>
        <p className="text-red-700 text-sm mb-4">{error}</p>
        <Link href="/admin/orders" className="text-[#008080] hover:text-[#006666] text-sm font-medium">
          ← Kembali ke Daftar Pesanan
        </Link>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
        Pesanan tidak ditemukan.{' '}
        <Link href="/admin/orders" className="text-[#008080] hover:text-[#006666] font-medium">
          Kembali
        </Link>
      </div>
    )
  }

  const totalAmount = order.payment?.totalAmount || order.pricing?.totalAmount || 0
  const canCancelByCS = !['completed', 'cancelled', 'refunded'].includes(order.status)

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Back + Header */}
      <div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1 text-sm text-[#008080] hover:text-[#006666] font-medium mb-3"
        >
          ← Kembali ke Pesanan
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900 font-mono">
              {order.orderNumber || `#${order._id?.slice(-8)}`}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {new Date(order.createdAt).toLocaleDateString('id-ID', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={order.status} />
            <span className="text-xs text-gray-400 border border-gray-200 rounded-full px-2 py-0.5">
              {ORDER_TYPE_LABEL[order.orderType] || order.orderType || '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Action message */}
      {actionMsg && (
        <div className={`rounded-xl px-4 py-3 text-sm font-medium ${
          actionMsg.type === 'success'
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {actionMsg.text}
        </div>
      )}

      {/* Cancellation details — shown only when cancelled */}
      {order.status === 'cancelled' && order.cancellation?.reason && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <h2 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
            <span>🚫</span> Detail Pembatalan
          </h2>
          <div className="space-y-1">
            <InfoRow
              label="Alasan"
              value={CANCEL_REASON_LABEL[order.cancellation.reason] || order.cancellation.reason}
            />
            {order.cancellation.description && (
              <InfoRow label="Catatan" value={order.cancellation.description} />
            )}
            {order.sla?.csNotes && order.sla.csNotes !== order.cancellation.description && (
              <InfoRow label="Catatan CS" value={order.sla.csNotes} />
            )}
            <InfoRow
              label="Dibatalkan oleh"
              value={order.cancellation.cancelledBy?.name || 'CS / Admin'}
            />
            {order.cancellation.cancelledAt && (
              <InfoRow
                label="Waktu Batal"
                value={new Date(order.cancellation.cancelledAt).toLocaleDateString('id-ID', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              />
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left / Main */}
        <div className="lg:col-span-2 space-y-5">
          {/* Product / Items */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="font-semibold text-gray-900 mb-3">Item Pesanan</h2>
            {order.items && order.items.length > 0 ? (
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">
                        {item.product?.name || item.product?.title || `Item ${idx + 1}`}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Qty: {item.quantity?.weight || item.quantity || 1}
                        {' '}&times;{' '}
                        Rp {(item.pricing?.pricePerUnit || item.price || 0).toLocaleString('id-ID')}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                      Rp {(item.pricing?.estimatedTotal || (item.quantity * item.price) || 0).toLocaleString('id-ID')}
                    </p>
                  </div>
                ))}
              </div>
            ) : order.product ? (
              <div className="flex gap-4">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{order.product?.name || order.product?.title || '—'}</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Rp {(order.payment?.productPrice || order.pricing?.totalAmount || 0).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Tidak ada item</p>
            )}
          </div>

          {/* Shipping address */}
          {order.shippingAddress && (
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="font-semibold text-gray-900 mb-3">Alamat Pengiriman</h2>
              <div className="text-sm text-gray-700 space-y-0.5">
                <p className="font-semibold">{order.shippingAddress.recipientName}</p>
                <p>{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {[order.shippingAddress.district, order.shippingAddress.city, order.shippingAddress.province]
                    .filter(Boolean).join(', ')}
                  {order.shippingAddress.postalCode ? ` ${order.shippingAddress.postalCode}` : ''}
                </p>
              </div>
            </div>
          )}

          {/* Shipping/tracking info */}
          {(order.shipping?.trackingNumber || order.trackingNumber) && (
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="font-semibold text-gray-900 mb-3">Info Pengiriman</h2>
              <div className="space-y-1">
                <InfoRow label="Kurir" value={order.shipping?.courier || order.payment?.courierName} />
                <InfoRow label="No. Resi" value={order.shipping?.trackingNumber || order.trackingNumber} />
                <InfoRow label="Tanggal Kirim" value={order.shippedAt ? new Date(order.shippedAt).toLocaleDateString('id-ID') : null} />
              </div>
            </div>
          )}

          {/* Timeline */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Riwayat Status</h2>
              <ol className="relative border-l border-gray-200 ml-2 space-y-4">
                {order.statusHistory.map((ev, idx) => (
                  <li key={idx} className="ml-4">
                    <div className="absolute -left-1.5 w-3 h-3 rounded-full bg-[#008080] border-2 border-white" />
                    <p className="text-sm font-medium text-gray-900">
                      {STATUS_META[ev.status]?.label || ev.status?.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(ev.changedAt || ev.timestamp).toLocaleDateString('id-ID', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                    {ev.note && <p className="text-xs text-gray-600 mt-0.5">{ev.note}</p>}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Right / Sidebar */}
        <div className="space-y-5">
          {/* Buyer */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="font-semibold text-gray-900 mb-3">Pembeli</h2>
            <div className="space-y-1">
              <InfoRow label="Nama" value={order.buyer?.name} />
              <InfoRow label="Email" value={order.buyer?.email} />
              <InfoRow label="HP" value={order.buyer?.phone} />
            </div>
          </div>

          {/* Seller */}
          {order.seller && (
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="font-semibold text-gray-900 mb-3">Penjual</h2>
              <div className="space-y-1">
                <InfoRow
                  label="Nama/Toko"
                  value={order.seller?.sellerData?.storeName || order.seller?.name}
                />
                <InfoRow label="Email" value={order.seller?.email} />
                <InfoRow label="HP" value={order.seller?.phone} />
              </div>
            </div>
          )}

          {/* Payment summary */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="font-semibold text-gray-900 mb-3">Ringkasan Pembayaran</h2>
            <div className="space-y-1">
              <InfoRow
                label="Harga Produk"
                value={`Rp ${(order.payment?.productPrice || 0).toLocaleString('id-ID')}`}
              />
              <InfoRow
                label="Platform Fee"
                value={`Rp ${(order.payment?.platformFee || 0).toLocaleString('id-ID')}`}
              />
              <InfoRow
                label="Ongkir"
                value={`Rp ${(order.payment?.shippingCost || 0).toLocaleString('id-ID')}`}
              />
              <InfoRow
                label="Metode"
                value={order.payment?.paymentMethod?.replace(/_/g, ' ')?.toUpperCase() || '—'}
              />
              <InfoRow
                label="Status Bayar"
                value={order.payment?.paymentStatus?.replace(/_/g, ' ') || '—'}
              />
              <div className="flex justify-between pt-2 border-t border-gray-100 mt-1">
                <span className="text-sm font-semibold text-gray-900">Total</span>
                <span className="text-base font-bold text-[#FE735C]">
                  Rp {totalAmount.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Admin actions */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="font-semibold text-gray-900 mb-3">Aksi Admin</h2>
            <div className="space-y-3">
              {canCancelByCS ? (
                showCancelForm ? (
                  <div className="space-y-2">
                    <select
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
                    >
                      <option value="">-- Pilih alasan --</option>
                      {CS_CANCEL_REASONS.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                    <textarea
                      value={cancelNotes}
                      onChange={(e) => setCancelNotes(e.target.value)}
                      rows={2}
                      placeholder="Catatan tambahan (opsional)..."
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancelByCS}
                        disabled={actionLoading || !cancelReason}
                        className="flex-1 px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {actionLoading ? 'Membatalkan...' : 'Konfirmasi Batal'}
                      </button>
                      <button
                        onClick={() => { setShowCancelForm(false); setCancelReason(''); setCancelNotes('') }}
                        className="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm hover:bg-gray-50 transition-colors"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowCancelForm(true)}
                    className="w-full px-4 py-2 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm font-medium hover:bg-red-100 transition-colors"
                  >
                    Batalkan Pesanan (CS)
                  </button>
                )
              ) : (
                <p className="text-xs text-gray-400 text-center py-1">
                  Tidak ada aksi tersedia untuk status ini
                </p>
              )}

              {order.status === 'disputed' && (
                <div className="rounded-lg bg-orange-50 border border-orange-200 p-3">
                  <p className="text-xs font-semibold text-orange-800 mb-1">⚠️ Pesanan Dispute</p>
                  <p className="text-xs text-orange-700">
                    Pesanan ini dalam status dispute. Tinjau detail dan ambil tindakan yang diperlukan.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
