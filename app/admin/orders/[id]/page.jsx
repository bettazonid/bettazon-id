'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { adminFetch } from '@/lib/adminApi'
import Link from 'next/link'

export default function AdminOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (params?.id) {
      fetchOrder()
    }
  }, [params?.id])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await adminFetch(`/orders/${params.id}`)
      setOrder(data.data || data)
    } catch (err) {
      setError(err.message || 'Gagal memuat detail pesanan')
    } finally {
      setLoading(false)
    }
  }

  const statusColors = {
    pending_payment: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-blue-100 text-blue-800',
    preparing: 'bg-cyan-100 text-cyan-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    completed: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800',
    dispute: 'bg-orange-100 text-orange-800',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4 text-gray-600">Memuat detail pesanan...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <h1 className="text-lg font-bold text-red-900 mb-2">Error</h1>
        <p className="text-red-700 mb-4">{error}</p>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-[#008080] hover:text-[#006666] font-medium"
        >
          ← Kembali ke Daftar Pesanan
        </Link>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-gray-600">Pesanan tidak ditemukan</p>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-[#008080] hover:text-[#006666] font-medium mt-4"
        >
          ← Kembali ke Daftar Pesanan
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-[#008080] hover:text-[#006666] font-medium mb-4"
          >
            ← Kembali ke Daftar Pesanan
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Pesanan #{order.orderNumber || order._id?.slice(0, 8)}
          </h1>
          <p className="text-gray-600 mt-1">
            {new Date(order.createdAt).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-bold ${statusColors[order.status] || 'bg-gray-100'}`}>
          {order.status?.replace(/_/g, ' ').toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Item Pesanan</h2>
            <div className="space-y-4">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.productName || item.name}</p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity} × Rp {item.price?.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        Rp {(item.quantity * item.price)?.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">Tidak ada item</p>
              )}
            </div>
          </div>

          {/* Shipping Information */}
          {order.shippingAddress && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Alamat Pengiriman</h2>
              <div className="space-y-2 text-gray-900">
                <p className="font-medium">{order.shippingAddress.recipientName}</p>
                <p className="text-sm">{order.shippingAddress.phone}</p>
                <p className="text-sm">{order.shippingAddress.address}</p>
                <p className="text-sm">
                  {order.shippingAddress.district}, {order.shippingAddress.city}
                </p>
                <p className="text-sm">{order.shippingAddress.province} {order.shippingAddress.postalCode}</p>
              </div>
            </div>
          )}

          {/* Order Timeline */}
          {order.timeline && order.timeline.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Timeline Pesanan</h2>
              <div className="space-y-4">
                {order.timeline.map((event, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-[#008080] mt-2" />
                      {idx < order.timeline.length - 1 && (
                        <div className="w-0.5 h-12 bg-gray-200" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{event.status}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(event.timestamp).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      {event.note && (
                        <p className="text-sm text-gray-700 mt-1">{event.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Pembeli</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Nama</p>
                <p className="font-medium text-gray-900">{order.buyer?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900 break-all">{order.buyer?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nomor HP</p>
                <p className="font-medium text-gray-900">{order.buyer?.phone}</p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Ringkasan Pembayaran</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">
                  Rp {(order.subtotal || 0)?.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-2">
                <span className="text-gray-600">Ongkir</span>
                <span className="font-medium text-gray-900">
                  Rp {(order.shippingCost || 0)?.toLocaleString('id-ID')}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between border-t border-gray-100 pt-2">
                  <span className="text-gray-600">Diskon</span>
                  <span className="font-medium text-green-600">
                    -Rp {order.discount?.toLocaleString('id-ID')}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-100 pt-2">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-xl text-[#FE735C]">
                  Rp {(order.totalAmount || order.amount)?.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {order.status === 'pending_payment' && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Tindakan</h2>
              <button className="w-full px-4 py-2 rounded-lg bg-orange-50 text-orange-700 font-medium hover:bg-orange-100 transition-colors">
                Ingatkan Pembayaran
              </button>
            </div>
          )}

          {order.status === 'dispute' && (
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-6">
              <h2 className="text-lg font-bold text-orange-900 mb-4">⚠️ Ada Dispute</h2>
              <p className="text-sm text-orange-800">
                Pesanan ini memiliki dispute yang perlu ditinjau.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
