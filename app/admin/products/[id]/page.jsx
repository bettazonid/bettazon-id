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

          {/* Share Produk */}
          <ShareProductGuide product={product} />

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
// ─────────────────────────────────────────────────────────────────────────────
// Share Product Guide – collapsible tutorial card shown in the product sidebar
// ─────────────────────────────────────────────────────────────────────────────
function ShareProductGuide({ product }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!product?.slug) return null

  const productUrl = `https://bettazon.id/product/${product.slug}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(productUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = productUrl
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const waText    = encodeURIComponent(`${product.name}\nCek produk ini di Bettazon.id!\n${productUrl}`)
  const fbUrl     = encodeURIComponent(productUrl)
  const tweetText = encodeURIComponent(`${product.name}\n${productUrl}`)

  return (
    <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
      {/* Header */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex w-full items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🔗</span>
          <span className="font-semibold text-teal-800">Bagikan Produk</span>
        </div>
        <span className="text-teal-600 text-sm">{open ? '▲ Tutup' : '▼ Panduan'}</span>
      </button>

      {/* Copy URL */}
      <div className="mt-3 flex items-center gap-2">
        <input
          readOnly
          value={productUrl}
          className="flex-1 truncate rounded-md border border-teal-200 bg-white px-3 py-1.5 text-xs text-gray-700 focus:outline-none"
        />
        <button
          onClick={handleCopy}
          className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
            copied ? 'bg-green-500 text-white' : 'bg-teal-600 text-white hover:bg-teal-700'
          }`}
        >
          {copied ? '✓ Disalin!' : 'Salin'}
        </button>
      </div>

      {/* Quick share buttons */}
      <div className="mt-3 flex gap-2 flex-wrap">
        <a
          href={`https://api.whatsapp.com/send?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-md bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M11.5 0C5.149 0 0 5.149 0 11.5c0 2.027.535 3.929 1.47 5.574L0 23l6.127-1.448A11.451 11.451 0 0011.5 23C17.851 23 23 17.851 23 11.5S17.851 0 11.5 0zm0 21.087a9.574 9.574 0 01-4.91-1.351l-.352-.209-3.636.858.872-3.544-.228-.363A9.573 9.573 0 011.913 11.5C1.913 6.219 6.219 1.913 11.5 1.913c5.281 0 9.587 4.306 9.587 9.587 0 5.281-4.306 9.587-9.587 9.587z"/>
          </svg>
          WhatsApp
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${fbUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-md bg-[#1877F2] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Facebook
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${tweetText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-md bg-black px-3 py-1.5 text-xs font-semibold text-white hover:opacity-80 transition-opacity"
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.629 5.905-5.629zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          X (Twitter)
        </a>
      </div>

      {/* Collapsible tutorial */}
      {open && (
        <div className="mt-4 space-y-3 border-t border-teal-200 pt-4">
          <p className="text-xs font-semibold text-teal-800 uppercase tracking-wide">Panduan Share per Platform</p>

          <div className="rounded-lg bg-white border border-teal-100 p-3">
            <p className="font-semibold text-sm text-[#25D366] mb-1.5">💬 WhatsApp</p>
            <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
              <li>Klik <strong>Salin</strong> di atas, lalu tempel link di chat WhatsApp.</li>
              <li>Atau klik tombol <strong>WhatsApp</strong> — teks & link produk langsung terisi.</li>
              <li className="text-teal-700 font-medium">💡 Share dengan gambar: gunakan tombol <em>Bagikan</em> di halaman detail produk di aplikasi Bettazon mobile → pilih WhatsApp. Gambar produk otomatis ikut tershare.</li>
            </ol>
          </div>

          <div className="rounded-lg bg-white border border-teal-100 p-3">
            <p className="font-semibold text-sm text-[#1877F2] mb-1.5">📘 Facebook</p>
            <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
              <li>Klik tombol <strong>Facebook</strong> di atas — dialog share Facebook terbuka dengan preview produk otomatis.</li>
              <li>Tambahkan keterangan jika perlu, lalu klik <strong>Bagikan</strong>.</li>
              <li className="text-teal-700 font-medium">💡 Agar gambar & judul muncul di preview Facebook, pastikan status produk <em>active</em>. Share dari aplikasi mobile Bettazon juga bisa menyertakan gambar langsung.</li>
            </ol>
          </div>

          <div className="rounded-lg bg-white border border-teal-100 p-3">
            <p className="font-semibold text-sm mb-1.5">🐦 X (Twitter)</p>
            <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
              <li>Klik tombol <strong>X (Twitter)</strong> — halaman compose tweet terbuka dengan teks & link sudah terisi.</li>
              <li>Edit sesuka hati lalu klik <strong>Post</strong>.</li>
              <li className="text-teal-700 font-medium">💡 Untuk melampirkan gambar produk, gunakan fitur Share di aplikasi Bettazon mobile.</li>
            </ol>
          </div>

          <div className="rounded-lg bg-white border border-teal-100 p-3">
            <p className="font-semibold text-sm mb-1.5">🔗 Link Langsung</p>
            <p className="text-xs text-gray-600">
              Salin link dan tempel di mana saja: email, bio Instagram, TikTok, marketplace lain, dll.
              Link langsung membuka halaman produk di web dan menawarkan buka di aplikasi Bettazon.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}