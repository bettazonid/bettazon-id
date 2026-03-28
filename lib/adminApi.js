const ADMIN_TOKEN_KEY = 'admin_token'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:5000'

function buildUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${normalizedPath}`
}

export function getAdminToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(ADMIN_TOKEN_KEY)
}

export function setAdminToken(token) {
  if (typeof window === 'undefined') return
  localStorage.setItem(ADMIN_TOKEN_KEY, token)
}

export function clearAdminAuth() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(ADMIN_TOKEN_KEY)
  localStorage.removeItem('admin_user')
}

export function getAdminUser() {
  if (typeof window === 'undefined') return null

  try {
    const value = localStorage.getItem('admin_user')
    return value ? JSON.parse(value) : null
  } catch {
    return null
  }
}

export async function adminLogin(payload) {
  const response = await fetch(buildUrl('/api/admin/auth/login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const result = await response.json()
  if (!response.ok) {
    const message =
      result?.message?.id ||
      result?.message?.en ||
      result?.error?.id ||
      result?.error?.en ||
      result?.message ||
      'Login admin gagal'
    throw new Error(message)
  }

  return result
}

export async function adminFetch(path, options = {}) {
  const token = getAdminToken()
  if (!token) throw new Error('Token admin tidak ditemukan')

  const response = await fetch(buildUrl(path), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  })

  const result = await response.json()
  if (!response.ok) {
    const message =
      result?.message?.id ||
      result?.message?.en ||
      result?.error?.id ||
      result?.error?.en ||
      result?.message ||
      'Request admin gagal'
    throw new Error(message)
  }

  return result
}

export async function adminDownload(path, options = {}) {
  const token = getAdminToken()
  if (!token) throw new Error('Token admin tidak ditemukan')

  const response = await fetch(buildUrl(path), {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  })

  if (!response.ok) {
    let message = 'Request admin gagal'
    try {
      const result = await response.json()
      message =
        result?.message?.id ||
        result?.message?.en ||
        result?.error?.id ||
        result?.error?.en ||
        result?.message ||
        message
    } catch {
      // ignore JSON parse error and keep default message
    }
    throw new Error(message)
  }

  return response
}
