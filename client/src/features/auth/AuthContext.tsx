import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { api } from '../../lib/api'

export interface AuthUser {
  _id: string
  name: string
  email: string
  role: 'owner' | 'staff'
}

interface LoginResponse {
  token: string
  user: AuthUser
}

interface AuthApi {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<AuthUser>
  logout: () => void
}

const TOKEN_KEY = 'grabzo_token'
const USER_KEY = 'grabzo_user'

const AuthCtx = createContext<AuthApi | null>(null)

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser)

  const value = useMemo<AuthApi>(
    () => ({
      user,
      async login(email, password) {
        const res = await api<LoginResponse>('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        })
        localStorage.setItem(TOKEN_KEY, res.token)
        localStorage.setItem(USER_KEY, JSON.stringify(res.user))
        setUser(res.user)
        return res.user
      },
      logout() {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        setUser(null)
      },
    }),
    [user],
  )

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthApi {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
