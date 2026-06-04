'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { adminFetch } from '@/lib/adminApi'

const MAX_PRODUCTS = 4

function formatIdr(value) {
  if (value == null || Number.isNaN(Number(value))) return '—'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value))
}

function normalizeProduct(raw) {
  if (!raw) return null
  const id = (raw._id || raw.id)?.toString?.() || raw.id
  if (!id) return null

  const images = raw.images || []
  const thumbnailUrl =
    images.find((img) => img.isPrimary)?.url ||
    images[0]?.url ||
    raw.thumbnailUrl ||
    null

  return {
    id,
    name: raw.name || 'Produk tanpa nama',
    price: raw.price ?? null,
    status: raw.status || 'active',
    thumbnailUrl,
  }
}

async function fetchProductById(id) {
  const result = await adminFetch(`/api/products/${id}`)
  return normalizeProduct(result.data)
}

async function searchProducts(query) {
  const params = new URLSearchParams({
    page: '1',
    limit: '10',
    productStatus: 'active',
    search: query.trim(),
  })
  const result = await adminFetch(`/api/admin/products?${params}`)
  return (result.data?.products || [])
    .map(normalizeProduct)
    .filter(Boolean)
}

export default function HealingProductPicker({ value = [], onChange }) {
  const selectedIds = Array.isArray(value) ? value.map(String) : []
  const [selectedProducts, setSelectedProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [hydrating, setHydrating] = useState(false)
  const [searchError, setSearchError] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const containerRef = useRef(null)

  const syncSelectedProducts = useCallback(async (ids) => {
    if (!ids.length) {
      setSelectedProducts([])
      return
    }

    setHydrating(true)
    try {
      const settled = await Promise.allSettled(ids.map((id) => fetchProductById(id)))
      const resolved = settled.map((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          return result.value
        }
        return {
          id: ids[index],
          name: `Produk (${ids[index].slice(-6)})`,
          price: null,
          status: 'unknown',
          thumbnailUrl: null,
          unresolved: true,
        }
      })
      setSelectedProducts(resolved)
    } finally {
      setHydrating(false)
    }
  }, [])

  useEffect(() => {
    syncSelectedProducts(selectedIds)
  }, [selectedIds.join('|'), syncSelectedProducts])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setSearchError(null)
      return undefined
    }

    const timer = setTimeout(async () => {
      setSearching(true)
      setSearchError(null)
      try {
        const products = await searchProducts(searchQuery)
        setSearchResults(products)
        setShowResults(true)
      } catch (err) {
        setSearchResults([])
        setSearchError(err.message || 'Gagal mencari produk')
      } finally {
        setSearching(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleAdd(product) {
    if (selectedIds.includes(product.id)) return
    if (selectedIds.length >= MAX_PRODUCTS) return
    onChange?.([...selectedIds, product.id])
    setSearchQuery('')
    setSearchResults([])
    setShowResults(false)
  }

  function handleRemove(id) {
    onChange?.(selectedIds.filter((value) => value !== id))
  }

  const atLimit = selectedIds.length >= MAX_PRODUCTS

  return (
    <div className="space-y-3" ref={containerRef}>
      <div className="flex items-center justify-between gap-2">
        <label className="block text-xs font-medium text-gray-700">
          Produk Inspirasi Setup
        </label>
        <span className="text-xs text-gray-400">
          {selectedIds.length}/{MAX_PRODUCTS} dipilih
        </span>
      </div>

      {hydrating && selectedIds.length > 0 && selectedProducts.length === 0 ? (
        <p className="text-xs text-gray-400">Memuat produk terpilih...</p>
      ) : null}

      {selectedProducts.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {selectedProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-2 py-2 pr-2 max-w-full"
            >
              {product.thumbnailUrl ? (
                <img
                  src={product.thumbnailUrl}
                  alt={product.name}
                  className="w-10 h-10 rounded-lg object-cover shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-sm shrink-0">
                  📦
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                <p className="text-xs text-gray-500">
                  {formatIdr(product.price)}
                  {product.unresolved ? ' · ID legacy' : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(product.id)}
                className="shrink-0 w-7 h-7 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50"
                aria-label={`Hapus ${product.name}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-400">
          Belum ada produk terkait. Cari dan pilih maksimal {MAX_PRODUCTS} produk.
        </div>
      )}

      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          disabled={atLimit}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setShowResults(true)
          }}
          onFocus={() => {
            if (searchResults.length > 0) setShowResults(true)
          }}
          placeholder={atLimit ? 'Maksimal 4 produk sudah dipilih' : 'Cari produk berdasarkan nama...'}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]/30 disabled:bg-gray-100 disabled:text-gray-400"
        />

        {showResults && searchQuery.trim() && (
          <div className="absolute z-20 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg max-h-64 overflow-y-auto">
            {searching ? (
              <p className="px-4 py-3 text-sm text-gray-500">Mencari produk...</p>
            ) : searchError ? (
              <p className="px-4 py-3 text-sm text-red-600">{searchError}</p>
            ) : searchResults.length === 0 ? (
              <p className="px-4 py-3 text-sm text-gray-500">Produk tidak ditemukan.</p>
            ) : (
              searchResults.map((product) => {
                const isSelected = selectedIds.includes(product.id)
                return (
                  <button
                    key={product.id}
                    type="button"
                    disabled={isSelected || atLimit}
                    onClick={() => handleAdd(product)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed border-b border-gray-100 last:border-b-0"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-sm shrink-0">
                      📦
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">{formatIdr(product.price)}</p>
                    </div>
                    {isSelected ? (
                      <span className="text-xs text-[#008080] font-medium">Dipilih</span>
                    ) : null}
                  </button>
                )
              })
            )}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400">
        Produk aktif saja. ID disimpan otomatis ke <code className="font-mono">relatedProductIds</code>.
      </p>
    </div>
  )
}
