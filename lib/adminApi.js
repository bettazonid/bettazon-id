const ADMIN_TOKEN_KEY = 'admin_token'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:5000'

/** Canonical healing upload paths — same namespace as /api/admin/storage/* */
export const ADMIN_HEALING_UPLOAD = {
  thumbnail: '/api/admin/healing/upload/thumbnail',
  video: '/api/admin/healing/upload/video',
}

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
    // Token expired or invalid → force re-login
    if (response.status === 401) {
      clearAdminAuth()
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login'
      }
    }
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

/**
 * Multipart upload with optional progress callback (0–1).
 * Mirrors music admin upload pattern — no Content-Type header (browser sets boundary).
 */
export function adminUpload(path, fieldName, file, { onProgress } = {}) {
  const token = getAdminToken()
  if (!token) return Promise.reject(new Error('Token admin tidak ditemukan'))

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const fd = new FormData()
    fd.append(fieldName, file)

    xhr.open('POST', buildUrl(path))
    xhr.setRequestHeader('Authorization', `Bearer ${token}`)

    if (onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) onProgress(event.loaded / event.total)
      }
    }

    xhr.onload = () => {
      let result = {}
      try {
        result = JSON.parse(xhr.responseText)
      } catch {
        reject(new Error('Upload gagal'))
        return
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(result)
        return
      }

      if (xhr.status === 401) {
        clearAdminAuth()
        if (typeof window !== 'undefined') window.location.href = '/admin/login'
      }

      const message =
        result?.message?.id ||
        result?.message?.en ||
        result?.error?.id ||
        result?.error?.en ||
        result?.message ||
        'Upload gagal'
      reject(new Error(typeof message === 'string' ? message : 'Upload gagal'))
    }

    xhr.onerror = () => reject(new Error('Upload gagal — periksa koneksi'))
    xhr.send(fd)
  })
}
