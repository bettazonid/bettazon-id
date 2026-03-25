'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { adminFetch } from '@/lib/adminApi'
import Link from 'next/link'

export default function AdminProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [seller, setSeller] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState(null)

  useEffect(() => {
    if (params?.id) {
      fetchProduct()
    }
  }, [params?.id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      setError(null)

      // Use adminFetch to include auth token
      const data = await adminFetch(`/products/${params.id}`)
      setProduct(data.data || data)

      // Fetch seller info if available
      if (data.data?.seller || data.seller) {
        setSeller(data.data?.seller || data.seller)
      }
    } catch (err) {
      setError(err.message || 'Gagal memuat detail produk')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.')) {
      return
    }

    try {
      setActionLoading(true)
      setActionError(null)

      await adminFetch(`/admin/products/${params.id}`, {
        method: 'DELETE',
      })

      // Update local product state
      setProduct(prev => ({ ...prev, status: 'deleted' }))
      setActionError(null)
      alert('Produk berhasil dihapus')
    } catch (err) {
      setActionError(err.message || 'Gagal menghapus produk')
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdateStatus = async (newStatus) => {
    try {
      setActionLoading(true)
      setActionError(null)

      const data = await adminFetch(`/admin/products/${params.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      })

      setProduct(data.data || { ...product, status: newStatus })
      alert(`Status produk berhasil diubah menjadi ${newStatus}`)
    } catch (err) {
      setActionError(err.message || 'Gagal mengubah status produk')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4 text-gray-600">Memuat detail produk...</div>
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
          href="/admin/products"
          className="inline-flex items-center gap-2 text-[#008080] hover:text-[#006666] font-medium"
        >
          ← Kembali ke Daftar Produk
        </Link>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-gray-600">Produk tidak ditemukan</p>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-[#008080] hover:text-[#006666] font-medium mt-4"
        >
          ← Kembali ke Daftar Produk
        </Link>
      </div>
    )
  }

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    active: 'bg-blue-100 text-blue-800',
    sold: 'bg-purple-100 text-purple-800',
    expired: 'bg-orange-100 text-orange-800',
    deleted: 'bg-red-100 text-red-800',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 text-[#008080] hover:text-[#006666] font-medium mb-4"
          >
            ← Kembali ke Daftar Produk
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-gray-600 mt-1">ID: {product._id}</p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-bold ${statusColors[product.status] || 'bg-gray-100'}`}>
          {product.status?.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Images */}
          {product.images && product.images.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Gambar Produk</h2>
              <div className="grid grid-cols-2 gap-4">
                {product.images.slice(0, 4).map((image, idx) => {
                  // Handle both string and object image formats
                  const imageUrl = typeof image === 'string' ? image : image?.url
                  const imageCaption = typeof image === 'object' ? image?.caption : null

                  return (
                    <div
                      key={idx}
                      className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center relative group"
                    >
                      {imageUrl ? (
                        <>
                          <img
                            src={imageUrl}
                            alt={imageCaption || `Produk ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-image.png'
                              e.currentTarget.className = 'w-full h-full object-contain'
                            }}
                          />
                          {imageCaption && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {imageCaption}
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="text-gray-400 text-sm">Tidak ada gambar</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Deskripsi</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{product.description}</p>
            </div>
          )}

          {/* Details */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Detail Produk</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Kategori</span>
                <span className="font-medium text-gray-900">{product.category?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-3">
                <span className="text-gray-600">Jenis Lelang</span>
                <span className="font-medium text-gray-900">{product.auctionType || 'Beli Langsung'}</span>
              </div>
              {product.fishData && (
                <>
                  <div className="flex justify-between border-t border-gray-100 pt-3">
                    <span className="text-gray-600">Spesies</span>
                    <span className="font-medium text-gray-900">{product.fishData.species || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-3">
                    <span className="text-gray-600">Variant</span>
                    <span className="font-medium text-gray-900">{product.fishData.variant || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-3">
                    <span className="text-gray-600">Ukuran (cm)</span>
                    <span className="font-medium text-gray-900">
                      {product.fishData.sizeRange?.min && product.fishData.sizeRange?.max
                        ? `${product.fishData.sizeRange.min} - ${product.fishData.sizeRange.max}`
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-3">
                    <span className="text-gray-600">Umur (bulan)</span>
                    <span className="font-medium text-gray-900">{product.fishData.ageMonths || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-3">
                    <span className="text-gray-600">Gender</span>
                    <span className="font-medium text-gray-900">{product.fishData.gender || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-3">
                    <span className="text-gray-600">Status Kesehatan</span>
                    <span className="font-medium text-gray-900">{product.fishData.healthStatus || 'Sehat'}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-3">
                    <span className="text-gray-600">Asal Negara</span>
                    <span className="font-medium text-gray-900">{product.fishData.originCountry || 'Indonesia'}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Harga & Penjualan</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Harga</span>
                <span className="font-bold text-2xl text-[#FE735C]">
                  Rp {product.price?.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-3">
                <span className="text-gray-600">Stok</span>
                <span className="font-medium text-gray-900">{product.quantity || 0}</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-3">
                <span className="text-gray-600">Terjual</span>
                <span className="font-medium text-gray-900">{product.quantitySold || 0}</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-3">
                <span className="text-gray-600">Rating</span>
                <span className="font-medium text-gray-900">
                  {product.rating?.average?.toFixed(1) || 'Belum ada'} ⭐
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Penjual Info */}
          {seller && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Penjual</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Nama</p>
                  <p className="font-medium text-gray-900">{seller.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900 break-all">{seller.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nomor HP</p>
                  <p className="font-medium text-gray-900">{seller.phone}</p>
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-sm text-gray-600">Rating Penjual</p>
                  <p className="font-medium text-gray-900">
                    {seller.rating?.average?.toFixed(1) || 'Belum ada'} ⭐
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Fee Status */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Status Admin</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-2">Status Fee</p>
                <div className="inline-block px-3 py-1 rounded-full text-sm font-bold bg-yellow-100 text-yellow-800">
                  {product.feeStatus || 'pending'}
                </div>
              </div>
              <div className="border-t border-gray-100 pt-3">
                <p className="text-sm text-gray-600 mb-2">Tanggal Dibuat</p>
                <p className="font-medium text-gray-900">
                  {new Date(product.createdAt).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className="border-t border-gray-100 pt-3">
                <p className="text-sm text-gray-600 mb-2">Terakhir Diupdate</p>
                <p className="font-medium text-gray-900">
                  {new Date(product.updatedAt).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Tindakan</h2>
            {actionError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
                {actionError}
              </div>
            )}
            <div className="space-y-2">
              {product.status === 'active' && (
                <button
                  onClick={() => handleUpdateStatus('expired')}
                  disabled={actionLoading}
                  className="w-full px-4 py-2 rounded-lg bg-orange-50 text-orange-700 font-medium hover:bg-orange-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? 'Sedang diproses...' : 'Nonaktifkan Produk'}
                </button>
              )}
              {product.status !== 'deleted' && (
                <button
                  onClick={handleDeleteProduct}
                  disabled={actionLoading}
                  className="w-full px-4 py-2 rounded-lg bg-red-50 text-red-700 font-medium hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? 'Sedang diproses...' : 'Hapus Produk'}
                </button>
              )}
              {product.status === 'deleted' && (
                <div className="p-3 rounded-lg bg-gray-100 text-gray-700 text-center">
                  ✓ Produk sudah dihapus
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
