const RAW_API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export const API_BASE = RAW_API_BASE.replace(/\/$/, '')

export function getAuthUser() {
  try {
    return JSON.parse(localStorage.getItem('moodmusic_user') || 'null')
  } catch {
    return null
  }
}

export function authHeaders(extra = {}) {
  const user = getAuthUser()
  return {
    ...extra,
    ...(user?.authToken ? { 'X-AUTH-TOKEN': user.authToken } : {})
  }
}

export function resolveMediaUrl(url) {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) return url
  if (url.startsWith('/')) return `${API_BASE}${url}`
  return `${API_BASE}/${url}`
}

export const resolveAudioUrl = resolveMediaUrl
export const resolveImageUrl = resolveMediaUrl

export async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: authHeaders(options.headers || {})
  })

  if (!response.ok) {
    let message = 'Anfrage fehlgeschlagen.'
    try {
      const data = await response.json()
      message = data.message || data.error || message
    } catch {
      try { message = await response.text() || message } catch {}
    }
    throw new Error(message)
  }

  if (response.status === 204) return null
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) return response.json()
  return response.text()
}
