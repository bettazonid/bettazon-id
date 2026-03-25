'use client'

import { useState, useEffect } from 'react'
import { adminFetch } from '@/lib/adminApi'
import Link from 'next/link'

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [feeStatus, setFeeStatus] = useState('')
  const [productStatus, setProductStatus] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [sellerInput, setSellerInput] = useState('')
  const [search, setSearch] = useState('')
  const [seller, setSeller] = useState('')
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [page, feeStatus, productStatus, search, seller])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page,
        limit: 20,
        ...(feeStatus && { feeStatus }),
        ...(productStatus && { productStatus }),
        ...(search && { search }),
        ...(seller && { seller }),
      })

      const response = await adminFetch(`/admin/products?${params}`)
      setProducts(response.data.products || [])
      setTotalPages(response.data.pagination?.totalPages || 1)
    } catch (err) {
      setError(err.message || 'Gagal memuat produk')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await adminFetch('/admin/products/statistics')
      setStats(response.data || {})
    } catch (err) {
      console.error('Gagal memuat statistik:', err)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const handleStatusChange = () => {
    setPage(1)
  }

  const applySearchFilters = () => {
    setPage(1)
    setSearch(searchInput.trim())
    setSeller(sellerInput.trim())
  }

  const resetSearchFilters = () => {
    setSearchInput('')
    setSellerInput('')
    setSearch('')
    setSeller('')
    setPage(1)
  }

  const feeStatusColor = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
  }

  const productStatusColor = {
    draft: 'bg-gray-100 text-gray-800',
    active: 'bg-blue-100 text-blue-800',
    sold: 'bg-purple-100 text-purple-800',
    expired: 'bg-orange-100 text-orange-800',
    deleted: 'bg-red-100 text-red-800',
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Produk', value: stats.totalProducts || 0 },
            { label: 'Aktif', value: stats.activeProducts || 0 },
            { label: 'Terjual', value: stats.soldProducts || 0 },
            { label: 'Draft', value: stats.draftProducts || 0 },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cari Produk
            </label>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applySearchFilters()}
              placeholder="Nama, deskripsi, spesies..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#008080]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter Penjual
            </label>
            <input
              type="text"
              value={sellerInput}
              onChange={(e) => setSellerInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applySearchFilters()}
              placeholder="Nama, email, atau nomor HP"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#008080]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Fee
            </label>
            <select
              value={feeStatus}
              onChange={(e) => {
                setFeeStatus(e.target.value)
                handleStatusChange()
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#008080]"
            >
              <option value="">Semua Status Fee</option>
              <option value="pending">Menunggu</option>
              <option value="paid">Dibayar</option>
              <option value="failed">Gagal</option>
              <option value="refunded">Dikembalikan</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Produk
            </label>
            <select
              value={productStatus}
              onChange={(e) => {
                setProductStatus(e.target.value)
                handleStatusChange()
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#008080]"
            >
              <option value="">Semua Status Produk</option>
              <option value="draft">Draft</option>
              <option value="active">Aktif</option>
              <option value="sold">Terjual</option>
              <option value="expired">Kadaluarsa</option>
              <option value="deleted">Dihapus</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={applySearchFilters}
            className="px-4 py-2 rounded-lg bg-[#008080] text-white font-medium hover:bg-[#006666] transition-colors"
          >
            Cari
          </button>
          <button
            onClick={resetSearchFilters}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
        {error && (
          <div className="p-4 bg-red-50 text-red-700 border-b border-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Memuat produk...
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Tidak ada produk
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Nama Produk
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Penjual
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Harga
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status Produk
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status Fee
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Tindakan
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 max-w-xs truncate">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {product._id.slice(0, 8)}...
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {product.seller?.name || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {product.seller?.phone || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        Rp {product.price?.toLocaleString('id-ID') || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          productStatusColor[product.status] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          feeStatusColor[product.feeStatus] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {product.feeStatus || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/products/${product._id}`}
                        className="text-[#008080] hover:text-[#006666] font-medium text-sm"
                      >
                        Lihat
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && products.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
            <div className="text-sm text-gray-600">
              Halaman {page} dari {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
