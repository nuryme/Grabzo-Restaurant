/**
 * Thin fetch wrapper. In dev, VITE_API_URL is unset so requests stay same-origin
 * and Vite proxies /api to the backend. In prod (client on Vercel, server on
 * Render), VITE_API_URL points at the Render URL.
 */

const API_BASE = import.meta.env.VITE_API_URL ?? ''

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

function authHeader(): Record<string, string> {
  const token = localStorage.getItem('grabzo_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
      ...options.headers,
    },
  })

  const body = await res.json().catch(() => null)
  if (!res.ok) {
    throw new ApiError(res.status, body?.message ?? `Request failed (${res.status})`)
  }
  return body as T
}
